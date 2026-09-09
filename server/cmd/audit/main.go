// Command audit reports curriculum v3 tagging coverage — read-only; it changes
// no content. Two views:
//   - theme coverage (per-theme counts, thin themes, orphans, dup titles), once
//     themes.yaml + theme tags exist;
//   - topic distribution (scenarios per title-prefix per dept), the pre-tagging
//     view that shows which topics cluster into a theme of ≥20.
//
// Usage: CONTENT_DIR=content go run ./cmd/audit [--topics DEPT]
package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/bingoring/forin/server/internal/adapters/contentfile"
	"github.com/bingoring/forin/server/internal/curriculum/themed"
)

func main() {
	dir := os.Getenv("CONTENT_DIR")
	if dir == "" {
		dir = "content"
	}
	// --topics [DEPT]: print the topic distribution (optionally one dept).
	topicsOnly, deptFilter := false, ""
	for i, a := range os.Args[1:] {
		if a == "--topics" {
			topicsOnly = true
			if i+2 < len(os.Args) {
				deptFilter = os.Args[i+2]
			}
		}
	}

	bundle, err := contentfile.Load(dir)
	if err != nil {
		fmt.Fprintln(os.Stderr, "content:", err)
		os.Exit(1)
	}
	tags := make([]themed.ScenarioTag, 0, len(bundle.Scenarios))
	for _, s := range bundle.Scenarios {
		diff := 0
		if s.Briefing != nil {
			diff = s.Briefing.Difficulty
		}
		tags = append(tags, themed.ScenarioTag{
			ID: s.ID, Title: s.Title, Theme: s.Theme, CollabWith: s.CollabWith,
			Dept: deptOf(s.ID), Difficulty: diff,
		})
	}

	if topicsOnly {
		printTopics(themed.TopicDistribution(tags), deptFilter)
		return
	}

	// Theme coverage (needs themes.yaml).
	themes, err := themed.LoadThemes(filepath.Join(dir, "nurse", "themes.yaml"))
	if err != nil {
		fmt.Fprintln(os.Stderr, "themes.yaml:", err, "— run with --topics for the pre-tagging view")
		os.Exit(1)
	}
	rep := themed.Audit(themes, tags, 20)
	fmt.Printf("tagged %d / %d scenarios · %d themes · %d orphans · %d dup-titles\n\n",
		rep.TotalTagged, len(tags), len(rep.Themes), len(rep.Orphans), len(rep.Duplicates))
	for _, s := range rep.Themes {
		flag := ""
		if s.Thin {
			flag = "  ← THIN (<20)"
		}
		fmt.Printf("  %-30s %3d%s\n", s.Key, s.Count, flag)
	}
	if len(rep.Orphans) > 0 {
		fmt.Printf("\norphans (%d): %v...\n", len(rep.Orphans), firstN(rep.Orphans, 15))
	}
}

func printTopics(dist []themed.TopicCount, deptFilter string) {
	curDept, deptTotal, deptTopics := "", 0, 0
	flush := func() {
		if curDept != "" {
			fmt.Printf("  └ %d topics, %d scenarios\n\n", deptTopics, deptTotal)
		}
	}
	for _, tc := range dist {
		if deptFilter != "" && tc.Dept != deptFilter {
			continue
		}
		if tc.Dept != curDept {
			flush()
			curDept, deptTotal, deptTopics = tc.Dept, 0, 0
			fmt.Printf("=== %s ===\n", tc.Dept)
		}
		fmt.Printf("  %-40s %3d\n", tc.Topic, tc.Count)
		deptTotal += tc.Count
		deptTopics++
	}
	flush()
}

func deptOf(id string) string {
	parts := strings.SplitN(id, "-", 3)
	if len(parts) >= 3 {
		return parts[1]
	}
	return ""
}

func firstN(s []string, n int) []string {
	if len(s) < n {
		return s
	}
	return s[:n]
}
