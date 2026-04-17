package service

import (
	"context"
	"testing"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/model"
	"github.com/forin/server/internal/testutil"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func testUserService(repo *testutil.MockUserProfileRepository) *UserService {
	return NewUserService(repo, &config.Config{})
}

func TestGetProfile_Success(t *testing.T) {
	userID := uuid.New()
	profID := uuid.New()

	repo := &testutil.MockUserProfileRepository{
		FindByIDWithProfessionFn: func(ctx context.Context, id uuid.UUID) (*model.User, error) {
			return &model.User{
				ID:           userID,
				Email:        "nurse@example.com",
				DisplayName:  "Test Nurse",
				ProfessionID: &profID,
				CurrentLevel: 3,
				CurrentXP:    200,
				TotalXP:      1700,
				Lives:        5,
				DailyGoal:    "regular",
				CatName:      "Mittens",
				Timezone:     "Asia/Seoul",
				Profession:   &model.Profession{ID: profID, Name: "Registered Nurse", Slug: "nurse"},
			}, nil
		},
	}

	svc := testUserService(repo)
	resp, err := svc.GetProfile(context.Background(), userID)

	require.NoError(t, err)
	assert.Equal(t, userID, resp.ID)
	assert.Equal(t, "nurse@example.com", resp.Email)
	assert.Equal(t, "Staff Nurse", resp.LevelTitle)
	assert.Equal(t, 5, resp.Lives.Current)
	assert.Equal(t, 5, resp.Lives.Max)
	assert.NotNil(t, resp.Profession)
	assert.Equal(t, "nurse", resp.Profession.Slug)
	assert.Equal(t, "regular", resp.DailyProgress.GoalType)
	assert.Equal(t, 100, resp.DailyProgress.XPTarget)
}

func TestGetProfile_NotFound(t *testing.T) {
	repo := &testutil.MockUserProfileRepository{
		FindByIDWithProfessionFn: func(ctx context.Context, id uuid.UUID) (*model.User, error) {
			return nil, gorm.ErrRecordNotFound
		},
	}

	svc := testUserService(repo)
	_, err := svc.GetProfile(context.Background(), uuid.New())

	assert.ErrorIs(t, err, ErrUserNotFound)
}

func TestUpdateProfile_Success(t *testing.T) {
	userID := uuid.New()
	user := &model.User{
		ID:          userID,
		Email:       "test@example.com",
		DisplayName: "Old Name",
		DailyGoal:   "regular",
		CatName:     "Mittens",
		Lives:       5,
		Timezone:    "UTC",
	}

	repo := &testutil.MockUserProfileRepository{
		FindByIDWithProfessionFn: func(ctx context.Context, id uuid.UUID) (*model.User, error) {
			return user, nil
		},
		UpdateFn: func(ctx context.Context, u *model.User) error {
			return nil
		},
	}

	svc := testUserService(repo)
	newName := "New Name"
	newGoal := "intensive"
	resp, err := svc.UpdateProfile(context.Background(), userID, dto.UpdateProfileRequest{
		DisplayName: &newName,
		DailyGoal:   &newGoal,
	})

	require.NoError(t, err)
	assert.Equal(t, "New Name", resp.DisplayName)
	assert.Equal(t, "intensive", resp.DailyGoal)
}
