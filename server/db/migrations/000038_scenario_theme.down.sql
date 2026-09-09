DROP INDEX IF EXISTS idx_scenarios_theme;
ALTER TABLE scenarios DROP COLUMN IF EXISTS collab_with;
ALTER TABLE scenarios DROP COLUMN IF EXISTS theme;
