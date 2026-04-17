package config

import (
	"fmt"
	"strings"
)

// Validate checks that all required configuration values are present.
func (c *Config) Validate() error {
	var missing []string

	if c.ServerPort == "" {
		missing = append(missing, "SERVER_PORT")
	}
	if c.DatabaseDSN == "" {
		missing = append(missing, "DATABASE_DSN")
	}
	if c.RedisAddr == "" {
		missing = append(missing, "REDIS_ADDR")
	}
	if len(c.JWTSecret) < 32 {
		missing = append(missing, "JWT_SECRET (must be at least 32 characters)")
	}
	if len(c.JWTRefreshSecret) < 32 {
		missing = append(missing, "JWT_REFRESH_SECRET (must be at least 32 characters)")
	}

	if len(missing) > 0 {
		return fmt.Errorf("missing or invalid configuration: %s", strings.Join(missing, ", "))
	}
	return nil
}
