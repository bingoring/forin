// Labor & Delivery objects — RN-svg ports of the obstetric-specific pieces from
// interior-objects-ld2.jsx that weren't needed by the nursery/OPD ports:
// BirthingBed (delivery table w/ stirrups) + DeliveryCart (instrument cart). The
// rest of the L&D catalog (Bassinet/InfantWarmer/NursingRecliner/WarmerCabinet/
// FetalMonitor) already lives in nurseryEquipment.tsx / womenkidsEquipment.tsx and
// resolves on the shared chain. Authored at ITILE=16, rendered at TILE px via S;
// Box maps handoff x*ITILE / top-N offsets 1:1. v13+ 2.5D ground shadow.
import { type ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;

function Box({ x, y, offX = 0, offY = 0, w, h, z, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; z?: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S, zIndex: z }}>{children}</View>
  );
}

// ─── BirthingBed — 분만대 (다리 거치대 stirrups + 등받이 각도) ─────────
export function BirthingBed({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={48} h={42}>
      <Svg viewBox="0 0 48 42" width={48 * S} height={42 * S}>
        <Ellipse cx={24} cy={40} rx={20} ry={2.6} fill="rgba(0,0,0,0.16)" />
        <Path d="M4 6 L44 6 L44 33 Q44 35 42 35 L6 35 Q4 35 4 33 Z" fill="#C9DCE6" stroke={C} strokeWidth={0.7} />
        <Rect x={4} y={6} width={40} height={26} fill="#DCE9F0" />
        <Rect x={6} y={7.5} width={36} height={9} rx={1.5} fill="#B7D0DC" stroke={C} strokeWidth={0.4} />
        <Rect x={7} y={9} width={34} height={1.4} fill="#CFE0E8" />
        <Rect x={12} y={24} width={24} height={8} fill="#EAF2F6" />
        <Path d="M20 32 Q24 27 28 32 Z" fill="#B7D0DC" />
        <Path d="M8 33 L2 40" stroke="#8A929B" strokeWidth={2.2} strokeLinecap="round" />
        <Circle cx={2} cy={40} r={2.2} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Path d="M40 33 L46 40" stroke="#8A929B" strokeWidth={2.2} strokeLinecap="round" />
        <Circle cx={46} cy={40} r={2.2} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Line x1={4} y1={33} x2={44} y2={33} stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={16} width={1.6} height={12} rx={0.8} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={43.4} y={16} width={1.6} height={12} rx={0.8} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

// ─── DeliveryCart — 분만 기구 카트 (겸자·클램프·트레이 + 2단 서랍) ──────
export function DeliveryCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={24} h={30}>
      <Svg viewBox="0 0 24 30" width={24 * S} height={30 * S}>
        <Ellipse cx={12} cy={28.5} rx={8} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 8 L22 8 L22 25 Q22 26 21 26 L3 26 Q2 26 2 25 Z" fill="#9BA2AB" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={2} width={20} height={6} rx={1} fill="#B7BEC6" stroke={C} strokeWidth={0.5} />
        <Rect x={4} y={3} width={16} height={4} fill="#A5D8E8" />
        <Rect x={5} y={3.6} width={7} height={1} fill="#9CA3AF" />
        <Rect x={5} y={5} width={5} height={1} fill="#9CA3AF" />
        <Rect x={14} y={3.6} width={1} height={3} fill="#9CA3AF" />
        <Line x1={2} y1={8} x2={22} y2={8} stroke={C} strokeWidth={0.5} />
        <Rect x={4} y={10} width={16} height={6} rx={0.5} fill="#E1E5EA" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={17} width={16} height={6} rx={0.5} fill="#E1E5EA" stroke={C} strokeWidth={0.4} />
        <Rect x={10} y={12.5} width={4} height={1.2} fill="#9AA1A8" />
        <Rect x={10} y={19.5} width={4} height={1.2} fill="#9AA1A8" />
        <Ellipse cx={5} cy={27.5} rx={1.8} ry={1.3} fill={C} />
        <Ellipse cx={19} cy={27.5} rx={1.8} ry={1.3} fill={C} />
      </Svg>
    </Box>
  );
}

export function LdObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y } = object;
  switch (type) {
    case 'birthingbed': return <BirthingBed x={x} y={y} />;
    case 'deliverycart': return <DeliveryCart x={x} y={y} />;
    default: return null;
  }
}
