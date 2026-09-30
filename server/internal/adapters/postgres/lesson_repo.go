package postgres

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/adapters/postgres/sqlc"
	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/ports"
)

// LessonRepo implements ports.LessonRepo.
type LessonRepo struct{ q *sqlc.Queries }

func NewLessonRepo(pool *pgxpool.Pool) *LessonRepo { return &LessonRepo{q: sqlc.New(pool)} }

// Lexicon returns one theme's word bank. A theme with no bank yet (content lands
// department by department) is (nil, nil), not an error.
func (r *LessonRepo) Lexicon(ctx context.Context, theme string) ([]content.Word, error) {
	raw, err := r.q.GetLexicon(ctx, theme)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var words []content.Word
	unjson(raw, &words)
	return words, nil
}

func (r *LessonRepo) StepClears(ctx context.Context, userID, scenarioID string) (map[string]ports.LessonStepClear, error) {
	rows, err := r.q.ListLessonStepClears(ctx, sqlc.ListLessonStepClearsParams{UserID: userID, ScenarioID: scenarioID})
	if err != nil {
		return nil, err
	}
	out := make(map[string]ports.LessonStepClear, len(rows))
	for _, row := range rows {
		var c ports.LessonStepClear
		unjson(row.Detail, &c)
		out[row.Step] = c
	}
	return out, nil
}

func (r *LessonRepo) ClearStep(ctx context.Context, userID, scenarioID, step string, missed []string) error {
	return r.q.UpsertLessonStepClear(ctx, sqlc.UpsertLessonStepClearParams{
		UserID: userID, ScenarioID: scenarioID, Step: step, Detail: jsonb(ports.LessonStepClear{Missed: missed}),
	})
}

func (r *LessonRepo) HasWordCard(ctx context.Context, userID, en string) (bool, error) {
	return r.q.HasWordCard(ctx, sqlc.HasWordCardParams{UserID: userID, Back: en})
}
