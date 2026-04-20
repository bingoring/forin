package config

import "strings"

// SupportedLocales lists every BCP-47 primary subtag enabled in this build.
// Adding a locale = append here + ship translations. No DB change.
var SupportedLocales = []string{"ko"}

// DefaultLocale is the fallback when the user has not chosen one.
const DefaultLocale = "ko"

// NormalizeLocale lowercases and strips region/script tags (ko-KR -> ko).
func NormalizeLocale(locale string) string {
	if locale == "" {
		return ""
	}
	locale = strings.ToLower(locale)
	for _, sep := range []string{"-", "_"} {
		if i := strings.Index(locale, sep); i >= 0 {
			return locale[:i]
		}
	}
	return locale
}

// IsSupported reports whether a BCP-47 locale (any case, with/without region)
// is enabled for this build.
func IsSupported(locale string) bool {
	primary := NormalizeLocale(locale)
	if primary == "" {
		return false
	}
	for _, l := range SupportedLocales {
		if l == primary {
			return true
		}
	}
	return false
}
