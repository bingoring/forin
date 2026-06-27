import { buildBlocked, canEnter, findPath, nearestOpen, tileKey, GridLike } from '@engine/collision';
import { Coord } from '@engine/coords';

// 5x5 grid with a wall across y=2, leaving a doorway at x=4.
const walled: GridLike = {
  cols: 5,
  rows: 5,
  collision: [{ x: 0, y: 2, w: 4, h: 1 }],
};

function isAdjacent(a: Coord, b: Coord): boolean {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

describe('collision', () => {
  test('buildBlocked expands rectangles into tile keys', () => {
    const blocked = buildBlocked(walled);
    expect(blocked.has(tileKey(0, 2))).toBe(true);
    expect(blocked.has(tileKey(3, 2))).toBe(true);
    expect(blocked.has(tileKey(4, 2))).toBe(false); // doorway
    expect(blocked.size).toBe(4);
  });

  test('buildBlocked tolerates missing collision', () => {
    expect(buildBlocked({ cols: 3, rows: 3 }).size).toBe(0);
  });

  test('nearestOpen returns the target when open, else the closest walkable tile', () => {
    const blocked = buildBlocked(walled);
    expect(nearestOpen({ x: 1, y: 0 }, walled, blocked)).toEqual({ x: 1, y: 0 }); // already open
    // (2,2) is a wall → nearest open is one ring out and walkable
    const near = nearestOpen({ x: 2, y: 2 }, walled, blocked)!;
    expect(canEnter(near, walled, blocked)).toBe(true);
    expect(Math.max(Math.abs(near.x - 2), Math.abs(near.y - 2))).toBe(1);
  });

  test('canEnter rejects out-of-bounds and blocked tiles', () => {
    const blocked = buildBlocked(walled);
    expect(canEnter({ x: -1, y: 0 }, walled, blocked)).toBe(false);
    expect(canEnter({ x: 5, y: 0 }, walled, blocked)).toBe(false);
    expect(canEnter({ x: 2, y: 2 }, walled, blocked)).toBe(false); // wall
    expect(canEnter({ x: 4, y: 2 }, walled, blocked)).toBe(true); // door
    expect(canEnter({ x: 0, y: 0 }, walled, blocked)).toBe(true);
  });

  test('findPath routes through the doorway', () => {
    const blocked = buildBlocked(walled);
    const path = findPath({ x: 0, y: 0 }, { x: 0, y: 4 }, walled, blocked);

    expect(path.length).toBeGreaterThan(0);
    expect(path[path.length - 1]).toEqual({ x: 0, y: 4 }); // ends at target
    // every step is adjacent to the previous and walkable
    let prev = { x: 0, y: 0 };
    for (const node of path) {
      expect(isAdjacent(prev, node)).toBe(true);
      expect(canEnter(node, walled, blocked)).toBe(true);
      prev = node;
    }
    // it must use the door at (4,2)
    expect(path.some((c) => c.x === 4 && c.y === 2)).toBe(true);
  });

  test('findPath returns [] when target is unreachable', () => {
    const sealed: GridLike = { cols: 5, rows: 5, collision: [{ x: 0, y: 2, w: 5, h: 1 }] };
    const blocked = buildBlocked(sealed);
    expect(findPath({ x: 0, y: 0 }, { x: 0, y: 4 }, sealed, blocked)).toEqual([]);
  });

  test('findPath returns [] for a blocked or same target', () => {
    const blocked = buildBlocked(walled);
    expect(findPath({ x: 0, y: 0 }, { x: 2, y: 2 }, walled, blocked)).toEqual([]);
    expect(findPath({ x: 0, y: 0 }, { x: 0, y: 0 }, walled, blocked)).toEqual([]);
  });
});
