-- name: UpsertLessonStepClear :exec
-- Idempotent: finishing a step twice keeps the first time it was finished.
INSERT INTO lesson_step_clears (user_id, scenario_id, step) VALUES ($1, $2, $3)
ON CONFLICT (user_id, scenario_id, step) DO NOTHING;

-- name: ListLessonStepClears :many
SELECT step FROM lesson_step_clears WHERE user_id = $1 AND scenario_id = $2;

-- name: HasWordCard :one
-- A word the learner found confusing is filed once, however many times they say so.
SELECT EXISTS (
    SELECT 1 FROM review_cards WHERE user_id = $1 AND source = 'word' AND back = $2
)::bool;
