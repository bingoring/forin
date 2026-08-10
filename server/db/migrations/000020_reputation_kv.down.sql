ALTER TABLE user_progress
    ADD COLUMN patient_satisfaction int NOT NULL DEFAULT 50,
    ADD COLUMN peer_trust           int NOT NULL DEFAULT 50,
    ADD COLUMN emergency_response   int NOT NULL DEFAULT 50;

UPDATE user_progress p SET
    patient_satisfaction = COALESCE((SELECT value FROM user_reputation r WHERE r.user_id = p.user_id AND r.dimension = 'patient_satisfaction'), 50),
    peer_trust           = COALESCE((SELECT value FROM user_reputation r WHERE r.user_id = p.user_id AND r.dimension = 'peer_trust'), 50),
    emergency_response   = COALESCE((SELECT value FROM user_reputation r WHERE r.user_id = p.user_id AND r.dimension = 'emergency_response'), 50);

DROP TABLE IF EXISTS user_reputation;
