-- forin initial schema: accounts/identities/profiles.
-- enum-ish fields (provider, job, ...) are intentionally NOT CHECK-constrained —
-- allowed sets live in code for extensibility.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    status     text NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE auth_identities (
    user_id    uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    provider   text NOT NULL,
    subject_id text NOT NULL,
    email      text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (provider, subject_id)
);
CREATE INDEX idx_auth_identities_user ON auth_identities (user_id);

CREATE TABLE profiles (
    user_id     uuid PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    job         text NOT NULL DEFAULT 'nurse',
    native_lang text NOT NULL DEFAULT 'ko',
    destination text NOT NULL DEFAULT 'us',
    en_level    text NOT NULL DEFAULT '',
    updated_at  timestamptz NOT NULL DEFAULT now()
);
