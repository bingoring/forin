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

// Who you are talking to changes what opening and closing mean.
//
// The group detail lives with the mapping (internal/domain/content/goalshape_test.go);
// what this checks is the generator's own contract — every role its topic tables use
// produces a usable pair, and the pairs are not all the same string.
func TestOpenAndCloseAreRoleAware(t *testing.T) {
	roles := map[string]bool{}
	for _, d := range Depts {
		for _, tp := range d.Topics {
			roles[tp.Role] = true
		}
	}
	if len(roles) < 3 {
		t.Fatalf("only %d roles in the topic tables — they are not being read", len(roles))
	}
	opens := map[string]bool{}
	for r := range roles {
		o, c := content.OpenGoal(r), content.CloseGoal(r)
		if o == "" || c == "" {
			t.Errorf("role %q produced an empty goal", r)
		}
		opens[o] = true
	}
	// The topic tables use patient, parent, child, colleague and doctor: at least four
	// distinct openings, or the role-awareness is not reaching the generated content.
	if len(opens) < 4 {
		t.Errorf("%d roles collapsed to %d openings — the grouping is not reaching the content", len(roles), len(opens))
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

// A child-role topic must be cast with a child.
//
// `child` had no case in personaFor and fell through to the adult patient pool, so 116
// scenarios shipped with a 50-year-old called Mrs. Rossi cast as the child. The
// role-play could not work: the model was told to be a frightened toddler and handed
// the persona of a woman in her fifties.
func TestChildRoleDrawsFromTheChildPool(t *testing.T) {
	if len(children) == 0 {
		t.Fatal("there is no child persona pool")
	}
	adult := map[string]bool{}
	for _, p := range patients {
		adult[p.Name] = true
	}
	for k := 0; k < personaPoolLen("child"); k++ {
		p := personaFor("child", 3, k)
		if adult[p.Name] {
			t.Errorf("child persona %d is an adult patient: %s", k, p.Name)
		}
		// The age has to be a child's, or the briefing shows "4y / Female" next to "50s".
		switch p.Age {
		case "0-2", "3-6", "7-12":
		default:
			t.Errorf("child persona %s has age range %q", p.Name, p.Age)
		}
	}
}

// A neonate cannot hold a conversation in any language, so a topic set in the nursery
// is a conversation with the PARENT. Casting it as the patient made the whole exchange
// incoherent, and gave it an opening goal ("환자 본인 확인") no learner could satisfy.
func TestNeonatalTopicsAddressTheGuardian(t *testing.T) {
	for _, d := range Depts {
		for _, tp := range d.Topics {
			if !strings.Contains(tp.Title, "신생아") {
				continue
			}
			if tp.Role == "child" {
				t.Errorf("%q is cast as the child; a newborn cannot converse — the partner is the parent", tp.Title)
			}
		}
	}
}

// Whoever a topic is cast as, its persona pool must be non-empty — an empty pool
// panics the generator at index time, which is a build-breaking way to add a role.
func TestEveryTopicRoleHasAPersonaPool(t *testing.T) {
	for _, d := range Depts {
		for _, tp := range d.Topics {
			if personaPoolLen(tp.Role) == 0 {
				t.Errorf("role %q (topic %q) has no persona pool", tp.Role, tp.Title)
			}
		}
	}
}
