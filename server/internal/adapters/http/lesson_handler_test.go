package http

import (
	"context"
	"net/http"
	"net/http/httptest"
	"reflect"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/learning"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/ports"
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
	missed  map[string][]string
	carded  map[string]bool
}

func (f *fakeLessonRepo) HasWordCard(_ context.Context, _, en string) (bool, error) {
	return f.carded[en], nil
}

type fakeLessonReview struct{ cards []ports.NewReviewCard }

func (f *fakeLessonReview) CreateCard(_ context.Context, c ports.NewReviewCard) (string, error) {
	f.cards = append(f.cards, c)
	return "card-1", nil
}

func (f *fakeLessonRepo) Lexicon(_ context.Context, theme string) ([]content.Word, error) {
	return f.banks[theme], nil
}
func (f *fakeLessonRepo) StepClears(context.Context, string, string) (map[string]ports.LessonStepClear, error) {
	out := map[string]ports.LessonStepClear{}
	for k := range f.cleared {
		out[k] = ports.LessonStepClear{Missed: f.missed[k]}
	}
	return out, nil
}
func (f *fakeLessonRepo) ClearStep(_ context.Context, _, _, step string, missed []string) error {
	if f.cleared == nil {
		f.cleared, f.missed = map[string]bool{}, map[string][]string{}
	}
	f.cleared[step] = true
	f.missed[step] = missed
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
		Nuance: []content.Nuance{{Kind: content.NuanceSwap, Words: []string{"w-b"}}},
	}
	repo := &fakeLessonRepo{banks: map[string][]content.Word{"core-safety-er": {
		{ID: "w-a", En: "wristband", Ko: "손목 밴드", Example: "Let me check your wristband."}, {ID: "w-b"}, {ID: "w-c"}, {ID: "w-d"}, {ID: "w-unused", En: "unused"},
	}}}
	return &lessonHandler{
		content:  fakeLessonScenarios{s: map[string]*content.Scenario{sc.ID: sc, "SCN-EMPTY": {ID: "SCN-EMPTY", Goals: []string{"g"}}}},
		profiles: fakeLessonProfiles{level: level},
		passes:   fakeLessonPasses{},
		lessons:  repo,
		review:   &fakeLessonReview{},
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

func confusedReq(scenarioID, wordID string) *http.Request {
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	req.SetPathValue("scenarioId", scenarioID)
	req.SetPathValue("wordId", wordID)
	return req.WithContext(context.WithValue(req.Context(), userIDKey, "u1"))
}

// 헷갈려요 files the word into the existing review notes: meaning on the front, the
// headword on the back — the suggestion face, since nothing was said wrong.
func TestLesson_confusedWordFilesAReviewCard(t *testing.T) {
	h, _ := lessonFixture("A2")
	rec := httptest.NewRecorder()
	h.confusedWord(rec, confusedReq("SCN-ER-1", "w-a"))
	if rec.Code != http.StatusOK {
		t.Fatalf("status %d: %s", rec.Code, rec.Body)
	}
	cards := h.review.(*fakeLessonReview).cards
	if len(cards) != 1 {
		t.Fatalf("cards %d, want 1", len(cards))
	}
	c := cards[0]
	if c.Source != "word" || c.Front != "손목 밴드" || c.Back != "wristband" || c.ScenarioID != "SCN-ER-1" || c.UserID != "u1" {
		t.Fatalf("card %+v", c)
	}
}

func TestLesson_confusedWordIsFiledOnce(t *testing.T) {
	h, repo := lessonFixture("A2")
	repo.carded = map[string]bool{"wristband": true}
	rec := httptest.NewRecorder()
	h.confusedWord(rec, confusedReq("SCN-ER-1", "w-a"))
	if rec.Code != http.StatusOK || len(h.review.(*fakeLessonReview).cards) != 0 {
		t.Fatalf("status %d, cards %d — a word already filed must not be filed again", rec.Code, len(h.review.(*fakeLessonReview).cards))
	}
}

// Only a word this situation actually teaches can be filed — not any id in the bank.
func TestLesson_confusedWordMustBeInTheLesson(t *testing.T) {
	h, _ := lessonFixture("A2")
	for _, id := range []string{"w-unused", "nope"} {
		rec := httptest.NewRecorder()
		h.confusedWord(rec, confusedReq("SCN-ER-1", id))
		if rec.Code != http.StatusNotFound || len(h.review.(*fakeLessonReview).cards) != 0 {
			t.Fatalf("%s: status %d", id, rec.Code)
		}
	}
}

func TestLesson_clearStepRefusesAStepWithNoContent(t *testing.T) {
	h, repo := lessonFixture("A2")
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	req.SetPathValue("scenarioId", "SCN-EMPTY")
	req.SetPathValue("step", "words")
	req = req.WithContext(context.WithValue(req.Context(), userIDKey, "u1"))
	rec := httptest.NewRecorder()
	h.clearStep(rec, req)
	if rec.Code != http.StatusConflict || len(repo.cleared) != 0 {
		t.Fatalf("status %d, cleared %v", rec.Code, repo.cleared)
	}
}

func postStep(h *lessonHandler, scenarioID, step, body string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(body))
	req.SetPathValue("scenarioId", scenarioID)
	req.SetPathValue("step", step)
	req = req.WithContext(context.WithValue(req.Context(), userIDKey, "u1"))
	rec := httptest.NewRecorder()
	h.clearStep(rec, req)
	return rec
}

// v45: the words missed in STEP 1 come back first in STEP 2. The client sends them with
// the STEP 1 clear; ids that are not this lesson's words are dropped, not stored.
func TestLesson_missedWordsMarkTheirSentencesForReview(t *testing.T) {
	h, repo := lessonFixture("A2")
	if rec := postStep(h, "SCN-ER-1", "words", `{"missed":["w-c","w-nope"]}`); rec.Code != http.StatusOK {
		t.Fatalf("status %d: %s", rec.Code, rec.Body)
	}
	if m := repo.missed["words"]; len(m) != 1 || m[0] != "w-c" {
		t.Fatalf("stored missed %v, want [w-c]", m)
	}
	resp, _, _ := h.build(context.Background(), "u1", "SCN-ER-1")
	var got []bool
	for _, s := range resp.Sentences {
		got = append(got, s.Review)
	}
	// sentence 0 uses a,b · 1 uses b,c · 2 uses d
	if want := []bool{false, true, false}; !reflect.DeepEqual(got, want) {
		t.Fatalf("review %v, want %v", got, want)
	}
}

func TestLesson_noBodyStillClears(t *testing.T) {
	h, repo := lessonFixture("A2")
	if rec := postStep(h, "SCN-ER-1", "words", ""); rec.Code != http.StatusOK || !repo.cleared["words"] {
		t.Fatalf("status %d, cleared %v", rec.Code, repo.cleared)
	}
}

func TestLesson_carriesNuance(t *testing.T) {
	h, _ := lessonFixture("A2")
	resp, _, _ := h.build(context.Background(), "u1", "SCN-ER-1")
	if len(resp.Nuance) != 1 || resp.Nuance[0].Kind != content.NuanceSwap {
		t.Fatalf("nuance %+v", resp.Nuance)
	}
	empty, _, _ := h.build(context.Background(), "u1", "SCN-EMPTY")
	if empty.Nuance == nil {
		t.Fatal("no nuance must encode as [], not null")
	}
}
