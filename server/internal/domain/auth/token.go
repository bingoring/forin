// Package auth implements token issuance/rotation and the social-login use case.
package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrMalformed    = errors.New("malformed refresh token")
)

// TokenService issues short-lived access JWTs and opaque, rotatable refresh tokens.
type TokenService struct {
	signingKey []byte
	issuer     string
	accessTTL  time.Duration
}

func NewTokenService(signingKey []byte, issuer string, accessTTL time.Duration) *TokenService {
	return &TokenService{signingKey: signingKey, issuer: issuer, accessTTL: accessTTL}
}

// IssueAccess returns a signed HS256 JWT for the user.
func (s *TokenService) IssueAccess(userID string) (string, time.Time, error) {
	exp := time.Now().Add(s.accessTTL)
	claims := jwt.RegisteredClaims{
		Subject:   userID,
		Issuer:    s.issuer,
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		ExpiresAt: jwt.NewNumericDate(exp),
		ID:        randString(16),
	}
	tok, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(s.signingKey)
	return tok, exp, err
}

// ParseAccess validates a JWT and returns the user ID (Subject).
func (s *TokenService) ParseAccess(tokenStr string) (string, error) {
	claims := &jwt.RegisteredClaims{}
	_, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrInvalidToken
		}
		return s.signingKey, nil
	}, jwt.WithIssuer(s.issuer))
	if err != nil {
		return "", ErrInvalidToken
	}
	if claims.Subject == "" {
		return "", ErrInvalidToken
	}
	return claims.Subject, nil
}

// GenerateRefresh returns a refresh token (plaintext, given to client) and its hash (stored).
// The plaintext embeds the userID so the refresh endpoint can locate it: "<userID>.<random>".
func (s *TokenService) GenerateRefresh(userID string) (plaintext, hash string) {
	plaintext = userID + "." + randString(32)
	return plaintext, HashRefresh(plaintext)
}

// ParseRefresh extracts the userID embedded in a refresh token.
func (s *TokenService) ParseRefresh(plaintext string) (string, error) {
	i := strings.IndexByte(plaintext, '.')
	if i <= 0 {
		return "", ErrMalformed
	}
	return plaintext[:i], nil
}

// HashRefresh hashes a refresh token for at-rest storage (never store plaintext).
func HashRefresh(plaintext string) string {
	sum := sha256.Sum256([]byte(plaintext))
	return hex.EncodeToString(sum[:])
}

func randString(n int) string {
	b := make([]byte, n)
	_, _ = rand.Read(b)
	return base64.RawURLEncoding.EncodeToString(b)
}
