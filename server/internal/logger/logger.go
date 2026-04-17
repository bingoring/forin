package logger

import (
	"sync"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	globalLogger *zap.Logger
	once         sync.Once
)

// Init creates a zap.Logger configured for the given environment.
// "production" uses JSON encoding at Info level; anything else uses console encoding at Debug level.
func Init(env string) *zap.Logger {
	once.Do(func() {
		var cfg zap.Config

		if env == "production" {
			cfg = zap.NewProductionConfig()
			cfg.EncoderConfig.TimeKey = "ts"
			cfg.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
		} else {
			cfg = zap.NewDevelopmentConfig()
			cfg.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
		}

		logger, err := cfg.Build(zap.Fields(zap.String("service", "forin-api")))
		if err != nil {
			panic("failed to initialize logger: " + err.Error())
		}
		globalLogger = logger
	})

	return globalLogger
}

// L returns the package-level logger. Must call Init first.
func L() *zap.Logger {
	if globalLogger == nil {
		return zap.NewNop()
	}
	return globalLogger
}

// Sync flushes any buffered log entries.
func Sync() {
	if globalLogger != nil {
		_ = globalLogger.Sync()
	}
}
