// Package themed assembles deep, theme-based curricula (커리큘럼 v3) from
// per-scenario theme tags. It is isolated from the legacy `curriculum` package
// so the live hardcoded path keeps serving until P2 tagging completes.
package themed

import (
	"os"

	"gopkg.in/yaml.v3"
)

// Theme is one registry entry (content/nurse/themes.yaml). A scenario's `theme`
// tag references Theme.Key; the registry owns the name, track, order and exam.
type Theme struct {
	Key     string `yaml:"key"`
	Name    string `yaml:"name"`
	NameKey string `yaml:"nameKey"`
	Track   string `yaml:"track"` // core | depth | collab
	Dept    string `yaml:"dept"`  // depth/collab: dept code; core: ""
	Order   int    `yaml:"order"`
	Exam    *bool  `yaml:"exam"` // pointer so "omitted" (nil) can default to true
}

// ExamOn reports the exam flag with the default-true rule applied: a theme ends
// with a 주제 시험(boss) unless it explicitly sets `exam: false`.
func (t Theme) ExamOn() bool { return t.Exam == nil || *t.Exam }

// LoadThemes reads the registry. Order in the file is not trusted for sorting —
// callers sort by Theme.Order (R22) — but the slice is returned as-read.
func LoadThemes(path string) ([]Theme, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var out []Theme
	if err := yaml.Unmarshal(raw, &out); err != nil {
		return nil, err
	}
	return out, nil
}
