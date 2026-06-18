// Department-themed checkerboard floor. A single base fill plus the alternate
// checker squares as an overlay (memoized — never rebuilt on player movement).
// For larger outdoor maps (5c) this should move to a prebaked/culled layer; the
// interior grids are small enough to render directly.
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { TILE } from './coords';

// Floor tile pairs [base, alt] — from the design-handoff interior palette (IP).
const THEMES: Record<string, [string, string]> = {
  clinical: ['#E8E5D4', '#DAD6C2'], // off-white tile (general)
  sterile: ['#D6E4EC', '#BFD4DE'], // blue-white (OR)
  peds: ['#FDE6BB', '#FAD79A'], // warm yellow (Pediatrics)
  icu: ['#E1E4EC', '#C8CEDA'], // cool gray (ICU)
  pharma: ['#E9DEC0', '#D8C9A4'], // warm beige (Pharmacy)
  grass: ['#CDE7A6', '#BCDF93'], // outdoor campus lawn
  internal: ['#D7E8D0', '#C6DDBB'], // 내과 sage
  surgery: ['#D6E0EC', '#C2D0E0'], // 외과 steel
  ortho: ['#EAE2CE', '#DCD2B8'], // 정형외과 bone
  derm: ['#F2DCE6', '#E8C9D8'], // 피부과 rose
  default: ['#E8E5D4', '#DAD6C2'],
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
