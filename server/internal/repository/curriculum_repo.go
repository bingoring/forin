package repository

import (
	"context"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CurriculumRepository struct {
	db *gorm.DB
}

func NewCurriculumRepository(db *gorm.DB) *CurriculumRepository {
	return &CurriculumRepository{db: db}
}

func (r *CurriculumRepository) FindModulesByProfessionAndCountry(ctx context.Context, professionID uuid.UUID, targetCountry string) ([]model.CurriculumModule, error) {
	var modules []model.CurriculumModule
	err := r.db.WithContext(ctx).
		Where("profession_id = ? AND target_country = ? AND is_published = true", professionID, targetCountry).
		Preload("Units", func(db *gorm.DB) *gorm.DB {
			return db.Where("is_published = true").Order("order_index ASC")
		}).
		Preload("Units.Stages", func(db *gorm.DB) *gorm.DB {
			return db.Where("is_published = true").Order("order_index ASC")
		}).
		Order("order_index ASC").
		Find(&modules).Error
	if err != nil {
		return nil, err
	}
	return modules, nil
}

func (r *CurriculumRepository) FindStageByID(ctx context.Context, stageID uuid.UUID) (*model.Stage, error) {
	var stage model.Stage
	err := r.db.WithContext(ctx).
		Preload("Exercises", func(db *gorm.DB) *gorm.DB {
			return db.Order("order_index ASC")
		}).
		First(&stage, "id = ?", stageID).Error
	if err != nil {
		return nil, err
	}
	return &stage, nil
}

func (r *CurriculumRepository) FindExerciseByID(ctx context.Context, exerciseID uuid.UUID) (*model.Exercise, error) {
	var exercise model.Exercise
	err := r.db.WithContext(ctx).First(&exercise, "id = ?", exerciseID).Error
	if err != nil {
		return nil, err
	}
	return &exercise, nil
}

func (r *CurriculumRepository) FindUserStageProgress(ctx context.Context, userID uuid.UUID, stageIDs []uuid.UUID) ([]model.UserStageProgress, error) {
	if len(stageIDs) == 0 {
		return nil, nil
	}
	var progress []model.UserStageProgress
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND stage_id IN ?", userID, stageIDs).
		Find(&progress).Error
	if err != nil {
		return nil, err
	}
	return progress, nil
}

func (r *CurriculumRepository) FindUserModuleProgress(ctx context.Context, userID uuid.UUID, moduleIDs []uuid.UUID) ([]model.UserModuleProgress, error) {
	if len(moduleIDs) == 0 {
		return nil, nil
	}
	var progress []model.UserModuleProgress
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND module_id IN ?", userID, moduleIDs).
		Find(&progress).Error
	if err != nil {
		return nil, err
	}
	return progress, nil
}
