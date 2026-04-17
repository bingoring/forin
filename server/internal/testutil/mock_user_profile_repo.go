package testutil

import (
	"context"
	"time"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
)

type MockUserProfileRepository struct {
	FindByIDWithProfessionFn func(ctx context.Context, id uuid.UUID) (*model.User, error)
	UpdateFn                 func(ctx context.Context, user *model.User) error
	FindStreakFn             func(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error)
	FindOrCreateStreakFn     func(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error)
	FindDailyActivityFn      func(ctx context.Context, userID uuid.UUID, date time.Time) (*model.DailyActivityLog, error)
}

func (m *MockUserProfileRepository) FindByIDWithProfession(ctx context.Context, id uuid.UUID) (*model.User, error) {
	if m.FindByIDWithProfessionFn != nil {
		return m.FindByIDWithProfessionFn(ctx, id)
	}
	return nil, nil
}

func (m *MockUserProfileRepository) Update(ctx context.Context, user *model.User) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(ctx, user)
	}
	return nil
}

func (m *MockUserProfileRepository) FindStreak(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error) {
	if m.FindStreakFn != nil {
		return m.FindStreakFn(ctx, userID)
	}
	return &model.UserStreak{}, nil
}

func (m *MockUserProfileRepository) FindOrCreateStreak(ctx context.Context, userID uuid.UUID) (*model.UserStreak, error) {
	if m.FindOrCreateStreakFn != nil {
		return m.FindOrCreateStreakFn(ctx, userID)
	}
	return &model.UserStreak{}, nil
}

func (m *MockUserProfileRepository) FindDailyActivity(ctx context.Context, userID uuid.UUID, date time.Time) (*model.DailyActivityLog, error) {
	if m.FindDailyActivityFn != nil {
		return m.FindDailyActivityFn(ctx, userID, date)
	}
	return nil, nil
}
