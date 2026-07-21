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
	return &progress.Progress{Level: 1, Rank: "learner", PatientSatisfaction: 50, PeerTrust: 50, EmergencyResponse: 50}
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

func (r *ProgressRepo) RecordAttempt(ctx context.Context, userID, scenarioID string, score int) (*progress.Progress, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)
	q := r.q.WithTx(tx)

	if err := q.InsertAttempt(ctx, sqlc.InsertAttemptParams{UserID: userID, ScenarioID: scenarioID, Score: score}); err != nil {
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
