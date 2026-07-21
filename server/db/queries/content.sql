-- name: GetContentMeta :one
SELECT v FROM content_meta WHERE k = $1;

-- name: UpsertContentMeta :exec
INSERT INTO content_meta (k, v) VALUES ($1, $2)
ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v;

-- name: ListDepartments :many
SELECT id, profession, ward, name_ko, name_en, color FROM departments
WHERE ($1 = '' OR profession = $1 OR profession = 'common') ORDER BY id;

-- name: GetInterior :one
SELECT id, profession, dept_id, cols, rows, player_start, floor_theme, regions, rooms, objects, hotspots, collision
FROM interiors WHERE id = $1;

-- name: ListEvents :many
SELECT id, profession, title, ward, category, tier, tags, delivery, prerequisites, follow_ups, related, scenarios
FROM events WHERE ($1 = '' OR profession = $1 OR profession = 'common') ORDER BY tier, id;

-- name: TodaysBoard :many
SELECT id, profession, title, ward, category, tier, tags, delivery, prerequisites, follow_ups, related, scenarios
FROM events WHERE delivery IN ('daily_pool', 'both') AND ($1 = '' OR profession = $1 OR profession = 'common')
ORDER BY tier, id LIMIT $2;

-- name: GetScenario :one
SELECT id, profession, event_id, title, tagline, persona, goals, guardrails, key_phrases, steps, briefing
FROM scenarios WHERE id = $1;

-- name: ListBoardScenarios :many
SELECT s.id, s.title, s.tagline, s.briefing, s.persona
FROM scenarios s JOIN events e ON s.event_id = e.id
WHERE e.delivery IN ('daily_pool', 'both') AND ($1 = '' OR e.profession = $1 OR e.profession = 'common')
ORDER BY s.id;

-- name: DeleteDepartments :exec
DELETE FROM departments;
-- name: DeleteInteriors :exec
DELETE FROM interiors;
-- name: DeleteEvents :exec
DELETE FROM events;
-- name: DeleteScenarios :exec
DELETE FROM scenarios;
-- name: DeleteQuizzes :exec
DELETE FROM quizzes;
-- name: DeletePhrases :exec
DELETE FROM phrases;

-- name: InsertDepartment :exec
INSERT INTO departments (id, profession, ward, name_ko, name_en, color) VALUES ($1, $2, $3, $4, $5, $6);

-- name: InsertInterior :exec
INSERT INTO interiors (id, profession, dept_id, cols, rows, player_start, floor_theme, regions, rooms, objects, hotspots, collision)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);

-- name: InsertEvent :exec
INSERT INTO events (id, profession, title, ward, category, tier, tags, delivery, prerequisites, follow_ups, related, scenarios)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);

-- name: InsertScenario :exec
INSERT INTO scenarios (id, profession, event_id, title, tagline, persona, goals, guardrails, key_phrases, steps, briefing)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);

-- name: GetQuiz :one
SELECT id, profession, type, title, content FROM quizzes WHERE id = $1;

-- name: InsertQuiz :exec
INSERT INTO quizzes (id, profession, type, title, content) VALUES ($1, $2, $3, $4, $5);

-- name: InsertPhrase :exec
INSERT INTO phrases (id, profession, ko, en, note, tag) VALUES ($1, $2, $3, $4, $5, $6);
