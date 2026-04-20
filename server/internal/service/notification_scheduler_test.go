package service

import (
	"context"
	"testing"
	"time"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
)

// mockNotifRepo is a tiny in-file mock used only by scheduler tests.
// We keep it local so the wider testutil package doesn't accumulate
// mocks for every service.
type mockNotifRepo struct {
	users    []model.User
	prefs    map[uuid.UUID]*model.NotificationPreference
	activity map[uuid.UUID]map[string]*model.DailyActivityLog
	lastSent map[uuid.UUID]map[string]time.Time
}

func (m *mockNotifRepo) FindOrCreatePreferences(ctx context.Context, userID uuid.UUID) (*model.NotificationPreference, error) {
	if p, ok := m.prefs[userID]; ok {
		return p, nil
	}
	return &model.NotificationPreference{
		UserID:               userID,
		DailyReminderEnabled: true,
		DailyReminderTime:    "20:00:00",
		StreakWarningEnabled: true,
	}, nil
}
func (m *mockNotifRepo) UpdatePreferences(ctx context.Context, pref *model.NotificationPreference) error {
	return nil
}
func (m *mockNotifRepo) CreateLog(ctx context.Context, log *model.NotificationLog) error {
	return nil
}
func (m *mockNotifRepo) FindWeeklyActivity(ctx context.Context, userID uuid.UUID, from, to time.Time) ([]model.DailyActivityLog, error) {
	return nil, nil
}
func (m *mockNotifRepo) FindUsersWithPushToken(ctx context.Context) ([]model.User, error) {
	return m.users, nil
}
func (m *mockNotifRepo) LastSentAt(ctx context.Context, userID uuid.UUID, notifType string) (*time.Time, error) {
	if m.lastSent == nil {
		return nil, nil
	}
	if inner, ok := m.lastSent[userID]; ok {
		if ts, ok := inner[notifType]; ok {
			return &ts, nil
		}
	}
	return nil, nil
}
func (m *mockNotifRepo) FindDailyActivityForDate(ctx context.Context, userID uuid.UUID, date time.Time) (*model.DailyActivityLog, error) {
	if m.activity == nil {
		return nil, nil
	}
	dayKey := date.Format("2006-01-02")
	if inner, ok := m.activity[userID]; ok {
		if log, ok := inner[dayKey]; ok {
			return log, nil
		}
	}
	return nil, nil
}

type mockProfileForScheduler struct {
	streak *model.UserStreak
}

func (m *mockProfileForScheduler) FindByIDWithProfession(ctx context.Context, id uuid.UUID) (*model.User, error) {
	return nil, nil
}
func (m *mockProfileForScheduler) Update(ctx context.Context, user *model.User) error { return nil }
func (m *mockProfileForScheduler) FindStreak(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error) {
	return m.streak, nil
}
func (m *mockProfileForScheduler) FindOrCreateStreak(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error) {
	return m.streak, nil
}
func (m *mockProfileForScheduler) FindDailyActivity(ctx context.Context, userID uuid.UUID, date time.Time) (*model.DailyActivityLog, error) {
	return nil, nil
}

// recordingPusher captures every Send call for assertions.
type recordingPusher struct {
	calls []pushCall
}
type pushCall struct {
	userID    uuid.UUID
	notifType string
}

func (p *recordingPusher) Send(ctx context.Context, userID uuid.UUID, pushToken, notifType, title, body string) error {
	p.calls = append(p.calls, pushCall{userID: userID, notifType: notifType})
	return nil
}

func buildScheduler(notif *mockNotifRepo, prof UserProfileRepository) (*NotificationScheduler, *recordingPusher) {
	pusher := &recordingPusher{}
	log := zap.NewNop()
	return NewNotificationScheduler(notif, prof, pusher, log), pusher
}

// --- Tests ---

func TestScheduler_DailyReminder_SendsWhenDue(t *testing.T) {
	uid := uuid.New()
	token := "ExponentPushToken[abc]"
	notif := &mockNotifRepo{
		users: []model.User{{ID: uid, PushToken: &token, Timezone: "UTC"}},
	}
	sched, pusher := buildScheduler(notif, &mockProfileForScheduler{})

	now := time.Date(2026, 4, 20, 20, 0, 0, 0, time.UTC)
	sched.Tick(context.Background(), now)

	assert.Len(t, pusher.calls, 1)
	assert.Equal(t, "daily_reminder", pusher.calls[0].notifType)
}

func TestScheduler_DailyReminder_SkipsWhenAlreadySentToday(t *testing.T) {
	uid := uuid.New()
	token := "ExponentPushToken[abc]"
	now := time.Date(2026, 4, 20, 20, 0, 0, 0, time.UTC)
	earlierToday := time.Date(2026, 4, 20, 19, 0, 0, 0, time.UTC)
	notif := &mockNotifRepo{
		users: []model.User{{ID: uid, PushToken: &token, Timezone: "UTC"}},
		lastSent: map[uuid.UUID]map[string]time.Time{
			uid: {"daily_reminder": earlierToday},
		},
	}
	sched, pusher := buildScheduler(notif, &mockProfileForScheduler{})
	sched.Tick(context.Background(), now)

	for _, c := range pusher.calls {
		if c.notifType == "daily_reminder" {
			t.Fatal("daily_reminder should have been deduped")
		}
	}
}

func TestScheduler_DailyReminder_SkipsWhenAlreadyTrained(t *testing.T) {
	uid := uuid.New()
	token := "ExponentPushToken[abc]"
	now := time.Date(2026, 4, 20, 20, 0, 0, 0, time.UTC)
	notif := &mockNotifRepo{
		users: []model.User{{ID: uid, PushToken: &token, Timezone: "UTC"}},
		activity: map[uuid.UUID]map[string]*model.DailyActivityLog{
			uid: {"2026-04-20": &model.DailyActivityLog{StagesCompleted: 2}},
		},
	}
	sched, pusher := buildScheduler(notif, &mockProfileForScheduler{})
	sched.Tick(context.Background(), now)

	for _, c := range pusher.calls {
		if c.notifType == "daily_reminder" {
			t.Fatal("daily_reminder should skip when user already trained")
		}
	}
}

func TestScheduler_StreakWarning_FiresLateWhenStreakAtRisk(t *testing.T) {
	uid := uuid.New()
	token := "ExponentPushToken[abc]"
	now := time.Date(2026, 4, 20, 22, 15, 0, 0, time.UTC)
	yesterday := time.Date(2026, 4, 19, 10, 0, 0, 0, time.UTC)
	notif := &mockNotifRepo{
		users: []model.User{{ID: uid, PushToken: &token, Timezone: "UTC"}},
		// Block the daily reminder branch so we only observe streak_warning.
		lastSent: map[uuid.UUID]map[string]time.Time{
			uid: {"daily_reminder": now},
		},
	}
	prof := &mockProfileForScheduler{
		streak: &model.UserStreak{
			UserID:           uid,
			CurrentStreak:    5,
			LastActivityDate: &yesterday,
		},
	}
	sched, pusher := buildScheduler(notif, prof)
	sched.Tick(context.Background(), now)

	var found bool
	for _, c := range pusher.calls {
		if c.notifType == "streak_warning" {
			found = true
			break
		}
	}
	assert.True(t, found, "expected a streak_warning push")
}

func TestScheduler_StreakWarning_SkipsWhenNoStreak(t *testing.T) {
	uid := uuid.New()
	token := "ExponentPushToken[abc]"
	now := time.Date(2026, 4, 20, 22, 15, 0, 0, time.UTC)
	notif := &mockNotifRepo{
		users: []model.User{{ID: uid, PushToken: &token, Timezone: "UTC"}},
		lastSent: map[uuid.UUID]map[string]time.Time{
			uid: {"daily_reminder": now},
		},
	}
	prof := &mockProfileForScheduler{
		streak: &model.UserStreak{UserID: uid, CurrentStreak: 1},
	}
	sched, pusher := buildScheduler(notif, prof)
	sched.Tick(context.Background(), now)

	for _, c := range pusher.calls {
		if c.notifType == "streak_warning" {
			t.Fatal("streak_warning should skip when streak < 2")
		}
	}
}
