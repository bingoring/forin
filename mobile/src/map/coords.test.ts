import {
  TILE,
  coordToPx,
  step,
  clampToGrid,
  inBounds,
  dirBetween,
  DIRS,
  sameCoord,
} from './coords';

describe('coords', () => {
  test('coordToPx scales tiles to screen pixels', () => {
    expect(coordToPx({ x: 0, y: 0 })).toEqual({ left: 0, top: 0 });
    expect(coordToPx({ x: 3, y: 2 })).toEqual({ left: 3 * TILE, top: 2 * TILE });
  });

  test('step moves one tile in a direction', () => {
    expect(step({ x: 5, y: 5 }, DIRS.up)).toEqual({ x: 5, y: 4 });
    expect(step({ x: 5, y: 5 }, DIRS.right)).toEqual({ x: 6, y: 5 });
  });

  test('clampToGrid keeps coords inside [0, cols-1] x [0, rows-1]', () => {
    expect(clampToGrid({ x: -3, y: 20 }, 24, 18)).toEqual({ x: 0, y: 17 });
    expect(clampToGrid({ x: 100, y: -1 }, 24, 18)).toEqual({ x: 23, y: 0 });
    expect(clampToGrid({ x: 5, y: 5 }, 24, 18)).toEqual({ x: 5, y: 5 });
  });

  test('inBounds is half-open on width/height', () => {
    const b = { x: 1, y: 1, w: 10, h: 8 };
    expect(inBounds({ x: 1, y: 1 }, b)).toBe(true);
    expect(inBounds({ x: 10, y: 8 }, b)).toBe(true); // last inclusive tile
    expect(inBounds({ x: 11, y: 8 }, b)).toBe(false); // x == x+w
    expect(inBounds({ x: 0, y: 1 }, b)).toBe(false);
  });

  test('dirBetween reads facing from a single-tile move', () => {
    expect(dirBetween({ x: 5, y: 5 }, { x: 6, y: 5 })).toBe('right');
    expect(dirBetween({ x: 5, y: 5 }, { x: 4, y: 5 })).toBe('left');
    expect(dirBetween({ x: 5, y: 5 }, { x: 5, y: 4 })).toBe('up');
    expect(dirBetween({ x: 5, y: 5 }, { x: 5, y: 6 })).toBe('down');
  });

  test('sameCoord compares by value', () => {
    expect(sameCoord({ x: 2, y: 3 }, { x: 2, y: 3 })).toBe(true);
    expect(sameCoord({ x: 2, y: 3 }, { x: 2, y: 4 })).toBe(false);
  });
});
