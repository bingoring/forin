# 여정 지도 (P3-B) 구현 계획

> **에이전트 작업자에게:** 이 계획은 `superpowers:subagent-driven-development`(권장) 또는
> `superpowers:executing-plans`로 태스크 단위로 실행한다. 단계는 체크박스로 추적한다.

**목표:** 일터 탭을 여정 지도로 바꾸고, 그 과정에서 L3(클라이언트 이행)와 L4.4(캠퍼스 프레젠터 삭제)를 함께 닫는다.

**구조:** 서버는 기존 도메인 포트 `learning.Journey`의 `Tracks`·`Steps`·`Locate` 세 메서드만 조합해
여정 응답을 만든다. **새 엔진도 두 번째 조립기도 만들지 않는다.** 모바일은 그 응답 하나로 화면을 그리고,
정거장 시트는 열릴 때 따로 받는다.

**기술:** Go(net/http 표준 mux · sqlc · swag 고정 버전) · React Native(Expo Router · react-native-svg · jest)

**스펙:** [`build-spec-index.md`](build-spec-index.md) 및 아티팩트 4종. 계획은 스펙에서 유도했으므로
실행자는 둘을 함께 읽는다.

## 전역 제약

- **정거장은 잠그지 않는다**(J1). 자물쇠는 난이도 계단과 스텝에만 붙는다(J2). 정거장의 흐린 점선은
  "아직 가지 않은 곳"이지 잠금이 아니다(J3).
- **추론된 목표 부서는 저장하지 않는다**(J4). 저장은 학습자가 고른 순간에만.
- **`here`를 지어내지 않는다**(A2). 트랙 안에 `here`가 없으면 `resume` 플래그만 옮긴다.
- **정거장 좌표는 서버가 모른다**(J10).
- **DB 제약을 걸지 않는다.** 부서 허용 집합은 코드 쪽(`campus.Of`).
- 계약 재생성은 고정 swag(`v2.0.0-rc5`, `$(go env GOPATH)/bin`)으로. 드리프트 0이어야 한다.
- ⚠️ **CI에 `TEST_DATABASE_URL`이 없어 실 DB 테스트는 항상 스킵된다.** 의미 있는 검증은 가짜 저장소를
  쓰는 핸들러·순수 함수 테스트에 둔다.
- 커밋 메시지에 `Co-Authored-By` 트레일러를 넣지 않는다. 서브모듈(docs/dlc) 먼저, 본체 나중.

---

## 파일 구조

| 파일 | 책임 |
|---|---|
| `server/db/migrations/000039_profile_goal_dept.{up,down}.sql` | `profiles.goal_dept` 컬럼 |
| `server/internal/domain/user/user.go` | `Profile.GoalDept` 필드 |
| `server/internal/ports/ports.go` | `UserRepo.SetGoalDept` |
| `server/internal/adapters/postgres/user_repo.go` + `db/queries/user.sql` | 컬럼 읽기·쓰기 |
| `server/internal/adapters/http/journey.go` | **순수 함수 3종**(A1·A2·A3) — 테스트가 붙는 곳 |
| `server/internal/adapters/http/journey_handler.go` | 라우트 3개의 배선 |
| `server/internal/adapters/http/journey_test.go` | 순수 함수 테스트 |
| `server/internal/adapters/http/journey_handler_test.go` | 핸들러 테스트 |
| `mobile/src/components/journey/Station.tsx` | 정거장 노드 SVG(4상태) |
| `mobile/src/components/journey/PathSegment.tsx` | 정거장 사이 곡선 |
| `mobile/src/components/journey/JourneyMap.tsx` | 배치 + 마일스톤 |
| `mobile/src/components/journey/FreeRoamRow.tsx` | 자유 탐방 칩 |
| `mobile/src/components/journey/CurrentStationBar.tsx` | 하단 고정 바 |
| `mobile/src/components/journey/StationSheet.tsx` | 정거장 시트(계단 + 스텝 행) |
| `mobile/src/app/(tabs)/journey.tsx` | 화면 조립 |

**순수 함수를 핸들러에서 분리하는 이유**: A1~A3은 이 스펙의 판단이 전부 들어 있는 곳이고, HTTP 없이
테스트할 수 있어야 한다. 핸들러는 읽고 부르고 쓰는 일만 한다.

---

## Task 1: 목표 부서 영속

**파일**
- 생성: `server/db/migrations/000039_profile_goal_dept.up.sql` · `.down.sql`
- 수정: `server/internal/domain/user/user.go` (Profile) · `server/internal/ports/ports.go` (UserRepo)
- 수정: `server/db/queries/user.sql` · `server/internal/adapters/postgres/user_repo.go`

**인터페이스**
- 생산: `user.Profile.GoalDept string` (json `goalDept`) · `UserRepo.SetGoalDept(ctx, userID, dept string) error`

- [ ] **1.1 마이그레이션 작성**

```sql
-- 000039_profile_goal_dept.up.sql
-- 학습자가 고른 목표 부서. 여정 지도가 그리는 트랙이 이 값으로 정해진다.
-- 빈 문자열 = 아직 고르지 않음 → 서버가 읽는 시점에 추론하되 저장하지 않는다(J4).
-- CHECK 제약을 걸지 않는 이유: 부서는 콘텐츠가 늘면 늘어나는 값이라, DB에 굳히면
-- 부서 하나를 더하는 일이 마이그레이션을 요구하게 된다. 허용 집합은 코드 쪽(campus.Of)이다.
ALTER TABLE profiles ADD COLUMN goal_dept text NOT NULL DEFAULT '';
```

```sql
-- 000039_profile_goal_dept.down.sql
ALTER TABLE profiles DROP COLUMN IF EXISTS goal_dept;
```

- [ ] **1.2 도메인 필드 추가**

`user.Profile`에 `UILang` 바로 아래로:

```go
	// GoalDept is the department whose track the journey map draws. "" means the
	// learner has not chosen one yet, and the server infers a starting point per
	// request WITHOUT persisting it — a path picked for you is not a path you chose.
	GoalDept string `json:"goalDept,omitempty"`
```

- [ ] **1.3 포트에 쓰기 메서드 추가**

`ports.UserRepo`에 `SetUILang` 아래로:

```go
	// SetGoalDept persists the learner's chosen journey department. Kept apart from
	// UpdateProfile, which is a full onboarding upsert.
	SetGoalDept(ctx context.Context, userID, dept string) error
```

- [ ] **1.4 쿼리와 저장소 구현** — `db/queries/user.sql`의 프로필 SELECT/UPSERT에 `goal_dept`를 더하고,
  `SetUILang`과 같은 모양으로 `SetGoalDept`를 쓴다. `sqlc generate` 후 `go build ./...`.

- [ ] **1.5 빌드 확인**

실행: `cd server && sqlc generate && go build ./...`
기대: 통과. (실 DB 왕복 테스트는 `TEST_DATABASE_URL`이 없는 CI에서 스킵되므로 여기서는 빌드만 본다.)

- [ ] **1.6 커밋**

```bash
git add server/db server/internal/domain/user server/internal/ports server/internal/adapters/postgres
git commit -m "feat(user): 목표 부서(goal_dept) 영속 — 여정 지도가 그릴 트랙"
```

---

## Task 2: 목표 부서 해석 (A1)

**파일**
- 생성: `server/internal/adapters/http/journey.go` · `server/internal/adapters/http/journey_test.go`

**인터페이스**
- 소비: `learning.Journey`(L2 포트) · `campus.Of(dept)` · `learning.Progress`
- 생산: `func resolveGoalDept(stored string, j learning.Journey, p learning.Progress, tracks []learning.TrackGroup) (dept string, inferred bool)`

- [ ] **2.1 실패하는 테스트 작성**

```go
package http

import (
	"testing"

	"github.com/bingoring/forin/server/internal/domain/learning"
)

// 트랙 두 개를 흉내 낸다: ER(본관 1F)과 WARD(본관 8F). 둘 다 층이 있는 부서다.
func fakeTracks() []learning.TrackGroup {
	return []learning.TrackGroup{
		{Dept: "ER", Curricula: []learning.CurriculumState{{ThemeKey: "core-safety-er", State: "open"}}},
		{Dept: "WARD", Curricula: []learning.CurriculumState{{ThemeKey: "core-safety-ward", State: "open"}}},
		{Dept: "GEN", Curricula: []learning.CurriculumState{{ThemeKey: "gen-call-light", State: "open"}}},
	}
}

func TestResolveGoalDept_StoredChoiceWins(t *testing.T) {
	dept, inferred := resolveGoalDept("WARD", nil, learning.Progress{}, fakeTracks())
	if dept != "WARD" || inferred {
		t.Fatalf("a stored choice is the answer: got %q inferred=%v", dept, inferred)
	}
}

func TestResolveGoalDept_InfersFromLatestAttempt(t *testing.T) {
	j := journeyStub{locate: map[learning.ScenarioID]learning.StepRef{
		"SCN-WARD-1": {Theme: "core-safety-ward", Found: true},
	}, themeDept: map[learning.ThemeKey]string{"core-safety-ward": "WARD"}}
	dept, inferred := resolveGoalDept("", j, learning.Progress{Latest: "SCN-WARD-1"}, fakeTracks())
	if dept != "WARD" || !inferred {
		t.Fatalf("an unset goal follows the latest attempt: got %q inferred=%v", dept, inferred)
	}
}

func TestResolveGoalDept_FallsBackToFirstDeptWithAFloor(t *testing.T) {
	dept, inferred := resolveGoalDept("", journeyStub{}, learning.Progress{}, fakeTracks())
	if dept != "ER" || !inferred {
		t.Fatalf("a learner who has done nothing starts at the first reachable dept: got %q", dept)
	}
}

// 층이 없는 부서(GEN)는 목표가 될 수 없다 — 리프트가 설 수 없는 곳이다(J9).
func TestResolveGoalDept_NeverPicksADeptWithNoFloor(t *testing.T) {
	if dept, _ := resolveGoalDept("GEN", journeyStub{}, learning.Progress{}, fakeTracks()); dept == "GEN" {
		t.Fatalf("GEN has no floor; the journey cannot draw it")
	}
}
```

- [ ] **2.2 스텁 작성** — 같은 파일에:

```go
// journeyStub is a learning.Journey that answers only what a test asks about.
type journeyStub struct {
	locate    map[learning.ScenarioID]learning.StepRef
	themeDept map[learning.ThemeKey]string
	steps     []learning.StepState
	tracks    []learning.TrackGroup
}

func (s journeyStub) Tracks(learning.Progress) []learning.TrackGroup { return s.tracks }
func (s journeyStub) Next(learning.Progress, learning.ScenarioID) learning.StepRef {
	return learning.StepRef{}
}
func (s journeyStub) Resume(learning.Progress) learning.StepRef { return learning.StepRef{} }
func (s journeyStub) Guidance(learning.ScenarioID, learning.Progress) learning.GuideLevel {
	return learning.GuideFree
}
func (s journeyStub) Locate(id learning.ScenarioID) (learning.StepRef, bool) {
	ref, ok := s.locate[id]
	return ref, ok
}
func (s journeyStub) Steps(learning.ThemeKey, learning.Progress) []learning.StepState { return s.steps }
```

- [ ] **2.3 테스트 실패 확인**

실행: `cd server && go test ./internal/adapters/http/ -run TestResolveGoalDept -v`
기대: `undefined: resolveGoalDept` 로 빌드 실패

- [ ] **2.4 구현**

```go
// resolveGoalDept decides which department's track the journey draws.
//
// A stored choice wins. Without one, the latest attempt's department is the honest
// guess — it is where the learner actually is. With no attempts either, the first
// department the lift can reach starts them somewhere rather than nowhere.
//
// An inferred answer is NOT persisted (J4): a path picked for you is not a path you
// chose, and a learner who plays one scenario out of curiosity should not find their
// goal moved.
func resolveGoalDept(stored string, j learning.Journey, p learning.Progress, tracks []learning.TrackGroup) (string, bool) {
	if stored != "" {
		if _, ok := campus.Of(stored); ok {
			return stored, false
		}
		// The stored department left the content. Fall through to inference rather
		// than drawing an empty path for a department that no longer exists.
	}
	if j != nil && p.Latest != "" {
		if ref, ok := j.Locate(p.Latest); ok {
			if dept := deptOfTheme(ref.Theme, tracks); dept != "" {
				if _, ok := campus.Of(dept); ok {
					return dept, true
				}
			}
		}
	}
	for _, tg := range tracks {
		if _, ok := campus.Of(tg.Dept); ok {
			return tg.Dept, true
		}
	}
	return "", true
}

// deptOfTheme finds which track a theme belongs to.
func deptOfTheme(theme learning.ThemeKey, tracks []learning.TrackGroup) string {
	for _, tg := range tracks {
		for _, c := range tg.Curricula {
			if c.ThemeKey == string(theme) {
				return tg.Dept
			}
		}
	}
	return ""
}
```

- [ ] **2.5 테스트 통과 확인**

실행: `cd server && go test ./internal/adapters/http/ -run TestResolveGoalDept -v`
기대: 4건 PASS

- [ ] **2.6 커밋**

```bash
git add server/internal/adapters/http/journey.go server/internal/adapters/http/journey_test.go
git commit -m "feat(journey): 목표 부서 해석 — 고른 것이 이기고, 추론은 저장하지 않는다"
```

---

## Task 3: 트랙 한정 현재 정거장 (A2)

**파일**
- 수정: `server/internal/adapters/http/journey.go` · `journey_test.go`

**인터페이스**
- 생산: `func rescopeCurrent(track learning.TrackGroup) learning.TrackGroup`

- [ ] **3.1 실패하는 테스트 작성**

```go
func TestRescopeCurrent_KeepsHereWhenItIsInThisTrack(t *testing.T) {
	in := learning.TrackGroup{Dept: "ER", Curricula: []learning.CurriculumState{
		{ThemeKey: "a", State: "passed"},
		{ThemeKey: "b", State: "here", Resume: true},
		{ThemeKey: "c", State: "open"},
	}}
	out := rescopeCurrent(in)
	if out.Curricula[1].State != "here" || !out.Curricula[1].Resume {
		t.Fatalf("an existing here stays: %+v", out.Curricula[1])
	}
	if out.Curricula[2].Resume {
		t.Errorf("the view must not add a second resume target")
	}
}

// 목표 부서를 막 바꾼 학습자: 최근 시도는 다른 부서라 이 트랙에 here가 없다.
func TestRescopeCurrent_PointsAtFirstUnfinishedWithoutInventingHere(t *testing.T) {
	in := learning.TrackGroup{Dept: "ER", Curricula: []learning.CurriculumState{
		{ThemeKey: "a", State: "passed"},
		{ThemeKey: "b", State: "open"},
		{ThemeKey: "c", State: "open"},
	}}
	out := rescopeCurrent(in)
	if !out.Curricula[1].Resume {
		t.Fatalf("the first unfinished station becomes the target: %+v", out.Curricula)
	}
	if out.Curricula[1].State != "open" {
		t.Errorf(`state must stay "open": promoting it to "here" would claim the learner was just there, which is false`)
	}
	n := 0
	for _, c := range out.Curricula {
		if c.Resume {
			n++
		}
	}
	if n != 1 {
		t.Errorf("exactly one target, got %d", n)
	}
}

func TestRescopeCurrent_NoTargetWhenEverythingIsPassed(t *testing.T) {
	in := learning.TrackGroup{Dept: "ER", Curricula: []learning.CurriculumState{
		{ThemeKey: "a", State: "passed"}, {ThemeKey: "b", State: "passed"},
	}}
	for _, c := range rescopeCurrent(in).Curricula {
		if c.Resume {
			t.Fatalf("a finished track has nothing to continue: %+v", c)
		}
	}
}
```

- [ ] **3.2 테스트 실패 확인**

실행: `cd server && go test ./internal/adapters/http/ -run TestRescopeCurrent -v`
기대: `undefined: rescopeCurrent`

- [ ] **3.3 구현**

```go
// rescopeCurrent makes sure the drawn track names exactly one place to continue.
//
// The engine's here/resume are GLOBAL: they follow the latest attempt, which may sit
// in a department this screen is not drawing. Then the map would have no current
// station at all. So when this track has none, the first unfinished station becomes
// the target — but its STATE stays "open". Promoting it to "here" would claim the
// learner was just there, and they were not; the flag says "continue here", the state
// says "you have been here", and only one of those is true.
func rescopeCurrent(track learning.TrackGroup) learning.TrackGroup {
	for _, c := range track.Curricula {
		if c.State == "here" {
			return track // the global answer already points inside this track
		}
	}
	out := track
	out.Curricula = append([]learning.CurriculumState(nil), track.Curricula...)
	for i := range out.Curricula {
		out.Curricula[i].Resume = false
	}
	for i := range out.Curricula {
		if out.Curricula[i].State != "passed" {
			out.Curricula[i].Resume = true
			break
		}
	}
	return out
}
```

- [ ] **3.4 테스트 통과 확인**

실행: `cd server && go test ./internal/adapters/http/ -run TestRescopeCurrent -v`
기대: 3건 PASS

- [ ] **3.5 커밋**

```bash
git add server/internal/adapters/http/journey.go server/internal/adapters/http/journey_test.go
git commit -m "feat(journey): 트랙 한정 현재 정거장 — here를 지어내지 않는다"
```

---

## Task 4: 자유 탐방 요약 (A3)

**파일**
- 수정: `server/internal/adapters/http/journey.go` · `journey_test.go`
- 수정: `server/internal/domain/learning/ports.go` (`FreeRoamEntry`, `Journey` 응답 타입)

**인터페이스**
- 생산: `learning.FreeRoamEntry{Dept, Name, Passed, Total}` · `learning.JourneyView{GoalDept, Inferred, Track, FreeRoam}`
- 생산: `func summariseFreeRoam(tracks []learning.TrackGroup, goal string) []learning.FreeRoamEntry`

- [ ] **4.1 도메인 타입 추가** — `learning/ports.go`의 `TrackGroup` 아래로:

```go
// FreeRoamEntry is one department the learner is not aiming at. Nothing is locked:
// the chip is a door, not a preview of one.
type FreeRoamEntry struct {
	Dept   string `json:"dept"` // 부서 코드 — 아이콘과 라벨을 고르는 키
	Passed int    `json:"passed"` // 통과한 정거장 수 = 도장 카운트
	Total  int    `json:"total"`
}

// JourneyView is everything the journey screen draws, in one round trip. Sending all
// 29 departments would be 340KB against the 11.7KB the screen actually renders.
type JourneyView struct {
	GoalDept string          `json:"goalDept"`
	Inferred bool            `json:"inferred"`
	Track    TrackGroup      `json:"track"`
	FreeRoam []FreeRoamEntry `json:"freeRoam"`
}
```

- [ ] **4.2 실패하는 테스트 작성**

```go
func TestSummariseFreeRoam_ExcludesTheGoalAndFloorlessDepts(t *testing.T) {
	got := summariseFreeRoam(fakeTracks(), "ER")
	for _, e := range got {
		if e.Dept == "ER" {
			t.Errorf("the goal department belongs to the path, not the chips")
		}
		if e.Dept == "GEN" {
			t.Errorf("GEN has no floor; the lift cannot stop there")
		}
	}
	if len(got) != 1 || got[0].Dept != "WARD" {
		t.Fatalf("want only WARD, got %+v", got)
	}
}

func TestSummariseFreeRoam_StampsArePassedStations(t *testing.T) {
	tracks := []learning.TrackGroup{{Dept: "WARD", Curricula: []learning.CurriculumState{
		{State: "passed"}, {State: "passed"}, {State: "open"},
	}}}
	got := summariseFreeRoam(tracks, "ER")
	if got[0].Passed != 2 || got[0].Total != 3 {
		t.Fatalf("stamps count passed stations: got %d/%d", got[0].Passed, got[0].Total)
	}
}
```

- [ ] **4.3 테스트 실패 확인**

실행: `cd server && go test ./internal/adapters/http/ -run TestSummariseFreeRoam -v`
기대: `undefined: summariseFreeRoam`

- [ ] **4.4 구현**

```go
// summariseFreeRoam is the roster of departments the learner is not aiming at.
//
// Stamps count PASSED STATIONS, not cleared scenarios: passing a station is the
// passport stamp in this world, and scenario counts differ per department so they
// would not compare. Order follows the campus directory so the chips read in the same
// sequence as the lift.
func summariseFreeRoam(tracks []learning.TrackGroup, goal string) []learning.FreeRoamEntry {
	byDept := map[string]learning.FreeRoamEntry{}
	for _, tg := range tracks {
		if tg.Dept == goal {
			continue
		}
		if _, ok := campus.Of(tg.Dept); !ok {
			continue // the lift cannot stop here (J9)
		}
		e := learning.FreeRoamEntry{Dept: tg.Dept, Total: len(tg.Curricula)}
		for _, c := range tg.Curricula {
			if c.State == "passed" {
				e.Passed++
			}
		}
		byDept[tg.Dept] = e
	}
	out := []learning.FreeRoamEntry{}
	for _, fl := range campus.Floors {
		for _, d := range fl.Depts {
			if e, ok := byDept[d]; ok {
				out = append(out, e)
				delete(byDept, d)
			}
		}
	}
	return out
}

// 이름은 여기서 붙이지 않는다: 클라이언트가 `dept.<CODE>` 라벨을 4개 언어로 이미 갖고 있고 아이콘도
// 같은 코드로 고른다. 서버가 또 들면 두 벌이 갈라진다.
```

- [ ] **4.5 테스트 통과 확인**

실행: `cd server && go test ./internal/adapters/http/ -run TestSummariseFreeRoam -v`
기대: 2건 PASS

- [ ] **4.6 커밋**

```bash
git add server/internal/domain/learning server/internal/adapters/http
git commit -m "feat(journey): 자유 탐방 요약 — 도장은 통과한 정거장 수다"
```

---

## Task 5: `GET /me/journey` 배선

**파일**
- 생성: `server/internal/adapters/http/journey_handler.go` · `journey_handler_test.go`
- 수정: `server/internal/adapters/http/router.go` (Deps에 `Users` 이미 있음 · 라우트 등록)

**인터페이스**
- 소비: `resolveGoalDept` · `rescopeCurrent` · `summariseFreeRoam` · `journeyFor` · `learningProgress`(둘 다 L2가 만든 것)
- 생산: `type journeyHandler struct{ progress ports.ProgressRepo; users ports.UserRepo; journeys learning.Journeys }`

- [ ] **5.1 실패하는 테스트 작성**

```go
func TestJourney_DrawsOneTrackAndTheRestAsChips(t *testing.T) {
	h := &journeyHandler{
		progress: journeyProgress{},
		users:    fakeUsers{goal: "WARD"},
		journeys: stubJourneys{j: journeyStub{tracks: fakeTracks()}},
	}
	var out learning.JourneyView
	getJSON(t, h.journey, "/me/journey", &out)

	if out.GoalDept != "WARD" || out.Inferred {
		t.Fatalf("a stored goal is drawn as chosen: %+v", out)
	}
	if out.Track.Dept != "WARD" {
		t.Fatalf("the drawn track is the goal department: %q", out.Track.Dept)
	}
	for _, e := range out.FreeRoam {
		if e.Dept == "WARD" {
			t.Errorf("the goal must not also be a chip")
		}
	}
}

func TestJourney_UnknownGoalFallsBackRatherThanDrawingNothing(t *testing.T) {
	h := &journeyHandler{
		progress: journeyProgress{},
		users:    fakeUsers{goal: "NOSUCHDEPT"},
		journeys: stubJourneys{j: journeyStub{tracks: fakeTracks()}},
	}
	var out learning.JourneyView
	getJSON(t, h.journey, "/me/journey", &out)
	if out.Track.Dept == "" || !out.Inferred {
		t.Fatalf("a goal that left the content falls back to inference: %+v", out)
	}
}

func TestJourney_NoRegistryIsEmptyNotError(t *testing.T) {
	h := &journeyHandler{progress: journeyProgress{}, users: fakeUsers{}}
	var out learning.JourneyView
	getJSON(t, h.journey, "/me/journey", &out)
	if out.FreeRoam == nil {
		t.Errorf("an unwired server serves an empty list, not null")
	}
}
```

가짜 저장소(같은 파일). **`fakeProgress`를 재사용하지 않는다** — 그것은 `curriculum_tracks_test.go`에
살고 T14가 그 파일을 지운다. 같은 패키지에 같은 이름이 둘이면 컴파일도 깨진다.

```go
// journeyProgress is this file's own progress stub. It must not be named fakeProgress:
// that one lives in curriculum_tracks_test.go, which Task 14 deletes.
type journeyProgress struct{ ports.ProgressRepo }

func (journeyProgress) ClearedScenarioIDs(context.Context, string) (map[string]bool, error) {
	return nil, nil
}
func (journeyProgress) AttemptedScenarioIDs(context.Context, string) (map[string]bool, error) {
	return nil, nil
}
func (journeyProgress) LatestAttemptScenarioID(context.Context, string) (string, error) { return "", nil }
func (journeyProgress) ClearedByGuide(context.Context, string) (map[string]bool, map[string]bool, error) {
	return nil, nil, nil
}

type fakeUsers struct {
	ports.UserRepo // 나머지 호출은 패닉 — 핸들러가 다른 것을 만지지 않음을 증명한다
	goal string
	set  string
}

func (f fakeUsers) GetProfile(context.Context, string) (*user.Profile, error) {
	return &user.Profile{GoalDept: f.goal}, nil
}
func (f *fakeUsers) SetGoalDept(_ context.Context, _, dept string) error { f.set = dept; return nil }

type stubJourneys struct{ j learning.Journey }

func (s stubJourneys) For(learning.Profession) learning.Journey { return s.j }
```

- [ ] **5.2 테스트 실패 확인**

실행: `cd server && go test ./internal/adapters/http/ -run TestJourney_ -v`
기대: `undefined: journeyHandler`

- [ ] **5.3 구현**

```go
// @Summary 여정 지도 — 목표 부서 트랙 + 자유 탐방
// @Tags progress
// @Security Bearer
// @Success 200 {object} learning.JourneyView
// @Router /me/journey [get]
//
// One round trip draws the screen. The home tab set this precedent: a screen that
// needs three reads to render is a screen whose parts can disagree mid-render.
func (h *journeyHandler) journey(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	p := learningProgress(ctx, h.progress, uid)
	j := journeyFor(ctx, h.journeys)
	tracks := j.Tracks(p)

	stored := ""
	if h.users != nil {
		if prof, err := h.users.GetProfile(ctx, uid); err == nil && prof != nil {
			stored = prof.GoalDept
		}
		// A failed profile read degrades to inference, not to an error: the learner
		// asked to see their journey, and we can still draw one.
	}
	goal, inferred := resolveGoalDept(stored, j, p, tracks)

	view := learning.JourneyView{
		GoalDept: goal,
		Inferred: inferred,
		FreeRoam: summariseFreeRoam(tracks, goal),
	}
	for _, tg := range tracks {
		if tg.Dept == goal {
			view.Track = rescopeCurrent(tg)
			break
		}
	}
	if view.Track.Curricula == nil {
		view.Track.Curricula = []learning.CurriculumState{}
	}
	httpx.JSON(w, http.StatusOK, view)
}
```

- [ ] **5.4 라우트 등록** — `router.go`의 진도 구역에:

```go
	jh := &journeyHandler{progress: d.Progress, users: d.Users, journeys: d.Journeys}
	mux.Handle("GET /me/journey", auth(http.HandlerFunc(jh.journey)))
```

- [ ] **5.5 테스트 통과 확인**

실행: `cd server && go test ./internal/adapters/http/ -count=1`
기대: 전건 PASS

- [ ] **5.6 커밋**

```bash
git add server/internal/adapters/http
git commit -m "feat(journey): GET /me/journey — 한 왕복으로 여정 화면을 채운다"
```

---

## Task 6: `GET /me/journey/stations/{themeKey}`

**파일**
- 수정: `server/internal/adapters/http/journey_handler.go` · `journey_handler_test.go` · `router.go`
- 수정: `server/internal/domain/learning/ports.go` (`StationDetail`)

**인터페이스**
- 생산: `learning.StationDetail{Station CurriculumState, Steps []StepState}`

- [ ] **6.1 도메인 타입 추가**

```go
// StationDetail is one station's sheet: the station itself plus its rows. The list
// view carries counts only, so the rows are fetched when the sheet opens — the map
// does not carry 955 themes' worth of steps.
//
// Station is re-sent rather than trusted from the list: progress can have moved on
// another device since the map was drawn.
type StationDetail struct {
	Station CurriculumState `json:"station"`
	Steps   []StepState     `json:"steps"`
}
```

- [ ] **6.2 테스트 헬퍼 정의** — `journey_handler_test.go`에. 기존 `getJSON`(`model_answer_handler_test.go`)은
      경로 변수를 심지 못하고 PATCH도 못 보낸다.

```go
// getJSONPath는 net/http의 경로 변수를 심어 핸들러를 직접 부른다(라우터를 거치지 않는다).
func getJSONPath(t *testing.T, h http.HandlerFunc, path, key, val string, out any) {
	t.Helper()
	r := httptest.NewRequest(http.MethodGet, path, nil)
	r.SetPathValue(key, val)
	w := httptest.NewRecorder()
	h(w, r)
	if err := json.NewDecoder(w.Body).Decode(out); err != nil {
		t.Fatalf("decode: %v", err)
	}
}

func getStatusPath(t *testing.T, h http.HandlerFunc, path, key, val string) int {
	t.Helper()
	r := httptest.NewRequest(http.MethodGet, path, nil)
	r.SetPathValue(key, val)
	w := httptest.NewRecorder()
	h(w, r)
	return w.Code
}

func patchJSON(t *testing.T, h http.HandlerFunc, path, body string) int {
	t.Helper()
	w := httptest.NewRecorder()
	h(w, httptest.NewRequest(http.MethodPatch, path, strings.NewReader(body)))
	return w.Code
}
```

- [ ] **6.3 실패하는 테스트 작성**

```go
func TestStation_ReturnsRowsForAKnownTheme(t *testing.T) {
	h := &journeyHandler{
		progress: journeyProgress{},
		journeys: stubJourneys{j: journeyStub{
			tracks: []learning.TrackGroup{{Dept: "ER", Curricula: []learning.CurriculumState{
				{ThemeKey: "core-safety-er", Name: "안전", Total: 2},
			}}},
			steps: []learning.StepState{
				{Kind: "dlg", Name: "신원확인", ScenarioID: "SCN-ER-1", State: "now", Pass: 1, Passes: 2},
				{Kind: "dlg", Name: "신원확인", ScenarioID: "SCN-ER-1", State: "lock", Pass: 2, Passes: 2},
			},
		}},
	}
	var out learning.StationDetail
	getJSONPath(t, h.station, "/me/journey/stations/core-safety-er", "themeKey", "core-safety-er", &out)

	if out.Station.ThemeKey != "core-safety-er" {
		t.Fatalf("the sheet re-sends its station: %+v", out.Station)
	}
	if len(out.Steps) != 2 || out.Steps[0].Pass != 1 || out.Steps[1].Pass != 2 {
		t.Fatalf("one dialogue is two rows, guided then alone: %+v", out.Steps)
	}
}

func TestStation_UnknownThemeIs404(t *testing.T) {
	h := &journeyHandler{progress: journeyProgress{}, journeys: stubJourneys{j: journeyStub{}}}
	code := getStatusPath(t, h.station, "/me/journey/stations/nope", "themeKey", "nope")
	if code != http.StatusNotFound {
		t.Fatalf("an unknown theme is 404, not an empty sheet: a silent blank hides a content accident, got %d", code)
	}
}
```

- [ ] **6.4 테스트 실패 확인**

실행: `cd server && go test ./internal/adapters/http/ -run TestStation_ -v`
기대: `undefined: h.station`

- [ ] **6.5 구현**

```go
// @Summary 정거장 상세 — 그 주제의 스텝 목록 (지연 로드)
// @Tags progress
// @Security Bearer
// @Success 200 {object} learning.StationDetail
// @Router /me/journey/stations/{themeKey} [get]
func (h *journeyHandler) station(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	key := r.PathValue("themeKey")
	p := learningProgress(ctx, h.progress, uid)
	j := journeyFor(ctx, h.journeys)

	var found *learning.CurriculumState
	for _, tg := range j.Tracks(p) {
		for i := range tg.Curricula {
			if tg.Curricula[i].ThemeKey == key {
				found = &tg.Curricula[i]
				break
			}
		}
	}
	if found == nil {
		httpx.Error(w, http.StatusNotFound, "unknown theme")
		return
	}
	steps := j.Steps(learning.ThemeKey(key), p)
	if steps == nil {
		steps = []learning.StepState{}
	}
	httpx.JSON(w, http.StatusOK, learning.StationDetail{Station: *found, Steps: steps})
}
```

- [ ] **6.6 라우트 등록**

```go
	mux.Handle("GET /me/journey/stations/{themeKey}", auth(http.HandlerFunc(jh.station)))
```

- [ ] **6.7 테스트 통과 확인**

실행: `cd server && go test ./internal/adapters/http/ -count=1`
기대: 전건 PASS

- [ ] **6.8 커밋**

```bash
git add server/internal/domain/learning server/internal/adapters/http
git commit -m "feat(journey): 정거장 상세 — 시트가 열릴 때만 스텝을 받는다"
```

---

## Task 7: `PATCH /me/goal-dept` + 계약

**파일**
- 수정: `server/internal/adapters/http/journey_handler.go` · `journey_handler_test.go` · `router.go`
- 재생성: `packages/contract/`

- [ ] **7.1 실패하는 테스트 작성**

```go
func TestSetGoalDept_PersistsAKnownDepartment(t *testing.T) {
	users := &fakeUsers{}
	h := &journeyHandler{users: users}
	code := patchJSON(t, h.setGoalDept, "/me/goal-dept", `{"dept":"WARD"}`)
	if code != http.StatusOK || users.set != "WARD" {
		t.Fatalf("a known department is stored: code=%d set=%q", code, users.set)
	}
}

func TestSetGoalDept_RejectsADepartmentTheLiftCannotReach(t *testing.T) {
	users := &fakeUsers{}
	h := &journeyHandler{users: users}
	if code := patchJSON(t, h.setGoalDept, "/me/goal-dept", `{"dept":"GEN"}`); code != http.StatusBadRequest {
		t.Fatalf("GEN has no floor; the journey cannot draw it, got %d", code)
	}
	if users.set != "" {
		t.Errorf("a rejected department must not be written")
	}
}
```

- [ ] **7.2 테스트 실패 확인**

실행: `cd server && go test ./internal/adapters/http/ -run TestSetGoalDept -v`
기대: `undefined: h.setGoalDept`

- [ ] **7.3 구현**

```go
type goalDeptReq struct {
	Dept string `json:"dept"`
}

// @Summary 목표 부서 선택 — 여정이 그릴 트랙
// @Tags user
// @Security Bearer
// @Param body body goalDeptReq true "department code"
// @Success 200 {object} map[string]any
// @Router /me/goal-dept [patch]
//
// The allowed set is code-side (a department the lift can reach), not a DB CHECK:
// departments grow with content, and a constraint would make adding one a migration.
func (h *journeyHandler) setGoalDept(w http.ResponseWriter, r *http.Request) {
	var req goalDeptReq
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "dept is required")
		return
	}
	if _, ok := campus.Of(req.Dept); !ok {
		httpx.Error(w, http.StatusBadRequest, "unknown department")
		return
	}
	uid, _ := UserID(r.Context())
	if err := h.users.SetGoalDept(r.Context(), uid, req.Dept); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not save goal department")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"goalDept": req.Dept, "inferred": false})
}
```

- [ ] **7.4 라우트 등록**

```go
	mux.Handle("PATCH /me/goal-dept", auth(http.HandlerFunc(jh.setGoalDept)))
```

- [ ] **7.5 계약 재생성 + 드리프트 확인**

실행:
```bash
cd server && PATH="$(go env GOPATH)/bin:$PATH" make contract
cd .. && git status --short packages/contract
```
기대: 새 엔드포인트 3개가 계약에 나타난다(이건 드리프트가 아니라 의도한 변경이다). `go test ./...` 그린.

- [ ] **7.6 커밋**

```bash
git add server packages/contract
git commit -m "feat(journey): PATCH /me/goal-dept + 계약 재생성"
```

---

## Task 8: 모바일 API 클라이언트와 타입

**파일**
- 수정: `mobile/src/api/client.ts`

**인터페이스**
- 생산: `JourneyView` · `FreeRoamEntry` · `StationDetail` · `JourneyStep` 타입, `api.journey()` · `api.station(key)` · `api.setGoalDept(dept)`

- [ ] **8.1 타입과 호출 추가** — 기존 `JourneyTrack` 정의 아래로:

```ts
/** 목표 밖 부서 하나. 잠금 없음 — 칩은 문이지, 문의 예고가 아니다. */
export interface FreeRoamEntry { dept: string; passed: number; total: number }

/** 여정 화면이 한 번에 받는 것. 전체 29부서(340KB) 대신 목표 부서 하나(11.7KB)만 온다. */
export interface JourneyView {
  goalDept: string;
  /** 아직 고르지 않아 서버가 추론해 그려 준 값. 저장되지 않았다. */
  inferred: boolean;
  track: JourneyTrack;
  freeRoam: FreeRoamEntry[];
}

/** 정거장 시트의 한 행 = 스텝의 한 회차. 대화 하나는 두 행(도움 있는 회차·혼자)이다. */
export interface JourneyStep {
  kind: 'dlg' | 'quiz' | 'event' | 'boss';
  name: string; scenarioId?: string;
  state: 'done' | 'now' | 'lock' | 'optional';
  attempted?: boolean; optional?: boolean;
  guide?: 'choices' | 'free';
  pass?: number; passes?: number;
}

export interface StationDetail { station: ThemeCurriculumState; steps: JourneyStep[] }
```

`api` 객체에:

```ts
  async journey(): Promise<JourneyView> {
    const { data } = await http.get('/me/journey');
    return data as JourneyView;
  },
  async station(themeKey: string): Promise<StationDetail> {
    const { data } = await http.get(`/me/journey/stations/${encodeURIComponent(themeKey)}`);
    return data as StationDetail;
  },
  async setGoalDept(dept: string): Promise<void> {
    await http.patch('/me/goal-dept', { dept });
  },
```

- [ ] **8.2 타입 검사**

실행: `cd mobile && npx tsc --noEmit`
기대: exit 0

- [ ] **8.3 커밋**

```bash
git add mobile/src/api/client.ts
git commit -m "feat(journey): 모바일 여정 API 타입과 호출"
```

---

## Task 9: `Station` — 정거장 노드 SVG

**파일**
- 생성: `mobile/src/components/journey/Station.tsx` · `mobile/src/components/journey/Station.test.tsx`

**인터페이스**
- 생산: `type StationState = 'done' | 'here' | 'next' | 'far'` · `<Station state label sub? collab? onPress />`

- [ ] **9.1 실패하는 테스트 작성**

```tsx
import { render } from '@testing-library/react-native';
import { Station, RADIUS } from './Station';

describe('Station', () => {
  // 핸드오프가 고정한 반지름이다. 손글씨 4자가 들어가는 최소치라 줄이면 라벨이 깨진다.
  it('keeps the handoff radii', () => {
    expect(RADIUS).toEqual({ here: 30, next: 26, far: 25, done: 24 });
  });

  // 흐린 점선은 "아직 가지 않은 곳"이지 잠금이 아니다(J3). 누를 수 있는 것에
  // 자물쇠를 그리면 화면이 거짓말을 한다.
  it('draws no padlock on a far station and stays pressable', () => {
    const onPress = jest.fn();
    const t = render(<Station state="far" label="수혈 관리" onPress={onPress} />);
    expect(t.queryByTestId('station-lock')).toBeNull();
    t.getByTestId('station-press').props.onPress();
    expect(onPress).toHaveBeenCalled();
  });

  it('flies the HERE flag only on here', () => {
    expect(render(<Station state="here" label="a" onPress={jest.fn()} />).queryByTestId('station-flag')).not.toBeNull();
    expect(render(<Station state="next" label="a" onPress={jest.fn()} />).queryByTestId('station-flag')).toBeNull();
  });

  it('stamps PASSED on done', () => {
    expect(render(<Station state="done" label="a" onPress={jest.fn()} />).queryByText('PASSED')).not.toBeNull();
  });
});
```

- [ ] **9.2 테스트 실패 확인**

실행: `cd mobile && npx jest src/components/journey/Station.test.tsx`
기대: FAIL — 모듈 없음

- [ ] **9.3 구현** — 핸드오프 §3의 수치를 그대로 옮긴다.

```tsx
// 정거장 노드. 핸드오프 v41 08 §3의 4상태를 그대로 옮긴 것이다.
//
// `far`는 핸드오프에서 `locked`라 불렸지만 잠기지 않는다(J3): 우리 주제는 대체로 병렬이라
// 앞 정거장을 지나지 않아도 배움에 구멍이 나지 않고, 다음 달에 그 부서로 배치되는 학습자가
// 기다려야 할 이유가 없다. 흐린 점선은 "아직 가지 않은 곳"의 표현이다.
export type StationState = 'done' | 'here' | 'next' | 'far';

// 손글씨 4자가 들어가는 최소치. 줄이지 말 것(핸드오프 §5).
export const RADIUS = { here: 30, next: 26, far: 25, done: 24 } as const;

const INK = '#3E362B', GREEN = '#5F8D5A', AMBER = '#C77E2E', BLUE = '#4A6FA5';

export function Station({ state, label, sub, collab, onPress }: {
  state: StationState; label: string; sub?: string; collab?: string; onPress(): void;
}) {
  const r = RADIUS[state];
  return (
    <Pressable testID="station-press" onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <Svg width={r * 2 + 56} height={r * 2 + 56}>
        <G x={r + 28} y={r + 28}>
          {collab ? <Circle r={state === 'here' ? 36 : 32} stroke={BLUE} strokeDasharray="3 3" fill="none" /> : null}

          {state === 'done' && (
            <G rotation={-12}>
              <Circle r={24} stroke={GREEN} strokeWidth={2} fill="none" />
              <Circle r={19} stroke={GREEN} strokeWidth={1} fill="none" />
              <SvgText y={3} fontSize={6.5} fill={GREEN} textAnchor="middle">PASSED</SvgText>
            </G>
          )}
          {state === 'here' && (
            <>
              <Circle r={30} stroke={INK} strokeWidth={2} fill="none" />
              <Circle r={34} stroke={AMBER} strokeWidth={1.6} strokeDasharray="5 4" fill="none" />
              <G testID="station-flag" x={12} y={-48}>
                <Line x1={0} y1={0} x2={0} y2={26} stroke={INK} strokeWidth={2} />
                <Polygon points="0,0 16,6 0,12" fill="#C75146" />
              </G>
            </>
          )}
          {state === 'next' && <Circle r={26} stroke={INK} strokeWidth={1.8} fill="none" />}
          {state === 'far' && <Circle r={25} stroke={INK} strokeWidth={1.6} strokeDasharray="4 3" fill="none" opacity={0.45} />}
        </G>
      </Svg>
      <Text numberOfLines={2}>{label}</Text>
      {sub ? <Text>{sub}</Text> : null}
    </Pressable>
  );
}
```

**`station-lock` testID는 어디에도 없다.** 자물쇠를 그리지 않는다는 것이 이 컴포넌트의 규칙이고,
테스트가 그 부재를 단정한다(J3).

- [ ] **9.4 테스트 통과 확인**

실행: `cd mobile && npx jest src/components/journey/Station.test.tsx`
기대: 4건 PASS

- [ ] **9.5 커밋**

```bash
git add mobile/src/components/journey
git commit -m "feat(journey): 정거장 노드 4상태 — 흐린 점선은 잠금이 아니다"
```

---

## Task 10: `PathSegment`와 `JourneyMap` 배치

**파일**
- 생성: `mobile/src/components/journey/PathSegment.tsx` · `JourneyMap.tsx` · `JourneyMap.test.tsx`

**인터페이스**
- 소비: `Station`, `StationState`
- 생산: `<JourneyMap track onStationPress />` · `stationStates(curricula): StationState[]`

- [ ] **10.1 실패하는 테스트 작성**

```tsx
import { stationStates } from './JourneyMap';

describe('stationStates', () => {
  // 서버의 셋(passed/here/open)을 화면의 넷으로 옮긴다. 처음 만나는 open만 next이고
  // 그 뒤는 흐린 점선이다 — 경로가 어디까지 왔는지 한눈에 읽히게 하려는 것이다.
  it('maps the first open station to next and dims the rest', () => {
    expect(stationStates([
      { state: 'passed' }, { state: 'here' }, { state: 'open' }, { state: 'open' },
    ] as any)).toEqual(['done', 'here', 'next', 'far']);
  });

  it('has a next even when nothing has been started', () => {
    expect(stationStates([{ state: 'open' }, { state: 'open' }] as any)).toEqual(['next', 'far']);
  });

  it('has no next when everything is passed', () => {
    expect(stationStates([{ state: 'passed' }, { state: 'passed' }] as any)).toEqual(['done', 'done']);
  });
});
```

- [ ] **10.2 테스트 실패 확인**

실행: `cd mobile && npx jest src/components/journey/JourneyMap.test.tsx`
기대: FAIL — 모듈 없음

- [ ] **10.3 구현**

```tsx
/** 서버의 정거장 상태(passed/here/open)를 지도의 넷으로 옮긴다. */
export function stationStates(curricula: ThemeCurriculumState[]): StationState[] {
  let nextUsed = false;
  return curricula.map((c) => {
    if (c.state === 'passed') return 'done';
    if (c.state === 'here') { nextUsed = true; return 'here'; }
    if (!nextUsed) { nextUsed = true; return 'next'; }
    return 'far';
  });
}
```

`PathSegment` — 제어점은 중간 x와 `prev.y + 14`(핸드오프 §3):

```tsx
export function PathSegment({ from, to, done }: { from: Point; to: Point; done: boolean }) {
  const cx = (from.x + to.x) / 2;
  const cy = from.y + 14;
  return (
    <Path
      d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
      stroke={done ? '#5F8D5A' : 'rgba(62,54,43,.28)'}
      strokeWidth={done ? 2.6 : 2.2}
      strokeDasharray="7 7"
      fill="none"
    />
  );
}
```

`JourneyMap` — 좌표는 인덱스에서 나온다. **서버는 좌표를 모른다**(J10):

```tsx
const ROW = 108;          // 정거장 사이 세로 간격
const SWING = 0.28;       // 지그재그 진폭(화면 폭 대비)
const BOTTOM_PAD = 96;    // 고정 바에 가리지 않는 최소값(핸드오프 §5)

/** 인덱스 하나가 좌표 하나다 — 홀수 줄은 오른쪽, 짝수 줄은 왼쪽으로 스윙한다. */
export function stationPoint(i: number, width: number): Point {
  return { x: width / 2 + (i % 2 === 0 ? -1 : 1) * width * SWING, y: 56 + i * ROW };
}
```

경로 선의 `done`은 **양쪽 정거장이 모두 `done`일 때만** 참이다 — 한쪽이 미완이면 점선이다.

- [ ] **10.4 테스트 통과 확인**

실행: `cd mobile && npx jest src/components/journey/JourneyMap.test.tsx`
기대: 3건 PASS

- [ ] **10.5 커밋**

```bash
git add mobile/src/components/journey
git commit -m "feat(journey): 경로 배치와 정거장 상태 매핑"
```

---

## Task 11: `FreeRoamRow`와 `CurrentStationBar`

**파일**
- 생성: `mobile/src/components/journey/FreeRoamRow.tsx` · `CurrentStationBar.tsx` · `FreeRoamRow.test.tsx`

**인터페이스**
- 생산: `<FreeRoamRow entries onPick(dept) />` · `<CurrentStationBar station kind onPress />`

- [ ] **11.1 실패하는 테스트 작성**

```tsx
import { render } from '@testing-library/react-native';
import { FreeRoamRow } from './FreeRoamRow';

describe('FreeRoamRow', () => {
  // 부서를 고르는 방법은 하나다(J5): 칩을 누르면 목표가 바뀐다. 미리보기와 확정을
  // 나누면 학습자가 "지금 보는 게 내 목표인가"를 매번 판단해야 한다.
  it('picks the department it was tapped on', () => {
    const onPick = jest.fn();
    const t = render(<FreeRoamRow entries={[{ dept: 'ICU', passed: 3, total: 35 }]} onPick={onPick} />);
    t.getByTestId('chip-ICU').props.onPress();
    expect(onPick).toHaveBeenCalledWith('ICU');
  });

  it('shows the stamp count', () => {
    const t = render(<FreeRoamRow entries={[{ dept: 'ICU', passed: 3, total: 35 }]} onPick={jest.fn()} />);
    expect(t.queryByText('3')).not.toBeNull();
  });

  it('draws no lock — free roam is free', () => {
    const t = render(<FreeRoamRow entries={[{ dept: 'ICU', passed: 0, total: 35 }]} onPick={jest.fn()} />);
    expect(t.queryByTestId('chip-lock')).toBeNull();
  });
});
```

- [ ] **11.2 테스트 실패 확인**

실행: `cd mobile && npx jest src/components/journey/FreeRoamRow.test.tsx`
기대: FAIL — 모듈 없음

- [ ] **11.3 구현** — `NbPaper` 가로 스크롤, 부서 아이콘 17 + 손글씨 14 + 도장 카운트(모노 9 그린).
  `CurrentStationBar`는 화면 하단 고정이고 `kind`가 `resume`이면 "이어하기", `next`면 "다음 정거장"으로
  읽힌다(J6·J7). `station`이 null이면 구간 시험이나 자유 탐방을 권한다.

- [ ] **11.4 테스트 통과 확인**

실행: `cd mobile && npx jest src/components/journey/FreeRoamRow.test.tsx`
기대: 3건 PASS

- [ ] **11.5 커밋**

```bash
git add mobile/src/components/journey
git commit -m "feat(journey): 자유 탐방 칩과 현재 정거장 바"
```

---

## Task 12: `StationSheet`

**파일**
- 생성: `mobile/src/components/journey/StationSheet.tsx` · `StationSheet.test.tsx`

**인터페이스**
- 소비: `api.station(themeKey)` · `JourneyStep`
- 생산: `<StationSheet themeKey onClose onStepPress(step) />`

- [ ] **12.1 실패하는 테스트 작성**

```tsx
import { render, waitFor } from '@testing-library/react-native';
import { StationSheet } from './StationSheet';
import { api } from '@/api/client';

jest.mock('@/api/client');

describe('StationSheet', () => {
  // 대화 하나는 두 행이다 — 도움 있는 회차와 혼자 하는 회차. 이 사다리가 보이는
  // 곳은 여기뿐이고, 지도의 개수는 상황 단위다.
  it('shows both rungs of a dialogue', async () => {
    (api.station as jest.Mock).mockResolvedValue({
      station: { themeKey: 'k', name: '수혈 관리', done: 0, total: 2, tiers: [] },
      steps: [
        { kind: 'dlg', name: '수혈 전 확인', state: 'now', guide: 'choices', pass: 1, passes: 2 },
        { kind: 'dlg', name: '수혈 전 확인', state: 'lock', guide: 'free', pass: 2, passes: 2 },
      ],
    });
    const t = render(<StationSheet themeKey="k" onClose={jest.fn()} onStepPress={jest.fn()} />);
    await waitFor(() => expect(t.queryAllByText('수혈 전 확인')).toHaveLength(2));
    expect(t.queryByText('1/2')).not.toBeNull();
    expect(t.queryByText('2/2')).not.toBeNull();
  });

  // 자물쇠는 여기에 붙는다(J2) — 정거장이 아니라 스텝에.
  it('locks the second rung until the first is cleared', async () => {
    (api.station as jest.Mock).mockResolvedValue({
      station: { themeKey: 'k', name: 'a', done: 0, total: 2, tiers: [] },
      steps: [
        { kind: 'dlg', name: 'x', state: 'now', pass: 1, passes: 2 },
        { kind: 'dlg', name: 'x', state: 'lock', pass: 2, passes: 2 },
      ],
    });
    const t = render(<StationSheet themeKey="k" onClose={jest.fn()} onStepPress={jest.fn()} />);
    await waitFor(() => expect(t.queryAllByTestId('step-lock')).toHaveLength(1));
  });
});
```

- [ ] **12.2 테스트 실패 확인**

실행: `cd mobile && npx jest src/components/journey/StationSheet.test.tsx`
기대: FAIL — 모듈 없음

- [ ] **12.3 구현** — 머리(이름 · `NbProgSquares` · 트랙 태그), 몸(난이도 계단 3줄 → 스텝 행).
  스텝 아이콘은 `speech`(대화) · `pencil`(퀴즈) · `trophy`(시험) · `lock`(잠긴 스텝). **시트는 즉시 열고
  행 자리에 스켈레톤을 둔다** — 열림이 지연되면 탭이 씹힌 것처럼 읽힌다.

- [ ] **12.4 테스트 통과 확인**

실행: `cd mobile && npx jest src/components/journey/StationSheet.test.tsx`
기대: 2건 PASS

- [ ] **12.5 커밋**

```bash
git add mobile/src/components/journey
git commit -m "feat(journey): 정거장 시트 — 대화 한 건이 두 회차로 펼쳐진다"
```

---

## Task 13: 화면 조립과 탭 교체

**파일**
- 생성: `mobile/src/app/(tabs)/journey.tsx`
- 수정: `mobile/src/app/(tabs)/_layout.tsx` (라우트 이름 · 아이콘 맵)
- 삭제: `mobile/src/app/(tabs)/campus.tsx` · `mobile/src/components/campus/FloorList.tsx` · `DeptSheet.tsx` (+ 각 테스트)

**인터페이스**
- 소비: `api.journey()` · `api.setGoalDept()` · Task 9~12의 컴포넌트

- [ ] **13.1 화면 작성** — `journey.tsx`

```tsx
// 일터 탭 = 여정 지도. 장소→부서→시나리오였던 옛 탐험 모드의 깊이를 부서→주제→시나리오로
// 바꾼다. 두 깊이 구조가 공존할 이유가 없었다 — 같은 콘텐츠에 이르는 길이 두 갈래였다.
export default function JourneyScreen() {
  const [view, setView] = useState<JourneyView | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  // 탭을 떠나면 버린다: 진도가 다른 화면에서 움직일 수 있다.
  // 목표 부서도 캐시하지 않는다 — 서버가 정본이다.
}
```

- [ ] **13.2 탭 라우트 교체** — `_layout.tsx` 두 줄:

```tsx
const ICONS: Record<string, NbIconName> = {
  index: 'home', journey: 'hospital', lounge: 'speech', lab: 'lab', me: 'me',
};
```
```tsx
      <Tabs.Screen name="journey" options={{ title: t('tab.career'), tabBarIcon: tabIcon('journey') }} />
```

`tab.career`(한국어 "일터")는 그대로 쓴다 — 탭이 답하는 질문이 바뀌었을 뿐 이름은 여전히 맞다.

- [ ] **13.3 옛 장소 찾기 삭제**

```bash
git rm mobile/src/app/\(tabs\)/campus.tsx \
       mobile/src/components/campus/FloorList.tsx \
       mobile/src/components/campus/DeptSheet.tsx \
       mobile/src/components/campus/floorList.render.test.tsx
```

- [ ] **13.4 게이트 확인**

실행: `cd mobile && npx tsc --noEmit && npx jest --silent`
기대: tsc exit 0 · jest 전건 PASS. `campus.tsx`를 참조하던 테스트가 남아 있으면 그 테스트도 지운다
(화면이 사라졌으므로 그 테스트가 지키던 것도 사라졌다).

- [ ] **13.5 커밋**

```bash
git add -A mobile
git commit -m "feat(journey): 일터 탭을 여정 지도로 — 옛 장소 찾기 제거"
```

---

## Task 14: 홈 이전과 구 라우트 삭제 (L4.4 완료)

**파일**
- 수정: `server/internal/adapters/http/home_handler.go` (프레젠터 대신 포트를 직접 읽는다)
- 삭제: `server/internal/adapters/http/curriculum_legacy.go` · `curriculum_legacy_test.go`
- 수정: `server/internal/adapters/http/router.go` (`/me/curriculum` · `/me/curriculum/tracks` 제거)
- 수정: `server/internal/adapters/http/progress_handler.go` (`curriculum`·`curriculumTracks` 삭제)

**인터페이스**
- 소비: `learning.Journey.Resume` · `Tracks` · `Steps`

- [ ] **14.1 홈의 "오늘의 한 가지"를 포트로 이전**

`home_handler.go`의 `currentStep`이 `legacyCurriculum`을 받던 것을, 포트가 답하게 바꾼다:

```go
// 홈은 전역으로 묻는다 — "지금 이어서 할 것". 여정 화면은 목표 부서 트랙 안에서 묻고,
// 둘은 어긋나는 게 아니라 다른 질문에 답한다(J7).
ref := j.Resume(p)                      // 전역 이어하기
if !ref.Found { /* 오늘 할 일 없음 카드 */ }
rows := j.Steps(ref.Theme, p)           // 그 정거장의 행들
// rows에서 state=="now" 인 행이 오늘의 한 가지다.
```

정거장 이름과 부서 라벨은 `j.Tracks(p)`에서 그 주제를 찾아 얻는다.

- [ ] **14.2 홈 테스트 갱신·실행**

실행: `cd server && go test ./internal/adapters/http/ -count=1`
기대: PASS. 홈이 `legacyCurricula`를 부르지 않는다.

- [ ] **14.3 구 라우트와 어댑터 삭제**

```bash
git rm server/internal/adapters/http/curriculum_legacy.go \
       server/internal/adapters/http/curriculum_legacy_test.go
```
`router.go`에서 두 줄을 지우고, `progress_handler.go`의 `curriculum`·`curriculumTracks`와 그 swag 주석,
`curriculum_tracks_test.go`를 함께 지운다.

- [ ] **14.4 게이트 확인**

실행:
```bash
cd server && go build ./... && go test -count=1 ./...
grep -rn "/me/curriculum" internal/adapters/http ../mobile/src   # 0이어야 한다
ls internal/adapters/http/curriculum_legacy*.go 2>/dev/null       # 없어야 한다
PATH="$(go env GOPATH)/bin:$PATH" make contract
```
기대: 빌드·테스트 그린 · 참조 0 · 어댑터 없음 · 계약에서 구 엔드포인트가 사라진다(의도한 변경).

- [ ] **14.5 커밋**

```bash
git add -A server packages/contract
git commit -m "refactor(journey): 캠퍼스 프레젠터 은퇴 — /me/curriculum 삭제, L4.4 완료"
```

---

## Task 15: 탐험 모드 설정 토글

**파일**
- 수정: `mobile/src/app/(tabs)/me.tsx` (설정 항목) · `mobile/src/app/(tabs)/index.tsx` (병동 카드)
- 생성: `mobile/src/hooks/useExploreMode.ts` · `useExploreMode.test.ts`

**인터페이스**
- 생산: `useExploreMode(): { enabled: boolean; setEnabled(v: boolean): void }`

- [ ] **15.1 실패하는 테스트 작성**

```ts
import { renderHook, act } from '@testing-library/react-native';
import { useExploreMode } from './useExploreMode';

describe('useExploreMode', () => {
  // 기기 로컬이다: 마이그레이션도 계약 변경도 없고, 데모에서 껐다 켜 보는 용도에 그 정도가 맞다.
  it('defaults to on', () => {
    expect(renderHook(() => useExploreMode()).result.current.enabled).toBe(true);
  });

  // 저장소가 막힌 기기(프라이빗 모드 등)에서도 화면이 죽지 않아야 한다.
  it('survives a storage that throws', async () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const { result } = renderHook(() => useExploreMode());
    await act(async () => result.current.setEnabled(false));
    expect(result.current.enabled).toBe(false); // 메모리에서는 반영된다
  });
});
```

- [ ] **15.2 테스트 실패 확인**

실행: `cd mobile && npx jest src/hooks/useExploreMode.test.ts`
기대: FAIL — 모듈 없음

- [ ] **15.3 구현**

```ts
const KEY = 'forin.exploreMode';

/** 탐험 모드(부서 인테리어) 토글. 기기 로컬이다 — 마이그레이션도 계약 변경도 없다.
 *  저장소는 프라이빗 모드나 데이터 차단에서 던질 수 있으므로 읽기·쓰기를 모두 감싼다.
 *  실패는 기본값(켬)으로 떨어지고, 화면은 그대로 그려진다. */
export function useExploreMode() {
  const [enabled, setState] = useState(true);
  useEffect(() => {
    try {
      const v = storage.getString(KEY);
      if (v != null) setState(v === '1');
    } catch { /* 저장소가 막힌 기기: 기본값으로 둔다 */ }
  }, []);
  const setEnabled = useCallback((v: boolean) => {
    setState(v);                                   // 메모리는 먼저 반영한다
    try { storage.set(KEY, v ? '1' : '0'); } catch { /* 이번 실행에만 적용된다 */ }
  }, []);
  return { enabled, setEnabled };
}
```

- [ ] **15.4 홈 병동 카드 연동** — `index.tsx`의 실시간 병동 카드를 `enabled`일 때만 그린다.
  **인테리어가 없는 직업군에서는 토글과 무관하게 서버가 값을 주지 않아 카드가 뜨지 않는다**
  (기존 "값 없으면 모듈을 숨긴다" 규칙).

- [ ] **15.5 게이트 확인**

실행: `cd mobile && npx tsc --noEmit && npx jest --silent`
기대: tsc 0 · 전건 PASS

- [ ] **15.6 커밋**

```bash
git add mobile/src
git commit -m "feat(journey): 탐험 모드 설정 토글 — 직업군별 가용성과 같은 축"
```

---

## Task 16: 스모크 단정과 최종 게이트

**파일**
- 수정: `server/scripts/e2e_smoke.sh`

- [ ] **16.1 구 단정 제거, 여정 단정 추가**

`④ /me/curriculum` 구역을 `/me/journey`로 바꾼다:

```bash
hd "④ JOURNEY · 여정 지도"
run GET /me/journey
gd=$(pj "d.get('goalDept','')")
[ -n "$gd" ] && ok "goal department resolved ($gd)" || bad "no goal department"
nst=$(pj "len(d.get('track',{}).get('curricula',[]))")
[ "${nst:-0}" -ge 20 ] && ok "track has $nst stations" || bad "stations=$nst"
# 하단 바가 가리킬 곳은 정확히 하나다 — 둘이면 두 곳을 "다음"이라 부르고,
# 트랙이 전부 통과면 0이 맞다.
nres=$(pj "sum(1 for c in d.get('track',{}).get('curricula',[]) if c.get('resume'))")
[ "${nres:-0}" -le 1 ] && ok "at most one current station ($nres)" || bad "resume targets=$nres"
# 도장이 정거장보다 많을 수는 없다.
bad_st=$(pj "sum(1 for e in d.get('freeRoam',[]) if e['passed'] > e['total'])")
[ "${bad_st:-0}" = 0 ] && ok "free-roam stamps within range" || bad "stamps exceed totals"
# 목표 부서가 칩에도 있으면 같은 부서가 경로와 칩에 동시에 나온다.
dup=$(pj "sum(1 for e in d.get('freeRoam',[]) if e['dept'] == d.get('goalDept'))")
[ "${dup:-0}" = 0 ] && ok "goal is not also a chip" || bad "goal duplicated in freeRoam"

run GET /me/journey/stations/$(pj "d.get('track',{}).get('curricula',[{}])[0].get('themeKey','')" )
nsteps=$(pj "len(d.get('steps',[]))")
[ "${nsteps:-0}" -ge 1 ] && ok "station sheet has $nsteps rows" || bad "station steps=$nsteps"
```

> ⚠️ **`/me/curriculum/tracks`는 P1 이후 한 번도 스모크된 적이 없었다.** 그래서 여정 엔드포인트가
> 비어 있던 것을 아무도 보지 못했다. 이 태스크가 그 구멍을 메운다.

- [ ] **16.2 전체 게이트**

실행:
```bash
cd server && go vet ./... && go test -count=1 ./... && PATH="$(go env GOPATH)/bin:$PATH" make contract
cd ../mobile && npx tsc --noEmit && npx jest --silent
cd .. && git status --short packages/contract
```
기대: 전부 그린. 계약 변경은 의도한 것(새 엔드포인트 3, 구 엔드포인트 2 삭제)이며 커밋에 포함된다.

- [ ] **16.3 체크리스트·STATUS 기록** — Build Spec 인덱스 §4의 체크박스를 전부 채우고 `status: IMPLEMENTED`로
  바꾼다. STATUS에 L3·L4.4 완료를 기록한다. **서브모듈 먼저, 본체 나중.**

- [ ] **16.4 커밋**

```bash
git add server/scripts/e2e_smoke.sh
git commit -m "test(smoke): 여정 단정 추가 — tracks가 한 번도 검사되지 않던 구멍을 메운다"
```

---

## 자체 검토

**스펙 커버리지** — 인덱스 §1의 유닛 9개가 모두 태스크에 있다: U1→T1 · U2→T2~T5 · U3→T6 · U4→T7 ·
U5→T9~T11,T13 · U6→T12 · U7→T13 · U8→T14 · U9→T15. §5 검증의 여섯 축은 T16이 모은다.

**타입 정합성** — `learning.JourneyView`·`FreeRoamEntry`·`StationDetail`은 T4·T6에서 정의하고 T5·T6·T8이
쓴다. 모바일 `JourneyView`·`FreeRoamEntry`·`StationDetail`·`JourneyStep`은 T8에서 정의하고 T11~T13이 쓴다.
`stationStates`(T10)가 내는 `StationState`는 T9가 정의한 것이다.

**남은 위험 두 가지**
1. **T14의 홈 이전이 이 계획에서 가장 조용히 깨질 곳이다.** 홈의 "오늘의 한 가지"는 프레젠터가 주던
   회차 단위 숫자를 쓰고 있었는데, 포트로 옮기면 상황 단위가 된다. 화면의 숫자가 달라 보일 수 있으니
   실기기로 홈 카드를 한 번 확인한다.
2. **T13에서 `campus.tsx`를 지우면 그것을 참조하던 테스트가 함께 깨진다.** 화면이 사라졌으므로 그 테스트가
   지키던 것도 사라진 것이다 — 고치지 말고 지운다. 다만 `src/data/campus.ts`의 건물 스타일은 인테리어가
   여전히 쓸 수 있으니 참조를 확인한 뒤에 지운다.
