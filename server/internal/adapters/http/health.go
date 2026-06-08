package http

import (
	"context"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	"github.com/bingoring/forin/server/internal/platform/httpx"
)

type health struct {
	pg    *pgxpool.Pool
	redis *redis.Client
}

// liveness: process is up.
func (h *health) live(w http.ResponseWriter, _ *http.Request) {
	httpx.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

// readiness: dependencies reachable.
func (h *health) ready(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	checks := map[string]string{"postgres": "ok", "redis": "ok"}
	ready := true
	if err := h.pg.Ping(ctx); err != nil {
		checks["postgres"] = err.Error()
		ready = false
	}
	if err := h.redis.Ping(ctx).Err(); err != nil {
		checks["redis"] = err.Error()
		ready = false
	}
	status := http.StatusOK
	if !ready {
		status = http.StatusServiceUnavailable
	}
	httpx.JSON(w, status, map[string]any{"ready": ready, "checks": checks})
}
