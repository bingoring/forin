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
  'src/app': 23,
  'src/components': 27,
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
