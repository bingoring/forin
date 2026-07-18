// Guards the authored SPD/CSD · Nutrition · Loading Dock master blueprint (5g-aa,
// v16): a decontamination zone, sterile processing/storage, a nutrition tray line,
// and a loading dock (30 cols wide, right-side dock gate). Every zone reachable,
// thresholds walkable, and solid objects (autoclave + food cart + cargo truck) block.
import { SPD_INTERIOR } from './fixtures/spd';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...SPD_INTERIOR, collision: [...SPD_INTERIOR.collision, ...objectCollision(SPD_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = SPD_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('SPD / Nutrition / Loading Dock master blueprint', () => {
  test('player start (decon zone by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 8 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 8 })).toBe(true);
    expect(canEnter({ x: 13, y: 43 }, grid, blocked)).toBe(false); // bottom solid (rows=44)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = SPD_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = SPD_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('sterile + kitchen + dock reachable', () => {
    expect(reachable({ x: 22, y: 6 })).toBe(true); // sterile processing (via 세척→멸균 pass-through)
    expect(reachable({ x: 10, y: 18 })).toBe(true); // nutrition kitchen
    expect(reachable({ x: 12, y: 35 })).toBe(true); // loading dock
  });

  test('solid SPD objects block (autoclave + food cart + cargo truck)', () => {
    expect(canEnter({ x: 16, y: 2 }, grid, blocked)).toBe(false); // Autoclave 2×2
    expect(canEnter({ x: 2, y: 19 }, grid, blocked)).toBe(false); // FoodCartColumn 1×2
    expect(canEnter({ x: 22, y: 31 }, grid, blocked)).toBe(false); // CargoTruck 2×3
  });
});
