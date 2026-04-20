package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// VocabularyWithTranslation couples a vocabulary row with the best-available
// translation for the requested locale (or canonical English on fallback).
// Defined in the service package so the repository can depend on the
// service interface without an import cycle — mirrors how LearningRepository
// is wired.
type VocabularyWithTranslation struct {
	ID           uuid.UUID
	CanonicalEn  string
	PartOfSpeech string
	Domain       string
	Translation  string
	Locale       string
}

// VocabularyRepo is the subset of repository methods used by this service.
type VocabularyRepo interface {
	GetByIDsWithTranslation(ctx context.Context, ids []uuid.UUID, locale string) ([]VocabularyWithTranslation, error)
}

type VocabularyService struct {
	vocabRepo VocabularyRepo
	userRepo  UserProfileRepository
}

func NewVocabularyService(vocabRepo VocabularyRepo, userRepo UserProfileRepository) *VocabularyService {
	return &VocabularyService{vocabRepo: vocabRepo, userRepo: userRepo}
}

func (s *VocabularyService) LookupForUser(ctx context.Context, userID uuid.UUID, ids []uuid.UUID) (*dto.VocabularyLookupResponse, error) {
	user, err := s.userRepo.FindByIDWithProfession(ctx, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("find user: %w", err)
	}

	locale := user.NativeLanguage
	if !config.IsSupported(locale) {
		locale = config.DefaultLocale
	}

	rows, err := s.vocabRepo.GetByIDsWithTranslation(ctx, ids, locale)
	if err != nil {
		return nil, fmt.Errorf("lookup vocabulary: %w", err)
	}

	items := make([]dto.VocabularyItem, 0, len(rows))
	for _, r := range rows {
		items = append(items, dto.VocabularyItem{
			ID:           r.ID,
			CanonicalEn:  r.CanonicalEn,
			Translation:  r.Translation,
			Locale:       r.Locale,
			PartOfSpeech: r.PartOfSpeech,
			Domain:       r.Domain,
		})
	}
	return &dto.VocabularyLookupResponse{Items: items}, nil
}
