package dto

import "time"

type WeeklyStatsResponse struct {
	WeekStart        time.Time         `json:"week_start"`
	WeekEnd          time.Time         `json:"week_end"`
	StagesCompleted  int               `json:"stages_completed"`
	TotalXPEarned    int               `json:"total_xp_earned"`
	DaysActive       int               `json:"days_active"`
	DailyGoalsMet    int               `json:"daily_goals_met"`
	CurrentStreak    int               `json:"current_streak"`
	AverageScore     float64           `json:"average_score"`
	DailyBreakdown   []DailyStatEntry  `json:"daily_breakdown"`
}

type DailyStatEntry struct {
	Date            time.Time `json:"date"`
	StagesCompleted int       `json:"stages_completed"`
	XPEarned        int       `json:"xp_earned"`
	GoalMet         bool      `json:"goal_met"`
}
