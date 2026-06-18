// Visible structural walls — renders the authored collision rectangles as chunky
// pixel walls (style from the design-handoff interior palette IWall). Doorway gaps
// in the collision layer read as openings (a Door object is drawn over them).
// Object footprints are NOT in this layer (they block via objectCollision), so
// every rect here is a real wall.
import { View } from 'react-native';
import { TILE, type Bounds } from './coords';

const WALL = '#C8C0A8';
const WALL_TOP = '#8E8460';
const WALL_SIDE = '#BFB294';
const WALL_SHADOW = '#5C523A';

export function Walls({ collision }: { collision: Bounds[] }) {
  return (
    <>
      {collision.map((b, i) => (
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
      ))}
    </>
  );
}
