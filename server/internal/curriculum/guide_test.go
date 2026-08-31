package curriculum

import "testing"

// The shape of a run: guided at the front, a nudge in the middle, unaided at the end.
func TestGuideForWalksFromChoicesToFree(t *testing.T) {
	// A five-step run: 2 guided, 1 hinted, 2 free.
	got := make([]GuideLevel, 5)
	for i := range got {
		got[i] = GuideFor(i, 5, "dlg")
	}
	want := []GuideLevel{GuideChoices, GuideChoices, GuideHint, GuideFree, GuideFree}
	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("step %d = %q, want %q (whole run %v)", i, got[i], want[i], got)
		}
	}
}

func TestAShortRunStillLoosensItsGrip(t *testing.T) {
	// Two steps have no room for a middle, so it is one guided and one free rather than
	// two of the same — a run that never lets go teaches nothing about doing it alone.
	if a, b := GuideFor(0, 2, "dlg"), GuideFor(1, 2, "dlg"); a != GuideChoices || b != GuideFree {
		t.Fatalf("two-step run = (%q, %q), want (choices, free)", a, b)
	}
	// One step has nothing to lean on. Choices beat a blank box, which is the state this
	// whole feature exists to fix.
	if got := GuideFor(0, 1, "dlg"); got != GuideChoices {
		t.Fatalf("single-step run = %q, want choices", got)
	}
}

func TestABossIsAlwaysUnaided(t *testing.T) {
	// It is the curriculum's test. A test with three answers printed under the question
	// is not one — wherever it sits in the run.
	for _, i := range []int{0, 1, 4} {
		if got := GuideFor(i, 5, "boss"); got != GuideFree {
			t.Fatalf("boss at %d = %q, want free", i, got)
		}
	}
	// Including a curriculum that is only a boss: there is nothing before it to have
	// learned from, so there is nothing to be tested on either way.
	if got := GuideFor(0, 1, "boss"); got != GuideFree {
		t.Fatalf("lone boss = %q, want free", got)
	}
}

func TestGuidedStepsComeFirstAndNeverFewerThanTheRest(t *testing.T) {
	// Whatever the length, the front of a run is the part that helps. A rounding that
	// guided fewer steps than it left free would put the hardest half first.
	for total := 1; total <= 12; total++ {
		var choices, free int
		var seen []GuideLevel
		for i := 0; i < total; i++ {
			g := GuideFor(i, total, "dlg")
			seen = append(seen, g)
			switch g {
			case GuideChoices:
				choices++
			case GuideFree:
				free++
			}
		}
		if choices < free {
			t.Fatalf("run of %d guides %d and frees %d: %v", total, choices, free, seen)
		}
		// And it never tightens: once it has stopped offering choices it must not start
		// again, or the run reads as random rather than as a course.
		for i := 1; i < len(seen); i++ {
			if rank(seen[i]) < rank(seen[i-1]) {
				t.Fatalf("run of %d goes backwards at step %d: %v", total, i, seen)
			}
		}
	}
}

func rank(g GuideLevel) int {
	switch g {
	case GuideChoices:
		return 0
	case GuideHint:
		return 1
	default:
		return 2
	}
}

func TestGuideForStepUsesTheCurriculumItIsIn(t *testing.T) {
	c := Curriculum{Steps: []Step{
		{Kind: "dlg", ScenarioID: "A"},
		{Kind: "dlg", ScenarioID: "B"},
		{Kind: "dlg", ScenarioID: "C"},
		{Kind: "boss", ScenarioID: "D"},
	}}
	if got := c.GuideForStep("A"); got != GuideChoices {
		t.Fatalf("first step = %q, want choices", got)
	}
	if got := c.GuideForStep("D"); got != GuideFree {
		t.Fatalf("boss = %q, want free", got)
	}
	// A scenario this curriculum does not contain gets the unassisted app: an unknown
	// context is not a place to invent help for.
	if got := c.GuideForStep("ZZZ"); got != GuideFree {
		t.Fatalf("unknown scenario = %q, want free", got)
	}
}

// The catalog as authored: every curriculum should actually walk the learner down, or
// the feature is only true in the abstract.
func TestTheRealCatalogGuidesItsOpeners(t *testing.T) {
	var guided, runs int
	for _, c := range authored {
		if len(c.Steps) == 0 {
			continue
		}
		runs++
		if c.GuideForStep(c.Steps[0].ScenarioID) == GuideChoices {
			guided++
		}
	}
	if runs == 0 {
		t.Fatal("the catalog is empty")
	}
	// The only openers that are not guided are curricula that open on a boss, which is
	// a deliberate authoring choice and rare.
	if guided*10 < runs*8 {
		t.Fatalf("only %d of %d curricula open with choices", guided, runs)
	}
}
