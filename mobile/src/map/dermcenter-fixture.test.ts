// Guards the authored Dermatology Center master blueprint (5g-i): with structural
// walls + the exam1|exam2 divider + object footprints, every room must be
// reachable, thresholds walkable, and solid objects block. Collision bugs are
// invisible on screen.
import { DERMCENTER_INTERIOR } from './fixtures/dermcenter';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...DERMCENTER_INTERIOR, collision: [...DERMCENTER_INTERIOR.collision, ...objectCollision(DERMCENTER_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = DERMCENTER_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Dermatology Center master blueprint', () => {
  test('player start (lobby by the ↓ door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (top 캠퍼스 door) is open + reachable', () => {
    expect(canEnter({ x: 14, y: 1 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 14, y: 1 })).toBe(true);
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = DERMCENTER_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = DERMCENTER_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('exam1 | exam2 divider (x13) blocks; both exams reachable', () => {
    expect(canEnter({ x: 13, y: 15 }, grid, blocked)).toBe(false); // divider wall
    expect(reachable({ x: 6, y: 19 })).toBe(true); // exam1
    expect(reachable({ x: 20, y: 19 })).toBe(true); // exam2
  });

  test('solid derm objects block (reception + UV booth + surgical chair)', () => {
    expect(canEnter({ x: 3, y: 3 }, grid, blocked)).toBe(false); // clinic reception 6×2
    expect(canEnter({ x: 3, y: 29 }, grid, blocked)).toBe(false); // UV booth 2×3
    expect(canEnter({ x: 4, y: 42 }, grid, blocked)).toBe(false); // surgical chair (ibed 2×3)
  });
});
