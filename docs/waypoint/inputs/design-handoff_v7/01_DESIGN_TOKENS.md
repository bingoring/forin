# 01 · Design Tokens

All values are final (high-fidelity). Source of truth in the prototype is
`reference/forin-ui.jsx` (`ForinTokens`) and `reference/interior-shared.jsx`
(`IP`, interior palette).

## Colors — UI palette (`ForinTokens`)

```ts
export const tokens = {
  // Brand greens
  mint:        '#A7F3D0',  // primary accent / buttons
  mintDeep:    '#6EE7B7',  // hover/active
  mintShadow:  '#4FC79D',  // mint button drop-shadow

  // Peach
  peach:       '#FFEDD5',  // secondary surface
  peachDeep:   '#FED7AA',  // gown / accent fill
  peachShadow: '#E8B584',

  // Yellow
  yellow:       '#FEF08A', // quest / highlight
  yellowDeep:   '#FACC15', // active highlight
  yellowShadow: '#CA8A04',

  // Text
  text:      '#374151',    // body
  textSoft:  '#6B7280',    // secondary
  textFaint: '#9CA3AF',    // disabled

  // Surface
  cream: '#FFFBF0',        // card surface
  paper: '#FFF8E7',        // page background
  ink:   '#2A2522',        // borders + primary text (the "outline" color)

  // Semantic
  pink:  '#FBCFE8',        // pediatrics / soft cue
  blue:  '#BAE6FD',        // info
  red:   '#FCA5A5',        // urgent / alert
  lilac: '#DDD6FE',        // OR / specialty
};
```

Common literal colors used directly in art (not tokens, but consistent):
`#EF4444` red cross / urgent, `#1F2937` dark navy, `#10B981` green check,
`#22D3EE` cyan readouts, `#0F1A24` monitor screens, `#FFFFFF` white.

## Colors — Interior palette (`IP`)

Department floor tones (used by the tile floor; each dept alternates two
shades in a 2×2 checkerboard):

```ts
export const interior = {
  floorClinical: '#E8E5D4', floorClinicalAlt: '#DAD6C2',  // ER / Ward
  floorSterile:  '#D6E4EC', floorSterileAlt:  '#BFD4DE',  // OR
  floorPeds:     '#FDE6BB', floorPedsAlt:     '#FAD79A',  // Pediatrics
  floorICU:      '#E1E4EC', floorICUAlt:      '#C8CEDA',  // ICU
  floorPharma:   '#E9DEC0', floorPharmaAlt:   '#D8C9A4',  // Pharmacy

  groutLine:  '#9C8866',
  wall:       '#C8C0A8', wallTop: '#8E8460', wallSide: '#BFB294', wallShadow: '#5C523A',
  ink:        '#2A2522',
  glass:      '#A8C8DC', glassFrame: '#3E2E1C',
  doorWood:   '#7C4F2C', doorAccent: '#C97E3A', doorAuto: '#9CD3E0',
  metal:      '#9CA3AF', metalDk: '#4B5563',
  blueScrub:  '#A5D8E8', greenScrub: '#A7D7B0',
};
```

## Typography

Two bundled pixel fonts + a clean fallback:

| Family | Use | Source |
|---|---|---|
| **DungGeunMo** | headings, labels, buttons, all-caps UI | projectnoonnu (free) |
| **Galmuri11** | body text, Korean sentences, captions | quiple/galmuri (free, has 400 + 700) |
| Pretendard / system mono | fallback | — |

Bundle with `expo-font`. The prototype loads:
- `Galmuri11` 400 + 700 (woff2 from `cdn.jsdelivr.net/gh/quiple/galmuri`)
- `DungGeunMo` 400 (woff from projectnoonnu)
For RN, grab the `.ttf`/`.otf` equivalents and place in `src/fonts/`.

### Type scale (px)

| Role | Size | Family |
|---|---|---|
| Page/hero title | 64 (splash logo), 34 (result) | DungGeunMo |
| Screen heading | 22 | DungGeunMo |
| TopBar title | 15 | DungGeunMo |
| Section / button md | 13 | DungGeunMo |
| Body (Korean) | 12–14 | Galmuri11 |
| Caption | 11 | Galmuri11 |
| Label / HUD | 9–10 | DungGeunMo |
| Micro badge | 6–8 | DungGeunMo |

`letterSpacing` ~0.4 on buttons, up to 2–3 on the big logo. Line-height for
Korean body ≈ 1.5–1.6.

## Spacing

Loose 4-based scale; common values seen: `2, 4, 6, 8, 10, 12, 14, 16, 18, 22,
24, 28`. Screen horizontal padding is typically **22–32px**. Card inner padding
**12–16px**. Gaps between stacked controls **8–10px**.

## Borders & radius

- Borders: `2px` (chips, small), `2.5px` (some cards), `3px` (cards, buttons),
  `4px` (modals/feature cards) — always solid, color = `ink #2A2522`.
- **Radius: 0 everywhere.** This is a pixel aesthetic — corners are square.
  (Only true circles like avatars / sun glow use `borderRadius: '50%'`.)

## Pixel drop-shadow recipe

The signature look. Web uses `box-shadow: Xpx Ypx 0 0 <color>` (zero blur).
Standard offsets:

| Element | Shadow |
|---|---|
| Chip / small | `2px 2px 0 0 ink` |
| Card / button | `3px 3px 0 0 <shadowColor>` or `4px 4px 0 0 ink` |
| Modal / feature | `5px 5px` or `6px 6px 0 0 ink` |

`<shadowColor>` is the token-matched shadow (e.g. mint button → `mintShadow`).

### Implementing in React Native

RN's `shadow*`/`elevation` produce **blurred** shadows — wrong look. Instead
render a solid offset layer. Pattern:

```tsx
// Hard pixel shadow = a second view offset behind the content.
function PixelShadow({ offset = 4, color = tokens.ink, children, style }) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset,
                     right: -offset, bottom: -offset, backgroundColor: color }} />
      {children}
    </View>
  );
}
```
…or simpler: wrap content in a View whose `backgroundColor` is the shadow color
and give the inner content a `translate(-offset,-offset)`. Either way: **flat,
offset, no blur.**

## Animations (durations / easing seen in prototype)

- Idle "bob" (hotspots, balloons): translateY 0→-3px, ~1.2–1.6s ease-in-out, infinite.
- Player step bob: translateY 0→-1px, .6s.
- Blink (alert dots, monitors): opacity toggle, .8s steps(2).
- Button press: 70–80ms ease-out; on press the element drops into its shadow
  (translate by the shadow offset; shadow goes to 0). See `02_COMPONENTS.md`.
- Confetti (scenario clear): per-particle parabolic burst via Web Animations API
  → in RN use `react-native-reanimated` with a withTiming x + parabolic y.
- One-tap login dialog: slide down from top, .5s cubic-bezier(.2,.8,.3,1.1).
- Region transition (entering interior room): 0.7s fade overlay with label.
