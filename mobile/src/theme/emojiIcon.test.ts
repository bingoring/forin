// Emoji our DATA carries must resolve to artwork, and the number that do not can
// only go down.
//
// This is a ratchet, not a pass/fail on zero: our 24 departments of interiors use
// more distinct objects (a gown, a puzzle, a blood bag) than v23's 87-icon
// catalogue covers, so some fixtures legitimately still draw an emoji. What must
// not happen is a NEW one appearing unnoticed — that is how the app slid back to
// emoji after 762bb6a claimed to have removed them all.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { artFor } from './emojiIcon';
import { FEMOJI, FICONS } from './ficons';

// Emoji and pictographs, but NOT the arrows and marks the glyph ratchet owns:
// '→ 진료실' is a door sign whose arrow is part of the sentence, and turning that
// into an icon would break the label.
const PICTO = /^(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}][\u{FE0F}\u{200D}\u{1F300}-\u{1FAFF}]*)+$/u;

const AREAS = ['src/map', 'src/data'];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if ((p.endsWith('.ts') || p.endsWith('.tsx')) && !p.includes('.test.')) out.push(p);
  }
  return out;
}

/** Every string literal in our data that is nothing but pictographs — i.e. an
 *  icon slot, not prose that happens to contain a symbol. */
function pictographLiterals(): Map<string, string> {
  const found = new Map<string, string>();
  for (const area of AREAS) {
    for (const file of walk(join(__dirname, '..', '..', area))) {
      const src = readFileSync(file, 'utf8')
        .replace(/\/\/[^\n]*/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');
      for (const m of src.matchAll(/'([^'\n]{1,8})'/g)) {
        const v = m[1].trim();
        if (v && PICTO.test(v) && !found.has(v)) found.set(v, file);
      }
    }
  }
  return found;
}

// Measured (38 of 93 distinct data emoji), then frozen. Lower it whenever the
// number drops. The 38 are interior objects v23's catalogue has no icon for —
// 🧥 gown, 🧩 puzzle, 🩸 blood bag, 🍩 CT gantry and the like — so closing the
// gap means either new artwork in a future handoff or a deliberate substitution,
// not a code change here.
const UNRESOLVED_CEILING = 38;

test('the scan actually finds our data emoji', () => {
  // Without this the ceiling test would pass on an empty scan forever.
  expect(pictographLiterals().size).toBeGreaterThan(80); // 93 at the time of writing
});

test(`at most ${UNRESOLVED_CEILING} distinct data emoji lack artwork`, () => {
  const unresolved = [...pictographLiterals()].filter(([e]) => !artFor(e));
  expect({
    count: unresolved.length,
    ceiling: UNRESOLVED_CEILING,
    within: unresolved.length <= UNRESOLVED_CEILING,
    // Named so a failure says WHICH emoji to map, not just that a number moved.
    examples: unresolved.slice(0, 8).map(([e, f]) => `${e} (${f.split('/').slice(-2).join('/')})`),
  }).toEqual({
    count: unresolved.length,
    ceiling: UNRESOLVED_CEILING,
    within: true,
    examples: unresolved.slice(0, 8).map(([e, f]) => `${e} (${f.split('/').slice(-2).join('/')})`),
  });
});

// v23's map is tier 1 and must win: if a later change shadowed it with the older
// line set, the app would draw the retired artwork for a mapped emoji.
test("v23's mapping wins over the older line-icon set", () => {
  // ⭐ is mapped by BOTH: FEMOJI says xp (the gem), EMOJI_ICON said star.
  expect(FEMOJI['⭐']).toBe('xp');
  expect(artFor('⭐')).toEqual({ tier: 'ficon', name: 'xp' });
  // 👍 exists only in v23 — the thumb the clear sticker now uses.
  expect(artFor('👍')).toEqual({ tier: 'ficon', name: 'thumb' });
});

// The older set still has to be reachable, or already-iconified ward objects
// regress to emoji in the name of purity.
test('the line-icon set still covers what v23 does not', () => {
  const onlyLine = artFor('👑'); // a title badge; no crown in FIcon
  expect(onlyLine?.tier).toBe('line');
  expect(FEMOJI['👑']).toBeUndefined();
});

// Variation selectors: '⚠️' and '⚠' are one emoji to a reader and two strings to
// a Map, and our fixtures contain both spellings.
test('a variation selector does not lose the mapping', () => {
  expect(artFor('⚠')).toBeTruthy();
  expect(artFor('⚠️')).toEqual(artFor('⚠'));
});

// A mapping pointing at an icon we do not have would draw the fallback gem in
// place of, say, a bed — worse than the emoji.
test('a mapping to a missing icon falls through instead of drawing the fallback', () => {
  const bad = Object.entries(FEMOJI).filter(([, name]) => !FICONS[name]);
  expect(bad).toEqual([]);
});

// Faces stay faces.
test('expression emoji resolve to no artwork', () => {
  for (const face of ['😄', '😷', '🙂']) {
    expect(artFor(face)?.tier).not.toBe('ficon');
  }
});
