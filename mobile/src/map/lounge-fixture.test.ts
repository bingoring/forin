// Guards the authored Staff Lounge/Locker/Cafeteria master blueprint (5g-z, v16):
// two locker rooms + a staff lounge (sofas/vending/on-call recliners) + a cafeteria
// (servery line + dining tables). Every zone reachable, thresholds walkable, dividers
// block, and solid objects (vending + dining table + servery counter) block.
import { LOUNGE_INTERIOR } from './fixtures/lounge';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...LOUNGE_INTERIOR, collision: [...LOUNGE_INTERIOR.collision, ...objectCollision(LOUNGE_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = LOUNGE_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Staff Lounge / Locker / Cafeteria master blueprint', () => {
  test('player start (locker room A by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 13 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 13 })).toBe(true);
    expect(canEnter({ x: 13, y: 39 }, grid, blocked)).toBe(false); // bottom solid (rows=40)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = LOUNGE_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = LOUNGE_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('locker B + lounge + cafeteria reachable', () => {
    expect(reachable({ x: 20, y: 8 })).toBe(true); // locker room B
    expect(reachable({ x: 6, y: 28 })).toBe(true); // staff lounge
    expect(reachable({ x: 19, y: 28 })).toBe(true); // cafeteria
  });

  test('solid lounge objects block (vending + dining table + servery counter)', () => {
    expect(canEnter({ x: 10, y: 17 }, grid, blocked)).toBe(false); // Vending 1×1
    expect(canEnter({ x: 15, y: 23 }, grid, blocked)).toBe(false); // DiningTable 2×1
    expect(canEnter({ x: 15, y: 18 }, grid, blocked)).toBe(false); // ServeryCounter 4×1
  });
});
