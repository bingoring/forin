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
}

func (f fakeUsers) GetProfile(context.Context, string) (*user.Profile, error) {
	return &user.Profile{GoalDept: f.goal}, nil
}

// SetGoalDept is deliberately NOT overridden here: the embedded nil ports.UserRepo
// panics on any call this handler makes to it. /me/journey only ever READS the
// stored goal — an inferred department is never persisted (J4) — so this is the
// guard that catches a regression, not a gap in the fake.

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

// A stored goal can name a department that has a floor (so it wins, not-inferred)
// but no track in today's catalog (content not tagged yet). The response must not
// contradict itself: goalDept and track.dept name the same place, even when that
// track is empty.
func TestJourney_StoredGoalWithNoTrackStillNamesItself(t *testing.T) {
	h := &journeyHandler{
		progress: journeyProgress{},
		users:    fakeUsers{goal: "ICU"}, // has a floor (campus.Of), absent from fakeTracks()
		journeys: stubJourneys{j: journeyStub{tracks: fakeTracks()}},
	}
	var out learning.JourneyView
	getJSON(t, h.journey, "/me/journey", &out)

	if out.GoalDept != "ICU" || out.Inferred {
		t.Fatalf("a stored, valid goal is drawn as chosen: %+v", out)
	}
	if out.Track.Dept != out.GoalDept {
		t.Fatalf("goalDept and track.dept must agree: goalDept=%q track.dept=%q", out.GoalDept, out.Track.Dept)
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
