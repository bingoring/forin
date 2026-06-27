// Walkability + pathfinding over the authored collision layer. Pure & unit-tested.
//
// The interior content carries a `collision` list of blocked tile rectangles
// (authored on the server, e.g. walls, furniture). We expand those into a set of
// blocked tiles once, then test entry against the set plus the map border.

import { Coord, Bounds, DIRS, step } from './coords';

export interface GridLike {
  cols: number;
  rows: number;
  collision?: Bounds[];
}

export function tileKey(x: number, y: number): string {
  return `${x},${y}`;
}

/** Expand the authored collision rectangles into a set of blocked tile keys. */
export function buildBlocked(grid: GridLike): Set<string> {
  const blocked = new Set<string>();
  for (const b of grid.collision ?? []) {
    for (let y = b.y; y < b.y + b.h; y++) {
      for (let x = b.x; x < b.x + b.w; x++) {
        blocked.add(tileKey(x, y));
      }
    }
  }
  return blocked;
}

/** Whether the player may stand on a tile: inside the grid and not blocked. */
export function canEnter(c: Coord, grid: GridLike, blocked: Set<string>): boolean {
  if (c.x < 0 || c.y < 0 || c.x >= grid.cols || c.y >= grid.rows) return false;
  return !blocked.has(tileKey(c.x, c.y));
}

/** Nearest walkable tile to `target` (the target itself if open), searched in
 * outward rings. Used by fast-travel so a room anchor that sits on furniture
 * still lands the player on an adjacent open tile. Returns null if none within R. */
export function nearestOpen(target: Coord, grid: GridLike, blocked: Set<string>, maxRadius = 6): Coord | null {
  if (canEnter(target, grid, blocked)) return target;
  for (let r = 1; r <= maxRadius; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; // ring only
        const c = { x: target.x + dx, y: target.y + dy };
        if (canEnter(c, grid, blocked)) return c;
      }
    }
  }
  return null;
}

/**
 * Breadth-first shortest path on the 4-connected walkable grid.
 * Returns the steps from `from` (exclusive) to `to` (inclusive), or [] if `to`
 * is unreachable or not walkable. Used by tap-to-walk.
 */
export function findPath(
  from: Coord,
  to: Coord,
  grid: GridLike,
  blocked: Set<string>,
): Coord[] {
  if (!canEnter(to, grid, blocked)) return [];
  if (from.x === to.x && from.y === to.y) return [];

  const start = tileKey(from.x, from.y);
  const goal = tileKey(to.x, to.y);
  const prev = new Map<string, Coord | null>([[start, null]]);
  const queue: Coord[] = [from];

  while (queue.length) {
    const cur = queue.shift()!;
    if (cur.x === to.x && cur.y === to.y) break;
    for (const d of Object.values(DIRS)) {
      const nxt = step(cur, d);
      const k = tileKey(nxt.x, nxt.y);
      if (prev.has(k) || !canEnter(nxt, grid, blocked)) continue;
      prev.set(k, cur);
      queue.push(nxt);
    }
  }

  if (!prev.has(goal)) return [];

  // Reconstruct, then drop the start tile.
  const path: Coord[] = [];
  let node: Coord | null = to;
  while (node) {
    path.push(node);
    node = prev.get(tileKey(node.x, node.y)) ?? null;
  }
  path.reverse();
  return path.slice(1);
}
