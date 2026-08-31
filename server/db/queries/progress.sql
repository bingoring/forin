-- name: GetProgress :one
-- Unused by any caller (ProgressRepo.GetProgress reads user_progress directly and
-- joins user_reputation for standings) but kept generatable. patient_satisfaction/
-- peer_trust/emergency_response were dropped in 000020_reputation_kv — this query
-- had gone stale (sqlc generate failed) until this fix.
SELECT xp, level, rank, streak_current, streak_longest
FROM user_progress WHERE user_id = $1;

-- name: InsertAttempt :exec
-- state is 'cleared' (passed, counts as 완료) or 'attempted' (engaged but below the
-- pass score). grade is the 0..100 AI score (NULL for direct/legacy attempts).
-- cleared_at is set only on a real clear.
INSERT INTO scenario_attempts (user_id, scenario_id, state, score, grade, cleared_at)
VALUES ($1, $2, $3, $4, $5, CASE WHEN $3 = 'cleared' THEN now() ELSE NULL END);

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

-- name: ListModelAnswerScenariosRecent :many
-- 시나리오 모범답안, grouped by the scenario the corrections came from
-- (04_SCREENS ⑨). One row per scenario, newest activity first.
--
-- source <> 'grade' is the whole point of the grouping: a 'grade' card is a
-- "you could have said this" suggestion for a sentence the learner never spoke,
-- so it has no 내 답변 to strike through and does not belong in a block built on
-- 내 답변 vs 모범. Everything else is a real correction (the same rule the app's
-- faceOf() applies when drawing a card).
--
-- scenario_id <> '' drops cards made outside a scenario: they cannot be grouped
-- under one, and a group keyed on '' would collect unrelated cards together.
--
-- `total` rides along on every row so the list's count needs no second query.
WITH grouped AS (
    SELECT scenario_id,
           COUNT(*)::int  AS corrections,
           MAX(created_at)::timestamptz AS last_at
      FROM review_cards
     WHERE user_id = $1 AND scenario_id <> '' AND source <> 'grade'
     GROUP BY scenario_id
)
SELECT g.scenario_id, g.corrections, g.last_at,
       COALESCE(s.title, '') AS title,
       (SELECT COUNT(*)::int FROM grouped) AS total
  FROM grouped g
  LEFT JOIN scenarios s ON s.id = g.scenario_id
 ORDER BY g.last_at DESC
 LIMIT $2 OFFSET $3;

-- name: ListModelAnswerScenariosNeedsWork :many
-- 개선 필요: most corrections first. Ties break by recency so two scenarios with
-- the same count are still in a stable, meaningful order. Same projection as the
-- recent sort so one repo mapper serves both.
WITH grouped AS (
    SELECT scenario_id,
           COUNT(*)::int  AS corrections,
           MAX(created_at)::timestamptz AS last_at
      FROM review_cards
     WHERE user_id = $1 AND scenario_id <> '' AND source <> 'grade'
     GROUP BY scenario_id
)
SELECT g.scenario_id, g.corrections, g.last_at,
       COALESCE(s.title, '') AS title,
       (SELECT COUNT(*)::int FROM grouped) AS total
  FROM grouped g
  LEFT JOIN scenarios s ON s.id = g.scenario_id
 ORDER BY g.corrections DESC, g.last_at DESC
 LIMIT $2 OFFSET $3;

-- name: ListModelAnswerCards :many
-- The cards for a page of scenarios, fetched in ONE query rather than per group:
-- a page of ten groups would otherwise be ten round trips, and the block's most
-- recent group alone would be a second one.
SELECT scenario_id, front, back, note, created_at
  FROM review_cards
 WHERE user_id = $1 AND scenario_id = ANY(sqlc.arg(scenario_ids)::text[]) AND source <> 'grade'
 ORDER BY scenario_id, created_at;

-- name: GetDailyPage :one
SELECT user_id, local_date, scenario_id, issued_at, accepted_at, answered_at
  FROM daily_pages WHERE user_id = $1 AND local_date = $2;

-- name: InsertDailyPage :one
-- DO NOTHING then RETURNING would give no row on a conflict, so the caller could not
-- tell "already issued" from "insert failed". DO UPDATE on its own key returns the
-- existing row untouched, which is exactly "give me today's call, issuing it if this is
-- the first look".
INSERT INTO daily_pages (user_id, local_date, scenario_id)
VALUES ($1, $2, $3)
ON CONFLICT (user_id, local_date) DO UPDATE SET local_date = daily_pages.local_date
RETURNING user_id, local_date, scenario_id, issued_at, accepted_at, answered_at;

-- name: AcceptDailyPage :one
-- Taking the call. Idempotent: accepting twice keeps the first timestamp, because the
-- "did they actually go?" check below is measured from it.
UPDATE daily_pages SET accepted_at = COALESCE(accepted_at, now())
 WHERE user_id = $1 AND local_date = $2
RETURNING scenario_id, accepted_at;

-- name: CompleteDailyPageIfAttempted :one
-- Pays the call off, but ONLY once the learner actually started the scenario it points
-- at, after accepting it. Tapping 지금 응답 and walking straight back out is not
-- answering a call.
--
-- The WHERE answered_at IS NULL is what makes the bonus payable exactly once: a second
-- run returns no row, and the caller then knows not to award XP again.
UPDATE daily_pages SET answered_at = now()
 WHERE daily_pages.user_id = $1 AND daily_pages.local_date = $2
   AND accepted_at IS NOT NULL
   AND answered_at IS NULL
   AND EXISTS (
     SELECT 1 FROM scenario_attempts a
      WHERE a.user_id = daily_pages.user_id
        AND a.scenario_id = daily_pages.scenario_id
        AND a.started_at >= daily_pages.accepted_at
   )
RETURNING scenario_id;

-- name: AddBonusXP :one
-- A bare XP grant, for rewards that are not a scenario attempt. RecordAttempt is the
-- only other XP path and it logs an attempt row, which would put a phantom run in the
-- learner's history.
UPDATE user_progress SET xp = xp + $2, updated_at = now()
 WHERE user_id = $1
RETURNING xp;
