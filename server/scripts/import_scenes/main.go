// Command import_scenes imports stage scene metadata and synonym_match
// exercises from YAML files under docs/content/stages/*.yaml.
//
// The command is idempotent: re-running updates scene fields in place and
// replaces any existing synonym_match content on the stage (keyed by the
// exercise order_index declared in the YAML). Other exercise types on
// the stage are left untouched.
//
// Usage: go run ./scripts/import_scenes [path]
//   path defaults to ../docs/content/stages (relative to server/).
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/database"
	"github.com/forin/server/internal/logger"
	"github.com/google/uuid"
	"gopkg.in/yaml.v3"
	"gorm.io/gorm"
)

// --- YAML shape ---

type stageFile struct {
	Locate    locate     `yaml:"locate"`
	Scene     *scene     `yaml:"scene"`
	Exercises []exercise `yaml:"exercises"`

	// path is the source file, populated by the loader for error messages.
	path string `yaml:"-"`
}

type locate struct {
	FloorOrder      int `yaml:"floor_order"`
	UnitOrderIndex  int `yaml:"unit_order_index"`
	StageOrderIndex int `yaml:"stage_order_index"`
}

type scene struct {
	OpenerMd     *string  `yaml:"opener_md"`
	EndingMd     *string  `yaml:"ending_md"`
	NPCKey       *string  `yaml:"npc_key"`
	TensionLevel *string  `yaml:"tension_level"`
	NPCMood      []string `yaml:"npc_mood"`
}

type exercise struct {
	Type       string   `yaml:"type"`
	Direction  string   `yaml:"direction"`
	OrderIndex int      `yaml:"order_index"`
	Pairs      []string `yaml:"pairs"`
}

// --- Main flow ---

func main() {
	contentDir := "../docs/content/stages"
	if len(os.Args) > 1 {
		contentDir = os.Args[1]
	}

	cfg := config.Load()
	zapLog := logger.Init(cfg.Env)
	db, err := database.New(cfg, zapLog)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	files, err := loadStageFiles(contentDir)
	if err != nil {
		log.Fatalf("load content dir %q: %v", contentDir, err)
	}
	if len(files) == 0 {
		fmt.Printf("No YAML files under %s — nothing to import.\n", contentDir)
		return
	}

	for _, sf := range files {
		if err := applyStage(db, sf); err != nil {
			log.Fatalf("apply %s: %v", sf.path, err)
		}
		fmt.Printf("Imported %s\n", filepath.Base(sf.path))
	}
	fmt.Printf("Imported %d stage file(s) successfully.\n", len(files))
}

func loadStageFiles(dir string) ([]stageFile, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}
	var out []stageFile
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".yaml") {
			continue
		}
		full := filepath.Join(dir, e.Name())
		raw, err := os.ReadFile(full)
		if err != nil {
			return nil, fmt.Errorf("read %s: %w", full, err)
		}
		var sf stageFile
		if err := yaml.Unmarshal(raw, &sf); err != nil {
			return nil, fmt.Errorf("parse %s: %w", full, err)
		}
		sf.path = full
		out = append(out, sf)
	}
	return out, nil
}

func applyStage(db *gorm.DB, sf stageFile) error {
	// Resolve stage UUID via the locate triple.
	var stageID uuid.UUID
	err := db.Raw(`
		SELECT st.id
		  FROM stages AS st
		  JOIN units AS u ON u.id = st.unit_id
		  JOIN curriculum_modules AS m ON m.id = u.module_id
		 WHERE m.floor_order   = ?
		   AND u.order_index   = ?
		   AND st.order_index  = ?
		 LIMIT 1;
	`, sf.Locate.FloorOrder, sf.Locate.UnitOrderIndex, sf.Locate.StageOrderIndex).
		Row().Scan(&stageID)
	if err != nil {
		return fmt.Errorf("locate stage (floor=%d unit=%d stage=%d): %w",
			sf.Locate.FloorOrder, sf.Locate.UnitOrderIndex, sf.Locate.StageOrderIndex, err)
	}

	if sf.Scene != nil {
		if err := applyScene(db, stageID, sf.Scene); err != nil {
			return fmt.Errorf("apply scene: %w", err)
		}
	}

	for _, ex := range sf.Exercises {
		if err := applyExercise(db, stageID, ex); err != nil {
			return fmt.Errorf("apply exercise type=%q: %w", ex.Type, err)
		}
	}

	return nil
}

func applyScene(db *gorm.DB, stageID uuid.UUID, s *scene) error {
	// Only update fields that are set in the YAML so absent keys don't
	// clobber DB state. We build the update payload dynamically.
	updates := map[string]any{}
	if s.OpenerMd != nil {
		updates["scene_opener_md"] = *s.OpenerMd
	}
	if s.EndingMd != nil {
		updates["scene_ending_md"] = *s.EndingMd
	}
	if s.NPCKey != nil {
		updates["scene_npc_key"] = *s.NPCKey
	}
	if s.TensionLevel != nil {
		updates["tension_level"] = *s.TensionLevel
	}
	if s.NPCMood != nil {
		// Empty-slice-explicit: writer wanted to clear moods.
		updates["npc_mood"] = pqArray(s.NPCMood)
	}
	if len(updates) == 0 {
		return nil
	}

	// Walk the map once so SET columns and arg list stay aligned; Go's
	// map iteration order is non-deterministic so we must not iterate it
	// twice.
	cols := make([]string, 0, len(updates))
	args := make([]any, 0, len(updates)+1)
	for k, v := range updates {
		cols = append(cols, k+" = ?")
		args = append(args, v)
	}
	args = append(args, stageID)

	sql := fmt.Sprintf("UPDATE stages SET %s WHERE id = ?;", strings.Join(cols, ", "))
	return db.Exec(sql, args...).Error
}

func applyExercise(db *gorm.DB, stageID uuid.UUID, ex exercise) error {
	switch ex.Type {
	case "synonym_match":
		return applySynonymMatch(db, stageID, ex)
	default:
		return fmt.Errorf("unsupported exercise type %q (MVP supports synonym_match only)", ex.Type)
	}
}

func applySynonymMatch(db *gorm.DB, stageID uuid.UUID, ex exercise) error {
	if len(ex.Pairs) < 2 || len(ex.Pairs) > 6 {
		return fmt.Errorf("synonym_match requires 2..6 pairs, got %d", len(ex.Pairs))
	}

	// Resolve canonical_en → vocabulary.id, preserving input order so the
	// left column lays out the way the writer intended.
	vocabIDs := make([]string, 0, len(ex.Pairs))
	for _, word := range ex.Pairs {
		var id string
		if err := db.Raw(`SELECT id::text FROM vocabulary WHERE canonical_en = ? LIMIT 1;`, word).
			Row().Scan(&id); err != nil {
			return fmt.Errorf("vocabulary %q not found (seed it first): %w", word, err)
		}
		vocabIDs = append(vocabIDs, id)
	}

	content := map[string]any{
		"type":      "synonym_match",
		"mode":      "pair",
		"direction": ex.Direction,
		"pairs":     vocabIDs,
	}
	contentJSON, err := json.Marshal(content)
	if err != nil {
		return err
	}

	orderIndex := ex.OrderIndex
	if orderIndex == 0 {
		orderIndex = 99 // default — append after hand-authored exercises
	}

	// No unique index exists on (stage_id, exercise_type, order_index)
	// so upsert is emulated: delete any existing synonym_match at the
	// same order slot, then insert fresh. Wrapped in a tx so a failed
	// import leaves the stage untouched.
	return db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Exec(`
			DELETE FROM exercises
			 WHERE stage_id = ?
			   AND exercise_type = 'synonym_match'
			   AND order_index = ?;
		`, stageID, orderIndex).Error; err != nil {
			return err
		}
		return tx.Exec(`
			INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content, difficulty_level)
			VALUES (?, 'synonym_match', ?, 20, ?::jsonb, 2);
		`, stageID, orderIndex, string(contentJSON)).Error
	})
}

// --- Small helpers ---

// pqArray formats a []string as a Postgres text array literal. We use it
// because GORM's Exec + map binding won't auto-encode slices.
func pqArray(values []string) string {
	quoted := make([]string, 0, len(values))
	for _, v := range values {
		escaped := strings.ReplaceAll(v, `"`, `\"`)
		quoted = append(quoted, fmt.Sprintf(`"%s"`, escaped))
	}
	return "{" + strings.Join(quoted, ",") + "}"
}

