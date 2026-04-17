package testutil

import (
	"context"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
)

type MockCurriculumRepository struct {
	FindModulesByProfessionAndCountryFn func(ctx context.Context, professionID uuid.UUID, targetCountry string) ([]model.CurriculumModule, error)
	FindStageByIDFn                     func(ctx context.Context, stageID uuid.UUID) (*model.Stage, error)
	FindExerciseByIDFn                  func(ctx context.Context, exerciseID uuid.UUID) (*model.Exercise, error)
	FindUserStageProgressFn             func(ctx context.Context, userID uuid.UUID, stageIDs []uuid.UUID) ([]model.UserStageProgress, error)
	FindUserModuleProgressFn            func(ctx context.Context, userID uuid.UUID, moduleIDs []uuid.UUID) ([]model.UserModuleProgress, error)
}

func (m *MockCurriculumRepository) FindModulesByProfessionAndCountry(ctx context.Context, professionID uuid.UUID, targetCountry string) ([]model.CurriculumModule, error) {
	if m.FindModulesByProfessionAndCountryFn != nil {
		return m.FindModulesByProfessionAndCountryFn(ctx, professionID, targetCountry)
	}
	return nil, nil
}

func (m *MockCurriculumRepository) FindStageByID(ctx context.Context, stageID uuid.UUID) (*model.Stage, error) {
	if m.FindStageByIDFn != nil {
		return m.FindStageByIDFn(ctx, stageID)
	}
	return nil, nil
}

func (m *MockCurriculumRepository) FindExerciseByID(ctx context.Context, exerciseID uuid.UUID) (*model.Exercise, error) {
	if m.FindExerciseByIDFn != nil {
		return m.FindExerciseByIDFn(ctx, exerciseID)
	}
	return nil, nil
}

func (m *MockCurriculumRepository) FindUserStageProgress(ctx context.Context, userID uuid.UUID, stageIDs []uuid.UUID) ([]model.UserStageProgress, error) {
	if m.FindUserStageProgressFn != nil {
		return m.FindUserStageProgressFn(ctx, userID, stageIDs)
	}
	return nil, nil
}

func (m *MockCurriculumRepository) FindUserModuleProgress(ctx context.Context, userID uuid.UUID, moduleIDs []uuid.UUID) ([]model.UserModuleProgress, error) {
	if m.FindUserModuleProgressFn != nil {
		return m.FindUserModuleProgressFn(ctx, userID, moduleIDs)
	}
	return nil, nil
}
