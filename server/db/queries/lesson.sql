-- name: UpsertLessonStepClear :exec
-- Finishing a step again keeps the first time it was finished, but takes the newest
-- detail: the words missed on the latest run are the ones to bring back.
INSERT INTO lesson_step_clears (user_id, scenario_id, step, detail) VALUES ($1, $2, $3, $4)
ON CONFLICT (user_id, scenario_id, step) DO UPDATE SET detail = EXCLUDED.detail;

-- name: ListLessonStepClears :many
SELECT step, detail FROM lesson_step_clears WHERE user_id = $1 AND scenario_id = $2;

-- name: HasWordCard :one
-- A word the learner found confusing is filed once, however many times they say so.
SELECT EXISTS (
    SELECT 1 FROM review_cards WHERE user_id = $1 AND source = 'word' AND back = $2
)::bool;
