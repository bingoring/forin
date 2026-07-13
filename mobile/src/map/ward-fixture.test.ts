// Guards the authored Internal-Medicine Ward master blueprint (5g-f): with
// structural walls + curtain dividers + object footprints, every room must be
// reachable, thresholds walkable, curtains block yet each 4-bed bay stays
// reachable, and solid objects block. Collision bugs are invisible on screen.
import { WARD_INTERIOR } from './fixtures/ward';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...WARD_INTERIOR, collision: [...WARD_INTERIOR.collision, ...objectCollision(WARD_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = WARD_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Internal Medicine Ward master blueprint', () => {
  test('player start (nursing station) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (bottom 캠퍼스 door, private side) is open + reachable', () => {
    expect(canEnter({ x: 12, y: 50 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 12, y: 50 })).toBe(true);
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = WARD_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = WARD_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('4-bed curtains block, yet all four beds are reachable', () => {
    expect(canEnter({ x: 8, y: 25 }, grid, blocked)).toBe(false); // curtain 1
    expect(canEnter({ x: 16, y: 25 }, grid, blocked)).toBe(false); // curtain 2
    // an open tile in front of each bed bay is reachable
    expect(reachable({ x: 4, y: 27 })).toBe(true); // bay A
    expect(reachable({ x: 11, y: 27 })).toBe(true); // bay B
    expect(reachable({ x: 19, y: 27 })).toBe(true); // bay C
    expect(reachable({ x: 25, y: 27 })).toBe(true); // bay D
  });

  test('private | isolation divider (x13) blocks; both rooms reachable', () => {
    expect(canEnter({ x: 13, y: 44 }, grid, blocked)).toBe(false); // divider wall
    expect(reachable({ x: 6, y: 44 })).toBe(true); // 1인실
    expect(reachable({ x: 21, y: 44 })).toBe(true); // VRE 격리실
  });

  test('solid ward objects block (ward bed + sluice sink + isolation cart)', () => {
    expect(canEnter({ x: 9, y: 24 }, grid, blocked)).toBe(false); // bed B (2×3)
    expect(canEnter({ x: 19, y: 3 }, grid, blocked)).toBe(false); // sluice sink 2×2
    expect(canEnter({ x: 15, y: 37 }, grid, blocked)).toBe(false); // isolation cart 2×2
  });
});
