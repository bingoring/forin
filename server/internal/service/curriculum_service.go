package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var ErrStageNotFound = errors.New("stage not found")

// difficultyBand maps the numeric 1–5 difficulty to the four-band string
// the Spatial/Exercise design spec calls for. Level 5 collapses into
// upper_intermediate since the spec caps at four named bands.
func difficultyBand(level int) string {
	switch {
	case level <= 1:
		return "beginner"
	case level == 2:
		return "pre_intermediate"
	case level == 3:
		return "intermediate"
	default:
		return "upper_intermediate"
	}
}

type CurriculumService struct {
	curriculumRepo CurriculumRepository
	userRepo       UserProfileRepository
	cfg            *config.Config
}

func NewCurriculumService(currRepo CurriculumRepository, userRepo UserProfileRepository, cfg *config.Config) *CurriculumService {
	return &CurriculumService{curriculumRepo: currRepo, userRepo: userRepo, cfg: cfg}
}

func (s *CurriculumService) GetCurriculum(ctx context.Context, userID uuid.UUID) (*dto.CurriculumResponse, error) {
	user, err := s.userRepo.FindByIDWithProfession(ctx, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("find user: %w", err)
	}

	if user.ProfessionID == nil || user.TargetCountry == nil {
		return &dto.CurriculumResponse{Modules: []dto.ModuleResponse{}}, nil
	}

	modules, err := s.curriculumRepo.FindModulesByProfessionAndCountry(ctx, *user.ProfessionID, *user.TargetCountry)
	if err != nil {
		return nil, fmt.Errorf("find modules: %w", err)
	}

	// Collect all stage IDs and module IDs for batch progress lookup
	var stageIDs []uuid.UUID
	var moduleIDs []uuid.UUID
	for _, m := range modules {
		moduleIDs = append(moduleIDs, m.ID)
		for _, u := range m.Units {
			for _, st := range u.Stages {
				stageIDs = append(stageIDs, st.ID)
			}
		}
	}

	stageProgressList, _ := s.curriculumRepo.FindUserStageProgress(ctx, userID, stageIDs)
	moduleProgressList, _ := s.curriculumRepo.FindUserModuleProgress(ctx, userID, moduleIDs)

	// Index progress by ID
	stageProgressMap := make(map[uuid.UUID]*model.UserStageProgress)
	for i := range stageProgressList {
		stageProgressMap[stageProgressList[i].StageID] = &stageProgressList[i]
	}
	moduleProgressMap := make(map[uuid.UUID]*model.UserModuleProgress)
	for i := range moduleProgressList {
		moduleProgressMap[moduleProgressList[i].ModuleID] = &moduleProgressList[i]
	}

	// Build response
	var moduleResps []dto.ModuleResponse
	for _, m := range modules {
		mr := dto.ModuleResponse{
			ID:               m.ID,
			Title:            m.Title,
			Description:      m.Description,
			OrderIndex:       m.OrderIndex,
			MinLevelRequired: m.MinLevelRequired,
			FloorOrder:       m.FloorOrder,
			FloorLabel:       m.FloorLabel,
			FloorIcon:        m.FloorIcon,
			MapAssetKey:      m.MapAssetKey,
		}

		if mp, ok := moduleProgressMap[m.ID]; ok {
			mr.Progress = &dto.ModuleProgressDTO{
				Status:               mp.Status,
				CompletionPercentage: mp.CompletionPercentage,
			}
		}

		var unitResps []dto.UnitResponse
		for _, u := range m.Units {
			ur := dto.UnitResponse{
				ID:                   u.ID,
				Title:                u.Title,
				Description:          u.Description,
				OrderIndex:           u.OrderIndex,
				LocationType:         u.LocationType,
				MapX:                 u.MapX,
				MapY:                 u.MapY,
				HotspotLabelOverride: u.HotspotLabelOverride,
			}

			var stageResps []dto.StageOverview
			for _, st := range u.Stages {
				so := dto.StageOverview{
					ID:                       st.ID,
					Title:                    st.Title,
					OrderIndex:               st.OrderIndex,
					DifficultyLevel:          st.DifficultyLevel,
					DifficultyBand:           difficultyBand(st.DifficultyLevel),
					EstimatedDurationSeconds: st.EstimatedDurationSeconds,
					TensionLevel:             st.TensionLevel,
					SceneNPCKey:              st.SceneNPCKey,
				}
				if sp, ok := stageProgressMap[st.ID]; ok {
					so.Progress = &dto.StageProgressDTO{
						Status:    sp.Status,
						Stars:     sp.Stars,
						BestScore: sp.BestScore,
						Attempts:  sp.Attempts,
					}
				}
				stageResps = append(stageResps, so)
			}
			ur.Stages = stageResps
			unitResps = append(unitResps, ur)
		}
		mr.Units = unitResps
		moduleResps = append(moduleResps, mr)
	}

	// Unlock state: floor 1 (lowest floor_order) is always unlocked; rows
	// in user_unlocked_floors cover everything above that.
	explicitUnlocks, _ := s.curriculumRepo.FindUnlockedModuleIDs(ctx, userID)
	unlockedSet := map[uuid.UUID]struct{}{}
	for _, id := range explicitUnlocks {
		unlockedSet[id] = struct{}{}
	}
	var baselineFloorOrder int
	var baselineModuleID uuid.UUID
	for _, m := range modules {
		if baselineFloorOrder == 0 || m.FloorOrder < baselineFloorOrder {
			baselineFloorOrder = m.FloorOrder
			baselineModuleID = m.ID
		}
	}
	if baselineModuleID != uuid.Nil {
		unlockedSet[baselineModuleID] = struct{}{}
	}
	unlockedIDs := make([]uuid.UUID, 0, len(unlockedSet))
	for id := range unlockedSet {
		unlockedIDs = append(unlockedIDs, id)
	}

	return &dto.CurriculumResponse{
		Modules:           moduleResps,
		UnlockedModuleIDs: unlockedIDs,
	}, nil
}

func (s *CurriculumService) GetStageDetail(ctx context.Context, userID, stageID uuid.UUID) (*dto.StageDetailResponse, error) {
	stage, err := s.curriculumRepo.FindStageByID(ctx, stageID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrStageNotFound
		}
		return nil, fmt.Errorf("find stage: %w", err)
	}

	resp := &dto.StageDetailResponse{
		ID:                       stage.ID,
		Title:                    stage.Title,
		ScenarioDescription:      stage.ScenarioDescription,
		DifficultyLevel:          stage.DifficultyLevel,
		DifficultyBand:           difficultyBand(stage.DifficultyLevel),
		EstimatedDurationSeconds: stage.EstimatedDurationSeconds,
		XPBase:                   stage.XPBase,
		SceneOpenerMd:            stage.SceneOpenerMd,
		SceneEndingMd:            stage.SceneEndingMd,
		SceneNPCKey:              stage.SceneNPCKey,
		TensionLevel:             stage.TensionLevel,
		NPCMood:                  []string(stage.NPCMood),
	}

	for _, ex := range stage.Exercises {
		contentJSON, _ := json.Marshal(ex.Content)
		resp.Exercises = append(resp.Exercises, dto.ExerciseResponse{
			ID:              ex.ID,
			ExerciseType:    ex.ExerciseType,
			OrderIndex:      ex.OrderIndex,
			XPReward:        ex.XPReward,
			Content:         contentJSON,
			DifficultyLevel: ex.DifficultyLevel,
			AudioURL:        ex.AudioURL,
		})
	}

	progressList, _ := s.curriculumRepo.FindUserStageProgress(ctx, userID, []uuid.UUID{stageID})
	if len(progressList) > 0 {
		p := progressList[0]
		resp.Progress = &dto.StageProgressDTO{
			Status:    p.Status,
			Stars:     p.Stars,
			BestScore: p.BestScore,
			Attempts:  p.Attempts,
		}
	}

	return resp, nil
}
