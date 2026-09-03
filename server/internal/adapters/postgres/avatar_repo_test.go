package postgres

import (
	"context"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/avatar"
	"github.com/bingoring/forin/server/internal/domain/lounge"
)

func spec() avatar.Spec {
	return avatar.Spec{
		"skin": "olive", "hair": "bob", "hairColor": "black", "eyes": "wink",
		"mouth": "smile", "outfit": "labCoat", "outfitColor": "lilac", "hat": "none",
		"bg": "grid", "acc": "glassesRound",
	}
}

// The portrait is a jsonb column read back by three different screens, so what has
// to hold is the round trip — and that "never chose one" stays distinguishable from
// "chose one and it happens to be the default face".
func TestAvatarRoundTripsAndOverwrites(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewUserRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// Before anything is chosen: absent, not an empty map. The client's fallback is a
	// face seeded from the user id, and it can only pick that if nil means nil.
	before, err := repo.GetProfile(ctx, uid)
	if err != nil {
		t.Fatalf("GetProfile: %v", err)
	}
	if before != nil && before.Avatar != nil {
		t.Fatalf("a fresh profile already has a portrait: %v", before.Avatar)
	}

	if err := repo.SetAvatar(ctx, uid, spec()); err != nil {
		t.Fatalf("SetAvatar: %v", err)
	}
	got, err := repo.GetProfile(ctx, uid)
	if err != nil || got == nil {
		t.Fatalf("GetProfile after write: %v", err)
	}
	if got.Avatar["hair"] != "bob" || got.Avatar["acc"] != "glassesRound" || len(got.Avatar) != 10 {
		t.Fatalf("read back %v", got.Avatar)
	}

	// Choosing again replaces the whole face rather than merging into the old one —
	// a merge would leave an axis the learner just changed showing its old value.
	next := spec()
	next["hair"] = "afro"
	delete(next, "acc")
	next["acc"] = "none"
	if err := repo.SetAvatar(ctx, uid, next); err != nil {
		t.Fatalf("SetAvatar(again): %v", err)
	}
	got, _ = repo.GetProfile(ctx, uid)
	if got.Avatar["hair"] != "afro" || got.Avatar["acc"] != "none" {
		t.Fatalf("second write read back %v", got.Avatar)
	}
}

// SetAvatar is a single-field patch. Through UpsertProfile it would fill the columns
// it was not given with onboarding defaults — so saving a face would reset the
// learner's job and languages, which is the bug SetDisplayName's comment warns about.
func TestSettingAvatarDoesNotResetTheProfile(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewUserRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	if err := repo.SetDisplayName(ctx, uid, "지민"); err != nil {
		t.Fatalf("SetDisplayName: %v", err)
	}
	if err := repo.SetUILang(ctx, uid, "ja"); err != nil {
		t.Fatalf("SetUILang: %v", err)
	}
	if err := repo.SetAvatar(ctx, uid, spec()); err != nil {
		t.Fatalf("SetAvatar: %v", err)
	}

	got, err := repo.GetProfile(ctx, uid)
	if err != nil || got == nil {
		t.Fatalf("GetProfile: %v", err)
	}
	if got.DisplayName != "지민" {
		t.Errorf("display name = %q", got.DisplayName)
	}
	if got.UILang != "ja" {
		t.Errorf("ui lang = %q", got.UILang)
	}
	if got.Avatar["hair"] != "bob" {
		t.Errorf("avatar = %v", got.Avatar)
	}
}

// Avatars() is what a lounge page and a colleague list read: many people, one query.
func TestAvatarsResolvesManyAndOmitsWhoNeverChose(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewUserRepo(pool)
	chose := speechTestUser(t, pool)
	never := speechTestUser(t, pool)
	ctx := context.Background()

	if err := repo.SetAvatar(ctx, chose, spec()); err != nil {
		t.Fatalf("SetAvatar: %v", err)
	}
	got, err := repo.Avatars(ctx, []string{chose, never})
	if err != nil {
		t.Fatalf("Avatars: %v", err)
	}
	if _, ok := got[never]; ok {
		t.Error("a user who never chose a portrait came back in the map")
	}
	if got[chose]["outfit"] != "labCoat" {
		t.Fatalf("resolved %v", got)
	}
	// An empty id list must not become "SELECT … = ANY('{}')" round trip either.
	if empty, err := repo.Avatars(ctx, nil); err != nil || len(empty) != 0 {
		t.Errorf("Avatars(nil) = %v, %v", empty, err)
	}
}

// The lounge card draws the author, so the feed has to carry their portrait — and a
// post by somebody who never opened the picker must still be a post.
func TestLoungeFeedCarriesTheAuthorsPortrait(t *testing.T) {
	pool := speechTestPool(t)
	users := NewUserRepo(pool)
	lg := NewLoungeRepo(pool)
	author := speechTestUser(t, pool)
	plain := speechTestUser(t, pool)
	ctx := context.Background()

	if err := users.SetAvatar(ctx, author, spec()); err != nil {
		t.Fatalf("SetAvatar: %v", err)
	}
	withFace, err := lg.Create(ctx, author, lounge.Draft{Kind: lounge.KindTalk, Body: "얼굴 있음"})
	if err != nil {
		t.Fatal(err)
	}
	without, err := lg.Create(ctx, plain, lounge.Draft{Kind: lounge.KindTalk, Body: "얼굴 없음"})
	if err != nil {
		t.Fatal(err)
	}

	posts, err := lg.Feed(ctx, author, nil, 50)
	if err != nil {
		t.Fatalf("Feed: %v", err)
	}
	byID := map[string]map[string]string{}
	for _, p := range posts {
		byID[p.ID] = p.AuthorAvatar
	}
	if byID[withFace]["hair"] != "bob" {
		t.Errorf("the author's portrait did not reach the feed: %v", byID[withFace])
	}
	if byID[without] != nil {
		t.Errorf("a writer who never chose a portrait came back with %v, want nil", byID[without])
	}
}
