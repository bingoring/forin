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

// A UserRepo that only implements what PATCH /me/avatar touches. Everything else
// panics: a test that silently exercises an unimplemented path tests nothing.
type avatarRepo struct {
	saved  avatar.Spec
	writes int
	fail   bool
}

func (r *avatarRepo) SetAvatar(_ context.Context, _ string, spec avatar.Spec) error {
	r.writes++
	if r.fail {
		return context.DeadlineExceeded
	}
	r.saved = spec
	return nil
}

func (r *avatarRepo) GetProfile(_ context.Context, uid string) (*user.Profile, error) {
	return &user.Profile{UserID: uid, Avatar: r.saved, TargetLang: "en", TargetLevel: "B1"}, nil
}

func (r *avatarRepo) Avatars(context.Context, []string) (map[string]avatar.Spec, error) {
	panic("not used by setAvatar")
}
func (r *avatarRepo) SetDisplayName(context.Context, string, string) error {
	panic("not used by setAvatar")
}
func (r *avatarRepo) DisplayNames(context.Context, []string) (map[string]string, error) {
	panic("not used by setAvatar")
}
func (r *avatarRepo) UpsertByIdentity(context.Context, user.Provider, string, string) (*user.User, error) {
	panic("not used by setAvatar")
}
func (r *avatarRepo) GetByID(context.Context, string) (*user.User, error) {
	panic("not used by setAvatar")
}
func (r *avatarRepo) UpdateProfile(context.Context, user.Profile) error {
	panic("not used by setAvatar")
}
func (r *avatarRepo) SetEquippedTitle(context.Context, string, string) error {
	panic("not used by setAvatar")
}
func (r *avatarRepo) SetUILang(context.Context, string, string) error {
	panic("not used by setAvatar")
}

const fullSpec = `{"avatar":{"skin":"olive","hair":"bob","hairColor":"black","eyes":"wink",` +
	`"mouth":"smile","outfit":"labCoat","outfitColor":"lilac","hat":"none","bg":"grid","acc":"glassesRound"}}`

func patchAvatar(t *testing.T, repo *avatarRepo, body string) (int, user.Profile) {
	t.Helper()
	h := &meHandler{users: repo}
	req := httptest.NewRequest(http.MethodPatch, "/me/avatar", strings.NewReader(body))
	req = req.WithContext(context.WithValue(req.Context(), userIDKey, "11111111-2222-3333-4444-555555555555"))
	rec := httptest.NewRecorder()
	h.setAvatar(rec, req)

	var out user.Profile
	if rec.Code == http.StatusOK {
		if err := json.Unmarshal(rec.Body.Bytes(), &out); err != nil {
			t.Fatalf("decode: %v (body %s)", err, rec.Body.String())
		}
	}
	return rec.Code, out
}

func TestSetAvatarStoresTheWholePortraitAndReadsItBack(t *testing.T) {
	repo := &avatarRepo{}
	code, out := patchAvatar(t, repo, fullSpec)
	if code != http.StatusOK {
		t.Fatalf("status %d", code)
	}
	if repo.saved["hair"] != "bob" || repo.saved["acc"] != "glassesRound" {
		t.Fatalf("stored %v", repo.saved)
	}
	// The response is the SERVER's profile, not the submitted body: the picker has to
	// see what was actually stored, or a rejected axis would look accepted.
	if out.Avatar["outfit"] != "labCoat" {
		t.Errorf("response avatar = %v", out.Avatar)
	}
}

func TestSetAvatarRejectsAKeyTheClientCannotDraw(t *testing.T) {
	repo := &avatarRepo{}
	code, _ := patchAvatar(t, repo, strings.Replace(fullSpec, `"hair":"bob"`, `"hair":"sombrero"`, 1))
	if code != http.StatusBadRequest {
		t.Fatalf("status %d, want 400", code)
	}
	if repo.writes != 0 {
		t.Error("an undrawable portrait was written")
	}
}

func TestSetAvatarRejectsAHalfPortrait(t *testing.T) {
	// A half-spec stored now is read by somebody else's screen later, and the client
	// would have to invent the missing half in two places.
	repo := &avatarRepo{}
	code, _ := patchAvatar(t, repo, `{"avatar":{"skin":"olive","hair":"bob"}}`)
	if code != http.StatusBadRequest {
		t.Fatalf("status %d, want 400", code)
	}
	if repo.writes != 0 {
		t.Error("a half portrait was written")
	}
}

func TestSetAvatarRejectsAnEmptyBody(t *testing.T) {
	repo := &avatarRepo{}
	for _, body := range []string{`{}`, `{"avatar":{}}`, `{"avatar":null}`} {
		code, _ := patchAvatar(t, repo, body)
		if code != http.StatusBadRequest {
			t.Errorf("%s: status %d, want 400", body, code)
		}
	}
	if repo.writes != 0 {
		t.Error("an empty portrait was written")
	}
}

func TestSetAvatarReportsAFailedWrite(t *testing.T) {
	// Answering 200 for a write that failed leaves the picker showing a face the
	// server does not have.
	repo := &avatarRepo{fail: true}
	code, _ := patchAvatar(t, repo, fullSpec)
	if code != http.StatusInternalServerError {
		t.Fatalf("status %d, want 500", code)
	}
}
