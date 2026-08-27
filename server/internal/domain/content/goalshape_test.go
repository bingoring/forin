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

// Every role the CONTENT actually uses, grouped by what the opening and closing
// competence IS. A first pass had three groups and the content proved two of them
// wrong; these assertions are the evidence, kept.
func TestEveryRoleInTheContentIsGrouped(t *testing.T) {
	// A newborn cannot confirm their own identity. 127 scenarios are 신생아 활력 사정,
	// and an unachievable goal against the 0.75 coverage floor makes a scenario harder
	// than intended rather than merely odd.
	for _, r := range []string{"child", "infant", "neonate"} {
		if strings.Contains(OpenGoal(r), "본인 확인") {
			t.Errorf("%s opens with self-identification, which a child cannot do: %q", r, OpenGoal(r))
		}
		if !strings.Contains(OpenGoal(r), "보호자") {
			t.Errorf("%s should confirm identity via the guardian, got %q", r, OpenGoal(r))
		}
	}

	// This content's "visitor" is 부검 동의, 사별 후 자원 연계, 보호자 소진 — what is owed
	// at the end is presence and support, not a phone number.
	if strings.Contains(CloseGoal("visitor"), "연락 방법") {
		t.Errorf("a bereavement conversation should not close on contact details: %q", CloseGoal("visitor"))
	}
	if !strings.Contains(CloseGoal("visitor"), "지원") {
		t.Errorf("visitor closing should offer support, got %q", CloseGoal("visitor"))
	}

	// Escalation to a doctor is SBAR's R plus closed-loop confirmation — the reason
	// read-back exists is that a misheard order is a medication error.
	if !strings.Contains(CloseGoal("doctor"), "복창") {
		t.Errorf("escalation should close on a read-back, got %q", CloseGoal("doctor"))
	}

	// An outside authority is the one conversation where saying less is correct.
	if !strings.Contains(CloseGoal("police"), "범위") {
		t.Errorf("an external request should close on disclosure limits, got %q", CloseGoal("police"))
	}

	// Professionals lead with the point (SBAR's S).
	for _, r := range []string{"colleague", "nurse", "pharmacist", "paramedic"} {
		if !strings.Contains(OpenGoal(r), "용건") {
			t.Errorf("%s should open with the purpose, got %q", r, OpenGoal(r))
		}
	}

	// A guardian is not the patient: the relationship has to be established.
	for _, r := range []string{"parent", "family"} {
		if !strings.Contains(OpenGoal(r), "관계") {
			t.Errorf("%s should establish the relationship, got %q", r, OpenGoal(r))
		}
	}

	// An adult patient confirms their own identity.
	if !strings.Contains(OpenGoal("patient"), "본인 확인") {
		t.Errorf("patient should confirm identity, got %q", OpenGoal("patient"))
	}
}

// Seven groups, and each pair actually distinct — otherwise the grouping is
// decorative and the content would be better off with one.
func TestTheGroupsAreAllDifferent(t *testing.T) {
	roles := []string{"patient", "child", "parent", "visitor", "doctor", "police", "colleague"}
	opens, closes := map[string]string{}, map[string]string{}
	for _, r := range roles {
		o, c := OpenGoal(r), CloseGoal(r)
		if prev, dup := opens[o]; dup {
			t.Errorf("%s and %s share an opening: %q", prev, r, o)
		}
		if prev, dup := closes[c]; dup {
			t.Errorf("%s and %s share a closing: %q", prev, r, c)
		}
		opens[o], closes[c] = r, r
	}
	if len(opens) != len(roles) || len(closes) != len(roles) {
		t.Errorf("got %d distinct openings and %d closings for %d groups", len(opens), len(closes), len(roles))
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
		"",      // blank
		"  ",    // whitespace only
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
