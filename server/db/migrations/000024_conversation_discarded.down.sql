DROP INDEX IF EXISTS idx_conv_sessions_live;
ALTER TABLE conversation_sessions DROP COLUMN IF EXISTS discarded_at;
