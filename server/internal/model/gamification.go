package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type CatItem struct {
	ID               uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Name             string    `gorm:"not null"`
	Description      *string
	Slot             string    `gorm:"not null"` // hat | outfit | accessory | background | expression
	Rarity           string    `gorm:"not null"` // common | uncommon | rare | epic | legendary
	ImageURL         string    `gorm:"not null"`
	CatnipValue      int       `gorm:"not null"`
	ShopPriceCatnip  *int
	IsActive         bool      `gorm:"default:true"`
	ProfessionTheme  *string
	CountryTheme     *string
	CreatedAt        time.Time
}

func (c *CatItem) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

type UserInventory struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID       uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_item"`
	ItemID       uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_item"`
	AcquiredAt   time.Time `gorm:"autoCreateTime"`
	AcquiredFrom string    `gorm:"not null"` // gift_box | shop | achievement | event
	IsEquipped   bool      `gorm:"default:false"`

	User User    `gorm:"foreignKey:UserID"`
	Item CatItem `gorm:"foreignKey:ItemID"`
}

func (UserInventory) TableName() string { return "user_inventory" }

func (u *UserInventory) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

type GiftBoxOpening struct {
	ID           uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID       uuid.UUID  `gorm:"type:uuid;not null;index"`
	BoxType      string     `gorm:"not null"` // basic | silver | gold | legendary
	ItemID       *uuid.UUID `gorm:"type:uuid"`
	WasDuplicate bool       `gorm:"default:false"`
	CatnipEarned int        `gorm:"default:0"`
	StageID      *uuid.UUID `gorm:"type:uuid"`
	OpenedAt     time.Time  `gorm:"autoCreateTime"`

	User  User    `gorm:"foreignKey:UserID"`
	Item  *CatItem `gorm:"foreignKey:ItemID"`
	Stage *Stage   `gorm:"foreignKey:StageID"`
}

func (g *GiftBoxOpening) BeforeCreate(tx *gorm.DB) error {
	if g.ID == uuid.Nil {
		g.ID = uuid.New()
	}
	return nil
}

type Achievement struct {
	ID             uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Slug           string         `gorm:"uniqueIndex;not null"`
	Name           string         `gorm:"not null"`
	Description    string         `gorm:"not null"`
	IconURL        *string
	RewardType     string         `gorm:"not null"` // xp | gift_box | item | catnip
	RewardValue    datatypes.JSON `gorm:"type:jsonb;not null"`
	ConditionType  string         `gorm:"not null"` // streak | stage_count | perfect_stages | module_complete | custom
	ConditionValue datatypes.JSON `gorm:"type:jsonb;not null"`
}

func (a *Achievement) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}

type UserAchievement struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID        uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_achievement"`
	AchievementID uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_achievement"`
	UnlockedAt    time.Time `gorm:"autoCreateTime"`

	User        User        `gorm:"foreignKey:UserID"`
	Achievement Achievement `gorm:"foreignKey:AchievementID"`
}

func (u *UserAchievement) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
