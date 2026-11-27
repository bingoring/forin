# 커리큘럼 v3 · P1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 주제(theme) 태그로 시나리오를 조립해 심화 커리큘럼(주제=커리큘럼=정거장)을 만드는 서버 엔진과 DB 스키마를, 기존 하드코딩 89 커리큘럼과 **공존**시키며(라이브 회귀 0) 구축한다.

**Architecture:** v3 로직은 새 하위 패키지 `server/internal/curriculum/themed`에 격리한다(기존 `curriculum` 패키지의 `Curriculum` 타입과 이름이 충돌하고, 라이브 `GET /me/curriculum`은 계속 하드코딩 경로가 서빙해야 하므로). `themed.Assemble`(순수: 태그+레지스트리→커리큘럼)와 `themed.Resolve`(순수: 커리큘럼+진도→트랙 상태)가 핵심이며, DB `scenarios`에 `theme`/`collab_with` 컬럼을 더해 seed로 싣고 부팅 시 1회 조립해 캐시한다. 실 계약 전환(라이브 엔드포인트 교체)은 P2 태깅 후로 미루므로, 이 플랜은 **추가(additive) 엔드포인트**까지만 만든다.

**Tech Stack:** Go(서버), pgx + sqlc(DB), YAML 콘텐츠, testify 없음(표준 `testing`), 기존 `content.Scenario`/`contentfile.Load`/`ContentRepo.Seed`.

**Spec:** `docs/dlc/projects/forin/02-construction/curriculum-v3/` (build-spec-index.md · domain-entities.md · business-rules.md · business-logic-model.md)

## Global Constraints

- **공존·회귀 0:** 기존 `curriculum` 패키지와 라이브 `GET /me/curriculum`(`{"buildings":...}`)을 **건드리지 않는다**. v3는 전부 `curriculum/themed` 하위 패키지 + 추가 엔드포인트로만 존재한다. (spec index §0.5, business-logic-model §5)
- **명시 태그 그룹핑만, 프록시 유추 금지(R7):** 조립은 `theme` 태그만 읽는다. `acuity`/`difficulty`로 주제를 유추하지 않는다. `difficulty`는 주제 **안** 난이도 계단에만 쓴다.
- **한 상황 = 한 주제(R1):** 조립 시 한 시나리오는 정확히 한 주제에만 들어간다.
- **고아 0(R3)은 P2 게이트:** P1에서는 태그가 비어 있어도 안전해야 한다. "고아 0" 검증 테스트는 실데이터 대상이며 P2 태깅 완료까지 `t.Skip`으로 문서화한다. P1 테스트는 픽스처로 조립·고아 **탐지**만 검증한다.
- **결정성(R22):** 정렬은 명시 필드(`Theme.Order`·`Difficulty`·`ScenarioID`)로만. 맵 순회 결과를 정렬 없이 쓰지 않는다.
- **네이밍 주의:** `content.Scenario`에는 이미 무관한 `FloorTheme`(yaml `floorTheme`) 필드가 있다. v3의 새 필드는 `Theme`(yaml `theme`)이며 **다른 것**이다. 혼동 금지.
- **트랙 값:** `Theme.Track` ∈ {`core`, `depth`, `collab`}. 상태 값: 정거장 `passed|here|open`(주제·트랙엔 lock 없음), 티어 스텝 `done|now|lock|optional`.

---

### Task 1: 시나리오 태그 필드 + 주제 레지스트리 로더

**Files:**
- Modify: `server/internal/domain/content/content.go:191-218` (`Scenario`에 `Theme`/`CollabWith` 추가)
- Create: `server/internal/curriculum/themed/theme.go`
- Create: `server/internal/curriculum/themed/theme_test.go`
- Create: `server/content/nurse/themes.yaml` (형식 정의 + 최소 샘플 2~3개; 실제 목록은 P2)

**Interfaces:**
- Produces: `content.Scenario.Theme string`, `content.Scenario.CollabWith string`; `themed.Theme{Key,Name,NameKey,Track,Dept,Order,Exam}`; `themed.LoadThemes(path string) ([]themed.Theme, error)`.

- [ ] **Step 1: 실패 테스트 작성** — `theme_test.go`

```go
package themed

import (
	"os"
	"path/filepath"
	"testing"
)

func writeTmp(t *testing.T, body string) string {
	t.Helper()
	p := filepath.Join(t.TempDir(), "themes.yaml")
	if err := os.WriteFile(p, []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
	return p
}

func TestLoadThemes_parsesTracks(t *testing.T) {
	path := writeTmp(t, `
- key: core-sbar
  name: SBAR 인계
  nameKey: theme.core.sbar
  track: core
  order: 10
  exam: true
- key: er-triage
  name: 트리아지
  track: depth
  dept: ER
  order: 20
- key: er-icu-handoff
  name: ICU 인계
  track: collab
  dept: ER
  order: 30
`)
	themes, err := LoadThemes(path)
	if err != nil {
		t.Fatal(err)
	}
	if len(themes) != 3 {
		t.Fatalf("want 3, got %d", len(themes))
	}
	if themes[0].Key != "core-sbar" || themes[0].Track != "core" || !themes[0].Exam {
		t.Errorf("core theme parsed wrong: %+v", themes[0])
	}
	if themes[1].Dept != "ER" || themes[1].Track != "depth" {
		t.Errorf("depth theme parsed wrong: %+v", themes[1])
	}
	// exam defaults true when omitted
	if !themes[1].Exam {
		t.Errorf("exam should default true, got false for %s", themes[1].Key)
	}
}
```

- [ ] **Step 2: 실패 확인** — `cd server && go test ./internal/curriculum/themed/` → FAIL(패키지/함수 없음)

- [ ] **Step 3: 구현** — `theme.go`

```go
// Package themed assembles deep, theme-based curricula (커리큘럼 v3) from
// per-scenario theme tags. It is isolated from the legacy `curriculum` package
// so the live hardcoded path keeps serving until P2 tagging completes.
package themed

import (
	"os"

	"gopkg.in/yaml.v3"
)

// Theme is one registry entry (content/nurse/themes.yaml). A scenario's `theme`
// tag references Theme.Key; the registry owns the name, track, order and exam.
type Theme struct {
	Key     string `yaml:"key"`
	Name    string `yaml:"name"`
	NameKey string `yaml:"nameKey"`
	Track   string `yaml:"track"` // core | depth | collab
	Dept    string `yaml:"dept"`  // depth/collab: dept code; core: ""
	Order   int    `yaml:"order"`
	Exam    *bool  `yaml:"exam"` // pointer so "omitted" (nil) can default to true
}

// ExamOn reports the exam flag with the default-true rule applied.
func (t Theme) ExamOn() bool { return t.Exam == nil || *t.Exam }

// LoadThemes reads the registry. Order in the file is not trusted for sorting —
// callers sort by Theme.Order (R22) — but the slice is returned as-read.
func LoadThemes(path string) ([]Theme, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var out []Theme
	if err := yaml.Unmarshal(raw, &out); err != nil {
		return nil, err
	}
	return out, nil
}
```

> 주의: 테스트는 `themes[1].Exam == true`를 기대한다. `Exam`이 포인터이므로 테스트에서 `themes[1].ExamOn()`으로 바꾸거나, 여기 `ExamOn()`을 검증하도록 Step 1 테스트의 마지막 단언을 `!themes[1].ExamOn()`으로 맞춘다. (구현과 테스트가 같은 함수를 봐야 한다 — `ExamOn()` 사용.)

- [ ] **Step 4: content.Scenario에 태그 필드 추가** — `content.go`의 `Scenario` 구조체 `Briefing` 필드 바로 위에 삽입:

```go
	// Theme (curriculum v3) is the learning theme this scenario belongs to —
	// references themed.Theme.Key. Empty = not yet tagged (P2 in progress).
	// NOTE: distinct from FloorTheme above.
	Theme string `yaml:"theme,omitempty" json:"theme,omitempty"`
	// CollabWith is set only on track=collab scenarios: the other department
	// this situation is faced from the learner's own dept (e.g. "ICU").
	CollabWith string `yaml:"collabWith,omitempty" json:"collabWith,omitempty"`
```

- [ ] **Step 5: themes.yaml 샘플 작성** — `server/content/nurse/themes.yaml` (형식 고정 + 샘플; P2가 채움)

```yaml
# 주제 레지스트리 (커리큘럼 v3). 실제 ~100개 목록은 P2 전수조사 산출물.
# track: core(전 부서 공유) | depth(부서 고유) | collab(타 부서 접점)
- key: core-sbar
  name: SBAR 인계
  nameKey: theme.core.sbar
  track: core
  order: 10
- key: er-triage
  name: 트리아지
  nameKey: theme.er.triage
  track: depth
  dept: ER
  order: 20
```

- [ ] **Step 6: 테스트 통과 확인** — `go test ./internal/curriculum/themed/` → PASS. `go build ./...` → 통과(Scenario 필드 추가가 컴파일 되는지).

- [ ] **Step 7: 커밋**

```bash
git add server/internal/domain/content/content.go server/internal/curriculum/themed/ server/content/nurse/themes.yaml
git commit -m "feat(curriculum-v3): 주제 태그 필드 + themes.yaml 레지스트리 로더"
```

---

### Task 2: 조립 엔진 `Assemble` (순수)

**Files:**
- Create: `server/internal/curriculum/themed/assemble.go`
- Create: `server/internal/curriculum/themed/assemble_test.go`

**Interfaces:**
- Consumes: `themed.Theme` (Task 1).
- Produces: `themed.ScenarioTag{ID,Title,Theme,CollabWith,Dept,Difficulty}`; `themed.Step{Kind,Name,ScenarioID}`; `themed.Tier{Difficulty,Steps}`; `themed.Curriculum{Theme,Tiers}`; `themed.Assemble(themes []Theme, tags []ScenarioTag) (curricula []Curriculum, orphans []string)`.

- [ ] **Step 1: 실패 테스트 작성** — `assemble_test.go`

```go
package themed

import "testing"

func tag(id, theme string, diff int) ScenarioTag {
	return ScenarioTag{ID: id, Title: id + " 제목", Theme: theme, Dept: "ER", Difficulty: diff}
}

func TestAssemble_tiersByDifficultyAndExam(t *testing.T) {
	themes := []Theme{{Key: "er-triage", Name: "트리아지", Track: "depth", Dept: "ER", Order: 20}}
	tags := []ScenarioTag{
		tag("SCN-ER-00003", "er-triage", 2),
		tag("SCN-ER-00001", "er-triage", 1),
		tag("SCN-ER-00002", "er-triage", 1),
	}
	cur, orphans := Assemble(themes, tags)
	if len(orphans) != 0 {
		t.Fatalf("no orphans expected, got %v", orphans)
	}
	if len(cur) != 1 {
		t.Fatalf("want 1 curriculum, got %d", len(cur))
	}
	// 티어: Lv1(2건) → Lv2(1건), 각 티어 내부 ScenarioID 오름차순
	if len(cur[0].Tiers) != 2 || cur[0].Tiers[0].Difficulty != 1 || len(cur[0].Tiers[0].Steps) != 2 {
		t.Fatalf("tiers wrong: %+v", cur[0].Tiers)
	}
	if cur[0].Tiers[0].Steps[0].ScenarioID != "SCN-ER-00001" {
		t.Errorf("tier not id-sorted: %+v", cur[0].Tiers[0].Steps)
	}
	// exam(boss)이 마지막 티어 뒤 마지막 스텝
	last := cur[0].Tiers[len(cur[0].Tiers)-1].Steps
	if last[len(last)-1].Kind != "boss" {
		t.Errorf("last step should be boss(주제 시험), got %q", last[len(last)-1].Kind)
	}
}

func TestAssemble_orphanDetection(t *testing.T) {
	themes := []Theme{{Key: "er-triage", Track: "depth", Dept: "ER", Order: 20}}
	tags := []ScenarioTag{
		tag("SCN-ER-00001", "er-triage", 1),
		tag("SCN-ER-00009", "", 1),          // 미태그 → 고아
		tag("SCN-ER-00010", "unknown-key", 1), // 레지스트리에 없는 키 → 고아
	}
	_, orphans := Assemble(themes, tags)
	if len(orphans) != 2 {
		t.Fatalf("want 2 orphans, got %v", orphans)
	}
}

func TestAssemble_deterministic(t *testing.T) {
	themes := []Theme{{Key: "t", Track: "depth", Dept: "ER", Order: 1}}
	tags := []ScenarioTag{tag("SCN-ER-2", "t", 1), tag("SCN-ER-1", "t", 1)}
	a, _ := Assemble(themes, tags)
	b, _ := Assemble(themes, tags)
	if a[0].Tiers[0].Steps[0].ScenarioID != b[0].Tiers[0].Steps[0].ScenarioID {
		t.Fatal("assemble not deterministic")
	}
}
```

- [ ] **Step 2: 실패 확인** — `go test ./internal/curriculum/themed/ -run TestAssemble` → FAIL

- [ ] **Step 3: 구현** — `assemble.go`

```go
package themed

import (
	"sort"
	"strings"
)

// ScenarioTag is the assembly input for one scenario, projected from the DB.
type ScenarioTag struct {
	ID, Title, Theme, CollabWith, Dept string
	Difficulty                         int // briefing.difficulty (1..3); <1 treated as 1
}

type Step struct {
	Kind       string // dlg | quiz | event | boss(주제 시험)
	Name       string
	ScenarioID string
}

type Tier struct {
	Difficulty int
	Steps      []Step
}

type Curriculum struct {
	Theme Theme
	Tiers []Tier
}

// stepName derives the step label from the scenario title, dropping a persona
// suffix after " · " or " — " (domain R19).
func stepName(title string) string {
	for _, sep := range []string{" · ", " — "} {
		if i := strings.Index(title, sep); i >= 0 {
			return title[:i]
		}
	}
	return title
}

// Assemble groups tags into one Curriculum per registry theme, ordered into
// difficulty tiers. It reads ONLY the explicit `Theme` tag (R7 — no proxy
// inference). A tag whose Theme is empty or names a key absent from the
// registry is returned in orphans (R3 gate lives in the caller/test).
func Assemble(themes []Theme, tags []ScenarioTag) (curricula []Curriculum, orphans []string) {
	known := make(map[string]Theme, len(themes))
	for _, th := range themes {
		known[th.Key] = th
	}
	byTheme := make(map[string][]ScenarioTag)
	for _, tg := range tags {
		if tg.Theme == "" {
			orphans = append(orphans, tg.ID)
			continue
		}
		if _, ok := known[tg.Theme]; !ok {
			orphans = append(orphans, tg.ID)
			continue
		}
		byTheme[tg.Theme] = append(byTheme[tg.Theme], tg)
	}
	// Themes in registry order (R22): sort a copy by Order then Key.
	ordered := append([]Theme(nil), themes...)
	sort.SliceStable(ordered, func(i, j int) bool {
		if ordered[i].Order != ordered[j].Order {
			return ordered[i].Order < ordered[j].Order
		}
		return ordered[i].Key < ordered[j].Key
	})
	for _, th := range ordered {
		group := byTheme[th.Key]
		if len(group) == 0 {
			continue // no tagged scenarios yet (safe under empty tags, P1 constraint)
		}
		curricula = append(curricula, Curriculum{Theme: th, Tiers: buildTiers(group, th.ExamOn())})
	}
	sort.Strings(orphans)
	return curricula, orphans
}

func buildTiers(group []ScenarioTag, exam bool) []Tier {
	byDiff := map[int][]ScenarioTag{}
	for _, tg := range group {
		d := tg.Difficulty
		if d < 1 {
			d = 1
		}
		if d > 3 {
			d = 3
		}
		byDiff[d] = append(byDiff[d], tg)
	}
	var tiers []Tier
	for d := 1; d <= 3; d++ {
		g := byDiff[d]
		if len(g) == 0 {
			continue
		}
		sort.Slice(g, func(i, j int) bool { return g[i].ID < g[j].ID })
		steps := make([]Step, 0, len(g))
		for _, tg := range g {
			kind := "dlg"
			steps = append(steps, Step{Kind: kind, Name: stepName(tg.Title), ScenarioID: tg.ID})
		}
		tiers = append(tiers, Tier{Difficulty: d, Steps: steps})
	}
	if exam && len(tiers) > 0 {
		li := len(tiers) - 1
		tiers[li].Steps = append(tiers[li].Steps, Step{Kind: "boss", Name: "주제 시험"})
	}
	return tiers
}
```

- [ ] **Step 4: 테스트 통과 확인** — `go test ./internal/curriculum/themed/ -run TestAssemble` → PASS

- [ ] **Step 5: 커밋**

```bash
git add server/internal/curriculum/themed/assemble.go server/internal/curriculum/themed/assemble_test.go
git commit -m "feat(curriculum-v3): 조립 엔진 Assemble — 태그→주제→난이도 계단"
```

---

### Task 3: 트랙 그룹핑 + 진행 오버레이 `Resolve` (순수)

**Files:**
- Create: `server/internal/curriculum/themed/resolve.go`
- Create: `server/internal/curriculum/themed/resolve_test.go`

**Interfaces:**
- Consumes: `themed.Curriculum` (Task 2).
- Produces: `themed.TrackGroup`, `themed.CurriculumState`, `themed.TierCount`, `themed.Milestone` (domain-entities §4·§5); `themed.Resolve(curricula []Curriculum, deptOrder []string, cleared, attempted map[string]bool, latest string) []TrackGroup`.

- [ ] **Step 1: 실패 테스트 작성** — `resolve_test.go`

```go
package themed

import "testing"

func TestResolve_statesAndTrack(t *testing.T) {
	themes := []Theme{
		{Key: "core-sbar", Name: "SBAR", Track: "core", Order: 10},
		{Key: "er-triage", Name: "트리아지", Track: "depth", Dept: "ER", Order: 20},
	}
	tags := []ScenarioTag{
		{ID: "SCN-CORE-1", Title: "인계1", Theme: "core-sbar", Dept: "CORE", Difficulty: 1},
		{ID: "SCN-ER-1", Title: "트리아지1", Theme: "er-triage", Dept: "ER", Difficulty: 1},
		{ID: "SCN-ER-2", Title: "트리아지2", Theme: "er-triage", Dept: "ER", Difficulty: 2},
	}
	cur, _ := Assemble(themes, tags)
	cleared := map[string]bool{"SCN-ER-1": true}
	tracks := Resolve(cur, []string{"ER"}, cleared, nil, "SCN-ER-1")

	// CORE 트랙이 먼저, 그다음 ER
	if len(tracks) != 2 || tracks[0].Dept != "CORE" || tracks[1].Dept != "ER" {
		t.Fatalf("track order/deps wrong: %+v", tracks)
	}
	// er-triage: 최근 시도가 SCN-ER-1(이 주제) → here
	var triage *CurriculumState
	for i := range tracks[1].Curricula {
		if tracks[1].Curricula[i].ThemeKey == "er-triage" {
			triage = &tracks[1].Curricula[i]
		}
	}
	if triage == nil || triage.State != "here" {
		t.Fatalf("er-triage should be here: %+v", triage)
	}
	// Lv1(1건) 완료 → Lv2 unlock
	if len(triage.Tiers) != 2 || !triage.Tiers[1].Unlocked {
		t.Errorf("Lv2 should unlock after Lv1 cleared: %+v", triage.Tiers)
	}
	// 부서 시험 마일스톤은 미완(트리아지 미완) → open 아님... 필수 주제 미완이므로 nil/closed
	if tracks[1].Milestone == nil {
		t.Errorf("ER track should carry a milestone")
	}
}

func TestResolve_resumeExactlyOne(t *testing.T) {
	themes := []Theme{{Key: "core-sbar", Track: "core", Order: 10}}
	tags := []ScenarioTag{{ID: "SCN-CORE-1", Title: "인계", Theme: "core-sbar", Dept: "CORE", Difficulty: 1}}
	cur, _ := Assemble(themes, tags)
	tracks := Resolve(cur, nil, nil, nil, "") // 이력 없음 → 첫 주제(core)가 resume
	n := 0
	for _, tr := range tracks {
		for _, c := range tr.Curricula {
			if c.Resume {
				n++
			}
		}
	}
	if n != 1 {
		t.Fatalf("resume must be exactly 1, got %d", n)
	}
}
```

- [ ] **Step 2: 실패 확인** — `go test ./internal/curriculum/themed/ -run TestResolve` → FAIL

- [ ] **Step 3: 구현** — `resolve.go`

```go
package themed

import "sort"

type TierCount struct {
	Difficulty  int  `json:"difficulty"`
	Done, Total int  `json:"done"` // Total via struct tag below
	Unlocked    bool `json:"unlocked"`
}

type CurriculumState struct {
	ThemeKey, Name, Track, Dept string
	CollabWith                  string
	Done, Total                 int
	State                       string // passed | here | open
	Tiers                       []TierCount
	Resume                      bool
}

type Milestone struct {
	Name  string `json:"name"`
	State string `json:"state"` // passed | open
}

type TrackGroup struct {
	Dept      string            `json:"dept"`
	Curricula []CurriculumState `json:"curricula"`
	Milestone *Milestone        `json:"milestone,omitempty"`
}

// Resolve overlays progress onto assembled curricula and groups them into
// tracks: CORE first, then dept tracks in deptOrder. Pure; no I/O.
func Resolve(curricula []Curriculum, deptOrder []string, cleared, attempted map[string]bool, latest string) []TrackGroup {
	// theme key of the latest attempt → drives `here`/resume.
	latestTheme := ""
	for _, c := range curricula {
		for _, ti := range c.Tiers {
			for _, s := range ti.Steps {
				if s.ScenarioID == latest {
					latestTheme = c.Theme.Key
				}
			}
		}
	}
	// Build states.
	byDept := map[string][]CurriculumState{}
	deptSeen := []string{}
	states := map[string]*CurriculumState{}
	order := []*CurriculumState{}
	for i := range curricula {
		st := resolveOne(curricula[i], cleared, latestTheme)
		dept := "CORE"
		if curricula[i].Theme.Track != "core" {
			dept = curricula[i].Theme.Dept
		}
		if _, ok := byDept[dept]; !ok {
			deptSeen = append(deptSeen, dept)
		}
		byDept[dept] = append(byDept[dept], st)
		states[curricula[i].Theme.Key] = &byDept[dept][len(byDept[dept])-1]
		order = append(order, states[curricula[i].Theme.Key])
	}
	// Resume: exactly one (R15~R18). Prefer latestTheme; else first not-done in order.
	setResume(order, latestTheme)
	// Track order: CORE first, then deptOrder, then any remaining depts seen.
	tracks := make([]TrackGroup, 0, len(byDept))
	emit := func(dept string) {
		cs, ok := byDept[dept]
		if !ok {
			return
		}
		delete(byDept, dept)
		tracks = append(tracks, TrackGroup{Dept: dept, Curricula: cs, Milestone: milestoneFor(cs)})
	}
	emit("CORE")
	for _, d := range deptOrder {
		emit(d)
	}
	for _, d := range deptSeen { // stable remainder
		emit(d)
	}
	return tracks
}

func resolveOne(c Curriculum, cleared map[string]bool, latestTheme string) CurriculumState {
	st := CurriculumState{
		ThemeKey: c.Theme.Key, Name: c.Theme.Name, Track: c.Theme.Track, Dept: c.Theme.Dept,
	}
	prevTierDone := true
	for _, ti := range c.Tiers {
		tc := TierCount{Difficulty: ti.Difficulty, Unlocked: prevTierDone}
		tierDone := true
		for _, s := range ti.Steps {
			if s.Kind == "quiz" { // optional, not counted
				continue
			}
			tc.Total++
			st.Total++
			if cleared[s.ScenarioID] {
				tc.Done++
				st.Done++
			} else {
				tierDone = false
			}
		}
		st.Tiers = append(st.Tiers, tc)
		prevTierDone = prevTierDone && tierDone
	}
	switch {
	case st.Total > 0 && st.Done == st.Total:
		st.State = "passed"
	case c.Theme.Key == latestTheme:
		st.State = "here"
	default:
		st.State = "open"
	}
	return st
}

func milestoneFor(cs []CurriculumState) *Milestone {
	all := true
	for _, c := range cs {
		if c.State != "passed" {
			all = false
		}
	}
	state := "open"
	if !all {
		state = "closed"
	}
	return &Milestone{Name: "구간 시험", State: state}
}

func setResume(order []*CurriculumState, latestTheme string) {
	// R15: latest attempt's theme if not fully done.
	if latestTheme != "" {
		for _, s := range order {
			if s.ThemeKey == latestTheme && s.State != "passed" {
				s.Resume = true
				return
			}
		}
	}
	// R16/R17: first not-passed in learning order (CORE first by construction).
	for _, s := range order {
		if s.State != "passed" {
			s.Resume = true
			return
		}
	}
	// R18: all passed → none.
	_ = sort.IntSlice(nil)
}
```

> `TierCount`의 `Total`은 `json:"total"`이어야 한다. Go 구조체 태그는 필드마다 하나이므로 `Done, Total int`를 두 줄로 분리해 각각 `json:"done"`, `json:"total"`을 단다. 구현 시 다음으로 교체:
> ```go
> Difficulty int  `json:"difficulty"`
> Done       int  `json:"done"`
> Total      int  `json:"total"`
> Unlocked   bool `json:"unlocked"`
> ```
> 같은 원칙으로 `CurriculumState`의 `Done, Total int` 및 `ThemeKey,Name,Track,Dept`도 개별 json 태그를 단다(`themeKey,name,track,dept,collabWith,done,total,state,tiers,resume`).

- [ ] **Step 4: 테스트 통과 확인** — `go test ./internal/curriculum/themed/ -run TestResolve` → PASS. 전체 `go test ./internal/curriculum/themed/` → PASS.

- [ ] **Step 5: 커밋**

```bash
git add server/internal/curriculum/themed/resolve.go server/internal/curriculum/themed/resolve_test.go
git commit -m "feat(curriculum-v3): Resolve — 트랙 그룹핑 + 진행 상태(passed/here/open) + 이어하기"
```

---

### Task 4: DB 마이그레이션 — `theme`/`collab_with` 컬럼

**Files:**
- Create: `server/db/migrations/000038_scenario_theme.up.sql`
- Create: `server/db/migrations/000038_scenario_theme.down.sql`

**Interfaces:**
- Produces: `scenarios.theme text NOT NULL DEFAULT ''`, `scenarios.collab_with text NOT NULL DEFAULT ''`, `idx_scenarios_theme`.

- [ ] **Step 1: up 마이그레이션 작성** — `000038_scenario_theme.up.sql`

```sql
-- 커리큘럼 v3: 시나리오에 주제 태그. 런타임이 DB에서 시나리오를 읽으므로
-- 조립기가 theme으로 GROUP BY 하려면 전용 컬럼이 필요하다(briefing JSON 파싱 회피).
ALTER TABLE scenarios ADD COLUMN theme text NOT NULL DEFAULT '';
ALTER TABLE scenarios ADD COLUMN collab_with text NOT NULL DEFAULT '';
CREATE INDEX idx_scenarios_theme ON scenarios (theme);
```

- [ ] **Step 2: down 마이그레이션 작성** — `000038_scenario_theme.down.sql`

```sql
DROP INDEX IF EXISTS idx_scenarios_theme;
ALTER TABLE scenarios DROP COLUMN IF EXISTS collab_with;
ALTER TABLE scenarios DROP COLUMN IF EXISTS theme;
```

- [ ] **Step 3: 검증** — 마이그레이션 도구 규약 확인(다른 파일과 동일 헤더/네이밍). `ls server/db/migrations | tail`로 000038 쌍이 있는지, 짝(up/down)이 맞는지 확인.

- [ ] **Step 4: 커밋**

```bash
git add server/db/migrations/000038_scenario_theme.up.sql server/db/migrations/000038_scenario_theme.down.sql
git commit -m "feat(curriculum-v3): 마이그레이션 000038 — scenarios.theme/collab_with"
```

---

### Task 5: sqlc + seed — 태그 적재 & 조립용 조회

**Files:**
- Modify: `server/db/queries/content.sql:70` (CreateScenario에 theme/collab_with)
- Create: `server/db/queries/content.sql` 에 `ListScenarioTags` 쿼리 추가
- Modify: `server/internal/adapters/postgres/content_repo.go:34-45` (Seed가 theme/collab_with 전달) + 조회 메서드
- Regenerate: `server/internal/adapters/postgres/sqlc/*` (`make sqlc`)
- Test: `server/internal/adapters/postgres/content_repo_theme_test.go` (DB 있는 경우만; 없으면 Skip)

**Interfaces:**
- Consumes: `content.Scenario.Theme/CollabWith` (Task 1), `themed.ScenarioTag` (Task 2).
- Produces: `ContentRepo.ListScenarioTags(ctx) ([]themed.ScenarioTag, error)`.

- [ ] **Step 1: CreateScenario 쿼리에 컬럼 추가** — `content.sql:70`의 INSERT를 다음으로:

```sql
-- name: CreateScenario :exec
INSERT INTO scenarios (id, profession, event_id, title, tagline, persona, goals, guardrails, key_phrases, steps, briefing, acuity, theme, collab_with)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);
```

- [ ] **Step 2: ListScenarioTags 쿼리 추가** — `content.sql` 하단에:

```sql
-- name: ListScenarioTags :many
-- 조립기 입력: 부팅 시 1회 조회. difficulty는 briefing JSON에서 뽑되 컬럼처럼 노출.
SELECT id, title, theme, collab_with,
       COALESCE((briefing->>'difficulty')::int, 1) AS difficulty
  FROM scenarios
 ORDER BY id;
```

- [ ] **Step 3: `make sqlc` 재생성** — `cd server && PATH="$PATH:$(go env GOPATH)/bin" make sqlc`. `CreateScenarioParams`에 `Theme`/`CollabWith`, 신규 `ListScenarioTags`/`ListScenarioTagsRow` 생성 확인.

- [ ] **Step 4: Seed에 태그 전달** — `content_repo.go`의 `CreateScenario` 호출 인자에 추가:

```go
			Acuity: s.Acuity, Theme: s.Theme, CollabWith: s.CollabWith}); err != nil {
```

- [ ] **Step 5: ListScenarioTags 리포 메서드 추가** — `content_repo.go`에:

```go
// ListScenarioTags projects every scenario's assembly tag for themed.Assemble.
func (r *ContentRepo) ListScenarioTags(ctx context.Context) ([]themed.ScenarioTag, error) {
	rows, err := r.q.ListScenarioTags(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]themed.ScenarioTag, 0, len(rows))
	for _, row := range rows {
		out = append(out, themed.ScenarioTag{
			ID: row.ID, Title: row.Title, Theme: row.Theme, CollabWith: row.CollabWith,
			Dept: deptCodeOf(row.ID), Difficulty: int(row.Difficulty),
		})
	}
	return out, nil
}

// deptCodeOf pulls the dept from a content id: SCN-ER-00001 → "ER".
func deptCodeOf(id string) string {
	parts := strings.SplitN(id, "-", 3)
	if len(parts) >= 3 {
		return parts[1]
	}
	return ""
}
```

> `strings` import와 `themed` import를 `content_repo.go`에 추가. `deptCodeOf`가 이미 있으면 재사용.

- [ ] **Step 6: DB 왕복 테스트(있으면)** — `content_repo_theme_test.go`. 기존 리포 테스트의 DB 게이트 패턴(`TEST_DATABASE_URL` 없으면 `t.Skip`)을 그대로 따른다.

```go
func TestListScenarioTags_roundTrip(t *testing.T) {
	repo := testRepoOrSkip(t) // 기존 헬퍼 규약을 따른다; 없으면 t.Skip
	ctx := context.Background()
	_ = repo.Seed(ctx, &content.Bundle{Scenarios: []content.Scenario{{
		ID: "SCN-ER-00001", Title: "트리아지 · Mr. X", Theme: "er-triage",
		Briefing: &content.Briefing{Difficulty: 2},
	}}})
	tags, err := repo.ListScenarioTags(ctx)
	if err != nil {
		t.Fatal(err)
	}
	var got *themed.ScenarioTag
	for i := range tags {
		if tags[i].ID == "SCN-ER-00001" {
			got = &tags[i]
		}
	}
	if got == nil || got.Theme != "er-triage" || got.Difficulty != 2 || got.Dept != "ER" {
		t.Fatalf("round-trip wrong: %+v", got)
	}
}
```

- [ ] **Step 7: 빌드·테스트** — `go build ./...` → 통과. `go test ./internal/adapters/postgres/...` → PASS(또는 DB 없으면 Skip). 기존 seed 인서트가 새 컬럼 없이도(값 '') 통과하는지 확인.

- [ ] **Step 8: 커밋**

```bash
git add server/db/queries/content.sql server/internal/adapters/postgres/
git commit -m "feat(curriculum-v3): seed에 theme/collab_with 적재 + ListScenarioTags 조회"
```

---

### Task 6: 부팅 시 조립 카탈로그 캐시 (공존)

**Files:**
- Create: `server/internal/curriculum/themed/catalog.go`
- Create: `server/internal/curriculum/themed/catalog_test.go`
- Modify: 서버 부트스트랩(예: `server/internal/app` 또는 `cmd/server` 초기화 지점 — 리포·핸들러 조립부)

**Interfaces:**
- Consumes: `themed.LoadThemes`, `themed.Assemble`, `themed.Resolve`, `ContentRepo.ListScenarioTags`.
- Produces: `themed.NewCatalog(themes []Theme, tags []ScenarioTag) *Catalog`; `(*Catalog).Resolve(cleared, attempted map[string]bool, latest string) []TrackGroup`; `(*Catalog).Orphans() []string`.

- [ ] **Step 1: 실패 테스트 작성** — `catalog_test.go`

```go
package themed

import "testing"

func TestCatalog_emptyTagsSafe(t *testing.T) {
	// P1 제약: 태그가 비어도 패닉 없이 빈 트랙.
	cat := NewCatalog([]Theme{{Key: "er-triage", Track: "depth", Dept: "ER", Order: 20}}, nil)
	tracks := cat.Resolve(nil, nil, "")
	if len(tracks) != 0 {
		t.Fatalf("empty tags → no tracks, got %d", len(tracks))
	}
	if len(cat.Orphans()) != 0 {
		t.Fatalf("no tags → no orphans, got %v", cat.Orphans())
	}
}

func TestCatalog_deptOrderFromTags(t *testing.T) {
	themes := []Theme{{Key: "er-t", Track: "depth", Dept: "ER", Order: 1}}
	tags := []ScenarioTag{{ID: "SCN-ER-1", Title: "t", Theme: "er-t", Dept: "ER", Difficulty: 1}}
	cat := NewCatalog(themes, tags)
	tracks := cat.Resolve(nil, nil, "")
	if len(tracks) != 1 || tracks[0].Dept != "ER" {
		t.Fatalf("want ER track, got %+v", tracks)
	}
}
```

- [ ] **Step 2: 실패 확인** — `go test ./internal/curriculum/themed/ -run TestCatalog` → FAIL

- [ ] **Step 3: 구현** — `catalog.go`

```go
package themed

import "sort"

// Catalog holds the assembled curricula, built once at boot from the DB tags.
// Content changes require a re-seed + restart, so no runtime refresh.
type Catalog struct {
	curricula []Curriculum
	deptOrder []string
	orphans   []string
}

func NewCatalog(themes []Theme, tags []ScenarioTag) *Catalog {
	cur, orphans := Assemble(themes, tags)
	// deptOrder: depts present among depth/collab themes, by Theme.Order then dept.
	seen := map[string]int{}
	for _, c := range cur {
		if c.Theme.Track == "core" {
			continue
		}
		if _, ok := seen[c.Theme.Dept]; !ok {
			seen[c.Theme.Dept] = c.Theme.Order
		}
	}
	depts := make([]string, 0, len(seen))
	for d := range seen {
		depts = append(depts, d)
	}
	sort.Slice(depts, func(i, j int) bool {
		if seen[depts[i]] != seen[depts[j]] {
			return seen[depts[i]] < seen[depts[j]]
		}
		return depts[i] < depts[j]
	})
	return &Catalog{curricula: cur, deptOrder: depts, orphans: orphans}
}

func (c *Catalog) Resolve(cleared, attempted map[string]bool, latest string) []TrackGroup {
	return Resolve(c.curricula, c.deptOrder, cleared, attempted, latest)
}

func (c *Catalog) Orphans() []string { return c.orphans }
```

- [ ] **Step 4: 부트스트랩 배선(라이브 미교체)** — 서버 초기화에서 themes.yaml 로드 + `ListScenarioTags`로 카탈로그 1회 빌드해 보관. **기존 `curriculum` 경로와 `GET /me/curriculum`은 그대로 둔다.** 로드 실패(파일 없음)는 치명적이지 않게 처리(빈 카탈로그) — 실제 배선 지점은 리포·핸들러가 조립되는 곳을 찾아(예: `grep -rn "NewContentRepo\|progressHandler{" server/internal`) 그 옆에 추가.

- [ ] **Step 5: 테스트 통과 확인** — `go test ./internal/curriculum/themed/` → PASS. `go build ./...` → 통과.

- [ ] **Step 6: 커밋**

```bash
git add server/internal/curriculum/themed/catalog.go server/internal/curriculum/themed/catalog_test.go server/internal/…(부트스트랩)
git commit -m "feat(curriculum-v3): 부팅 시 조립 카탈로그 캐시 (라이브 경로 공존)"
```

---

### Task 7: 추가 엔드포인트 `GET /me/curriculum/tracks` (라이브 미교체) + 계약

**Files:**
- Modify: `server/internal/adapters/http/progress_handler.go` (신규 핸들러 + 라우트, 기존 `curriculum` 핸들러 불변)
- Modify: 라우터 등록 지점
- Modify: `mobile/src/api/client.ts` (타입만 추가 — UI 미배선)
- Regenerate: `packages/contract/{openapi.yaml,types.ts}` (`make contract`가 있으면)
- Test: `server/internal/adapters/http/curriculum_tracks_test.go`

**Interfaces:**
- Consumes: `themed.Catalog.Resolve` (Task 6).
- Produces: `GET /me/curriculum/tracks` → `{"tracks": []themed.TrackGroup}`.

- [ ] **Step 1: 실패 테스트 작성** — `curriculum_tracks_test.go` (기존 핸들러 테스트의 셋업 규약을 따라, 카탈로그에 픽스처 태그를 넣고 응답 shape 검증). 기존 `progress_handler` 테스트 파일의 패턴을 그대로 참고해 작성한다.

```go
func TestCurriculumTracks_shape(t *testing.T) {
	// 픽스처 카탈로그를 주입한 progressHandler로 GET /me/curriculum/tracks 호출.
	// 응답 JSON에 "tracks" 키, 첫 트랙 Dept, curricula[].state 존재를 단언.
	// (구체 셋업은 기존 progress_handler 테스트 헬퍼 재사용)
}
```

> 이 테스트의 본문은 기존 핸들러 테스트(예: `progress_handler_test.go`)의 라우터·인증 스텁 셋업을 복제해 채운다. 새 유틸을 만들지 말고 그 파일의 헬퍼를 그대로 쓴다.

- [ ] **Step 2: 실패 확인** — `go test ./internal/adapters/http/ -run TestCurriculumTracks` → FAIL

- [ ] **Step 3: 핸들러 + 라우트 구현** — `progress_handler.go`에 기존 `curriculum` 메서드 아래로:

```go
func (h *progressHandler) curriculumTracks(w http.ResponseWriter, r *http.Request) {
	uid := auth.UserID(r.Context())
	cleared, _ := h.progress.ClearedScenarioIDs(r.Context(), uid)
	attempted, _ := h.progress.AttemptedScenarioIDs(r.Context(), uid)
	last, _ := h.progress.LatestAttemptScenarioID(r.Context(), uid)
	tracks := h.themed.Resolve(cleared, attempted, last) // h.themed = *themed.Catalog (Task 6에서 주입)
	httpx.JSON(w, http.StatusOK, map[string]any{"tracks": tracks})
}
```

> 기존 `curriculum` 핸들러가 쓰는 progress 접근 시그니처(`ClearedScenarioIDs` 등)를 그대로 맞춘다(맵 vs 슬라이스 반환형은 §progress_handler.go:46 참고). `h.themed`는 Task 6 카탈로그를 핸들러 구조체에 주입해 얻는다. 라우트는 기존 `/me/curriculum` 등록부 옆에 `/me/curriculum/tracks` GET으로 추가.

- [ ] **Step 4: 클라이언트 타입 추가(미배선)** — `mobile/src/api/client.ts`에 `TrackGroup`/`CurriculumState`(v3) 타입 + `curriculumTracks()` 메서드. **UI는 P3에서 배선**하므로 여기서는 타입·메서드만.

- [ ] **Step 5: 계약 재생성** — `make contract`가 있으면 실행. 없으면(모범답안 엔드포인트처럼 수기 클라이언트면) 이 단계는 클라이언트 타입 추가로 갈음.

- [ ] **Step 6: 테스트·빌드** — `go test ./internal/adapters/http/ -run TestCurriculumTracks` → PASS. `cd mobile && npx tsc --noEmit` → 통과.

- [ ] **Step 7: 커밋**

```bash
git add server/internal/adapters/http/ mobile/src/api/client.ts packages/contract 2>/dev/null
git commit -m "feat(curriculum-v3): 추가 엔드포인트 /me/curriculum/tracks (라이브 미교체)"
```

---

### Task 8: R3 고아-0 게이트 테스트(P2 스킵) + STATUS 기록

**Files:**
- Create: `server/internal/curriculum/themed/orphan_gate_test.go`
- Modify: `docs/dlc/projects/forin/02-construction/curriculum-v3/build-spec-index.md` (상태 PHASE-1-IMPLEMENTED)
- Modify: `docs/dlc/projects/forin/STATUS.md`

**Interfaces:** 없음(문서·게이트 테스트).

- [ ] **Step 1: 고아-0 게이트 테스트 작성** — `orphan_gate_test.go`. 실데이터(전체 시나리오) 대상 R3 게이트를 문서화하되 P2 전까지 Skip.

```go
package themed

import "testing"

// R3: every scenario must belong to exactly one theme (orphans == 0).
// Enabled after P2 tagging fills theme tags for the full content set.
func TestNoOrphans_fullContent(t *testing.T) {
	t.Skip("P2 게이트: 전수조사 태깅 완료 후 활성화 — themes.yaml + 태그된 시나리오로 Assemble해 orphans==0 검증")
}
```

- [ ] **Step 2: 전체 서버 테스트** — `cd server && go test ./...` → 실패 없음(신규 스킵 포함).

- [ ] **Step 3: 스펙 상태 갱신** — build-spec-index.md 프론트매터 `status: SPEC-DRAFT` → `status: PHASE-1-IMPLEMENTED`.

- [ ] **Step 4: STATUS.md 갱신** — 커리큘럼 v3 항목에 "P1 구현 완료(조립 엔진·스키마·추가 엔드포인트, 라이브 미교체). 다음: P2 전수조사 태깅" 한 줄 추가.

- [ ] **Step 5: 커밋(메인 + waypoint)**

```bash
# 메인
git add server/internal/curriculum/themed/orphan_gate_test.go
git commit -m "test(curriculum-v3): R3 고아-0 게이트 (P2까지 skip)"
# waypoint (docs/dlc 서브모듈)
cd docs/dlc && git add projects/forin/02-construction/curriculum-v3/build-spec-index.md projects/forin/STATUS.md \
  && git commit -m "docs(forin): 커리큘럼 v3 P1 구현 완료 기록"
```

---

## 자기 검토 (작성자 체크)

**스펙 커버리지:** U1(주제=단위)=Task2·3 · U2/U5(깊이·개수)=Assemble 티어 · U3(3계층)=Assemble/Resolve 트랙 · U6(난이도 계단)=buildTiers/tier unlock · U4(자유 탐방 없음)=조립이 모든 태그를 주제로만 묶음 · R1(1주제)=byTheme · R3(고아0)=orphans+Task8 게이트 · R7(유추 금지)=Theme 태그만 읽음 · R8/R9(계단·해금)=resolveOne prevTierDone · R10(주제시험)=exam boss · R15~R18(이어하기)=setResume · R19(이름 파생)=stepName · R22(결정성)=sort/Task2 test · theme DB 컬럼=Task4/5 · 공존=Task6/7(라이브 미교체). **P2·P3 인터페이스**(계약)=Task7 DTO.

**미커버(의도적, P2/P3):** 실제 100개 주제 목록·실 태깅(P2) · 여정 지도 렌더(P3) · 라이브 엔드포인트 교체(P2 태깅 후).

**타입 일관성:** `themed.Theme`(Exam *bool, ExamOn()) · `ScenarioTag{ID,Title,Theme,CollabWith,Dept,Difficulty}` · `Step{Kind,Name,ScenarioID}` · `Tier{Difficulty,Steps}` · `Curriculum{Theme,Tiers}` · `TierCount{Difficulty,Done,Total,Unlocked}` · `CurriculumState{...,Tiers []TierCount}` · `TrackGroup{Dept,Curricula,Milestone}` · `Catalog.Resolve(cleared,attempted,latest)` — Task 간 일치 확인.
