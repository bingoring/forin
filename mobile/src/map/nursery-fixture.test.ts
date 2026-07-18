// Guards the authored Well-Baby Nursery master blueprint (5g-k, v16): with
// structural walls + object footprints, every zone must be reachable, thresholds
// walkable, the observation window blocks, and solid objects (bassinet + infant
// warmer + nursing recliner) block. Collision bugs are invisible on screen.
import { NURSERY_INTERIOR } from './fixtures/nursery';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...NURSERY_INTERIOR, collision: [...NURSERY_INTERIOR.collision, ...objectCollision(NURSERY_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = NURSERY_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Well-Baby Nursery master blueprint', () => {
  test('player start (hygiene entry by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 6 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 6 })).toBe(true);
    expect(canEnter({ x: 13, y: 41 }, grid, blocked)).toBe(false); // bottom solid (rows=42)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = NURSERY_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = NURSERY_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('bassinet zone + admit + feeding + viewing all reachable; obs window blocks', () => {
    expect(reachable({ x: 4, y: 13 })).toBe(true); // nursery aisle
    expect(reachable({ x: 22, y: 14 })).toBe(true); // admit warmer bay
    expect(reachable({ x: 4, y: 34 })).toBe(true); // lactation
    expect(reachable({ x: 20, y: 35 })).toBe(true); // family viewing
    expect(canEnter({ x: 15, y: 27 }, grid, blocked)).toBe(false); // ObsWindow solid divider
  });

  test('solid nursery objects block (bassinet + infant warmer + nursing recliner)', () => {
    expect(canEnter({ x: 2, y: 11 }, grid, blocked)).toBe(false); // Bassinet 2×2
    expect(canEnter({ x: 20, y: 12 }, grid, blocked)).toBe(false); // InfantWarmer 2×2
    expect(canEnter({ x: 2, y: 31 }, grid, blocked)).toBe(false); // NursingRecliner 2×2
  });
});
