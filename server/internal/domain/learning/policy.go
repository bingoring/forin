package learning

// Policies are the swappable parts of the journey: how much a step is scaffolded,
// when a tier unlocks, whether a theme ends in an exam. They are kept out of the
// assembly/resolution body so a rule change is a part swap, not engine surgery
// (P3-A §0.5-3, seam S5).

// GuidancePolicy decides the scaffolding ladder for a step kind.
//
// Ported 1:1 from v2 curriculum/guide.go: a dialogue is played twice (guided, then
// free); a boss/quiz is played once, free. The middle "hint-only" rung was
// deliberately dropped — the hint lives inside the free pass instead.
type GuidancePolicy interface {
	// Passes is how many runs a step of this kind gets (dlg=2, boss/quiz=1).
	Passes(kind string) int
	// GuideForPass is the help on run `pass` (1-based) of a step of this kind.
	GuideForPass(kind string, pass int) GuideLevel
}

// DefaultGuidance reproduces the shipped v2 behaviour.
type DefaultGuidance struct{}

func (DefaultGuidance) Passes(kind string) int {
	switch kind {
	case "boss", "quiz":
		return 1
	default:
		return 2
	}
}

func (g DefaultGuidance) GuideForPass(kind string, pass int) GuideLevel {
	if g.Passes(kind) == 1 || pass >= 2 {
		return GuideFree
	}
	return GuideChoices
}

// TierUnlockPolicy decides whether a difficulty tier is open given whether the
// previous tier is fully done.
type TierUnlockPolicy interface {
	Unlocked(prevTierDone bool) bool
}

// DefaultTierUnlock: a tier opens once the one before it is complete (P1 behaviour).
type DefaultTierUnlock struct{}

func (DefaultTierUnlock) Unlocked(prevTierDone bool) bool { return prevTierDone }

// ExamPolicy decides whether a theme ends in a 주제 시험(boss). `explicit` is the
// theme's exam flag: nil means "omitted", which defaults to true (P1 ExamOn rule).
type ExamPolicy interface {
	HasExam(explicit *bool) bool
}

// DefaultExam: exam on unless the theme explicitly sets exam:false.
type DefaultExam struct{}

func (DefaultExam) HasExam(explicit *bool) bool { return explicit == nil || *explicit }
