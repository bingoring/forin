package contentfile

import "testing"

func TestLoadNightStories(t *testing.T) {
	stories, err := LoadNightStories("../../../content")
	if err != nil {
		t.Fatal(err)
	}
	if len(stories) < 3 {
		t.Fatalf("expected the seeded night stories, got %d", len(stories))
	}
	ids := map[string]bool{}
	for _, s := range stories {
		if s.Title["en"] == "" || s.Body["en"] == "" || s.KeyLine == "" {
			t.Fatalf("story %s: needs an English title/body and a keyLine", s.ID)
		}
		if ids[s.ID] {
			t.Fatalf("duplicate night story id %s", s.ID)
		}
		ids[s.ID] = true
	}
}
