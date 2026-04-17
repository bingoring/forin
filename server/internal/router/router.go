package router

import (
	"time"

	"github.com/forin/server/internal/cache"
	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/handler"
	"github.com/forin/server/internal/middleware"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// New creates and configures a Gin engine with all routes and middleware.
func New(
	cfg *config.Config,
	log *zap.Logger,
	redis *cache.Client,
	authHandler *handler.AuthHandler,
	healthHandler *handler.HealthHandler,
	userHandler *handler.UserHandler,
	curriculumHandler *handler.CurriculumHandler,
	learningHandler *handler.LearningHandler,
	onboardingHandler *handler.OnboardingHandler,
	gamificationHandler *handler.GamificationHandler,
	authService handler.AuthService,
) *gin.Engine {
	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	engine := gin.New()

	// Global middleware (order matters)
	engine.Use(middleware.Recovery(log))
	engine.Use(middleware.RequestID())
	engine.Use(middleware.Logger(log))
	engine.Use(middleware.CORS(cfg))

	// API v1 routes
	v1 := engine.Group("/v1")

	// Public routes
	v1.GET("/health", healthHandler.Check)

	// Auth routes (public, with rate limiting per endpoint)
	auth := v1.Group("/auth")
	auth.POST("/register",
		middleware.RateLimiter(redis, 3, time.Minute, middleware.KeyByIP),
		authHandler.Register,
	)
	auth.POST("/login",
		middleware.RateLimiter(redis, 5, time.Minute, middleware.KeyByIP),
		authHandler.Login,
	)
	auth.POST("/refresh", authHandler.Refresh)

	// Onboarding routes (public)
	onboarding := v1.Group("/onboarding")
	onboarding.GET("/professions", onboardingHandler.GetProfessions)
	onboarding.GET("/countries", onboardingHandler.GetCountries)

	// Authenticated routes
	protected := v1.Group("")
	protected.Use(middleware.Auth(authService))
	protected.Use(middleware.RateLimiter(redis, 100, time.Minute, middleware.KeyByUserID))

	// Auth (protected)
	protectedAuth := protected.Group("/auth")
	protectedAuth.POST("/logout", authHandler.Logout)

	// Onboarding (protected)
	protectedOnboarding := protected.Group("/onboarding")
	protectedOnboarding.POST("/assessment/submit", onboardingHandler.SubmitAssessment)

	// User profile
	users := protected.Group("/users")
	users.GET("/me", userHandler.GetProfile)
	users.PATCH("/me", userHandler.UpdateProfile)
	users.PUT("/me/cat/equip", gamificationHandler.EquipCatItem)

	// Curriculum
	curriculum := protected.Group("/curriculum")
	curriculum.GET("", curriculumHandler.GetCurriculum)
	curriculum.GET("/stages/:stageId", curriculumHandler.GetStageDetail)

	// Learning
	learning := protected.Group("/learning")
	learning.POST("/stages/:stageId/start", learningHandler.StartStage)
	learning.POST("/attempts/:attemptId/exercises/:exerciseId/submit",
		middleware.RateLimiter(redis, 60, time.Minute, middleware.KeyByUserID),
		learningHandler.SubmitExercise,
	)
	learning.POST("/attempts/:attemptId/complete", learningHandler.CompleteAttempt)
	learning.GET("/history", learningHandler.GetHistory)

	// Gamification
	gamification := protected.Group("/gamification")
	gamification.GET("/inventory", gamificationHandler.GetInventory)
	gamification.GET("/gift-boxes/pending", gamificationHandler.GetPendingGiftBoxes)
	gamification.POST("/gift-boxes/:boxId/open", gamificationHandler.OpenGiftBox)
	gamification.GET("/shop", gamificationHandler.GetShop)
	gamification.POST("/shop/purchase", gamificationHandler.PurchaseItem)
	gamification.GET("/achievements", gamificationHandler.GetAchievements)

	return engine
}
