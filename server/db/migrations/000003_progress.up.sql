-- User progress/growth + spaced-repetition review state.
-- enum-ish columns (rank/state/source/topic) are code-side allowed sets (no CHECK).

CREATE TABLE user_progress (
    user_id              uuid PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    xp                   int  NOT NULL DEFAULT 0,
    level                int  NOT NULL DEFAULT 1,
    rank                 text NOT NULL DEFAULT 'learner',
    patient_satisfaction int  NOT NULL DEFAULT 50,
    peer_trust           int  NOT NULL DEFAULT 50,
    emergency_response   int  NOT NULL DEFAULT 50,
    streak_current       int  NOT NULL DEFAULT 0,
    streak_longest       int  NOT NULL DEFAULT 0,
    last_active_date     date,
    updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE scenario_attempts (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    scenario_id     text NOT NULL,
    content_version text NOT NULL DEFAULT '',
    state           text NOT NULL DEFAULT 'cleared',
    score           int  NOT NULL DEFAULT 0,
    started_at      timestamptz NOT NULL DEFAULT now(),
    cleared_at      timestamptz
);
CREATE INDEX idx_attempts_user ON scenario_attempts (user_id);

CREATE TABLE review_cards (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    source       text NOT NULL DEFAULT 'correction',
    front        text NOT NULL,
    back         text NOT NULL,
    note         text NOT NULL DEFAULT '',
    topic_tag    text NOT NULL DEFAULT '',
    mastery_pips int  NOT NULL DEFAULT 0,
    favorite     bool NOT NULL DEFAULT false,
    created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_cards_user ON review_cards (user_id);

CREATE TABLE review_schedules (
    card_id       uuid PRIMARY KEY REFERENCES review_cards (id) ON DELETE CASCADE,
    ease          real NOT NULL DEFAULT 2.5,
    interval_days int  NOT NULL DEFAULT 0,
    reps          int  NOT NULL DEFAULT 0,
    due_date      date NOT NULL DEFAULT CURRENT_DATE,
    updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_schedules_due ON review_schedules (due_date);
