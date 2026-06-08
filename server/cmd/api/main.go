// Command api is the forin HTTP server entrypoint.
package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	authadapter "github.com/bingoring/forin/server/internal/adapters/auth"
	httpadapter "github.com/bingoring/forin/server/internal/adapters/http"
	"github.com/bingoring/forin/server/internal/adapters/postgres"
	redisadapter "github.com/bingoring/forin/server/internal/adapters/redis"
	"github.com/bingoring/forin/server/internal/config"
	"github.com/bingoring/forin/server/internal/domain/auth"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/platform/log"
)

// @title                       forin API
// @version                     0.1.0
// @description                 forin server API — Go stdlib, hexagonal. Contract is Go-first (swag → openapi → openapi-typescript).
// @securityDefinitions.apikey  Bearer
// @in                          header
// @name                        Authorization
func main() {
	cfg, err := config.Load()
	logger := log.New(envOrDev(cfg))
	if err != nil {
		logger.Error("config", "err", err)
		os.Exit(1)
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	pool, err := postgres.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		logger.Error("postgres connect", "err", err)
		os.Exit(1)
	}
	defer pool.Close()

	rdb, err := redisadapter.New(ctx, cfg.RedisURL)
	if err != nil {
		logger.Error("redis connect", "err", err)
		os.Exit(1)
	}
	defer rdb.Close()

	tokens := auth.NewTokenService(cfg.JWTSigningKey, cfg.JWTIssuer, cfg.AccessTTL)
	verifier := authadapter.NewOIDCVerifier(map[user.Provider]string{
		user.ProviderGoogle: cfg.GoogleClientID,
		user.ProviderApple:  cfg.AppleClientID,
		user.ProviderKakao:  cfg.KakaoClientID,
	})
	users := postgres.NewUserRepo(pool)
	contentRepo := postgres.NewContentRepo(pool)
	refreshStore := redisadapter.NewRefreshStore(rdb)
	authSvc := auth.NewService(users, verifier, refreshStore, tokens, cfg.RefreshTTL)

	handler := httpadapter.NewRouter(httpadapter.Deps{
		Log: logger, Tokens: tokens, AuthSvc: authSvc, Users: users, Content: contentRepo, PG: pool, Redis: rdb,
	})

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           handler,
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		logger.Info("server starting", "port", cfg.Port, "env", cfg.Env)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("listen", "err", err)
			stop()
		}
	}()

	<-ctx.Done()
	logger.Info("shutting down")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Error("shutdown", "err", err)
	}
}

func envOrDev(cfg *config.Config) string {
	if cfg != nil {
		return cfg.Env
	}
	return "dev"
}
