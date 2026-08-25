package http

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/bingoring/forin/server/internal/domain/progress"
)

func maGroups(n int) []progress.ModelAnswerGroup {
	out := make([]progress.ModelAnswerGroup, n)
	for i := range out {
		out[i] = progress.ModelAnswerGroup{
			ScenarioID:  "SCN-ER-0000" + string(rune('1'+i)),
			Title:       "scenario " + string(rune('1'+i)),
			Corrections: n - i,
			LastAt:      time.Now().Add(-time.Duration(i) * time.Hour),
		}
	}
	return out
}

func maRepo(n int, total int) *fakeReviewRepo {
	g := maGroups(n)
	cards := map[string][]progress.ModelAnswerCard{}
	for _, x := range g {
		cards[x.ScenarioID] = []progress.ModelAnswerCard{
			{Said: "I give you medicine", Model: "I'm giving you your medication", Note: "진행 중인 행위"},
		}
	}
	return &fakeReviewRepo{owned: map[string]string{}, groups: g, groupTotal: total, cards: cards}
}

func getJSON(t *testing.T, h func(http.ResponseWriter, *http.Request), path string, out any) {
	t.Helper()
	req := httptest.NewRequest(http.MethodGet, path, nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	h(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("GET %s = %d: %s", path, w.Code, w.Body.String())
	}
	if err := json.Unmarshal(w.Body.Bytes(), out); err != nil {
		t.Fatalf("decode %s: %v — body %s", path, err, w.Body.String())
	}
}

// The summary block expands the most recent scenario only, and must pay for one
// group's cards — not four groups' worth for one visible panel.
func TestModelAnswerSummaryFetchesOnlyTheExpandedGroupsCards(t *testing.T) {
	repo := maRepo(4, 12)
	ph := &progressHandler{review: repo}

	var out progress.ModelAnswerSummary
	getJSON(t, ph.modelAnswerSummary, "/me/review/model-answers/summary", &out)

	if out.Total != 12 {
		t.Errorf("total = %d, want 12", out.Total)
	}
	if len(out.Groups) != 4 {
		t.Fatalf("groups = %d, want 4", len(out.Groups))
	}
	if len(out.Groups[0].Cards) != 1 {
		t.Errorf("the most recent group was not expanded")
	}
	for i := 1; i < 4; i++ {
		if out.Groups[i].Cards != nil {
			t.Errorf("collapsed group %d shipped cards", i)
		}
	}
	if out.More != 8 {
		t.Errorf("more = %d, want 12 - 4", out.More)
	}
	if len(repo.cardCalls) != 1 || len(repo.cardCalls[0]) != 1 {
		t.Errorf("card fetches = %v; want one call for one scenario", repo.cardCalls)
	}
}

// A player with no corrections yet gets an empty block that serializes as [],
// not null — a client mapping over groups should not have to guard for both.
func TestModelAnswerSummaryEmptySerializesAsArray(t *testing.T) {
	ph := &progressHandler{review: &fakeReviewRepo{owned: map[string]string{}}}
	req := httptest.NewRequest(http.MethodGet, "/me/review/model-answers/summary", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.modelAnswerSummary(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("code = %d", w.Code)
	}
	if body := w.Body.String(); !strings.Contains(body, `"groups":[]`) {
		t.Errorf("empty summary body = %s", body)
	}
}

// Every row of the LIST is expandable, so unlike the summary each group carries
// its cards — a per-row fetch on tap makes the list feel broken on a slow network.
func TestModelAnswerListCarriesCardsOnEveryGroup(t *testing.T) {
	repo := maRepo(3, 3)
	ph := &progressHandler{review: repo}

	var out struct {
		Groups []progress.ModelAnswerGroup `json:"groups"`
		Total  int                         `json:"total"`
	}
	getJSON(t, ph.modelAnswers, "/me/review/model-answers", &out)

	if len(out.Groups) != 3 || out.Total != 3 {
		t.Fatalf("page = %d groups, total %d", len(out.Groups), out.Total)
	}
	for i, g := range out.Groups {
		if len(g.Cards) != 1 {
			t.Errorf("group %d (%s) shipped %d cards", i, g.ScenarioID, len(g.Cards))
		}
	}
	// One query for the whole page, not one per group.
	if len(repo.cardCalls) != 1 || len(repo.cardCalls[0]) != 3 {
		t.Errorf("card fetches = %v; want one call for three scenarios", repo.cardCalls)
	}
}

// ?sort= selects the sort, and anything unrecognized stays on 최신 — an unknown
// value must not silently reorder the screen.
func TestModelAnswerListSortSelection(t *testing.T) {
	for _, tc := range []struct {
		query string
		want  bool
	}{
		{"", false}, {"?sort=recent", false}, {"?sort=needs-work", true}, {"?sort=banana", false},
	} {
		repo := maRepo(1, 1)
		ph := &progressHandler{review: repo}
		var out map[string]any
		getJSON(t, ph.modelAnswers, "/me/review/model-answers"+tc.query, &out)
		if len(repo.needsWork) != 1 || repo.needsWork[0] != tc.want {
			t.Errorf("%q -> needsWorkFirst=%v, want %v", tc.query, repo.needsWork, tc.want)
		}
	}
}

// Page size is clamped, not rejected: a client bug should degrade to a bounded
// page rather than leaving the list stuck on a 400.
func TestModelAnswerListClampsPageSize(t *testing.T) {
	repo := maRepo(60, 60)
	ph := &progressHandler{review: repo}
	var out struct {
		Groups []progress.ModelAnswerGroup `json:"groups"`
	}
	getJSON(t, ph.modelAnswers, "/me/review/model-answers?limit=5000", &out)
	if len(out.Groups) != 50 {
		t.Errorf("limit=5000 returned %d groups, want the 50 clamp", len(out.Groups))
	}
}

// An offset past the end is how infinite scroll learns it has reached the bottom:
// an empty page that still serializes as [].
func TestModelAnswerListOffsetPastEndIsAnEmptyPage(t *testing.T) {
	ph := &progressHandler{review: maRepo(3, 3)}
	req := httptest.NewRequest(http.MethodGet, "/me/review/model-answers?offset=99", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.modelAnswers(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("code = %d", w.Code)
	}
	if body := w.Body.String(); !strings.Contains(body, `"groups":[]`) {
		t.Errorf("offset past end body = %s", body)
	}
}
