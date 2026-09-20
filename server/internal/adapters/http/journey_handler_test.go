package http

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/bingoring/forin/server/internal/domain/auth"
	"github.com/bingoring/forin/server/internal/domain/learning"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/i18n"
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

// The engine's Name is authored Korean; the journey screen is the only place left
// that can prove translation reaches a real response now that the campus presenter
// (which used to do this — L4.4) is gone. core-safety-er/SCN-ER-00001 are real,
// already-authored catalog entries (internal/i18n/theme_en.go, content_en.go), so
// this is checking the wiring, not inventing new fixtures.
func TestJourney_TranslatesStationNamesForTheRequestsLocale(t *testing.T) {
	tracks := []learning.TrackGroup{
		{Dept: "ER", Curricula: []learning.CurriculumState{
			{ThemeKey: "core-safety-er", Name: "환자 안전·오류 예방", State: "open"},
		}},
	}
	h := &journeyHandler{
		progress: journeyProgress{},
		users:    fakeUsers{goal: "ER"},
		journeys: stubJourneys{j: journeyStub{tracks: tracks}},
	}
	req := httptest.NewRequest(http.MethodGet, "/me/journey", nil)
	req = req.WithContext(i18n.WithLocale(req.Context(), "en"))
	w := httptest.NewRecorder()
	h.journey(w, req)
	var out learning.JourneyView
	if err := json.NewDecoder(w.Body).Decode(&out); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if len(out.Track.Curricula) != 1 {
		t.Fatalf("want one station, got %+v", out.Track.Curricula)
	}
	if got := out.Track.Curricula[0].Name; got != "Patient safety and error prevention" {
		t.Errorf("station name not translated for en: got %q", got)
	}
}

// Same wiring, for the station sheet's own name and its steps' names — keyed by
// ScenarioID rather than ThemeKey (a step's id is what the row already carries).
func TestStation_TranslatesNamesForTheRequestsLocale(t *testing.T) {
	h := &journeyHandler{
		progress: journeyProgress{},
		journeys: stubJourneys{j: journeyStub{
			tracks: []learning.TrackGroup{{Dept: "ER", Curricula: []learning.CurriculumState{
				{ThemeKey: "core-safety-er", Name: "환자 안전·오류 예방", Total: 1},
			}}},
			steps: []learning.StepState{
				{Kind: "dlg", Name: "흉통 환자 트리아지", ScenarioID: "SCN-ER-00001", State: "now"},
			},
		}},
	}
	req := httptest.NewRequest(http.MethodGet, "/me/journey/stations/core-safety-er", nil)
	req.SetPathValue("themeKey", "core-safety-er")
	req = req.WithContext(i18n.WithLocale(req.Context(), "en"))
	w := httptest.NewRecorder()
	h.station(w, req)
	var out learning.StationDetail
	if err := json.NewDecoder(w.Body).Decode(&out); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if out.Station.Name != "Patient safety and error prevention" {
		t.Errorf("station sheet's own name not translated for en: got %q", out.Station.Name)
	}
	if len(out.Steps) != 1 || out.Steps[0].Name != "Chest-pain triage" {
		t.Errorf("step name not translated for en: got %+v", out.Steps)
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

// goalDeptStore is TestSetGoalDept's own fake, separate from fakeUsers on purpose:
// fakeUsers embeds a nil ports.UserRepo so it panics if a handler calls anything
// beyond GetProfile — that is the regression guard for J4 ("an inferred goal
// department is never persisted"). setGoalDept is the first legitimate caller of
// SetGoalDept, so it needs a fake that actually records the call; overriding
// SetGoalDept on fakeUsers would blind that guard for every other test in this file.
type goalDeptStore struct {
	ports.UserRepo
	set   string
	calls int
}

func (s *goalDeptStore) SetGoalDept(_ context.Context, _ string, dept string) error {
	s.set = dept
	s.calls++
	return nil
}

func TestSetGoalDept_PersistsAKnownDepartment(t *testing.T) {
	users := &goalDeptStore{}
	h := &journeyHandler{users: users}
	code := patchJSON(t, h.setGoalDept, "/me/goal-dept", `{"dept":"WARD"}`)
	if code != http.StatusOK || users.set != "WARD" {
		t.Fatalf("a known department is stored: code=%d set=%q", code, users.set)
	}
	if users.calls != 1 {
		t.Fatalf("SetGoalDept must be called exactly once, got %d", users.calls)
	}
}

func TestSetGoalDept_RejectsADepartmentTheLiftCannotReach(t *testing.T) {
	users := &goalDeptStore{}
	h := &journeyHandler{users: users}
	if code := patchJSON(t, h.setGoalDept, "/me/goal-dept", `{"dept":"GEN"}`); code != http.StatusBadRequest {
		t.Fatalf("GEN has no floor; the journey cannot draw it, got %d", code)
	}
	if users.set != "" || users.calls != 0 {
		t.Errorf("a rejected department must not be written: set=%q calls=%d", users.set, users.calls)
	}
}

func TestStation_UnknownThemeIs404(t *testing.T) {
	h := &journeyHandler{progress: journeyProgress{}, journeys: stubJourneys{j: journeyStub{}}}
	code := getStatusPath(t, h.station, "/me/journey/stations/nope", "themeKey", "nope")
	if code != http.StatusNotFound {
		t.Fatalf("an unknown theme is 404, not an empty sheet: a silent blank hides a content accident, got %d", code)
	}
}

// TestJourneyRoutesRequireAuth boots the REAL router (NewRouter) and checks that
// requests with no bearer token are turned away before they reach a handler. This
// replaces three earlier per-handler tests that each built their own
// requireAuth(tokens)(http.HandlerFunc(...)) wrapper directly — a shape borrowed
// from TestSpeechAudioRequiresAuth that verifies "this handler behind requireAuth
// returns 401" (already true, trivially) but can never catch the actual regression
// that matters: router.go registering a journey route WITHOUT the auth(...) wrap.
// Only a router-level test can catch that, and it does: flip one of the three
// mux.Handle("...", auth(...)) lines in router.go back to a bare handler and this
// test fails (verified by hand — see task-7-report.md).
//
// NewRouter only wires handler structs together; it does no I/O, so it is safe to
// start with every dependency but Tokens left zero. Env is set to a non-"prod",
// non-"dev" value with DevAuthSecret empty so the dev-only bypass route is not
// registered either (not that it matters here, but it keeps this router honest
// about what a real deployment looks like).
func TestJourneyRoutesRequireAuth(t *testing.T) {
	tokens := auth.NewTokenService([]byte("test-signing-key-0123456789"), "forin-test", time.Hour)
	router := NewRouter(Deps{
		Env:    "test",
		Tokens: tokens,
		Log:    slog.New(slog.NewTextHandler(io.Discard, nil)),
	})

	cases := []struct {
		name   string
		method string
		path   string
	}{
		{"journey", http.MethodGet, "/me/journey"},
		{"station", http.MethodGet, "/me/journey/stations/core-safety-er"},
		{"setGoalDept", http.MethodPatch, "/me/goal-dept"},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			var body io.Reader
			if c.method == http.MethodPatch {
				body = strings.NewReader(`{"dept":"WARD"}`)
			}
			req := httptest.NewRequest(c.method, c.path, body)
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			if w.Code != http.StatusUnauthorized {
				t.Fatalf("no bearer token must be 401, got %d: %s", w.Code, w.Body.String())
			}
		})
	}
}
