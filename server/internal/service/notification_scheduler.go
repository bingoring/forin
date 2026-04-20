package service

import (
	"context"
	"time"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// Pusher is the narrow contract the scheduler uses to deliver pushes.
// PushService satisfies it; tests can swap a recorder implementation.
type Pusher interface {
	Send(ctx context.Context, userID uuid.UUID, pushToken, notifType, title, body string) error
}

// NotificationScheduler ticks on a timer and dispatches daily reminders
// and streak-warning pushes. It is intentionally simple: per-tick it
// loads every user with a push token and decides one-at-a-time whether
// to send. That suits an MVP with a small active user base; swap to a
// DB-level targeting query when the user count grows.
type NotificationScheduler struct {
	notifRepo   NotificationRepository
	profileRepo UserProfileRepository
	pusher      Pusher
	log         *zap.Logger
	interval    time.Duration
}

func NewNotificationScheduler(
	notifRepo NotificationRepository,
	profileRepo UserProfileRepository,
	pusher Pusher,
	log *zap.Logger,
) *NotificationScheduler {
	return &NotificationScheduler{
		notifRepo:   notifRepo,
		profileRepo: profileRepo,
		pusher:      pusher,
		log:         log,
		interval:    10 * time.Minute,
	}
}

// Run blocks until ctx is cancelled, ticking at `interval`.
func (s *NotificationScheduler) Run(ctx context.Context) {
	ticker := time.NewTicker(s.interval)
	defer ticker.Stop()

	// Fire once immediately so a just-restarted server can deliver any
	// overdue reminders without waiting for the first tick.
	s.Tick(ctx, time.Now().UTC())

	for {
		select {
		case <-ctx.Done():
			return
		case t := <-ticker.C:
			s.Tick(ctx, t.UTC())
		}
	}
}

// Tick is the unit of work — public so tests can drive the clock.
func (s *NotificationScheduler) Tick(ctx context.Context, nowUTC time.Time) {
	users, err := s.notifRepo.FindUsersWithPushToken(ctx)
	if err != nil {
		s.log.Warn("scheduler: fetch users", zap.Error(err))
		return
	}
	for i := range users {
		u := &users[i]
		s.processUser(ctx, u, nowUTC)
	}
}

func (s *NotificationScheduler) processUser(ctx context.Context, user *model.User, nowUTC time.Time) {
	if user.PushToken == nil || *user.PushToken == "" {
		return
	}

	pref, err := s.notifRepo.FindOrCreatePreferences(ctx, user.ID)
	if err != nil {
		s.log.Warn("scheduler: fetch prefs", zap.Error(err), zap.String("user", user.ID.String()))
		return
	}

	loc := userLocation(user.Timezone)
	nowLocal := nowUTC.In(loc)
	todayLocal := startOfDay(nowLocal)

	// 1. Daily reminder: if enabled, time-of-day matches, and not sent today,
	//    and the user has not already trained today.
	if pref.DailyReminderEnabled {
		s.maybeSendDailyReminder(ctx, user, pref, nowLocal, todayLocal)
	}

	// 2. Streak warning: if enabled, near end of the local day, user has a
	//    streak to protect, last activity was yesterday, nothing sent today.
	if pref.StreakWarningEnabled {
		s.maybeSendStreakWarning(ctx, user, nowLocal, todayLocal)
	}
}

func (s *NotificationScheduler) maybeSendDailyReminder(
	ctx context.Context,
	user *model.User,
	pref *model.NotificationPreference,
	nowLocal time.Time,
	todayLocal time.Time,
) {
	remindAt, ok := parseTimeOfDay(pref.DailyReminderTime)
	if !ok {
		return
	}

	// Skip if the current tick is not in the ±(interval/2) window around
	// the scheduled time. The 10-min tick already coarsens things; we
	// accept firing at the first tick at-or-after the target.
	scheduled := time.Date(
		nowLocal.Year(), nowLocal.Month(), nowLocal.Day(),
		remindAt.Hour(), remindAt.Minute(), 0, 0, nowLocal.Location(),
	)
	if nowLocal.Before(scheduled) || nowLocal.Sub(scheduled) > s.interval {
		return
	}

	if s.alreadySentToday(ctx, user.ID, "daily_reminder", todayLocal) {
		return
	}

	// Skip if the user already trained today — they don't need a nudge.
	activity, _ := s.notifRepo.FindDailyActivityForDate(ctx, user.ID, todayLocal)
	if activity != nil && activity.StagesCompleted > 0 {
		return
	}

	s.send(ctx, user, "daily_reminder",
		"Time to train",
		"Keep your streak alive — a quick session is all it takes.",
	)
}

func (s *NotificationScheduler) maybeSendStreakWarning(
	ctx context.Context,
	user *model.User,
	nowLocal time.Time,
	todayLocal time.Time,
) {
	// Only fire in the last two hours of the user's day.
	if nowLocal.Hour() < 22 {
		return
	}

	streak, err := s.profileRepo.FindStreak(ctx, user.ID)
	if err != nil || streak == nil || streak.CurrentStreak < 2 {
		return
	}
	// Already trained today? Streak is safe — skip.
	activity, _ := s.notifRepo.FindDailyActivityForDate(ctx, user.ID, todayLocal)
	if activity != nil && activity.StagesCompleted > 0 {
		return
	}
	// If last activity wasn't yesterday, the streak is already broken (or
	// today is the first day) — no warning to send.
	if streak.LastActivityDate == nil {
		return
	}
	yesterday := todayLocal.AddDate(0, 0, -1)
	if !sameDay(*streak.LastActivityDate, yesterday) {
		return
	}

	if s.alreadySentToday(ctx, user.ID, "streak_warning", todayLocal) {
		return
	}

	s.send(ctx, user, "streak_warning",
		"Your streak is at risk",
		"Finish a quick stage before midnight to keep your streak going.",
	)
}

func (s *NotificationScheduler) send(ctx context.Context, user *model.User, notifType, title, body string) {
	if err := s.pusher.Send(ctx, user.ID, *user.PushToken, notifType, title, body); err != nil {
		s.log.Warn("scheduler: push failed", zap.Error(err), zap.String("user", user.ID.String()), zap.String("type", notifType))
	}
}

func (s *NotificationScheduler) alreadySentToday(ctx context.Context, userID uuid.UUID, notifType string, todayLocal time.Time) bool {
	last, err := s.notifRepo.LastSentAt(ctx, userID, notifType)
	if err != nil || last == nil {
		return false
	}
	// A "day" here is the local-day range starting at todayLocal.
	return !last.Before(todayLocal)
}

// --- small helpers ---

func userLocation(tz string) *time.Location {
	if tz == "" {
		return time.UTC
	}
	loc, err := time.LoadLocation(tz)
	if err != nil {
		return time.UTC
	}
	return loc
}

func startOfDay(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
}

// parseTimeOfDay accepts HH:MM:SS or HH:MM and returns a time whose only
// meaningful fields are hour + minute.
func parseTimeOfDay(s string) (time.Time, bool) {
	for _, layout := range []string{"15:04:05", "15:04"} {
		if t, err := time.Parse(layout, s); err == nil {
			return t, true
		}
	}
	return time.Time{}, false
}

func sameDay(a, b time.Time) bool {
	ya, ma, da := a.Date()
	yb, mb, db := b.Date()
	return ya == yb && ma == mb && da == db
}
