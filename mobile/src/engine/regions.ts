// Which named region the player currently stands in. Pure & unit-tested.
// Drives the region badge and the room mask ("only this room lit").

import { Coord, Bounds, inBounds } from './coords';

export interface RegionLike {
  id: string;
  name: string;
  icon?: string;
  bounds: Bounds;
}

/** The SMALLEST (most specific) region whose bounds contain the coordinate, or
 * null (corridor). Smallest-area wins so a small enclosed room nested inside a
 * larger region's rectangle (e.g. a locked vault inside the dispensing hall)
 * gets the room focus — instead of the big region shadowing it purely by array
 * order. Ties keep the earlier region. This makes the room mask always resolve
 * to the room you actually stand in, regardless of how regions are listed. */
export function regionAt<R extends RegionLike>(c: Coord, regions: R[]): R | null {
  let best: R | null = null;
  let bestArea = Infinity;
  for (const r of regions) {
    if (!inBounds(c, r.bounds)) continue;
    const area = r.bounds.w * r.bounds.h;
    if (area < bestArea) {
      best = r;
      bestArea = area;
    }
  }
  return best;
}
