package dto

import (
	"time"

	"github.com/google/uuid"
)

// --- Requests ---

type UpdateProfileRequest struct {
	DisplayName   *string `json:"display_name"   binding:"omitempty,min=1,max=100"`
	CatName       *string `json:"cat_name"       binding:"omitempty,min=1,max=50"`
	DailyGoal     *string `json:"daily_goal"     binding:"omitempty,oneof=casual regular intensive"`
	TargetCountry *string `json:"target_country" binding:"omitempty,max=10"`
	Timezone      *string `json:"timezone"       binding:"omitempty,max=100"`
}

// --- Responses ---

type UserProfileResponse struct {
	ID            uuid.UUID              `json:"id"`
	Email         string                 `json:"email"`
	DisplayName   string                 `json:"display_name"`
	AvatarURL     *string                `json:"avatar_url"`
	Profession    *ProfessionResponse    `json:"profession"`
	TargetCountry *string                `json:"target_country"`
	LanguageLevel string                 `json:"language_level"`
	DailyGoal     string                 `json:"daily_goal"`
	CurrentXP     int                    `json:"current_xp"`
	XPToNextLevel int                    `json:"xp_to_next_level"`
	TotalXP       int                    `json:"total_xp"`
	CurrentLevel  int                    `json:"current_level"`
	LevelTitle    string                 `json:"level_title"`
	Lives         LivesResponse          `json:"lives"`
	Gems          int                    `json:"gems"`
	Catnip        int                    `json:"catnip"`
	IsPremium     bool                   `json:"is_premium"`
	CatName       string                 `json:"cat_name"`
	Streak        StreakResponse          `json:"streak"`
	DailyProgress DailyProgressResponse  `json:"daily_progress"`
	Timezone      string                 `json:"timezone"`
	CreatedAt     time.Time              `json:"created_at"`
}

type ProfessionResponse struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
	Slug string    `json:"slug"`
}

type LivesResponse struct {
	Current       int  `json:"current"`
	Max           int  `json:"max"`
	SecondsToNext *int `json:"seconds_to_next,omitempty"`
}

type StreakResponse struct {
	CurrentStreak int `json:"current_streak"`
	LongestStreak int `json:"longest_streak"`
	StreakShields  int `json:"streak_shields"`
}

type DailyProgressResponse struct {
	GoalType        string `json:"goal_type"`
	XPTarget        int    `json:"xp_target"`
	XPToday         int    `json:"xp_today"`
	StagesCompleted int    `json:"stages_completed"`
	GoalMet         bool   `json:"goal_met"`
}
