// Guards the authored Outpatient Infusion Center master blueprint (5g-j, v16):
// with structural walls + object footprints, every zone must be reachable,
// thresholds walkable, and solid objects (recliner + smart pump + coffee machine)
// block. Collision bugs are invisible on screen.
import { INFUSION_INTERIOR } from './fixtures/infusion';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...INFUSION_INTERIOR, collision: [...INFUSION_INTERIOR.collision, ...objectCollision(INFUSION_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = INFUSION_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Outpatient Infusion Center master blueprint', () => {
  test('player start (check-in corridor by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 6 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 6 })).toBe(true);
    expect(canEnter({ x: 13, y: 39 }, grid, blocked)).toBe(false); // bottom solid (rows=40)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = INFUSION_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = INFUSION_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('open infusion bay + isolation room + nourishment + station all reachable', () => {
    expect(reachable({ x: 4, y: 14 })).toBe(true); // bay aisle
    expect(reachable({ x: 22, y: 16 })).toBe(true); // isolation room
    expect(reachable({ x: 6, y: 35 })).toBe(true); // nourishment corner
    expect(reachable({ x: 20, y: 34 })).toBe(true); // nurse station
  });

  test('solid infusion objects block (recliner + smart pump + coffee machine)', () => {
    expect(canEnter({ x: 2, y: 11 }, grid, blocked)).toBe(false); // InfusionChair 2×2
    expect(canEnter({ x: 5, y: 11 }, grid, blocked)).toBe(false); // SmartInfusionPump 1×1
    expect(canEnter({ x: 4, y: 31 }, grid, blocked)).toBe(false); // CoffeeMachine 1×1
  });
});
