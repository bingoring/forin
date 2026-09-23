package themed

import (
	"testing"

	"github.com/bingoring/forin/server/internal/domain/learning"
)

// fixtureEngine builds a small two-theme catalog:
//
//	core-safety-er (ER core, order 10): SCN-S1 (Lv1)      — no exam (won't block "done")
//	er-chestpain   (ER depth, order 100): SCN-C1, SCN-C2  — no exam
func fixtureEngine() *Engine {
	off := false
	themes := []Theme{
		{Key: "core-safety-er", Name: "안전", Track: "core", Dept: "ER", Order: 10, Exam: &off},
		{Key: "er-chestpain", Name: "흉통", Track: "depth", Dept: "ER", Order: 100, Exam: &off},
	}
	tags := []ScenarioTag{
		{ID: "SCN-S1", Title: "신원확인", Theme: "core-safety-er", Dept: "ER", Difficulty: 1},
		{ID: "SCN-C1", Title: "흉통 초기", Theme: "er-chestpain", Dept: "ER", Difficulty: 1},
		{ID: "SCN-C2", Title: "STEMI", Theme: "er-chestpain", Dept: "ER", Difficulty: 2},
	}
	return NewEngine(NewCatalog(themes, tags))
}

func prog(cleared ...learning.ScenarioID) learning.Progress {
	m := map[learning.ScenarioID]bool{}
	for _, c := range cleared {
		m[c] = true
	}
	return learning.Progress{Cleared: m}
}

func TestEngine_Locate(t *testing.T) {
	e := fixtureEngine()
	ref, ok := e.Locate("SCN-C1")
	if !ok || ref.Theme != "er-chestpain" || ref.Kind != "dlg" || !ref.Found {
		t.Fatalf("locate SCN-C1 wrong: %+v ok=%v", ref, ok)
	}
	if _, ok := e.Locate("SCN-UNKNOWN"); ok {
		t.Errorf("unknown scenario should not locate")
	}
}

func TestEngine_Guidance(t *testing.T) {
	e := fixtureEngine()
	// dlg, never cleared → guided (choices).
	if g := e.Guidance("SCN-C1", prog()); g != learning.GuideChoices {
		t.Errorf("fresh dlg should be choices, got %q", g)
	}
	// dlg with guided pass cleared → free.
	p := learning.Progress{Passes: learning.ClearedPasses{GuidedCleared: map[learning.ScenarioID]bool{"SCN-C1": true}}}
	if g := e.Guidance("SCN-C1", p); g != learning.GuideFree {
		t.Errorf("guided-cleared dlg should be free, got %q", g)
	}
	// outside any course → free.
	if g := e.Guidance("SCN-UNKNOWN", prog()); g != learning.GuideFree {
		t.Errorf("uncatalogued scenario should be free, got %q", g)
	}
}

func TestEngine_Next_retryWhenNotCleared(t *testing.T) {
	e := fixtureEngine()
	// finished C1 but did not pass → do it again.
	ref := e.Next(prog(), "SCN-C1")
	if !ref.Found || ref.Scenario != "SCN-C1" {
		t.Fatalf("not-cleared finish should retry same, got %+v", ref)
	}
}

func TestEngine_Next_advancesWithinThenAcrossThemes(t *testing.T) {
	e := fixtureEngine()
	// cleared C1, just finished C1 → next required in er-chestpain = C2.
	ref := e.Next(prog("SCN-C1"), "SCN-C1")
	if !ref.Found || ref.Scenario != "SCN-C2" {
		t.Fatalf("should advance to C2, got %+v", ref)
	}
	// cleared S1 (its theme now done) → falls to resume theme er-chestpain → C1.
	ref = e.Next(prog("SCN-S1"), "SCN-S1")
	if !ref.Found || ref.Scenario != "SCN-C1" {
		t.Fatalf("finishing last step of a theme should cross to next theme (C1), got %+v", ref)
	}
	// everything cleared → nothing next.
	if ref := e.Next(prog("SCN-S1", "SCN-C1", "SCN-C2"), "SCN-C2"); ref.Found {
		t.Fatalf("all cleared → Next should be empty, got %+v", ref)
	}
}

func TestEngine_Resume(t *testing.T) {
	e := fixtureEngine()
	// fresh learner → first theme in learning order (core-safety-er, order 10) → S1.
	if ref := e.Resume(prog()); !ref.Found || ref.Scenario != "SCN-S1" {
		t.Fatalf("fresh resume should be S1, got %+v", ref)
	}
	// latest attempt in er-chestpain, C1 cleared → resume its open step C2.
	p := prog("SCN-S1", "SCN-C1")
	p.Latest = "SCN-C1"
	if ref := e.Resume(p); !ref.Found || ref.Scenario != "SCN-C2" {
		t.Fatalf("resume should follow latest theme to C2, got %+v", ref)
	}
	// all cleared → no resume.
	if ref := e.Resume(prog("SCN-S1", "SCN-C1", "SCN-C2")); ref.Found {
		t.Fatalf("all cleared → no resume, got %+v", ref)
	}
}

func TestRegistry_ForUnknownProfessionIsEmpty(t *testing.T) {
	r := NewRegistry()
	r.Add("nurse", fixtureEngine())
	if _, ok := r.For("nurse").Locate("SCN-C1"); !ok {
		t.Errorf("nurse engine should locate SCN-C1")
	}
	// unknown profession → empty, safe journey.
	j := r.For("physician")
	if len(j.Tracks(prog())) != 0 {
		t.Errorf("unknown profession should have no tracks")
	}
	if ref := j.Resume(prog()); ref.Found {
		t.Errorf("unknown profession resume should be empty")
	}
}

// ── Steps (주제 시트의 행; v2 resolveOne 이식) ──

func TestEngine_StepsExpandsEachDialogueIntoTwoRuns(t *testing.T) {
	e := fixtureEngine()
	rows := e.Steps("er-chestpain", learning.Progress{})
	if len(rows) != 4 { // SCN-C1 ×2, SCN-C2 ×2
		t.Fatalf("want 4 rows (2 dialogues × 2 runs), got %d", len(rows))
	}
	if rows[0].Pass != 1 || rows[0].Passes != 2 || rows[0].Guide != learning.GuideChoices {
		t.Errorf("first run should be the guided rung: %+v", rows[0])
	}
	if rows[1].Pass != 2 || rows[1].Guide != learning.GuideFree {
		t.Errorf("second run should be the free rung: %+v", rows[1])
	}
	if rows[0].ScenarioID != rows[1].ScenarioID {
		t.Errorf("the two runs must be the same scenario: %q vs %q", rows[0].ScenarioID, rows[1].ScenarioID)
	}
}

// 스텝 행이 자기 난이도를 싣고 온다. 여정 화면이 구간 경계(기초·실전·심화)를 그 값으로
// 긋는다. 주제의 `tiers` 요약으로는 대신할 수 없다 — 그 집계는 상황 단위이고 이 행들은
// 회차 단위라, 회차가 둘인 스텝이 하나라도 있으면 누적 합이 엉뚱한 행을 가리킨다. 이
// 픽스처가 정확히 그 경우다: 난이도 1·2가 상황 하나씩인데 행은 넷이라, 상황 기준 경계는
// 1번 행을, 실제 경계는 2번 행을 가리킨다.
func TestEngine_StepsCarryTheirDifficulty(t *testing.T) {
	e := fixtureEngine()
	rows := e.Steps("er-chestpain", learning.Progress{})
	want := []int{1, 1, 2, 2}
	if len(rows) != len(want) {
		t.Fatalf("want %d rows, got %d", len(want), len(rows))
	}
	for i, w := range want {
		if rows[i].Difficulty != w {
			t.Errorf("row %d difficulty = %d, want %d (%+v)", i, rows[i].Difficulty, w, rows[i])
		}
	}

	// 상황 단위 누적으로는 못 맞춘다는 것을 같이 못박는다: tiers의 첫 계단 total은 1인데
	// 행에서 난이도가 바뀌는 자리는 2번이다.
	st := e.Tracks(prog())
	var tiers []learning.TierCount
	for _, tg := range st {
		for _, cs := range tg.Curricula {
			if cs.ThemeKey == "er-chestpain" {
				tiers = cs.Tiers
			}
		}
	}
	if len(tiers) == 0 {
		t.Fatalf("fixture should expose tiers for er-chestpain")
	}
	if tiers[0].Total != 1 {
		t.Fatalf("fixture assumption broken: first tier total = %d, want 1", tiers[0].Total)
	}
	boundary := 0
	for i := 1; i < len(rows); i++ {
		if rows[i].Difficulty != rows[i-1].Difficulty {
			boundary = i
			break
		}
	}
	if boundary == tiers[0].Total {
		t.Errorf("row boundary (%d) must NOT equal the situation count (%d) — "+
			"if it did, this test would not be proving anything", boundary, tiers[0].Total)
	}
}

func TestEngine_StepsMarksExactlyOneNowAndLocksTheRest(t *testing.T) {
	e := fixtureEngine()
	rows := e.Steps("er-chestpain", learning.Progress{})
	now, lock := 0, 0
	for _, r := range rows {
		switch r.State {
		case "now":
			now++
		case "lock":
			lock++
		}
	}
	if now != 1 {
		t.Errorf("want exactly one `now` row, got %d", now)
	}
	if lock != 3 {
		t.Errorf("want the remaining 3 rows locked, got %d", lock)
	}
}

func TestEngine_StepsClearedAloneSupersedesClearedWithHelp(t *testing.T) {
	e := fixtureEngine()
	// Cleared unaided only: BOTH rungs read as done — re-demanding the guided run
	// would reopen finished work for everyone who cleared before the guide column.
	p := learning.Progress{
		Cleared: map[learning.ScenarioID]bool{"SCN-C1": true},
		Passes:  learning.ClearedPasses{FreeCleared: map[learning.ScenarioID]bool{"SCN-C1": true}},
	}
	rows := e.Steps("er-chestpain", p)
	if rows[0].State != "done" || rows[1].State != "done" {
		t.Fatalf("free clear should finish both rungs: %q %q", rows[0].State, rows[1].State)
	}
	// Cleared WITH help only: the guided rung is done, the free rung is what's next.
	p2 := learning.Progress{
		Cleared: map[learning.ScenarioID]bool{"SCN-C1": true},
		Passes:  learning.ClearedPasses{GuidedCleared: map[learning.ScenarioID]bool{"SCN-C1": true}},
	}
	rows2 := e.Steps("er-chestpain", p2)
	if rows2[0].State != "done" || rows2[1].State != "now" {
		t.Errorf("guided clear should leave the free rung as now: %q %q", rows2[0].State, rows2[1].State)
	}
}

func TestEngine_StepsHidesAttemptedWhereItWouldContradict(t *testing.T) {
	e := fixtureEngine()
	// SCN-C2 was tried but never cleared; its rows are locked behind SCN-C1, and a
	// locked row badged "tried" reads as a contradiction.
	p := learning.Progress{Attempted: map[learning.ScenarioID]bool{"SCN-C1": true, "SCN-C2": true}}
	for _, r := range e.Steps("er-chestpain", p) {
		if r.State == "lock" && r.Attempted {
			t.Errorf("a locked row must not be marked attempted: %+v", r)
		}
		if r.State == "now" && r.ScenarioID == "SCN-C1" && !r.Attempted {
			t.Errorf("the now row should keep its attempted badge: %+v", r)
		}
	}
}

func TestEngine_StepsUnknownThemeIsEmptyNotPanic(t *testing.T) {
	if rows := fixtureEngine().Steps("no-such-theme", learning.Progress{}); len(rows) != 0 {
		t.Errorf("unknown theme should yield no rows, got %d", len(rows))
	}
}
