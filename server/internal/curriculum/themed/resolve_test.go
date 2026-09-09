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

func boolPtr(b bool) *bool { return &b }
