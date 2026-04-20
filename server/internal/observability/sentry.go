// Package observability wires third-party monitoring. Sentry lives here
// rather than in service/ so the learning loop stays free of SDK imports.
package observability

import (
	"time"

	"github.com/forin/server/internal/config"
	"github.com/getsentry/sentry-go"
	"go.uber.org/zap"
)

// InitSentry configures the Sentry SDK from config. When SentryDSN is
// empty (dev without credentials), the SDK still initialises in no-op
// mode so every sentry.CaptureException / sentrygin.New() call is a safe
// no-op. Returns a flush function for graceful shutdown.
func InitSentry(cfg *config.Config, log *zap.Logger) func() {
	if cfg.SentryDSN == "" {
		log.Info("sentry disabled (no DSN configured)")
		return func() {}
	}

	env := cfg.SentryEnvironment
	if env == "" {
		env = cfg.Env
	}
	if env == "" {
		env = "development"
	}

	err := sentry.Init(sentry.ClientOptions{
		Dsn:              cfg.SentryDSN,
		Environment:      env,
		Release:          cfg.SentryRelease,
		AttachStacktrace: true,
		// Sample a subset of perf traces so the free tier's 10K/month
		// performance-unit budget survives a small MVP without drops.
		TracesSampleRate: 0.05,
	})
	if err != nil {
		log.Warn("sentry init failed", zap.Error(err))
		return func() {}
	}

	log.Info("sentry enabled", zap.String("env", env))
	return func() {
		sentry.Flush(2 * time.Second)
	}
}
