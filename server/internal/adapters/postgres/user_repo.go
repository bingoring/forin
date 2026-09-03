package postgres

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/adapters/postgres/sqlc"
	"github.com/bingoring/forin/server/internal/domain/avatar"
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
	out := &user.Profile{
		UserID: p.UserID, Job: p.Job, NativeLang: p.NativeLang, TargetLang: p.TargetLang,
		Destination: p.Destination, TargetLevel: p.TargetLevel, Onboarded: p.Onboarded,
		EquippedTitle: p.EquippedTitle, UILang: p.UiLang, DisplayName: p.DisplayName,
	}
	// A portrait that will not parse is left absent rather than failing the profile:
	// the client then draws the seeded face, which is a face. Failing here would take
	// the whole screen down over a decoration.
	if len(p.Avatar) > 0 {
		var spec map[string]string
		if json.Unmarshal(p.Avatar, &spec) == nil && len(spec) > 0 {
			out.Avatar = spec
		}
	}
	return out, nil
}

// SetEquippedTitle persists the user's currently-equipped career title.
func (r *UserRepo) SetEquippedTitle(ctx context.Context, userID, titleID string) error {
	return r.q.SetEquippedTitle(ctx, sqlc.SetEquippedTitleParams{UserID: userID, EquippedTitle: titleID})
}

// SetUILang persists the app's display language. A single-field patch, like
// SetEquippedTitle: UpdateProfile fills omitted columns with onboarding defaults, so
// reusing it to save one setting would silently reset job and languages.
func (r *UserRepo) SetUILang(ctx context.Context, userID, lang string) error {
	return r.q.SetUILang(ctx, sqlc.SetUILangParams{UserID: userID, UiLang: lang})
}

// SetDisplayName persists the learner's chosen name ("" clears it).
func (r *UserRepo) SetDisplayName(ctx context.Context, userID, name string) error {
	return r.q.SetDisplayName(ctx, sqlc.SetDisplayNameParams{UserID: userID, DisplayName: name})
}

// DisplayNames resolves many users' names in one query. Users with no name set are
// absent from the map rather than present-and-empty, so a caller iterating the map
// never has to re-check for "".
func (r *UserRepo) DisplayNames(ctx context.Context, userIDs []string) (map[string]string, error) {
	if len(userIDs) == 0 {
		return map[string]string{}, nil
	}
	rows, err := r.q.DisplayNames(ctx, userIDs)
	if err != nil {
		return nil, err
	}
	out := make(map[string]string, len(rows))
	for _, row := range rows {
		out[row.UserID] = row.DisplayName
	}
	return out, nil
}

// UpdateProfile upserts the onboarding-derived profile and marks it onboarded.
func (r *UserRepo) UpdateProfile(ctx context.Context, p user.Profile) error {
	return r.q.UpsertProfile(ctx, sqlc.UpsertProfileParams{
		UserID: p.UserID, Job: p.Job, NativeLang: p.NativeLang, TargetLang: p.TargetLang,
		Destination: p.Destination, TargetLevel: p.TargetLevel,
	})
}

// SetAvatar persists the learner's portrait. A single-field patch, like
// SetDisplayName: UpsertProfile fills the columns it is not given with onboarding
// defaults, so saving a face through it would reset job and languages.
func (r *UserRepo) SetAvatar(ctx context.Context, userID string, spec avatar.Spec) error {
	raw, err := json.Marshal(spec)
	if err != nil {
		return err
	}
	return r.q.SetAvatar(ctx, sqlc.SetAvatarParams{UserID: userID, Avatar: raw})
}

// Avatars resolves many portraits in ONE query — a lounge page draws twenty people,
// and a per-row lookup is how that becomes twenty round trips.
//
// A row whose json will not parse is skipped, for the same reason GetProfile drops
// it: the caller's fallback is a real face, and one bad row must not blank a feed.
func (r *UserRepo) Avatars(ctx context.Context, userIDs []string) (map[string]avatar.Spec, error) {
	if len(userIDs) == 0 {
		return map[string]avatar.Spec{}, nil
	}
	rows, err := r.q.Avatars(ctx, userIDs)
	if err != nil {
		return nil, err
	}
	out := make(map[string]avatar.Spec, len(rows))
	for _, row := range rows {
		var spec avatar.Spec
		if json.Unmarshal(row.Avatar, &spec) == nil && len(spec) > 0 {
			out[row.UserID] = spec
		}
	}
	return out, nil
}
