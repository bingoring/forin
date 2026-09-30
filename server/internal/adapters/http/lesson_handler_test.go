package http

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/learning"
	"github.com/bingoring/forin/server/internal/domain/user"
)

type fakeLessonScenarios struct{ s map[string]*content.Scenario }

func (f fakeLessonScenarios) GetScenario(_ context.Context, id string) (*content.Scenario, error) {
	return f.s[id], nil
}

type fakeLessonProfiles struct{ level string }

func (f fakeLessonProfiles) GetProfile(context.Context, string) (*user.Profile, error) {
	return &user.Profile{TargetLevel: f.level}, nil
}

type fakeLessonPasses struct{ guided, free map[string]bool }

func (f fakeLessonPasses) ClearedByGuide(context.Context, string) (map[string]bool, map[string]bool, error) {
	return f.guided, f.free, nil
}

type fakeLessonRepo struct {
	banks   map[string][]content.Word
	cleared map[string]bool
}

func (f *fakeLessonRepo) Lexicon(_ context.Context, theme string) ([]content.Word, error) {
	return f.banks[theme], nil
}
func (f *fakeLessonRepo) StepClears(context.Context, string, string) (map[string]bool, error) {
	return f.cleared, nil
}
func (f *fakeLessonRepo) ClearStep(_ context.Context, _, _, step string) error {
	if f.cleared == nil {
		f.cleared = map[string]bool{}
	}
	f.cleared[step] = true
	return nil
}

// A situation with 3 sentences using 4 distinct bank words (one bank word unused),
// and 2 goals. None of these numbers is 8 or 5 on purpose.
func lessonFixture(level string) (*lessonHandler, *fakeLessonRepo) {
	sc := &content.Scenario{
		ID: "SCN-ER-1", Title: "t", Theme: "core-safety-er", Goals: []string{"g1", "g2"},
		Sentences: []content.Sentence{
			{En: "a b", Words: []string{"w-a", "w-b"}, Goal: 1},
			{En: "b c", Words: []string{"w-b", "w-c"}, Goal: 1},
			{En: "d", Words: []string{"w-d"}, Goal: 2},
		},
	}
	repo := &fakeLessonRepo{banks: map[string][]content.Word{"core-safety-er": {
		{ID: "w-a"}, {ID: "w-b"}, {ID: "w-c"}, {ID: "w-d"}, {ID: "w-unused"},
	}}}
	return &lessonHandler{
		content:  fakeLessonScenarios{s: map[string]*content.Scenario{sc.ID: sc, "SCN-EMPTY": {ID: "SCN-EMPTY", Goals: []string{"g"}}}},
		profiles: fakeLessonProfiles{level: level},
		passes:   fakeLessonPasses{},
		lessons:  repo,
	}, repo
}

func TestLesson_countsFollowContentAndSkipByLevel(t *testing.T) {
	h, _ := lessonFixture("B1")
	resp, ok, err := h.build(context.Background(), "u1", "SCN-ER-1")
	if err != nil || !ok {
		t.Fatalf("build: ok=%v err=%v", ok, err)
	}
	want := []learning.LessonStep{
		{Kind: learning.StepWords, State: learning.StepSkip, Count: 4},
		{Kind: learning.StepSentences, State: learning.StepNow, Count: 3},
		{Kind: learning.StepGuided, State: learning.StepLock, Count: 2},
		{Kind: learning.StepFree, State: learning.StepLock, Count: 2},
	}
	if len(resp.Steps) != len(want) {
		t.Fatalf("steps %+v", resp.Steps)
	}
	for i := range want {
		if resp.Steps[i] != want[i] {
			t.Fatalf("step %d = %+v, want %+v", i, resp.Steps[i], want[i])
		}
	}
	if len(resp.Words) != 4 || resp.Words[0].ID != "w-a" || resp.Words[3].ID != "w-d" {
		t.Fatalf("words should be the 4 used, in first-use order: %+v", resp.Words)
	}
	if len(resp.Sentences) != 3 {
		t.Fatalf("sentences %d, want 3", len(resp.Sentences))
	}
	if resp.Level != "B1" {
		t.Fatalf("level %q", resp.Level)
	}
}

func TestLesson_dialogueRungsComeFromPasses(t *testing.T) {
	h, _ := lessonFixture("B2")
	h.passes = fakeLessonPasses{guided: map[string]bool{"SCN-ER-1": true}}
	resp, _, _ := h.build(context.Background(), "u1", "SCN-ER-1")
	if resp.Steps[2].State != learning.StepDone || resp.Steps[3].State != learning.StepNow {
		t.Fatalf("guided cleared → guided done, free now: %+v", resp.Steps)
	}
}

func TestLesson_noContentIsEmpty(t *testing.T) {
	h, _ := lessonFixture("A2")
	resp, ok, _ := h.build(context.Background(), "u1", "SCN-EMPTY")
	if !ok {
		t.Fatal("scenario exists")
	}
	if resp.Steps[0].State != learning.StepEmpty || resp.Steps[1].State != learning.StepEmpty || resp.Steps[2].State != learning.StepNow {
		t.Fatalf("steps %+v", resp.Steps)
	}
	if resp.Words == nil || resp.Sentences == nil {
		t.Fatal("empty lists must encode as [], not null")
	}
}

func TestLesson_unknownScenarioNotFound(t *testing.T) {
	h, _ := lessonFixture("A2")
	if _, ok, err := h.build(context.Background(), "u1", "nope"); ok || err != nil {
		t.Fatalf("ok=%v err=%v", ok, err)
	}
}

func TestLesson_clearStepRecordsAndAdvances(t *testing.T) {
	h, repo := lessonFixture("A2")
	req := httptest.NewRequest(http.MethodPost, "/me/lesson/SCN-ER-1/steps/words", nil)
	req.SetPathValue("scenarioId", "SCN-ER-1")
	req.SetPathValue("step", "words")
	req = req.WithContext(context.WithValue(req.Context(), userIDKey, "u1"))
	rec := httptest.NewRecorder()
	h.clearStep(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status %d: %s", rec.Code, rec.Body)
	}
	if !repo.cleared["words"] {
		t.Fatal("words step not recorded")
	}
}

// The dialogue rungs are cleared by finishing a conversation; this endpoint must not
// let a client mark them done.
func TestLesson_clearStepRejectsDialogueRungs(t *testing.T) {
	for _, step := range []string{"guided", "free", "bogus"} {
		h, repo := lessonFixture("A2")
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.SetPathValue("scenarioId", "SCN-ER-1")
		req.SetPathValue("step", step)
		req = req.WithContext(context.WithValue(req.Context(), userIDKey, "u1"))
		rec := httptest.NewRecorder()
		h.clearStep(rec, req)
		if rec.Code != http.StatusBadRequest || len(repo.cleared) != 0 {
			t.Fatalf("%s: status %d, cleared %v", step, rec.Code, repo.cleared)
		}
	}
}
