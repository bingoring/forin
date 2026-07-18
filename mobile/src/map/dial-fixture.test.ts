// Guards the authored Hemodialysis Unit master blueprint (5g-r, v16): check-in/weigh
// + open dialysis floor (chair+machine rows around a nursing island) + RO water room
// + isolation station. Every zone reachable, thresholds walkable, and solid objects
// (dialysis chair + machine + RO unit) block.
import { DIAL_INTERIOR } from './fixtures/dial';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...DIAL_INTERIOR, collision: [...DIAL_INTERIOR.collision, ...objectCollision(DIAL_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = DIAL_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Hemodialysis Unit master blueprint', () => {
  test('player start (check-in by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 8 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 8 })).toBe(true);
    expect(canEnter({ x: 13, y: 43 }, grid, blocked)).toBe(false); // bottom solid (rows=44)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = DIAL_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = DIAL_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('dialysis floor + RO water room + isolation station reachable', () => {
    expect(reachable({ x: 13, y: 24 })).toBe(true); // open floor / nursing island edge
    expect(reachable({ x: 6, y: 41 })).toBe(true); // RO water room
    expect(reachable({ x: 21, y: 40 })).toBe(true); // isolation station
  });

  test('solid dialysis objects block (chair + machine + RO unit)', () => {
    expect(canEnter({ x: 2, y: 13 }, grid, blocked)).toBe(false); // DialysisChair 2×2
    expect(canEnter({ x: 6, y: 13 }, grid, blocked)).toBe(false); // DialysisMachine 1×1
    expect(canEnter({ x: 2, y: 38 }, grid, blocked)).toBe(false); // ROWaterUnit 2×2
  });
});
