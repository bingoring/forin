-- name: CreateSession :one
INSERT INTO conversation_sessions (user_id, scenario_id) VALUES ($1, $2) RETURNING id;

-- name: GetSession :one
SELECT id, user_id, scenario_id FROM conversation_sessions WHERE id = $1;

-- name: AppendTurn :exec
INSERT INTO dialogue_turns (session_id, role, content) VALUES ($1, $2, $3);

-- name: SessionHistory :many
SELECT role, content FROM dialogue_turns WHERE session_id = $1 ORDER BY created_at LIMIT $2;

-- name: LatestSessionWithTurns :one
-- The most recent session for this learner + scenario that actually has turns.
-- Sessions carry no completion flag (only started_at), so "resumable" is defined
-- by having said something — an empty session is nothing to come back to.
SELECT s.id, count(t.id)::int AS turn_count
  FROM conversation_sessions s
  JOIN dialogue_turns t ON t.session_id = s.id
 WHERE s.user_id = $1 AND s.scenario_id = $2
 GROUP BY s.id, s.started_at
 ORDER BY s.started_at DESC
 LIMIT 1;

-- name: InsertCorrection :exec
INSERT INTO correction_results (user_id, original, corrected, note, topic_tag)
VALUES ($1, $2, $3, $4, $5);

-- name: InsertReviewCard :one
INSERT INTO review_cards (user_id, source, front, back, note, topic_tag, scenario_id, context)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;

-- name: InsertCardSchedule :exec
INSERT INTO review_schedules (card_id, due_date) VALUES ($1, CURRENT_DATE);
