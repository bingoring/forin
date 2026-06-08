// Package ports defines the interfaces (driven ports) that the domain depends on.
// Adapters in internal/adapters implement these; this keeps providers swappable.
package ports

import (
	"context"
	"time"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/user"
)

// ContentReader serves authored content (read-only) to the domain/API.
type ContentReader interface {
	Manifest(ctx context.Context) (*content.Manifest, error)
	ListEvents(ctx context.Context, profession string) ([]content.Event, error)
	GetScenario(ctx context.Context, id string) (*content.Scenario, error)
	TodaysBoard(ctx context.Context, profession string, limit int) ([]content.Event, error)
}

// ContentSeeder ingests a validated content bundle (file-source or, later, a CMS).
type ContentSeeder interface {
	Seed(ctx context.Context, b *content.Bundle) error
}

// VerifiedIdentity is the result of validating a provider ID token.
type VerifiedIdentity struct {
	Subject string
	Email   string
}

// IdentityVerifier validates a social provider's ID token (Apple/Google/Kakao via OIDC).
type IdentityVerifier interface {
	Verify(ctx context.Context, provider user.Provider, idToken string) (*VerifiedIdentity, error)
}

// UserRepo persists users, identities, and profiles.
type UserRepo interface {
	// UpsertByIdentity finds-or-creates a user for (provider, subject), recording email.
	UpsertByIdentity(ctx context.Context, provider user.Provider, subject, email string) (*user.User, error)
	GetByID(ctx context.Context, id string) (*user.User, error)
	GetProfile(ctx context.Context, userID string) (*user.Profile, error)
}

// RefreshStore stores hashed refresh tokens with TTL and supports rotation.
type RefreshStore interface {
	Save(ctx context.Context, userID, tokenHash string, ttl time.Duration) error
	// Consume returns true and deletes the token if (userID, tokenHash) exists.
	Consume(ctx context.Context, userID, tokenHash string) (bool, error)
	DeleteAll(ctx context.Context, userID string) error
}
