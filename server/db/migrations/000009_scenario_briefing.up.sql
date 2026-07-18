-- Briefing = pre-dialogue scenario card content (situation, difficulty, skills,
-- rewards, entry requirements, dept chrome) rendered by the briefing screen.
-- jsonb so it stays extensible without further migrations. Optional: empty '{}'
-- for scenarios authored before the briefing screen (no regression).
ALTER TABLE scenarios ADD COLUMN briefing jsonb NOT NULL DEFAULT '{}';
