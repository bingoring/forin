// Guards the authored Endoscopy Suite master blueprint (5g-q, v16): check-in +
// prep/recovery bays + central reprocessing core + two procedure rooms. Every zone
// reachable, thresholds walkable, dividers block, and solid objects (procedure bed +
// endo tower + scope washer) block.
import { ENDO_INTERIOR } from './fixtures/endo';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...ENDO_INTERIOR, collision: [...ENDO_INTERIOR.collision, ...objectCollision(ENDO_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = ENDO_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Endoscopy Suite master blueprint', () => {
  test('player start (check-in by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 8 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 8 })).toBe(true);
    expect(canEnter({ x: 13, y: 43 }, grid, blocked)).toBe(false); // bottom solid (rows=44)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = ENDO_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = ENDO_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('prep + reproc + both procedure rooms reachable', () => {
    expect(reachable({ x: 5, y: 15 })).toBe(true); // prep/recovery
    expect(reachable({ x: 20, y: 22 })).toBe(true); // reprocessing
    expect(reachable({ x: 6, y: 34 })).toBe(true); // procedure suite 1
    expect(reachable({ x: 20, y: 34 })).toBe(true); // procedure suite 2
  });

  test('solid endo objects block (procedure bed + endo tower + scope washer)', () => {
    expect(canEnter({ x: 2, y: 31 }, grid, blocked)).toBe(false); // ProcedureBed 3×1
    expect(canEnter({ x: 2, y: 37 }, grid, blocked)).toBe(false); // EndoTower 2×1
    expect(canEnter({ x: 14, y: 13 }, grid, blocked)).toBe(false); // ScopeWasher 2×1
  });
});
