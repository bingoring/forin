package main

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
)

// loadLexicon reads content/nurse/lexicon/<code>.yaml and finds a bank by
// (dept, theme): dept selects the file (this loader), theme selects the entry
// within it (content.FindLexiconTheme).
func TestLoadLexicon_findsBankByDeptAndTheme(t *testing.T) {
	dir := t.TempDir()
	if err := os.MkdirAll(filepath.Join(dir, "lexicon"), 0o755); err != nil {
		t.Fatal(err)
	}
	yaml := `
- theme: core-safety-er
  words:
    - id: w-wristband
      en: wristband
      ipa: /ˈrɪstbænd/
      ko: 손목 밴드
      icon: bandage
      example: "Let me check your wristband."
- theme: er-pain-sedation
  words:
    - id: w-nrs
      en: NRS
`
	if err := os.WriteFile(filepath.Join(dir, "lexicon", "er.yaml"), []byte(yaml), 0o644); err != nil {
		t.Fatal(err)
	}

	bank, err := loadLexicon(dir, "ER")
	if err != nil {
		t.Fatalf("loadLexicon: %v", err)
	}
	if len(bank) != 2 {
		t.Fatalf("want 2 themes in the bank, got %d", len(bank))
	}
	lex, ok := content.FindLexiconTheme(bank, "core-safety-er")
	if !ok {
		t.Fatal("theme core-safety-er not found")
	}
	if len(lex.Words) != 1 || lex.Words[0].ID != "w-wristband" || lex.Words[0].IPA != "/ˈrɪstbænd/" {
		t.Fatalf("word not carried through correctly: %+v", lex.Words)
	}
}

func TestLoadLexicon_missingFileIsNotAnError(t *testing.T) {
	dir := t.TempDir()
	bank, err := loadLexicon(dir, "ER")
	if err != nil {
		t.Fatalf("missing lexicon file should not error, got: %v", err)
	}
	if bank != nil {
		t.Fatalf("expected nil bank for a department with no lexicon file yet, got %v", bank)
	}
}

// A bank of 30 words must survive the round trip through the file — not truncated
// to 8.
func TestLoadLexicon_doesNotTruncateThirtyWords(t *testing.T) {
	dir := t.TempDir()
	if err := os.MkdirAll(filepath.Join(dir, "lexicon"), 0o755); err != nil {
		t.Fatal(err)
	}
	lex := []content.Lexicon{{Theme: "core-safety-er"}}
	for i := 0; i < 30; i++ {
		lex[0].Words = append(lex[0].Words, content.Word{ID: "w-" + string(rune('a'+i)), En: "word"})
	}
	writeYAML(filepath.Join(dir, "lexicon", "er.yaml"), lex)

	bank, err := loadLexicon(dir, "ER")
	if err != nil {
		t.Fatalf("loadLexicon: %v", err)
	}
	got, ok := content.FindLexiconTheme(bank, "core-safety-er")
	if !ok || len(got.Words) != 30 {
		t.Fatalf("want 30 words, got %d (found=%v)", len(got.Words), ok)
	}
}
