package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID             uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Email          string     `gorm:"uniqueIndex;not null"`
	PasswordHash   *string    `gorm:"column:password_hash"`
	DisplayName    string     `gorm:"not null"`
	NativeLanguage string     `gorm:"column:native_language;size:8;not null;default:'ko'"`
	AvatarURL      *string
	ProfessionID   *uuid.UUID
	TargetCountry  *string    `gorm:"size:10"`
	LanguageLevel  string     `gorm:"default:'beginner'"`
	DailyGoal      string     `gorm:"default:'regular'"`
	CurrentXP      int        `gorm:"default:0"`
	TotalXP        int        `gorm:"default:0"`
	CurrentLevel   int        `gorm:"default:1"`
	Gems           int        `gorm:"default:0"`
	Catnip         int        `gorm:"default:0"`
	Lives          int        `gorm:"default:5"`
	LivesLastRefillAt *time.Time
	CatName        string     `gorm:"default:'Mittens'"`
	IsPremium      bool       `gorm:"default:false"`
	PremiumExpiresAt *time.Time
	PushToken      *string
	Timezone       string     `gorm:"default:'UTC'"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
	DeletedAt      gorm.DeletedAt `gorm:"index"`

	Profession     *Profession `gorm:"foreignKey:ProfessionID"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

type UserOAuthProvider struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID      uuid.UUID `gorm:"type:uuid;not null;index"`
	Provider    string    `gorm:"not null"`
	ProviderUID string    `gorm:"not null"`
	CreatedAt   time.Time

	User User `gorm:"foreignKey:UserID"`
}

func (UserOAuthProvider) TableName() string {
	return "user_oauth_providers"
}

func (u *UserOAuthProvider) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
