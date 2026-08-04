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

	"github.com/bingoring/forin/server/internal/adapters/anthropic"
	authadapter "github.com/bingoring/forin/server/internal/adapters/auth"
	"github.com/bingoring/forin/server/internal/adapters/azurespeech"
	httpadapter "github.com/bingoring/forin/server/internal/adapters/http"
	"github.com/bingoring/forin/server/internal/adapters/openai"
	"github.com/bingoring/forin/server/internal/adapters/postgres"
	redisadapter "github.com/bingoring/forin/server/internal/adapters/redis"
	"github.com/bingoring/forin/server/internal/config"
	"github.com/bingoring/forin/server/internal/domain/auth"
	"github.com/bingoring/forin/server/internal/domain/conversation"
	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/platform/log"
	"github.com/bingoring/forin/server/internal/ports"
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
	progressRepo := postgres.NewProgressRepo(pool)
	convoRepo := postgres.NewConversationRepo(pool)
	refreshStore := redisadapter.NewRefreshStore(rdb)
	authSvc := auth.NewService(users, verifier, refreshStore, tokens, cfg.RefreshTTL)

	// AI layer: select an LLMPort adapter by provider (anthropic | openai) — domain unchanged.
	var llm ports.LLMPort
	var dialogueModel, correctionModel string
	var configured bool
	switch cfg.ResolveProvider() {
	case "openai":
		oc := openai.New(cfg.OpenAIKey)
		llm, configured = oc, oc.Configured()
		dialogueModel, correctionModel = cfg.OpenAIDialogueModel, cfg.OpenAICorrectionModel
	default:
		ac := anthropic.New(cfg.AnthropicKey)
		llm, configured = ac, ac.Configured()
		dialogueModel, correctionModel = cfg.AnthropicDialogueModel, cfg.AnthropicCorrectionModel
	}
	dialogue := conversation.SingleModel{LLM: llm, Model: dialogueModel, MaxTokens: 512}
	// Grade with the capable dialogue model (one call per completion; quality matters
	// for a fair judgment). Correction uses the cheaper model for per-turn fixes.
	convoEngine := conversation.NewEngine(contentRepo, convoRepo, progressRepo, users, progressRepo, llm, dialogue, correctionModel, dialogueModel)
	logger.Info("llm provider", "provider", cfg.ResolveProvider(), "configured", configured)
	if !configured {
		logger.Warn("LLM API key not set — AI conversation/correction endpoints will return errors")
	}

	// Pronunciation assessment (Azure) behind PronunciationPort.
	speech := azurespeech.New(cfg.AzureSpeechKey, cfg.AzureSpeechRegion)
	pronSvc := pronunciation.NewService(speech, users)
	if !speech.Configured() {
		logger.Warn("AZURE_SPEECH_KEY/REGION not set — /pronunciation will return errors")
	}

	handler := httpadapter.NewRouter(httpadapter.Deps{
		Env: cfg.Env,
		Log: logger, Tokens: tokens, AuthSvc: authSvc, Users: users, Content: contentRepo,
		Progress: progressRepo, Review: progressRepo, Convo: convoEngine, Pron: pronSvc, Synth: speech, PG: pool, Redis: rdb,
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
