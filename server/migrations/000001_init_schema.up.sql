-- forin initial schema migration
-- Creates all tables for the MVP application.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. professions
-- ============================================================
CREATE TABLE professions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(50) UNIQUE NOT NULL,
  icon_url    VARCHAR(500),
  is_active   BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- 2. users
-- ============================================================
CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 VARCHAR(255) UNIQUE NOT NULL,
  password_hash         VARCHAR(255),
  display_name          VARCHAR(100) NOT NULL,
  avatar_url            VARCHAR(500),
  profession_id         UUID REFERENCES professions(id),
  target_country        VARCHAR(50),
  language_level        VARCHAR(30) DEFAULT 'beginner',
  daily_goal            VARCHAR(20) DEFAULT 'regular',
  current_xp            INTEGER DEFAULT 0,
  total_xp              INTEGER DEFAULT 0,
  current_level         INTEGER DEFAULT 1,
  gems                  INTEGER DEFAULT 0,
  catnip                INTEGER DEFAULT 0,
  lives                 INTEGER DEFAULT 5,
  lives_last_refill_at  TIMESTAMP,
  cat_name              VARCHAR(50) DEFAULT 'Mittens',
  is_premium            BOOLEAN DEFAULT FALSE,
  premium_expires_at    TIMESTAMP,
  push_token            VARCHAR(500),
  timezone              VARCHAR(100) DEFAULT 'UTC',
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW(),
  deleted_at            TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- 3. user_oauth_providers
-- ============================================================
CREATE TABLE user_oauth_providers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider      VARCHAR(20) NOT NULL,
  provider_uid  VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_uid)
);

-- ============================================================
-- 4. curriculum_modules
-- ============================================================
CREATE TABLE curriculum_modules (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profession_id       UUID NOT NULL REFERENCES professions(id),
  target_country      VARCHAR(50) NOT NULL,
  title               VARCHAR(255) NOT NULL,
  description         TEXT,
  order_index         INTEGER NOT NULL,
  min_level_required  INTEGER DEFAULT 1,
  is_published        BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_modules_profession_country ON curriculum_modules(profession_id, target_country);

-- ============================================================
-- 5. units
-- ============================================================
CREATE TABLE units (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id     UUID NOT NULL REFERENCES curriculum_modules(id),
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  order_index   INTEGER NOT NULL,
  is_published  BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_units_module ON units(module_id, order_index);

-- ============================================================
-- 6. stages
-- ============================================================
CREATE TABLE stages (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id                     UUID NOT NULL REFERENCES units(id),
  title                       VARCHAR(255) NOT NULL,
  scenario_description        TEXT NOT NULL,
  order_index                 INTEGER NOT NULL,
  difficulty_level            INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_duration_seconds  INTEGER DEFAULT 300,
  xp_base                     INTEGER DEFAULT 50,
  is_published                BOOLEAN DEFAULT FALSE,
  created_at                  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stages_unit ON stages(unit_id, order_index);

-- ============================================================
-- 7. exercises
-- ============================================================
CREATE TABLE exercises (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id         UUID NOT NULL REFERENCES stages(id),
  exercise_type    VARCHAR(50) NOT NULL,
  order_index      INTEGER NOT NULL,
  xp_reward        INTEGER DEFAULT 10,
  content          JSONB NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  audio_url        VARCHAR(500),
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exercises_stage ON exercises(stage_id, order_index);

-- ============================================================
-- 8. user_stage_progress
-- ============================================================
CREATE TABLE user_stage_progress (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stage_id            UUID NOT NULL REFERENCES stages(id),
  status              VARCHAR(20) DEFAULT 'locked',
  stars               INTEGER DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
  best_score          INTEGER DEFAULT 0,
  attempts            INTEGER DEFAULT 0,
  first_completed_at  TIMESTAMP,
  last_attempted_at   TIMESTAMP,
  UNIQUE(user_id, stage_id)
);

CREATE INDEX idx_stage_progress_user ON user_stage_progress(user_id, status);

-- ============================================================
-- 9. stage_attempts
-- ============================================================
CREATE TABLE stage_attempts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  stage_id          UUID NOT NULL REFERENCES stages(id),
  started_at        TIMESTAMP DEFAULT NOW(),
  completed_at      TIMESTAMP,
  total_score       INTEGER,
  stars_earned      INTEGER,
  xp_earned         INTEGER DEFAULT 0,
  mistakes_count    INTEGER DEFAULT 0,
  lives_lost        INTEGER DEFAULT 0,
  duration_seconds  INTEGER
);

CREATE INDEX idx_attempts_user_stage ON stage_attempts(user_id, stage_id, completed_at DESC);

-- ============================================================
-- 10. exercise_responses
-- ============================================================
CREATE TABLE exercise_responses (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id              UUID NOT NULL REFERENCES stage_attempts(id),
  exercise_id             UUID NOT NULL REFERENCES exercises(id),
  user_response           JSONB NOT NULL,
  is_correct              BOOLEAN,
  score                   INTEGER,
  xp_earned               INTEGER DEFAULT 0,
  ai_feedback             JSONB,
  response_time_seconds   INTEGER,
  created_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_responses_attempt ON exercise_responses(attempt_id);

-- ============================================================
-- 11. user_module_progress
-- ============================================================
CREATE TABLE user_module_progress (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(id),
  module_id               UUID NOT NULL REFERENCES curriculum_modules(id),
  status                  VARCHAR(20) DEFAULT 'locked',
  completion_percentage   DECIMAL(5,2) DEFAULT 0,
  completed_at            TIMESTAMP,
  UNIQUE(user_id, module_id)
);

-- ============================================================
-- 12. cat_items
-- ============================================================
CREATE TABLE cat_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(100) NOT NULL,
  description         TEXT,
  slot                VARCHAR(20) NOT NULL,
  rarity              VARCHAR(20) NOT NULL,
  image_url           VARCHAR(500) NOT NULL,
  catnip_value        INTEGER NOT NULL,
  shop_price_catnip   INTEGER,
  is_active           BOOLEAN DEFAULT TRUE,
  profession_theme    VARCHAR(50),
  country_theme       VARCHAR(50),
  created_at          TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 13. user_inventory
-- ============================================================
CREATE TABLE user_inventory (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id         UUID NOT NULL REFERENCES cat_items(id),
  acquired_at     TIMESTAMP DEFAULT NOW(),
  acquired_from   VARCHAR(20) NOT NULL,
  is_equipped     BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, item_id)
);

CREATE INDEX idx_inventory_user_slot ON user_inventory(user_id, is_equipped);

-- ============================================================
-- 14. gift_box_openings
-- ============================================================
CREATE TABLE gift_box_openings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  box_type        VARCHAR(20) NOT NULL,
  item_id         UUID REFERENCES cat_items(id),
  was_duplicate   BOOLEAN DEFAULT FALSE,
  catnip_earned   INTEGER DEFAULT 0,
  stage_id        UUID REFERENCES stages(id),
  opened_at       TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 15. achievements
-- ============================================================
CREATE TABLE achievements (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             VARCHAR(100) UNIQUE NOT NULL,
  name             VARCHAR(255) NOT NULL,
  description      TEXT NOT NULL,
  icon_url         VARCHAR(500),
  reward_type      VARCHAR(20) NOT NULL,
  reward_value     JSONB NOT NULL,
  condition_type   VARCHAR(50) NOT NULL,
  condition_value  JSONB NOT NULL
);

-- ============================================================
-- 16. user_achievements
-- ============================================================
CREATE TABLE user_achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  achievement_id  UUID NOT NULL REFERENCES achievements(id),
  unlocked_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================================
-- 17. user_streaks
-- ============================================================
CREATE TABLE user_streaks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID UNIQUE NOT NULL REFERENCES users(id),
  current_streak      INTEGER DEFAULT 0,
  longest_streak      INTEGER DEFAULT 0,
  last_activity_date  DATE,
  streak_shields      INTEGER DEFAULT 0,
  shield_used_on      DATE,
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 18. daily_activity_log
-- ============================================================
CREATE TABLE daily_activity_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  activity_date     DATE NOT NULL,
  stages_completed  INTEGER DEFAULT 0,
  xp_earned         INTEGER DEFAULT 0,
  daily_goal_met    BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, activity_date)
);

CREATE INDEX idx_daily_activity_user_date ON daily_activity_log(user_id, activity_date DESC);

-- ============================================================
-- 19. notification_preferences
-- ============================================================
CREATE TABLE notification_preferences (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID UNIQUE NOT NULL REFERENCES users(id),
  daily_reminder_enabled    BOOLEAN DEFAULT TRUE,
  daily_reminder_time       TIME DEFAULT '20:00:00',
  streak_warning_enabled    BOOLEAN DEFAULT TRUE,
  achievement_enabled       BOOLEAN DEFAULT TRUE,
  new_content_enabled       BOOLEAN DEFAULT TRUE,
  lives_restored_enabled    BOOLEAN DEFAULT FALSE,
  weekly_summary_enabled    BOOLEAN DEFAULT TRUE,
  quiet_hours_start         TIME,
  quiet_hours_end           TIME
);

-- ============================================================
-- 20. notification_log
-- ============================================================
CREATE TABLE notification_log (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id),
  notification_type   VARCHAR(100) NOT NULL,
  title               VARCHAR(255),
  body                TEXT,
  sent_at             TIMESTAMP DEFAULT NOW(),
  opened_at           TIMESTAMP,
  push_ticket_id      VARCHAR(500)
);

CREATE INDEX idx_notification_log_user ON notification_log(user_id, sent_at DESC);
