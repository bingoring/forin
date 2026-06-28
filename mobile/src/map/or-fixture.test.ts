// Guards the authored OR master blueprint (5g-b): with structural walls + object
// footprints, every room must be reachable, thresholds must stay walkable, and
// solid object footprints must block. Collision bugs are invisible on screen.
import { OR_INTERIOR } from './fixtures/or';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...OR_INTERIOR, collision: [...OR_INTERIOR.collision, ...objectCollision(OR_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = OR_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('OR master blueprint', () => {
  test('player start is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = OR_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = OR_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('solid OR objects block; thresholds/tints stay walkable', () => {
    // anesthesia machine (2×2 at x4,y36) footprint blocks
    expect(canEnter({ x: 4, y: 36 }, grid, blocked)).toBe(false);
    // OR scrub sink (2×2 at x16,y35) footprint blocks
    expect(canEnter({ x: 16, y: 35 }, grid, blocked)).toBe(false);
    // a sterile threshold opening stays walkable (OR1 entry)
    expect(canEnter({ x: 5, y: 31 }, grid, blocked)).toBe(true);
    // an OR tint floor tile stays walkable
    expect(canEnter({ x: 10, y: 45 }, grid, blocked)).toBe(true);
  });
});
