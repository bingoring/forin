package testutil

import (
	"context"
	"time"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
)

// LearningRepoTxFunc matches the signature of service.LearningRepository.WithTx's callback.
// Defined here to avoid importing the service package (which would cause an import cycle).
type LearningRepoTxFunc = func(repo interface{}) error

type MockLearningRepository struct {
	CreateAttemptFn            func(ctx context.Context, attempt *model.StageAttempt) error
	FindAttemptByIDFn          func(ctx context.Context, attemptID uuid.UUID) (*model.StageAttempt, error)
	UpdateAttemptFn            func(ctx context.Context, attempt *model.StageAttempt) error
	CreateExerciseResponseFn   func(ctx context.Context, resp *model.ExerciseResponse) error
	FindResponsesByAttemptIDFn func(ctx context.Context, attemptID uuid.UUID) ([]model.ExerciseResponse, error)
	CheckExerciseSubmittedFn   func(ctx context.Context, attemptID, exerciseID uuid.UUID) (bool, error)
	FindUserStageProgressFn    func(ctx context.Context, userID, stageID uuid.UUID) (*model.UserStageProgress, error)
	UpsertUserStageProgressFn  func(ctx context.Context, progress *model.UserStageProgress) error
	FindUserByIDFn             func(ctx context.Context, userID uuid.UUID) (*model.User, error)
	UpdateUserFn               func(ctx context.Context, user *model.User) error
	UpsertDailyActivityFn      func(ctx context.Context, log *model.DailyActivityLog) error
	UpsertStreakFn             func(ctx context.Context, streak *model.UserStreak) error
	FindOrCreateStreakFn       func(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error)
	FindDailyActivityFn        func(ctx context.Context, userID uuid.UUID, date time.Time) (*model.DailyActivityLog, error)
	FindAllAchievementsFn      func(ctx context.Context) ([]model.Achievement, error)
	FindUserAchievementsFn     func(ctx context.Context, userID uuid.UUID) ([]model.UserAchievement, error)
	CreateUserAchievementFn    func(ctx context.Context, ua *model.UserAchievement) error
	CreateGiftBoxOpeningFn     func(ctx context.Context, gbo *model.GiftBoxOpening) error
	CountCompletedStagesFn     func(ctx context.Context, userID uuid.UUID) (int64, error)
	FindAttemptHistoryFn       func(ctx context.Context, userID uuid.UUID, offset, limit int) ([]model.StageAttempt, int64, error)
}

func (m *MockLearningRepository) CreateAttempt(ctx context.Context, attempt *model.StageAttempt) error {
	if m.CreateAttemptFn != nil { return m.CreateAttemptFn(ctx, attempt) }
	attempt.ID = uuid.New()
	return nil
}
func (m *MockLearningRepository) FindAttemptByID(ctx context.Context, attemptID uuid.UUID) (*model.StageAttempt, error) {
	if m.FindAttemptByIDFn != nil { return m.FindAttemptByIDFn(ctx, attemptID) }
	return nil, nil
}
func (m *MockLearningRepository) UpdateAttempt(ctx context.Context, attempt *model.StageAttempt) error {
	if m.UpdateAttemptFn != nil { return m.UpdateAttemptFn(ctx, attempt) }
	return nil
}
func (m *MockLearningRepository) CreateExerciseResponse(ctx context.Context, resp *model.ExerciseResponse) error {
	if m.CreateExerciseResponseFn != nil { return m.CreateExerciseResponseFn(ctx, resp) }
	return nil
}
func (m *MockLearningRepository) FindResponsesByAttemptID(ctx context.Context, attemptID uuid.UUID) ([]model.ExerciseResponse, error) {
	if m.FindResponsesByAttemptIDFn != nil { return m.FindResponsesByAttemptIDFn(ctx, attemptID) }
	return nil, nil
}
func (m *MockLearningRepository) CheckExerciseSubmitted(ctx context.Context, attemptID, exerciseID uuid.UUID) (bool, error) {
	if m.CheckExerciseSubmittedFn != nil { return m.CheckExerciseSubmittedFn(ctx, attemptID, exerciseID) }
	return false, nil
}
func (m *MockLearningRepository) FindUserStageProgress(ctx context.Context, userID, stageID uuid.UUID) (*model.UserStageProgress, error) {
	if m.FindUserStageProgressFn != nil { return m.FindUserStageProgressFn(ctx, userID, stageID) }
	return nil, nil
}
func (m *MockLearningRepository) UpsertUserStageProgress(ctx context.Context, progress *model.UserStageProgress) error {
	if m.UpsertUserStageProgressFn != nil { return m.UpsertUserStageProgressFn(ctx, progress) }
	return nil
}
func (m *MockLearningRepository) FindUserByID(ctx context.Context, userID uuid.UUID) (*model.User, error) {
	if m.FindUserByIDFn != nil { return m.FindUserByIDFn(ctx, userID) }
	return &model.User{ID: userID, Lives: 5, CurrentLevel: 1, DailyGoal: "regular"}, nil
}
func (m *MockLearningRepository) UpdateUser(ctx context.Context, user *model.User) error {
	if m.UpdateUserFn != nil { return m.UpdateUserFn(ctx, user) }
	return nil
}
func (m *MockLearningRepository) UpsertDailyActivity(ctx context.Context, log *model.DailyActivityLog) error {
	if m.UpsertDailyActivityFn != nil { return m.UpsertDailyActivityFn(ctx, log) }
	return nil
}
func (m *MockLearningRepository) UpsertStreak(ctx context.Context, streak *model.UserStreak) error {
	if m.UpsertStreakFn != nil { return m.UpsertStreakFn(ctx, streak) }
	return nil
}
func (m *MockLearningRepository) FindOrCreateStreak(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error) {
	if m.FindOrCreateStreakFn != nil { return m.FindOrCreateStreakFn(ctx, userID) }
	return &model.UserStreak{UserID: userID}, nil
}
func (m *MockLearningRepository) FindDailyActivity(ctx context.Context, userID uuid.UUID, date time.Time) (*model.DailyActivityLog, error) {
	if m.FindDailyActivityFn != nil { return m.FindDailyActivityFn(ctx, userID, date) }
	return nil, nil
}
func (m *MockLearningRepository) FindAllAchievements(ctx context.Context) ([]model.Achievement, error) {
	if m.FindAllAchievementsFn != nil { return m.FindAllAchievementsFn(ctx) }
	return nil, nil
}
func (m *MockLearningRepository) FindUserAchievements(ctx context.Context, userID uuid.UUID) ([]model.UserAchievement, error) {
	if m.FindUserAchievementsFn != nil { return m.FindUserAchievementsFn(ctx, userID) }
	return nil, nil
}
func (m *MockLearningRepository) CreateUserAchievement(ctx context.Context, ua *model.UserAchievement) error {
	if m.CreateUserAchievementFn != nil { return m.CreateUserAchievementFn(ctx, ua) }
	return nil
}
func (m *MockLearningRepository) CreateGiftBoxOpening(ctx context.Context, gbo *model.GiftBoxOpening) error {
	if m.CreateGiftBoxOpeningFn != nil { return m.CreateGiftBoxOpeningFn(ctx, gbo) }
	gbo.ID = uuid.New()
	return nil
}
func (m *MockLearningRepository) CountCompletedStages(ctx context.Context, userID uuid.UUID) (int64, error) {
	if m.CountCompletedStagesFn != nil { return m.CountCompletedStagesFn(ctx, userID) }
	return 0, nil
}
func (m *MockLearningRepository) FindAttemptHistory(ctx context.Context, userID uuid.UUID, offset, limit int) ([]model.StageAttempt, int64, error) {
	if m.FindAttemptHistoryFn != nil { return m.FindAttemptHistoryFn(ctx, userID, offset, limit) }
	return nil, 0, nil
}
