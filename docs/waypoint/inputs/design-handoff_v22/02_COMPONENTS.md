# 02 · Components (reusable UI primitives)

Source: `reference/forin-ui.jsx`. Every primitive is documented with its props
and a React Native porting note. All use the pixel aesthetic (chunky ink
borders, hard offset shadows, square corners, pixel fonts).

> **Pixel shadow reminder**: web uses `box-shadow: Xpx Ypx 0 0 color` (no blur).
> In RN render a solid offset View behind the element — see `01_DESIGN_TOKENS.md`.

---

## PixelBox
Card / panel container.

Props: `bg=cream`, `border=ink`, `shadow=ink`, `p=12` (padding), `style`, `onClick`.
Look: `3px solid border`, `4px 4px 0 0 shadow`, square corners.

## PixelButton  ⭐ (has interactive states)
Primary button. **Two variants** via `variant`:
- `hud` (default): single solid offset shadow (`4px 4px 0 0 shadow`).
- `block`: four stacked 1px shadows fuse into a thick 4px "side wall" (3-D
  extruded block look).

Props: `bg=mint`, `color=ink`, `shadow=mintShadow`, `size='sm'|'md'|'lg'`,
`full` (bool, full width), `variant`, `onClick`, `disabled`.

Padding by size: sm `7×14`, md `11×20`, lg `14×26`. Font sizes 11/13/16.

**Bevel + press behavior (important):**
- A **top highlight strip** (3px, `bg` mixed 45% white) sits just inside the
  top border, and a **bottom shadow strip** (3px, `bg` mixed 30% ink) inside
  the bottom — together they make the cap look raised, lit from above.
- On **hover** (web): shadow grows (`6px 6px`).
- On **press/active**: the outer drop-shadow disappears (`box-shadow: none`) AND
  the two bevel strips **swap** (top becomes dark, bottom becomes light) — so a
  raised cap visually becomes a pressed-in recess. Light source stays "above."
- RN: implement with `Pressable` — track `pressed` state, swap the two strip
  colors and hide the offset shadow layer. ~70–80ms.

## PixelChip
Inline tag/pill. Props: `bg=yellow`, `color=ink`, `style`.
Look: `2px solid ink`, `padding 2×8`, font 10, no shadow (or tiny).

## StatBar
HP/EXP-style progress bar. Props: `label`, `value`, `max=100`, `color=mint`, `w=120`.
Look: white track, `2px ink` border, colored fill (`transition width .3s`), a
faint vertical-stripe overlay, and a `value/max` numeric label on the right.

## PixelHeart / PixelStar
SVG icons. Heart props: `size=12`, `filled=true`, `color='#EF4444'`. Star props:
`size=14`, `color=yellowDeep`. Both crisp pixel paths — port to `react-native-svg`.

## Flags (FlagUS / FlagKR / FlagJP / FlagDE) + PixelFlag
Small SVG pixel flags for the language/destination picker. `size` prop.
`PixelFlag` takes a `stripes` array for custom flags. Port to RN SVG.

## StatBar
HP/EXP-style progress bar. Props: `label`, `value`, `max=100`, `color=mint`, `w=120`,
`labelW`, `showPct`. Two readouts: `value/max` (default) or `NN%` when `showPct`
(with a fixed-width `labelW` label column — this replaced the old `RepRow`).
Look: cream track, `2px ink` border, colored fill (`transition width .3s`).

## StatTile / MiniStat / BadgeTile (data display)
- **StatTile** — large metric block: `label` (small), big `value`, `sub`, and a
  top-right `color` accent square. Used in Daily Growth Report.
- **MiniStat** — compact metric: big `value`, small `label`, a left `color`
  accent bar. Used in Review Lab stats.
- **BadgeTile** — collectible square (career badge / sticker slot). Props:
  `emoji`, `label`, `got` (earned, else faded+grayscale), `special` (yellow
  highlight), `tag` (corner ribbon e.g. "NEW").

## Highlight (marker pen)
Marker-pen text emphasis. Props: `color` (default yellow; mint etc.), `raised`
(adds a hard ink shadow). Wrap any inline text: `<Highlight>5명</Highlight>`.

## Badge
Small square status pill. Props: `bg`, `color`, `border`. Used for `! 3`,
`HERE`, `🔒 LOCKED`, `복습`, tag chips, `NEW`, etc. (8px DungGeunMo).

## Pips
n-of-m filled squares (difficulty / mastery meter). Props: `filled`, `total=3`,
`color`, `label`, `size=9`. Difficulty stars and Review-Lab mastery both use it.

## FilterTab
Pill tab with optional count badge. Props: `label`, `count`, `active`, `color`,
`onClick`. Active = `color` bg + ink text + shadow. Used by the Review Lab
category filter. (NOTE: the Event Board's `DeptTab` is a **specialized variant**
— icon + inverted white-on-dept-color active state for dark department colors —
kept separate; the Event Board summary `Counter` is also its own compact form.)

## PixelDropdown
Pixel select. Props: `label`, `value`, `items = []`, `open`, `width = 200`,
`placeholder = '선택하세요'`. The affordance is deliberate — a divider-separated
**arrow button** on the right holding a stepped pixel triangle ▼, so it reads
unmistakably as "tap to expand". When `open`: the arrow flips (`scaleY(-1)`) and
its cell turns yellow, the trigger loses its shadow and shifts 1px (pressed
state), and the item panel is butted **flush** to the trigger
(`top:100%`, no gap, `border-top: none`). Selected row = mint bg + ✓; unselected
rows keep a transparent ✓ so labels stay aligned. Empty `value` shows the
placeholder in `textFaint`.

Note for layout: the open panel is `position: absolute` and contributes no flow
height, so reserve space in the parent (the DS catalog section reserves ~330px)
or an `overflow: hidden` card will clip it.

## PathStepper
Horizontal step tracker. Props: `steps = [{ label, done, here }]`. Done steps =
mint ✓, current = `here` (yellow shadow + "● HERE"), future = numbered. Used by
the Profile career path; reuse for any multi-stage flow.

## ForinTopBar
In-screen top app bar. Props: `title`, `left`, `right`, `bg=cream`.
Look: sticky, `borderBottom: 3px ink`, **52px top padding** (status-bar space —
in RN use `SafeAreaView` / `useSafeAreaInsets` instead of the hardcoded 52),
title centered (DungGeunMo 15), `left`/`right` slots ~32px wide.

## ForinBottomNav
Persistent 4-tab nav. Tabs: `캠퍼스 🏥 / 상황판 📋 / 리뷰랩 📓 / 나 👤`.
Prop: `active='campus'|'board'|'lab'|'me'`. Active tab gets a mint background.
Look: `borderTop: 3px ink`, `paddingBottom: 28` (home-indicator space → use
safe-area inset in RN), icon 18px over a 11px label.
**In RN: replace with the bottom tab navigator** (expo-router tabs / react-
navigation) styled to match, rather than a static component.

## PixelDPad
On-screen directional pad used in interiors (up/down/left/right). Props:
`onMove(dir)`, `size=72`, `bg=peach`, `color=ink`. Each arrow is a pixel button
with the same press bevel behavior. Center is empty.

## Icon buttons (HUD)
The interior HUD has square action buttons: a yellow **빠른이동** (fast-travel,
🗺) button and a mint **A** action button — both 52×52, `3px ink`, `4px` shadow,
with the same press-into-shadow behavior as PixelButton.

## MissionBanner (in InteriorScreen)
Quest banner at top of interiors. Two states via `missionUrgent`:
- normal: `yellow` bg, `yellowShadow` shadow, "INSIDE · DEPT"
- urgent: `#FEE2E2` bg, `#EF4444` shadow + red `!` chip, "URGENT · DEPT"
Contains a `!` square chip + dept label + mission text (Galmuri11 12).

## Social login buttons (`OneTapButton`)
Row buttons on the Login screen. Props: `bg`, `color`, `shadow`, `icon` (SVG
glyph), `label`. Provider glyphs included in `screens-onboarding.jsx`:
`GoogleGlyph`, `AppleGlyph`, `KakaoGlyph`, `NaverGlyph`, `MailGlyph` — all SVG,
port to RN SVG. Brand colors: Google `#fff`/ink, Apple `#000`/white,
Kakao `#FEE500`/`#3C1E1E`.

---

## Provider-color reference (login)
| Provider | bg | text | shadow |
|---|---|---|---|
| Google | `#fff` | ink | `ink @ 55%` |
| Apple  | `#000` | `#fff` | `#000` |
| Kakao  | `#FEE500` | `#3C1E1E` | `#CCB800` |
