package http

import (
	"errors"
	"github.com/bingoring/forin/server/internal/i18n"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/bingoring/forin/server/internal/curriculum"
	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/economy"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

type contentHandler struct {
	content ports.ContentReader
	// Read only to answer "has this learner already done the guided pass of this
	// scenario?" — which is what decides whether the next run offers choices.
	progress ports.ProgressRepo
	// pronunciationEnabled mirrors whether Azure Speech is configured
	// (business-rules §5: "AZURE_SPEECH_KEY 미구성 → ... 설정 응답에 기능 비활성
	// 플래그를 실어 앱이 진입점을 숨기게 한다. 503을 던지고 화면에서 실패시키지 않는다").
	// Carried on GET /config/economy — see economyConfig's doc comment for why
	// that response was chosen over a new endpoint.
	pronunciationEnabled bool
}

// atoiDefault parses a query-string int, falling back to def on empty/invalid.
func atoiDefault(s string, def int) int {
	if s == "" {
		return def
	}
	n, err := strconv.Atoi(s)
	if err != nil {
		return def
	}
	return n
}

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
	// How much help this run gets: choices the first time through a conversation, and
	// nothing the second. Sent WITH the scenario so the screen knows what to draw before
	// the conversation starts — asking afterwards would show a text box for a moment and
	// then replace it, which reads as the app changing its mind.
	//
	// Anonymous reads (there are none today, but the route does not require auth to be
	// meaningful) fall through to the unguided app rather than guessing.
	guide := curriculum.GuideFree
	if uid, ok := UserID(r.Context()); ok && h.progress != nil {
		guided, err := h.progress.GuidedPassesCleared(r.Context(), uid)
		if err == nil {
			guide = curriculum.GuideForScenario(s.ID, guided[s.ID])
		}
	}
	httpx.JSON(w, http.StatusOK, struct {
		*content.Scenario
		Guide string `json:"guide"`
	}{s, string(guide)})
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

// @Summary Situation cards — one department (?dept=ER) or a title search (?q=)
// @Tags content
// @Security Bearer
// @Param dept query string false "Department code; ignored when q is present"
// @Param q query string false "Title search across every department"
// @Param offset query int false "Page offset (dept listing only)"
// @Param limit query int false "Page size, 1-50 (default 20)"
// @Success 200 {object} map[string][]content.DeptSituation
// @Router /me/situations [get]
func (h *contentHandler) deptSituations(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	loc0 := i18n.FromContext(r.Context())
	// A `q` turns this into a search across every department: the client has one box and
	// no way to know which ward to look in, which is the cost search exists to remove.
	if q := strings.TrimSpace(r.URL.Query().Get("q")); q != "" {
		sits, err := h.content.SearchSituations(r.Context(), uid, q, atoiDefault(r.URL.Query().Get("limit"), 20))
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "could not search situations")
			return
		}
		for i := range sits {
			sits[i].Tag = i18n.Tr(loc0, "tag."+sits[i].TagCode, tagKo[sits[i].TagCode])
		}
		httpx.JSON(w, http.StatusOK, map[string]any{"situations": sits, "hasMore": false})
		return
	}

	dept := r.URL.Query().Get("dept")
	if dept == "" {
		httpx.JSON(w, http.StatusOK, map[string]any{"situations": []content.DeptSituation{}, "hasMore": false})
		return
	}
	offset := atoiDefault(r.URL.Query().Get("offset"), 0)
	limit := atoiDefault(r.URL.Query().Get("limit"), 20)
	if limit < 1 || limit > 50 {
		limit = 20 // clamp so a single request can't scan a whole dept
	}
	sits, hasMore, err := h.content.DeptSituations(r.Context(), uid, dept, offset, limit)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load situations")
		return
	}
	// Label the state in the request's language. The code travels alongside so the
	// client compares on the code and renders the label — see content.DeptSituation.
	loc := i18n.FromContext(r.Context())
	for i := range sits {
		sits[i].Tag = i18n.Tr(loc, "tag."+sits[i].TagCode, tagKo[sits[i].TagCode])
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"situations": sits, "hasMore": hasMore})
}

// tagKo is the authored Korean for a situation state — the fallback i18n.Tr renders
// when a locale has no entry, kept next to the only place that needs it.
// "시도" rather than "실패": the learner played it and was graded below the bar,
// and a list of failures is not something anyone opens twice.
var tagKo = map[string]string{"cleared": "완료", "attempted": "시도", "urgent": "긴급", "new": "신규"}

// economyConfigResp mirrors economy.Active plus a feature-availability signal.
// GET /config/economy was picked to carry pronunciationEnabled (business-rules
// §5's "설정 응답에 기능 비활성 플래그를 실어") because it is the one response the
// mobile app is guaranteed to call on every launch, unconditionally and before
// login: mobile/src/app/_layout.tsx hydrates it in the same Promise.all as
// session bootstrap. It also needs no auth and carries no per-user data,
// which fits Azure Speech's configuredness (a deploy-wide fact, not a
// per-user one) better than GET /me would.
type economyConfigResp struct {
	economy.Economy
	PronunciationEnabled bool `json:"pronunciationEnabled"`
	// ReadyDestinations are the countries whose authored learning phrases exist, so
	// the onboarding can offer the rest as intentions rather than as choices. It
	// rides on this response for the same reason pronunciationEnabled does: the app
	// fetches it on every launch, before login, and it is a deploy-wide fact.
	ReadyDestinations []string `json:"readyDestinations"`
}

// readyDestinations lists destination codes whose target language has authored
// content, sorted so the response is stable.
func readyDestinations() []string {
	out := make([]string, 0, len(content.Destination))
	for code := range content.Destination {
		if content.IsDestinationReady(code) {
			out = append(out, code)
		}
	}
	sort.Strings(out) // map iteration is random; a config response must not be
	return out
}

// @Summary Economy config (single source of truth mirrored to the client) + pronunciation feature flag
// @Tags content
// @Success 200 {object} economyConfigResp
// @Router /config/economy [get]
func (h *contentHandler) economyConfig(w http.ResponseWriter, r *http.Request) {
	httpx.JSON(w, http.StatusOK, economyConfigResp{
		ReadyDestinations:    readyDestinations(),
		Economy:              economy.Active,
		PronunciationEnabled: h.pronunciationEnabled,
	})
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
