// Which named region the player currently stands in. Pure & unit-tested.
// Drives the region badge and the room mask ("only this room lit").

import { Coord, Bounds, inBounds } from './coords';

export interface RegionLike {
  id: string;
  name: string;
  icon?: string;
  bounds: Bounds;
}

/** First region whose bounds contain the coordinate, or null (corridor). */
export function regionAt<R extends RegionLike>(c: Coord, regions: R[]): R | null {
  for (const r of regions) {
    if (inBounds(c, r.bounds)) return r;
  }
  return null;
}
