package http

import (
	"errors"
	"net/http"

	"github.com/bingoring/forin/server/internal/domain/conversation"
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
	c, err := h.engine.Correct(r.Context(), uid, req.Text, req.Context)
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "ai unavailable")
		return
	}
	httpx.JSON(w, http.StatusOK, c)
}

type messageReq struct {
	Text string `json:"text"`
}

type correctReq struct {
	Text    string `json:"text"`
	Context string `json:"context"`
}
