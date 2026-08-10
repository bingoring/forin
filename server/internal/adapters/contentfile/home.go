package contentfile

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/bingoring/forin/server/internal/domain/home"
)

// LoadHomePools reads <dir>/home/*.yaml into the home content pools.
//
// These sit outside the profession bundle on purpose: mentor notes and field
// phrases are screen flavour for the home tab, not curriculum entities, and
// giving them their own files keeps the bundle schema unchanged.
//
// A missing directory is NOT an error — the home handler simply omits those two
// modules (the 더미 금지 rule), so a deployment without authored flavour still
// serves a working home screen.
func LoadHomePools(dir string) (home.Pools, error) {
	var p home.Pools
	base := filepath.Join(dir, "home")
	if _, err := os.Stat(base); os.IsNotExist(err) {
		return p, nil
	}

	notesPath := filepath.Join(base, "mentor-notes.yaml")
	if _, err := os.Stat(notesPath); err == nil {
		if err := readYAML(notesPath, &p.MentorNotes); err != nil {
			return p, fmt.Errorf("home pools: %w", err)
		}
	}
	phrasesPath := filepath.Join(base, "phrases.yaml")
	if _, err := os.Stat(phrasesPath); err == nil {
		if err := readYAML(phrasesPath, &p.Phrases); err != nil {
			return p, fmt.Errorf("home pools: %w", err)
		}
	}
	return p, nil
}
