package contentfile

import "testing"

func TestLoadSlangDeck(t *testing.T) {
	cards, err := LoadSlang("../../../content")
	if err != nil {
		t.Fatal(err)
	}
	if len(cards) < 30 {
		t.Fatalf("expected the seeded slang deck, got %d", len(cards))
	}
	ids := map[string]bool{}
	for _, c := range cards {
		if c.Code == "" || c.Gloss["en"] == "" {
			t.Fatalf("card %s: every card needs a code and an English gloss (the fallback)", c.ID)
		}
		if ids[c.ID] {
			t.Fatalf("duplicate slang id %s", c.ID)
		}
		ids[c.ID] = true
	}
}

func TestLoadSlangMissingIsFine(t *testing.T) {
	cards, err := LoadSlang("/nonexistent")
	if err != nil || cards != nil {
		t.Fatalf("a missing deck must be empty, not an error: %v %v", cards, err)
	}
}
