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

export const type = {
  hero: 64,
  resultTitle: 34,
  screenHeading: 22,
  topBar: 15,
  section: 13,
  body: 14,
  caption: 11,
  label: 10,
  micro: 8,
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
