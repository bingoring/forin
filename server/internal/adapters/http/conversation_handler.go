package http

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/bingoring/forin/server/internal/domain/conversation"
	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

type conversationHandler struct {
	engine    *conversation.Engine
	progress  ports.ProgressRepo  // records the graded attempt (scaled XP + clear state)
	content   ports.ContentReader // scenario title for the presence label
	colleague ports.ColleagueRepo // presence: what this user is working on right now
}

// @Summary Start a persona-driven conversation for a scenario
// @Tags conversation
// @Security Bearer
// @Router /scenarios/{id}/conversation [post]
// resumableResp is what the client needs to offer "이어서 대화 / 새로 시작":
// the session to resume and the turns already said. `role` is the stored role
// (user | assistant) — the client maps it to its own speaker labels.
type resumableTurn struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type resumableResp struct {
	SessionID string          `json:"sessionId"`
	Turns     []resumableTurn `json:"turns"`
}

type discardResp struct {
	Discarded bool `json:"discarded"`
}

// discard — POST /conversation/{sessionId}/discard
//
// Leaving a role-play can mean "throw this away", not just "step out". A discarded
// session is never offered back for resuming, so the next visit starts clean. The turns
// stay: study time is derived from them and the learner did spend those minutes.
//
// @Summary Throw a conversation away so it is not offered for resuming
// @Tags conversation
// @Success 200 {object} discardResp
// @Router /conversation/{sessionId}/discard [post]
func (h *conversationHandler) discard(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	// Nothing to discard is a 200, not a 404. The learner asked for it to be gone and it
	// is gone; whether a row moved is the server's business, and a failure here would put
	// an error in front of someone who is on their way out.
	ok, err := h.engine.Discard(r.Context(), uid, r.PathValue("sessionId"))
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "could not discard the conversation")
		return
	}
	httpx.JSON(w, http.StatusOK, discardResp{Discarded: ok})
}

// resumable — GET /scenarios/{id}/conversation/last
//
// @Summary Previous conversation for a scenario, if any
// @Tags conversation
// @Success 200 {object} resumableResp
// @Router /scenarios/{id}/conversation/last [get]
func (h *conversationHandler) resumable(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	sessionID, turns, err := h.engine.Resumable(r.Context(), uid, r.PathValue("id"))
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "could not read the previous conversation")
		return
	}
	// Nothing to resume is a normal 200 with an empty payload, not a 404: the
	// client asks this on every entry and a 404 would look like a failure.
	out := resumableResp{SessionID: sessionID, Turns: make([]resumableTurn, 0, len(turns))}
	for _, t := range turns {
		out.Turns = append(out.Turns, resumableTurn{Role: t.Role, Content: t.Content})
	}
	httpx.JSON(w, http.StatusOK, out)
}

func (h *conversationHandler) start(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	// An explicit resumeSessionId re-enters that conversation instead of opening
	// a new one. Default stays "fresh session" so existing callers are unchanged.
	var req struct {
		ResumeSessionID string `json:"resumeSessionId"`
	}
	// The error is deliberately ignored: an absent body is the normal case (start
	// fresh), so a decode failure just leaves ResumeSessionID empty. A malformed
	// body cannot smuggle a resume through — it would have to decode first.
	_ = httpx.DecodeJSON(r, &req)
	if req.ResumeSessionID != "" {
		if err := h.engine.ResumeSession(r.Context(), uid, r.PathValue("id"), req.ResumeSessionID); err != nil {
			httpx.Error(w, http.StatusForbidden, "that conversation is not yours to resume")
			return
		}
		h.touchPresence(r, uid, r.PathValue("id"))
		httpx.JSON(w, http.StatusOK, map[string]string{"sessionId": req.ResumeSessionID})
		return
	}
	sessionID, err := h.engine.StartSession(r.Context(), uid, r.PathValue("id"))
	if errors.Is(err, conversation.ErrScenarioNotFound) {
		httpx.Error(w, http.StatusNotFound, "scenario not found")
		return
	}
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "could not start conversation")
		return
	}
	// Starting a scenario is the one moment we know exactly what someone is doing —
	// record it so colleagues see "지금 ICU 승압제 진행 중" instead of a bare timestamp.
	h.touchPresence(r, uid, r.PathValue("id"))
	httpx.JSON(w, http.StatusOK, map[string]string{"sessionId": sessionID})
}

// touchPresence is best-effort: a presence write must never fail a lesson.
func (h *conversationHandler) touchPresence(r *http.Request, uid, scenarioID string) {
	if h.colleague == nil {
		return
	}
	label := ""
	if h.content != nil {
		if sc, err := h.content.GetScenario(r.Context(), scenarioID); err == nil && sc != nil {
			label = sc.Title
		}
	}
	_ = h.colleague.TouchPresence(r.Context(), uid, scenarioID, label)
}

// @Summary Send a message; NPC replies in persona (LLM)
// @Tags conversation
// @Security Bearer
// @Param body body messageReq true "user message"
// @Router /conversation/{sessionId}/message [post]
func (h *conversationHandler) message(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req messageReq
	if err := httpx.DecodeJSON(r, &req); err != nil || req.Text == "" {
		httpx.Error(w, http.StatusBadRequest, "text is required")
		return
	}
	reply, err := h.engine.SendMessage(r.Context(), uid, r.PathValue("sessionId"), req.Text)
	if errors.Is(err, conversation.ErrSessionNotFound) {
		httpx.Error(w, http.StatusNotFound, "session not found")
		return
	}
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "ai unavailable")
		return
	}
	// mood/moodImproved are omitted when absent, so a client that only reads `reply`
	// is unaffected and an untagged turn sends neither.
	out := map[string]any{"reply": reply.Text}
	if reply.Mood != "" {
		out["mood"] = reply.Mood
	}
	if reply.Improved {
		out["moodImproved"] = true
	}
	httpx.JSON(w, http.StatusOK, out)
}

// @Summary AI-correct an English utterance (creates a review card)
// @Tags conversation
// @Security Bearer
// @Param body body correctReq true "utterance to correct"
// @Success 200 {object} conversation.Correction
// @Router /correct [post]
func (h *conversationHandler) correct(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req correctReq
	if err := httpx.DecodeJSON(r, &req); err != nil || req.Text == "" {
		httpx.Error(w, http.StatusBadRequest, "text is required")
		return
	}
	c, err := h.engine.Correct(r.Context(), uid, req.Text, req.Context, "", progress.ReviewContext{})
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "ai unavailable")
		return
	}
	httpx.JSON(w, http.StatusOK, c)
}

// @Summary Grade the finished conversation, award scaled XP, return the result
// @Tags conversation
// @Security Bearer
// @Router /conversation/{sessionId}/complete [post]
func (h *conversationHandler) complete(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	g, err := h.engine.GradeSession(r.Context(), uid, r.PathValue("sessionId"))
	if errors.Is(err, conversation.ErrNoTurns) {
		// Nothing was said — not an error the client should retry; it means "중단".
		httpx.Error(w, http.StatusUnprocessableEntity, "no dialogue to grade")
		return
	}
	if errors.Is(err, conversation.ErrSessionNotFound) {
		httpx.Error(w, http.StatusNotFound, "session not found")
		return
	}
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "could not grade conversation")
		return
	}
	state := "attempted"
	if g.Passed {
		state = "cleared"
	}
	p, err := h.progress.RecordAttempt(r.Context(), uid, g.ScenarioID, g.XPAwarded, state, g.Score)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not record attempt")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"progress": p, "grade": g, "xpAwarded": g.XPAwarded})
}

// @Summary Send a message; NPC reply streamed as Server-Sent Events (LLM)
// @Tags conversation
// @Security Bearer
// @Param body body messageReq true "user message"
// @Router /conversation/{sessionId}/stream [post]
func (h *conversationHandler) stream(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req messageReq
	if err := httpx.DecodeJSON(r, &req); err != nil || req.Text == "" {
		httpx.Error(w, http.StatusBadRequest, "text is required")
		return
	}
	flusher, ok := w.(http.Flusher)
	if !ok {
		httpx.Error(w, http.StatusInternalServerError, "streaming unsupported")
		return
	}
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.WriteHeader(http.StatusOK)
	flusher.Flush()

	// The mood rides its own named SSE event, ahead of the text.
	//
	// A named event rather than an inline marker in the text stream: the deltas are
	// what the learner reads, and putting protocol in them means every client has to
	// parse it out correctly or show the learner a tag. Unnamed `data:` frames stay
	// exactly what they were, so a client that ignores this event behaves as before.
	onMood := func(mood string) {
		b, _ := json.Marshal(mood)
		if _, err := fmt.Fprintf(w, "event: mood\ndata: %s\n\n", b); err != nil {
			return // the write error surfaces on the next delta
		}
		flusher.Flush()
	}
	// Each chunk is JSON-encoded so newlines don't break SSE framing.
	reply, err := h.engine.SendMessageStream(r.Context(), uid, r.PathValue("sessionId"), req.Text, onMood, func(chunk string) error {
		b, _ := json.Marshal(chunk)
		if _, err := fmt.Fprintf(w, "data: %s\n\n", b); err != nil {
			return err
		}
		flusher.Flush()
		return nil
	})
	if err != nil {
		// status already sent; signal via an SSE error event.
		fmt.Fprint(w, "event: error\ndata: \"ai unavailable\"\n\n")
		flusher.Flush()
		return
	}
	// Sent last, after the text: the celebration belongs to a line the learner has
	// finished reading. Only on improvement — see MoodImproved for why there is no
	// event for getting worse.
	if reply.Improved {
		b, _ := json.Marshal(reply.Mood)
		fmt.Fprintf(w, "event: moodImproved\ndata: %s\n\n", b)
		flusher.Flush()
	}
	fmt.Fprint(w, "event: done\ndata: \"[DONE]\"\n\n")
	flusher.Flush()
}

type messageReq struct {
	Text string `json:"text"`
}

type correctReq struct {
	Text    string `json:"text"`
	Context string `json:"context"`
}
