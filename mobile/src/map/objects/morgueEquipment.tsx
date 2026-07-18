// 영안실 · 부검실 Morgue & Autopsy objects — RN-svg ports of interior-objects-
// morgue2.jsx: multi-chamber CadaverFridge (stainless cold bank), perforated
// AutopsyTable (drain channel + rinse faucet), draped ViewingBier (catafalque
// with cloth, lily, candles). Somber controlled-access basement. Authored at
// ITILE=16, rendered at TILE px via S; Box maps handoff x*ITILE / top-N offsets
// 1:1. v13+ 2.5D ground shadow. Dispatched via MorgueObjectView.
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

// ─── CadaverFridge — 시신 냉장 보관 캐비닛 (다단 도어) ────────────────
export function CadaverFridge({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const cw = (w * 16 - 2) / w;
  return (
    <Box x={x} y={y} offY={-10} w={w * 16} h={34}>
      <Svg viewBox={`0 0 ${w * 16} 34`} width={w * 16 * S} height={34 * S} preserveAspectRatio="none">
        <Ellipse cx={w * 8} cy={32.5} rx={w * 7} ry={1.6} fill="rgba(0,0,0,0.16)" />
        {/* stainless bank: big TOP face folds into the front (continuous) */}
        <Path d={`M1 11 L${w * 16 - 1} 11 L${w * 16 - 1} 31 L1 31 Z`} fill="#8E99A4" stroke={C} strokeWidth={0.7} />
        <Rect x={1} y={2} width={w * 16 - 2} height={9} fill="#A6B0BA" stroke={C} strokeWidth={0.6} />
        <Rect x={2.5} y={3.5} width={w * 16 - 5} height={2} fill="#BBC4CC" />
        {[...Array(w)].map((_, cc) => (
          <Rect key={'t' + cc} x={2 + cc * cw + 2} y={6.5} width={cw - 6} height={2.6} rx={0.4} fill="#7E8993" />
        ))}
        <Line x1={1} y1={11} x2={w * 16 - 1} y2={11} stroke={C} strokeWidth={0.5} />
        {/* chamber doors: cols × 3 rows, each with a handle + ID card slot */}
        {[...Array(w)].map((_, cc) => [0, 1, 2].map((r) => (
          <G key={cc + '-' + r}>
            <Rect x={1 + cc * cw + 0.8} y={12 + r * 6.2} width={cw - 1.6} height={5.6} rx={0.5} fill="#9FAAB4" stroke={C} strokeWidth={0.4} />
            <Rect x={1 + cc * cw + cw * 0.5 - 2.5} y={12 + r * 6.2 + 2} width={5} height={1.3} fill="#5B6772" />
            <Rect x={1 + cc * cw + 2} y={12 + r * 6.2 + 0.7} width={4} height={1.5} fill="#EDEFF2" stroke={C} strokeWidth={0.25} />
          </G>
        )))}
      </Svg>
    </Box>
  );
}

// ─── AutopsyTable — 부검대 (배수 채널 + 헹굼 수전) ────────────────────
export function AutopsyTable({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={42} h={48}>
      <Svg viewBox="0 0 42 48" width={42 * S} height={48 * S}>
        <Ellipse cx={21} cy={46} rx={16} ry={2.4} fill="rgba(0,0,0,0.16)" />
        {/* perforated stainless table: TOP face + short front, one silhouette */}
        <Path d="M3 6 L39 6 L39 40 Q39 42 37 42 L5 42 Q3 42 3 40 Z" fill="#AEB6BE" stroke={C} strokeWidth={0.9} />
        <Rect x={4} y={7.5} width={34} height={2} fill="#C7CDD4" />
        <Rect x={5} y={9} width={32} height={26} rx={2} fill="none" stroke="#7C858E" strokeWidth={1.1} />
        {/* drain perforations across the top */}
        {[...Array(7)].map((_, r) => [...Array(11)].map((_, cc) => (
          <Circle key={r + '-' + cc} cx={8 + cc * 2.7} cy={12 + r * 3} r={0.55} fill="#8A929B" />
        )))}
        <Line x1={3} y1={35} x2={39} y2={35} stroke={C} strokeWidth={0.6} />
        <Line x1={12} y1={36} x2={12} y2={41} stroke={C} strokeWidth={0.4} opacity={0.4} />
        <Line x1={30} y1={36} x2={30} y2={41} stroke={C} strokeWidth={0.4} opacity={0.4} />
        {/* rinse faucet at the head + drain spout at the foot */}
        <Rect x={19} y={2} width={4} height={4} rx={1} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={20.2} y={42} width={1.6} height={3} fill="#7C858E" />
        <Rect x={18} y={42} width={6} height={3} fill="#8A929B" />
      </Svg>
    </Box>
  );
}

// ─── ViewingBier — 유족 참관용 안치대 (덮개 + 은은한 조명) ────────────
export function ViewingBier({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={42} h={42}>
      <Svg viewBox="0 0 42 42" width={42 * S} height={42 * S}>
        <Ellipse cx={21} cy={40} rx={16} ry={2.2} fill="rgba(0,0,0,0.14)" />
        {/* draped catafalque: big top face + short front (continuous) */}
        <Path d="M3 12 L39 12 L39 34 Q39 36 37 36 L5 36 Q3 36 3 34 Z" fill="#5C5170" stroke={C} strokeWidth={0.8} />
        {/* long white cloth drape over the top (falls over the front edge) */}
        <Path d="M4 8 L38 8 L38 30 Q38 31 37 31 L5 31 Q4 31 4 30 Z" fill="#EFECF4" stroke={C} strokeWidth={0.5} />
        <Rect x={5} y={9.5} width={32} height={2} fill="#FBFAFE" />
        {/* soft folds in the cloth */}
        <Path d="M4 18 Q11 20 21 18 T38 18" fill="none" stroke="#D6D0E0" strokeWidth={1} />
        <Path d="M4 24 Q11 26 21 24 T38 24" fill="none" stroke="#D6D0E0" strokeWidth={0.8} />
        {/* single white lily laid on top */}
        <Ellipse cx={21} cy={14.5} rx={3.2} ry={1.8} fill="#FFFFFF" stroke={C} strokeWidth={0.3} />
        <Circle cx={21} cy={14.5} r={1} fill="#FBBF24" />
        <Path d="M21 16 Q24 18 27 17" fill="none" stroke="#6E8A5A" strokeWidth={0.7} />
        {/* two candle holders with soft glow flanking */}
        <Circle cx={6} cy={6} r={2.4} fill="#FDE68A" opacity={0.55} />
        <Rect x={5.2} y={5.5} width={1.6} height={3} fill="#E8D8A0" />
        <Circle cx={36} cy={6} r={2.4} fill="#FDE68A" opacity={0.55} />
        <Rect x={35.2} y={5.5} width={1.6} height={3} fill="#E8D8A0" />
      </Svg>
    </Box>
  );
}

// ─── dispatcher ──────────────────────────────────────────────────────
export function MorgueObjectView({ object }: { object: MapObject }): ReactElement | null {
  const p = (object.props ?? {}) as { w?: number };
  switch (object.type) {
    case 'cadaverfridge':
      return <CadaverFridge x={object.x} y={object.y} w={p.w} />;
    case 'autopsytable':
      return <AutopsyTable x={object.x} y={object.y} />;
    case 'viewingbier':
      return <ViewingBier x={object.x} y={object.y} />;
    default:
      return null;
  }
}
