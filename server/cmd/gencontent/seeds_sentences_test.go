package main

import (
	"reflect"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
)

func testDept() Dept {
	return Dept{Code: "ER", Name: "응급의료센터", Label: "ER", Color: "#DC2626", Tone: "#FEE2E2", Accent: "#B91C1C"}
}

func baseSeed() Seed {
	return Seed{
		Theme: "core-safety-er", Title: "반복 신원확인 이유 설명", Tagline: "Let me check your wristband.",
		Room: "BAY", Brief: "신원확인을 매번 반복하는 이유를 설명하세요.", Role: "patient", Difficulty: 1,
		KeyPhrases: []string{"Let me check your wristband."},
		Goals:      []string{"신원확인 절차를 설명한다", "환자의 동의를 얻는다"},
		Persona:    SeedPersona{Name: "Mrs. Hopkins", AgeRange: "60s", Mood: "neutral"},
	}
}

func wristbandBank() []content.Lexicon {
	return []content.Lexicon{{
		Theme: "core-safety-er",
		Words: []content.Word{
			{ID: "w-wristband", En: "wristband", IPA: "/ˈrɪstbænd/", Ko: "손목 밴드", Icon: "bandage", Example: "Let me check your wristband."},
		},
	}}
}

func wristbandSentence() content.Sentence {
	return content.Sentence{
		En:     "I need to check your wristband every time.",
		Ko:     "매번 손목 밴드를 확인해야 해요.",
		Chunks: []string{"I need to check your wristband every time", "."},
		Words:  []string{"w-wristband"},
		Goal:   1,
	}
}

// Test 2 (task brief §테스트): the seed's sentences reach the scenario with every
// field intact — nothing dropped in the seed → scenario transfer.
func TestGenerateSeedScenarios_carriesSentencesVerbatim(t *testing.T) {
	s := baseSeed()
	s.Sentences = []content.Sentence{wristbandSentence()}

	scns, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, wristbandBank())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !reflect.DeepEqual(scns[0].Sentences, s.Sentences) {
		t.Fatalf("sentences not carried verbatim:\n got  %+v\n want %+v", scns[0].Sentences, s.Sentences)
	}
}

// Test 7: a seed with no sentences must pass even with no lexicon at all — this is
// the state of all 20,056 current seeds.
func TestGenerateSeedScenarios_noSentencesAlwaysPasses(t *testing.T) {
	s := baseSeed() // s.Sentences is nil
	if _, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, nil); err != nil {
		t.Fatalf("a seed with no sentences must load cleanly, got: %v", err)
	}
}

// Test 8: 12 sentences on one seed must all survive — not cut to 5.
func TestGenerateSeedScenarios_keepsAllTwelveSentences(t *testing.T) {
	s := baseSeed()
	for i := 0; i < 12; i++ {
		s.Sentences = append(s.Sentences, wristbandSentence())
	}
	scns, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, wristbandBank())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(scns[0].Sentences) != 12 {
		t.Fatalf("scenario has %d sentences, want 12 (must not truncate)", len(scns[0].Sentences))
	}
}

// A1: an unknown word id must fail generation, and the error must name the id and
// the theme.
func TestGenerateSeedScenarios_A1_unknownWordIDFailsLoading(t *testing.T) {
	s := baseSeed()
	sent := wristbandSentence()
	sent.Words = []string{"w-does-not-exist"}
	s.Sentences = []content.Sentence{sent}

	_, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, wristbandBank())
	if err == nil {
		t.Fatal("expected an error for an unknown word id, got none")
	}
	msg := err.Error()
	if !strings.Contains(msg, "w-does-not-exist") || !strings.Contains(msg, "core-safety-er") {
		t.Fatalf("error must name the id and theme, got: %q", msg)
	}
}

// A1 also fires when the seed's theme has no lexicon bank at all in the file.
func TestGenerateSeedScenarios_A1_themeWithNoBankFailsLoading(t *testing.T) {
	s := baseSeed()
	s.Theme = "no-such-theme"
	s.Sentences = []content.Sentence{wristbandSentence()}

	_, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, wristbandBank())
	if err == nil {
		t.Fatal("expected an error when the seed's theme has no lexicon bank at all")
	}
}

// A2: a lexicon bank with a duplicate word id must fail generation before any seed
// is even processed.
func TestGenerateSeedScenarios_A2_duplicateBankIDFailsLoading(t *testing.T) {
	bank := []content.Lexicon{{
		Theme: "core-safety-er",
		Words: []content.Word{{ID: "w-wristband", En: "wristband"}, {ID: "w-wristband", En: "wristband 2"}},
	}}
	s := baseSeed() // no sentences needed — a bad bank fails on its own

	_, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, bank)
	if err == nil {
		t.Fatal("expected an error for a duplicate word id within a bank")
	}
}

// A3: goal must be within 1..len(seed.Goals).
func TestGenerateSeedScenarios_A3_goalOutOfRangeFailsLoading(t *testing.T) {
	s := baseSeed() // has 2 goals
	sent := wristbandSentence()
	sent.Goal = 3
	s.Sentences = []content.Sentence{sent}

	_, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, wristbandBank())
	if err == nil {
		t.Fatal("expected an error for a goal index beyond the seed's goals")
	}
}

// A4: chunks must join to exactly `en`.
func TestGenerateSeedScenarios_A4_chunksMismatchFailsLoading(t *testing.T) {
	s := baseSeed()
	sent := wristbandSentence()
	sent.Chunks = []string{"I need to check your", "wristband"} // drops "every time."
	s.Sentences = []content.Sentence{sent}

	_, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, wristbandBank())
	if err == nil {
		t.Fatal("expected an error when chunks do not join to en")
	}
}
