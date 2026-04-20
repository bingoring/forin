package model

import (
	"time"

	"github.com/google/uuid"
)

type UserUnlockedFloor struct {
	UserID     uuid.UUID `gorm:"type:uuid;primaryKey;column:user_id"`
	ModuleID   uuid.UUID `gorm:"type:uuid;primaryKey;column:module_id"`
	UnlockedAt time.Time `gorm:"column:unlocked_at;not null"`
}

func (UserUnlockedFloor) TableName() string { return "user_unlocked_floors" }
