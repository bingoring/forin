-- scenario_id says WHICH scenario an utterance belongs to; it cannot say which
-- RUN of it. The Scenario Clear screen reviews the sentences spoken in the run
-- that just ended, so replaying ER-00002 tomorrow must not drag yesterday's
-- utterances into today's result list. The conversation session is that run's
-- identity, so carry it on the attempt.
--
-- Empty string, not NULL: an attempt made outside a dialogue (review-lab
-- 따라 말하기, a drill) genuinely belongs to no session, and '' compares and
-- indexes without the three-valued-logic footguns of NULL. This matches
-- scenario_id, which already uses '' for the same reason.
ALTER TABLE speech_attempts ADD COLUMN session_id text NOT NULL DEFAULT '';

-- Partial: every row outside a dialogue shares session_id '', and indexing that
-- one enormous key group buys nothing — the result screen only ever looks up a
-- real session.
CREATE INDEX idx_speech_attempts_session ON speech_attempts (user_id, session_id)
    WHERE session_id <> '';
