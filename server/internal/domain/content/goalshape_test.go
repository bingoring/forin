package content

import (
	"strings"
	"testing"
)

// Every clinical conversation opens and closes. Two goals made a scenario clearable in
// one exchange; with four, the 0.75 coverage floor needs three of them, which cannot
// be one sentence.
func TestComposeGoalsAddsTheStructuralPair(t *testing.T) {
	got := ComposeGoals("patient", []string{"통증 사정", "의사에게 인계"})
	if len(got) != 4 {
		t.Fatalf("goals = %d, want 4: %v", len(got), got)
	}
	if got[0] != OpenGoal("patient") {
		t.Errorf("first goal is not the opening: %q", got[0])
	}
	if got[3] != CloseGoal("patient") {
		t.Errorf("last goal is not the closing: %q", got[3])
	}
	// Authored goals survive, in order, between them.
	if got[1] != "통증 사정" || got[2] != "의사에게 인계" {
		t.Errorf("authored goals altered: %v", got[1:3])
	}
}

// The roles the CONTENT actually uses, not just the generator's. The hand-authored
// scenarios carry pharmacist, nurse, visitor, police and paramedic — a mapping that
// only knew the generator's six would have given them the patient form, which is
// wrong for a professional handoff.
func TestEveryRoleInTheContentIsGrouped(t *testing.T) {
	professional := []string{"colleague", "doctor", "nurse", "pharmacist", "paramedic", "police"}
	guardian := []string{"parent", "family", "visitor"}
	patient := []string{"patient", "child"}

	for _, r := range professional {
		if !strings.Contains(OpenGoal(r), "용건") {
			t.Errorf("%s should open with the purpose, got %q", r, OpenGoal(r))
		}
	}
	for _, r := range guardian {
		if !strings.Contains(OpenGoal(r), "관계") {
			t.Errorf("%s should establish the relationship, got %q", r, OpenGoal(r))
		}
	}
	for _, r := range patient {
		if !strings.Contains(OpenGoal(r), "본인 확인") {
			t.Errorf("%s should confirm identity, got %q", r, OpenGoal(r))
		}
	}
	// The three groups must actually differ, or the role-awareness is decorative.
	if OpenGoal("nurse") == OpenGoal("patient") || OpenGoal("parent") == OpenGoal("patient") {
		t.Error("the role groups produce the same opening")
	}
	if CloseGoal("nurse") == CloseGoal("patient") || CloseGoal("parent") == CloseGoal("patient") {
		t.Error("the role groups produce the same closing")
	}
}

// Case and whitespace come from authored YAML, which is written by hand.
func TestRoleMatchingIsTolerant(t *testing.T) {
	if OpenGoal(" Nurse ") != OpenGoal("nurse") {
		t.Error("role matching should ignore case and surrounding space")
	}
}

// An unrecognised role gets the patient form rather than a blank goal — a blank is
// skipped by the grader's evidence check, which shrinks the denominator and silently
// makes every other goal worth more.
func TestUnknownRoleStillProducesGoals(t *testing.T) {
	for _, r := range []string{"", "chaplain", "???"} {
		if OpenGoal(r) == "" || CloseGoal(r) == "" {
			t.Errorf("role %q produced an empty goal", r)
		}
		if OpenGoal(r) != OpenGoal("patient") {
			t.Errorf("role %q should fall back to the patient form", r)
		}
	}
}

// Duplicates count twice toward coverage: a learner could clear a four-goal scenario
// by doing three things, one of them credited twice.
func TestDuplicateAndBlankGoalsAreDropped(t *testing.T) {
	got := ComposeGoals("patient", []string{
		CloseGoal("patient"), // collides with the structural closing
		"통증 사정",
		"",     // blank
		"  ",   // whitespace only
		"통증 사정", // repeated authored goal
	})
	seen := map[string]bool{}
	for _, g := range got {
		if strings.TrimSpace(g) == "" {
			t.Errorf("a blank goal survived: %v", got)
		}
		if seen[g] {
			t.Errorf("duplicate %q in %v", g, got)
		}
		seen[g] = true
	}
	if len(got) != 3 { // open, 통증 사정, close
		t.Errorf("goals = %v, want 3 distinct", got)
	}
}

// The caller's slice is shared across every variant of a topic; appending into it
// would make each variant longer than the last.
func TestComposeDoesNotMutateItsInput(t *testing.T) {
	authored := []string{"a", "b"}
	_ = ComposeGoals("patient", authored)
	_ = ComposeGoals("patient", authored)
	if len(authored) != 2 {
		t.Errorf("the caller's slice grew to %v", authored)
	}
}
