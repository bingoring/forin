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

	b, err := repo.SpeakBands(ctx, uid, "")
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

// The distribution narrows to the selected department, so the 말하기 탭's gauge under
// its filter chips re-reads as that chip's spread rather than the whole bank's.
func TestSpeakBandsFilterByDepartment(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	for _, a := range []ports.SpeechAttemptInput{
		attemptAt(uid, "k-er1", "er low", 40, "run-1", "SCN-ER-00002"),  // ER: low
		attemptAt(uid, "k-er2", "er high", 90, "run-1", "SCN-ER-00003"), // ER: high
		attemptAt(uid, "k-icu", "icu mid", 70, "run-1", "SCN-ICU-00001"), // ICU: mid
	} {
		if _, _, err := repo.InsertAttempt(ctx, a); err != nil {
			t.Fatalf("InsertAttempt: %v", err)
		}
	}

	// ER only: one low, one high, no ICU — a whole-bank count would report the mid too.
	er, err := repo.SpeakBands(ctx, uid, "ER")
	if err != nil {
		t.Fatalf("SpeakBands(ER): %v", err)
	}
	if er.Total != 2 || er.Low != 1 || er.Mid != 0 || er.High != 1 {
		t.Errorf("ER bands = total %d / low %d / mid %d / high %d; want 2 / 1 / 0 / 1", er.Total, er.Low, er.Mid, er.High)
	}
	// '' spans everything — the mid comes back.
	all, err := repo.SpeakBands(ctx, uid, "")
	if err != nil {
		t.Fatalf("SpeakBands(all): %v", err)
	}
	if all.Total != 3 || all.Mid != 1 {
		t.Errorf("all bands = total %d / mid %d; want 3 / 1", all.Total, all.Mid)
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

	weak, total, err := repo.ListSpokenSentences(ctx, uid, "weak", "", "", 2, 0)
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

	recent, _, err := repo.ListSpokenSentences(ctx, uid, "recent", "", "", 1, 0)
	if err != nil {
		t.Fatalf("ListSpokenSentences(recent): %v", err)
	}
	if len(recent) != 1 || recent[0].ReferenceText != "worst" {
		t.Errorf("recent page = %+v", recent)
	}

	// "high" is the mirror of "weak": best standing first. A page of two is
	// "best" then "middling" — so a High query that fell back to Weak (or shared
	// its ORDER BY) would put "worst" at the top and fail here.
	high, highTotal, err := repo.ListSpokenSentences(ctx, uid, "high", "", "", 2, 0)
	if err != nil {
		t.Fatalf("ListSpokenSentences(high): %v", err)
	}
	if highTotal != 3 {
		t.Errorf("high total = %d, want 3", highTotal)
	}
	if len(high) != 2 || high[0].ReferenceText != "best" || high[1].ReferenceText != "middling" {
		t.Errorf("high page = %+v", high)
	}

	// Offset past the end is how infinite scroll learns it has reached the
	// bottom: an empty page, not an error.
	tail, _, err := repo.ListSpokenSentences(ctx, uid, "weak", "", "", 20, 99)
	if err != nil {
		t.Fatalf("ListSpokenSentences(offset past end): %v", err)
	}
	if len(tail) != 0 {
		t.Errorf("offset past the end returned %d rows", len(tail))
	}
}

// Filtering by department must happen in SQL, or the list's count lies.
//
// It used to be client-side: the screen fetched a page, kept the rows whose scenario
// id started with the chosen department, and printed "3 of 128". That reads as "3 of
// 128 loaded" when it means "3 matched among the pages fetched so far" — and more
// arrived as the learner scrolled, which reads as the filter being broken.
func TestListSpokenSentencesFiltersByDepartment(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	for _, a := range []ports.SpeechAttemptInput{
		attemptAt(uid, "k-er1", "er one", 40, "run-1", "SCN-ER-00002"),
		attemptAt(uid, "k-er2", "er two", 60, "run-1", "SCN-ER-00003"),
		attemptAt(uid, "k-icu", "icu one", 80, "run-1", "SCN-ICU-00001"),
		attemptAt(uid, "k-none", "no scenario", 90, "run-1", ""),
	} {
		if _, _, err := repo.InsertAttempt(ctx, a); err != nil {
			t.Fatalf("InsertAttempt: %v", err)
		}
	}

	// Filtered: only that department, and `total` counts only it.
	rows, total, err := repo.ListSpokenSentences(ctx, uid, "weak", "ER", "", 20, 0)
	if err != nil {
		t.Fatalf("filtered: %v", err)
	}
	if len(rows) != 2 || total != 2 {
		t.Errorf("ER filter = %d rows, total %d; want 2 / 2", len(rows), total)
	}
	for _, r := range rows {
		if r.ScenarioID != "SCN-ER-00002" && r.ScenarioID != "SCN-ER-00003" {
			t.Errorf("ER filter returned %s", r.ScenarioID)
		}
	}

	// Unfiltered: everything, including the sentence with no scenario.
	all, allTotal, err := repo.ListSpokenSentences(ctx, uid, "weak", "", "", 20, 0)
	if err != nil {
		t.Fatalf("unfiltered: %v", err)
	}
	if len(all) != 4 || allTotal != 4 {
		t.Errorf("unfiltered = %d rows, total %d; want 4 / 4", len(all), allTotal)
	}
}

// 문장 검색. The search has to filter in SQL for the same reason the department chip
// does: `total` is what "N문장 중 M개 표시" reads, and a client-side filter reports
// "3 of 128" for "3 among the pages loaded so far".
func TestListSpokenSentencesFiltersByQuery(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	for _, a := range []ports.SpeechAttemptInput{
		attemptAt(uid, "q-1", "I'm giving you acetaminophen 650 milligrams.", 58, "run-1", "SCN-ER-00002"),
		attemptAt(uid, "q-2", "Please bear with me for a moment.", 64, "run-1", "SCN-ER-00002"),
		attemptAt(uid, "q-3", "When did the pain start?", 82, "run-1", "SCN-ICU-00001"),
	} {
		if _, _, err := repo.InsertAttempt(ctx, a); err != nil {
			t.Fatalf("InsertAttempt: %v", err)
		}
	}

	rows, total, err := repo.ListSpokenSentences(ctx, uid, "weak", "", "acetaminophen", 20, 0)
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if len(rows) != 1 || total != 1 {
		t.Fatalf("search = %d rows, total %d; want 1 / 1", len(rows), total)
	}

	// Case-insensitive, and a substring rather than a prefix: somebody typing "PAIN"
	// means the sentence with pain in the middle of it.
	rows, _, err = repo.ListSpokenSentences(ctx, uid, "weak", "", "PAIN", 20, 0)
	if err != nil {
		t.Fatalf("case-insensitive query: %v", err)
	}
	if len(rows) != 1 || rows[0].ReferenceText != "When did the pain start?" {
		t.Errorf("case-insensitive search = %+v", rows)
	}

	// Composes with the department chip rather than replacing it.
	rows, total, err = repo.ListSpokenSentences(ctx, uid, "weak", "ICU", "pain", 20, 0)
	if err != nil {
		t.Fatalf("query + dept: %v", err)
	}
	if len(rows) != 1 || total != 1 {
		t.Errorf("ICU + pain = %d rows, total %d", len(rows), total)
	}
	if rows, total, err = repo.ListSpokenSentences(ctx, uid, "weak", "ER", "pain", 20, 0); err != nil {
		t.Fatalf("query + wrong dept: %v", err)
	} else if len(rows) != 0 || total != 0 {
		t.Errorf("ER + pain = %d rows, total %d; want nothing", len(rows), total)
	}

	// An empty query is not a filter at all.
	all, allTotal, err := repo.ListSpokenSentences(ctx, uid, "weak", "", "", 20, 0)
	if err != nil {
		t.Fatalf("empty query: %v", err)
	}
	if len(all) != 3 || allTotal != 3 {
		t.Errorf("empty query = %d rows, total %d; want 3 / 3", len(all), allTotal)
	}
}

// The chip row has to be complete regardless of paging: chips that appear as the
// learner scrolls look like the screen changing its mind.
func TestSpokenDepartmentsIsCompleteAndScoped(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	mine := speechTestUser(t, pool)
	theirs := speechTestUser(t, pool)
	ctx := context.Background()

	for _, a := range []ports.SpeechAttemptInput{
		attemptAt(mine, "d-1", "a", 50, "r", "SCN-ER-00002"),
		attemptAt(mine, "d-2", "b", 50, "r", "SCN-ICU-00001"),
		attemptAt(mine, "d-3", "c", 50, "r", "SCN-ER-00009"), // same dept twice
		attemptAt(mine, "d-4", "d", 50, "r", ""),             // no scenario: no dept
	} {
		if _, _, err := repo.InsertAttempt(ctx, a); err != nil {
			t.Fatalf("InsertAttempt: %v", err)
		}
	}
	if _, _, err := repo.InsertAttempt(ctx, attemptAt(theirs, "d-x", "x", 50, "r", "SCN-OR-00001")); err != nil {
		t.Fatalf("InsertAttempt: %v", err)
	}

	got, err := repo.SpokenDepartments(ctx, mine)
	if err != nil {
		t.Fatalf("SpokenDepartments: %v", err)
	}
	// Deduplicated, sorted, and only this learner's.
	if len(got) != 2 || got[0] != "ER" || got[1] != "ICU" {
		t.Errorf("departments = %v, want [ER ICU]", got)
	}
}
