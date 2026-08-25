package progress

import "time"

// ModelAnswerCard is one correction as the 시나리오 모범답안 block draws it:
// 내 답변 struck through against the 모범, with the "왜?" note.
//
// Field names say what the strings ARE rather than mirroring the storage columns
// (front/back), because in this block their meaning is fixed: front is always
// what the learner said and back is always the model answer. A reader of the JSON
// should not have to know which way round front/back are.
type ModelAnswerCard struct {
	Said  string `json:"said"`
	Model string `json:"model"`
	// Note is the "왜 이 표현이 더 나은가" explanation. Often empty — the block
	// simply omits the box then rather than drawing an empty one.
	Note      string    `json:"note,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
}

// ModelAnswerGroup is one scenario's worth of corrections.
//
// Cards is empty on a collapsed row: the summary block expands only its most
// recent group, so sending every group's cards would ship a payload the screen
// does not draw.
type ModelAnswerGroup struct {
	ScenarioID string `json:"scenarioId"`
	// Title is "" when the scenario is not in the content set the server is
	// serving (an old card whose scenario was renamed or removed). The screen
	// falls back to the id rather than showing a blank row.
	Title       string            `json:"title"`
	Corrections int               `json:"corrections"`
	LastAt      time.Time         `json:"lastAt"`
	Cards       []ModelAnswerCard `json:"cards,omitempty"`
}

// The 시나리오 모범답안 summary block's shape, from 04_SCREENS ⑨: the completed
// scenario count, "most recent one expanded", then 3 collapsed rows and
// "+ N개 더".
const (
	// ModelAnswerExpanded is how many groups arrive with their cards. One — the
	// block is summary-only by design, because the underlying list passes 100
	// items and an inline list would grow the page without bound.
	ModelAnswerExpanded = 1
	// ModelAnswerCollapsed is how many title-only rows follow the expanded one.
	ModelAnswerCollapsed = 3
	// ModelAnswerSummaryCards caps the expanded panel.
	//
	// The block is summary-only for a stated reason — a full inline list grows the
	// page without bound — and the expanded group is part of the same page. Real
	// data made this concrete: replaying one scenario put 13 corrections in the
	// panel, all variations on the same sentence, which is exactly the unbounded
	// growth the block exists to avoid. Three is enough to show what a corrected
	// answer looks like; the rest are one tap away on the full list.
	ModelAnswerSummaryCards = 3
)

// ModelAnswerPageSize is how many groups the summary needs to fill itself: the
// expanded one plus the collapsed rows. Asking for exactly this many is what
// keeps the block from paying for cards it will not draw.
const ModelAnswerPageSize = ModelAnswerExpanded + ModelAnswerCollapsed

// ModelAnswerSummary is the block's payload.
type ModelAnswerSummary struct {
	// Total is every scenario the player has corrections for, not just this page.
	Total int `json:"total"`
	// Groups is at most ModelAnswerPageSize entries; only the first carries Cards.
	Groups []ModelAnswerGroup `json:"groups"`
	// More is what "+ N개 더" says. 0 means the block showed everything and the
	// row is omitted — never "+ 0개 더".
	More int `json:"more"`
}

// BuildModelAnswerSummary shapes a page of groups into the block.
//
// `groups` must be the newest-first page and `cards` the cards for its first
// entry; this function does no I/O so the shaping is testable without a database.
// It also owns the arithmetic that is easy to get wrong: More counts the
// scenarios BEYOND the ones shown, so it is total minus what was rendered — not
// total minus the collapsed count, and never negative when the page is short.
func BuildModelAnswerSummary(groups []ModelAnswerGroup, total int, cards []ModelAnswerCard) ModelAnswerSummary {
	if len(groups) > ModelAnswerPageSize {
		groups = groups[:ModelAnswerPageSize]
	}
	out := make([]ModelAnswerGroup, len(groups))
	copy(out, groups)
	// Only the most recent group is expanded. Copying first means an accidental
	// second expanded group cannot be introduced by a caller reusing the slice.
	if len(cards) > ModelAnswerSummaryCards {
		cards = cards[:ModelAnswerSummaryCards]
	}
	for i := range out {
		if i < ModelAnswerExpanded {
			out[i].Cards = cards
		} else {
			out[i].Cards = nil
		}
	}
	more := total - len(out)
	if more < 0 {
		more = 0
	}
	return ModelAnswerSummary{Total: total, Groups: out, More: more}
}
