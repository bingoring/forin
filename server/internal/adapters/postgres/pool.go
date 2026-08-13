// Package postgres implements repositories over a pgx connection pool.
package postgres

import (
	"context"
	"os"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// defaultMaxConns matches pgxpool's own historical default (4) rather than
// its current default of max(4, NumCPU) — deployment spec §3.2 caps this
// deliberately low because staging and prod share one Cloud SQL instance
// whose max_connections is small (a db-f1-micro-class tier sits around 25).
// Left uncapped, pgxpool's NumCPU-based default times Cloud Run's
// max_instance_count across two environments plus the migrate/seed Jobs can
// exhaust the instance's connection budget, and one environment scaling out
// would starve the other's connections.
const defaultMaxConns = 4

// NewPool opens a pgx connection pool and verifies connectivity. The pool's
// MaxConns is capped via DB_MAX_CONNS (see defaultMaxConns above); an unset,
// unparsable, or non-positive value falls back to defaultMaxConns rather than
// pgxpool's own default.
func NewPool(ctx context.Context, url string) (*pgxpool.Pool, error) {
	cfg, err := pgxpool.ParseConfig(url)
	if err != nil {
		return nil, err
	}
	cfg.MaxConnLifetime = time.Hour
	cfg.MaxConns = defaultMaxConns
	if raw := os.Getenv("DB_MAX_CONNS"); raw != "" {
		if n, err := strconv.Atoi(raw); err == nil && n > 0 {
			cfg.MaxConns = int32(n)
		}
	}
	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return nil, err
	}
	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()
		return nil, err
	}
	return pool, nil
}
