// Package auth (adapter) verifies provider ID tokens via OIDC discovery + JWKS.
// Google, Apple, and Kakao are all OIDC providers, so one adapter covers all three.
package oidc

import (
	"context"
	"errors"
	"fmt"
	"sync"

	"github.com/coreos/go-oidc/v3/oidc"

	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/ports"
)

var issuers = map[user.Provider]string{
	user.ProviderGoogle: "https://accounts.google.com",
	user.ProviderApple:  "https://appleid.apple.com",
	user.ProviderKakao:  "https://kauth.kakao.com",
}

// OIDCVerifier validates ID tokens. Verifiers are built lazily on first use per
// provider (discovery hits the network), so unconfigured providers don't block startup.
type OIDCVerifier struct {
	clientIDs map[user.Provider]string
	mu        sync.Mutex
	cache     map[user.Provider]*oidc.IDTokenVerifier
}

// NewOIDCVerifier takes the configured client ID (audience) per provider; empty disables it.
func NewOIDCVerifier(clientIDs map[user.Provider]string) *OIDCVerifier {
	return &OIDCVerifier{clientIDs: clientIDs, cache: map[user.Provider]*oidc.IDTokenVerifier{}}
}

func (v *OIDCVerifier) Verify(ctx context.Context, provider user.Provider, idToken string) (*ports.VerifiedIdentity, error) {
	ver, err := v.verifierFor(ctx, provider)
	if err != nil {
		return nil, err
	}
	tok, err := ver.Verify(ctx, idToken)
	if err != nil {
		return nil, fmt.Errorf("oidc verify: %w", err)
	}
	var claims struct {
		Email string `json:"email"`
	}
	_ = tok.Claims(&claims)
	return &ports.VerifiedIdentity{Subject: tok.Subject, Email: claims.Email}, nil
}

func (v *OIDCVerifier) verifierFor(ctx context.Context, provider user.Provider) (*oidc.IDTokenVerifier, error) {
	clientID := v.clientIDs[provider]
	if clientID == "" {
		return nil, fmt.Errorf("provider %q not configured", provider)
	}
	issuer, ok := issuers[provider]
	if !ok {
		return nil, errors.New("unknown provider")
	}

	v.mu.Lock()
	defer v.mu.Unlock()
	if ver, ok := v.cache[provider]; ok {
		return ver, nil
	}
	p, err := oidc.NewProvider(ctx, issuer)
	if err != nil {
		return nil, fmt.Errorf("oidc discovery (%s): %w", provider, err)
	}
	ver := p.Verifier(&oidc.Config{ClientID: clientID})
	v.cache[provider] = ver
	return ver, nil
}
