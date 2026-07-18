// Guards the authored Oncology/BMT master blueprint (5g-t, v16): chemo-verify +
// quiet room + central station + open infusion bay + BMT anteroom + two glass-walled
// positive-pressure transplant rooms. Every zone reachable, thresholds walkable,
// BMT glass walls block, and solid objects (infusion chair + BMT bed + fridge) block.
import { ONCO_INTERIOR } from './fixtures/onco';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...ONCO_INTERIOR, collision: [...ONCO_INTERIOR.collision, ...objectCollision(ONCO_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = ONCO_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Oncology / BMT master blueprint', () => {
  test('player start (central station by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 15 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 15 })).toBe(true);
    expect(canEnter({ x: 13, y: 49 }, grid, blocked)).toBe(false); // bottom solid (rows=50)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = ONCO_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = ONCO_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('verify + quiet + infusion bay + BMT anteroom & rooms reachable; BMT glass blocks', () => {
    expect(reachable({ x: 4, y: 5 })).toBe(true); // chemo verify
    expect(reachable({ x: 20, y: 5 })).toBe(true); // quiet room
    expect(reachable({ x: 12, y: 25 })).toBe(true); // infusion bay
    expect(reachable({ x: 4, y: 46 })).toBe(true); // BMT anteroom
    expect(reachable({ x: 12, y: 45 })).toBe(true); // BMT room 1 (via airlock)
    expect(canEnter({ x: 18, y: 42 }, grid, blocked)).toBe(false); // BMT room1|2 glass
  });

  test('solid onco objects block (infusion chair + BMT bed + fridge)', () => {
    expect(canEnter({ x: 2, y: 22 }, grid, blocked)).toBe(false); // InfusionChair 2×2
    expect(canEnter({ x: 10, y: 40 }, grid, blocked)).toBe(false); // BMT bed 2×3
    expect(canEnter({ x: 10, y: 6 }, grid, blocked)).toBe(false); // Fridge 1×1
  });
});
