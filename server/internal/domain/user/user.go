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

// Profile is onboarding-derived user data.
type Profile struct {
	UserID      string `json:"userId"`
	Job         string `json:"job"`         // MVP: "nurse"
	NativeLang  string `json:"nativeLang"`  // e.g. "ko"
	Destination string `json:"destination"` // e.g. "us"
	ENLevel     string `json:"enLevel"`     // e.g. "B1"
}
