// Department-themed checkerboard floor. A single base fill plus the alternate
// checker squares as an overlay (memoized — never rebuilt on player movement).
// For larger outdoor maps (5c) this should move to a prebaked/culled layer; the
// interior grids are small enough to render directly.
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { TILE } from './coords';

const THEMES: Record<string, [string, string]> = {
  clinical: ['#F4FAFB', '#E7F1F3'],
  ward: ['#FBF7F0', '#F1EADD'],
  default: ['#FFFBF0', '#F3EEDF'],
};

function TileFloorBase({
  cols,
  rows,
  theme,
}: {
  cols: number;
  rows: number;
  theme: string;
}) {
  const [base, alt] = THEMES[theme] ?? THEMES.default;

  const squares = useMemo(() => {
    const out: { key: string; left: number; top: number }[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if ((x + y) % 2 === 0) out.push({ key: `${x},${y}`, left: x * TILE, top: y * TILE });
      }
    }
    return out;
  }, [cols, rows]);

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: cols * TILE,
        height: rows * TILE,
        backgroundColor: base,
      }}
    >
      {squares.map((s) => (
        <View
          key={s.key}
          style={{ position: 'absolute', left: s.left, top: s.top, width: TILE, height: TILE, backgroundColor: alt }}
        />
      ))}
    </View>
  );
}

export const TileFloor = memo(TileFloorBase);
