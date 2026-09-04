package curriculum

import (
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/adapters/contentfile"
)

// This is the test whose absence let the v19 catalog ship eleven steps that named
// content they did not point at. Chapter 1 promised 출근 · 인사와 자기소개 and
// opened SCN-ER-00001, which is 흉통 환자 트리아지 — chest-pain triage as a
// newcomer's first tap. Every id existed, so the seed guard (which checks only
// existence) passed. Nothing compared the two strings until now.
//
// It loads content through the same adapter the seeder uses, so it validates the
// catalog against the bytes that actually reach the database, and it touches
// neither a database nor the network — CI has no TEST_DATABASE_URL, and a test
// that silently skips is how invariants rot.
func TestEveryStepNamesItsContent(t *testing.T) {
	bundle, err := contentfile.Load("../../content")
	if err != nil {
		t.Fatalf("load content: %v", err)
	}

	titles := make(map[string]string, len(bundle.Scenarios)+len(bundle.Quizzes))
	for _, s := range bundle.Scenarios {
		titles[s.ID] = s.Title
	}
	for _, q := range bundle.Quizzes {
		titles[q.ID] = q.Title
	}

	for _, c := range catalog {
		for _, s := range c.Steps {
			if s.ScenarioID == "" {
				t.Errorf("%s: step %q has no content id", c.Key, s.Name)
				continue
			}
			title, ok := titles[s.ScenarioID]
			if !ok {
				t.Errorf("%s: step %q points at %s, which no content file defines",
					c.Key, s.Name, s.ScenarioID)
				continue
			}
			if !namesTitle(s.Name, title) {
				t.Errorf("%s: step is named %q but %s is titled %q",
					c.Key, s.Name, s.ScenarioID, title)
			}
		}
	}
}

// namesTitle reports whether a step name identifies the content it points at.
//
// A generated scenario title carries a persona suffix ("수술 동의 확인 — Mr.
// Garcia", "만성질환 입원 사정 · Mr. Robinson") which a curriculum step drops, so a
// prefix up to that separator counts. It is deliberately a prefix test and not a
// "split the title on the separator" one: quiz titles contain the same separators
// as real punctuation ("오염 · 멸균 분류"), and splitting would compare against
// "오염" and reject a perfectly correct step.
func namesTitle(stepName, title string) bool {
	if stepName == title {
		return true
	}
	for _, sep := range []string{" · ", " — "} {
		if strings.HasPrefix(title, stepName+sep) {
			return true
		}
	}
	return false
}

// The seed guard refuses to drop content the path references, so a step pointing
// at a scenario the bundle no longer ships would wedge deploys. Check it here too,
// where the failure names the curriculum instead of a bare id list.
func TestReferencedIDsAllExist(t *testing.T) {
	bundle, err := contentfile.Load("../../content")
	if err != nil {
		t.Fatalf("load content: %v", err)
	}
	have := map[string]bool{}
	for _, s := range bundle.Scenarios {
		have[s.ID] = true
	}
	for _, q := range bundle.Quizzes {
		have[q.ID] = true
	}
	for _, id := range ReferencedIDs() {
		if !have[id] {
			t.Errorf("%s is referenced by the path but not shipped", id)
		}
	}
}

