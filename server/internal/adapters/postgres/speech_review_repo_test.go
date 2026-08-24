package postgres

import (
	"context"
	"testing"

	"github.com/bingoring/forin/server/internal/ports"
)

// attemptAt is one utterance in a run: the fields the review queries actually
// read, with everything else left at sampleAttempt's defaults.
func attemptAt(userID, key, text string, overall float64, session, scenario string) ports.SpeechAttemptInput {
	a := sampleAttempt(userID, key)
	a.ReferenceText = text
	a.Recognized = text
	a.Overall = overall
	a.SessionID = session
	a.ScenarioID = scenario
	a.Origin = "dialogue"
	a.Words = nil // the review queries never read words; skip the phoneme fan-out
	return a
}

// ListSessionSpeech is the query the Scenario Clear screen is built on, and its
// two non-obvious behaviours only exist in SQL: it must collapse re-tries to the
// newest attempt, and it must still come back in conversation order afterwards.
func TestListSessionSpeechCollapsesRetriesAndKeepsOrder(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// Two sentences, the first one said twice — 40 then 90, i.e. they fixed it.
	for _, a := range []ports.SpeechAttemptInput{
		attemptAt(uid, "k-first", "first line", 40, "run-1", "SCN-ER-00002"),
		attemptAt(uid, "k-second", "second line", 70, "run-1", "SCN-ER-00002"),
		attemptAt(uid, "k-first", "first line", 90, "run-1", "SCN-ER-00002"),
		// A different run, and a non-dialogue attempt, neither of which belongs.
		attemptAt(uid, "k-other", "other run", 55, "run-2", "SCN-ER-00002"),
		attemptAt(uid, "k-loose", "no session", 60, "", ""),
	} {
		if _, _, err := repo.InsertAttempt(ctx, a); err != nil {
			t.Fatalf("InsertAttempt: %v", err)
		}
	}

	rows, err := repo.ListSessionSpeech(ctx, uid, "run-1")
	if err != nil {
		t.Fatalf("ListSessionSpeech: %v", err)
	}
	if len(rows) != 2 {
		t.Fatalf("got %d sentences, want 2 (re-try collapsed): %+v", len(rows), rows)
	}
	// Conversation order: "first line" was said first.
	if rows[0].ReferenceText != "first line" || rows[1].ReferenceText != "second line" {
		t.Errorf("order = %q, %q", rows[0].ReferenceText, rows[1].ReferenceText)
	}
	// The score kept is the one they reached, not the one they started at.
	if rows[0].Overall != 90 {
		t.Errorf("first line kept overall %v, want the newest attempt's 90", rows[0].Overall)
	}
	if rows[0].Attempts != 2 {
		t.Errorf("attempts = %d, want 2", rows[0].Attempts)
	}
}

// A session id that is not the caller's reads as an empty run, which is what
// makes the endpoint safe without a separate ownership check.
func TestListSessionSpeechIsScopedToTheUser(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	mine := speechTestUser(t, pool)
	theirs := speechTestUser(t, pool)
	ctx := context.Background()

	if _, _, err := repo.InsertAttempt(ctx, attemptAt(theirs, "k-a", "their line", 80, "run-x", "")); err != nil {
		t.Fatalf("InsertAttempt: %v", err)
	}
	rows, err := repo.ListSessionSpeech(ctx, mine, "run-x")
	if err != nil {
		t.Fatalf("ListSessionSpeech: %v", err)
	}
	if len(rows) != 0 {
		t.Errorf("another user's run leaked %d rows", len(rows))
	}
}

// SpeakBands must count SENTENCES at their current standing, not attempts:
// otherwise one heavily-drilled sentence dominates the distribution and the
// player keeps being punished for tries they have already fixed.
func TestSpeakBandsCountSentencesAtTheirNewestScore(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	for _, a := range []ports.SpeechAttemptInput{
		// One sentence drilled four times, ending high. Counting attempts would
		// report three lows; counting sentences reports one high.
		attemptAt(uid, "k-drilled", "drilled", 20, "run-1", ""),
		attemptAt(uid, "k-drilled", "drilled", 30, "run-1", ""),
		attemptAt(uid, "k-drilled", "drilled", 55, "run-1", ""),
		attemptAt(uid, "k-drilled", "drilled", 88, "run-1", ""),
		attemptAt(uid, "k-mid", "mid", 60, "run-1", ""),   // boundary: 60 is mid
		attemptAt(uid, "k-high", "high", 80, "run-1", ""), // boundary: 80 is high
		attemptAt(uid, "k-low", "low", 59, "run-1", ""),
	} {
		if _, _, err := repo.InsertAttempt(ctx, a); err != nil {
			t.Fatalf("InsertAttempt: %v", err)
		}
	}

	b, err := repo.SpeakBands(ctx, uid)
	if err != nil {
		t.Fatalf("SpeakBands: %v", err)
	}
	if b.Total != 4 {
		t.Errorf("total = %d, want 4 sentences (not 7 attempts)", b.Total)
	}
	if b.Low != 1 || b.Mid != 1 || b.High != 2 {
		t.Errorf("bands = low %d / mid %d / high %d; want 1 / 1 / 2", b.Low, b.Mid, b.High)
	}
}

// The list's two sorts, its paging, and the unpaged total that rides along on
// every row.
func TestListSpokenSentencesSortsPagesAndReportsTotal(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// Inserted worst-last so "recent" and "weak" cannot accidentally agree.
	for _, a := range []ports.SpeechAttemptInput{
		attemptAt(uid, "k-1", "best", 95, "run-1", "SCN-ER-00002"),
		attemptAt(uid, "k-2", "middling", 65, "run-1", "SCN-NICU-00101"),
		attemptAt(uid, "k-3", "worst", 22, "run-1", ""),
	} {
		if _, _, err := repo.InsertAttempt(ctx, a); err != nil {
			t.Fatalf("InsertAttempt: %v", err)
		}
	}

	weak, total, err := repo.ListSpokenSentences(ctx, uid, true, 2, 0)
	if err != nil {
		t.Fatalf("ListSpokenSentences(weak): %v", err)
	}
	if total != 3 {
		t.Errorf("total = %d, want the unpaged 3", total)
	}
	if len(weak) != 2 || weak[0].ReferenceText != "worst" || weak[1].ReferenceText != "middling" {
		t.Errorf("weak page = %+v", weak)
	}
	// scenario_id travels so the list can draw its department chip.
	if weak[1].ScenarioID != "SCN-NICU-00101" {
		t.Errorf("scenarioId = %q", weak[1].ScenarioID)
	}

	recent, _, err := repo.ListSpokenSentences(ctx, uid, false, 1, 0)
	if err != nil {
		t.Fatalf("ListSpokenSentences(recent): %v", err)
	}
	if len(recent) != 1 || recent[0].ReferenceText != "worst" {
		t.Errorf("recent page = %+v", recent)
	}

	// Offset past the end is how infinite scroll learns it has reached the
	// bottom: an empty page, not an error.
	tail, _, err := repo.ListSpokenSentences(ctx, uid, true, 20, 99)
	if err != nil {
		t.Fatalf("ListSpokenSentences(offset past end): %v", err)
	}
	if len(tail) != 0 {
		t.Errorf("offset past the end returned %d rows", len(tail))
	}
}
