package speech

import "testing"

func TestSentenceKeyNormalizes(t *testing.T) {
	a := SentenceKey("  I'm  Giving you 650 mg. ", "en-US")
	b := SentenceKey("i'm giving you 650 mg.", "en-US")
	if a != b {
		t.Fatalf("case/whitespace must not split history: %s vs %s", a, b)
	}
	if len(a) != 32 {
		t.Fatalf("key length %d, want 32", len(a))
	}
}

func TestSentenceKeySeparatesLocales(t *testing.T) {
	if SentenceKey("hello", "en-US") == SentenceKey("hello", "en-GB") {
		t.Fatal("different locales are different sentences to score against")
	}
}
