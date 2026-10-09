package contentfile

import (
	"fmt"
	"os"
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

// Every scenario is a multi-step conversation.
//
// The whole bank shipped with exactly two goals per scenario, and two goals is one
// good question plus a summary — which is how "힌트 한 번 누르고 상황 종료" reached 90+.
// Four goals against the 0.75 coverage floor means three must land, and three cannot
// be one sentence.
//
// Reads the real content rather than a fixture: the point is that no scenario in the
// shipped bank is thin, and a fixture cannot say that.
func TestEveryScenarioHasEnoughGoalsToBeMultiStep(t *testing.T) {
	b, err := Load(filepath.Join("..", "..", "..", "content"))
	if err != nil {
		t.Fatalf("load: %v", err)
	}
	if len(b.Scenarios) < 1000 {
		t.Fatalf("only %d scenarios loaded — the bank is not being read", len(b.Scenarios))
	}
	thin, blank := []string{}, []string{}
	for _, sc := range b.Scenarios {
		if len(sc.Goals) < 4 {
			thin = append(thin, fmt.Sprintf("%s (%d goals)", sc.ID, len(sc.Goals)))
		}
		for _, g := range sc.Goals {
			if strings.TrimSpace(g) == "" {
				blank = append(blank, sc.ID)
			}
		}
		// A duplicate counts twice toward coverage, so a learner could clear by doing
		// one thing well.
		seen := map[string]bool{}
		for _, g := range sc.Goals {
			if seen[g] {
				thin = append(thin, fmt.Sprintf("%s (duplicate goal %q)", sc.ID, g))
			}
			seen[g] = true
		}
	}
	if len(thin) > 0 {
		// Capped: 3085 lines of failure is not a report.
		show := thin
		if len(show) > 8 {
			show = show[:8]
		}
		t.Errorf("%d scenarios are not multi-step: %v", len(thin), show)
	}
	if len(blank) > 0 {
		// A blank goal is skipped by the grader's evidence check, which shrinks the
		// denominator and silently makes every other goal worth more.
		t.Errorf("%d scenarios carry a blank goal: %v", len(blank), blank[:1])
	}
}

// The runtime loads the word banks too, and refuses a corpus whose sentences point at
// words that are not in them.
//
// gencontent checks the same thing when it WRITES the files. This checks what the
// server is about to SERVE, which is a different copy: a hand-edit, a partial merge,
// or a file that never went through the generator reaches here and nowhere else. The
// cost of missing it is a lesson that opens with no words and no clue why — STEP 1 is
// built by following those references backwards.
func TestLoadValidatesLessonReferences(t *testing.T) {
	dir := t.TempDir()
	write := func(rel, body string) {
		t.Helper()
		p := filepath.Join(dir, rel)
		if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(p, []byte(body), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	write("manifest.yaml", "version: test\n")

	const scenario = `- id: SCN-T-00001
  theme: t-theme
  title: t
  goals: [a, b]
  sentences:
    - en: "Check the wristband."
      ko: "손목 밴드를 확인하세요."
      chunks: ["Check the", "wristband", "."]
      words: [%s]
      goal: 1
`
	const bank = `- theme: t-theme
  words:
    - id: w-wristband
      en: wristband
      ko: 손목 밴드
`
	write("nurse/lexicon/t.yaml", bank)

	// Resolvable reference: loads.
	write("nurse/scenarios/t.yaml", fmt.Sprintf(scenario, "w-wristband"))
	b, err := Load(dir)
	if err != nil {
		t.Fatalf("a resolvable reference should load: %v", err)
	}
	if len(b.Lexicons) != 1 || len(b.Lexicons[0].Words) != 1 {
		t.Fatalf("the bank itself should be loaded, got %+v", b.Lexicons)
	}

	// Dangling reference: refused, and the message names the id.
	write("nurse/scenarios/t.yaml", fmt.Sprintf(scenario, "w-nope"))
	if _, err := Load(dir); err == nil {
		t.Fatal("a sentence pointing at a word outside its bank must not load")
	} else if !strings.Contains(err.Error(), "w-nope") {
		t.Errorf("the error should name the unresolved id, got %v", err)
	}

	// Sentences with no bank for their theme at all: also refused.
	if err := os.Remove(filepath.Join(dir, "nurse/lexicon/t.yaml")); err != nil {
		t.Fatal(err)
	}
	write("nurse/scenarios/t.yaml", fmt.Sprintf(scenario, "w-wristband"))
	if _, err := Load(dir); err == nil {
		t.Fatal("sentences whose theme has no bank must not load")
	}
}

// A department that has not had its turn yet is not broken — content lands one
// department at a time, and 20,056 seeds carry no sentences today.
func TestLoadAcceptsContentWithNoLessonsYet(t *testing.T) {
	dir := t.TempDir()
	if err := os.MkdirAll(filepath.Join(dir, "nurse", "scenarios"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "manifest.yaml"), []byte("version: test\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "nurse", "scenarios", "t.yaml"),
		[]byte("- id: SCN-T-00001\n  theme: t-theme\n  title: t\n  goals: [a]\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if _, err := Load(dir); err != nil {
		t.Fatalf("no sentences anywhere should load fine: %v", err)
	}
}
