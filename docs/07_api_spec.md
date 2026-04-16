# forin — REST API 명세

**버전**: 1.0.0 | **작성일**: 2026-04-17

---

## 기본 정보

```
Base URL:   https://api.forin.app/v1
인증:        Authorization: Bearer <jwt_access_token>
Content-Type: application/json
```

### 공통 응답 형식

**성공**:
```json
{
  "success": true,
  "data": { ... }
}
```

**에러**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다."
  }
}
```

### 공통 에러 코드
| 코드 | HTTP | 설명 |
|------|------|------|
| `UNAUTHORIZED` | 401 | 유효하지 않거나 만료된 토큰 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `VALIDATION_ERROR` | 422 | 요청 데이터 유효성 오류 |
| `RATE_LIMITED` | 429 | 요청 한도 초과 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

---

## 인증 (Auth)

### POST /auth/register
이메일로 신규 계정 생성

```
Request:
{
  "email": "soyeon@example.com",
  "password": "SecurePass123!",
  "display_name": "김소연"
}

Response 201:
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "expires_in": 900,
  "user": {
    "id": "uuid",
    "email": "soyeon@example.com",
    "display_name": "김소연",
    "current_level": 1,
    "current_xp": 0
  }
}
```

### POST /auth/login
```
Request:
{
  "email": "soyeon@example.com",
  "password": "SecurePass123!"
}

Response 200: (register와 동일)
```

### POST /auth/oauth/google
```
Request:
{
  "id_token": "google_id_token_string"
}

Response 200: (register와 동일)
```

### POST /auth/refresh
```
Request:
{
  "refresh_token": "eyJhbGci..."
}

Response 200:
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "expires_in": 900
}
```

### POST /auth/logout
🔒 인증 필요
```
Response 200:
{ "message": "로그아웃 되었습니다." }
```

---

## 사용자 / 프로필 (Users)

### GET /users/me
🔒 인증 필요 | 홈 화면 전체 데이터 반환

```
Response 200:
{
  "id": "uuid",
  "display_name": "김소연",
  "email": "soyeon@example.com",
  "profession": {
    "id": "uuid",
    "name": "Registered Nurse",
    "slug": "nurse"
  },
  "target_country": "AU",
  "language_level": "intermediate",
  "current_xp": 1240,
  "xp_to_next_level": 260,
  "total_xp": 3500,
  "current_level": 3,
  "level_title": "Staff Nurse",
  "lives": 4,
  "lives_max": 5,
  "lives_refill_in_seconds": 1800,
  "gems": 50,
  "catnip": 120,
  "is_premium": false,
  "streak": {
    "current_streak": 14,
    "longest_streak": 21,
    "streak_shields": 0
  },
  "cat": {
    "name": "나비",
    "equipped_items": {
      "hat": { "id": "uuid", "name": "Nurse Cap", "image_url": "https://cdn.forin.app/..." },
      "outfit": { "id": "uuid", "name": "Blue Scrubs", "image_url": "..." },
      "accessory": null,
      "background": null,
      "expression": null
    }
  },
  "daily_progress": {
    "goal_type": "regular",
    "xp_target": 100,
    "xp_today": 60,
    "stages_completed_today": 2,
    "goal_met": false
  }
}
```

### PATCH /users/me
🔒 인증 필요

```
Request (부분 업데이트 허용):
{
  "display_name": "김소연",
  "cat_name": "Luna",
  "daily_goal": "intensive",
  "target_country": "UK",
  "timezone": "Australia/Sydney"
}

Response 200:
{ "message": "업데이트 완료" }
```

### PUT /users/me/cat/equip
🔒 인증 필요 | 고양이 아이템 장착/해제

```
Request:
{
  "slot": "hat",
  "item_id": "uuid"    // null 전송 시 해당 슬롯 해제
}

Response 200:
{
  "equipped_items": {
    "hat": { "id": "uuid", "name": "Nurse Cap", "image_url": "..." },
    "outfit": null,
    "accessory": null,
    "background": null,
    "expression": null
  }
}
```

### PUT /users/me/notification-preferences
🔒 인증 필요

```
Request:
{
  "daily_reminder_enabled": true,
  "daily_reminder_time": "20:00",
  "streak_warning_enabled": true,
  "weekly_summary_enabled": false,
  "quiet_hours_start": "23:00",
  "quiet_hours_end": "07:00"
}

Response 200:
{ "message": "알림 설정이 저장되었습니다." }
```

---

## 커리큘럼 (Curriculum)

### GET /curriculum
🔒 인증 필요 | 사용자의 커리큘럼 전체 조회

```
Query params:
  profession_id: UUID (선택, 기본: 사용자 직업)
  target_country: string (선택, 기본: 사용자 설정 국가)

Response 200:
{
  "modules": [
    {
      "id": "uuid",
      "title": "Clinical Communication Fundamentals",
      "description": "...",
      "order_index": 1,
      "user_progress": {
        "status": "in_progress",
        "completion_percentage": 45.5
      },
      "units": [
        {
          "id": "uuid",
          "title": "Introducing Yourself and Your Role",
          "order_index": 1,
          "stages_count": 3,
          "stages_completed": 2,
          "is_locked": false,
          "user_progress": {
            "status": "in_progress"
          }
        }
      ]
    }
  ]
}
```

### GET /curriculum/stages/:stageId
🔒 인증 필요 | 스테이지 상세 (문제 포함)

```
Response 200:
{
  "id": "uuid",
  "title": "Patient Wants to Leave Before Lab Results",
  "scenario_description": "58세 Johnson씨가 트로포닌 결과 대기 중인데...",
  "difficulty_level": 2,
  "estimated_duration_seconds": 300,
  "xp_base": 50,
  "exercises": [
    {
      "id": "uuid",
      "exercise_type": "sentence_arrangement",
      "order_index": 1,
      "xp_reward": 10,
      "content": {
        "target_sentence": "I completely understand that you're feeling better, Mr. Johnson.",
        "word_tiles": ["I", "completely", ...],
        "distractor_indices": [9, 10]
      },
      "audio_url": "https://cdn.forin.app/audio/sentences/s001.mp3"
    },
    {
      "id": "uuid",
      "exercise_type": "word_puzzle",
      "order_index": 2,
      ...
    }
  ],
  "user_progress": {
    "status": "available",
    "stars": 0,
    "best_score": 0,
    "attempts": 0
  }
}
```

---

## 학습 (Learning)

### POST /learning/stages/:stageId/start
🔒 인증 필요 | 스테이지 시작 (attempt 생성)

```
Response 201:
{
  "attempt_id": "uuid",
  "stage_id": "uuid",
  "started_at": "2026-04-17T10:00:00Z"
}
```

### POST /learning/attempts/:attemptId/exercises/:exerciseId/submit
🔒 인증 필요 | 문제 제출 및 채점

**sentence_arrangement 제출**:
```
Request:
{
  "response_type": "sentence_arrangement",
  "answer": ["I", "completely", "understand", "that", "you're", "feeling", "better,", "Mr.", "Johnson."],
  "response_time_seconds": 25
}

Response 200:
{
  "exercise_id": "uuid",
  "is_correct": true,
  "xp_earned": 10,
  "correct_answer": "I completely understand that you're feeling better, Mr. Johnson.",
  "lives_remaining": 5,
  "feedback": null
}
```

**word_puzzle 제출**:
```
Request:
{
  "response_type": "word_puzzle",
  "answers": [
    { "blank_index": 0, "selected_option": "troponin" },
    { "blank_index": 1, "selected_option": "damage" }
  ],
  "response_time_seconds": 18
}

Response 200:
{
  "exercise_id": "uuid",
  "blank_results": [
    { "blank_index": 0, "is_correct": true, "correct_answer": "troponin", "xp_earned": 10 },
    { "blank_index": 1, "is_correct": false, "correct_answer": "damage", "xp_earned": 0 }
  ],
  "total_xp_earned": 10,
  "lives_remaining": 4
}
```

**meaning_match 제출**:
```
Request:
{
  "response_type": "meaning_match",
  "total_time_seconds": 45,
  "mismatch_count": 2
}

Response 200:
{
  "exercise_id": "uuid",
  "is_correct": true,
  "xp_earned": 55,
  "xp_breakdown": {
    "base": 20,
    "speed_bonus": 20,
    "perfect_bonus": 15
  },
  "lives_remaining": 5
}
```

**conversation 제출**:
```
Request:
{
  "response_type": "conversation",
  "user_response_text": "I understand you want to leave, Mr. Johnson. However, your troponin results...",
  "response_time_seconds": 60
}

Response 200:
{
  "exercise_id": "uuid",
  "score": 78,
  "xp_earned": 15,
  "ai_feedback": {
    "vocabulary_score": 80,
    "tone_score": 85,
    "completeness_score": 65,
    "feedback_text": "공감 표현이 좋았습니다. 구체적인 위험성(심근 손상 가능성)을 더 명확히 언급해 보세요.",
    "ideal_response": "You're absolutely right that I can't stop you, Mr. Johnson..."
  },
  "lives_remaining": 5
}
```

### POST /learning/attempts/:attemptId/complete
🔒 인증 필요 | 스테이지 완료 처리 (XP, 별점, 상자, 업적 일괄)

```
Request:
{
  "completed_at": "2026-04-17T10:05:23Z"
}

Response 200:
{
  "attempt_id": "uuid",
  "stage_id": "uuid",
  "total_score": 88,
  "stars_earned": 2,
  "xp_earned": 95,
  "mistakes_count": 1,
  "duration_seconds": 323,
  "level_up": null,
  "level_up_example": {
    "new_level": 4,
    "new_title": "Charge Nurse",
    "previous_level": 3
  },
  "streak_update": {
    "current_streak": 15,
    "was_extended": true,
    "milestone_reached": null
  },
  "gift_box_awarded": {
    "id": "uuid",
    "box_type": "basic",
    "is_first_clear": true
  },
  "achievements_unlocked": [
    {
      "id": "uuid",
      "slug": "first_steps",
      "name": "First Steps",
      "reward_type": "gift_box"
    }
  ]
}
```

### GET /learning/history
🔒 인증 필요 | 학습 이력

```
Query params:
  limit: number (기본 20)
  offset: number (기본 0)

Response 200:
{
  "attempts": [
    {
      "id": "uuid",
      "stage_title": "Patient Wants to Leave Before Lab Results",
      "stars_earned": 2,
      "xp_earned": 95,
      "completed_at": "2026-04-17T10:05:23Z",
      "duration_seconds": 323
    }
  ],
  "total": 45
}
```

---

## 게임화 (Gamification)

### GET /gamification/inventory
🔒 인증 필요

```
Response 200:
{
  "items": [
    {
      "id": "uuid",
      "name": "Nurse Cap",
      "slot": "hat",
      "rarity": "uncommon",
      "image_url": "https://cdn.forin.app/...",
      "is_equipped": true,
      "acquired_from": "gift_box",
      "acquired_at": "2026-04-10T..."
    }
  ],
  "total_items": 12
}
```

### GET /gamification/gift-boxes/pending
🔒 인증 필요

```
Response 200:
{
  "pending_boxes": [
    {
      "id": "uuid",
      "box_type": "basic",
      "earned_from": "stage_completion",
      "earned_at": "2026-04-17T10:05:23Z"
    }
  ],
  "count": 1
}
```

### POST /gamification/gift-boxes/:boxId/open
🔒 인증 필요

```
Response 200:
{
  "item": {
    "id": "uuid",
    "name": "Stethoscope Headband",
    "slot": "hat",
    "rarity": "rare",
    "image_url": "https://cdn.forin.app/...",
    "description": "진짜 의료인처럼 보이는 청진기 머리띠"
  },
  "was_duplicate": false,
  "catnip_earned": 0,
  "user_catnip_total": 120
}

// 중복 아이템인 경우:
{
  "item": { ... },
  "was_duplicate": true,
  "catnip_earned": 30,
  "user_catnip_total": 150,
  "message": "이미 보유한 아이템입니다. Catnip 30개로 전환되었습니다."
}
```

### GET /gamification/shop
🔒 인증 필요

```
Response 200:
{
  "featured_item": {
    "id": "uuid",
    "name": "Nurse Practitioner Coat",
    "slot": "outfit",
    "rarity": "epic",
    "image_url": "...",
    "shop_price_catnip": 800,
    "user_owns": false
  },
  "items": [
    {
      "id": "uuid",
      "name": "Basic Cap",
      "slot": "hat",
      "rarity": "common",
      "image_url": "...",
      "preview_silhouette_url": "...",
      "shop_price_catnip": 100,
      "user_owns": true
    }
  ]
}
```

### POST /gamification/shop/purchase
🔒 인증 필요

```
Request:
{
  "item_id": "uuid"
}

Response 200:
{
  "item": {
    "id": "uuid",
    "name": "Basic Cap",
    "slot": "hat",
    "rarity": "common"
  },
  "catnip_spent": 100,
  "user_catnip_remaining": 20
}

// 잔액 부족:
Response 422:
{
  "error": {
    "code": "INSUFFICIENT_CATNIP",
    "message": "Catnip이 부족합니다. 현재 20개, 필요 100개."
  }
}
```

### GET /gamification/achievements
🔒 인증 필요

```
Response 200:
{
  "achievements": [
    {
      "id": "uuid",
      "slug": "week_warrior",
      "name": "Week Warrior",
      "description": "7일 연속 학습하세요",
      "icon_url": "...",
      "is_unlocked": true,
      "unlocked_at": "2026-04-10T...",
      "reward_type": "gift_box",
      "reward_value": { "box_type": "silver" }
    },
    {
      "id": "uuid",
      "slug": "perfect_unit",
      "name": "Perfect Unit",
      "description": "유닛 내 모든 스테이지를 3별로 완료하세요",
      "icon_url": "...",
      "is_unlocked": false,
      "unlocked_at": null,
      "reward_type": "gift_box",
      "reward_value": { "box_type": "rare" }
    }
  ]
}
```

---

## 온보딩 (Onboarding)

### GET /onboarding/professions
공개 엔드포인트

```
Response 200:
{
  "professions": [
    { "id": "uuid", "name": "Registered Nurse", "slug": "nurse", "icon_url": "..." },
    { "id": "uuid", "name": "Doctor", "slug": "doctor", "icon_url": "..." },
    { "id": "uuid", "name": "Pharmacist", "slug": "pharmacist", "icon_url": "..." }
  ]
}
```

### GET /onboarding/countries
공개 엔드포인트

```
Query params:
  profession_slug: string (예: 'nurse')

Response 200:
{
  "countries": [
    { "code": "AU", "name": "Australia", "flag_url": "...", "accent": "Australian English" },
    { "code": "UK", "name": "United Kingdom", "flag_url": "...", "accent": "British English" }
  ]
}
```

### POST /onboarding/assessment/submit
🔒 인증 필요

```
Request:
{
  "profession_id": "uuid",
  "target_country": "AU",
  "answers": [
    { "question_id": "uuid", "selected_option": "B" },
    { "question_id": "uuid", "answer_tokens": ["I", "understand", "your", "concern"] }
  ]
}

Response 200:
{
  "determined_level": "intermediate",
  "score": 7,
  "total_questions": 10,
  "recommended_starting_module": {
    "id": "uuid",
    "title": "Clinical Communication Fundamentals"
  },
  "skipped_stages_count": 8
}
```

---

## Rate Limiting 정책

| 엔드포인트 그룹 | 한도 |
|---------------|------|
| POST /auth/login | 5회/분/IP |
| POST /auth/register | 3회/분/IP |
| POST /learning/.../submit | 60회/분/사용자 |
| 기타 API | 100회/분/사용자 |
