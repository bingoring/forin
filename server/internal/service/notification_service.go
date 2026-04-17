package service

import (
	"context"
	"fmt"
	"time"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/google/uuid"
)

type NotificationService struct {
	notifRepo   NotificationRepository
	profileRepo UserProfileRepository
	cfg         *config.Config
}

func NewNotificationService(notifRepo NotificationRepository, profileRepo UserProfileRepository, cfg *config.Config) *NotificationService {
	return &NotificationService{notifRepo: notifRepo, profileRepo: profileRepo, cfg: cfg}
}

func (s *NotificationService) GetPreferences(ctx context.Context, userID uuid.UUID) (*dto.NotificationPrefsResponse, error) {
	pref, err := s.notifRepo.FindOrCreatePreferences(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("find preferences: %w", err)
	}

	resp := &dto.NotificationPrefsResponse{
		DailyReminderEnabled: pref.DailyReminderEnabled,
		DailyReminderTime:    pref.DailyReminderTime,
		StreakWarningEnabled: pref.StreakWarningEnabled,
		AchievementEnabled:   pref.AchievementEnabled,
		NewContentEnabled:    pref.NewContentEnabled,
		LivesRestoredEnabled: pref.LivesRestoredEnabled,
		WeeklySummaryEnabled: pref.WeeklySummaryEnabled,
		QuietHoursStart:      pref.QuietHoursStart,
		QuietHoursEnd:        pref.QuietHoursEnd,
	}

	return resp, nil
}

func (s *NotificationService) UpdatePreferences(ctx context.Context, userID uuid.UUID, req dto.UpdateNotificationPrefsRequest) (*dto.NotificationPrefsResponse, error) {
	pref, err := s.notifRepo.FindOrCreatePreferences(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("find preferences: %w", err)
	}

	if req.DailyReminderEnabled != nil {
		pref.DailyReminderEnabled = *req.DailyReminderEnabled
	}
	if req.DailyReminderTime != nil {
		pref.DailyReminderTime = *req.DailyReminderTime
	}
	if req.StreakWarningEnabled != nil {
		pref.StreakWarningEnabled = *req.StreakWarningEnabled
	}
	if req.AchievementEnabled != nil {
		pref.AchievementEnabled = *req.AchievementEnabled
	}
	if req.NewContentEnabled != nil {
		pref.NewContentEnabled = *req.NewContentEnabled
	}
	if req.LivesRestoredEnabled != nil {
		pref.LivesRestoredEnabled = *req.LivesRestoredEnabled
	}
	if req.WeeklySummaryEnabled != nil {
		pref.WeeklySummaryEnabled = *req.WeeklySummaryEnabled
	}
	if req.QuietHoursStart != nil {
		pref.QuietHoursStart = req.QuietHoursStart
	}
	if req.QuietHoursEnd != nil {
		pref.QuietHoursEnd = req.QuietHoursEnd
	}

	if err := s.notifRepo.UpdatePreferences(ctx, pref); err != nil {
		return nil, fmt.Errorf("update preferences: %w", err)
	}

	return s.GetPreferences(ctx, userID)
}

func (s *NotificationService) GetWeeklyStats(ctx context.Context, userID uuid.UUID) (*dto.WeeklyStatsResponse, error) {
	now := time.Now()
	weekday := now.Weekday()
	daysFromMonday := int(weekday) - 1
	if daysFromMonday < 0 {
		daysFromMonday = 6 // Sunday
	}
	weekStart := now.AddDate(0, 0, -daysFromMonday).Truncate(24 * time.Hour)
	weekEnd := weekStart.AddDate(0, 0, 6)

	logs, err := s.notifRepo.FindWeeklyActivity(ctx, userID, weekStart, weekEnd)
	if err != nil {
		return nil, fmt.Errorf("find weekly activity: %w", err)
	}

	streak, _ := s.profileRepo.FindOrCreateStreak(ctx, userID)

	totalStages := 0
	totalXP := 0
	daysActive := 0
	goalsMet := 0
	totalScore := 0

	var daily []dto.DailyStatEntry
	for _, log := range logs {
		totalStages += log.StagesCompleted
		totalXP += log.XPEarned
		if log.StagesCompleted > 0 {
			daysActive++
		}
		if log.DailyGoalMet {
			goalsMet++
		}
		totalScore += log.XPEarned

		daily = append(daily, dto.DailyStatEntry{
			Date:            log.ActivityDate,
			StagesCompleted: log.StagesCompleted,
			XPEarned:        log.XPEarned,
			GoalMet:         log.DailyGoalMet,
		})
	}

	avgScore := 0.0
	if totalStages > 0 {
		avgScore = float64(totalXP) / float64(totalStages)
	}

	currentStreak := 0
	if streak != nil {
		currentStreak = streak.CurrentStreak
	}

	return &dto.WeeklyStatsResponse{
		WeekStart:       weekStart,
		WeekEnd:         weekEnd,
		StagesCompleted: totalStages,
		TotalXPEarned:   totalXP,
		DaysActive:      daysActive,
		DailyGoalsMet:   goalsMet,
		CurrentStreak:   currentStreak,
		AverageScore:    avgScore,
		DailyBreakdown:  daily,
	}, nil
}

