package postgres

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/domain/slang"
)

type SlangRepo struct{ pool *pgxpool.Pool }

func NewSlangRepo(pool *pgxpool.Pool) *SlangRepo { return &SlangRepo{pool: pool} }

// Collected returns the user's cards in the order they were picked up.
func (r *SlangRepo) Collected(ctx context.Context, userID string) ([]slang.Collected, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT card_id, collected_at FROM slang_collected WHERE user_id = $1 ORDER BY collected_at ASC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []slang.Collected{}
	for rows.Next() {
		var c slang.Collected
		if err := rows.Scan(&c.CardID, &c.CollectedAt); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, rows.Err()
}

// Collect records a card as collected; collecting the same card twice is a no-op.
func (r *SlangRepo) Collect(ctx context.Context, userID, cardID string) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO slang_collected (user_id, card_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, userID, cardID)
	return err
}
