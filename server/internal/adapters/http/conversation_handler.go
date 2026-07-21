package http

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/bingoring/forin/server/internal/domain/conversation"
	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/platform/httpx"
)

type conversationHandler struct{ engine *conversation.Engine }

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
	httpx.JSON(w, http.StatusOK, map[string]string{"sessionId": sessionID})
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
