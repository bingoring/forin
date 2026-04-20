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
	FloorOrder       int                `json:"floor_order"`
	FloorLabel       string             `json:"floor_label"`
	FloorIcon        string             `json:"floor_icon"`
	MapAssetKey      string             `json:"map_asset_key"`
	Progress         *ModuleProgressDTO `json:"progress"`
	Units            []UnitResponse     `json:"units"`
}

type ModuleProgressDTO struct {
	Status               string  `json:"status"`
	CompletionPercentage float64 `json:"completion_percentage"`
}

type UnitResponse struct {
	ID                   uuid.UUID       `json:"id"`
	Title                string          `json:"title"`
	Description          *string         `json:"description"`
	OrderIndex           int             `json:"order_index"`
	LocationType         string          `json:"location_type"`
	MapX                 float64         `json:"map_x"`
	MapY                 float64         `json:"map_y"`
	HotspotLabelOverride *string         `json:"hotspot_label_override"`
	Stages               []StageOverview `json:"stages"`
}

type StageOverview struct {
	ID                       uuid.UUID         `json:"id"`
	Title                    string            `json:"title"`
	OrderIndex               int               `json:"order_index"`
	DifficultyLevel          int               `json:"difficulty_level"`
	DifficultyBand           string            `json:"difficulty_band"`
	EstimatedDurationSeconds int               `json:"estimated_duration_seconds"`
	TensionLevel             string            `json:"tension_level"`
	SceneNPCKey              *string           `json:"scene_npc_key"`
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
	DifficultyBand           string             `json:"difficulty_band"`
	EstimatedDurationSeconds int                `json:"estimated_duration_seconds"`
	XPBase                   int                `json:"xp_base"`
	SceneOpenerMd            *string            `json:"scene_opener_md"`
	SceneEndingMd            *string            `json:"scene_ending_md"`
	SceneNPCKey              *string            `json:"scene_npc_key"`
	TensionLevel             string             `json:"tension_level"`
	NPCMood                  []string           `json:"npc_mood"`
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
