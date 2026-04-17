package handler

import (
	"context"

	"github.com/forin/server/internal/dto"
	"github.com/google/uuid"
)

// AuthService defines the business logic contract for authentication.
type AuthService interface {
	Register(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error)
	Login(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error)
	RefreshToken(ctx context.Context, refreshToken string) (*dto.AuthResponse, error)
	ValidateAccessToken(tokenStr string) (uuid.UUID, error)
}

// UserService defines the business logic contract for user profiles.
type UserService interface {
	GetProfile(ctx context.Context, userID uuid.UUID) (*dto.UserProfileResponse, error)
	UpdateProfile(ctx context.Context, userID uuid.UUID, req dto.UpdateProfileRequest) (*dto.UserProfileResponse, error)
}

// CurriculumService defines the business logic contract for curriculum.
type CurriculumService interface {
	GetCurriculum(ctx context.Context, userID uuid.UUID) (*dto.CurriculumResponse, error)
	GetStageDetail(ctx context.Context, userID, stageID uuid.UUID) (*dto.StageDetailResponse, error)
}

// LearningService defines the business logic contract for the learning lifecycle.
type LearningService interface {
	StartStage(ctx context.Context, userID, stageID uuid.UUID) (*dto.StartStageResponse, error)
	SubmitExercise(ctx context.Context, userID, attemptID, exerciseID uuid.UUID, req dto.SubmitExerciseRequest) (*dto.SubmitExerciseResponse, error)
	CompleteAttempt(ctx context.Context, userID, attemptID uuid.UUID) (*dto.CompleteAttemptResponse, error)
	GetAttemptHistory(ctx context.Context, userID uuid.UUID, query dto.AttemptHistoryQuery) (*dto.AttemptHistoryResponse, error)
}

// OnboardingService defines the business logic contract for onboarding.
type OnboardingService interface {
	GetProfessions(ctx context.Context) (*dto.ProfessionsResponse, error)
	GetCountries(ctx context.Context, professionSlug string) (*dto.CountriesResponse, error)
	SubmitAssessment(ctx context.Context, userID uuid.UUID, req dto.AssessmentSubmitRequest) (*dto.AssessmentSubmitResponse, error)
}

// NotificationService defines the business logic contract for notifications and stats.
type NotificationService interface {
	GetPreferences(ctx context.Context, userID uuid.UUID) (*dto.NotificationPrefsResponse, error)
	UpdatePreferences(ctx context.Context, userID uuid.UUID, req dto.UpdateNotificationPrefsRequest) (*dto.NotificationPrefsResponse, error)
	GetWeeklyStats(ctx context.Context, userID uuid.UUID) (*dto.WeeklyStatsResponse, error)
}

// GamificationService defines the business logic contract for gamification.
type GamificationService interface {
	GetInventory(ctx context.Context, userID uuid.UUID) (*dto.InventoryResponse, error)
	GetPendingGiftBoxes(ctx context.Context, userID uuid.UUID) (*dto.PendingGiftBoxesResponse, error)
	OpenGiftBox(ctx context.Context, userID, boxID uuid.UUID) (*dto.OpenGiftBoxResponse, error)
	GetShop(ctx context.Context, userID uuid.UUID) (*dto.ShopResponse, error)
	PurchaseItem(ctx context.Context, userID uuid.UUID, req dto.PurchaseRequest) (*dto.PurchaseResponse, error)
	GetAchievements(ctx context.Context, userID uuid.UUID) (*dto.AchievementsResponse, error)
	EquipCatItem(ctx context.Context, userID uuid.UUID, req dto.EquipCatItemRequest) (*dto.EquippedItemsResponse, error)
}
