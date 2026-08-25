package progress

import "testing"

func groups(n int) []ModelAnswerGroup {
	out := make([]ModelAnswerGroup, n)
	for i := range out {
		out[i] = ModelAnswerGroup{ScenarioID: string(rune('a' + i)), Corrections: i + 1}
	}
	return out
}

var someCards = []ModelAnswerCard{{Said: "I give you medicine", Model: "I'm giving you your medication"}}

// The handoff expands the most recent group and collapses three: exactly one
// group may carry cards, or the block draws two expanded panels.
func TestBuildModelAnswerSummaryExpandsOnlyTheMostRecent(t *testing.T) {
	s := BuildModelAnswerSummary(groups(4), 4, someCards)
	if len(s.Groups) != 4 {
		t.Fatalf("groups = %d, want 4", len(s.Groups))
	}
	if len(s.Groups[0].Cards) != 1 {
		t.Errorf("the most recent group was not expanded")
	}
	for i := 1; i < len(s.Groups); i++ {
		if s.Groups[i].Cards != nil {
			t.Errorf("group %d carried cards it will not draw", i)
		}
	}
}

// "+ N개 더" counts the scenarios BEYOND the ones shown — total minus what was
// rendered. Subtracting only the collapsed count would over-report by one.
func TestBuildModelAnswerSummaryCountsWhatIsNotShown(t *testing.T) {
	for _, tc := range []struct{ total, wantMore int }{
		{4, 0}, // showed all four
		{5, 1},
		{128, 124},
	} {
		s := BuildModelAnswerSummary(groups(4), tc.total, someCards)
		if s.More != tc.wantMore {
			t.Errorf("total %d -> more %d, want %d", tc.total, s.More, tc.wantMore)
		}
	}
}

// A short page must not produce a negative "+ -2개 더".
func TestBuildModelAnswerSummaryNeverReportsNegativeMore(t *testing.T) {
	s := BuildModelAnswerSummary(groups(2), 2, someCards)
	if s.More != 0 {
		t.Errorf("more = %d on a page shorter than the block", s.More)
	}
	if len(s.Groups) != 2 {
		t.Errorf("groups = %d, want the 2 that exist", len(s.Groups))
	}
}

// An over-long page is trimmed, not rendered: the block has room for four rows.
func TestBuildModelAnswerSummaryTrimsAnOverlongPage(t *testing.T) {
	s := BuildModelAnswerSummary(groups(9), 9, someCards)
	if len(s.Groups) != ModelAnswerPageSize {
		t.Errorf("groups = %d, want %d", len(s.Groups), ModelAnswerPageSize)
	}
	if s.More != 9-ModelAnswerPageSize {
		t.Errorf("more = %d", s.More)
	}
}

// A player with no corrections yet gets an empty block, not a panic.
func TestBuildModelAnswerSummaryEmpty(t *testing.T) {
	s := BuildModelAnswerSummary(nil, 0, nil)
	if len(s.Groups) != 0 || s.More != 0 || s.Total != 0 {
		t.Errorf("empty summary = %+v", s)
	}
}

// The caller's slice must not gain cards as a side effect — the list endpoint
// reuses the same rows for a page where no group is expanded.
func TestBuildModelAnswerSummaryDoesNotMutateItsInput(t *testing.T) {
	in := groups(4)
	BuildModelAnswerSummary(in, 4, someCards)
	for i, g := range in {
		if g.Cards != nil {
			t.Errorf("input group %d was mutated", i)
		}
	}
}
