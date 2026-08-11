package curriculum

import "testing"

// The path must cover every floor the lift can reach: the old catalog stopped at
// four floors of one building and left the rest unreachable except by wandering.
func TestCatalogIsGapless(t *testing.T) {
	if len(catalog) < 25 {
		t.Fatalf("expected the hand-authored opening plus one chapter per floor, got %d", len(catalog))
	}
	seenCh := map[int]bool{}
	for i, c := range catalog {
		if c.Ch != i+1 {
			t.Fatalf("chapter %d is numbered %d — numbering must be contiguous", i, c.Ch)
		}
		if seenCh[c.Ch] {
			t.Fatalf("duplicate chapter number %d", c.Ch)
		}
		seenCh[c.Ch] = true
		if c.Name == "" || c.Dept == "" {
			t.Fatalf("chapter %d is missing a name or a floor", c.Ch)
		}
		if len(c.Steps) == 0 && c.Total == 0 {
			t.Fatalf("chapter %d (%s) has nothing to do", c.Ch, c.Name)
		}
	}
}

// A step that points at a scenario id nobody generated is a dead end for the
// learner, and the home screen's "오늘의 한 가지" would hand them a broken link.
func TestEveryStepHasAScenario(t *testing.T) {
	for _, c := range catalog {
		for _, s := range c.Steps {
			if s.ScenarioID == "" {
				t.Errorf("%s / %s has no scenario", c.Name, s.Name)
			}
		}
	}
}
