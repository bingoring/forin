package config

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func validConfig() *Config {
	return &Config{
		ServerPort:       "8080",
		Env:              "test",
		DatabaseDSN:      "postgres://test:test@localhost:5432/test",
		RedisAddr:        "localhost:6379",
		JWTSecret:        "this-is-a-secret-that-is-at-least-32-chars-long",
		JWTRefreshSecret: "this-is-another-secret-at-least-32-chars-long!!",
		JWTAccessExpiry:  15 * time.Minute,
		JWTRefreshExpiry: 168 * time.Hour,
	}
}

func TestValidate_ValidConfig(t *testing.T) {
	cfg := validConfig()
	assert.NoError(t, cfg.Validate())
}

func TestValidate_MissingServerPort(t *testing.T) {
	cfg := validConfig()
	cfg.ServerPort = ""
	err := cfg.Validate()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "SERVER_PORT")
}

func TestValidate_MissingDatabaseDSN(t *testing.T) {
	cfg := validConfig()
	cfg.DatabaseDSN = ""
	err := cfg.Validate()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "DATABASE_DSN")
}

func TestValidate_MissingRedisAddr(t *testing.T) {
	cfg := validConfig()
	cfg.RedisAddr = ""
	err := cfg.Validate()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "REDIS_ADDR")
}

func TestValidate_ShortJWTSecret(t *testing.T) {
	cfg := validConfig()
	cfg.JWTSecret = "too-short"
	err := cfg.Validate()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "JWT_SECRET")
}

func TestValidate_ShortJWTRefreshSecret(t *testing.T) {
	cfg := validConfig()
	cfg.JWTRefreshSecret = "too-short"
	err := cfg.Validate()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "JWT_REFRESH_SECRET")
}

func TestValidate_MultipleErrors(t *testing.T) {
	cfg := &Config{}
	err := cfg.Validate()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "SERVER_PORT")
	assert.Contains(t, err.Error(), "DATABASE_DSN")
	assert.Contains(t, err.Error(), "REDIS_ADDR")
	assert.Contains(t, err.Error(), "JWT_SECRET")
	assert.Contains(t, err.Error(), "JWT_REFRESH_SECRET")
}
