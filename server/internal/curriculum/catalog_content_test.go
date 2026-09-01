package curriculum

import (
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/adapters/contentfile"
	"github.com/bingoring/forin/server/internal/domain/conversation"
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

// The authored guided conversations: they exist, they are long enough, and every card
// the learner sees is a real sentence.
//
// "충분한 양의 대화를 위해 대화를 최소 6번은 해야지. 많으면 10번 넘어가면 좋겠고."
// So the floor here is 6 replies and these are written at 10. Asserted against the loaded
// content rather than the files: a regeneration that silently drops `steps` leaves the
// scenario working — it falls back to the model-driven pass — and nothing else would
// notice that the authored conversation is gone.
func TestAuthoredConversationsAreRealConversations(t *testing.T) {
	bundle, err := contentfile.Load("../../content")
	if err != nil {
		t.Fatalf("load content: %v", err)
	}
	authored := 0
	for _, s := range bundle.Scenarios {
		script := conversation.ScriptOf(&s)
		if script == nil {
			continue
		}
		authored++
		replies := 0
		for i, b := range script {
			if !b.Last() {
				replies++
			}
			if b.LineEN == "" {
				t.Errorf("%s beat %d: the character says nothing", s.ID, i)
			}
			// The learner's own language, for every beat. Without it the keyword help has
			// nothing to show on an authored line, which is the one kind of line we could
			// always have translated properly.
			if b.LineKO == "" {
				t.Errorf("%s beat %d: no lineKo", s.ID, i)
			}
			for j, c := range b.Choices {
				if strings.TrimSpace(c.Text) == "" {
					t.Errorf("%s beat %d choice %d: empty", s.ID, i, j)
				}
				// The reason is the lesson. A card without one teaches which sentence to
				// tap and nothing about why.
				if strings.TrimSpace(c.Why) == "" {
					t.Errorf("%s beat %d choice %d (%s): no reason", s.ID, i, j, c.Tier)
				}
			}
			// The tracker has to be able to fill: on this path there is no model reading
			// the transcript, so an unauthored mission list never moves.
			if b.Last() && len(b.Missions) == 0 {
				t.Errorf("%s: the closing beat covers no goals — the tracker would end unfilled", s.ID)
			}
		}
		if replies < 6 {
			t.Errorf("%s asks for %d replies, want at least 6", s.ID, replies)
		}
		if replies < 10 {
			t.Logf("%s asks for %d replies (target is 10+)", s.ID, replies)
		}
		// The briefing screen shows the tagline, and then the conversation opens. If the
		// first beat is a different sentence, the character says the same thing twice,
		// differently, before the learner has done anything. Caught once already: a
		// tagline said "the coffee's terrible but free" and the beat said "but it's free".
		if script[0].LineEN != s.Tagline {
			t.Errorf("%s: opens on %q but the briefing promised %q", s.ID, script[0].LineEN, s.Tagline)
		}
	}
	// Every ward greeting, plus the ER's orientation. A number rather than a list
	// because the list is the content: this catches a regeneration that wrote zero.
	if authored < 28 {
		t.Errorf("found %d authored conversations, want 28", authored)
	}
}

// {name} is the learner's own name, filled in when the card is served. It must not leak
// to the screen as literal braces, and it must not appear anywhere but a choice.
func TestTheNameTokenOnlyAppearsWhereItIsFilled(t *testing.T) {
	bundle, err := contentfile.Load("../../content")
	if err != nil {
		t.Fatalf("load content: %v", err)
	}
	for _, s := range bundle.Scenarios {
		script := conversation.ScriptOf(&s)
		for i, b := range script {
			if strings.Contains(b.LineEN, conversation.NameToken) || strings.Contains(b.LineKO, conversation.NameToken) {
				t.Errorf("%s beat %d: the character's line contains %s, which is never filled there",
					s.ID, i, conversation.NameToken)
			}
			for _, c := range b.Choices {
				if strings.Contains(c.Why, conversation.NameToken) {
					t.Errorf("%s beat %d: a reason contains %s", s.ID, i, conversation.NameToken)
				}
			}
		}
	}
}
