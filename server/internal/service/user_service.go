package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrUserNotFound      = errors.New("user not found")
	ErrUnsupportedLocale = errors.New("unsupported native_language")
)

type UserService struct {
	profileRepo UserProfileRepository
	cfg         *config.Config
}

func NewUserService(profileRepo UserProfileRepository, cfg *config.Config) *UserService {
	return &UserService{profileRepo: profileRepo, cfg: cfg}
}

func (s *UserService) GetProfile(ctx context.Context, userID uuid.UUID) (*dto.UserProfileResponse, error) {
	user, err := s.profileRepo.FindByIDWithProfession(ctx, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("find user: %w", err)
	}

	lives, secondsToNext := ComputeLives(user.Lives, user.LivesLastRefillAt)

	streak, _ := s.profileRepo.FindOrCreateStreak(ctx, userID)

	today := time.Now().Truncate(24 * time.Hour)
	daily, _ := s.profileRepo.FindDailyActivity(ctx, userID, today)

	return buildProfileResponse(user, lives, secondsToNext, streak, daily), nil
}

func (s *UserService) UpdateProfile(ctx context.Context, userID uuid.UUID, req dto.UpdateProfileRequest) (*dto.UserProfileResponse, error) {
	user, err := s.profileRepo.FindByIDWithProfession(ctx, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("find user: %w", err)
	}

	if req.DisplayName != nil {
		user.DisplayName = *req.DisplayName
	}
	if req.CatName != nil {
		user.CatName = *req.CatName
	}
	if req.DailyGoal != nil {
		user.DailyGoal = *req.DailyGoal
	}
	if req.TargetCountry != nil {
		user.TargetCountry = req.TargetCountry
	}
	if req.Timezone != nil {
		user.Timezone = *req.Timezone
	}
	if req.NativeLanguage != nil {
		if !config.IsSupported(*req.NativeLanguage) {
			return nil, ErrUnsupportedLocale
		}
		user.NativeLanguage = config.NormalizeLocale(*req.NativeLanguage)
	}

	if err := s.profileRepo.Update(ctx, user); err != nil {
		return nil, fmt.Errorf("update user: %w", err)
	}

	return s.GetProfile(ctx, userID)
}

func buildProfileResponse(
	user *model.User,
	lives int,
	secondsToNext *int,
	streak *model.UserStreak,
	daily *model.DailyActivityLog,
) *dto.UserProfileResponse {
	resp := &dto.UserProfileResponse{
		ID:             user.ID,
		Email:          user.Email,
		DisplayName:    user.DisplayName,
		AvatarURL:      user.AvatarURL,
		TargetCountry:  user.TargetCountry,
		NativeLanguage: user.NativeLanguage,
		LanguageLevel:  user.LanguageLevel,
		DailyGoal:     user.DailyGoal,
		CurrentXP:     user.CurrentXP,
		TotalXP:       user.TotalXP,
		CurrentLevel:  user.CurrentLevel,
		LevelTitle:    LevelTitle(user.CurrentLevel),
		XPToNextLevel: XPToNextLevel(user.CurrentLevel, user.TotalXP),
		Gems:          user.Gems,
		Catnip:        user.Catnip,
		IsPremium:     user.IsPremium,
		CatName:       user.CatName,
		Timezone:      user.Timezone,
		CreatedAt:     user.CreatedAt,
		Lives: dto.LivesResponse{
			Current:       lives,
			Max:           MaxLives,
			SecondsToNext: secondsToNext,
		},
	}

	if user.Profession != nil {
		resp.Profession = &dto.ProfessionResponse{
			ID:   user.Profession.ID,
			Name: user.Profession.Name,
			Slug: user.Profession.Slug,
		}
	}

	if streak != nil {
		resp.Streak = dto.StreakResponse{
			CurrentStreak: streak.CurrentStreak,
			LongestStreak: streak.LongestStreak,
			StreakShields:  streak.StreakShields,
		}
	}

	xpTarget := DailyXPTarget(user.DailyGoal)
	resp.DailyProgress = dto.DailyProgressResponse{
		GoalType: user.DailyGoal,
		XPTarget: xpTarget,
	}
	if daily != nil {
		resp.DailyProgress.XPToday = daily.XPEarned
		resp.DailyProgress.StagesCompleted = daily.StagesCompleted
		resp.DailyProgress.GoalMet = daily.DailyGoalMet
	}

	return resp
}
