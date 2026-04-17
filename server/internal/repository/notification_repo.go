package repository

import (
	"context"
	"time"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type NotificationRepository struct {
	db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) *NotificationRepository {
	return &NotificationRepository{db: db}
}

func (r *NotificationRepository) FindOrCreatePreferences(ctx context.Context, userID uuid.UUID) (*model.NotificationPreference, error) {
	var pref model.NotificationPreference
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).First(&pref).Error
	if err == nil {
		return &pref, nil
	}
	if err != gorm.ErrRecordNotFound {
		return nil, err
	}
	pref = model.NotificationPreference{UserID: userID}
	if err := r.db.WithContext(ctx).
		Clauses(clause.OnConflict{DoNothing: true}).
		Create(&pref).Error; err != nil {
		return nil, err
	}
	return &pref, nil
}

func (r *NotificationRepository) UpdatePreferences(ctx context.Context, pref *model.NotificationPreference) error {
	return r.db.WithContext(ctx).Save(pref).Error
}

func (r *NotificationRepository) CreateLog(ctx context.Context, log *model.NotificationLog) error {
	return r.db.WithContext(ctx).Create(log).Error
}

func (r *NotificationRepository) FindWeeklyActivity(ctx context.Context, userID uuid.UUID, from, to time.Time) ([]model.DailyActivityLog, error) {
	var logs []model.DailyActivityLog
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND activity_date >= ? AND activity_date <= ?", userID, from.Format("2006-01-02"), to.Format("2006-01-02")).
		Order("activity_date ASC").
		Find(&logs).Error
	return logs, err
}

func (r *NotificationRepository) FindUsersWithPushToken(ctx context.Context) ([]model.User, error) {
	var users []model.User
	err := r.db.WithContext(ctx).
		Where("push_token IS NOT NULL AND push_token != '' AND deleted_at IS NULL").
		Find(&users).Error
	return users, err
}
