package night

import "testing"

func TestStoriesWrapAndResolveLocale(t *testing.T) {
	s := NewStories([]Story{
		{ID: "a", Title: map[string]string{"ko": "가", "en": "A"}, Body: map[string]string{"en": "b"}, KeyLine: "hi", KeyGloss: map[string]string{"ko": "안녕"}},
		{ID: "b", Title: map[string]string{"en": "B"}, Body: map[string]string{"en": "b"}, KeyLine: "yo"},
	})
	if s.Len() != 2 {
		t.Fatalf("len %d", s.Len())
	}
	// Wraps in both directions.
	if st, _ := s.At(2); st.ID != "a" {
		t.Fatalf("At(2) should wrap to a, got %s", st.ID)
	}
	if st, _ := s.At(-1); st.ID != "b" {
		t.Fatalf("At(-1) should wrap to b, got %s", st.ID)
	}
	// Locale resolves with English fallback.
	st, _ := s.At(0)
	if st.TitleFor("ko") != "가" || st.TitleFor("ja") != "A" {
		t.Fatalf("title locale: ko=%q ja=%q", st.TitleFor("ko"), st.TitleFor("ja"))
	}
	if st.KeyGlossFor("ko") != "안녕" || st.KeyGlossFor("de") != "" {
		t.Fatalf("keyGloss: ko=%q de=%q", st.KeyGlossFor("ko"), st.KeyGlossFor("de"))
	}
}

func TestEmptyStories(t *testing.T) {
	if _, ok := NewStories(nil).At(0); ok {
		t.Fatal("empty set has no story")
	}
}
