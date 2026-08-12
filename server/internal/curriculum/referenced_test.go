package curriculum

import "testing"

// The seed guard needs every id the path points at — including quiz steps,
// whose ScenarioID holds a QZ-* id. Missing those would let a seed delete a
// quiz the curriculum still links to.
func TestReferencedIDsCoversEveryStep(t *testing.T) {
	ids := ReferencedIDs()
	if len(ids) < 100 {
		t.Fatalf("expected the whole path's ids, got %d", len(ids))
	}
	seen := map[string]bool{}
	for _, id := range ids {
		if id == "" {
			t.Fatal("empty id in referenced set")
		}
		if seen[id] {
			t.Fatalf("duplicate id %q — the set must be deduplicated", id)
		}
		seen[id] = true
	}
	var quizzes int
	for _, id := range ids {
		if len(id) >= 3 && id[:3] == "QZ-" {
			quizzes++
		}
	}
	if quizzes == 0 {
		t.Fatal("no QZ-* ids — quiz steps are being dropped")
	}
	for _, c := range catalog {
		for _, s := range c.Steps {
			if s.ScenarioID != "" && !seen[s.ScenarioID] {
				t.Errorf("%s / %s (%s) missing from ReferencedIDs", c.Name, s.Name, s.ScenarioID)
			}
		}
	}
}
