// Inpatient Psychiatry objects — RN-svg ports of interior-objects-psych2.jsx:
// ligature-safe floor-bolted SafeBed, quilted SeclusionPad, round no-corner
// GroupTable. ObsWindow lives in nurseryEquipment and resolves on the shared chain.
// Authored at ITILE=16, rendered at TILE px via S; Box maps handoff x*ITILE / top-N
// offsets 1:1. v13+ 2.5D ground shadow. Dispatched via PsychObjectView.
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

// ─── SafeBed — 바닥 볼트 고정 안전 침대 (자해 방지, 모서리 둥금) ────────
export function SafeBed({ x, y, occupied = true }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} offY={-4} w={38} h={50}>
      <Svg viewBox="0 0 38 50" width={38 * S} height={50 * S}>
        <Ellipse cx={19} cy={48} rx={16} ry={2.4} fill="rgba(0,0,0,0.16)" />
        <Path d="M3 5 L35 5 Q37 5 37 8 L37 42 Q37 45 35 45 L3 45 Q1 45 1 42 L1 8 Q1 5 3 5 Z" fill="#C3BBA9" stroke={C} strokeWidth={0.8} />
        <Path d="M3 5 L35 5 Q37 5 37 8 L37 10 L1 10 L1 8 Q1 5 3 5 Z" fill="#D2CBBB" />
        <Rect x={4} y={8} width={30} height={28} rx={3} fill="#8FA9B8" />
        <Rect x={4} y={8} width={30} height={1.4} fill="#A6C0CE" />
        <Rect x={8} y={10} width={22} height={8} rx={3} fill="#EDF1F4" stroke={C} strokeWidth={0.3} />
        {occupied && (
          <G>
            <Rect x={16} y={11.5} width={6} height={5} rx={2.2} fill="#FDE1C8" stroke={C} strokeWidth={0.3} />
            <Rect x={16.4} y={10.6} width={5.2} height={1.4} fill="#5B4636" />
            <Ellipse cx={19} cy={27} rx={10} ry={7} fill="#7E96A6" />
            <Rect x={9} y={20} width={20} height={1} fill="#A6C0CE" opacity={0.6} />
          </G>
        )}
        <Line x1={1} y1={36} x2={37} y2={36} stroke={C} strokeWidth={0.6} />
        <Circle cx={5} cy={42} r={1.1} fill="#6B7280" />
        <Circle cx={33} cy={42} r={1.1} fill="#6B7280" />
      </Svg>
    </Box>
  );
}

// ─── SeclusionPad — 안정실 패딩 매트 (벽·바닥 완충, 퀼트) ───────────────
export function SeclusionPad({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  return (
    <Box x={x} y={y} w={vw} h={26}>
      <Svg viewBox={`0 0 ${vw} 26`} width={vw * S} height={26 * S} preserveAspectRatio="none">
        <Ellipse cx={vw / 2} cy={24} rx={w * 7} ry={1.8} fill="rgba(0,0,0,0.12)" />
        <Rect x={1} y={4} width={vw - 2} height={18} rx={2} fill="#C6D0C2" stroke={C} strokeWidth={0.6} />
        {[...Array(w * 2)].map((_, i) => {
          const lx = 4 + i * ((vw - 6) / (w * 2));
          return <Line key={'v' + i} x1={lx} y1={5} x2={lx} y2={21} stroke="#A9B5A4" strokeWidth={0.5} />;
        })}
        <Line x1={2} y1={13} x2={vw - 2} y2={13} stroke="#A9B5A4" strokeWidth={0.5} />
        <Rect x={3} y={6} width={w * 6} height={2} fill="#D6DED2" />
      </Svg>
    </Box>
  );
}

// ─── GroupTable — 데이룸 원형 그룹 활동 테이블 (모서리 없음) ────────────
export function GroupTable({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={36} h={28}>
      <Svg viewBox="0 0 36 28" width={36 * S} height={28 * S}>
        <Ellipse cx={18} cy={26} rx={14} ry={2} fill="rgba(0,0,0,0.14)" />
        <Ellipse cx={18} cy={10} rx={16} ry={7.5} fill="#CBA36B" stroke={C} strokeWidth={0.6} />
        <Ellipse cx={18} cy={9} rx={13} ry={5.6} fill="#DBB884" />
        <Path d="M2 10 Q2 20 8 23 M34 10 Q34 20 28 23" fill="none" stroke="#B08A52" strokeWidth={1} />
        <Circle cx={14} cy={9} r={1.6} fill="#EF6C6C" />
        <Circle cx={21} cy={10} r={1.6} fill="#5A8AC0" />
        <Ellipse cx={18} cy={22} rx={5} ry={1.8} fill="#9CA3AF" />
      </Svg>
    </Box>
  );
}

export function PsychObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  switch (type) {
    case 'safebed': return <SafeBed x={x} y={y} occupied={props?.occupied !== false} />;
    case 'seclusionpad': return <SeclusionPad x={x} y={y} w={num(props?.w, 3)} />;
    case 'grouptable': return <GroupTable x={x} y={y} />;
    default: return null;
  }
}
