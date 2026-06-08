// Package http is the HTTP adapter: stdlib net/http router, middleware, handlers.
package httpapi

import (
	"log/slog"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"golang.org/x/time/rate"

	"github.com/bingoring/forin/server/internal/domain/auth"
	"github.com/bingoring/forin/server/internal/ports"
)

// Deps are the dependencies the HTTP layer needs (wired in main).
type Deps struct {
	Log     *slog.Logger
	Tokens  *auth.TokenService
	AuthSvc *auth.Service
	Users   ports.UserRepo
	PG      *pgxpool.Pool
	Redis   *redis.Client
}

// NewRouter builds the application handler with global middleware and routes.
func NewRouter(d Deps) http.Handler {
	mux := http.NewServeMux()

	h := &health{pg: d.PG, redis: d.Redis}
	mux.HandleFunc("GET /healthz", h.live)
	mux.HandleFunc("GET /readyz", h.ready)

	ah := &authHandler{svc: d.AuthSvc}
	mux.HandleFunc("POST /auth/social", ah.social)
	mux.HandleFunc("POST /auth/refresh", ah.refresh)

	// Authenticated routes.
	auth := requireAuth(d.Tokens)
	mux.Handle("POST /auth/logout", auth(http.HandlerFunc(ah.logout)))
	mh := &meHandler{users: d.Users}
	mux.Handle("GET /me", auth(http.HandlerFunc(mh.me)))

	// Global middleware (outermost first).
	return chain(mux,
		recoverMW(d.Log),
		requestLog(d.Log),
		cors,
		rateLimit(rate.Limit(20), 40),
	)
}
