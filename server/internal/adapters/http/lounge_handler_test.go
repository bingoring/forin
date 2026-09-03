package http

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/bingoring/forin/server/internal/domain/lounge"
)

const loungeUID = "11111111-2222-3333-4444-555555555555"

// A LoungeRepo that records what the handler asked it for. Reached only through
// the handler, which is the point: these tests are about the HTTP layer's
// decisions (parse, clamp, rate-limit, status codes), not about SQL.
type fakeLounge struct {
	feedBefore *time.Time
	feedLimit  int
	posts      []lounge.Post

	created    *lounge.Draft
	postsToday int

	cheerOn bool
	total   int

	reported []string
	reason   string
}

func (f *fakeLounge) Create(_ context.Context, _ string, d lounge.Draft) (string, error) {
	f.created = &d
	return "post-1", nil
}

func (f *fakeLounge) Feed(_ context.Context, _ string, before *time.Time, limit int) ([]lounge.Post, error) {
	f.feedBefore, f.feedLimit = before, limit
	return f.posts, nil
}

func (f *fakeLounge) PostsToday(context.Context, string) (int, error) { return f.postsToday, nil }

func (f *fakeLounge) Delete(context.Context, string, string) error { return nil }

func (f *fakeLounge) SetCheer(_ context.Context, _, _ string, on bool) (int, error) {
	f.cheerOn = on
	return f.total, nil
}

func (f *fakeLounge) Report(_ context.Context, postID, _, reason string) error {
	f.reported = append(f.reported, postID)
	f.reason = reason
	return nil
}

func loungeReq(method, target, body string) *http.Request {
	req := httptest.NewRequest(method, target, strings.NewReader(body))
	return req.WithContext(context.WithValue(req.Context(), userIDKey, loungeUID))
}

func TestLoungeFeedClampsAndDefaultsTheLimit(t *testing.T) {
	for _, tc := range []struct {
		query string
		want  int
	}{
		{"", lounge.FeedPage},
		{"?limit=5", 5},
		{"?limit=0", lounge.FeedPage},
		{"?limit=-3", lounge.FeedPage},
		{"?limit=9999", lounge.MaxFeedPage},
		{"?limit=abc", lounge.FeedPage},
	} {
		repo := &fakeLounge{}
		h := &loungeHandler{repo: repo}
		rec := httptest.NewRecorder()
		h.feed(rec, loungeReq(http.MethodGet, "/lounge"+tc.query, ""))
		if rec.Code != http.StatusOK {
			t.Fatalf("%q: status %d", tc.query, rec.Code)
		}
		if repo.feedLimit != tc.want {
			t.Errorf("%q: repo asked for limit %d, want %d", tc.query, repo.feedLimit, tc.want)
		}
	}
}

func TestLoungeFeedRejectsAnUnparsableCursor(t *testing.T) {
	repo := &fakeLounge{}
	h := &loungeHandler{repo: repo}
	rec := httptest.NewRecorder()
	h.feed(rec, loungeReq(http.MethodGet, "/lounge?before=yesterday", ""))

	// Serving page 1 for a broken cursor makes an infinite scroll loop forever,
	// so this must be a 400 and the repo must not be reached at all.
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status %d, want 400", rec.Code)
	}
	if repo.feedLimit != 0 {
		t.Error("repo was queried despite the bad cursor")
	}
}

func TestLoungeFeedPassesTheCursorThroughAndReportsHasMore(t *testing.T) {
	full := make([]lounge.Post, lounge.FeedPage)
	repo := &fakeLounge{posts: full}
	h := &loungeHandler{repo: repo}
	rec := httptest.NewRecorder()
	h.feed(rec, loungeReq(http.MethodGet, "/lounge?before=2026-01-02T03:04:05Z", ""))

	if repo.feedBefore == nil || !repo.feedBefore.Equal(time.Date(2026, 1, 2, 3, 4, 5, 0, time.UTC)) {
		t.Fatalf("cursor reached the repo as %v", repo.feedBefore)
	}
	var out loungeFeedResp
	if err := json.Unmarshal(rec.Body.Bytes(), &out); err != nil {
		t.Fatal(err)
	}
	if !out.HasMore {
		t.Error("a full page must report hasMore, or the client stops paging")
	}
}

func TestLoungeEmptyFeedSerialisesAsAnArray(t *testing.T) {
	h := &loungeHandler{repo: &fakeLounge{posts: nil}}
	rec := httptest.NewRecorder()
	h.feed(rec, loungeReq(http.MethodGet, "/lounge", ""))

	// `null` would make posts.map() throw on the client instead of showing the
	// empty state.
	if !strings.Contains(rec.Body.String(), `"posts":[]`) {
		t.Fatalf("body %s", rec.Body.String())
	}
}

func TestLoungeCreateRejectsAnEmptyBodyBeforeTouchingTheRepo(t *testing.T) {
	repo := &fakeLounge{}
	h := &loungeHandler{repo: repo}
	rec := httptest.NewRecorder()
	h.create(rec, loungeReq(http.MethodPost, "/lounge", `{"body":"   "}`))

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status %d, want 400", rec.Code)
	}
	if repo.created != nil {
		t.Error("a whitespace-only post was stored")
	}
}

func TestLoungeCreateStoresTheCleanedDraft(t *testing.T) {
	repo := &fakeLounge{}
	h := &loungeHandler{repo: repo}
	rec := httptest.NewRecorder()
	h.create(rec, loungeReq(http.MethodPost, "/lounge",
		`{"kind":"question","body":"  how do I hand over?  ","tags":["#ER","ER"]}`))

	if rec.Code != http.StatusCreated {
		t.Fatalf("status %d body %s", rec.Code, rec.Body.String())
	}
	if repo.created == nil {
		t.Fatal("nothing was stored")
	}
	if repo.created.Body != "how do I hand over?" {
		t.Errorf("body reached the repo untrimmed: %q", repo.created.Body)
	}
	if len(repo.created.Tags) != 1 || repo.created.Tags[0] != "ER" {
		t.Errorf("tags reached the repo as %v, want one hash-free ER", repo.created.Tags)
	}
	if repo.created.Kind != lounge.KindQuestion {
		t.Errorf("kind %q", repo.created.Kind)
	}
}

func TestLoungeCreateEnforcesTheDailyLimitServerSide(t *testing.T) {
	repo := &fakeLounge{postsToday: lounge.PostsPerDay}
	h := &loungeHandler{repo: repo}
	rec := httptest.NewRecorder()
	h.create(rec, loungeReq(http.MethodPost, "/lounge", `{"body":"one more"}`))

	if rec.Code != http.StatusTooManyRequests {
		t.Fatalf("status %d, want 429", rec.Code)
	}
	if repo.created != nil {
		t.Error("the post was stored past the daily limit")
	}
}

func TestLoungeCheerDefaultsOnAndTakesBackWithOnFalse(t *testing.T) {
	for _, tc := range []struct {
		query string
		want  bool
	}{{"", true}, {"?on=true", true}, {"?on=false", false}} {
		repo := &fakeLounge{total: 3}
		h := &loungeHandler{repo: repo}
		rec := httptest.NewRecorder()
		h.cheer(rec, loungeReq(http.MethodPost, "/lounge/p1/cheer"+tc.query, ""))

		var out loungeCheerResp
		if err := json.Unmarshal(rec.Body.Bytes(), &out); err != nil {
			t.Fatal(err)
		}
		if repo.cheerOn != tc.want || out.Cheered != tc.want {
			t.Errorf("%q: repo got on=%v, response said %v, want %v", tc.query, repo.cheerOn, out.Cheered, tc.want)
		}
		if out.Cheers != 3 {
			t.Errorf("%q: total %d, want the repo's 3", tc.query, out.Cheers)
		}
	}
}

func TestLoungeReportAcceptsAMissingBody(t *testing.T) {
	repo := &fakeLounge{}
	h := &loungeHandler{repo: repo}
	rec := httptest.NewRecorder()
	req := loungeReq(http.MethodPost, "/lounge/p1/report", "")
	req.SetPathValue("id", "p1")
	h.report(rec, req)

	// A reader who taps 신고 without typing a reason still filed a report.
	if rec.Code != http.StatusNoContent {
		t.Fatalf("status %d body %s", rec.Code, rec.Body.String())
	}
	if len(repo.reported) != 1 || repo.reported[0] != "p1" {
		t.Errorf("reported %v", repo.reported)
	}
}
