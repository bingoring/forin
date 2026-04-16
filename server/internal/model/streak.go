package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserStreak struct {
	ID                uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID            uuid.UUID  `gorm:"type:uuid;uniqueIndex;not null"`
	CurrentStreak     int        `gorm:"default:0"`
	LongestStreak     int        `gorm:"default:0"`
	LastActivityDate  *time.Time `gorm:"type:date"`
	StreakShields     int        `gorm:"default:0"`
	ShieldUsedOn      *time.Time `gorm:"type:date"`
	UpdatedAt         time.Time

	User User `gorm:"foreignKey:UserID"`
}

func (u *UserStreak) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

type DailyActivityLog struct {
	ID               uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID           uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_date"`
	ActivityDate     time.Time `gorm:"type:date;not null;uniqueIndex:idx_user_date"`
	StagesCompleted  int       `gorm:"default:0"`
	XPEarned         int       `gorm:"default:0"`
	DailyGoalMet     bool      `gorm:"default:false"`

	User User `gorm:"foreignKey:UserID"`
}

func (d *DailyActivityLog) BeforeCreate(tx *gorm.DB) error {
	if d.ID == uuid.Nil {
		d.ID = uuid.New()
	}
	return nil
}
