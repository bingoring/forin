// "Current room focus" — gently dims everything outside the active region with
// four panels (top/bottom/left/right of the region bounds). Light dim only, so
// adjacent rooms stay readable (a heavy mask made the big wards look "empty").
// In a corridor (no region) nothing is dimmed.
import { View } from 'react-native';
import { TILE, type Bounds } from './coords';

const DIM = 'rgba(22,17,14,0.2)';

export function RoomMask({ bounds, cols, rows }: { bounds: Bounds | null; cols: number; rows: number }) {
  if (!bounds) return null;

  const W = cols * TILE;
  const top = bounds.y * TILE;
  const bottom = (bounds.y + bounds.h) * TILE;
  const left = bounds.x * TILE;
  const right = (bounds.x + bounds.w) * TILE;

  const panel = (key: string, x: number, y: number, w: number, h: number) =>
    w > 0 && h > 0 ? <View key={key} style={{ position: 'absolute', left: x, top: y, width: w, height: h, backgroundColor: DIM }} /> : null;

  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: W, height: rows * TILE }}>
      {panel('top', 0, 0, W, top)}
      {panel('bottom', 0, bottom, W, rows * TILE - bottom)}
      {panel('left', 0, top, left, bounds.h * TILE)}
      {panel('right', right, top, W - right, bounds.h * TILE)}
    </View>
  );
}
