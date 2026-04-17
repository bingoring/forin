# Spatial UX Foundation — Design Spec

- **ID**: Sub-project 2 of 3 in the redesign initiative
- **Date**: 2026-04-17
- **Status**: Approved design, pending implementation plan
- **Depends on**: [Sub-project 1 — i18n Foundation](./2026-04-17-i18n-foundation-design.md)
- **Master plan**: see [2026-04-17-redesign-master-plan.md](./2026-04-17-redesign-master-plan.md)

## 1. Purpose

Replace the current list-driven curriculum UI with a **2D illustrated hospital map** that turns each learning session into a visit to a specific place (nurses' desk, bedside, triage, etc.). Unify visual language through a new palette, a cohesive icon system, and a redesigned mascot based on the product owner's cat. This establishes the "experience the place" feel called for in the redesign brief.

The existing curriculum data is preserved; the hospital metaphor is layered on top via additive columns.

## 2. Non-goals

- 3D or isometric rendering. 2D storybook illustration only.
- Roguelike stage branching inside a location (deferred to Phase 2+).
- Support for Doctor/Pharmacist professions in the first map release (nurse + Australia only, matching current MVP scope).
- Animated mascot lip-sync, TTS, or complex skeletal animation.
- Social overlay on the map (other users' markers, leaderboard pins).
- Removing or refactoring the existing cat-item / gift-box / shop / inventory gameplay systems. The mascot becomes the visual base that items attach to; mechanics unchanged.

## 3. Scope decisions (traceability)

| # | Decision | Chosen |
|---|---|---|
| Q1 | Curriculum → map mapping | **A** — `Module=Floor`, `Unit=Location`, `Stage=Scenario` |
| Q2 | Map visual style | **C** — Storybook Scene (single illustration per floor, mascot + locations inline) |
| Q3 | Icon sourcing strategy | **C** — Hybrid: Flaticon Premium for hero icons, Phosphor (MIT) for utility |
| Q4 | Character cast | **B** — Cat mascot + 6 recurring human NPCs spanning Patient / Peer nurse / Doctor (2 each); preserves existing cat gameplay. See Sub-project 3 §6.3 for the full NPC registry. |
| Q4a | Mascot identity | Based on the product owner's real cat: long-haired bicolor, white blaze, golden amber eyes, pink nose. Working name **Moro**. |
| Q5 | Color palette | **B** — Warm Cozy (cream + chocolate + golden amber + dusty pink), derived from the mascot |

## 4. Visual system tokens

### 4.1 Palette

Replace `mobile/src/theme/colors.ts` with:

```ts
export const colors = {
  primary:      '#8B6F47',   // warm chocolate — text, primary CTA border
  accent:       '#E6B04A',   // golden amber — buttons, XP, hotspot
  highlight:    '#E8A8A0',   // dusty pink — hearts, celebration
  bgCanvas:     '#FAF7F0',   // cream — global background
  bgSurface:    '#FBF7EC',   // soft ivory — cards, modals
  ink:          '#3A2A24',   // deep brown — emphasised text
  inkMuted:     '#7A6852',   // dusty brown — secondary text
  divider:      '#E8D8B6',   // warm beige — separators
  accentCoral:  '#D17B6B',   // warm coral — warnings, retry
  // gamification remapped inside this palette
  xp:           '#E6B04A',
  heart:        '#E8A8A0',
  streak:       '#D17B6B',
  catnip:       '#A8B86F',   // muted sage that still reads as plant
  gem:          '#8BA8C4',   // soft slate-blue for cool highlights
};
```

Rarity tiers shift from the old "gray → green → blue → purple → gold" to warm equivalents: `muted ivory → sage → slate-blue → plum → deep amber`. Concrete hex values chosen during implementation.

### 4.2 Typography

- Keep system font stack (`-apple-system, Segoe UI, Roboto`) for now; bundling Pretendard (OFL) for Korean is a follow-up.
- Reduce `h1`/`h2` font-weight by one step (from 700 → 600) to soften tone.
- Preserve the existing `typography` token names so consumer screens compile without rename.

### 4.3 Mascot — "Moro"

- Identity traits: bicolor long-hair, **central white blaze** (signature, always visible), golden amber eyes, pink nose & inner ears.
- Disposition: calm, observant — positions Moro as a mentor presence rather than a sidekick.
- Pose set (MVP): `welcome / think / cheer / worry / read-chart / sleep / wave / explain` — 8 SVG assets at `mobile/assets/mascot/moro-{pose}.svg`.
- **Integration with existing cat-item system**: the inventory "equip" API unchanged; equipped items render as layers on top of Moro's base pose (hats, gowns, glasses, etc.). Current 20 items keep their semantic slots (head / body / accessory).

### 4.4 Icon system

Two sources, one shared component interface.

| Source | Use | Count (MVP) | Path |
|---|---|---|---|
| **Flaticon Premium** (paid subscription during asset pull) | Hero: location hotspots, profession badges, gamification, mascot actions | ~30 | `mobile/assets/icons/hero/*.svg` |
| **Phosphor** (MIT, via `phosphor-react-native`) | Utility: arrows, chevron, close, menu, check, plus, settings, search, … | ~30 | npm dependency |

Component:

```tsx
// mobile/src/components/common/Icon.tsx
type HeroIconName = 'desk' | 'bedside' | 'bathroom' | 'triage' | 'pharmacy' | 'ward' | 'consult' | 'waiting' | 'xp' | 'heart' | 'streak' | 'catnip' | 'gift' | 'nurse' | 'doctor' | 'pharmacist' | /* ... */;
type UtilIconName = 'arrow-left' | 'arrow-right' | 'x' | 'check' | 'menu' | /* ... */;

export function Icon({ name, size=24, color }: { name: HeroIconName | UtilIconName; size?: number; color?: string }): JSX.Element
```

The component dispatches to the correct renderer (SVG file or Phosphor component). Name literals are a compile-time union — unknown names fail to build.

## 5. Data model changes

### 5.1 `curriculum_modules` — add columns

```sql
ALTER TABLE curriculum_modules
  ADD COLUMN floor_order   INT  NOT NULL DEFAULT 1,
  ADD COLUMN floor_label   TEXT NOT NULL DEFAULT '',
  ADD COLUMN floor_icon    TEXT NOT NULL DEFAULT 'triage',
  ADD COLUMN map_asset_key TEXT NOT NULL DEFAULT '';
```

- `floor_order` drives the elevator UI and unlock sequencing.
- `floor_icon` is a hero icon name key (`triage`, `ward`, …).
- `map_asset_key` references an SVG in `mobile/assets/maps/` (e.g., `floor-1-er`).

### 5.2 `units` — add columns

```sql
ALTER TABLE units
  ADD COLUMN location_type          TEXT NOT NULL DEFAULT 'generic',
  ADD COLUMN map_x                  DECIMAL(5,2) NOT NULL DEFAULT 50.0,  -- 0..100 percent of map viewport
  ADD COLUMN map_y                  DECIMAL(5,2) NOT NULL DEFAULT 50.0,
  ADD COLUMN hotspot_label_override TEXT;
```

Hotspot placement lives in SQL, not inside the SVG, so art and placement can iterate independently.

### 5.3 API / DTO

- `GET /v1/curriculum` response extended to include new fields on `module` and `unit` objects.
- No new endpoints.
- The Go models (`internal/model/curriculum.go`) get matching fields with `json` tags following the repo's snake_case convention.

## 6. Navigation & screens

### 6.1 Tab structure change

Old: `Home / Curriculum / Profile` (linear list).

New: `Map / Quests / Profile`.
- **Map** (hero tab, replaces Home+Curriculum) — the hospital view.
- **Quests** — compact list of in-progress/recommended stages for quick resume. This is the accessibility-friendly alternative to the map.
- **Profile** — existing, visually restyled.

### 6.2 `MapScreen`

- Fetches curriculum once (`GET /v1/curriculum`) on mount; cached via React Query (already in deps).
- Renders the floor SVG scaled to viewport; supports horizontal pan (React Native Gesture Handler; already in deps).
- Renders hotspots at `map_x` / `map_y` as golden-amber pulse rings; overlays a check badge on completed Units.
- Renders Moro at the coordinates of the user's current in-progress Unit (falls back to a default welcome spot).
- Floor switcher: a vertical elevator strip on the right edge (hero `elevator` icon for locked floors; hero `{floor_icon}` for unlocked ones).

### 6.3 Hotspot → Stage Entry sheet

- Bottom sheet (React Native Reanimated; already in deps).
- Header: location hero icon + localised label + one-line description (`t()` key).
- Body: 1–3 Stage cards — title, XP reward, heart cost, difficulty chip.
- Primary CTA: "시작" — pushes to existing `StageScreen`; no change to stage flow downstream.
- No branching choices in MVP; roguelike route-picker is a Phase 2+ extension point.

### 6.4 Floor unlock transition

- On `learning_handler.CompleteAttempt`, when the completed Unit was the last unlocked one on its floor, the service flags the next `floor_order` as unlocked (persisted via a new table `user_unlocked_floors(user_id, module_id)` — minimal write, no extra read latency).
- Client receives `unlocked_module_id` in the response; if set, pushes a full-screen Celebration overlay: Moro in `cheer` pose, amber confetti, one-tap dismiss, camera pans to the new floor.

## 7. Migrations, seed, and assets

### 7.1 Migrations (sequence numbers assigned at implementation)

1. `<seq>_add_floor_metadata_to_modules.up.sql` + `.down.sql`
2. `<seq>_add_location_metadata_to_units.up.sql` + `.down.sql`
3. `<seq>_create_user_unlocked_floors.up.sql` + `.down.sql`

### 7.2 Seed updates (`server/scripts/seed.go`)

- Assign `floor_order`, `floor_label`, `floor_icon`, `map_asset_key` to the two MVP modules.
- Assign `location_type`, `map_x`, `map_y` to each Unit. Coordinates are placeholders until art lands; they can be re-tuned via SQL without code changes.
- Idempotent (`ON CONFLICT DO NOTHING` on existing rows; a follow-up `UPDATE` for new columns).

### 7.3 Asset deliverables (external art)

| Asset | Count | Notes |
|---|---|---|
| Floor illustration SVG | 2 | `floor-1-er.svg`, `floor-2-ward.svg` (1600×2400 logical). |
| Moro pose SVG | 8 | Consistent rig; items layer on top at known anchor points. |
| NPC avatar SVG | 6 | Patient ×2, Peer nurse ×2, Doctor ×2. For Sub-project 3 scenario use; avatars in round frames. |
| Hero icon SVG | ~30 | Pulled from Flaticon Premium; colour-normalised to the new palette. |

## 8. Localisation hooks (ties to Sub-project 1)

- All new strings (floor labels, location descriptions, CTA text, celebration copy) go through `t()` with keys like `map.floors.er`, `map.locations.bedside`, `map.celebration.floorUnlocked`.
- `hotspot_label_override` in the DB is a raw display string; for localisation, the client prefers an `i18n` key equal to `map.locations.{location_type}` and falls back to `hotspot_label_override` or the Unit title.

## 9. Testing

- **Unit (mobile)**: `Icon` component renders both hero and util names; unknown name fails type-check. `MapScreen` places hotspots at expected percentages given mocked curriculum.
- **Integration (server)**: migrations apply cleanly; `GET /v1/curriculum` returns the new fields; completion triggers `user_unlocked_floors` insert when appropriate.
- **Smoke (device)**: launch app → MapScreen loads within 2s on a cold start; pan and tap work; enter a Stage via hotspot; floor unlock celebration fires after completing all floor-1 Units.

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| SVG map assets late from art vendor | Ship with a placeholder SVG (flat floor plan with labelled rectangles) until final art arrives; `map_asset_key` swap is one-line. |
| Performance of large SVG on Android (when Android ships) | Render with `react-native-svg` at capped dimensions; prefer flat paths over gradients; test early on mid-tier device. |
| Flaticon licence drift on cancellation | Download all needed icons during an active subscription window; keep a `licences.md` manifest of each asset's source URL + download date. |
| Patients NPC diversity accidentally caricatures | Art direction brief explicitly calls for varied ages / genders / ethnicities with neutral, friendly expressions; peer review before ship. |
| Existing cat-item system regression | Items continue to attach to Moro's anchor points; snapshot tests verify equipped rendering matches pre-redesign semantics. |

## 11. Implementation checklist (preview)

Detailed plan will be produced via the `writing-plans` skill. High-level sequence:

1. Migrations + GORM models for floor / location / unlocked-floor.
2. Palette + typography swap in `theme/`; keep token names stable.
3. `Icon` component + asset drop (hero + Phosphor wiring).
4. Moro pose SVGs + mascot item overlay system.
5. `MapScreen` + pan/tap + hotspot rendering.
6. Hotspot bottom sheet + Stage entry wiring (reuse existing `StageScreen`).
7. Floor unlock celebration flow, server-side trigger in `CompleteAttempt`.
8. Tab structure swap (`Map / Quests / Profile`).
9. Seed updates with placeholder coordinates; refine post-art.
10. Tests (unit + integration + device smoke).
