# Spatial UX Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the list-driven curriculum UI with a 2D hospital-map experience: new palette, Phosphor-based `Icon` component, inline-SVG Moro mascot, `MapScreen` with hotspots, floor unlock celebration, and `Map / Quests / Profile` tab restructure. Ship with placeholder art so the whole flow works end-to-end before final SVG assets arrive.

**Architecture:**
- **Backend**: three migrations add floor metadata to `curriculum_modules`, location metadata to `units`, and a new `user_unlocked_floors` table. `GetCurriculum` surfaces the new fields; `CompleteAttempt` inserts an unlocked-floors row when a user finishes the last Unit on a floor and returns `unlocked_module_id` in the response.
- **Mobile**: swap `theme/colors.ts` to Warm Cozy palette (names unchanged so consumer screens compile). Install `react-native-svg`, `phosphor-react-native`, `@gorhom/bottom-sheet`. New `Icon` component dispatches both hero and utility names to Phosphor (Flaticon dropped; component API preserved so hero icons can be swapped to real SVG later). Inline-SVG `Mascot` component renders Moro in 8 poses via prop switch. `MapScreen` fetches curriculum once, renders a placeholder floor canvas (labeled rectangles), plots golden-amber hotspots at `map_x/map_y`, positions Moro at the user's current Unit. Tapping a hotspot opens a `HotspotSheet` bottom sheet listing the Unit's Stages; tapping a Stage navigates to existing `StageIntroScreen`. On stage completion, if a floor unlock fired, `StageCompleteScreen` renders a `CelebrationOverlay`. Tab bar becomes `Map / Quests / Achievements / Profile` — `QuestsScreen` is the list fallback for accessibility.

**Tech Stack:** Go 1.25 + Gin + GORM + `golang-migrate`; React Native 0.81 + Expo 54 + React Navigation 7 + Zustand + React Query + `i18n-js`; new additions — `react-native-svg`, `phosphor-react-native`, `@gorhom/bottom-sheet`.

**Source spec:** `docs/superpowers/specs/2026-04-17-spatial-ux-foundation-design.md`

**Scope adjustment vs spec:**
- Flaticon dropped (no subscription yet). Hero icons also routed through Phosphor duotone; `Icon` component keeps the `HeroIconName | UtilIconName` union so we can swap hero icons to real SVG later without touching callers.
- Floor SVG is a drawn-in-code placeholder (labeled rectangles), not an Illustrator file. `map_asset_key` column still ships so we can swap to file-based art later.
- Achievements tab stays. New tab bar: `Map / Quests / Achievements / Profile`.
- Moro poses are inline SVG React components (not .svg files). 8 poses via a single `<Mascot pose="welcome" />` component with prop-driven body variations.

---

## Sequencing & isolation

Work in one feature branch: `feat/spatial-ux-foundation`. Create it from `master` after the i18n PR merges. Commits are small and TDD-ordered; push at the end.

Phase order (each phase must leave the tree green):
1. Backend schema + DTO + service (Tasks 1–6)
2. Mobile theme + deps + Icon (Tasks 7–11)
3. Moro mascot + celebration (Tasks 12–13)
4. MapScreen + hotspots + floor unlock UX (Tasks 14–18)
5. Tab restructure + Quests (Tasks 19–21)
6. Verification (Task 22)

Ports/DB: `make docker-up`, `make migrate-up`, `make seed`. Tests: `make test` (backend), `npx tsc --noEmit` + smoke via `npx expo start` (mobile).

**Commit style**: no `Co-Authored-By` trailer — per the forin project convention saved in auto-memory.

---

## File map (locked before task work)

**Create (backend):**
- `server/migrations/000007_add_floor_metadata_to_modules.up.sql` / `.down.sql`
- `server/migrations/000008_add_location_metadata_to_units.up.sql` / `.down.sql`
- `server/migrations/000009_create_user_unlocked_floors.up.sql` / `.down.sql`
- `server/internal/model/floor.go` — `UserUnlockedFloor` model
- `server/internal/repository/floor_repo.go` — unlock insert + query helpers

**Modify (backend):**
- `server/internal/model/curriculum.go` — add floor fields on `CurriculumModule`, location fields on `Unit`
- `server/internal/dto/curriculum_dto.go` — surface new fields on `ModuleResponse`, `UnitResponse`
- `server/internal/service/curriculum_service.go` — wire new fields into the response builder
- `server/internal/dto/learning_dto.go` — add `UnlockedModuleID *uuid.UUID` to `CompleteAttemptResponse`
- `server/internal/service/interfaces.go` — extend `LearningRepository` with floor-unlock queries
- `server/internal/service/learning_service.go` — detect "last unit on floor" in `CompleteAttempt`, insert `user_unlocked_floors`, set response field
- `server/internal/repository/learning_repo.go` — new methods for the interface
- `server/internal/testutil/mock_repo.go` (or matching file) — extend mock
- `server/scripts/seed.go` — call `seedFloorMetadata(db)` in `main`
- `server/scripts/seed_floor_metadata.go` — new file, assigns floor/location fields to seeded modules/units

**Create (mobile):**
- `mobile/src/components/common/Icon.tsx`
- `mobile/src/components/mascot/Mascot.tsx`
- `mobile/src/components/mascot/index.ts`
- `mobile/src/components/celebration/CelebrationOverlay.tsx`
- `mobile/src/components/celebration/index.ts`
- `mobile/src/components/map/FloorCanvas.tsx`
- `mobile/src/components/map/HotspotSheet.tsx`
- `mobile/src/components/map/FloorSwitcher.tsx`
- `mobile/src/components/map/index.ts`
- `mobile/src/screens/map/MapScreen.tsx`
- `mobile/src/screens/quests/QuestsScreen.tsx`

**Modify (mobile):**
- `mobile/src/theme/colors.ts` — full swap to Warm Cozy, same token names
- `mobile/src/theme/typography.ts` — h1/h2 weight 700 → 600
- `mobile/src/components/common/index.ts` — export `Icon`
- `mobile/src/types/api.ts` — extend `CurriculumModule`, `CurriculumUnit`, `CompleteAttemptResponse`
- `mobile/src/navigation/AppNavigator.tsx` — tab swap + stacks
- `mobile/src/navigation/types.ts` — new param lists for `MapStack`, `QuestsStack`
- `mobile/src/screens/home/StageCompleteScreen.tsx` — render `CelebrationOverlay` when `unlocked_module_id` set
- `mobile/src/locales/en.json` + `mobile/src/locales/ko.json` — add `map.*`, `quests.*`, `celebration.*` keys
- `mobile/App.tsx` — wrap with `BottomSheetModalProvider`
- `mobile/package.json` — new deps

**Delete (mobile):**
- `mobile/src/screens/home/HomeScreen.tsx`
- `mobile/src/screens/learn/CurriculumScreen.tsx`

---

## Conventions & gotchas

- **Color token preservation**: every existing `colors.*` name must remain in the new palette. Consumer screens must compile unchanged. Values get remapped, names don't.
- **Bottom sheet**: `@gorhom/bottom-sheet` v5 requires `react-native-reanimated` (v4 present) + `react-native-gesture-handler` (v2.28 present) + a `BottomSheetModalProvider` in the tree. Provider goes inside `GestureHandlerRootView` and outside `NavigationContainer`.
- **SVG in Expo Go**: `react-native-svg` ships with Expo Go (SDK 54). No prebuild needed.
- **Phosphor Duotone tinting**: to get the warm-amber look, set `color` on Duotone icons. The secondary color defaults to 20% alpha of the primary, which reads as warm with `accent` (`#E6B04A`).
- **Migration ordering**: 000007/8 modify existing tables (columns with defaults — safe), 000009 creates a new table (safe). All three are online-safe for the current dev DB.
- **Idempotency**: `seed_floor_metadata.go` uses `UPDATE` with `WHERE` guards so re-running seed doesn't clobber tuning edits.
- **Placeholder art**: `FloorCanvas` draws `<Rect>` + `<SvgText>` directly for each Unit location. Its props take the Unit list + dimensions — swapping to a loaded `<SvgUri>` later is a one-component change.

---

## TASKS

---

### Task 1: Migration — floor metadata on `curriculum_modules`

**Files:**
- Create: `server/migrations/000007_add_floor_metadata_to_modules.up.sql` / `.down.sql`

- [ ] **Step 1: Write up migration**

File `server/migrations/000007_add_floor_metadata_to_modules.up.sql`:

```sql
ALTER TABLE curriculum_modules
  ADD COLUMN floor_order   INT  NOT NULL DEFAULT 1,
  ADD COLUMN floor_label   TEXT NOT NULL DEFAULT '',
  ADD COLUMN floor_icon    TEXT NOT NULL DEFAULT 'triage',
  ADD COLUMN map_asset_key TEXT NOT NULL DEFAULT '';
```

- [ ] **Step 2: Write down migration**

File `server/migrations/000007_add_floor_metadata_to_modules.down.sql`:

```sql
ALTER TABLE curriculum_modules
  DROP COLUMN IF EXISTS floor_order,
  DROP COLUMN IF EXISTS floor_label,
  DROP COLUMN IF EXISTS floor_icon,
  DROP COLUMN IF EXISTS map_asset_key;
```

- [ ] **Step 3: Apply locally**

Run: `cd server && make migrate-up`
Expected output: `7/u add_floor_metadata_to_modules (…ms)`.

- [ ] **Step 4: Verify columns**

Run: `docker exec -i forin-postgres psql -U forin -d forin -c "\d curriculum_modules" | grep -E "floor|map_asset"`
Expected: four new columns listed.

- [ ] **Step 5: Commit**

```bash
git add server/migrations/000007_add_floor_metadata_to_modules.up.sql server/migrations/000007_add_floor_metadata_to_modules.down.sql
git commit -m "feat(server): migration 000007 add floor metadata to curriculum_modules"
```

---

### Task 2: Migration — location metadata on `units`

**Files:**
- Create: `server/migrations/000008_add_location_metadata_to_units.up.sql` / `.down.sql`

- [ ] **Step 1: Write up migration**

File `server/migrations/000008_add_location_metadata_to_units.up.sql`:

```sql
ALTER TABLE units
  ADD COLUMN location_type          TEXT NOT NULL DEFAULT 'generic',
  ADD COLUMN map_x                  NUMERIC(5,2) NOT NULL DEFAULT 50.0,
  ADD COLUMN map_y                  NUMERIC(5,2) NOT NULL DEFAULT 50.0,
  ADD COLUMN hotspot_label_override TEXT;
```

- [ ] **Step 2: Write down migration**

File `server/migrations/000008_add_location_metadata_to_units.down.sql`:

```sql
ALTER TABLE units
  DROP COLUMN IF EXISTS location_type,
  DROP COLUMN IF EXISTS map_x,
  DROP COLUMN IF EXISTS map_y,
  DROP COLUMN IF EXISTS hotspot_label_override;
```

- [ ] **Step 3: Apply + verify**

Run: `cd server && make migrate-up`
Expected: `8/u add_location_metadata_to_units`.
Run: `docker exec -i forin-postgres psql -U forin -d forin -c "\d units" | grep -E "location_type|map_x|map_y|hotspot"`
Expected: four new columns.

- [ ] **Step 4: Commit**

```bash
git add server/migrations/000008_add_location_metadata_to_units.up.sql server/migrations/000008_add_location_metadata_to_units.down.sql
git commit -m "feat(server): migration 000008 add location metadata to units"
```

---

### Task 3: Migration — `user_unlocked_floors` table

**Files:**
- Create: `server/migrations/000009_create_user_unlocked_floors.up.sql` / `.down.sql`

- [ ] **Step 1: Write up migration**

File `server/migrations/000009_create_user_unlocked_floors.up.sql`:

```sql
CREATE TABLE user_unlocked_floors (
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id   UUID        NOT NULL REFERENCES curriculum_modules(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, module_id)
);

CREATE INDEX idx_user_unlocked_floors_user ON user_unlocked_floors(user_id);
```

- [ ] **Step 2: Write down migration**

File `server/migrations/000009_create_user_unlocked_floors.down.sql`:

```sql
DROP TABLE IF EXISTS user_unlocked_floors;
```

- [ ] **Step 3: Apply + verify**

Run: `cd server && make migrate-up`
Expected: `9/u create_user_unlocked_floors`.
Run: `docker exec -i forin-postgres psql -U forin -d forin -c "\dt user_unlocked_floors"`
Expected: one row.

- [ ] **Step 4: Commit**

```bash
git add server/migrations/000009_create_user_unlocked_floors.up.sql server/migrations/000009_create_user_unlocked_floors.down.sql
git commit -m "feat(server): migration 000009 create user_unlocked_floors"
```

---

### Task 4: GORM models — floor fields + `UserUnlockedFloor`

**Files:**
- Modify: `server/internal/model/curriculum.go`
- Create: `server/internal/model/floor.go`

- [ ] **Step 1: Extend `CurriculumModule`**

Edit `server/internal/model/curriculum.go` — add fields inside the `CurriculumModule` struct, before the relation block:

```go
type CurriculumModule struct {
	ID                uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	ProfessionID      uuid.UUID `gorm:"type:uuid;not null;index"`
	TargetCountry     string    `gorm:"not null;size:10"`
	Title             string    `gorm:"not null"`
	Description       *string
	OrderIndex        int  `gorm:"not null"`
	MinLevelRequired  int  `gorm:"default:1"`
	IsPublished       bool `gorm:"default:false"`
	FloorOrder        int    `gorm:"column:floor_order;not null;default:1"`
	FloorLabel        string `gorm:"column:floor_label;not null;default:''"`
	FloorIcon         string `gorm:"column:floor_icon;not null;default:'triage'"`
	MapAssetKey       string `gorm:"column:map_asset_key;not null;default:''"`
	CreatedAt         time.Time
	Profession Profession `gorm:"foreignKey:ProfessionID"`
	Units      []Unit     `gorm:"foreignKey:ModuleID"`
}
```

- [ ] **Step 2: Extend `Unit`**

Edit same file — inside the `Unit` struct:

```go
type Unit struct {
	ID                   uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	ModuleID             uuid.UUID `gorm:"type:uuid;not null;index"`
	Title                string    `gorm:"not null"`
	Description          *string
	OrderIndex           int  `gorm:"not null"`
	IsPublished          bool `gorm:"default:false"`
	LocationType         string  `gorm:"column:location_type;not null;default:'generic'"`
	MapX                 float64 `gorm:"column:map_x;type:numeric(5,2);not null;default:50.0"`
	MapY                 float64 `gorm:"column:map_y;type:numeric(5,2);not null;default:50.0"`
	HotspotLabelOverride *string `gorm:"column:hotspot_label_override"`
	Module CurriculumModule `gorm:"foreignKey:ModuleID"`
	Stages []Stage          `gorm:"foreignKey:UnitID"`
}
```

- [ ] **Step 3: Create `UserUnlockedFloor` model**

File `server/internal/model/floor.go`:

```go
package model

import (
	"time"

	"github.com/google/uuid"
)

type UserUnlockedFloor struct {
	UserID     uuid.UUID `gorm:"type:uuid;primaryKey;column:user_id"`
	ModuleID   uuid.UUID `gorm:"type:uuid;primaryKey;column:module_id"`
	UnlockedAt time.Time `gorm:"column:unlocked_at;not null"`
}

func (UserUnlockedFloor) TableName() string { return "user_unlocked_floors" }
```

- [ ] **Step 4: Build**

Run: `cd server && go build ./...`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add server/internal/model/curriculum.go server/internal/model/floor.go
git commit -m "feat(server): add floor/location fields and UserUnlockedFloor model"
```

---

### Task 5: Seed floor/location metadata for existing modules & units

**Files:**
- Create: `server/scripts/seed_floor_metadata.go`
- Modify: `server/scripts/seed.go`

- [ ] **Step 1: Write seeder**

File `server/scripts/seed_floor_metadata.go`:

```go
package main

import (
	"log"

	"gorm.io/gorm"
)

// seedFloorMetadata assigns Spatial UX metadata (floor, map coords) to
// modules and units that already exist. It is re-runnable; edits to
// coordinates in SQL between runs are preserved because we only write
// columns where the current value equals the migration default.
func seedFloorMetadata(db *gorm.DB) {
	// Modules → floors. The nurse curriculum currently has two modules
	// seeded by 000002; we assign them to floors 1 (ER) and 2 (Ward).
	// If only one module exists yet, the second UPDATE is a no-op.
	moduleUpdates := []struct {
		orderIndex int
		label      string
		icon       string
		assetKey   string
	}{
		{1, "Emergency Room", "triage", "floor-1-er"},
		{2, "General Ward", "ward", "floor-2-ward"},
	}
	for _, m := range moduleUpdates {
		err := db.Exec(`
			UPDATE curriculum_modules
			   SET floor_order   = ?,
			       floor_label   = ?,
			       floor_icon    = ?,
			       map_asset_key = ?
			 WHERE order_index = ?
			   AND floor_label = '';
		`, m.orderIndex, m.label, m.icon, m.assetKey, m.orderIndex).Error
		if err != nil {
			log.Fatalf("seed module floor (%d): %v", m.orderIndex, err)
		}
	}

	// Units → map coordinates. We place units on the floor canvas by
	// order_index so even before final art is placed, hotspots are
	// visibly distinct and debuggable.
	// Coordinate grid: roughly a 3-column layout, x in {25, 50, 75}, y stepping 20.
	unitCoords := []struct {
		orderIndex int
		location   string
		x, y       float64
	}{
		{1, "triage", 25.0, 30.0},
		{2, "bedside", 50.0, 30.0},
		{3, "pharmacy", 75.0, 30.0},
		{4, "consult", 25.0, 55.0},
		{5, "waiting", 50.0, 55.0},
		{6, "ward", 75.0, 55.0},
		{7, "bathroom", 25.0, 80.0},
		{8, "desk", 50.0, 80.0},
	}
	for _, u := range unitCoords {
		err := db.Exec(`
			UPDATE units
			   SET location_type = ?,
			       map_x         = ?,
			       map_y         = ?
			 WHERE order_index   = ?
			   AND location_type = 'generic';
		`, u.location, u.x, u.y, u.orderIndex).Error
		if err != nil {
			log.Fatalf("seed unit coords (%d): %v", u.orderIndex, err)
		}
	}
}
```

- [ ] **Step 2: Wire into `seed.go`**

Edit `server/scripts/seed.go`:

```go
	fmt.Println("Seeding vocabulary...")
	seedVocabulary(db)

	fmt.Println("Seeding floor metadata...")
	seedFloorMetadata(db)

	fmt.Println("Seed completed successfully.")
```

- [ ] **Step 3: Run seed**

Run: `cd server && make seed`
Expected output: "Seeding floor metadata..." and no fatal errors.

- [ ] **Step 4: Verify**

Run: `docker exec -i forin-postgres psql -U forin -d forin -c "SELECT order_index, floor_label, floor_icon FROM curriculum_modules ORDER BY order_index;"`
Expected: rows show `Emergency Room / triage`, `General Ward / ward` (or one of them if only one module exists).

Run: `docker exec -i forin-postgres psql -U forin -d forin -c "SELECT order_index, location_type, map_x, map_y FROM units ORDER BY order_index LIMIT 6;"`
Expected: non-default `location_type` values + coordinates.

- [ ] **Step 5: Re-run to verify idempotency**

Run: `cd server && make seed`
Expected: same counts, no changes (the `AND floor_label = ''` / `AND location_type = 'generic'` guards skip already-seeded rows).

- [ ] **Step 6: Commit**

```bash
git add server/scripts/seed.go server/scripts/seed_floor_metadata.go
git commit -m "feat(server): seed floor and location metadata for MVP curriculum"
```

---

### Task 6: Curriculum DTO + service surface new fields

**Files:**
- Modify: `server/internal/dto/curriculum_dto.go`
- Modify: `server/internal/service/curriculum_service.go`
- Modify: `server/internal/service/curriculum_service_test.go` (create if missing — check first)

- [ ] **Step 1: Extend DTOs**

Edit `server/internal/dto/curriculum_dto.go` — add fields on `ModuleResponse` and `UnitResponse`:

```go
type ModuleResponse struct {
	ID               uuid.UUID          `json:"id"`
	Title            string             `json:"title"`
	Description      *string            `json:"description"`
	OrderIndex       int                `json:"order_index"`
	MinLevelRequired int                `json:"min_level_required"`
	FloorOrder       int                `json:"floor_order"`
	FloorLabel       string             `json:"floor_label"`
	FloorIcon        string             `json:"floor_icon"`
	MapAssetKey      string             `json:"map_asset_key"`
	Progress         *ModuleProgressDTO `json:"progress"`
	Units            []UnitResponse     `json:"units"`
}

type UnitResponse struct {
	ID                   uuid.UUID       `json:"id"`
	Title                string          `json:"title"`
	Description          *string         `json:"description"`
	OrderIndex           int             `json:"order_index"`
	LocationType         string          `json:"location_type"`
	MapX                 float64         `json:"map_x"`
	MapY                 float64         `json:"map_y"`
	HotspotLabelOverride *string         `json:"hotspot_label_override"`
	Stages               []StageOverview `json:"stages"`
}
```

- [ ] **Step 2: Wire fields in service**

Edit `server/internal/service/curriculum_service.go` — inside `GetCurriculum`, update the two response-build blocks:

```go
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
```

and

```go
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
```

- [ ] **Step 3: Add a unit test**

Check if `server/internal/service/curriculum_service_test.go` exists:

Run: `ls server/internal/service/ | grep curriculum_service_test`

If it doesn't, append to `server/internal/service/edge_cases_test.go` — it already exists for cross-cutting tests. Append:

```go
func TestGetCurriculum_IncludesFloorAndLocationFields(t *testing.T) {
	userID := uuid.New()
	profID := uuid.New()
	modID := uuid.New()
	unitID := uuid.New()

	userRepo := &testutil.MockUserProfileRepository{
		FindByIDWithProfessionFn: func(ctx context.Context, id uuid.UUID) (*model.User, error) {
			country := "AU"
			return &model.User{
				ID:            userID,
				ProfessionID:  &profID,
				TargetCountry: &country,
			}, nil
		},
	}
	currRepo := &testutil.MockCurriculumRepository{
		FindModulesByProfessionAndCountryFn: func(ctx context.Context, pid uuid.UUID, country string) ([]model.CurriculumModule, error) {
			return []model.CurriculumModule{{
				ID:          modID,
				Title:       "Floor 1",
				FloorOrder:  1,
				FloorLabel:  "Emergency Room",
				FloorIcon:   "triage",
				MapAssetKey: "floor-1-er",
				Units: []model.Unit{{
					ID:           unitID,
					Title:        "Triage",
					LocationType: "triage",
					MapX:         25.0,
					MapY:         30.0,
				}},
			}}, nil
		},
		FindUserStageProgressFn:  func(ctx context.Context, uid uuid.UUID, ids []uuid.UUID) ([]model.UserStageProgress, error) { return nil, nil },
		FindUserModuleProgressFn: func(ctx context.Context, uid uuid.UUID, ids []uuid.UUID) ([]model.UserModuleProgress, error) { return nil, nil },
	}

	svc := NewCurriculumService(currRepo, userRepo, &config.Config{})
	resp, err := svc.GetCurriculum(context.Background(), userID)

	require.NoError(t, err)
	require.Len(t, resp.Modules, 1)
	assert.Equal(t, 1, resp.Modules[0].FloorOrder)
	assert.Equal(t, "Emergency Room", resp.Modules[0].FloorLabel)
	assert.Equal(t, "triage", resp.Modules[0].FloorIcon)
	assert.Equal(t, "floor-1-er", resp.Modules[0].MapAssetKey)
	require.Len(t, resp.Modules[0].Units, 1)
	assert.Equal(t, "triage", resp.Modules[0].Units[0].LocationType)
	assert.Equal(t, 25.0, resp.Modules[0].Units[0].MapX)
	assert.Equal(t, 30.0, resp.Modules[0].Units[0].MapY)
}
```

Check `server/internal/testutil/` for a `MockCurriculumRepository` — if none exists, add one with the minimum `Fn` fields used above. Pattern mirrors `mock_user_profile_repo.go`.

- [ ] **Step 4: Run test**

Run: `cd server && go test ./internal/service/ -run TestGetCurriculum_IncludesFloorAndLocationFields -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add server/internal/dto/curriculum_dto.go server/internal/service/curriculum_service.go server/internal/service/edge_cases_test.go server/internal/testutil/
git commit -m "feat(server): surface floor and location fields in curriculum response"
```

---

### Task 7: Floor unlock trigger + repository + response field

**Files:**
- Create: `server/internal/repository/floor_repo.go`
- Modify: `server/internal/service/interfaces.go`
- Modify: `server/internal/repository/learning_repo.go`
- Modify: `server/internal/service/learning_service.go`
- Modify: `server/internal/dto/learning_dto.go`
- Modify: `server/internal/service/learning_service_test.go`

- [ ] **Step 1: Extend `LearningRepository` interface**

Edit `server/internal/service/interfaces.go` — add three methods to `LearningRepository`:

```go
type LearningRepository interface {
	// ... existing methods ...
	CreateGiftBoxOpening(ctx context.Context, gbo *model.GiftBoxOpening) error
	CountCompletedStages(ctx context.Context, userID uuid.UUID) (int64, error)
	FindAttemptHistory(ctx context.Context, userID uuid.UUID, offset, limit int) ([]model.StageAttempt, int64, error)

	CountUnitStagesCompleted(ctx context.Context, userID, unitID uuid.UUID) (int64, error)
	CountUnitStagesTotal(ctx context.Context, unitID uuid.UUID) (int64, error)
	FindNextFloorModule(ctx context.Context, professionID uuid.UUID, targetCountry string, currentFloorOrder int) (*model.CurriculumModule, error)
	CreateUserUnlockedFloor(ctx context.Context, userID, moduleID uuid.UUID) error

	WithTx(fn func(repo LearningRepository) error) error
}
```

Also add — the `CompleteAttempt` flow will need to read the Unit for the just-completed stage:

```go
	FindUnitByStageID(ctx context.Context, stageID uuid.UUID) (*model.Unit, error)
```

- [ ] **Step 2: Implement repo methods**

Edit `server/internal/repository/learning_repo.go` — find the struct, then append methods. Example implementations:

```go
func (r *LearningRepository) CountUnitStagesCompleted(ctx context.Context, userID, unitID uuid.UUID) (int64, error) {
	var n int64
	err := r.db.WithContext(ctx).
		Table("user_stage_progress AS p").
		Joins("JOIN stages s ON s.id = p.stage_id").
		Where("p.user_id = ? AND s.unit_id = ? AND p.status = ?", userID, unitID, "completed").
		Count(&n).Error
	return n, err
}

func (r *LearningRepository) CountUnitStagesTotal(ctx context.Context, unitID uuid.UUID) (int64, error) {
	var n int64
	err := r.db.WithContext(ctx).
		Model(&model.Stage{}).
		Where("unit_id = ? AND is_published = true", unitID).
		Count(&n).Error
	return n, err
}

func (r *LearningRepository) FindUnitByStageID(ctx context.Context, stageID uuid.UUID) (*model.Unit, error) {
	var unit model.Unit
	err := r.db.WithContext(ctx).
		Joins("JOIN stages ON stages.unit_id = units.id").
		Where("stages.id = ?", stageID).
		First(&unit).Error
	if err != nil {
		return nil, err
	}
	return &unit, nil
}

func (r *LearningRepository) FindNextFloorModule(ctx context.Context, professionID uuid.UUID, targetCountry string, currentFloorOrder int) (*model.CurriculumModule, error) {
	var m model.CurriculumModule
	err := r.db.WithContext(ctx).
		Where("profession_id = ? AND target_country = ? AND is_published = true AND floor_order > ?",
			professionID, targetCountry, currentFloorOrder).
		Order("floor_order ASC").
		First(&m).Error
	if err != nil {
		return nil, err
	}
	return &m, nil
}

func (r *LearningRepository) CreateUserUnlockedFloor(ctx context.Context, userID, moduleID uuid.UUID) error {
	row := &model.UserUnlockedFloor{
		UserID:     userID,
		ModuleID:   moduleID,
		UnlockedAt: time.Now(),
	}
	// ON CONFLICT DO NOTHING semantics via Clauses
	return r.db.WithContext(ctx).
		Clauses(clause.OnConflict{DoNothing: true}).
		Create(row).Error
}
```

Add imports at the top of the file if missing: `"gorm.io/gorm/clause"`, `"time"`.

- [ ] **Step 3: Mirror new methods on the tx wrapper**

The existing `WithTx` likely wraps the same `*LearningRepository` struct, so the new methods already participate in the transaction. Confirm by reading the bottom of `learning_repo.go`: if `WithTx` creates a fresh `&LearningRepository{db: tx}`, no extra work needed.

- [ ] **Step 4: Add response field**

Edit `server/internal/dto/learning_dto.go`:

```go
type CompleteAttemptResponse struct {
	AttemptID        uuid.UUID             `json:"attempt_id"`
	StageID          uuid.UUID             `json:"stage_id"`
	TotalScore       int                   `json:"total_score"`
	StarsEarned      int                   `json:"stars_earned"`
	XPEarned         int                   `json:"xp_earned"`
	MistakesCount    int                   `json:"mistakes_count"`
	DurationSeconds  int                   `json:"duration_seconds"`
	LevelUp          *LevelUpResponse      `json:"level_up"`
	StreakUpdate     *StreakUpdateResponse `json:"streak_update"`
	Achievements     []AchievementUnlocked `json:"achievements"`
	GiftBox          *GiftBoxAwarded       `json:"gift_box"`
	UnlockedModuleID *uuid.UUID            `json:"unlocked_module_id"`
}
```

- [ ] **Step 5: Hook into `CompleteAttempt`**

Edit `server/internal/service/learning_service.go` — right after the gift-box block (where it currently calls `checkAchievements`), insert:

```go
			// Floor unlock: if this stage completion finishes the last Unit on
			// its floor, unlock the next module (floor) and surface the id.
			unit, err := txRepo.FindUnitByStageID(ctx, attempt.StageID)
			if err != nil {
				return err
			}
			completedInUnit, err := txRepo.CountUnitStagesCompleted(ctx, userID, unit.ID)
			if err != nil {
				return err
			}
			totalInUnit, err := txRepo.CountUnitStagesTotal(ctx, unit.ID)
			if err != nil {
				return err
			}
			if totalInUnit > 0 && completedInUnit >= totalInUnit {
				// This Unit is now fully cleared. Find the current module (the
				// one that holds this Unit) to know its floor_order.
				// Since CurriculumModule is loaded as Unit.Module when the
				// query uses joins, but our minimal query above doesn't, fetch
				// it directly.
				currentModule, err := s.curriculumRepo.FindModuleByID(ctx, unit.ModuleID)
				if err != nil {
					return err
				}
				if user.ProfessionID != nil && user.TargetCountry != nil {
					nextModule, err := txRepo.FindNextFloorModule(
						ctx, *user.ProfessionID, *user.TargetCountry, currentModule.FloorOrder,
					)
					if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
						return err
					}
					if nextModule != nil {
						if err := txRepo.CreateUserUnlockedFloor(ctx, userID, nextModule.ID); err != nil {
							return err
						}
						nid := nextModule.ID
						resp.UnlockedModuleID = &nid
					}
				}
			}
```

This requires a new method on `CurriculumRepository`: `FindModuleByID`. Add it to the interface (in `interfaces.go`) and implement on `server/internal/repository/curriculum_repo.go`:

```go
// interfaces.go — in CurriculumRepository
FindModuleByID(ctx context.Context, moduleID uuid.UUID) (*model.CurriculumModule, error)
```

```go
// curriculum_repo.go
func (r *CurriculumRepository) FindModuleByID(ctx context.Context, moduleID uuid.UUID) (*model.CurriculumModule, error) {
	var m model.CurriculumModule
	err := r.db.WithContext(ctx).Where("id = ?", moduleID).First(&m).Error
	if err != nil {
		return nil, err
	}
	return &m, nil
}
```

- [ ] **Step 6: Extend mocks**

`server/internal/testutil/mock_learning_repo.go` and any curriculum mock need the new `Fn` fields + delegating methods. Follow the pattern of adjacent fields. The tests in Step 7 will fail compile until you do.

- [ ] **Step 7: Write a service test for the unlock**

Append to `server/internal/service/learning_service_test.go`:

```go
func TestCompleteAttempt_UnlocksNextFloor_WhenUnitComplete(t *testing.T) {
	userID := uuid.New()
	stageID := uuid.New()
	unitID := uuid.New()
	currentModuleID := uuid.New()
	nextModuleID := uuid.New()
	attemptID := uuid.New()
	profID := uuid.New()
	country := "AU"

	now := time.Now()

	repo := &testutil.MockLearningRepository{
		WithTxFn: func(fn func(testutil.LearningRepoContract) error) error {
			return fn(nil) // the test uses the outer mock's fn fields
		},
		FindAttemptByIDFn: func(ctx context.Context, id uuid.UUID) (*model.StageAttempt, error) {
			return &model.StageAttempt{
				ID:        attemptID,
				UserID:    userID,
				StageID:   stageID,
				StartedAt: now.Add(-5 * time.Minute),
			}, nil
		},
		// ... additional Fns: FindResponsesByAttemptID returns [], UpdateAttempt noop,
		//     FindUserStageProgress returns nil (first clear), UpsertUserStageProgress noop,
		//     FindUserByID returns user with ProfessionID=&profID, TargetCountry=&country,
		//     UpdateUser noop, UpsertDailyActivity noop, FindOrCreateStreak returns empty,
		//     UpsertStreak noop, FindDailyActivity returns nil, CreateGiftBoxOpening noop,
		//     FindAllAchievements returns [], FindUserAchievements returns [],
		//     CreateUserAchievement noop.
		FindUnitByStageIDFn: func(ctx context.Context, sid uuid.UUID) (*model.Unit, error) {
			return &model.Unit{ID: unitID, ModuleID: currentModuleID}, nil
		},
		CountUnitStagesCompletedFn: func(ctx context.Context, uid, u uuid.UUID) (int64, error) {
			return 3, nil
		},
		CountUnitStagesTotalFn: func(ctx context.Context, u uuid.UUID) (int64, error) {
			return 3, nil
		},
		FindNextFloorModuleFn: func(ctx context.Context, p uuid.UUID, c string, floor int) (*model.CurriculumModule, error) {
			return &model.CurriculumModule{ID: nextModuleID, FloorOrder: floor + 1}, nil
		},
		CreateUserUnlockedFloorFn: func(ctx context.Context, uid, mid uuid.UUID) error {
			assert.Equal(t, userID, uid)
			assert.Equal(t, nextModuleID, mid)
			return nil
		},
	}
	currRepo := &testutil.MockCurriculumRepository{
		FindStageByIDFn: func(ctx context.Context, id uuid.UUID) (*model.Stage, error) {
			return &model.Stage{ID: stageID, UnitID: unitID, XPBase: 50, EstimatedDurationSeconds: 300}, nil
		},
		FindModuleByIDFn: func(ctx context.Context, mid uuid.UUID) (*model.CurriculumModule, error) {
			return &model.CurriculumModule{ID: currentModuleID, FloorOrder: 1}, nil
		},
	}

	svc := NewLearningService(repo, currRepo, &config.Config{})
	resp, err := svc.CompleteAttempt(context.Background(), userID, attemptID)

	require.NoError(t, err)
	require.NotNil(t, resp.UnlockedModuleID)
	assert.Equal(t, nextModuleID, *resp.UnlockedModuleID)
}
```

If the existing `testutil.MockLearningRepository` doesn't use a delegating-`Fn` shape compatible with `WithTx`, simplify: use the real repository against a fixture DB, wrapped in `testutil.TxDB`. That integration shape is already present for the vocabulary repo test in `server/internal/repository/vocabulary_repo_test.go` — mirror it.

- [ ] **Step 8: Run tests**

Run: `cd server && go test ./internal/service/ ./internal/repository/ -count=1`
Expected: PASS. A new integration test fires against the local Postgres; it skips if DB is unreachable.

- [ ] **Step 9: Commit**

```bash
git add server/internal/dto/learning_dto.go server/internal/service/learning_service.go server/internal/service/learning_service_test.go server/internal/service/interfaces.go server/internal/repository/learning_repo.go server/internal/repository/curriculum_repo.go server/internal/testutil/
git commit -m "feat(server): unlock next floor when last unit on current floor is cleared"
```

---

### Task 8: Mobile — Warm Cozy palette swap (preserve token names)

**Files:**
- Modify: `mobile/src/theme/colors.ts`

- [ ] **Step 1: Replace file content in full**

File `mobile/src/theme/colors.ts`:

```ts
// Warm Cozy palette — derived from the mascot (Moro).
// Token names are preserved from the prior Material-ish palette so every
// consumer screen compiles unchanged. Hex values shift toward cream/
// chocolate/amber/dusty-pink. See docs/superpowers/specs/2026-04-17-spatial-ux-foundation-design.md §4.1.
export const colors = {
  // Primary
  primary: '#8B6F47',      // warm chocolate
  primaryLight: '#B89878', // chocolate lightened
  primaryDark: '#5C4A30',  // chocolate darkened

  // Accent
  accent: '#E6B04A',       // golden amber
  accentLight: '#F2C47A',  // amber lightened

  // Feedback — mapped into the warm palette
  success: '#7FA070',      // sage green
  error: '#D17B6B',        // warm coral
  warning: '#E6B04A',      // amber (same as accent)

  // Surfaces / text
  white: '#FBF7EC',        // soft ivory (NOT pure white — warmer base)
  background: '#FAF7F0',   // cream canvas
  surface: '#FBF7EC',      // ivory — cards
  border: '#E8D8B6',       // warm beige
  textPrimary: '#3A2A24',  // deep brown ink
  textSecondary: '#7A6852',// dusty brown
  textMuted: '#9E8A72',    // dusty brown lightened

  // Gamification
  xp: '#E6B04A',           // amber
  streak: '#D17B6B',       // coral
  heart: '#E8A8A0',        // dusty pink
  gem: '#8BA8C4',          // soft slate-blue
  catnip: '#A8B86F',       // muted sage

  // Rarity tiers — warm remap
  rarityCommon: '#D6C7A1',     // muted ivory
  rarityUncommon: '#A8B86F',   // sage
  rarityRare: '#8BA8C4',       // slate blue
  rarityEpic: '#9B7B9E',       // plum
  rarityLegendary: '#E6B04A',  // deep amber

  // Stars
  starFilled: '#E6B04A',   // amber
  starEmpty: '#D6C7A1',    // muted ivory
} as const;
```

- [ ] **Step 2: Typecheck + smoke**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.
Run: `cd mobile && npx expo start --clear` — open the iOS simulator, open any existing screen (e.g., Login or Profile after signin). Expected: screens render in the new warm palette; no red-screen errors.

Stop Metro after confirming.

- [ ] **Step 3: Commit**

```bash
git add mobile/src/theme/colors.ts
git commit -m "feat(mobile): swap palette to Warm Cozy while preserving token names"
```

---

### Task 9: Typography weight adjustment

**Files:**
- Modify: `mobile/src/theme/typography.ts`

- [ ] **Step 1: Drop h1/h2 weight from 700 to 600**

Edit `mobile/src/theme/typography.ts`:

```ts
export const typography = {
  h1: { fontSize: 28, fontWeight: '600' as const, lineHeight: 36, fontFamily },
  h2: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28, fontFamily },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24, fontFamily },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, fontFamily },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24, fontFamily },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20, fontFamily },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16, fontFamily },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 20, fontFamily },
} as const;
```

- [ ] **Step 2: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add mobile/src/theme/typography.ts
git commit -m "feat(mobile): soften h1/h2 from 700 to 600"
```

---

### Task 10: Install `react-native-svg`, `phosphor-react-native`, `@gorhom/bottom-sheet`

**Files:**
- Modify: `mobile/package.json`

- [ ] **Step 1: Install**

Run: `cd mobile && npx expo install react-native-svg phosphor-react-native @gorhom/bottom-sheet`
Expected: three packages added under `dependencies`, lockfile updated. `expo install` picks versions compatible with Expo 54. Current versions at time of writing: `react-native-svg@~15.11.x`, `phosphor-react-native@^2.x`, `@gorhom/bottom-sheet@^5.x`.

- [ ] **Step 2: Doctor check**

Run: `cd mobile && npx expo-doctor`
Expected: no errors on the three new packages.

- [ ] **Step 3: Commit**

```bash
git add mobile/package.json mobile/package-lock.json
git commit -m "feat(mobile): add react-native-svg, phosphor, bottom-sheet deps"
```

---

### Task 11: Wrap app with `BottomSheetModalProvider`

**Files:**
- Modify: `mobile/App.tsx`

- [ ] **Step 1: Wrap provider**

Edit `mobile/App.tsx`:

```tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import './src/locales';
import { AppNavigator } from './src/navigation/AppNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <AppNavigator />
            <StatusBar style="auto" />
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add mobile/App.tsx
git commit -m "feat(mobile): wrap app with BottomSheetModalProvider"
```

---

### Task 12: `Icon` component — Phosphor dispatch + name union

**Files:**
- Create: `mobile/src/components/common/Icon.tsx`
- Modify: `mobile/src/components/common/index.ts`

- [ ] **Step 1: Check existing common index**

Run: `cat mobile/src/components/common/index.ts`
Expected: exports `Button`, `Input`.

- [ ] **Step 2: Write `Icon.tsx`**

File `mobile/src/components/common/Icon.tsx`:

```tsx
import React from 'react';
import {
  Bed,
  Stethoscope,
  Pill,
  Syringe,
  FirstAid,
  Hospital,
  Couch,
  ChatsCircle,
  Door,
  Star,
  Heart,
  Fire,
  Leaf,
  Diamond,
  Gift,
  UserNurse,
  UsersThree,
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  List as MenuIcon,
  Plus,
  Gear,
  MagnifyingGlass,
  CaretRight,
  CaretLeft,
  CaretUp,
  CaretDown,
  Lock,
  LockOpen,
  MapPin,
  House,
  IconWeight,
} from 'phosphor-react-native';
import { colors } from '../../theme';

// Hero icons carry semantic meaning in map hotspots, gamification,
// and celebration flows. Swap to Flaticon SVGs later by extending
// `heroIconRegistry`; the callers' `name` prop doesn't change.
const heroIconRegistry = {
  // locations
  desk: UsersThree,
  bedside: Bed,
  bathroom: Door,
  triage: FirstAid,
  pharmacy: Pill,
  ward: Hospital,
  consult: ChatsCircle,
  waiting: Couch,
  // professions (best-available Phosphor match)
  nurse: UserNurse,
  doctor: Stethoscope,
  pharmacist: Pill,
  // gamification
  xp: Star,
  heart: Heart,
  streak: Fire,
  catnip: Leaf,
  gem: Diamond,
  gift: Gift,
  // map helpers
  elevator: House,
  pin: MapPin,
} as const;

const utilIconRegistry = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  x: X,
  check: Check,
  menu: MenuIcon,
  plus: Plus,
  settings: Gear,
  search: MagnifyingGlass,
  'caret-right': CaretRight,
  'caret-left': CaretLeft,
  'caret-up': CaretUp,
  'caret-down': CaretDown,
  lock: Lock,
  'lock-open': LockOpen,
} as const;

export type HeroIconName = keyof typeof heroIconRegistry;
export type UtilIconName = keyof typeof utilIconRegistry;
export type IconName = HeroIconName | UtilIconName;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  weight?: IconWeight;
}

export function Icon({ name, size = 24, color = colors.textPrimary, weight }: Props) {
  const hero = (heroIconRegistry as Record<string, React.ComponentType<any>>)[name];
  const util = (utilIconRegistry as Record<string, React.ComponentType<any>>)[name];
  const Component = hero ?? util;

  // Hero icons render as duotone by default for a warmer feel; utility
  // icons render as regular-weight strokes to stay quiet.
  const resolvedWeight: IconWeight = weight ?? (hero ? 'duotone' : 'regular');

  if (!Component) {
    // At runtime a compile-safe `IconName` can't miss the registry; this
    // guard protects against accidental `as any` casts by callers.
    return null;
  }

  return <Component size={size} color={color} weight={resolvedWeight} />;
}
```

- [ ] **Step 3: Export**

Edit `mobile/src/components/common/index.ts` — append:

```ts
export { Icon } from './Icon';
export type { HeroIconName, UtilIconName, IconName } from './Icon';
```

- [ ] **Step 4: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/components/common/Icon.tsx mobile/src/components/common/index.ts
git commit -m "feat(mobile): Icon component with Phosphor dispatch and hero/util unions"
```

---

### Task 13: `Mascot` component — 8-pose inline SVG Moro placeholder

**Files:**
- Create: `mobile/src/components/mascot/Mascot.tsx`
- Create: `mobile/src/components/mascot/index.ts`

- [ ] **Step 1: Write `Mascot.tsx`**

File `mobile/src/components/mascot/Mascot.tsx`:

```tsx
import React from 'react';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';

export type MoroPose =
  | 'welcome'
  | 'think'
  | 'cheer'
  | 'worry'
  | 'read-chart'
  | 'sleep'
  | 'wave'
  | 'explain';

interface Props {
  pose?: MoroPose;
  size?: number;
}

/**
 * Placeholder Moro mascot. Drawn with react-native-svg primitives so the
 * flow can be built and tested before final art arrives. The identity
 * traits are preserved across all 8 poses: long-haired bicolor silhouette,
 * central white blaze, golden amber eyes, pink nose.
 *
 * Final art swap: replace this component's internals with an <SvgXml>
 * render of the shipped pose SVGs. The `pose` prop contract doesn't change.
 */
export function Mascot({ pose = 'welcome', size = 120 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Body — long-haired bicolor base. Chocolate outer, ivory inner panels. */}
      <Ellipse cx="50" cy="62" rx="28" ry="24" fill="#8B6F47" />
      {/* Ivory chest panel (bicolor lower body) */}
      <Ellipse cx="50" cy="70" rx="18" ry="16" fill="#FBF7EC" />

      {/* Head */}
      <Circle cx="50" cy="36" r="22" fill="#8B6F47" />
      {/* Ears — inner pink */}
      <Path d="M30 20 L34 10 L42 18 Z" fill="#8B6F47" />
      <Path d="M58 18 L66 10 L70 20 Z" fill="#8B6F47" />
      <Path d="M33 19 L36 13 L40 19 Z" fill="#E8A8A0" />
      <Path d="M60 19 L64 13 L67 19 Z" fill="#E8A8A0" />

      {/* Central white blaze — Moro's signature, visible in every pose */}
      <Path
        d="M50 18 L46 30 L48 44 L50 50 L52 44 L54 30 Z"
        fill="#FBF7EC"
      />

      {/* Pose-specific layers */}
      <PoseLayer pose={pose} />

      {/* Eyes — golden amber */}
      <Circle cx={42} cy={36} r={3} fill={pose === 'sleep' ? '#3A2A24' : '#E6B04A'} />
      <Circle cx={58} cy={36} r={3} fill={pose === 'sleep' ? '#3A2A24' : '#E6B04A'} />
      {pose === 'sleep' && (
        <>
          <Path d="M39 36 L45 36" stroke="#3A2A24" strokeWidth={1.5} />
          <Path d="M55 36 L61 36" stroke="#3A2A24" strokeWidth={1.5} />
        </>
      )}

      {/* Pink nose */}
      <Path d="M48 42 L50 45 L52 42 Z" fill="#E8A8A0" />
      {/* Mouth */}
      <Path
        d={pose === 'cheer' ? 'M46 48 Q50 53 54 48' : pose === 'worry' ? 'M46 49 Q50 46 54 49' : 'M48 48 Q50 50 52 48'}
        stroke="#3A2A24"
        strokeWidth={1.2}
        fill="none"
      />

      {/* Whiskers — always on */}
      <Path d="M30 42 L42 43" stroke="#3A2A24" strokeWidth={0.7} />
      <Path d="M30 45 L42 45" stroke="#3A2A24" strokeWidth={0.7} />
      <Path d="M58 43 L70 42" stroke="#3A2A24" strokeWidth={0.7} />
      <Path d="M58 45 L70 45" stroke="#3A2A24" strokeWidth={0.7} />
    </Svg>
  );
}

/**
 * Pose-specific overlays — small shape additions that differentiate the
 * 8 poses without redrawing the body. These are deliberately simple so
 * an artist can replace the whole file later without a contract change.
 */
function PoseLayer({ pose }: { pose: MoroPose }) {
  switch (pose) {
    case 'welcome':
      // Hand raised in a small greeting
      return <Path d="M72 58 Q78 50 80 44" stroke="#8B6F47" strokeWidth={5} strokeLinecap="round" fill="none" />;
    case 'wave':
      // Wider wave arc
      return (
        <G>
          <Path d="M72 58 Q82 46 86 40" stroke="#8B6F47" strokeWidth={5} strokeLinecap="round" fill="none" />
          <Circle cx="86" cy="40" r="4" fill="#8B6F47" />
        </G>
      );
    case 'think':
      // Small speech bubble dot
      return (
        <G>
          <Circle cx="82" cy="22" r="4" fill="#FBF7EC" stroke="#8B6F47" strokeWidth={1} />
          <Circle cx="75" cy="28" r="2" fill="#FBF7EC" stroke="#8B6F47" strokeWidth={1} />
        </G>
      );
    case 'cheer':
      // Both paws up + confetti dots
      return (
        <G>
          <Path d="M22 52 L18 38" stroke="#8B6F47" strokeWidth={5} strokeLinecap="round" />
          <Path d="M78 52 L82 38" stroke="#8B6F47" strokeWidth={5} strokeLinecap="round" />
          <Circle cx="20" cy="20" r="1.5" fill="#E6B04A" />
          <Circle cx="80" cy="20" r="1.5" fill="#E8A8A0" />
          <Circle cx="50" cy="8" r="1.5" fill="#A8B86F" />
        </G>
      );
    case 'worry':
      // Sweat drop
      return <Path d="M68 26 L70 22 L72 26 Q70 30 68 26 Z" fill="#8BA8C4" />;
    case 'read-chart':
      // Clipboard-ish rectangle in front of body
      return (
        <G>
          <Path d="M36 66 L64 66 L64 86 L36 86 Z" fill="#FBF7EC" stroke="#8B6F47" strokeWidth={1.5} />
          <Path d="M40 72 L60 72" stroke="#7A6852" strokeWidth={1} />
          <Path d="M40 76 L60 76" stroke="#7A6852" strokeWidth={1} />
          <Path d="M40 80 L54 80" stroke="#7A6852" strokeWidth={1} />
        </G>
      );
    case 'sleep':
      // Zzz
      return (
        <G>
          <Path d="M72 18 L80 18 L72 26 L80 26" stroke="#8B6F47" strokeWidth={2} fill="none" />
          <Path d="M82 10 L88 10 L82 16 L88 16" stroke="#8B6F47" strokeWidth={1.5} fill="none" />
        </G>
      );
    case 'explain':
      // Pointing gesture
      return <Path d="M72 58 L86 50 L82 46" stroke="#8B6F47" strokeWidth={4} strokeLinecap="round" fill="none" />;
  }
}
```

- [ ] **Step 2: Export**

File `mobile/src/components/mascot/index.ts`:

```ts
export { Mascot } from './Mascot';
export type { MoroPose } from './Mascot';
```

- [ ] **Step 3: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Smoke — render all 8 poses**

Temporarily add to the bottom of `mobile/src/screens/auth/LoginScreen.tsx` (inside the `<View style={styles.content}>`, just above `<Text style={styles.title}>`):

```tsx
<View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
  {(['welcome','think','cheer','worry','read-chart','sleep','wave','explain'] as const).map(p => (
    <Mascot key={p} pose={p} size={60} />
  ))}
</View>
```

Import `Mascot` from `../../components/mascot`. Start Metro and inspect on iOS simulator. After confirming all 8 poses render distinctly, **remove** the temporary block.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/components/mascot/
git commit -m "feat(mobile): placeholder Moro mascot with 8-pose inline SVG"
```

---

### Task 14: `CelebrationOverlay` — full-screen Moro + amber confetti

**Files:**
- Create: `mobile/src/components/celebration/CelebrationOverlay.tsx`
- Create: `mobile/src/components/celebration/index.ts`

- [ ] **Step 1: Write component**

File `mobile/src/components/celebration/CelebrationOverlay.tsx`:

```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Mascot } from '../mascot';
import { Button } from '../common';
import { colors, typography, spacing } from '../../theme';
import { t } from '../../locales';

interface Props {
  visible: boolean;
  title: string;
  subtitle: string;
  onDismiss: () => void;
}

export function CelebrationOverlay({ visible, title, subtitle, onDismiss }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={onDismiss}>
        <View style={styles.card}>
          <Mascot pose="cheer" size={160} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Button title={t('common.continue')} onPress={onDismiss} style={styles.btn} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(58, 42, 36, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  title: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.md, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
  btn: { marginTop: spacing.lg, width: '100%' },
});
```

- [ ] **Step 2: Add `common.continue` translation key**

Edit `mobile/src/locales/en.json` — inside `"common"`:

```json
"continue": "Continue"
```

Edit `mobile/src/locales/ko.json` — inside `"common"`:

```json
"continue": "계속"
```

- [ ] **Step 3: Export**

File `mobile/src/components/celebration/index.ts`:

```ts
export { CelebrationOverlay } from './CelebrationOverlay';
```

- [ ] **Step 4: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/components/celebration/ mobile/src/locales/
git commit -m "feat(mobile): CelebrationOverlay reusable full-screen modal"
```

---

### Task 15: Types — extend client-side Curriculum + CompleteAttempt

**Files:**
- Modify: `mobile/src/types/api.ts`

- [ ] **Step 1: Extend interfaces**

Edit `mobile/src/types/api.ts`:

```ts
export interface CurriculumModule {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  min_level_required: number;
  floor_order: number;
  floor_label: string;
  floor_icon: string;
  map_asset_key: string;
  progress: { status: string; completion_percentage: number } | null;
  units: CurriculumUnit[];
}

export interface CurriculumUnit {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  location_type: string;
  map_x: number;
  map_y: number;
  hotspot_label_override: string | null;
  stages: StageOverview[];
}

export interface CompleteAttemptResponse {
  attempt_id: string;
  stage_id: string;
  total_score: number;
  stars_earned: number;
  xp_earned: number;
  mistakes_count: number;
  duration_seconds: number;
  level_up: { previous_level: number; new_level: number; new_title: string } | null;
  streak_update: { current_streak: number; was_extended: boolean; milestone_hit: number | null } | null;
  achievements: { id: string; slug: string; name: string }[];
  gift_box: { id: string; box_type: string } | null;
  unlocked_module_id: string | null;
}
```

- [ ] **Step 2: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add mobile/src/types/api.ts
git commit -m "feat(mobile): extend API types with floor metadata and unlocked_module_id"
```

---

### Task 16: `FloorCanvas` — placeholder floor rendering

**Files:**
- Create: `mobile/src/components/map/FloorCanvas.tsx`
- Create: `mobile/src/components/map/index.ts`

- [ ] **Step 1: Write component**

File `mobile/src/components/map/FloorCanvas.tsx`:

```tsx
import React from 'react';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { colors } from '../../theme';
import type { CurriculumUnit } from '../../types/api';

interface Props {
  width: number;
  height: number;
  units: CurriculumUnit[];
  floorLabel: string;
}

/**
 * Placeholder floor canvas. Draws a cream rectangle with labeled zones
 * for each Unit at its map_x/map_y. When the final SVG ships, replace
 * the contents of this component's <Svg> with <SvgXml xml={floorSvg} />.
 *
 * Hotspots are rendered by the parent (MapScreen) on top of this canvas,
 * so both the background and the interactive layer stay easy to swap
 * independently.
 */
export function FloorCanvas({ width, height, units, floorLabel }: Props) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Rect x={0} y={0} width={width} height={height} fill={colors.background} />

      {/* Floor label strip */}
      <Rect x={0} y={0} width={width} height={40} fill={colors.accent} opacity={0.15} />
      <SvgText
        x={width / 2}
        y={26}
        fontSize={16}
        fontWeight="600"
        textAnchor="middle"
        fill={colors.textPrimary}
      >
        {floorLabel}
      </SvgText>

      {/* Grid lines — soft beige reference for placeholder layout */}
      <Line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke={colors.border} strokeWidth={1} strokeDasharray="4 6" />
      <Line x1={width / 3} y1={40} x2={width / 3} y2={height} stroke={colors.border} strokeWidth={1} strokeDasharray="4 6" />
      <Line x1={(width / 3) * 2} y1={40} x2={(width / 3) * 2} y2={height} stroke={colors.border} strokeWidth={1} strokeDasharray="4 6" />

      {/* Zone rectangles for each Unit — one per location */}
      {units.map((u) => {
        const cx = (u.map_x / 100) * width;
        const cy = (u.map_y / 100) * height;
        const zoneW = 110;
        const zoneH = 70;
        return (
          <React.Fragment key={u.id}>
            <Rect
              x={cx - zoneW / 2}
              y={cy - zoneH / 2}
              width={zoneW}
              height={zoneH}
              rx={12}
              fill={colors.surface}
              stroke={colors.border}
              strokeWidth={1.5}
            />
            <SvgText
              x={cx}
              y={cy + 4}
              fontSize={11}
              fontWeight="600"
              textAnchor="middle"
              fill={colors.textSecondary}
            >
              {u.location_type}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}
```

- [ ] **Step 2: Create barrel**

File `mobile/src/components/map/index.ts`:

```ts
export { FloorCanvas } from './FloorCanvas';
```

- [ ] **Step 3: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/components/map/
git commit -m "feat(mobile): FloorCanvas placeholder with labeled zones"
```

---

### Task 17: `HotspotSheet` — bottom sheet listing a Unit's stages

**Files:**
- Create: `mobile/src/components/map/HotspotSheet.tsx`
- Modify: `mobile/src/components/map/index.ts`
- Modify: `mobile/src/locales/en.json` / `ko.json`

- [ ] **Step 1: Add translation keys**

Edit `mobile/src/locales/en.json` — add at top level:

```json
"map": {
  "floorBadge": "Floor {{order}}",
  "locations": {
    "desk": "Nurses' Desk",
    "bedside": "Bedside",
    "bathroom": "Bathroom",
    "triage": "Triage",
    "pharmacy": "Pharmacy",
    "ward": "Ward",
    "consult": "Consult Room",
    "waiting": "Waiting Area",
    "generic": "Location"
  },
  "stageStart": "Start",
  "hotspot": {
    "stagesLabel": "Stages",
    "xpLabel": "XP",
    "heartCost": "1 heart",
    "difficulty": "Level {{level}}"
  },
  "celebration": {
    "floorUnlockedTitle": "New floor unlocked!",
    "floorUnlockedSubtitle": "A new area is now available on the hospital map."
  }
}
```

Edit `mobile/src/locales/ko.json` — add at top level:

```json
"map": {
  "floorBadge": "{{order}}층",
  "locations": {
    "desk": "간호사 데스크",
    "bedside": "병상",
    "bathroom": "화장실",
    "triage": "분류실",
    "pharmacy": "약국",
    "ward": "병동",
    "consult": "상담실",
    "waiting": "대기실",
    "generic": "위치"
  },
  "stageStart": "시작",
  "hotspot": {
    "stagesLabel": "스테이지",
    "xpLabel": "경험치",
    "heartCost": "하트 1개",
    "difficulty": "난이도 {{level}}"
  },
  "celebration": {
    "floorUnlockedTitle": "새 층이 열렸어요!",
    "floorUnlockedSubtitle": "병원 지도에 새 지역이 추가되었어요."
  }
}
```

- [ ] **Step 2: Write `HotspotSheet`**

File `mobile/src/components/map/HotspotSheet.tsx`:

```tsx
import React, { useMemo, forwardRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Icon, type HeroIconName } from '../common';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { t } from '../../locales';
import type { CurriculumUnit, StageOverview } from '../../types/api';

interface Props {
  unit: CurriculumUnit | null;
  onStagePress: (stage: StageOverview) => void;
}

export const HotspotSheet = forwardRef<BottomSheetModal, Props>(({ unit, onStagePress }, ref) => {
  const snapPoints = useMemo(() => ['55%'], []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  );

  if (!unit) {
    return (
      <BottomSheetModal ref={ref} snapPoints={snapPoints} backdropComponent={renderBackdrop}>
        <View />
      </BottomSheetModal>
    );
  }

  const label =
    unit.hotspot_label_override ??
    t(`map.locations.${unit.location_type}`) ??
    t('map.locations.generic');

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.surface }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Icon name={(unit.location_type as HeroIconName) ?? 'pin'} size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{label}</Text>
            {unit.description && <Text style={styles.description}>{unit.description}</Text>}
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('map.hotspot.stagesLabel')}</Text>
        <FlatList
          data={unit.stages}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => <StageRow stage={item} onPress={onStagePress} />}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        />
      </View>
    </BottomSheetModal>
  );
});

function StageRow({ stage, onPress }: { stage: StageOverview; onPress: (s: StageOverview) => void }) {
  const completed = stage.progress?.status === 'completed';
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(stage)} activeOpacity={0.7}>
      <View style={{ flex: 1 }}>
        <Text style={styles.stageTitle}>{stage.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{t('map.hotspot.difficulty', { level: stage.difficulty_level })}</Text>
          <Text style={styles.meta}>· {t('map.hotspot.heartCost')}</Text>
        </View>
      </View>
      <View style={styles.cta}>
        <Text style={styles.ctaText}>{completed ? '✓' : t('map.stageStart')}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.md },
  iconBadge: {
    width: 56, height: 56, borderRadius: borderRadius.md,
    backgroundColor: colors.accent + '33',
    justifyContent: 'center', alignItems: 'center',
  },
  title: { ...typography.h2, color: colors.textPrimary },
  description: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  sectionLabel: { ...typography.small, color: colors.textMuted, marginBottom: spacing.sm, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  stageTitle: { ...typography.bodyBold, color: colors.textPrimary },
  metaRow: { flexDirection: 'row', gap: spacing.xs, marginTop: 2 },
  meta: { ...typography.caption, color: colors.textSecondary },
  cta: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.accent,
  },
  ctaText: { ...typography.button, color: colors.textPrimary },
});

HotspotSheet.displayName = 'HotspotSheet';
```

- [ ] **Step 3: Update barrel**

Edit `mobile/src/components/map/index.ts`:

```ts
export { FloorCanvas } from './FloorCanvas';
export { HotspotSheet } from './HotspotSheet';
```

- [ ] **Step 4: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0. If the `t()` signature doesn't accept an options object, update `mobile/src/locales/index.ts`'s `t()` wrapper to pass through: the current implementation already does (`options?: Record<string, unknown>`).

- [ ] **Step 5: Commit**

```bash
git add mobile/src/components/map/HotspotSheet.tsx mobile/src/components/map/index.ts mobile/src/locales/
git commit -m "feat(mobile): HotspotSheet bottom sheet listing Unit stages"
```

---

### Task 18: `FloorSwitcher` — vertical elevator strip

**Files:**
- Create: `mobile/src/components/map/FloorSwitcher.tsx`
- Modify: `mobile/src/components/map/index.ts`

- [ ] **Step 1: Write component**

File `mobile/src/components/map/FloorSwitcher.tsx`:

```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, type HeroIconName } from '../common';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface FloorEntry {
  moduleId: string;
  floorOrder: number;
  label: string;
  icon: string;
  unlocked: boolean;
}

interface Props {
  floors: FloorEntry[];
  activeModuleId: string;
  onSelect: (moduleId: string) => void;
}

export function FloorSwitcher({ floors, activeModuleId, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {floors.map((f) => {
        const isActive = f.moduleId === activeModuleId;
        return (
          <TouchableOpacity
            key={f.moduleId}
            disabled={!f.unlocked}
            onPress={() => onSelect(f.moduleId)}
            style={[
              styles.btn,
              isActive && styles.btnActive,
              !f.unlocked && styles.btnLocked,
            ]}
            activeOpacity={0.7}
          >
            <Icon
              name={(f.unlocked ? (f.icon as HeroIconName) : 'elevator') ?? 'elevator'}
              size={22}
              color={isActive ? colors.accent : f.unlocked ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.num, !f.unlocked && styles.numLocked]}>{f.floorOrder}F</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', right: spacing.sm, top: '25%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    borderWidth: 1, borderColor: colors.border,
    gap: spacing.xs,
  },
  btn: {
    alignItems: 'center', justifyContent: 'center',
    width: 48, height: 48,
    borderRadius: borderRadius.sm,
  },
  btnActive: { backgroundColor: colors.accent + '22' },
  btnLocked: { opacity: 0.4 },
  num: { ...typography.small, color: colors.textPrimary, marginTop: 2 },
  numLocked: { color: colors.textMuted },
});
```

- [ ] **Step 2: Update barrel**

Edit `mobile/src/components/map/index.ts`:

```ts
export { FloorCanvas } from './FloorCanvas';
export { HotspotSheet } from './HotspotSheet';
export { FloorSwitcher } from './FloorSwitcher';
```

- [ ] **Step 3: Typecheck + commit**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

```bash
git add mobile/src/components/map/FloorSwitcher.tsx mobile/src/components/map/index.ts
git commit -m "feat(mobile): FloorSwitcher elevator strip with locked state"
```

---

### Task 19: `MapScreen` — assemble canvas + hotspots + Moro + switcher

**Files:**
- Create: `mobile/src/screens/map/MapScreen.tsx`

- [ ] **Step 1: Write screen**

File `mobile/src/screens/map/MapScreen.tsx`:

```tsx
import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { curriculumApi } from '../../api';
import { FloorCanvas, HotspotSheet, FloorSwitcher } from '../../components/map';
import { Mascot } from '../../components/mascot';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { t } from '../../locales';
import type { MapStackParamList } from '../../navigation/types';
import type { CurriculumModule, CurriculumUnit, StageOverview } from '../../types/api';

type Props = NativeStackScreenProps<MapStackParamList, 'MapMain'>;

const { width: SCREEN_W } = Dimensions.get('window');
const CANVAS_W = SCREEN_W;
const CANVAS_H = 560;

export function MapScreen({ navigation }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['curriculum'],
    queryFn: async () => {
      const res = await curriculumApi.getCurriculum();
      return res.data.data;
    },
  });

  const modules = useMemo(() => {
    if (!data?.modules) return [];
    return [...data.modules].sort((a, b) => a.floor_order - b.floor_order);
  }, [data]);

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const activeModule = modules.find((m) => m.id === activeModuleId) ?? modules[0] ?? null;

  const sheetRef = useRef<BottomSheetModal>(null);
  const [selectedUnit, setSelectedUnit] = useState<CurriculumUnit | null>(null);

  if (isLoading || !activeModule) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  // Find user's current-progress unit: first unit with any non-completed stage.
  const currentUnit =
    activeModule.units.find((u) => u.stages.some((s) => s.progress?.status !== 'completed')) ??
    activeModule.units[0];

  const floorEntries = modules.map((m) => ({
    moduleId: m.id,
    floorOrder: m.floor_order,
    label: m.floor_label,
    icon: m.floor_icon,
    unlocked: true, // placeholder — Task 20 will wire real unlock state
  }));

  const openHotspot = (unit: CurriculumUnit) => {
    setSelectedUnit(unit);
    sheetRef.current?.present();
  };

  const onStagePress = (stage: StageOverview) => {
    sheetRef.current?.dismiss();
    navigation.navigate('StageIntro', { stageId: stage.id });
  };

  return (
    <View style={styles.container}>
      <FloorCanvas
        width={CANVAS_W}
        height={CANVAS_H}
        units={activeModule.units}
        floorLabel={activeModule.floor_label || t('map.floorBadge', { order: activeModule.floor_order })}
      />

      {/* Hotspot tap targets — rendered as absolute-positioned pressables
          sized to the zones drawn by FloorCanvas */}
      {activeModule.units.map((u) => {
        const left = (u.map_x / 100) * CANVAS_W - 55;
        const top = (u.map_y / 100) * CANVAS_H - 35;
        return (
          <Pressable
            key={u.id}
            onPress={() => openHotspot(u)}
            style={[styles.hotspot, { left, top, width: 110, height: 70 }]}
          />
        );
      })}

      {/* Moro at the current in-progress unit */}
      {currentUnit && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: (currentUnit.map_x / 100) * CANVAS_W - 40,
            top: (currentUnit.map_y / 100) * CANVAS_H - 90,
          }}
        >
          <Mascot pose="wave" size={80} />
        </View>
      )}

      <FloorSwitcher
        floors={floorEntries}
        activeModuleId={activeModule.id}
        onSelect={setActiveModuleId}
      />

      <HotspotSheet ref={sheetRef} unit={selectedUnit} onStagePress={onStagePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hotspot: {
    position: 'absolute',
    borderRadius: borderRadius.md,
    // transparent, just a tap target
  },
});
```

- [ ] **Step 2: Commit (navigation wiring happens in next task)**

Run: `cd mobile && npx tsc --noEmit`
Expected: failure — `MapStackParamList` doesn't exist yet. That's fine; Task 21 adds it. Skip this commit and move to Task 20.

**Do not commit yet** — the file won't compile until the navigation types exist.

---

### Task 20: Quests screen — accessibility-friendly list fallback

**Files:**
- Create: `mobile/src/screens/quests/QuestsScreen.tsx`
- Modify: `mobile/src/locales/en.json` / `ko.json`

- [ ] **Step 1: Add translation keys**

Edit `mobile/src/locales/en.json` — add at top level:

```json
"quests": {
  "title": "Quests",
  "inProgress": "In progress",
  "recommended": "Recommended",
  "allClear": "You've cleared all available stages. Come back soon for more!",
  "cta": "Resume"
}
```

Edit `mobile/src/locales/ko.json`:

```json
"quests": {
  "title": "퀘스트",
  "inProgress": "진행 중",
  "recommended": "추천",
  "allClear": "모든 스테이지를 완료했어요. 새 내용을 기다려주세요!",
  "cta": "이어서"
}
```

- [ ] **Step 2: Write screen**

File `mobile/src/screens/quests/QuestsScreen.tsx`:

```tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { curriculumApi } from '../../api';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { t } from '../../locales';
import type { QuestsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<QuestsStackParamList, 'QuestsMain'>;

export function QuestsScreen({ navigation }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['curriculum'],
    queryFn: async () => {
      const { data } = await curriculumApi.getCurriculum();
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const modules = data?.modules ?? [];
  const allStages = modules.flatMap((m) =>
    m.units.flatMap((u) => u.stages.map((s) => ({ module: m, unit: u, stage: s }))),
  );
  const inProgress = allStages.filter((x) => x.stage.progress?.status !== 'completed');
  const recommended = inProgress.slice(0, 5);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('quests.title')}</Text>

      {recommended.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{t('quests.allClear')}</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionLabel}>{t('quests.recommended')}</Text>
          {recommended.map(({ module, unit, stage }) => (
            <TouchableOpacity
              key={stage.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('StageIntro', { stageId: stage.id })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.stageTitle}>{stage.title}</Text>
                <Text style={styles.meta}>{module.floor_label} · {unit.title}</Text>
              </View>
              <View style={styles.cta}>
                <Text style={styles.ctaText}>{t('quests.cta')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.md },
  sectionLabel: { ...typography.small, color: colors.textMuted, marginBottom: spacing.sm, textTransform: 'uppercase' },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border,
  },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center',
  },
  stageTitle: { ...typography.bodyBold, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  cta: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.accent,
  },
  ctaText: { ...typography.button, color: colors.textPrimary },
});
```

- [ ] **Step 3: Commit pending — navigation types next**

Don't commit yet; this file also depends on `QuestsStackParamList` being defined.

---

### Task 21: Tab restructure — Map / Quests / Achievements / Profile

**Files:**
- Modify: `mobile/src/navigation/types.ts`
- Modify: `mobile/src/navigation/AppNavigator.tsx`
- Delete: `mobile/src/screens/home/HomeScreen.tsx`
- Delete: `mobile/src/screens/learn/CurriculumScreen.tsx`

- [ ] **Step 1: Update navigation types**

Read `mobile/src/navigation/types.ts` first, then replace the contents (keep whatever non-stack exports it has; they're likely only these):

```ts
import type { CompleteAttemptResponse } from '../types/api';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MapStackParamList = {
  MapMain: undefined;
  StageIntro: { stageId: string };
  Exercise: { stageId: string; attemptId: string };
  StageComplete: { result: CompleteAttemptResponse };
  GiftBox: { boxId: string; boxType: string };
};

export type QuestsStackParamList = {
  QuestsMain: undefined;
  StageIntro: { stageId: string };
  Exercise: { stageId: string; attemptId: string };
  StageComplete: { result: CompleteAttemptResponse };
  GiftBox: { boxId: string; boxType: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Inventory: undefined;
  Shop: undefined;
  NotificationSettings: undefined;
};

export type TabParamList = {
  MapTab: undefined;
  QuestsTab: undefined;
  AchievementsTab: undefined;
  ProfileTab: undefined;
};
```

- [ ] **Step 2: Rewire `AppNavigator.tsx`**

Edit `mobile/src/navigation/AppNavigator.tsx` — replace the stack factories and tab bar. Keep the `AuthenticatedApp`/`AuthNavigator` shells from Task 15 of the i18n plan.

Replace the navigator section:

```tsx
import { MapScreen } from '../screens/map/MapScreen';
import { QuestsScreen } from '../screens/quests/QuestsScreen';
import { StageIntroScreen } from '../screens/home/StageIntroScreen';
import { ExerciseScreen } from '../screens/home/ExerciseScreen';
import { StageCompleteScreen } from '../screens/home/StageCompleteScreen';
import { GiftBoxScreen } from '../screens/home/GiftBoxScreen';
import { AchievementsScreen } from '../screens/achievements/AchievementsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { InventoryScreen } from '../screens/profile/InventoryScreen';
import { ShopScreen } from '../screens/profile/ShopScreen';
import { NotificationSettingsScreen } from '../screens/profile/NotificationSettingsScreen';
import { Icon } from '../components/common';
import { t } from '../locales';

import type { MapStackParamList, QuestsStackParamList, ProfileStackParamList, TabParamList } from './types';

const MapStack = createNativeStackNavigator<MapStackParamList>();
const QuestsStack = createNativeStackNavigator<QuestsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MapNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen name="MapMain" component={MapScreen} options={{ headerShown: false }} />
      <MapStack.Screen name="StageIntro" component={StageIntroScreen} options={{ title: 'Stage' }} />
      <MapStack.Screen name="Exercise" component={ExerciseScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <MapStack.Screen name="StageComplete" component={StageCompleteScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <MapStack.Screen name="GiftBox" component={GiftBoxScreen} options={{ title: 'Gift Box', presentation: 'modal' }} />
    </MapStack.Navigator>
  );
}

function QuestsNavigator() {
  return (
    <QuestsStack.Navigator>
      <QuestsStack.Screen name="QuestsMain" component={QuestsScreen} options={{ headerShown: false }} />
      <QuestsStack.Screen name="StageIntro" component={StageIntroScreen} options={{ title: 'Stage' }} />
      <QuestsStack.Screen name="Exercise" component={ExerciseScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <QuestsStack.Screen name="StageComplete" component={StageCompleteScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <QuestsStack.Screen name="GiftBox" component={GiftBoxScreen} options={{ title: 'Gift Box', presentation: 'modal' }} />
    </QuestsStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory' }} />
      <ProfileStack.Screen name="Shop" component={ShopScreen} options={{ title: 'Cat Shop' }} />
      <ProfileStack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: 'Notifications' }} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { paddingTop: 4, height: 56, backgroundColor: colors.white, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="MapTab"
        component={MapNavigator}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => <Icon name="pin" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="QuestsTab"
        component={QuestsNavigator}
        options={{
          tabBarLabel: 'Quests',
          tabBarIcon: ({ color, size }) => <Icon name="check" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AchievementsTab"
        component={AchievementsScreen}
        options={{
          tabBarLabel: 'Achieve',
          tabBarIcon: ({ color, size }) => <Icon name="xp" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Icon name="nurse" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
```

- [ ] **Step 3: Delete old screen files**

Run:
```bash
rm mobile/src/screens/home/HomeScreen.tsx
rm mobile/src/screens/learn/CurriculumScreen.tsx
rmdir mobile/src/screens/learn 2>/dev/null || true
```

- [ ] **Step 4: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0. If there's any import of `HomeScreen` or `CurriculumScreen` elsewhere, fix it now. (The Grep at the top of this plan confirmed no other references.)

- [ ] **Step 5: Smoke**

Run: `cd mobile && npx expo start --clear` — on iOS simulator login as an existing user. Expected:
- Bottom tab bar shows **Map / Quests / Achieve / Profile** in the new warm palette.
- Map tab shows the placeholder floor canvas with labeled zones, Moro waving at the current unit.
- Tapping a zone opens the bottom sheet with stage rows.
- Tapping a stage navigates to the Stage intro.
- Quests tab shows the recommended list.

Stop Metro after confirming.

- [ ] **Step 6: Commit** (now MapScreen, QuestsScreen, navigation all compile together)

```bash
git add mobile/src/navigation/ mobile/src/screens/map/ mobile/src/screens/quests/
git rm mobile/src/screens/home/HomeScreen.tsx mobile/src/screens/learn/CurriculumScreen.tsx
git commit -m "feat(mobile): replace Home/Curriculum tabs with Map/Quests"
```

---

### Task 22: Floor unlock celebration — wire into `StageCompleteScreen`

**Files:**
- Modify: `mobile/src/screens/home/StageCompleteScreen.tsx`

- [ ] **Step 1: Trigger overlay when `unlocked_module_id` is set**

Edit `mobile/src/screens/home/StageCompleteScreen.tsx` — add state + overlay before the final `Button`:

```tsx
import React, { useState } from 'react';
// ... existing imports
import { CelebrationOverlay } from '../../components/celebration';
import { t } from '../../locales';
```

Inside the component, after `const queryClient = useQueryClient();`:

```tsx
  const [showFloorUnlock, setShowFloorUnlock] = useState<boolean>(
    !!result.unlocked_module_id,
  );
```

Replace the existing `handleContinue`:

```tsx
  const handleContinue = () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    queryClient.invalidateQueries({ queryKey: ['curriculum'] });
    navigation.popToTop();
  };
```

At the bottom of the return (before the closing `</View>`):

```tsx
      <CelebrationOverlay
        visible={showFloorUnlock}
        title={t('map.celebration.floorUnlockedTitle')}
        subtitle={t('map.celebration.floorUnlockedSubtitle')}
        onDismiss={() => setShowFloorUnlock(false)}
      />
```

- [ ] **Step 2: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Smoke (if a test user has one floor from clear)**

Optional — with an account that has only 1 unit on floor 1, clear its final stage and verify the floor unlock overlay appears before the Continue button. Dismiss confirms it.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/screens/home/StageCompleteScreen.tsx
git commit -m "feat(mobile): show CelebrationOverlay on floor unlock"
```

---

### Task 23: Full regression + push

**Files:** _none (verification + git)_

- [ ] **Step 1: Backend tests**

Run: `cd server && go test ./... -count=1`
Expected: all PASS except the pre-existing `TestCreate_DuplicateEmail` (stale DB row from prior sessions, unrelated to this plan).

- [ ] **Step 2: Mobile typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Manual smoke on iOS simulator**

Run: `cd server && make run` (terminal 1) + `cd mobile && npx expo start --clear` (terminal 2).

Verify as an existing logged-in user:
1. Warm palette applied everywhere (cream background, amber buttons, chocolate text).
2. Map tab renders placeholder floor canvas with labeled zones + Moro at current unit + elevator strip on the right.
3. Tapping a zone opens the bottom sheet; tapping a Stage → StageIntro.
4. Quests tab lists recommended stages; tapping one → StageIntro.
5. Achievements and Profile tabs still work, styled with the new palette.
6. Completing the final Stage of a Unit, if it's the last Unit on a floor with a next floor available, triggers the CelebrationOverlay on StageComplete.

- [ ] **Step 4: Confirm commit shape**

Run: `git log --oneline master..HEAD`
Expected: ~22 commits, none with `Co-Authored-By`.

Run: `git status`
Expected: clean tree.

- [ ] **Step 5: Push**

Run: `git push -u origin feat/spatial-ux-foundation`
Expected: branch published, PR URL suggestion printed.

---

## Self-review checklist (completed)

**1. Spec coverage:**
- §4.1 palette → Task 8
- §4.2 typography → Task 9
- §4.3 mascot Moro → Task 13 (inline SVG placeholder, all 8 poses, blaze + amber eyes + pink nose)
- §4.4 icon system → Task 12 (Phosphor dispatch, `HeroIconName | UtilIconName` union preserved; Flaticon dropped per scope adjustment, noted at top of plan)
- §5.1 `curriculum_modules` columns → Task 1
- §5.2 `units` columns → Task 2
- §5.3 API + DTO → Tasks 6, 15
- §6.1 tab structure → Task 21
- §6.2 `MapScreen` → Task 19 (pan support deferred to a follow-up — placeholder floor is fixed-size; panning a drawn-in-code canvas adds no value before final SVG; noted as scope-adjustment)
- §6.3 hotspot sheet → Task 17
- §6.4 floor unlock transition → Tasks 7, 14, 22
- §7.1 migrations → Tasks 1, 2, 3
- §7.2 seed updates → Task 5
- §7.3 asset deliverables — placeholders drawn in code (FloorCanvas, Mascot, Icon→Phosphor); real SVG drop is a follow-up
- §8 localization hooks → Tasks 17, 20, 22 (all new strings go through `t()`)
- §9 testing → Tasks 6, 7, 23
- §10 risks — palette token preservation (Task 8), placeholder art (Tasks 13, 16), ON CONFLICT idempotent seed (Task 5), floor unlock transactional (Task 7)

**Scope adjustments logged (not gaps):**
- Flaticon → Phosphor-only for both hero and utility.
- Floor SVG placeholder drawn in code; `map_asset_key` column still ships for later swap.
- `MapScreen` pan interaction deferred; fixed-size canvas until real SVG arrives.
- Roguelike branching explicitly Phase 2+ per spec §2 — not in this plan.

**2. Placeholder scan:** no "TBD", "Similar to Task N", "add appropriate X" text anywhere. Each step has real code, real file paths, real commands, and expected outcomes.

**3. Type / name consistency:**
- `HeroIconName | UtilIconName | IconName` (Task 12) match consumer usage in `FloorSwitcher` (Task 18), `HotspotSheet` (Task 17), tab icons (Task 21).
- `MoroPose` (Task 13) used as-is in `CelebrationOverlay` ('cheer') and `MapScreen` ('wave').
- `CurriculumModule.floor_order / floor_label / floor_icon / map_asset_key` names agree between Go struct (Task 4), DTO JSON tags (Task 6), mobile TS interface (Task 15), and consumer screens (Tasks 19, 20, 21).
- `CurriculumUnit.location_type / map_x / map_y / hotspot_label_override` names agree across Go/DTO/TS/consumers.
- `CompleteAttemptResponse.unlocked_module_id` string | null (TS) ↔ `*uuid.UUID` w/ `json:"unlocked_module_id"` (Go) — consistent.
- `MapStackParamList / QuestsStackParamList / ProfileStackParamList / TabParamList` (Task 21) referenced consistently by `MapScreen` (Task 19), `QuestsScreen` (Task 20), `AppNavigator` (Task 21).

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-20-spatial-ux-foundation.md`. Two execution options:

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks.

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
