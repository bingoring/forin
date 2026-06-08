// Package log provides a configured slog logger.
package log

import (
	"log/slog"
	"os"
)

// New returns a JSON slog logger; debug level outside production.
func New(env string) *slog.Logger {
	level := slog.LevelDebug
	if env == "prod" {
		level = slog.LevelInfo
	}
	return slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: level}))
}
