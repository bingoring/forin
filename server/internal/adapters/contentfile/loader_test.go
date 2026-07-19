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
		case "SCN-GEN-00003":
			legacy = true
			if s.Briefing != nil {
				t.Fatal("SCN-GEN-00003: pre-briefing scenario should still load with no briefing")
			}
		}
	}
	if !pilot {
		t.Fatal("SCN-ER-00002 scenario not loaded")
	}
	if !legacy {
		t.Fatal("pre-briefing SCN-GEN-00003 scenario not loaded (regression)")
	}

	// Quiz content (sentence_build) round-trips with template/answers/wordBank.
	var quizFound bool
	for i := range b.Quizzes {
		q := &b.Quizzes[i]
		if q.ID != "QZ-ER-00001" {
			continue
		}
		quizFound = true
		if q.Content == nil {
			t.Fatal("QZ-ER-00001: content is nil")
		}
		if q.Content.Template == "" || len(q.Content.Answers) == 0 || len(q.Content.WordBank) == 0 {
			t.Fatal("QZ-ER-00001: template/answers/wordBank must be populated")
		}
		// Every answer must appear in the word bank.
		bank := map[string]bool{}
		for _, w := range q.Content.WordBank {
			bank[w] = true
		}
		for _, a := range q.Content.Answers {
			if !bank[a] {
				t.Fatalf("QZ-ER-00001: answer %q missing from wordBank", a)
			}
		}
	}
	if !quizFound {
		t.Fatal("QZ-ER-00001 quiz not loaded")
	}
}
