package curriculum

import "strings"

// How much help a step gives, and why the same situation is played twice.
//
// Testers said the honest thing: facing a patient and an empty text box, they did not
// know what to say. The app gave total freedom before it had given anything to be free
// with.
//
// The fix is a LADDER ON ONE SITUATION, not across different ones. Learning how to
// introduce yourself on your first shift and then being turned loose on a burns case is
// not practice, it is a new problem — what was learned has nowhere to go. So every
// dialogue step is played twice:
//
//	pass 1 — GUIDED: every NPC turn offers three replies to pick from
//	pass 2 — FREE:   say it yourself, with a hint available if you want one
//
// Two passes rather than three. A middle "hint-only" pass was the obvious third rung and
// it is one rung too many: nobody wants to do their first shift three times. The hint
// survives as something you can reach for during the free pass, which is also what makes
// it worth anything — a hint nobody paid attention to because it was always on screen
// taught nothing.
//
// Doing it this way doubles the length of the existing catalog without authoring a
// single new scenario, because the second pass is the same content with the scaffolding
// taken away.
type GuideLevel string

const (
	// GuideChoices offers three candidate replies per NPC turn.
	GuideChoices GuideLevel = "choices"
	// GuideFree is an empty box and a patient waiting — with a hint within reach.
	GuideFree GuideLevel = "free"
)

// Pass is one run at a step: the guided one, then the free one.
type Pass int

const (
	PassGuided Pass = 1
	PassFree   Pass = 2
)

// Passes is how many runs a step of this kind gets.
//
// A boss gets ONE, and it is free. It is the curriculum's test — the point at which the
// learner does unaided what the run has been teaching — and a test with three answers
// printed under the question is not one. Playing it twice would also make the run's
// ending drag, which is the last place to lose someone.
//
// A quiz is not a conversation and has nothing to scaffold.
func Passes(kind string) int {
	switch kind {
	case "boss", "quiz":
		return 1
	default:
		return 2
	}
}

// GuideForPass is the help offered on run `p` of a step of this kind.
func GuideForPass(kind string, p Pass) GuideLevel {
	if kind == "boss" || kind == "quiz" {
		return GuideFree
	}
	if p == PassGuided {
		return GuideChoices
	}
	return GuideFree
}

// StepRun is one playable run: which scenario, and how much help it gives.
//
// The catalog authors steps; the learner plays runs. Keeping them as separate types is
// what lets the ladder exist without touching a single authored file.
type StepRun struct {
	Kind       string
	Name       string
	ScenarioID string
	Pass       Pass
	// Passes is how many runs this step has in total, so a caller can say "1/2" without
	// re-deriving it.
	Passes int
	Guide  GuideLevel
}

// Runs expands a curriculum's authored steps into the runs a learner actually plays.
func (c Curriculum) Runs() []StepRun {
	out := make([]StepRun, 0, len(c.Steps)*2)
	for _, s := range c.Steps {
		n := Passes(s.Kind)
		for p := 1; p <= n; p++ {
			out = append(out, StepRun{
				Kind:       s.Kind,
				Name:       s.Name,
				ScenarioID: s.ScenarioID,
				Pass:       Pass(p),
				Passes:     n,
				Guide:      GuideForPass(s.Kind, Pass(p)),
			})
		}
	}
	return out
}

// GuideForScenario is the help a scenario gets on a learner's NEXT run of it.
//
// `clearedGuided` says whether they have already finished its guided pass. That is the
// only thing that decides it: the first time through a conversation you get choices, the
// second time you are on your own. A scenario the catalog does not contain (a board-only
// situation, a paged call) is always free — help is a property of a COURSE, and outside
// one there is no course to be at the start of.
func GuideForScenario(scenarioID string, clearedGuided bool) GuideLevel {
	for _, c := range authored {
		for _, s := range c.Steps {
			if s.ScenarioID != scenarioID {
				continue
			}
			if Passes(s.Kind) == 1 || clearedGuided {
				return GuideFree
			}
			return GuideChoices
		}
	}
	return GuideFree
}

// ── the ward greeting ──────────────────────────────────────────────────────
//
// Every department's opening curriculum begins with one: SCN-<DEPT>-00900, three
// minutes, difficulty 1, no clinical content. Introduce yourself, get the other
// person's name, ask what happens next.
//
// It exists because a greeting used to live only in the ER (SCN-ORIENT-*). Everywhere
// else the first tap on a new ward opened an assessment, and the thing a nurse actually
// does first on a floor they have never stood in had nowhere to be practised.
//
// The id convention is load-bearing: the catalog and the content files are separate
// trees, and this is what lets a test walk one and check the other.
const GreetingSuffix = "-00900"

// IsWardGreeting reports whether a step is a department's opening hello.
func IsWardGreeting(scenarioID string) bool { return strings.HasSuffix(scenarioID, GreetingSuffix) }
