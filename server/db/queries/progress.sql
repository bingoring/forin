-- name: GetProgress :one
SELECT xp, level, rank, patient_satisfaction, peer_trust, emergency_response, streak_current, streak_longest
FROM user_progress WHERE user_id = $1;

-- name: InsertAttempt :exec
INSERT INTO scenario_attempts (user_id, scenario_id, state, score, cleared_at)
VALUES ($1, $2, 'cleared', $3, now());

-- name: UpsertProgressOnAttempt :exec
INSERT INTO user_progress (user_id, xp, level, streak_current, streak_longest, last_active_date)
VALUES ($1, $2, 1 + ($2 / 100), 1, 1, $3)
ON CONFLICT (user_id) DO UPDATE SET
    xp    = user_progress.xp + $2,
    level = 1 + ((user_progress.xp + $2) / 100),
    streak_current = CASE
        WHEN user_progress.last_active_date = $3 THEN user_progress.streak_current
        WHEN user_progress.last_active_date = $3 - 1 THEN user_progress.streak_current + 1
        ELSE 1 END,
    streak_longest = GREATEST(user_progress.streak_longest, CASE
        WHEN user_progress.last_active_date = $3 THEN user_progress.streak_current
        WHEN user_progress.last_active_date = $3 - 1 THEN user_progress.streak_current + 1
        ELSE 1 END),
    last_active_date = $3,
    updated_at = now();

-- name: DueCards :many
SELECT c.id, c.source, c.front, c.back, c.note, c.topic_tag, c.mastery_pips, c.favorite,
       s.ease, s.interval_days, s.reps, s.due_date, c.scenario_id, c.context
FROM review_cards c JOIN review_schedules s ON s.card_id = c.id
WHERE c.user_id = $1 AND s.due_date <= $2 ORDER BY s.due_date LIMIT $3;

-- name: GetCardForUser :one
SELECT c.id, c.source, c.front, c.back, c.note, c.topic_tag, c.mastery_pips, c.favorite,
       s.ease, s.interval_days, s.reps, s.due_date
FROM review_cards c JOIN review_schedules s ON s.card_id = c.id
WHERE c.user_id = $1 AND c.id = $2;

-- name: UpdateSchedule :exec
UPDATE review_schedules SET ease = $2, interval_days = $3, reps = $4, due_date = $5, updated_at = now()
WHERE card_id = $1;

-- name: UpdateCardMastery :exec
UPDATE review_cards SET mastery_pips = $2 WHERE id = $1;

-- name: FoundMissions :many
SELECT mission_id FROM hidden_mission_progress WHERE user_id = $1 ORDER BY found_at;

-- name: RecordMission :exec
INSERT INTO hidden_mission_progress (user_id, mission_id) VALUES ($1, $2)
ON CONFLICT (user_id, mission_id) DO NOTHING;
