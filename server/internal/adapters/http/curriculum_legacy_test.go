package http

import (
	"testing"

	"github.com/bingoring/forin/server/internal/curriculum/themed"
	"github.com/bingoring/forin/server/internal/domain/learning"
)

// legacyFixture: three departments, one of which the lift cannot reach.
//
//	ER   → 본관 1F (a hand-authored floor)
//	WARD → 본관 8F
//	GEN  → no floor at all (a generic bank reachable from the department sheet)
func legacyFixture() learning.Journey {
	off := false
	themes := []themed.Theme{
		{Key: "core-safety-er", Name: "ER 안전", Track: "core", Dept: "ER", Order: 10, Exam: &off},
		{Key: "core-safety-ward", Name: "병동 안전", Track: "core", Dept: "WARD", Order: 20, Exam: &off},
		{Key: "gen-call-light", Name: "호출벨", Track: "depth", Dept: "GEN", Order: 30, Exam: &off},
	}
	tags := []themed.ScenarioTag{
		{ID: "SCN-ER-1", Title: "신원확인", Theme: "core-safety-er", Dept: "ER", Difficulty: 1},
		{ID: "SCN-WARD-1", Title: "투약확인", Theme: "core-safety-ward", Dept: "WARD", Difficulty: 1},
		{ID: "SCN-GEN-1", Title: "호출벨 응답", Theme: "gen-call-light", Dept: "GEN", Difficulty: 1},
	}
	return themed.NewEngine(themed.NewCatalog(themes, tags))
}

func TestLegacyCurricula_PlacesThemesOnTheirFloor(t *testing.T) {
	got := legacyCurricula(legacyFixture(), learning.Progress{}, "ko")
	byKey := map[string]legacyCurriculum{}
	for _, c := range got {
		byKey[c.Key] = c
	}
	er, ok := byKey["core-safety-er"]
	if !ok {
		t.Fatalf("ER theme missing from the campus view: %+v", got)
	}
	if er.Building != "본관" || er.Floor != "1F" || er.Where != "본관 1F 응급의료센터" {
		t.Errorf("ER should sit on 본관 1F, got %q %q %q", er.Building, er.Floor, er.Where)
	}
	if w := byKey["core-safety-ward"]; w.Floor != "8F" {
		t.Errorf("WARD should sit on 8F, got %q", w.Floor)
	}
}

func TestLegacyCurricula_DropsDepartmentsTheLiftCannotReach(t *testing.T) {
	for _, c := range legacyCurricula(legacyFixture(), learning.Progress{}, "ko") {
		if c.Key == "gen-call-light" {
			t.Fatalf("GEN has no floor; giving it a building would invent a place: %+v", c)
		}
	}
}

func TestLegacyCurricula_CountsRunsNotSituations(t *testing.T) {
	// One dialogue = two rows (guided, then alone), so the count against that list
	// has to be out of 2 — 1/1 beside two rows would read as a bug.
	got := legacyCurricula(legacyFixture(), learning.Progress{}, "ko")
	for _, c := range got {
		if c.Key != "core-safety-er" {
			continue
		}
		if len(c.Steps) != 2 || c.Total != 2 || c.Done != 0 {
			t.Fatalf("want 2 rows and 0/2, got %d rows and %d/%d", len(c.Steps), c.Done, c.Total)
		}
		if c.State != "todo" || c.Next != "신원확인" {
			t.Errorf("untouched theme should be todo with the now step named: %q %q", c.State, c.Next)
		}
	}
}

func TestLegacyCurricula_ClearedAloneFinishesBothRungs(t *testing.T) {
	p := learning.Progress{
		Cleared: map[learning.ScenarioID]bool{"SCN-ER-1": true},
		Passes:  learning.ClearedPasses{FreeCleared: map[learning.ScenarioID]bool{"SCN-ER-1": true}},
	}
	for _, c := range legacyCurricula(legacyFixture(), p, "ko") {
		if c.Key != "core-safety-er" {
			continue
		}
		if c.Done != 2 || c.State != "done" || c.Next != "" {
			t.Fatalf("a free clear finishes both rungs: %d/%d %q next=%q", c.Done, c.Total, c.State, c.Next)
		}
	}
}

func TestLegacyBuildings_GroupsFloorsUnderOneBuilding(t *testing.T) {
	out := legacyBuildings(legacyCurricula(legacyFixture(), learning.Progress{}, "ko"))
	if len(out) != 1 || out[0].Building != "본관" {
		t.Fatalf("both floors are in 본관, so there is one building: %+v", out)
	}
	if len(out[0].Floors) != 2 || out[0].Floors[0].Floor != "1F" || out[0].Floors[1].Floor != "8F" {
		t.Errorf("floors should follow campus order 1F→8F, got %+v", out[0].Floors)
	}
}

func TestLegacyBuildings_NilJourneyIsEmptyNotNull(t *testing.T) {
	if out := legacyBuildings(legacyCurricula(nil, learning.Progress{}, "ko")); out == nil || len(out) != 0 {
		t.Errorf("a handler wired without a registry serves an empty list, not null: %+v", out)
	}
}

func TestLegacyCurricula_LocalizesThemeNames(t *testing.T) {
	// The campus view is served in the request's language. Theme names are keyed by
	// theme key — not by themes.yaml's nameKey, which is shared across departments
	// and would translate 29 different topics into one English string.
	off := false
	themes := []themed.Theme{{Key: "core-safety-er", Name: "환자 안전·오류 예방", Track: "core", Dept: "ER", Order: 10, Exam: &off}}
	tags := []themed.ScenarioTag{{ID: "SCN-ER-1", Title: "신원확인", Theme: "core-safety-er", Dept: "ER", Difficulty: 1}}
	j := themed.NewEngine(themed.NewCatalog(themes, tags))

	ko := legacyCurricula(j, learning.Progress{}, "ko")
	en := legacyCurricula(j, learning.Progress{}, "en")
	if len(ko) != 1 || len(en) != 1 {
		t.Fatalf("want one curriculum in each locale, got %d and %d", len(ko), len(en))
	}
	if ko[0].Name != "환자 안전·오류 예방" {
		t.Errorf("Korean should render the authored name, got %q", ko[0].Name)
	}
	// Asserting the strings DIFFER, not that they exist: a lookup that silently
	// ignored the locale would return identical Korean and pass any presence check.
	if en[0].Name == ko[0].Name {
		t.Errorf("English should not fall back to Korean for a translated theme: %q", en[0].Name)
	}
	if en[0].Where == ko[0].Where {
		t.Errorf("the floor heading should localize too: %q", en[0].Where)
	}
}

func TestLegacyCurricula_RepointsResumeWhenItsThemeHasNoFloor(t *testing.T) {
	// The learner's last attempt is a GEN scenario, so the engine resumes there — and
	// GEN sits on no floor. The campus view must still name one place to continue.
	p := learning.Progress{Latest: "SCN-GEN-1"}
	out := legacyCurricula(legacyFixture(), p, "ko")
	n := 0
	for _, c := range out {
		if c.Resume {
			n++
		}
	}
	if n != 1 {
		t.Fatalf("want exactly one resume target the screen can show, got %d in %d curricula", n, len(out))
	}
}

func TestLegacyCurricula_KeepsTheEnginesResumeWhenItIsReachable(t *testing.T) {
	p := learning.Progress{Latest: "SCN-WARD-1"}
	for _, c := range legacyCurricula(legacyFixture(), p, "ko") {
		if c.Resume && c.Key != "core-safety-ward" {
			t.Errorf("the view must not move a resume target it can show: %q", c.Key)
		}
	}
}
