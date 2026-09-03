package http

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/avatar"
	"github.com/bingoring/forin/server/internal/domain/user"
)

// A UserRepo for PATCH /me/profile: it remembers the profile it holds and every audit
// row the handler asked for.
type profileRepo struct {
	current *user.Profile
	audit   [][2]user.Profile
	saves   int
}

func (r *profileRepo) GetProfile(context.Context, string) (*user.Profile, error) {
	return r.current, nil
}

func (r *profileRepo) UpdateProfile(_ context.Context, p user.Profile) error {
	r.saves++
	copyOf := p
	r.current = &copyOf
	return nil
}

func (r *profileRepo) RecordProfileChange(_ context.Context, _ string, before, after user.Profile) error {
	r.audit = append(r.audit, [2]user.Profile{before, after})
	return nil
}

func (r *profileRepo) SetAvatar(context.Context, string, avatar.Spec) error { panic("not used") }
func (r *profileRepo) Avatars(context.Context, []string) (map[string]avatar.Spec, error) {
	panic("not used")
}
func (r *profileRepo) SetDisplayName(context.Context, string, string) error { panic("not used") }
func (r *profileRepo) DisplayNames(context.Context, []string) (map[string]string, error) {
	panic("not used")
}
func (r *profileRepo) UpsertByIdentity(context.Context, user.Provider, string, string) (*user.User, error) {
	panic("not used")
}
func (r *profileRepo) GetByID(context.Context, string) (*user.User, error)    { panic("not used") }
func (r *profileRepo) SetEquippedTitle(context.Context, string, string) error { panic("not used") }
func (r *profileRepo) SetUILang(context.Context, string, string) error        { panic("not used") }

func patchProfile(t *testing.T, repo *profileRepo, body string) int {
	t.Helper()
	h := &meHandler{users: repo}
	req := httptest.NewRequest(http.MethodPatch, "/me/profile", strings.NewReader(body))
	req = req.WithContext(context.WithValue(req.Context(), userIDKey, "11111111-2222-3333-4444-555555555555"))
	rec := httptest.NewRecorder()
	h.updateProfile(rec, req)
	return rec.Code
}

const nurseUS = `{"job":"nurse","nativeLang":"ko","targetLang":"en","destination":"us","targetLevel":"B1"}`

func TestProfileSaveWithNoChangeWritesNoAudit(t *testing.T) {
	// The settings screen sends the whole profile whether or not anything moved, and a
	// row per save would bury the changes this log exists to find.
	repo := &profileRepo{current: &user.Profile{
		Job: "nurse", NativeLang: "ko", TargetLang: "en", Destination: "us", TargetLevel: "B1",
	}}
	if code := patchProfile(t, repo, nurseUS); code != http.StatusOK {
		t.Fatalf("status %d", code)
	}
	if repo.saves != 1 {
		t.Errorf("saves = %d, want 1", repo.saves)
	}
	if len(repo.audit) != 0 {
		t.Errorf("a no-op save wrote %d audit rows", len(repo.audit))
	}
}

func TestProfileSaveRecordsBothSidesOfAChange(t *testing.T) {
	repo := &profileRepo{current: &user.Profile{
		Job: "nurse", NativeLang: "ko", TargetLang: "en", Destination: "us", TargetLevel: "B1",
	}}
	body := strings.Replace(nurseUS, `"destination":"us"`, `"destination":"au"`, 1)
	if code := patchProfile(t, repo, body); code != http.StatusOK {
		t.Fatalf("status %d", code)
	}
	if len(repo.audit) != 1 {
		t.Fatalf("audit rows = %d, want 1", len(repo.audit))
	}
	before, after := repo.audit[0][0], repo.audit[0][1]
	// Both sides, from the ONE moment both exist: the read happens before the write.
	if before.Destination != "us" || after.Destination != "au" {
		t.Fatalf("recorded %q → %q", before.Destination, after.Destination)
	}
}

func TestLevelOnlyChangeIsNotASubjectChange(t *testing.T) {
	// Re-calibrating your own English is not a change of subject, so it must not put a
	// row in a log that P2 reads as "history before this belonged to something else".
	repo := &profileRepo{current: &user.Profile{
		Job: "nurse", NativeLang: "ko", TargetLang: "en", Destination: "us", TargetLevel: "B1",
	}}
	body := strings.Replace(nurseUS, `"targetLevel":"B1"`, `"targetLevel":"B2"`, 1)
	if code := patchProfile(t, repo, body); code != http.StatusOK {
		t.Fatalf("status %d", code)
	}
	if len(repo.audit) != 0 {
		t.Errorf("a level change wrote %d audit rows", len(repo.audit))
	}
	if repo.current.TargetLevel != "B2" {
		t.Errorf("the level was not saved: %q", repo.current.TargetLevel)
	}
}

func TestFirstProfileSaveIsNotAChange(t *testing.T) {
	// Onboarding's final save is the first write for most accounts. Recording
	// "'' → nurse" for every new user would make the log useless.
	repo := &profileRepo{current: nil}
	if code := patchProfile(t, repo, nurseUS); code != http.StatusOK {
		t.Fatalf("status %d", code)
	}
	if len(repo.audit) != 0 {
		t.Errorf("the first save wrote %d audit rows", len(repo.audit))
	}
}
