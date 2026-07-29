CREATE TABLE hidden_mission_progress (
    user_id    uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    mission_id text NOT NULL,
    found_at   timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, mission_id)
);
