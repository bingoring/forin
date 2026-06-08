package auth

import (
	"context"
	"time"

	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/ports"
)

// TokenPair is returned to the client on login/refresh.
type TokenPair struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int64  `json:"expiresIn"` // access token seconds-to-live
}

// Service orchestrates social login, refresh-token rotation, and logout.
type Service struct {
	users      ports.UserRepo
	verifier   ports.IdentityVerifier
	refresh    ports.RefreshStore
	tokens     *TokenService
	refreshTTL time.Duration
}

func NewService(users ports.UserRepo, verifier ports.IdentityVerifier, refresh ports.RefreshStore, tokens *TokenService, refreshTTL time.Duration) *Service {
	return &Service{users: users, verifier: verifier, refresh: refresh, tokens: tokens, refreshTTL: refreshTTL}
}

// SocialLogin verifies a provider ID token, finds-or-creates the user, and issues tokens.
func (s *Service) SocialLogin(ctx context.Context, provider user.Provider, idToken string) (*TokenPair, *user.User, error) {
	if !provider.Valid() {
		return nil, nil, ErrInvalidToken
	}
	vi, err := s.verifier.Verify(ctx, provider, idToken)
	if err != nil {
		return nil, nil, err
	}
	u, err := s.users.UpsertByIdentity(ctx, provider, vi.Subject, vi.Email)
	if err != nil {
		return nil, nil, err
	}
	pair, err := s.issue(ctx, u.ID)
	if err != nil {
		return nil, nil, err
	}
	return pair, u, nil
}

// Refresh rotates a refresh token: consume the old, issue a fresh pair.
func (s *Service) Refresh(ctx context.Context, refreshToken string) (*TokenPair, error) {
	userID, err := s.tokens.ParseRefresh(refreshToken)
	if err != nil {
		return nil, err
	}
	ok, err := s.refresh.Consume(ctx, userID, HashRefresh(refreshToken))
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, ErrInvalidToken
	}
	return s.issue(ctx, userID)
}

// Logout revokes all refresh tokens for a user.
func (s *Service) Logout(ctx context.Context, userID string) error {
	return s.refresh.DeleteAll(ctx, userID)
}

func (s *Service) issue(ctx context.Context, userID string) (*TokenPair, error) {
	access, exp, err := s.tokens.IssueAccess(userID)
	if err != nil {
		return nil, err
	}
	plaintext, hash := s.tokens.GenerateRefresh(userID)
	if err := s.refresh.Save(ctx, userID, hash, s.refreshTTL); err != nil {
		return nil, err
	}
	return &TokenPair{
		AccessToken:  access,
		RefreshToken: plaintext,
		ExpiresIn:    int64(time.Until(exp).Seconds()),
	}, nil
}
