-- Reputation becomes per-profession key-value.
--
-- The three fixed columns encoded ONE profession's model (a nurse's patients,
-- colleagues and emergencies). A second profession would have had to either
-- reuse columns whose names lie, or get its own columns — both dead ends. The
-- dimension set now lives in code (domain/reputation.Catalog) and the store just
-- holds whatever names that catalog uses.
CREATE TABLE user_reputation (
    user_id    uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    dimension  text        NOT NULL,
    value      int         NOT NULL DEFAULT 50,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, dimension)
);

-- Carry existing standings over so nobody's history resets.
INSERT INTO user_reputation (user_id, dimension, value)
SELECT user_id, 'patient_satisfaction', patient_satisfaction FROM user_progress
UNION ALL
SELECT user_id, 'peer_trust', peer_trust FROM user_progress
UNION ALL
SELECT user_id, 'emergency_response', emergency_response FROM user_progress
ON CONFLICT (user_id, dimension) DO NOTHING;

ALTER TABLE user_progress
    DROP COLUMN patient_satisfaction,
    DROP COLUMN peer_trust,
    DROP COLUMN emergency_response;
