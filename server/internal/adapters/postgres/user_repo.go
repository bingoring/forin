package postgres

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/domain/user"
)

// UserRepo implements ports.UserRepo using pgx.
//
// NOTE: queries are hand-written here for the 2-1 foundation. Stage 2-2 migrates
// these to sqlc-generated, type-safe queries (see sqlc.yaml / db/queries).
type UserRepo struct{ pool *pgxpool.Pool }

func NewUserRepo(pool *pgxpool.Pool) *UserRepo { return &UserRepo{pool: pool} }

func (r *UserRepo) UpsertByIdentity(ctx context.Context, provider user.Provider, subject, email string) (*user.User, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	var u user.User
	err = tx.QueryRow(ctx, `
		SELECT u.id, u.status, u.created_at
		FROM auth_identities ai JOIN users u ON u.id = ai.user_id
		WHERE ai.provider = $1 AND ai.subject_id = $2`,
		string(provider), subject,
	).Scan(&u.ID, &u.Status, &u.CreatedAt)

	switch {
	case err == nil:
		// existing user; refresh email if provided
		if email != "" {
			_, _ = tx.Exec(ctx, `UPDATE auth_identities SET email = $1 WHERE provider = $2 AND subject_id = $3`,
				email, string(provider), subject)
		}
	case errors.Is(err, pgx.ErrNoRows):
		if err = tx.QueryRow(ctx,
			`INSERT INTO users (status) VALUES ('active') RETURNING id, status, created_at`,
		).Scan(&u.ID, &u.Status, &u.CreatedAt); err != nil {
			return nil, err
		}
		if _, err = tx.Exec(ctx,
			`INSERT INTO auth_identities (user_id, provider, subject_id, email) VALUES ($1, $2, $3, $4)`,
			u.ID, string(provider), subject, email,
		); err != nil {
			return nil, err
		}
	default:
		return nil, err
	}

	if err = tx.Commit(ctx); err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepo) GetByID(ctx context.Context, id string) (*user.User, error) {
	var u user.User
	err := r.pool.QueryRow(ctx, `SELECT id, status, created_at FROM users WHERE id = $1`, id).
		Scan(&u.ID, &u.Status, &u.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	return &u, err
}

func (r *UserRepo) GetProfile(ctx context.Context, userID string) (*user.Profile, error) {
	var p user.Profile
	err := r.pool.QueryRow(ctx,
		`SELECT user_id, job, native_lang, destination, en_level FROM profiles WHERE user_id = $1`, userID).
		Scan(&p.UserID, &p.Job, &p.NativeLang, &p.Destination, &p.ENLevel)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	return &p, err
}
