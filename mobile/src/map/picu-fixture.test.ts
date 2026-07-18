// Guards the authored PICU master blueprint (5g-o, v16): sterile anteroom + central
// monitor hub + three glass-walled single-patient rooms (glass fronts + sliding
// doors). Every zone reachable, thresholds/sliding doors walkable, glass dividers
// block, and solid objects (PICU bed + ped ventilator) block.
import { PICU_INTERIOR } from './fixtures/picu';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...PICU_INTERIOR, collision: [...PICU_INTERIOR.collision, ...objectCollision(PICU_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = PICU_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('PICU master blueprint', () => {
  test('player start (anteroom by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 6 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 6 })).toBe(true);
    expect(canEnter({ x: 13, y: 43 }, grid, blocked)).toBe(false); // bottom solid (rows=44)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = PICU_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = PICU_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('all three glass rooms reachable via sliding doors; glass fronts block', () => {
    expect(reachable({ x: 5, y: 30 })).toBe(true); // PICU 1 (via door x3)
    expect(reachable({ x: 14, y: 30 })).toBe(true); // PICU 2 (via door x12)
    expect(reachable({ x: 23, y: 30 })).toBe(true); // PICU 3 (via door x21)
    expect(canEnter({ x: 1, y: 17 }, grid, blocked)).toBe(false); // glass front
    expect(canEnter({ x: 9, y: 30 }, grid, blocked)).toBe(false); // room 1|2 glass divider
  });

  test('solid PICU objects block (PICU bed + ped ventilator)', () => {
    expect(canEnter({ x: 2, y: 22 }, grid, blocked)).toBe(false); // PICUBed 2×3
    expect(canEnter({ x: 1, y: 30 }, grid, blocked)).toBe(false); // PedVentilator 1×1
  });
});
