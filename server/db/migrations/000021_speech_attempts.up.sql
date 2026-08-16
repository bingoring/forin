-- Speech attempts are append-only history: the 1st/2nd/3rd try at one sentence
-- each get a row so the practice screen can show progress. They live apart from
-- review_cards because drill utterances (minimal pairs, field sentences) have no
-- card, and a card is a single mutable SM-2 row while this is a time series.
CREATE TABLE speech_attempts (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    sentence_key   text NOT NULL,
    reference_text text NOT NULL,
    locale         text NOT NULL,
    attempt_no     int  NOT NULL,
    recognized     text NOT NULL DEFAULT '',
    overall        real NOT NULL,
    accuracy       real NOT NULL,
    fluency        real NOT NULL,
    completeness   real NOT NULL,
    -- NULL means the scorer did not assess prosody for this locale, which is
    -- different from scoring zero. The UI hides the row rather than showing 0.
    prosody        real,
    duration_ms    int  NOT NULL DEFAULT 0,
    words          jsonb NOT NULL DEFAULT '[]'::jsonb,
    scenario_id    text NOT NULL DEFAULT '',
    -- Kept when the card is deleted: the attempt happened regardless.
    review_card_id uuid REFERENCES review_cards (id) ON DELETE SET NULL,
    origin         text NOT NULL DEFAULT 'freeform',
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, sentence_key, attempt_no)
);
CREATE INDEX idx_speech_attempts_user_sentence ON speech_attempts (user_id, sentence_key, attempt_no DESC);

-- One row per phoneme observation so the (future) drill screen can aggregate a
-- 2-week window without scanning the words JSONB.
CREATE TABLE speech_phoneme_scores (
    attempt_id uuid NOT NULL REFERENCES speech_attempts (id) ON DELETE CASCADE,
    user_id    uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    phoneme    text NOT NULL,
    accuracy   real NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_speech_phonemes_user_time ON speech_phoneme_scores (user_id, created_at DESC);

-- Canonical breakdown of a sentence, derived once (TTS -> assess) and shared by
-- every user: the practice screen needs IPA before any recording exists.
CREATE TABLE speech_references (
    sentence_key   text PRIMARY KEY,
    reference_text text NOT NULL,
    locale         text NOT NULL,
    ipa            text NOT NULL DEFAULT '',
    words          jsonb NOT NULL DEFAULT '[]'::jsonb,
    duration_ms    int  NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now()
);
