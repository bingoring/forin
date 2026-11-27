---
build-spec: curriculum-v3-journey
artifact: domain-entities
updated: 2026-09-20
---

# Domain Entities — 여정 지도 (P3-B)

> 이 화면이 다루는 타입은 **대부분 이미 존재한다.** L2가 `learning` 도메인에 여정의 응답 형태를 두었고,
> 엔진이 그것을 채운다. 여기서 새로 정의하는 것은 **화면 하나가 한 번에 받는 봉투**와 **목표 부서**뿐이다.
> 새 모양을 만들지 않는 것이 이 스펙의 첫 번째 규율이다 — 같은 개념에 두 번째 타입이 생기면 둘이 갈라진다.

## 1. 엔티티 개요

| 엔티티 | 신규/재사용 | 사는 곳 | 한 줄 |
|---|---|---|---|
| `Journey` | **신규(응답 봉투)** | `learning` | 여정 화면 하나가 한 번에 받는 것 |
| `TrackGroup` | 재사용 (L2) | `learning` | 한 부서의 트랙 = 정거장들 + 마일스톤 |
| `CurriculumState` | 재사용 (L2) | `learning` | 정거장 하나 = 주제 하나에 진도를 얹은 것 |
| `TierCount` | 재사용 (L2) | `learning` | 정거장 안 난이도 계단 하나의 개수 요약 |
| `Milestone` | 재사용 (L2) | `learning` | 트랙 끝의 구간 시험 |
| `StepState` | 재사용 (L2) | `learning` | 정거장 시트의 한 행 = 스텝의 한 회차 |
| `FreeRoamEntry` | **신규** | `learning` | 목표 밖 부서 하나의 칩 |
| `StationDetail` | **신규(응답 봉투)** | `learning` | 정거장 시트가 한 번에 받는 것 |
| `GoalDept` | **신규(영속)** | `user` | 학습자가 고른 목표 부서 |

## 2. 엔티티 상세

### 2.1 `Journey` — 화면 A의 응답 봉투

```go
// Journey is everything the journey screen draws, in one round trip. The home tab's
// aggregated response set this precedent: a screen that needs three reads to render
// is a screen whose parts can disagree with each other mid-render.
type Journey struct {
    GoalDept string        `json:"goalDept"`           // 그리는 트랙의 부서 코드
    Inferred bool          `json:"inferred"`           // 추론값인가(아직 고르지 않음)
    Track    TrackGroup    `json:"track"`              // 목표 부서 하나
    FreeRoam []FreeRoamEntry `json:"freeRoam"`         // 나머지 부서들
}
```

- `Inferred`가 참이면 학습자가 아직 목표를 고르지 않았고 서버가 추론해 그려 준 것이다. 화면은 이때
  목표 부서 칩을 조금 다르게 다룰 수 있다(예: "여기서 시작할까요?"). **추론값은 저장되지 않는다.**
- `Track`은 **하나**다(복수가 아니다). 29개 부서를 전부 보내면 340KB인데 화면이 그리는 것은 한 부서의
  정거장 35개뿐이다 — 한 부서만 보내면 11.7KB다.

### 2.2 `FreeRoamEntry` — 자유 탐방 칩

```go
// FreeRoamEntry is one department the learner is not aiming at. Nothing is locked:
// the chip is a door, not a preview of a door.
type FreeRoamEntry struct {
    Dept   string `json:"dept"`   // 부서 코드 — 아이콘과 라벨을 고르는 키
    Passed int    `json:"passed"` // 통과한 정거장 수 = 도장 카운트
    Total  int    `json:"total"`  // 그 부서의 정거장 수
}
```

- `Passed`가 핸드오프의 **도장 카운트**다. 정거장 통과 = 여권 PASSED 도장이라는 세계관을 따른다.
- 층이 없는 부서(GEN)는 자유 탐방에도 나오지 않는다 — 리프트가 설 수 없는 곳이라 이 화면에 자리가 없다.
- **이름은 서버가 보내지 않는다.** 클라이언트가 `dept.<CODE>` 라벨을 4개 언어로 이미 갖고 있고 아이콘도
  같은 코드로 고른다. 서버가 이름을 또 들면 두 벌이 갈라진다 — 층 표기(`Floor.Chapter`)는 챕터 제목이지
  부서 이름이 아니다.

### 2.3 `StationDetail` — 화면 B의 응답 봉투

```go
// StationDetail is one station's sheet: the station itself plus its rows. The list
// view carries counts only, so the rows are fetched when the sheet opens.
type StationDetail struct {
    Station CurriculumState `json:"station"` // 목록에 있던 것과 같은 값
    Steps   []StepState     `json:"steps"`   // 회차 단위 행
}
```

- `Station`을 다시 보내는 이유는 시트가 목록의 상태를 **믿고 그리지 않아도 되게** 하기 위해서다.
  목록을 받은 뒤 다른 기기에서 진도가 움직였을 수 있다.

### 2.4 `GoalDept` — 사용자가 고른 목표 부서

| 필드 | 타입 | 영속 | 규칙 |
|---|---|---|---|
| `profiles.goal_dept` | `text NOT NULL DEFAULT ''` | 마이그레이션 000039 | 빈 문자열 = 아직 고르지 않음 |

`users`가 아니라 `profiles`에 붙는다 — 온보딩에서 파생된 학습자 설정이 사는 곳이고 `ui_lang`·
`destination`이 이미 거기 있다. Go 쪽으로는 `user.Profile.GoalDept`이고 `GET /me`가 그대로 실어 낸다.

- **DB 제약을 걸지 않는다.** 허용 집합은 코드 쪽(`themes.yaml`에 존재하고 층이 있는 부서)에서 검증한다.
  부서는 콘텐츠가 늘면 늘어나는 값이라 DB CHECK로 굳히면 콘텐츠 추가가 마이그레이션을 요구하게 된다.
- `GET /me`가 `Profile` 안에 실어 돌려준다(`destination`·`uiLang` 옆).

## 3. 관계

```
user ──1:1── goal_dept ──▶ dept code
                             │
                             ▼
learning.Journeys ──For(profession)──▶ Journey(port)
                                         │ Tracks(p)  ─▶ []TrackGroup ──filter(goalDept)──▶ Journey.Track
                                         │                            └─summarise────────▶ Journey.FreeRoam
                                         └ Steps(theme,p) ───────────────────────────────▶ StationDetail.Steps
```

- 새 엔진도, 두 번째 조립기도 없다. **`Journey` 응답은 기존 포트 두 메서드의 조합**이다.

## 4. 열거형 / Allowed-set

| 값 | 집합 | 어디서 검증 |
|---|---|---|
| 정거장 상태 | `passed` · `here` · `open` | 서버가 생산(엔진) |
| 스텝 상태 | `done` · `now` · `lock` · `optional` | 서버가 생산(엔진) |
| 스텝 종류 | `dlg` · `quiz` · `event` · `boss` | 열린 문자열(S4) — 새 종류는 상수와 렌더러만 |
| 가이드 | `choices` · `free` | 서버가 생산 |
| 마일스톤 상태 | `passed` · `open` · `closed` | 서버가 생산 |
| 목표 부서 | 층이 있는 부서 코드 | **코드 쪽 집합**(`campus.Of`가 아는 부서) |

## 5. SoT 매핑 (핸드오프 v41 `08_JOURNEY_RESOURCES.md` → 타입)

| 핸드오프 | 우리 타입 | 비고 |
|---|---|---|
| `Track: { dept, stations[], milestones[] }` | `TrackGroup{Dept, Curricula, Milestone}` | **마일스톤은 배열이 아니라 하나** — 엔진이 트랙당 구간 시험 하나를 낸다 |
| `Station: { x, y, state, label, meta }` | `CurriculumState` | **`x`·`y`는 서버에 없다** — 지그재그 배치는 표현이므로 클라이언트가 인덱스로 계산한다 |
| `Station.label` | `CurriculumState.Name` | 로케일 적용된 주제 이름 |
| `Station.meta.sub` | `CurriculumState.Track` (`core`/`depth`) | 코어면 "공통 필수"로 읽힌다 |
| `Station.meta.collab` | `CurriculumState.CollabWith` | **현재 콘텐츠에 `collab` 트랙 주제가 0개** — 자리만 있고 그릴 것이 없다 |
| `FreeRoam: [{icon, dept, stamps}]` | `FreeRoamEntry{Dept, Passed, Total}` | `icon`도 `name`도 부서 코드로 클라이언트가 고른다 |
| `LicenseStep` (화면 C) | **N/A** | 국가 트랙은 이 스펙의 범위 밖 — 서버에 데이터 원천이 없다 |
