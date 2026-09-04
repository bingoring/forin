package contentfile

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/bingoring/forin/server/internal/domain/night"
)

// LoadNightStories reads <dir>/night/stories.yaml. Missing = empty (the endpoint then has
// no story to serve, like the other flavour pools).
func LoadNightStories(dir string) ([]night.Story, error) {
	path := filepath.Join(dir, "night", "stories.yaml")
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil, nil
	}
	var out []night.Story
	if err := readYAML(path, &out); err != nil {
		return nil, fmt.Errorf("night: %w", err)
	}
	return out, nil
}
