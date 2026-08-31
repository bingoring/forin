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

func TestAcceptingIsNotAnswering(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()
	const day = "2026-08-28"

	if _, err := repo.TodaysPage(ctx, uid, day, "SCN-ER-00001"); err != nil {
		t.Fatalf("TodaysPage: %v", err)
	}
	if _, err := repo.AcceptPage(ctx, uid, day); err != nil {
		t.Fatalf("AcceptPage: %v", err)
	}

	// Took the call and walked straight back out. This used to pay in full and report
	// "응답 완료 · 보너스 +40 XP" — the app telling someone they did something they did
	// not do.
	paid, err := repo.CompletePageIfAttempted(ctx, uid, day)
	if err != nil {
		t.Fatalf("CompletePageIfAttempted: %v", err)
	}
	if paid {
		t.Fatal("the bonus was paid for tapping the button")
	}
	rec, _ := repo.TodaysPage(ctx, uid, day, "")
	if rec.AnsweredAt != nil {
		t.Fatal("marked answered without going")
	}
	if rec.AcceptedAt == nil {
		t.Fatal("the acceptance was not recorded")
	}

	// Now they actually go.
	if _, err := repo.RecordAttempt(ctx, uid, "SCN-ER-00001", 100, "cleared", 80, "free"); err != nil {
		t.Fatalf("RecordAttempt: %v", err)
	}
	paid, err = repo.CompletePageIfAttempted(ctx, uid, day)
	if err != nil || !paid {
		t.Fatalf("CompletePageIfAttempted after going = (%v, %v), want paid", paid, err)
	}

	// And exactly once.
	again, err := repo.CompletePageIfAttempted(ctx, uid, day)
	if err != nil {
		t.Fatalf("CompletePageIfAttempted(again): %v", err)
	}
	if again {
		t.Fatal("the bonus was payable twice")
	}
}

func TestAnAttemptBeforeAcceptingDoesNotCount(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()
	const day = "2026-08-28"

	// Played the scenario earlier today, THEN the call arrived pointing at it. Answering
	// a call means going now; an attempt from before it was taken is not that, and
	// counting it would pay the bonus for doing nothing.
	if _, err := repo.RecordAttempt(ctx, uid, "SCN-ER-00001", 100, "cleared", 80, "free"); err != nil {
		t.Fatalf("RecordAttempt: %v", err)
	}
	if _, err := repo.TodaysPage(ctx, uid, day, "SCN-ER-00001"); err != nil {
		t.Fatalf("TodaysPage: %v", err)
	}
	if _, err := repo.AcceptPage(ctx, uid, day); err != nil {
		t.Fatalf("AcceptPage: %v", err)
	}
	paid, err := repo.CompletePageIfAttempted(ctx, uid, day)
	if err != nil {
		t.Fatalf("CompletePageIfAttempted: %v", err)
	}
	if paid {
		t.Fatal("an attempt from before the call was accepted paid the bonus")
	}
}

func TestCompleteWithoutAcceptingPaysNothing(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()
	const day = "2026-08-28"

	if _, err := repo.TodaysPage(ctx, uid, day, "SCN-ER-00001"); err != nil {
		t.Fatalf("TodaysPage: %v", err)
	}
	if _, err := repo.RecordAttempt(ctx, uid, "SCN-ER-00001", 100, "cleared", 80, "free"); err != nil {
		t.Fatalf("RecordAttempt: %v", err)
	}
	// Played it on their own, never took the call. No bonus: the call was not answered.
	paid, err := repo.CompletePageIfAttempted(ctx, uid, day)
	if err != nil {
		t.Fatalf("CompletePageIfAttempted: %v", err)
	}
	if paid {
		t.Fatal("the bonus was paid without the call being taken")
	}
}

func TestAcceptOnADayWithNoCall(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)

	// No row: not an error, just nothing to take. An error here would turn "you have no
	// call today" into a failed request on the home screen.
	id, err := repo.AcceptPage(context.Background(), uid, "2026-08-28")
	if err != nil {
		t.Fatalf("AcceptPage: %v", err)
	}
	if id != "" {
		t.Fatalf("accepted a call that was never issued: %q", id)
	}
}

func TestAddBonusXPAddsWithoutLoggingAnAttempt(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// A progress row has to exist for XP to land anywhere; RecordAttempt creates it.
	if _, err := repo.RecordAttempt(ctx, uid, "SCN-ER-00001", 100, "cleared", 80, "free"); err != nil {
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
