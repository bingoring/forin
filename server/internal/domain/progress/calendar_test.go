package progress

import "testing"

func TestBandBoundaries(t *testing.T) {
	// The exact edges, because an off-by-one here silently mislabels a whole shift.
	cases := map[int]Band{
		0: BandNight, 5: BandNight, 6: BandDay, 13: BandDay,
		14: BandEvening, 21: BandEvening, 22: BandNight, 23: BandNight,
	}
	for h, want := range cases {
		if got := BandForHour(h); got != want {
			t.Errorf("hour %d → %s, want %s", h, got, want)
		}
	}
	// An out-of-range hour means the caller mis-derived it; a boring default beats
	// inventing a night shift from a bug. Both directions, because `h >= 22` catches a
	// bogus 99 unless the guard runs first — which is exactly what this caught.
	for _, h := range []int{-1, 24, 99} {
		if got := BandForHour(h); got != BandDay {
			t.Errorf("out-of-range hour %d → %s, want day", h, got)
		}
	}
}

func TestBuildCalendarGroupsAndPicksDominantBand(t *testing.T) {
	rows := []CalendarEntry{
		{ScenarioID: "A", Hour: 9, Cleared: true},   // day
		{ScenarioID: "B", Hour: 10, Cleared: false}, // day
		{ScenarioID: "C", Hour: 23, Cleared: true},  // night
		{ScenarioID: "D", Hour: 15, Cleared: true},  // evening
	}
	dates := []string{"2026-08-18", "2026-08-18", "2026-08-18", "2026-08-19"}

	days := BuildCalendar(rows, dates)
	if len(days) != 2 {
		t.Fatalf("want 2 days, got %d", len(days))
	}
	// Oldest first so the client lays out a month without sorting.
	if days[0].Date != "2026-08-18" || days[1].Date != "2026-08-19" {
		t.Fatalf("not sorted: %s, %s", days[0].Date, days[1].Date)
	}
	// Two day-band attempts against one night → day.
	if days[0].Band != BandDay {
		t.Errorf("18th band = %s, want day", days[0].Band)
	}
	if days[0].Sessions != 3 || days[0].Cleared != 2 {
		t.Errorf("18th sessions=%d cleared=%d", days[0].Sessions, days[0].Cleared)
	}
	// Entries ordered by hour, so a day reads chronologically.
	if days[0].Entries[0].ScenarioID != "A" || days[0].Entries[2].ScenarioID != "C" {
		t.Errorf("entries not ordered by hour: %+v", days[0].Entries)
	}
	if days[1].Band != BandEvening {
		t.Errorf("19th band = %s, want evening", days[1].Band)
	}
}

// A retry is a second attempt and must not be collapsed: a day of hard work would
// otherwise look like a light one.
func TestBuildCalendarKeepsRepeats(t *testing.T) {
	rows := []CalendarEntry{
		{ScenarioID: "A", Hour: 9}, {ScenarioID: "A", Hour: 11}, {ScenarioID: "A", Hour: 12},
	}
	days := BuildCalendar(rows, []string{"2026-08-18", "2026-08-18", "2026-08-18"})
	if days[0].Sessions != 3 || len(days[0].Entries) != 3 {
		t.Errorf("repeats collapsed: sessions=%d entries=%d", days[0].Sessions, len(days[0].Entries))
	}
}

// A tie leans later — the learner drifted into the evening, and that is the shift they
// would say they worked.
func TestTieLeansLater(t *testing.T) {
	rows := []CalendarEntry{{ScenarioID: "A", Hour: 9}, {ScenarioID: "B", Hour: 15}}
	days := BuildCalendar(rows, []string{"2026-08-18", "2026-08-18"})
	if days[0].Band != BandEvening {
		t.Errorf("tie → %s, want evening", days[0].Band)
	}
}

func TestBuildCalendarEmpty(t *testing.T) {
	if got := BuildCalendar(nil, nil); len(got) != 0 {
		t.Errorf("want no days, got %d", len(got))
	}
}
