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

	// OIDC client IDs (audience) per provider. Empty = provider disabled.
	GoogleClientID string
	AppleClientID  string
	KakaoClientID  string

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
		AccessTTL:                getdur("ACCESS_TTL", 15*time.Minute),
		RefreshTTL:               getdur("REFRESH_TTL", 30*24*time.Hour),
		GoogleClientID:           os.Getenv("GOOGLE_CLIENT_ID"),
		AppleClientID:            os.Getenv("APPLE_CLIENT_ID"),
		KakaoClientID:            os.Getenv("KAKAO_CLIENT_ID"),
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
