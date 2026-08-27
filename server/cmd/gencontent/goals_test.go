package main

import (
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
)

// Every generated scenario must be genuinely multi-step. Two goals made one good
// question plus a summary a full clear; with the opening and closing that is no
// longer possible in one breath.
func TestComposedGoalsAreFourSteps(t *testing.T) {
	got := content.ComposeGoals("patient", []string{"통증 사정", "의사에게 인계"})
	if len(got) != 4 {
		t.Fatalf("goals = %d, want 4: %v", len(got), got)
	}
	// Opening first, closing last — the order of the conversation, which is also the
	// order the mission tracker lists them in.
	if !strings.Contains(got[0], "자기소개") {
		t.Errorf("first goal is not the opening: %q", got[0])
	}
	if !strings.Contains(got[3], "마무리") {
		t.Errorf("last goal is not the closing: %q", got[3])
	}
	// The authored goals survive untouched and in order.
	if got[1] != "통증 사정" || got[2] != "의사에게 인계" {
		t.Errorf("authored goals were altered: %v", got[1:3])
	}
}

// Who you are talking to changes what opening and closing mean. A colleague handoff
// does not begin with confirming their identity, and a patient encounter does not
// begin by stating your agenda.
func TestOpenAndCloseAreRoleAware(t *testing.T) {
	for _, role := range []string{"patient", "child", "parent", "family", "colleague", "doctor"} {
		if content.OpenGoal(role) == "" || content.CloseGoal(role) == "" {
			t.Fatalf("%s has an empty opening or closing", role)
		}
	}
	// A colleague conversation leads with the point (SBAR's S).
	if !strings.Contains(content.OpenGoal("colleague"), "용건") {
		t.Errorf("colleague opening = %q; want it to lead with the purpose", content.OpenGoal("colleague"))
	}
	if content.OpenGoal("doctor") != content.OpenGoal("colleague") {
		t.Error("doctor and colleague are both professional handoffs; they should open the same way")
	}
	// A guardian is not the patient: the relationship has to be established.
	if !strings.Contains(content.OpenGoal("parent"), "관계") {
		t.Errorf("parent opening = %q; want the relationship established", content.OpenGoal("parent"))
	}
	if content.OpenGoal("family") != content.OpenGoal("parent") {
		t.Error("parent and family are both guardians; they should open the same way")
	}
	// A patient encounter confirms who you are speaking to.
	if !strings.Contains(content.OpenGoal("patient"), "본인 확인") {
		t.Errorf("patient opening = %q; want identity confirmed", content.OpenGoal("patient"))
	}
	// The three groups must actually differ, or the role-awareness is decorative.
	if content.OpenGoal("patient") == content.OpenGoal("parent") || content.OpenGoal("patient") == content.OpenGoal("colleague") {
		t.Error("the role groups produce the same opening")
	}
}

// An unknown role must still produce a usable pair rather than an empty goal that
// dilutes the coverage denominator.
func TestUnknownRoleFallsBackToThePatientForm(t *testing.T) {
	if content.OpenGoal("pharmacist-liaison") != content.OpenGoal("patient") {
		t.Error("an unknown role should fall back to the patient form, not to empty")
	}
	if content.CloseGoal("") != content.CloseGoal("patient") {
		t.Error("an empty role should fall back to the patient form")
	}
}

// A topic with no authored goals still gets the two structural ones — better than a
// scenario with nothing to cover, which score.go grades on clarity alone.
func TestATopicWithNoAuthoredGoalsStillHasStructure(t *testing.T) {
	got := content.ComposeGoals("patient", nil)
	if len(got) != 2 {
		t.Errorf("goals = %v, want the opening and closing", got)
	}
}

// The authored slice must not be mutated: the topic table is shared across every
// variant of that topic, and appending into it would make each variant longer than
// the last.
func TestComposeDoesNotMutateTheTopicTable(t *testing.T) {
	authored := []string{"a", "b"}
	first := content.ComposeGoals("patient", authored)
	second := content.ComposeGoals("patient", authored)
	if len(authored) != 2 {
		t.Fatalf("the topic's own slice grew to %v", authored)
	}
	if len(first) != len(second) {
		t.Errorf("two calls produced %d and %d goals", len(first), len(second))
	}
}

// Goals must be distinct within a scenario: a duplicate would count twice toward
// coverage, so a learner could clear by doing one thing well.
func TestComposedGoalsAreDistinct(t *testing.T) {
	// A topic whose authored goal happens to resemble the closing.
	got := content.ComposeGoals("patient", []string{"다음에 무엇이 일어날지 설명하고 마무리", "통증 사정"})
	seen := map[string]bool{}
	for _, g := range got {
		if seen[g] {
			t.Errorf("duplicate goal %q in %v", g, got)
		}
		seen[g] = true
	}
}

// Every authored topic gets four goals after composition. Read from the tables
// themselves so a topic added later cannot quietly ship with two.
func TestEveryAuthoredTopicComposesToFourOrMore(t *testing.T) {
	total, thin := 0, 0
	for _, d := range Depts {
		for _, tp := range d.Topics {
			total++
			got := content.ComposeGoals(tp.Role, tp.Goals)
			if len(got) < 4 {
				thin++
				t.Errorf("%q composes to only %d goals: %v", tp.Title, len(got), got)
			}
			// And no goal is blank — EvidencedGoals skips blanks, which would silently
			// shrink the denominator and make the rest worth more.
			for _, g := range got {
				if strings.TrimSpace(g) == "" {
					t.Errorf("%q has a blank goal", tp.Title)
				}
			}
		}
	}
	if total < 200 {
		t.Fatalf("only %d topics scanned — the tables are not being read", total)
	}
	t.Logf("%d topics, %d thin", total, thin)
}
