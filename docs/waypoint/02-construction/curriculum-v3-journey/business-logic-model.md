---
build-spec: curriculum-v3-journey
artifact: business-logic-model
updated: 2026-09-20
---

# Business Logic Model — 여정 지도 (P3-B)

## 1. 주요 워크플로

### W1 — 여정 화면 열기 (`GET /me/journey`)

```
1. uid ← 요청 컨텍스트
2. p   ← learningProgress(ctx, progressRepo, uid)        // 최선 노력 4회 읽기
3. j   ← journeys.For(profession)                        // 포트
4. goal, inferred ← resolveGoalDept(ctx, users, uid, j, p)   // A1
5. tracks ← j.Tracks(p)
6. track  ← tracks 중 Dept == goal 인 것 (없으면 빈 트랙)
7. track  ← rescopeCurrent(track, p, j)                  // A2 — 트랙 안에서 현재 정거장 재계산
8. free   ← summariseFreeRoam(tracks, goal, locale)      // A3
9. 응답 { goalDept: goal, inferred, track, freeRoam: free }
```

**읽기는 한 번이다.** 진도 4회 읽기와 카탈로그 조회 한 번으로 화면이 완성된다. 홈 탭이 잡아 둔 선례
(`GET /me/home` 1왕복)를 그대로 따른다 — 화면이 세 번 읽어 그리면 그 세 조각이 서로 어긋날 수 있다.

### W2 — 정거장 탭 (`GET /me/journey/stations/{themeKey}`)

```
1. p ← learningProgress(...)
2. j ← journeys.For(profession)
3. ref, ok ← 카탈로그에서 themeKey 확인 ; !ok → 404
4. station ← j.Tracks(p) 에서 themeKey 인 CurriculumState
5. steps   ← j.Steps(themeKey, p)
6. 응답 { station, steps }
```

**지연 로드다.** 지도는 955개 주제의 스텝을 들고 다니지 않는다. 시트가 열릴 때 그 정거장 것만 받는다.

### W3 — 목표 부서 바꾸기 (`PATCH /me/goal-dept`)

```
1. dept 검증 (층이 있는 부서인가) ; 아니면 400
2. users.SetGoalDept(uid, dept)
3. 응답 { goalDept: dept, inferred: false }
4. 화면은 W1을 다시 호출해 경로를 새로 그린다
```

자유 탐방 칩과 상단 드롭다운은 **같은 이 경로**를 쓴다(J5 — 부서를 고르는 방법은 하나다).

## 2. 알고리즘

### A1 — `resolveGoalDept` (목표 부서 해석)

```
stored ← users.GoalDept(uid)
if stored != "" and campus.Of(stored) 존재:
    return stored, inferred=false
// 아직 고르지 않았거나, 저장된 부서가 콘텐츠에서 사라졌다
if p.Latest != "":
    if ref, ok := j.Locate(p.Latest); ok:
        dept ← ref 가 속한 주제의 부서
        if campus.Of(dept) 존재: return dept, inferred=true
return 학습 순서상 첫 부서(층이 있는 것), inferred=true
```

**추론값은 저장하지 않는다**(J4). 저장은 학습자가 고른 순간에만 일어난다.

### A2 — `rescopeCurrent` (트랙 안에서 현재 정거장 재계산)

```
if 트랙에 state=="here" 인 정거장이 있으면:      // 전역 판정이 이미 이 트랙 안을 가리킴
    그대로 둔다. resume 플래그도 그대로.
else:
    트랙에서 state != "passed" 인 첫 정거장을 찾아 resume=true 로 표시한다.
    (state 는 "open" 그대로 둔다 — here 로 올리면 "최근 여기 있었다"는 거짓이 된다)
if 트랙 전체가 passed:
    현재 정거장 없음. resume 플래그 0개.
```

**`here`를 지어내지 않는 것이 핵심이다.** `here`는 "최근 시도가 이 주제"라는 사실이고, 목표 부서를 막
바꾼 학습자에게는 그런 사실이 없다. 화면은 `resume` 플래그로 하단 바를 그리고, 깃발(HERE)은 `here`
상태일 때만 세운다. 그래서 바는 항상 한 곳을 가리키되 깃발은 정직하게 비어 있을 수 있다.

### A3 — `summariseFreeRoam` (자유 탐방 요약)

```
for each track in tracks:
    if track.Dept == goal: continue            // I2
    if campus.Of(track.Dept) 없음: continue    // J9 — 리프트가 설 수 없는 부서
    passed ← count(c in track.Curricula where c.State == "passed")
    total  ← len(track.Curricula)
    이름 ← 부서 표시 이름(로케일 적용)
순서: campus.Floors 순서(캠퍼스 표시 순서)
```

부서 표시 이름은 층 표기(`campus.Floor.Where`)가 아니라 **부서 이름**이다 — 칩은 장소가 아니라 부서를 가리킨다.

## 3. 상태 전이

### 정거장 (서버 → 화면)

```
             ┌──────────────────────────────────────┐
             │ 서버가 생산                            │
             │  passed ── 모든 필수 스텝 클리어        │
             │  here   ── 최근 시도가 이 주제          │
             │  open   ── 그 밖                       │
             └──────────────────────────────────────┘
                              │  화면이 해석
                              ▼
   passed → done(PASSED 도장)
   here   → here(잉크 서클 + 앰버 파선 링 + HERE 깃발)
   open   → 트랙에서 처음 만나는 open 이면 next(열린 원)
          → 그 뒤는 흐린 점선 원 (J3 — 잠금 아님)
```

**전이는 학습자의 클리어로만 일어난다.** 화면이 상태를 바꾸는 경로는 없다.

### 경로 선

```
두 이웃 정거장이 모두 passed  → 그린 실선 계열 (완료 구간)
그 밖                        → 점선 (미완)
```

## 4. 시퀀스

```
학습자            여정 화면              서버                엔진(포트)
  │ 탭 열기 ────────▶│
  │                 │ GET /me/journey ──▶│
  │                 │                   │ Tracks(p) ───────▶│
  │                 │                   │◀── []TrackGroup ──│
  │                 │◀── Journey ───────│
  │◀── 경로+칩 ──────│
  │ 정거장 탭 ───────▶│
  │                 │ GET .../stations/K ─▶│
  │                 │                   │ Steps(K,p) ──────▶│
  │                 │◀── StationDetail ─│
  │◀── 시트 ─────────│
  │ 스텝 탭 ─────────▶│ (기존 시나리오·퀴즈 라우트로 이동)
```

## 5. 통합 지점

| 지점 | 방향 | 비고 |
|---|---|---|
| `learning.Journey` | 서버 → 엔진 | `Tracks`·`Steps`·`Locate` 세 메서드만 쓴다. **새 메서드를 더하지 않는다.** |
| `campus.Of` / `campus.Floors` | 서버 → 캠퍼스 표 | 층이 있는 부서인지, 자유 탐방 순서 |
| `ports.UserRepo` | 서버 → DB | `goal_dept` 읽기·쓰기 |
| 기존 시나리오·퀴즈 라우트 | 화면 → 화면 | 스텝을 누르면 `/scenario/{id}?guide=` 또는 `/quiz/{id}` |
| `/me/curriculum` · `/me/curriculum/tracks` (구 라우트) | — | **이 스펙이 끝나면 둘 다 삭제된다**(L4.4). 어댑터 `curriculum_legacy.go`도 함께. 여정이 자리를 대신하므로 소비자가 0이 된다. |
