package themed

import (
	"fmt"
	"path/filepath"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/adapters/contentfile"
	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/learning"
)

// The engine's invariants over the REAL content bundle.
//
// These replace the hardcoded catalog's guard (TestEveryStepNamesItsContent), which
// checked that a hand-written list of ids and names still matched the content files.
// That test could fail for a reason nobody caused — re-authoring a department changed
// a title and the catalog, written elsewhere, still claimed the old one. There is no
// second list now: the path is assembled from the same files it points at, so what is
// left to check is that the assembly itself holds together.
//
// The assembly here mirrors ContentRepo.ListScenarioTags: the runtime reads the same
// projection out of Postgres after a seed, so a bundle that passes here assembles the
// same way in production.
func realCatalog(t *testing.T) (*Catalog, []Theme, []ScenarioTag) {
	t.Helper()
	root := filepath.Join("..", "..", "..", "content")
	bundle, err := contentfile.Load(root)
	if err != nil {
		t.Fatalf("load content: %v", err)
	}
	themes, err := LoadThemes(filepath.Join(root, "nurse", "themes.yaml"))
	if err != nil {
		t.Fatalf("load themes: %v", err)
	}
	tags := make([]ScenarioTag, 0, len(bundle.Scenarios))
	for _, s := range bundle.Scenarios {
		tags = append(tags, ScenarioTag{
			ID: s.ID, Title: s.Title, Theme: s.Theme, CollabWith: s.CollabWith,
			Dept: deptOf(s.ID), Difficulty: difficultyOf(s),
		})
	}
	return NewCatalog(themes, tags), themes, tags
}

// deptOf pulls the department from a content id: SCN-ER-00001 → "ER" (the same rule
// ContentRepo.scenarioDeptCode applies).
func deptOf(id string) string {
	if parts := strings.SplitN(id, "-", 3); len(parts) >= 3 {
		return parts[1]
	}
	return ""
}

func difficultyOf(s content.Scenario) int {
	if s.Briefing == nil {
		return 1
	}
	switch {
	case s.Briefing.Difficulty < 1:
		return 1
	case s.Briefing.Difficulty > 3:
		return 3
	}
	return s.Briefing.Difficulty
}

// R3: every scenario belongs to a theme. An orphan is content the journey cannot
// reach — authored, seeded, and invisible.
func TestInvariant_NoOrphans(t *testing.T) {
	cat, _, _ := realCatalog(t)
	if n := len(cat.Orphans()); n != 0 {
		first := cat.Orphans()
		if len(first) > 5 {
			first = first[:5]
		}
		t.Fatalf("%d scenario(s) belong to no theme, e.g. %v", n, first)
	}
}

// Every step resolves to a real scenario with a real title. This is what the old
// catalog guard was protecting, and it still matters: a step whose name or id is
// empty renders as a blank row the learner cannot act on.
func TestInvariant_EveryStepNamesItsContent(t *testing.T) {
	cat, _, tags := realCatalog(t)
	title := make(map[string]string, len(tags))
	for _, tg := range tags {
		title[tg.ID] = tg.Title
	}
	for _, c := range cat.curricula {
		for _, ti := range c.Tiers {
			for _, s := range ti.Steps {
				if s.Kind == "boss" && s.ScenarioID == "" {
					continue // the 주제 시험 is assembled, not authored
				}
				if s.ScenarioID == "" {
					t.Fatalf("%s tier %d: a step names no content", c.Theme.Key, ti.Difficulty)
				}
				want, ok := title[s.ScenarioID]
				if !ok {
					t.Fatalf("%s: step points at %q, which is not in the bundle", c.Theme.Key, s.ScenarioID)
				}
				// A step is named by the situation, not the persona: R19 drops the
				// " · <name>" suffix so the list reads as a path rather than a cast.
				if s.Name != stepName(want) {
					t.Fatalf("%s: step %q is named %q but its content is titled %q",
						c.Theme.Key, s.ScenarioID, s.Name, want)
				}
			}
		}
	}
}

// Every registered theme actually assembles, and carries enough situations to be a
// course rather than a stub. A theme in the registry with no content is a station on
// the map the learner walks to and finds empty.
func TestInvariant_EveryThemeHasContent(t *testing.T) {
	_, themes, tags := realCatalog(t)
	// The same floor cmd/audit gates on, so the two cannot disagree about what counts
	// as thin. The authoring target is 21 (D-P2-B); three ER themes sit exactly on the
	// floor at 20, which is a content gap to close, not a broken assembly.
	const minSteps = 20
	rep := Audit(themes, tags, minSteps)
	var thin []string
	for _, st := range rep.Themes {
		if st.Thin {
			thin = append(thin, fmt.Sprintf("%s(%d)", st.Key, st.Count))
		}
	}
	if len(thin) > 0 {
		first := thin
		if len(first) > 5 {
			first = first[:5]
		}
		t.Fatalf("%d theme(s) fall short of %d situations, e.g. %v", len(thin), minSteps, first)
	}
}

// Each department's track is led by its core themes: a learner meets safety,
// language, handoff and family before the department's deep work.
func TestInvariant_DeptCoreLeadsItsTrack(t *testing.T) {
	cat, _, _ := realCatalog(t)
	for _, tg := range cat.Resolve(nil, nil, "") {
		if tg.Dept == "CORE" || len(tg.Curricula) == 0 {
			continue
		}
		seenDepth := false
		for _, c := range tg.Curricula {
			if c.Track == "core" && seenDepth {
				t.Errorf("%s: core theme %q sits after a depth theme", tg.Dept, c.ThemeKey)
			}
			if c.Track != "core" {
				seenDepth = true
			}
		}
	}
}

// A journey built over the whole bundle answers the runtime's questions without
// panicking and without pointing nowhere for a learner who has done nothing.
func TestInvariant_FreshLearnerHasSomewhereToStart(t *testing.T) {
	cat, _, _ := realCatalog(t)
	e := NewEngine(cat)
	ref := e.Resume(learning.Progress{})
	if !ref.Found || ref.Scenario == "" {
		t.Fatalf("a learner who has done nothing must have a first step, got %+v", ref)
	}
	if rows := e.Steps(ref.Theme, learning.Progress{}); len(rows) == 0 {
		t.Errorf("the resume theme %q has no rows to show", ref.Theme)
	}
}
