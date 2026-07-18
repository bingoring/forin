// SPD / CSD · Nutrition · Loading Dock objects — RN-svg ports of interior-objects-
// spd2.jsx: steam Autoclave, sterile-pouch SterileRack, pass-through
// WasherDisinfector, insulated FoodCartColumn, warehouse PalletStack, dock
// CargoTruck. Industrial back-of-house. Authored at ITILE=16, rendered at TILE px
// via S; Box maps handoff x*ITILE / top-N offsets 1:1. v13+ 2.5D ground shadow.
// Dispatched via SpdObjectView.
import { type ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;

function Box({ x, y, offX = 0, offY = 0, w, h, z, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; z?: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S, zIndex: z }}>{children}</View>
  );
}

// ─── Autoclave — 대형 고압증기 멸균기 (라운드 압력 도어) ────────────────
export function Autoclave({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={32} h={34}>
      <Svg viewBox="0 0 32 34" width={32 * S} height={34 * S}>
        <Ellipse cx={16} cy={32.5} rx={12} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 8 L30 8 L30 28 Q30 29 29 29 L3 29 Q2 29 2 28 Z" fill="#8A929B" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={8} width={28} height={3} fill="#AEB6BE" />
        <Circle cx={14} cy={19} r={7} fill="#B7BEC6" stroke={C} strokeWidth={0.6} />
        <Circle cx={14} cy={19} r={5} fill="#9CA3AF" />
        <Circle cx={14} cy={19} r={1.4} fill="#5B6672" />
        {[0, 1, 2, 3].map((i) => {
          const a = i * 1.57;
          return <Rect key={i} x={14 + Math.cos(a) * 5 - 0.3} y={19 + Math.sin(a) * 5 - 0.3} width={0.6} height={0.6} fill="#5B6672" />;
        })}
        <Rect x={23} y={12} width={5} height={6} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Rect x={23.6} y={13} width={3.6} height={1} fill="#22D3EE" />
        <Rect x={23.6} y={15} width={2.6} height={1} fill="#FBBF24" />
        <Circle cx={25.5} cy={22} r={1.8} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Line x1={25.5} y1={22} x2={26.7} y2={20.9} stroke="#DC2626" strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── SterileRack — 멸균 팩 보관 랙 (peel-pouch 정렬) ────────────────────
export function SterileRack({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  const seg = (vw - 5) / (w * 2);
  return (
    <Box x={x} y={y} offY={-4} w={vw} h={28}>
      <Svg viewBox={`0 0 ${vw} 28`} width={vw * S} height={28 * S} preserveAspectRatio="none">
        <Ellipse cx={vw / 2} cy={26.5} rx={w * 7} ry={1.8} fill="rgba(0,0,0,0.12)" />
        <Rect x={1} y={1} width={vw - 2} height={24} fill="#DCE3E8" stroke={C} strokeWidth={0.6} />
        {[9, 17].map((sy, r) => (
          <G key={r}>
            <Rect x={1} y={sy} width={vw - 2} height={1.4} fill="#B7BEC6" />
            {[...Array(w * 2)].map((_, i) => (
              <G key={i}>
                <Rect x={2.5 + i * seg} y={sy - 6.5} width={seg - 1} height={6} fill="#EAF2F6" stroke={C} strokeWidth={0.25} />
                <Rect x={2.5 + i * seg} y={sy - 6.5} width={seg - 1} height={1.2} fill="#5A8AC0" />
              </G>
            ))}
          </G>
        ))}
        {[...Array(w * 2)].map((_, i) => (
          <Rect key={'t' + i} x={2.5 + i * seg} y={2.5} width={seg - 1} height={6} fill="#EAF2F6" stroke={C} strokeWidth={0.25} />
        ))}
      </Svg>
    </Box>
  );
}

// ─── WasherDisinfector — 기구 세척 소독기 (통과형 유리 도어) ────────────
export function WasherDisinfector({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={28} h={30}>
      <Svg viewBox="0 0 28 30" width={28 * S} height={30 * S}>
        <Ellipse cx={14} cy={28.5} rx={10} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 7 L26 7 L26 25 Q26 26 25 26 L3 26 Q2 26 2 25 Z" fill="#9CA3AF" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={7} width={24} height={3} fill="#BEC5CD" />
        <Rect x={4} y={11} width={20} height={12} rx={1} fill="#CFE6EE" fillOpacity={0.55} stroke={C} strokeWidth={0.5} />
        <Rect x={5.5} y={13} width={17} height={3} fill="#9CA3AF" opacity={0.5} />
        <Rect x={5.5} y={17.5} width={17} height={3} fill="#9CA3AF" opacity={0.5} />
        <Rect x={4} y={8} width={7} height={2.2} fill="#0F1A24" />
        <Rect x={4.6} y={8.6} width={4} height={1} fill="#22D3EE" />
      </Svg>
    </Box>
  );
}

// ─── FoodCartColumn — 배식 카트 (다단 트레이 보온고) ────────────────────
export function FoodCartColumn({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={22} h={34}>
      <Svg viewBox="0 0 22 34" width={22 * S} height={34 * S}>
        <Ellipse cx={11} cy={32.5} rx={8} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 6 L20 6 L20 28 Q20 29 19 29 L3 29 Q2 29 2 28 Z" fill="#C6C2B6" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={6} width={18} height={3} fill="#D8D4C6" />
        {[11, 15, 19, 23].map((ty, i) => (
          <Rect key={i} x={4} y={ty} width={14} height={2.6} fill="#E6E2D6" stroke={C} strokeWidth={0.3} />
        ))}
        <Rect x={17} y={14} width={1.4} height={8} fill="#9C8F70" />
        <Rect x={5} y={7} width={4} height={1.6} fill="#EF6C6C" />
        <Ellipse cx={5} cy={31} rx={1.6} ry={1.2} fill={C} />
        <Ellipse cx={17} cy={31} rx={1.6} ry={1.2} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── PalletStack — 하역장 물류 파렛트 (박스 적재) ───────────────────────
export function PalletStack({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={28} h={28}>
      <Svg viewBox="0 0 28 28" width={28 * S} height={28 * S}>
        <Ellipse cx={14} cy={26.5} rx={11} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 20 L26 20 L24 25 L4 25 Z" fill="#B98A5A" stroke={C} strokeWidth={0.5} />
        {[6, 14, 22].map((bx, i) => <Rect key={i} x={bx - 1} y={20} width={2} height={5} fill="#8F6A3E" />)}
        <Path d="M4 8 L14 8 L14 20 L4 20 Z" fill="#C9A876" stroke={C} strokeWidth={0.5} />
        <Path d="M4 8 L14 8 L15 6 L5 6 Z" fill="#D9BC8E" />
        <Path d="M14 10 L24 10 L24 20 L14 20 Z" fill="#BE9E6E" stroke={C} strokeWidth={0.5} />
        <Path d="M14 10 L24 10 L25 8 L15 8 Z" fill="#D3B584" />
        <Rect x={6} y={12} width={6} height={4} fill="#FBFAF4" stroke={C} strokeWidth={0.3} />
        <Rect x={16} y={13} width={6} height={4} fill="#FBFAF4" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

// ─── CargoTruck — 하역장 배송 트럭 (롤업 화물칸 후면) ───────────────────
export function CargoTruck({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={38} h={48}>
      <Svg viewBox="0 0 38 48" width={38 * S} height={48 * S}>
        <Ellipse cx={19} cy={46.5} rx={16} ry={2.4} fill="rgba(0,0,0,0.18)" />
        <Path d="M3 4 L35 4 L35 40 Q35 41 34 41 L4 41 Q3 41 3 40 Z" fill="#D8DCE0" stroke={C} strokeWidth={0.8} />
        <Rect x={3} y={4} width={32} height={6} fill="#E6E9EC" stroke={C} strokeWidth={0.6} />
        <Rect x={6} y={12} width={26} height={26} rx={1} fill="#B7BEC6" stroke={C} strokeWidth={0.6} />
        {[15, 19, 23, 27, 31, 35].map((sy, i) => <Line key={i} x1={6} y1={sy} x2={32} y2={sy} stroke="#8A929B" strokeWidth={0.6} />)}
        <Rect x={17} y={24} width={1.6} height={5} fill="#5B6672" />
        <Rect x={20} y={24} width={1.6} height={5} fill="#5B6672" />
        <Rect x={9} y={1} width={20} height={3.5} rx={1} fill="#5A8AC0" stroke={C} strokeWidth={0.5} />
      </Svg>
    </Box>
  );
}

export function SpdObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  switch (type) {
    case 'autoclave': return <Autoclave x={x} y={y} />;
    case 'sterilerack': return <SterileRack x={x} y={y} w={num(props?.w, 3)} />;
    case 'washerdisinfector': return <WasherDisinfector x={x} y={y} />;
    case 'foodcartcolumn': return <FoodCartColumn x={x} y={y} />;
    case 'palletstack': return <PalletStack x={x} y={y} />;
    case 'cargotruck': return <CargoTruck x={x} y={y} />;
    default: return null;
  }
}
