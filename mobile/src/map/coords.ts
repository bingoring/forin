// Tile coordinate math for the interior/exploration engine. Pure & unit-tested
// (collision bugs aren't visible on screen, so this layer must be covered by tests).
//
// Source art is authored at ITILE px/tile; we render at ZOOM, so one tile is
// TILE = ITILE * ZOOM screen pixels. Map positions are in *tiles*; pixels are
// derived only at render time.

export const ITILE = 16; // source tile size (px)
export const ZOOM = 2; // render scale
export const TILE = ITILE * ZOOM; // 32 screen px per tile

export interface Coord {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Dir = 'up' | 'down' | 'left' | 'right';

export const DIRS: Record<Dir, Coord> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/** Top-left screen pixel of a tile coordinate. */
export function coordToPx(c: Coord): { left: number; top: number } {
  return { left: c.x * TILE, top: c.y * TILE };
}

/** One step from `c` in direction `dir` (does not check walkability). */
export function step(c: Coord, dir: Coord): Coord {
  return { x: c.x + dir.x, y: c.y + dir.y };
}

/** Clamp a coordinate into the [0, cols-1] × [0, rows-1] grid. */
export function clampToGrid(c: Coord, cols: number, rows: number): Coord {
  return {
    x: Math.max(0, Math.min(cols - 1, c.x)),
    y: Math.max(0, Math.min(rows - 1, c.y)),
  };
}

/** Whether a coordinate lies inside a bounds rectangle (half-open on w/h). */
export function inBounds(c: Coord, b: Bounds): boolean {
  return c.x >= b.x && c.x < b.x + b.w && c.y >= b.y && c.y < b.y + b.h;
}

export function sameCoord(a: Coord, b: Coord): boolean {
  return a.x === b.x && a.y === b.y;
}

/** Facing implied by a single-tile move from `a` to `b`. */
export function dirBetween(a: Coord, b: Coord): Dir {
  if (b.x > a.x) return 'right';
  if (b.x < a.x) return 'left';
  if (b.y < a.y) return 'up';
  return 'down';
}
