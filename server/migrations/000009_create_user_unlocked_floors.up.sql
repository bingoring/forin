CREATE TABLE user_unlocked_floors (
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id   UUID        NOT NULL REFERENCES curriculum_modules(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, module_id)
);

CREATE INDEX idx_user_unlocked_floors_user ON user_unlocked_floors(user_id);
