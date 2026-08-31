package postgres

import (
	"context"
	"testing"
)

// The ladder has two rungs, and only the attempt row can tell them apart.
func TestAHelpedClearIsNotAClearAlone(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// Finished it with three replies on screen.
	if _, err := repo.RecordAttempt(ctx, uid, "SCN-ORIENT-00001", 100, "cleared", 82, "choices"); err != nil {
		t.Fatalf("RecordAttempt(choices): %v", err)
	}
	guided, err := repo.GuidedPassesCleared(ctx, uid)
	if err != nil {
		t.Fatalf("GuidedPassesCleared: %v", err)
	}
	if !guided["SCN-ORIENT-00001"] {
		t.Fatal("a guided clear was not recorded as one — the free pass would never unlock")
	}

	// A clear made ALONE is not a guided one. Counting it as such is how the second rung
	// would disappear: the app would think they had already been walked through it.
	if _, err := repo.RecordAttempt(ctx, uid, "SCN-ER-00002", 100, "cleared", 90, "free"); err != nil {
		t.Fatalf("RecordAttempt(free): %v", err)
	}
	guided, _ = repo.GuidedPassesCleared(ctx, uid)
	if guided["SCN-ER-00002"] {
		t.Fatal("an unaided clear was counted as a guided pass")
	}
}

func TestAnAbandonedGuidedRunDoesNotUnlockTheFreePass(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// Played it with help and did not pass. The guided rung is not done, so the next run
	// is still the guided one — being handed the hard version for walking out early
	// would punish exactly the learner this feature is for.
	if _, err := repo.RecordAttempt(ctx, uid, "SCN-ORIENT-00001", 10, "attempted", 40, "choices"); err != nil {
		t.Fatalf("RecordAttempt: %v", err)
	}
	guided, err := repo.GuidedPassesCleared(ctx, uid)
	if err != nil {
		t.Fatalf("GuidedPassesCleared: %v", err)
	}
	if guided["SCN-ORIENT-00001"] {
		t.Fatal("an attempt that did not pass unlocked the free pass")
	}
}

func TestAttemptsFromBeforeTheColumnExistedReadAsUnaided(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// The column defaults to '', which is what every attempt recorded before this
	// feature carries. Those runs had no help, so they must not count as guided passes —
	// otherwise every existing learner would skip the first rung of every ladder.
	if _, err := pool.Exec(ctx,
		`INSERT INTO scenario_attempts (user_id, scenario_id, state, score, cleared_at) VALUES ($1, $2, 'cleared', 100, now())`,
		uid, "SCN-LEGACY-00001"); err != nil {
		t.Fatalf("insert legacy attempt: %v", err)
	}
	guided, err := repo.GuidedPassesCleared(ctx, uid)
	if err != nil {
		t.Fatalf("GuidedPassesCleared: %v", err)
	}
	if guided["SCN-LEGACY-00001"] {
		t.Fatal("a pre-feature attempt was counted as a guided pass")
	}
}
