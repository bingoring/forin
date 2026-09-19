---
build-spec: curriculum-v3-journey
artifact: frontend-components
updated: 2026-09-20
---

# Frontend Components — 여정 지도 (P3-B)

> 디자인 SoT: 핸드오프 v41 `08_JOURNEY_RESOURCES.md`. 토큰·컴포넌트는 **기존 NbUI를 재사용**하고
> 신규 색을 만들지 않는다. 이 문서는 그 명세를 컴포넌트 경계와 props로 옮긴 것이다.

## 1. 컴포넌트 트리

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

### `CurrentStationBar`
- **props**: `{ station: Station | null; kind: 'resume'|'next'; onPress() }`
- 화면 하단 고정. 지도 스크롤 콘텐츠의 하단 패딩이 **96px 이상**이어야 가리지 않는다(핸드오프 §5).
- `kind`는 전역 이어하기가 이 트랙 안이면 `resume`, 아니면 `next`다(J6·J7).
- `station`이 null이면(트랙 전부 통과) 구간 시험이나 자유 탐방을 권한다.

### `StationSheet`
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

| 상태 | 그림 |
|---|---|
| 로딩 | 지도 자리에 스켈레톤. 하단 바는 비워 둔다(자리 흔들림 방지) |
| 정상 | 경로 + 칩 + 하단 바 |
| 신규 학습자(진도 0) | 추론된 부서 + 첫 정거장이 `next` + 바가 그것을 가리킨다. **빈 화면이 아니다** |
| 트랙 전부 통과 | 정거장 전부 도장. 바는 구간 시험 또는 자유 탐방 |
| 오류 | 다시 시도 + 자유 탐방만이라도 보여 줄 수 있으면 보여 준다 |
| 시트 로딩 | 시트는 즉시 열고 행 자리에 스켈레톤(열림이 지연되면 탭이 씹힌 것처럼 읽힌다) |

## 5. 상호작용 · 네비게이션

| 동작 | 결과 |
|---|---|
| 정거장 탭 | `StationSheet` 열림 |
| 스텝 탭 | `/scenario/{id}?guide=` 또는 `/quiz/{id}` |
| 자유 탐방 칩 탭 | `PATCH /me/goal-dept` → 여정 재요청 → 경로 교체 |
| 목표 부서 바 탭 | 부서 고르기(같은 PATCH 경로) |
| 하단 바 탭 | 그 정거장의 시트 열림 (바로 시나리오로 보내지 않는다 — 어느 회차인지 고르게 한다) |

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
