-- name: CreateSession :one
INSERT INTO conversation_sessions (user_id, scenario_id) VALUES ($1, $2) RETURNING id;

-- name: GetSession :one
SELECT id, user_id, scenario_id FROM conversation_sessions WHERE id = $1;

-- name: AppendTurn :exec
INSERT INTO dialogue_turns (session_id, role, content) VALUES ($1, $2, $3);

-- name: SessionHistory :many
SELECT role, content FROM dialogue_turns WHERE session_id = $1 ORDER BY created_at LIMIT $2;

-- name: InsertCorrection :exec
INSERT INTO correction_results (user_id, original, corrected, note, topic_tag)
VALUES ($1, $2, $3, $4, $5);

-- name: InsertReviewCard :one
INSERT INTO review_cards (user_id, source, front, back, note, topic_tag)
VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;

-- name: InsertCardSchedule :exec
INSERT INTO review_schedules (card_id, due_date) VALUES ($1, CURRENT_DATE);
