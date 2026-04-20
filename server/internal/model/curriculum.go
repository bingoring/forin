package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Profession struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Name      string    `gorm:"not null"`
	Slug      string    `gorm:"uniqueIndex;not null"`
	IconURL   *string
	IsActive  bool      `gorm:"default:true"`
}

func (p *Profession) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

type CurriculumModule struct {
	ID                uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	ProfessionID      uuid.UUID `gorm:"type:uuid;not null;index"`
	TargetCountry     string    `gorm:"not null;size:10"`
	Title             string    `gorm:"not null"`
	Description       *string
	OrderIndex        int       `gorm:"not null"`
	MinLevelRequired  int       `gorm:"default:1"`
	IsPublished       bool      `gorm:"default:false"`
	FloorOrder        int       `gorm:"column:floor_order;not null;default:1"`
	FloorLabel        string    `gorm:"column:floor_label;not null;default:''"`
	FloorIcon         string    `gorm:"column:floor_icon;not null;default:'triage'"`
	MapAssetKey       string    `gorm:"column:map_asset_key;not null;default:''"`
	CreatedAt         time.Time

	Profession Profession `gorm:"foreignKey:ProfessionID"`
	Units      []Unit     `gorm:"foreignKey:ModuleID"`
}

func (m *CurriculumModule) BeforeCreate(tx *gorm.DB) error {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
}

type Unit struct {
	ID                   uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	ModuleID             uuid.UUID `gorm:"type:uuid;not null;index"`
	Title                string    `gorm:"not null"`
	Description          *string
	OrderIndex           int     `gorm:"not null"`
	IsPublished          bool    `gorm:"default:false"`
	LocationType         string  `gorm:"column:location_type;not null;default:'generic'"`
	MapX                 float64 `gorm:"column:map_x;type:numeric(5,2);not null;default:50.0"`
	MapY                 float64 `gorm:"column:map_y;type:numeric(5,2);not null;default:50.0"`
	HotspotLabelOverride *string `gorm:"column:hotspot_label_override"`

	Module CurriculumModule `gorm:"foreignKey:ModuleID"`
	Stages []Stage          `gorm:"foreignKey:UnitID"`
}

func (u *Unit) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

type Stage struct {
	ID                       uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UnitID                   uuid.UUID      `gorm:"type:uuid;not null;index"`
	Title                    string         `gorm:"not null"`
	ScenarioDescription      string         `gorm:"not null"`
	OrderIndex               int            `gorm:"not null"`
	DifficultyLevel          int            `gorm:"check:difficulty_level >= 1 AND difficulty_level <= 5"`
	EstimatedDurationSeconds int            `gorm:"default:300"`
	XPBase                   int            `gorm:"default:50"`
	IsPublished              bool           `gorm:"default:false"`
	SceneOpenerMd            *string        `gorm:"column:scene_opener_md"`
	SceneEndingMd            *string        `gorm:"column:scene_ending_md"`
	SceneNPCKey              *string        `gorm:"column:scene_npc_key"`
	TensionLevel             string         `gorm:"column:tension_level;not null;default:'calm'"`
	NPCMood                  pq.StringArray `gorm:"column:npc_mood;type:text[];not null;default:'{}'"`
	CreatedAt                time.Time

	Unit      Unit       `gorm:"foreignKey:UnitID"`
	Exercises []Exercise `gorm:"foreignKey:StageID"`
}

func (s *Stage) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

type Exercise struct {
	ID              uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	StageID         uuid.UUID      `gorm:"type:uuid;not null;index"`
	ExerciseType    string         `gorm:"not null"` // sentence_arrangement | word_puzzle | meaning_match | conversation
	OrderIndex      int            `gorm:"not null"`
	XPReward        int            `gorm:"default:10"`
	Content         datatypes.JSON `gorm:"type:jsonb;not null"`
	DifficultyLevel int
	AudioURL        *string
	CreatedAt       time.Time

	Stage Stage `gorm:"foreignKey:StageID"`
}

func (e *Exercise) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}
