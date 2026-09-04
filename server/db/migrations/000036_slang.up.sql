-- Which slang cards a learner has collected (은어 도감, v38). Card ids come from the
-- content deck (content/slang/*.yaml), not a table — the deck grows by content deploy.
CREATE TABLE slang_collected (
    user_id      uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    card_id      text        NOT NULL,
    collected_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, card_id)
);

-- The deck screen reads a user's cards newest-first, and the "one per day" rule looks at
-- the most recent collect.
CREATE INDEX slang_collected_user_time ON slang_collected (user_id, collected_at DESC);
