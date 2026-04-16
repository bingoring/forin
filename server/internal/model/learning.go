package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type UserStageProgress struct {
	ID               uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID           uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex:idx_user_stage"`
	StageID          uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex:idx_user_stage"`
	Status           string     `gorm:"default:'locked'"` // locked | available | completed
	Stars            int        `gorm:"default:0;check:stars >= 0 AND stars <= 3"`
	BestScore        int        `gorm:"default:0"`
	Attempts         int        `gorm:"default:0"`
	FirstCompletedAt *time.Time
	LastAttemptedAt  *time.Time

	User  User  `gorm:"foreignKey:UserID"`
	Stage Stage `gorm:"foreignKey:StageID"`
}

func (u *UserStageProgress) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

type StageAttempt struct {
	ID              uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID          uuid.UUID  `gorm:"type:uuid;not null;index"`
	StageID         uuid.UUID  `gorm:"type:uuid;not null;index"`
	StartedAt       time.Time  `gorm:"autoCreateTime"`
	CompletedAt     *time.Time
	TotalScore      *int
	StarsEarned     *int
	XPEarned        int  `gorm:"default:0"`
	MistakesCount   int  `gorm:"default:0"`
	LivesLost       int  `gorm:"default:0"`
	DurationSeconds *int

	User      User       `gorm:"foreignKey:UserID"`
	Stage     Stage      `gorm:"foreignKey:StageID"`
	Responses []ExerciseResponse `gorm:"foreignKey:AttemptID"`
}

func (s *StageAttempt) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

type ExerciseResponse struct {
	ID                   uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	AttemptID            uuid.UUID      `gorm:"type:uuid;not null;index"`
	ExerciseID           uuid.UUID      `gorm:"type:uuid;not null"`
	UserResponse         datatypes.JSON `gorm:"type:jsonb;not null"`
	IsCorrect            *bool
	Score                *int
	XPEarned             int            `gorm:"default:0"`
	AIFeedback           datatypes.JSON `gorm:"type:jsonb"`
	ResponseTimeSeconds  *int
	CreatedAt            time.Time

	Attempt  StageAttempt `gorm:"foreignKey:AttemptID"`
	Exercise Exercise     `gorm:"foreignKey:ExerciseID"`
}

func (e *ExerciseResponse) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}

type UserModuleProgress struct {
	ID                   uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID               uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex:idx_user_module"`
	ModuleID             uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex:idx_user_module"`
	Status               string     `gorm:"default:'locked'"` // locked | in_progress | completed
	CompletionPercentage float64    `gorm:"type:decimal(5,2);default:0"`
	CompletedAt          *time.Time

	User   User             `gorm:"foreignKey:UserID"`
	Module CurriculumModule `gorm:"foreignKey:ModuleID"`
}

func (u *UserModuleProgress) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
