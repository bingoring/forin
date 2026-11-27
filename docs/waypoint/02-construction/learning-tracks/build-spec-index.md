---
build-spec: learning-tracks
stage: 02-construction/07-growth-economy-review
status: PHASE-1-IMPLEMENTED
depth: comprehensive
updated: 2026-09-03
---

# Build Spec — 학습 트랙 (직업·언어를 바꾸는 사람)

> **구현 스펙(Build Spec)** = 코딩 전에 SoT를 라인 단위로 유도해 "다시 유도하지 않고 바로 구현 가능한"
> 수준으로 구체화한 것. (FRAMEWORK "구현 스펙")

## §0. 개요 & 범위

- **목표(한 줄):** 직업이나 학습 언어가 바뀐 사람이 **갇히지 않게** 하고, 바뀐 뒤에도 이전에 쌓은 진도를
  잃지 않게 한다.
- **문제(실측, 2026-09-03):**
  - `profiles`는 단일값이다 — `job` / `native_lang` / `target_lang` / `destination` / `target_level` 각 하나.
    트랙 개념이 없다(`db/migrations/000001_init.up.sql:22`, `000007_profile_languages.up.sql`).
  - `PATCH /me/profile`은 다섯 값을 이미 받는다(`internal/adapters/http/me_handler.go:62`). **그런데 온보딩이
    끝난 뒤 그것을 호출하는 화면이 없다.** 프로필의 "배우는 언어"는 읽기 전용 텍스트다
    (`mobile/src/app/(tabs)/me.tsx:549`, `settings.language.learningSub` = "온보딩에서 고른 나라로 정해져요").
    → **직업이 바뀐 사람에게는 경로가 존재하지 않는다.** 트랙 논의와 무관한 결함이다.
  - 진도는 사람 단위다: `user_progress`는 `user_id` PK(xp·level·streak·평판),
    `scenario_attempts`·`review_cards`·`speech_attempts`도 user_id 기준이다. 단 `speech_attempts`에는
    `locale`이 있고(`000021`), 평판은 이미 **직업별 key-value**로 바뀌어 있다(`000020_reputation_kv`) —
    스키마가 두 번째 직업을 예상해뒀다.
  - 오늘 저작된 것은 간호사 하나, 목적지 네 곳은 전부 영어권이다(`DESTS` in `passport.tsx`,
    `readyDestinations=['us']`). 즉 **언어 전환은 아직 갈 곳이 없다.**
- **결정(2026-09-03, 사용자):** 진도는 **학습 트랙으로 분리**한다. 바꿀 수 있게 하는 화면은 **지금** 만든다.
- **깊이 티어 & 사유:** `comprehensive` — 진도 테이블 4개의 키가 바뀌고(사람 → 사람×트랙), 그 위에 홈·일터·
  리뷰랩·성장 리포트가 전부 서 있다. 잘못 나누면 "3주가 사라졌다"가 된다.

### 트랙의 정의

**트랙 = (직업 × 학습 언어).** 목적지는 트랙의 **속성**이지 트랙을 나누는 축이 아니다 — 미국↔호주는 커리큘럼을
공유하므로 갈아타도 잃는 것이 없어야 한다. 수준(CEFR)도 트랙의 속성이다.

### 무엇이 트랙에 속하고 무엇이 사람에 속하는가

| 트랙에 속함 (주제에 대한 진도) | 사람에 속함 (사람에 대한 진도) |
|---|---|
| 클리어한 상황 · 시도 이력 (`scenario_attempts`) | **연속 출근**(`streak_*`) — "오늘 왔는가"는 무엇을 공부했는지와 무관하다 |
| 복습 카드 · SRS 일정 (`review_cards`) | 칭호 · 히든 미션 (사람의 이력) |
| 발음 시도 · 음소 집계 (`speech_attempts`) | 동료 관계 · 응원 (`colleague_*`) |
| 평판 차원 (`user_reputation`, 이미 직업별) | 라운지 글 · 응원 (`lounge_*`) |
| XP · 레벨 | 초상화 · 표시 이름 · 앱 언어 |

**XP·레벨을 트랙에 두는 이유:** 레벨은 "이 주제에서 어디까지 왔는가"의 표시다. 영어 간호사로 번 Lv.29가
독일어 호텔리어 사원증에 찍히면 그 숫자는 아무 말도 하지 않는다. **연속 출근을 사람에 두는 이유:** 그것은
습관의 기록이고, 어느 트랙을 공부해도 출근은 출근이다.

## §1. 단계 (Phasing)

| 단계 | 내용 | 상태 |
|---|---|---|
| **P1** | **학습 설정 화면** — 직업·목적지·수준을 다시 고른다(저작된 것만 선택 가능). 기존 `PATCH /me/profile` 사용, 마이그레이션 없음. 진도는 그대로 이어진다 | **구현됨(2026-09-03)** |
| **P1b** | **변경 이력**(`profile_changes`) — 누가 언제 무엇에서 무엇으로 바꿨는가. P2가 기존 행을 트랙에 배정할 때의 유일한 근거 | **구현됨(2026-09-03)** |
| **P2** | `learning_tracks` + 진도 4개 테이블에 `track_id` + 전환 UI + 홈·일터·리뷰랩이 활성 트랙을 읽음 | 미착수 |
| **P3** | 두 번째 직업 또는 비영어권 목적지가 실제로 저작될 때 트랙 전환을 사용자에게 노출 | 콘텐츠 대기 |

### P1b가 P2보다 먼저 필요한 이유 (놓치기 쉬운 순서)

P1이 **먼저** 나가면 사람들은 P2 이전에 주제를 바꿀 수 있다. 그러면 그들이 쌓은 행은 "어느 트랙의 것인가"가
**모호해진다** — 3주치 복습 카드가 간호사 영어의 것인지 호텔 독일어의 것인지 행 안에 아무 근거가 없다.

두 가지 해법을 견주었다:

| 안 | 비용 | 판정 |
|---|---|---|
| 쓰기 시점에 각 행에 `job`/`target_lang`을 박는다 | 마이그레이션 3개 + 뜨거운 쓰기 경로(RecordAttempt·CreateCard·InsertAttempt) 전부가 프로필을 알아야 함 | 배관이 많고, P2가 `track_id`를 넣으면 그 컬럼은 곧 중복이 된다 |
| **변경 자체를 기록한다**(`profile_changes`) | 테이블 1개 + 프로필 핸들러 한 곳의 insert | **채택.** 변경 시각으로 이력을 시간순 분할할 수 있다 — 어떤 변경 이전의 행은 이전 주제의 것이다 |

## §2. P2 설계 (구현 전 확정)

### 스키마

```sql
CREATE TABLE learning_tracks (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    job          text NOT NULL,
    target_lang  text NOT NULL,
    destination  text NOT NULL DEFAULT '',
    target_level text NOT NULL DEFAULT '',
    created_at   timestamptz NOT NULL DEFAULT now(),
    last_used_at timestamptz NOT NULL DEFAULT now()
);
-- 같은 (직업, 언어)를 두 번 만들 수 없다. 그건 트랙이 아니라 같은 트랙의 재방문이다.
CREATE UNIQUE INDEX idx_tracks_subject ON learning_tracks (user_id, job, target_lang);
-- 활성 트랙은 profiles가 가리킨다: "지금 무엇을 공부하는가"는 프로필의 사실이다.
ALTER TABLE profiles ADD COLUMN active_track_id uuid REFERENCES learning_tracks (id);
```

진도 테이블 4개(`user_progress`·`scenario_attempts`·`review_cards`·`speech_attempts`)에 `track_id uuid`를
추가하고, **백필은 `profile_changes`를 근거로** 한다:

1. 각 사용자의 현재 (job, target_lang)로 트랙을 만든다.
2. `profile_changes`가 있으면 변경 시각을 경계로 그 이전 행을 **그 시점의 주제**로 만든 트랙에 배정한다.
3. `profile_changes`가 없는 사용자(대다수)는 모든 행이 현재 트랙이다 — 주제를 바꾼 적이 없으므로 참이다.

`user_progress`는 PK가 `user_id`이므로 `(user_id, track_id)` 복합 PK로 바꾼다. **XP·레벨·평판은 트랙별로
쪼개고, `streak_*`·`last_active_date`는 사람 단위로 남긴다** — 같은 테이블에 두 축이 섞이므로 이 마이그레이션은
`user_progress`를 `user_track_progress`(트랙별) + `user_streaks`(사람별)로 **분리**한다. 한 행이 두 가지 사실을
담고 있으면 다음 사람이 반드시 잘못된 쪽을 읽는다.

### 전환의 규칙

- 전환은 **파괴적이지 않다**: 이전 트랙의 행은 그대로 있고, 돌아오면 두고 간 그대로다.
- 전환 시 `last_used_at`을 갱신하고 활성 트랙을 바꾼다. 그 외 아무것도 삭제하지 않는다.
- 트랙이 하나뿐인 사용자에게는 **전환 UI를 보여주지 않는다**(오늘 전원). 고를 것이 하나인 선택은 선택이 아니다.
- 트랙 상한: 사용자당 8개. 무제한은 목록이 아니라 쓰레기통이 된다.

### 계약 영향

`GET /me`는 `profile.activeTrack`(id·job·targetLang·destination·targetLevel)을 함께 보낸다. 진도를 읽는
엔드포인트(`/me/progress`·`/me/home`·`/me/review/*`·`/speech/*`)는 **활성 트랙으로 암묵 스코프**한다 —
클라가 트랙 id를 매번 실어보내면 잊는 곳이 생기고, 그 한 곳이 남의 트랙 진도를 보여준다.

## §3. P1 구현 (이번 커밋)

| 아티팩트 | 상태 | 비고 |
|---|---|---|
| `mobile/src/data/onboardingChoices.ts` | 신규 | 직업·목적지·수준 목록을 여권과 설정 화면이 **한 곳에서** 읽는다. 두 벌이 되면 반드시 어긋난다 |
| `mobile/src/app/settings/learning.tsx` | 신규 | 직업·목적지·수준 다시 고르기 |
| `mobile/src/app/(tabs)/me.tsx` | 변경 | 읽기 전용 "배우는 언어" 행 → 설정 화면으로 가는 행 |
| `server/db/migrations/000034_profile_changes` | 신규 | P1b |
| `server/internal/adapters/http/me_handler.go` | 변경 | 값이 실제로 바뀔 때만 이력 1행 |
| `server/internal/adapters/postgres/user_repo.go` | 변경 | `RecordProfileChange` |

### P1에서 화면이 말해야 하는 것

바꾸는 순간 진도가 어떻게 되는지 **먼저** 말한다. 지금은 "그대로 이어집니다"가 참이고, P2 이후에는 "트랙별로
따로 쌓입니다"가 참이 된다. 이 문구는 트랙이 들어올 때 반드시 함께 바뀐다(§5 위험).

## §4. 비기능 (NFR)

- 변경 이력은 **감사 로그이지 사용자 화면이 아니다.** 노출 엔드포인트를 만들지 않는다 — 만들면 남의 이력을
  보여주지 않을 책임이 생긴다.
- 이력 기록 실패가 프로필 저장을 막지 않는다. 감사가 기능을 인질로 잡으면 안 된다(단, 실패는 로그에 남는다).

## §5. 위험

| 위험 | 완화 |
|---|---|
| P1만 나가고 P2가 오래 지연됨 → 주제를 바꾼 사람의 진도가 섞인 채 방치 | `profile_changes`가 근거를 보존한다. 다만 **화면 문구가 그동안 참이어야 한다** — "그대로 이어집니다" |
| `user_progress` 분리 마이그레이션이 되돌릴 수 없음 | down 마이그레이션에서 두 테이블을 다시 합칠 수 있게, 분리 시 원본 컬럼을 그대로 옮긴다(계산·집계 금지) |
| 활성 트랙 암묵 스코프를 한 엔드포인트가 빠뜨림 | 포트 시그니처에 `trackID`를 **필수 인자**로 넣는다. 빠뜨리면 컴파일이 깨진다 — 잊을 수 있는 옵션으로 두지 않는다 |
