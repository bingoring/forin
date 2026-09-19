package http

import (
	"context"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/learning"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/ports"
)

// journeyProgress is this file's own progress stub. It must not be named fakeProgress:
// that one lives in curriculum_tracks_test.go, which Task 14 deletes.
type journeyProgress struct{ ports.ProgressRepo }

func (journeyProgress) ClearedScenarioIDs(context.Context, string) (map[string]bool, error) {
	return nil, nil
}
func (journeyProgress) AttemptedScenarioIDs(context.Context, string) (map[string]bool, error) {
	return nil, nil
}
func (journeyProgress) LatestAttemptScenarioID(context.Context, string) (string, error) {
	return "", nil
}
func (journeyProgress) ClearedByGuide(context.Context, string) (map[string]bool, map[string]bool, error) {
	return nil, nil, nil
}

type fakeUsers struct {
	ports.UserRepo // 나머지 호출은 패닉 — 핸들러가 다른 것을 만지지 않음을 증명한다
	goal           string
	set            string
}

func (f fakeUsers) GetProfile(context.Context, string) (*user.Profile, error) {
	return &user.Profile{GoalDept: f.goal}, nil
}
func (f fakeUsers) SetGoalDept(_ context.Context, _, dept string) error { f.set = dept; return nil }

type stubJourneys struct{ j learning.Journey }

func (s stubJourneys) For(learning.Profession) learning.Journey { return s.j }

func TestJourney_DrawsOneTrackAndTheRestAsChips(t *testing.T) {
	h := &journeyHandler{
		progress: journeyProgress{},
		users:    fakeUsers{goal: "WARD"},
		journeys: stubJourneys{j: journeyStub{tracks: fakeTracks()}},
	}
	var out learning.JourneyView
	getJSON(t, h.journey, "/me/journey", &out)

	if out.GoalDept != "WARD" || out.Inferred {
		t.Fatalf("a stored goal is drawn as chosen: %+v", out)
	}
	if out.Track.Dept != "WARD" {
		t.Fatalf("the drawn track is the goal department: %q", out.Track.Dept)
	}
	for _, e := range out.FreeRoam {
		if e.Dept == "WARD" {
			t.Errorf("the goal must not also be a chip")
		}
	}
}

func TestJourney_UnknownGoalFallsBackRatherThanDrawingNothing(t *testing.T) {
	h := &journeyHandler{
		progress: journeyProgress{},
		users:    fakeUsers{goal: "NOSUCHDEPT"},
		journeys: stubJourneys{j: journeyStub{tracks: fakeTracks()}},
	}
	var out learning.JourneyView
	getJSON(t, h.journey, "/me/journey", &out)
	if out.Track.Dept == "" || !out.Inferred {
		t.Fatalf("a goal that left the content falls back to inference: %+v", out)
	}
}

func TestJourney_NoRegistryIsEmptyNotError(t *testing.T) {
	h := &journeyHandler{progress: journeyProgress{}, users: fakeUsers{}}
	var out learning.JourneyView
	getJSON(t, h.journey, "/me/journey", &out)
	if out.FreeRoam == nil {
		t.Errorf("an unwired server serves an empty list, not null")
	}
}
