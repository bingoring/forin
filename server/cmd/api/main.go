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
	"github.com/bingoring/forin/server/internal/adapters/contentfile"
	httpadapter "github.com/bingoring/forin/server/internal/adapters/http"
	"github.com/bingoring/forin/server/internal/adapters/openai"
	"github.com/bingoring/forin/server/internal/adapters/postgres"
	redisadapter "github.com/bingoring/forin/server/internal/adapters/redis"
	"github.com/bingoring/forin/server/internal/config"
	"github.com/bingoring/forin/server/internal/domain/auth"
	"github.com/bingoring/forin/server/internal/domain/conversation"
	"github.com/bingoring/forin/server/internal/domain/handoff"
	"github.com/bingoring/forin/server/internal/domain/night"
	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/domain/slang"
	// Aliased: main.go already has a local variable named `speech` (the Azure
	// Speech adapter instance below) — an unaliased import of this package
	// would collide with it.
	domainspeech "github.com/bingoring/forin/server/internal/domain/speech"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/domain/ward"
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
	verifier := authadapter.NewOIDCVerifier(map[user.Provider][]string{
		user.ProviderGoogle: cfg.GoogleClientIDs,
		user.ProviderApple:  cfg.AppleClientIDs,
		user.ProviderKakao:  cfg.KakaoClientIDs,
	})
	users := postgres.NewUserRepo(pool)
	contentRepo := postgres.NewContentRepo(pool)
	progressRepo := postgres.NewProgressRepo(pool)
	convoRepo := postgres.NewConversationRepo(pool)
	colleagueRepo := postgres.NewColleagueRepo(pool)
	loungeRepo := postgres.NewLoungeRepo(pool)
	slangRepo := postgres.NewSlangRepo(pool)
	handoffRepo := postgres.NewHandoffRepo(pool)

	// Home flavour (mentor notes, field phrases). A missing content dir is not
	// fatal — those two modules are simply omitted from the home response.
	homePools, err := contentfile.LoadHomePools(cfg.ContentDir)
	if err != nil {
		logger.Warn("home content pools failed to load; those modules will be hidden", "err", err)
	}
	refreshStore := redisadapter.NewRefreshStore(rdb)
	authSvc := auth.NewService(users, verifier, refreshStore, tokens, cfg.RefreshTTL)

	// Home live ward: presence in a Redis sorted set, faces read from the profile store.
	wardSvc := ward.NewService(redisadapter.NewWardStore(rdb), users, cfg.WardTTL)

	// 은어 도감: the slang deck is content, so it can grow by deploy. Missing content is
	// not fatal — the endpoint then serves an empty deck.
	slangCards, err := contentfile.LoadSlang(cfg.ContentDir)
	if err != nil {
		logger.Warn("slang deck failed to load; 은어 도감 will be empty", "err", err)
	}
	slangDeck := slang.NewDeck(slangCards)

	// 나이트 근무 라디오의 오늘 밤의 이야기, also content.
	nightStories, err := contentfile.LoadNightStories(cfg.ContentDir)
	if err != nil {
		logger.Warn("night stories failed to load; 오늘 밤의 이야기 will be empty", "err", err)
	}
	nightRadio := night.NewStories(nightStories)

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
	convoEngine := conversation.NewEngine(contentRepo, convoRepo, progressRepo, users, progressRepo, progressRepo, llm, dialogue, correctionModel, dialogueModel)

	// 환자 인수인계 노트: follow-up notes generated (cheap correction model) from cleared
	// patient encounters, with a template fallback when the LLM is unconfigured.
	handoffSvc := handoff.NewService(handoffRepo, progressRepo, contentRepo, progressRepo, llm, correctionModel)
	logger.Info("llm provider", "provider", cfg.ResolveProvider(), "configured", configured)
	if !configured {
		logger.Warn("LLM API key not set — AI conversation/correction endpoints will return errors")
	}

	// Pronunciation assessment (Azure) behind PronunciationPort.
	speech := azurespeech.New(cfg.AzureSpeechKey, cfg.AzureSpeechRegion)
	pronSvc := pronunciation.NewService(speech, users)
	if !speech.Configured() {
		logger.Warn("AZURE_SPEECH_KEY/REGION not set — /pronunciation will return errors, pronunciationEnabled=false")
	}

	// Pronunciation-attempt persistence + history + reference derivation
	// (domain/speech, Task 5's own domain layer from Tasks 2-4).
	speechRepo := postgres.NewSpeechRepo(pool)
	speechSvc := domainspeech.NewService(speechRepo, pronSvc, speech)

	handler := httpadapter.NewRouter(httpadapter.Deps{
		Env:           cfg.Env,
		DevAuthSecret: cfg.DevAuthSecret,
		Log:           logger, Tokens: tokens, AuthSvc: authSvc, Users: users, Content: contentRepo,
		Progress: progressRepo, Review: progressRepo, Convo: convoEngine, Pron: pronSvc, Speech: speechSvc, Synth: speech,
		PronunciationEnabled: speech.Configured(),
		Colleague:            colleagueRepo, Lounge: loungeRepo, HomePools: homePools, Ward: wardSvc, Slang: slangDeck, SlangRepo: slangRepo, Night: nightRadio, Handoff: handoffSvc, PG: pool, Redis: rdb,
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
