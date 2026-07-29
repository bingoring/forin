CREATE TABLE daily_event_sets (
    user_id      uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    local_date   text NOT NULL,          -- yyyy-mm-dd in the user's timezone (00:00-local reset)
    scenario_ids jsonb NOT NULL,         -- ordered selected scenario ids
    created_at   timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, local_date)
);
