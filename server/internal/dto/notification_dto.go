package dto

type UpdateNotificationPrefsRequest struct {
	DailyReminderEnabled *bool   `json:"daily_reminder_enabled"`
	DailyReminderTime    *string `json:"daily_reminder_time"    binding:"omitempty"`
	StreakWarningEnabled *bool   `json:"streak_warning_enabled"`
	AchievementEnabled   *bool   `json:"achievement_enabled"`
	NewContentEnabled    *bool   `json:"new_content_enabled"`
	LivesRestoredEnabled *bool   `json:"lives_restored_enabled"`
	WeeklySummaryEnabled *bool   `json:"weekly_summary_enabled"`
	QuietHoursStart      *string `json:"quiet_hours_start"      binding:"omitempty"`
	QuietHoursEnd        *string `json:"quiet_hours_end"        binding:"omitempty"`
}

type NotificationPrefsResponse struct {
	DailyReminderEnabled bool    `json:"daily_reminder_enabled"`
	DailyReminderTime    string  `json:"daily_reminder_time"`
	StreakWarningEnabled bool    `json:"streak_warning_enabled"`
	AchievementEnabled   bool    `json:"achievement_enabled"`
	NewContentEnabled    bool    `json:"new_content_enabled"`
	LivesRestoredEnabled bool    `json:"lives_restored_enabled"`
	WeeklySummaryEnabled bool    `json:"weekly_summary_enabled"`
	QuietHoursStart      *string `json:"quiet_hours_start"`
	QuietHoursEnd        *string `json:"quiet_hours_end"`
}
