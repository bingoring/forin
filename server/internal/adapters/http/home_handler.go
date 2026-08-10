package http

import (
	"context"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/bingoring/forin/server/internal/curriculum"
	"github.com/bingoring/forin/server/internal/domain/colleague"
	"github.com/bingoring/forin/server/internal/domain/home"
	"github.com/bingoring/forin/server/internal/economy"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

// homeHandler serves the home tab as ONE response. The home screen is the app's
// first screen, so per-module round trips would be felt directly as launch lag —
// the ten modules are assembled here from queries run in parallel.
//
// Every module field is omitempty: when there is no data, the field is absent and
// the client simply doesn't render that module. No placeholder copy is ever sent.
type homeHandler struct {
	progress  ports.ProgressRepo
	review    ports.ReviewRepo
	content   ports.ContentReader
	users     ports.UserRepo
	colleague ports.ColleagueRepo
	pools     home.Pools
}

type homeTodayOne struct {
	Chapter    string `json:"chapter"`
	Title      string `json:"title"`
	Kind       string `json:"kind"`
	ScenarioID string `json:"scenarioId,omitempty"`
}

type homeColleague struct {
	ID          string             `json:"id"`
	Name        string             `json:"name"`
	Relation    colleague.Relation `json:"relation"`
	Activity    string             `json:"activity,omitempty"`
	ActiveToday bool               `json:"activeToday"`
}

type homeReview struct {
	ID    string `json:"id"`
	Front string `json:"front"`
}

type homeResp struct {
	Date        string      `json:"date"`
	Done        bool        `json:"done"`
	Shift       *home.Shift `json:"shift,omitempty"`
	Streak      int         `json:"streak"`
	Week        [7]int      `json:"week"`
	Level       int         `json:"level"`
	XP          int         `json:"xp"`
	TargetLevel string      `json:"targetLevel,omitempty"`

	TodayOne   *homeTodayOne    `json:"todayOne,omitempty"`
	MentorNote *home.MentorNote `json:"mentorNote,omitempty"`
	Phrase     *home.Phrase     `json:"phrase,omitempty"`
	Review     *homeReview      `json:"review,omitempty"`

	SituationsWaiting int `json:"situationsWaiting"`

	Colleagues      []homeColleague `json:"colleagues"`
	ColleagueTotal  int             `json:"colleagueTotal"`
	UnreadCheers    int             `json:"unreadCheers"`
	PendingRequests int             `json:"pendingRequests"`
}

// @Summary Home tab (one round trip)
// @Tags home
// @Security Bearer
// @Success 200 {object} homeResp
// @Router /me/home [get]
func (h *homeHandler) get(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	ctx := r.Context()

	loc := time.UTC
	if tz := r.URL.Query().Get("tz"); tz != "" {
		if l, err := time.LoadLocation(tz); err == nil {
			loc = l
		}
	}
	now := time.Now()
	day := home.DayKey(now, loc)
	resp := homeResp{Date: day, Colleagues: []homeColleague{}}

	// Independent reads, run together — the slowest one sets the latency, not the sum.
	var (
		wg       sync.WaitGroup
		mu       sync.Mutex
		chapters []curriculum.ChapterState
	)
	run := func(f func()) { wg.Add(1); go func() { defer wg.Done(); f() }() }

	run(func() {
		p, err := h.progress.GetProgress(ctx, uid)
		if err != nil {
			return
		}
		mu.Lock()
		resp.Streak, resp.Level, resp.XP = p.StreakCurrent, p.Level, p.XP
		mu.Unlock()
	})

	run(func() {
		local := now.In(loc)
		dayStart := time.Date(local.Year(), local.Month(), local.Day(), 0, 0, 0, 0, loc)
		weekStart := dayStart.AddDate(0, 0, -((int(local.Weekday()) + 6) % 7))
		s, err := h.progress.GrowthStats(ctx, uid, dayStart, weekStart, loc.String())
		if err != nil {
			return
		}
		week := home.WeekRhythm(s.ActiveDates, now, loc)
		mu.Lock()
		resp.Week = week
		mu.Unlock()
	})

	run(func() {
		cleared, err := h.progress.ClearedScenarioIDs(ctx, uid)
		if err != nil {
			return
		}
		cs := curriculum.Resolve(cleared)
		mu.Lock()
		chapters = cs
		mu.Unlock()
	})

	run(func() {
		cards, err := h.review.DueCards(ctx, uid, now.UTC(), 1)
		if err != nil || len(cards) == 0 {
			return
		}
		mu.Lock()
		resp.Review = &homeReview{ID: cards[0].ID, Front: cards[0].Front}
		mu.Unlock()
	})

	run(func() {
		cards, err := h.content.DailyPool(ctx, uid, "", day, economy.Active.DailyPoolSize)
		if err != nil {
			return
		}
		mu.Lock()
		resp.SituationsWaiting = len(cards)
		mu.Unlock()
	})

	run(func() {
		if prof, err := h.users.GetProfile(ctx, uid); err == nil && prof != nil {
			mu.Lock()
			resp.TargetLevel = prof.TargetLevel
			mu.Unlock()
		}
	})

	run(func() { h.loadColleagues(ctx, uid, &mu, &resp) })

	wg.Wait()

	// Derived — needs the curriculum result, so it happens after the fan-in.
	dept, deptLabel, today := currentStep(chapters)
	resp.TodayOne = today
	resp.Done = today == nil // no next step today → the rest card
	if deptLabel != "" {
		s := home.DeriveShift(uid, day, deptLabel)
		resp.Shift = &s
	}
	resp.MentorNote = home.PickMentorNote(h.pools, uid, day, dept)
	resp.Phrase = home.PickPhrase(h.pools, uid, day, dept)

	// Opening the app counts as being seen — no separate heartbeat endpoint.
	if h.colleague != nil {
		_ = h.colleague.TouchPresence(ctx, uid, "", "")
	}

	httpx.JSON(w, http.StatusOK, resp)
}

// loadColleagues fills the colleague strip: up to three colleagues plus the
// counts the UI badges. Presence is only surfaced for people who share it.
func (h *homeHandler) loadColleagues(ctx context.Context, uid string, mu *sync.Mutex, resp *homeResp) {
	if h.colleague == nil {
		return
	}
	links, err := h.colleague.Links(ctx, uid)
	if err != nil {
		return
	}
	ids := make([]string, 0, len(links))
	for _, l := range links {
		ids = append(ids, l.OtherID)
	}
	presences, _ := h.colleague.Presences(ctx, ids)
	unread, _ := h.colleague.UnreadCheers(ctx, uid)
	requests, _ := h.colleague.InboxRequests(ctx, uid)

	out := make([]homeColleague, 0, 3)
	for _, l := range links {
		if len(out) == 3 {
			break
		}
		c := homeColleague{ID: l.OtherID, Relation: l.Relation}
		if prof, err := h.users.GetProfile(ctx, l.OtherID); err == nil && prof != nil {
			c.Name = displayName(prof.UserID)
		}
		if prefs, err := h.colleague.Prefs(ctx, l.OtherID); err == nil && prefs.ShareStatus {
			if p, ok := presences[l.OtherID]; ok {
				c.Activity = p.Label
				c.ActiveToday = time.Since(p.LastSeenAt) < 24*time.Hour
			}
		}
		out = append(out, c)
	}

	mu.Lock()
	resp.Colleagues = out
	resp.ColleagueTotal = len(links)
	resp.UnreadCheers = unread
	resp.PendingRequests = len(requests)
	mu.Unlock()
}

// displayName is a placeholder until profiles carry a nickname: the UI needs
// something stable and non-identifying, so we use a short id prefix.
func displayName(userID string) string {
	if len(userID) >= 6 {
		return strings.ToUpper(userID[:6])
	}
	return userID
}

// currentStep finds the chapter in progress and its active step. Returns
// ("", "", nil) when the curriculum is finished — the caller then shows the rest
// card instead of a task.
func currentStep(chapters []curriculum.ChapterState) (dept, deptLabel string, one *homeTodayOne) {
	for _, ch := range chapters {
		if ch.State != "now" {
			continue
		}
		deptLabel = ch.Dept
		dept = deptTag(ch.Dept)
		for _, st := range ch.Steps {
			if st.State == "now" {
				return dept, deptLabel, &homeTodayOne{
					Chapter:    "CHAPTER " + itoa(ch.Ch) + " · " + ch.Name,
					Title:      st.Name,
					Kind:       st.Kind,
					ScenarioID: st.ScenarioID,
				}
			}
		}
		// Chapter is active but has no authored steps yet — still a real posting,
		// just nothing to start.
		return dept, deptLabel, nil
	}
	return "", "", nil
}

// deptTag maps a curriculum department label ("본관 1F 로비 · ER") to the short tag
// used by the content pools.
func deptTag(label string) string {
	l := strings.ToLower(label)
	switch {
	case strings.Contains(l, "er") || strings.Contains(l, "응급"):
		return "er"
	case strings.Contains(l, "or") || strings.Contains(l, "수술"):
		return "or"
	case strings.Contains(l, "icu") || strings.Contains(l, "중환자"):
		return "icu"
	case strings.Contains(l, "peds") || strings.Contains(l, "소아"):
		return "peds"
	case strings.Contains(l, "pharm") || strings.Contains(l, "약"):
		return "pharma"
	case strings.Contains(l, "ward") || strings.Contains(l, "병동"):
		return "ward"
	}
	return ""
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	var b [8]byte
	i := len(b)
	for n > 0 {
		i--
		b[i] = byte('0' + n%10)
		n /= 10
	}
	return string(b[i:])
}
