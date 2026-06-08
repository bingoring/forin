package auth

import (
	"testing"
	"time"
)

func newTS() *TokenService {
	return NewTokenService([]byte("test-signing-key-0123456789"), "forin-test", 15*time.Minute)
}

func TestAccessTokenRoundTrip(t *testing.T) {
	ts := newTS()
	tok, exp, err := ts.IssueAccess("user-123")
	if err != nil {
		t.Fatalf("issue: %v", err)
	}
	if !exp.After(time.Now()) {
		t.Fatal("expiry should be in the future")
	}
	uid, err := ts.ParseAccess(tok)
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	if uid != "user-123" {
		t.Fatalf("got %q want user-123", uid)
	}
}

func TestAccessTokenRejectsWrongKey(t *testing.T) {
	tok, _, _ := newTS().IssueAccess("user-123")
	other := NewTokenService([]byte("a-completely-different-key"), "forin-test", time.Minute)
	if _, err := other.ParseAccess(tok); err == nil {
		t.Fatal("expected verification failure with wrong signing key")
	}
}

func TestAccessTokenRejectsExpired(t *testing.T) {
	ts := NewTokenService([]byte("test-signing-key-0123456789"), "forin-test", -time.Second)
	tok, _, _ := ts.IssueAccess("user-123")
	if _, err := ts.ParseAccess(tok); err == nil {
		t.Fatal("expected expired token to be rejected")
	}
}

func TestRefreshTokenEmbedsUserAndHashes(t *testing.T) {
	ts := newTS()
	plain, hash := ts.GenerateRefresh("user-abc")
	uid, err := ts.ParseRefresh(plain)
	if err != nil {
		t.Fatalf("parse refresh: %v", err)
	}
	if uid != "user-abc" {
		t.Fatalf("got %q want user-abc", uid)
	}
	if hash == plain || hash != HashRefresh(plain) {
		t.Fatal("hash should be deterministic sha256 and not the plaintext")
	}
	if _, err := ts.ParseRefresh("no-dot-here"); err == nil {
		t.Fatal("expected malformed error")
	}
}
