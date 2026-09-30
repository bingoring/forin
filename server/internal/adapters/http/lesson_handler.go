package http

import (
	"context"
	"net/http"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/learning"
	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/i18n"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

// lessonHandler serves one situation as its four steps (v44): words → sentences →
// guided dialogue → free dialogue.
type lessonHandler struct {
	content interface {
		GetScenario(ctx context.Context, id string) (*content.Scenario, error)
	}
	profiles ports.ProfileReader
	passes   interface {
		ClearedByGuide(ctx context.Context, userID string) (guided, free map[string]bool, err error)
	}
	lessons ports.LessonRepo
	review  interface {
		CreateCard(ctx context.Context, c ports.NewReviewCard) (string, error)
	}
}

// lessonSituation is what the hub draws above the step tickets.
type lessonSituation struct {
	ID       string            `json:"id"`
	Title    string            `json:"title"`
	Tagline  string            `json:"tagline"`
	Theme    string            `json:"theme"`
	Persona  content.Persona   `json:"persona"`
	Briefing *content.Briefing `json:"briefing,omitempty"`
}

type lessonResp struct {
	Situation lessonSituation       `json:"situation"`
	Level     string                `json:"level"`
	Steps     []learning.LessonStep `json:"steps"`
	// Words are the bank words the sentences use, in first-use order (STEP 1).
	Words     []content.Word     `json:"words"`
	Sentences []content.Sentence `json:"sentences"`
}

// build assembles the lesson; ok=false means no such scenario.
func (h *lessonHandler) build(ctx context.Context, uid, scenarioID string) (lessonResp, bool, error) {
	s, err := h.content.GetScenario(ctx, scenarioID)
	if err != nil || s == nil {
		return lessonResp{}, false, err
	}
	level := user.DefaultLevel
	if p, err := h.profiles.GetProfile(ctx, uid); err == nil && p != nil {
		level = user.NormalizeLevel(p.TargetLevel)
	}

	sentences := s.Sentences
	if sentences == nil {
		sentences = []content.Sentence{}
	}
	words := []content.Word{}
	if len(sentences) > 0 {
		bank, err := h.lessons.Lexicon(ctx, s.Theme)
		if err != nil {
			return lessonResp{}, false, err
		}
		if used := content.WordsUsed(sentences, bank); used != nil {
			words = used
		}
	}

	recorded, err := h.lessons.StepClears(ctx, uid, s.ID)
	if err != nil {
		return lessonResp{}, false, err
	}
	var passes learning.ClearedPasses
	if guided, free, err := h.passes.ClearedByGuide(ctx, uid); err == nil {
		passes = learning.ClearedPasses{GuidedCleared: scenarioSet(guided), FreeCleared: scenarioSet(free)}
	}
	done := learning.DialogueDone(learning.ScenarioID(s.ID), passes)
	for k := range recorded {
		done[learning.LessonStepKind(k)] = true
	}

	return lessonResp{
		Situation: lessonSituation{
			ID: s.ID, Title: i18n.Tr(i18n.FromContext(ctx), s.ID, s.Title), Tagline: s.Tagline,
			Theme: s.Theme, Persona: s.Persona, Briefing: s.Briefing,
		},
		Level: level,
		Steps: learning.LessonSteps(learning.LessonInput{
			Level: level, Words: len(words), Sentences: len(sentences), Goals: len(s.Goals), Done: done,
		}),
		Words:     words,
		Sentences: sentences,
	}, true, nil
}

// @Summary 상황 학습 4단계 — 단어·문장·가이드 대화·자유 대화의 상태와 콘텐츠
// @Tags progress
// @Security Bearer
// @Param scenarioId path string true "시나리오 id"
// @Success 200 {object} lessonResp
// @Router /me/lesson/{scenarioId} [get]
func (h *lessonHandler) get(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	resp, ok, err := h.build(r.Context(), uid, r.PathValue("scenarioId"))
	switch {
	case err != nil:
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
	case !ok:
		httpx.Error(w, http.StatusNotFound, "scenario not found")
	default:
		httpx.JSON(w, http.StatusOK, resp)
	}
}

// @Summary 상황 학습 단계 완료 기록 — words·sentences 만. 대화 두 회차는 대화를 끝내야 기록된다
// @Tags progress
// @Security Bearer
// @Param scenarioId path string true "시나리오 id"
// @Param step path string true "words | sentences"
// @Success 200 {object} lessonResp
// @Router /me/lesson/{scenarioId}/steps/{step} [post]
func (h *lessonHandler) clearStep(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	step := r.PathValue("step")
	if !learning.IsRecordedStep(step) {
		httpx.Error(w, http.StatusBadRequest, "step must be words or sentences")
		return
	}
	id := r.PathValue("scenarioId")
	lesson, ok, err := h.build(r.Context(), uid, id)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	if !ok {
		httpx.Error(w, http.StatusNotFound, "scenario not found")
		return
	}
	// A step with nothing in it cannot be finished — recording it would draw STEP 1 as
	// done (done beats empty) on a situation that has no words.
	for _, st := range lesson.Steps {
		if string(st.Kind) == step && st.State == learning.StepEmpty {
			httpx.Error(w, http.StatusConflict, "step has no content")
			return
		}
	}
	if err := h.lessons.ClearStep(r.Context(), uid, id, step); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "record failed")
		return
	}
	h.get(w, r)
}

type confusedWordResp struct {
	CardID string `json:"cardId,omitempty"`
	// Created is false when the word was already in the review notes.
	Created bool `json:"created"`
}

// @Summary 헷갈린 단어를 교정노트에 넣는다 — 이 상황이 가르치는 단어만, 한 단어는 한 번만
// @Tags progress
// @Security Bearer
// @Param scenarioId path string true "시나리오 id"
// @Param wordId path string true "단어 id (이 상황 STEP 1 목록의)"
// @Success 200 {object} confusedWordResp
// @Router /me/lesson/{scenarioId}/words/{wordId}/confused [post]
func (h *lessonHandler) confusedWord(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	lesson, ok, err := h.build(r.Context(), uid, r.PathValue("scenarioId"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	var word *content.Word
	for i := range lesson.Words {
		if lesson.Words[i].ID == r.PathValue("wordId") {
			word = &lesson.Words[i]
			break
		}
	}
	if !ok || word == nil {
		httpx.Error(w, http.StatusNotFound, "word not in this lesson")
		return
	}
	if has, err := h.lessons.HasWordCard(r.Context(), uid, word.En); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	} else if has {
		httpx.JSON(w, http.StatusOK, confusedWordResp{})
		return
	}
	sit := lesson.Situation
	rc := progress.ReviewContext{Title: sit.Title, Situation: sit.Tagline}
	if sit.Briefing != nil {
		rc.Dept = sit.Briefing.Dept
		if sit.Briefing.Brief != "" {
			rc.Situation = sit.Briefing.Brief
		}
	}
	// The suggestion face (data/reviewCardFace): meaning in front, headword behind,
	// nothing struck out — the learner did not say it wrong, they did not know it.
	id, err := h.review.CreateCard(r.Context(), ports.NewReviewCard{
		UserID: uid, Source: "word", Front: word.Ko, Back: word.En, Note: word.Example,
		ScenarioID: sit.ID, Context: rc,
	})
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "record failed")
		return
	}
	httpx.JSON(w, http.StatusOK, confusedWordResp{CardID: id, Created: true})
}
