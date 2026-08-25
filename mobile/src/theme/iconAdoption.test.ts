// v23 makes FIcon the global icon system, so a surface still drawing the old line
// icon for something FIcon has is drawing retired artwork.
//
// This test is why "the icons changed" is checkable rather than asserted: the
// first pass ported the 87-icon set and wired the data-driven emoji path, and
// left 92% of on-screen icons — the explicit <PixelIcon name="…"> call sites — on
// the old set. Nothing failed, because porting a set and adopting it are two
// different things and only one of them was tested.
//
// Two escapes stay legitimate, and both are checked rather than assumed:
//  · a name FIcon has no equivalent for (chevrons, tag, share, plus …)
//  · a site that needs a TINT — white on a dark bar, faded when disabled, an
//    accent colour. FIcon artwork carries its own fixed palette and takes no
//    colour, so those sites keep the line icon.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';
import { FICONS } from './ficons';
import { LINE_TO_FICON } from './lineToFIcon';

const SRC = join(__dirname, '..');
/** The tints that FIcon artwork already is: ink on light. Anything else is a site
 *  that depends on recolouring and may keep the line icon. */
const INK = new Set(['C', 'colors.ink']);

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.tsx') && !p.includes('.test.')) out.push(p);
  }
  return out;
}

type Site = { file: string; name: string; color: string };

function pixelIconSites(): Site[] {
  const out: Site[] = [];
  for (const file of walk(SRC)) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/<PixelIcon\b[^>]*?\/>/gs)) {
      const name = /name="([a-z-]+)"/.exec(m[0])?.[1];
      const color = /color=\{([^}]+)\}/.exec(m[0])?.[1]?.trim() ?? 'NONE';
      if (name) out.push({ file: relative(SRC, file), name, color });
    }
  }
  return out;
}

test('the scan finds the call sites it is meant to police', () => {
  // Without this, every assertion below would pass on an empty scan.
  expect(pixelIconSites().length).toBeGreaterThan(20);
});

test('every alias points at an icon the set actually has', () => {
  const broken = Object.entries(LINE_TO_FICON).filter(([, f]) => !FICONS[f]);
  expect(broken).toEqual([]);
});

test('no ink-coloured line icon draws something FIcon has', () => {
  const stragglers = pixelIconSites()
    .filter((s) => INK.has(s.color) && LINE_TO_FICON[s.name])
    // Named, so a failure says which site to convert and to what.
    .map((s) => `${s.file}: ${s.name} → FIcon "${LINE_TO_FICON[s.name]}"`);
  expect(stragglers).toEqual([]);
});

// The two favourites toggles. v23 retires the star as the REWARD mark ("별 도형
// 폐기, 보석으로 통일", listed under xp/gem beside ⭐🌟★), and the reward surfaces
// now draw the gem. The favourites mark is a different thing: it needs a filled
// and an unfilled state to say pinned or not, which fixed-palette artwork cannot
// express, and the filled star is what the product owner specifically asked for
// ("별의 테두리만 노란색으로 하는게 아니라 안쪽도 채워서"). Enumerated rather than
// exempted by rule, so a third star has to justify itself here.
const FAVOURITE_STARS = ['components/campus/FloorList.tsx', 'components/campus/DeptSheet.tsx'];

test('the star survives only as the favourites toggle', () => {
  const stars = pixelIconSites().filter((s) => s.name === 'star');
  // Every remaining star is one of the two toggles…
  expect(stars.map((s) => s.file).sort()).toEqual([...FAVOURITE_STARS].sort());
  // …and each really is a two-state control, not a decoration that slipped the rule.
  for (const s of stars) {
    expect(s.color).toMatch(/starred/);
  }
});

// The remaining line icons should be there for one of the two stated reasons, not
// because someone forgot. This is a ratchet on "kept for tinting".
const TINTED_CEILING = 33;

test(`at most ${TINTED_CEILING} line icons are kept for tinting`, () => {
  const tinted = pixelIconSites().filter((s) => !INK.has(s.color) && LINE_TO_FICON[s.name]);
  expect({
    count: tinted.length,
    ceiling: TINTED_CEILING,
    within: tinted.length <= TINTED_CEILING,
    examples: tinted.slice(0, 6).map((s) => `${s.file}: ${s.name} (${s.color})`),
  }).toEqual({
    count: tinted.length,
    ceiling: TINTED_CEILING,
    within: true,
    examples: tinted.slice(0, 6).map((s) => `${s.file}: ${s.name} (${s.color})`),
  });
});
