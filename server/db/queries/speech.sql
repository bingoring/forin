-- name: InsertSpeechAttempt :one
-- attempt_no is numbered inside the same statement so two concurrent requests
-- cannot claim the same number (an application-side counter would race). A
-- unique-violation retry (23505) still lives in the repo for when two racing
-- requests compute the same MAX and both try to insert it.
INSERT INTO speech_attempts (
    user_id, sentence_key, reference_text, locale, attempt_no,
    recognized, overall, accuracy, fluency, completeness, prosody,
    duration_ms, words, scenario_id, review_card_id, origin
)
SELECT $1, $2, $3, $4,
       COALESCE(MAX(attempt_no), 0) + 1,
       $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
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
