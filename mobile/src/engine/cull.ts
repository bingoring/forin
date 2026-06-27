// Viewport culling (5f-iii) — pure geometry so large maps (e.g. 40×60) only
// render what's near the camera instead of every object/NPC. The camera centers
// on the player tile, so we derive the visible tile window from the player +
// viewport px + zoom, with a margin for off-screen art that overhangs into view.

export interface ViewRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Visible tile rectangle around a center tile (cx,cy), given the viewport px,
 * camera scale, tile px, and a tile margin. */
export function viewBounds(cx: number, cy: number, vpW: number, vpH: number, scale: number, tile: number, margin = 4): ViewRect {
  const across = vpW / (tile * scale) / 2;
  const down = vpH / (tile * scale) / 2;
  return { x0: cx - across - margin, x1: cx + across + margin, y0: cy - down - margin, y1: cy + down + margin };
}

/** Does a tile box (x,y,w,h) overlap the view rect? */
export function boxInView(x: number, y: number, w: number, h: number, v: ViewRect): boolean {
  return x < v.x1 && x + w > v.x0 && y < v.y1 && y + h > v.y0;
}
