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
	// ER 트랙은 마일스톤을 갖는다(트리아지 미완이므로 closed)
	if tracks[1].Milestone == nil || tracks[1].Milestone.State != "closed" {
		t.Errorf("ER milestone should be closed while triage incomplete: %+v", tracks[1].Milestone)
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

func TestResolve_allPassedNoResume(t *testing.T) {
	themes := []Theme{{Key: "t", Track: "core", Order: 1, Exam: boolPtr(false)}}
	cur, _ := Assemble(themes, []ScenarioTag{{ID: "SCN-CORE-1", Title: "x", Theme: "t", Dept: "CORE", Difficulty: 1}})
	tracks := Resolve(cur, nil, map[string]bool{"SCN-CORE-1": true}, nil, "")
	for _, tr := range tracks {
		for _, c := range tr.Curricula {
			if c.State != "passed" {
				t.Fatalf("want passed, got %s", c.State)
			}
			if c.Resume {
				t.Fatalf("all passed → no resume")
			}
		}
	}
}

func TestResolve_collabWithSurfaced(t *testing.T) {
	themes := []Theme{{Key: "er-icu", Name: "ICU 인계", Track: "collab", Dept: "ER", Order: 5}}
	tags := []ScenarioTag{{ID: "SCN-ER-9", Title: "인계", Theme: "er-icu", Dept: "ER", CollabWith: "ICU", Difficulty: 1}}
	cur, _ := Assemble(themes, tags)
	tracks := Resolve(cur, []string{"ER"}, nil, nil, "")
	if tracks[0].Curricula[0].CollabWith != "ICU" {
		t.Fatalf("collabWith should surface as ICU, got %q", tracks[0].Curricula[0].CollabWith)
	}
}

// A 부서별 코어 theme (track=core, dept=ICU) joins its department's track and,
// by its low Order, leads the department's depth themes — it does NOT fall into
// the global CORE track (P2 D-P2-D). A truly universal theme (dept="") still does.
func TestResolve_perDeptCoreLeadsItsTrack(t *testing.T) {
	themes := []Theme{
		{Key: "core-language", Name: "언어장벽·통역", Track: "core", Order: 5},                 // 전역 공통
		{Key: "core-handoff-icu", Name: "인계·SBAR", Track: "core", Dept: "ICU", Order: 10},   // 부서 코어
		{Key: "icu-hemodynamics", Name: "혈역학", Track: "depth", Dept: "ICU", Order: 100},     // 부서 심화
	}
	tags := []ScenarioTag{
		{ID: "SCN-CORE-1", Title: "통역", Theme: "core-language", Dept: "CORE", Difficulty: 1},
		{ID: "SCN-ICU-1", Title: "ROSC 후 ICU 인계", Theme: "core-handoff-icu", Dept: "ICU", Difficulty: 1},
		{ID: "SCN-ICU-2", Title: "승압제 적정", Theme: "icu-hemodynamics", Dept: "ICU", Difficulty: 2},
	}
	cur, _ := Assemble(themes, tags)
	tracks := Resolve(cur, []string{"ICU"}, nil, nil, "")

	if len(tracks) != 2 || tracks[0].Dept != "CORE" || tracks[1].Dept != "ICU" {
		t.Fatalf("want [CORE, ICU] tracks, got %+v", tracks)
	}
	// 전역 CORE에는 공통 주제 하나만
	if len(tracks[0].Curricula) != 1 || tracks[0].Curricula[0].ThemeKey != "core-language" {
		t.Fatalf("global CORE should hold only core-language: %+v", tracks[0].Curricula)
	}
	// ICU 트랙: 부서 코어가 먼저(Order 10), 그다음 심화(Order 100)
	icu := tracks[1].Curricula
	if len(icu) != 2 || icu[0].ThemeKey != "core-handoff-icu" || icu[1].ThemeKey != "icu-hemodynamics" {
		t.Fatalf("ICU track should be [부서코어, 심화]: %+v", icu)
	}
	if icu[0].Track != "core" || icu[0].Dept != "ICU" {
		t.Errorf("부서 코어의 track/dept 유지되어야 함: %+v", icu[0])
	}
}

func boolPtr(b bool) *bool { return &b }
