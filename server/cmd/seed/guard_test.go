package main

import (
	"reflect"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/adapters/contentfile"
	"github.com/bingoring/forin/server/internal/domain/content"
)

func TestMissingIDsReportsWhatWouldDisappear(t *testing.T) {
	bundle := map[string]bool{"SCN-ER-00001": true, "QZ-ER-00001": true}
	referenced := map[string]bool{
		"SCN-ER-00001":   true, // present
		"SCN-WARD-00101": true, // gone
		"QZ-WARD-00101":  true, // gone
	}
	got := missingIDs(bundle, referenced)
	want := []string{"QZ-WARD-00101", "SCN-WARD-00101"} // sorted
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %v, want %v", got, want)
	}
}

func TestMissingIDsEmptyWhenBundleGrows(t *testing.T) {
	bundle := map[string]bool{"A": true, "B": true, "C": true}
	referenced := map[string]bool{"A": true, "B": true}
	if got := missingIDs(bundle, referenced); len(got) != 0 {
		t.Fatalf("a growing bundle must pass, got %v", got)
	}
}

// An empty referenced set means nothing is at risk — a first seed into a fresh
// database must not be blocked.
func TestMissingIDsAllowsFirstSeed(t *testing.T) {
	if got := missingIDs(map[string]bool{"A": true}, map[string]bool{}); len(got) != 0 {
		t.Fatalf("first seed must pass, got %v", got)
	}
}

// The readiness guard has to FIRE on a false claim. A guard nobody has seen fail is
// indistinguishable from a guard that cannot fail — which is how the fabricated
// curriculum step names survived a whole seed check that only tested id existence.
func TestUnreadyLangsCatchesAFalseClaim(t *testing.T) {
	// English covers the path (every authored scenario defaults to "en"), so the
	// real declaration passes.
	if got := unreadyLangs(realBundle(t)); len(got) > 0 {
		t.Fatalf("en should be ready, got %v", got)
	}

	// Now claim a language the bundle has nothing in.
	orig := content.ReadyTargetLangs
	content.ReadyTargetLangs = []string{"en", "de"}
	defer func() { content.ReadyTargetLangs = orig }()

	got := unreadyLangs(realBundle(t))
	if len(got) != 1 {
		t.Fatalf("expected exactly one complaint about de, got %v", got)
	}
	if !strings.Contains(got[0], `"de"`) {
		t.Errorf("complaint should name de: %q", got[0])
	}
}

// A scenario with no lang counts as the default rather than as its own language —
// otherwise 303 files would each need a line saying the same thing.
func TestEmptyLangCountsAsDefault(t *testing.T) {
	b := &content.Bundle{Scenarios: []content.Scenario{{ID: "X", Lang: ""}}}
	orig := content.ReadyTargetLangs
	content.ReadyTargetLangs = []string{content.DefaultTargetLang}
	defer func() { content.ReadyTargetLangs = orig }()

	// The path references far more than "X", so this still complains — the point is
	// that it complains about missing coverage, not about an unknown language.
	got := unreadyLangs(b)
	if len(got) != 1 || !strings.Contains(got[0], `"en"`) {
		t.Fatalf("want one en complaint, got %v", got)
	}
}

func realBundle(t *testing.T) *content.Bundle {
	t.Helper()
	b, err := contentfile.Load("../../content")
	if err != nil {
		t.Fatalf("load content: %v", err)
	}
	return b
}
