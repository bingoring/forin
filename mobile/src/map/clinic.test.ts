// Guards the generated clinic layout: from the player start, every exam room
// hotspot + the procedure room must be reachable, and section doors walkable.
import { INTERNAL } from './clinic';
import { buildBlocked, canEnter, findPath } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...INTERNAL, collision: [...INTERNAL.collision, ...objectCollision(INTERNAL.objects)] };
const blocked = buildBlocked(grid);
const start = INTERNAL.playerStart;
const reachable = (c: Coord) => findPath(start, c, grid, blocked).length > 0;

describe('clinic layout (internal)', () => {
  test('exam room hotspots are reachable from the entrance', () => {
    for (const h of INTERNAL.hotspots.filter((hs) => hs.kind === 'quest')) {
      // the hotspot tile itself may hold a doctor; assert an adjacent open tile is reachable
      const adj = [
        { x: h.x - 1, y: h.y },
        { x: h.x + 1, y: h.y },
        { x: h.x, y: h.y - 1 },
        { x: h.x, y: h.y + 1 },
      ].filter((c) => canEnter(c, grid, blocked));
      expect(adj.length).toBeGreaterThan(0);
      expect(adj.some(reachable)).toBe(true);
    }
  });

  test('section doors are walkable openings', () => {
    for (const d of [
      { x: 3, y: 8 },
      { x: 10, y: 8 },
      { x: 17, y: 8 },
      { x: 10, y: 16 },
    ]) {
      expect(canEnter(d, grid, blocked)).toBe(true);
    }
  });

  test('the procedure room is reachable', () => {
    expect(reachable({ x: 11, y: 19 })).toBe(true);
  });
});
