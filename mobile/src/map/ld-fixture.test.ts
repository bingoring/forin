// Guards the authored L&D combined-floor master blueprint (5g-m, v16): OB triage +
// epidural prep + central station + LDR birthing rooms + postpartum + glass nursery
// on one 28×50 floor. Every zone must be reachable, thresholds walkable, the glass
// nursery divider blocks, and solid objects (birthing bed + delivery cart + bassinet)
// block. Collision bugs are invisible on screen.
import { LD_INTERIOR } from './fixtures/ld';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...LD_INTERIOR, collision: [...LD_INTERIOR.collision, ...objectCollision(LD_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = LD_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('L&D combined-floor master blueprint', () => {
  test('player start (central station by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 15 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 15 })).toBe(true);
    expect(canEnter({ x: 13, y: 49 }, grid, blocked)).toBe(false); // bottom solid (rows=50)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = LD_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = LD_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('all six zones reachable; glass nursery divider blocks', () => {
    expect(reachable({ x: 4, y: 5 })).toBe(true); // OB triage
    expect(reachable({ x: 16, y: 5 })).toBe(true); // epidural prep
    expect(reachable({ x: 4, y: 27 })).toBe(true); // LDR 1
    expect(reachable({ x: 24, y: 30 })).toBe(true); // infant warmer bay
    expect(reachable({ x: 4, y: 44 })).toBe(true); // postpartum
    expect(reachable({ x: 21, y: 46 })).toBe(true); // nursery
    expect(canEnter({ x: 14, y: 42 }, grid, blocked)).toBe(false); // glass divider
  });

  test('solid L&D objects block (birthing bed + delivery cart + bassinet)', () => {
    expect(canEnter({ x: 2, y: 23 }, grid, blocked)).toBe(false); // BirthingBed 3×2
    expect(canEnter({ x: 2, y: 29 }, grid, blocked)).toBe(false); // DeliveryCart 2×1
    expect(canEnter({ x: 16, y: 38 }, grid, blocked)).toBe(false); // Bassinet 2×2
  });
});
