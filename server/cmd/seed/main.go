// Command seed loads authored content from CONTENT_DIR into Postgres after
// validating it (schema, referential integrity, enums). Run as an ops/CI step.
package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/bingoring/forin/server/internal/adapters/contentfile"
	"github.com/bingoring/forin/server/internal/adapters/postgres"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, "seed:", err)
		os.Exit(1)
	}
}

func run() error {
	dir := os.Getenv("CONTENT_DIR")
	if dir == "" {
		dir = "content"
	}
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return fmt.Errorf("DATABASE_URL is required")
	}

	bundle, err := contentfile.Load(dir)
	if err != nil {
		return fmt.Errorf("load %s: %w", dir, err)
	}
	if errs := bundle.Validate(); len(errs) > 0 {
		fmt.Fprintf(os.Stderr, "content validation failed (%d):\n", len(errs))
		for _, e := range errs {
			fmt.Fprintln(os.Stderr, "  -", e)
		}
		return fmt.Errorf("aborting seed")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	pool, err := postgres.NewPool(ctx, dbURL)
	if err != nil {
		return err
	}
	defer pool.Close()

	if err := postgres.NewContentRepo(pool).Seed(ctx, bundle); err != nil {
		return err
	}
	fmt.Printf("seeded content %s: %d departments, %d events, %d scenarios, %d quizzes, %d phrases\n",
		bundle.Manifest.ContentVersion, len(bundle.Departments), len(bundle.Events),
		len(bundle.Scenarios), len(bundle.Quizzes), len(bundle.Phrases))
	return nil
}
