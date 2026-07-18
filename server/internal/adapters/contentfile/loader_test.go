package contentfile

import (
	"path/filepath"
	"testing"
)

// Loads the real authored content tree (server/content) and asserts the ER
// pilot scenario round-trips through YAML with its optional briefing block —
// and that the whole bundle still validates (no regression for the pre-briefing
// scenarios, whose briefing is absent).
func TestLoadRealContentAndBriefing(t *testing.T) {
	dir := filepath.Join("..", "..", "..", "content")
	b, err := Load(dir)
	if err != nil {
		t.Fatalf("load: %v", err)
	}
	if errs := b.Validate(); len(errs) != 0 {
		t.Fatalf("validate: %v", errs)
	}

	var pilot, legacy bool
	for i := range b.Scenarios {
		s := &b.Scenarios[i]
		switch s.ID {
		case "SCN-ER-00002":
			pilot = true
			if s.Briefing == nil {
				t.Fatal("SCN-ER-00002: briefing is nil")
			}
			if s.Briefing.Difficulty != 2 {
				t.Fatalf("SCN-ER-00002: difficulty = %d, want 2", s.Briefing.Difficulty)
			}
			if len(s.Briefing.Skills) == 0 || len(s.Briefing.Rewards) == 0 || len(s.Briefing.Reqs) == 0 {
				t.Fatal("SCN-ER-00002: briefing skills/rewards/reqs must be populated")
			}
			if s.Persona.Sub == "" || s.Persona.Hair == "" {
				t.Fatal("SCN-ER-00002: persona display fields (sub/hair) missing")
			}
		case "SCN-ER-00001":
			legacy = true
			if s.Briefing != nil {
				t.Fatal("SCN-ER-00001: legacy scenario should have no briefing")
			}
		}
	}
	if !pilot {
		t.Fatal("SCN-ER-00002 scenario not loaded")
	}
	if !legacy {
		t.Fatal("legacy SCN-ER-00001 scenario not loaded (regression)")
	}
}
