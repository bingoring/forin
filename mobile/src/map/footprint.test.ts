// Guards which object types contribute collision (5f-iii primitives).
import { objectCollision } from '@engine/footprint';
import type { MapObject } from '@engine';

const o = (type: string, props?: Record<string, unknown>): MapObject => ({ id: type, type, x: 2, y: 3, props });

describe('objectCollision — walkable vs blocking types', () => {
  test('doors, thresholds and tints are walkable (no collision)', () => {
    expect(objectCollision([o('door', { w: 2 })])).toHaveLength(0);
    expect(objectCollision([o('threshold', { w: 1, h: 1 })])).toHaveLength(0);
    expect(objectCollision([o('tint', { w: 8, h: 6 })])).toHaveLength(0);
  });

  test('glass walls and sized objects block their footprint', () => {
    expect(objectCollision([o('glass', { w: 1, h: 4 })])).toEqual([{ x: 2, y: 3, w: 1, h: 4 }]);
    expect(objectCollision([o('bed')])).toEqual([{ x: 2, y: 3, w: 2, h: 3 }]); // default footprint
  });
});
