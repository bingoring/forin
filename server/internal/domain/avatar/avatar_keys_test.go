package avatar

import (
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"testing"
)

// The allowed keys exist twice — here and in mobile/src/data/nbAvatar.ts — because
// the client builds the picker from them and cannot ask the server what a hairstyle
// is called on every keystroke. Duplication is the right trade; SILENT duplication
// is not: a key added on one side only means either a picker cell whose save is
// rejected, or a stored portrait the client cannot draw.
//
// So the two lists are compared. This is a monorepo and the file is always in the
// checkout that runs these tests.
func TestAllowedKeysMatchTheClientCatalog(t *testing.T) {
	path := filepath.Join("..", "..", "..", "..", "mobile", "src", "data", "nbAvatar.ts")
	src, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("could not read the client's key catalog (%s): %v", path, err)
	}

	// export const SKIN_KEYS = ['pale', 'ivory', …] as const;
	re := regexp.MustCompile(`(?s)export const ([A-Z_]+_KEYS) = \[(.*?)\] as const`)
	// The catalog carries `// …` line comments between keys, and a comment can hold a
	// comma ("tired, not asleep"), which the split below would turn into phantom keys.
	// Strip comments before splitting so the drift check compares keys, not prose.
	comment := regexp.MustCompile(`//[^\n]*`)
	client := map[string][]string{}
	for _, m := range re.FindAllStringSubmatch(string(src), -1) {
		keys := []string{}
		for _, raw := range strings.Split(comment.ReplaceAllString(m[2], ""), ",") {
			k := strings.Trim(strings.TrimSpace(raw), "'\"\n\t ")
			if k != "" {
				keys = append(keys, k)
			}
		}
		client[m[1]] = keys
	}

	// TS constant name → the axis it feeds. Written out rather than derived: the
	// mapping is the thing that could be wrong, and deriving it from a naming rule
	// would make a renamed constant look like an empty axis.
	axisOf := map[string]string{
		"SKIN_KEYS": "skin", "HAIR_KEYS": "hair", "HAIR_COLOR_KEYS": "hairColor",
		"EYE_KEYS": "eyes", "MOUTH_KEYS": "mouth", "OUTFIT_KEYS": "outfit",
		"OUTFIT_COLOR_KEYS": "outfitColor", "HAT_KEYS": "hat", "BG_KEYS": "bg",
		"ACC_KEYS": "acc",
	}
	if len(client) != len(axisOf) {
		t.Fatalf("parsed %d key lists from %s, want %d — did a constant get renamed?", len(client), path, len(axisOf))
	}

	for constName, axis := range axisOf {
		got, ok := client[constName]
		if !ok {
			t.Errorf("%s is missing from the client catalog", constName)
			continue
		}
		want, ok := AllowedKeys[axis]
		if !ok {
			t.Errorf("axis %q (from %s) is not allowed server-side at all", axis, constName)
			continue
		}
		if !sameSet(got, want) {
			t.Errorf("axis %q differs:\n  client: %v\n  server: %v", axis, sorted(got), sorted(want))
		}
	}
}

func sameSet(a, b []string) bool {
	if len(a) != len(b) {
		return false
	}
	x, y := sorted(a), sorted(b)
	for i := range x {
		if x[i] != y[i] {
			return false
		}
	}
	return true
}

func sorted(in []string) []string {
	out := append([]string(nil), in...)
	sort.Strings(out)
	return out
}
