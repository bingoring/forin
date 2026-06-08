-- Authored content tables. enum-ish columns (category/delivery/profession/...) are
-- NOT CHECK-constrained — allowed sets live in code (extensibility). Variable shapes
-- (tags, relations, scenario steps, effect directives) are jsonb.

CREATE TABLE content_meta (
    k text PRIMARY KEY,
    v text NOT NULL
);

CREATE TABLE departments (
    id         text PRIMARY KEY,
    profession text NOT NULL,
    ward       text NOT NULL,
    name_ko    text NOT NULL DEFAULT '',
    name_en    text NOT NULL DEFAULT '',
    color      text NOT NULL DEFAULT ''
);

CREATE TABLE events (
    id            text PRIMARY KEY,
    profession    text NOT NULL,
    title         text NOT NULL,
    ward          text NOT NULL,
    category      text NOT NULL,
    tier          int  NOT NULL,
    tags          jsonb NOT NULL DEFAULT '[]',
    delivery      text NOT NULL,
    prerequisites jsonb NOT NULL DEFAULT '[]',
    follow_ups    jsonb NOT NULL DEFAULT '[]',
    related       jsonb NOT NULL DEFAULT '[]',
    scenarios     jsonb NOT NULL DEFAULT '[]'
);
CREATE INDEX idx_events_profession ON events (profession);
CREATE INDEX idx_events_delivery ON events (delivery);

CREATE TABLE scenarios (
    id          text PRIMARY KEY,
    profession  text NOT NULL,
    event_id    text NOT NULL,
    title       text NOT NULL DEFAULT '',
    tagline     text NOT NULL DEFAULT '',
    goals       jsonb NOT NULL DEFAULT '[]',
    guardrails  jsonb NOT NULL DEFAULT '[]',
    key_phrases jsonb NOT NULL DEFAULT '[]',
    steps       jsonb NOT NULL DEFAULT '[]'
);
CREATE INDEX idx_scenarios_event ON scenarios (event_id);

CREATE TABLE quizzes (
    id         text PRIMARY KEY,
    profession text NOT NULL,
    type       text NOT NULL,
    title      text NOT NULL DEFAULT ''
);

CREATE TABLE phrases (
    id         text PRIMARY KEY,
    profession text NOT NULL,
    ko         text NOT NULL DEFAULT '',
    en         text NOT NULL DEFAULT '',
    note       text NOT NULL DEFAULT '',
    tag        text NOT NULL DEFAULT ''
);
