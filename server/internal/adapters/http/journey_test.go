package http

import (
	"testing"

	"github.com/bingoring/forin/server/internal/domain/learning"
)

// journeyStub is a learning.Journey that answers only what a test asks about.
type journeyStub struct {
	locate map[learning.ScenarioID]learning.StepRef
	steps  []learning.StepState
	tracks []learning.TrackGroup
	// gotTracks, when set, captures the Progress a handler actually passed to
	// Tracks. Every other field here answers with a fixed value regardless of the
	// argument, which is exactly the hole that let /me/journey ship without ever
	// calling its translation function (found only on final branch review): no
	// stub recorded what it was called WITH, so a handler that built the real
	// progress and then discarded it (e.g. calling Tracks(learning.Progress{})
	// instead of Tracks(p)) still passed every test in this package.
	gotTracks *learning.Progress
}

func (s journeyStub) Tracks(p learning.Progress) []learning.TrackGroup {
	if s.gotTracks != nil {
		*s.gotTracks = p
	}
	return s.tracks
}
func (s journeyStub) Next(learning.Progress, learning.ScenarioID) learning.StepRef {
	return learning.StepRef{}
}
func (s journeyStub) Resume(learning.Progress) learning.StepRef { return learning.StepRef{} }
func (s journeyStub) Guidance(learning.ScenarioID, learning.Progress) learning.GuideLevel {
	return learning.GuideFree
}
func (s journeyStub) Locate(id learning.ScenarioID) (learning.StepRef, bool) {
	ref, ok := s.locate[id]
	return ref, ok
}
func (s journeyStub) Steps(learning.ThemeKey, learning.Progress) []learning.StepState { return s.steps }

// 네 트랙을 흉내 낸다: CORE(보편 커리큘럼, 부서가 아니다), ER(본관 1F)·WARD(본관 8F, 둘 다 층이
// 있다), GEN(층이 없지만 주제가 저작된 부서 — J9, 개정 2026-09-20 기준으로도 목표/자유탐방에 나온다).
func fakeTracks() []learning.TrackGroup {
	return []learning.TrackGroup{
		{Dept: "CORE", Curricula: []learning.CurriculumState{{ThemeKey: "core-universal", State: "open"}}},
		{Dept: "ER", Curricula: []learning.CurriculumState{{ThemeKey: "core-safety-er", State: "open"}}},
		{Dept: "WARD", Curricula: []learning.CurriculumState{{ThemeKey: "core-safety-ward", State: "open"}}},
		{Dept: "GEN", Curricula: []learning.CurriculumState{{ThemeKey: "gen-call-light", State: "open"}}},
	}
}

func TestResolveGoalDept_StoredChoiceWins(t *testing.T) {
	dept, inferred := resolveGoalDept("WARD", nil, learning.Progress{}, fakeTracks())
	if dept != "WARD" || inferred {
		t.Fatalf("a stored choice is the answer: got %q inferred=%v", dept, inferred)
	}
}

func TestResolveGoalDept_InfersFromLatestAttempt(t *testing.T) {
	j := journeyStub{locate: map[learning.ScenarioID]learning.StepRef{
		"SCN-WARD-1": {Theme: "core-safety-ward", Found: true},
	}}
	dept, inferred := resolveGoalDept("", j, learning.Progress{Latest: "SCN-WARD-1"}, fakeTracks())
	if dept != "WARD" || !inferred {
		t.Fatalf("an unset goal follows the latest attempt: got %q inferred=%v", dept, inferred)
	}
}

// CORE leads every track slice (the engine always emits it first), so the fallback
// must skip past it to the first actual department — otherwise a learner who has
// done nothing would get "CORE" as a goal, which is not a place the journey draws.
func TestResolveGoalDept_FallsBackToFirstAuthoredDeptNotCore(t *testing.T) {
	dept, inferred := resolveGoalDept("", journeyStub{}, learning.Progress{}, fakeTracks())
	if dept != "ER" || !inferred {
		t.Fatalf("a learner who has done nothing starts at the first authored dept, skipping CORE: got %q", dept)
	}
}

// 층이 없어도 주제가 저작되어 있으면 목표가 될 수 있다 — GEN이 그 예다(J9, 개정 2026-09-20).
func TestResolveGoalDept_StoredChoiceCanBeATopicWithNoFloor(t *testing.T) {
	dept, inferred := resolveGoalDept("GEN", journeyStub{}, learning.Progress{}, fakeTracks())
	if dept != "GEN" || inferred {
		t.Fatalf("GEN has an authored topic; a stored choice of it must win outright: got %q inferred=%v", dept, inferred)
	}
}

// A stored goal of "CORE" must never be accepted: CORE is the universal curriculum
// the engine emits alongside every department, not a department itself.
func TestResolveGoalDept_StoredCoreIsNotADepartment(t *testing.T) {
	dept, inferred := resolveGoalDept("CORE", journeyStub{}, learning.Progress{}, fakeTracks())
	if dept == "CORE" {
		t.Fatalf("CORE is not a department the journey can aim at")
	}
	if dept != "ER" || !inferred {
		t.Fatalf("a rejected stored goal falls back to inference, not to CORE itself: got %q inferred=%v", dept, inferred)
	}
}

func TestRescopeCurrent_KeepsHereWhenItIsInThisTrack(t *testing.T) {
	in := learning.TrackGroup{Dept: "ER", Curricula: []learning.CurriculumState{
		{ThemeKey: "a", State: "passed"},
		{ThemeKey: "b", State: "here", Resume: true},
		{ThemeKey: "c", State: "open"},
	}}
	out := rescopeCurrent(in)
	if out.Curricula[1].State != "here" || !out.Curricula[1].Resume {
		t.Fatalf("an existing here stays: %+v", out.Curricula[1])
	}
	if out.Curricula[2].Resume {
		t.Errorf("the view must not add a second resume target")
	}
}

// 목표 부서를 막 바꾼 학습자: 최근 시도는 다른 부서라 이 트랙에 here가 없다.
func TestRescopeCurrent_PointsAtFirstUnfinishedWithoutInventingHere(t *testing.T) {
	in := learning.TrackGroup{Dept: "ER", Curricula: []learning.CurriculumState{
		{ThemeKey: "a", State: "passed"},
		{ThemeKey: "b", State: "open"},
		{ThemeKey: "c", State: "open"},
	}}
	out := rescopeCurrent(in)
	if !out.Curricula[1].Resume {
		t.Fatalf("the first unfinished station becomes the target: %+v", out.Curricula)
	}
	if out.Curricula[1].State != "open" {
		t.Errorf(`state must stay "open": promoting it to "here" would claim the learner was just there, which is false`)
	}
	n := 0
	for _, c := range out.Curricula {
		if c.Resume {
			n++
		}
	}
	if n != 1 {
		t.Errorf("exactly one target, got %d", n)
	}
}

// The goal department and CORE (not a department) are excluded; a floorless-but-
// authored dept (GEN) is INCLUDED — J9, revised 2026-09-20. Floor-having depts sort
// by the campus directory first (WARD, ER's own building-mate), then GEN — which has
// no floor to sort by — is appended after.
func TestSummariseFreeRoam_ExcludesGoalAndCoreButIncludesTopicsWithNoFloor(t *testing.T) {
	got := summariseFreeRoam(fakeTracks(), "ER")
	for _, e := range got {
		if e.Dept == "ER" {
			t.Errorf("the goal department belongs to the path, not the chips")
		}
		if e.Dept == "CORE" {
			t.Errorf("CORE is not a department; it must never appear as a chip")
		}
	}
	if len(got) != 2 || got[0].Dept != "WARD" || got[1].Dept != "GEN" {
		t.Fatalf("want WARD (floored) then GEN (floorless, appended), got %+v", got)
	}
}

// The tail (departments with no floor) must sort the same way on every call — it
// must not depend on Go's randomised map iteration.
func TestSummariseFreeRoam_OrderIsStableAcrossCalls(t *testing.T) {
	tracks := fakeTracks()
	first := summariseFreeRoam(tracks, "ER")
	for i := 0; i < 20; i++ {
		got := summariseFreeRoam(tracks, "ER")
		if len(got) != len(first) {
			t.Fatalf("length changed across calls: %+v vs %+v", first, got)
		}
		for i := range got {
			if got[i].Dept != first[i].Dept {
				t.Fatalf("order changed across calls: %+v vs %+v", first, got)
			}
		}
	}
}

func TestSummariseFreeRoam_StampsArePassedStations(t *testing.T) {
	tracks := []learning.TrackGroup{{Dept: "WARD", Curricula: []learning.CurriculumState{
		{State: "passed"}, {State: "passed"}, {State: "open"},
	}}}
	got := summariseFreeRoam(tracks, "ER")
	if got[0].Passed != 2 || got[0].Total != 3 {
		t.Fatalf("stamps count passed stations: got %d/%d", got[0].Passed, got[0].Total)
	}
}

func TestRescopeCurrent_NoTargetWhenEverythingIsPassed(t *testing.T) {
	in := learning.TrackGroup{Dept: "ER", Curricula: []learning.CurriculumState{
		{ThemeKey: "a", State: "passed"}, {ThemeKey: "b", State: "passed"},
	}}
	for _, c := range rescopeCurrent(in).Curricula {
		if c.Resume {
			t.Fatalf("a finished track has nothing to continue: %+v", c)
		}
	}
}
