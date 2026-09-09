package main

import "testing"

func TestGenerateSeedScenarios_oneScenarioPerSeed(t *testing.T) {
	d := Dept{Code: "ER", Name: "응급의료센터", Label: "ER", Color: "#DC2626", Tone: "#FEE2E2", Accent: "#B91C1C"}
	seeds := []Seed{
		{Theme: "er-chestpain", Title: "전형적 STEMI 신속 트리아지", Tagline: "It feels like an elephant on my chest.",
			Room: "TRIAGE", Brief: "흉통 환자를 신속히 트리아지하세요.", Role: "patient", Difficulty: 2,
			Skills: []string{"흉통 PQRST", "STEMI 인지"}, KeyPhrases: []string{"Where is the pain?"},
			Goals: []string{"방사통 확인"}, Acuity: "critical",
			Persona: SeedPersona{Name: "Mr. Dawson", AgeRange: "60s", Sub: "64y / Male", Mood: "worried"}},
		{Theme: "er-chestpain", Title: "심낭염 감별", Tagline: "It hurts when I lie down.",
			Room: "EXAM 2", Brief: "자세 의존성 흉통을 감별하세요.", Role: "patient", Difficulty: 3,
			Persona: SeedPersona{Name: "Ms. Ortega", AgeRange: "40s", Mood: "anxious"}},
	}
	scns, evts := generateSeedScenarios(0, d, seeds)

	if len(scns) != 2 {
		t.Fatalf("want 2 scenarios (1 per seed), got %d", len(scns))
	}
	if scns[0].ID != "SCN-ER-00101" || scns[1].ID != "SCN-ER-00102" {
		t.Fatalf("ids wrong: %s, %s", scns[0].ID, scns[1].ID)
	}
	// theme tag emitted (P2), title carries the persona, difficulty from the seed
	if scns[0].Theme != "er-chestpain" {
		t.Errorf("theme not emitted: %q", scns[0].Theme)
	}
	if scns[0].Title != "전형적 STEMI 신속 트리아지 · Mr. Dawson" {
		t.Errorf("title wrong: %q", scns[0].Title)
	}
	if scns[0].Briefing == nil || scns[0].Briefing.Difficulty != 2 {
		t.Errorf("briefing difficulty wrong: %+v", scns[0].Briefing)
	}
	if scns[0].Acuity != "critical" {
		t.Errorf("acuity not carried: %q", scns[0].Acuity)
	}
	// one event groups both (eventSize=13), scenarios reference it
	if len(evts) != 1 || evts[0].ID != "EVT-ER-00101" {
		t.Fatalf("event grouping wrong: %+v", evts)
	}
	if scns[0].EventID != "EVT-ER-00101" {
		t.Errorf("scenario eventId wrong: %q", scns[0].EventID)
	}
}
