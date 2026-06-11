// Object footprints — pure (no RN imports) so it's unit-testable and shared by
// the engine (collision) and the renderer (art size).
import type { Bounds } from '../coords';
import type { MapObject } from '../types';

/** Tile footprint per solid object type. Doors are walkable → omitted. */
export const OBJECT_FOOTPRINT: Record<string, { w: number; h: number }> = {
  bed: { w: 2, h: 3 },
  monitor: { w: 1, h: 2 },
  reception: { w: 2, h: 1 },
};

/** Blocked rectangles contributed by solid objects (everything except doors). */
export function objectCollision(objects: MapObject[]): Bounds[] {
  const out: Bounds[] = [];
  for (const o of objects) {
    const fp = OBJECT_FOOTPRINT[o.type];
    if (fp) out.push({ x: o.x, y: o.y, w: fp.w, h: fp.h });
  }
  return out;
}
