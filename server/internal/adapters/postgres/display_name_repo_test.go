package postgres

import (
	"context"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/user"
)

// The two things about the name that only exist in SQL, and both of which a
// hand-check of the Go code would pass.
func TestSetDisplayNameDoesNotResetTheProfile(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewUserRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// A fully onboarded profile, as the wizard leaves it.
	if err := repo.UpdateProfile(ctx, profileFor(uid)); err != nil {
		t.Fatalf("UpdateProfile: %v", err)
	}
	if err := repo.SetDisplayName(ctx, uid, "김민아"); err != nil {
		t.Fatalf("SetDisplayName: %v", err)
	}

	got, err := repo.GetProfile(ctx, uid)
	if err != nil || got == nil {
		t.Fatalf("GetProfile: %v", err)
	}
	if got.DisplayName != "김민아" {
		t.Fatalf("DisplayName = %q, want 김민아", got.DisplayName)
	}
	// This is the reason SetDisplayName is its own query. UpsertProfile fills every
	// omitted column with an onboarding default, so saving a name through it would
	// silently move the learner's target language back to English and their level
	// back to B1 — a data loss with no error and no visible cause.
	if got.TargetLang != "de" || got.TargetLevel != "C1" || got.Destination != "de" {
		t.Fatalf("the profile was reset by a name change: %+v", got)
	}

	// Clearing is a real operation, not a no-op guarded away by the handler.
	if err := repo.SetDisplayName(ctx, uid, ""); err != nil {
		t.Fatalf("SetDisplayName(clear): %v", err)
	}
	if got, _ = repo.GetProfile(ctx, uid); got.DisplayName != "" {
		t.Fatalf("DisplayName after clearing = %q, want empty", got.DisplayName)
	}
}

func TestSetDisplayNameWithoutAnExistingProfileRow(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewUserRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// No UpdateProfile first: a user can reach the profile screen before finishing
	// onboarding, and an UPDATE-only statement would report success while writing
	// nothing at all.
	if err := repo.SetDisplayName(ctx, uid, "Emma"); err != nil {
		t.Fatalf("SetDisplayName: %v", err)
	}
	got, err := repo.GetProfile(ctx, uid)
	if err != nil || got == nil {
		t.Fatalf("GetProfile: %v", err)
	}
	if got.DisplayName != "Emma" {
		t.Fatalf("DisplayName = %q, want Emma", got.DisplayName)
	}
}

func TestDisplayNamesOmitsUsersWithNoName(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewUserRepo(pool)
	ctx := context.Background()
	named := speechTestUser(t, pool)
	unnamed := speechTestUser(t, pool)
	noProfile := speechTestUser(t, pool)

	if err := repo.SetDisplayName(ctx, named, "김민아"); err != nil {
		t.Fatalf("SetDisplayName: %v", err)
	}
	if err := repo.SetDisplayName(ctx, unnamed, ""); err != nil {
		t.Fatalf("SetDisplayName(empty): %v", err)
	}

	names, err := repo.DisplayNames(ctx, []string{named, unnamed, noProfile})
	if err != nil {
		t.Fatalf("DisplayNames: %v", err)
	}
	if names[named] != "김민아" {
		t.Fatalf("named = %q, want 김민아", names[named])
	}
	// Absent, not present-and-empty. A caller iterating the map would otherwise have
	// to re-check for "" after the query already knew the answer — and the one that
	// forgot would draw a blank row where a short id belongs.
	if _, ok := names[unnamed]; ok {
		t.Fatalf("a user with an empty name is in the map")
	}
	if _, ok := names[noProfile]; ok {
		t.Fatalf("a user with no profile row is in the map")
	}

	// An empty request must not become `= ANY('{}')` against every profile row.
	empty, err := repo.DisplayNames(ctx, nil)
	if err != nil || len(empty) != 0 {
		t.Fatalf("DisplayNames(nil) = (%v, %v), want an empty map", empty, err)
	}
}

// profileFor is a NON-default onboarded profile: German, C1, Germany. Defaults
// would make the reset test pass whether or not the reset happened.
func profileFor(uid string) user.Profile {
	return user.Profile{
		UserID: uid, Job: "nurse", NativeLang: "ko", TargetLang: "de",
		Destination: "de", TargetLevel: "C1",
	}
}
