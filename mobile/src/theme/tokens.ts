// forin design tokens — from design-handoff/01_DESIGN_TOKENS. All values final.
// Pixel aesthetic: square corners (radius 0), hard offset shadows (no blur).

export const colors = {
  // Brand greens
  mint: '#A7F3D0',
  mintDeep: '#6EE7B7',
  mintShadow: '#4FC79D',
  // Peach
  peach: '#FFEDD5',
  peachDeep: '#FED7AA',
  peachShadow: '#E8B584',
  // Yellow
  yellow: '#FEF08A',
  yellowDeep: '#FACC15',
  yellowShadow: '#CA8A04',
  // Text
  text: '#374151',
  textSoft: '#6B7280',
  textFaint: '#9CA3AF',
  // Surface
  cream: '#FFFBF0',
  paper: '#FFF8E7',
  ink: '#2A2522', // borders + primary outline
  // Semantic
  pink: '#FBCFE8',
  blue: '#BAE6FD',
  red: '#FCA5A5',
  lilac: '#DDD6FE',
} as const;

// Two bundled pixel fonts (see assets/fonts/README). Fallback: system mono until loaded.
export const fonts = {
  heading: 'DungGeunMo', // headings, labels, buttons, all-caps UI
  body: 'Galmuri11', // body, Korean sentences
} as const;

// ── Global type scale ────────────────────────────────────────────────────────
// The handoff designs at 402×874 with Label/HUD at 9–10px and Micro at 6–8px,
// which reads as cramped on a real device. Rather than retune 696 hardcoded
// sizes one by one, every fontSize in the app goes through fs() so the bump is
// ONE number. Deliberate deviation from 01_DESIGN_TOKENS.md — recorded in
// DECISIONS.md (2026-08-18).
//
// Rounded to integers on purpose: DungGeunMo and Galmuri11 are pixel fonts and
// fractional sizes make them blurry rather than bigger.
export const TYPE_BUMP = 1.15;

/** Scale a design-system px size to what actually renders. */
export function fs(px: number): number {
  // Only the dense end gets the bump. Display sizes (splash logo 64, result
  // title 34, …) are already large; scaling them just pushes layouts around
  // without fixing the thing that felt cramped.
  if (px > 16) return px;
  // Clamped to 17 so the bump stays monotonic at the boundary: without it a
  // 16px would render at 18 while an untouched 17px stayed 17, making the
  // smaller design size render larger than the bigger one.
  return Math.min(17, Math.max(9, Math.round(px * TYPE_BUMP)));
}

export const type = {
  hero: 64,
  resultTitle: 34,
  screenHeading: 22,
  topBar: fs(15),
  section: fs(13),
  body: fs(14),
  caption: fs(11),
  label: fs(10),
  micro: fs(8),
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 28 } as const;

export const radius = 0; // square corners everywhere (pixel aesthetic)

// Hard pixel shadow offsets (rendered as an offset solid layer, never blurred).
export const shadow = {
  chip: 2,
  card: 4,
  modal: 6,
} as const;

export const border = { thin: 2, card: 3, modal: 4 } as const;
