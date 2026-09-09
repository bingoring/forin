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

func TestTopicDistribution_groupsByTitlePrefix(t *testing.T) {
	tags := []ScenarioTag{
		{ID: "SCN-ER-1", Title: "흉통 트리아지 · Mr. A", Dept: "ER"},
		{ID: "SCN-ER-2", Title: "흉통 트리아지 · Ms. B", Dept: "ER"},
		{ID: "SCN-ER-3", Title: "흉통 트리아지 · Mr. C", Dept: "ER"},
		{ID: "SCN-ER-4", Title: "복통 문진 · Ms. D", Dept: "ER"},
		{ID: "SCN-ICU-1", Title: "승압제 적정 · Mr. E", Dept: "ICU"},
	}
	dist := TopicDistribution(tags)
	// ER first; within ER, "흉통 트리아지"(3) before "복통 문진"(1)
	if dist[0].Dept != "ER" || dist[0].Topic != "흉통 트리아지" || dist[0].Count != 3 {
		t.Fatalf("top ER topic wrong: %+v", dist[0])
	}
	if dist[1].Topic != "복통 문진" || dist[1].Count != 1 {
		t.Fatalf("second ER topic wrong: %+v", dist[1])
	}
	if dist[2].Dept != "ICU" {
		t.Fatalf("ICU should follow ER: %+v", dist[2])
	}
}
