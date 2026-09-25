package content

import (
	"strings"
	"testing"
)

// ---- JoinChunks (A4 spacing rule) ----

func TestJoinChunks_defaultSpace(t *testing.T) {
	got := JoinChunks([]string{"I need to", "check your", "wristband", "every time"})
	want := "I need to check your wristband every time"
	if got != want {
		t.Fatalf("got %q, want %q", got, want)
	}
}

func TestJoinChunks_noSpaceBeforePunct(t *testing.T) {
	cases := []struct {
		name   string
		chunks []string
		want   string
	}{
		{"question mark", []string{"Let me check your wristband", "?"}, "Let me check your wristband?"},
		{"period", []string{"I need to check your wristband", "."}, "I need to check your wristband."},
		{"comma mid-sentence", []string{"wristband", ", right", "?"}, "wristband, right?"},
		{"exclamation", []string{"Hold still", "!"}, "Hold still!"},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			if got := JoinChunks(c.chunks); got != c.want {
				t.Fatalf("got %q, want %q", got, c.want)
			}
		})
	}
}

func TestJoinChunks_empty(t *testing.T) {
	if got := JoinChunks(nil); got != "" {
		t.Fatalf("got %q, want empty", got)
	}
	if got := JoinChunks([]string{"solo"}); got != "solo" {
		t.Fatalf("got %q, want %q", got, "solo")
	}
}

// ---- FindLexiconTheme ----

func TestFindLexiconTheme(t *testing.T) {
	bank := []Lexicon{
		{Theme: "core-safety-er", Words: []Word{{ID: "w-wristband", En: "wristband"}}},
		{Theme: "er-pain-sedation", Words: []Word{{ID: "w-nrs", En: "NRS"}}},
	}
	got, ok := FindLexiconTheme(bank, "er-pain-sedation")
	if !ok || got.Theme != "er-pain-sedation" || len(got.Words) != 1 {
		t.Fatalf("lookup failed: %+v, %v", got, ok)
	}
	if _, ok := FindLexiconTheme(bank, "no-such-theme"); ok {
		t.Fatal("expected not-found for unknown theme")
	}
}

// ---- ValidateLexicon (A2: no duplicate ids within a bank) ----

func TestValidateLexicon_passesOnUniqueIDs(t *testing.T) {
	bank := Lexicon{Theme: "core-safety-er", Words: []Word{
		{ID: "w-wristband", En: "wristband"}, {ID: "w-verify", En: "verify"},
	}}
	if errs := ValidateLexicon(bank); len(errs) != 0 {
		t.Fatalf("expected no errors, got %v", errs)
	}
}

func TestValidateLexicon_A2_rejectsDuplicateIDs(t *testing.T) {
	bank := Lexicon{Theme: "core-safety-er", Words: []Word{
		{ID: "w-wristband", En: "wristband"}, {ID: "w-wristband", En: "wristband again"},
	}}
	errs := ValidateLexicon(bank)
	if len(errs) == 0 {
		t.Fatal("expected a duplicate-id error, got none")
	}
}

// 30 words in a bank must all survive — the loader/validator must not truncate to 8.
func TestValidateLexicon_doesNotTruncateThirtyWords(t *testing.T) {
	var words []Word
	for i := 0; i < 30; i++ {
		words = append(words, Word{ID: string(rune('a' + i))})
	}
	bank := Lexicon{Theme: "core-safety-er", Words: words}
	if len(bank.Words) != 30 {
		t.Fatalf("bank has %d words, want 30", len(bank.Words))
	}
	if errs := ValidateLexicon(bank); len(errs) != 0 {
		t.Fatalf("expected no errors, got %v", errs)
	}
}

// ---- ValidateSentences (A1, A3, A4) ----

func validBank() Lexicon {
	return Lexicon{Theme: "core-safety-er", Words: []Word{
		{ID: "w-wristband", En: "wristband"},
		{ID: "w-verify", En: "verify"},
	}}
}

func validSentence() Sentence {
	return Sentence{
		En:     "I need to check your wristband every time.",
		Ko:     "매번 손목 밴드를 확인해야 해요.",
		Chunks: []string{"I need to check your wristband every time", "."},
		Words:  []string{"w-wristband"},
		Goal:   1,
	}
}

func TestValidateSentences_passesOnGoodInput(t *testing.T) {
	errs := ValidateSentences("core-safety-er", validBank(), 2, []Sentence{validSentence()})
	if len(errs) != 0 {
		t.Fatalf("expected no errors, got %v", errs)
	}
}

func TestValidateSentences_emptyAlwaysPasses(t *testing.T) {
	// No bank at all, no goals — an empty sentence list must still pass (most seeds
	// have none yet).
	errs := ValidateSentences("some-theme", Lexicon{}, 0, nil)
	if len(errs) != 0 {
		t.Fatalf("expected no errors for empty sentences, got %v", errs)
	}
}

func TestValidateSentences_A1_rejectsUnknownWordID(t *testing.T) {
	s := validSentence()
	s.Words = []string{"w-does-not-exist"}
	errs := ValidateSentences("core-safety-er", validBank(), 2, []Sentence{s})
	if len(errs) == 0 {
		t.Fatal("expected an unknown-word-id error, got none")
	}
	msg := errs[0].Error()
	if !strings.Contains(msg, "w-does-not-exist") || !strings.Contains(msg, "core-safety-er") {
		t.Fatalf("error message must name the id and the theme, got: %q", msg)
	}
}

func TestValidateSentences_A1_rejectsWhenThemeHasNoBankAtAll(t *testing.T) {
	// FindLexiconTheme's not-found case is passed through as a zero Lexicon with
	// just the theme name set — every word reference must then fail as unknown.
	s := validSentence()
	errs := ValidateSentences("core-safety-er", Lexicon{Theme: "core-safety-er"}, 2, []Sentence{s})
	if len(errs) == 0 {
		t.Fatal("expected an error when the theme has no bank at all")
	}
}

func TestValidateSentences_A3_rejectsGoalBelowRange(t *testing.T) {
	s := validSentence()
	s.Goal = 0
	errs := ValidateSentences("core-safety-er", validBank(), 2, []Sentence{s})
	if len(errs) == 0 {
		t.Fatal("expected a goal-out-of-range error for goal=0")
	}
}

func TestValidateSentences_A3_rejectsGoalAboveRange(t *testing.T) {
	s := validSentence()
	s.Goal = 3 // seed only has 2 goals
	errs := ValidateSentences("core-safety-er", validBank(), 2, []Sentence{s})
	if len(errs) == 0 {
		t.Fatal("expected a goal-out-of-range error for goal > goalCount")
	}
}

func TestValidateSentences_A4_rejectsChunksThatDoNotJoinToEn(t *testing.T) {
	s := validSentence()
	s.Chunks = []string{"I need to check your", "wristband"} // drops "every time."
	errs := ValidateSentences("core-safety-er", validBank(), 2, []Sentence{s})
	if len(errs) == 0 {
		t.Fatal("expected a chunks-do-not-join error")
	}
}

// A situation with 12 sentences must keep all 12 — the validator must not truncate
// to 5 while checking them.
func TestValidateSentences_doesNotTruncateTwelveSentences(t *testing.T) {
	var sentences []Sentence
	for i := 0; i < 12; i++ {
		sentences = append(sentences, validSentence())
	}
	errs := ValidateSentences("core-safety-er", validBank(), 2, sentences)
	if len(errs) != 0 {
		t.Fatalf("expected no errors, got %v", errs)
	}
	if len(sentences) != 12 {
		t.Fatalf("sentence slice has %d entries, want 12", len(sentences))
	}
}
