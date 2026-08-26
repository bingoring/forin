package conversation

import "testing"

const pass = 60 // economy.Active.ScenarioPassScore

// The reported bug, as arithmetic: one hint-shaped line against a four-goal scenario
// cannot pass, however good the English was. A free-floating LLM score gave 90+ here.
func TestOneGoalOfFourCannotPass(t *testing.T) {
	for _, c := range []Clarity{ClarityExcellent, ClarityGood, ClarityFair, ClarityPoor} {
		if got := ScoreOf(1, 4, c); got >= pass {
			t.Errorf("1/4 goals with %s clarity scored %d — a pass", c, got)
		}
	}
}

// And the other side: doing the whole job well is a high score. A rubric that cannot
// reward is as broken as one that cannot fail.
func TestFullCoverageIsRewarded(t *testing.T) {
	if got := ScoreOf(4, 4, ClarityExcellent); got != 100 {
		t.Errorf("4/4 excellent = %d, want 100", got)
	}
	if got := ScoreOf(4, 4, ClarityGood); got < 85 {
		t.Errorf("4/4 good = %d, want a clear pass", got)
	}
}

// Full coverage in awkward English is a pass but not a triumph — and full coverage in
// broken English is not a pass at all.
func TestClarityStillMatters(t *testing.T) {
	fair := ScoreOf(4, 4, ClarityFair)
	if fair < pass {
		t.Errorf("4/4 fair = %d; finishing the task should pass", fair)
	}
	if fair >= 85 {
		t.Errorf("4/4 fair = %d; awkward English should not read as mastery", fair)
	}
	if poor := ScoreOf(4, 4, ClarityPoor); poor >= pass {
		t.Errorf("4/4 poor = %d; unintelligible is not a clear", poor)
	}
}

// Half the goals is not a clear, at any clarity. 완료 is the app's word for having
// handled the situation.
func TestHalfCoverageCannotPass(t *testing.T) {
	for _, c := range []Clarity{ClarityExcellent, ClarityGood, ClarityFair, ClarityPoor} {
		if got := ScoreOf(2, 4, c); got >= pass {
			t.Errorf("2/4 with %s clarity = %d — a pass", c, got)
		}
	}
}

// The shape 90% of the content actually has: exactly two goals. One of two was
// scoring 61 against a 60 pass mark — the reported complaint, restated.
func TestTwoGoalScenarioNeedsBoth(t *testing.T) {
	for _, c := range []Clarity{ClarityExcellent, ClarityGood} {
		if got := ScoreOf(1, 2, c); got >= pass {
			t.Errorf("1/2 goals with %s clarity = %d — a pass on half a situation", c, got)
		}
	}
	if got := ScoreOf(2, 2, ClarityGood); got < pass {
		t.Errorf("2/2 good = %d — doing the whole job should clear", got)
	}
}

// Three goals: all three. Four: three is enough — the floor is a fraction, not a
// demand for perfection at every length.
func TestCoverageFloorScalesWithGoalCount(t *testing.T) {
	if got := ScoreOf(2, 3, ClarityExcellent); got >= pass {
		t.Errorf("2/3 excellent = %d — a pass", got)
	}
	if got := ScoreOf(3, 3, ClarityGood); got < pass {
		t.Errorf("3/3 good = %d", got)
	}
	if got := ScoreOf(3, 4, ClarityGood); got < pass {
		t.Errorf("3/4 good = %d — 75%% coverage should be able to clear", got)
	}
}

// An under-covered run is "not yet", not "nothing": they engaged, and the number
// should say so.
func TestUnderCoveredRunStillScoresSomething(t *testing.T) {
	if got := ScoreOf(1, 4, ClarityExcellent); got < 30 {
		t.Errorf("1/4 excellent = %d — too crushing for a genuine attempt", got)
	}
}

// A scenario that authored no goals is scored on clarity alone: there is nothing to
// have covered, and inventing a coverage term would punish the content.
func TestNoGoalsScoresOnClarityAlone(t *testing.T) {
	if got := ScoreOf(0, 0, ClarityExcellent); got != 100 {
		t.Errorf("no goals + excellent = %d, want 100", got)
	}
	if got := ScoreOf(0, 0, ClarityFair); got != 50 {
		t.Errorf("no goals + fair = %d, want 50", got)
	}
}

// An unreadable clarity value must not buy a good score.
func TestUnknownClarityDefaultsToTheMiddle(t *testing.T) {
	if NormalizeClarity("magnificent") != ClarityFair {
		t.Error("an unknown band should default to fair, not to the top")
	}
	if NormalizeClarity("") != ClarityFair {
		t.Error("an empty band should default to fair")
	}
	if NormalizeClarity("EXCELLENT") != ClarityExcellent {
		t.Error("the band should be case-insensitive")
	}
}

// A goal claimed without a quote does not count. This is the cheapest way for a
// generous grader to inflate everything, so it is the one guarded hardest.
func TestGoalsNeedEvidenceToCount(t *testing.T) {
	met, total := EvidencedGoals([]GoalResult{
		{Goal: "greet the patient", Met: true, Evidence: "Hello, I'm your nurse today."},
		{Goal: "ask about pain", Met: true},                        // claimed, nothing quoted
		{Goal: "explain the plan", Met: true, Evidence: "   "},     // whitespace is not a quote
		{Goal: "confirm identity", Met: false, Evidence: "unused"}, // not claimed
	})
	if total != 4 {
		t.Errorf("total = %d, want 4", total)
	}
	if met != 1 {
		t.Errorf("met = %d, want 1 — only the quoted goal counts", met)
	}
}

// An empty goal string is not a goal: a grader echoing back a blank must not dilute
// the denominator, which would make every other goal worth less.
func TestBlankGoalsAreNotCounted(t *testing.T) {
	met, total := EvidencedGoals([]GoalResult{
		{Goal: "real goal", Met: true, Evidence: "said it"},
		{Goal: "", Met: false},
		{Goal: "   ", Met: true, Evidence: "x"},
	})
	if met != 1 || total != 1 {
		t.Errorf("met/total = %d/%d, want 1/1", met, total)
	}
}

// Counts outside the range cannot produce a score outside 0-100.
func TestScoreIsAlwaysInRange(t *testing.T) {
	for _, tc := range [][2]int{{-3, 4}, {9, 4}, {0, 0}, {5, 5}} {
		if got := ScoreOf(tc[0], tc[1], ClarityExcellent); got < 0 || got > 100 {
			t.Errorf("ScoreOf(%d, %d) = %d", tc[0], tc[1], got)
		}
	}
}
