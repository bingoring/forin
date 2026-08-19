// Package i18n localizes the strings the server sends for the client to render:
// curriculum names, step names, department labels, situation tags.
//
// The design has one unusual property, and it is deliberate: **Korean is not in
// the catalogs.** The authored Korean already lives where the content lives
// (internal/curriculum/authored_*.go, cmd/gencontent's topic banks), and moving
// ~700 strings out of there into a catalog would be a large, silent, all-or-nothing
// edit across the exact files whose correctness a whole test suite was just built
// to protect. Instead every lookup carries the authored string as its fallback:
//
//	i18n.Tr(locale, c.Key, c.Name)   // Name IS the Korean
//
// So a locale with no entry renders precisely what it renders today, translations
// are purely additive, and the diff for adding Japanese touches no content file.
//
// Keys are the identifiers the content already has — a curriculum's Key
// ("본관|1F|triage"), a step's ScenarioID ("SCN-ER-00002"). No second key space to
// keep in sync, and nothing to rename when a name is reworded.
package i18n

import (
	"strings"
)

// BaseLocale is the language the authored content is written in. Entries for it
// would be dead weight: the fallback already is the authored string.
const BaseLocale = "ko"

// Supported is the set the server will honour. A request asking for anything else
// gets BaseLocale — silently, because a header the user never chose is not an error
// worth failing a request over.
var Supported = map[string]bool{"ko": true, "en": true, "ja": true, "de": true}

// catalogs holds non-Korean overrides: locale → content key → translation.
// Populated by the per-locale files in this package (curriculum_en.go, …).
var catalogs = map[string]map[string]string{}

// register lets each locale file add its own map at init. Split per file so adding
// a language is a new file rather than an edit inside a shared literal.
func register(locale string, m map[string]string) {
	if existing, ok := catalogs[locale]; ok {
		for k, v := range m {
			existing[k] = v
		}
		return
	}
	catalogs[locale] = m
}

// Tr returns the translation of key in locale, or fallback when there is none.
//
// fallback is the authored Korean, so a missing entry degrades to today's output
// rather than to an empty label — the same rule the client's t() follows.
func Tr(locale, key, fallback string) string {
	if locale == BaseLocale || locale == "" {
		return fallback
	}
	if m, ok := catalogs[locale]; ok {
		if v, ok := m[key]; ok && v != "" {
			return v
		}
	}
	return fallback
}

// Resolve picks the locale for a request: the profile's saved choice first, then
// Accept-Language, then Korean.
//
// The profile wins because it is what the user set in the app; the header only
// covers the screens that exist before there is a profile to read (login, the
// onboarding wizard). Reversing that order would let a phone's system language
// override a setting the user deliberately changed.
func Resolve(profileLang, acceptLanguage string) string {
	if l := normalize(profileLang); l != "" {
		return l
	}
	if l := fromAcceptLanguage(acceptLanguage); l != "" {
		return l
	}
	return BaseLocale
}

// normalize reduces a tag to a supported base language ("en-US" → "en"), or "".
func normalize(tag string) string {
	if tag == "" {
		return ""
	}
	base := strings.ToLower(tag)
	if i := strings.IndexAny(base, "-_"); i > 0 {
		base = base[:i]
	}
	if Supported[base] {
		return base
	}
	return ""
}

// fromAcceptLanguage walks the header in q-order and returns the first supported
// language. Weights are compared as strings only for ordering by position, which is
// enough here: clients send their own preference first, and honouring a partial
// order is better than parsing floats and failing on a malformed q.
func fromAcceptLanguage(header string) string {
	for _, part := range strings.Split(header, ",") {
		tag := part
		if i := strings.IndexByte(tag, ';'); i >= 0 {
			tag = tag[:i] // drop ";q=0.8"
		}
		if l := normalize(strings.TrimSpace(tag)); l != "" {
			return l
		}
	}
	return ""
}

// Locales lists the supported locales in a stable order, base first. Used by tests
// and by the coverage report.
func Locales() []string { return []string{"ko", "en", "ja", "de"} }

// Coverage reports how many of the given keys a locale translates. The settings
// screen shows the client-side equivalent; this is the server half, and it exists so
// "how much is translated" is measured rather than claimed.
func Coverage(locale string, keys []string) (translated int) {
	m := catalogs[locale]
	for _, k := range keys {
		if v, ok := m[k]; ok && v != "" {
			translated++
		}
	}
	return translated
}
