package postgres

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/bingoring/forin/server/internal/domain/lounge"
)

// The three things about the lounge that only exist in SQL. None of them can be
// observed from a fake: the cheer counter is a cached column kept in step by a
// transaction, the cursor is a WHERE clause, and a soft-deleted post has to
// vanish from the feed while its row stays for reports.

func TestCheeringTwiceCountsOnce(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewLoungeRepo(pool)
	ctx := context.Background()
	author := speechTestUser(t, pool)
	reader := speechTestUser(t, pool)

	id, err := repo.Create(ctx, author, lounge.Draft{Kind: lounge.KindTalk, Body: "첫 출근"})
	if err != nil {
		t.Fatalf("Create: %v", err)
	}

	total, err := repo.SetCheer(ctx, id, reader, true)
	if err != nil || total != 1 {
		t.Fatalf("first cheer: total=%d err=%v", total, err)
	}
	// A double tap inserts nothing, so the counter must not move — otherwise one
	// reader can run the number up by holding the button.
	total, err = repo.SetCheer(ctx, id, reader, true)
	if err != nil || total != 1 {
		t.Fatalf("second cheer: total=%d err=%v, want it unchanged at 1", total, err)
	}
	// And taking it back returns to zero, once.
	if total, err = repo.SetCheer(ctx, id, reader, false); err != nil || total != 0 {
		t.Fatalf("uncheer: total=%d err=%v", total, err)
	}
	if total, err = repo.SetCheer(ctx, id, reader, false); err != nil || total != 0 {
		t.Fatalf("uncheer again: total=%d err=%v, want it to stay 0", total, err)
	}

	// The reader's own state comes back on the feed row, which is what paints the
	// button filled or hollow.
	posts, err := repo.Feed(ctx, reader, nil, 10)
	if err != nil {
		t.Fatalf("Feed: %v", err)
	}
	mine := findPost(t, posts, id)
	if mine.Cheered {
		t.Error("the feed still says this reader cheered")
	}
	if mine.Mine {
		t.Error("somebody else's post came back marked mine")
	}
	if _, err := repo.SetCheer(ctx, id, reader, true); err != nil {
		t.Fatal(err)
	}
	posts, _ = repo.Feed(ctx, reader, nil, 10)
	if !findPost(t, posts, id).Cheered {
		t.Error("the feed does not report the reader's own cheer")
	}
}

func TestFeedPagesBackwardsFromTheCursor(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewLoungeRepo(pool)
	ctx := context.Background()
	author := speechTestUser(t, pool)

	for _, body := range []string{"one", "two", "three"} {
		if _, err := repo.Create(ctx, author, lounge.Draft{Kind: lounge.KindTalk, Body: body}); err != nil {
			t.Fatal(err)
		}
		// now() is per-statement, so without this the three rows can share a
		// timestamp and "newest first" has nothing to order by.
		time.Sleep(2 * time.Millisecond)
	}

	first, err := repo.Feed(ctx, author, nil, 2)
	if err != nil {
		t.Fatalf("Feed: %v", err)
	}
	if len(first) != 2 || first[0].Body != "three" || first[1].Body != "two" {
		t.Fatalf("page 1 = %v", bodies(first))
	}
	if !first[0].Mine {
		t.Error("the author's own post is not marked mine")
	}

	next, err := repo.Feed(ctx, author, &first[1].CreatedAt, 2)
	if err != nil {
		t.Fatalf("Feed(before): %v", err)
	}
	// Strictly older: the cursor row itself must not come back, or an infinite
	// scroll repeats the boundary post forever.
	for _, p := range next {
		if p.Body == "two" || p.Body == "three" {
			t.Fatalf("page 2 repeated a row already seen: %v", bodies(next))
		}
	}
	if len(next) == 0 || next[0].Body != "one" {
		t.Fatalf("page 2 = %v", bodies(next))
	}
}

func TestDeletingHidesThePostButKeepsTheRow(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewLoungeRepo(pool)
	ctx := context.Background()
	author := speechTestUser(t, pool)
	stranger := speechTestUser(t, pool)

	id, err := repo.Create(ctx, author, lounge.Draft{Kind: lounge.KindQuestion, Body: "인수인계 표현?"})
	if err != nil {
		t.Fatal(err)
	}

	// Somebody else's delete is refused, and refused distinguishably from a post
	// that isn't there — the handler answers 403 vs 404 off this.
	if err := repo.Delete(ctx, id, stranger); !errors.Is(err, lounge.ErrNotAuthor) {
		t.Fatalf("stranger's delete: %v, want ErrNotAuthor", err)
	}
	if err := repo.Delete(ctx, "00000000-0000-0000-0000-000000000000", author); !errors.Is(err, pgx.ErrNoRows) {
		t.Fatalf("missing post: %v, want ErrNoRows", err)
	}
	if err := repo.Delete(ctx, id, author); err != nil {
		t.Fatalf("author's delete: %v", err)
	}

	for _, p := range mustFeed(t, repo, author) {
		if p.ID == id {
			t.Fatal("a deleted post is still in the feed")
		}
	}
	// The row survives: a deleted post is still the evidence for a report filed
	// against it.
	var deleted *time.Time
	if err := pool.QueryRow(ctx, `SELECT deleted_at FROM lounge_posts WHERE id = $1`, id).Scan(&deleted); err != nil {
		t.Fatalf("the row was hard-deleted: %v", err)
	}
	if deleted == nil {
		t.Error("deleted_at was not stamped")
	}
	// And a report against it is still recordable and still deduped per reader.
	if err := repo.Report(ctx, id, stranger, "spam"); err != nil {
		t.Fatalf("Report: %v", err)
	}
	if err := repo.Report(ctx, id, stranger, "spam again"); err != nil {
		t.Fatalf("second Report: %v, want it to be idempotent", err)
	}
	var reports int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM lounge_reports WHERE post_id = $1`, id).Scan(&reports); err != nil {
		t.Fatal(err)
	}
	if reports != 1 {
		t.Errorf("%d reports stored, want 1", reports)
	}
}

func TestSharedPostKeepsItsQuotedTurns(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewLoungeRepo(pool)
	ctx := context.Background()
	author := speechTestUser(t, pool)

	draft, err := lounge.Draft{
		Kind:       lounge.KindShare,
		Body:       "이 표현 좋았어요",
		Tags:       []string{"#ER", "handoff"},
		ScenarioID: "SCN-ER-00002",
		Snippet: &lounge.Snippet{Title: "인수인계", Turns: []lounge.Turn{
			{Index: 0, Role: "npc", Text: "What's the story with bed 3?"},
			{Index: 1, Role: "user", Text: "He came in with chest pain at 0400."},
		}},
	}.Clean()
	if err != nil {
		t.Fatalf("Clean: %v", err)
	}
	id, err := repo.Create(ctx, author, draft)
	if err != nil {
		t.Fatalf("Create: %v", err)
	}

	got := findPost(t, mustFeed(t, repo, author), id)
	if got.Snippet == nil || len(got.Snippet.Turns) != 2 {
		t.Fatalf("the quoted turns did not survive the round trip: %+v", got.Snippet)
	}
	if got.Snippet.Turns[1].Text != "He came in with chest pain at 0400." {
		t.Errorf("turn text = %q", got.Snippet.Turns[1].Text)
	}
	if got.ScenarioID != "SCN-ER-00002" {
		t.Errorf("scenarioId = %q", got.ScenarioID)
	}
	if len(got.Tags) != 2 || got.Tags[0] != "ER" {
		t.Errorf("tags = %v", got.Tags)
	}
}

func TestPostsTodayCountsThisAuthorOnly(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewLoungeRepo(pool)
	ctx := context.Background()
	author := speechTestUser(t, pool)
	other := speechTestUser(t, pool)

	for i := 0; i < 3; i++ {
		if _, err := repo.Create(ctx, author, lounge.Draft{Kind: lounge.KindTalk, Body: "x"}); err != nil {
			t.Fatal(err)
		}
	}
	if _, err := repo.Create(ctx, other, lounge.Draft{Kind: lounge.KindTalk, Body: "y"}); err != nil {
		t.Fatal(err)
	}

	n, err := repo.PostsToday(ctx, author)
	if err != nil {
		t.Fatalf("PostsToday: %v", err)
	}
	// The rate limit is per author: counting everybody's posts would lock the
	// whole lounge out as soon as the app has twenty users.
	if n != 3 {
		t.Fatalf("PostsToday = %d, want 3", n)
	}
}

func mustFeed(t *testing.T, repo *LoungeRepo, reader string) []lounge.Post {
	t.Helper()
	posts, err := repo.Feed(context.Background(), reader, nil, 50)
	if err != nil {
		t.Fatalf("Feed: %v", err)
	}
	return posts
}

func findPost(t *testing.T, posts []lounge.Post, id string) lounge.Post {
	t.Helper()
	for _, p := range posts {
		if p.ID == id {
			return p
		}
	}
	t.Fatalf("post %s is not in the feed (%d rows)", id, len(posts))
	return lounge.Post{}
}

func bodies(posts []lounge.Post) []string {
	out := make([]string, len(posts))
	for i, p := range posts {
		out[i] = p.Body
	}
	return out
}
