package main

import (
	"fmt"
	"log"

	"gorm.io/gorm"
)

// seedScenes writes placeholder scene content onto existing stages and
// inserts one synonym_match exercise per module. All writes are guarded
// with IS NULL / NOT EXISTS so the function stays idempotent.
//
// Scene content is deliberately minimal — authors will replace it with
// real openers/endings per the content track. The seed only exists so
// the mobile flow has something to render end-to-end in dev.
func seedScenes(db *gorm.DB) {
	// 1. Scene metadata for the first stage of the first unit in each module.
	//    We key off (unit.order_index=1, stage.order_index=1) so re-running
	//    the seed across content churn stays predictable.
	sceneUpdates := []struct {
		unitOrder  int
		stageOrder int
		openerMd   string
		endingMd   string
		npcKey     string
		tension    string
	}{
		{1, 1,
			"Mr. Johnson, 68, just returned from the OR. He looks groggy and presses the call button.",
			"You explained the post-op pain plan clearly; Mr. Johnson relaxes and thanks you.",
			"patient.johnson", "calm"},
		{2, 1,
			"Sarah waves you over at the nurses' station. Handover in five.",
			"Sarah nods — 'Cleaner handover than my last shift. Nice.'",
			"peer.sarah", "calm"},
	}
	for _, s := range sceneUpdates {
		err := db.Exec(`
			UPDATE stages AS st
			   SET scene_opener_md = ?,
			       scene_ending_md = ?,
			       scene_npc_key   = ?,
			       tension_level   = ?
			  FROM units AS u
			 WHERE st.unit_id    = u.id
			   AND u.order_index = ?
			   AND st.order_index = ?
			   AND st.scene_opener_md IS NULL;
		`, s.openerMd, s.endingMd, s.npcKey, s.tension, s.unitOrder, s.stageOrder).Error
		if err != nil {
			log.Fatalf("seed scene (u=%d s=%d): %v", s.unitOrder, s.stageOrder, err)
		}
	}

	// 2. One synonym_match exercise per sample stage. Pick 4 vocabulary
	//    UUIDs by canonical_en and attach them at order_index=99 (so they
	//    render last, after the existing scripted exercises).
	synonymInserts := []struct {
		unitOrder  int
		stageOrder int
		vocabWords [4]string
	}{
		{1, 1, [4]string{"pain", "wound", "fever", "bleeding"}},
		{2, 1, [4]string{"pulse", "blood pressure", "temperature", "lungs"}},
	}
	for _, si := range synonymInserts {
		var ids []string
		if err := db.Raw(`
			SELECT id::text FROM vocabulary WHERE canonical_en IN ? ORDER BY canonical_en;
		`, si.vocabWords[:]).Scan(&ids).Error; err != nil {
			log.Fatalf("resolve vocab ids: %v", err)
		}
		if len(ids) < 4 {
			fmt.Printf("seed synonym_match: missing vocabulary for %v (found %d), skipping\n",
				si.vocabWords, len(ids))
			continue
		}

		contentJSON := fmt.Sprintf(`{
			"type": "synonym_match",
			"mode": "pair",
			"direction": "native_to_target",
			"pairs": ["%s","%s","%s","%s"]
		}`, ids[0], ids[1], ids[2], ids[3])

		err := db.Exec(`
			INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content, difficulty_level)
			SELECT st.id, 'synonym_match', 99, 20, ?::jsonb, 2
			  FROM stages AS st
			  JOIN units  AS u ON u.id = st.unit_id
			 WHERE u.order_index = ?
			   AND st.order_index = ?
			   AND NOT EXISTS (
			     SELECT 1 FROM exercises e2
			      WHERE e2.stage_id = st.id
			        AND e2.exercise_type = 'synonym_match'
			   );
		`, contentJSON, si.unitOrder, si.stageOrder).Error
		if err != nil {
			log.Fatalf("insert synonym_match: %v", err)
		}
	}
}
