package home

import (
	"github.com/bingoring/forin/server/internal/domain/progress"
	"testing"
	"time"
)

func pools() Pools {
	mk := func(id, dept string) MentorNote { return MentorNote{ID: id, Dept: dept, Text: id} }
	ph := func(id, dept string) Phrase { return Phrase{ID: id, Dept: dept, EN: id} }
	return Pools{
		MentorNotes: []MentorNote{mk("er-1", "er"), mk("er-2", "er"), mk("c-1", ""), mk("c-2", "")},
		Phrases:     []Phrase{ph("p-er", "er"), ph("p-c1", ""), ph("p-c2", "")},
	}
}

func TestPicksAreStablePerUserDay(t *testing.T) {
	p := pools()
	a := PickMentorNote(p, "u1", "2026-08-10", "er")
	b := PickMentorNote(p, "u1", "2026-08-10", "er")
	if a.ID != b.ID {
		t.Fatalf("same user + same day must pick the same note, got %s then %s", a.ID, b.ID)
	}
	if s1, s2 := DeriveShift("u1", "2026-08-10", "ER"), DeriveShift("u1", "2026-08-10", "ER"); s1 != s2 {
		t.Fatalf("shift must be stable within a day, got %v then %v", s1, s2)
	}
}

func TestPicksChangeAcrossDays(t *testing.T) {
	// Not a guarantee for any single pair of days, but over a stretch the pick
	// must move — otherwise the card is effectively frozen.
	p := pools()
	seen := map[string]bool{}
	for d := 1; d <= 14; d++ {
		day := time.Date(2026, 8, d, 0, 0, 0, 0, time.UTC).Format("2006-01-02")
		seen[PickMentorNote(p, "u1", day, "er").ID] = true
	}
	if len(seen) < 2 {
		t.Fatalf("expected the note to vary over two weeks, only saw %v", seen)
	}
}

func TestDeptPoolPreferredOverCommon(t *testing.T) {
	p := pools()
	for d := 1; d <= 20; d++ {
		day := time.Date(2026, 8, d, 0, 0, 0, 0, time.UTC).Format("2006-01-02")
		got := PickMentorNote(p, "u1", day, "er")
		if got.Dept != "er" {
			t.Fatalf("a department with its own notes must not fall back to common, got %s", got.ID)
		}
	}
}

func TestFallsBackToCommonPool(t *testing.T) {
	p := pools()
	got := PickMentorNote(p, "u1", "2026-08-10", "icu") // no icu-specific notes
	if got == nil || got.Dept != "" {
		t.Fatalf("expected a common-pool note, got %+v", got)
	}
}

func TestEmptyPoolYieldsNil(t *testing.T) {
	// The module is hidden rather than filled with a placeholder (더미 금지).
	if got := PickMentorNote(Pools{}, "u1", "2026-08-10", "er"); got != nil {
		t.Fatalf("empty pool must yield nil, got %+v", got)
	}
	if got := PickPhrase(Pools{}, "u1", "2026-08-10", "er"); got != nil {
		t.Fatalf("empty pool must yield nil, got %+v", got)
	}
}

func TestRecentRhythmIsRollingAndEndsToday(t *testing.T) {
	seoul, err := time.LoadLocation("Asia/Seoul")
	if err != nil {
		t.Skip("tzdata unavailable")
	}
	now := time.Date(2026, 8, 13, 9, 0, 0, 0, seoul)
	got := RecentRhythm([]string{"2026-08-10", "2026-08-12"}, now, seoul)

	if len(got) != progress.StreakWindowDays {
		t.Fatalf("length = %d, want StreakWindowDays (%d)", len(got), progress.StreakWindowDays)
	}
	// The window ends today, so the LAST cell is today — not a weekday index.
	// This is the property the Monday-anchored version got wrong.
	if got[len(got)-1] != 2 {
		t.Fatalf("last cell must be today, got %v", got)
	}
	// 2026-08-13 minus 9 days = 08-04, so 08-10 is index 6 and 08-12 index 8.
	want := make([]int, progress.StreakWindowDays)
	want[6], want[8], want[9] = 1, 1, 2
	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("RecentRhythm = %v, want %v", got, want)
		}
	}
}

func TestRecentRhythmMarksTodayEvenWhenActive(t *testing.T) {
	seoul, _ := time.LoadLocation("Asia/Seoul")
	if seoul == nil {
		t.Skip("tzdata unavailable")
	}
	now := time.Date(2026, 8, 13, 9, 0, 0, 0, seoul)
	got := RecentRhythm([]string{"2026-08-13"}, now, seoul)
	if got[len(got)-1] != 2 {
		t.Fatalf("today must render as 2 even when it is also active, got %v", got)
	}
}

// A date outside the window must not leak in — the old week version could not
// have this bug because its query was week-bounded; the rolling one takes
// whatever the caller passes.
func TestRecentRhythmIgnoresDatesOutsideWindow(t *testing.T) {
	seoul, _ := time.LoadLocation("Asia/Seoul")
	if seoul == nil {
		t.Skip("tzdata unavailable")
	}
	now := time.Date(2026, 8, 13, 9, 0, 0, 0, seoul)
	got := RecentRhythm([]string{"2026-07-01", "2026-12-25"}, now, seoul)
	for i, v := range got[:len(got)-1] {
		if v != 0 {
			t.Fatalf("cell %d filled from an out-of-window date: %v", i, got)
		}
	}
}
