package http

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/avatar"
	"github.com/bingoring/forin/server/internal/domain/user"
)

// A UserRepo that only implements what this handler touches. Every other method
// panics rather than returning a zero value: a test that silently exercises an
// unimplemented path is a test of nothing.
type nameRepo struct {
	saved  string
	calls  int
	failOn bool
}

func (r *nameRepo) SetDisplayName(_ context.Context, _, name string) error {
	r.calls++
	if r.failOn {
		return context.DeadlineExceeded
	}
	r.saved = name
	return nil
}

func (r *nameRepo) GetProfile(_ context.Context, uid string) (*user.Profile, error) {
	return &user.Profile{UserID: uid, DisplayName: r.saved, TargetLang: "de", TargetLevel: "C1"}, nil
}

func (r *nameRepo) DisplayNames(context.Context, []string) (map[string]string, error) {
	panic("not used by setDisplayName")
}
func (r *nameRepo) UpsertByIdentity(context.Context, user.Provider, string, string) (*user.User, error) {
	panic("not used by setDisplayName")
}
func (r *nameRepo) GetByID(context.Context, string) (*user.User, error) {
	panic("not used by setDisplayName")
}
func (r *nameRepo) UpdateProfile(context.Context, user.Profile) error {
	panic("not used by setDisplayName")
}
func (r *nameRepo) SetEquippedTitle(context.Context, string, string) error {
	panic("not used by setDisplayName")
}
func (r *nameRepo) RecordProfileChange(context.Context, string, user.Profile, user.Profile) error {
	panic("not used by this handler")
}
func (r *nameRepo) SetUILang(context.Context, string, string) error {
	panic("not used by setDisplayName")
}
func (r *nameRepo) SetAvatar(context.Context, string, avatar.Spec) error {
	panic("not used by setDisplayName")
}
func (r *nameRepo) Avatars(context.Context, []string) (map[string]avatar.Spec, error) {
	panic("not used by setDisplayName")
}

// patchName runs the handler with an authenticated context and returns the status
// and the decoded profile.
func patchName(t *testing.T, repo *nameRepo, body string) (int, user.Profile) {
	t.Helper()
	h := &meHandler{users: repo}
	req := httptest.NewRequest(http.MethodPatch, "/me/display-name", strings.NewReader(body))
	// Same package, so the context key is reachable directly — there is no exported
	// setter, and adding one just for tests would widen the API.
	req = req.WithContext(context.WithValue(req.Context(), userIDKey, "11111111-2222-3333-4444-555555555555"))
	rec := httptest.NewRecorder()
	h.setDisplayName(rec, req)

	var out user.Profile
	if rec.Code == http.StatusOK {
		if err := json.Unmarshal(rec.Body.Bytes(), &out); err != nil {
			t.Fatalf("decode: %v (body %s)", err, rec.Body.String())
		}
	}
	return rec.Code, out
}

func TestSetDisplayNameNormalizesBeforeSaving(t *testing.T) {
	repo := &nameRepo{}
	code, got := patchName(t, repo, `{"displayName":"  김민아   RN  "}`)
	if code != http.StatusOK {
		t.Fatalf("status = %d, want 200", code)
	}
	// Normalized SERVER-side. If this were left to the client, the same person would
	// appear as "  김민아   RN  " in one place and "김민아 RN" in another, depending on
	// which client last wrote it.
	if repo.saved != "김민아 RN" {
		t.Fatalf("saved = %q, want %q", repo.saved, "김민아 RN")
	}
	// And the response carries what was stored, so the client does not have to guess.
	if got.DisplayName != "김민아 RN" {
		t.Fatalf("response name = %q", got.DisplayName)
	}
}

func TestSetDisplayNameRejectsUnusableNames(t *testing.T) {
	for _, body := range []string{
		`{"displayName":"` + strings.Repeat("\uac00", 21) + `"}`, // 21 runes
		`{"displayName":"Em\u200dma"}`,                           // zero-width joiner
		`{"displayName":"Em\u202ema"}`,                           // right-to-left override
		// Escaped in the JSON, not a raw byte: a raw control character makes the
		// DECODER reject the body, which would pass this test without the name
		// validation ever running.
		`{"displayName":"Emma\u0000"}`,
	} {
		repo := &nameRepo{}
		code, _ := patchName(t, repo, body)
		if code != http.StatusBadRequest {
			t.Fatalf("status = %d for %s, want 400", code, body)
		}
		// Rejected BEFORE the write, not written and then complained about.
		if repo.calls != 0 {
			t.Fatalf("a rejected name still reached the repo (%d calls)", repo.calls)
		}
	}
}

func TestSetDisplayNameClearsOnEmpty(t *testing.T) {
	repo := &nameRepo{saved: "김민아"}
	code, got := patchName(t, repo, `{"displayName":"   "}`)
	if code != http.StatusOK {
		t.Fatalf("status = %d, want 200 — clearing is a legitimate request", code)
	}
	if repo.saved != "" || got.DisplayName != "" {
		t.Fatalf("saved = %q, response = %q, want both empty", repo.saved, got.DisplayName)
	}
}

func TestSetDisplayNameRequiresAuth(t *testing.T) {
	repo := &nameRepo{}
	h := &meHandler{users: repo}
	// No user in the context — the route is behind auth middleware, but the handler
	// must not write on the strength of that alone.
	req := httptest.NewRequest(http.MethodPatch, "/me/display-name", strings.NewReader(`{"displayName":"Emma"}`))
	rec := httptest.NewRecorder()
	h.setDisplayName(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", rec.Code)
	}
	if repo.calls != 0 {
		t.Fatalf("an unauthenticated request reached the repo")
	}
}

func TestSetDisplayNameReportsAFailedWrite(t *testing.T) {
	repo := &nameRepo{failOn: true}
	code, _ := patchName(t, repo, `{"displayName":"Emma"}`)
	// 500, not 200. A save that failed must not come back looking saved — the client
	// applies the response, so a 200 here would show the new name until the next read.
	if code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want 500", code)
	}
}
