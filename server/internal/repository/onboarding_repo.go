package repository

import (
	"context"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OnboardingRepository struct {
	db *gorm.DB
}

func NewOnboardingRepository(db *gorm.DB) *OnboardingRepository {
	return &OnboardingRepository{db: db}
}

func (r *OnboardingRepository) FindActiveProfessions(ctx context.Context) ([]model.Profession, error) {
	var professions []model.Profession
	err := r.db.WithContext(ctx).
		Where("is_active = true").
		Find(&professions).Error
	return professions, err
}

func (r *OnboardingRepository) FindModulesByProfessionAndCountry(ctx context.Context, professionID uuid.UUID, country string) ([]model.CurriculumModule, error) {
	var modules []model.CurriculumModule
	err := r.db.WithContext(ctx).
		Where("profession_id = ? AND target_country = ? AND is_published = true", professionID, country).
		Order("order_index ASC").
		Find(&modules).Error
	return modules, err
}
