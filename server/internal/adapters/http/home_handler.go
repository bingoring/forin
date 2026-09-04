package http

import (
	"context"
	"github.com/bingoring/forin/server/internal/i18n"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/bingoring/forin/server/internal/curriculum"
	"github.com/bingoring/forin/server/internal/domain/colleague"
	"github.com/bingoring/forin/server/internal/domain/home"
	"github.com/bingoring/forin/server/internal/domain/user"
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
	Chapter    string        `json:"chapter"`
	Title      string        `json:"title"`
	Kind       string        `json:"kind"`
	ScenarioID string        `json:"scenarioId,omitempty"`
	Progress   *homeProgress `json:"progress,omitempty"`
}

// homeProgress is the current chapter's required-step completion, so the home card can draw
// "이어서 하기" with a real progress bar instead of just a start button. Counts runs (guided
// + free), not raw authored steps — quizzes are optional and excluded.
type homeProgress struct {
	Done  int `json:"done"`
	Total int `json:"total"`
}

// homeBrief is the day's 3-item work brief. The two server-derivable tasks live here; the
// third (오늘의 문장 practice) is tracked client-side, so it is not on the wire.
type homeBrief struct {
	ReviewCount    int  `json:"reviewCount"`
	ReviewTarget   int  `json:"reviewTarget"`
	ReviewDone     bool `json:"reviewDone"`
	CurriculumDone bool `json:"curriculumDone"`
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
	Date string `json:"date"`
	Done bool   `json:"done"`
	// FirstRun is true until the learner clears anything. The home screen leads with
	// the task instead of the streak in that state: a row of ten empty day-boxes is
	// the first thing a new user would otherwise see, and it teaches nothing.
	FirstRun bool        `json:"firstRun"`
	Shift    *home.Shift `json:"shift,omitempty"`
	Streak   int         `json:"streak"`
	// A rolling window ending today (progress.StreakWindowDays long), not a
	// calendar week. Kept as `week` on the wire so already-shipped clients keep
	// parsing it; the length is what changed, and the client reads .length.
	Week        []int  `json:"week"`
	Level       int    `json:"level"`
	XP          int    `json:"xp"`
	TargetLevel string `json:"targetLevel,omitempty"`

	TodayOne   *homeTodayOne    `json:"todayOne,omitempty"`
	Brief      *homeBrief       `json:"brief,omitempty"`
	MentorNote *home.MentorNote `json:"mentorNote,omitempty"`
	Phrase     *home.Phrase     `json:"phrase,omitempty"`
	Review     *homeReview      `json:"review,omitempty"`
	// 오늘의 호출 (v27). Absent when there is nothing live: no candidates to point it
	// at, or it expired unanswered. The client draws nothing rather than a dead pager.
	Page *home.Page `json:"page,omitempty"`

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
	locale := i18n.FromContext(ctx)
	resp := homeResp{Date: day, Colleagues: []homeColleague{}}

	// Independent reads, run together — the slowest one sets the latency, not the sum.
	var (
		wg        sync.WaitGroup
		mu        sync.Mutex
		curricula []curriculum.CurriculumState
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
		week := home.RecentRhythm(s.ActiveDates, now, loc)
		mu.Lock()
		resp.Week = week
		// The day's brief: reviewed cards and a cleared curriculum step. The 오늘의 문장
		// task is client-tracked and added on the device.
		resp.Brief = &homeBrief{
			ReviewCount:    s.ReviewsToday,
			ReviewTarget:   home.ReviewGoalPerDay,
			ReviewDone:     s.ReviewsToday >= home.ReviewGoalPerDay,
			CurriculumDone: s.ScenariosToday >= 1,
		}
		mu.Unlock()
	})

	run(func() {
		cleared, err := h.progress.ClearedScenarioIDs(ctx, uid)
		if err != nil {
			return
		}
		// Where the learner actually was, which is not the same as the front of the
		// path. Before v2 this screen always pointed at the first unfinished step in
		// the whole catalog, so someone working on the 8th floor was told to go back
		// to the 1st. A failed lookup is not fatal: resume then falls back to the
		// first unfinished curriculum, which is the old behaviour.
		last, _ := h.progress.LatestAttemptScenarioID(ctx, uid)
		attempted, _ := h.progress.AttemptedScenarioIDs(ctx, uid)
		cs := curriculum.ResolvePasses(cleared, attempted, passesFor(ctx, h.progress, uid), curriculum.KeyForScenario(last), locale)
		mu.Lock()
		curricula = cs
		// Derived from cleared content rather than from XP or level: those move for
		// reasons other than finishing something, so a user who earned a little XP and
		// stopped would stop counting as new while still never having completed a step.
		resp.FirstRun = len(cleared) == 0
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

	// The day's pool serves twice: how many situations are waiting, and what today's
	// 오늘의 호출 can point at. One read — the call has to come from content the learner
	// is actually being offered, not from a second, unrelated draw.
	var poolIDs []string
	run(func() {
		cards, err := h.content.DailyPool(ctx, uid, "", day, economy.Active.DailyPoolSize)
		if err != nil {
			return
		}
		// The SHORT ones, because the pager promises "약 3분". Difficulty 1 is the
		// board's own shortest band; if today's pool has none, any card is better than
		// no call at all — the alternative is a module that silently never appears.
		ids := make([]string, 0, len(cards))
		for _, c := range cards {
			if c.Difficulty <= 1 {
				ids = append(ids, c.ID)
			}
		}
		if len(ids) == 0 {
			for _, c := range cards {
				ids = append(ids, c.ID)
			}
		}
		mu.Lock()
		resp.SituationsWaiting = len(cards)
		poolIDs = ids
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
	dept, deptLabel, today := currentStep(curricula)
	resp.TodayOne = today
	resp.Done = today == nil // no next step today → the rest card
	if deptLabel != "" {
		s := home.DeriveShift(uid, day, deptLabel)
		resp.Shift = &s
	}
	// 오늘의 호출 — after the fan-in because it needs both the day's pool and the
	// department label the shift badge shows.
	resp.Page = h.todaysPage(ctx, uid, day, deptLabel, poolIDs, loc, now)

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
		// The fallback is set FIRST, so a failed or missing profile leaves a name the
		// row can draw rather than an empty string. It used to be assigned inside the
		// `prof != nil` branch, which meant a colleague whose profile did not load was
		// listed with no name at all.
		c := homeColleague{ID: l.OtherID, Relation: l.Relation, Name: user.ShortID(l.OtherID)}
		if prof, err := h.users.GetProfile(ctx, l.OtherID); err == nil && prof != nil {
			c.Name = user.NameOr(prof.DisplayName, l.OtherID)
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
// currentStep finds the curriculum to continue and its active step. Returns
// ("", "", nil) when everything is finished — the caller then shows the rest card
// instead of inventing a task.
//
// It reads the Resume flag rather than searching for the first unfinished
// curriculum itself: the career tab draws its hero from the same flag, and two
// screens computing "what's next" separately is how they end up disagreeing.
func currentStep(curricula []curriculum.CurriculumState) (dept, deptLabel string, one *homeTodayOne) {
	for _, c := range curricula {
		if !c.Resume {
			continue
		}
		deptLabel = c.Where
		dept = deptTag(c.Where)
		for _, st := range c.Steps {
			if st.State == "now" {
				return dept, deptLabel, &homeTodayOne{
					Chapter:    c.Where + " · " + c.Name,
					Title:      st.Name,
					Kind:       st.Kind,
					ScenarioID: st.ScenarioID,
					Progress:   &homeProgress{Done: c.Done, Total: c.Total},
				}
			}
		}
		// Reachable only if a curriculum has no required steps at all, which
		// catalog_test.go forbids. Kept so a future authoring slip degrades to "no
		// task today" rather than a nil deref.
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

// todaysPage assembles 오늘의 호출, issuing it on the first look of the day.
//
// Returns nil for every state where there is nothing to draw: no candidate scenario, no
// row, or a call whose time ran out unanswered. An answered call DOES come back — the
// card collapses to its "✓ 응답함" line rather than vanishing, so the learner can see
// they already took it.
func (h *homeHandler) todaysPage(ctx context.Context, uid, day, deptLabel string, pool []string, loc *time.Location, now time.Time) *home.Page {
	if h.progress == nil {
		return nil
	}
	target := home.PageScenario(uid, day, pool)
	rec, err := h.progress.TodaysPage(ctx, uid, day, target)
	if err != nil || rec == nil {
		return nil
	}
	// Pay the call off here, not when the button was tapped: the bonus is for going,
	// and this is the first moment the server can see whether they did. Cheap — the
	// UPDATE matches nothing once it has been paid, and nothing at all until they go.
	if rec.AcceptedAt != nil && rec.AnsweredAt == nil {
		if paid, err := h.progress.CompletePageIfAttempted(ctx, uid, day); err == nil && paid {
			_ = h.progress.AddBonusXP(ctx, uid, home.PageBonusXP)
			at := time.Now()
			rec.AnsweredAt = &at
		}
	}
	left := home.PageSecondsLeft(rec.IssuedAt, now, loc)
	answered := rec.AnsweredAt != nil
	accepted := rec.AcceptedAt != nil
	if left == 0 && !answered && !accepted {
		// Missed. "오늘 놓치면 소멸" — and a dead pager on screen is worse than none:
		// it offers an action that cannot be taken. An ACCEPTED call survives its
		// countdown: the learner took it, and the scenario is theirs to finish.
		return nil
	}
	line, hint := home.PageLines(deptLabel)
	return &home.Page{
		ScenarioID:   rec.ScenarioID,
		Line:         line,
		Hint:         hint,
		SecondsLeft:  left,
		TotalSeconds: home.PageTotalSeconds(rec.IssuedAt, loc),
		Accepted:     accepted,
		Answered:     answered,
		BonusXP:      home.PageBonusXP,
	}
}

type pageAnswerResp struct {
	ScenarioID string `json:"scenarioId"`
	BonusXP    int    `json:"bonusXp"`
	// Already is true when this call had been answered before, in which case no XP was
	// granted. The client still navigates — re-entering the scenario is harmless.
	Already bool `json:"already"`
}

// @Summary Answer today's 오늘의 호출 (+bonus XP, once)
// @Tags home
// @Security Bearer
// @Success 200 {object} pageAnswerResp
// @Router /me/home/page/answer [post]
func (h *homeHandler) answerPage(w http.ResponseWriter, r *http.Request) {
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
	now := time.Now()
	day := home.DayKey(now, loc)

	// Read before writing, so an expired call cannot be answered late. The window is
	// the server's to enforce: a client that kept the card on screen past its deadline
	// would otherwise still collect the bonus.
	rec, err := h.progress.TodaysPage(r.Context(), uid, day, "")
	if err != nil || rec == nil {
		httpx.Error(w, http.StatusNotFound, "no call today")
		return
	}
	if rec.AnsweredAt == nil && home.PageSecondsLeft(rec.IssuedAt, now, loc) == 0 {
		httpx.Error(w, http.StatusGone, "today's call has expired")
		return
	}

	id, err := h.progress.AcceptPage(r.Context(), uid, day)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not answer")
		return
	}
	if id == "" {
		id = rec.ScenarioID
	}
	// No XP here. Taking the call is not answering it — the bonus is granted on the next
	// home read, once the learner has actually started the scenario. Tapping 지금 응답
	// and walking straight back out used to pay in full and report "응답 완료", which is
	// the app telling someone they did something they did not do.
	httpx.JSON(w, http.StatusOK, pageAnswerResp{ScenarioID: id, BonusXP: 0, Already: rec.AcceptedAt != nil})
}
