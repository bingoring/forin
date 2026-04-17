package testutil

import (
	"fmt"
	"os"
	"testing"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

// Default DSN for the docker-compose development database.
const defaultTestDSN = "host=localhost user=forin password=forin dbname=forin port=5432 sslmode=disable"

// NewTestDB creates a GORM connection for integration tests.
// Uses DATABASE_DSN env var if set, otherwise falls back to the docker-compose default.
// Skips the test if the database is unreachable.
func NewTestDB(t *testing.T) *gorm.DB {
	t.Helper()

	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		dsn = defaultTestDSN
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: gormlogger.Default.LogMode(gormlogger.Silent),
	})
	if err != nil {
		t.Skipf("cannot connect to test database, skipping integration test: %v", err)
	}

	// Verify the connection is actually usable
	sqlDB, err := db.DB()
	if err != nil {
		t.Skipf("cannot get sql.DB, skipping: %v", err)
	}
	if err := sqlDB.Ping(); err != nil {
		t.Skipf("cannot ping test database, skipping: %v", err)
	}

	return db
}

// TxDB returns a GORM session wrapped in a transaction.
// The transaction is rolled back when the test finishes, leaving the DB clean.
func TxDB(t *testing.T, db *gorm.DB) *gorm.DB {
	t.Helper()

	tx := db.Begin()
	if tx.Error != nil {
		t.Fatalf("failed to begin transaction: %v", tx.Error)
	}

	t.Cleanup(func() {
		tx.Rollback()
	})

	return tx
}

// CleanupUser removes a user by email for tests that can't use transactions.
func CleanupUser(db *gorm.DB, email string) {
	db.Exec("DELETE FROM user_oauth_providers WHERE user_id IN (SELECT id FROM users WHERE email = ?)", email)
	db.Exec(fmt.Sprintf("DELETE FROM users WHERE email = '%s'", email))
}
