package postgres

import (
	"context"
	"testing"
)

// STEP 1/2 completion is its own record, idempotent, and scoped to one situation.
func TestLessonStepClearsAreIdempotentAndPerScenario(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewLessonRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	for i := 0; i < 2; i++ {
		if err := repo.ClearStep(ctx, uid, "SCN-ER-00101", "words", []string{"w-scale"}); err != nil {
			t.Fatalf("ClearStep #%d: %v", i+1, err)
		}
	}
	got, err := repo.StepClears(ctx, uid, "SCN-ER-00101")
	if err != nil {
		t.Fatalf("StepClears: %v", err)
	}
	if _, ok := got["words"]; len(got) != 1 || !ok {
		t.Fatalf("got %v, want only words", got)
	}
	if m := got["words"].Missed; len(m) != 1 || m[0] != "w-scale" {
		t.Fatalf("missed %v, want [w-scale]", m)
	}
	// The latest run's misses replace the first run's.
	_ = repo.ClearStep(ctx, uid, "SCN-ER-00101", "words", nil)
	again, _ := repo.StepClears(ctx, uid, "SCN-ER-00101")
	if len(again["words"].Missed) != 0 {
		t.Fatalf("missed after a clean rerun: %v", again["words"].Missed)
	}
	other, _ := repo.StepClears(ctx, uid, "SCN-ER-00102")
	if len(other) != 0 {
		t.Fatalf("another situation must not inherit the clear: %v", other)
	}
}

// A theme with no bank yet is not an error — most departments have none so far.
func TestLessonLexiconMissingThemeIsEmpty(t *testing.T) {
	pool := speechTestPool(t)
	words, err := NewLessonRepo(pool).Lexicon(context.Background(), "no-such-theme")
	if err != nil || words != nil {
		t.Fatalf("got %v, %v", words, err)
	}
}
