package i18n

import (
	"strings"
	"testing"
)

// themeKeys picks this catalog's entries out of the merged per-locale map.
//
// catalogs[locale] is ONE map per locale — register() folds every file's entries
// into it — so scenario ids, floor headings and theme keys all sit together. A
// theme key is lower-case, carries no bar, and is not one of the dotted label keys;
// that shape is what keeps this test about themes.
func themeKeys(m map[string]string) map[string]string {
	out := map[string]string{}
	for k, v := range m {
		if strings.ContainsAny(k, "|.") || strings.HasPrefix(k, "SCN-") || strings.HasPrefix(k, "EVT-") {
			continue
		}
		out[k] = v
	}
	return out
}

// A locale missing a theme falls back to the authored Korean, silently. For a
// language that claims to cover the journey map that is not a graceful degrade: the
// learner sees a Korean station name sitting among translated ones, and nothing
// fails to tell anyone. So the three catalogs must agree on the key set exactly.
func TestThemeLocalesCoverTheSameKeys(t *testing.T) {
	en := themeKeys(catalogs["en"])
	if len(en) == 0 {
		t.Fatal("no theme keys found in the en catalog — the shape rule above is wrong")
	}
	for _, loc := range []string{"ja", "de"} {
		got := themeKeys(catalogs[loc])
		for k := range en {
			if _, ok := got[k]; !ok {
				t.Errorf("%s is missing theme %q — that station would render in Korean", loc, k)
			}
		}
		for k := range got {
			if _, ok := en[k]; !ok {
				t.Errorf("%s carries theme %q, which en does not — one of the two is wrong", loc, k)
			}
		}
	}
}

// Hangul left in a ja/de value is a half-finished entry wearing a finished one's
// clothes: the key is present, so the coverage test above passes, and the screen
// still shows Korean.
func TestThemeLocaleValuesCarryNoHangul(t *testing.T) {
	for _, loc := range []string{"ja", "de"} {
		for k, v := range themeKeys(catalogs[loc]) {
			if strings.TrimSpace(v) == "" {
				t.Errorf("%s[%q] is empty", loc, k)
				continue
			}
			for _, r := range v {
				if r >= '가' && r <= '힣' {
					t.Errorf("%s[%q] still has Korean in it: %q", loc, k, v)
					break
				}
			}
		}
	}
}

// Copying the English across is the other way a catalog looks complete without
// being it.
func TestThemeLocalesDoNotCopyEnglish(t *testing.T) {
	en, ja, de := themeKeys(catalogs["en"]), themeKeys(catalogs["ja"]), themeKeys(catalogs["de"])
	var jaSame, deSame int
	for k := range en {
		if ja[k] == en[k] {
			jaSame++
		}
		if de[k] == en[k] {
			deSame++
		}
	}
	// A German name can legitimately match the English one — "Sepsis" is "Sepsis" —
	// so this counts rather than forbids. Wholesale copying is the thing to catch.
	if jaSame > 0 {
		t.Errorf("ja repeats the English string for %d themes; Japanese should never match", jaSame)
	}
	if deSame > len(en)/20 {
		t.Errorf("de repeats the English string for %d of %d themes — that is copying, not translating", deSame, len(en))
	}
}

// The point of all of the above: Tr must answer in the asked-for language for a key
// the journey map actually renders.
func TestTrAnswersThemesInJapaneseAndGerman(t *testing.T) {
	const key, ko = "core-handoff-er", "인계·SBAR"
	ja, de := Tr("ja", key, ko), Tr("de", key, ko)
	if ja == ko || de == ko {
		t.Fatalf("a translated theme must not fall back: ja=%q de=%q", ja, de)
	}
	if ja == de {
		t.Errorf("ja and de gave the same string for %q: %q", key, ja)
	}
	if got := Tr("ja", "no-such-theme", ko); got != ko {
		t.Errorf("an untranslated theme must fall back to the authored Korean: got %q", got)
	}
}
