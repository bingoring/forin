-- Persona = the AI's conversation character (role/age/personality/mood) for
-- realistic role-play. Content field on the scenario.
ALTER TABLE scenarios ADD COLUMN persona jsonb NOT NULL DEFAULT '{}';
