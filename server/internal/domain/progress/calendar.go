package progress

import (
	"sort"
	"time"
)

// A calendar of what the learner actually did, day by day.
//
// The growth report used to be four counters and a ten-day strip: it said how much,
// never when or what. This carries both, because "언제 공부했는지"는 간호사에게
// 근무표와 같은 정보다 — a nurse reading their own week wants to see it the way a
// roster looks, and the roster's unit is a shift.
//
// The band is derived here rather than in SQL so the boundaries are one testable rule
// instead of a string inside a query, and so a second profession can reinterpret the
// same hours without a migration.

// Band is the part of the day an attempt happened in. Codes, not labels: the client
// renders them per job (a nurse sees 데이/이브닝/나이트, an office worker sees the
// plain time of day), and a label baked in here would force every job to borrow
// hospital vocabulary.
type Band string

const (
	BandDay     Band = "day"     // 06:00–13:59
	BandEvening Band = "evening" // 14:00–21:59
	BandNight   Band = "night"   // 22:00–05:59
)

// BandForHour maps a local hour (0-23) to its band.
//
// The boundaries are the standard three-shift split used on hospital wards (day 07,
// evening 15, night 23 in many rosters — rounded here to 06/14/22 so that a learner
// studying just before a shift still lands in that shift's band rather than the one
// before it). Hours outside 0-23 are treated as day: an out-of-range hour means the
// caller mis-derived it, and inventing a night shift from a bug is worse than a
// visibly boring default.
func BandForHour(h int) Band {
	// Explicit, because `h >= 22` would otherwise swallow a bogus 99 into the night
	// band and the comment above would be a lie — which a test caught.
	if h < 0 || h > 23 {
		return BandDay
	}
	switch {
	case h >= 22 || h < 6:
		return BandNight
	case h < 14:
		return BandDay
	default:
		return BandEvening
	}
}

// CalendarEntry is one thing the learner touched on a day.
type CalendarEntry struct {
	ScenarioID string `json:"scenarioId"`
	Title      string `json:"title"`
	Cleared    bool   `json:"cleared"`
	Hour       int    `json:"hour"` // local hour it started, 0-23
}

// ClearedScenario is one scenario the learner cleared, with the AI grade (−1 when the run
// had no grade) and when it was cleared — the raw material for handoff notes.
type ClearedScenario struct {
	ScenarioID string
	Grade      int
	ClearedAt  time.Time
}

// CalendarDay aggregates a single local date.
type CalendarDay struct {
	Date string `json:"date"` // YYYY-MM-DD in the caller's timezone
	// Band is the day's dominant band — where most of the work happened. A day split
	// across two bands reports the busier one rather than both: the calendar cell has
	// room for one mark, and the entries below it carry the detail.
	Band     Band            `json:"band"`
	Sessions int             `json:"sessions"`
	Cleared  int             `json:"cleared"`
	Entries  []CalendarEntry `json:"entries"`
}

// BuildCalendar folds per-attempt rows into days with a dominant band.
//
// Rows may arrive in any order and may repeat a scenario within a day (a retry is a
// second attempt): repeats are kept, because "이 날 뭘 했는지" includes trying the same
// thing twice, and collapsing them would make a day of hard work look like a light one.
func BuildCalendar(rows []CalendarEntry, dates []string) []CalendarDay {
	byDate := map[string][]CalendarEntry{}
	for i, r := range rows {
		byDate[dates[i]] = append(byDate[dates[i]], r)
	}

	out := make([]CalendarDay, 0, len(byDate))
	for date, entries := range byDate {
		sort.SliceStable(entries, func(i, j int) bool { return entries[i].Hour < entries[j].Hour })
		count := map[Band]int{}
		cleared := 0
		for _, e := range entries {
			count[BandForHour(e.Hour)]++
			if e.Cleared {
				cleared++
			}
		}
		out = append(out, CalendarDay{
			Date: date, Band: dominant(count), Sessions: len(entries),
			Cleared: cleared, Entries: entries,
		})
	}
	// Oldest first, so the client can lay out a month without sorting.
	sort.Slice(out, func(i, j int) bool { return out[i].Date < out[j].Date })
	return out
}

// dominant picks the band with the most attempts, breaking ties toward the later part
// of the day — a tie means the learner drifted later as the day went on, and that is
// the shift they would say they worked.
func dominant(count map[Band]int) Band {
	best, bestN := BandDay, -1
	for _, b := range []Band{BandDay, BandEvening, BandNight} {
		if n := count[b]; n >= bestN && n > 0 {
			best, bestN = b, n
		}
	}
	return best
}
