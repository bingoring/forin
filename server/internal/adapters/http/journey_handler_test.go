package http

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/learning"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/ports"
)

// getJSONPath는 net/http의 경로 변수를 심어 핸들러를 직접 부른다(라우터를 거치지 않는다).
func getJSONPath(t *testing.T, h http.HandlerFunc, path, key, val string, out any) {
	t.Helper()
	r := httptest.NewRequest(http.MethodGet, path, nil)
	r.SetPathValue(key, val)
	w := httptest.NewRecorder()
	h(w, r)
	if err := json.NewDecoder(w.Body).Decode(out); err != nil {
		t.Fatalf("decode: %v", err)
	}
}

func getStatusPath(t *testing.T, h http.HandlerFunc, path, key, val string) int {
	t.Helper()
	r := httptest.NewRequest(http.MethodGet, path, nil)
	r.SetPathValue(key, val)
	w := httptest.NewRecorder()
	h(w, r)
	return w.Code
}

func patchJSON(t *testing.T, h http.HandlerFunc, path, body string) int {
	t.Helper()
	w := httptest.NewRecorder()
	h(w, httptest.NewRequest(http.MethodPatch, path, strings.NewReader(body)))
	return w.Code
}

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

func TestStation_ReturnsRowsForAKnownTheme(t *testing.T) {
	h := &journeyHandler{
		progress: journeyProgress{},
		journeys: stubJourneys{j: journeyStub{
			tracks: []learning.TrackGroup{{Dept: "ER", Curricula: []learning.CurriculumState{
				{ThemeKey: "core-safety-er", Name: "안전", Total: 2},
			}}},
			steps: []learning.StepState{
				{Kind: "dlg", Name: "신원확인", ScenarioID: "SCN-ER-1", State: "now", Pass: 1, Passes: 2},
				{Kind: "dlg", Name: "신원확인", ScenarioID: "SCN-ER-1", State: "lock", Pass: 2, Passes: 2},
			},
		}},
	}
	var out learning.StationDetail
	getJSONPath(t, h.station, "/me/journey/stations/core-safety-er", "themeKey", "core-safety-er", &out)

	if out.Station.ThemeKey != "core-safety-er" {
		t.Fatalf("the sheet re-sends its station: %+v", out.Station)
	}
	if len(out.Steps) != 2 || out.Steps[0].Pass != 1 || out.Steps[1].Pass != 2 {
		t.Fatalf("one dialogue is two rows, guided then alone: %+v", out.Steps)
	}
}

func TestStation_UnknownThemeIs404(t *testing.T) {
	h := &journeyHandler{progress: journeyProgress{}, journeys: stubJourneys{j: journeyStub{}}}
	code := getStatusPath(t, h.station, "/me/journey/stations/nope", "themeKey", "nope")
	if code != http.StatusNotFound {
		t.Fatalf("an unknown theme is 404, not an empty sheet: a silent blank hides a content accident, got %d", code)
	}
}
