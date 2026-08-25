// emoji → icon, in two tiers.
//
// Tier 1 is v23's own EMOJI_MAP into the FIcon set: that is the canonical mapping
// and it wins wherever it has an answer.
//
// Tier 2 is the app's older line-icon set. It exists because our world is bigger
// than the handoff's catalogue — 24 departments of interiors use objects (a gown,
// a puzzle, a blood bag, a projector) that FIcon's 87 icons do not cover. Dropping
// tier 2 to be "purely v23" would turn already-iconified ward objects back into
// emoji, which is a regression dressed as compliance.
//
// Anything neither tier maps stays the literal emoji. That is correct for faces,
// which v23 leaves unmapped on purpose, and honest for the rest: an emoji reads
// better than the wrong icon.
import { FEMOJI, FICONS } from './ficons';
import { iconFor, type IconName } from '@/components/PixelIcon';

/** U+FE0F, the variation selector. '⚠️' and '⚠' are the same emoji to a reader
 *  and different strings to a Map, and our data files contain both spellings —
 *  the handoff's own regex allows for a trailing one for exactly this reason. */
const VARIATION = /️/g;

export type EmojiArt =
  | { tier: 'ficon'; name: string }
  | { tier: 'line'; name: IconName }
  | undefined;

export function artFor(emoji?: string): EmojiArt {
  if (!emoji) return undefined;
  const raw = emoji.trim();
  const plain = raw.replace(VARIATION, '');
  const f = FEMOJI[raw] ?? FEMOJI[plain];
  // A mapping that names an icon we do not have would render the fallback gem in
  // place of, say, a bed. Fall through instead — wrong artwork is worse than the
  // original character.
  if (f && FICONS[f]) return { tier: 'ficon', name: f };
  const line = iconFor(raw) ?? iconFor(plain);
  if (line) return { tier: 'line', name: line };
  return undefined;
}

/** Tier-1 only, for callers that specifically want the v23 artwork. */
export function fIconFor(emoji?: string): string | undefined {
  const art = artFor(emoji);
  return art?.tier === 'ficon' ? art.name : undefined;
}
