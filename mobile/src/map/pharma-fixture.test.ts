// Guards the authored Pharmacy master blueprint (5g-e): with structural walls +
// the ante|cleanroom glass partition + the narcotics-vault alcove + object
// footprints, every room must be reachable, thresholds walkable, and solid
// objects / glass block. Collision bugs are invisible on screen.
import { PHARMA_INTERIOR } from './fixtures/pharma';
import { buildBlocked, canEnter, findPath, nearestOpen } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...PHARMA_INTERIOR, collision: [...PHARMA_INTERIOR.collision, ...objectCollision(PHARMA_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = PHARMA_INTERIOR.playerStart;

const reachable = (c: Coord) => (c.x === start.x && c.y === start.y) || findPath(start, c, grid, blocked).length > 0;

describe('Pharmacy master blueprint', () => {
  test('player start (pick-up window lobby) is open', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('elevator arrival tile (bottom 캠퍼스 door) is open + reachable', () => {
    expect(canEnter({ x: 16, y: 40 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 16, y: 40 })).toBe(true);
  });

  test('every room is reachable (via an open tile near its anchor)', () => {
    const bad = PHARMA_INTERIOR.rooms
      .map((r) => ({ r, open: nearestOpen({ x: r.x, y: r.y }, grid, blocked) }))
      .filter(({ open }) => !open || !reachable(open))
      .map(({ r }) => `${r.id}@${r.x},${r.y}`);
    expect(bad).toEqual([]);
  });

  test('every internal threshold is a walkable opening', () => {
    const unreachable = PHARMA_INTERIOR.objects
      .filter((o) => o.type === 'threshold')
      .filter((o) => !(canEnter({ x: o.x, y: o.y }, grid, blocked) && reachable({ x: o.x, y: o.y })))
      .map((o) => `${o.id}@${o.x},${o.y}`);
    expect(unreachable).toEqual([]);
  });

  test('ante|cleanroom glass blocks; the air-shower threshold stays walkable', () => {
    expect(canEnter({ x: 23, y: 19 }, grid, blocked)).toBe(false); // glass pane
    expect(canEnter({ x: 31, y: 19 }, grid, blocked)).toBe(false); // glass pane
    expect(canEnter({ x: 27, y: 19 }, grid, blocked)).toBe(true); // 에어샤워 threshold
  });

  test('pick-up counter + barrier glass block the behind-counter row', () => {
    expect(canEnter({ x: 5, y: 3 }, grid, blocked)).toBe(false); // glass barrier
    expect(canEnter({ x: 5, y: 4 }, grid, blocked)).toBe(false); // counter
    expect(reachable({ x: 6, y: 9 })).toBe(true); // public lobby in front
  });

  test('solid pharmacy objects block (narcotics vault + ATC footprints)', () => {
    expect(canEnter({ x: 2, y: 32 }, grid, blocked)).toBe(false); // narcotics vault 2×2
    expect(canEnter({ x: 2, y: 16 }, grid, blocked)).toBe(false); // ATC machine 2×2
    expect(reachable({ x: 4, y: 33 })).toBe(true); // vault floor beside it stays reachable
  });
});
