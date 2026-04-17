package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/forin/server/internal/ai"
	"github.com/forin/server/internal/cache"
	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/database"
	"github.com/forin/server/internal/evaluator"
	"github.com/forin/server/internal/handler"
	"github.com/forin/server/internal/logger"
	"github.com/forin/server/internal/repository"
	"github.com/forin/server/internal/router"
	"github.com/forin/server/internal/service"
	"go.uber.org/zap"
)

func main() {
	// 1. Load and validate configuration
	cfg := config.Load()
	if err := cfg.Validate(); err != nil {
		fmt.Fprintf(os.Stderr, "configuration error: %v\n", err)
		os.Exit(1)
	}

	// 2. Initialize logger
	log := logger.Init(cfg.Env)
	defer logger.Sync()

	// 3. Connect to database
	db, err := database.New(cfg, log)
	if err != nil {
		log.Fatal("failed to connect to database", zap.Error(err))
	}

	// 4. Connect to Redis
	redis, err := cache.New(cfg)
	if err != nil {
		log.Fatal("failed to connect to redis", zap.Error(err))
	}

	// 5. Wire dependencies

	// Repositories
	userRepo := repository.NewUserRepository(db)
	userProfileRepo := repository.NewUserProfileRepository(db)
	curriculumRepo := repository.NewCurriculumRepository(db)
	learningRepo := repository.NewLearningRepository(db)
	onboardingRepo := repository.NewOnboardingRepository(db)
	gamificationRepo := repository.NewGamificationRepository(db)
	notificationRepo := repository.NewNotificationRepository(db)

	// AI client + evaluator registry
	aiClient := ai.NewClaudeClient(cfg.AnthropicAPIKey)
	evalRegistry := evaluator.NewRegistry(aiClient)

	// Services
	authService := service.NewAuthService(userRepo, cfg)
	userService := service.NewUserService(userProfileRepo, cfg)
	curriculumService := service.NewCurriculumService(curriculumRepo, userProfileRepo, cfg)
	learningService := service.NewLearningService(learningRepo, curriculumRepo, evalRegistry, cfg)
	onboardingService := service.NewOnboardingService(onboardingRepo, userProfileRepo, cfg)
	gamificationService := service.NewGamificationService(gamificationRepo, cfg)
	notificationService := service.NewNotificationService(notificationRepo, userProfileRepo, cfg)

	// Handlers
	authHandler := handler.NewAuthHandler(authService)
	healthHandler := handler.NewHealthHandler(db, redis)
	userHandler := handler.NewUserHandler(userService)
	curriculumHandler := handler.NewCurriculumHandler(curriculumService)
	learningHandler := handler.NewLearningHandler(learningService)
	onboardingHandler := handler.NewOnboardingHandler(onboardingService)
	gamificationHandler := handler.NewGamificationHandler(gamificationService)
	notificationHandler := handler.NewNotificationHandler(notificationService)

	// 6. Build router
	engine := router.New(cfg, log, redis,
		authHandler, healthHandler, userHandler, curriculumHandler, learningHandler,
		onboardingHandler, gamificationHandler, notificationHandler, authService,
	)

	// 7. Start HTTP server
	srv := &http.Server{
		Addr:         ":" + cfg.ServerPort,
		Handler:      engine,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Info("server starting", zap.String("port", cfg.ServerPort))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("server failed to start", zap.Error(err))
		}
	}()

	// 8. Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit
	log.Info("shutdown signal received", zap.String("signal", sig.String()))

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Error("server forced to shutdown", zap.Error(err))
	}

	if err := database.Close(db); err != nil {
		log.Error("failed to close database", zap.Error(err))
	}

	if err := redis.Close(); err != nil {
		log.Error("failed to close redis", zap.Error(err))
	}

	log.Info("server stopped gracefully")
}
