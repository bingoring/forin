package postgres

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/adapters/postgres/sqlc"
	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/domain/reputation"
	"github.com/bingoring/forin/server/internal/economy"
	"github.com/bingoring/forin/server/internal/ports"
)

// ProgressRepo implements ports.ProgressRepo and ports.ReviewRepo via sqlc.
type ProgressRepo struct {
	pool *pgxpool.Pool
	q    *sqlc.Queries
}

func NewProgressRepo(pool *pgxpool.Pool) *ProgressRepo {
	return &ProgressRepo{pool: pool, q: sqlc.New(pool)}
}

func defaults() *progress.Progress {
	d := economy.Active.ReputationDefault
	return &progress.Progress{Level: 1, Rank: "learner", PatientSatisfaction: d, PeerTrust: d, EmergencyResponse: d}
}

func (r *ProgressRepo) GetProgress(ctx context.Context, userID string) (*progress.Progress, error) {
	row, err := r.q.GetProgress(ctx, userID)
	if errors.Is(err, pgx.ErrNoRows) {
		return defaults(), nil // new user → defaults
	}
	if err != nil {
		return nil, err
	}
	return &progress.Progress{
		XP: row.Xp, Level: row.Level, Rank: row.Rank,
		PatientSatisfaction: row.PatientSatisfaction, PeerTrust: row.PeerTrust, EmergencyResponse: row.EmergencyResponse,
		StreakCurrent: row.StreakCurrent, StreakLongest: row.StreakLongest,
	}, nil
}

// GrowthStats aggregates scenario clears, new review cards, active conversation
// time, and distinct active dates for the growth report. Read-only aggregates run
// directly on the pool (outside the sqlc CRUD surface).
func (r *ProgressRepo) GrowthStats(ctx context.Context, userID string, dayStart, weekStart time.Time, tzName string) (*progress.GrowthStats, error) {
	s := &progress.GrowthStats{ActiveDates: []string{}}

	countScenarios := func(since time.Time) (int, error) {
		var n int
		err := r.pool.QueryRow(ctx,
			`SELECT count(*) FROM scenario_attempts
			 WHERE user_id = $1 AND state = 'cleared' AND COALESCE(cleared_at, started_at) >= $2`,
			userID, since).Scan(&n)
		return n, err
	}
	countCards := func(since time.Time) (int, error) {
		var n int
		err := r.pool.QueryRow(ctx,
			`SELECT count(*) FROM review_cards WHERE user_id = $1 AND created_at >= $2`,
			userID, since).Scan(&n)
		return n, err
	}
	// Active conversation time: per session, the span between its first and last
	// turn, clipped to the period so a session straddling the boundary (e.g. it
	// began before midnight) only contributes its in-period portion.
	convSeconds := func(since time.Time) (int, error) {
		var n int
		err := r.pool.QueryRow(ctx,
			`SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (t.mx - GREATEST(t.mn, $2)))), 0)::int
			 FROM (
			   SELECT session_id, MIN(created_at) AS mn, MAX(created_at) AS mx
			   FROM dialogue_turns GROUP BY session_id
			 ) t
			 JOIN conversation_sessions cs ON cs.id = t.session_id
			 WHERE cs.user_id = $1 AND t.mx >= $2`,
			userID, since).Scan(&n)
		return n, err
	}

	var err error
	if s.ScenariosToday, err = countScenarios(dayStart); err != nil {
		return nil, err
	}
	if s.ScenariosWeek, err = countScenarios(weekStart); err != nil {
		return nil, err
	}
	// Lifetime clears drive the praise-sticker collection (1 sticker per clear).
	if err = r.pool.QueryRow(ctx,
		`SELECT count(*) FROM scenario_attempts WHERE user_id = $1 AND state = 'cleared'`,
		userID).Scan(&s.ScenariosTotal); err != nil {
		return nil, err
	}
	if s.NewCardsToday, err = countCards(dayStart); err != nil {
		return nil, err
	}
	if s.NewCardsWeek, err = countCards(weekStart); err != nil {
		return nil, err
	}
	if s.ConversationSecondsToday, err = convSeconds(dayStart); err != nil {
		return nil, err
	}
	if s.ConversationSecondsWeek, err = convSeconds(weekStart); err != nil {
		return nil, err
	}

	// Distinct active dates this week, bucketed as calendar dates in the caller's
	// timezone — a scenario clear counts, and any dialogue turn counts.
	rows, err := r.pool.Query(ctx,
		`SELECT DISTINCT (d AT TIME ZONE $3)::date FROM (
		   SELECT COALESCE(cleared_at, started_at) AS d FROM scenario_attempts
		     WHERE user_id = $1 AND COALESCE(cleared_at, started_at) >= $2
		   UNION ALL
		   SELECT dt.created_at FROM dialogue_turns dt
		     JOIN conversation_sessions cs ON cs.id = dt.session_id
		     WHERE cs.user_id = $1 AND dt.created_at >= $2
		 ) x ORDER BY 1`,
		userID, weekStart, tzName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var d time.Time
		if err := rows.Scan(&d); err != nil {
			return nil, err
		}
		s.ActiveDates = append(s.ActiveDates, d.UTC().Format("2006-01-02"))
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return s, nil
}

// ClearedScenarioIDs returns the set of scenario ids the user has cleared.
func (r *ProgressRepo) ClearedScenarioIDs(ctx context.Context, userID string) (map[string]bool, error) {
	rows, err := r.pool.Query(ctx, `SELECT DISTINCT scenario_id FROM scenario_attempts WHERE user_id = $1 AND state = 'cleared'`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := map[string]bool{}
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		out[id] = true
	}
	return out, rows.Err()
}

// FoundMissions returns the ids of hidden missions the user has permanently discovered.
func (r *ProgressRepo) FoundMissions(ctx context.Context, userID string) ([]string, error) {
	ids, err := r.q.FoundMissions(ctx, userID)
	if err != nil {
		return nil, err
	}
	if ids == nil {
		ids = []string{}
	}
	return ids, nil
}

// RecordMission permanently records a hidden-mission discovery (idempotent).
func (r *ProgressRepo) RecordMission(ctx context.Context, userID, missionID string) error {
	return r.q.RecordMission(ctx, sqlc.RecordMissionParams{UserID: userID, MissionID: missionID})
}

func (r *ProgressRepo) RecordAttempt(ctx context.Context, userID, scenarioID string, score int, state string, grade int) (*progress.Progress, error) {
	if state == "" {
		state = "cleared"
	}
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)
	q := r.q.WithTx(tx)

	gradeCol := pgtype.Int4{} // NULL when grade < 0 (direct/legacy attempt)
	if grade >= 0 {
		gradeCol = pgtype.Int4{Int32: int32(grade), Valid: true}
	}
	if err := q.InsertAttempt(ctx, sqlc.InsertAttemptParams{UserID: userID, ScenarioID: scenarioID, State: state, Score: score, Grade: gradeCol}); err != nil {
		return nil, err
	}
	today := pgtype.Date{Time: time.Now().UTC(), Valid: true}
	if err := q.UpsertProgressOnAttempt(ctx, sqlc.UpsertProgressOnAttemptParams{UserID: userID, Xp: score, LastActiveDate: today}); err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return r.GetProgress(ctx, userID)
}

func (r *ProgressRepo) DueCards(ctx context.Context, userID string, today time.Time, limit int) ([]progress.ReviewCard, error) {
	rows, err := r.q.DueCards(ctx, sqlc.DueCardsParams{UserID: userID, DueDate: today, Limit: int32(limit)})
	if err != nil {
		return nil, err
	}
	out := make([]progress.ReviewCard, 0, len(rows))
	for _, d := range rows {
		card := progress.ReviewCard{
			ID: d.ID, Source: d.Source, Front: d.Front, Back: d.Back, Note: d.Note, TopicTag: d.TopicTag,
			MasteryPips: d.MasteryPips, Favorite: d.Favorite, ScenarioID: d.ScenarioID,
			Schedule: progress.Schedule{Ease: d.Ease, IntervalDays: d.IntervalDays, Reps: d.Reps, DueDate: d.DueDate},
		}
		if len(d.Context) > 0 && string(d.Context) != "{}" {
			var rc progress.ReviewContext
			if json.Unmarshal(d.Context, &rc) == nil {
				card.Context = &rc
			}
		}
		out = append(out, card)
	}
	return out, nil
}

func (r *ProgressRepo) GetCardForUser(ctx context.Context, userID, cardID string) (*progress.ReviewCard, error) {
	d, err := r.q.GetCardForUser(ctx, sqlc.GetCardForUserParams{UserID: userID, ID: cardID})
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &progress.ReviewCard{
		ID: d.ID, Source: d.Source, Front: d.Front, Back: d.Back, Note: d.Note, TopicTag: d.TopicTag,
		MasteryPips: d.MasteryPips, Favorite: d.Favorite,
		Schedule: progress.Schedule{Ease: d.Ease, IntervalDays: d.IntervalDays, Reps: d.Reps, DueDate: d.DueDate},
	}, nil
}

// CreateCard inserts a review card + its initial (due-today) schedule.
func (r *ProgressRepo) CreateCard(ctx context.Context, c ports.NewReviewCard) (string, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)
	q := r.q.WithTx(tx)

	ctxJSON, _ := json.Marshal(c.Context)
	id, err := q.InsertReviewCard(ctx, sqlc.InsertReviewCardParams{
		UserID: c.UserID, Source: c.Source, Front: c.Front, Back: c.Back, Note: c.Note, TopicTag: c.TopicTag,
		ScenarioID: c.ScenarioID, Context: ctxJSON})
	if err != nil {
		return "", err
	}
	if err := q.InsertCardSchedule(ctx, id); err != nil {
		return "", err
	}
	if err := tx.Commit(ctx); err != nil {
		return "", err
	}
	return id, nil
}

func (r *ProgressRepo) SaveSchedule(ctx context.Context, cardID string, s progress.Schedule, masteryPips int) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	q := r.q.WithTx(tx)

	if err := q.UpdateSchedule(ctx, sqlc.UpdateScheduleParams{
		CardID: cardID, Ease: s.Ease, IntervalDays: s.IntervalDays, Reps: s.Reps, DueDate: s.DueDate}); err != nil {
		return err
	}
	if err := q.UpdateCardMastery(ctx, sqlc.UpdateCardMasteryParams{ID: cardID, MasteryPips: masteryPips}); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

// repColumns maps a reputation dimension to its column. Keeping this the ONLY
// place that knows the storage layout means a later move to a per-profession
// key-value table changes this file and nothing else.
var repColumns = map[reputation.Dimension]string{
	reputation.DimPatientSatisfaction: "patient_satisfaction",
	reputation.DimPeerTrust:           "peer_trust",
	reputation.DimEmergencyResponse:   "emergency_response",
}

// ApplyReputation adds delta to one dimension, clamping to 0..100 in SQL so a
// concurrent clear can't race the read-modify-write past the bounds.
func (r *ProgressRepo) ApplyReputation(ctx context.Context, userID string, dim reputation.Dimension, delta int) error {
	col, ok := repColumns[dim]
	if !ok || delta == 0 {
		return nil // unknown dimension or nothing to do — not an error
	}
	_, err := r.pool.Exec(ctx,
		`UPDATE user_progress
		    SET `+col+` = LEAST(100, GREATEST(0, `+col+` + $2)), updated_at = now()
		  WHERE user_id = $1`,
		userID, delta)
	return err
}
