package main

import (
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"

	"github.com/bingoring/forin/server/internal/domain/content"
)

// loadLexicon reads content/nurse/lexicon/<code>.yaml — one department's word
// banks, one content.Lexicon entry per theme it teaches. Mirrors loadSeeds:
// returns (nil, nil) when the file is absent, so a department without a lexicon
// file yet (every department, at the point this task lands) does not block
// generation. Its seeds simply must not carry `sentences` yet either — that is
// exactly what generateSeedScenarios' A1/A3/A4 checks enforce.
func loadLexicon(dir, code string) ([]content.Lexicon, error) {
	path := filepath.Join(dir, "lexicon", lower(code)+".yaml")
	raw, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var banks []content.Lexicon
	if err := yaml.Unmarshal(raw, &banks); err != nil {
		return nil, fmt.Errorf("%s: %w", path, err)
	}
	return banks, nil
}
