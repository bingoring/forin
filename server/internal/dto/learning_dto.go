package dto

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// --- Requests ---

type SubmitExerciseRequest struct {
	Response     json.RawMessage `json:"response"       binding:"required"`
	ResponseTime *int            `json:"response_time"`
}

type AttemptHistoryQuery struct {
	Page     int `form:"page"      binding:"omitempty,min=1"`
	PageSize int `form:"page_size" binding:"omitempty,min=1,max=50"`
}

// --- Responses ---

type StartStageResponse struct {
	AttemptID uuid.UUID `json:"attempt_id"`
	StageID   uuid.UUID `json:"stage_id"`
	StartedAt time.Time `json:"started_at"`
	Lives     int       `json:"lives"`
}

type SubmitExerciseResponse struct {
	ExerciseID uuid.UUID       `json:"exercise_id"`
	IsCorrect  *bool           `json:"is_correct"`
	Score      *int            `json:"score,omitempty"`
	XPEarned   int             `json:"xp_earned"`
	LivesAfter int             `json:"lives_after"`
	LivesLost  int             `json:"lives_lost"`
	Details    json.RawMessage `json:"details,omitempty"`
}

type CompleteAttemptResponse struct {
	AttemptID        uuid.UUID             `json:"attempt_id"`
	StageID          uuid.UUID             `json:"stage_id"`
	TotalScore       int                   `json:"total_score"`
	StarsEarned      int                   `json:"stars_earned"`
	XPEarned         int                   `json:"xp_earned"`
	MistakesCount    int                   `json:"mistakes_count"`
	DurationSeconds  int                   `json:"duration_seconds"`
	LevelUp          *LevelUpResponse      `json:"level_up"`
	StreakUpdate     *StreakUpdateResponse `json:"streak_update"`
	Achievements     []AchievementUnlocked `json:"achievements"`
	GiftBox          *GiftBoxAwarded       `json:"gift_box"`
	UnlockedModuleID *uuid.UUID            `json:"unlocked_module_id"`
}

type LevelUpResponse struct {
	PreviousLevel int    `json:"previous_level"`
	NewLevel      int    `json:"new_level"`
	NewTitle      string `json:"new_title"`
}

type StreakUpdateResponse struct {
	CurrentStreak int  `json:"current_streak"`
	WasExtended   bool `json:"was_extended"`
	MilestoneHit  *int `json:"milestone_hit,omitempty"`
	// ShieldUsed is true when a streak shield was consumed on this
	// update to preserve the streak across a missed day.
	ShieldUsed bool `json:"shield_used"`
	// ShieldEarned is true when hitting this milestone granted a shield.
	ShieldEarned bool `json:"shield_earned"`
	// StreakShields is the remaining shield balance after this update.
	StreakShields int `json:"streak_shields"`
}

type AchievementUnlocked struct {
	ID   uuid.UUID `json:"id"`
	Slug string    `json:"slug"`
	Name string    `json:"name"`
}

type GiftBoxAwarded struct {
	ID      uuid.UUID `json:"id"`
	BoxType string    `json:"box_type"`
}

type AttemptHistoryResponse struct {
	Attempts   []AttemptSummary `json:"attempts"`
	TotalCount int64            `json:"total_count"`
	Page       int              `json:"page"`
	PageSize   int              `json:"page_size"`
}

type AttemptSummary struct {
	ID              uuid.UUID  `json:"id"`
	StageID         uuid.UUID  `json:"stage_id"`
	StageTitle      string     `json:"stage_title"`
	StarsEarned     *int       `json:"stars_earned"`
	XPEarned        int        `json:"xp_earned"`
	CompletedAt     *time.Time `json:"completed_at"`
	DurationSeconds *int       `json:"duration_seconds"`
}
