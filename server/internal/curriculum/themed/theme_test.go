package themed

import (
	"os"
	"path/filepath"
	"testing"
)

func writeTmp(t *testing.T, body string) string {
	t.Helper()
	p := filepath.Join(t.TempDir(), "themes.yaml")
	if err := os.WriteFile(p, []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
	return p
}

func TestLoadThemes_parsesTracks(t *testing.T) {
	path := writeTmp(t, `
- key: core-sbar
  name: SBAR 인계
  nameKey: theme.core.sbar
  track: core
  order: 10
  exam: true
- key: er-triage
  name: 트리아지
  track: depth
  dept: ER
  order: 20
- key: er-icu-handoff
  name: ICU 인계
  track: collab
  dept: ER
  order: 30
`)
	themes, err := LoadThemes(path)
	if err != nil {
		t.Fatal(err)
	}
	if len(themes) != 3 {
		t.Fatalf("want 3, got %d", len(themes))
	}
	if themes[0].Key != "core-sbar" || themes[0].Track != "core" || !themes[0].ExamOn() {
		t.Errorf("core theme parsed wrong: %+v", themes[0])
	}
	if themes[1].Dept != "ER" || themes[1].Track != "depth" {
		t.Errorf("depth theme parsed wrong: %+v", themes[1])
	}
	// exam defaults true when omitted
	if !themes[1].ExamOn() {
		t.Errorf("exam should default true, got false for %s", themes[1].Key)
	}
}
