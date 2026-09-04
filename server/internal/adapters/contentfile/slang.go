package contentfile

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/bingoring/forin/server/internal/domain/slang"
)

// LoadSlang reads <dir>/slang/us.yaml into the slang deck (US destination for now). A
// missing file is NOT an error — the deck endpoint then simply serves nothing, like the
// home flavour pools.
func LoadSlang(dir string) ([]slang.Card, error) {
	path := filepath.Join(dir, "slang", "us.yaml")
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil, nil
	}
	var cards []slang.Card
	if err := readYAML(path, &cards); err != nil {
		return nil, fmt.Errorf("slang: %w", err)
	}
	return cards, nil
}
