-- 오늘의 호출 (v27 PagingCall): one pager-style urgent call per user per local day.
--
-- Server-side because the rules are "once a day", "expires if missed" and "+40 XP" —
-- all three are claims about what already happened, and a client that owned them could
-- farm the bonus by reinstalling or by moving its clock.
--
-- Keyed by (user_id, local_date) like daily_event_sets: the reset is 00:00 in the
-- learner's own timezone, and the row IS the record that today's call was issued.
CREATE TABLE daily_pages (
    user_id     uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    local_date  text NOT NULL,          -- yyyy-mm-dd in the user's timezone
    scenario_id text NOT NULL,          -- what 지금 응답 enters
    -- When the call was first SHOWN, not when the day started: the countdown has to
    -- start from the moment the learner could first see it, or a call issued at 23:50
    -- would arrive already dead.
    issued_at   timestamptz NOT NULL DEFAULT now(),
    answered_at timestamptz,            -- NULL = still open (or missed)
    PRIMARY KEY (user_id, local_date)
);
