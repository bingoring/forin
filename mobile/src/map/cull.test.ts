import { viewBounds, boxInView } from '@engine/cull';

describe('viewport culling', () => {
  // 384×640 viewport, TILE 32, scale 1 → 12×20 visible tiles, +4 margin each side
  const v = viewBounds(20, 20, 384, 640, 1, 32, 4);

  test('bounds span the visible window + margin around the center', () => {
    expect(v.x0).toBe(20 - 6 - 4); // 12 across → ±6, +4 margin
    expect(v.x1).toBe(20 + 6 + 4);
    expect(v.y0).toBe(20 - 10 - 4); // 20 down → ±10, +4 margin
    expect(v.y1).toBe(20 + 10 + 4);
  });

  test('a box at the center is visible; a far box is culled', () => {
    expect(boxInView(20, 20, 1, 1, v)).toBe(true);
    expect(boxInView(0, 0, 1, 1, v)).toBe(false); // top-left corner of a big map
    expect(boxInView(39, 59, 1, 1, v)).toBe(false);
  });

  test('a tall object just off the bottom still counts if its box reaches in', () => {
    // object footprint at y36 (below view y1=34) but 4 tall + rises up → overlaps
    expect(boxInView(20, 30, 2, 6, v)).toBe(true);
    expect(boxInView(20, 40, 2, 2, v)).toBe(false); // genuinely far below
  });

  test('zooming out (scale<1) widens the visible window', () => {
    const out = viewBounds(20, 20, 384, 640, 0.5, 32, 4);
    expect(out.x1 - out.x0).toBeGreaterThan(v.x1 - v.x0);
  });
});
