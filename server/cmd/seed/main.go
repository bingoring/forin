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
	"github.com/bingoring/forin/server/internal/curriculum"
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

	// One timeout covers pool creation, the guard query, and Seed() below.
	// Seed() runs its DELETE+INSERT inside a single transaction with
	// row-by-row INSERTs — scenarios (~3200) + quizzes (~993) + events (~243)
	// + phrases + interiors add up to 5,000+ round trips. That passed locally
	// against a same-host Postgres in well under 30s, but against Cloud SQL
	// over the Cloud SQL connector's unix socket, even 2-5ms per statement is
	// 10-25s on its own, before pool creation and the guard query. 10 minutes
	// matches Cloud Run Job's default task timeout (600s), so no Terraform
	// change is needed to make use of it. The real fix is batching inserts
	// via CopyFrom, but that's a separate change.
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer cancel()
	pool, err := postgres.NewPool(ctx, dbURL)
	if err != nil {
		return err
	}
	defer pool.Close()

	// Seed replaces content wholesale (DELETE then INSERT in one transaction).
	// Learner progress survives — scenario_id columns carry no foreign key — but
	// dropping an id leaves those rows pointing at nothing. So refuse a bundle
	// that would remove anything the curriculum or durable learner state still
	// references.
	have := make(map[string]bool, len(bundle.Scenarios)+len(bundle.Quizzes))
	for _, s := range bundle.Scenarios {
		have[s.ID] = true
	}
	for _, q := range bundle.Quizzes {
		have[q.ID] = true
	}
	referenced := map[string]bool{}
	for _, id := range curriculum.ReferencedIDs() {
		referenced[id] = true
	}
	inUse, err := referencedInDB(ctx, pool)
	if err != nil {
		return fmt.Errorf("collect referenced ids: %w", err)
	}
	for id := range inUse {
		referenced[id] = true
	}
	if missing := missingIDs(have, referenced); len(missing) > 0 {
		if os.Getenv("SEED_ALLOW_REMOVAL") != "1" {
			fmt.Fprintf(os.Stderr, "seed would remove %d referenced id(s):\n", len(missing))
			for _, id := range missing {
				fmt.Fprintln(os.Stderr, "  -", id)
			}
			return fmt.Errorf("aborting: content shrank; set SEED_ALLOW_REMOVAL=1 to retire content on purpose")
		}
		fmt.Fprintf(os.Stderr, "seed: SEED_ALLOW_REMOVAL=1 — removing %d referenced id(s) anyway\n", len(missing))
	}

	if err := postgres.NewContentRepo(pool).Seed(ctx, bundle); err != nil {
		return err
	}
	fmt.Printf("seeded content %s: %d departments, %d events, %d scenarios, %d quizzes, %d phrases\n",
		bundle.Manifest.ContentVersion, len(bundle.Departments), len(bundle.Events),
		len(bundle.Scenarios), len(bundle.Quizzes), len(bundle.Phrases))
	return nil
}
