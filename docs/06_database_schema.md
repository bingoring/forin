# forin — 데이터베이스 스키마

**버전**: 1.0.0 | **작성일**: 2026-04-17  
**데이터베이스**: PostgreSQL 16+, ORM: TypeORM

---

## ERD 개요

```
professions ──< curriculum_modules ──< units ──< stages ──< exercises
                                                              │
users ──────────────────────────────────────────────────────>│
  │                                                           │
  ├──< user_stage_progress (stages 참조)                      │
  ├──< stage_attempts ──< exercise_responses (exercises 참조)─┘
  ├──< user_module_progress (curriculum_modules 참조)
  ├──< user_inventory ──< cat_items
  ├──< gift_box_openings ──< cat_items
  ├──< user_achievements ──< achievements
  ├──< user_streaks
  ├──< daily_activity_log
  ├──< notification_preferences
  └──< user_oauth_providers
```

---

## 사용자 관련 테이블

### users
```sql
CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 VARCHAR(255) UNIQUE NOT NULL,
  password_hash         VARCHAR(255),                    -- OAuth 사용자는 NULL
  display_name          VARCHAR(100) NOT NULL,
  avatar_url            VARCHAR(500),
  profession_id         UUID REFERENCES professions(id),
  target_country        VARCHAR(50),                     -- 'AU', 'UK', 'US', 'CA', 'NZ'
  language_level        VARCHAR(30),                     -- 'beginner' | 'pre_intermediate' | 'intermediate' | 'upper_intermediate'
  daily_goal            VARCHAR(20) DEFAULT 'regular',   -- 'casual' | 'regular' | 'intensive'
  current_xp            INTEGER DEFAULT 0,
  total_xp              INTEGER DEFAULT 0,
  current_level         INTEGER DEFAULT 1,
  gems                  INTEGER DEFAULT 0,               -- 프리미엄 재화 (인앱 결제)
  catnip                INTEGER DEFAULT 0,               -- 소프트 재화 (중복 아이템 전환)
  lives                 INTEGER DEFAULT 5,
  lives_last_refill_at  TIMESTAMP,
  cat_name              VARCHAR(50) DEFAULT 'Mittens',
  is_premium            BOOLEAN DEFAULT FALSE,
  premium_expires_at    TIMESTAMP,
  push_token            VARCHAR(500),
  timezone              VARCHAR(100) DEFAULT 'UTC',
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW(),
  deleted_at            TIMESTAMP                        -- soft delete
);

CREATE INDEX idx_users_email ON users(email);
```

### user_oauth_providers
```sql
CREATE TABLE user_oauth_providers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider      VARCHAR(20) NOT NULL,                    -- 'google' | 'apple'
  provider_uid  VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_uid)
);
```

---

## 커리큘럼 테이블

### professions
```sql
CREATE TABLE professions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,          -- 'Registered Nurse', 'Doctor', 'Pharmacist'
  slug        VARCHAR(50) UNIQUE NOT NULL,    -- 'nurse', 'doctor', 'pharmacist'
  icon_url    VARCHAR(500),
  is_active   BOOLEAN DEFAULT TRUE
);
```

### curriculum_modules
```sql
CREATE TABLE curriculum_modules (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profession_id       UUID NOT NULL REFERENCES professions(id),
  target_country      VARCHAR(50) NOT NULL,   -- 'AU', 'UK', 'US', 'CA', 'NZ'
  title               VARCHAR(255) NOT NULL,
  description         TEXT,
  order_index         INTEGER NOT NULL,
  min_level_required  INTEGER DEFAULT 1,
  is_published        BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_modules_profession_country ON curriculum_modules(profession_id, target_country);
```

### units
```sql
CREATE TABLE units (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id     UUID NOT NULL REFERENCES curriculum_modules(id),
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  order_index   INTEGER NOT NULL,
  is_published  BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_units_module ON units(module_id, order_index);
```

### stages
```sql
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
```

### exercises
```sql
CREATE TABLE exercises (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id        UUID NOT NULL REFERENCES stages(id),
  exercise_type   VARCHAR(50) NOT NULL,       -- 'sentence_arrangement' | 'word_puzzle' | 'meaning_match' | 'conversation'
  order_index     INTEGER NOT NULL,
  xp_reward       INTEGER DEFAULT 10,
  content         JSONB NOT NULL,             -- 유형별 스키마 (아래 참조)
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  audio_url       VARCHAR(500),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exercises_stage ON exercises(stage_id, order_index);
```

#### exercises.content JSONB 스키마

**sentence_arrangement**:
```json
{
  "target_sentence": "I completely understand that you're feeling better, Mr. Johnson.",
  "word_tiles": ["I", "completely", "understand", "that", "you're", "feeling", "better,", "Mr.", "Johnson.", "totally", "great"],
  "distractor_indices": [9, 10],
  "hint_remove_count": 2
}
```

**word_puzzle**:
```json
{
  "dialogue_template": "We are waiting for your {{0}} results, which check for heart {{1}}.",
  "blanks": [
    {
      "index": 0,
      "correct_answer": "troponin",
      "options": ["troponin", "urine", "blood sugar", "X-ray"]
    }
  ]
}
```

**meaning_match**:
```json
{
  "pairs": [
    {"term": "NPO", "definition": "Nothing by mouth"},
    {"term": "PRN", "definition": "As needed"}
  ]
}
```

**conversation**:
```json
{
  "ai_character_name": "Mr. Johnson",
  "ai_character_role": "patient",
  "opening_line": "I feel fine and I'm going home now.",
  "opening_audio_url": "/audio/conv_001_opening.mp3",
  "ideal_responses": [
    "You're absolutely right that I can't stop you, Mr. Johnson. But I want to make sure..."
  ],
  "evaluation_rubric": {
    "vocabulary_keywords": ["troponin", "pending", "heart muscle", "at risk"],
    "tone_keywords": ["understand", "concern", "appreciate", "right"],
    "required_content_points": ["acknowledge autonomy", "explain pending test", "state specific risk", "offer timeline"]
  },
  "min_passing_score": 40
}
```

---

## 학습 진도 테이블

### user_stage_progress
```sql
CREATE TABLE user_stage_progress (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stage_id            UUID NOT NULL REFERENCES stages(id),
  status              VARCHAR(20) DEFAULT 'locked',  -- 'locked' | 'available' | 'completed'
  stars               INTEGER DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
  best_score          INTEGER DEFAULT 0,
  attempts            INTEGER DEFAULT 0,
  first_completed_at  TIMESTAMP,
  last_attempted_at   TIMESTAMP,
  UNIQUE(user_id, stage_id)
);

CREATE INDEX idx_stage_progress_user ON user_stage_progress(user_id, status);
```

### stage_attempts
```sql
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
```

### exercise_responses
```sql
CREATE TABLE exercise_responses (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id              UUID NOT NULL REFERENCES stage_attempts(id),
  exercise_id             UUID NOT NULL REFERENCES exercises(id),
  user_response           JSONB NOT NULL,   -- 사용자의 실제 답변
  is_correct              BOOLEAN,
  score                   INTEGER,          -- conversation 유형: 0-100, 나머지: binary
  xp_earned               INTEGER DEFAULT 0,
  ai_feedback             JSONB,            -- conversation 유형에만 사용
  response_time_seconds   INTEGER,
  created_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_responses_attempt ON exercise_responses(attempt_id);
```

### user_module_progress
```sql
CREATE TABLE user_module_progress (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(id),
  module_id               UUID NOT NULL REFERENCES curriculum_modules(id),
  status                  VARCHAR(20) DEFAULT 'locked',  -- 'locked' | 'in_progress' | 'completed'
  completion_percentage   DECIMAL(5,2) DEFAULT 0,
  completed_at            TIMESTAMP,
  UNIQUE(user_id, module_id)
);
```

---

## 게임화 테이블

### cat_items
```sql
CREATE TABLE cat_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(100) NOT NULL,
  description         TEXT,
  slot                VARCHAR(20) NOT NULL,   -- 'hat' | 'outfit' | 'accessory' | 'background' | 'expression'
  rarity              VARCHAR(20) NOT NULL,   -- 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  image_url           VARCHAR(500) NOT NULL,
  catnip_value        INTEGER NOT NULL,       -- 중복 아이템 전환 시 지급 Catnip
  shop_price_catnip   INTEGER,               -- NULL = 상점 직접 구매 불가
  is_active           BOOLEAN DEFAULT TRUE,
  profession_theme    VARCHAR(50),           -- NULL = 모든 직군 공통
  country_theme       VARCHAR(50),           -- NULL = 모든 국가 공통
  created_at          TIMESTAMP DEFAULT NOW()
);
```

### user_inventory
```sql
CREATE TABLE user_inventory (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id         UUID NOT NULL REFERENCES cat_items(id),
  acquired_at     TIMESTAMP DEFAULT NOW(),
  acquired_from   VARCHAR(20) NOT NULL,       -- 'gift_box' | 'shop' | 'achievement' | 'event'
  is_equipped     BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, item_id)                    -- 아이템당 1개 보유 (중복 → Catnip)
);

CREATE INDEX idx_inventory_user_slot ON user_inventory(user_id, is_equipped);
```

### gift_box_openings
```sql
CREATE TABLE gift_box_openings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  box_type        VARCHAR(20) NOT NULL,       -- 'basic' | 'silver' | 'gold' | 'legendary'
  item_id         UUID REFERENCES cat_items(id),  -- NULL이면 중복 → Catnip 전환
  was_duplicate   BOOLEAN DEFAULT FALSE,
  catnip_earned   INTEGER DEFAULT 0,
  stage_id        UUID REFERENCES stages(id), -- 트리거가 된 스테이지
  opened_at       TIMESTAMP DEFAULT NOW()
);
```

### achievements
```sql
CREATE TABLE achievements (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             VARCHAR(100) UNIQUE NOT NULL,
  name             VARCHAR(255) NOT NULL,
  description      TEXT NOT NULL,
  icon_url         VARCHAR(500),
  reward_type      VARCHAR(20) NOT NULL,       -- 'xp' | 'gift_box' | 'item' | 'catnip'
  reward_value     JSONB NOT NULL,             -- {"box_type": "rare"} 또는 {"item_id": "..."}
  condition_type   VARCHAR(50) NOT NULL,       -- 'streak' | 'stage_count' | 'perfect_stages' | 'module_complete' | 'custom'
  condition_value  JSONB NOT NULL              -- {"days": 7} 또는 {"count": 5}
);
```

### user_achievements
```sql
CREATE TABLE user_achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  achievement_id  UUID NOT NULL REFERENCES achievements(id),
  unlocked_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

---

## 스트릭 / 활동 테이블

### user_streaks
```sql
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
```

### daily_activity_log
```sql
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
```

---

## 알림 테이블

### notification_preferences
```sql
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
```

### notification_log
```sql
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
```

---

## 초기 시드 데이터

### professions (3개)
```sql
INSERT INTO professions (name, slug) VALUES
  ('Registered Nurse', 'nurse'),
  ('Doctor', 'doctor'),
  ('Pharmacist', 'pharmacist');
```

### achievements (MVP 5개)
```sql
INSERT INTO achievements (slug, name, description, reward_type, reward_value, condition_type, condition_value) VALUES
  ('first_steps', 'First Steps', '첫 스테이지를 완료하세요', 'gift_box', '{"box_type":"basic"}', 'stage_count', '{"count":1}'),
  ('week_warrior', 'Week Warrior', '7일 연속 학습하세요', 'gift_box', '{"box_type":"silver"}', 'streak', '{"days":7}'),
  ('perfect_unit', 'Perfect Unit', '유닛 내 모든 스테이지를 3별로 완료하세요', 'gift_box', '{"box_type":"rare"}', 'perfect_stages', '{"unit_complete":true}'),
  ('conversation_starter', 'Conversation Starter', '대화 연습 10개를 완료하세요', 'item', '{"slot":"accessory","theme":"stethoscope"}', 'custom', '{"exercise_type":"conversation","count":10}'),
  ('night_shift_hero', 'Night Shift Hero', '오후 11시~오전 5시에 스테이지를 완료하세요', 'item', '{"slot":"outfit","theme":"nightshift"}', 'custom', '{"time_range":"23:00-05:00"}');
```
