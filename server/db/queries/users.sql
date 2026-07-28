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
SELECT user_id, job, native_lang, target_lang, destination, target_level, onboarded FROM profiles WHERE user_id = $1;

-- name: UpsertProfile :exec
INSERT INTO profiles (user_id, job, native_lang, target_lang, destination, target_level, onboarded, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, true, now())
ON CONFLICT (user_id) DO UPDATE SET
    job = $2, native_lang = $3, target_lang = $4, destination = $5, target_level = $6,
    onboarded = true, updated_at = now();
