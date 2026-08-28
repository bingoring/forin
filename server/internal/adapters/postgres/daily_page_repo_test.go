package postgres

import (
	"context"
	"testing"
)

// The two things about 오늘의 호출 that only exist in SQL, and both are the difference
// between a bonus and an exploit.
func TestTodaysPageIsIssuedOnceAndDoesNotDrift(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	first, err := repo.TodaysPage(ctx, uid, "2026-08-28", "SCN-ER-00001")
	if err != nil || first == nil {
		t.Fatalf("TodaysPage: %v", err)
	}
	if first.ScenarioID != "SCN-ER-00001" {
		t.Fatalf("scenario = %q", first.ScenarioID)
	}

	// A second look the same day must return the SAME call, even though the caller
	// offers a different target: the pick is stable per day, and a call that changes
	// under a reload is a call the learner cannot decide about.
	again, err := repo.TodaysPage(ctx, uid, "2026-08-28", "SCN-WARD-99999")
	if err != nil || again == nil {
		t.Fatalf("TodaysPage(again): %v", err)
	}
	if again.ScenarioID != "SCN-ER-00001" {
		t.Fatalf("the call drifted to %q on the second look", again.ScenarioID)
	}
	// And issued_at is the FIRST look, so the countdown does not restart every time the
	// home screen is opened.
	if !again.IssuedAt.Equal(first.IssuedAt) {
		t.Fatalf("issuedAt moved: %v → %v", first.IssuedAt, again.IssuedAt)
	}

	// Tomorrow is a new call.
	tom, err := repo.TodaysPage(ctx, uid, "2026-08-29", "SCN-ICU-00007")
	if err != nil || tom == nil {
		t.Fatalf("TodaysPage(tomorrow): %v", err)
	}
	if tom.ScenarioID != "SCN-ICU-00007" {
		t.Fatalf("tomorrow's call = %q, want the new target", tom.ScenarioID)
	}
}

func TestTodaysPageWithNoTargetDoesNotInventOne(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// No candidates today (an empty daily pool). The read must not create a row with an
	// empty scenario_id — a call pointing nowhere is a button that cannot work.
	got, err := repo.TodaysPage(ctx, uid, "2026-08-28", "")
	if err != nil {
		t.Fatalf("TodaysPage: %v", err)
	}
	if got != nil {
		t.Fatalf("a call was invented with no target: %+v", got)
	}
}

func TestAnswerPagePaysExactlyOnce(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	if _, err := repo.TodaysPage(ctx, uid, "2026-08-28", "SCN-ER-00001"); err != nil {
		t.Fatalf("TodaysPage: %v", err)
	}

	id, first, err := repo.AnswerPage(ctx, uid, "2026-08-28")
	if err != nil || !first || id != "SCN-ER-00001" {
		t.Fatalf("AnswerPage = (%q, %v, %v), want the scenario and first=true", id, first, err)
	}

	// The second answer reports first=false, which is what stops the caller paying the
	// +40 twice. Without the `answered_at IS NULL` in the UPDATE, tapping 지금 응답
	// repeatedly would farm XP.
	_, again, err := repo.AnswerPage(ctx, uid, "2026-08-28")
	if err != nil {
		t.Fatalf("AnswerPage(again): %v", err)
	}
	if again {
		t.Fatal("a second answer reported itself as the first")
	}

	// And the record shows it.
	rec, err := repo.TodaysPage(ctx, uid, "2026-08-28", "")
	if err != nil || rec == nil {
		t.Fatalf("TodaysPage: %v", err)
	}
	if rec.AnsweredAt == nil {
		t.Fatal("answeredAt not recorded")
	}
}

func TestAnswerPageOnADayWithNoCall(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)

	// No row: not an error, just nothing to answer. An error here would turn "you have
	// no call today" into a failed request on the home screen.
	_, first, err := repo.AnswerPage(context.Background(), uid, "2026-08-28")
	if err != nil {
		t.Fatalf("AnswerPage: %v", err)
	}
	if first {
		t.Fatal("answered a call that was never issued")
	}
}

func TestAddBonusXPAddsWithoutLoggingAnAttempt(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// A progress row has to exist for XP to land anywhere; RecordAttempt creates it.
	if _, err := repo.RecordAttempt(ctx, uid, "SCN-ER-00001", 100, "cleared", 80); err != nil {
		t.Fatalf("RecordAttempt: %v", err)
	}
	before, err := repo.GetProgress(ctx, uid)
	if err != nil || before == nil {
		t.Fatalf("GetProgress: %v", err)
	}

	if err := repo.AddBonusXP(ctx, uid, 40); err != nil {
		t.Fatalf("AddBonusXP: %v", err)
	}
	after, err := repo.GetProgress(ctx, uid)
	if err != nil {
		t.Fatalf("GetProgress: %v", err)
	}
	if after.XP != before.XP+40 {
		t.Fatalf("xp %d → %d, want +40", before.XP, after.XP)
	}
}

func TestAddBonusXPWithNoProgressRowIsNotAnError(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)

	// Nothing earned yet, so there is nothing to add to. Failing here would make the
	// answer endpoint 500 for a learner whose very first action was the call.
	if err := repo.AddBonusXP(context.Background(), uid, 40); err != nil {
		t.Fatalf("AddBonusXP with no progress row: %v", err)
	}
}
