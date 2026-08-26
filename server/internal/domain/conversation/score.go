package conversation

import "strings"

// How a scenario's score is arrived at.
//
// It used to be a single 0-100 integer the grading model chose freely, and the result
// was what you would expect from asking a language model to be a calibrated examiner:
// one hint-shaped line and 상황 종료 scored 90+. A model asked "is this a 73 or a 91"
// has nothing to anchor against and rounds toward generous.
//
// So the score is DERIVED. The model is asked only what it is good at — local,
// checkable judgements: "did the learner address this specific goal, and quote the
// words where they did", and "how clear was their English" on a named scale. The
// arithmetic here turns those into a number, which makes the failure the user
// reported impossible by construction: with four authored goals and one addressed,
// no amount of clarity reaches a pass.

// Clarity is the communication band the grader picks. A short named scale, not a
// number: the model chooses reliably between four labels and unreliably between 71
// and 78.
type Clarity string

const (
	ClarityExcellent Clarity = "excellent"
	ClarityGood      Clarity = "good"
	ClarityFair      Clarity = "fair"
	ClarityPoor      Clarity = "poor"
)

// clarityPoints is the score each band contributes at full weight.
//
// The gaps are deliberately wide. Adjacent bands have to be far enough apart that a
// band the grader is unsure about does not decide a pass, and `fair` sits well below
// the 60 pass mark so that "understandable but awkward" is not a clear on its own.
var clarityPoints = map[Clarity]int{
	ClarityExcellent: 100,
	ClarityGood:      78,
	ClarityFair:      50,
	ClarityPoor:      20,
}

// NormalizeClarity maps the grader's word onto the scale, defaulting to `fair` —
// the middle of the range rather than the top, so an unreadable answer cannot buy a
// good score.
func NormalizeClarity(raw string) Clarity {
	c := Clarity(strings.ToLower(strings.TrimSpace(raw)))
	if _, ok := clarityPoints[c]; ok {
		return c
	}
	return ClarityFair
}

// clarityCap is the most a band can score however complete the coverage.
//
// Only `poor` needs one, and it needs one because the two halves can contradict each
// other: a grader can mark every goal met and still call the English poor. This is a
// language exercise — you do not clear a communication task with communication the
// examiner called unintelligible, and 60 is the pass mark. Without the cap, full
// coverage in broken English scored 68.
var clarityCap = map[Clarity]int{ClarityPoor: 55}

// passCoverage is how much of a situation must be addressed for a clear to be
// possible at all.
//
// A weighted sum alone is too soft at the goal counts the content actually has: 90%
// of scenarios author exactly two goals, so "half the job" is one sentence, and one
// sentence in good English reached 61 against a 60 pass mark. That is the reported
// complaint restated — a clear that does not mean the situation was handled.
//
// 0.75 means: with two goals you need both, with three you need all three, with four
// you need three. Strict, and deliberately so — 완료 is the app's own word for having
// handled the situation, and everything below it is still an 재도전 that earns
// score-scaled XP and a streak.
const passCoverage = 0.75

// belowPassCap is where an under-covered run tops out: under the pass mark, but not
// crushed to zero. They did engage, and the number they see should say "not yet"
// rather than "nothing".
const belowPassCap = 55

// coverageWeight is how much of the score is "did you accomplish the task".
//
// Dominant on purpose: this is a clinical-communication trainer, and a beautifully
// phrased exchange that never asked about the pain has not done the job. The
// remainder is clarity, which is what stops full coverage in broken English from
// reading as mastery.
const coverageWeight = 0.60

// ScoreOf computes the scenario score.
//
// `met` and `total` are goal counts AFTER the evidence check (see EvidencedGoals):
// a goal the grader marked met without quoting the learner's words does not count,
// because that is the cheapest way for a generous grader to inflate everything.
//
// With no authored goals the score is clarity alone — there is nothing to have
// covered, and inventing a coverage term for a scenario that specified none would
// punish the content rather than the learner.
func ScoreOf(met, total int, clarity Clarity) int {
	pts := clarityPoints[NormalizeClarity(string(clarity))]
	if total <= 0 {
		return clampScore(pts)
	}
	if met < 0 {
		met = 0
	}
	if met > total {
		met = total
	}
	coverage := float64(met) / float64(total)
	score := clampScore(int(coverage*100*coverageWeight + float64(pts)*(1-coverageWeight) + 0.5))
	if cap, ok := clarityCap[NormalizeClarity(string(clarity))]; ok && score > cap {
		score = cap
	}
	// The floor. Applied last so neither a clarity band nor the weighted sum can lift
	// an under-covered run over the pass mark.
	if coverage < passCoverage && score > belowPassCap {
		score = belowPassCap
	}
	return score
}

// EvidencedGoals counts the goals that were genuinely met.
//
// A goal counts only when the grader quoted the learner's own words for it. Asking
// for the quote is what makes a false positive expensive: claiming a goal was met
// requires producing the sentence that met it, and there is none to produce.
//
// The quote is not verified against the transcript — a paraphrase or a partial quote
// still counts. The point is not forensics, it is that the grader has to have
// something specific in mind; an empty field is the tell.
func EvidencedGoals(goals []GoalResult) (met, total int) {
	for _, g := range goals {
		if strings.TrimSpace(g.Goal) == "" {
			continue
		}
		total++
		if g.Met && strings.TrimSpace(g.Evidence) != "" {
			met++
		}
	}
	return met, total
}
