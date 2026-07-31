package http

import (
	"errors"
	"net/http"
	"time"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/economy"
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

// @Summary List departments (optionally ?profession=nurse)
// @Tags content
// @Router /departments [get]
func (h *contentHandler) departments(w http.ResponseWriter, r *http.Request) {
	depts, err := h.content.ListDepartments(r.Context(), r.URL.Query().Get("profession"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not list departments")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"departments": depts})
}

// @Summary Get a department interior (tile map: regions/rooms/objects/hotspots)
// @Tags content
// @Router /interiors/{id} [get]
func (h *contentHandler) interior(w http.ResponseWriter, r *http.Request) {
	in, err := h.content.GetInterior(r.Context(), r.PathValue("id"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	if in == nil {
		httpx.Error(w, http.StatusNotFound, "interior not found")
		return
	}
	httpx.JSON(w, http.StatusOK, in)
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

// @Summary Get a quiz (playable content)
// @Tags content
// @Router /quizzes/{id} [get]
func (h *contentHandler) quiz(w http.ResponseWriter, r *http.Request) {
	q, err := h.content.GetQuiz(r.Context(), r.PathValue("id"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	if q == nil {
		httpx.Error(w, http.StatusNotFound, "quiz not found")
		return
	}
	httpx.JSON(w, http.StatusOK, q)
}

// @Summary Today's situation board — a daily-rotated set of scenario cards
// @Tags content
// @Router /board/today [get]
func (h *contentHandler) board(w http.ResponseWriter, r *http.Request) {
	cards, err := h.content.TodaysScenarios(r.Context(), r.URL.Query().Get("profession"), 12)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load board")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"scenarios": cards})
}

// @Summary Main-route curriculum path (events + unlock states) for the user
// @Tags content
// @Security Bearer
// @Router /me/route [get]
func (h *contentHandler) mainRoute(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	nodes, err := h.content.MainRoute(r.Context(), uid, r.URL.Query().Get("profession"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load route")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"nodes": nodes})
}

// @Summary Department situation cards (?dept=ER) — dept-scoped scenarios
// @Tags content
// @Security Bearer
// @Router /me/situations [get]
func (h *contentHandler) deptSituations(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	dept := r.URL.Query().Get("dept")
	if dept == "" {
		httpx.JSON(w, http.StatusOK, map[string]any{"situations": []content.DeptSituation{}})
		return
	}
	sits, err := h.content.DeptSituations(r.Context(), uid, dept)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load situations")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"situations": sits})
}

// @Summary Economy config (single source of truth mirrored to the client)
// @Tags content
// @Router /config/economy [get]
func (h *contentHandler) economyConfig(w http.ResponseWriter, r *http.Request) {
	httpx.JSON(w, http.StatusOK, economy.Active)
}

// @Summary Personalized daily pool — weighted, persisted, resets 00:00 local (?tz=)
// @Tags content
// @Security Bearer
// @Router /me/daily-board [get]
func (h *contentHandler) dailyBoard(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	loc := time.UTC
	if tz := r.URL.Query().Get("tz"); tz != "" {
		if l, err := time.LoadLocation(tz); err == nil {
			loc = l
		}
	}
	localDate := time.Now().In(loc).Format("2006-01-02")
	cards, err := h.content.DailyPool(r.Context(), uid, r.URL.Query().Get("profession"), localDate, economy.Active.DailyPoolSize)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load daily board")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"scenarios": cards})
}

// @Summary Rewarded-ad top-up of today's daily pool (+N, up to a daily cap)
// @Tags content
// @Security Bearer
// @Router /me/daily-board/topup [post]
func (h *contentHandler) dailyBoardTopUp(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	loc := time.UTC
	if tz := r.URL.Query().Get("tz"); tz != "" {
		if l, err := time.LoadLocation(tz); err == nil {
			loc = l
		}
	}
	localDate := time.Now().In(loc).Format("2006-01-02")
	cards, grants, err := h.content.TopUpDailyPool(r.Context(), uid, r.URL.Query().Get("profession"), localDate, economy.Active.TopUpAdd, economy.Active.TopUpCap)
	if errors.Is(err, ports.ErrDailyCapReached) {
		httpx.Error(w, http.StatusTooManyRequests, "오늘의 광고 보상을 모두 받았어요")
		return
	}
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not top up daily board")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"scenarios": cards, "adGrants": grants, "cap": economy.Active.TopUpCap})
}
