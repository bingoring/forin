package i18n

import (
	"strings"
	"testing"
)

func TestContentEnglishTitles(t *testing.T) {
	// A known scenario title translates in English and falls back to the authored Korean
	// in the base locale and in a language with no catalog yet.
	if got := Tr("en", "SCN-ER-00001", "흉통 환자 트리아지"); got != "Chest-pain triage" {
		t.Fatalf("en title = %q", got)
	}
	if got := Tr("ko", "SCN-ER-00001", "흉통 환자 트리아지"); got != "흉통 환자 트리아지" {
		t.Fatalf("ko must fall back to the authored title, got %q", got)
	}
	if got := Tr("ja", "SCN-ER-00001", "흉통 환자 트리아지"); got != "흉통 환자 트리아지" {
		t.Fatalf("ja has no content catalog yet → Korean fallback, got %q", got)
	}
	// An event title is localized too.
	if got := Tr("en", "EVT-ER-00002", "STEMI 인지·코드 STEMI"); !strings.Contains(got, "STEMI") || strings.ContainsRune(got, '인') {
		t.Fatalf("en event title not localized: %q", got)
	}
}

func TestContentEnglishCoverage(t *testing.T) {
	// Every SCN-*/EVT-* entry in the en catalog is non-empty and free of Hangul (a
	// half-translated title with Korean left in it is the bug this guards).
	en := catalogs["en"]
	n := 0
	for k, v := range en {
		if !strings.HasPrefix(k, "SCN-") && !strings.HasPrefix(k, "EVT-") {
			continue
		}
		n++
		if strings.TrimSpace(v) == "" {
			t.Fatalf("%s has an empty English title", k)
		}
		for _, r := range v {
			if r >= 0xAC00 && r <= 0xD7A3 {
				t.Fatalf("%s still contains Korean: %q", k, v)
			}
		}
	}
	if n < 300 {
		t.Fatalf("expected 300+ content titles, got %d", n)
	}
}
