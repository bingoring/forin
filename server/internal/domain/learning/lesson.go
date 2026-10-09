package learning

// A situation is learned in four steps: words → sentences → guided dialogue → free
// dialogue (lesson four steps, v44). The last two ARE the dialogue's two passes — the
// ladder is unchanged (build-spec §1) — so only the first two need a record of their
// own (lesson_step_clears).

// LessonStepKind names one of the four steps.
type LessonStepKind string

const (
	StepWords     LessonStepKind = "words"
	StepSentences LessonStepKind = "sentences"
	StepGuided    LessonStepKind = "guided"
	StepFree      LessonStepKind = "free"
)

// LessonStepKinds is the order a situation is learned in.
var LessonStepKinds = []LessonStepKind{StepWords, StepSentences, StepGuided, StepFree}

// IsRecordedStep reports whether a step's completion is stored by the lesson itself —
// the allowed set for lesson_step_clears.step, kept in code rather than a DB CHECK.
// The dialogue rungs are not: their clears are scenario_attempts rows.
func IsRecordedStep(kind string) bool {
	return kind == string(StepWords) || kind == string(StepSentences)
}

// LessonStepState is how the hub draws a step.
type LessonStepState string

const (
	StepDone LessonStepState = "done"
	StepNow  LessonStepState = "now"
	StepLock LessonStepState = "lock"
	// StepSkip is skipped for the learner's level (build-spec §4). The hub still
	// offers it (`그래도 할래요`), and it does not count toward the gauge.
	StepSkip LessonStepState = "skip"
	// StepEmpty is a step whose content has not been written yet — most departments,
	// until production reaches them. Distinct from skip on purpose: skip can be opted
	// into, and opting into this would open an empty screen.
	StepEmpty LessonStepState = "empty"
)

// LessonStep is one step as the hub sees it.
type LessonStep struct {
	Kind  LessonStepKind  `json:"kind"`
	State LessonStepState `json:"state"`
	// Count is how many items the step holds — words, sentences, or the dialogue's
	// goals. It follows the content; nothing here assumes 8 or 5 (build-spec §2-2).
	Count int `json:"count"`
}

// LessonInput is everything LessonSteps needs, independent of storage.
type LessonInput struct {
	Level     string // CEFR, already normalized
	Words     int    // bank words this situation's sentences use
	Sentences int
	Goals     int
	Done      map[LessonStepKind]bool
}

// LessonSteps lays out a situation's four steps. Done wins over everything (a
// skipped step the learner did anyway is done); a step with no content is empty;
// one the level skips is skip. The first remaining step is now and the rest lock —
// skipped and empty steps never block what comes after them.
func LessonSteps(in LessonInput) []LessonStep {
	skipped := levelSkips(in.Level)
	counts := map[LessonStepKind]int{
		StepWords: in.Words, StepSentences: in.Sentences, StepGuided: in.Goals, StepFree: in.Goals,
	}
	out := make([]LessonStep, 0, len(LessonStepKinds))
	nowGiven := false
	for _, k := range LessonStepKinds {
		st := StepLock
		switch {
		case in.Done[k]:
			st = StepDone
		case IsRecordedStep(string(k)) && counts[k] == 0:
			st = StepEmpty
		case skipped[k]:
			st = StepSkip
		case !nowGiven:
			st, nowGiven = StepNow, true
		}
		out = append(out, LessonStep{Kind: k, State: st, Count: counts[k]})
	}
	return out
}

// levelSkips is build-spec §4: the onboarding answer a (A2) skips nothing, b (B1)
// skips words, c (B2) skips words and sentences. Levels above B2 are only reachable
// from settings and skip what B2 skips.
func levelSkips(level string) map[LessonStepKind]bool {
	switch level {
	case "B1":
		return map[LessonStepKind]bool{StepWords: true}
	case "B2", "C1", "C2":
		return map[LessonStepKind]bool{StepWords: true, StepSentences: true}
	default:
		return nil
	}
}

// DialogueDone reads the two dialogue rungs from the pass split. Clearing alone
// supersedes clearing with help, as in the engine's Steps and Guidance.
func DialogueDone(s ScenarioID, p ClearedPasses) map[LessonStepKind]bool {
	return map[LessonStepKind]bool{
		StepGuided: p.GuidedCleared[s] || p.FreeCleared[s],
		StepFree:   p.FreeCleared[s],
	}
}
