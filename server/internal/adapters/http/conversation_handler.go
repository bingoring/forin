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
func (h *conversationHandler) start(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
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
	httpx.JSON(w, http.StatusOK, map[string]string{"reply": reply})
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

	// Each chunk is JSON-encoded so newlines don't break SSE framing.
	_, err := h.engine.SendMessageStream(r.Context(), uid, r.PathValue("sessionId"), req.Text, func(chunk string) error {
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
