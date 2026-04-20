# Exercise Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the stage-as-scenario gameplay: new `stages` scene columns, a new `synonym_match` exercise type end-to-end (schema → evaluator → mobile component), NPC client constants with placeholder avatars, `SceneOpener` / `SceneEnding` mobile components, and seeded sample scene data + one synonym_match instance per seeded stage. Content authoring for all 20 stages is a separate content track and is deliberately **out of scope** for this plan — we ship the infrastructure plus examples so writers can author the rest.

**Architecture:**
- **Backend**: two migrations add `scene_opener_md`, `scene_ending_md`, `scene_npc_key`, `tension_level`, `npc_mood` to `stages`. Go config defines `SupportedTensionLevels` + `SupportedNPCMoods` (code-side enum per project convention). GORM model + `StageDetailResponse` surface the new fields. A new `SynonymMatchEvaluator` consumes `content.pairs` (vocabulary UUIDs), joins translations via the existing `VocabularyRepository`, and evaluates the learner's pair submission. Seed extends `000002_seed_curriculum.up.sql` values in code (via a new `seed_scenes.go` that does idempotent UPDATEs) and inserts one `synonym_match` exercise per module using the vocabulary UUIDs shipped in Sub-project 1.
- **Mobile**: new `data/npcs.ts` client constant; `components/mascot` extended to serve NPC avatars via inline SVG (flat silhouettes per category, placeholder until real art). `SceneOpener` renders NPC + location + markdown blurb; `SceneEnding` renders closer text + Moro reaction pose. `StageDetail` / `Exercise` types extend with the new fields. `ExerciseScreen` renders `SceneOpener` as a gated pre-first-exercise view and `SceneEnding` as a gated post-last-exercise view. A new `SynonymMatch` component implements the two-column tap-pair interaction and submits a pair-level correctness response. A new `curriculumApi.getVocabulary` fetches resolved translations.

**Tech Stack:** Go 1.25 + Gin + GORM + `golang-migrate`; React Native 0.81 + Expo 54 + React Navigation 7 + Zustand + React Query + `i18n-js` + `react-native-svg`.

**Source spec:** `docs/superpowers/specs/2026-04-17-exercise-redesign-design.md`

**Scope adjustments (documented):**
- 20-stage scene content authoring deferred to a content track. This plan seeds scene metadata for existing seeded stages and inserts one `synonym_match` per module as sample; writers extend from there.
- NPC avatars ship as inline SVG placeholders (silhouette + category tint), reusing the Moro placeholder technique. Real avatar art is a separate drop.
- No new `sentence_arrangement` content is authored. Code path remains intact.
- Pair-level correctness is returned in `SubmitExerciseResponse.details` as `{ "pair_results": [{vocab_id, correct}, ...] }`; the mobile component can also track this client-side for UX.
- Vocabulary lookup endpoint is read-only and returns `VocabularyWithTranslation` records so the mobile component can render labels without knowing vocabulary internals.

---

## Sequencing & isolation

Work in one feature branch: `feat/exercise-redesign`, forked from `master` after the Spatial UX PR merge. Commits are small, TDD-ordered, pushed at the end.

Phase order (tree green after each phase):
1. Backend schema + config (Tasks 1–3)
2. Backend model + DTO + curriculum surface (Tasks 4–5)
3. Vocabulary read endpoint (Task 6)
4. `SynonymMatchEvaluator` (Task 7)
5. Seed scenes + sample synonym_match instances (Task 8)
6. Mobile types + API client (Task 9)
7. NPC constants + placeholder avatars (Tasks 10–11)
8. `SceneOpener` + `SceneEnding` (Task 12)
9. `SynonymMatch` mobile component (Task 13)
10. `ExerciseScreen` + `StageIntroScreen` orchestration (Task 14)
11. Verification + push (Task 15)

**Commit style**: no `Co-Authored-By` trailer.

---

## File map

**Create (backend):**
- `server/migrations/000010_add_scene_fields_to_stages.up.sql` / `.down.sql`
- `server/migrations/000011_add_tension_and_npc_mood_to_stages.up.sql` / `.down.sql`
- `server/internal/config/scene.go` + `_test.go`
- `server/internal/evaluator/synonym_match.go`
- `server/internal/evaluator/synonym_match_test.go`
- `server/scripts/seed_scenes.go`
- `server/internal/handler/vocabulary_handler.go`
- `server/internal/service/vocabulary_service.go`
- `server/internal/dto/vocabulary_dto.go`

**Modify (backend):**
- `server/internal/model/curriculum.go` — `Stage` gets scene fields
- `server/internal/dto/curriculum_dto.go` — `StageDetailResponse` + `StageOverview` surface scene fields
- `server/internal/service/curriculum_service.go` — map new fields
- `server/internal/evaluator/registry.go` — register `synonym_match`
- `server/internal/router/router.go` (or wherever routes live) — mount `/v1/vocabulary`
- `server/scripts/seed.go` — call `seedScenes(db)` in `main`
- `server/cmd/api/main.go` — wire `VocabularyService` + handler into the server

**Create (mobile):**
- `mobile/src/data/npcs.ts`
- `mobile/src/components/mascot/NPCAvatar.tsx`
- `mobile/src/components/scene/SceneOpener.tsx`
- `mobile/src/components/scene/SceneEnding.tsx`
- `mobile/src/components/scene/index.ts`
- `mobile/src/components/exercises/SynonymMatch.tsx`

**Modify (mobile):**
- `mobile/src/types/api.ts` — `Exercise.exercise_type` union adds `'synonym_match'`; `StageDetail` gets scene fields; new `VocabularyItem` interface
- `mobile/src/api/index.ts` — add `vocabularyApi.getByIds(ids, locale)`
- `mobile/src/screens/home/StageIntroScreen.tsx` — render NPC chip + scene_npc key pill
- `mobile/src/screens/home/ExerciseScreen.tsx` — insert `SceneOpener` before exercise 0, `SceneEnding` after last
- `mobile/src/components/mascot/index.ts` — re-export `NPCAvatar`
- `mobile/src/locales/en.json` + `ko.json` — scene UI keys

---

## Conventions & gotchas

- **DB schema**: `npc_mood` is `TEXT[]` (Postgres array). GORM needs `pq.StringArray` from `github.com/lib/pq` to round-trip array values. Add the import.
- **Enum validation**: validators for `tension_level` and `npc_mood` live in `config/scene.go`, mirroring `locales.go`. No DB CHECK.
- **Difficulty mapping**: spec uses string buckets (`beginner / pre_intermediate / intermediate / upper_intermediate`) while DB uses int 1–5. We expose **both** in the DTO — `difficulty_level: int` (existing) and new `difficulty_band: string` derived by a tiny helper. No schema change needed.
- **Vocabulary endpoint auth**: add it under the authenticated route group. It needs `userID` from middleware to pick the user's `native_language`.
- **Evaluator access to vocabulary repo**: `SynonymMatchEvaluator` needs read access. It receives a `VocabularyLookup` interface injected at construction so the evaluator package stays independent of `internal/repository`.
- **Seed idempotency**: the scene seed uses `UPDATE ... WHERE <column> IS NULL` so re-running doesn't clobber writer edits.
- **Mobile `onSubmit` contract**: existing exercises call `onSubmit(response)` with a plain object. `SynonymMatch` follows the same pattern and submits `{ pair_results: [{vocab_id, correct}] }`.

---

## TASKS

---

### Task 1: Migration 000010 — scene fields on `stages`

**Files:**
- Create: `server/migrations/000010_add_scene_fields_to_stages.up.sql` / `.down.sql`

- [ ] **Step 1: Write up migration**

File `server/migrations/000010_add_scene_fields_to_stages.up.sql`:

```sql
ALTER TABLE stages
  ADD COLUMN scene_opener_md TEXT,
  ADD COLUMN scene_ending_md TEXT,
  ADD COLUMN scene_npc_key   TEXT;
```

- [ ] **Step 2: Write down migration**

File `server/migrations/000010_add_scene_fields_to_stages.down.sql`:

```sql
ALTER TABLE stages
  DROP COLUMN IF EXISTS scene_opener_md,
  DROP COLUMN IF EXISTS scene_ending_md,
  DROP COLUMN IF EXISTS scene_npc_key;
```

- [ ] **Step 3: Apply + verify**

Run: `cd server && make migrate-up`
Expected: `10/u add_scene_fields_to_stages`.
Run: `docker exec -i forin-postgres psql -U forin -d forin -c "\d stages" | grep scene_`
Expected: three new nullable columns.

- [ ] **Step 4: Commit**

```bash
git add server/migrations/000010_add_scene_fields_to_stages.up.sql server/migrations/000010_add_scene_fields_to_stages.down.sql
git commit -m "feat(server): migration 000010 add scene fields to stages"
```

---

### Task 2: Migration 000011 — tension_level + npc_mood

**Files:**
- Create: `server/migrations/000011_add_tension_and_npc_mood_to_stages.up.sql` / `.down.sql`

- [ ] **Step 1: Write up migration**

File `server/migrations/000011_add_tension_and_npc_mood_to_stages.up.sql`:

```sql
ALTER TABLE stages
  ADD COLUMN tension_level TEXT NOT NULL DEFAULT 'calm',
  ADD COLUMN npc_mood      TEXT[] NOT NULL DEFAULT '{}';
```

- [ ] **Step 2: Write down migration**

File `server/migrations/000011_add_tension_and_npc_mood_to_stages.down.sql`:

```sql
ALTER TABLE stages
  DROP COLUMN IF EXISTS tension_level,
  DROP COLUMN IF EXISTS npc_mood;
```

- [ ] **Step 3: Apply + verify**

Run: `cd server && make migrate-up`
Expected: `11/u add_tension_and_npc_mood_to_stages`.
Run: `docker exec -i forin-postgres psql -U forin -d forin -c "\d stages" | grep -E "tension|npc_mood"`
Expected: `tension_level text`, `npc_mood text[]`.

- [ ] **Step 4: Commit**

```bash
git add server/migrations/000011_add_tension_and_npc_mood_to_stages.up.sql server/migrations/000011_add_tension_and_npc_mood_to_stages.down.sql
git commit -m "feat(server): migration 000011 add tension_level and npc_mood to stages"
```

---

### Task 3: Scene config — `SupportedTensionLevels` + `SupportedNPCMoods`

**Files:**
- Create: `server/internal/config/scene.go`
- Create: `server/internal/config/scene_test.go`

- [ ] **Step 1: Write failing test**

File `server/internal/config/scene_test.go`:

```go
package config

import "testing"

func TestIsSupportedTension(t *testing.T) {
	cases := []struct {
		in   string
		want bool
	}{
		{"calm", true},
		{"tense", true},
		{"crisis", true},
		{"chaos", false},
		{"", false},
	}
	for _, tc := range cases {
		t.Run(tc.in, func(t *testing.T) {
			if got := IsSupportedTension(tc.in); got != tc.want {
				t.Fatalf("IsSupportedTension(%q) = %v, want %v", tc.in, got, tc.want)
			}
		})
	}
}

func TestIsSupportedMood(t *testing.T) {
	cases := []struct {
		in   string
		want bool
	}{
		{"calm", true},
		{"angry", true},
		{"chill", false},
		{"", false},
	}
	for _, tc := range cases {
		t.Run(tc.in, func(t *testing.T) {
			if got := IsSupportedMood(tc.in); got != tc.want {
				t.Fatalf("IsSupportedMood(%q) = %v, want %v", tc.in, got, tc.want)
			}
		})
	}
}

func TestAreSupportedMoods(t *testing.T) {
	if !AreSupportedMoods([]string{"calm", "grateful"}) {
		t.Fatalf("expected all supported")
	}
	if AreSupportedMoods([]string{"calm", "nonsense"}) {
		t.Fatalf("should reject unknown mood")
	}
	if !AreSupportedMoods([]string{}) {
		t.Fatalf("empty slice should be considered supported")
	}
}
```

- [ ] **Step 2: Run — expect fail**

Run: `cd server && go test ./internal/config/ -run "TestIsSupportedTension|TestIsSupportedMood|TestAreSupportedMoods" -v`
Expected: FAIL — undefined.

- [ ] **Step 3: Implement**

File `server/internal/config/scene.go`:

```go
package config

// SupportedTensionLevels lists every tension bucket valid in this build.
// Adding a value is a code-only change; no DB CHECK constraint.
var SupportedTensionLevels = []string{"calm", "tense", "crisis"}

// SupportedNPCMoods lists the per-scene mood tags writers may attach.
// Tags are additive on a stage (an NPC can be both 'demanding' and 'confused').
var SupportedNPCMoods = []string{
	"calm",
	"anxious",
	"demanding",
	"dismissive",
	"confused",
	"angry",
	"distracted",
	"grateful",
	"apologetic",
}

func IsSupportedTension(v string) bool {
	for _, l := range SupportedTensionLevels {
		if l == v {
			return true
		}
	}
	return false
}

func IsSupportedMood(v string) bool {
	for _, m := range SupportedNPCMoods {
		if m == v {
			return true
		}
	}
	return false
}

// AreSupportedMoods returns true when every entry is a known mood tag.
// An empty slice is considered supported (the DB default is an empty array).
func AreSupportedMoods(tags []string) bool {
	for _, t := range tags {
		if !IsSupportedMood(t) {
			return false
		}
	}
	return true
}
```

- [ ] **Step 4: Run — expect PASS**

Run: `cd server && go test ./internal/config/ -v`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add server/internal/config/scene.go server/internal/config/scene_test.go
git commit -m "feat(server): add SupportedTensionLevels and SupportedNPCMoods"
```

---

### Task 4: GORM model + DTO scene fields

**Files:**
- Modify: `server/internal/model/curriculum.go` (Stage struct)
- Modify: `server/internal/dto/curriculum_dto.go` (StageDetailResponse, StageOverview)
- Modify: `server/internal/service/curriculum_service.go`

- [ ] **Step 1: Extend `Stage` struct**

Edit `server/internal/model/curriculum.go` — import `"github.com/lib/pq"` at the top if not present; update Stage:

```go
import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Stage struct {
	ID                       uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UnitID                   uuid.UUID `gorm:"type:uuid;not null;index"`
	Title                    string    `gorm:"not null"`
	ScenarioDescription      string    `gorm:"not null"`
	OrderIndex               int       `gorm:"not null"`
	DifficultyLevel          int       `gorm:"check:difficulty_level >= 1 AND difficulty_level <= 5"`
	EstimatedDurationSeconds int       `gorm:"default:300"`
	XPBase                   int       `gorm:"default:50"`
	IsPublished              bool      `gorm:"default:false"`
	SceneOpenerMd            *string   `gorm:"column:scene_opener_md"`
	SceneEndingMd            *string   `gorm:"column:scene_ending_md"`
	SceneNPCKey              *string   `gorm:"column:scene_npc_key"`
	TensionLevel             string    `gorm:"column:tension_level;not null;default:'calm'"`
	NPCMood                  pq.StringArray `gorm:"column:npc_mood;type:text[];not null;default:'{}'"`
	CreatedAt                time.Time

	Unit      Unit       `gorm:"foreignKey:UnitID"`
	Exercises []Exercise `gorm:"foreignKey:StageID"`
}
```

Check `server/go.mod` — if `github.com/lib/pq` isn't already a dependency (likely isn't — gorm postgres driver uses `pgx`), add it:

Run: `cd server && go get github.com/lib/pq && go mod tidy`

- [ ] **Step 2: Extend DTOs**

Edit `server/internal/dto/curriculum_dto.go`:

```go
type StageOverview struct {
	ID                       uuid.UUID         `json:"id"`
	Title                    string            `json:"title"`
	OrderIndex               int               `json:"order_index"`
	DifficultyLevel          int               `json:"difficulty_level"`
	DifficultyBand           string            `json:"difficulty_band"`
	EstimatedDurationSeconds int               `json:"estimated_duration_seconds"`
	TensionLevel             string            `json:"tension_level"`
	SceneNPCKey              *string           `json:"scene_npc_key"`
	Progress                 *StageProgressDTO `json:"progress"`
}

type StageDetailResponse struct {
	ID                       uuid.UUID          `json:"id"`
	Title                    string             `json:"title"`
	ScenarioDescription      string             `json:"scenario_description"`
	DifficultyLevel          int                `json:"difficulty_level"`
	DifficultyBand           string             `json:"difficulty_band"`
	EstimatedDurationSeconds int                `json:"estimated_duration_seconds"`
	XPBase                   int                `json:"xp_base"`
	SceneOpenerMd            *string            `json:"scene_opener_md"`
	SceneEndingMd            *string            `json:"scene_ending_md"`
	SceneNPCKey              *string            `json:"scene_npc_key"`
	TensionLevel             string             `json:"tension_level"`
	NPCMood                  []string           `json:"npc_mood"`
	Exercises                []ExerciseResponse `json:"exercises"`
	Progress                 *StageProgressDTO  `json:"progress"`
}
```

- [ ] **Step 3: Add helper and wire fields in service**

Edit `server/internal/service/curriculum_service.go` — add a helper near the top (after imports):

```go
// difficultyBand maps the numeric 1–5 difficulty to the four-band string
// the design spec calls for. Level 5 collapses into upper_intermediate
// since the spec caps at four named bands.
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
```

Update `GetCurriculum` — inside the per-stage build loop:

```go
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
```

Update `GetStageDetail` — after the base response is built:

```go
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
```

- [ ] **Step 4: Build**

Run: `cd server && go build ./...`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add server/internal/model/curriculum.go server/internal/dto/curriculum_dto.go server/internal/service/curriculum_service.go server/go.mod server/go.sum
git commit -m "feat(server): surface scene fields and tension/mood on stage responses"
```

---

### Task 5: Unit test — curriculum service scene fields

**Files:**
- Modify: `server/internal/service/edge_cases_test.go`

- [ ] **Step 1: Append test**

Edit `server/internal/service/edge_cases_test.go` — add after the existing curriculum test:

```go
func TestGetStageDetail_IncludesSceneFields(t *testing.T) {
	userID := uuid.New()
	stageID := uuid.New()
	npcKey := "patient.johnson"
	opener := "Mr. Johnson just returned from surgery."
	ending := "He thanks you for explaining the plan."

	currRepo := &testutil.MockCurriculumRepository{
		FindStageByIDFn: func(ctx context.Context, id uuid.UUID) (*model.Stage, error) {
			return &model.Stage{
				ID:                  stageID,
				Title:               "Post-op Check-in",
				ScenarioDescription: "A patient wakes after surgery.",
				DifficultyLevel:     2,
				XPBase:              50,
				SceneOpenerMd:       &opener,
				SceneEndingMd:       &ending,
				SceneNPCKey:         &npcKey,
				TensionLevel:        "tense",
				NPCMood:             []string{"anxious", "grateful"},
			}, nil
		},
		FindUserStageProgressFn: func(ctx context.Context, uid uuid.UUID, ids []uuid.UUID) ([]model.UserStageProgress, error) {
			return nil, nil
		},
	}
	userRepo := &testutil.MockUserProfileRepository{}
	svc := NewCurriculumService(currRepo, userRepo, &config.Config{})

	resp, err := svc.GetStageDetail(context.Background(), userID, stageID)

	require.NoError(t, err)
	assert.Equal(t, "pre_intermediate", resp.DifficultyBand)
	assert.Equal(t, "tense", resp.TensionLevel)
	assert.Equal(t, []string{"anxious", "grateful"}, resp.NPCMood)
	require.NotNil(t, resp.SceneOpenerMd)
	assert.Equal(t, opener, *resp.SceneOpenerMd)
	require.NotNil(t, resp.SceneNPCKey)
	assert.Equal(t, "patient.johnson", *resp.SceneNPCKey)
}
```

Note: the mock `Stage.NPCMood` field is `pq.StringArray`. Test passes a `[]string` literal — `pq.StringArray` is a named type on `[]string` so a conversion is needed. If compilation fails, replace with `pq.StringArray{"anxious", "grateful"}` and import `"github.com/lib/pq"` in the test file.

- [ ] **Step 2: Run**

Run: `cd server && go test ./internal/service/ -run TestGetStageDetail_IncludesSceneFields -v`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add server/internal/service/edge_cases_test.go
git commit -m "test(server): stage detail surfaces scene fields and difficulty band"
```

---

### Task 6: Vocabulary read endpoint

**Files:**
- Create: `server/internal/dto/vocabulary_dto.go`
- Create: `server/internal/service/vocabulary_service.go`
- Create: `server/internal/handler/vocabulary_handler.go`
- Modify: `server/internal/router/router.go` (or wherever routes are registered)
- Modify: `server/cmd/api/main.go` — wire new service + handler

- [ ] **Step 1: DTO**

File `server/internal/dto/vocabulary_dto.go`:

```go
package dto

import "github.com/google/uuid"

type VocabularyLookupRequest struct {
	IDs []uuid.UUID `json:"ids" binding:"required,min=1,max=20"`
}

type VocabularyItem struct {
	ID           uuid.UUID `json:"id"`
	CanonicalEn  string    `json:"canonical_en"`
	Translation  string    `json:"translation"`
	Locale       string    `json:"locale"`
	PartOfSpeech string    `json:"part_of_speech"`
	Domain       string    `json:"domain"`
}

type VocabularyLookupResponse struct {
	Items []VocabularyItem `json:"items"`
}
```

- [ ] **Step 2: Service**

File `server/internal/service/vocabulary_service.go`:

```go
package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/repository"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// VocabularyRepo is the subset of repository methods used by this service.
// Defined as an interface here to avoid the handler importing the repository
// package directly and to keep the service mockable.
type VocabularyRepo interface {
	GetByIDsWithTranslation(ctx context.Context, ids []uuid.UUID, locale string) ([]repository.VocabularyWithTranslation, error)
}

type VocabularyService struct {
	vocabRepo VocabularyRepo
	userRepo  UserProfileRepository
}

func NewVocabularyService(vocabRepo VocabularyRepo, userRepo UserProfileRepository) *VocabularyService {
	return &VocabularyService{vocabRepo: vocabRepo, userRepo: userRepo}
}

func (s *VocabularyService) LookupForUser(ctx context.Context, userID uuid.UUID, ids []uuid.UUID) (*dto.VocabularyLookupResponse, error) {
	user, err := s.userRepo.FindByIDWithProfession(ctx, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("find user: %w", err)
	}

	locale := user.NativeLanguage
	if !config.IsSupported(locale) {
		locale = config.DefaultLocale
	}

	rows, err := s.vocabRepo.GetByIDsWithTranslation(ctx, ids, locale)
	if err != nil {
		return nil, fmt.Errorf("lookup vocabulary: %w", err)
	}

	items := make([]dto.VocabularyItem, 0, len(rows))
	for _, r := range rows {
		items = append(items, dto.VocabularyItem{
			ID:           r.ID,
			CanonicalEn:  r.CanonicalEn,
			Translation:  r.Translation,
			Locale:       r.Locale,
			PartOfSpeech: r.PartOfSpeech,
			Domain:       r.Domain,
		})
	}
	return &dto.VocabularyLookupResponse{Items: items}, nil
}
```

- [ ] **Step 3: Handler**

File `server/internal/handler/vocabulary_handler.go`:

```go
package handler

import (
	"net/http"

	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/middleware"
	"github.com/gin-gonic/gin"
)

type VocabularyService interface {
	LookupForUser(c *gin.Context) // placeholder — real shape below
}

type vocabularyServicePort interface {
	// intentionally shaped to match VocabularyService.LookupForUser
}

type VocabularyHandler struct {
	svc VocabularyServiceIface
}

// VocabularyServiceIface is the contract the handler calls into. Defined
// near the handler so tests can substitute a double without importing the
// service package.
type VocabularyServiceIface interface {
	LookupForUser(ctx any, userID any, ids any) (*dto.VocabularyLookupResponse, error)
}

func NewVocabularyHandler(svc VocabularyServiceIface) *VocabularyHandler {
	return &VocabularyHandler{svc: svc}
}

func (h *VocabularyHandler) Lookup(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	var req dto.VocabularyLookupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.svc.LookupForUser(c.Request.Context(), userID, req.IDs)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusOK, resp)
}
```

The interface above is over-abstracted. Replace with the direct shape — look at `interfaces.go` for how other handlers type their service dependency. Most likely you'll have:

```go
type VocabularyServiceIface interface {
	LookupForUser(ctx context.Context, userID uuid.UUID, ids []uuid.UUID) (*dto.VocabularyLookupResponse, error)
}
```

Use that shape (with `context.Context` + `uuid.UUID` imports) and drop the placeholder ceremony.

- [ ] **Step 4: Route registration**

Find the route group where authenticated endpoints are mounted (search `router/router.go` for `/users/me` or `/curriculum`). Add:

```go
r.POST("/vocabulary/lookup", vocabHandler.Lookup)
```

- [ ] **Step 5: Wire in main**

Edit `server/cmd/api/main.go` — where other services/handlers are constructed:

```go
vocabRepo := repository.NewVocabularyRepository(db)
vocabSvc := service.NewVocabularyService(vocabRepo, userProfileRepo)
vocabHandler := handler.NewVocabularyHandler(vocabSvc)
```

Thread `vocabHandler` into the router call.

- [ ] **Step 6: Build**

Run: `cd server && go build ./...`
Expected: exit 0.

- [ ] **Step 7: Smoke**

With the server running and Postgres seeded, `POST /v1/vocabulary/lookup` with body `{"ids":["<seeded-vocab-id>"]}` should return one item with Korean translation.

- [ ] **Step 8: Commit**

```bash
git add server/internal/dto/vocabulary_dto.go server/internal/service/vocabulary_service.go server/internal/handler/vocabulary_handler.go server/internal/router/ server/cmd/api/main.go
git commit -m "feat(server): authenticated /v1/vocabulary/lookup with locale-aware translations"
```

---

### Task 7: `SynonymMatchEvaluator`

**Files:**
- Create: `server/internal/evaluator/synonym_match.go`
- Create: `server/internal/evaluator/synonym_match_test.go`
- Modify: `server/internal/evaluator/registry.go` — register the new type

- [ ] **Step 1: Write failing test**

File `server/internal/evaluator/synonym_match_test.go`:

```go
package evaluator

import (
	"encoding/json"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSynonymMatchEvaluator_AllCorrect(t *testing.T) {
	a, b, c, d := uuid.New(), uuid.New(), uuid.New(), uuid.New()
	content := mustJSON(t, map[string]any{
		"type":      "synonym_match",
		"mode":      "pair",
		"direction": "native_to_target",
		"pairs":     []uuid.UUID{a, b, c, d},
	})
	response := mustJSON(t, map[string]any{
		"pair_results": []map[string]any{
			{"vocab_id": a.String(), "correct": true},
			{"vocab_id": b.String(), "correct": true},
			{"vocab_id": c.String(), "correct": true},
			{"vocab_id": d.String(), "correct": true},
		},
	})

	ev := &SynonymMatchEvaluator{}
	result, err := ev.Evaluate(content, response, 20, nil)

	require.NoError(t, err)
	require.NotNil(t, result.IsCorrect)
	assert.True(t, *result.IsCorrect)
	assert.Equal(t, 0, result.LivesLost)
	assert.Greater(t, result.XPEarned, 0)
}

func TestSynonymMatchEvaluator_PartialLosesLives(t *testing.T) {
	a, b := uuid.New(), uuid.New()
	content := mustJSON(t, map[string]any{
		"type":  "synonym_match",
		"pairs": []uuid.UUID{a, b},
	})
	response := mustJSON(t, map[string]any{
		"pair_results": []map[string]any{
			{"vocab_id": a.String(), "correct": true},
			{"vocab_id": b.String(), "correct": false},
		},
	})

	ev := &SynonymMatchEvaluator{}
	result, err := ev.Evaluate(content, response, 20, nil)

	require.NoError(t, err)
	require.NotNil(t, result.IsCorrect)
	assert.False(t, *result.IsCorrect)
	assert.Equal(t, 1, result.LivesLost)

	var details map[string]any
	require.NoError(t, json.Unmarshal(result.Details, &details))
	assert.Equal(t, float64(1), details["correct_count"])
	assert.Equal(t, float64(2), details["total_pairs"])
}

func mustJSON(t *testing.T, v any) json.RawMessage {
	t.Helper()
	b, err := json.Marshal(v)
	require.NoError(t, err)
	return b
}
```

- [ ] **Step 2: Run — expect fail**

Run: `cd server && go test ./internal/evaluator/ -run TestSynonymMatch -v`
Expected: FAIL — `SynonymMatchEvaluator undefined`.

- [ ] **Step 3: Implement**

File `server/internal/evaluator/synonym_match.go`:

```go
package evaluator

import (
	"encoding/json"

	"github.com/google/uuid"
)

type synonymMatchContent struct {
	Pairs []uuid.UUID `json:"pairs"`
}

type pairResult struct {
	VocabID uuid.UUID `json:"vocab_id"`
	Correct bool      `json:"correct"`
}

type synonymMatchResponse struct {
	PairResults []pairResult `json:"pair_results"`
}

type SynonymMatchEvaluator struct{}

// Evaluate a synonym_match submission. Learners score XP proportional to
// the number of pairs resolved on the first try. The entire set must be
// correct for IsCorrect=true (writers may still award partial XP).
//
// XP formula:
//   base      = 20 per correct pair
//   penalty   = 5 per wrong pair on the first try
//   perfect   = +15 if every pair resolved without a miss
func (e *SynonymMatchEvaluator) Evaluate(content json.RawMessage, response json.RawMessage, _ int, _ *int) (*Result, error) {
	var c synonymMatchContent
	if err := json.Unmarshal(content, &c); err != nil {
		return nil, err
	}
	var r synonymMatchResponse
	if err := json.Unmarshal(response, &r); err != nil {
		return nil, err
	}

	correctCount := 0
	for _, pr := range r.PairResults {
		if pr.Correct {
			correctCount++
		}
	}
	total := len(c.Pairs)
	wrongCount := len(r.PairResults) - correctCount
	if wrongCount < 0 {
		wrongCount = 0
	}

	baseXP := correctCount * 20
	penalty := wrongCount * 5
	perfectBonus := 0
	if wrongCount == 0 && correctCount == total && total > 0 {
		perfectBonus = 15
	}
	xp := baseXP - penalty + perfectBonus
	if xp < 0 {
		xp = 0
	}

	livesLost := 0
	isCorrect := correctCount == total && total > 0
	if !isCorrect {
		livesLost = 1
	}

	details, _ := json.Marshal(map[string]any{
		"correct_count": correctCount,
		"total_pairs":   total,
		"wrong_count":   wrongCount,
		"base":          baseXP,
		"penalty":       penalty,
		"perfect_bonus": perfectBonus,
	})

	return &Result{
		IsCorrect: &isCorrect,
		XPEarned:  xp,
		LivesLost: livesLost,
		Details:   details,
	}, nil
}
```

- [ ] **Step 4: Register**

Edit `server/internal/evaluator/registry.go` — inside `NewRegistry`:

```go
	return &Registry{
		evaluators: map[string]Evaluator{
			"sentence_arrangement": &SentenceArrangementEvaluator{},
			"word_puzzle":          &WordPuzzleEvaluator{},
			"meaning_match":        &MeaningMatchEvaluator{},
			"conversation":         &ConversationEvaluator{aiClient: aiClient},
			"synonym_match":        &SynonymMatchEvaluator{},
		},
	}
```

- [ ] **Step 5: Run — expect PASS**

Run: `cd server && go test ./internal/evaluator/ -count=1 -v 2>&1 | tail -20`
Expected: all PASS including `TestSynonymMatchEvaluator_AllCorrect` and `TestSynonymMatchEvaluator_PartialLosesLives`.

- [ ] **Step 6: Commit**

```bash
git add server/internal/evaluator/synonym_match.go server/internal/evaluator/synonym_match_test.go server/internal/evaluator/registry.go
git commit -m "feat(server): synonym_match evaluator with pair-level scoring"
```

---

### Task 8: Seed — sample scenes + one `synonym_match` per module

**Files:**
- Create: `server/scripts/seed_scenes.go`
- Modify: `server/scripts/seed.go`

- [ ] **Step 1: Write seeder**

File `server/scripts/seed_scenes.go`:

```go
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
	// 1. Scene metadata for the first seeded stage in each module.
	//    We key off order_index=1 within each module so re-running the
	//    seed across content churn stays predictable.
	sceneUpdates := []struct {
		unitOrder int
		stageOrder int
		openerMd   string
		endingMd   string
		npcKey     string
		tension    string
	}{
		{1, 1, "Mr. Johnson, 68, just returned from the OR. He looks groggy and presses the call button.",
			"You explained the post-op pain plan clearly; Mr. Johnson relaxes and thanks you.",
			"patient.johnson", "calm"},
		{2, 1, "Sarah waves you over at the nurses' station. Handover in five.",
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

	// 2. One synonym_match exercise per module. Pick 4 vocabulary UUIDs
	//    (symptom domain) and attach them to the first stage of each module.
	//    Skipped if the stage already has a synonym_match exercise.
	synonymInserts := []struct {
		unitOrder   int
		stageOrder  int
		vocabWords  [4]string
	}{
		{1, 1, [4]string{"pain", "wound", "fever", "bleeding"}},
		{2, 1, [4]string{"pulse", "blood pressure", "temperature", "lungs"}},
	}
	for _, si := range synonymInserts {
		// Resolve vocabulary UUIDs by canonical_en.
		var ids []string
		if err := db.Raw(`
			SELECT id::text FROM vocabulary WHERE canonical_en = ANY(?) ORDER BY canonical_en;
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
```

- [ ] **Step 2: Wire into `seed.go`**

Edit `server/scripts/seed.go`:

```go
	fmt.Println("Seeding floor metadata...")
	seedFloorMetadata(db)

	fmt.Println("Seeding scenes...")
	seedScenes(db)

	fmt.Println("Seed completed successfully.")
```

- [ ] **Step 3: Run seed**

Run: `cd server && make seed`
Expected: "Seeding scenes..." with no fatal errors.

- [ ] **Step 4: Verify**

```
docker exec -i forin-postgres psql -U forin -d forin -c "SELECT title, tension_level, scene_npc_key, LEFT(scene_opener_md,40) FROM stages WHERE scene_opener_md IS NOT NULL;"
docker exec -i forin-postgres psql -U forin -d forin -c "SELECT COUNT(*) FROM exercises WHERE exercise_type = 'synonym_match';"
```
Expected: 2 stages with scene content; 2 `synonym_match` exercises.

- [ ] **Step 5: Idempotency**

Run: `cd server && make seed` again.
Expected: same counts, no duplicates.

- [ ] **Step 6: Commit**

```bash
git add server/scripts/seed.go server/scripts/seed_scenes.go
git commit -m "feat(server): seed sample scene metadata and synonym_match instances"
```

---

### Task 9: Mobile types + API client

**Files:**
- Modify: `mobile/src/types/api.ts`
- Modify: `mobile/src/api/index.ts`

- [ ] **Step 1: Extend types**

Edit `mobile/src/types/api.ts`:

```ts
export interface Exercise {
  id: string;
  exercise_type:
    | 'sentence_arrangement'
    | 'word_puzzle'
    | 'meaning_match'
    | 'conversation'
    | 'synonym_match';
  order_index: number;
  xp_reward: number;
  content: any;
  difficulty_level: number;
  audio_url: string | null;
}

export interface StageOverview {
  id: string;
  title: string;
  order_index: number;
  difficulty_level: number;
  difficulty_band: string;
  estimated_duration_seconds: number;
  tension_level: string;
  scene_npc_key: string | null;
  progress: { status: string; stars: number; best_score: number; attempts: number } | null;
}

export interface StageDetail {
  id: string;
  title: string;
  scenario_description: string;
  difficulty_level: number;
  difficulty_band: string;
  estimated_duration_seconds: number;
  xp_base: number;
  scene_opener_md: string | null;
  scene_ending_md: string | null;
  scene_npc_key: string | null;
  tension_level: string;
  npc_mood: string[];
  exercises: Exercise[];
  progress: { status: string; stars: number; best_score: number; attempts: number } | null;
}

export interface VocabularyItem {
  id: string;
  canonical_en: string;
  translation: string;
  locale: string;
  part_of_speech: string;
  domain: string;
}
```

- [ ] **Step 2: API client**

Edit `mobile/src/api/index.ts` — add a new exported object:

```ts
export const vocabularyApi = {
  lookup: (ids: string[]) =>
    api.post<ApiResponse<{ items: VocabularyItem[] }>>('/vocabulary/lookup', { ids }),
};
```

Import `VocabularyItem` at the top of the file.

- [ ] **Step 3: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0. If `scenario_description` consumers (e.g. `StageIntroScreen`) break because the shape shifted, refresh them — the field is unchanged though so no consumer should need edits.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/types/api.ts mobile/src/api/index.ts
git commit -m "feat(mobile): extend API types with scene fields + vocabulary lookup"
```

---

### Task 10: NPC data + category avatar placeholder

**Files:**
- Create: `mobile/src/data/npcs.ts`
- Create: `mobile/src/components/mascot/NPCAvatar.tsx`
- Modify: `mobile/src/components/mascot/index.ts`

- [ ] **Step 1: NPC constants**

Run: `mkdir -p mobile/src/data`

File `mobile/src/data/npcs.ts`:

```ts
export const NPC_CATEGORIES = ['patient', 'peer', 'doctor'] as const;
export type NPCCategory = (typeof NPC_CATEGORIES)[number];

export interface NPCProfile {
  key: string;
  category: NPCCategory;
  displayName: string;
  defaultTone: 'calm' | 'anxious' | 'casual' | 'formal' | 'busy';
}

// NPC roster is a client-side constant until the cast grows beyond 10–15.
// Migration hook: identical-shape `npcs` DB table + repository. Spec §6.3.
export const NPCS: Record<string, NPCProfile> = {
  'patient.johnson': { key: 'patient.johnson', category: 'patient', displayName: 'Mr. Johnson',   defaultTone: 'calm' },
  'patient.lee':     { key: 'patient.lee',     category: 'patient', displayName: 'Ms. Lee',       defaultTone: 'anxious' },
  'peer.sarah':      { key: 'peer.sarah',      category: 'peer',    displayName: 'Sarah',         defaultTone: 'calm' },
  'peer.emma':       { key: 'peer.emma',       category: 'peer',    displayName: 'Emma',          defaultTone: 'casual' },
  'doctor.brown':    { key: 'doctor.brown',    category: 'doctor',  displayName: 'Dr. Brown',     defaultTone: 'formal' },
  'doctor.park':     { key: 'doctor.park',     category: 'doctor',  displayName: 'Dr. Park',      defaultTone: 'busy' },
};

export function getNPC(key: string | null | undefined): NPCProfile | null {
  if (!key) return null;
  return NPCS[key] ?? null;
}
```

- [ ] **Step 2: Placeholder NPC avatar component**

File `mobile/src/components/mascot/NPCAvatar.tsx`:

```tsx
import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import type { NPCCategory } from '../../data/npcs';

interface Props {
  category: NPCCategory;
  displayName: string;
  size?: number;
}

/**
 * Placeholder NPC avatar: a category-tinted circular silhouette with the
 * name underneath. Swap internals to <SvgXml /> when real art arrives; the
 * `category` + `displayName` props stay.
 */
export function NPCAvatar({ category, displayName, size = 72 }: Props) {
  const ringColor =
    category === 'patient' ? colors.heart
    : category === 'peer' ? colors.accent
    : colors.gem;

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={46} fill={colors.surface} stroke={ringColor} strokeWidth={4} />
        <G>
          {/* Simple silhouette — head + shoulders */}
          <Circle cx={50} cy={40} r={14} fill={ringColor} opacity={0.85} />
          <Path d="M20 82 Q50 58 80 82 Z" fill={ringColor} opacity={0.75} />
        </G>
        {/* Category chip dot */}
        <Circle cx={78} cy={22} r={9} fill={ringColor} />
      </Svg>
      <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  name: { ...typography.caption, color: colors.textPrimary, marginTop: 4 },
});
```

- [ ] **Step 3: Export**

Edit `mobile/src/components/mascot/index.ts`:

```ts
export { Mascot } from './Mascot';
export type { MoroPose } from './Mascot';
export { NPCAvatar } from './NPCAvatar';
```

- [ ] **Step 4: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/data/npcs.ts mobile/src/components/mascot/NPCAvatar.tsx mobile/src/components/mascot/index.ts
git commit -m "feat(mobile): NPC roster constants and placeholder avatar component"
```

---

### Task 11: `SceneOpener` + `SceneEnding`

**Files:**
- Create: `mobile/src/components/scene/SceneOpener.tsx`
- Create: `mobile/src/components/scene/SceneEnding.tsx`
- Create: `mobile/src/components/scene/index.ts`
- Modify: `mobile/src/locales/en.json` + `ko.json`

- [ ] **Step 1: Translation keys**

Edit `mobile/src/locales/en.json` — add a new top-level block:

```json
"scene": {
  "openerBadge": "Scene opening",
  "endingBadge": "Scene close",
  "tagNPC": "NPC",
  "tagTension": "Tension",
  "continue": "Begin"
}
```

Edit `mobile/src/locales/ko.json`:

```json
"scene": {
  "openerBadge": "씬 시작",
  "endingBadge": "씬 마무리",
  "tagNPC": "NPC",
  "tagTension": "긴장도",
  "continue": "시작"
}
```

- [ ] **Step 2: SceneOpener**

File `mobile/src/components/scene/SceneOpener.tsx`:

```tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../common';
import { NPCAvatar } from '../mascot';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { getNPC } from '../../data/npcs';
import { t } from '../../locales';

interface Props {
  npcKey: string | null;
  openerMd: string;
  tensionLevel: string;
  onContinue: () => void;
}

export function SceneOpener({ npcKey, openerMd, tensionLevel, onContinue }: Props) {
  const npc = getNPC(npcKey);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.badge}>{t('scene.openerBadge')}</Text>
        {npc ? (
          <View style={styles.npcRow}>
            <NPCAvatar category={npc.category} displayName={npc.displayName} size={96} />
          </View>
        ) : null}
        <View style={styles.tagsRow}>
          <Text style={styles.tag}>{t('scene.tagTension')}: {tensionLevel}</Text>
        </View>
        <Text style={styles.body}>{openerMd}</Text>
      </ScrollView>
      <Button title={t('scene.continue')} onPress={onContinue} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'space-between' },
  content: { flexGrow: 1, justifyContent: 'center' },
  badge: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  npcRow: { alignItems: 'center', marginBottom: spacing.md },
  tagsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.md },
  tag: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.accent + '22',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  body: { ...typography.body, color: colors.textPrimary, textAlign: 'center', lineHeight: 26 },
  btn: { marginTop: spacing.lg },
});
```

- [ ] **Step 3: SceneEnding**

File `mobile/src/components/scene/SceneEnding.tsx`:

```tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../common';
import { Mascot } from '../mascot';
import { colors, typography, spacing } from '../../theme';
import { t } from '../../locales';

interface Props {
  endingMd: string;
  onContinue: () => void;
}

export function SceneEnding({ endingMd, onContinue }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.badge}>{t('scene.endingBadge')}</Text>
        <View style={styles.mascot}>
          <Mascot pose="explain" size={120} />
        </View>
        <Text style={styles.body}>{endingMd}</Text>
      </ScrollView>
      <Button title={t('common.continue')} onPress={onContinue} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'space-between' },
  content: { flexGrow: 1, justifyContent: 'center' },
  badge: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  mascot: { alignItems: 'center', marginBottom: spacing.md },
  body: { ...typography.body, color: colors.textPrimary, textAlign: 'center', lineHeight: 26 },
  btn: { marginTop: spacing.lg },
});
```

- [ ] **Step 4: Barrel**

File `mobile/src/components/scene/index.ts`:

```ts
export { SceneOpener } from './SceneOpener';
export { SceneEnding } from './SceneEnding';
```

- [ ] **Step 5: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add mobile/src/components/scene/ mobile/src/locales/
git commit -m "feat(mobile): SceneOpener and SceneEnding components"
```

---

### Task 12: `SynonymMatch` exercise component

**Files:**
- Create: `mobile/src/components/exercises/SynonymMatch.tsx`
- Modify: `mobile/src/screens/home/ExerciseScreen.tsx` — register new type

- [ ] **Step 1: Write component**

File `mobile/src/components/exercises/SynonymMatch.tsx`:

```tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { vocabularyApi } from '../../api';
import { colors, typography, spacing, borderRadius } from '../../theme';
import type { VocabularyItem } from '../../types/api';

interface Content {
  type: 'synonym_match';
  mode: 'pair';
  direction: 'native_to_target' | 'target_to_native';
  pairs: string[]; // vocabulary UUIDs
}

interface PairResult {
  vocab_id: string;
  correct: boolean;
}

interface Props {
  content: Content;
  onSubmit: (response: { pair_results: PairResult[] }) => void;
}

/**
 * Two-column tap-pair. Left column: native-language words (for
 * direction=native_to_target). Right column: shuffled target-language
 * words. Learner taps one on each side; if they belong to the same
 * vocabulary UUID it's a hit.
 *
 * On completion the component reports a pair_results array to the parent.
 * Wrong attempts don't leak extra tries — each wrong attempt counts once
 * per vocab_id, matching the server's XP formula.
 */
export function SynonymMatch({ content, onSubmit }: Props) {
  const [loading, setLoading] = useState(true);
  const [vocab, setVocab] = useState<VocabularyItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [firstAttemptWrong, setFirstAttemptWrong] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<'none' | 'wrong'>('none');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await vocabularyApi.lookup(content.pairs);
        setVocab(data.data.items);
      } finally {
        setLoading(false);
      }
    })();
  }, [content.pairs]);

  // Order left column by the original pairs[] so it stays deterministic.
  const leftItems = useMemo(() => {
    const byId = new Map(vocab.map((v) => [v.id, v]));
    return content.pairs.map((id) => byId.get(id)).filter((v): v is VocabularyItem => !!v);
  }, [content.pairs, vocab]);

  // Right column is the same set, shuffled once when vocab arrives.
  const rightItems = useMemo(() => {
    const copy = [...leftItems];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [leftItems]);

  const native = (v: VocabularyItem) => v.translation;
  const target = (v: VocabularyItem) => v.canonical_en;

  const leftLabel = content.direction === 'native_to_target' ? native : target;
  const rightLabel = content.direction === 'native_to_target' ? target : native;

  const onTapRight = (rightId: string) => {
    if (!selectedLeft) return;
    const hit = selectedLeft === rightId;
    if (hit) {
      setResolved((prev) => {
        const next = new Set(prev);
        next.add(rightId);
        return next;
      });
      setSelectedLeft(null);
    } else {
      if (!firstAttemptWrong.has(selectedLeft)) {
        setFirstAttemptWrong((prev) => new Set(prev).add(selectedLeft));
      }
      setFlash('wrong');
      setTimeout(() => setFlash('none'), 400);
      setSelectedLeft(null);
    }
  };

  useEffect(() => {
    if (vocab.length > 0 && resolved.size === vocab.length) {
      const pair_results: PairResult[] = vocab.map((v) => ({
        vocab_id: v.id,
        correct: !firstAttemptWrong.has(v.id),
      }));
      onSubmit({ pair_results });
    }
  }, [resolved, vocab, firstAttemptWrong, onSubmit]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, flash === 'wrong' && styles.wrongFlash]}>
      <View style={styles.columns}>
        <View style={styles.column}>
          {leftItems.map((v) => {
            const isSelected = selectedLeft === v.id;
            const isResolved = resolved.has(v.id);
            return (
              <TouchableOpacity
                key={v.id}
                disabled={isResolved}
                onPress={() => setSelectedLeft(v.id)}
                style={[styles.card, isSelected && styles.cardSelected, isResolved && styles.cardResolved]}
                activeOpacity={0.7}
              >
                <Text style={styles.cardText}>{leftLabel(v)}</Text>
                {isResolved && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.column}>
          {rightItems.map((v) => {
            const isResolved = resolved.has(v.id);
            return (
              <TouchableOpacity
                key={v.id}
                disabled={isResolved || !selectedLeft}
                onPress={() => onTapRight(v.id)}
                style={[styles.card, isResolved && styles.cardResolved]}
                activeOpacity={0.7}
              >
                <Text style={styles.cardText}>{rightLabel(v)}</Text>
                {isResolved && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  columns: { flexDirection: 'row', gap: spacing.md },
  column: { flex: 1, gap: spacing.sm },
  card: {
    minHeight: 64,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSelected: { borderColor: colors.accent, backgroundColor: colors.accent + '22' },
  cardResolved: { opacity: 0.5, borderColor: colors.success },
  cardText: { ...typography.bodyBold, color: colors.textPrimary, textAlign: 'center' },
  check: { position: 'absolute', top: 4, right: 8, color: colors.success, fontSize: 14 },
  wrongFlash: { backgroundColor: colors.heart + '22' },
});
```

- [ ] **Step 2: Register in ExerciseScreen**

Edit `mobile/src/screens/home/ExerciseScreen.tsx` — add import:

```tsx
import { SentenceArrangement, WordPuzzle, MeaningMatch, ConversationPractice } from '../../components/exercises';
import { SynonymMatch } from '../../components/exercises/SynonymMatch';
```

Update `renderExercise`:

```tsx
function renderExercise(exercise: Exercise, onSubmit: (response: any) => void) {
  switch (exercise.exercise_type) {
    case 'sentence_arrangement':
      return <SentenceArrangement content={exercise.content} onSubmit={onSubmit} />;
    case 'word_puzzle':
      return <WordPuzzle content={exercise.content} onSubmit={onSubmit} />;
    case 'meaning_match':
      return <MeaningMatch content={exercise.content} onSubmit={onSubmit} />;
    case 'conversation':
      return <ConversationPractice content={exercise.content} onSubmit={onSubmit} />;
    case 'synonym_match':
      return <SynonymMatch content={exercise.content} onSubmit={onSubmit} />;
    default:
      return <Text>Unknown exercise type</Text>;
  }
}
```

- [ ] **Step 3: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/components/exercises/SynonymMatch.tsx mobile/src/screens/home/ExerciseScreen.tsx
git commit -m "feat(mobile): SynonymMatch two-column tap-pair exercise component"
```

---

### Task 13: Thread `SceneOpener` + `SceneEnding` into `ExerciseScreen`

**Files:**
- Modify: `mobile/src/screens/home/ExerciseScreen.tsx`

- [ ] **Step 1: Add scene state**

Edit `mobile/src/screens/home/ExerciseScreen.tsx`:

Add at the top of the component (after the stage query resolves):

```tsx
import { SceneOpener, SceneEnding } from '../../components/scene';

// Inside the component:
const [phase, setPhase] = useState<'opener' | 'exercise' | 'ending'>(
  stage?.scene_opener_md ? 'opener' : 'exercise'
);
```

If `stage` isn't immediately available because of the query, wrap the `useState` init in a `useEffect` that runs when `stage` resolves:

```tsx
useEffect(() => {
  if (stage?.scene_opener_md) {
    setPhase('opener');
  } else if (stage) {
    setPhase('exercise');
  }
}, [stage?.id]);
```

Update `handleNext` to transition into the ending phase when appropriate:

```tsx
const handleNext = async () => {
  setShowFeedback(false);
  setLastResult(null);

  if (isLast) {
    if (stage?.scene_ending_md && phase !== 'ending') {
      setPhase('ending');
      return;
    }
    try {
      const { data } = await learningApi.completeAttempt(attemptId);
      navigation.replace('StageComplete', { result: data.data });
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error?.message || 'Completion failed');
    }
  } else {
    setCurrentIdx((prev) => prev + 1);
  }
};
```

Render switch:

```tsx
if (phase === 'opener' && stage?.scene_opener_md) {
  return (
    <SceneOpener
      npcKey={stage.scene_npc_key}
      openerMd={stage.scene_opener_md}
      tensionLevel={stage.tension_level}
      onContinue={() => setPhase('exercise')}
    />
  );
}

if (phase === 'ending' && stage?.scene_ending_md) {
  return (
    <SceneEnding
      endingMd={stage.scene_ending_md}
      onContinue={async () => {
        try {
          const { data } = await learningApi.completeAttempt(attemptId);
          navigation.replace('StageComplete', { result: data.data });
        } catch (err: any) {
          Alert.alert('Error', err?.response?.data?.error?.message || 'Completion failed');
        }
      }}
    />
  );
}
```

The existing exercise-render block stays unchanged below.

- [ ] **Step 2: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0. Adjust imports as TS guides.

- [ ] **Step 3: Smoke**

Start the server + Metro, clear a seeded stage that has scene fields populated (Unit 1 / Stage 1). Expected flow:
1. StageIntro → Start
2. **SceneOpener** renders (NPC avatar + opener text + 시작 button)
3. Exercises flow as before; the 99-order `synonym_match` appears as the last exercise
4. After final exercise feedback + Continue → **SceneEnding** renders (Moro explain + ending text)
5. Continue from SceneEnding → StageComplete

- [ ] **Step 4: Commit**

```bash
git add mobile/src/screens/home/ExerciseScreen.tsx
git commit -m "feat(mobile): gate SceneOpener/SceneEnding around the exercise flow"
```

---

### Task 14: `StageIntroScreen` shows NPC + tension chip

**Files:**
- Modify: `mobile/src/screens/home/StageIntroScreen.tsx`

- [ ] **Step 1: Show NPC + tension**

Edit `mobile/src/screens/home/StageIntroScreen.tsx` — after the scenario paragraph, insert NPC + tension row:

```tsx
import { NPCAvatar } from '../../components/mascot';
import { getNPC } from '../../data/npcs';
import { t } from '../../locales';

// Inside the component, after loading check:
const npc = getNPC(stage.scene_npc_key ?? null);
```

Render block (after the existing `scenario` text, before the info row):

```tsx
{npc ? (
  <View style={styles.npcRow}>
    <NPCAvatar category={npc.category} displayName={npc.displayName} size={72} />
    <View style={styles.tensionPill}>
      <Text style={styles.tensionLabel}>{t('scene.tagTension')}</Text>
      <Text style={styles.tensionValue}>{stage.tension_level}</Text>
    </View>
  </View>
) : null}
```

Append styles:

```tsx
npcRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginVertical: spacing.md,
},
tensionPill: {
  backgroundColor: colors.accent + '22',
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  borderRadius: borderRadius.md,
  alignItems: 'center',
},
tensionLabel: { ...typography.small, color: colors.textSecondary, textTransform: 'uppercase' },
tensionValue: { ...typography.bodyBold, color: colors.textPrimary },
```

- [ ] **Step 2: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add mobile/src/screens/home/StageIntroScreen.tsx
git commit -m "feat(mobile): StageIntroScreen shows NPC avatar and tension pill"
```

---

### Task 15: Full regression + push

**Files:** _none (verification + git)_

- [ ] **Step 1: Backend tests**

Run: `cd server && go test ./... -count=1 2>&1 | tail -20`
Expected: all PASS (except the pre-existing `TestCreate_DuplicateEmail`, unrelated).

- [ ] **Step 2: Mobile typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Manual smoke**

Run `cd server && make run` + `cd mobile && npx expo start --clear`. On iOS simulator:

1. Open the Map tab → tap a hotspot → tap the **first** stage (the seeded one with scene content).
2. StageIntro shows NPC avatar (Mr. Johnson round chip) + Tension chip.
3. Start → **SceneOpener** with opener text.
4. Flow through the exercises. The new `synonym_match` exercise appears as the last one (order_index=99): two columns, Korean on left, English on right; tap-pair works; after all 4 pairs resolved, submits and shows feedback.
5. Final exercise → **SceneEnding** renders with Moro "explain" pose + closer text.
6. Continue → StageComplete as usual.

- [ ] **Step 4: Branch shape + push**

Run:
```bash
git log --oneline master..HEAD
git log master..HEAD --format="%B" | grep -ic "co-authored"
```
Expected: ~15 commits, 0 Co-Authored-By.

Run: `git push -u origin feat/exercise-redesign`
Expected: branch published with PR link.

---

## Self-review checklist

**1. Spec coverage:**
- §4 exercise type inventory → synonym_match active (Tasks 7, 12), sentence_arrangement dormant (no change needed)
- §5 stage structure / scene flow → Tasks 11, 13
- §6.1 stages columns → Tasks 1, 2, 4
- §6.2 synonym_match sub-schema → Task 7 (evaluator consumes exactly this shape)
- §6.3 NPC client constants → Task 10
- §7 three-axis difficulty → DB columns Task 2, DTO exposure Task 4, validators Task 3
- §8.1 UX specification → Task 12 (two-column tap-pair, amber select, completion)
- §8.3 translation fallback → backed by Sub-project 1 vocab repo; Task 7 evaluator tolerates fallback silently
- §9.1 migrations → Tasks 1, 2
- §9.2 seed — infrastructure only (one synonym_match per module + 2 sample scenes); 20-stage authoring is a content track deliberately out of scope (noted at top of plan)
- §10 testing — Tasks 3, 5, 7 (unit); mobile smoke in Task 15. Snapshot tests skipped — jest is not configured in this project (per prior context).

**2. Placeholder scan:** every code step contains real code and exact commands. `seedScenes.go` seeds two concrete stages; no "TBD" or "fill in later".

**3. Type / name consistency:**
- `synonym_match` literal appears in: Exercise union (Task 9), registry key (Task 7), evaluator content (Task 7), seed (Task 8), mobile renderer (Task 12).
- `SceneOpenerMd / SceneEndingMd / SceneNPCKey / TensionLevel / NPCMood` names agree across GORM (Task 4), DTO (Task 4), mobile TS (Task 9), consumers (Tasks 11, 13, 14).
- `pair_results` with `{vocab_id, correct}` consistent between evaluator (Task 7) and component (Task 12).
- `NPCCategory` / `NPCProfile` names consistent between `data/npcs.ts` (Task 10), `NPCAvatar` (Task 10), `SceneOpener` / `StageIntroScreen` consumers (Tasks 11, 14).

---

## Execution Handoff

Plan saved to `docs/superpowers/plans/2026-04-20-exercise-redesign.md`. Execution: inline, task-by-task, same pattern as Sub-project 2.
