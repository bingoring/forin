package lounge

import (
	"errors"
	"strings"
	"testing"
)

func TestDraftCleanRejectsWhatCannotBeStored(t *testing.T) {
	cases := []struct {
		name string
		in   Draft
		want error
	}{
		// Trimmed BEFORE the empty check: three spaces is not a three-character post.
		{"blank body", Draft{Body: "   "}, ErrEmptyBody},
		{"over the cap", Draft{Body: strings.Repeat("가", MaxBody+1)}, ErrBodyTooLong},
		{"unknown kind", Draft{Kind: "rant", Body: "hi"}, ErrBadKind},
		{"tag too long", Draft{Body: "hi", Tags: []string{strings.Repeat("x", MaxTagLen+1)}}, ErrTagTooLong},
		{"too many tags", Draft{Body: "hi", Tags: []string{"a", "b", "c", "d", "e"}}, ErrTooManyTags},
		// A share with nothing quoted is a share post the card cannot draw.
		{"share with no snippet", Draft{Kind: KindShare, Body: "hi", ScenarioID: "SCN-ER-00002"}, ErrGapInShare},
		{"share with no scenario", Draft{Kind: KindShare, Body: "hi", Snippet: &Snippet{Turns: []Turn{{Index: 0}}}}, ErrShareNeedsScenario},
		{"share with a hole", Draft{
			Kind: KindShare, Body: "hi", ScenarioID: "SCN-ER-00002",
			Snippet: &Snippet{Turns: []Turn{{Index: 0}, {Index: 2}}},
		}, ErrGapInShare},
		{"share too long", Draft{
			Kind: KindShare, Body: "hi", ScenarioID: "SCN-ER-00002",
			Snippet: &Snippet{Turns: []Turn{{Index: 0}, {Index: 1}, {Index: 2}, {Index: 3}, {Index: 4}, {Index: 5}, {Index: 6}}},
		}, ErrTooManyTurns},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			if _, err := c.in.Clean(); !errors.Is(err, c.want) {
				t.Fatalf("Clean() error = %v, want %v", err, c.want)
			}
		})
	}
}

func TestDraftCleanNormalises(t *testing.T) {
	got, err := Draft{
		Body: "  하루 50번 쓰는 말  ",
		Tags: []string{" #현지팁 ", "현지팁", "", "  병동영어"},
	}.Clean()
	if err != nil {
		t.Fatalf("Clean() unexpected error: %v", err)
	}
	if got.Kind != KindTalk {
		t.Errorf("kind = %q, want the default %q", got.Kind, KindTalk)
	}
	if got.Body != "하루 50번 쓰는 말" {
		t.Errorf("body = %q, want it trimmed", got.Body)
	}
	// The hash is the client's decoration, and the duplicate is one tag typed twice.
	if len(got.Tags) != 2 || got.Tags[0] != "현지팁" || got.Tags[1] != "병동영어" {
		t.Errorf("tags = %v, want [현지팁 병동영어]", got.Tags)
	}
}

func TestNonShareDropsQuotedMaterial(t *testing.T) {
	// A snippet on a talk post would be quoted text with no header saying where it
	// came from — the card has nowhere to draw it, so it is not stored.
	got, err := Draft{
		Kind: KindTalk, Body: "hi", ScenarioID: "SCN-ER-00002",
		Snippet: &Snippet{Turns: []Turn{{Index: 0, Text: "Where is the pain?"}}},
	}.Clean()
	if err != nil {
		t.Fatalf("Clean() unexpected error: %v", err)
	}
	if got.Snippet != nil || got.ScenarioID != "" {
		t.Errorf("snippet=%v scenario=%q, want both dropped", got.Snippet, got.ScenarioID)
	}
}

func TestConsecutive(t *testing.T) {
	if !Consecutive([]Turn{{Index: 7}}) {
		t.Error("a single turn is consecutive with itself")
	}
	if !Consecutive([]Turn{{Index: 3}, {Index: 4}, {Index: 5}}) {
		t.Error("3,4,5 is an unbroken run")
	}
	if Consecutive([]Turn{{Index: 3}, {Index: 5}}) {
		t.Error("3,5 has a hole — quoting it would misrepresent the exchange")
	}
	// The same line twice is a hole by another name: the reader sees two turns where
	// the conversation had one.
	if Consecutive([]Turn{{Index: 3}, {Index: 3}}) {
		t.Error("3,3 is the same turn quoted twice")
	}
	if Consecutive([]Turn{{Index: 5}, {Index: 4}}) {
		t.Error("out of order is not a run")
	}
}

func TestPageSizeClamps(t *testing.T) {
	if got := PageSize(0); got != FeedPage {
		t.Errorf("PageSize(0) = %d, want the default %d", got, FeedPage)
	}
	if got := PageSize(1000); got != MaxFeedPage {
		t.Errorf("PageSize(1000) = %d, want the cap %d — one request must not pull the table", got, MaxFeedPage)
	}
	if got := PageSize(5); got != 5 {
		t.Errorf("PageSize(5) = %d, want 5", got)
	}
}
