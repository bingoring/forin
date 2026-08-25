package postgres

import (
	"context"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/ports"
)

// card inserts one review card for a user, at a source and scenario.
func maCard(t *testing.T, repo *ProgressRepo, userID, scenario, source, said, model string) {
	t.Helper()
	if _, err := repo.CreateCard(context.Background(), ports.NewReviewCard{
		UserID: userID, Source: source, Front: said, Back: model, Note: "왜냐하면",
		TopicTag: "ER · 표현", ScenarioID: scenario,
	}); err != nil {
		t.Fatalf("CreateCard: %v", err)
	}
}

// The grouping has three rules that only exist in SQL, and all three are the
// difference between a correct block and a misleading one.
func TestListModelAnswerScenariosGroupsAndFilters(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	maCard(t, repo, uid, "SCN-ER-00002", "correction", "I give you medicine", "I'm giving you your medication")
	maCard(t, repo, uid, "SCN-ER-00002", "correction", "Where pain?", "Where does it hurt?")
	maCard(t, repo, uid, "SCN-NICU-00101", "correction", "Baby is fine", "The infant is stable")
	// A 'grade' card is a suggestion for a sentence never spoken: it has no
	// 내 답변 to strike through, so it must not appear in a 내 답변 vs 모범 block.
	maCard(t, repo, uid, "SCN-ER-00002", "grade", "meaning of a phrase", "the phrase")
	// A card made outside a scenario cannot be grouped under one; grouping on ''
	// would collect unrelated cards into one fake scenario.
	maCard(t, repo, uid, "", "correction", "loose card", "fixed")

	groups, total, err := repo.ListModelAnswerScenarios(ctx, uid, false, 20, 0)
	if err != nil {
		t.Fatalf("ListModelAnswerScenarios: %v", err)
	}
	if total != 2 || len(groups) != 2 {
		t.Fatalf("got %d groups (total %d), want 2 — 'grade' and scenario-less cards must be excluded: %+v", len(groups), total, groups)
	}
	byID := map[string]progress.ModelAnswerGroup{}
	for _, g := range groups {
		byID[g.ScenarioID] = g
	}
	// Two corrections, not three: the 'grade' card in the same scenario is out.
	if got := byID["SCN-ER-00002"].Corrections; got != 2 {
		t.Errorf("SCN-ER-00002 corrections = %d, want 2", got)
	}
	if got := byID["SCN-NICU-00101"].Corrections; got != 1 {
		t.Errorf("SCN-NICU-00101 corrections = %d, want 1", got)
	}
}

// 개선 필요 orders by how much needs fixing; 최신 by recency. They must actually
// differ, or one of the two segments is a lie.
func TestListModelAnswerScenariosSorts(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	// "few" is written LAST (so it is the most recent) but has the FEWEST
	// corrections — the two sorts therefore disagree, which is the point.
	maCard(t, repo, uid, "SCN-MANY-1", "correction", "a", "A")
	maCard(t, repo, uid, "SCN-MANY-1", "correction", "b", "B")
	maCard(t, repo, uid, "SCN-MANY-1", "correction", "c", "C")
	maCard(t, repo, uid, "SCN-FEW-1", "correction", "d", "D")

	recent, _, err := repo.ListModelAnswerScenarios(ctx, uid, false, 20, 0)
	if err != nil {
		t.Fatalf("recent: %v", err)
	}
	if len(recent) != 2 || recent[0].ScenarioID != "SCN-FEW-1" {
		t.Errorf("최신 order = %v", ids(recent))
	}

	needs, _, err := repo.ListModelAnswerScenarios(ctx, uid, true, 20, 0)
	if err != nil {
		t.Fatalf("needs-work: %v", err)
	}
	if len(needs) != 2 || needs[0].ScenarioID != "SCN-MANY-1" {
		t.Errorf("개선 필요 order = %v", ids(needs))
	}
}

func ids(gs []progress.ModelAnswerGroup) []string {
	out := make([]string, 0, len(gs))
	for _, g := range gs {
		out = append(out, g.ScenarioID)
	}
	return out
}

// Paging, the unpaged total, and the empty page that ends infinite scroll.
func TestListModelAnswerScenariosPaging(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	for _, s := range []string{"SCN-P-1", "SCN-P-2", "SCN-P-3"} {
		maCard(t, repo, uid, s, "correction", "said", "model")
	}
	page, total, err := repo.ListModelAnswerScenarios(ctx, uid, false, 2, 0)
	if err != nil {
		t.Fatalf("page 1: %v", err)
	}
	if len(page) != 2 || total != 3 {
		t.Errorf("page 1 = %d rows, total %d (want 2 / 3)", len(page), total)
	}
	tail, _, err := repo.ListModelAnswerScenarios(ctx, uid, false, 20, 99)
	if err != nil {
		t.Fatalf("offset past end: %v", err)
	}
	if len(tail) != 0 {
		t.Errorf("offset past the end returned %d rows", len(tail))
	}
}

// The cards query serves a whole page in one round trip, keyed by scenario, and
// stays inside the caller's own data.
func TestListModelAnswerCardsIsBatchedAndScopedToTheUser(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	mine := speechTestUser(t, pool)
	theirs := speechTestUser(t, pool)
	ctx := context.Background()

	maCard(t, repo, mine, "SCN-B-1", "correction", "my line", "my fix")
	maCard(t, repo, mine, "SCN-B-2", "correction", "other line", "other fix")
	maCard(t, repo, mine, "SCN-B-2", "grade", "suggestion", "phrase")
	maCard(t, repo, theirs, "SCN-B-1", "correction", "their line", "their fix")

	got, err := repo.ListModelAnswerCards(ctx, mine, []string{"SCN-B-1", "SCN-B-2"})
	if err != nil {
		t.Fatalf("ListModelAnswerCards: %v", err)
	}
	if len(got["SCN-B-1"]) != 1 || got["SCN-B-1"][0].Said != "my line" {
		t.Errorf("SCN-B-1 = %+v — another user's card leaked, or mine is missing", got["SCN-B-1"])
	}
	// 'grade' is excluded here too, or the expanded panel would show a card with
	// nothing struck through.
	if len(got["SCN-B-2"]) != 1 {
		t.Errorf("SCN-B-2 = %d cards, want 1 (the 'grade' card excluded)", len(got["SCN-B-2"]))
	}
	// An empty ask must not be a query at all, and must not be a nil map.
	empty, err := repo.ListModelAnswerCards(ctx, mine, nil)
	if err != nil || empty == nil || len(empty) != 0 {
		t.Errorf("empty ask = %v, %v", empty, err)
	}
}
