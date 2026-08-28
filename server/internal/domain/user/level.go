package user

import "strings"

// The learner's self-reported CEFR band, and the three things it is allowed to
// change. One file, because the same letter was about to be interpreted in three
// places — the NPC's prompt, the examiner's prompt, and the daily scenario sample —
// and three interpretations of "B1" drift apart the first time one is edited.
//
// Until now the answer changed NOTHING. It was stored, echoed into a profile chip
// and colleague rows, and never read again: the role-play prompt carried only
// native/target language and job, the examiner graded every level to one standard,
// and the daily pool weighted difficulty by XP level. A learner who said "업무
// 대화는 떠듬떠듬..." got exactly what a C1 speaker got.
//
// What it is NOT allowed to change, at any level:
//
//   - clinical facts, the scenario's goals, or its guardrails. A patient does not
//     become less sick because the nurse is a beginner.
//   - the safety bar in grading. Saying the wrong dose clearly is not better than
//     saying the right dose awkwardly, and no level makes it so.
//
// So: register, not substance.

// Level is a CEFR band. "" means not answered, and every function here treats that
// as DefaultLevel rather than as a fourth behaviour.
type Level string

// DefaultLevel is what the onboarding wizard already defaults to server-side
// (me_handler's orDefault) — repeated here so a missing profile and an unanswered
// question behave the same.
const DefaultLevel = "B1"

// AllowedLevels is the canonical set, validated in code rather than by a DB CHECK so
// adding a band needs no migration. C2 is accepted even though the onboarding screen
// stops at C1: the column already holds whatever was written to it.
var AllowedLevels = map[string]bool{
	"A1": true, "A2": true, "B1": true, "B2": true, "C1": true, "C2": true,
}

// NormalizeLevel upper-cases and validates, falling back to DefaultLevel. Callers
// pass raw profile strings straight in.
func NormalizeLevel(raw string) string {
	lv := strings.ToUpper(strings.TrimSpace(raw))
	if AllowedLevels[lv] {
		return lv
	}
	return DefaultLevel
}

// tier collapses the six bands into the three that actually differ in behaviour.
// Six near-identical prompt paragraphs would be six things to keep consistent for a
// distinction no learner would notice between A1 and A2.
type tier int

const (
	tierBeginner tier = iota // A1, A2
	tierMiddle               // B1, B2
	tierAdvanced             // C1, C2
)

func tierOf(level string) tier {
	switch NormalizeLevel(level)[0] {
	case 'A':
		return tierBeginner
	case 'C':
		return tierAdvanced
	default:
		return tierMiddle
	}
}

// SpeechRegister is the instruction that goes into the NPC's system prompt: how this
// character should SAY things to this learner. It deliberately says nothing about
// what to say, and it repeats the no-coaching rule at the beginner tier, where the
// temptation to start teaching is strongest.
func SpeechRegister(level string) string {
	switch tierOf(level) {
	case tierBeginner:
		return "The learner is an early-stage speaker of this language. Speak in short, plain sentences — " +
			"one idea per sentence. Avoid idioms, slang, phrasal verbs and abbreviations; say the full term " +
			"instead of the acronym. If they ask you to repeat, repeat more simply without irritation. " +
			"Do NOT simplify the clinical situation, omit symptoms, or answer questions they have not asked, " +
			"and do NOT teach, correct, or hint — stay the character."
	case tierAdvanced:
		return "The learner is an advanced speaker. Speak at a natural pace with the idioms, contractions and " +
			"abbreviations a real person in this role would use. Do not simplify for their benefit."
	default:
		return "The learner is an intermediate speaker. Speak naturally but plainly: ordinary everyday wording, " +
			"common abbreviations are fine, heavy slang and regional idioms are not. Expand an acronym the " +
			"first time you use it."
	}
}

// GradingExpectation is the examiner's calibration line: the same goals, judged at
// the standard this learner is working at.
//
// Every tier keeps the clinical bar identical. What moves is how much the wording
// itself counts — which is what "fair" means when the same transcript comes from a
// beginner and from an advanced speaker.
func GradingExpectation(level string) string {
	switch tierOf(level) {
	case tierBeginner:
		return "This learner is an early-stage speaker. Judge `clarity` by whether a colleague or patient would " +
			"UNDERSTAND them: simple, broken or ungrammatical sentences that get the right message across are " +
			"\"good\". Do not lower the bar on clinical correctness or safety — a wrong or unsafe statement is " +
			"wrong however well it is phrased — and keep `tips` to phrasings they could actually say today."
	case tierAdvanced:
		return "This learner is an advanced speaker. Hold `clarity` to precision and natural phrasing: a message " +
			"that merely gets across is \"fair\", not \"good\". Push them on register, hedging and word choice. " +
			"Clinical correctness is judged the same at every level — fluent phrasing does not make an unsafe " +
			"statement acceptable."
	default:
		return "This learner is an intermediate speaker. Judge `clarity` by whether the message lands without " +
			"the listener having to work: understandable but awkward or roundabout is \"fair\", clear and " +
			"idiomatic is \"good\". Clinical correctness is judged the same at every level."
	}
}

// DifficultyBand is the authored-difficulty range (1..3) this level should mostly be
// practising in. Inclusive on both ends.
func DifficultyBand(level string) (lo, hi int) {
	switch tierOf(level) {
	case tierBeginner:
		return 1, 1
	case tierAdvanced:
		return 2, 3
	default:
		return 1, 2
	}
}
