// Package http is the HTTP adapter: stdlib net/http router, middleware, handlers.
package http

import (
	"log/slog"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"golang.org/x/time/rate"

	"github.com/bingoring/forin/server/internal/domain/auth"
	"github.com/bingoring/forin/server/internal/domain/conversation"
	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/ports"
)

// Deps are the dependencies the HTTP layer needs (wired in main).
type Deps struct {
	Env      string // dev | staging | prod — gates dev-only routes
	Log      *slog.Logger
	Tokens   *auth.TokenService
	AuthSvc  *auth.Service
	Users    ports.UserRepo
	Content  ports.ContentReader
	Progress ports.ProgressRepo
	Review   ports.ReviewRepo
	Convo    *conversation.Engine
	Pron     *pronunciation.Service
	PG       *pgxpool.Pool
	Redis    *redis.Client
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
	if d.Env == "dev" {
		mux.HandleFunc("POST /auth/dev", ah.dev) // local-only auth bypass; never registered in prod
	}

	// Authenticated routes.
	auth := requireAuth(d.Tokens)
	mux.Handle("POST /auth/logout", auth(http.HandlerFunc(ah.logout)))
	mh := &meHandler{users: d.Users}
	mux.Handle("GET /me", auth(http.HandlerFunc(mh.me)))

	// Content (public read).
	ch := &contentHandler{content: d.Content}
	mux.HandleFunc("GET /content/manifest", ch.manifest)
	mux.HandleFunc("GET /departments", ch.departments)
	mux.HandleFunc("GET /interiors/{id}", ch.interior)
	mux.HandleFunc("GET /events", ch.events)
	mux.HandleFunc("GET /scenarios/{id}", ch.scenario)
	mux.HandleFunc("GET /quizzes/{id}", ch.quiz)
	mux.HandleFunc("GET /board/today", ch.board)

	// Progress + review (authenticated).
	ph := &progressHandler{progress: d.Progress, review: d.Review}
	mux.Handle("GET /me/progress", auth(http.HandlerFunc(ph.get)))
	mux.Handle("POST /attempts", auth(http.HandlerFunc(ph.attempt)))
	mux.Handle("GET /me/review", auth(http.HandlerFunc(ph.due)))
	mux.Handle("POST /me/review/{id}/grade", auth(http.HandlerFunc(ph.grade)))

	// AI conversation + correction (authenticated).
	conv := &conversationHandler{engine: d.Convo}
	mux.Handle("POST /scenarios/{id}/conversation", auth(http.HandlerFunc(conv.start)))
	mux.Handle("POST /conversation/{sessionId}/message", auth(http.HandlerFunc(conv.message)))
	mux.Handle("POST /conversation/{sessionId}/stream", auth(http.HandlerFunc(conv.stream)))
	mux.Handle("POST /correct", auth(http.HandlerFunc(conv.correct)))

	// Pronunciation assessment (authenticated).
	pron := &pronunciationHandler{svc: d.Pron}
	mux.Handle("POST /pronunciation", auth(http.HandlerFunc(pron.assess)))

	// Global middleware (outermost first).
	return chain(mux,
		recoverMW(d.Log),
		requestLog(d.Log),
		cors,
		rateLimit(rate.Limit(20), 40),
	)
}
