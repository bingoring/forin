// Guards the v20 campus layout (design-handoff screens-explore-v2 port): the
// building footprints must not overlap, the ground grid must be well-formed, and
// every clinical front-door hotspot must sit on walkable ground reachable from
// the player's spawn.
import { CAMPUS_INTERIOR } from './campus';
import { buildBlocked, canEnter, findPath } from '@engine/collision';
import { objectCollision } from '@engine/footprint';
import type { Bounds } from '@engine/coords';

const grid = { ...CAMPUS_INTERIOR, collision: [...CAMPUS_INTERIOR.collision, ...objectCollision(CAMPUS_INTERIOR.objects)] };
const blocked = buildBlocked(grid);
const start = CAMPUS_INTERIOR.playerStart;

const overlaps = (a: Bounds, b: Bounds) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

describe('campus layout (v20 — handoff GBA campus)', () => {
  test('ground grid matches declared dimensions', () => {
    expect(CAMPUS_INTERIOR.groundMap).toBeDefined();
    expect(CAMPUS_INTERIOR.groundMap!.length).toBe(CAMPUS_INTERIOR.rows);
    for (const row of CAMPUS_INTERIOR.groundMap!) expect(row.length).toBe(CAMPUS_INTERIOR.cols);
  });

  test('building footprints do not overlap', () => {
    const fps = CAMPUS_INTERIOR.objects
      .filter((o) => o.type === 'cbuilding')
      .map((o) => ({ x: o.x, y: o.y, w: o.props!.w as number, h: o.props!.h as number }));
    expect(fps.length).toBe(16);
    for (let i = 0; i < fps.length; i++) {
      for (let j = i + 1; j < fps.length; j++) {
        expect(overlaps(fps[i], fps[j])).toBe(false);
      }
    }
  });

  test('player start is open ground', () => {
    expect(canEnter(start, grid, blocked)).toBe(true);
  });

  test('every front-door hotspot is walkable + reachable, with a valid target', () => {
    expect(CAMPUS_INTERIOR.hotspots.length).toBeGreaterThanOrEqual(10);
    for (const h of CAMPUS_INTERIOR.hotspots) {
      // elevator hotspots name a building; portals name a target interior
      if (h.kind === 'elevator') expect(h.building).toBeTruthy();
      if (h.kind === 'portal') expect(h.target).toBeTruthy();
      expect(canEnter({ x: h.x, y: h.y }, grid, blocked)).toBe(true);
      expect(findPath(start, { x: h.x, y: h.y }, grid, blocked).length).toBeGreaterThan(0);
    }
  });
});
