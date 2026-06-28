// Guards the authored ER master blueprint (5g-a): with structural walls + object
// footprints, every room must be reachable from the lobby, thresholds must stay
// walkable, and solid object footprints must block. Collision bugs are invisible
// on screen, so test them.
import { ER_INTERIOR } from './fixtures/er';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...ER_INTERIOR, collision: [...ER_INTERIOR.collision, ...objectCollision(ER_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = ER_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('ER master blueprint', () => {
  test('player start is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('every room is reachable from the lobby (via an open tile near its anchor)', () => {
    const bad = ER_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = ER_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('thresholds and tints do not block; solid objects do', () => {
    // bed footprint (2×3) blocks
    expect(canEnter({ x: 3, y: 16 }, grid, blocked)).toBe(false);
    // nurse station footprint blocks
    expect(canEnter({ x: 18, y: 20 }, grid, blocked)).toBe(false);
    // a tint tile stays walkable (decon room floor)
    expect(canEnter({ x: 33, y: 52 }, grid, blocked)).toBe(true);
  });
});
