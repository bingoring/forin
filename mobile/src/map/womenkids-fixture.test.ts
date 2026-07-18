// Guards the authored Women & Kids OPD master blueprint (5g-l, v16): with
// structural walls + object footprints, every zone must be reachable, thresholds
// walkable, and solid objects (clinic reception + exam bed + fetal monitor) block.
// This interior replaces the peds center on WOMEN 1F. Collision bugs are invisible.
import { WOMENKIDS_INTERIOR } from './fixtures/womenkids';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...WOMENKIDS_INTERIOR, collision: [...WOMENKIDS_INTERIOR.collision, ...objectCollision(WOMENKIDS_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = WOMENKIDS_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Women & Kids OPD master blueprint', () => {
  test('player start (lobby by the ↓ campus door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (top campus door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 13, y: 1 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 13, y: 1 })).toBe(true);
    expect(canEnter({ x: 13, y: 39 }, grid, blocked)).toBe(false); // bottom solid (rows=40)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = WOMENKIDS_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = WOMENKIDS_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('play plaza + ped OPD + OB OPD + ultrasound all reachable', () => {
    expect(reachable({ x: 6, y: 20 })).toBe(true); // kids plaza
    expect(reachable({ x: 24, y: 15 })).toBe(true); // pediatric OPD
    expect(reachable({ x: 4, y: 34 })).toBe(true); // OB/GYN OPD
    expect(reachable({ x: 24, y: 30 })).toBe(true); // ultrasound
  });

  test('solid objects block (clinic reception + exam bed + fetal monitor)', () => {
    expect(canEnter({ x: 2, y: 3 }, grid, blocked)).toBe(false); // ClinicReception 5×2
    expect(canEnter({ x: 15, y: 12 }, grid, blocked)).toBe(false); // exam bed 2×3
    expect(canEnter({ x: 5, y: 28 }, grid, blocked)).toBe(false); // FetalMonitor 2×2
  });
});
