package postgres

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/domain/progress"
)

// ProgressRepo implements ports.ProgressRepo and ports.ReviewRepo (pgx).
type ProgressRepo struct{ pool *pgxpool.Pool }

func NewProgressRepo(pool *pgxpool.Pool) *ProgressRepo { return &ProgressRepo{pool: pool} }

func defaults() *progress.Progress {
	return &progress.Progress{Level: 1, Rank: "learner",
		PatientSatisfaction: 50, PeerTrust: 50, EmergencyResponse: 50}
}

func (r *ProgressRepo) GetProgress(ctx context.Context, userID string) (*progress.Progress, error) {
	p := defaults()
	err := r.pool.QueryRow(ctx,
		`SELECT xp,level,rank,patient_satisfaction,peer_trust,emergency_response,streak_current,streak_longest
		 FROM user_progress WHERE user_id=$1`, userID).
		Scan(&p.XP, &p.Level, &p.Rank, &p.PatientSatisfaction, &p.PeerTrust, &p.EmergencyResponse,
			&p.StreakCurrent, &p.StreakLongest)
	if errors.Is(err, pgx.ErrNoRows) {
		return p, nil // new user → defaults
	}
	if err != nil {
		return nil, err
	}
	return p, nil
}

// RecordAttempt logs the clear, awards XP (= score), advances level + streak.
func (r *ProgressRepo) RecordAttempt(ctx context.Context, userID, scenarioID string, score int) (*progress.Progress, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	if _, err := tx.Exec(ctx,
		`INSERT INTO scenario_attempts (user_id, scenario_id, state, score, cleared_at)
		 VALUES ($1,$2,'cleared',$3, now())`, userID, scenarioID, score); err != nil {
		return nil, err
	}

	// Upsert progress: add XP, recompute level (100 XP/level), advance streak by date.
	today := time.Now().UTC()
	if _, err := tx.Exec(ctx,
		`INSERT INTO user_progress (user_id, xp, level, streak_current, streak_longest, last_active_date)
		   VALUES ($1, $2, 1 + ($2/100), 1, 1, $3)
		 ON CONFLICT (user_id) DO UPDATE SET
		   xp    = user_progress.xp + $2,
		   level = 1 + ((user_progress.xp + $2)/100),
		   streak_current = CASE
		     WHEN user_progress.last_active_date = $3 THEN user_progress.streak_current
		     WHEN user_progress.last_active_date = $3 - 1 THEN user_progress.streak_current + 1
		     ELSE 1 END,
		   streak_longest = GREATEST(user_progress.streak_longest, CASE
		     WHEN user_progress.last_active_date = $3 THEN user_progress.streak_current
		     WHEN user_progress.last_active_date = $3 - 1 THEN user_progress.streak_current + 1
		     ELSE 1 END),
		   last_active_date = $3,
		   updated_at = now()`,
		userID, score, today); err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return r.GetProgress(ctx, userID)
}

func (r *ProgressRepo) DueCards(ctx context.Context, userID string, today time.Time, limit int) ([]progress.ReviewCard, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT c.id,c.source,c.front,c.back,c.note,c.topic_tag,c.mastery_pips,c.favorite,
		        s.ease,s.interval_days,s.reps,s.due_date
		 FROM review_cards c JOIN review_schedules s ON s.card_id=c.id
		 WHERE c.user_id=$1 AND s.due_date<=$2 ORDER BY s.due_date LIMIT $3`,
		userID, today, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []progress.ReviewCard
	for rows.Next() {
		var c progress.ReviewCard
		if err := rows.Scan(&c.ID, &c.Source, &c.Front, &c.Back, &c.Note, &c.TopicTag, &c.MasteryPips, &c.Favorite,
			&c.Schedule.Ease, &c.Schedule.IntervalDays, &c.Schedule.Reps, &c.Schedule.DueDate); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, rows.Err()
}

func (r *ProgressRepo) GetCardForUser(ctx context.Context, userID, cardID string) (*progress.ReviewCard, error) {
	var c progress.ReviewCard
	err := r.pool.QueryRow(ctx,
		`SELECT c.id,c.source,c.front,c.back,c.note,c.topic_tag,c.mastery_pips,c.favorite,
		        s.ease,s.interval_days,s.reps,s.due_date
		 FROM review_cards c JOIN review_schedules s ON s.card_id=c.id
		 WHERE c.user_id=$1 AND c.id=$2`, userID, cardID).
		Scan(&c.ID, &c.Source, &c.Front, &c.Back, &c.Note, &c.TopicTag, &c.MasteryPips, &c.Favorite,
			&c.Schedule.Ease, &c.Schedule.IntervalDays, &c.Schedule.Reps, &c.Schedule.DueDate)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *ProgressRepo) SaveSchedule(ctx context.Context, cardID string, s progress.Schedule, masteryPips int) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	if _, err := tx.Exec(ctx,
		`UPDATE review_schedules SET ease=$2, interval_days=$3, reps=$4, due_date=$5, updated_at=now() WHERE card_id=$1`,
		cardID, s.Ease, s.IntervalDays, s.Reps, s.DueDate); err != nil {
		return err
	}
	if _, err := tx.Exec(ctx,
		`UPDATE review_cards SET mastery_pips=$2 WHERE id=$1`, cardID, masteryPips); err != nil {
		return err
	}
	return tx.Commit(ctx)
}
