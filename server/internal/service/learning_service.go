package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/evaluator"
	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

var (
	ErrNoLives            = errors.New("no lives remaining")
	ErrAttemptNotFound    = errors.New("attempt not found")
	ErrAttemptNotOwned    = errors.New("attempt does not belong to user")
	ErrAttemptCompleted   = errors.New("attempt already completed")
	ErrExerciseNotFound   = errors.New("exercise not found")
	ErrExerciseNotInStage = errors.New("exercise does not belong to this stage")
	ErrAlreadySubmitted   = errors.New("exercise already submitted for this attempt")
)

type LearningService struct {
	learningRepo   LearningRepository
	curriculumRepo CurriculumRepository
	evaluatorReg   *evaluator.Registry
	cfg            *config.Config
}

func NewLearningService(
	learningRepo LearningRepository,
	curriculumRepo CurriculumRepository,
	evalReg *evaluator.Registry,
	cfg *config.Config,
) *LearningService {
	return &LearningService{
		learningRepo:   learningRepo,
		curriculumRepo: curriculumRepo,
		evaluatorReg:   evalReg,
		cfg:            cfg,
	}
}

// StartStage creates a new attempt for a stage.
func (s *LearningService) StartStage(ctx context.Context, userID, stageID uuid.UUID) (*dto.StartStageResponse, error) {
	user, err := s.learningRepo.FindUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("find user: %w", err)
	}

	lives, _ := ComputeLives(user.Lives, user.LivesLastRefillAt)
	if lives <= 0 && !user.IsPremium {
		return nil, ErrNoLives
	}

	// Verify stage exists
	if _, err := s.curriculumRepo.FindStageByID(ctx, stageID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrStageNotFound
		}
		return nil, fmt.Errorf("find stage: %w", err)
	}

	attempt := &model.StageAttempt{
		UserID:  userID,
		StageID: stageID,
	}
	if err := s.learningRepo.CreateAttempt(ctx, attempt); err != nil {
		return nil, fmt.Errorf("create attempt: %w", err)
	}

	return &dto.StartStageResponse{
		AttemptID: attempt.ID,
		StageID:   stageID,
		StartedAt: attempt.StartedAt,
		Lives:     lives,
	}, nil
}

// SubmitExercise evaluates a user's response to an exercise.
func (s *LearningService) SubmitExercise(ctx context.Context, userID, attemptID, exerciseID uuid.UUID, req dto.SubmitExerciseRequest) (*dto.SubmitExerciseResponse, error) {
	attempt, err := s.learningRepo.FindAttemptByID(ctx, attemptID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrAttemptNotFound
		}
		return nil, fmt.Errorf("find attempt: %w", err)
	}
	if attempt.UserID != userID {
		return nil, ErrAttemptNotOwned
	}
	if attempt.CompletedAt != nil {
		return nil, ErrAttemptCompleted
	}

	// Check duplicate submission
	submitted, err := s.learningRepo.CheckExerciseSubmitted(ctx, attemptID, exerciseID)
	if err != nil {
		return nil, fmt.Errorf("check submitted: %w", err)
	}
	if submitted {
		return nil, ErrAlreadySubmitted
	}

	// Fetch exercise and verify it belongs to the attempt's stage
	exercise, err := s.curriculumRepo.FindExerciseByID(ctx, exerciseID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrExerciseNotFound
		}
		return nil, fmt.Errorf("find exercise: %w", err)
	}
	if exercise.StageID != attempt.StageID {
		return nil, ErrExerciseNotInStage
	}

	// Evaluate
	eval, err := s.evaluatorReg.Get(exercise.ExerciseType)
	if err != nil {
		return nil, fmt.Errorf("get evaluator: %w", err)
	}

	contentJSON, _ := json.Marshal(exercise.Content)
	result, err := eval.Evaluate(contentJSON, req.Response, exercise.XPReward, req.ResponseTime)
	if err != nil {
		return nil, fmt.Errorf("evaluate: %w", err)
	}

	// Handle lives deduction
	user, err := s.learningRepo.FindUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("find user for lives: %w", err)
	}

	currentLives, _ := ComputeLives(user.Lives, user.LivesLastRefillAt)
	if result.LivesLost > 0 {
		now := time.Now()
		user.Lives = currentLives - result.LivesLost
		if user.Lives < 0 {
			user.Lives = 0
		}
		user.LivesLastRefillAt = &now
		if err := s.learningRepo.UpdateUser(ctx, user); err != nil {
			return nil, fmt.Errorf("update user lives: %w", err)
		}
		currentLives = user.Lives
	}

	// Record response
	exerciseResp := &model.ExerciseResponse{
		AttemptID:           attemptID,
		ExerciseID:          exerciseID,
		UserResponse:        datatypes.JSON(req.Response),
		IsCorrect:           result.IsCorrect,
		Score:               result.Score,
		XPEarned:            result.XPEarned,
		AIFeedback:          datatypes.JSON(result.Details),
		ResponseTimeSeconds: req.ResponseTime,
	}
	if err := s.learningRepo.CreateExerciseResponse(ctx, exerciseResp); err != nil {
		return nil, fmt.Errorf("create response: %w", err)
	}

	// Update attempt accumulators
	if result.IsCorrect != nil && !*result.IsCorrect {
		attempt.MistakesCount++
	}
	attempt.LivesLost += result.LivesLost
	if err := s.learningRepo.UpdateAttempt(ctx, attempt); err != nil {
		return nil, fmt.Errorf("update attempt: %w", err)
	}

	return &dto.SubmitExerciseResponse{
		ExerciseID: exerciseID,
		IsCorrect:  result.IsCorrect,
		Score:      result.Score,
		XPEarned:   result.XPEarned,
		LivesAfter: currentLives,
		LivesLost:  result.LivesLost,
		Details:    result.Details,
	}, nil
}

// CompleteAttempt finalizes a stage attempt with scoring, XP, level, streak, achievements, and gift box.
func (s *LearningService) CompleteAttempt(ctx context.Context, userID, attemptID uuid.UUID) (*dto.CompleteAttemptResponse, error) {
	var resp *dto.CompleteAttemptResponse

	err := s.learningRepo.WithTx(func(txRepo LearningRepository) error {
		attempt, err := txRepo.FindAttemptByID(ctx, attemptID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return ErrAttemptNotFound
			}
			return err
		}
		if attempt.UserID != userID {
			return ErrAttemptNotOwned
		}
		if attempt.CompletedAt != nil {
			return ErrAttemptCompleted
		}

		responses, err := txRepo.FindResponsesByAttemptID(ctx, attemptID)
		if err != nil {
			return err
		}

		// Calculate totals
		totalXP := 0
		totalScore := 0
		for _, r := range responses {
			totalXP += r.XPEarned
			if r.Score != nil {
				totalScore += *r.Score
			}
		}

		// Duration (use UTC to avoid timezone mismatch with DB timestamps)
		now := time.Now().UTC()
		duration := int(now.Sub(attempt.StartedAt.UTC()).Seconds())
		if duration < 0 {
			duration = 0
		}

		// Fetch stage for base XP and estimated duration
		stage, err := s.curriculumRepo.FindStageByID(ctx, attempt.StageID)
		if err != nil {
			return err
		}

		// Stars: 3★ = 0 mistakes + within time, 2★ = <2 mistakes, 1★ = completed
		stars := 1
		if attempt.MistakesCount < 2 {
			stars = 2
		}
		if attempt.MistakesCount == 0 && duration <= stage.EstimatedDurationSeconds {
			stars = 3
		}

		// Check if this is a retry
		existingProgress, _ := txRepo.FindUserStageProgress(ctx, userID, attempt.StageID)
		isRetry := existingProgress != nil && existingProgress.FirstCompletedAt != nil

		// Stage base XP + 3-star bonus
		stageXP := stage.XPBase
		if stars == 3 {
			stageXP += 25
		}
		totalXP += stageXP

		if isRetry {
			totalXP = totalXP / 2
		}

		// Update attempt
		attempt.CompletedAt = &now
		attempt.TotalScore = &totalScore
		attempt.StarsEarned = &stars
		attempt.XPEarned = totalXP
		attempt.DurationSeconds = &duration
		if err := txRepo.UpdateAttempt(ctx, attempt); err != nil {
			return err
		}

		// Upsert stage progress (keep highest stars)
		progress := &model.UserStageProgress{
			UserID:          userID,
			StageID:         attempt.StageID,
			Status:          "completed",
			Stars:           stars,
			BestScore:       totalScore,
			Attempts:        1,
			LastAttemptedAt: &now,
		}
		if existingProgress != nil {
			progress.Attempts = existingProgress.Attempts + 1
			if existingProgress.Stars > stars {
				progress.Stars = existingProgress.Stars
			}
			if existingProgress.BestScore > totalScore {
				progress.BestScore = existingProgress.BestScore
			}
			progress.FirstCompletedAt = existingProgress.FirstCompletedAt
		}
		if progress.FirstCompletedAt == nil {
			progress.FirstCompletedAt = &now
		}
		if err := txRepo.UpsertUserStageProgress(ctx, progress); err != nil {
			return err
		}

		// Update user XP and level
		user, err := txRepo.FindUserByID(ctx, userID)
		if err != nil {
			return err
		}
		oldLevel := user.CurrentLevel
		user.CurrentXP += totalXP
		user.TotalXP += totalXP
		user.CurrentLevel = ComputeLevel(user.TotalXP)
		if err := txRepo.UpdateUser(ctx, user); err != nil {
			return err
		}

		// Build response
		resp = &dto.CompleteAttemptResponse{
			AttemptID:       attemptID,
			StageID:         attempt.StageID,
			TotalScore:      totalScore,
			StarsEarned:     stars,
			XPEarned:        totalXP,
			MistakesCount:   attempt.MistakesCount,
			DurationSeconds: duration,
			Achievements:    []dto.AchievementUnlocked{},
		}

		// Level up?
		if user.CurrentLevel > oldLevel {
			resp.LevelUp = &dto.LevelUpResponse{
				PreviousLevel: oldLevel,
				NewLevel:      user.CurrentLevel,
				NewTitle:      LevelTitle(user.CurrentLevel),
			}
		}

		// Update daily activity
		today := time.Now().Truncate(24 * time.Hour)
		daily, _ := txRepo.FindDailyActivity(ctx, userID, today)
		if daily == nil {
			daily = &model.DailyActivityLog{
				UserID:       userID,
				ActivityDate: today,
			}
		}
		daily.StagesCompleted++
		daily.XPEarned += totalXP
		daily.DailyGoalMet = daily.XPEarned >= DailyXPTarget(user.DailyGoal)
		if err := txRepo.UpsertDailyActivity(ctx, daily); err != nil {
			return err
		}

		// Update streak
		streak, err := txRepo.FindOrCreateStreak(ctx, userID)
		if err != nil {
			return err
		}
		streakResp := updateStreak(streak, today)
		if err := txRepo.UpsertStreak(ctx, streak); err != nil {
			return err
		}
		resp.StreakUpdate = streakResp

		// Gift box on first clear
		if !isRetry {
			gbo := &model.GiftBoxOpening{
				UserID:  userID,
				BoxType: "basic",
				StageID: &attempt.StageID,
			}
			if err := txRepo.CreateGiftBoxOpening(ctx, gbo); err != nil {
				return err
			}
			resp.GiftBox = &dto.GiftBoxAwarded{
				ID:      gbo.ID,
				BoxType: "basic",
			}
		}

		// Check achievements
		unlocked, err := s.checkAchievements(ctx, txRepo, userID, streak)
		if err != nil {
			return err
		}
		resp.Achievements = unlocked

		return nil
	})

	if err != nil {
		return nil, err
	}
	return resp, nil
}

// GetAttemptHistory returns paginated completed attempts for a user.
func (s *LearningService) GetAttemptHistory(ctx context.Context, userID uuid.UUID, query dto.AttemptHistoryQuery) (*dto.AttemptHistoryResponse, error) {
	page := query.Page
	if page < 1 {
		page = 1
	}
	pageSize := query.PageSize
	if pageSize < 1 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize
	attempts, total, err := s.learningRepo.FindAttemptHistory(ctx, userID, offset, pageSize)
	if err != nil {
		return nil, fmt.Errorf("find history: %w", err)
	}

	var summaries []dto.AttemptSummary
	for _, a := range attempts {
		summary := dto.AttemptSummary{
			ID:          a.ID,
			StageID:     a.StageID,
			StarsEarned: a.StarsEarned,
			XPEarned:    a.XPEarned,
			CompletedAt: a.CompletedAt,
			DurationSeconds: a.DurationSeconds,
		}
		if a.Stage.Title != "" {
			summary.StageTitle = a.Stage.Title
		}
		summaries = append(summaries, summary)
	}

	return &dto.AttemptHistoryResponse{
		Attempts:   summaries,
		TotalCount: total,
		Page:       page,
		PageSize:   pageSize,
	}, nil
}

func updateStreak(streak *model.UserStreak, today time.Time) *dto.StreakUpdateResponse {
	resp := &dto.StreakUpdateResponse{}

	if streak.LastActivityDate == nil {
		streak.CurrentStreak = 1
		streak.LastActivityDate = &today
		resp.CurrentStreak = 1
		resp.WasExtended = true
	} else {
		lastDate := streak.LastActivityDate.Truncate(24 * time.Hour)
		diff := today.Sub(lastDate).Hours() / 24

		switch {
		case diff < 1:
			// Same day, no change
			resp.CurrentStreak = streak.CurrentStreak
			resp.WasExtended = false
		case diff < 2:
			// Next day, extend streak
			streak.CurrentStreak++
			streak.LastActivityDate = &today
			resp.CurrentStreak = streak.CurrentStreak
			resp.WasExtended = true
		default:
			// Gap > 1 day, reset
			streak.CurrentStreak = 1
			streak.LastActivityDate = &today
			resp.CurrentStreak = 1
			resp.WasExtended = true
		}
	}

	if streak.CurrentStreak > streak.LongestStreak {
		streak.LongestStreak = streak.CurrentStreak
	}

	// Check milestones
	for _, milestone := range []int{7, 30, 100} {
		if streak.CurrentStreak == milestone {
			resp.MilestoneHit = &milestone
			break
		}
	}

	return resp
}

func (s *LearningService) checkAchievements(ctx context.Context, repo LearningRepository, userID uuid.UUID, streak *model.UserStreak) ([]dto.AchievementUnlocked, error) {
	allAchievements, err := repo.FindAllAchievements(ctx)
	if err != nil {
		return nil, err
	}
	userAchievements, err := repo.FindUserAchievements(ctx, userID)
	if err != nil {
		return nil, err
	}

	earned := make(map[uuid.UUID]bool)
	for _, ua := range userAchievements {
		earned[ua.AchievementID] = true
	}

	completedStages, _ := repo.CountCompletedStages(ctx, userID)

	var unlocked []dto.AchievementUnlocked
	for _, a := range allAchievements {
		if earned[a.ID] {
			continue
		}

		met := false
		switch a.ConditionType {
		case "stage_count":
			var cond struct{ Count int64 `json:"count"` }
			json.Unmarshal(a.ConditionValue, &cond)
			met = completedStages >= cond.Count

		case "streak":
			var cond struct{ Days int `json:"days"` }
			json.Unmarshal(a.ConditionValue, &cond)
			if streak != nil {
				met = streak.CurrentStreak >= cond.Days
			}
		}

		if met {
			ua := &model.UserAchievement{
				UserID:        userID,
				AchievementID: a.ID,
			}
			if err := repo.CreateUserAchievement(ctx, ua); err != nil {
				continue // don't fail entire completion for achievement errors
			}
			unlocked = append(unlocked, dto.AchievementUnlocked{
				ID:   a.ID,
				Slug: a.Slug,
				Name: a.Name,
			})
		}
	}

	return unlocked, nil
}
