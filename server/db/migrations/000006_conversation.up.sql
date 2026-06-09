-- LLM conversation sessions/turns + AI correction results.
CREATE TABLE conversation_sessions (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    scenario_id text NOT NULL,
    started_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sessions_user ON conversation_sessions (user_id);

CREATE TABLE dialogue_turns (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL REFERENCES conversation_sessions (id) ON DELETE CASCADE,
    role       text NOT NULL,           -- user | assistant
    content    text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_turns_session ON dialogue_turns (session_id, created_at);

CREATE TABLE correction_results (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    original   text NOT NULL,
    corrected  text NOT NULL,
    note       text NOT NULL DEFAULT '',
    topic_tag  text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
);
