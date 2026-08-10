package contentfile

import "testing"

// The seeded pools must actually parse — a YAML typo would silently hide both
// home modules at runtime.
func TestLoadHomePoolsSeed(t *testing.T) {
	p, err := LoadHomePools("../../../content")
	if err != nil {
		t.Fatal(err)
	}
	if len(p.MentorNotes) < 20 {
		t.Fatalf("expected the seeded mentor notes, got %d", len(p.MentorNotes))
	}
	if len(p.Phrases) < 25 {
		t.Fatalf("expected the seeded phrases, got %d", len(p.Phrases))
	}
	for _, n := range p.MentorNotes {
		if n.ID == "" || n.Text == "" || n.NPC.Name == "" {
			t.Fatalf("incomplete mentor note: %+v", n)
		}
	}
	for _, ph := range p.Phrases {
		if ph.ID == "" || ph.EN == "" || ph.KO == "" {
			t.Fatalf("incomplete phrase: %+v", ph)
		}
	}
}

func TestLoadHomePoolsMissingDirIsFine(t *testing.T) {
	p, err := LoadHomePools("/nonexistent")
	if err != nil {
		t.Fatalf("a missing dir must not be an error: %v", err)
	}
	if len(p.MentorNotes) != 0 || len(p.Phrases) != 0 {
		t.Fatal("expected empty pools")
	}
}
