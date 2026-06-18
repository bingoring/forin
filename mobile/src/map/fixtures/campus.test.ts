// Guards the campus layout: flagship landmark footprints must not overlap each
// other, and the player start + plaza must stay reachable around them.
import { CAMPUS_INTERIOR } from './campus';
import { buildBlocked, canEnter, findPath } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Bounds } from '@engine/coords';

const grid = { ...CAMPUS_INTERIOR, collision: [...CAMPUS_INTERIOR.collision, ...objectCollision(CAMPUS_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start = CAMPUS_INTERIOR.playerStart;

const overlaps = (a: Bounds, b: Bounds) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

describe('campus layout', () => {
  test('flagship landmark footprints do not overlap', () => {
    const fps = CAMPUS_INTERIOR.objects
      .filter((o) => o.type === 'landmark')
      .map((o) => ({ x: o.x, y: o.y, w: o.props!.w as number, h: o.props!.h as number }));
    expect(fps.length).toBe(4);
    for (let i = 0; i < fps.length; i++) {
      for (let j = i + 1; j < fps.length; j++) {
        expect(overlaps(fps[i], fps[j])).toBe(false);
      }
    }
  });

  test('player start is open and the plaza corridors are reachable', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
    // each gap between adjacent landmarks (x7, x13, x19, row 6) stays walkable
    for (const c of [{ x: 7, y: 4 }, { x: 13, y: 4 }, { x: 19, y: 4 }]) {
      expect(canEnter(c, grid, blocked)).toBe(true);
      expect(findPath(start, c, grid, blocked).length).toBeGreaterThan(0);
    }
  });
});
