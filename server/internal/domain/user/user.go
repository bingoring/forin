// Package user holds the User/Profile/AuthIdentity entities and user-facing use cases.
// Pure domain: no framework or infrastructure imports.
package user

import (
	"strings"
	"time"
	"unicode"
	"unicode/utf8"
)

// Provider is a social login provider. Code-side allowed set (no DB CHECK) — extensible.
type Provider string

const (
	ProviderGoogle Provider = "google"
	ProviderApple  Provider = "apple"
	ProviderKakao  Provider = "kakao"
)

// AllowedProviders is the canonical set; validate against this rather than a DB constraint.
var AllowedProviders = map[Provider]bool{
	ProviderGoogle: true,
	ProviderApple:  true,
	ProviderKakao:  true,
}

func (p Provider) Valid() bool { return AllowedProviders[p] }

// User is the root account entity.
type User struct {
	ID        string    `json:"id"` // UUID
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
}

// AuthIdentity links a User to a provider subject (one user may have several).
type AuthIdentity struct {
	UserID    string   `json:"userId"`
	Provider  Provider `json:"provider"`
	SubjectID string   `json:"subjectId"`
	Email     string   `json:"email,omitempty"`
}

// Profile is onboarding-derived user data. Language is NOT English-specific:
// NativeLang is the user's language, TargetLang is the language being learned.
type Profile struct {
	UserID      string `json:"userId"`
	Job         string `json:"job"`         // MVP: "nurse"
	NativeLang  string `json:"nativeLang"`  // user's language, e.g. "ko"
	TargetLang  string `json:"targetLang"`  // language being learned, e.g. "en", "de"
	Destination string `json:"destination"` // e.g. "us"
	// UILang is the language the SCREENS are drawn in, which is not NativeLang:
	// NativeLang tells the AI which language to explain corrections in, so a user
	// who wants an English interface must not thereby get English explanations.
	// "" means follow NativeLang.
	UILang        string `json:"uiLang,omitempty"`
	TargetLevel   string `json:"targetLevel"`   // level in TargetLang, e.g. "B1"
	Onboarded     bool   `json:"onboarded"`     // completed the onboarding wizard
	EquippedTitle string `json:"equippedTitle"` // equipped career title id (may be empty)
	// DisplayName is what other people see. "" means the learner has not chosen one,
	// and callers fall back to a short form of the user id — see ShortID.
	DisplayName string `json:"displayName"`
}

// MaxDisplayNameLen is the limit in RUNES, not bytes: "김민아" is three characters
// and nine bytes, and a byte limit would let a Latin name be three times longer
// than a Korean one for no reason a user could see.
const MaxDisplayNameLen = 20

// NormalizeDisplayName cleans a submitted name and reports whether it is usable.
//
// "" is valid and means "clear it" — the learner is allowed to take their name back
// off, and the short-id fallback covers them. Everything else must survive being
// drawn in one line inside a list row: no line breaks, no control characters, no
// runs of whitespace, and no name made only of spaces.
func NormalizeDisplayName(raw string) (string, bool) {
	// Collapse every kind of whitespace (including the ideographic space that a
	// Korean IME produces) into single ASCII spaces, then trim.
	name := strings.Join(strings.Fields(raw), " ")
	if name == "" {
		// Distinguishes "clear my name" from "I sent you a name of only spaces":
		// both normalize to "", and both are answered the same way — cleared.
		return "", true
	}
	for _, r := range name {
		// Fields already removed the whitespace controls; what is left here are the
		// invisible ones (zero-width joiners, RTL overrides, NULs) that let a name
		// impersonate another or break the row it is drawn in.
		if unicode.IsControl(r) || !unicode.IsGraphic(r) {
			return "", false
		}
	}
	if utf8.RuneCountInString(name) > MaxDisplayNameLen {
		return "", false
	}
	return name, true
}

// ShortID is the name to show for someone who has not chosen one: the leading six
// characters of their id, uppercased. Stable, unique enough to tell two strangers
// apart, and obviously not a real name — which is the point, because a plausible
// fake ("Nurse 1") would leave the learner thinking that WAS their colleague's name.
func ShortID(userID string) string {
	// Uppercased on BOTH paths. The version this replaced only uppercased ids of six
	// characters or more and returned anything shorter untouched, so two users could
	// be labelled in two different cases by the same function.
	if len(userID) >= 6 {
		return strings.ToUpper(userID[:6])
	}
	return strings.ToUpper(userID)
}

// NameOr returns the chosen name, or the short-id fallback.
func NameOr(name, userID string) string {
	if name != "" {
		return name
	}
	return ShortID(userID)
}
