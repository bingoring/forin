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

// 트랙 두 개를 흉내 낸다: ER(본관 1F)과 WARD(본관 8F). 둘 다 층이 있는 부서다.
func fakeTracks() []learning.TrackGroup {
	return []learning.TrackGroup{
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

func TestResolveGoalDept_FallsBackToFirstDeptWithAFloor(t *testing.T) {
	dept, inferred := resolveGoalDept("", journeyStub{}, learning.Progress{}, fakeTracks())
	if dept != "ER" || !inferred {
		t.Fatalf("a learner who has done nothing starts at the first reachable dept: got %q", dept)
	}
}

// 층이 없는 부서(GEN)는 목표가 될 수 없다 — 리프트가 설 수 없는 곳이다(J9).
func TestResolveGoalDept_NeverPicksADeptWithNoFloor(t *testing.T) {
	dept, inferred := resolveGoalDept("GEN", journeyStub{}, learning.Progress{}, fakeTracks())
	if dept == "GEN" {
		t.Fatalf("GEN has no floor; the journey cannot draw it")
	}
	if dept != "ER" || !inferred {
		t.Fatalf("the fallback must land on the first reachable dept, inferred: got %q inferred=%v", dept, inferred)
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

func TestSummariseFreeRoam_ExcludesTheGoalAndFloorlessDepts(t *testing.T) {
	got := summariseFreeRoam(fakeTracks(), "ER")
	for _, e := range got {
		if e.Dept == "ER" {
			t.Errorf("the goal department belongs to the path, not the chips")
		}
		if e.Dept == "GEN" {
			t.Errorf("GEN has no floor; the lift cannot stop there")
		}
	}
	if len(got) != 1 || got[0].Dept != "WARD" {
		t.Fatalf("want only WARD, got %+v", got)
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
