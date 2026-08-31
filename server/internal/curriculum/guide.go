package curriculum

// How much help a step gives, and why it is derived rather than authored.
//
// Testers reported the real problem plainly: faced with a patient and an empty text
// box, they did not know what to say. The app was giving them total freedom before it
// had given them anything to be free with.
//
// So a curriculum now teaches the same situation three times over, loosening its grip:
//
//	choices — every NPC turn offers three replies to pick from
//	hint    — no replies, just a nudge about what this turn needs
//	free    — say it yourself, which is what the whole app is for
//
// Derived from the step's POSITION rather than authored on each step, for two reasons.
// There are two hundred-odd steps already written and re-authoring them all to add one
// field is a migration nobody would finish; and the level is a fact about where the
// learner is in the run, not about the scenario — the same scenario can be the guided
// opener of one curriculum and the free-form test of another.
type GuideLevel string

const (
	// GuideChoices offers three candidate replies per NPC turn.
	GuideChoices GuideLevel = "choices"
	// GuideHint says what the turn needs without saying the words.
	GuideHint GuideLevel = "hint"
	// GuideFree is the app as it was: an empty box and a patient waiting.
	GuideFree GuideLevel = "free"
)

// GuideFor returns the scaffolding for step `i` (0-based) of a run of `total`, given
// its kind.
//
// A boss step is ALWAYS free, whatever its position. It is the curriculum's test — the
// point at which the learner does unaided what the run has been teaching — and a test
// with three answers printed under the question is not one. This is also why a
// curriculum that is nothing but a boss gives no help at all: there is nothing before
// it to have learned from.
//
// Everything else splits the run in three, rounded so that the guided part is never
// shorter than the parts after it. With two steps that is one guided and one free: a
// two-step run has no room for a middle.
func GuideFor(i, total int, kind string) GuideLevel {
	if kind == "boss" {
		return GuideFree
	}
	if total <= 1 {
		// One step and nothing to lean on. Choices are better than a blank box here,
		// which is the state the whole feature exists to fix.
		return GuideChoices
	}
	// Ceiling division, so a run of 4 guides 2 rather than 1.
	third := (total + 2) / 3
	switch {
	case i < third:
		return GuideChoices
	case i < total-third:
		return GuideHint
	default:
		return GuideFree
	}
}

// GuideForStep is GuideFor applied to a curriculum's own step list — the form callers
// actually have. Returns GuideFree for a scenario the curriculum does not contain,
// which is the safe answer: an unknown context gets the unassisted app.
func (c Curriculum) GuideForStep(scenarioID string) GuideLevel {
	for i, s := range c.Steps {
		if s.ScenarioID == scenarioID {
			return GuideFor(i, len(c.Steps), s.Kind)
		}
	}
	return GuideFree
}

// GuideForScenario is the level the catalog gives a scenario, wherever it appears.
//
// The lookup is by scenario id because that is all a caller opening a scenario has —
// the client asks for "SCN-ER-00002", not for a position in a run. A scenario the
// catalog does not contain (a board-only situation, a paged call) gets GuideFree: help
// is a property of a COURSE, and outside one there is no course to be at the start of.
func GuideForScenario(scenarioID string) GuideLevel {
	for _, c := range authored {
		for i, s := range c.Steps {
			if s.ScenarioID == scenarioID {
				return GuideFor(i, len(c.Steps), s.Kind)
			}
		}
	}
	return GuideFree
}
