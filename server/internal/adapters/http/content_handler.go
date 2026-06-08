package http

import (
	"net/http"

	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

type contentHandler struct{ content ports.ContentReader }

// @Summary Content manifest (version)
// @Tags content
// @Router /content/manifest [get]
func (h *contentHandler) manifest(w http.ResponseWriter, r *http.Request) {
	m, err := h.content.Manifest(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "manifest unavailable")
		return
	}
	httpx.JSON(w, http.StatusOK, m)
}

// @Summary List events (optionally ?profession=nurse)
// @Tags content
// @Router /events [get]
func (h *contentHandler) events(w http.ResponseWriter, r *http.Request) {
	events, err := h.content.ListEvents(r.Context(), r.URL.Query().Get("profession"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not list events")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"events": events})
}

// @Summary Get a scenario (dialogue/quiz/effect steps)
// @Tags content
// @Router /scenarios/{id} [get]
func (h *contentHandler) scenario(w http.ResponseWriter, r *http.Request) {
	s, err := h.content.GetScenario(r.Context(), r.PathValue("id"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	if s == nil {
		httpx.Error(w, http.StatusNotFound, "scenario not found")
		return
	}
	httpx.JSON(w, http.StatusOK, s)
}

// @Summary Today's event board (daily pool)
// @Tags content
// @Router /board/today [get]
func (h *contentHandler) board(w http.ResponseWriter, r *http.Request) {
	events, err := h.content.TodaysBoard(r.Context(), r.URL.Query().Get("profession"), 6)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load board")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"events": events})
}
