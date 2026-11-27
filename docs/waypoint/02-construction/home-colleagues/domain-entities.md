---
build-spec: home-colleagues
artifact: domain-entities
updated: 2026-08-10
---

# Domain & Entities — 홈 탭 · 동료 시스템

SoT: 핸드오프 **v21** `04_SCREENS.md §①b Home / §①c Colleagues`,
`reference/screen-home.jsx`, `reference/screen-colleagues.jsx`.

## 1. 엔티티 개요

| 엔티티 | 저장소 | 왜 필요한가 |
|---|---|---|
| `ColleagueLink` | PG `colleague_links` | 동료 관계. **방향성 있는 2행**으로 저장 |
| `InviteCode` | PG `invite_codes` | 코드 기반 연결. 7일 유효·최대 10명 |
| `ColleagueRequest` | PG `colleague_requests` | 코드 입력 → 상대 수락까지의 대기 상태 |
| `Cheer` | PG `cheers` | 응원(프리셋 + 60자 한마디), 인박스 |
| `Presence` | PG `user_presence` | "지금 ICU 승압제 진행 중" · 오늘 활동 점 |
| `ColleaguePrefs` | PG `colleague_prefs` | 공개 범위(현황/주간 그래프) |
| `HomeCard` | 콘텐츠 파일 | 멘토 쪽지·오늘의 한마디 풀 (서버 소유, 배포물) |
| `ShiftAssignment` | 파생(무저장) | 근무·배치·날씨 — 날짜+유저 시드로 결정적 생성 |

> **더미 없음 원칙.** 홈의 모든 모듈은 위 엔티티 중 하나에서 값을 얻는다. 값이 없으면
> **모듈을 숨긴다**(빈 상태 문구). 하드코딩 문자열을 화면에 남기지 않는다.

## 2. 엔티티 상세

### `ColleagueLink`

```
colleague_links
  owner_id   uuid  NOT NULL  REFERENCES users(id) ON DELETE CASCADE
  other_id   uuid  NOT NULL  REFERENCES users(id) ON DELETE CASCADE
  relation   text  NOT NULL  DEFAULT 'peer'   -- peer | mentor | mentee (코드측 allowed-set)
  created_at timestamptz NOT NULL DEFAULT now()
  PRIMARY KEY (owner_id, other_id)
  INDEX (owner_id, created_at)
```

**방향성 2행 설계.** 한 연결은 항상 **두 행**으로 저장한다. A—B가 동료면
`(A,B,'peer')` + `(B,A,'peer')`. A가 B의 멘토면 `(B,A,'mentor')`(B가 보기에 A는 멘토) +
`(A,B,'mentee')`(A가 보기에 B는 멘티).

- 이유 1 — **비대칭 관계를 자연스럽게 표현.** 멘토/멘티는 서로 다른 라벨이라, 단일 행 +
  "누가 왼쪽인가" 규칙을 두면 조회마다 방향 분기가 생긴다.
- 이유 2 — **목록 조회가 단순.** "내 동료" = `WHERE owner_id = me`. 정렬·페이징에 인덱스가
  그대로 듣는다.
- 대가 — 쓰기가 2행. 항상 **한 트랜잭션**에서 함께 쓰고 함께 지운다(§business-rules INV-2).

`relation`은 **DB CHECK를 두지 않는다.** 허용 집합은 Go 코드측 `AllowedRelations` 맵이 갖는다
(`user.Provider`와 동일한 패턴). 멘토–멘티 정식 출시 때 새 값을 추가해도 마이그레이션이 필요 없다.

### `InviteCode`

```
invite_codes
  code       text        PRIMARY KEY          -- 'K7-N4XQ' 형식
  user_id    uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE
  relation   text        NOT NULL DEFAULT 'peer'  -- 이 코드로 맺어질 관계
  created_at timestamptz NOT NULL DEFAULT now()
  expires_at timestamptz NOT NULL
  max_uses   int         NOT NULL DEFAULT 10
  uses       int         NOT NULL DEFAULT 0
  revoked_at timestamptz                       -- 재발급 시 이전 코드 무효화
  INDEX (user_id) WHERE revoked_at IS NULL
```

**코드 형식** `XX-XXXX` (하이픈 포함 7자). 알파벳은 **Crockford Base32에서 혼동 문자 제외**
(`0/O`, `1/I/L`, `U` 제외) → 사용 문자 `23456789ABCDEFGHJKMNPQRSTVWXYZ` (30자).
경우의 수 30^6 ≈ 7.3억. 대소문자 무시하고 입력 시 정규화(대문자 + 하이픈 자동 삽입).

`relation` 필드가 코드에 있는 이유: 멘토 코드(멘토가 발급 → 쓰는 사람이 멘티가 됨)를
**같은 테이블·같은 플로우**로 지원하기 위함. 지금은 항상 `peer`.

### `ColleagueRequest`

```
colleague_requests
  id           uuid        PRIMARY KEY
  from_user_id uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE
  to_user_id   uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE
  relation     text        NOT NULL DEFAULT 'peer'   -- from_user 기준 상대의 관계
  code         text                                   -- 사용된 초대 코드(감사용)
  status       text        NOT NULL DEFAULT 'pending' -- pending|accepted|declined|cancelled
  created_at   timestamptz NOT NULL DEFAULT now()
  responded_at timestamptz
  UNIQUE (from_user_id, to_user_id) WHERE status = 'pending'
```

`status`도 코드측 allowed-set. 부분 유니크 인덱스로 **중복 대기 요청 1건**만 허용.

### `Cheer`

```
cheers
  id           uuid        PRIMARY KEY
  from_user_id uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE
  to_user_id   uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE
  preset       text        NOT NULL DEFAULT ''  -- 프리셋 코드(아래) 또는 '' (자유 문구만)
  message      text        NOT NULL DEFAULT ''  -- 최대 60자
  created_at   timestamptz NOT NULL DEFAULT now()
  read_at      timestamptz
  INDEX (to_user_id, created_at DESC)
  INDEX (to_user_id) WHERE read_at IS NULL     -- 인박스 뱃지 카운트
```

프리셋(핸드오프 `ScreenCheerCompose`): `well_done`(👏 잘하고 있어요) ·
`fighting`(💪 오늘도 화이팅) · `streak`(🔥 연속 대단해요) · `rest`(🌙 무리하지 말아요).
**프리셋 문구는 서버가 소유**(코드측 맵) — 클라이언트가 임의 문자열을 preset으로 보낼 수 없다.

### `Presence`

```
user_presence
  user_id       uuid        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
  last_seen_at  timestamptz NOT NULL DEFAULT now()
  scenario_id   text        NOT NULL DEFAULT ''   -- 진행 중이던 시나리오
  label         text        NOT NULL DEFAULT ''   -- 'ICU 승압제 적정' — 표시용 스냅샷
  updated_at    timestamptz NOT NULL DEFAULT now()
```

`label`을 스냅샷으로 들고 있는 이유: 표시할 때마다 콘텐츠를 조인해 제목을 찾지 않기 위함.
시나리오 제목이 바뀌어도 "그때 뭘 하고 있었다"는 기록으로는 충분하다.

**갱신 지점**: 대화 시작(`POST /scenarios/{id}/conversation`), 시도 기록(`POST /attempts`),
`GET /me/home` 호출. 세 곳 모두 `last_seen_at`을 올린다.

### `ColleaguePrefs`

```
colleague_prefs
  user_id      uuid    PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
  share_status  bool   NOT NULL DEFAULT true   -- "지금 학습 중" 공개
  share_weekly  bool   NOT NULL DEFAULT true   -- 주간 학습 그래프 공개
  updated_at   timestamptz NOT NULL DEFAULT now()
```

행이 없으면 기본값(둘 다 공개)으로 취급 — 조회에서 `LEFT JOIN` + `COALESCE`.

### `HomeCard` (콘텐츠 파일)

멘토 쪽지·오늘의 한마디는 **콘텐츠**다. 기존 `content/` + `contentfile` 어댑터 패턴을 따른다.

```yaml
# content/home/mentor-notes.yaml
- id: mn-er-001
  dept: er            # '' = 전 부서 공통
  npc: { name: "Emma", role: "수간호사", dept: "ER" }
  text: "보호자가 화를 낼 땐 정보를 더 주기 전에 감정을 먼저 인정해줘요."

# content/home/phrases.yaml
- id: ph-001
  en: "Bear with me for a moment."
  ko: "잠시만 기다려 주시겠어요"
  note: "대기 안내에 자주 씀"
  dept: er
```

### `ShiftAssignment` (파생)

저장하지 않는다. `(user_id, 로컬 날짜)`를 시드로 결정적으로 생성:

| 필드 | 유도 |
|---|---|
| `shift` | 시드 → `DAY`/`EVENING` (핸드오프 2종) |
| `dept` | **커리큘럼의 현재 스텝이 속한 부서** — 임의값이 아니라 실제 진도 |
| `deptLabel` | 부서 콘텐츠의 표시명 ("본관 1F 응급의료센터") |
| ~~`weather`~~ | **제거**(Q1 확정) — 더미 금지 원칙. 근무·배치만으로 연출 |

## 3. 관계 (Relationships)

```
users 1─┬─* colleague_links (owner_id)     "내 동료 목록"
        ├─* colleague_links (other_id)     "나를 동료로 둔 사람"
        ├─* invite_codes                    활성 1개 + 폐기 이력
        ├─* colleague_requests (from/to)
        ├─* cheers (from/to)
        ├─1 user_presence
        └─1 colleague_prefs
```

## 4. 열거형 / Allowed-set

**모두 코드측**(DB CHECK 없음) — `feedback_extensibility` 결정 준수.

```go
// internal/domain/colleague/colleague.go
type Relation string
const (
    RelationPeer   Relation = "peer"
    RelationMentor Relation = "mentor"   // 상대가 나의 멘토
    RelationMentee Relation = "mentee"   // 상대가 나의 멘티
)
var AllowedRelations = map[Relation]bool{RelationPeer: true, RelationMentor: true, RelationMentee: true}

// 관계의 거울상 — 링크 2행을 쓸 때 반대편에 무엇을 넣을지
var MirrorRelation = map[Relation]Relation{
    RelationPeer: RelationPeer, RelationMentor: RelationMentee, RelationMentee: RelationMentor,
}

type RequestStatus string // pending | accepted | declined | cancelled
type CheerPreset  string  // well_done | fighting | streak | rest
```

## 5. SoT 매핑 (SoT → 타입)

| 핸드오프 요소 | 데이터 출처 |
|---|---|
| `ShiftBadge` DAY / 배치 / ☀27° | `ShiftAssignment` (파생) |
| `Greeting` 날짜·이름·스프라이트 | 기기 로컬 날짜 + `/me` 프로필 |
| `StreakStrip` 🔥12 / 주간 7블록 | `progress.streakCurrent` + `stats.activeDates` |
| `TodayOne` CHAPTER·제목·소요 | `/me/curriculum` 다음 스텝 |
| `MentorNote` 한 줄 + NPC | `HomeCard` (mentor-notes) |
| `PhraseOfDay` 앞/뒤 | `HomeCard` (phrases) |
| `Doors` "5건 대기중" | `/me/daily-board` 잔여 수 |
| `NextBadge` 진행바 | `progress` + 클라이언트 뱃지 카탈로그 |
| `OneReview` "radiate · 1분" | `/me/review` 첫 카드 |
| `PeerTicker` 동료 4명·오늘 점·👏 | `ColleagueLink` + `Presence` + `Cheer` |
| `ScreenColleagues` 내 코드 | `InviteCode` |
| `ScreenColleagues` 응원 인박스 | `Cheer` (미읽음) |
| `ScreenColleagueAdd` 코드 조회 | `InviteCode` → 소유자 미리보기 |
| `ScreenColleagueDetail` 주간 그래프 | 상대 `stats.activeDates` (prefs 허용 시) |
| `ScreenCheerCompose` 프리셋 4 + 60자 | `CheerPreset` + `Cheer.message` |
