CREATE TABLE vocabulary (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_en   TEXT NOT NULL,
  part_of_speech TEXT NOT NULL,
  domain         TEXT NOT NULL,
  cefr_level     TEXT,
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vocab_domain ON vocabulary(domain);
CREATE UNIQUE INDEX idx_vocab_canonical ON vocabulary(canonical_en);
