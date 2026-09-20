package i18n

import (
	"strings"
	"testing"
)

// liveKeys are the keys the server actually looks up from this catalog: the four
// situation tags, the milestone name, and `Building|Label` for a floor heading.
//
// curriculum_en.go also carries 89 three-part chapter keys (`본관|1F|prenatal`).
// Nothing builds those any more — they outlived the campus screen the journey map
// replaced — so ja/de deliberately do not carry them and this test must not demand
// them. A key with two bars is a chapter key; that is the whole rule.
//
// catalogs[locale] is ONE merged map per locale — register() folds every file's
// entries into it — so theme keys and scenario ids sit in here too. Selecting by
// key SHAPE is what keeps this test about this catalog: a floor heading has
// exactly one bar, and the five named keys are listed outright.
func liveKeys(m map[string]string) map[string]string {
	named := map[string]bool{
		"tag.cleared": true, "tag.attempted": true, "tag.urgent": true,
		"tag.new": true, "milestone.name": true,
	}
	out := map[string]string{}
	for k, v := range m {
		if named[k] || strings.Count(k, "|") == 1 {
			out[k] = v
		}
	}
	return out
}

// A locale that is missing a key falls back to the authored Korean, silently. That
// is right for a key nobody translated yet and wrong for a catalog that claims to
// cover this surface — the screen shows Korean to a German reader and nothing fails.
// So the three catalogs must agree on the live key set, exactly.
func TestCurriculumLocalesCoverTheSameLiveKeys(t *testing.T) {
	en := liveKeys(catalogs["en"])
	for _, loc := range []string{"ja", "de"} {
		got := liveKeys(catalogs[loc])
		for k := range en {
			if _, ok := got[k]; !ok {
				t.Errorf("%s is missing %q — that floor heading would render in Korean", loc, k)
			}
		}
		for k := range got {
			if _, ok := en[k]; !ok {
				t.Errorf("%s carries %q, which en does not — one of the two is wrong", loc, k)
			}
		}
	}
}

// An entry that is present but empty is worse than a missing one: Tr treats "" as
// absent and falls back, so it reads as covered while behaving as a gap.
func TestCurriculumLocaleValuesAreNotEmpty(t *testing.T) {
	for _, loc := range []string{"ja", "de"} {
		for k, v := range liveKeys(catalogs[loc]) {
			if strings.TrimSpace(v) == "" {
				t.Errorf("%s[%q] is empty", loc, k)
			}
		}
	}
}

// A value copied from another locale is the tell of a half-finished catalog. The
// floor headings are the ones worth checking: ja and de must not simply repeat the
// English line, and neither may repeat the other's.
func TestCurriculumLocalesDoNotCopyEachOther(t *testing.T) {
	en, ja, de := liveKeys(catalogs["en"]), liveKeys(catalogs["ja"]), liveKeys(catalogs["de"])
	for k := range en {
		if ja[k] == en[k] {
			t.Errorf("ja[%q] is the English string verbatim: %q", k, ja[k])
		}
		if de[k] == en[k] {
			t.Errorf("de[%q] is the English string verbatim: %q", k, de[k])
		}
		if ja[k] == de[k] {
			t.Errorf("ja and de give %q the same value: %q", k, ja[k])
		}
	}
}

// The point of all of the above: Tr must actually answer in the asked-for language.
// Without this, every test here could pass over catalogs nothing ever reads.
func TestTrAnswersInJapaneseAndGerman(t *testing.T) {
	const ko = "본관 1F 응급의료센터"
	if got := Tr("ja", "본관|1F", ko); got != "本館1F・救急センター" {
		t.Errorf("ja floor heading: got %q", got)
	}
	if got := Tr("de", "본관|1F", ko); got != "Haupthaus 1F · Notaufnahme" {
		t.Errorf("de floor heading: got %q", got)
	}
	if got := Tr("ja", "milestone.name", "구간 시험"); got != "区間テスト" {
		t.Errorf("ja milestone: got %q", got)
	}
	if got := Tr("de", "milestone.name", "구간 시험"); got != "Abschnittsprüfung" {
		t.Errorf("de milestone: got %q", got)
	}
	// An untranslated key still degrades to the authored Korean rather than to "".
	if got := Tr("ja", "no.such.key", ko); got != ko {
		t.Errorf("missing key must fall back to the authored Korean: got %q", got)
	}
}
