// Package config loads and validates server configuration from the environment.
package config

import (
	"fmt"
	"os"
	"strings"
	"time"
)

type Config struct {
	Env         string // dev | staging | prod
	Port        string
	DatabaseURL string
	RedisURL    string

	JWTSigningKey []byte
	JWTIssuer     string
	AccessTTL     time.Duration
	RefreshTTL    time.Duration

	// DevAuthSecret gates POST /auth/dev outside local development. Empty in
	// production, so the route is not registered there at all.
	DevAuthSecret string

	// OIDC client IDs (accepted audiences) per provider; comma-separated in the
	// environment. Empty = provider disabled. A provider needs more than one when
	// it issues a distinct client ID per platform — Google does (iOS/Android/Web),
	// and the id_token's `aud` is whichever client requested it.
	GoogleClientIDs []string
	AppleClientIDs  []string
	KakaoClientIDs  []string

	// AI. Provider is selectable (LLMPort adapters are swappable). LLMProvider:
	// "anthropic" | "openai" | "" (auto: openai if its key is set, else anthropic).
	LLMProvider              string
	AnthropicKey             string
	OpenAIKey                string
	AnthropicDialogueModel   string
	AnthropicCorrectionModel string
	OpenAIDialogueModel      string
	OpenAICorrectionModel    string

	// Azure Speech (pronunciation assessment). Empty = pronunciation endpoint disabled.
	AzureSpeechKey    string
	AzureSpeechRegion string
}

// ResolveProvider returns the effective LLM provider (explicit, else auto-detected).
func (c *Config) ResolveProvider() string {
	if c.LLMProvider != "" {
		return c.LLMProvider
	}
	if c.OpenAIKey != "" {
		return "openai"
	}
	return "anthropic"
}

// Load reads configuration from environment variables and validates required fields.
func Load() (*Config, error) {
	c := &Config{
		Env:                      getenv("ENV", "dev"),
		Port:                     getenv("PORT", "8080"),
		DatabaseURL:              os.Getenv("DATABASE_URL"),
		RedisURL:                 os.Getenv("REDIS_URL"),
		JWTSigningKey:            []byte(os.Getenv("JWT_SIGNING_KEY")),
		JWTIssuer:                getenv("JWT_ISSUER", "forin"),
		// Trimmed deliberately. The comparison against the X-Dev-Auth header is
		// exact, and a secret that arrives with a trailing newline fails it on
		// length while looking correct everywhere a human inspects it. That is
		// not hypothetical: the first staging smoke failed this way, because
		// `openssl rand -hex 32 | gcloud secrets versions add` stored 65 bytes
		// while the caller's `$(gcloud secrets versions access)` stripped the
		// newline down to 64. The generator is fixed, but pasting a value into
		// the console can reintroduce it, so tolerate surrounding whitespace here.
		DevAuthSecret:            strings.TrimSpace(os.Getenv("DEV_AUTH_SECRET")),
		AccessTTL:                getdur("ACCESS_TTL", 15*time.Minute),
		RefreshTTL:               getdur("REFRESH_TTL", 30*24*time.Hour),
		GoogleClientIDs:          splitList(os.Getenv("GOOGLE_CLIENT_ID")),
		AppleClientIDs:           splitList(os.Getenv("APPLE_CLIENT_ID")),
		KakaoClientIDs:           splitList(os.Getenv("KAKAO_CLIENT_ID")),
		LLMProvider:              os.Getenv("LLM_PROVIDER"),
		AnthropicKey:             firstNonEmpty(os.Getenv("ANTHROPIC_API_KEY"), os.Getenv("ANTHROPIC_KEY")),
		OpenAIKey:                firstNonEmpty(os.Getenv("OPENAI_API_KEY"), os.Getenv("OPENAI_KEY")),
		AnthropicDialogueModel:   getenv("ANTHROPIC_DIALOGUE_MODEL", "claude-sonnet-4-6"),
		AnthropicCorrectionModel: getenv("ANTHROPIC_CORRECTION_MODEL", "claude-haiku-4-5-20251001"),
		OpenAIDialogueModel:      getenv("OPENAI_DIALOGUE_MODEL", "gpt-4o"),
		OpenAICorrectionModel:    getenv("OPENAI_CORRECTION_MODEL", "gpt-4o-mini"),
		AzureSpeechKey:           firstNonEmpty(os.Getenv("AZURE_SPEECH_KEY"), os.Getenv("AZURE_SPEECH_REGION_KEY")),
		AzureSpeechRegion:        os.Getenv("AZURE_SPEECH_REGION"),
	}

	var missing []string
	if c.DatabaseURL == "" {
		missing = append(missing, "DATABASE_URL")
	}
	if c.RedisURL == "" {
		missing = append(missing, "REDIS_URL")
	}
	if len(c.JWTSigningKey) < 16 {
		missing = append(missing, "JWT_SIGNING_KEY (>=16 bytes)")
	}
	if len(missing) > 0 {
		return nil, fmt.Errorf("missing/invalid config: %s", strings.Join(missing, ", "))
	}
	return c, nil
}

func firstNonEmpty(vals ...string) string {
	for _, v := range vals {
		if v != "" {
			return v
		}
	}
	return ""
}

// splitList parses a comma-separated env value into trimmed, non-empty entries.
func splitList(v string) []string {
	var out []string
	for _, part := range strings.Split(v, ",") {
		if p := strings.TrimSpace(part); p != "" {
			out = append(out, p)
		}
	}
	return out
}

func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

func getdur(k string, def time.Duration) time.Duration {
	if v := os.Getenv(k); v != "" {
		if d, err := time.ParseDuration(v); err == nil {
			return d
		}
	}
	return def
}
