-- Leaving a role-play can mean "throw this away", not just "step out".
--
-- A flag rather than deleting the rows: study time is derived from dialogue_turns
-- (progress_repo's convSeconds), so removing them would retroactively erase minutes the
-- learner actually spent. Discarding is about what gets offered back to them, not about
-- unmaking the past.
ALTER TABLE conversation_sessions ADD COLUMN discarded_at timestamptz;

-- Only ever read as "is it null", and only for one learner's newest session per scenario.
CREATE INDEX IF NOT EXISTS idx_conv_sessions_live
  ON conversation_sessions (user_id, scenario_id, started_at DESC)
  WHERE discarded_at IS NULL;
