package service

import (
	"context"
	"time"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
)

// UserRepository defines the data access contract for user operations (auth).
type UserRepository interface {
	Create(ctx context.Context, user *model.User) error
	FindByEmail(ctx context.Context, email string) (*model.User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.User, error)
	Update(ctx context.Context, user *model.User) error
	CreateOAuthProvider(ctx context.Context, provider *model.UserOAuthProvider) error
	FindOAuthProvider(ctx context.Context, provider, providerUID string) (*model.UserOAuthProvider, error)
}

// UserProfileRepository defines data access for user profile operations.
type UserProfileRepository interface {
	FindByIDWithProfession(ctx context.Context, id uuid.UUID) (*model.User, error)
	Update(ctx context.Context, user *model.User) error
	FindStreak(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error)
	FindOrCreateStreak(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error)
	FindDailyActivity(ctx context.Context, userID uuid.UUID, date time.Time) (*model.DailyActivityLog, error)
}

// CurriculumRepository defines data access for curriculum content.
type CurriculumRepository interface {
	FindModulesByProfessionAndCountry(ctx context.Context, professionID uuid.UUID, targetCountry string) ([]model.CurriculumModule, error)
	FindStageByID(ctx context.Context, stageID uuid.UUID) (*model.Stage, error)
	FindExerciseByID(ctx context.Context, exerciseID uuid.UUID) (*model.Exercise, error)
	FindUserStageProgress(ctx context.Context, userID uuid.UUID, stageIDs []uuid.UUID) ([]model.UserStageProgress, error)
	FindUserModuleProgress(ctx context.Context, userID uuid.UUID, moduleIDs []uuid.UUID) ([]model.UserModuleProgress, error)
}

// LearningRepository defines data access for the learning lifecycle.
type LearningRepository interface {
	CreateAttempt(ctx context.Context, attempt *model.StageAttempt) error
	FindAttemptByID(ctx context.Context, attemptID uuid.UUID) (*model.StageAttempt, error)
	UpdateAttempt(ctx context.Context, attempt *model.StageAttempt) error
	CreateExerciseResponse(ctx context.Context, resp *model.ExerciseResponse) error
	FindResponsesByAttemptID(ctx context.Context, attemptID uuid.UUID) ([]model.ExerciseResponse, error)
	CheckExerciseSubmitted(ctx context.Context, attemptID, exerciseID uuid.UUID) (bool, error)
	FindUserStageProgress(ctx context.Context, userID, stageID uuid.UUID) (*model.UserStageProgress, error)
	UpsertUserStageProgress(ctx context.Context, progress *model.UserStageProgress) error
	FindUserByID(ctx context.Context, userID uuid.UUID) (*model.User, error)
	UpdateUser(ctx context.Context, user *model.User) error
	UpsertDailyActivity(ctx context.Context, log *model.DailyActivityLog) error
	UpsertStreak(ctx context.Context, streak *model.UserStreak) error
	FindOrCreateStreak(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error)
	FindDailyActivity(ctx context.Context, userID uuid.UUID, date time.Time) (*model.DailyActivityLog, error)
	FindAllAchievements(ctx context.Context) ([]model.Achievement, error)
	FindUserAchievements(ctx context.Context, userID uuid.UUID) ([]model.UserAchievement, error)
	CreateUserAchievement(ctx context.Context, ua *model.UserAchievement) error
	CreateGiftBoxOpening(ctx context.Context, gbo *model.GiftBoxOpening) error
	CountCompletedStages(ctx context.Context, userID uuid.UUID) (int64, error)
	FindAttemptHistory(ctx context.Context, userID uuid.UUID, offset, limit int) ([]model.StageAttempt, int64, error)
	WithTx(fn func(repo LearningRepository) error) error
}

// GamificationRepository defines data access for gamification features.
type GamificationRepository interface {
	FindUserInventory(ctx context.Context, userID uuid.UUID) ([]model.UserInventory, error)
	FindUserInventoryItem(ctx context.Context, userID, itemID uuid.UUID) (*model.UserInventory, error)
	CreateInventoryItem(ctx context.Context, inv *model.UserInventory) error
	UpdateInventoryItem(ctx context.Context, inv *model.UserInventory) error
	UnequipSlot(ctx context.Context, userID uuid.UUID, slot string) error
	FindEquippedItems(ctx context.Context, userID uuid.UUID) ([]model.UserInventory, error)
	FindPendingGiftBoxes(ctx context.Context, userID uuid.UUID) ([]model.GiftBoxOpening, error)
	FindGiftBoxByID(ctx context.Context, boxID uuid.UUID) (*model.GiftBoxOpening, error)
	UpdateGiftBox(ctx context.Context, box *model.GiftBoxOpening) error
	FindActiveItems(ctx context.Context) ([]model.CatItem, error)
	FindItemByID(ctx context.Context, itemID uuid.UUID) (*model.CatItem, error)
	FindItemsByRarity(ctx context.Context, rarity string) ([]model.CatItem, error)
	FindShopItems(ctx context.Context) ([]model.CatItem, error)
	FindAllAchievements(ctx context.Context) ([]model.Achievement, error)
	FindUserAchievements(ctx context.Context, userID uuid.UUID) ([]model.UserAchievement, error)
	FindUserByID(ctx context.Context, userID uuid.UUID) (*model.User, error)
	UpdateUser(ctx context.Context, user *model.User) error
}

// OnboardingRepository defines data access for onboarding.
type OnboardingRepository interface {
	FindActiveProfessions(ctx context.Context) ([]model.Profession, error)
	FindModulesByProfessionAndCountry(ctx context.Context, professionID uuid.UUID, country string) ([]model.CurriculumModule, error)
}

// NotificationRepository defines data access for notifications and stats.
type NotificationRepository interface {
	FindOrCreatePreferences(ctx context.Context, userID uuid.UUID) (*model.NotificationPreference, error)
	UpdatePreferences(ctx context.Context, pref *model.NotificationPreference) error
	CreateLog(ctx context.Context, log *model.NotificationLog) error
	FindWeeklyActivity(ctx context.Context, userID uuid.UUID, from, to time.Time) ([]model.DailyActivityLog, error)
	FindUsersWithPushToken(ctx context.Context) ([]model.User, error)
}
