package http

import (
	"context"
	"testing"
	"time"

	"github.com/bingoring/forin/server/internal/domain/slang"
)

type fakeSlangRepo struct {
	collected  []slang.Collected
	collected2 []string // ids passed to Collect
}

func (f *fakeSlangRepo) Collected(_ context.Context, _ string) ([]slang.Collected, error) {
	return f.collected, nil
}
func (f *fakeSlangRepo) Collect(_ context.Context, _, cardID string) error {
	f.collected2 = append(f.collected2, cardID)
	return nil
}

func testDeck() *slang.Deck {
	return slang.NewDeck([]slang.Card{
		{ID: "a", Code: "AA", Gloss: map[string]string{"en": "aa", "ko": "에이"}, Example: "e"},
		{ID: "b", Code: "BB", Gloss: map[string]string{"en": "bb"}, Example: "e"},
		{ID: "c", Code: "CC", Gloss: map[string]string{"en": "cc", "ko": "씨"}, Example: "e"},
	})
}

func TestSlangStateFreshOffersFirstCard(t *testing.T) {
	h := &slangHandler{deck: testDeck(), repo: &fakeSlangRepo{}}
	s := h.state(context.Background(), "u1", "ko", time.UTC)
	if !s.CollectableToday {
		t.Fatal("a fresh learner can collect today")
	}
	if s.TodayCard == nil || s.TodayCard.Number != 1 || s.TodayCard.Code != "AA" {
		t.Fatalf("today should be the first card: %+v", s.TodayCard)
	}
	if s.CollectedCount != 0 || s.Total != 3 {
		t.Fatalf("counts: %d/%d", s.CollectedCount, s.Total)
	}
}

func TestSlangStateNotCollectableTwiceInADay(t *testing.T) {
	repo := &fakeSlangRepo{collected: []slang.Collected{{CardID: "a", CollectedAt: time.Now()}}}
	h := &slangHandler{deck: testDeck(), repo: repo}
	s := h.state(context.Background(), "u1", "ko", time.UTC)
	if s.CollectableToday {
		t.Fatal("already collected today — not collectable again")
	}
	// The featured card is the one just collected, and its Korean gloss resolved.
	if s.TodayCard == nil || s.TodayCard.Code != "AA" || s.TodayCard.Meaning != "에이" {
		t.Fatalf("featured card wrong: %+v", s.TodayCard)
	}
	if s.CollectedCount != 1 {
		t.Fatalf("count: %d", s.CollectedCount)
	}
}

func TestSlangStateNextDayOffersNextCard(t *testing.T) {
	repo := &fakeSlangRepo{collected: []slang.Collected{{CardID: "a", CollectedAt: time.Now().AddDate(0, 0, -1)}}}
	h := &slangHandler{deck: testDeck(), repo: repo}
	s := h.state(context.Background(), "u1", "en", time.UTC)
	if !s.CollectableToday {
		t.Fatal("a new day is collectable again")
	}
	if s.TodayCard == nil || s.TodayCard.Number != 2 || s.TodayCard.Code != "BB" {
		t.Fatalf("today should be the second card: %+v", s.TodayCard)
	}
	// English fallback for a card with no ko gloss.
	if s.TodayCard.Meaning != "bb" {
		t.Fatalf("gloss fallback: %q", s.TodayCard.Meaning)
	}
}
