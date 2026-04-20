package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Vocabulary struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	CanonicalEn  string    `gorm:"column:canonical_en;not null;uniqueIndex:idx_vocab_canonical"`
	PartOfSpeech string    `gorm:"column:part_of_speech;not null"`
	Domain       string    `gorm:"not null;index:idx_vocab_domain"`
	CEFRLevel    *string   `gorm:"column:cefr_level"`
	Note         *string
	CreatedAt    time.Time

	Translations []VocabularyTranslation `gorm:"foreignKey:VocabID"`
}

func (Vocabulary) TableName() string { return "vocabulary" }

func (v *Vocabulary) BeforeCreate(tx *gorm.DB) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}
	return nil
}

type VocabularyTranslation struct {
	VocabID uuid.UUID `gorm:"type:uuid;primaryKey;column:vocab_id"`
	Locale  string    `gorm:"primaryKey;size:8"`
	Word    string    `gorm:"not null"`
	Note    *string
}

func (VocabularyTranslation) TableName() string { return "vocabulary_translations" }
