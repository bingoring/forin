package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// VocabularyWithTranslation couples a vocabulary row with the best-available
// translation for the requested locale, falling back to canonical English.
type VocabularyWithTranslation struct {
	ID           uuid.UUID
	CanonicalEn  string
	PartOfSpeech string
	Domain       string
	// Translation is the locale-specific word if present; otherwise CanonicalEn.
	Translation string
	// Locale is the locale actually served — requested locale on hit, "en" on fallback.
	Locale string
}

type VocabularyRepository struct {
	db *gorm.DB
}

func NewVocabularyRepository(db *gorm.DB) *VocabularyRepository {
	return &VocabularyRepository{db: db}
}

// GetByIDsWithTranslation fetches vocabulary rows and pairs each with its
// translation in `locale`. If a translation is missing for a given row, the
// canonical English is returned with Locale="en".
func (r *VocabularyRepository) GetByIDsWithTranslation(
	ctx context.Context, ids []uuid.UUID, locale string,
) ([]VocabularyWithTranslation, error) {
	if len(ids) == 0 {
		return nil, nil
	}

	type row struct {
		ID             uuid.UUID
		CanonicalEn    string
		PartOfSpeech   string
		Domain         string
		TranslatedWord *string
	}

	var rows []row
	err := r.db.WithContext(ctx).
		Table("vocabulary AS v").
		Select(`v.id, v.canonical_en, v.part_of_speech, v.domain, t.word AS translated_word`).
		Joins(`LEFT JOIN vocabulary_translations AS t
		       ON t.vocab_id = v.id AND t.locale = ?`, locale).
		Where("v.id IN ?", ids).
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	out := make([]VocabularyWithTranslation, 0, len(rows))
	for _, r := range rows {
		entry := VocabularyWithTranslation{
			ID:           r.ID,
			CanonicalEn:  r.CanonicalEn,
			PartOfSpeech: r.PartOfSpeech,
			Domain:       r.Domain,
		}
		if r.TranslatedWord != nil {
			entry.Translation = *r.TranslatedWord
			entry.Locale = locale
		} else {
			entry.Translation = r.CanonicalEn
			entry.Locale = "en"
		}
		out = append(out, entry)
	}
	return out, nil
}
