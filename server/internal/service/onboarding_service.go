package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/google/uuid"
)

var ErrProfessionNotFound = errors.New("profession not found")

// Country data per profession (hardcoded for MVP).
var countryData = map[string][]dto.CountryResponse{
	"nurse": {
		{Code: "AU", Name: "Australia", Accent: "Australian English"},
		{Code: "UK", Name: "United Kingdom", Accent: "British English"},
		{Code: "US", Name: "United States", Accent: "American English"},
		{Code: "CA", Name: "Canada", Accent: "Canadian English"},
		{Code: "NZ", Name: "New Zealand", Accent: "New Zealand English"},
	},
	"doctor": {
		{Code: "AU", Name: "Australia", Accent: "Australian English"},
		{Code: "UK", Name: "United Kingdom", Accent: "British English"},
		{Code: "US", Name: "United States", Accent: "American English"},
		{Code: "CA", Name: "Canada", Accent: "Canadian English"},
	},
	"pharmacist": {
		{Code: "AU", Name: "Australia", Accent: "Australian English"},
		{Code: "US", Name: "United States", Accent: "American English"},
		{Code: "CA", Name: "Canada", Accent: "Canadian English"},
	},
}

type OnboardingService struct {
	onboardingRepo OnboardingRepository
	userRepo       UserProfileRepository
	cfg            *config.Config
}

func NewOnboardingService(onboardingRepo OnboardingRepository, userRepo UserProfileRepository, cfg *config.Config) *OnboardingService {
	return &OnboardingService{onboardingRepo: onboardingRepo, userRepo: userRepo, cfg: cfg}
}

func (s *OnboardingService) GetProfessions(ctx context.Context) (*dto.ProfessionsResponse, error) {
	professions, err := s.onboardingRepo.FindActiveProfessions(ctx)
	if err != nil {
		return nil, fmt.Errorf("find professions: %w", err)
	}

	var resp []dto.ProfessionResponse
	for _, p := range professions {
		resp = append(resp, dto.ProfessionResponse{
			ID:   p.ID,
			Name: p.Name,
			Slug: p.Slug,
		})
	}

	return &dto.ProfessionsResponse{Professions: resp}, nil
}

func (s *OnboardingService) GetCountries(_ context.Context, professionSlug string) (*dto.CountriesResponse, error) {
	countries, ok := countryData[professionSlug]
	if !ok {
		return nil, ErrProfessionNotFound
	}
	return &dto.CountriesResponse{Countries: countries}, nil
}

func (s *OnboardingService) SubmitAssessment(ctx context.Context, userID uuid.UUID, req dto.AssessmentSubmitRequest) (*dto.AssessmentSubmitResponse, error) {
	// Score the answers (simplified: 1 point per answer provided)
	score := len(req.Answers)
	totalQuestions := 10
	if score > totalQuestions {
		score = totalQuestions
	}

	// Determine level
	var level string
	switch {
	case score <= 3:
		level = "beginner"
	case score <= 5:
		level = "pre_intermediate"
	case score <= 8:
		level = "intermediate"
	default:
		level = "upper_intermediate"
	}

	// Update user profile
	user, err := s.userRepo.FindByIDWithProfession(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("find user: %w", err)
	}
	user.ProfessionID = &req.ProfessionID
	user.TargetCountry = &req.TargetCountry
	user.LanguageLevel = level
	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, fmt.Errorf("update user: %w", err)
	}

	// Find recommended starting module
	modules, _ := s.onboardingRepo.FindModulesByProfessionAndCountry(ctx, req.ProfessionID, req.TargetCountry)
	var recommended *dto.RecommendedModuleResponse
	skipped := 0
	if len(modules) > 0 {
		recommended = &dto.RecommendedModuleResponse{
			ID:    modules[0].ID,
			Title: modules[0].Title,
		}
	}

	return &dto.AssessmentSubmitResponse{
		DeterminedLevel:           level,
		Score:                     score,
		TotalQuestions:            totalQuestions,
		RecommendedStartingModule: recommended,
		SkippedStagesCount:        skipped,
	}, nil
}
