package service

import (
	"testing"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestComputeStageUnlockStatus_FirstStageAvailable(t *testing.T) {
	stageID := uuid.New()
	modules := []model.CurriculumModule{
		{Units: []model.Unit{
			{Stages: []model.Stage{{ID: stageID}}},
		}},
	}

	result := ComputeStageUnlockStatus(modules, map[uuid.UUID]*model.UserStageProgress{})
	assert.Equal(t, "available", result[stageID])
}

func TestComputeStageUnlockStatus_SecondStageLockedUntilFirstComplete(t *testing.T) {
	s1 := uuid.New()
	s2 := uuid.New()
	modules := []model.CurriculumModule{
		{Units: []model.Unit{
			{Stages: []model.Stage{{ID: s1}, {ID: s2}}},
		}},
	}

	// s1 not completed
	result := ComputeStageUnlockStatus(modules, map[uuid.UUID]*model.UserStageProgress{})
	assert.Equal(t, "available", result[s1])
	assert.Equal(t, "locked", result[s2])
}

func TestComputeStageUnlockStatus_SecondStageUnlockedAfterFirstComplete(t *testing.T) {
	s1 := uuid.New()
	s2 := uuid.New()
	modules := []model.CurriculumModule{
		{Units: []model.Unit{
			{Stages: []model.Stage{{ID: s1}, {ID: s2}}},
		}},
	}

	progress := map[uuid.UUID]*model.UserStageProgress{
		s1: {StageID: s1, Status: "completed"},
	}

	result := ComputeStageUnlockStatus(modules, progress)
	assert.Equal(t, "completed", result[s1])
	assert.Equal(t, "available", result[s2])
}

func TestComputeStageUnlockStatus_NextUnitLocked_LessThan80Percent(t *testing.T) {
	s1 := uuid.New()
	s2 := uuid.New()
	s3 := uuid.New()
	s4 := uuid.New() // first stage of unit 2

	modules := []model.CurriculumModule{
		{Units: []model.Unit{
			{Stages: []model.Stage{{ID: s1}, {ID: s2}, {ID: s3}}},       // unit 1: 3 stages
			{Stages: []model.Stage{{ID: s4}}},                            // unit 2
		}},
	}

	// Only 1 of 3 completed in unit 1 = 33% < 80%
	progress := map[uuid.UUID]*model.UserStageProgress{
		s1: {StageID: s1, Status: "completed"},
	}

	result := ComputeStageUnlockStatus(modules, progress)
	assert.Equal(t, "locked", result[s4])
}

func TestComputeStageUnlockStatus_NextUnitUnlocked_80PercentComplete(t *testing.T) {
	s1 := uuid.New()
	s2 := uuid.New()
	s3 := uuid.New()
	s4 := uuid.New()
	s5 := uuid.New()
	s6 := uuid.New() // first stage of unit 2

	modules := []model.CurriculumModule{
		{Units: []model.Unit{
			{Stages: []model.Stage{{ID: s1}, {ID: s2}, {ID: s3}, {ID: s4}, {ID: s5}}}, // 5 stages
			{Stages: []model.Stage{{ID: s6}}},
		}},
	}

	// 4 of 5 completed = 80%
	progress := map[uuid.UUID]*model.UserStageProgress{
		s1: {StageID: s1, Status: "completed"},
		s2: {StageID: s2, Status: "completed"},
		s3: {StageID: s3, Status: "completed"},
		s4: {StageID: s4, Status: "completed"},
	}

	result := ComputeStageUnlockStatus(modules, progress)
	assert.Equal(t, "available", result[s6])
}
