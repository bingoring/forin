package repository

import (
	"context"
	"time"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type UserProfileRepository struct {
	db *gorm.DB
}

func NewUserProfileRepository(db *gorm.DB) *UserProfileRepository {
	return &UserProfileRepository{db: db}
}

func (r *UserProfileRepository) FindByIDWithProfession(ctx context.Context, id uuid.UUID) (*model.User, error) {
	var user model.User
	err := r.db.WithContext(ctx).
		Preload("Profession").
		Where("id = ? AND deleted_at IS NULL", id).
		First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserProfileRepository) Update(ctx context.Context, user *model.User) error {
	return r.db.WithContext(ctx).Save(user).Error
}

func (r *UserProfileRepository) FindStreak(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error) {
	var streak model.UserStreak
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).First(&streak).Error
	if err != nil {
		return nil, err
	}
	return &streak, nil
}

func (r *UserProfileRepository) FindOrCreateStreak(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error) {
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

func (r *UserProfileRepository) FindDailyActivity(ctx context.Context, userID uuid.UUID, date time.Time) (*model.DailyActivityLog, error) {
	var log model.DailyActivityLog
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND activity_date = ?", userID, date.Format("2006-01-02")).
		First(&log).Error
	if err != nil {
		return nil, err
	}
	return &log, nil
}
