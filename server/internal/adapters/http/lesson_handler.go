package http

import (
	"context"
	"encoding/json"
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
	Words     []content.Word   `json:"words"`
	Sentences []lessonSentence `json:"sentences"`
	// Nuance are the situation's nuance items (v45); the client splits them by kind
	// into STEP 1 (slider, pair) and STEP 2 (reel, context, swap).
	Nuance []content.Nuance `json:"nuance"`
}

// lessonSentence is a STEP 2 sentence as this learner meets it.
type lessonSentence struct {
	content.Sentence
	// Review marks a sentence that uses a word missed in the last STEP 1 run — STEP 2
	// brings these first ("틀린 단어는 STEP 2 문장에 다시 나와요").
	Review bool `json:"review,omitempty"`
}

// stepBody is the optional body of POST …/steps/{step}.
type stepBody struct {
	// Missed are the word ids answered wrong in STEP 1. Ignored for other steps.
	Missed []string `json:"missed"`
}

// build assembles the lesson; ok=false means no such scenario.
func (h *lessonHandler) build(ctx context.Context, uid, scenarioID string) (lessonResp, bool, error) {
	s, err := h.content.GetScenario(ctx, scenarioID)
	if err != nil || s == nil {
		return lessonResp{}, false, err
	}
	// A read that failed is an error, not "no profile": falling back to the default level
	// or to "nothing cleared" would draw the wrong steps as if they were true. (No profile
	// yet is (nil, nil) and does fall back.)
	level := user.DefaultLevel
	p, err := h.profiles.GetProfile(ctx, uid)
	if err != nil {
		return lessonResp{}, false, err
	}
	if p != nil {
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
	missed := map[string]bool{}
	for _, id := range recorded[string(learning.StepWords)].Missed {
		missed[id] = true
	}
	view := make([]lessonSentence, len(sentences))
	for i, sn := range sentences {
		view[i] = lessonSentence{Sentence: sn}
		for _, id := range sn.Words {
			if missed[id] {
				view[i].Review = true
				break
			}
		}
	}
	nuance := s.Nuance
	if nuance == nil {
		nuance = []content.Nuance{}
	}
	guided, free, err := h.passes.ClearedByGuide(ctx, uid)
	if err != nil {
		return lessonResp{}, false, err
	}
	passes := learning.ClearedPasses{GuidedCleared: scenarioSet(guided), FreeCleared: scenarioSet(free)}
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
		Sentences: view,
		Nuance:    nuance,
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
// @Param body body stepBody false "STEP 1 에서 틀린 단어 id (words 만)"
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
	// Only this lesson's own words are kept: the body comes from a client, and a stray id
	// would mark nothing and sit in the record forever.
	var body stepBody
	if r.ContentLength != 0 {
		_ = httpx.DecodeJSON(r, &body)
	}
	var missed []string
	if step == string(learning.StepWords) {
		taught := map[string]bool{}
		for _, wd := range lesson.Words {
			taught[wd.ID] = true
		}
		for _, id := range body.Missed {
			if taught[id] {
				missed = append(missed, id)
			}
		}
	}
	if err := h.lessons.ClearStep(r.Context(), uid, id, step, missed); err != nil {
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

type reelFeelReq struct {
	Feel string `json:"feel"`
}

// @Summary 문장 릴의 감상 하나를 교정노트에 남긴다 — 정답 없음, 칩은 그 릴의 feels 중 하나, 한 단어는 한 번만
// @Tags progress
// @Security Bearer
// @Param scenarioId path string true "시나리오 id"
// @Param body body reelFeelReq true "고른 감상 칩"
// @Success 200 {object} confusedWordResp
// @Router /me/lesson/{scenarioId}/reel/feel [post]
func (h *lessonHandler) reelFeel(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req reelFeelReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}
	lesson, ok, err := h.build(r.Context(), uid, r.PathValue("scenarioId"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	var reel *content.Nuance
	for i := range lesson.Nuance {
		if lesson.Nuance[i].Kind == content.NuanceReel {
			reel = &lesson.Nuance[i]
			break
		}
	}
	if !ok || reel == nil {
		httpx.Error(w, http.StatusNotFound, "no reel in this lesson")
		return
	}
	// Only a chip the reel offers — there is no right answer, but there is a fixed set.
	known := false
	for _, f := range reel.Feels {
		if f == req.Feel {
			known = true
			break
		}
	}
	if !known {
		httpx.Error(w, http.StatusBadRequest, "not one of this reel's feels")
		return
	}
	if has, err := h.lessons.HasNuanceCard(r.Context(), uid, reel.Word); err != nil {
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
	// The nuance face (data/reviewCardFace): the word in front, the reel's note behind, the
	// learner's own 감상 kept as the memo. Nothing was said wrong — nothing is struck out.
	id, err := h.review.CreateCard(r.Context(), ports.NewReviewCard{
		UserID: uid, Source: "nuance", Front: reel.Word, Back: reel.Why, Note: req.Feel,
		ScenarioID: sit.ID, Context: rc,
	})
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "record failed")
		return
	}
	httpx.JSON(w, http.StatusOK, confusedWordResp{CardID: id, Created: true})
}
