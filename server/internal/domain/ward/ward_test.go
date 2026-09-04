package ward

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/bingoring/forin/server/internal/domain/avatar"
)

type fakeStore struct {
	recent  []string
	touched []string
	left    []string
}

func (f *fakeStore) Touch(_ context.Context, uid string, _ time.Time) error {
	f.touched = append(f.touched, uid)
	return nil
}
func (f *fakeStore) Leave(_ context.Context, uid string) error {
	f.left = append(f.left, uid)
	return nil
}
func (f *fakeStore) Recent(_ context.Context, _ time.Time, limit int64) ([]string, error) {
	if int64(len(f.recent)) > limit {
		return f.recent[:limit], nil
	}
	return f.recent, nil
}

type fakeAvatars struct{ m map[string]avatar.Spec }

func (f fakeAvatars) Avatars(_ context.Context, _ []string) (map[string]avatar.Spec, error) {
	return f.m, nil
}

func TestRosterExcludesViewerCapsAndAnonymises(t *testing.T) {
	var recent []string
	for i := 0; i < 15; i++ {
		recent = append(recent, fmt.Sprintf("u%02d", i))
	}
	viewer := "u05" // in the middle of the recent window, so it must be dropped
	store := &fakeStore{recent: recent}
	svc := NewService(store, fakeAvatars{m: map[string]avatar.Spec{"u00": {"skin": "tan"}}}, 40*time.Second)

	roster, err := svc.Roster(context.Background(), viewer)
	if err != nil {
		t.Fatal(err)
	}
	if len(roster) != Cap {
		t.Fatalf("cap: want %d, got %d", Cap, len(roster))
	}
	for _, m := range roster {
		if m.ID == viewer {
			t.Fatalf("raw uid leaked: %q", m.ID)
		}
		if m.ID == anonID(viewer) {
			t.Fatal("the viewer must not appear in their own roster")
		}
		if len(m.ID) != 12 {
			t.Fatalf("id is not the 12-hex anon handle: %q", m.ID)
		}
	}
	// u00 carried a face; find it by its anon id and confirm it came through.
	var got avatar.Spec
	for _, m := range roster {
		if m.ID == anonID("u00") {
			got = m.Avatar
		}
	}
	if got["skin"] != "tan" {
		t.Fatalf("avatar not attached for u00: %v", got)
	}
}

func TestAnonIDIsStable(t *testing.T) {
	if anonID("abc") != anonID("abc") {
		t.Fatal("anon id must be stable for the same user")
	}
	if anonID("abc") == anonID("abd") {
		t.Fatal("different users must get different ids")
	}
}

func TestTouchHonoursHidden(t *testing.T) {
	store := &fakeStore{}
	svc := NewService(store, fakeAvatars{}, 40*time.Second)

	if err := svc.Touch(context.Background(), "u1", true); err != nil {
		t.Fatal(err)
	}
	if len(store.touched) != 0 {
		t.Fatal("a hidden learner must not be registered")
	}
	if err := svc.Touch(context.Background(), "u1", false); err != nil {
		t.Fatal(err)
	}
	if len(store.touched) != 1 || store.touched[0] != "u1" {
		t.Fatalf("a visible learner must be registered: %v", store.touched)
	}
}

func TestLeaveDelegates(t *testing.T) {
	store := &fakeStore{}
	svc := NewService(store, fakeAvatars{}, 40*time.Second)
	if err := svc.Leave(context.Background(), "u1"); err != nil {
		t.Fatal(err)
	}
	if len(store.left) != 1 || store.left[0] != "u1" {
		t.Fatalf("leave must reach the store: %v", store.left)
	}
}
