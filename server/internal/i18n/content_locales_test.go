package i18n

import (
	"strings"
	"testing"
)

// contentKeys picks the content ids out of a locale's merged catalog. catalogs[locale] is
// ONE map per locale — register() folds every file's entries into it — so tag./milestone.
// labels and floor headings (curriculum_*.go) and theme names (theme_*.go) all sit in here
// too. A content id has a recognizable SHAPE: it starts with "SCN-" or "EVT-". That is the
// whole rule, mirroring liveKeys in curriculum_locales_test.go.
func contentKeys(m map[string]string) map[string]string {
	out := map[string]string{}
	for k, v := range m {
		if strings.HasPrefix(k, "SCN-") || strings.HasPrefix(k, "EVT-") {
			out[k] = v
		}
	}
	return out
}

// A locale missing a content key falls back to the authored Korean, silently. That is
// correct for a key nobody has translated yet and wrong for a catalog that claims to cover
// this surface. So en/ja/de must agree on the content key set, exactly.
func TestContentLocalesCoverTheSameKeys(t *testing.T) {
	en := contentKeys(catalogs["en"])
	if len(en) < 300 {
		t.Fatalf("expected 300+ content keys in en, got %d", len(en))
	}
	for _, loc := range []string{"ja", "de"} {
		got := contentKeys(catalogs[loc])
		for k := range en {
			if _, ok := got[k]; !ok {
				t.Errorf("%s is missing %q — that title would render in Korean", loc, k)
			}
		}
		for k := range got {
			if _, ok := en[k]; !ok {
				t.Errorf("%s carries %q, which en does not — one of the two is wrong", loc, k)
			}
		}
	}
}

// An entry present but empty is worse than a missing one: Tr treats "" as absent and falls
// back, so it reads as covered while behaving as a gap.
func TestContentLocaleValuesAreNotEmpty(t *testing.T) {
	for _, loc := range []string{"ja", "de"} {
		for k, v := range contentKeys(catalogs[loc]) {
			if strings.TrimSpace(v) == "" {
				t.Errorf("%s[%q] is empty", loc, k)
			}
		}
	}
}

// A half-translated title leaves Korean characters sitting inside an otherwise-ja/de
// string — the app never notices because Tr only checks for "", not for Hangul.
func TestContentLocaleValuesHaveNoHangul(t *testing.T) {
	for _, loc := range []string{"ja", "de"} {
		for k, v := range contentKeys(catalogs[loc]) {
			for _, r := range v {
				if r >= 0xAC00 && r <= 0xD7A3 {
					t.Errorf("%s[%q] still contains Korean: %q", loc, k, v)
				}
			}
		}
	}
}

// A value copied verbatim from English is the tell of an untranslated entry that was only
// pasted into place to satisfy the key-coverage check.
func TestContentLocalesDoNotCopyEnglish(t *testing.T) {
	en := contentKeys(catalogs["en"])
	for _, loc := range []string{"ja", "de"} {
		got := contentKeys(catalogs[loc])
		for k, v := range en {
			if got[k] == v {
				t.Errorf("%s[%q] is the English string verbatim: %q", loc, k, got[k])
			}
		}
	}
}

// The point of all of the above: Tr must actually answer in the asked-for language for
// content ids, not just for the curriculum labels TestTrAnswersInJapaneseAndGerman covers.
func TestTrAnswersInJapaneseAndGermanForContent(t *testing.T) {
	const ko = "흉통 환자 트리아지"
	if got := Tr("ja", "SCN-ER-00001", ko); got != "胸痛患者のトリアージ" {
		t.Errorf("ja SCN-ER-00001 = %q", got)
	}
	if got := Tr("de", "SCN-ER-00001", ko); got != "Triage bei Brustschmerz" {
		t.Errorf("de SCN-ER-00001 = %q", got)
	}
	const koEvt = "STEMI 인지·코드 STEMI"
	if got := Tr("ja", "EVT-ER-00002", koEvt); !strings.Contains(got, "STEMI") {
		t.Errorf("ja EVT-ER-00002 not localized: %q", got)
	}
	if got := Tr("de", "EVT-ER-00002", koEvt); !strings.Contains(got, "STEMI") {
		t.Errorf("de EVT-ER-00002 not localized: %q", got)
	}
}
