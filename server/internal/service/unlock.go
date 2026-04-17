package service

import (
	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
)

// ComputeStageUnlockStatus determines the status of each stage based on progression rules:
// - First stage of the first unit is always "available"
// - Subsequent stages: previous stage must be "completed"
// - First stage of subsequent units: previous unit must be ≥80% complete
func ComputeStageUnlockStatus(
	modules []model.CurriculumModule,
	stageProgressMap map[uuid.UUID]*model.UserStageProgress,
) map[uuid.UUID]string {
	result := make(map[uuid.UUID]string)
	isFirst := true

	for _, m := range modules {
		for unitIdx, u := range m.Units {
			var prevStageCompleted bool

			if unitIdx > 0 && len(m.Units[unitIdx-1].Stages) > 0 {
				// Check if previous unit is sufficiently complete (≥80%)
				prevUnit := m.Units[unitIdx-1]
				completed := 0
				for _, st := range prevUnit.Stages {
					if p, ok := stageProgressMap[st.ID]; ok && p.Status == "completed" {
						completed++
					}
				}
				total := len(prevUnit.Stages)
				if total > 0 && float64(completed)/float64(total) < 0.8 {
					// Previous unit not ≥80% complete; lock all stages in this unit
					for _, st := range u.Stages {
						result[st.ID] = "locked"
					}
					continue
				}
			}

			for stageIdx, st := range u.Stages {
				if p, ok := stageProgressMap[st.ID]; ok && p.Status == "completed" {
					result[st.ID] = "completed"
					prevStageCompleted = true
					continue
				}

				if isFirst {
					result[st.ID] = "available"
					isFirst = false
					prevStageCompleted = false
					continue
				}

				if stageIdx == 0 {
					// First stage in unit — unlocked if we got here (prev unit check passed)
					result[st.ID] = "available"
					prevStageCompleted = false
					continue
				}

				if prevStageCompleted {
					result[st.ID] = "available"
					prevStageCompleted = false
				} else {
					result[st.ID] = "locked"
				}
			}
		}
	}

	return result
}
