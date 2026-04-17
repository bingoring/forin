package dto

import (
	"encoding/json"

	"github.com/google/uuid"
)

type CurriculumResponse struct {
	Modules []ModuleResponse `json:"modules"`
}

type ModuleResponse struct {
	ID               uuid.UUID          `json:"id"`
	Title            string             `json:"title"`
	Description      *string            `json:"description"`
	OrderIndex       int                `json:"order_index"`
	MinLevelRequired int                `json:"min_level_required"`
	Progress         *ModuleProgressDTO `json:"progress"`
	Units            []UnitResponse     `json:"units"`
}

type ModuleProgressDTO struct {
	Status               string  `json:"status"`
	CompletionPercentage float64 `json:"completion_percentage"`
}

type UnitResponse struct {
	ID          uuid.UUID       `json:"id"`
	Title       string          `json:"title"`
	Description *string         `json:"description"`
	OrderIndex  int             `json:"order_index"`
	Stages      []StageOverview `json:"stages"`
}

type StageOverview struct {
	ID                       uuid.UUID         `json:"id"`
	Title                    string            `json:"title"`
	OrderIndex               int               `json:"order_index"`
	DifficultyLevel          int               `json:"difficulty_level"`
	EstimatedDurationSeconds int               `json:"estimated_duration_seconds"`
	Progress                 *StageProgressDTO `json:"progress"`
}

type StageProgressDTO struct {
	Status    string `json:"status"`
	Stars     int    `json:"stars"`
	BestScore int    `json:"best_score"`
	Attempts  int    `json:"attempts"`
}

type StageDetailResponse struct {
	ID                       uuid.UUID          `json:"id"`
	Title                    string             `json:"title"`
	ScenarioDescription      string             `json:"scenario_description"`
	DifficultyLevel          int                `json:"difficulty_level"`
	EstimatedDurationSeconds int                `json:"estimated_duration_seconds"`
	XPBase                   int                `json:"xp_base"`
	Exercises                []ExerciseResponse `json:"exercises"`
	Progress                 *StageProgressDTO  `json:"progress"`
}

type ExerciseResponse struct {
	ID              uuid.UUID       `json:"id"`
	ExerciseType    string          `json:"exercise_type"`
	OrderIndex      int             `json:"order_index"`
	XPReward        int             `json:"xp_reward"`
	Content         json.RawMessage `json:"content"`
	DifficultyLevel int             `json:"difficulty_level"`
	AudioURL        *string         `json:"audio_url"`
}
