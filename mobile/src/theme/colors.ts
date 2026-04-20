// Warm Cozy palette — derived from the mascot (Moro).
// Token names are preserved from the prior Material-ish palette so every
// consumer screen compiles unchanged. Hex values shift toward cream /
// chocolate / amber / dusty-pink. See
// docs/superpowers/specs/2026-04-17-spatial-ux-foundation-design.md §4.1.
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
