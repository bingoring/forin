package repository

import (
	"context"
	"time"

	"github.com/forin/server/internal/model"
	"github.com/forin/server/internal/service"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type LearningRepository struct {
	db *gorm.DB
}

func NewLearningRepository(db *gorm.DB) *LearningRepository {
	return &LearningRepository{db: db}
}

func (r *LearningRepository) CreateAttempt(ctx context.Context, attempt *model.StageAttempt) error {
	return r.db.WithContext(ctx).Create(attempt).Error
}

func (r *LearningRepository) FindAttemptByID(ctx context.Context, attemptID uuid.UUID) (*model.StageAttempt, error) {
	var attempt model.StageAttempt
	err := r.db.WithContext(ctx).
		Preload("Stage").
		First(&attempt, "id = ?", attemptID).Error
	if err != nil {
		return nil, err
	}
	return &attempt, nil
}

func (r *LearningRepository) UpdateAttempt(ctx context.Context, attempt *model.StageAttempt) error {
	return r.db.WithContext(ctx).Save(attempt).Error
}

func (r *LearningRepository) CreateExerciseResponse(ctx context.Context, resp *model.ExerciseResponse) error {
	return r.db.WithContext(ctx).Create(resp).Error
}

func (r *LearningRepository) FindResponsesByAttemptID(ctx context.Context, attemptID uuid.UUID) ([]model.ExerciseResponse, error) {
	var responses []model.ExerciseResponse
	err := r.db.WithContext(ctx).
		Where("attempt_id = ?", attemptID).
		Find(&responses).Error
	if err != nil {
		return nil, err
	}
	return responses, nil
}

func (r *LearningRepository) CheckExerciseSubmitted(ctx context.Context, attemptID, exerciseID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&model.ExerciseResponse{}).
		Where("attempt_id = ? AND exercise_id = ?", attemptID, exerciseID).
		Count(&count).Error
	return count > 0, err
}

func (r *LearningRepository) FindUserStageProgress(ctx context.Context, userID, stageID uuid.UUID) (*model.UserStageProgress, error) {
	var progress model.UserStageProgress
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND stage_id = ?", userID, stageID).
		First(&progress).Error
	if err != nil {
		return nil, err
	}
	return &progress, nil
}

func (r *LearningRepository) UpsertUserStageProgress(ctx context.Context, progress *model.UserStageProgress) error {
	return r.db.WithContext(ctx).
		Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "user_id"}, {Name: "stage_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"status", "stars", "best_score", "attempts", "first_completed_at", "last_attempted_at"}),
		}).
		Create(progress).Error
}

func (r *LearningRepository) FindUserByID(ctx context.Context, userID uuid.UUID) (*model.User, error) {
	var user model.User
	err := r.db.WithContext(ctx).
		Where("id = ? AND deleted_at IS NULL", userID).
		First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *LearningRepository) UpdateUser(ctx context.Context, user *model.User) error {
	return r.db.WithContext(ctx).Save(user).Error
}

func (r *LearningRepository) UpsertDailyActivity(ctx context.Context, log *model.DailyActivityLog) error {
	return r.db.WithContext(ctx).
		Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "user_id"}, {Name: "activity_date"}},
			DoUpdates: clause.AssignmentColumns([]string{"stages_completed", "xp_earned", "daily_goal_met"}),
		}).
		Create(log).Error
}

func (r *LearningRepository) UpsertStreak(ctx context.Context, streak *model.UserStreak) error {
	return r.db.WithContext(ctx).Save(streak).Error
}

func (r *LearningRepository) FindOrCreateStreak(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error) {
	var streak model.UserStreak
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).First(&streak).Error
	if err == nil {
		return &streak, nil
	}
	if err != gorm.ErrRecordNotFound {
		return nil, err
	}
	streak = model.UserStreak{UserID: userID}
	if err := r.db.WithContext(ctx).
		Clauses(clause.OnConflict{DoNothing: true}).
		Create(&streak).Error; err != nil {
		return nil, err
	}
	return &streak, nil
}

func (r *LearningRepository) FindDailyActivity(ctx context.Context, userID uuid.UUID, date time.Time) (*model.DailyActivityLog, error) {
	var log model.DailyActivityLog
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND activity_date = ?", userID, date.Format("2006-01-02")).
		First(&log).Error
	if err != nil {
		return nil, err
	}
	return &log, nil
}

func (r *LearningRepository) FindAllAchievements(ctx context.Context) ([]model.Achievement, error) {
	var achievements []model.Achievement
	err := r.db.WithContext(ctx).Find(&achievements).Error
	return achievements, err
}

func (r *LearningRepository) FindUserAchievements(ctx context.Context, userID uuid.UUID) ([]model.UserAchievement, error) {
	var ua []model.UserAchievement
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&ua).Error
	return ua, err
}

func (r *LearningRepository) CreateUserAchievement(ctx context.Context, ua *model.UserAchievement) error {
	return r.db.WithContext(ctx).Create(ua).Error
}

func (r *LearningRepository) CreateGiftBoxOpening(ctx context.Context, gbo *model.GiftBoxOpening) error {
	return r.db.WithContext(ctx).Create(gbo).Error
}

func (r *LearningRepository) CountCompletedStages(ctx context.Context, userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&model.UserStageProgress{}).
		Where("user_id = ? AND status = 'completed'", userID).
		Count(&count).Error
	return count, err
}

func (r *LearningRepository) FindAttemptHistory(ctx context.Context, userID uuid.UUID, offset, limit int) ([]model.StageAttempt, int64, error) {
	var total int64
	r.db.WithContext(ctx).
		Model(&model.StageAttempt{}).
		Where("user_id = ? AND completed_at IS NOT NULL", userID).
		Count(&total)

	var attempts []model.StageAttempt
	err := r.db.WithContext(ctx).
		Preload("Stage").
		Where("user_id = ? AND completed_at IS NOT NULL", userID).
		Order("completed_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&attempts).Error
	if err != nil {
		return nil, 0, err
	}
	return attempts, total, nil
}

// WithTx executes fn within a database transaction.
// A new LearningRepository scoped to the transaction is passed to fn.
func (r *LearningRepository) WithTx(fn func(repo service.LearningRepository) error) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		txRepo := &LearningRepository{db: tx}
		return fn(txRepo)
	})
}
