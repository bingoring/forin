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
		tag("SCN-ER-00009", "", 1),             // 미태그 → 고아
		tag("SCN-ER-00010", "unknown-key", 1),  // 레지스트리에 없는 키 → 고아
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

func TestAssemble_examFalseNoBoss(t *testing.T) {
	no := false
	themes := []Theme{{Key: "t", Track: "depth", Dept: "ER", Order: 1, Exam: &no}}
	cur, _ := Assemble(themes, []ScenarioTag{tag("SCN-ER-1", "t", 1)})
	last := cur[0].Tiers[0].Steps
	if last[len(last)-1].Kind == "boss" {
		t.Errorf("exam:false → no boss step")
	}
}
