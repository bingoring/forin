// Guards the authored General-Surgery Ward master blueprint (5g-g): with
// structural walls + curtain dividers + object footprints, every room must be
// reachable, thresholds walkable, curtains block yet each post-op bay stays
// reachable, and solid objects block. Collision bugs are invisible on screen.
import { SURGWARD_INTERIOR } from './fixtures/surgward';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...SURGWARD_INTERIOR, collision: [...SURGWARD_INTERIOR.collision, ...objectCollision(SURGWARD_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = SURGWARD_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('General Surgery Ward master blueprint', () => {
  test('player start (station corridor by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left 캠퍼스 door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 15 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 15 })).toBe(true);
    expect(canEnter({ x: 13, y: 51 }, grid, blocked)).toBe(false);
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = SURGWARD_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = SURGWARD_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('4-bed curtains block, yet all four post-op bays are reachable', () => {
    expect(canEnter({ x: 8, y: 25 }, grid, blocked)).toBe(false);
    expect(canEnter({ x: 16, y: 25 }, grid, blocked)).toBe(false);
    expect(reachable({ x: 4, y: 27 })).toBe(true);
    expect(reachable({ x: 11, y: 27 })).toBe(true);
    expect(reachable({ x: 19, y: 27 })).toBe(true);
    expect(reachable({ x: 25, y: 27 })).toBe(true);
  });

  test('solid surg objects block (ward bed + PCA pump + SCD device)', () => {
    expect(canEnter({ x: 4, y: 39 }, grid, blocked)).toBe(false); // major bed 2×3
    expect(canEnter({ x: 6, y: 16 }, grid, blocked)).toBe(false); // PCA pump
    expect(canEnter({ x: 13, y: 42 }, grid, blocked)).toBe(false); // SCD device 2×2
  });
});
