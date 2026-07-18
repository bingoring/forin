// Guards the authored NICU master blueprint (5g-n, v16): sterile anteroom + central
// monitor station + resuscitation bay + two isolette pods (glass-divided). Every
// zone must be reachable, thresholds walkable, the glass pod divider blocks, and
// solid objects (isolette + giraffe warmer) block. Collision bugs are invisible.
import { NICU_INTERIOR } from './fixtures/nicu';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...NICU_INTERIOR, collision: [...NICU_INTERIOR.collision, ...objectCollision(NICU_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = NICU_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('NICU master blueprint', () => {
  test('player start (anteroom by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 6 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 6 })).toBe(true);
    expect(canEnter({ x: 13, y: 43 }, grid, blocked)).toBe(false); // bottom solid (rows=44)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = NICU_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = NICU_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('station + resus + both pods reachable; glass pod divider blocks', () => {
    expect(reachable({ x: 6, y: 16 })).toBe(true); // central station
    expect(reachable({ x: 21, y: 16 })).toBe(true); // resus bay
    expect(reachable({ x: 6, y: 33 })).toBe(true); // pod A
    expect(reachable({ x: 22, y: 30 })).toBe(true); // pod B
    expect(canEnter({ x: 13, y: 30 }, grid, blocked)).toBe(false); // glass pod divider
  });

  test('solid NICU objects block (isolette + giraffe warmer)', () => {
    expect(canEnter({ x: 2, y: 27 }, grid, blocked)).toBe(false); // NICUIsolette 2×2
    expect(canEnter({ x: 16, y: 12 }, grid, blocked)).toBe(false); // GiraffeWarmer 2×2
  });
});
