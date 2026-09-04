// Package home assembles the home tab: the day's shift flavour and the two
// content-pool cards (mentor note, phrase of the day).
//
// Everything here is DERIVED, never stored. Picks are deterministic in
// (user, local date) so re-opening the app doesn't reshuffle the day — a home
// screen that changes under you reads as broken, not lively.
package home

import (
	"github.com/bingoring/forin/server/internal/domain/progress"
	"hash/fnv"
	"time"
)

// ReviewGoalPerDay is the daily target for the work brief's 복습 task.
const ReviewGoalPerDay = 5

// Shift is the day's roster flavour. Weather was deliberately dropped: it would
// be the one value on this screen that isn't true (Build Spec Q1).
type Shift struct {
	Shift     string `json:"shift"` // DAY | EVENING
	DeptLabel string `json:"deptLabel"`
}

// MentorNote is one line of advice from a senior-nurse NPC.
type MentorNote struct {
	ID   string `json:"id" yaml:"id"`
	Dept string `json:"-" yaml:"dept"` // "" = any department
	NPC  struct {
		Name string `json:"name" yaml:"name"`
		Role string `json:"role" yaml:"role"`
		Dept string `json:"dept" yaml:"dept"`
	} `json:"npc" yaml:"npc"`
	Text string `json:"text" yaml:"text"`
}

// Phrase is one field expression shown on the flip card.
type Phrase struct {
	ID   string `json:"id" yaml:"id"`
	Dept string `json:"-" yaml:"dept"`
	EN   string `json:"en" yaml:"en"`
	KO   string `json:"ko" yaml:"ko"`
	Note string `json:"note,omitempty" yaml:"note"`
}

// Pools is the authored home content, loaded once at boot.
type Pools struct {
	MentorNotes []MentorNote
	Phrases     []Phrase
}

var shifts = []string{"DAY", "EVENING"}

// seed hashes the inputs that must produce a stable pick for one user-day.
func seed(parts ...string) uint64 {
	h := fnv.New64a()
	for i, p := range parts {
		if i > 0 {
			_, _ = h.Write([]byte{'|'})
		}
		_, _ = h.Write([]byte(p))
	}
	return h.Sum64()
}

// DayKey is the local calendar date used for every pick on this screen.
func DayKey(now time.Time, loc *time.Location) string {
	if loc == nil {
		loc = time.UTC
	}
	return now.In(loc).Format("2006-01-02")
}

// DeriveShift picks today's shift. The DEPARTMENT is not random — it is the
// department of the user's current curriculum step, so "today's posting" always
// matches what the app is about to ask them to do.
func DeriveShift(userID, day, deptLabel string) Shift {
	return Shift{
		Shift:     shifts[seed(userID, day, "shift")%uint64(len(shifts))],
		DeptLabel: deptLabel,
	}
}

// PickMentorNote returns the day's note, preferring the current department and
// falling back to the shared pool. Returns nil when nothing matches — the caller
// omits the module rather than inventing a line.
func PickMentorNote(p Pools, userID, day, dept string) *MentorNote {
	pool := filterNotes(p.MentorNotes, dept)
	if len(pool) == 0 {
		return nil
	}
	return &pool[seed(userID, day, "mentor")%uint64(len(pool))]
}

// PickPhrase mirrors PickMentorNote for the expression card.
func PickPhrase(p Pools, userID, day, dept string) *Phrase {
	pool := filterPhrases(p.Phrases, dept)
	if len(pool) == 0 {
		return nil
	}
	return &pool[seed(userID, day, "phrase")%uint64(len(pool))]
}

// filterNotes keeps department-specific entries when any exist, otherwise the
// shared ones. Mixing both would make a department's own voice rare.
func filterNotes(all []MentorNote, dept string) []MentorNote {
	var scoped, common []MentorNote
	for _, n := range all {
		switch n.Dept {
		case dept:
			if dept != "" {
				scoped = append(scoped, n)
			} else {
				common = append(common, n)
			}
		case "":
			common = append(common, n)
		}
	}
	if len(scoped) > 0 {
		return scoped
	}
	return common
}

func filterPhrases(all []Phrase, dept string) []Phrase {
	var scoped, common []Phrase
	for _, p := range all {
		switch p.Dept {
		case dept:
			if dept != "" {
				scoped = append(scoped, p)
			} else {
				common = append(common, p)
			}
		case "":
			common = append(common, p)
		}
	}
	if len(scoped) > 0 {
		return scoped
	}
	return common
}

// RecentRhythm turns the active dates into the attendance strip's blocks:
// 0 = no study, 1 = studied, 2 = today. The window is ROLLING and ends today
// (progress.StreakWindowDays long), replacing the old Monday-anchored week —
// a week number told the learner nothing, and a Monday anchor made a Sunday
// start read as a broken streak. Index 0 is the oldest day, the last is today.
func RecentRhythm(activeDates []string, now time.Time, loc *time.Location) []int {
	if loc == nil {
		loc = time.UTC
	}
	active := make(map[string]bool, len(activeDates))
	for _, d := range activeDates {
		active[d] = true
	}
	local := now.In(loc)
	today := local.Format("2006-01-02")

	n := progress.StreakWindowDays
	out := make([]int, n)
	for i := 0; i < n; i++ {
		day := local.AddDate(0, 0, -(n - 1 - i)).Format("2006-01-02")
		switch {
		case day == today:
			out[i] = 2
		case active[day]:
			out[i] = 1
		}
	}
	return out
}
