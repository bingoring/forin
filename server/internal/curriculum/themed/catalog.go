package themed

import "sort"

// Catalog holds the assembled curricula, built once at boot from the DB tags.
// Content changes require a re-seed + restart, so there is no runtime refresh.
// It stays safe when no scenario is tagged yet (P1 coexists with the legacy
// hardcoded path until P2 tagging completes): assembly yields no tracks.
type Catalog struct {
	curricula []Curriculum
	deptOrder []string
	orphans   []string
}

// NewCatalog assembles the themed catalog from the registry and scenario tags.
func NewCatalog(themes []Theme, tags []ScenarioTag) *Catalog {
	cur, orphans := Assemble(themes, tags)
	// deptOrder: depts present among depth/collab themes, ordered by the
	// smallest Theme.Order seen for each dept, then dept code (R22 determinism).
	firstOrder := map[string]int{}
	for _, c := range cur {
		if c.Theme.Track == "core" {
			continue
		}
		if o, ok := firstOrder[c.Theme.Dept]; !ok || c.Theme.Order < o {
			firstOrder[c.Theme.Dept] = c.Theme.Order
		}
	}
	depts := make([]string, 0, len(firstOrder))
	for d := range firstOrder {
		depts = append(depts, d)
	}
	sort.Slice(depts, func(i, j int) bool {
		if firstOrder[depts[i]] != firstOrder[depts[j]] {
			return firstOrder[depts[i]] < firstOrder[depts[j]]
		}
		return depts[i] < depts[j]
	})
	return &Catalog{curricula: cur, deptOrder: depts, orphans: orphans}
}

// Resolve overlays a learner's progress onto the assembled catalog.
func (c *Catalog) Resolve(cleared, attempted map[string]bool, latest string) []TrackGroup {
	return Resolve(c.curricula, c.deptOrder, cleared, attempted, latest)
}

// Orphans lists scenario ids that declared no known theme (R3 gate; empty once
// P2 tagging is complete).
func (c *Catalog) Orphans() []string { return c.orphans }
