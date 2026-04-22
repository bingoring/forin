// forin design tokens — ported from DesignDemo/tokens.jsx
//
// The design language is "Duolingo × Animal Crossing" — bright sky / coral
// accents for learning surfaces, warm cream / wood for cosy surfaces
// (room, shop). Every primitive under src/ui/ reads from this file only;
// screens import tokens via the re-exports in src/theme/index.ts.
//
// Adding a value: add it here, then surface it from index.ts if it's a
// cross-cutting token (a color the screens use directly). Component-
// local values should live in the component file.

// ── Colors ────────────────────────────────────────────────────

export const palette = {
  // Learning mode (active, playful)
  sky: '#4FB8FF',         // primary
  skyDeep: '#2A93DC',     // pushable shadow
  skyLight: '#E5F3FD',
  coral: '#FF8A65',       // accent / streak / hearts
  coralDeep: '#E06A48',
  coralLight: '#FFE9DF',
  sun: '#FFCB3A',         // XP / points
  sunDeep: '#E5AE10',
  sunLight: '#FFF6DC',
  mint: '#5DD4A3',        // correct
  mintDeep: '#37B583',
  mintLight: '#DFF5E9',
  rose: '#FF4B6E',        // wrong / lives
  roseDeep: '#DC2E53',
  roseLight: '#FFE0E8',
  lav: '#A78BFA',         // premium / special
  lavDeep: '#7C5FDC',
  lavLight: '#EFE8FF',

  // Room mode (cozy, warm)
  cream: '#FBF6EC',
  sand: '#F0E6D2',
  wood: '#D4A574',
  woodDeep: '#A97A4A',
  woodDark: '#6B4A2D',

  // Neutrals
  ink: '#3C2E1F',         // body text (warm black)
  inkSoft: '#6B5B48',
  inkFaint: '#A89784',
  paper: '#FFFFFF',
  hair: '#EDE4D2',        // borders
  hairDark: '#D9CDB5',
} as const;

// Semantic aliases — use these from screens. Renaming the brand
// underneath (palette.sky → palette.ocean) doesn't cascade to callers.
export const color = {
  primary: palette.sky,
  primaryDeep: palette.skyDeep,
  primaryLight: palette.skyLight,
  accent: palette.coral,
  accentDeep: palette.coralDeep,
  accentLight: palette.coralLight,
  xp: palette.sun,
  xpDeep: palette.sunDeep,
  xpLight: palette.sunLight,
  success: palette.mint,
  successDeep: palette.mintDeep,
  successLight: palette.mintLight,
  danger: palette.rose,
  dangerDeep: palette.roseDeep,
  dangerLight: palette.roseLight,
  premium: palette.lav,
  premiumDeep: palette.lavDeep,
  premiumLight: palette.lavLight,

  // Cozy surfaces (room, shop)
  cream: palette.cream,
  sand: palette.sand,
  wood: palette.wood,
  woodDeep: palette.woodDeep,
  woodDark: palette.woodDark,

  // Text / surface / border
  ink: palette.ink,
  inkSoft: palette.inkSoft,
  inkFaint: palette.inkFaint,
  paper: palette.paper,
  hair: palette.hair,
  hairDark: palette.hairDark,
} as const;

// ── Shape ────────────────────────────────────────────────────

export const radius = {
  r1: 10,
  r2: 16,
  r3: 20,
  r4: 28,
  r5: 36,
  pill: 999,
} as const;

// ── Spacing (4pt grid) ───────────────────────────────────────

export const spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s7: 32,
  s8: 40,
  s9: 56,
  s10: 72,
} as const;

// ── Elevation / pushable depth ───────────────────────────────
//
// Shadows on web are a stack of (offset, blur, spread, color). React
// Native 0.76+ supports `boxShadow` natively with the same syntax, but
// the "pushable" (Duolingo-style) look — a flat coloured offset — maps
// cleanly to plain `shadowColor` / `shadowOffset` / `shadowOpacity` with
// a tight radius. These tokens are used by the Pushable primitive to
// compute its "face" drop.

export const elevation = {
  // Flat card shadows (RN boxShadow-compatible strings)
  sm: '0px 1px 0px rgba(60, 46, 31, 0.08)',
  md: '0px 2px 0px rgba(60, 46, 31, 0.10), 0px 1px 2px rgba(60, 46, 31, 0.04)',
  lg: '0px 3px 0px rgba(60, 46, 31, 0.10), 0px 6px 16px rgba(60, 46, 31, 0.08)',
  pop: '0px 8px 24px rgba(60, 46, 31, 0.18)',
} as const;

// Pushable sizes — depth (visual drop) and the amount we lift back on
// press. The face element translates by (depth - pressDrop) so a 1px
// residual stays; a fully-flat press feels dead.
export const pushable = {
  sm: { depth: 3, radius: 12 },
  md: { depth: 4, radius: 14 },
  lg: { depth: 5, radius: 16 },
  xl: { depth: 6, radius: 18 },
} as const;

export type PushableSize = keyof typeof pushable;

// ── Motion ───────────────────────────────────────────────────

export const duration = {
  fast: 120,
  medium: 200,
  slow: 320,
  slower: 500,
} as const;

// Bezier curves — use with Animated.timing({ easing: Easing.bezier(...) })
export const easing = {
  // "Ease out, authored" — natural deceleration
  out: [0.22, 1, 0.36, 1] as const,
  // Bounce-out for celebratory micro-interactions
  bounce: [0.34, 1.56, 0.64, 1] as const,
} as const;

// ── Typography ───────────────────────────────────────────────
//
// Nunito is the brand face; Pretendard covers Korean. We rely on the
// system fallback chain for the devanagari / other scripts. Font weights
// are kept to the 400/700/800/900 set Nunito ships.

export const fontFamily = {
  // `Nunito_800ExtraBold` is the identifier Expo expects once the
  // matching variant is loaded at startup (see App.tsx). Regular weight
  // falls back to Nunito_400Regular.
  display: 'Nunito_900Black',
  heading: 'Nunito_800ExtraBold',
  bodyBold: 'Nunito_700Bold',
  body: 'Nunito_400Regular',
  // Monospace kept to the RN default — we don't ship a custom mono.
  mono: 'Menlo',
} as const;

// Pixel font sizes from the spec.
export const fontSize = {
  display: 32,
  h1: 24,
  h2: 20,
  h3: 17,
  body: 15,
  caption: 13,
  micro: 11,
} as const;
