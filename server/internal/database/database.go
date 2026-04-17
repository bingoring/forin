package database

import (
	"fmt"
	"time"

	"github.com/forin/server/internal/config"
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

// New opens a GORM PostgreSQL connection and configures the connection pool.
func New(cfg *config.Config, log *zap.Logger) (*gorm.DB, error) {
	logLevel := gormlogger.Silent
	if cfg.Env != "production" {
		logLevel = gormlogger.Info
	}

	db, err := gorm.Open(postgres.Open(cfg.DatabaseDSN), &gorm.Config{
		Logger: gormlogger.Default.LogMode(logLevel),
	})
	if err != nil {
		return nil, fmt.Errorf("open database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("get underlying sql.DB: %w", err)
	}

	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("ping database: %w", err)
	}

	log.Info("database connected", zap.String("dsn", maskDSN(cfg.DatabaseDSN)))
	return db, nil
}

// Close gracefully closes the database connection pool.
func Close(db *gorm.DB) error {
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

// maskDSN hides password from DSN for safe logging.
func maskDSN(dsn string) string {
	if len(dsn) > 40 {
		return dsn[:40] + "..."
	}
	return dsn
}
