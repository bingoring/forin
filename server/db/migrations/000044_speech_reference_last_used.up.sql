-- When a cached reference was last SERVED (cross-review I4 option c).
--
-- speech_references is a global, never-invalidated cache (business-rules R9), and
-- GET /speech/reference?text= lets any sentence — including free text a user typed or
-- said — mint a row (~320KB of audio each). Bounding who may generate (the daily cap)
-- does not bound how much stays: rows nobody opens again accumulate forever. This column
-- is what lets a cleanup tell "still in use" from "abandoned".
--
-- Maintained at most once a day per row (the repo only touches a row whose value is over
-- 24h old), so a cache hit stays a read in the common case. Existing rows start at the
-- migration time, i.e. they get a full grace period before they can look stale.
ALTER TABLE speech_references ADD COLUMN last_used_at timestamptz NOT NULL DEFAULT now();

-- The cleanup filters on this column alone.
CREATE INDEX idx_speech_references_last_used ON speech_references (last_used_at);
