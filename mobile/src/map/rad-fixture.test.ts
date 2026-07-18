// Guards the authored Radiology master blueprint (5g-p, v16): check-in + dark PACS
// reading room + central corridor + CT/MRI/X-ray suites (each with a glass control
// booth). Every zone reachable, thresholds walkable, control-booth glass blocks, and
// solid scanners (CT + MRI + X-ray) block.
import { RAD_INTERIOR } from './fixtures/rad';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...RAD_INTERIOR, collision: [...RAD_INTERIOR.collision, ...objectCollision(RAD_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = RAD_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Radiology master blueprint', () => {
  test('player start (central corridor by the ← door) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (left ← door) is open + reachable; bottom wall solid', () => {
    expect(canEnter({ x: 1, y: 14 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 1, y: 14 })).toBe(true);
    expect(canEnter({ x: 13, y: 47 }, grid, blocked)).toBe(false); // bottom solid (rows=48)
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = RAD_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = RAD_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('all imaging suites + reading room reachable; control-booth glass blocks', () => {
    expect(reachable({ x: 20, y: 5 })).toBe(true); // PACS reading room
    expect(reachable({ x: 6, y: 25 })).toBe(true); // CT suite
    expect(reachable({ x: 20, y: 25 })).toBe(true); // MRI suite
    expect(reachable({ x: 6, y: 40 })).toBe(true); // X-ray suite
    expect(canEnter({ x: 11, y: 22 }, grid, blocked)).toBe(false); // CT booth glass
  });

  test('solid scanners block (CT + MRI + X-ray)', () => {
    expect(canEnter({ x: 2, y: 21 }, grid, blocked)).toBe(false); // CTScanner 3×3
    expect(canEnter({ x: 14, y: 21 }, grid, blocked)).toBe(false); // MRIScanner 4×3
    expect(canEnter({ x: 4, y: 33 }, grid, blocked)).toBe(false); // XrayUnit 2×2
  });
});
