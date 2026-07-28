package postgres

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/adapters/postgres/sqlc"
	"github.com/bingoring/forin/server/internal/domain/user"
)

// UserRepo implements ports.UserRepo over sqlc-generated, type-safe queries.
type UserRepo struct {
	pool *pgxpool.Pool
	q    *sqlc.Queries
}

func NewUserRepo(pool *pgxpool.Pool) *UserRepo { return &UserRepo{pool: pool, q: sqlc.New(pool)} }

func (r *UserRepo) UpsertByIdentity(ctx context.Context, provider user.Provider, subject, email string) (*user.User, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)
	q := r.q.WithTx(tx)

	u, err := q.GetUserByIdentity(ctx, sqlc.GetUserByIdentityParams{Provider: string(provider), SubjectID: subject})
	switch {
	case err == nil:
		if email != "" {
			if err := q.UpdateIdentityEmail(ctx, sqlc.UpdateIdentityEmailParams{
				Provider: string(provider), SubjectID: subject, Email: email}); err != nil {
				return nil, err
			}
		}
	case errors.Is(err, pgx.ErrNoRows):
		u, err = q.CreateUser(ctx, "active")
		if err != nil {
			return nil, err
		}
		if err := q.CreateIdentity(ctx, sqlc.CreateIdentityParams{
			UserID: u.ID, Provider: string(provider), SubjectID: subject, Email: email}); err != nil {
			return nil, err
		}
	default:
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return &user.User{ID: u.ID, Status: u.Status, CreatedAt: u.CreatedAt.Time}, nil
}

func (r *UserRepo) GetByID(ctx context.Context, id string) (*user.User, error) {
	u, err := r.q.GetUserByID(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user.User{ID: u.ID, Status: u.Status, CreatedAt: u.CreatedAt.Time}, nil
}

func (r *UserRepo) GetProfile(ctx context.Context, userID string) (*user.Profile, error) {
	p, err := r.q.GetProfile(ctx, userID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user.Profile{
		UserID: p.UserID, Job: p.Job, NativeLang: p.NativeLang, TargetLang: p.TargetLang,
		Destination: p.Destination, TargetLevel: p.TargetLevel, Onboarded: p.Onboarded,
	}, nil
}

// UpdateProfile upserts the onboarding-derived profile and marks it onboarded.
func (r *UserRepo) UpdateProfile(ctx context.Context, p user.Profile) error {
	return r.q.UpsertProfile(ctx, sqlc.UpsertProfileParams{
		UserID: p.UserID, Job: p.Job, NativeLang: p.NativeLang, TargetLang: p.TargetLang,
		Destination: p.Destination, TargetLevel: p.TargetLevel,
	})
}
