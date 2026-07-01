// Guards the authored ICU master blueprint (5g-c): with structural walls + glass
// room partitions + object footprints, every room must be reachable, thresholds
// walkable, and solid objects block. Collision bugs are invisible on screen.
import { ICU_INTERIOR } from './fixtures/icu';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...ICU_INTERIOR, collision: [...ICU_INTERIOR.collision, ...objectCollision(ICU_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = ICU_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('ICU master blueprint', () => {
  test('player start (hub) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = ICU_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = ICU_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('glass room walls block; per-room doors stay walkable', () => {
    // vertical glass divider between Room 1 and Room 2 blocks
    expect(canEnter({ x: 8, y: 8 }, grid, blocked)).toBe(false);
    // Room 1's auto door in the y17 glass boundary is walkable
    expect(canEnter({ x: 4, y: 17 }, grid, blocked)).toBe(true);
    // a patient bed (ibed 2×3) footprint blocks
    expect(canEnter({ x: 2, y: 4 }, grid, blocked)).toBe(false);
  });
});
