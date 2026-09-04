-- The home live ward shows an anonymous crowd of learners currently studying, which
-- STRANGERS can see — a different audience from share_status (accepted colleagues) — so it
-- gets its own switch. On by default (the figure carries no name), opt-out at any time.
ALTER TABLE colleague_prefs ADD COLUMN share_ward boolean NOT NULL DEFAULT true;
