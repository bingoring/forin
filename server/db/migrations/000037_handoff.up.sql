-- 환자 인수인계 노트 (v38 HandoffNotes): follow-up notes from the AI patients a learner
-- has met. One note per encounter (scenario); the note body is generated (LLM, with a
-- template fallback), and carries a reference to the follow-up scenario or the review it
-- points at.
CREATE TABLE handoff_notes (
    id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    scenario_id    text        NOT NULL,             -- the encounter this note follows up on
    kind           text        NOT NULL,             -- gratitude | followup | review
    patient_name   text        NOT NULL DEFAULT '',
    patient_sub    text        NOT NULL DEFAULT '',  -- e.g. "67y / F" or the condition
    coord          text        NOT NULL DEFAULT '',  -- where they met, e.g. "ER · TRAUMA BAY"
    body           text        NOT NULL DEFAULT '',
    ref_scenario_id text       NOT NULL DEFAULT '',  -- follow-up scenario, or the review's scenario
    reply_text     text        NOT NULL DEFAULT '',  -- the learner's one-line reply
    patient_reply  text        NOT NULL DEFAULT '',  -- the patient's reply back (LLM)
    met_at         timestamptz NOT NULL DEFAULT now(), -- when the encounter was cleared
    replied_at     timestamptz,
    read_at        timestamptz,
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, scenario_id)
);

CREATE INDEX handoff_notes_user_time ON handoff_notes (user_id, created_at DESC);
