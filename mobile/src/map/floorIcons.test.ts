// Floor lists draw objects, not buildings.
//
// The same v25 rule that governs the building list governs this one: "건물·층
// 목록에서는 건물 외형이 아니라 그 건물을 대표하는 상징물(물건) 아이콘을 쓴다.
// 건물형 아이콘(tower/women/onco/clinic/admin/dx)은 FICONS에 보존되어 있으나
// 목록에서는 미사용."
//
// The elevator's floors carry their icon as an emoji in the fixture, so a floor can
// land on a building shape without anyone writing the word `women` — 🤰 resolved to
// the pink pavilion, and 🩻 to `dx`. This checks the resolved artwork, not the source.
import { readFileSync } from 'fs';
import { join } from 'path';
import { artFor } from '@/theme/emojiIcon';

const BUILDING_SHAPES = ['tower', 'women', 'onco', 'clinic', 'admin', 'dx'];

/** Every floor icon in the elevator directory, with the floor that uses it. */
function floorIcons(): Map<string, string> {
  const src = readFileSync(join(__dirname, 'ElevatorScreen.tsx'), 'utf8');
  const out = new Map<string, string>();
  for (const m of src.matchAll(/\{ f: '([^']+)',[^}]*?icon: '([^']+)'/gs)) {
    if (!out.has(m[2])) out.set(m[2], m[1]);
  }
  return out;
}

test('the scan finds the floor directory', () => {
  // Otherwise the assertions below pass on an empty map after any refactor.
  expect(floorIcons().size).toBeGreaterThan(15);
});

test('every floor icon resolves to artwork', () => {
  const unresolved = [...floorIcons()].filter(([e]) => !artFor(e)).map(([e, f]) => `${e} (${f})`);
  expect(unresolved).toEqual([]);
});

test('no floor icon resolves to a building shape', () => {
  const offenders = [...floorIcons()]
    .map(([e, f]) => ({ e, f, art: artFor(e) }))
    .filter((x) => x.art?.tier === 'ficon' && BUILDING_SHAPES.includes(x.art.name))
    .map((x) => `${x.f}: ${x.e} → ${x.art && 'name' in x.art ? x.art.name : ''}`);
  expect(offenders).toEqual([]);
});
