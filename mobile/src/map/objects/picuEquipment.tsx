// PICU objects — RN-svg ports: child-scaled ICU bed (high safety rails + star
// blanket), pediatric ventilator, Broselow color-coded crash cart (from
// interior-objects-picu2.jsx) + a ReclinerDaybed for bedside family presence
// (from interior-objects-hospice2.jsx). Authored at ITILE=16, rendered at TILE px
// via S; Box maps handoff x*ITILE / top-N offsets 1:1. v13+ 2.5D ground shadow.
// Dispatched via PicuObjectView; reused pieces (bankofmonitors/crashcart/iiv/
// imonitor/ireception/gownbox/handsanitizer/sinkor/nursestation/deskphone/glass/
// tint/iplant) resolve on the shared chain.
import { type ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;

function Box({ x, y, offX = 0, offY = 0, w, h, z, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; z?: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S, zIndex: z }}>{children}</View>
  );
}

// ─── PICUBed — 소아 중환자 베드 (높은 안전 사이드레일 + 별 담요) ────────
export function PICUBed({ x, y, occupied }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} offY={-4} w={44} h={52}>
      <Svg viewBox="0 0 44 52" width={44 * S} height={52 * S}>
        <Ellipse cx={22} cy={50} rx={18} ry={2.4} fill="rgba(0,0,0,0.16)" />
        <Path d="M4 3 L40 3 L40 8 L4 8 Z" fill="#B7C0C8" stroke={C} strokeWidth={0.7} />
        <Rect x={5} y={4} width={34} height={1.4} fill="#D2DAE0" />
        <Path d="M4 8 L40 8 L40 44 Q40 46 38 46 L6 46 Q4 46 4 44 Z" fill="#DCE6EC" stroke={C} strokeWidth={0.7} />
        <Rect x={9} y={10} width={26} height={9} rx={3} fill="#FBFAF4" stroke={C} strokeWidth={0.4} />
        <Rect x={5} y={23} width={34} height={21} rx={1.5} fill="#9FC3E8" />
        <Path d="M14 30 l1.2 2.4 2.4 .3 -1.8 1.7 .5 2.4 -2.3 -1.2 -2.3 1.2 .5 -2.4 -1.8 -1.7 2.4 -.3Z" fill="#FBFAF4" opacity={0.85} />
        <Path d="M30 35 l1.2 2.4 2.4 .3 -1.8 1.7 .5 2.4 -2.3 -1.2 -2.3 1.2 .5 -2.4 -1.8 -1.7 2.4 -.3Z" fill="#FBFAF4" opacity={0.6} />
        {occupied && (
          <G>
            <Rect x={19} y={11.5} width={6} height={5.5} rx={2.3} fill="#FBD9C0" stroke={C} strokeWidth={0.3} />
            <Rect x={19.4} y={10.6} width={5.2} height={1.4} fill="#6B4423" />
          </G>
        )}
        <Rect x={3} y={8} width={38} height={2.2} rx={1} fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={43.5} width={38} height={2.2} rx={1} fill="#B7C0C8" stroke={C} strokeWidth={0.4} />
        {[8, 15, 22, 29, 36].map((bx, i) => (<Rect key={i} x={bx} y={10} width={1.1} height={33.5} fill="#9CA3AF" opacity={0.45} />))}
        <Line x1={4} y1={44} x2={40} y2={44} stroke={C} strokeWidth={0.5} />
        <Rect x={5} y={46} width={3} height={3.5} fill="#6B7280" />
        <Rect x={36} y={46} width={3} height={3.5} fill="#6B7280" />
        <Ellipse cx={6.5} cy={49.5} rx={1.8} ry={1.2} fill={C} />
        <Ellipse cx={37.5} cy={49.5} rx={1.8} ry={1.2} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── PedVentilator — 소아용 인공호흡기 (뷰어 향 파형 + 가습 회로) ───────
export function PedVentilator({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-12} w={20} h={42}>
      <Svg viewBox="0 0 20 42" width={20 * S} height={42 * S}>
        <Ellipse cx={10} cy={40.5} rx={7} ry={1.8} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={3} width={16} height={12} rx={1} fill="#475569" stroke={C} strokeWidth={0.5} />
        <Rect x={3.5} y={4.5} width={13} height={9} fill="#0B1A22" />
        <Path d="M4.5 8 Q7 6.5 9.5 8 T14.5 8" fill="none" stroke="#22D3EE" strokeWidth={0.6} />
        <Path d="M4.5 11 Q7 10 9.5 11 T14.5 11" fill="none" stroke="#FBBF24" strokeWidth={0.6} />
        <Path d="M3 15 L17 15 L17 30 Q17 31 16 31 L4 31 Q3 31 3 30 Z" fill="#5B6672" stroke={C} strokeWidth={0.5} />
        <Rect x={4.5} y={16.5} width={7} height={4} fill="#BFE3EE" stroke={C} strokeWidth={0.3} />
        <Path d="M17 18 Q21 22 17 26" fill="none" stroke="#D4E8F0" strokeWidth={1.3} />
        <Rect x={9} y={31} width={2} height={5} fill="#CBD5E1" />
        <Ellipse cx={6} cy={37} rx={2} ry={1.4} fill={C} />
        <Ellipse cx={14} cy={37} rx={2} ry={1.4} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── BroselowCart — 소아 응급 카트 (색상 구획 Broselow 테이프 서랍) ─────
export function BroselowCart({ x, y }: { x: number; y: number }) {
  const drawers: [string, number][] = [['#EF6C6C', 10], ['#FBBF24', 13.5], ['#5A8AC0', 17], ['#7BB07B', 20.5]];
  return (
    <Box x={x} y={y} offY={-2} w={22} h={30}>
      <Svg viewBox="0 0 22 30" width={22 * S} height={30 * S}>
        <Ellipse cx={11} cy={28.5} rx={8} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 6 L20 6 L20 25 Q20 26 19 26 L3 26 Q2 26 2 25 Z" fill="#C6483C" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={6} width={18} height={3.5} fill="#D9614F" />
        {drawers.map(([col, dy], i) => (
          <G key={i}>
            <Rect x={4} y={dy} width={14} height={3} rx={0.4} fill={col} stroke={C} strokeWidth={0.3} />
            <Rect x={10} y={dy + 1} width={2.5} height={1} fill="#fff" opacity={0.7} />
          </G>
        ))}
        <Line x1={2} y1={9.5} x2={20} y2={9.5} stroke={C} strokeWidth={0.4} />
        <Ellipse cx={5} cy={27.5} rx={1.6} ry={1.2} fill={C} />
        <Ellipse cx={17} cy={27.5} rx={1.6} ry={1.2} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── ReclinerDaybed — 가족 상주용 리클라이너 데이베드 (from hospice2) ────
export function ReclinerDaybed({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={38} h={32}>
      <Svg viewBox="0 0 38 32" width={38 * S} height={32 * S}>
        <Ellipse cx={19} cy={30} rx={15} ry={2} fill="rgba(0,0,0,0.14)" />
        <Path d="M2 11 L36 11 L36 25 Q36 27 34 27 L4 27 Q2 27 2 25 Z" fill="#A98D66" stroke={C} strokeWidth={0.7} />
        <Rect x={3.5} y={12.5} width={15} height={10} rx={2} fill="#C4A578" stroke={C} strokeWidth={0.3} />
        <Rect x={19.5} y={12.5} width={15} height={10} rx={2} fill="#C4A578" stroke={C} strokeWidth={0.3} />
        <Rect x={2} y={4} width={12} height={8} rx={3} fill="#B89A72" stroke={C} strokeWidth={0.6} />
        <Rect x={3.5} y={5.5} width={9} height={2} rx={1} fill="#CDB185" />
        <Rect x={1} y={10} width={2.5} height={16} rx={1.2} fill="#8F7550" />
        <Rect x={34.5} y={10} width={2.5} height={16} rx={1.2} fill="#8F7550" />
        <Rect x={22} y={14} width={11} height={7} rx={1} fill="#B7C9A8" stroke={C} strokeWidth={0.4} />
        <Path d="M22 17.5 L33 17.5" stroke="#9DB08C" strokeWidth={0.5} />
        <Line x1={2} y1={22} x2={36} y2={22} stroke={C} strokeWidth={0.4} opacity={0.5} />
      </Svg>
    </Box>
  );
}

export function PicuObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'picubed': return <PICUBed x={x} y={y} occupied={props?.occupied === true} />;
    case 'pedventilator': return <PedVentilator x={x} y={y} />;
    case 'broselowcart': return <BroselowCart x={x} y={y} />;
    case 'reclinerdaybed': return <ReclinerDaybed x={x} y={y} />;
    default: return null;
  }
}
