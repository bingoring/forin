-- name: GetUserByIdentity :one
SELECT u.id, u.status, u.created_at
FROM auth_identities ai JOIN users u ON u.id = ai.user_id
WHERE ai.provider = $1 AND ai.subject_id = $2;

-- name: CreateUser :one
INSERT INTO users (status) VALUES ($1) RETURNING id, status, created_at;

-- name: CreateIdentity :exec
INSERT INTO auth_identities (user_id, provider, subject_id, email) VALUES ($1, $2, $3, $4);

-- name: UpdateIdentityEmail :exec
UPDATE auth_identities SET email = $3 WHERE provider = $1 AND subject_id = $2;

-- name: GetUserByID :one
SELECT id, status, created_at FROM users WHERE id = $1;

-- name: GetProfile :one
SELECT user_id, job, native_lang, target_lang, destination, target_level, onboarded, equipped_title, ui_lang, display_name, avatar FROM profiles WHERE user_id = $1;

-- name: SetEquippedTitle :exec
INSERT INTO profiles (user_id, equipped_title, updated_at) VALUES ($1, $2, now())
ON CONFLICT (user_id) DO UPDATE SET equipped_title = $2, updated_at = now();

-- name: UpsertProfile :exec
INSERT INTO profiles (user_id, job, native_lang, target_lang, destination, target_level, onboarded, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, true, now())
ON CONFLICT (user_id) DO UPDATE SET
    job = $2, native_lang = $3, target_lang = $4, destination = $5, target_level = $6,
    onboarded = true, updated_at = now();

-- name: SetUILang :exec
-- Single-field patch, like SetEquippedTitle: the full UpsertProfile fills omitted
-- columns with onboarding defaults, so reusing it to save one setting would reset
-- job and languages.
INSERT INTO profiles (user_id, ui_lang, updated_at) VALUES ($1, $2, now())
ON CONFLICT (user_id) DO UPDATE SET ui_lang = $2, updated_at = now();

-- name: SetDisplayName :exec
-- Single-field patch, like SetEquippedTitle and SetUILang. Never UpsertProfile:
-- that one fills omitted columns with onboarding defaults, so saving a name
-- through it would reset job and languages.
INSERT INTO profiles (user_id, display_name, updated_at) VALUES ($1, $2, now())
ON CONFLICT (user_id) DO UPDATE SET display_name = $2, updated_at = now();

-- name: DisplayNames :many
-- Names for a set of users, in ONE query. Colleague lists render many people at
-- once, and a per-row lookup is how a list of ten becomes ten round trips. Rows
-- with no name set are omitted rather than returned blank — the caller already
-- has a fallback for "not set", and an empty string would make it choose twice.
SELECT user_id, display_name FROM profiles
WHERE user_id = ANY (@user_ids::uuid[]) AND display_name <> '';

-- name: SetAvatar :exec
-- Single-field patch, like SetDisplayName. Never UpsertProfile: that one fills the
-- columns it is not given with onboarding defaults, so saving a portrait through it
-- would reset the learner's job and languages.
INSERT INTO profiles (user_id, avatar, updated_at) VALUES ($1, $2, now())
ON CONFLICT (user_id) DO UPDATE SET avatar = $2, updated_at = now();

-- name: Avatars :many
-- Portraits for a set of users, in ONE query — the same reason DisplayNames exists:
-- a lounge feed or a colleague list draws many people at once, and a per-row lookup
-- turns a page of twenty into twenty round trips.
--
-- The NULL filter is an optimisation, not the guard: rows nobody will use should not
-- cross the wire. What actually makes "absent" mean "never chose one" is the repo,
-- which drops any row whose json does not parse — a NULL included. Both are kept,
-- and the mutation test that proved the filter alone is not load-bearing is why this
-- comment no longer claims it is.
SELECT user_id, avatar FROM profiles
WHERE user_id = ANY (@user_ids::uuid[]) AND avatar IS NOT NULL;

-- name: RecordProfileChange :exec
-- One row per ACTUAL change (the handler compares before/after and skips a no-op save).
-- The audit is what lets learning-tracks P2 partition existing history by time instead
-- of guessing which subject three weeks of review cards belonged to.
INSERT INTO profile_changes (user_id, from_job, to_job, from_lang, to_lang, from_dest, to_dest)
VALUES ($1, $2, $3, $4, $5, $6, $7);
