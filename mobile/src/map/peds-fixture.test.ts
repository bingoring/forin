// Guards the authored Peds+NICU master blueprint (5g-d): with structural walls +
// the NICU glass partition + object footprints, every room must be reachable,
// thresholds walkable, and solid objects block. Collision bugs are invisible on
// screen.
import { PEDS_INTERIOR } from './fixtures/peds';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...PEDS_INTERIOR, collision: [...PEDS_INTERIOR.collision, ...objectCollision(PEDS_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = PEDS_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Peds master blueprint', () => {
  test('player start (ward entry) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = PEDS_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = PEDS_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('NICU glass wall blocks; the sterile scrub threshold stays walkable', () => {
    // glass partition at x9 (y30-33) blocks
    expect(canEnter({ x: 9, y: 31 }, grid, blocked)).toBe(false);
    // the sterile scrub threshold (x9, y34-36) is walkable
    expect(canEnter({ x: 9, y: 35 }, grid, blocked)).toBe(true);
  });

  test('solid peds objects block (incubator + metal crib footprints)', () => {
    expect(canEnter({ x: 11, y: 35 }, grid, blocked)).toBe(false); // incubator 2×2
    expect(canEnter({ x: 13, y: 23 }, grid, blocked)).toBe(false); // metal crib 2×3
  });

  test('reception desk blocks (clinicReception w6×h2) yet welcome stays reachable', () => {
    expect(canEnter({ x: 15, y: 3 }, grid, blocked)).toBe(false); // desk counter
    expect(reachable({ x: 16, y: 6 })).toBe(true); // lobby in front of the desk
    expect(reachable({ x: 16, y: 1 })).toBe(true); // elevator arrival tile above the desk
  });
});
