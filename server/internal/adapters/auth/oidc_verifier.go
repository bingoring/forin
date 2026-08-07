// Package auth (adapter) verifies provider ID tokens via OIDC discovery + JWKS.
// Google, Apple, and Kakao are all OIDC providers, so one adapter covers all three.
package auth

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
	clientIDs map[user.Provider][]string
	mu        sync.Mutex
	cache     map[user.Provider]*oidc.IDTokenVerifier
}

// NewOIDCVerifier takes the accepted client IDs (audiences) per provider; empty
// disables that provider. A provider may need several — Google issues a separate
// OAuth client ID per platform (iOS/Android/Web) and stamps the requesting one
// into the id_token's `aud`, so a single audience would lock out the other platforms.
func NewOIDCVerifier(clientIDs map[user.Provider][]string) *OIDCVerifier {
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
	// The verifier skips the built-in single-audience check; we match against the
	// configured set instead (see NewOIDCVerifier).
	if !audienceAllowed(tok.Audience, v.clientIDs[provider]) {
		return nil, fmt.Errorf("oidc verify: audience %v not accepted for provider %q", tok.Audience, provider)
	}
	var claims struct {
		Email string `json:"email"`
	}
	_ = tok.Claims(&claims)
	return &ports.VerifiedIdentity{Subject: tok.Subject, Email: claims.Email}, nil
}

// audienceAllowed reports whether any of the token's audiences is configured.
// An empty allow-list accepts nothing.
func audienceAllowed(tokenAud, allowed []string) bool {
	for _, a := range tokenAud {
		for _, want := range allowed {
			if a == want {
				return true
			}
		}
	}
	return false
}

func (v *OIDCVerifier) verifierFor(ctx context.Context, provider user.Provider) (*oidc.IDTokenVerifier, error) {
	if len(v.clientIDs[provider]) == 0 {
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
	ver := p.Verifier(&oidc.Config{SkipClientIDCheck: true})
	v.cache[provider] = ver
	return ver, nil
}
