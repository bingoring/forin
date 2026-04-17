package service

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/evaluator"
	"github.com/forin/server/internal/model"
	"github.com/forin/server/internal/testutil"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// --- UserService Edge Cases ---

func TestGetProfile_NoProfession(t *testing.T) {
	userID := uuid.New()
	repo := &testutil.MockUserProfileRepository{
		FindByIDWithProfessionFn: func(_ context.Context, _ uuid.UUID) (*model.User, error) {
			return &model.User{
				ID: userID, Email: "test@example.com", DisplayName: "Test",
				ProfessionID: nil, Lives: 5, DailyGoal: "regular",
			}, nil
		},
	}
	svc := NewUserService(repo, &config.Config{})
	resp, err := svc.GetProfile(context.Background(), userID)

	require.NoError(t, err)
	assert.Nil(t, resp.Profession)
}

func TestGetProfile_LivesRefillCalculation(t *testing.T) {
	userID := uuid.New()
	refill := time.Now().Add(-65 * time.Minute) // 65 min ago → 2 refills
	repo := &testutil.MockUserProfileRepository{
		FindByIDWithProfessionFn: func(_ context.Context, _ uuid.UUID) (*model.User, error) {
			return &model.User{
				ID: userID, Email: "test@example.com", DisplayName: "Test",
				Lives: 2, LivesLastRefillAt: &refill, DailyGoal: "regular",
			}, nil
		},
	}
	svc := NewUserService(repo, &config.Config{})
	resp, err := svc.GetProfile(context.Background(), userID)

	require.NoError(t, err)
	assert.Equal(t, 4, resp.Lives.Current) // 2 + 2 refills = 4
	assert.NotNil(t, resp.Lives.SecondsToNext)
}

func TestUpdateProfile_AllFieldsNil(t *testing.T) {
	userID := uuid.New()
	repo := &testutil.MockUserProfileRepository{
		FindByIDWithProfessionFn: func(_ context.Context, _ uuid.UUID) (*model.User, error) {
			return &model.User{
				ID: userID, Email: "test@example.com", DisplayName: "Original",
				Lives: 5, DailyGoal: "regular",
			}, nil
		},
	}
	svc := NewUserService(repo, &config.Config{})
	resp, err := svc.UpdateProfile(context.Background(), userID, dto.UpdateProfileRequest{})

	require.NoError(t, err)
	assert.Equal(t, "Original", resp.DisplayName) // unchanged
}

// --- LearningService Edge Cases ---

func TestStartStage_PremiumUser_NoLivesCheck(t *testing.T) {
	userID := uuid.New()
	stageID := uuid.New()

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindUserByIDFn: func(_ context.Context, uid uuid.UUID) (*model.User, error) {
				return &model.User{ID: uid, Lives: 0, IsPremium: true}, nil
			},
		},
		&testutil.MockCurriculumRepository{
			FindStageByIDFn: func(_ context.Context, sid uuid.UUID) (*model.Stage, error) {
				return &model.Stage{ID: sid}, nil
			},
		},
	)

	resp, err := svc.StartStage(context.Background(), userID, stageID)
	require.NoError(t, err)
	assert.Equal(t, stageID, resp.StageID)
}

func TestSubmitExercise_DuplicateSubmission(t *testing.T) {
	userID := uuid.New()
	attemptID := uuid.New()
	exerciseID := uuid.New()

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, aid uuid.UUID) (*model.StageAttempt, error) {
				return &model.StageAttempt{ID: aid, UserID: userID, StageID: uuid.New()}, nil
			},
			CheckExerciseSubmittedFn: func(_ context.Context, _, _ uuid.UUID) (bool, error) {
				return true, nil // already submitted
			},
		},
		&testutil.MockCurriculumRepository{},
	)

	_, err := svc.SubmitExercise(context.Background(), userID, attemptID, exerciseID, dto.SubmitExerciseRequest{
		Response: json.RawMessage(`{}`),
	})
	assert.ErrorIs(t, err, ErrAlreadySubmitted)
}

func TestSubmitExercise_ExerciseWrongStage(t *testing.T) {
	userID := uuid.New()
	attemptID := uuid.New()
	exerciseID := uuid.New()
	stageID := uuid.New()

	contentJSON, _ := json.Marshal(map[string]interface{}{"target_sentence": "test"})

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, aid uuid.UUID) (*model.StageAttempt, error) {
				return &model.StageAttempt{ID: aid, UserID: userID, StageID: stageID}, nil
			},
		},
		&testutil.MockCurriculumRepository{
			FindExerciseByIDFn: func(_ context.Context, eid uuid.UUID) (*model.Exercise, error) {
				return &model.Exercise{
					ID: eid, StageID: uuid.New(), // different stage
					ExerciseType: "sentence_arrangement", Content: datatypes.JSON(contentJSON),
				}, nil
			},
		},
	)

	_, err := svc.SubmitExercise(context.Background(), userID, attemptID, exerciseID, dto.SubmitExerciseRequest{
		Response: json.RawMessage(`{"answer":["test"]}`),
	})
	assert.ErrorIs(t, err, ErrExerciseNotInStage)
}

func TestSubmitExercise_AttemptNotFound(t *testing.T) {
	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, _ uuid.UUID) (*model.StageAttempt, error) {
				return nil, gorm.ErrRecordNotFound
			},
		},
		&testutil.MockCurriculumRepository{},
	)

	_, err := svc.SubmitExercise(context.Background(), uuid.New(), uuid.New(), uuid.New(), dto.SubmitExerciseRequest{
		Response: json.RawMessage(`{}`),
	})
	assert.ErrorIs(t, err, ErrAttemptNotFound)
}

func TestCompleteAttempt_2Stars_OneMistake(t *testing.T) {
	userID := uuid.New()
	attemptID := uuid.New()
	stageID := uuid.New()
	started := time.Now().Add(-1 * time.Minute)

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, aid uuid.UUID) (*model.StageAttempt, error) {
				return &model.StageAttempt{
					ID: aid, UserID: userID, StageID: stageID,
					StartedAt: started, MistakesCount: 1, // 1 mistake → 2 stars
				}, nil
			},
			FindResponsesByAttemptIDFn: func(_ context.Context, _ uuid.UUID) ([]model.ExerciseResponse, error) {
				xp := 10
				ok := true
				return []model.ExerciseResponse{{XPEarned: xp, IsCorrect: &ok}}, nil
			},
			FindUserByIDFn: func(_ context.Context, uid uuid.UUID) (*model.User, error) {
				return &model.User{ID: uid, CurrentLevel: 1, DailyGoal: "regular"}, nil
			},
		},
		&testutil.MockCurriculumRepository{
			FindStageByIDFn: func(_ context.Context, sid uuid.UUID) (*model.Stage, error) {
				return &model.Stage{ID: sid, XPBase: 50, EstimatedDurationSeconds: 300}, nil
			},
		},
	)

	resp, err := svc.CompleteAttempt(context.Background(), userID, attemptID)
	require.NoError(t, err)
	assert.Equal(t, 2, resp.StarsEarned) // 1 mistake < 2 → 2 stars
	assert.Equal(t, 60, resp.XPEarned)   // 10 + 50 (no 3-star bonus)
}

func TestCompleteAttempt_1Star_ManyMistakes(t *testing.T) {
	userID := uuid.New()
	attemptID := uuid.New()
	stageID := uuid.New()
	started := time.Now().Add(-1 * time.Minute)

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, aid uuid.UUID) (*model.StageAttempt, error) {
				return &model.StageAttempt{
					ID: aid, UserID: userID, StageID: stageID,
					StartedAt: started, MistakesCount: 5, // many mistakes → 1 star
				}, nil
			},
			FindResponsesByAttemptIDFn: func(_ context.Context, _ uuid.UUID) ([]model.ExerciseResponse, error) {
				return []model.ExerciseResponse{{XPEarned: 5}}, nil
			},
			FindUserByIDFn: func(_ context.Context, uid uuid.UUID) (*model.User, error) {
				return &model.User{ID: uid, CurrentLevel: 1, DailyGoal: "regular"}, nil
			},
		},
		&testutil.MockCurriculumRepository{
			FindStageByIDFn: func(_ context.Context, sid uuid.UUID) (*model.Stage, error) {
				return &model.Stage{ID: sid, XPBase: 50, EstimatedDurationSeconds: 300}, nil
			},
		},
	)

	resp, err := svc.CompleteAttempt(context.Background(), userID, attemptID)
	require.NoError(t, err)
	assert.Equal(t, 1, resp.StarsEarned)
}

func TestCompleteAttempt_LevelUp(t *testing.T) {
	userID := uuid.New()
	attemptID := uuid.New()
	stageID := uuid.New()
	started := time.Now().Add(-1 * time.Minute)

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, aid uuid.UUID) (*model.StageAttempt, error) {
				return &model.StageAttempt{
					ID: aid, UserID: userID, StageID: stageID, StartedAt: started,
				}, nil
			},
			FindResponsesByAttemptIDFn: func(_ context.Context, _ uuid.UUID) ([]model.ExerciseResponse, error) {
				return []model.ExerciseResponse{{XPEarned: 100}}, nil
			},
			FindUserByIDFn: func(_ context.Context, uid uuid.UUID) (*model.User, error) {
				return &model.User{
					ID: uid, CurrentLevel: 1, CurrentXP: 400, TotalXP: 400, DailyGoal: "regular",
				}, nil // 400 + 175 = 575 → level 2 (threshold: 500)
			},
		},
		&testutil.MockCurriculumRepository{
			FindStageByIDFn: func(_ context.Context, sid uuid.UUID) (*model.Stage, error) {
				return &model.Stage{ID: sid, XPBase: 50, EstimatedDurationSeconds: 300}, nil
			},
		},
	)

	resp, err := svc.CompleteAttempt(context.Background(), userID, attemptID)
	require.NoError(t, err)
	assert.NotNil(t, resp.LevelUp)
	assert.Equal(t, 1, resp.LevelUp.PreviousLevel)
	assert.Equal(t, 2, resp.LevelUp.NewLevel)
	assert.Equal(t, "Junior Nurse", resp.LevelUp.NewTitle)
}

func TestCompleteAttempt_AchievementUnlocked(t *testing.T) {
	userID := uuid.New()
	attemptID := uuid.New()
	stageID := uuid.New()
	achievementID := uuid.New()
	started := time.Now().Add(-1 * time.Minute)

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, aid uuid.UUID) (*model.StageAttempt, error) {
				return &model.StageAttempt{ID: aid, UserID: userID, StageID: stageID, StartedAt: started}, nil
			},
			FindResponsesByAttemptIDFn: func(_ context.Context, _ uuid.UUID) ([]model.ExerciseResponse, error) {
				return []model.ExerciseResponse{{XPEarned: 10}}, nil
			},
			FindUserByIDFn: func(_ context.Context, uid uuid.UUID) (*model.User, error) {
				return &model.User{ID: uid, CurrentLevel: 1, DailyGoal: "regular"}, nil
			},
			FindAllAchievementsFn: func(_ context.Context) ([]model.Achievement, error) {
				return []model.Achievement{{
					ID: achievementID, Slug: "first_steps", Name: "First Steps",
					ConditionType:  "stage_count",
					ConditionValue: datatypes.JSON(`{"count":1}`),
				}}, nil
			},
			CountCompletedStagesFn: func(_ context.Context, _ uuid.UUID) (int64, error) {
				return 1, nil // just completed first stage
			},
		},
		&testutil.MockCurriculumRepository{
			FindStageByIDFn: func(_ context.Context, sid uuid.UUID) (*model.Stage, error) {
				return &model.Stage{ID: sid, XPBase: 50, EstimatedDurationSeconds: 300}, nil
			},
		},
	)

	resp, err := svc.CompleteAttempt(context.Background(), userID, attemptID)
	require.NoError(t, err)
	assert.Len(t, resp.Achievements, 1)
	assert.Equal(t, "first_steps", resp.Achievements[0].Slug)
}

// --- Streak Edge Cases ---

func TestUpdateStreak_SameDay_NoChange(t *testing.T) {
	today := time.Now().Truncate(24 * time.Hour)
	streak := &model.UserStreak{
		CurrentStreak:    5,
		LongestStreak:    10,
		LastActivityDate: &today,
	}

	resp := updateStreak(streak, today)
	assert.Equal(t, 5, resp.CurrentStreak)
	assert.False(t, resp.WasExtended)
}

func TestUpdateStreak_GapReset(t *testing.T) {
	threeDaysAgo := time.Now().AddDate(0, 0, -3).Truncate(24 * time.Hour)
	today := time.Now().Truncate(24 * time.Hour)
	streak := &model.UserStreak{
		CurrentStreak:    10,
		LongestStreak:    10,
		LastActivityDate: &threeDaysAgo,
	}

	resp := updateStreak(streak, today)
	assert.Equal(t, 1, resp.CurrentStreak) // reset
	assert.True(t, resp.WasExtended)
}

func TestUpdateStreak_Milestone7(t *testing.T) {
	yesterday := time.Now().AddDate(0, 0, -1).Truncate(24 * time.Hour)
	today := time.Now().Truncate(24 * time.Hour)
	streak := &model.UserStreak{
		CurrentStreak:    6,
		LongestStreak:    6,
		LastActivityDate: &yesterday,
	}

	resp := updateStreak(streak, today)
	assert.Equal(t, 7, resp.CurrentStreak)
	assert.NotNil(t, resp.MilestoneHit)
	assert.Equal(t, 7, *resp.MilestoneHit)
}

// --- Lives Edge Cases ---

func TestComputeLives_OverMaxStored(t *testing.T) {
	// Edge case: stored lives > max (shouldn't happen but be defensive)
	lives, stn := ComputeLives(10, nil)
	assert.Equal(t, 5, lives) // capped to max
	assert.Nil(t, stn)
}

func TestComputeLives_ExactRefillBoundary(t *testing.T) {
	refill := time.Now().Add(-30 * time.Minute)
	lives, _ := ComputeLives(4, &refill)
	assert.Equal(t, 5, lives) // exactly 30 min = 1 refill, 4+1=5
}

// --- Level Edge Cases ---

func TestComputeLevel_NegativeXP(t *testing.T) {
	assert.Equal(t, 1, ComputeLevel(-100))
}

func TestComputeLevel_ExactThreshold(t *testing.T) {
	assert.Equal(t, 2, ComputeLevel(500))  // exactly at level 2
	assert.Equal(t, 10, ComputeLevel(85000)) // exactly at max
}

func newLearningServiceForEdge(lr *testutil.MockLearningRepository, cr *testutil.MockCurriculumRepository) *LearningService {
	wrapped := &txMock{lr}
	reg := evaluator.NewRegistry(&stubAI{})
	return NewLearningService(wrapped, cr, reg, &config.Config{})
}
