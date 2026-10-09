DROP INDEX IF EXISTS idx_speech_references_last_used;
ALTER TABLE speech_references DROP COLUMN last_used_at;
