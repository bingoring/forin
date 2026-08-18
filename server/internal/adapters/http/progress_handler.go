package http

import (
	"net/http"
	"time"

	"github.com/bingoring/forin/server/internal/curriculum"
	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

type progressHandler struct {
	progress ports.ProgressRepo
	review   ports.ReviewRepo
}

// allowedMissions is the code-side set of hidden-mission ids (extensible, no DB
// constraint). Kept in sync with the mobile mission catalog.
var allowedMissions = map[string]bool{"veteran": true, "iron_will": true, "beloved": true}

// @Summary Building/floor/curriculum path with per-user progress
// @Tags progress
// @Security Bearer
// @Success 200 {object} map[string][]curriculum.BuildingGroup
// @Router /me/curriculum [get]
func (h *progressHandler) curriculum(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	cleared, err := h.progress.ClearedScenarioIDs(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load curriculum")
		return
	}
	// Same resume target the home screen gets, from the same call, so the career
	// tab's hero and the home card cannot drift apart. A failed lookup degrades to
	// "first unfinished", not to an error: the path is still fully browsable.
	last, _ := h.progress.LatestAttemptScenarioID(r.Context(), uid)
	states := curriculum.ResolveWithResume(cleared, curriculum.KeyForScenario(last))
	httpx.JSON(w, http.StatusOK, map[string]any{"buildings": curriculum.Group(states)})
}

// @Summary Discovered hidden missions
// @Tags progress
// @Security Bearer
// @Success 200 {object} map[string][]string
// @Router /me/missions [get]
func (h *progressHandler) missions(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	found, err := h.progress.FoundMissions(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load missions")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"found": found})
}

// @Summary Record a hidden-mission discovery (permanent, idempotent)
// @Tags progress
// @Security Bearer
// @Success 200 {object} map[string][]string
// @Router /me/missions/{id} [post]
func (h *progressHandler) recordMission(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	id := r.PathValue("id")
	if !allowedMissions[id] {
		httpx.Error(w, http.StatusBadRequest, "unknown mission")
		return
	}
	if err := h.progress.RecordMission(r.Context(), uid, id); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not record mission")
		return
	}
	found, err := h.progress.FoundMissions(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"found": found})
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
	// Bucket "today"/"this week" in the caller's timezone (device-provided IANA
	// name, e.g. "Asia/Seoul"); fall back to UTC when absent or unknown.
	loc := time.UTC
	if tz := r.URL.Query().Get("tz"); tz != "" {
		if l, err := time.LoadLocation(tz); err == nil {
			loc = l
		}
	}
	now := time.Now().In(loc)
	dayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
	// Monday-first week: Go's Weekday has Sunday=0, so map to Monday=0..Sunday=6.
	offset := (int(now.Weekday()) + 6) % 7
	weekStart := dayStart.AddDate(0, 0, -offset)
	s, err := h.progress.GrowthStats(r.Context(), uid, dayStart, weekStart, loc.String())
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
	// Direct attempt (legacy / no dialogue grading): treat as a clear, no grade.
	p, err := h.progress.RecordAttempt(r.Context(), uid, req.ScenarioID, req.Score, "cleared", -1)
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
