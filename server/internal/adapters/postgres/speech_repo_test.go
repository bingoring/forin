package postgres

import (
	"context"
	"fmt"
	"os"
	"sync"
	"testing"
	"time"

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

// installForcedPhonemeFailureTrigger installs a real (public-schema) trigger
// on speech_phoneme_scores that raises an exception when phoneme =
// '__force_fail__', so a test can force InsertAttempt's phoneme insert to
// fail without needing a real constraint violation. It self-heals a leftover
// from a prior crashed run (DROP IF EXISTS before CREATE, in addition to the
// normal t.Cleanup drop) since this is a shared, session-independent object.
func installForcedPhonemeFailureTrigger(t *testing.T, pool *pgxpool.Pool, ctx context.Context) {
	t.Helper()
	drop := func(ctx context.Context) {
		_, _ = pool.Exec(ctx, `DROP TRIGGER IF EXISTS force_phoneme_fail ON speech_phoneme_scores`)
		_, _ = pool.Exec(ctx, `DROP FUNCTION IF EXISTS pg_temp_force_phoneme_fail()`)
	}
	drop(ctx) // self-heal: a prior run that was SIGKILLed mid-test may have left this behind
	if _, err := pool.Exec(ctx, `
		CREATE FUNCTION pg_temp_force_phoneme_fail() RETURNS trigger AS $$
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
	t.Cleanup(func() { drop(context.Background()) })
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
//   - failure path: we install a throwaway trigger on speech_phoneme_scores that
//     raises an exception for one magic phoneme value (no real constraint can be
//     violated by input alone — see the comment at the trigger install below),
//     then call InsertAttempt with a word containing that phoneme. The attempt
//     row is written first in the same transaction, then the phoneme insert
//     fails and the whole transaction rolls back. We confirm the attempt row
//     never survives — i.e. a phoneme-insert failure really does undo the
//     already-written attempt row, not just its own statement.
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
	//
	// This is installed as a REAL (public-schema) trigger, not a pg_temp one:
	// pool.Exec/repo calls are multiplexed across the pgxpool's several physical
	// connections, and pg_temp objects are only visible on the backend session
	// that created them — a trigger firing on a different pooled connection
	// would see "function pg_temp_N.f does not exist". Because it's real and
	// process-crash-durable, we self-heal by dropping any leftover from a prior
	// run (e.g. the test process got SIGKILLed mid-run) before creating it, in
	// addition to the normal t.Cleanup drop.
	installForcedPhonemeFailureTrigger(t, pool, ctx)

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

// TestRetryResolvesGenuineRace is the deterministic regression test for the
// brief's "정정됨" correction #2. It does not rely on goroutine scheduling luck
// to produce a real race — it MANUFACTURES the exact race InsertAttempt's
// retry exists for:
//
//  1. A separate, UNCOMMITTED transaction directly inserts attempt_no=1 for
//     (userID, sentenceKey) and holds it open. Under READ COMMITTED, nobody
//     else can see this row yet.
//  2. A goroutine calls repo.InsertAttempt concurrently. Its internal
//     `SELECT MAX(attempt_no)` does not see the uncommitted row (same READ
//     COMMITTED rule), so it also computes attempt_no=1 and tries to insert
//     it — colliding, byte-for-byte, with step 1's uncommitted row.
//  3. Postgres cannot yet tell if that's a real conflict (step 1 might still
//     roll back), so the goroutine's INSERT blocks on the row lock rather
//     than erroring immediately. We poll pg_locks for that specific "waiting
//     on another transaction to finish" signature before proceeding, so the
//     next step is never racing against the goroutine's own scheduling.
//  4. We commit the pre-claim. Postgres unblocks the goroutine's INSERT and
//     NOW raises the real 23505 unique_violation, since attempt_no=1 is
//     genuinely taken.
//  5. InsertAttempt's retry must catch that 23505, open a FRESH transaction,
//     recompute MAX (now correctly seeing the committed attempt_no=1), and
//     land on attempt_no=2 — proving detection, MAX recomputation, and the
//     fresh-transaction requirement (a retry inside the same aborted tx would
//     fail with 25P02) all in one deterministic run.
func TestRetryResolvesGenuineRace(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	userID := speechTestUser(t, pool)
	ctx := context.Background()
	sentenceKey := "sk-genuine-race"

	preclaim, err := pool.Begin(ctx)
	if err != nil {
		t.Fatalf("begin preclaim tx: %v", err)
	}
	defer preclaim.Rollback(ctx) // no-op once committed below
	if _, err := preclaim.Exec(ctx,
		`INSERT INTO speech_attempts (user_id, sentence_key, reference_text, locale, attempt_no, overall, accuracy, fluency, completeness)
		 VALUES ($1, $2, 'x', 'en-US', 1, 1, 1, 1, 1)`,
		userID, sentenceKey); err != nil {
		t.Fatalf("preclaim attempt_no=1: %v", err)
	}

	var gotNo int
	var gotErr error
	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		_, gotNo, gotErr = repo.InsertAttempt(ctx, sampleAttempt(userID, sentenceKey))
	}()

	waitForBlockedInsert(t, pool, 3*time.Second)

	if err := preclaim.Commit(ctx); err != nil {
		t.Fatalf("commit preclaim: %v", err)
	}
	wg.Wait()

	if gotErr != nil {
		t.Fatalf("want the retry to absorb the forced 23505, got error: %v", gotErr)
	}
	if gotNo != 2 {
		t.Fatalf("want the retry to land on attempt_no=2 (the preclaimed row was 1), got %d", gotNo)
	}
}

// waitForBlockedInsert polls pg_locks for a backend waiting on another
// transaction's XID — the exact signature Postgres produces when a plain
// INSERT collides with an uncommitted row on a unique index (as opposed to
// ON CONFLICT, which would take a different, non-blocking path). This gives
// TestRetryResolvesGenuineRace a real synchronization point instead of a sleep.
func waitForBlockedInsert(t *testing.T, pool *pgxpool.Pool, timeout time.Duration) {
	t.Helper()
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		var blocked int
		err := pool.QueryRow(context.Background(),
			`SELECT count(*) FROM pg_locks WHERE NOT granted AND locktype = 'transactionid'`).Scan(&blocked)
		if err == nil && blocked > 0 {
			return
		}
		time.Sleep(5 * time.Millisecond)
	}
	t.Fatal("timed out waiting for the concurrent InsertAttempt to block on the preclaimed row")
}

// TestConcurrentAttemptsGetDistinctNumbers is a best-effort SUPPLEMENT to
// TestRetryResolvesGenuineRace above (which is the authoritative, deterministic
// proof). This one launches real concurrent callers through a start barrier
// with the pool pre-warmed (so connection dial/auth latency doesn't itself
// serialize the goroutines) to also exercise the ordinary contention path —
// but it does NOT assert that a 23505/retry actually fired internally, so a
// green run here alone would not prove the retry works; only that concurrent
// calls don't corrupt data when they happen not to collide.
//
// n=2 matches the motivating scenario (a user double-tapping "record").
// Higher fan-in was tried during development and does reproduce a residual
// failure — a single retry only guarantees success against ONE colliding
// peer, not arbitrary concurrency, matching the brief's own wording ("retried
// once... a second failure is returned as an error").
func TestConcurrentAttemptsGetDistinctNumbers(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	userID := speechTestUser(t, pool)
	ctx := context.Background()
	sentenceKey := "sk-concurrent-test"

	const n = 2
	warmPool(t, pool, n)

	var wg sync.WaitGroup
	errs := make([]error, n)
	nums := make([]int, n)
	start := make(chan struct{})
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			<-start
			_, no, err := repo.InsertAttempt(ctx, sampleAttempt(userID, sentenceKey))
			errs[i], nums[i] = err, no
		}(i)
	}
	close(start)
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

// warmPool acquires and releases n connections up front so goroutines racing
// immediately after don't have their timing skewed by lazy connection
// dial/auth — a pool that has to open a new physical connection is much
// slower than one just handing out an idle one.
func warmPool(t *testing.T, pool *pgxpool.Pool, n int) {
	t.Helper()
	conns := make([]*pgxpool.Conn, n)
	for i := 0; i < n; i++ {
		c, err := pool.Acquire(context.Background())
		if err != nil {
			t.Fatalf("warm pool: %v", err)
		}
		conns[i] = c
	}
	for _, c := range conns {
		c.Release()
	}
}

// TestReferenceRoundTrip covers the two SpeechRepo methods TestAttempt* above
// don't touch: GetReference/PutReference (business-rules R9 — one global,
// first-writer-wins row per sentence_key).
func TestReferenceRoundTrip(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewSpeechRepo(pool)
	ctx := context.Background()
	// speech_references has no user scope to isolate by, so give this run's
	// key a unique suffix to avoid colliding with rows a previous run left behind.
	sentenceKey := fmt.Sprintf("sk-reference-%d", time.Now().UnixNano())
	t.Cleanup(func() {
		_, _ = pool.Exec(context.Background(), `DELETE FROM speech_references WHERE sentence_key = $1`, sentenceKey)
	})

	if got, err := repo.GetReference(ctx, sentenceKey); err != nil {
		t.Fatalf("get before put: %v", err)
	} else if got != nil {
		t.Fatalf("want nil for a sentence_key with no reference yet, got %+v", got)
	}

	first := ports.SentenceReferenceRow{
		SentenceKey:   sentenceKey,
		ReferenceText: "The patient is stable.",
		Locale:        "en-US",
		IPA:           "ðə ˈpeɪʃənt ɪz ˈsteɪbəl",
		Words: []ports.WordScore{
			{Word: "stable", Syllables: []ports.SyllableResult{{Syllable: "sta"}, {Syllable: "ble"}}},
		},
		DurationMS: 2100,
	}
	if err := repo.PutReference(ctx, first); err != nil {
		t.Fatalf("put first: %v", err)
	}

	got, err := repo.GetReference(ctx, sentenceKey)
	if err != nil {
		t.Fatalf("get after put: %v", err)
	}
	if got == nil {
		t.Fatal("want a reference row after PutReference, got nil")
	}
	if got.ReferenceText != first.ReferenceText || got.IPA != first.IPA || got.DurationMS != first.DurationMS {
		t.Fatalf("round-trip mismatch: got %+v, want %+v", got, first)
	}
	if len(got.Words) != 1 || got.Words[0].Word != "stable" {
		t.Fatalf("want Words to round-trip through JSONB, got %+v", got.Words)
	}

	// First writer wins: a second Put for the same sentence_key must not
	// overwrite the first (ON CONFLICT DO NOTHING).
	second := first
	second.ReferenceText = "SHOULD NOT WIN"
	second.IPA = "SHOULD NOT WIN"
	second.DurationMS = 9999
	if err := repo.PutReference(ctx, second); err != nil {
		t.Fatalf("put second: %v", err)
	}
	afterSecond, err := repo.GetReference(ctx, sentenceKey)
	if err != nil {
		t.Fatalf("get after second put: %v", err)
	}
	if afterSecond.ReferenceText != first.ReferenceText || afterSecond.DurationMS != first.DurationMS {
		t.Fatalf("want the first Put to win (ON CONFLICT DO NOTHING), got %+v", afterSecond)
	}
}
