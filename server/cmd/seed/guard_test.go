package main

import (
	"reflect"
	"testing"
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
