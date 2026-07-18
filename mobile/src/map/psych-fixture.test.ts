// Guards the authored Inpatient Psych master blueprint (5g-w, v16): controlled
// sally-port entry + observation nursing station + day room + ligature-safe rooms +
// padded seclusion. Every zone reachable, thresholds walkable, dividers block, and
// solid objects (safe bed + group table) block.
import { PSYCH_INTERIOR } from './fixtures/psych';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...PSYCH_INTERIOR, collision: [...PSYCH_INTERIOR.collision, ...objectCollision(PSYCH_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = PSYCH_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Inpatient Psych master blueprint', () => {
  test('player start (secure entry by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 6 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 6 })).toBe(true);
    expect(canEnter({ x: 13, y: 43 }, grid, blocked)).toBe(false); // bottom solid (rows=44)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = PSYCH_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = PSYCH_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('station + day room (through observation gap) + safe rooms + seclusion reachable', () => {
    expect(reachable({ x: 6, y: 15 })).toBe(true); // observation station
    expect(reachable({ x: 21, y: 15 })).toBe(true); // day room
    expect(reachable({ x: 6, y: 35 })).toBe(true); // safe rooms
    expect(reachable({ x: 21, y: 35 })).toBe(true); // seclusion
  });

  test('solid psych objects block (safe bed + group table)', () => {
    expect(canEnter({ x: 2, y: 27 }, grid, blocked)).toBe(false); // SafeBed 2×3
    expect(canEnter({ x: 15, y: 12 }, grid, blocked)).toBe(false); // GroupTable 2×1
  });
});
