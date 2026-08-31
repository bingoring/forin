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

func (r *ProgressRepo) GetProgress(ctx context.Context, userID string) (*progress.Progress, error) {
	// The profession comes along for the ride: it decides WHICH standings exist,
	// and reading it here keeps that off the port signature.
	var p progress.Progress
	var job string
	err := r.pool.QueryRow(ctx,
		`SELECT up.xp, up.level, up.rank, up.streak_current, up.streak_longest, COALESCE(pf.job, '')
		   FROM user_progress up
		   LEFT JOIN profiles pf ON pf.user_id = up.user_id
		  WHERE up.user_id = $1`, userID).
		Scan(&p.XP, &p.Level, &p.Rank, &p.StreakCurrent, &p.StreakLongest, &job)
	if errors.Is(err, pgx.ErrNoRows) {
		p = progress.Progress{Level: 1, Rank: "learner"}
		_ = r.pool.QueryRow(ctx, `SELECT COALESCE(job, '') FROM profiles WHERE user_id = $1`, userID).Scan(&job)
	} else if err != nil {
		return nil, err
	}
	st, err := r.standings(ctx, userID, job)
	if err != nil {
		return nil, err
	}
	p.Reputation = st
	return &p, nil
}

// standings returns the profession's dimensions in display order, filling in the
// default for any the user has never moved. An unmodelled profession yields none
// rather than inventing axes (Build Spec R-8).
func (r *ProgressRepo) standings(ctx context.Context, userID, job string) ([]progress.Standing, error) {
	cat := reputation.CatalogFor(job)
	if !cat.Valid() {
		return []progress.Standing{}, nil
	}
	stored := map[reputation.Dimension]int{}
	rows, err := r.pool.Query(ctx, `SELECT dimension, value FROM user_reputation WHERE user_id = $1`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var d string
		var v int
		if err := rows.Scan(&d, &v); err != nil {
			return nil, err
		}
		stored[reputation.Dimension(d)] = v
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	out := make([]progress.Standing, 0, len(cat.Specs))
	for _, sp := range cat.Specs {
		v, ok := stored[sp.Key]
		if !ok {
			v = economy.Active.ReputationDefault
		}
		out = append(out, progress.Standing{Key: string(sp.Key), Label: sp.Label, Value: reputation.Clamp(v)})
	}
	return out, nil
}

// GrowthStats aggregates scenario clears, new review cards, active conversation
// time, and distinct active dates for the growth report. Read-only aggregates run
// directly on the pool (outside the sqlc CRUD surface).
func (r *ProgressRepo) GrowthStats(ctx context.Context, userID string, dayStart, weekStart time.Time, tzName string) (*progress.GrowthStats, error) {
	s := &progress.GrowthStats{ActiveDates: []string{}}
	// The strips are StreakWindowDays long and end today, so look back that far
	// from the start of today rather than from Monday.
	stripStart := dayStart.AddDate(0, 0, -(progress.StreakWindowDays - 1))

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

	// Distinct active dates over the STREAK WINDOW, not the calendar week: the
	// home/growth strips show a rolling window ending today, so a Monday-anchored
	// query would leave the first cells permanently blank. Bucketed as calendar
	// dates in the caller's timezone — a scenario clear counts, and any dialogue
	// turn counts. The weekly aggregates above still use weekStart; those really
	// are weekly.
	rows, err := r.pool.Query(ctx,
		`SELECT DISTINCT (d AT TIME ZONE $3)::date FROM (
		   SELECT COALESCE(cleared_at, started_at) AS d FROM scenario_attempts
		     WHERE user_id = $1 AND COALESCE(cleared_at, started_at) >= $2
		   UNION ALL
		   SELECT dt.created_at FROM dialogue_turns dt
		     JOIN conversation_sessions cs ON cs.id = dt.session_id
		     WHERE cs.user_id = $1 AND dt.created_at >= $2
		 ) x ORDER BY 1`,
		userID, stripStart, tzName)
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

// AttemptedScenarioIDs returns the ids played but never cleared.
//
// The NOT EXISTS is what keeps the two sets disjoint: a scenario you failed twice and
// then passed is cleared, full stop, and must not also report as attempted — the
// curriculum would then show "tried" on a step it has already ticked off.
func (r *ProgressRepo) AttemptedScenarioIDs(ctx context.Context, userID string) (map[string]bool, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT DISTINCT a.scenario_id FROM scenario_attempts a
		  WHERE a.user_id = $1 AND a.state = 'attempted'
		    AND NOT EXISTS (
		      SELECT 1 FROM scenario_attempts c
		       WHERE c.user_id = a.user_id AND c.scenario_id = a.scenario_id AND c.state = 'cleared')`,
		userID)
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

// CalendarEntries returns every attempt between two dates, with the local date and
// hour it started, for the calendar report.
//
// The date and hour are bucketed in SQL because only the database knows the timezone
// conversion; the BAND those hours mean is decided in the domain, where it is one
// testable rule rather than a string inside a query.
//
// Titles are joined here rather than fetched per row by the client: a month of activity
// is one request, and the alternative is a screen that fans out N lookups to render a
// list it already has the ids for.
func (r *ProgressRepo) CalendarEntries(
	ctx context.Context, userID string, from, to time.Time, tzName string,
) ([]progress.CalendarEntry, []string, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT (a.started_at AT TIME ZONE $4)::date::text AS d,
		        EXTRACT(HOUR FROM (a.started_at AT TIME ZONE $4))::int AS h,
		        a.scenario_id,
		        COALESCE(s.title, a.scenario_id) AS title,
		        (a.state = 'cleared') AS cleared
		   FROM scenario_attempts a
		   LEFT JOIN scenarios s ON s.id = a.scenario_id
		  WHERE a.user_id = $1 AND a.started_at >= $2 AND a.started_at < $3
		  ORDER BY a.started_at`,
		userID, from, to, tzName)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()

	var entries []progress.CalendarEntry
	var dates []string
	for rows.Next() {
		var e progress.CalendarEntry
		var d string
		if err := rows.Scan(&d, &e.Hour, &e.ScenarioID, &e.Title, &e.Cleared); err != nil {
			return nil, nil, err
		}
		entries = append(entries, e)
		dates = append(dates, d)
	}
	return entries, dates, rows.Err()
}

// LatestAttemptScenarioID returns the scenario the user started most recently.
//
// Ordered by started_at rather than cleared_at because an abandoned run is still
// where the learner was — that is the whole point of the home screen's continue
// card. No new table or column: scenario_attempts already records every start, and
// idx_attempts_user covers the lookup.
func (r *ProgressRepo) LatestAttemptScenarioID(ctx context.Context, userID string) (string, error) {
	var id string
	err := r.pool.QueryRow(ctx,
		`SELECT scenario_id FROM scenario_attempts WHERE user_id = $1 ORDER BY started_at DESC LIMIT 1`,
		userID).Scan(&id)
	if errors.Is(err, pgx.ErrNoRows) {
		return "", nil // never played — not an error, just no preference
	}
	if err != nil {
		return "", err
	}
	return id, nil
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

func (r *ProgressRepo) RecordAttempt(ctx context.Context, userID, scenarioID string, score int, state string, grade int, guide string) (*progress.Progress, error) {
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
	if err := q.InsertAttempt(ctx, sqlc.InsertAttemptParams{UserID: userID, ScenarioID: scenarioID, State: state, Score: score, Grade: gradeCol, Guide: guide}); err != nil {
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

// ApplyReputation adds delta to one dimension, clamping to 0..100 in SQL so two
// concurrent clears can't race the read-modify-write past the bounds. The row is
// created on first movement, seeded from the configured default.
func (r *ProgressRepo) ApplyReputation(ctx context.Context, userID string, dim reputation.Dimension, delta int) error {
	if dim == "" || delta == 0 {
		return nil
	}
	_, err := r.pool.Exec(ctx,
		`INSERT INTO user_reputation (user_id, dimension, value)
		 VALUES ($1, $2, LEAST(100, GREATEST(0, $3 + $4)))
		 ON CONFLICT (user_id, dimension) DO UPDATE
		   SET value = LEAST(100, GREATEST(0, user_reputation.value + $4)), updated_at = now()`,
		userID, string(dim), economy.Active.ReputationDefault, delta)
	return err
}

// ListModelAnswerScenarios returns one page of the scenarios the player has
// corrections for, plus the unpaged total.
//
// weakestFirst/needsWorkFirst are separate SQL statements rather than one with a
// computed ORDER BY: an ORDER BY built from a parameter cannot use an index and
// sqlc cannot type-check it.
func (r *ProgressRepo) ListModelAnswerScenarios(ctx context.Context, userID string, needsWorkFirst bool, limit, offset int) ([]progress.ModelAnswerGroup, int, error) {
	type raw struct {
		scenarioID, title string
		corrections       int
		lastAt            time.Time
		total             int
	}
	var rows []raw
	if needsWorkFirst {
		got, err := r.q.ListModelAnswerScenariosNeedsWork(ctx, sqlc.ListModelAnswerScenariosNeedsWorkParams{
			UserID: userID, Limit: int32(limit), Offset: int32(offset),
		})
		if err != nil {
			return nil, 0, err
		}
		for _, d := range got {
			rows = append(rows, raw{d.ScenarioID, d.Title, d.Corrections, d.LastAt.Time, int(d.Total)})
		}
	} else {
		got, err := r.q.ListModelAnswerScenariosRecent(ctx, sqlc.ListModelAnswerScenariosRecentParams{
			UserID: userID, Limit: int32(limit), Offset: int32(offset),
		})
		if err != nil {
			return nil, 0, err
		}
		for _, d := range got {
			rows = append(rows, raw{d.ScenarioID, d.Title, d.Corrections, d.LastAt.Time, int(d.Total)})
		}
	}

	// total rides on every row, so an empty page (offset past the end) reports 0.
	// The caller already holds the real total from the first page.
	total := 0
	out := make([]progress.ModelAnswerGroup, 0, len(rows))
	for _, d := range rows {
		total = d.total
		out = append(out, progress.ModelAnswerGroup{
			ScenarioID: d.scenarioID, Title: d.title, Corrections: d.corrections, LastAt: d.lastAt,
		})
	}
	return out, total, nil
}

// ListModelAnswerCards fetches the corrections for a whole page of scenarios in
// one query, keyed by scenario id.
func (r *ProgressRepo) ListModelAnswerCards(ctx context.Context, userID string, scenarioIDs []string) (map[string][]progress.ModelAnswerCard, error) {
	if len(scenarioIDs) == 0 {
		// = ANY('{}') is a valid but pointless round trip.
		return map[string][]progress.ModelAnswerCard{}, nil
	}
	rows, err := r.q.ListModelAnswerCards(ctx, sqlc.ListModelAnswerCardsParams{
		UserID: userID, ScenarioIds: scenarioIDs,
	})
	if err != nil {
		return nil, err
	}
	out := make(map[string][]progress.ModelAnswerCard, len(scenarioIDs))
	for _, d := range rows {
		out[d.ScenarioID] = append(out[d.ScenarioID], progress.ModelAnswerCard{
			Said: d.Front, Model: d.Back, Note: d.Note, CreatedAt: d.CreatedAt.Time,
		})
	}
	return out, nil
}

// TodaysPage returns today's 오늘의 호출, issuing it on the first look of the day.
func (r *ProgressRepo) TodaysPage(ctx context.Context, userID, localDate, scenarioID string) (*progress.DailyPage, error) {
	if scenarioID == "" {
		// Nothing to point the call at. Read-only then: an existing call still shows,
		// but a missing one is not invented with an empty target.
		row, err := r.q.GetDailyPage(ctx, sqlc.GetDailyPageParams{UserID: userID, LocalDate: localDate})
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		if err != nil {
			return nil, err
		}
		return pageFrom(row.ScenarioID, row.IssuedAt, row.AcceptedAt, row.AnsweredAt), nil
	}
	row, err := r.q.InsertDailyPage(ctx, sqlc.InsertDailyPageParams{
		UserID: userID, LocalDate: localDate, ScenarioID: scenarioID})
	if err != nil {
		return nil, err
	}
	return pageFrom(row.ScenarioID, row.IssuedAt, row.AcceptedAt, row.AnsweredAt), nil
}

func pageFrom(scenarioID string, issued, accepted, answered pgtype.Timestamptz) *progress.DailyPage {
	p := &progress.DailyPage{ScenarioID: scenarioID, IssuedAt: issued.Time}
	if accepted.Valid {
		at := accepted.Time
		p.AcceptedAt = &at
	}
	if answered.Valid {
		at := answered.Time
		p.AnsweredAt = &at
	}
	return p
}

// AcceptPage records that the learner took the call, and returns what it points at.
// Idempotent: the first acceptance's timestamp is kept, because "did they actually go?"
// is measured from it.
func (r *ProgressRepo) AcceptPage(ctx context.Context, userID, localDate string) (string, error) {
	row, err := r.q.AcceptDailyPage(ctx, sqlc.AcceptDailyPageParams{UserID: userID, LocalDate: localDate})
	if errors.Is(err, pgx.ErrNoRows) {
		return "", nil
	}
	if err != nil {
		return "", err
	}
	return row.ScenarioID, nil
}

// CompletePageIfAttempted pays the call off once the learner has actually started the
// scenario it points at. Reports whether THIS call did it — false means either they have
// not gone yet or it was already paid, and the caller must not grant the bonus again.
func (r *ProgressRepo) CompletePageIfAttempted(ctx context.Context, userID, localDate string) (bool, error) {
	_, err := r.q.CompleteDailyPageIfAttempted(ctx, sqlc.CompleteDailyPageIfAttemptedParams{UserID: userID, LocalDate: localDate})
	if errors.Is(err, pgx.ErrNoRows) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

// AddBonusXP grants XP with no attempt attached.
func (r *ProgressRepo) AddBonusXP(ctx context.Context, userID string, xp int) error {
	_, err := r.q.AddBonusXP(ctx, sqlc.AddBonusXPParams{UserID: userID, Xp: xp})
	if errors.Is(err, pgx.ErrNoRows) {
		return nil // no progress row yet: nothing earned, nothing to add to
	}
	return err
}

// ClearedByGuide splits the learner's clears by how much help they had.
func (r *ProgressRepo) ClearedByGuide(ctx context.Context, userID string) (guided, free map[string]bool, err error) {
	rows, err := r.q.ClearedPassGuides(ctx, userID)
	if err != nil {
		return nil, nil, err
	}
	guided, free = map[string]bool{}, map[string]bool{}
	for _, row := range rows {
		if row.Guide == "choices" {
			guided[row.ScenarioID] = true
		} else {
			free[row.ScenarioID] = true
		}
	}
	return guided, free, nil
}
