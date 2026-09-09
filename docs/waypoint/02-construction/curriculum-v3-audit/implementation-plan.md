# 커리큘럼 v3 · P2 전수조사 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 전 시나리오(3,044)를 주제로 편입(고아 0)하고 주제당 상황 ≥20을 보장하는 주제 레지스트리와 태그된 콘텐츠를 완성한다. 태깅의 대량 부분은 생성기가 `Topic.Theme`에서 자동 emit하고, 손저작 303개만 파일에 태그한다.

**Architecture:** `cmd/gencontent`의 `Topic`에 `Theme`(+`CollabWith`)을 더해 각 Topic을 주제에 배정하면, 생성기가 시나리오마다 `theme`을 emit한다(생성분 자동 태깅). 손저작 `scn-*.yaml`은 파일에 직접 태그. `themes.yaml` 레지스트리(~100개, Topic 2~3개 묶음)와 읽기전용 `cmd/audit`(분포·고아·중복·thin 리포트)로 큐레이션을 검증한다. **정본 재발급**(id 리셋 수용)이므로 Topic을 자유롭게 재배치·제거·추가한다. 부서 단위 vertical slice(ER 먼저).

**Tech Stack:** Go(gencontent 템플릿 생성기 · cmd/audit CLI · themed 조립), YAML 콘텐츠, 표준 `testing`.

**Spec:** `docs/dlc/projects/forin/02-construction/curriculum-v3-audit/` (build-spec-index · business-logic-model · business-rules) + P1 `../curriculum-v3/`.

## Global Constraints

- **생성분은 코드에서 파생(R-P2-1):** `gen-*.yaml`의 `theme`은 손으로 안 쓴다 — `Topic.Theme` → 생성기 emit → 재생성.
- **손저작만 파일 태깅(R-P2-2):** `scn-*.yaml` 303개에만 `theme:`을 직접 쓴다.
- **모든 Topic에 유효 Theme(R-P2-3):** 테스트가 "Topic.Theme != '' && themes.yaml에 존재"를 강제.
- **주제당 ≥20(R2/R-P2-4):** 주제는 Topic 2~3개 묶음. 미만이면 병합·보강. audit/테스트가 thin을 잡는다.
- **고아 0(R3):** 태그 없는 시나리오 0. 최종 게이트.
- **3계층(R-P2-5/6):** core(전 부서 공유)·depth(부서 고유)·collab(collabWith 상대 부서).
- **정본 재발급(R-P2-8):** id 리셋 수용. append 제약 없음. 재생성 후 id-diff를 audit로 출력.
- **결정성(R22):** 같은 입력에 같은 출력. themes.yaml + depts*.go의 Theme 배정만으로 생성분 태깅이 재현된다.

---

### Task 1: `Topic.Theme`/`CollabWith` 필드 + 생성기 emit + 불변식 테스트

**Files:**
- Modify: `server/cmd/gencontent/banks.go:17-27` (`Topic` 구조체)
- Modify: `server/cmd/gencontent/main.go:130-156` (시나리오 리터럴에 emit)
- Create: `server/cmd/gencontent/theme_test.go`

**Interfaces:**
- Produces: `Topic.Theme string`, `Topic.CollabWith string`; 생성 시나리오의 `Scenario.Theme`/`CollabWith` 채워짐.

- [ ] **Step 1: 실패 테스트 작성** — `theme_test.go`

```go
package main

import "testing"

// 모든 Topic은 주제 key를 선언해야 한다(R-P2-3). 미배정 Topic이 있으면 그 시나리오가 고아가 된다.
func TestEveryTopicHasTheme(t *testing.T) {
	var missing []string
	for _, d := range Depts() { // Depts()는 depts*.go의 init이 채운 전역 슬라이스 접근자(Step 3에서 노출)
		for _, tp := range d.Topics {
			if tp.Theme == "" {
				missing = append(missing, d.Code+" / "+tp.Title)
			}
		}
	}
	if len(missing) != 0 {
		t.Fatalf("Theme 미배정 Topic %d개 (P2 진행 중 정상; 완료 시 0): 예) %v", len(missing), first(missing, 5))
	}
}

func first(s []string, n int) []string {
	if len(s) < n {
		return s
	}
	return s[:n]
}
```

> 이 테스트는 P2 태깅이 끝나기 전에는 실패한다. 그래서 지금은 **`t.Skip("P2 진행 중: ER 슬라이스부터 배정")`을 함수 첫 줄에 넣어 두고**, Task 5(게이트)에서 skip을 제거한다. 부서별로 배정이 끝날 때마다 로컬에서 skip을 잠깐 풀어 확인한다.

- [ ] **Step 2: 실패 확인** — `cd server && go test ./cmd/gencontent/ -run TestEveryTopicHasTheme` → FAIL(필드 없음)

- [ ] **Step 3: Topic 필드 + Depts 접근자 추가** — `banks.go`

```go
type Topic struct {
	Title, Tagline, Room, Brief, Role string
	Diff                              int
	Skills, Phrases, Goals, Guard     []string
	Moods                             []string
	Acuity                            string
	// Theme (커리큘럼 v3 P2): 이 Topic이 속한 주제 key(themes.yaml). 생성 시나리오는 이 값을 theme으로 emit한다.
	Theme string
	// CollabWith: track=collab Topic에만. 이 상황을 내 부서 시점에서 접하는 상대 부서 코드.
	CollabWith string
}
```

`depts*.go`의 `init`이 채우는 전역 부서 슬라이스가 있으면 그 이름으로 접근자를 만든다(예: `var depts []Dept` → `func Depts() []Dept { return depts }`). 이미 접근자가 있으면 재사용한다. (`grep -n "var depts\|func .*\[\]Dept" cmd/gencontent/*.go`로 확인.)

- [ ] **Step 4: 생성기 emit** — `main.go`의 시나리오 리터럴에서 `Acuity: t.acuityOf(),` 다음 줄에 추가:

```go
			Acuity:     t.acuityOf(),
			Theme:      t.Theme,
			CollabWith: t.CollabWith,
```

- [ ] **Step 5: 빌드 확인** — `go build ./cmd/gencontent/` → 통과(값 배정은 Task 3+). 테스트는 아직 Skip 상태.

- [ ] **Step 6: 커밋**

```bash
git add server/cmd/gencontent/banks.go server/cmd/gencontent/main.go server/cmd/gencontent/theme_test.go
git commit -m "feat(curriculum-v3 P2): Topic.Theme/CollabWith 필드 + 생성기 theme emit"
```

---

### Task 2: audit 리포트 (`themed.Audit` + `cmd/audit` CLI)

**Files:**
- Create: `server/internal/curriculum/themed/audit.go`
- Create: `server/internal/curriculum/themed/audit_test.go`
- Create: `server/cmd/audit/main.go`

**Interfaces:**
- Consumes: `themed.Theme`, `themed.ScenarioTag`, `themed.Assemble` (P1).
- Produces: `themed.ThemeStat{Key,Count,Thin}`, `themed.AuditReport{Themes,Orphans,Duplicates,TotalTagged}`, `themed.Audit(themes []Theme, tags []ScenarioTag, minDepth int) AuditReport`.

- [ ] **Step 1: 실패 테스트 작성** — `audit_test.go`

```go
package themed

import "testing"

func TestAudit_countsThinAndOrphansAndDupes(t *testing.T) {
	themes := []Theme{
		{Key: "er-triage", Track: "depth", Dept: "ER", Order: 20},
		{Key: "er-thin", Track: "depth", Dept: "ER", Order: 30},
	}
	tags := []ScenarioTag{
		{ID: "SCN-ER-1", Title: "흉통 트리아지", Theme: "er-triage", Dept: "ER", Difficulty: 1},
		{ID: "SCN-ER-2", Title: "흉통 트리아지", Theme: "er-triage", Dept: "ER", Difficulty: 1}, // dup title
		{ID: "SCN-ER-3", Title: "복통 문진", Theme: "er-thin", Dept: "ER", Difficulty: 1},
		{ID: "SCN-ER-9", Title: "미분류", Theme: "", Dept: "ER", Difficulty: 1}, // orphan
	}
	rep := Audit(themes, tags, 2) // minDepth 2 for the test
	if rep.TotalTagged != 3 {
		t.Fatalf("tagged=3 expected, got %d", rep.TotalTagged)
	}
	if len(rep.Orphans) != 1 || rep.Orphans[0] != "SCN-ER-9" {
		t.Fatalf("orphan SCN-ER-9 expected, got %v", rep.Orphans)
	}
	// er-triage count 2 (>=2 → not thin); er-thin count 1 (<2 → thin)
	stat := map[string]ThemeStat{}
	for _, s := range rep.Themes {
		stat[s.Key] = s
	}
	if stat["er-triage"].Count != 2 || stat["er-triage"].Thin {
		t.Errorf("er-triage should be count 2, not thin: %+v", stat["er-triage"])
	}
	if !stat["er-thin"].Thin {
		t.Errorf("er-thin should be thin: %+v", stat["er-thin"])
	}
	if len(rep.Duplicates) == 0 {
		t.Errorf("duplicate title '흉통 트리아지' should be reported")
	}
}
```

- [ ] **Step 2: 실패 확인** — `go test ./internal/curriculum/themed/ -run TestAudit` → FAIL

- [ ] **Step 3: 구현** — `audit.go`

```go
package themed

import "sort"

type ThemeStat struct {
	Key   string
	Count int
	Thin  bool
}

type AuditReport struct {
	Themes      []ThemeStat // registry order
	Orphans     []string    // scenario ids with no known theme
	Duplicates  []string    // "dept: title" seen more than once
	TotalTagged int
}

// Audit summarizes tagging coverage for curation. minDepth marks themes below
// the depth target as Thin (R2/R-P2-4). Pure; no I/O.
func Audit(themes []Theme, tags []ScenarioTag, minDepth int) AuditReport {
	_, orphans := Assemble(themes, tags)
	count := map[string]int{}
	titleSeen := map[string]int{}
	dupSet := map[string]bool{}
	tagged := 0
	known := map[string]bool{}
	for _, th := range themes {
		known[th.Key] = true
	}
	for _, tg := range tags {
		if tg.Theme != "" && known[tg.Theme] {
			count[tg.Theme]++
			tagged++
		}
		key := tg.Dept + ": " + tg.Title
		titleSeen[key]++
		if titleSeen[key] == 2 {
			dupSet[key] = true
		}
	}
	stats := make([]ThemeStat, 0, len(themes))
	for _, th := range themes {
		c := count[th.Key]
		stats = append(stats, ThemeStat{Key: th.Key, Count: c, Thin: c < minDepth})
	}
	dups := make([]string, 0, len(dupSet))
	for k := range dupSet {
		dups = append(dups, k)
	}
	sort.Strings(dups)
	return AuditReport{Themes: stats, Orphans: orphans, Duplicates: dups, TotalTagged: tagged}
}
```

- [ ] **Step 4: 테스트 통과 확인** — `go test ./internal/curriculum/themed/ -run TestAudit` → PASS

- [ ] **Step 5: CLI 작성** — `cmd/audit/main.go` (읽기 전용; themes.yaml + 콘텐츠 로드 → 리포트 출력)

```go
// Command audit reports curriculum v3 tagging coverage: per-theme counts, thin
// themes, orphans, and duplicate titles. Read-only — it changes no content.
package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/bingoring/forin/server/internal/adapters/contentfile"
	"github.com/bingoring/forin/server/internal/curriculum/themed"
)

func main() {
	dir := os.Getenv("CONTENT_DIR")
	if dir == "" {
		dir = "content"
	}
	themes, err := themed.LoadThemes(filepath.Join(dir, "nurse", "themes.yaml"))
	if err != nil {
		fmt.Fprintln(os.Stderr, "themes.yaml:", err)
		os.Exit(1)
	}
	bundle, err := contentfile.Load(dir)
	if err != nil {
		fmt.Fprintln(os.Stderr, "content:", err)
		os.Exit(1)
	}
	tags := make([]themed.ScenarioTag, 0, len(bundle.Scenarios))
	for _, s := range bundle.Scenarios {
		diff := 0
		if s.Briefing != nil {
			diff = s.Briefing.Difficulty
		}
		tags = append(tags, themed.ScenarioTag{ID: s.ID, Title: s.Title, Theme: s.Theme,
			CollabWith: s.CollabWith, Dept: deptOf(s.ID), Difficulty: diff})
	}
	rep := themed.Audit(themes, tags, 20)
	fmt.Printf("tagged %d / %d scenarios · %d themes · %d orphans · %d dup-titles\n",
		rep.TotalTagged, len(tags), len(rep.Themes), len(rep.Orphans), len(rep.Duplicates))
	for _, s := range rep.Themes {
		flag := ""
		if s.Thin {
			flag = "  ← THIN (<20)"
		}
		fmt.Printf("  %-28s %3d%s\n", s.Key, s.Count, flag)
	}
	if len(rep.Orphans) > 0 {
		fmt.Printf("orphans (%d): %v...\n", len(rep.Orphans), first(rep.Orphans, 20))
	}
}

func deptOf(id string) string {
	// SCN-ER-00001 → ER
	var parts []string
	cur := ""
	for _, r := range id {
		if r == '-' {
			parts = append(parts, cur)
			cur = ""
			continue
		}
		cur += string(r)
	}
	parts = append(parts, cur)
	if len(parts) >= 3 {
		return parts[1]
	}
	return ""
}

func first(s []string, n int) []string {
	if len(s) < n {
		return s
	}
	return s[:n]
}
```

- [ ] **Step 6: 빌드 + 스모크** — `go build ./cmd/audit/ && (cd server && CONTENT_DIR=content go run ./cmd/audit | head)` → 현재는 "tagged 0 / 3044 ... orphans 3044"가 정상(태깅 전).

- [ ] **Step 7: 커밋**

```bash
git add server/internal/curriculum/themed/audit.go server/internal/curriculum/themed/audit_test.go server/cmd/audit/
git commit -m "feat(curriculum-v3 P2): audit 리포트 (분포·고아·중복·thin) + cmd/audit CLI"
```

---

### Task 3: ER vertical slice — 주제 배정 · 손저작 태깅 · 재생성 · 검증

> 이 태스크는 콘텐츠 큐레이션이다. 코드가 아니라 **절차 + 수용 게이트**로 검증한다. ER을 끝까지 해서 파이프라인을 증명한 뒤 Task 4에서 나머지로 팬아웃한다.

**Files:**
- Modify: `server/content/nurse/themes.yaml` (ER 주제 추가)
- Modify: `server/cmd/gencontent/depts.go` (ER Topic들의 `Theme` 배정)
- Modify: `server/content/nurse/scenarios/scn-er-*.yaml` (ER 손저작에 `theme:`)
- Regenerate: `server/content/nurse/scenarios/gen-er.yaml`

- [ ] **Step 1: ER 분포 측정** — `cd server && CONTENT_DIR=content go run ./cmd/audit` 출력에서 ER Topic들의 제목·수를 확인하고, `grep -A40 'Code: "ER"' cmd/gencontent/depts.go`로 ER Topic 목록을 읽는다.

- [ ] **Step 2: ER 주제를 themes.yaml에 추가** — Topic 2~3개를 묶어 ≥20이 되게. 아래는 **패턴 예시**(실제 배정은 Step 1 분포에 맞춘다):

```yaml
# --- ER (응급의료센터) ---
- { key: er-triage, name: 응급 트리아지·초기 평가, nameKey: theme.er.triage, track: depth, dept: ER, order: 20 }
- { key: er-resus, name: 응급 처치·소생, nameKey: theme.er.resus, track: depth, dept: ER, order: 21 }
- { key: er-deescalation, name: 디에스컬레이션·안전, nameKey: theme.er.deesc, track: depth, dept: ER, order: 22 }
# 공통 코어(전 부서 공유) — 최초 정의 부서에서 한 번만
- { key: core-sbar, name: SBAR 인계, nameKey: theme.core.sbar, track: core, order: 10 }
- { key: core-family, name: 가족 소통·정서 지지, nameKey: theme.core.family, track: core, order: 11 }
```

> 규칙: depth 주제는 ER Topic이 뒷받침해 ≥20이어야 한다. Topic당 평균 ~10이므로 보통 2~3 Topic이 필요하다. thin이면 인접 주제와 병합한다(R-P2-4).

- [ ] **Step 3: ER Topic에 Theme 배정** — `depts.go`의 ER Topic 리터럴마다 `Theme: "..."` 추가. 예:

```go
{Title: "흉통 트리아지", ..., Theme: "er-triage"},
{Title: "호흡곤란 초기 평가", ..., Theme: "er-triage"},
{Title: "복통 문진", ..., Theme: "er-triage"},
{Title: "알레르기 반응 대응", ..., Theme: "er-resus"},
{Title: "주취 환자 진정", ..., Theme: "er-deescalation"},
{Title: "SBAR 당직의 보고", ..., Theme: "core-sbar"}, // 범용 → core
```

> collab 주제를 세운다면 해당 Topic에 `Theme: "er-icu-handoff", CollabWith: "ICU"`처럼 상대 부서를 함께 배정한다(R-P2-6).

- [ ] **Step 4: ER 손저작 태깅** — `scn-er-*.yaml` 각 파일 최상위에 `theme: <key>` 추가. 제목이 대개 어느 Topic과 대응되므로 그 Topic의 Theme을 따른다. 매칭 안 되면 정리(Task 4의 prune) 후보로.

- [ ] **Step 5: 재생성** — 생성기를 돌려 `gen-er.yaml`에 theme이 실리게 한다:

```bash
cd server && go run ./cmd/gencontent   # 전체 재생성(정본 재발급이므로 안전)
```

> 생성기 실행 명령·플래그는 `cmd/gencontent/main.go`의 `main()`을 확인(출력 디렉터리 등). 전체 재생성이 부담이면 ER만 거르는 옵션이 있는지 본다; 없으면 전체 재생성 후 gen-er.yaml만 검토.

- [ ] **Step 6: ER 검증** — `CONTENT_DIR=content go run ./cmd/audit`에서 **ER 주제들이 각 ≥20, ER 고아 0**인지 확인. thin이면 Step 2~3으로 돌아가 병합·배정 조정.

- [ ] **Step 7: 커밋**

```bash
git add server/content/nurse/themes.yaml server/cmd/gencontent/depts.go \
  server/content/nurse/scenarios/scn-er-*.yaml server/content/nurse/scenarios/gen-er.yaml
git commit -m "content(curriculum-v3 P2): ER 주제 배정·태깅·재생성 (vertical slice)"
```

---

### Task 4: 나머지 28개 부서 팬아웃 (반복 절차)

> Task 3의 절차를 부서마다 반복한다. 부서 하나 = 한 커밋. 공통 코어 주제는 이미 정의됐으면 재사용(중복 정의 금지).

**부서별 반복 (각 부서 d):**

- [ ] **Step 1: 측정** — audit로 d의 Topic 분포 확인.
- [ ] **Step 2: 주제 추가** — themes.yaml에 d의 depth(+필요시 collab) 주제. Topic 2~3 묶음으로 ≥20. 범용 스킬은 이미 있는 core 주제로 보낸다.
- [ ] **Step 3: 배정** — depts*.go의 d Topic들에 `Theme`(+collab이면 CollabWith).
- [ ] **Step 4: 손저작 태깅** — `scn-<d>-*.yaml`에 `theme:`.
- [ ] **Step 5: 정리** — audit의 중복/thin/미귀속 리포트를 보고: 중복 Topic 병합, 과광범위 Topic 분할, 비현실·저품질 제거 후보를 뽑아 **검수 승인 후** depts*.go/파일에서 제거(R-P2-7). 정본 재발급이라 자유롭게 재배치.
- [ ] **Step 6: 재생성 + 검증** — `go run ./cmd/gencontent` 후 audit에서 d 주제 ≥20, d 고아 0.
- [ ] **Step 7: 커밋** — `content(curriculum-v3 P2): <DEPT> 주제 배정·태깅·정리`

부서 순서(권장 Tier): ER→ICU→OR→PEDS→PHARMA→WARD계열→나머지. 매 부서 후 `go run ./cmd/audit`로 전체 진척(고아 잔량) 추적.

---

### Task 5: 게이트 활성화 + 정본 전체 재생성 + id-diff

**Files:**
- Modify: `server/internal/curriculum/themed/orphan_gate_test.go` (P1 skip 해제 + 실데이터)
- Create: `server/internal/curriculum/themed/depth_gate_test.go`
- Modify: `server/cmd/gencontent/theme_test.go` (Step 1의 Skip 제거)
- Create: `server/cmd/audit` 에 `--id-diff` 모드(선택) 또는 별도 리포트

**Interfaces:** 게이트 테스트가 전 콘텐츠를 검증.

- [ ] **Step 1: 고아-0 게이트 활성화** — `orphan_gate_test.go`의 `t.Skip`을 제거하고 실데이터로 채운다:

```go
func TestNoOrphans_fullContent(t *testing.T) {
	dir := repoContentDir(t) // ../../../content 상대경로 헬퍼; 없으면 t.Skip
	themes, err := LoadThemes(filepath.Join(dir, "nurse", "themes.yaml"))
	if err != nil {
		t.Fatal(err)
	}
	tags := loadTagsFromDir(t, dir) // contentfile.Load 재사용 또는 YAML 스캔
	_, orphans := Assemble(themes, tags)
	if len(orphans) != 0 {
		t.Fatalf("고아 %d개 (R3 위반): 예) %v", len(orphans), orphans[:min(5, len(orphans))])
	}
}
```

- [ ] **Step 2: 깊이 게이트 작성** — `depth_gate_test.go`

```go
func TestThemeDepth_min20(t *testing.T) {
	dir := repoContentDir(t)
	themes, _ := LoadThemes(filepath.Join(dir, "nurse", "themes.yaml"))
	tags := loadTagsFromDir(t, dir)
	rep := Audit(themes, tags, 20)
	var thin []string
	for _, s := range rep.Themes {
		if s.Thin {
			thin = append(thin, fmt.Sprintf("%s(%d)", s.Key, s.Count))
		}
	}
	if len(thin) != 0 {
		t.Fatalf("thin 주제(<20) %d개 (R2 위반): %v", len(thin), thin)
	}
}
```

- [ ] **Step 3: Topic 불변식 활성화** — Task 1의 `TestEveryTopicHasTheme` 첫 줄 `t.Skip`을 제거.

- [ ] **Step 4: 정본 전체 재생성 + seed 확인** — `go run ./cmd/gencontent` (전 부서 반영). 로컬 DB가 있으면 `CONTENT_DIR=content go run ./cmd/seed`로 적재 확인.

- [ ] **Step 5: 전체 게이트 그린 확인** — `go test ./cmd/gencontent/ ./internal/curriculum/...` → 고아 0 · thin 0 · Topic 불변식 PASS.

- [ ] **Step 6: 커밋**

```bash
git add server/internal/curriculum/themed/orphan_gate_test.go server/internal/curriculum/themed/depth_gate_test.go server/cmd/gencontent/theme_test.go
git commit -m "test(curriculum-v3 P2): 고아-0 + 깊이-20 + Topic-Theme 게이트 활성화"
```

---

### Task 6: 상태 기록 + 마무리

**Files:**
- Modify: `docs/dlc/projects/forin/02-construction/curriculum-v3-audit/build-spec-index.md` (status)
- Modify: `docs/dlc/projects/forin/STATUS.md`

- [ ] **Step 1: 전체 테스트** — `cd server && go test ./...` 그린. `cd mobile && npx jest`(P2는 서버·콘텐츠라 모바일 무영향이지만 확인).

- [ ] **Step 2: 스펙 상태 갱신** — build-spec-index.md `status: SPEC-DRAFT` → `P2-IMPLEMENTED`.

- [ ] **Step 3: STATUS 갱신** — "P2 전수조사 완료: 전 시나리오 태깅·고아 0·주제당 ≥20. 다음 P3 여정 지도 UI + 라이브 전환(promote+OTA, 진도 리셋 공지)".

- [ ] **Step 4: 커밋(메인 + waypoint)**

```bash
cd docs/dlc && git add projects/forin/02-construction/curriculum-v3-audit/build-spec-index.md projects/forin/STATUS.md \
  && git commit -m "docs(forin): 커리큘럼 v3 P2 전수조사 완료 기록"
```

---

## 자기 검토 (작성자 체크)

**스펙 커버리지:** A1(레지스트리 채움)=Task3/4 · A2(태그)=Task1 emit+Task3/4 · A3(중복 정리)=Task2 audit+Task4 prune · A4(thin 보강)=Task2+Task4/5 depth 게이트 · R-P2-1(생성분 코드파생)=Task1 · R-P2-2(손저작 파일태깅)=Task3/4 · R-P2-3(모든 Topic Theme)=Task1/5 테스트 · R-P2-4(≥20)=Task5 depth 게이트 · R-P2-7(제거 검수)=Task4 Step5 · R-P2-8(정본 재발급)=Global+Task5 · R3(고아0)=Task5 · 3계층=Task3 예시.

**미커버(의도적):** 실제 ~100개 주제의 최종 확정 = Task3/4 실행 산출물(계획은 절차+ER 패턴 제시). P3 UI·라이브 전환은 별도.

**타입 일관성:** `Topic.Theme/CollabWith`(Task1) → 생성 `Scenario.Theme/CollabWith`(P1 Task1 필드) → `ScenarioTag`(P1) → `Audit`/`Assemble`(Task2/P1). 게이트 헬퍼 `loadTagsFromDir`/`repoContentDir`는 Task5에서 정의(기존 postgres/content_repo의 태그 프로젝션 로직 재사용 가능).
