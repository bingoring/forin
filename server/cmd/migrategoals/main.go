// One-off: backfill the opening and closing goals into hand-authored scenarios.
//
// The generator composes them for the 2782 scenarios it produces (content.ComposeGoals).
// The 303 hand-authored files predate that and carry only the body goals, which is
// what made them clearable in one exchange.
//
// Edits LINES, not parsed YAML. These files carry authored header comments and a
// deliberate key order; a yaml round-trip would silently reformat all 303 and drop
// every comment. So the goals block is found textually, its own indentation is
// copied, and two lines are inserted — everything else in the file is byte-identical.
//
//	usage: go run ./cmd/migrategoals [--dir content/nurse/scenarios] [--dry]
package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"

	"github.com/bingoring/forin/server/internal/domain/content"
)

// A goals list item: any indentation, then "- ".
var itemRx = regexp.MustCompile(`^(\s*)-\s`)

func main() {
	dir := flag.String("dir", "content/nurse/scenarios", "scenario directory")
	dry := flag.Bool("dry", false, "report without writing")
	flag.Parse()

	entries, err := os.ReadDir(*dir)
	if err != nil {
		fmt.Fprintln(os.Stderr, "read dir:", err)
		os.Exit(1)
	}
	changed, skipped, already := 0, 0, 0
	for _, e := range entries {
		name := e.Name()
		if e.IsDir() || !strings.HasSuffix(name, ".yaml") || strings.HasPrefix(name, "gen-") {
			continue // gen-* are produced by the generator, which already composes
		}
		path := filepath.Join(*dir, name)
		raw, err := os.ReadFile(path)
		if err != nil {
			fmt.Fprintf(os.Stderr, "%s: %v\n", name, err)
			skipped++
			continue
		}
		out, status, err := migrate(string(raw))
		if err != nil {
			fmt.Fprintf(os.Stderr, "%s: %v\n", name, err)
			skipped++
			continue
		}
		switch status {
		case "already":
			already++
			continue
		case "skip":
			skipped++
			continue
		}
		if !*dry {
			if err := os.WriteFile(path, []byte(out), 0o644); err != nil {
				fmt.Fprintf(os.Stderr, "%s: %v\n", name, err)
				skipped++
				continue
			}
		}
		changed++
	}
	fmt.Printf("goals backfilled: %d changed, %d already structured, %d skipped\n", changed, already, skipped)
}

// migrate returns the rewritten file and what happened: "ok", "already" (both
// structural goals present), or "skip" (nothing to do safely).
func migrate(src string) (string, string, error) {
	// Read-only parse, purely to learn the persona role and the current goals.
	var doc struct {
		Persona struct{ Role string } `yaml:"persona"`
		Goals   []string              `yaml:"goals"`
	}
	if err := yaml.Unmarshal([]byte(src), &doc); err != nil {
		return "", "", fmt.Errorf("parse: %w", err)
	}
	open, close := content.OpenGoal(doc.Persona.Role), content.CloseGoal(doc.Persona.Role)
	hasOpen, hasClose := false, false
	for _, g := range doc.Goals {
		if strings.TrimSpace(g) == open {
			hasOpen = true
		}
		if strings.TrimSpace(g) == close {
			hasClose = true
		}
	}
	if hasOpen && hasClose {
		return src, "already", nil
	}

	lines := strings.Split(src, "\n")
	start := -1
	for i, l := range lines {
		if strings.TrimRight(l, " \t") == "goals:" || strings.HasPrefix(l, "goals:") {
			start = i
			break
		}
	}
	if start < 0 {
		return "", "skip", nil // no goals block to extend
	}
	// The block runs while lines are list items. Its indentation is copied from the
	// first item rather than assumed: these files use 2- and 4-space styles both.
	first, last, indent := -1, -1, "  "
	for i := start + 1; i < len(lines); i++ {
		m := itemRx.FindStringSubmatch(lines[i])
		if m == nil {
			if strings.TrimSpace(lines[i]) == "" && first >= 0 {
				continue // a blank line inside the block
			}
			break
		}
		if first < 0 {
			first, indent = i, m[1]
		}
		last = i
	}
	if first < 0 {
		return "", "skip", nil // an empty goals block: leave it to a human
	}

	quote := func(s string) string { return indent + "- " + `"` + s + `"` }
	out := make([]string, 0, len(lines)+2)
	out = append(out, lines[:first]...)
	if !hasOpen {
		out = append(out, quote(open))
	}
	out = append(out, lines[first:last+1]...)
	if !hasClose {
		out = append(out, quote(close))
	}
	out = append(out, lines[last+1:]...)
	return strings.Join(out, "\n"), "ok", nil
}
