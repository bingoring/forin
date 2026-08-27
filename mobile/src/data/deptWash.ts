// The dialogue's background tint, from the department's own colour.
//
// The briefing screen puts `deptColor` on a header strip at full strength (#DC2626 for
// ER). A full-screen band at that strength would fight every bubble drawn on it, so
// the dialogue uses a WASH — the same hue mixed most of the way to the app's cream, so
// an ER conversation reads warm-red and an ICU one cool without either becoming the
// subject of the screen.
//
// Derived rather than authored: the server has a `tone` field on some content, but not
// on every briefing, and a background that appears only for the departments that
// happened to fill it in is worse than one rule applied everywhere.
import { colors } from '@/theme/tokens';

/** How much of the department colour survives the mix. Low on purpose: at 0.30 an ER
 *  scenario looked like a warning screen, and the peach it replaced was subtle enough
 *  that nobody had complained about it. */
const STRENGTH = 0.14;

function parseHex(hex: string): [number, number, number] | undefined {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return undefined;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex(r: number, g: number, b: number): string {
  const p = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${p(r)}${p(g)}${p(b)}`;
}

/** The wash for a department colour, or the app's default peach when it is missing or
 *  unreadable — a scenario with no colour must still look like the app. */
export function deptWash(deptColor?: string): string {
  const rgb = deptColor ? parseHex(deptColor) : undefined;
  if (!rgb) return colors.peach;
  const base = parseHex(colors.cream) ?? [255, 253, 245];
  return toHex(
    base[0] + (rgb[0] - base[0]) * STRENGTH,
    base[1] + (rgb[1] - base[1]) * STRENGTH,
    base[2] + (rgb[2] - base[2]) * STRENGTH,
  );
}
