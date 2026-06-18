// Object footprints — pure (no RN imports) so it's unit-testable and shared by
// the engine (collision) and the renderer (art size).
import type { Bounds } from '../coords';
import type { MapObject } from '../types';

/** Default tile footprint per solid object type. Doors are walkable → omitted.
 * Buildings vary in size, so they take their footprint from props.w/h instead. */
export const OBJECT_FOOTPRINT: Record<string, { w: number; h: number }> = {
  bed: { w: 2, h: 3 },
  monitor: { w: 1, h: 2 },
  reception: { w: 2, h: 1 },
  tree: { w: 1, h: 1 }, // trunk tile only; the canopy overhangs (walkable)
};

/** Blocked rectangles contributed by solid objects (doors are walkable → skipped).
 * An object with explicit props.w/props.h (e.g. a building) blocks that rect. */
export function objectCollision(objects: MapObject[]): Bounds[] {
  const out: Bounds[] = [];
  for (const o of objects) {
    if (o.type === 'door') continue;
    const pw = o.props?.w;
    const ph = o.props?.h;
    if (typeof pw === 'number' && typeof ph === 'number') {
      out.push({ x: o.x, y: o.y, w: pw, h: ph });
      continue;
    }
    const fp = OBJECT_FOOTPRINT[o.type];
    if (fp) out.push({ x: o.x, y: o.y, w: fp.w, h: fp.h });
  }
  return out;
}
