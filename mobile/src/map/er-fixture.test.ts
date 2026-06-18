// Guards the authored ER layout: with structural walls + object footprints, the
// player must still reach the key tiles, doors must stay walkable, and object
// footprints must block. Collision bugs are invisible on screen, so test them.
import { ER_INTERIOR } from './fixtures/er';
import { buildBlocked, canEnter, findPath } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Coord } from '@engine/coords';

const grid = { ...ER_INTERIOR, collision: [...ER_INTERIOR.collision, ...objectCollision(ER_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start: Coord = ER_INTERIOR.playerStart;

const reachable = (c: Coord) => findPath(start, c, grid, blocked).length > 0;

describe('ER fixture layout', () => {
  test('player can reach the chest-pain hotspot (via the adjacent open tile)', () => {
    // hotspot is at (4,4) which sits under the bed footprint; the nurse stands
    // at (3,4) to its left, which must be reachable.
    expect(canEnter({ x: 3, y: 4 }, grid, blocked)).toBe(true);
    expect(reachable({ x: 3, y: 4 })).toBe(true);
  });

  test('player can cross from the corridor into trauma and triage', () => {
    expect(reachable({ x: 17, y: 4 })).toBe(true); // trauma region
    expect(reachable({ x: 3, y: 6 })).toBe(true); // triage region (past the divider door)
  });

  test('doors are walkable openings', () => {
    expect(canEnter({ x: 12, y: 9 }, grid, blocked)).toBe(true); // room↔corridor
    expect(canEnter({ x: 11, y: 8 }, grid, blocked)).toBe(true); // triage↔trauma
  });

  test('solid object footprints are blocked', () => {
    expect(canEnter({ x: 4, y: 3 }, grid, blocked)).toBe(false); // bed
    expect(canEnter({ x: 5, y: 5 }, grid, blocked)).toBe(false); // bed (2×3 footprint)
    expect(canEnter({ x: 6, y: 4 }, grid, blocked)).toBe(false); // monitor (1×2)
    expect(canEnter({ x: 6, y: 7 }, grid, blocked)).toBe(false); // reception (2×1)
  });
});
