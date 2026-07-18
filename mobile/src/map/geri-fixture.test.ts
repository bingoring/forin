// Guards the authored Geriatric/Dementia Ward master blueprint (5g-v, v16): a
// wandering-safe day common + geriatric nursing station + reminiscence lounge + two
// dementia rooms (low fall-safe beds). Every zone reachable, thresholds walkable,
// dividers block, and solid objects (low bed + geri recliner) block.
import { GERI_INTERIOR } from './fixtures/geri';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...GERI_INTERIOR, collision: [...GERI_INTERIOR.collision, ...objectCollision(GERI_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = GERI_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Geriatric / Dementia Ward master blueprint', () => {
  test('player start (day common by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 8 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 8 })).toBe(true);
    expect(canEnter({ x: 13, y: 43 }, grid, blocked)).toBe(false); // bottom solid (rows=44)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = GERI_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = GERI_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('station + reminiscence + both dementia rooms reachable', () => {
    expect(reachable({ x: 6, y: 16 })).toBe(true); // geriatric station
    expect(reachable({ x: 18, y: 16 })).toBe(true); // reminiscence lounge
    expect(reachable({ x: 6, y: 34 })).toBe(true); // dementia room A
    expect(reachable({ x: 19, y: 34 })).toBe(true); // dementia room B
  });

  test('solid geri objects block (low bed + geri recliner)', () => {
    expect(canEnter({ x: 3, y: 27 }, grid, blocked)).toBe(false); // LowBed 2×3
    expect(canEnter({ x: 12, y: 3 }, grid, blocked)).toBe(false); // GeriReclineChair 2×2
  });
});
