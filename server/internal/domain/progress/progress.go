// Package progress holds growth/progress entities and the spaced-repetition
// (SM-2) review algorithm. Pure domain — no infrastructure.
package progress

import (
	"time"

	"github.com/bingoring/forin/server/internal/economy"
)

// Progress is a user's growth snapshot.
type Progress struct {
	XP                  int    `json:"xp"`
	Level               int    `json:"level"`
	Rank                string `json:"rank"`
	PatientSatisfaction int    `json:"patientSatisfaction"`
	PeerTrust           int    `json:"peerTrust"`
	EmergencyResponse   int    `json:"emergencyResponse"`
	StreakCurrent       int    `json:"streakCurrent"`
	StreakLongest       int    `json:"streakLongest"`
}

// GrowthStats is the aggregated activity behind the "성장 리포트" screen:
// scenario clears, new review cards, and active conversation time for today and
// the current (Monday-first) week, plus the distinct active dates this week.
type GrowthStats struct {
	ScenariosToday           int      `json:"scenariosToday"`
	ScenariosWeek            int      `json:"scenariosWeek"`
	ScenariosTotal           int      `json:"scenariosTotal"` // lifetime clears → praise stickers (1 each)
	NewCardsToday            int      `json:"newCardsToday"`
	NewCardsWeek             int      `json:"newCardsWeek"`
	ConversationSecondsToday int      `json:"conversationSecondsToday"`
	ConversationSecondsWeek  int      `json:"conversationSecondsWeek"`
	ActiveDates              []string `json:"activeDates"` // yyyy-mm-dd (tz), current week
}

// ReviewCard is one spaced-repetition phrase card (oops-note).
type ReviewCard struct {
	ID          string         `json:"id"`
	Source      string         `json:"source"`
	Front       string         `json:"front"`
	Back        string         `json:"back"`
	Note        string         `json:"note"`
	TopicTag    string         `json:"topicTag"`
	MasteryPips int            `json:"masteryPips"`
	Favorite    bool           `json:"favorite"`
	Schedule    Schedule       `json:"schedule"`
	ScenarioID  string         `json:"scenarioId,omitempty"`
	Context     *ReviewContext `json:"context,omitempty"`
}

// ReviewContext is the situation a correction was captured in, so the learner can
// recall what prompted it: the scenario, its situation brief, and the line they
// were replying to.
type ReviewContext struct {
	Title     string `json:"title,omitempty"`     // scenario title
	Dept      string `json:"dept,omitempty"`      // dept label
	Situation string `json:"situation,omitempty"` // scenario briefing / tagline
	Npc       string `json:"npc,omitempty"`       // the NPC line the learner was responding to
}

// Schedule is the SM-2 state for a card.
type Schedule struct {
	Ease         float64   `json:"ease"`
	IntervalDays int       `json:"intervalDays"`
	Reps         int       `json:"reps"`
	DueDate      time.Time `json:"dueDate"`
}

// Grade is the user's self-rating after a review. Code-side allowed set.
type Grade string

const (
	GradeAgain Grade = "again"
	GradeHard  Grade = "hard"
	GradeGood  Grade = "good"
	GradeEasy  Grade = "easy"
)

var gradeQ = map[Grade]int{GradeAgain: 1, GradeHard: 3, GradeGood: 4, GradeEasy: 5}

func (g Grade) Valid() bool { _, ok := gradeQ[g]; return ok }

// Review applies the SM-2 algorithm and returns the next schedule + mastery pips.
// `today` is injected so the calculation is pure/testable. Tunable numbers come
// from the economy config (single source of truth).
func Review(s Schedule, g Grade, today time.Time) (Schedule, int) {
	e := economy.Active
	q := gradeQ[g]
	next := s
	if next.Ease == 0 {
		next.Ease = e.EaseDefault
	}

	if q < 3 { // failed recall → reset interval, keep ease (lightly penalized)
		next.Reps = 0
		next.IntervalDays = e.FirstInterval
	} else {
		switch next.Reps {
		case 0:
			next.IntervalDays = e.FirstInterval
		case 1:
			next.IntervalDays = e.SecondInterval
		default:
			next.IntervalDays = int(float64(next.IntervalDays)*next.Ease + 0.5)
		}
		next.Reps++
	}

	// EF update (SM-2): EF += 0.1 - (5-q)*(0.08 + (5-q)*0.02)
	d := float64(5 - q)
	next.Ease += 0.1 - d*(0.08+d*0.02)
	if next.Ease < e.EaseFloor {
		next.Ease = e.EaseFloor
	}

	next.DueDate = today.AddDate(0, 0, next.IntervalDays)

	pips := next.Reps
	if pips > e.MasteryCap {
		pips = e.MasteryCap
	}
	return next, pips
}
