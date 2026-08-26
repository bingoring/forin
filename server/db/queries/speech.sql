-- name: InsertSpeechAttempt :one
-- attempt_no is numbered inside the same statement so two concurrent requests
-- cannot claim the same number (an application-side counter would race). A
-- unique-violation retry (23505) still lives in the repo for when two racing
-- requests compute the same MAX and both try to insert it.
INSERT INTO speech_attempts (
    user_id, sentence_key, reference_text, locale, attempt_no,
    recognized, overall, accuracy, fluency, completeness, prosody,
    duration_ms, words, scenario_id, review_card_id, origin, session_id
)
SELECT $1, $2, $3, $4,
       COALESCE(MAX(attempt_no), 0) + 1,
       $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
  FROM speech_attempts
 WHERE user_id = $1 AND sentence_key = $2
RETURNING id, attempt_no;

-- name: InsertPhonemeScore :exec
INSERT INTO speech_phoneme_scores (attempt_id, user_id, phoneme, accuracy)
VALUES ($1, $2, $3, $4);

-- name: ListSpeechAttempts :many
SELECT id, attempt_no, overall, accuracy, fluency, completeness, prosody,
       duration_ms, recognized, words, created_at
  FROM speech_attempts
 WHERE user_id = $1 AND sentence_key = $2
 ORDER BY attempt_no DESC
 LIMIT $3;

-- name: GetSpeechReference :one
-- Deliberately does NOT select audio_wav: this is read on every practice-
-- screen mount (GET /speech/reference) and the segmentation is all that path
-- needs. Fetching a ~320KB blob on every such call would be pure waste — see
-- GetSpeechReferenceAudio, used only by the audio route.
SELECT sentence_key, reference_text, locale, ipa, words, duration_ms
  FROM speech_references WHERE sentence_key = $1;

-- name: GetSpeechReferenceAudio :one
SELECT audio_wav FROM speech_references WHERE sentence_key = $1;

-- name: PutSpeechReference :exec
INSERT INTO speech_references (sentence_key, reference_text, locale, ipa, words, duration_ms, audio_wav)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (sentence_key) DO NOTHING;

-- name: UpdateSpeechReferenceAudio :exec
-- Backfills a row that already exists but has no audio yet (review round 2,
-- Important 1) — the empty-audio guard makes this first-writer-wins, same as
-- PutSpeechReference's ON CONFLICT DO NOTHING: a race between two backfills
-- just means one Synthesize call goes unused, never corruption.
UPDATE speech_references SET audio_wav = $2
 WHERE sentence_key = $1 AND audio_wav = '';

-- name: ListSessionSpeech :many
-- Every sentence the player spoke aloud during ONE dialogue run, oldest first,
-- for the Scenario Clear review list.
--
-- DISTINCT ON collapses re-tries: saying the same sentence three times in one
-- session is one sentence with the score they finally reached, not three rows —
-- the list is a review of what they said, not of how many attempts it took
-- (attempt_no carries that). The outer ORDER BY restores conversation order,
-- which DISTINCT ON had to break to pick the newest per key.
--
-- That order is by when the sentence was FIRST said, not by the retained row's
-- created_at. Ordering by the retained row put a re-tried sentence wherever its
-- LAST attempt landed: say A, say B, fix A, and the review listed B before A —
-- caught by the Postgres-backed test, and invisible to any fake repo. The window
-- function is evaluated before DISTINCT ON, so MIN sees every attempt in the
-- session, not just the surviving one.
SELECT sentence_key, reference_text, recognized, overall, accuracy, fluency,
       completeness, attempt_no, created_at
  FROM (
    SELECT DISTINCT ON (sentence_key)
           sentence_key, reference_text, recognized, overall, accuracy, fluency,
           completeness, attempt_no, created_at,
           MIN(created_at) OVER (PARTITION BY sentence_key) AS first_said
      FROM speech_attempts
     WHERE user_id = $1 AND session_id = $2
     ORDER BY sentence_key, attempt_no DESC
  ) newest
 ORDER BY first_said;

-- name: SpeakBands :one
-- Score-band distribution over the player's CURRENT standing on each sentence:
-- one row per sentence_key at its newest attempt, bucketed 60↓ / 60–79 / 80+.
--
-- Counting attempts instead of sentences would let one heavily-drilled sentence
-- dominate the distribution, and would keep punishing the player for the early
-- bad tries they have since fixed.
WITH latest AS (
    SELECT DISTINCT ON (sentence_key) sentence_key, overall
      FROM speech_attempts
     WHERE user_id = $1
     ORDER BY sentence_key, attempt_no DESC
)
SELECT COUNT(*)::int                                            AS total,
       COUNT(*) FILTER (WHERE overall < 60)::int                AS low,
       COUNT(*) FILTER (WHERE overall >= 60 AND overall < 80)::int AS mid,
       COUNT(*) FILTER (WHERE overall >= 80)::int               AS high
  FROM latest;

-- name: ListSpeakSentencesWeak :many
-- 약한 순: worst standing first. Ties break by recency so the sentence they hit
-- most recently is the one they are shown first.
--
-- `total` rides along on every row so the list's "N문장 중 M개 표시" needs no
-- second round trip per page.
WITH latest AS (
    SELECT DISTINCT ON (sentence_key)
           sentence_key, reference_text, recognized, overall, accuracy, fluency,
           completeness, scenario_id, origin, attempt_no, created_at
      FROM speech_attempts
     WHERE user_id = $1
       -- '' means every department. Filtering HERE rather than on the client is what
       -- makes `total` and the paging honest: a client-side filter reported "3 of 128"
       -- for "3 matched among the pages loaded so far", and pulled more in as the
       -- learner scrolled.
       AND (sqlc.arg(dept)::text = '' OR split_part(scenario_id, '-', 2) = sqlc.arg(dept)::text)
     ORDER BY sentence_key, attempt_no DESC
)
SELECT sentence_key, reference_text, recognized, overall, accuracy, fluency,
       completeness, scenario_id, origin, attempt_no, created_at,
       (SELECT COUNT(*)::int FROM latest) AS total
  FROM latest
 ORDER BY overall, created_at DESC
 LIMIT sqlc.arg(lim) OFFSET sqlc.arg(off);

-- name: ListSpeakSentencesRecent :many
-- 최신: newest first. Same projection as ListSpeakSentencesWeak so one repo
-- mapper serves both sorts.
WITH latest AS (
    SELECT DISTINCT ON (sentence_key)
           sentence_key, reference_text, recognized, overall, accuracy, fluency,
           completeness, scenario_id, origin, attempt_no, created_at
      FROM speech_attempts
     WHERE user_id = $1
       -- '' means every department. Filtering HERE rather than on the client is what
       -- makes `total` and the paging honest: a client-side filter reported "3 of 128"
       -- for "3 matched among the pages loaded so far", and pulled more in as the
       -- learner scrolled.
       AND (sqlc.arg(dept)::text = '' OR split_part(scenario_id, '-', 2) = sqlc.arg(dept)::text)
     ORDER BY sentence_key, attempt_no DESC
)
SELECT sentence_key, reference_text, recognized, overall, accuracy, fluency,
       completeness, scenario_id, origin, attempt_no, created_at,
       (SELECT COUNT(*)::int FROM latest) AS total
  FROM latest
 ORDER BY created_at DESC
 LIMIT sqlc.arg(lim) OFFSET sqlc.arg(off);

-- name: SpokenDepartments :many
-- Every department the learner has spoken in, derived from the scenario id prefix
-- (SCN-ER-00002 -> ER).
--
-- Sent with the list so the department chips are COMPLETE. Deriving them from the
-- loaded pages instead made chips appear as the learner scrolled, and filtering to
-- one showed only its rows among the pages fetched so far — the rest arrived later,
-- which reads as the filter being broken.
SELECT DISTINCT split_part(scenario_id, '-', 2) AS dept
  FROM speech_attempts
 WHERE user_id = $1 AND scenario_id LIKE 'SCN-%-%'
 ORDER BY dept;
