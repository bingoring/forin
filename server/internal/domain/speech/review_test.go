package speech

import (
	"context"
	"errors"
	"testing"

	"github.com/bingoring/forin/server/internal/ports"
)

func rowAt(text string, overall float64) ports.SpokenSentenceRow {
	return ports.SpokenSentenceRow{SentenceKey: text, ReferenceText: text, Overall: overall}
}

// The run average is over SENTENCES at their final score. A player who re-tried
// one line until it was good must not be averaged against the tries they fixed —
// the repo already collapses re-tries, so the service must not re-expand them.
func TestSessionSpeechReviewAveragesSentences(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.sessionRows = []ports.SpokenSentenceRow{rowAt("a", 90), rowAt("b", 60), rowAt("c", 30)}
	svc := NewService(repo, nil, nil)

	rev, err := svc.SessionSpeechReview(context.Background(), "u1", "s1")
	if err != nil {
		t.Fatalf("SessionSpeechReview: %v", err)
	}
	if rev.Average != 60 {
		t.Errorf("average = %v, want 60", rev.Average)
	}
	// Conversation order is preserved — the screen lists what was said, in order.
	if got := []string{rev.Sentences[0].ReferenceText, rev.Sentences[2].ReferenceText}; got[0] != "a" || got[1] != "c" {
		t.Errorf("sentence order disturbed: %v", got)
	}
}

// The 다시 연습 button practises the two WORST sentences, and picking them must
// not reorder the list the screen is drawing from.
func TestSessionSpeechReviewWeakestTwoWithoutReorderingTheList(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.sessionRows = []ports.SpokenSentenceRow{rowAt("first", 88), rowAt("second", 41), rowAt("third", 95), rowAt("fourth", 55)}
	svc := NewService(repo, nil, nil)

	rev, err := svc.SessionSpeechReview(context.Background(), "u1", "s1")
	if err != nil {
		t.Fatalf("SessionSpeechReview: %v", err)
	}
	if len(rev.Weakest) != 2 {
		t.Fatalf("weakest = %d rows, want 2", len(rev.Weakest))
	}
	if rev.Weakest[0].ReferenceText != "second" || rev.Weakest[1].ReferenceText != "fourth" {
		t.Errorf("weakest = %q, %q; want second, fourth", rev.Weakest[0].ReferenceText, rev.Weakest[1].ReferenceText)
	}
	// The regression this exists for: sorting `Sentences` in place instead of a copy.
	if rev.Sentences[0].ReferenceText != "first" || rev.Sentences[1].ReferenceText != "second" {
		t.Errorf("Sentences was reordered by picking Weakest: %q, %q",
			rev.Sentences[0].ReferenceText, rev.Sentences[1].ReferenceText)
	}
}

// A run where nothing was spoken aloud is the empty state, not a 0-point badge.
func TestSessionSpeechReviewEmptyRunHasNoAverage(t *testing.T) {
	svc := NewService(newFakeSpeechRepo(), nil, nil)
	rev, err := svc.SessionSpeechReview(context.Background(), "u1", "s1")
	if err != nil {
		t.Fatalf("SessionSpeechReview: %v", err)
	}
	if rev.Average != 0 || len(rev.Sentences) != 0 || len(rev.Weakest) != 0 {
		t.Errorf("empty run reviewed as %+v", rev)
	}
}

// One spoken sentence yields one weakest row — not two, and not a panic from
// slicing [:2] on a shorter slice.
func TestSessionSpeechReviewSingleSentence(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.sessionRows = []ports.SpokenSentenceRow{rowAt("only", 72)}
	svc := NewService(repo, nil, nil)

	rev, err := svc.SessionSpeechReview(context.Background(), "u1", "s1")
	if err != nil {
		t.Fatalf("SessionSpeechReview: %v", err)
	}
	if len(rev.Weakest) != 1 || rev.Average != 72 {
		t.Errorf("single-sentence run: weakest=%d average=%v", len(rev.Weakest), rev.Average)
	}
}

// The block and the full list must never disagree about which sentences are
// worst, which is only guaranteed if the block asks the SAME paged query for its
// first two rather than computing its own ranking.
func TestSpeakSummaryTakesWeakestThroughTheListQuery(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.bands = ports.SpeakBandCounts{Total: 128, Low: 10, Mid: 40, High: 78}
	repo.spokenRows = []ports.SpokenSentenceRow{rowAt("worst", 12), rowAt("next", 33), rowAt("fine", 91)}
	repo.spokenTotal = 128
	svc := NewService(repo, nil, nil)

	sum, err := svc.SpeakSummary(context.Background(), "u1")
	if err != nil {
		t.Fatalf("SpeakSummary: %v", err)
	}
	if sum.Bands.Total != 128 || sum.Bands.Low != 10 {
		t.Errorf("bands = %+v", sum.Bands)
	}
	if len(sum.Weakest) != 2 {
		t.Fatalf("weakest = %d rows, want 2", len(sum.Weakest))
	}
	if len(repo.spokenCalls) != 1 {
		t.Fatalf("expected one list query, got %d", len(repo.spokenCalls))
	}
	if c := repo.spokenCalls[0]; !c.WeakestFirst || c.Limit != 2 || c.Offset != 0 || c.Dept != "" {
		t.Errorf("summary asked for %+v; want weakest-first, every department, limit 2, offset 0", c)
	}
}

// A band read that fails must surface, not report a player with zero sentences
// spoken — "you have never spoken" is a very different screen from an error.
func TestSpeakSummaryPropagatesBandFailure(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.bandsErr = errors.New("boom")
	if _, err := NewService(repo, nil, nil).SpeakSummary(context.Background(), "u1"); err == nil {
		t.Fatal("expected the band failure to surface")
	}
}

// Page size is clamped, not rejected: a client bug should degrade to a bounded
// page, never leave the list stuck on a 400.
func TestSpokenSentencesClampsPageSize(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc := NewService(repo, nil, nil)
	for _, tc := range []struct{ asked, want int }{{0, 20}, {-5, 20}, {50, 50}, {5000, 100}} {
		repo.spokenCalls = nil
		if _, _, err := svc.SpokenSentences(context.Background(), "u1", true, "", tc.asked, 0); err != nil {
			t.Fatalf("SpokenSentences(%d): %v", tc.asked, err)
		}
		if got := repo.spokenCalls[0].Limit; got != tc.want {
			t.Errorf("limit %d asked -> %d, want %d", tc.asked, got, tc.want)
		}
	}
	// A negative offset would make Postgres error rather than start at the top.
	repo.spokenCalls = nil
	if _, _, err := svc.SpokenSentences(context.Background(), "u1", true, "", 20, -3); err != nil {
		t.Fatalf("negative offset: %v", err)
	}
	if got := repo.spokenCalls[0].Offset; got != 0 {
		t.Errorf("negative offset reached the repo as %d", got)
	}
}
