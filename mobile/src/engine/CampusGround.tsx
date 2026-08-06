// Outdoor campus ground — a per-tile painted world (roads, sidewalks, stone
// paths, plaza, pond) that the checkerboard TileFloor can't express. Ported from
// the design-handoff screens-explore-v2 Tile legend. Grass is the base fill; only
// non-grass tiles (and grass tufts) render as overlay cells, so a 26×60 world is
// a few hundred Views, not 1,560. Memoized on the map string → built once.
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { TILE } from './coords';

// Palette (design-handoff P) — GBA-era hospital-town tiles.
const P = {
  grassA: '#7DA86B', grassB: '#8FBC7B', grassDark: '#577A4C',
  pathA: '#C9B98A', pathB: '#B8A573', pathLine: '#897852',
  plaza: '#D9CDA4',
  asphalt: '#4A4A52', laneLine: '#E8DCB4',
  water: '#6FA8C7', waterDeep: '#3F86A8', waterEdge: '#5A93B2',
  curb: '#BFB298',
};

type Cell = { key: string; left: number; top: number; ch: string; even: boolean };

function CampusGroundBase({ map }: { map: string[] }) {
  const rows = map.length;
  const cols = map.reduce((m, r) => Math.max(m, r.length), 0);

  const cells = useMemo(() => {
    const out: Cell[] = [];
    for (let y = 0; y < map.length; y++) {
      const row = map[y];
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === 'g') continue; // plain grass = container background
        out.push({ key: `${x},${y}`, left: x * TILE, top: y * TILE, ch, even: (x + y) % 2 === 0 });
      }
    }
    return out;
  }, [map]);

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, top: 0, width: cols * TILE, height: rows * TILE, backgroundColor: P.grassA }}
    >
      {cells.map((c) => (
        <GroundCell key={c.key} left={c.left} top={c.top} ch={c.ch} even={c.even} />
      ))}
    </View>
  );
}

function GroundCell({ left, top, ch, even }: { left: number; top: number; ch: string; even: boolean }) {
  const base = { position: 'absolute' as const, left, top, width: TILE, height: TILE };
  switch (ch) {
    case 'G': // grass with a small tuft
      return (
        <View style={{ ...base, backgroundColor: P.grassB }}>
          <View style={{ position: 'absolute', left: TILE * 0.25, bottom: TILE * 0.2, width: 3, height: 5, backgroundColor: P.grassDark }} />
          <View style={{ position: 'absolute', right: TILE * 0.28, top: TILE * 0.3, width: 2, height: 4, backgroundColor: P.grassDark }} />
        </View>
      );
    case 'p': // stone path A
      return <View style={{ ...base, backgroundColor: P.pathA, borderRightWidth: 1, borderBottomWidth: 1, borderColor: P.pathLine + '55' }} />;
    case 'P': // stone path B (darker grout)
      return <View style={{ ...base, backgroundColor: P.pathB, borderRightWidth: 1, borderBottomWidth: 1, borderColor: P.pathLine + '55' }} />;
    case 'z': // plaza (open lighter stone)
      return <View style={{ ...base, backgroundColor: P.plaza, borderRightWidth: 1, borderBottomWidth: 1, borderColor: P.pathLine + '33' }} />;
    case 'r': // road asphalt
      return <View style={{ ...base, backgroundColor: P.asphalt }} />;
    case 'l': // road with centre lane stripe
      return (
        <View style={{ ...base, backgroundColor: P.asphalt }}>
          <View style={{ position: 'absolute', left: TILE * 0.28, top: TILE * 0.34, width: TILE * 0.44, height: 4, backgroundColor: P.laneLine }} />
        </View>
      );
    case 'c': // curb / sidewalk
      return <View style={{ ...base, backgroundColor: P.curb, borderTopWidth: 2, borderBottomWidth: 2, borderColor: P.pathLine }} />;
    case 'w': // pond water (labelled pond in the handoff; lily pads sit on it)
      return (
        <View style={{ ...base, backgroundColor: even ? P.water : P.waterDeep }}>
          <View style={{ position: 'absolute', left: 2, top: TILE * 0.3, width: TILE * 0.5, height: 2, backgroundColor: '#FFFFFF', opacity: 0.25 }} />
        </View>
      );
    default:
      return <View style={{ ...base, backgroundColor: P.grassA }} />;
  }
}

export const CampusGround = memo(CampusGroundBase);
