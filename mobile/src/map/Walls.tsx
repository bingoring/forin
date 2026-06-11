// Visible walls for the interior — renders the authored collision rectangles as
// chunky pixel walls (style from design-handoff interior palette IWall). Doorway
// gaps in the collision layer read as openings. Object tiles are skipped (the
// object art sits there instead). Without this the collision is invisible.
import { View } from 'react-native';
import { TILE, type Bounds } from './coords';
import { tileKey } from './collision';

const WALL = '#C8C0A8';
const WALL_TOP = '#8E8460';
const WALL_SIDE = '#BFB294';
const WALL_SHADOW = '#5C523A';

export function Walls({
  collision,
  objectTiles,
}: {
  collision: Bounds[];
  objectTiles: Set<string>;
}) {
  return (
    <>
      {collision.map((b, i) => {
        // Skip a 1×1 block that sits under an object (e.g. bed/monitor) — the
        // object renders there; the tile stays non-walkable either way.
        if (b.w === 1 && b.h === 1 && objectTiles.has(tileKey(b.x, b.y))) return null;
        return (
          <View
            key={i}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: b.x * TILE,
              top: b.y * TILE,
              width: b.w * TILE,
              height: b.h * TILE,
              backgroundColor: WALL,
              borderTopWidth: 3,
              borderTopColor: WALL_TOP,
              borderLeftWidth: 2,
              borderLeftColor: WALL_SIDE,
              borderRightWidth: 2,
              borderRightColor: WALL_SHADOW,
              borderBottomWidth: 2,
              borderBottomColor: WALL_SHADOW,
            }}
          />
        );
      })}
    </>
  );
}
