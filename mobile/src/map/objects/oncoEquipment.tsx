// Oncology / BMT objects — RN-svg ports of the onco2 pieces not already ported by
// infusion (BMTPod HEPA positive-pressure header + ChemoHazardBin) plus a vaccine
// Fridge (from interior-peds.jsx). The chemo infusion pieces (InfusionChair/
// SmartInfusionPump/PPEStation) live in infusionEquipment.tsx and resolve on the
// shared chain. Authored at ITILE=16, rendered at TILE px via S; Box maps handoff
// x*ITILE / top-N offsets 1:1. v13+ 2.5D ground shadow. SVG <text> (HEPA/CHEMO/VAX)
// → shape blocks. Dispatched via OncoObjectView.
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

// ─── BMTPod — 무균 양압 이식실 HEPA 헤더 (positive pressure ↓) ─────────
export function BMTPod({ x, y, w = 6 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  return (
    <Box x={x} y={y} offY={-6} w={vw} h={32} z={1}>
      <Svg viewBox={`0 0 ${vw} 32`} width={vw * S} height={32 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={vw} height={6} fill="#6B7280" stroke={C} strokeWidth={0.6} />
        {[...Array(w)].map((_, i) => <Rect key={i} x={4 + i * 16} y={1.6} width={8} height={2.8} fill="#9CA3AF" />)}
        {/* "↓ HEPA POSITIVE PRESSURE" label → mint tick strip */}
        <Rect x={vw / 2 - 10} y={2.3} width={20} height={1.6} rx={0.4} fill="#A7F3D0" />
        <Circle cx={vw - 8} cy={3} r={2.2} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Line x1={vw - 8} y1={3} x2={vw - 6.6} y2={1.8} stroke="#DC2626" strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── ChemoHazardBin — 항암 폐기물 전용통 (보라 라벨) ──────────────────
export function ChemoHazardBin({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={1} w={10} h={14}>
      <Svg viewBox="0 0 10 14" width={10 * S} height={14 * S}>
        <Ellipse cx={5} cy={13} rx={3.6} ry={1.6} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={5} cy={3} rx={4} ry={1.5} fill="#8B5CF6" stroke={C} strokeWidth={0.4} />
        <Path d="M1 3 L9 3 L8.3 12 Q8.3 12.6 7.7 12.6 L2.3 12.6 Q1.7 12.6 1.7 12 Z" fill="#7C3AED" stroke={C} strokeWidth={0.5} />
        <Path d="M2.6 3 L7.4 3 L7 12 L3 12 Z" fill="#8B5CF6" />
        <Path d="M5 5.5 L6.4 7 L5 8.5 L3.6 7 Z" fill="#fff" />
        {/* "CHEMO" label → light strip */}
        <Rect x={2.6} y={10} width={4.8} height={1.4} rx={0.3} fill="#EDE9FE" />
      </Svg>
    </Box>
  );
}

// ─── Fridge — 백신/약품 냉장고 (VAX) ──────────────────────────────────
export function Fridge({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-5} w={21} h={37}>
      <Svg viewBox="0 0 21 37" width={21 * S} height={37 * S}>
        <Ellipse cx={10.5} cy={35.6} rx={7.1} ry={2.4} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 2 Q1 2 1 3 L1 34 Q1 35 2 35 L19 35 Q20 35 20 34 L20 3 Q20 2 19 2 Z" fill="#E9EBEC" />
        <Path d="M2 2 Q1 2 1 3 L1 8 L20 8 L20 3 Q20 2 19 2 Z" fill="#CBD2D6" />
        <Line x1={1} y1={8} x2={20} y2={8} stroke={C} strokeWidth={0.5} />
        <Line x1={1} y1={20} x2={20} y2={20} stroke={C} strokeWidth={0.6} />
        <Rect x={16} y={10} width={1.6} height={7} rx={0.6} fill="#9AA6B2" stroke={C} strokeWidth={0.3} />
        <Rect x={16} y={23} width={1.6} height={8} rx={0.6} fill="#9AA6B2" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={24} width={9} height={5} rx={0.5} fill="#BAE6FD" stroke={C} strokeWidth={0.4} />
        {/* "VAX" label → blue chip already; add dark bars to suggest text */}
        <Rect x={4.5} y={26} width={6} height={1.4} fill={C} />
        <Path d="M2 2 Q1 2 1 3 L1 34 Q1 35 2 35 L19 35 Q20 35 20 34 L20 3 Q20 2 19 2 Z" fill="none" stroke={C} strokeWidth={0.7} />
      </Svg>
    </Box>
  );
}

export function OncoObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  switch (type) {
    case 'bmtpod': return <BMTPod x={x} y={y} w={num(props?.w, 6)} />;
    case 'chemohazardbin': return <ChemoHazardBin x={x} y={y} />;
    case 'fridge': return <Fridge x={x} y={y} />;
    default: return null;
  }
}
