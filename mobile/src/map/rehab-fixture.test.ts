// Guards the authored Rehabilitation PT/OT Gym master blueprint (5g-x, v16): one big
// open therapy gym — reception + gait-training zone + mat-therapy zone + cardio/
// strength zone + OT ADL corner. Every zone reachable, thresholds walkable, and solid
// objects (treadmill + therapy mat + ADL kitchen) block.
import { REHAB_INTERIOR } from './fixtures/rehab';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...REHAB_INTERIOR, collision: [...REHAB_INTERIOR.collision, ...objectCollision(REHAB_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = REHAB_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Rehabilitation PT/OT Gym master blueprint', () => {
  test('player start (rehab reception by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 8 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 8 })).toBe(true);
    expect(canEnter({ x: 13, y: 43 }, grid, blocked)).toBe(false); // bottom solid (rows=44)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = REHAB_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = REHAB_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('gait + mat + cardio + ADL zones all reachable', () => {
    expect(reachable({ x: 6, y: 16 })).toBe(true); // gait
    expect(reachable({ x: 21, y: 16 })).toBe(true); // mat
    expect(reachable({ x: 5, y: 34 })).toBe(true); // cardio
    expect(reachable({ x: 22, y: 34 })).toBe(true); // ADL
  });

  test('solid rehab objects block (treadmill + therapy mat + ADL kitchen)', () => {
    expect(canEnter({ x: 3, y: 18 }, grid, blocked)).toBe(false); // Treadmill 2×1
    expect(canEnter({ x: 15, y: 13 }, grid, blocked)).toBe(false); // TherapyMat 2×1
    expect(canEnter({ x: 15, y: 30 }, grid, blocked)).toBe(false); // ADLKitchen 4×1
  });
});
