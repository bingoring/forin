// Staff Lounge / Locker / Cafeteria objects — RN-svg ports of interior-objects-
// lounge2.jsx: LockerBank (2-row locker stack), Vending machine (glass product
// display), DiningTable (4-seat with trays), ServeryCounter (tray rail + warming
// wells). Authored at ITILE=16, rendered at TILE px via S; Box maps handoff x*ITILE
// / top-N offsets 1:1. v13+ 2.5D ground shadow. Dispatched via LoungeObjectView.
import { type ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;
const VEND = ['#FBBF24', '#22C55E', '#3B82F6', '#EF4444', '#A855F7', '#F97316'];

function Box({ x, y, offX = 0, offY = 0, w, h, z, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; z?: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S, zIndex: z }}>{children}</View>
  );
}

// ─── LockerBank — 직원 사물함 뱅크 (세로 2단 × 여러 칸) ─────────────────
export function LockerBank({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  return (
    <Box x={x} y={y} offY={-10} w={vw} h={34}>
      <Svg viewBox={`0 0 ${vw} 34`} width={vw * S} height={34 * S} preserveAspectRatio="none">
        <Ellipse cx={vw / 2} cy={32.5} rx={w * 7} ry={1.6} fill="rgba(0,0,0,0.14)" />
        <Path d={`M1 11 L${vw - 1} 11 L${vw - 1} 31 L1 31 Z`} fill="#7E93A6" stroke={C} strokeWidth={0.7} />
        <Rect x={1} y={2} width={vw - 2} height={9} fill="#93A7B8" stroke={C} strokeWidth={0.6} />
        <Rect x={2.5} y={3.5} width={vw - 5} height={2} fill="#A6B8C6" />
        {[...Array(w)].map((_, cc) => <Rect key={'t' + cc} x={2 + cc * ((vw - 2) / w) + 2} y={6.5} width={(vw - 2) / w - 6} height={2.6} rx={0.4} fill="#6C8092" />)}
        <Line x1={1} y1={11} x2={vw - 1} y2={11} stroke={C} strokeWidth={0.5} />
        {[...Array(w * 2)].map((_, i) => {
          const cw = (vw - 2) / (w * 2);
          const lx = 1 + i * cw;
          return (
            <G key={i}>
              <Rect x={lx + 0.6} y={12} width={cw - 1.2} height={9} fill="#8FA3B4" stroke={C} strokeWidth={0.4} />
              <Rect x={lx + 0.6} y={21.5} width={cw - 1.2} height={9} fill="#8FA3B4" stroke={C} strokeWidth={0.4} />
              <Rect x={lx + 1.4} y={13} width={cw - 2.8} height={0.7} fill="#6C8092" />
              <Rect x={lx + 1.4} y={14.2} width={cw - 2.8} height={0.7} fill="#6C8092" />
              <Rect x={lx + cw - 2.6} y={16.5} width={1.2} height={2} fill="#4B5563" />
              <Rect x={lx + cw - 2.6} y={25.5} width={1.2} height={2} fill="#4B5563" />
            </G>
          );
        })}
      </Svg>
    </Box>
  );
}

// ─── Vending — 자판기 (음료/스낵, 유리 디스플레이) ─────────────────────
export function Vending({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-10} w={22} h={38}>
      <Svg viewBox="0 0 22 38" width={22 * S} height={38 * S}>
        <Ellipse cx={11} cy={36.5} rx={9} ry={1.8} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 11 L20 11 L20 36 L2 36 Z" fill="#C23B3B" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={3} width={18} height={8} fill="#D65454" stroke={C} strokeWidth={0.6} />
        <Rect x={3.5} y={4.5} width={15} height={2} fill="#E47070" />
        <Rect x={5} y={7.5} width={12} height={2} rx={0.5} fill="#A62E2E" />
        <Line x1={2} y1={11} x2={20} y2={11} stroke={C} strokeWidth={0.5} />
        <Rect x={3.5} y={13} width={9} height={15} fill="#0B1A22" stroke={C} strokeWidth={0.4} />
        {[0, 1, 2, 3].map((r) => [0, 1, 2].map((cc) => (
          <Rect key={r + '-' + cc} x={4.2 + cc * 2.8} y={13.8 + r * 3.5} width={2.2} height={2.6} rx={0.4} fill={VEND[(r * 3 + cc) % 6]} />
        )))}
        <Rect x={13.5} y={13.5} width={3.5} height={7} fill="#1F2937" />
        {[0, 1, 2].map((i) => <Rect key={i} x={14} y={14.3 + i * 2} width={2.5} height={1.4} fill="#4B5563" />)}
        <Rect x={4} y={30} width={12} height={3.5} rx={0.5} fill="#1B0E0E" />
      </Svg>
    </Box>
  );
}

// ─── DiningTable — 식당 4인 테이블 (윗면 + 다리 + 트레이) ───────────────
export function DiningTable({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={36} h={28}>
      <Svg viewBox="0 0 36 28" width={36 * S} height={28 * S}>
        <Ellipse cx={18} cy={26} rx={14} ry={2} fill="rgba(0,0,0,0.14)" />
        <Path d="M3 6 L33 6 Q35 6 35 8 L35 17 Q35 19 33 19 L3 19 Q1 19 1 17 L1 8 Q1 6 3 6 Z" fill="#D9C39A" stroke={C} strokeWidth={0.6} />
        <Path d="M3 6 L33 6 Q35 6 35 8 L35 9 L1 9 L1 8 Q1 6 3 6 Z" fill="#E8D6B2" />
        <Rect x={6} y={9} width={9} height={6} rx={1} fill="#EF6C6C" opacity={0.8} />
        <Rect x={21} y={9.5} width={9} height={6} rx={1} fill="#5A8AC0" opacity={0.8} />
        <Rect x={4} y={19} width={2.4} height={6} fill="#9C7A48" />
        <Rect x={29.6} y={19} width={2.4} height={6} fill="#9C7A48" />
      </Svg>
    </Box>
  );
}

// ─── ServeryCounter — 배식 카운터 (트레이 레일 + 온장 파사드) ───────────
export function ServeryCounter({ x, y, w = 4 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  return (
    <Box x={x} y={y} offY={-4} w={vw} h={28}>
      <Svg viewBox={`0 0 ${vw} 28`} width={vw * S} height={28 * S} preserveAspectRatio="none">
        <Ellipse cx={vw / 2} cy={26.5} rx={w * 7} ry={1.6} fill="rgba(0,0,0,0.14)" />
        <Path d={`M1 9 L${vw - 1} 9 L${vw - 1} 25 L1 25 Z`} fill="#AEB6BE" stroke={C} strokeWidth={0.6} />
        <Rect x={1} y={6} width={vw - 2} height={3} fill="#C7CDD4" />
        <Line x1={1} y1={9} x2={vw - 1} y2={9} stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={1} width={vw - 4} height={5} fill="#CFE6EE" fillOpacity={0.45} stroke={C} strokeWidth={0.4} />
        {[...Array(w)].map((_, i) => (
          <Rect key={i} x={3 + i * ((vw - 6) / w)} y={10} width={(vw - 6) / w - 2} height={4} rx={0.6} fill="#8A6B3A" />
        ))}
        <Rect x={1} y={16} width={vw - 2} height={1.6} fill="#8A929B" />
        {[...Array(w)].map((_, i) => {
          const lx = (i + 1) * (vw / (w + 1));
          return <Line key={'s' + i} x1={lx} y1={17.6} x2={lx} y2={25} stroke={C} strokeWidth={0.3} opacity={0.4} />;
        })}
      </Svg>
    </Box>
  );
}

export function LoungeObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  switch (type) {
    case 'lockerbank': return <LockerBank x={x} y={y} w={num(props?.w, 3)} />;
    case 'vending': return <Vending x={x} y={y} />;
    case 'diningtable': return <DiningTable x={x} y={y} />;
    case 'serverycounter': return <ServeryCounter x={x} y={y} w={num(props?.w, 4)} />;
    default: return null;
  }
}
