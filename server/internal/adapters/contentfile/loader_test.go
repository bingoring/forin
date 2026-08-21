package contentfile

import (
	"fmt"
	"path/filepath"
	"strings"
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

// No two scenarios in the same department may carry the same title.
//
// gencontent expands "topic × patient × difficulty", but the three axes were three
// functions of one counter — topic k%nt, persona k, difficulty k%3 — so whenever the topic
// count was a multiple of the persona pool and of 3 (NICU: 10 topics, 6 parent personas)
// all three returned to their starting values together. The same topic met the same patient
// again with only a mood word changed: 387 titles duplicated across 1,050 of 3,203
// scenarios, a third of the bank. It surfaced as a search for 흉통 returning five rows that
// looked identical.
//
// Asserted over the committed content rather than inside the generator, because the
// committed content is what ships — a generator that is right and a tree that was written
// by an older one look the same to everybody downstream.
//
// Titles shared ACROSS departments are allowed and listed: 다학제 회진 인계 happens in the
// NICU and in the PICU, they are different scenarios, and every screen that lists one shows
// the ward beside it.
func TestNoDuplicateScenarioTitlesWithinADepartment(t *testing.T) {
	b, err := Load(filepath.Join("..", "..", "..", "content"))
	if err != nil {
		t.Fatalf("load: %v", err)
	}
	if len(b.Scenarios) < 100 {
		t.Fatalf("expected the real content tree, got %d scenarios", len(b.Scenarios))
	}

	seen := map[string]string{} // dept|title -> first id
	dupes := []string{}
	for _, s := range b.Scenarios {
		parts := strings.Split(s.ID, "-")
		if len(parts) < 3 {
			continue
		}
		key := parts[1] + "|" + s.Title
		if first, ok := seen[key]; ok {
			dupes = append(dupes, fmt.Sprintf("%s and %s both titled %q", first, s.ID, s.Title))
			continue
		}
		seen[key] = s.ID
	}
	if len(dupes) > 0 {
		show := dupes
		if len(show) > 10 {
			show = show[:10]
		}
		t.Fatalf("%d duplicate titles within a department:\n  %s", len(dupes), strings.Join(show, "\n  "))
	}
}
