// Guards the authored Specialty OPD master blueprint (5g-s, v16): integrated check-in
// + four specialty exam rooms off it (ophthalmology / ENT / urology / neurology).
// Every zone reachable, thresholds walkable, dividers block, and solid objects
// (ENT tower-chair + exam bed + ultrasound) block.
import { SPECIALTY_INTERIOR } from './fixtures/specialty';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...SPECIALTY_INTERIOR, collision: [...SPECIALTY_INTERIOR.collision, ...objectCollision(SPECIALTY_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = SPECIALTY_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Specialty OPD master blueprint', () => {
  test('player start (integrated check-in by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 10 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 10 })).toBe(true);
    expect(canEnter({ x: 13, y: 41 }, grid, blocked)).toBe(false); // bottom solid (rows=44)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = SPECIALTY_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = SPECIALTY_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('all four specialty rooms reachable', () => {
    expect(reachable({ x: 6, y: 18 })).toBe(true); // ophthalmology
    expect(reachable({ x: 20, y: 18 })).toBe(true); // ENT
    expect(reachable({ x: 6, y: 33 })).toBe(true); // urology
    expect(reachable({ x: 20, y: 33 })).toBe(true); // neurology
  });

  test('solid specialty objects block (ENT tower-chair + exam bed + ultrasound)', () => {
    expect(canEnter({ x: 15, y: 14 }, grid, blocked)).toBe(false); // ENTTowerChair 3×2
    expect(canEnter({ x: 2, y: 27 }, grid, blocked)).toBe(false); // exam bed 2×3
    expect(canEnter({ x: 6, y: 28 }, grid, blocked)).toBe(false); // ultrasound cart
  });
});
