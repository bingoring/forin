// Command migrate applies the embedded SQL migrations to DATABASE_URL.
//
// Which migrations to apply is not a judgment call: golang-migrate keeps the
// last applied version in a schema_migrations table inside the target database
// and applies only the files above it. A fresh database gets all of them; an
// up-to-date one gets none and exits 0.
//
//	migrate            # same as `up`
//	migrate up         # apply everything pending
//	migrate version    # print current version and dirty flag
//	migrate force <v>  # clear a dirty flag after a manual repair
package main

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"strconv"

	"github.com/golang-migrate/migrate/v4"
	migratepg "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	_ "github.com/jackc/pgx/v5/stdlib" // registers the "pgx" database/sql driver

	"github.com/bingoring/forin/server/db"
)

func main() {
	if err := run(os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, "migrate:", err)
		os.Exit(1)
	}
}

func run(args []string) error {
	cmd := "up"
	if len(args) > 0 {
		cmd = args[0]
	}

	url := os.Getenv("DATABASE_URL")
	if url == "" {
		return errors.New("DATABASE_URL is required")
	}

	m, closeFn, err := open(url)
	if err != nil {
		return err
	}
	defer closeFn()

	report(m, "before")

	switch cmd {
	case "up":
		err = m.Up()
		if errors.Is(err, migrate.ErrNoChange) {
			fmt.Println("migrate: already up to date")
			err = nil
		}
	case "version":
		// report() already printed it.
	case "force":
		if len(args) < 2 {
			return errors.New("force needs a version: migrate force <version>")
		}
		v, convErr := strconv.Atoi(args[1])
		if convErr != nil {
			return fmt.Errorf("bad version %q: %w", args[1], convErr)
		}
		err = m.Force(v)
	default:
		return fmt.Errorf("unknown command %q (want up|version|force)", cmd)
	}
	if err != nil {
		report(m, "after (FAILED)")
		return err
	}
	report(m, "after")
	return nil
}

func open(url string) (*migrate.Migrate, func(), error) {
	src, err := iofs.New(db.Migrations, "migrations")
	if err != nil {
		return nil, nil, fmt.Errorf("embedded migrations: %w", err)
	}
	sqlDB, err := sql.Open("pgx", url)
	if err != nil {
		return nil, nil, fmt.Errorf("open db: %w", err)
	}
	if err := sqlDB.Ping(); err != nil {
		_ = sqlDB.Close()
		return nil, nil, fmt.Errorf("connect: %w", err)
	}
	drv, err := migratepg.WithInstance(sqlDB, &migratepg.Config{})
	if err != nil {
		_ = sqlDB.Close()
		return nil, nil, fmt.Errorf("postgres driver: %w", err)
	}
	m, err := migrate.NewWithInstance("iofs", src, "postgres", drv)
	if err != nil {
		_ = sqlDB.Close()
		return nil, nil, err
	}
	return m, func() { _ = sqlDB.Close() }, nil
}

// report prints the version and dirty flag. A failed migration leaves the
// database dirty and golang-migrate then refuses to run at all — that is
// deliberate, but it means the operator has to see WHERE it stopped.
func report(m *migrate.Migrate, when string) {
	v, dirty, err := m.Version()
	switch {
	case errors.Is(err, migrate.ErrNilVersion):
		fmt.Printf("migrate: %s version=none (fresh database)\n", when)
	case err != nil:
		fmt.Printf("migrate: %s version=unknown err=%v\n", when, err)
	default:
		fmt.Printf("migrate: %s version=%d dirty=%t\n", when, v, dirty)
	}
}
