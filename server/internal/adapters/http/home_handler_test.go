package http

import (
	"testing"

	"github.com/bingoring/forin/server/internal/domain/learning"
)

// homeJourneyStub answers only what currentStep asks: Resume, Tracks, Steps. The
// other three learning.Journey methods are unused by currentStep and panic-free
// zero values here on purpose — a call into them would be a sign the function
// started reading something it should not.
type homeJourneyStub struct {
	resume learning.StepRef
	tracks []learning.TrackGroup
	steps  map[learning.ThemeKey][]learning.StepState
}

func (s homeJourneyStub) Tracks(learning.Progress) []learning.TrackGroup { return s.tracks }
func (s homeJourneyStub) Next(learning.Progress, learning.ScenarioID) learning.StepRef {
	return learning.StepRef{}
}
func (s homeJourneyStub) Resume(learning.Progress) learning.StepRef { return s.resume }
func (s homeJourneyStub) Guidance(learning.ScenarioID, learning.Progress) learning.GuideLevel {
	return learning.GuideFree
}
func (s homeJourneyStub) Locate(learning.ScenarioID) (learning.StepRef, bool) {
	return learning.StepRef{}, false
}
func (s homeJourneyStub) Steps(theme learning.ThemeKey, _ learning.Progress) []learning.StepState {
	return s.steps[theme]
}

// The normal case: ER has a floor, so deptLabel should read exactly what the
// retired campus presenter used to print, and the pool key should be the
// content-authored "er" (not the raw "ER").
func TestCurrentStep_HappyPathOnACampusDept(t *testing.T) {
	j := homeJourneyStub{
		resume: learning.StepRef{Theme: "core-safety-er", Found: true},
		tracks: []learning.TrackGroup{
			{Dept: "ER", Curricula: []learning.CurriculumState{{ThemeKey: "core-safety-er", Name: "환자 안전"}}},
		},
		steps: map[learning.ThemeKey][]learning.StepState{
			"core-safety-er": {
				{Kind: "dlg", Name: "신원확인", ScenarioID: "SCN-ER-1", State: "done"},
				{Kind: "dlg", Name: "신원확인", ScenarioID: "SCN-ER-1", State: "now"},
			},
		},
	}
	dept, deptLabel, one := currentStep(j, learning.Progress{}, "ko")
	if dept != "er" {
		t.Errorf("content pools filter on the lowercase pool key, got %q", dept)
	}
	if deptLabel != "본관 1F 응급의료센터" {
		t.Errorf("deptLabel should be the floor's translated Where text, got %q", deptLabel)
	}
	if one == nil || one.Chapter != "본관 1F 응급의료센터 · 환자 안전" {
		t.Fatalf("chapter is \"deptLabel · stationName\": got %+v", one)
	}
	if one.Progress.Done != 1 || one.Progress.Total != 2 {
		t.Errorf("done/total over the two rows: got %+v", one.Progress)
	}
}

// Resuming into a floorless department (GEN — J9) must never leak the raw
// department code onto the screen. campus.Of("GEN") fails, so deptLabel must
// degrade to "" rather than "GEN", and the chapter must drop the "dept · "
// prefix instead of gluing an empty label onto the station name.
func TestCurrentStep_FloorlessDeptNeverShowsTheRawCode(t *testing.T) {
	j := homeJourneyStub{
		resume: learning.StepRef{Theme: "gen-call-light", Found: true},
		tracks: []learning.TrackGroup{
			{Dept: "GEN", Curricula: []learning.CurriculumState{{ThemeKey: "gen-call-light", Name: "호출벨 응답"}}},
		},
		steps: map[learning.ThemeKey][]learning.StepState{
			"gen-call-light": {{Kind: "dlg", Name: "호출벨 응답", ScenarioID: "SCN-GEN-1", State: "now"}},
		},
	}
	dept, deptLabel, one := currentStep(j, learning.Progress{}, "ko")
	if deptLabel == "GEN" {
		t.Fatalf("the raw department code must never reach the screen as a label")
	}
	if deptLabel != "" {
		t.Errorf("GEN has no floor; deptLabel should be empty, got %q", deptLabel)
	}
	if one == nil || one.Chapter != "호출벨 응답" {
		t.Fatalf("with no dept label the chapter is the station name alone, got %+v", one)
	}
	if dept != "" {
		t.Errorf("GEN is not in the pool alias table; want the shared pool (\"\"), got %q", dept)
	}
}

// A bonus quiz gates nothing and is not counted — the same rule the retired
// legacyOne presenter enforced before this logic moved into currentStep.
func TestCurrentStep_ExcludesOptionalFromProgress(t *testing.T) {
	j := homeJourneyStub{
		resume: learning.StepRef{Theme: "t", Found: true},
		tracks: []learning.TrackGroup{
			{Dept: "ER", Curricula: []learning.CurriculumState{{ThemeKey: "t", Name: "n"}}},
		},
		steps: map[learning.ThemeKey][]learning.StepState{
			"t": {
				{ScenarioID: "a", State: "done"},
				{ScenarioID: "b", State: "done", Optional: true},
				{ScenarioID: "c", State: "now"},
			},
		},
	}
	_, _, one := currentStep(j, learning.Progress{}, "ko")
	if one == nil {
		t.Fatal("want a today-one card")
	}
	if one.Progress.Done != 1 || one.Progress.Total != 2 {
		t.Fatalf("the optional row must not be counted: got %+v", one.Progress)
	}
}

// The retired campus presenter derived the pool key by pattern-matching the
// RENDERED floor label, which folded several departments sharing a floor's
// wording into one voice: a surgical/orthopedic ward reads "병동" just like the
// medical one, NICU/PICU share "중환자", and the women's-and-kids clinic shares
// "소아" with the children's ward. Lower-casing the raw department code loses
// every one of those folds, so this pins the alias table's answer for a sample
// spanning all three folded pools plus a department that never had one.
func TestCurrentStep_FoldsRelatedDeptsIntoTheAuthoredPoolKey(t *testing.T) {
	cases := []struct {
		deptCode string
		want     string
	}{
		{"WOMENKIDS", "peds"}, // outpatient clinic shares 소아 with the children's ward
		{"PSYCH", "ward"},     // 정신과 "병동" — reads as a ward like WARD/SURGWARD/ORTHOWARD
		{"ONCO", "ward"},      // 종양 "병동"
		{"HOSPICE", "ward"},   // 완화의료 "병동"
		{"GERI", "ward"},      // 노인성 질환 "병동" (shares HOSPICE's floor)
		{"SURGWARD", "ward"},  // 외과 "병동"
		{"ORTHOWARD", "ward"}, // 정형외과 "병동"
		{"NICU", "icu"},       // 신생아·소아 "중환자"실 (shares PICU's floor)
		{"PICU", "icu"},       // same floor, same "중환자" wording
		{"RAD", ""},           // 영상의학과 — never matched any of the six patterns
	}
	for _, c := range cases {
		j := homeJourneyStub{
			resume: learning.StepRef{Theme: "t", Found: true},
			tracks: []learning.TrackGroup{
				{Dept: c.deptCode, Curricula: []learning.CurriculumState{{ThemeKey: "t", Name: "n"}}},
			},
			steps: map[learning.ThemeKey][]learning.StepState{
				"t": {{ScenarioID: "s", State: "now"}},
			},
		}
		dept, _, _ := currentStep(j, learning.Progress{}, "ko")
		if dept != c.want {
			t.Errorf("%s: want pool key %q, got %q", c.deptCode, c.want, dept)
		}
	}
}

// Everything finished (Resume.Found == false) must degrade to the rest card, not
// an invented task.
func TestCurrentStep_NothingLeftReturnsNoCard(t *testing.T) {
	j := homeJourneyStub{resume: learning.StepRef{Found: false}}
	dept, deptLabel, one := currentStep(j, learning.Progress{}, "ko")
	if dept != "" || deptLabel != "" || one != nil {
		t.Fatalf("everything finished must degrade to no card: dept=%q deptLabel=%q one=%+v", dept, deptLabel, one)
	}
}

// Should be unreachable (Resume only ever names a theme its own engine's catalog
// holds), but a Tracks lookup that finds nothing must not fall through into a
// card with an empty " · " chapter — the regression a missing `break` would
// otherwise mask on a single-theme catalog.
func TestCurrentStep_ResumeThemeMissingFromTracksDegradesSafely(t *testing.T) {
	j := homeJourneyStub{
		resume: learning.StepRef{Theme: "ghost", Found: true},
		tracks: []learning.TrackGroup{
			{Dept: "ER", Curricula: []learning.CurriculumState{{ThemeKey: "core-safety-er", Name: "n"}}},
		},
		// j.Steps(ref.Theme, p) is called with the RAW resume theme regardless of
		// whether Tracks found a matching station — a "now" row here is what would
		// turn a missing `found` guard into a card with an empty " · " chapter
		// instead of no card at all.
		steps: map[learning.ThemeKey][]learning.StepState{
			"ghost": {{ScenarioID: "s", State: "now"}},
		},
	}
	dept, deptLabel, one := currentStep(j, learning.Progress{}, "ko")
	if dept != "" || deptLabel != "" || one != nil {
		t.Fatalf("an unmatched resume theme must not produce a card: dept=%q deptLabel=%q one=%+v", dept, deptLabel, one)
	}
}
