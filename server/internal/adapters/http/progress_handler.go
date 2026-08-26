package http

import (
	"log/slog"
	"net/http"
	"strconv"
	"time"

	"github.com/bingoring/forin/server/internal/i18n"

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
	// Best-effort: a failed read means no step reports as tried, which is the old
	// behaviour — not worth failing a path the learner asked to browse.
	attempted, _ := h.progress.AttemptedScenarioIDs(r.Context(), uid)
	states := curriculum.ResolveLocalized(cleared, attempted, curriculum.KeyForScenario(last), i18n.FromContext(r.Context()))
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

// @Summary Activity calendar — per-day sessions with the shift band they fell in
// @Tags progress
// @Security Bearer
// @Param month query string false "YYYY-MM (defaults to the current month in tz)"
// @Success 200 {object} map[string][]progress.CalendarDay
// @Router /me/calendar [get]
func (h *progressHandler) calendar(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	loc := time.UTC
	if tz := r.URL.Query().Get("tz"); tz != "" {
		if l, err := time.LoadLocation(tz); err == nil {
			loc = l
		}
	}
	// A month at a time. The screen shows one month and pages between them, so a range
	// wide enough for "everything" would grow without bound for a long-time learner
	// while the calendar can only ever draw 31 cells.
	from := monthStart(time.Now().In(loc), loc)
	if m := r.URL.Query().Get("month"); m != "" {
		parsed, err := time.ParseInLocation("2006-01", m, loc)
		if err != nil {
			httpx.Error(w, http.StatusBadRequest, "month must be YYYY-MM")
			return
		}
		from = parsed
	}
	to := from.AddDate(0, 1, 0)

	entries, dates, err := h.progress.CalendarEntries(r.Context(), uid, from, to, loc.String())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load calendar")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{
		"month": from.Format("2006-01"),
		"days":  progress.BuildCalendar(entries, dates),
	})
}

func monthStart(t time.Time, loc *time.Location) time.Time {
	return time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, loc)
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

// modelAnswerListLimit is the page size ScreenModelAnswerList asks for when it
// sends none. Groups carry their cards, so a page is heavier than a flat row
// list — small pages keep the first paint fast and infinite scroll fetches more.
const modelAnswerListLimit = 10

// @Summary 시나리오 모범답안 summary block (Review Lab): recent scenario expanded, three collapsed, "+ N개 더"
// @Tags review
// @Security Bearer
// @Success 200 {object} progress.ModelAnswerSummary
// @Router /me/review/model-answers/summary [get]
func (h *progressHandler) modelAnswerSummary(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	ctx := r.Context()

	// Exactly the four groups the block has room for — asking for more would buy
	// rows it cannot draw.
	groups, total, err := h.review.ListModelAnswerScenarios(ctx, uid, false, progress.ModelAnswerPageSize, 0)
	if err != nil {
		slog.Error("review: model-answer summary failed", "err", err)
		httpx.Error(w, http.StatusInternalServerError, "could not load the model answers")
		return
	}
	// Cards only for the group that is actually expanded. Fetching all four
	// groups' cards would be four times the payload for one visible panel.
	var cards []progress.ModelAnswerCard
	if len(groups) > 0 {
		byScenario, err := h.review.ListModelAnswerCards(ctx, uid, []string{groups[0].ScenarioID})
		if err != nil {
			slog.Error("review: model-answer cards failed", "err", err)
			httpx.Error(w, http.StatusInternalServerError, "could not load the model answers")
			return
		}
		cards = byScenario[groups[0].ScenarioID]
	}
	out := progress.BuildModelAnswerSummary(groups, total, cards)
	if out.Groups == nil {
		out.Groups = []progress.ModelAnswerGroup{}
	}
	httpx.JSON(w, http.StatusOK, out)
}

// modelAnswerPage is one page of ScreenModelAnswerList. Every group carries its
// cards here — unlike the summary block, each row on this screen is expandable,
// and a per-row fetch on tap would make the list feel broken on a slow network.
type modelAnswerPage struct {
	Groups []progress.ModelAnswerGroup `json:"groups"`
	Total  int                         `json:"total"`
}

// @Summary One page of every scenario the player has model answers for (ScreenModelAnswerList)
// @Tags review
// @Security Bearer
// @Param sort query string false "recent (최신, default) or needs-work (개선 필요)"
// @Param limit query int false "page size, default 10, clamped to 50"
// @Param offset query int false "groups to skip"
// @Success 200 {object} modelAnswerPage
// @Router /me/review/model-answers [get]
func (h *progressHandler) modelAnswers(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	ctx := r.Context()
	// Anything other than an explicit "needs-work" is the 최신 default: an
	// unrecognized value must not silently reorder the screen.
	needsWork := r.URL.Query().Get("sort") == "needs-work"
	limit := modelAnswerListLimit
	if v := r.URL.Query().Get("limit"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			limit = n
		}
	}
	// Clamped, not rejected: an over-large page is a client bug that should
	// degrade to a bounded page rather than a 400 that leaves the list stuck.
	if limit > 50 {
		limit = 50
	}
	offset := 0
	if v := r.URL.Query().Get("offset"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			offset = n
		}
	}

	groups, total, err := h.review.ListModelAnswerScenarios(ctx, uid, needsWork, limit, offset)
	if err != nil {
		slog.Error("review: model-answer list failed", "err", err)
		httpx.Error(w, http.StatusInternalServerError, "could not load the model answers")
		return
	}
	if len(groups) > 0 {
		ids := make([]string, 0, len(groups))
		for _, g := range groups {
			ids = append(ids, g.ScenarioID)
		}
		byScenario, err := h.review.ListModelAnswerCards(ctx, uid, ids)
		if err != nil {
			slog.Error("review: model-answer cards failed", "err", err)
			httpx.Error(w, http.StatusInternalServerError, "could not load the model answers")
			return
		}
		for i := range groups {
			groups[i].Cards = byScenario[groups[i].ScenarioID]
		}
	} else {
		groups = []progress.ModelAnswerGroup{}
	}
	httpx.JSON(w, http.StatusOK, modelAnswerPage{Groups: groups, Total: total})
}
