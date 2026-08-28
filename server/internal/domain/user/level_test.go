package user

import (
	"strings"
	"testing"
)

func TestNormalizeLevel(t *testing.T) {
	for in, want := range map[string]string{
		"B1": "B1", "b1": "B1", " c1 ": "C1", "A2": "A2", "C2": "C2",
		// Anything unrecognised behaves as unanswered, so a stray value in the column
		// cannot produce a fourth behaviour nobody wrote prompts for.
		"": DefaultLevel, "B9": DefaultLevel, "native": DefaultLevel,
	} {
		if got := NormalizeLevel(in); got != want {
			t.Fatalf("NormalizeLevel(%q) = %q, want %q", in, got, want)
		}
	}
}

// The three tiers must actually differ — otherwise the whole feature is a stored
// string again.
func TestSpeechRegisterDiffersByTier(t *testing.T) {
	a, b, c := SpeechRegister("A2"), SpeechRegister("B1"), SpeechRegister("C1")
	if a == b || b == c || a == c {
		t.Fatal("two tiers share the same speech register")
	}
	// A1 and A2 are one tier on purpose: six near-identical paragraphs would be six
	// things to keep consistent for a distinction no learner would notice.
	if SpeechRegister("A1") != SpeechRegister("A2") {
		t.Fatal("A1 and A2 diverged")
	}
	if SpeechRegister("C1") != SpeechRegister("C2") {
		t.Fatal("C1 and C2 diverged")
	}
	// An unanswered question gets the middle tier, not the easiest one: assuming a
	// beginner would simplify every conversation for everyone who skipped the screen.
	if SpeechRegister("") != b {
		t.Fatal("an unanswered level is not treated as intermediate")
	}
}

// The register may change HOW the character speaks. These are the things it must not
// touch, and the beginner tier is where the pull to touch them is strongest.
func TestBeginnerRegisterProtectsTheSituation(t *testing.T) {
	r := strings.ToLower(SpeechRegister("A1"))
	for _, must := range []string{
		"do not simplify the clinical situation", // the patient is as sick as authored
		"do not teach",                           // the NPC is not a tutor
	} {
		if !strings.Contains(r, must) {
			t.Fatalf("the beginner register no longer says %q:\n%s", must, r)
		}
	}
}

// Grading may become fairer. It may not become unsafe.
func TestGradingExpectationNeverLowersTheClinicalBar(t *testing.T) {
	for _, level := range []string{"A1", "A2", "B1", "B2", "C1", "C2"} {
		g := strings.ToLower(GradingExpectation(level))
		// Every tier's line has to say, in its own words, that clinical judgement is
		// not on the sliding scale. A tier that forgets is a tier where "clear enough"
		// starts covering a wrong dose.
		if !strings.Contains(g, "clinical") {
			t.Fatalf("%s's grading expectation says nothing about clinical correctness:\n%s", level, g)
		}
	}
	if GradingExpectation("A1") == GradingExpectation("C1") {
		t.Fatal("the beginner and advanced standards are identical")
	}
}

func TestDifficultyBand(t *testing.T) {
	for _, c := range []struct {
		level  string
		lo, hi int
	}{
		{"A1", 1, 1}, {"A2", 1, 1},
		{"B1", 1, 2}, {"B2", 1, 2},
		{"C1", 2, 3}, {"C2", 2, 3},
		{"", 1, 2}, // unanswered → intermediate
	} {
		lo, hi := DifficultyBand(c.level)
		if lo != c.lo || hi != c.hi {
			t.Fatalf("DifficultyBand(%q) = (%d,%d), want (%d,%d)", c.level, lo, hi, c.lo, c.hi)
		}
		// Every band must be a real range in the authored 1..3 space, or the sampler
		// treats every scenario as off-band and the weighting silently does nothing.
		if lo < 1 || hi > 3 || lo > hi {
			t.Fatalf("DifficultyBand(%q) = (%d,%d) is not a valid 1..3 range", c.level, lo, hi)
		}
	}
}
