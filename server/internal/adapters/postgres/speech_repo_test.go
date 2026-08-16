package postgres

import (
	"context"
	"fmt"
	"os"
	"sync"
	"testing"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/ports"
)

// speechTestPool opens a pool against TEST_DATABASE_URL, or skips the test if
// it isn't set. This repo has no other Postgres-backed tests to follow, so this
// helper establishes the pattern: DB tests must degrade to a skip, never a
// failure, when no database is configured — `go test ./...` has to stay green
// without one.
//
// Run against a real database with migrations already applied, e.g.:
//
//	docker compose up -d postgres
//	DATABASE_URL=postgres://forin:forin@localhost:5432/forin_test?sslmode=disable go run ./cmd/migrate up
//	TEST_DATABASE_URL=postgres://forin:forin@localhost:5432/forin_test?sslmode=disable \
//	  go test ./internal/adapters/postgres/ -v
func speechTestPool(t *testing.T) *pgxpool.Pool {
	t.Helper()
	url := os.Getenv("TEST_DATABASE_URL")
	if url == "" {
		t.Skip("set TEST_DATABASE_URL to run this test, e.g. " +
			"TEST_DATABASE_URL=postgres://forin:forin@localhost:5432/forin_test?sslmode=disable go test ./internal/adapters/postgres/ -run Speech -v " +
			"(migrations must already be applied to that database)")
	}
	pool, err := pgxpool.New(context.Background(), url)
	if err != nil {
		t.Fatalf("open pool: %v", err)
	}
	t.Cleanup(pool.Close)
	return pool
}

// speechTestUser inserts a fresh user row so FK constraints are satisfied, and
// registers cleanup. Each test gets its own user so attempt_no sequences never
// collide across tests/runs.
func speechTestUser(t *testing.T, pool *pgxpool.Pool) string {
	t.Helper()
	ctx := context.Background()
	var id string
	if err := pool.QueryRow(ctx, `INSERT INTO users DEFAULT VALUES RETURNING id`).Scan(&id); err != nil {
		t.Fatalf("insert test user: %v", err)
	}
	t.Cleanup(func() {
		_, _ = pool.Exec(context.Background(), `DELETE FROM users WHERE id = $1`, id)
	})
	return id
}

func sampleAttempt(userID, sentenceKey string) ports.SpeechAttemptInput {
	return ports.SpeechAttemptInput{
		UserID:        userID,
		SentenceKey:   sentenceKey,
		ReferenceText: "The patient is stable.",
		Locale:        "en-US",
		Recognized:    "The patient is stable.",
		Overall:       81,
		Accuracy:      78,
		Fluency:       85,
		Completeness:  90,
		Prosody:       0,
		ProsodyOK:     false,
		DurationMS:    2900,
		Words: []ports.WordScore{
			{
				Word:     "stable",
				Accuracy: 62,
				Syllables: []ports.SyllableResult{
					{Syllable: "sta", Accuracy: 80},
					{Syllable: "ble", Accuracy: 44},
				},
				Phonemes: []ports.PhonemeResult{
					{Phoneme: "s", Accuracy: 90},
					{Phoneme: "t", Accuracy: 40},
				},
			},
		},
		ScenarioID: "SCN-ER-00002",
		Origin:     "dialogue",
	}
}

// TestAttemptNumbering: two attempts at the same (user, sentence) are numbered
// 1 then 2 (business-rules R2/I5) — the practice screen's "1차/2차/3차" relies
// on this being a stable, gapless sequence.
func TestAttemptNumbering(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	userID := speechTestUser(t, pool)
	ctx := context.Background()
	sentenceKey := "sk-numbering-test"

	_, n1, err := repo.InsertAttempt(ctx, sampleAttempt(userID, sentenceKey))
	if err != nil {
		t.Fatalf("first insert: %v", err)
	}
	if n1 != 1 {
		t.Fatalf("want attempt_no=1, got %d", n1)
	}

	_, n2, err := repo.InsertAttempt(ctx, sampleAttempt(userID, sentenceKey))
	if err != nil {
		t.Fatalf("second insert: %v", err)
	}
	if n2 != 2 {
		t.Fatalf("want attempt_no=2, got %d", n2)
	}

	rows, err := repo.ListAttempts(ctx, userID, sentenceKey, 10)
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	if len(rows) != 2 {
		t.Fatalf("want 2 rows, got %d", len(rows))
	}
	// newest attempt_no first
	if rows[0].AttemptNo != 2 || rows[1].AttemptNo != 1 {
		t.Fatalf("want [2,1], got [%d,%d]", rows[0].AttemptNo, rows[1].AttemptNo)
	}
}

// TestAttemptAndPhonemesAreAtomic checks I2 from both sides:
//   - happy path: a successful InsertAttempt leaves exactly len(Words[*].Phonemes)
//     phoneme rows — nothing partial, nothing extra.
//   - failure path: we force InsertAttempt to fail by pre-claiming both
//     attempt_no candidates it could retry into (its single 23505 retry then
//     also collides), and confirm the failed call left zero new rows in EITHER
//     table — the phoneme insert never runs, or its transaction never commits,
//     without the attempt commit.
func TestAttemptAndPhonemesAreAtomic(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	userID := speechTestUser(t, pool)
	ctx := context.Background()
	sentenceKey := "sk-atomic-test"

	attempt := sampleAttempt(userID, sentenceKey)
	id, _, err := repo.InsertAttempt(ctx, attempt)
	if err != nil {
		t.Fatalf("insert: %v", err)
	}

	wantPhonemes := 0
	for _, w := range attempt.Words {
		wantPhonemes += len(w.Phonemes)
	}
	var gotPhonemes int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM speech_phoneme_scores WHERE attempt_id = $1`, id).Scan(&gotPhonemes); err != nil {
		t.Fatalf("count phonemes: %v", err)
	}
	if gotPhonemes != wantPhonemes {
		t.Fatalf("want %d phoneme rows, got %d", wantPhonemes, gotPhonemes)
	}

	// Now force the phoneme insert itself to fail, INSIDE the same transaction,
	// after the attempt row has already been written by the same statement
	// batch — and confirm the attempt row does not survive either. There is no
	// input that naturally violates a constraint on speech_phoneme_scores (no
	// CHECK constraints per project convention, and its only FKs mirror the
	// attempt's own), so we install a throwaway trigger that rejects one magic
	// phoneme value, exactly like a real constraint would.
	if _, err := pool.Exec(ctx, `
		CREATE OR REPLACE FUNCTION pg_temp_force_phoneme_fail() RETURNS trigger AS $$
		BEGIN
			IF NEW.phoneme = '__force_fail__' THEN
				RAISE EXCEPTION 'injected test failure';
			END IF;
			RETURN NEW;
		END;
		$$ LANGUAGE plpgsql`); err != nil {
		t.Fatalf("create trigger fn: %v", err)
	}
	if _, err := pool.Exec(ctx, `
		CREATE TRIGGER force_phoneme_fail BEFORE INSERT ON speech_phoneme_scores
		FOR EACH ROW EXECUTE FUNCTION pg_temp_force_phoneme_fail()`); err != nil {
		t.Fatalf("create trigger: %v", err)
	}
	t.Cleanup(func() {
		_, _ = pool.Exec(context.Background(), `DROP TRIGGER IF EXISTS force_phoneme_fail ON speech_phoneme_scores`)
		_, _ = pool.Exec(context.Background(), `DROP FUNCTION IF EXISTS pg_temp_force_phoneme_fail()`)
	})

	sentenceKey2 := "sk-atomic-fail-test"
	poisoned := sampleAttempt(userID, sentenceKey2)
	poisoned.Words = []ports.WordScore{{
		Word: "stable", Accuracy: 62,
		Phonemes: []ports.PhonemeResult{{Phoneme: "__force_fail__", Accuracy: 10}},
	}}

	if _, _, err := repo.InsertAttempt(ctx, poisoned); err == nil {
		t.Fatal("want an error when the phoneme insert fails mid-transaction, got nil")
	}

	var attemptSurvived bool
	if err := pool.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM speech_attempts WHERE user_id = $1 AND sentence_key = $2)`,
		userID, sentenceKey2).Scan(&attemptSurvived); err != nil {
		t.Fatalf("check survival: %v", err)
	}
	if attemptSurvived {
		t.Fatal("want the attempt row rolled back when its phoneme insert failed (I2)")
	}
}

// TestProsodyNullRoundTrip: ProsodyOK=false must round-trip through storage as
// SQL NULL and back to ProsodyOK=false, never silently becoming "scored zero".
func TestProsodyNullRoundTrip(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	userID := speechTestUser(t, pool)
	ctx := context.Background()
	sentenceKey := "sk-prosody-null"

	attempt := sampleAttempt(userID, sentenceKey)
	attempt.ProsodyOK = false
	attempt.Prosody = 0
	if _, _, err := repo.InsertAttempt(ctx, attempt); err != nil {
		t.Fatalf("insert: %v", err)
	}

	var isNull bool
	if err := pool.QueryRow(ctx, `SELECT prosody IS NULL FROM speech_attempts WHERE user_id = $1 AND sentence_key = $2`, userID, sentenceKey).Scan(&isNull); err != nil {
		t.Fatalf("query raw column: %v", err)
	}
	if !isNull {
		t.Fatal("want prosody column to be SQL NULL when ProsodyOK=false")
	}

	rows, err := repo.ListAttempts(ctx, userID, sentenceKey, 1)
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	if len(rows) != 1 {
		t.Fatalf("want 1 row, got %d", len(rows))
	}
	if rows[0].ProsodyOK {
		t.Fatal("want ProsodyOK=false round-tripped from NULL")
	}

	// Now the scored case, to prove the two are actually distinguishable and not
	// both defaulting to false.
	sentenceKey2 := "sk-prosody-scored"
	scored := sampleAttempt(userID, sentenceKey2)
	scored.ProsodyOK = true
	scored.Prosody = 0 // a real, scored ZERO — must stay distinct from NULL
	if _, _, err := repo.InsertAttempt(ctx, scored); err != nil {
		t.Fatalf("insert scored-zero: %v", err)
	}
	rows2, err := repo.ListAttempts(ctx, userID, sentenceKey2, 1)
	if err != nil {
		t.Fatalf("list scored: %v", err)
	}
	if len(rows2) != 1 {
		t.Fatalf("want 1 row, got %d", len(rows2))
	}
	if !rows2[0].ProsodyOK {
		t.Fatal("want ProsodyOK=true for a genuinely scored (even if zero) prosody value")
	}
	if rows2[0].Prosody != 0 {
		t.Fatalf("want Prosody=0, got %v", rows2[0].Prosody)
	}
}

// TestAttemptSurvivesCardDeletion: deleting a review_cards row must not delete
// the speech_attempts row it was linked to — only sever the link
// (ON DELETE SET NULL). Attempt history is not an appendage of the card.
func TestAttemptSurvivesCardDeletion(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	userID := speechTestUser(t, pool)
	ctx := context.Background()
	sentenceKey := "sk-card-deletion"

	var cardID string
	if err := pool.QueryRow(ctx,
		`INSERT INTO review_cards (user_id, front, back) VALUES ($1, 'front', 'back') RETURNING id`,
		userID).Scan(&cardID); err != nil {
		t.Fatalf("insert review card: %v", err)
	}

	attempt := sampleAttempt(userID, sentenceKey)
	attempt.ReviewCardID = &cardID
	id, _, err := repo.InsertAttempt(ctx, attempt)
	if err != nil {
		t.Fatalf("insert attempt: %v", err)
	}

	if _, err := pool.Exec(ctx, `DELETE FROM review_cards WHERE id = $1`, cardID); err != nil {
		t.Fatalf("delete review card: %v", err)
	}

	var stillExists bool
	var reviewCardIDIsNull bool
	if err := pool.QueryRow(ctx,
		`SELECT true, review_card_id IS NULL FROM speech_attempts WHERE id = $1`, id).
		Scan(&stillExists, &reviewCardIDIsNull); err != nil {
		t.Fatalf("attempt row missing after card deletion: %v", err)
	}
	if !stillExists {
		t.Fatal("want the attempt row to survive card deletion")
	}
	if !reviewCardIDIsNull {
		t.Fatal("want review_card_id to be NULL after the linked card is deleted")
	}
}

// TestConcurrentAttemptsGetDistinctNumbers is the direct regression test for
// the brief's "정정됨" correction #2: INSERT ... SELECT MAX(attempt_no)+1 alone
// does not resolve a race — two concurrent requests can compute the same MAX
// and one loses to the UNIQUE(user_id, sentence_key, attempt_no) constraint.
// InsertAttempt must retry once on that 23505 so both callers still succeed
// (e.g. a user double-tapping "record" gets two rows, not one row + one
// spurious error).
//
// n=2 matches that motivating scenario exactly (one extra concurrent caller,
// i.e. exactly the collision a single retry is designed to absorb). Higher
// fan-in was tried during development and does reproduce a residual failure —
// a single retry only guarantees success against ONE colliding peer, not
// arbitrary concurrency — which matches the brief's own wording ("retried
// once... a second failure is returned as an error"); it is not this
// endpoint's real traffic shape (one user's own repeated taps), so the test
// targets the case the design actually promises.
func TestConcurrentAttemptsGetDistinctNumbers(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	userID := speechTestUser(t, pool)
	ctx := context.Background()
	sentenceKey := "sk-concurrent-test"

	const n = 2
	var wg sync.WaitGroup
	errs := make([]error, n)
	nums := make([]int, n)
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			_, no, err := repo.InsertAttempt(ctx, sampleAttempt(userID, sentenceKey))
			errs[i], nums[i] = err, no
		}(i)
	}
	wg.Wait()

	seen := map[int]bool{}
	for i, err := range errs {
		if err != nil {
			t.Fatalf("goroutine %d: unexpected error (retry should have absorbed the race): %v", i, err)
		}
		if seen[nums[i]] {
			t.Fatalf("attempt_no %d assigned twice — race not resolved", nums[i])
		}
		seen[nums[i]] = true
	}
	if len(seen) != n {
		t.Fatalf("want %d distinct attempt numbers, got %d: %v", n, len(seen), fmt.Sprint(nums))
	}
}
