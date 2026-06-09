-- Explorable department interiors (tile maps). Nested parts are jsonb
-- (read as a whole by the client map engine).
CREATE TABLE interiors (
    id           text PRIMARY KEY,
    profession   text NOT NULL,
    dept_id      text NOT NULL,
    cols         int  NOT NULL DEFAULT 0,
    rows         int  NOT NULL DEFAULT 0,
    player_start jsonb NOT NULL DEFAULT '{}',
    floor_theme  text NOT NULL DEFAULT '',
    regions      jsonb NOT NULL DEFAULT '[]',
    rooms        jsonb NOT NULL DEFAULT '[]',
    objects      jsonb NOT NULL DEFAULT '[]',
    hotspots     jsonb NOT NULL DEFAULT '[]'
);
CREATE INDEX idx_interiors_dept ON interiors (dept_id);
