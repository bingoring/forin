package home

import (
	"strings"
	"time"
)

// 오늘의 호출 — the pager-style call the home screen drops once a day (v27 PagingCall).
//
// Everything about WHEN it is alive lives here, because "오늘 놓치면 소멸" is two rules
// wearing one sentence and they disagree at the edges:
//
//   - a window from when the learner first saw it, so the countdown means something; and
//   - the end of their local day, so it cannot be answered tomorrow morning.
//
// Whichever comes first wins. A window alone would let a call issued at 23:50 be
// answered at 00:30 the next day; an end-of-day rule alone would show "9시간 남음",
// which is not urgent and not what a pager is.

// PageWindow is how long a call stays answerable once it has been seen.
const PageWindow = time.Hour

// PageBonusXP is the reward for answering, per the handoff's +40 XP badge.
const PageBonusXP = 40

// Page is one day's call as the home screen needs it.
type Page struct {
	ScenarioID string `json:"scenarioId"`
	/** The pager's own two lines. Authored per department below rather than per
	 *  scenario: the call is a summons, and it has to read the same whichever short
	 *  scenario it happens to point at. */
	Line string `json:"line"`
	Hint string `json:"hint"`
	// SecondsLeft is 0 once it has expired; the client then hides the card rather than
	// drawing a dead one.
	SecondsLeft int `json:"secondsLeft"`
	// Accepted: the learner took the call and is expected in the scenario. The card
	// stops counting down and says so, rather than either vanishing or claiming they
	// already answered.
	Accepted bool `json:"accepted"`
	// TotalSeconds is the whole window, so the time bar is a fraction of something.
	// Without it the client can only draw "of what was left when the screen loaded",
	// which always starts full however late the learner opened the app — and the
	// window is NOT a constant: a call issued near midnight is clipped short.
	TotalSeconds int  `json:"totalSeconds"`
	Answered     bool `json:"answered"`
	BonusXP      int  `json:"bonusXp"`
}

// PageDeadline is when today's call stops being answerable: the sooner of the window's
// end and midnight in the learner's own timezone.
func PageDeadline(issuedAt time.Time, loc *time.Location) time.Time {
	if loc == nil {
		loc = time.UTC
	}
	local := issuedAt.In(loc)
	endOfDay := time.Date(local.Year(), local.Month(), local.Day(), 0, 0, 0, 0, loc).Add(24 * time.Hour)
	windowEnd := issuedAt.Add(PageWindow)
	if endOfDay.Before(windowEnd) {
		return endOfDay
	}
	return windowEnd
}

// PageTotalSeconds is the length of the whole window, issue to deadline.
func PageTotalSeconds(issuedAt time.Time, loc *time.Location) int {
	return int(PageDeadline(issuedAt, loc).Sub(issuedAt).Seconds())
}

// PageSecondsLeft is what the countdown shows. Zero means expired — and it is clamped
// rather than allowed to go negative so the client has one condition to check.
func PageSecondsLeft(issuedAt, now time.Time, loc *time.Location) int {
	left := int(PageDeadline(issuedAt, loc).Sub(now).Seconds())
	if left < 0 {
		return 0
	}
	return left
}

// pageLines are the summons, per department, with a shared fallback. The wording is the
// server's for the same reason the cheer presets are: a client cannot be allowed to
// invent what a colleague said.
var pageLines = map[string][2]string{
	"ER":   {"“응급실 환자 통증 호소!\n담당 간호사 응답 바랍니다.”", "응답하면 통증 사정 단기 시나리오로 바로 입장 · 약 3분"},
	"ICU":  {"“중환자실 모니터 알람!\n담당 간호사 응답 바랍니다.”", "응답하면 활력징후 보고 단기 시나리오로 바로 입장 · 약 3분"},
	"WARD": {"“3병동 환자 통증 호소!\n담당 간호사 응답 바랍니다.”", "응답하면 통증 사정 단기 시나리오로 바로 입장 · 약 3분"},
}

const pageFallbackLine = "“환자 호출 발생!\n담당 간호사 응답 바랍니다.”"
const pageFallbackHint = "응답하면 단기 시나리오로 바로 입장 · 약 3분"

// PageLines picks the summons for a department. `dept` is the label the shift badge
// shows, so "ER · TRIAGE" and "ER" both land on the ER wording.
func PageLines(dept string) (line, hint string) {
	head := dept
	if i := strings.IndexByte(head, ' '); i > 0 {
		head = head[:i]
	}
	if v, ok := pageLines[head]; ok {
		return v[0], v[1]
	}
	return pageFallbackLine, pageFallbackHint
}

// PageScenario picks which short scenario today's call enters.
//
// Deterministic from (userID, day) like every other pick on this screen, so the call
// does not change under a learner who reloads — and drawn from the candidates the
// caller says are short enough to be a three-minute interruption.
func PageScenario(userID, day string, candidates []string) string {
	if len(candidates) == 0 {
		return ""
	}
	return candidates[seed(userID, day, "page")%uint64(len(candidates))]
}
