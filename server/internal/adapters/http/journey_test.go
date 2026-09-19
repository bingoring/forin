package http

import (
	"testing"

	"github.com/bingoring/forin/server/internal/domain/learning"
)

// journeyStub is a learning.Journey that answers only what a test asks about.
type journeyStub struct {
	locate    map[learning.ScenarioID]learning.StepRef
	themeDept map[learning.ThemeKey]string
	steps     []learning.StepState
	tracks    []learning.TrackGroup
}

func (s journeyStub) Tracks(learning.Progress) []learning.TrackGroup { return s.tracks }
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
	}, themeDept: map[learning.ThemeKey]string{"core-safety-ward": "WARD"}}
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
	if dept, _ := resolveGoalDept("GEN", journeyStub{}, learning.Progress{}, fakeTracks()); dept == "GEN" {
		t.Fatalf("GEN has no floor; the journey cannot draw it")
	}
}
