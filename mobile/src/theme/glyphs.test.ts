// Glyphs standing in for drawn icons.
//
// 762bb6a replaced the app's on-screen emoji with line icons so everything on a screen
// shares one line weight. Typographic stand-ins are the same problem wearing a different
// hat: ‹ › ✓ ✗ ≡ ▶ render in whatever the pixel font decides, at a weight and baseline
// nothing else on the screen has, and they scale with the type rather than with the icons
// beside them. The onboarding back arrow was a ‹ long after every other arrow was drawn.
//
// So this is a ratchet, not a ban: the counts are what is there now, and they only go
// down. src/map is excluded on purpose — an arrow on an interior wall sign is CONTENT
// being painted, not a control being labelled.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const CEILINGS: Record<string, number> = {
  'src/app': 0,
  'src/components': 9,
};

const GLYPH = /[‹›✓✗≡▶◀●○★☆✕✔→←↑↓]/g;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if ((p.endsWith('.ts') || p.endsWith('.tsx')) && !p.includes('.test.')) out.push(p);
  }
  return out;
}

/** Comments are excluded: a comment explaining that a ‹ used to be here is not a ‹. */
function countGlyphs(file: string): number {
  const src = readFileSync(file, 'utf8')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  return (src.match(GLYPH) ?? []).length;
}

describe('typographic stand-ins for icons stay capped', () => {
  for (const [area, ceiling] of Object.entries(CEILINGS)) {
    test(`${area} renders at most ${ceiling} glyphs`, () => {
      const files = walk(join(__dirname, '..', '..', area));
      expect(files.length).toBeGreaterThan(0);
      const total = files.reduce((n, f) => n + countGlyphs(f), 0);
      expect({ area, total, ceiling, within: total <= ceiling }).toEqual({ area, total, ceiling, within: true });
    });
  }

  test('and the onboarding chrome has none', () => {
    // The screen this started from. Named directly so it cannot drift back under cover of
    // the area ceiling.
    const onb = walk(join(__dirname, '..', 'app', '(onboarding)'));
    expect(onb.length).toBeGreaterThan(0);
    expect(onb.filter((f) => countGlyphs(f) > 0)).toEqual([]);
  });
});

// The same rule, applied to the catalogs.
//
// This is where the onboarding heading's ⇨ was hiding: a decoration baked into the
// translated string, so it rendered in the pixel font at the type's weight rather than the
// icon set's, and every locale carried its own copy of it. The area scan above could not
// see it — it only reads src/app and src/components.
//
// A glyph at the EDGE of a label is doing an icon's job; the ones in ALWAYS are never
// punctuation wherever they sit. Interior signage (map_*) is excluded for the same reason
// as before: an arrow painted on a wall is content. A middot between two words is
// punctuation and is not counted at all.
const CATALOG_CEILING = 100;

const EDGE_GLYPH = '‹›✓✗≡▶◀●○★☆✕✔→←↑↓⇨⇦➔➜»«';
const ALWAYS_GLYPH = '‹›●▶◀⇨⇦✓✗✔✕';

test(`catalog labels carry at most ${CATALOG_CEILING} glyph decorations`, () => {
  const dir = join(__dirname, '..', 'i18n', 'catalog');
  const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.startsWith('map_'));
  expect(files.length).toBeGreaterThanOrEqual(4);

  let total = 0;
  for (const f of files) {
    const src = readFileSync(join(dir, f), 'utf8');
    for (const m of src.matchAll(/:\s*'((?:[^'\\]|\\.)*)'|:\s*"((?:[^"\\]|\\.)*)"/g)) {
      const v = (m[1] ?? m[2] ?? '').trim();
      if (!v) continue;
      const edged = EDGE_GLYPH.includes(v[0]) || EDGE_GLYPH.includes(v[v.length - 1]);
      const always = [...ALWAYS_GLYPH].some((c) => v.includes(c));
      if (edged || always) total += 1;
    }
  }
  expect({ total, ceiling: CATALOG_CEILING, within: total <= CATALOG_CEILING }).toEqual({
    total,
    ceiling: CATALOG_CEILING,
    within: true,
  });
});
