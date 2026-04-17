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

// txMock wraps MockLearningRepository with WithTx that passes itself (no real tx).
type txMock struct{ *testutil.MockLearningRepository }

func (t *txMock) WithTx(fn func(repo LearningRepository) error) error { return fn(t) }

func newLearningService(lr *testutil.MockLearningRepository, cr *testutil.MockCurriculumRepository) *LearningService {
	wrapped := &txMock{lr}
	reg := evaluator.NewRegistry(&stubAI{})
	return NewLearningService(wrapped, cr, reg, &config.Config{})
}

type stubAI struct{}

func (s *stubAI) EvaluateConversation(_ context.Context, _, _ string) (*evaluator.AIEvalResult, error) {
	return &evaluator.AIEvalResult{VocabularyScore: 50, ToneScore: 50, CompletenessScore: 50}, nil
}

// --- StartStage ---

func TestStartStage_Success(t *testing.T) {
	userID := uuid.New()
	stageID := uuid.New()

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindUserByIDFn: func(_ context.Context, uid uuid.UUID) (*model.User, error) {
				return &model.User{ID: uid, Lives: 5}, nil
			},
		},
		&testutil.MockCurriculumRepository{
			FindStageByIDFn: func(_ context.Context, sid uuid.UUID) (*model.Stage, error) {
				return &model.Stage{ID: sid, Title: "Test"}, nil
			},
		},
	)

	resp, err := svc.StartStage(context.Background(), userID, stageID)
	require.NoError(t, err)
	assert.Equal(t, stageID, resp.StageID)
	assert.Equal(t, 5, resp.Lives)
}

func TestStartStage_NoLives(t *testing.T) {
	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindUserByIDFn: func(_ context.Context, uid uuid.UUID) (*model.User, error) {
				return &model.User{ID: uid, Lives: 0}, nil
			},
		},
		&testutil.MockCurriculumRepository{},
	)

	_, err := svc.StartStage(context.Background(), uuid.New(), uuid.New())
	assert.ErrorIs(t, err, ErrNoLives)
}

func TestStartStage_StageNotFound(t *testing.T) {
	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindUserByIDFn: func(_ context.Context, uid uuid.UUID) (*model.User, error) {
				return &model.User{ID: uid, Lives: 5}, nil
			},
		},
		&testutil.MockCurriculumRepository{
			FindStageByIDFn: func(_ context.Context, _ uuid.UUID) (*model.Stage, error) {
				return nil, gorm.ErrRecordNotFound
			},
		},
	)

	_, err := svc.StartStage(context.Background(), uuid.New(), uuid.New())
	assert.ErrorIs(t, err, ErrStageNotFound)
}

// --- SubmitExercise ---

func TestSubmitExercise_Correct(t *testing.T) {
	userID := uuid.New()
	attemptID := uuid.New()
	exerciseID := uuid.New()
	stageID := uuid.New()

	content, _ := json.Marshal(map[string]interface{}{
		"target_sentence": "Hello world",
		"word_tiles":      []string{"Hello", "world", "foo"},
	})

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, aid uuid.UUID) (*model.StageAttempt, error) {
				return &model.StageAttempt{ID: aid, UserID: userID, StageID: stageID}, nil
			},
			FindUserByIDFn: func(_ context.Context, uid uuid.UUID) (*model.User, error) {
				return &model.User{ID: uid, Lives: 5}, nil
			},
		},
		&testutil.MockCurriculumRepository{
			FindExerciseByIDFn: func(_ context.Context, eid uuid.UUID) (*model.Exercise, error) {
				return &model.Exercise{
					ID: eid, StageID: stageID, ExerciseType: "sentence_arrangement",
					XPReward: 10, Content: datatypes.JSON(content),
				}, nil
			},
		},
	)

	respJSON, _ := json.Marshal(map[string]interface{}{"answer": []string{"Hello", "world"}})
	resp, err := svc.SubmitExercise(context.Background(), userID, attemptID, exerciseID, dto.SubmitExerciseRequest{Response: respJSON})

	require.NoError(t, err)
	assert.True(t, *resp.IsCorrect)
	assert.Equal(t, 10, resp.XPEarned)
	assert.Equal(t, 0, resp.LivesLost)
}

func TestSubmitExercise_NotOwned(t *testing.T) {
	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, aid uuid.UUID) (*model.StageAttempt, error) {
				return &model.StageAttempt{ID: aid, UserID: uuid.New()}, nil
			},
		},
		&testutil.MockCurriculumRepository{},
	)

	_, err := svc.SubmitExercise(context.Background(), uuid.New(), uuid.New(), uuid.New(), dto.SubmitExerciseRequest{Response: json.RawMessage(`{}`)})
	assert.ErrorIs(t, err, ErrAttemptNotOwned)
}

func TestSubmitExercise_AlreadyCompleted(t *testing.T) {
	userID := uuid.New()
	now := time.Now()
	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, aid uuid.UUID) (*model.StageAttempt, error) {
				return &model.StageAttempt{ID: aid, UserID: userID, CompletedAt: &now}, nil
			},
		},
		&testutil.MockCurriculumRepository{},
	)

	_, err := svc.SubmitExercise(context.Background(), userID, uuid.New(), uuid.New(), dto.SubmitExerciseRequest{Response: json.RawMessage(`{}`)})
	assert.ErrorIs(t, err, ErrAttemptCompleted)
}

// --- CompleteAttempt ---

func TestCompleteAttempt_FirstClear_3Stars(t *testing.T) {
	userID := uuid.New()
	attemptID := uuid.New()
	stageID := uuid.New()
	started := time.Now().Add(-2 * time.Minute)

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, aid uuid.UUID) (*model.StageAttempt, error) {
				return &model.StageAttempt{
					ID: aid, UserID: userID, StageID: stageID,
					StartedAt: started, MistakesCount: 0,
				}, nil
			},
			FindResponsesByAttemptIDFn: func(_ context.Context, _ uuid.UUID) ([]model.ExerciseResponse, error) {
				xp := 10
				ok := true
				return []model.ExerciseResponse{{XPEarned: xp, IsCorrect: &ok}, {XPEarned: xp, IsCorrect: &ok}}, nil
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
	assert.Equal(t, 3, resp.StarsEarned)
	assert.Equal(t, 95, resp.XPEarned) // 10+10+50+25
	assert.NotNil(t, resp.GiftBox)
	assert.Equal(t, "basic", resp.GiftBox.BoxType)
}

func TestCompleteAttempt_Retry_HalfXP(t *testing.T) {
	userID := uuid.New()
	attemptID := uuid.New()
	stageID := uuid.New()
	started := time.Now().Add(-1 * time.Minute)
	firstCompleted := time.Now().Add(-1 * time.Hour)

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptByIDFn: func(_ context.Context, aid uuid.UUID) (*model.StageAttempt, error) {
				return &model.StageAttempt{ID: aid, UserID: userID, StageID: stageID, StartedAt: started}, nil
			},
			FindResponsesByAttemptIDFn: func(_ context.Context, _ uuid.UUID) ([]model.ExerciseResponse, error) {
				xp := 10
				ok := true
				return []model.ExerciseResponse{{XPEarned: xp, IsCorrect: &ok}}, nil
			},
			FindUserStageProgressFn: func(_ context.Context, _, _ uuid.UUID) (*model.UserStageProgress, error) {
				return &model.UserStageProgress{
					Status: "completed", Stars: 2, BestScore: 80,
					Attempts: 1, FirstCompletedAt: &firstCompleted,
				}, nil
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
	assert.Equal(t, 42, resp.XPEarned) // (10+50+25)/2
	assert.Nil(t, resp.GiftBox)
}

// --- GetAttemptHistory ---

func TestGetAttemptHistory_Success(t *testing.T) {
	userID := uuid.New()
	now := time.Now()

	svc := newLearningService(
		&testutil.MockLearningRepository{
			FindAttemptHistoryFn: func(_ context.Context, _ uuid.UUID, _, _ int) ([]model.StageAttempt, int64, error) {
				stars := 3
				dur := 120
				return []model.StageAttempt{{
					ID: uuid.New(), StageID: uuid.New(), StarsEarned: &stars,
					XPEarned: 95, CompletedAt: &now, DurationSeconds: &dur,
					Stage: model.Stage{Title: "Test Stage"},
				}}, 1, nil
			},
		},
		&testutil.MockCurriculumRepository{},
	)

	resp, err := svc.GetAttemptHistory(context.Background(), userID, dto.AttemptHistoryQuery{Page: 1, PageSize: 10})
	require.NoError(t, err)
	assert.Equal(t, int64(1), resp.TotalCount)
	assert.Equal(t, "Test Stage", resp.Attempts[0].StageTitle)
}
