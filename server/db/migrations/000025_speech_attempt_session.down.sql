DROP INDEX IF EXISTS idx_speech_attempts_session;
ALTER TABLE speech_attempts DROP COLUMN session_id;
