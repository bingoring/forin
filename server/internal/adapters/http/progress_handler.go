package http

import (
	"net/http"
	"time"

	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

type progressHandler struct {
	progress ports.ProgressRepo
	review   ports.ReviewRepo
}

// @Summary Current user's growth
// @Tags progress
// @Security Bearer
// @Success 200 {object} progress.Progress
// @Router /me/progress [get]
func (h *progressHandler) get(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	p, err := h.progress.GetProgress(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load progress")
		return
	}
	httpx.JSON(w, http.StatusOK, p)
}

// @Summary Growth-report aggregates (scenarios, cards, conversation time, attendance)
// @Tags progress
// @Security Bearer
// @Success 200 {object} progress.GrowthStats
// @Router /me/stats [get]
func (h *progressHandler) stats(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	now := time.Now().UTC()
	dayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	// Monday-first week: Go's Weekday has Sunday=0, so map to Monday=0..Sunday=6.
	offset := (int(now.Weekday()) + 6) % 7
	weekStart := dayStart.AddDate(0, 0, -offset)
	s, err := h.progress.GrowthStats(r.Context(), uid, dayStart, weekStart)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load stats")
		return
	}
	httpx.JSON(w, http.StatusOK, s)
}

// @Summary Record a cleared scenario (awards XP, advances streak)
// @Tags progress
// @Security Bearer
// @Param body body attemptReq true "scenario clear"
// @Success 200 {object} progress.Progress
// @Router /attempts [post]
func (h *progressHandler) attempt(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req attemptReq
	if err := httpx.DecodeJSON(r, &req); err != nil || req.ScenarioID == "" {
		httpx.Error(w, http.StatusBadRequest, "scenarioId is required")
		return
	}
	p, err := h.progress.RecordAttempt(r.Context(), uid, req.ScenarioID, req.Score)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not record attempt")
		return
	}
	httpx.JSON(w, http.StatusOK, p)
}

// @Summary Review cards due today
// @Tags review
// @Security Bearer
// @Router /me/review [get]
func (h *progressHandler) due(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	cards, err := h.review.DueCards(r.Context(), uid, time.Now().UTC(), 50)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load review")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"cards": cards})
}

// @Summary Grade a review card (SM-2 spaced repetition)
// @Tags review
// @Security Bearer
// @Param body body gradeReq true "grade: again|hard|good|easy"
// @Router /me/review/{id}/grade [post]
func (h *progressHandler) grade(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req gradeReq
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}
	g := progress.Grade(req.Grade)
	if !g.Valid() {
		httpx.Error(w, http.StatusBadRequest, "grade must be again|hard|good|easy")
		return
	}
	card, err := h.review.GetCardForUser(r.Context(), uid, r.PathValue("id"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	if card == nil {
		httpx.Error(w, http.StatusNotFound, "card not found")
		return
	}
	next, pips := progress.Review(card.Schedule, g, time.Now().UTC())
	if err := h.review.SaveSchedule(r.Context(), card.ID, next, pips); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not save")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"schedule": next, "masteryPips": pips})
}

type attemptReq struct {
	ScenarioID string `json:"scenarioId"`
	Score      int    `json:"score"`
}

type gradeReq struct {
	Grade string `json:"grade"`
}
