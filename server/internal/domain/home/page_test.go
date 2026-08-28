package home

import (
	"testing"
	"time"
)

func seoul(t *testing.T) *time.Location {
	t.Helper()
	loc, err := time.LoadLocation("Asia/Seoul")
	if err != nil {
		t.Skipf("tzdata unavailable: %v", err)
	}
	return loc
}

// "오늘 놓치면 소멸" is two rules in one sentence, and they disagree at the edges.
func TestPageDeadlineTakesWhicheverComesFirst(t *testing.T) {
	loc := seoul(t)

	// Mid-afternoon: the window is what limits it, not the day.
	issued := time.Date(2026, 8, 28, 14, 0, 0, 0, loc)
	if got := PageDeadline(issued, loc); !got.Equal(issued.Add(time.Hour)) {
		t.Fatalf("deadline = %v, want one hour after issue", got)
	}

	// Ten minutes to midnight: the DAY is what limits it. A window alone would let a
	// call issued at 23:50 be answered at 00:30 the next morning, which is the one thing
	// "오늘 놓치면" rules out.
	late := time.Date(2026, 8, 28, 23, 50, 0, 0, loc)
	wantMidnight := time.Date(2026, 8, 29, 0, 0, 0, 0, loc)
	if got := PageDeadline(late, loc); !got.Equal(wantMidnight) {
		t.Fatalf("deadline = %v, want local midnight %v", got, wantMidnight)
	}

	// And the deadline is the LEARNER's midnight, not UTC's — Seoul is UTC+9, so a call
	// issued at 23:50 KST is 14:50 UTC and a UTC-midnight rule would give it 9 more
	// hours.
	if got := PageDeadline(late, loc).Sub(late); got > time.Hour {
		t.Fatalf("late call got %v, which is more than the window", got)
	}
}

func TestPageSecondsLeftClampsAtZero(t *testing.T) {
	loc := seoul(t)
	issued := time.Date(2026, 8, 28, 14, 0, 0, 0, loc)

	if got := PageSecondsLeft(issued, issued.Add(10*time.Minute), loc); got != 50*60 {
		t.Fatalf("secondsLeft = %d, want 3000", got)
	}
	// Past the deadline it is 0, never negative: the client has ONE condition to check,
	// and a negative countdown is a card that draws "-0:12 남음".
	if got := PageSecondsLeft(issued, issued.Add(2*time.Hour), loc); got != 0 {
		t.Fatalf("secondsLeft after expiry = %d, want 0", got)
	}
}

func TestPageScenarioIsStableForTheDay(t *testing.T) {
	pool := []string{"SCN-ER-00001", "SCN-ER-00002", "SCN-WARD-00003"}
	a := PageScenario("u1", "2026-08-28", pool)
	b := PageScenario("u1", "2026-08-28", pool)
	if a != b {
		t.Fatalf("the call changed under a reload: %q then %q", a, b)
	}
	if a == "" {
		t.Fatal("no scenario picked from a non-empty pool")
	}
	// A different day may differ; an empty pool has nothing to point at and must not
	// invent a target.
	if got := PageScenario("u1", "2026-08-28", nil); got != "" {
		t.Fatalf("PageScenario(empty) = %q, want empty", got)
	}
}

func TestPageLinesFallBackRatherThanGoingBlank(t *testing.T) {
	// The badge label is "ER · TRIAGE"; the wording is per department, so the head of
	// the label is what selects it.
	line, hint := PageLines("ER · TRIAGE")
	if line == pageFallbackLine {
		t.Fatal("ER did not get its own summons")
	}
	if hint == "" {
		t.Fatal("no hint")
	}
	// A department with no authored line still gets a call — a pager with no words is
	// worse than a generic one.
	fb, fbHint := PageLines("DERM · CLINIC")
	if fb != pageFallbackLine || fbHint != pageFallbackHint {
		t.Fatalf("unauthored dept = (%q, %q), want the fallback", fb, fbHint)
	}
	if _, h := PageLines(""); h == "" {
		t.Fatal("an empty dept produced no hint")
	}
}
