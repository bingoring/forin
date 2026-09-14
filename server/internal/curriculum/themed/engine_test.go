package themed

import (
	"testing"

	"github.com/bingoring/forin/server/internal/domain/learning"
)

// fixtureEngine builds a small two-theme catalog:
//
//	core-safety-er (ER core, order 10): SCN-S1 (Lv1)      — no exam (won't block "done")
//	er-chestpain   (ER depth, order 100): SCN-C1, SCN-C2  — no exam
func fixtureEngine() *Engine {
	off := false
	themes := []Theme{
		{Key: "core-safety-er", Name: "안전", Track: "core", Dept: "ER", Order: 10, Exam: &off},
		{Key: "er-chestpain", Name: "흉통", Track: "depth", Dept: "ER", Order: 100, Exam: &off},
	}
	tags := []ScenarioTag{
		{ID: "SCN-S1", Title: "신원확인", Theme: "core-safety-er", Dept: "ER", Difficulty: 1},
		{ID: "SCN-C1", Title: "흉통 초기", Theme: "er-chestpain", Dept: "ER", Difficulty: 1},
		{ID: "SCN-C2", Title: "STEMI", Theme: "er-chestpain", Dept: "ER", Difficulty: 2},
	}
	return NewEngine(NewCatalog(themes, tags))
}

func prog(cleared ...learning.ScenarioID) learning.Progress {
	m := map[learning.ScenarioID]bool{}
	for _, c := range cleared {
		m[c] = true
	}
	return learning.Progress{Cleared: m}
}

func TestEngine_Locate(t *testing.T) {
	e := fixtureEngine()
	ref, ok := e.Locate("SCN-C1")
	if !ok || ref.Theme != "er-chestpain" || ref.Kind != "dlg" || !ref.Found {
		t.Fatalf("locate SCN-C1 wrong: %+v ok=%v", ref, ok)
	}
	if _, ok := e.Locate("SCN-UNKNOWN"); ok {
		t.Errorf("unknown scenario should not locate")
	}
}

func TestEngine_Guidance(t *testing.T) {
	e := fixtureEngine()
	// dlg, never cleared → guided (choices).
	if g := e.Guidance("SCN-C1", prog()); g != learning.GuideChoices {
		t.Errorf("fresh dlg should be choices, got %q", g)
	}
	// dlg with guided pass cleared → free.
	p := learning.Progress{Passes: learning.ClearedPasses{GuidedCleared: map[learning.ScenarioID]bool{"SCN-C1": true}}}
	if g := e.Guidance("SCN-C1", p); g != learning.GuideFree {
		t.Errorf("guided-cleared dlg should be free, got %q", g)
	}
	// outside any course → free.
	if g := e.Guidance("SCN-UNKNOWN", prog()); g != learning.GuideFree {
		t.Errorf("uncatalogued scenario should be free, got %q", g)
	}
}

func TestEngine_Next_retryWhenNotCleared(t *testing.T) {
	e := fixtureEngine()
	// finished C1 but did not pass → do it again.
	ref := e.Next(prog(), "SCN-C1")
	if !ref.Found || ref.Scenario != "SCN-C1" {
		t.Fatalf("not-cleared finish should retry same, got %+v", ref)
	}
}

func TestEngine_Next_advancesWithinThenAcrossThemes(t *testing.T) {
	e := fixtureEngine()
	// cleared C1, just finished C1 → next required in er-chestpain = C2.
	ref := e.Next(prog("SCN-C1"), "SCN-C1")
	if !ref.Found || ref.Scenario != "SCN-C2" {
		t.Fatalf("should advance to C2, got %+v", ref)
	}
	// cleared S1 (its theme now done) → falls to resume theme er-chestpain → C1.
	ref = e.Next(prog("SCN-S1"), "SCN-S1")
	if !ref.Found || ref.Scenario != "SCN-C1" {
		t.Fatalf("finishing last step of a theme should cross to next theme (C1), got %+v", ref)
	}
	// everything cleared → nothing next.
	if ref := e.Next(prog("SCN-S1", "SCN-C1", "SCN-C2"), "SCN-C2"); ref.Found {
		t.Fatalf("all cleared → Next should be empty, got %+v", ref)
	}
}

func TestEngine_Resume(t *testing.T) {
	e := fixtureEngine()
	// fresh learner → first theme in learning order (core-safety-er, order 10) → S1.
	if ref := e.Resume(prog()); !ref.Found || ref.Scenario != "SCN-S1" {
		t.Fatalf("fresh resume should be S1, got %+v", ref)
	}
	// latest attempt in er-chestpain, C1 cleared → resume its open step C2.
	p := prog("SCN-S1", "SCN-C1")
	p.Latest = "SCN-C1"
	if ref := e.Resume(p); !ref.Found || ref.Scenario != "SCN-C2" {
		t.Fatalf("resume should follow latest theme to C2, got %+v", ref)
	}
	// all cleared → no resume.
	if ref := e.Resume(prog("SCN-S1", "SCN-C1", "SCN-C2")); ref.Found {
		t.Fatalf("all cleared → no resume, got %+v", ref)
	}
}

func TestRegistry_ForUnknownProfessionIsEmpty(t *testing.T) {
	r := NewRegistry()
	r.Add("nurse", fixtureEngine())
	if _, ok := r.For("nurse").Locate("SCN-C1"); !ok {
		t.Errorf("nurse engine should locate SCN-C1")
	}
	// unknown profession → empty, safe journey.
	j := r.For("physician")
	if len(j.Tracks(prog())) != 0 {
		t.Errorf("unknown profession should have no tracks")
	}
	if ref := j.Resume(prog()); ref.Found {
		t.Errorf("unknown profession resume should be empty")
	}
}
