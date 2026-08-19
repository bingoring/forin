package i18n

import "testing"

func TestResolvePrefersProfileOverHeader(t *testing.T) {
	// The setting the user made in the app beats the phone's system language.
	// Reversed, a German phone would override someone who deliberately chose Korean.
	if got := Resolve("ko", "de-DE,de;q=0.9"); got != "ko" {
		t.Errorf("profile should win, got %q", got)
	}
	// No profile yet (login, onboarding) → the header is all there is.
	if got := Resolve("", "de-DE,de;q=0.9"); got != "de" {
		t.Errorf("header should apply, got %q", got)
	}
	// Neither → authored Korean, never an empty locale.
	if got := Resolve("", ""); got != BaseLocale {
		t.Errorf("want %q, got %q", BaseLocale, got)
	}
}

func TestResolveIgnoresUnsupported(t *testing.T) {
	// An unsupported language is not an error: the user never chose the header.
	for _, in := range []string{"pt-BR", "zz", "  ", "*"} {
		if got := Resolve("", in); got != BaseLocale {
			t.Errorf("%q → %q, want %q", in, got, BaseLocale)
		}
	}
	// A supported language later in the list still counts.
	if got := Resolve("", "pt-BR,en;q=0.8"); got != "en" {
		t.Errorf("want en, got %q", got)
	}
}

func TestTrFallsBackToAuthoredString(t *testing.T) {
	const authored = "접수와 트리아지"
	// Base locale never consults a catalog — the authored string IS the Korean.
	if got := Tr("ko", "본관|1F|triage", authored); got != authored {
		t.Errorf("ko should pass through, got %q", got)
	}
	// A key nobody translated degrades to today's output, not to "".
	if got := Tr("ja", "no.such.key", authored); got != authored {
		t.Errorf("missing key should fall back, got %q", got)
	}
	// And a translated key actually changes.
	if got := Tr("en", "본관|1F|triage", authored); got == authored || got == "" {
		t.Errorf("en should translate, got %q", got)
	}
}

// The catalog must not silently hold empty strings: Tr treats "" as absent, so an
// empty entry looks translated in a diff and behaves as untranslated at runtime.
func TestNoEmptyEntries(t *testing.T) {
	for loc, m := range catalogs {
		for k, v := range m {
			if v == "" {
				t.Errorf("%s: %q is empty", loc, k)
			}
		}
	}
}

// The base locale has no catalog by design. An entry for it would be dead weight
// that drifts from the authored string it duplicates.
func TestBaseLocaleHasNoCatalog(t *testing.T) {
	if m, ok := catalogs[BaseLocale]; ok && len(m) > 0 {
		t.Errorf("%s should have no catalog, has %d entries", BaseLocale, len(m))
	}
}
