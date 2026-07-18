// Guards the authored Sim Lab / Nursing Admin master blueprint (5g-y, v16): nursing-
// admin office + infection-control (PPE) room + debrief classroom + simulation lab +
// one-way-mirror control booth. Every zone reachable, thresholds walkable, dividers
// block, and solid objects (sim manikin + office desk) block.
import { SIM_INTERIOR } from './fixtures/sim';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...SIM_INTERIOR, collision: [...SIM_INTERIOR.collision, ...objectCollision(SIM_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = SIM_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Sim Lab / Nursing Admin master blueprint', () => {
  test('player start (nursing-admin office by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 8 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 8 })).toBe(true);
    expect(canEnter({ x: 13, y: 41 }, grid, blocked)).toBe(false); // bottom solid (rows=42)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = SIM_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = SIM_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('infection + debrief + sim lab + control booth reachable', () => {
    expect(reachable({ x: 6, y: 17 })).toBe(true); // infection control
    expect(reachable({ x: 18, y: 17 })).toBe(true); // debrief classroom
    expect(reachable({ x: 8, y: 34 })).toBe(true); // sim lab
    expect(reachable({ x: 22, y: 34 })).toBe(true); // control booth
  });

  test('solid sim objects block (sim manikin + office desk)', () => {
    expect(canEnter({ x: 2, y: 28 }, grid, blocked)).toBe(false); // SimManikin 2×3
    expect(canEnter({ x: 2, y: 3 }, grid, blocked)).toBe(false); // OfficeDesk 2×1
  });
});
