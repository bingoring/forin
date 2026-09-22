---
build-spec: curriculum-v3-journey
artifact: frontend-components
updated: 2026-09-22
---

# Frontend Components — 여정 지도 (P3-B)

> 디자인 SoT: 핸드오프 v41 `08_JOURNEY_RESOURCES.md`. 토큰·컴포넌트는 **기존 NbUI를 재사용**하고
> 신규 색을 만들지 않는다. 이 문서는 그 명세를 컴포넌트 경계와 props로 옮긴 것이다.

## 1. 컴포넌트 트리

> **2026-09-22 개정 — 2단 구조(P3-C).** 아래는 P3-B(이 문서가 처음 쓰인 시점)의 1단 구조다.
> 실제로 구현된 것은 이제 2단 구조다 — 근거와 규칙(K1~K8)은
> `curriculum-v3-journey-ia/build-spec-index.md`에 있고, 여기서는 옮겨 적지 않는다.
>
> ```
> JourneyScreen (일터 탭, app/(tabs)/journey.tsx) — 1단계: 주제 목록
> ├── GoalDeptBar                     목표 부서 표시 + 바꾸기 (그대로)
> ├── ThemeList                       길이 아니라 목록 — 주제 사이에 선을 그리지 않는다(K1)
> │   └── ThemeCard × n                부서 코어 / 부서 심화 두 묶음(K3), 카드당 권유 배지는
> │                                     `resume`가 참일 때만(K2, 트랙당 최대 1개)
> └── FreeRoamRow                     가로 스크롤 (그대로)
>     └── FreeRoamChip × m
>
> ThemeScreen (app/journey/theme/[themeKey].tsx) — 2단계: 정거장 뷰
> └── StationTrack                    옛 JourneyMap의 그림 언어(K4)를 이어받는다 —
>     ├── PathSegment × (n-1)         정거장 = 스텝. 잠긴 스텝도 전부 그린다(§6 — 줄이지 않는다)
>     ├── Station × n                 눌러도 걷지도 라우팅하지도 않는 것이 잠금 거절이다(K5)
>     ├── NbAvatar                    학습자 자신의 아바타가 걸어간다(K6·K7)
>     └── MilestoneFlag               트랙 끝 구간 시험(boss 스텝)
> ```
>
> `JourneyMap` 컴포넌트 자체는 이제 어느 화면도 렌더하지 않는다 — 좌표 함수(`stationPoint`)와
> 여백 상수(`BOTTOM_PAD`·`LABEL_ALLOWANCE`·`MILESTONE_ALLOWANCE`·`MILESTONE_GAP`)를
> `StationTrack`이 그대로 가져다 쓰고 `JourneyCurriculum` 타입도 여러 곳이 써서, 파일은
> 지우지 않고 남아 있다(`mobile/src/components/journey/JourneyMap.tsx` 파일 상단 코멘트 참고).
>
> 아래 §2 이후의 원문(1단 구조 기준)은 **역사 기록으로 남긴다** — `CurrentStationBar`와
> `StationSheet` 절 자체는 지우지 않되, 각 절 안에 은퇴했다는 사실과 그 일을 지금 무엇이
> 대신하는지 적어 둔다(선례: 아래 `GoalDeptBar` 절의 2026-09-21 개정, `CurrentStationBar`
> 절 자체의 진행도 개정).

```
JourneyScreen                       (일터 탭 = app/(tabs)/journey.tsx)
├── GoalDeptBar                     목표 부서 표시 + 바꾸기
├── JourneyMap                      스크롤 영역 (하단 패딩 ≥ 96)
│   ├── PathSegment × (n-1)         정거장 사이 Q-커브 점선
│   ├── Station × n                 정거장 노드 (SVG)
│   │   └── CollabRing              collab 주제에만 (현재 콘텐츠 0건)
│   └── MilestoneFlag               트랙 끝 구간 시험
├── FreeRoamRow                     가로 스크롤
│   └── FreeRoamChip × m
└── CurrentStationBar               화면 하단 고정
StationSheet                        탭 오버레이 (바텀시트)
├── TierRow × 3                     난이도 계단 요약
└── StepRow × k                     회차 단위 행
```

## 2. 컴포넌트 상세

### `JourneyScreen`
- **역할**: `GET /me/journey` 한 번을 받아 아래로 나눠 준다. 화면이 여는 유일한 네트워크 호출이다.
- **상태**: `journey | null`, `loading`, `error`, `openThemeKey | null`
- **의존**: `api.journey()`, `api.station(themeKey)`, `api.setGoalDept(dept)`

### `GoalDeptBar`
- **props**: `{ dept: string; name: string; inferred: boolean; onChange(dept): void }`
- `inferred`가 참이면 고르라고 권하는 어조로 그린다(아직 학습자의 선택이 아니므로).
- **부서 고르기는 바텀시트가 아니라 밀려 들어오는 화면이다.** 2026-09-21 개정 — 오른쪽 화살표는
  "다른 화면으로 간다"고 말하는데 바텀시트를 올리면 신호와 결과가 어긋나고, 부서가 29개라 시트
  높이로는 끝까지 보여 줄 수 없었다(실기에서 마지막 두 부서가 잘렸다). 뒤로 가면 일터 탭으로 돌아온다.

### `Station` (SVG — 핸드오프 §3 그대로)
- **props**: `{ state: 'done'|'here'|'next'|'far'; label: string; sub?: string; collab?: string; onPress() }`
- 반지름은 핸드오프가 고정했다: `here` r30 · `next` r26 · `far` r25 · `done` r24. **손글씨 4자가 들어가는
  최소치이므로 줄이지 않는다.**
- `done`은 PASSED 이중선 도장(r24 그린 서클 + r19 내부선, -12° 회전, PASSED 모노 6.5px). 온보딩 입국
  도장과 같은 문법을 쓴다.
- `here`는 앰버 파선(5 4) 링 + HERE 깃발(기둥 2px, 빨간 삼각, translate(12,-48)).
- `far`는 점선(4 3) + opacity .45. **자물쇠를 그리지 않는다**(J3) — 누를 수 있는 것이다.

### `PathSegment`
- **props**: `{ from: Point; to: Point; done: boolean }`
- Q-커브 지그재그 점선(dash 7 7), 제어점은 중간 x와 `prev.y + 14`.
- `done`(양쪽 모두 통과)이면 그린 2.6px, 아니면 `rgba(62,54,43,.28)` 2.2px.

### `MilestoneFlag`
- **props**: `{ title: string; state: 'passed'|'open'|'closed' }`
- rect 80×34 종이 + 모노 8px 타이틀(블루) + 손글씨 11px 상태. 열리기 전 opacity .55.

### `FreeRoamChip`
- **props**: `{ dept: string; name: string; passed: number; total: number; onPress() }`
- `NbPaper` 위에 부서 아이콘 17 + 손글씨 14 + 도장 카운트(모노 9 그린).
- **잠금 없음.** 누르면 목표 부서가 바뀐다(J5).

### `CurrentStationBar` — 은퇴함 (2026-09-22, P3-C)
> 1단계가 지도에서 목록(`ThemeList`, §1의 2단 구조 참고)으로 바뀌면서 화면 하단에 고정 바가
> 설 자리 자체가 없어졌다 — 목록에서는 "이어하기" 권유가 `resume`인 주제 카드 위 배지 하나로
> 충분하다(트랙당 최대 하나, 새 컴포넌트가 아니라 `ThemeList`의 `ThemeCard`가 직접 그린다).
> 아래는 있던 시절의 명세이고, 파일(`mobile/src/components/journey/CurrentStationBar.tsx`
> + 테스트)은 실제로 지워졌다. 근거: `curriculum-v3-journey-ia/build-spec-index.md` §5(K2).

- **props**: `{ station: Station | null; kind: 'resume'|'next'; onPress() }`
- 화면 하단 고정. 지도 스크롤 콘텐츠의 하단 패딩이 **96px 이상**이어야 가리지 않는다(핸드오프 §5).
- `kind`는 전역 이어하기가 이 트랙 안이면 `resume`, 아니면 `next`다(J6·J7).
- **진행도는 개수가 고정된 네모와 퍼센트로 그린다**(`NbProgScale`, 10칸). 2026-09-21 개정 — 원래는
  `NbProgSquares`로 **코스마다 네모 하나**였는데, 한 주제에 코스가 24개라 네모가 가로로 넘쳐
  **Resume 버튼을 덮었다**(실기에서 확인). 네모라는 표현은 이 앱의 언어라 남기고, 항목 수를 따라가던
  축만 걷어냈다. 스물넷을 눈으로 세는 사람은 없으므로 정확한 수치는 옆 글자가 떠맡는다.
- **양 끝은 반올림에 맡기지 않는다.** 24개 중 1개는 4%라 반올림하면 0칸이 되어 "시작도 안 함"으로
  읽히고, 99%는 올림하면 전 칸이 되어 "다 끝냄"으로 읽힌다. 하나라도 했으면 최소 한 칸, 전부
  끝내야만 전 칸이다.
- `station`이 null이면(트랙 전부 통과) 구간 시험이나 자유 탐방을 권한다.

### `StationSheet` / `StepRow` — 은퇴함 (2026-09-22, P3-C)
> 시트가 하던 일(스텝 목록을 열어 보여 준다)은 이제 화면 자체다 — 2단계 `ThemeScreen`
> (`app/journey/theme/[themeKey].tsx`)이 같은 `GET /me/journey/stations/{themeKey}`를
> 받아 `StationTrack`으로 그린다. 다만 그리는 **모양**은 목록(`StepRow` 세로 나열)이 아니라
> 지도(정거장 = 스텝, §1의 2단 구조 참고)로 바뀌었다 — 난이도 계단은 요약 행(`TierRow`)이
> 아니라 경로 위에서 어디부터 잠겼는지로 드러난다(§6, K5). `guide`가 두 회차를 가르는 것,
> `pass`/`passes`가 "1/2"로 보이는 것은 살아 있다(`StationTrack`의 `stepSub`). 잠긴 스텝을
> 회색 자물쇠 아이콘으로 바꿔 그리던 것과, `attempted`(재도전) 배지·`optional` 태그는
> 목록 행이 없어지며 함께 빠졌다 — `far`(점선·흐림)와 `next`(잠기지 않음, optional의 그림)가
> 이미 그 구분을 그림으로 옮기고 있어서다(`StationTrack.tsx`의 `stepStationState` 코멘트).
> 아래는 있던 시절의 명세이고, 파일(`StationSheet.tsx` + 테스트)은 실제로 지워졌다. 근거:
> `curriculum-v3-journey-ia/build-spec-index.md` §6.

- **props**: `{ themeKey: string; onClose() }` — 열릴 때 `GET /me/journey/stations/{themeKey}`
- 머리: 정거장 이름 · `NbProgSquares`(done/total) · 트랙 태그
- 몸: `TierRow` 3개(기초·응용·위기, 잠긴 계단은 흐리게) → `StepRow` 목록

### `StepRow`
- **props**: `{ kind; name; state; guide?; pass?; passes?; attempted?; onPress() }`
- 아이콘: `speech`(대화) · `pencil`(퀴즈) · `trophy`(시험) · `lock`(잠긴 스텝)
- **대화 하나는 두 행이다** — 도움 있는 회차와 혼자 하는 회차. `pass`/`passes`가 "1/2"·"2/2"로 보인다.
  이 사다리가 보이는 곳은 여기뿐이다(지도의 개수는 상황 단위).

## 3. 전역 · 공유 상태

| 상태 | 사는 곳 | 비고 |
|---|---|---|
| `journey` | `JourneyScreen` 로컬 | 탭을 떠나면 버린다. 진도가 다른 화면에서 움직일 수 있다 |
| 목표 부서 | **서버** | 화면은 캐시하지 않는다 |
| 탐험 모드 토글 | **기기 로컬 설정** | 홈의 병동 카드가 읽는다. 마이그레이션·계약 변경 없음 |

## 4. 화면 상태

> 아래는 1단 구조(하단 바 + 시트) 기준의 원문이다 — 하단 바·시트가 없어진 지금은 "하단 바"
> 관련 두 행과 "시트 로딩" 행이 더는 그대로 적용되지 않는다. 2단계(`ThemeScreen`)는 하단
> 바 대신 그냥 `loading`/`ok`/`error` 세 상태로 화면 전체를 그린다(§2 `StationSheet` 절 참고).

| 상태 | 그림 |
|---|---|
| 로딩 | 지도 자리에 스켈레톤. 하단 바는 비워 둔다(자리 흔들림 방지) |
| 정상 | 경로 + 칩 + 하단 바 |
| 신규 학습자(진도 0) | 추론된 부서 + 첫 정거장이 `next` + 바가 그것을 가리킨다. **빈 화면이 아니다** |
| 트랙 전부 통과 | 정거장 전부 도장. 바는 구간 시험 또는 자유 탐방 |
| 오류 | 다시 시도 + 자유 탐방만이라도 보여 줄 수 있으면 보여 준다 |
| 시트 로딩 | 시트는 즉시 열고 행 자리에 스켈레톤(열림이 지연되면 탭이 씹힌 것처럼 읽힌다) |

## 5. 상호작용 · 네비게이션

> **2026-09-22 개정 — 2단 구조(P3-C).** 아래는 1단 구조(시트 오버레이) 기준의 원문이다.
> 실제 상호작용은 바뀌었다: **주제 탭**이 새로 생겼고(1단계 → 2단계 이동), **정거장 탭의
> 결과가 "시트가 열린다"에서 "스텝이 열린다"로 바뀌었다**(시트 자체가 없어졌으므로 —
> §2 `StationSheet` 절 참고). "하단 바 탭" 행은 `CurrentStationBar`와 함께 없어졌다. 지금
> 기준의 표:

| 동작 | 결과 |
|---|---|
| 주제 카드 탭(1단계) | 2단계(`ThemeScreen`, `/journey/theme/{themeKey}`)로 이동. 잠기지 않는다(J1) |
| 정거장(스텝) 탭(2단계) | 그 스텝이 열린다 — `/scenario/{id}?guide=` 또는 `/quiz/{id}`. 스텝이 아니라 화면 자체가 목록을 대신하므로, 더는 "시트가 연다"가 아니다 |
| 잠긴 스텝 탭(2단계) | 걷지도 라우팅하지도 않는다 — 짧은 거절(K5) |
| 자유 탐방 칩 탭 | `PATCH /me/goal-dept` → 여정 재요청 → 경로 교체 |
| 목표 부서 바 탭 | 부서 고르기 화면으로 이동(같은 PATCH 경로). 뒤로 가면 일터로 돌아온다 |

> 원문(1단 구조 기준, 역사 기록):
>
> | 동작 | 결과 |
> |---|---|
> | 정거장 탭 | `StationSheet` 열림 |
> | 스텝 탭 | `/scenario/{id}?guide=` 또는 `/quiz/{id}` |
> | 자유 탐방 칩 탭 | `PATCH /me/goal-dept` → 여정 재요청 → 경로 교체 |
> | 목표 부서 바 탭 | 부서 고르기 화면으로 이동(같은 PATCH 경로). 뒤로 가면 일터로 돌아온다 |
> | 하단 바 탭 | 그 정거장의 시트 열림 (바로 시나리오로 보내지 않는다 — 어느 회차인지 고르게 한다) |

## 6. 디자인 SoT 매핑

| 핸드오프 §3 요소 | 컴포넌트 | 상태 |
|---|---|---|
| `Station` 4상태 | `Station` | `locked` → `far`로 이름을 바꿨다(잠금이 아니므로, J3) |
| 협업 링 + 라벨 | `CollabRing` | **콘텐츠 0건** — 자리만 만든다 |
| 경로 Q-커브 | `PathSegment` | 그대로 |
| 마일스톤 깃발 | `MilestoneFlag` | 트랙당 하나(핸드오프는 배열이었다) |
| 자유 탐방 칩 | `FreeRoamChip` | 그대로 |
| 타임라인 축 (C) | **N/A** | 화면 C는 이 스펙의 범위 밖 |

## 7. 사라지는 것

| 파일 | 사유 |
|---|---|
| `app/(tabs)/campus.tsx`의 장소 찾기 | 장소→부서→시나리오 깊이가 부서→주제→시나리오로 대체된다 |
| `components/campus/FloorList.tsx` · `DeptSheet.tsx` | 위와 같다 |
| 서버 `/me/curriculum` · `/me/curriculum/tracks` + `curriculum_legacy.go` | 클라이언트가 옮겨 가면 어댑터의 수명이 끝난다(L4.4). `tracks`는 여정이 대신하므로 소비자가 0이 된다 |

**인테리어는 사라지지 않는다.** 홈 탭이 이미 실시간 병동 카드에서 진입하고, 안에서 엘리베이터로 다른
층에 닿는다. 인테리어가 가리키는 시나리오 299개는 전부 손저작 범위라 v3 재생산과 무관하게 살아 있다.
