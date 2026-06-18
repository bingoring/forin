# Handoff: forin — 해외 이직 언어 시뮬레이션 (React Native / Expo)

## Overview

**forin** is a mobile game-style language-learning app for healthcare workers
(nurses first) preparing to emigrate and work abroad. The user explores a
pixel-art hospital "campus," enters department interiors (ER, OR, ICU,
Pediatrics, Pharmacy), and plays through **visual-novel dialogue scenarios**
and **mid-dialogue mini-quizzes** that practice real clinical English (pain
assessment, SBAR handoff, triage, dosage calc, etc.). Progress feeds a
growth/career system (XP, reputation, certifications, sticker board).

The aesthetic is **cozy retro game**: chunky black outlines, hard pixel
drop-shadows (no blur), a warm mint/peach/yellow palette, Korean pixel fonts,
and friendly "derp" (소박하고 하찮은) characters.

## About the Design Files

The files in `reference/` are **design references created in HTML/React (Babel
-in-browser)** — runnable prototypes that show the intended look, layout, copy,
and behavior. **They are NOT production code to copy directly.**

The HTML prototype uses browser-global patterns (every component is attached to
`window.*`, there is no module system, styling is inline-CSS objects, and the
whole thing is wrapped in a "design canvas" review harness). **None of that
scaffolding should carry over.**

Your task: **recreate these designs in a React Native + Expo app** using its
idiomatic patterns — `StyleSheet`/styled components, `react-navigation` or
`expo-router`, real component modules, and proper state. Treat the HTML as the
source of truth for *visual design and interaction intent*, and this README +
the sibling docs as the spec.

## Target stack

- **React Native + Expo** (managed workflow)
- Recommended: `expo-router` for navigation, `react-native-svg` for all
  character/object/icon art (the prototype draws everything as SVG `<rect>`/
  `<path>` — these port almost 1:1 to `react-native-svg`), `expo-font` for the
  pixel fonts, `react-native-reanimated` for animations, Zustand (or Context)
  for game state.

## Fidelity

**High-fidelity.** Colors, typography, spacing, component styling, and
interactions are all final. Recreate pixel-perfectly using react-native-svg +
StyleSheet. Exact token values are in `01_DESIGN_TOKENS.md`.

## How this handoff is organized

| Doc | Contents |
|---|---|
| `README.md` (this file) | Overview, stack, global conventions, app structure |
| `01_DESIGN_TOKENS.md` | Colors, typography, spacing, shadows, the "pixel box" recipe |
| `02_COMPONENTS.md` | Every reusable UI primitive + props + RN porting notes |
| `03_CHARACTERS.md` | The character & face system (roles, hairstyles, expressions) |
| `04_SCREENS.md` | Every screen: purpose, layout, components, copy, state |
| `05_MAP_AND_INTERIORS.md` | The tile-based map/interior engine + object catalog |
| `06_CHARACTER_MOTION.md` | Directional facing, walking, idle motion, ambient/patrol NPCs |
| `reference/` | The runnable HTML prototype + all source JSX |

To **see** the designs: open one of the runnable HTML files in `reference/`:
- **`forin Screens.html`** — the actual app screens (sections ①–⑨).
- **`forin Design System.html`** — the Design System catalog (section ⓪:
  tokens, components, characters, objects). Best place to read the visual
  language.
- `forin App Design.html` — the original combined file (all sections in one;
  heavier to open). The split files above are recommended.

Each renders a pan/zoom "design canvas" with every screen as a phone-sized
artboard (402×874). Artboards lazy-mount as you pan (a prototype-only
optimization — not product behavior).

## Global conventions (apply everywhere)

1. **Chunky outlines** — most surfaces have a solid `3px` (cards/buttons) or
   `2px` (chips/small) border in ink `#2A2522`. Never use thin hairline borders.
2. **Hard pixel shadows** — drop shadows are *solid offset blocks*, never
   blurred. e.g. a card shadow is `4px 4px 0 0 #2A2522`. In RN this is **not**
   `shadowRadius` — render a second offset View behind the element, or use a
   wrapping View with a background offset. (See `02_COMPONENTS.md` → "Pixel
   shadow in RN".)
3. **No anti-aliased gradients on pixel art** — SVG sprites use flat fills and
   `shape-rendering: crispEdges` (in RN SVG, the default rasterization is fine
   at these sizes; keep fills flat).
4. **Two pixel fonts**: `DungGeunMo` (headings, labels, UI) and `Galmuri11`
   (body, Korean). Bundle both via `expo-font`. Fallback: a monospace system
   font. Both are free Korean pixel fonts (sources in `01_DESIGN_TOKENS.md`).
5. **Coordinate system for map art**: interiors use a tile grid where
   `ITILE = 16` logical px, rendered at `ZOOM = 2` → 32 screen px per tile.
   Objects are positioned at `x * ITILE, y * ITILE`.
6. **Everything game-art is SVG.** Characters, hospital objects, icons, flags —
   all are SVG primitive shapes. Port to `react-native-svg`
   (`<Svg><Rect/><Path/><Ellipse/>…`). The JSX in `reference/` is directly
   translatable: `<rect x= y= width= height= fill=/>` → `<Rect .../>`.

## App structure (screens → navigation)

The prototype groups screens into 9 numbered sections. As a product the flow is:

```
Onboarding stack
  Splash  →  Login (social one-tap)  →  Language/Destination  →  Job select  →  Level diagnosis
                                                                                      ↓
Main app (bottom tab navigator: 캠퍼스 / 상황판 / 리뷰랩 / 나)
  ├─ 캠퍼스 (Campus)
  │     Campus outdoor map  →  Department interior (ER/OR/ICU/Peds/Pharma)
  │           ↓ step on a "!" hotspot
  │     Scenario Briefing modal  →  Visual-novel Dialogue  ⇄  Mid-dialogue Quiz  →  Scenario Clear
  ├─ 상황판 (Event Board)   — daily auto-refreshed scenario list
  ├─ 리뷰랩 (Review Lab)    — saved phrases/mistakes (referenced, not fully designed)
  └─ 나 (Profile)          — career, badges, growth report
```

See `04_SCREENS.md` for each screen in detail and `05_MAP_AND_INTERIORS.md`
for the campus/interior engine.

## Suggested directory layout (RN/Expo)

```
app/                         # expo-router routes
  (onboarding)/
    splash.tsx  login.tsx  locale.tsx  job.tsx  level.tsx
  (tabs)/
    campus.tsx  board.tsx  lab.tsx  me.tsx
  interior/[dept].tsx
  scenario/[id]/briefing.tsx  dialogue.tsx  result.tsx
src/
  theme/tokens.ts            # from 01_DESIGN_TOKENS.md
  components/                # PixelBox, PixelButton, PixelChip, StatBar, TopBar, BottomNav…
  characters/                # Sprite, Face, role presets (from 03_CHARACTERS.md)
  map/                       # tile engine, interior objects (from 05_…)
  game/                      # state stores, scenario data
  fonts/                     # DungGeunMo, Galmuri11
```

## Notes & open items

- **Quizzes** (`screens-quiz-*.jsx`) are 6 distinct interaction types
  (sentence build, matching, vitals labeling, triage, anatomy labeling, SBAR
  ordering, listen-and-type, dosage calc). Each is documented in `04_SCREENS.md`.
- **Review Lab (리뷰랩)** tab is designed (`screens-review-lab.jsx`) — the
  오답노트 / spaced-repetition phrase-card review; see `04_SCREENS.md` ⑨.
- **Character motion** (directional facing, walking, idle breathing/blink,
  ambient patrol/wander NPCs with emotes) is specified in
  `06_CHARACTER_MOTION.md` — apply it when building the map/interior sprites.
- **Speech/mic input** is shown in dialogue (free-speak mode) but the actual
  STT integration is out of scope of the design — wire to your chosen provider.
- The prototype's `tweaks-panel.jsx`, `design-canvas.jsx`, `ios-frame.jsx`,
  `ds-*.jsx`, and `screen-objects-v2.jsx`/`screen-room-gallery.jsx` are
  **review-harness/catalog only** — do not port them. They are intentionally
  excluded from `reference/` except `ds-shared.jsx` (kept because it documents
  the full component inventory in one place).
