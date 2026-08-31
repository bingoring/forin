package conversation

import (
	"strings"
	"testing"
)

func TestParseChoicesSurvivesTheModelsEnvelope(t *testing.T) {
	// Models wrap JSON in prose more often than not. The choices are the point; the
	// packaging is not worth a failure.
	raw := "Sure! Here are three:\n```json\n" +
		`{"choices":[{"tier":"fair","text":"I'll be right there.","why":"안전하지만 진전은 없어요"},` +
		`{"tier":"best","text":"Can you tell me where the pain is?","why":"통증 위치를 먼저 확보해요"},` +
		`{"tier":"strong","text":"Are you in pain right now?","why":"통증 유무는 확인하지만 양상은 남아요"}]}` +
		"\n```\nHope that helps!"
	got := parseChoices(raw)
	if len(got) != 3 {
		t.Fatalf("parsed %d choices, want 3: %+v", len(got), got)
	}
	// Ordered best-first whatever order the model answered in: the list is read top
	// down, and "these are ranked" only reads as true if they are.
	if got[0].Tier != TierBest || got[1].Tier != TierStrong || got[2].Tier != TierFair {
		t.Fatalf("order = %q/%q/%q", got[0].Tier, got[1].Tier, got[2].Tier)
	}
	if got[0].Why == "" {
		t.Fatal("the best choice lost its reason — the difference between the three IS the lesson")
	}
}

func TestParseChoicesDropsWhatCannotBeDrawn(t *testing.T) {
	raw := `{"choices":[
      {"tier":"best","text":"Where is the pain?","why":"확보"},
      {"tier":"best","text":"A duplicate tier","why":"두 번째 best"},
      {"tier":"awful","text":"An unknown tier","why":"x"},
      {"tier":"strong","text":"   ","why":"공백뿐"},
      {"tier":"fair","text":"I'm here with you.","why":"안심"}
    ]}`
	got := parseChoices(raw)
	if len(got) != 2 {
		t.Fatalf("kept %d, want 2 (best + fair): %+v", len(got), got)
	}
	// A blank text is a blank button; a tier the app has no style for draws unstyled;
	// two "best" replies contradict the ranking the learner is being shown.
	for _, c := range got {
		if strings.TrimSpace(c.Text) == "" {
			t.Fatal("a blank choice survived")
		}
		if !validTier(c.Tier) {
			t.Fatalf("an undrawable tier survived: %q", c.Tier)
		}
	}
	if got[0].Tier == got[1].Tier {
		t.Fatal("two choices share a tier")
	}
}

func TestParseChoicesOnRubbishGivesNothing(t *testing.T) {
	// Nothing is a working state: the screen falls back to its text box, which is the
	// app as it always was. A scaffold that fails should leave the learner standing.
	for _, raw := range []string{"", "I could not do that.", "{", `{"choices":"not a list"}`, `{"choices":[]}`} {
		if got := parseChoices(raw); len(got) != 0 {
			t.Fatalf("parseChoices(%q) = %+v, want nothing", raw, got)
		}
	}
}

func TestTheThreeTiersAreAllUsable(t *testing.T) {
	// The tiers are best/strong/fair — not good/bad. A wrong option would make this a
	// quiz, and nobody picks the wrong one anyway, so the choice would be theatre.
	// What the learner chooses between is three ways of being competent.
	for _, tier := range []ChoiceTier{TierBest, TierStrong, TierFair} {
		if !validTier(tier) {
			t.Fatalf("%q is not accepted by the parser", tier)
		}
	}
	if validTier("bad") || validTier("wrong") || validTier("") {
		t.Fatal("a failing tier is accepted — the three are all correct by design")
	}
	if ChoiceCount != 3 {
		t.Fatalf("ChoiceCount = %d; two is a coin toss with no middle, four is a menu", ChoiceCount)
	}
}
