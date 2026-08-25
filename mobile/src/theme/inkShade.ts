// Which shades of ink the v23+ artwork can stand in for, and how opaque it is at
// each of them.
//
// These greys are not different colours — they are the SAME ink, quieter: an
// inactive tab, a placeholder in an empty state, a disabled control. Fixed-palette
// pixel artwork expresses that with opacity, and the result reads as secondary,
// which is what the line icon's grey stroke was doing. A real colour (an accent, or
// something light meant to read on a dark ground) is NOT a shade of ink, and gets
// no answer here — artwork cannot become it.
import { colors } from './tokens';

const INK_OPACITY: Record<string, number> = {
  [colors.ink.toLowerCase()]: 1,
  [colors.textSoft.toLowerCase()]: 0.62,
  [colors.textFaint.toLowerCase()]: 0.42,
};

export function inkOpacity(color: string): number | undefined {
  const c = color.trim().toLowerCase();
  if (INK_OPACITY[c] !== undefined) return INK_OPACITY[c];
  // '#2A252244' — ink carrying an alpha suffix, which the app writes as C + '44'.
  const ink = colors.ink.toLowerCase();
  if (c.length === 9 && c.startsWith(ink)) return parseInt(c.slice(7), 16) / 255;
  return undefined;
}
