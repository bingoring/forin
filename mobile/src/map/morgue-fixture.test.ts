// Guards the authored Morgue & Autopsy master blueprint (5g-ab, v16, ADMIN B1):
// a reception/handoff bay, a cold cadaver-storage bank, an autopsy suite, a family
// viewing room, and a facilities mechanical corner (28×40, left elevator door).
// Every zone reachable, thresholds walkable, and solid objects (cadaver fridge +
// autopsy table + mechanical autoclave) block.
import { MORGUE_INTERIOR } from './fixtures/morgue';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...MORGUE_INTERIOR, collision: [...MORGUE_INTERIOR.collision, ...objectCollision(MORGUE_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = MORGUE_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Morgue & Autopsy master blueprint', () => {
  test('player start (reception by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 6 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 6 })).toBe(true);
    expect(canEnter({ x: 13, y: 39 }, grid, blocked)).toBe(false); // bottom solid (rows=40)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = MORGUE_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = MORGUE_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('cold + autopsy + viewing + mech all reachable', () => {
    expect(reachable({ x: 6, y: 16 })).toBe(true); // cold storage
    expect(reachable({ x: 20, y: 16 })).toBe(true); // autopsy suite
    expect(reachable({ x: 6, y: 33 })).toBe(true); // viewing room (via cold)
    expect(reachable({ x: 21, y: 33 })).toBe(true); // mechanical (via autopsy)
  });

  test('solid morgue objects block (cadaver fridge + autopsy table + autoclave)', () => {
    expect(canEnter({ x: 2, y: 11 }, grid, blocked)).toBe(false); // CadaverFridge 4×2
    expect(canEnter({ x: 15, y: 12 }, grid, blocked)).toBe(false); // AutopsyTable 3×2
    expect(canEnter({ x: 15, y: 32 }, grid, blocked)).toBe(false); // Autoclave 2×2
  });
});
