package http

import (
	"context"
	"testing"

	"github.com/bingoring/forin/server/internal/curriculum/themed"
	"github.com/bingoring/forin/server/internal/ports"
)

// fakeProgress satisfies ports.ProgressRepo by embedding it (nil), overriding
// only the three reads curriculumTracks calls. Any other call would panic —
// which is the point: it proves the handler touches nothing else.
type fakeProgress struct {
	ports.ProgressRepo
	cleared, attempted map[string]bool
	latest             string
}

func (f fakeProgress) ClearedScenarioIDs(context.Context, string) (map[string]bool, error) {
	return f.cleared, nil
}
func (f fakeProgress) AttemptedScenarioIDs(context.Context, string) (map[string]bool, error) {
	return f.attempted, nil
}
func (f fakeProgress) LatestAttemptScenarioID(context.Context, string) (string, error) {
	return f.latest, nil
}

func TestCurriculumTracks_nilCatalogEmpty(t *testing.T) {
	ph := &progressHandler{} // themed nil, progress nil — handler must not touch either
	var out struct {
		Tracks []themed.TrackGroup `json:"tracks"`
	}
	getJSON(t, ph.curriculumTracks, "/me/curriculum/tracks", &out)
	if out.Tracks == nil || len(out.Tracks) != 0 {
		t.Fatalf("nil catalog → empty (non-null) tracks, got %+v", out.Tracks)
	}
}

func TestCurriculumTracks_shape(t *testing.T) {
	themes := []themed.Theme{
		{Key: "core-sbar", Name: "SBAR", Track: "core", Order: 10},
		{Key: "er-triage", Name: "트리아지", Track: "depth", Dept: "ER", Order: 20},
	}
	tags := []themed.ScenarioTag{
		{ID: "SCN-CORE-1", Title: "인계", Theme: "core-sbar", Dept: "CORE", Difficulty: 1},
		{ID: "SCN-ER-1", Title: "트리아지1", Theme: "er-triage", Dept: "ER", Difficulty: 1},
	}
	ph := &progressHandler{
		themed:   themed.NewCatalog(themes, tags),
		progress: fakeProgress{cleared: map[string]bool{"SCN-ER-1": true}, latest: "SCN-ER-1"},
	}
	var out struct {
		Tracks []themed.TrackGroup `json:"tracks"`
	}
	getJSON(t, ph.curriculumTracks, "/me/curriculum/tracks", &out)
	if len(out.Tracks) != 2 || out.Tracks[0].Dept != "CORE" || out.Tracks[1].Dept != "ER" {
		t.Fatalf("want CORE then ER, got %+v", out.Tracks)
	}
	// er-triage is the latest attempt's theme → here
	found := false
	for _, c := range out.Tracks[1].Curricula {
		if c.ThemeKey == "er-triage" {
			found = true
			if c.State != "here" {
				t.Errorf("er-triage should be here, got %s", c.State)
			}
		}
	}
	if !found {
		t.Fatal("er-triage curriculum missing from ER track")
	}
}
