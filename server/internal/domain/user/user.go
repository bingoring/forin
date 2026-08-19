// Package user holds the User/Profile/AuthIdentity entities and user-facing use cases.
// Pure domain: no framework or infrastructure imports.
package user

import "time"

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
}
