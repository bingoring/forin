package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type NotificationPreference struct {
	ID                      uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID                  uuid.UUID  `gorm:"type:uuid;uniqueIndex;not null"`
	DailyReminderEnabled    bool       `gorm:"default:true"`
	DailyReminderTime       string     `gorm:"default:'20:00:00'"` // HH:MM:SS
	StreakWarningEnabled     bool       `gorm:"default:true"`
	AchievementEnabled      bool       `gorm:"default:true"`
	NewContentEnabled       bool       `gorm:"default:true"`
	LivesRestoredEnabled    bool       `gorm:"default:false"`
	WeeklySummaryEnabled    bool       `gorm:"default:true"`
	QuietHoursStart         *string
	QuietHoursEnd           *string

	User User `gorm:"foreignKey:UserID"`
}

func (n *NotificationPreference) BeforeCreate(tx *gorm.DB) error {
	if n.ID == uuid.Nil {
		n.ID = uuid.New()
	}
	return nil
}

type NotificationLog struct {
	ID               uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID           uuid.UUID  `gorm:"type:uuid;not null;index"`
	NotificationType string     `gorm:"not null"`
	Title            *string
	Body             *string
	SentAt           time.Time  `gorm:"autoCreateTime"`
	OpenedAt         *time.Time
	PushTicketID     *string

	User User `gorm:"foreignKey:UserID"`
}

func (NotificationLog) TableName() string { return "notification_log" }

func (n *NotificationLog) BeforeCreate(tx *gorm.DB) error {
	if n.ID == uuid.Nil {
		n.ID = uuid.New()
	}
	return nil
}
