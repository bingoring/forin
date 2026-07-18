// Guards the authored Hospice/Palliative master blueprint (5g-u, v16): family
// lounge/kitchen + palliative care desk + reflection room + two home-like palliative
// rooms (A + garden sunroom B). Every zone reachable, thresholds walkable, dividers
// block, and solid objects (hospice bed + ADL kitchen + recliner daybed) block.
import { HOSPICE_INTERIOR } from './fixtures/hospice';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...HOSPICE_INTERIOR, collision: [...HOSPICE_INTERIOR.collision, ...objectCollision(HOSPICE_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = HOSPICE_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Hospice / Palliative master blueprint', () => {
  test('player start (family lounge by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 8 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 8 })).toBe(true);
    expect(canEnter({ x: 13, y: 43 }, grid, blocked)).toBe(false); // bottom solid (rows=44)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = HOSPICE_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = HOSPICE_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('station + reflection + both palliative rooms reachable; sunroom glass blocks', () => {
    expect(reachable({ x: 6, y: 16 })).toBe(true); // palliative desk
    expect(reachable({ x: 18, y: 16 })).toBe(true); // reflection room
    expect(reachable({ x: 6, y: 34 })).toBe(true); // palliative room A
    expect(reachable({ x: 18, y: 34 })).toBe(true); // sunroom B
    expect(canEnter({ x: 26, y: 30 }, grid, blocked)).toBe(false); // garden-view glass
  });

  test('solid hospice objects block (hospice bed + ADL kitchen + recliner daybed)', () => {
    expect(canEnter({ x: 2, y: 26 }, grid, blocked)).toBe(false); // HospiceBed 2×3
    expect(canEnter({ x: 2, y: 2 }, grid, blocked)).toBe(false); // ADLKitchen 3×1
    expect(canEnter({ x: 19, y: 3 }, grid, blocked)).toBe(false); // ReclinerDaybed 2×2
  });
});
