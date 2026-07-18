// Rehabilitation (PT/OT) objects — RN-svg ports of interior-objects-rehab2.jsx:
// parallel bars, hi-lo therapy mat table, rehab treadmill, wall shoulder-pulley,
// gym-ball rack. ADLKitchen (also from rehab2) lives in hospiceEquipment and
// resolves on the shared chain. Authored at ITILE=16, rendered at TILE px via S;
// Box maps handoff x*ITILE / top-N offsets 1:1. v13+ 2.5D ground shadow. Dispatched
// via RehabObjectView.
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

// ─── ParallelBars — 평행봉 보행 훈련 (양측 목재 손잡이 + 보행 매트) ─────
export function ParallelBars({ x, y, w = 4 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  return (
    <Box x={x} y={y} w={vw} h={26}>
      <Svg viewBox={`0 0 ${vw} 26`} width={vw * S} height={26 * S} preserveAspectRatio="none">
        <Ellipse cx={vw / 2} cy={24} rx={w * 7} ry={2} fill="rgba(0,0,0,0.14)" />
        <Rect x={6} y={8} width={vw - 12} height={11} rx={1} fill="#8FB59E" stroke={C} strokeWidth={0.5} />
        <Rect x={7} y={9} width={vw - 14} height={2} fill="#A7D0BC" />
        <Rect x={3} y={5} width={vw - 6} height={2.4} rx={1.2} fill="#C99F68" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={18.5} width={vw - 6} height={2.4} rx={1.2} fill="#B98A5A" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={6} width={2} height={16} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={vw - 6} y={6} width={2} height={16} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={Math.round(vw / 2) - 1} y={6} width={2} height={16} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

// ─── TherapyMat — 승강식 치료 매트 테이블 (유압 리프트 + 페달) ──────────
export function TherapyMat({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={38} h={28}>
      <Svg viewBox="0 0 38 28" width={38 * S} height={28 * S}>
        <Ellipse cx={19} cy={26} rx={15} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 4 L36 4 L36 20 Q36 21 35 21 L3 21 Q2 21 2 20 Z" fill="#3E6FA0" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={4} width={34} height={10} fill="#5A8AC0" />
        <Line x1={19} y1={4} x2={19} y2={14} stroke="#3E6FA0" strokeWidth={0.6} opacity={0.6} />
        <Line x1={2} y1={14} x2={36} y2={14} stroke={C} strokeWidth={0.4} />
        <Rect x={12} y={21} width={14} height={4} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={8} y={23} width={5} height={2.4} fill="#FBBF24" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── Treadmill — 재활 트레드밀 (손잡이 + 콘솔) ─────────────────────────
export function Treadmill({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-8} w={28} h={38}>
      <Svg viewBox="0 0 28 38" width={28 * S} height={38 * S}>
        <Ellipse cx={14} cy={31} rx={11.5} ry={2.4} fill="rgba(0,0,0,0.16)" />
        <Path d="M3 16 L25 16 L25 30 Q25 31 24 31 L4 31 Q3 31 3 30 Z" fill="#3A4048" stroke={C} strokeWidth={0.6} />
        <Rect x={4} y={17} width={20} height={12} fill="#2C3239" />
        {[0, 1, 2, 3].map((i) => <Line key={i} x1={4} y1={19 + i * 3} x2={24} y2={19 + i * 3} stroke="#4B5563" strokeWidth={0.5} />)}
        <Rect x={3} y={16} width={2} height={14} fill="#B7BEC6" />
        <Rect x={23} y={16} width={2} height={14} fill="#B7BEC6" />
        <Rect x={5} y={4} width={2} height={12} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={21} y={4} width={2} height={12} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={6} y={2} width={16} height={6} rx={1} fill="#475569" stroke={C} strokeWidth={0.5} />
        <Rect x={8} y={3} width={12} height={3.5} fill="#0B1A22" />
        <Rect x={9} y={4} width={5} height={1.4} fill="#22D3EE" />
      </Svg>
    </Box>
  );
}

// ─── ShoulderPulley — 벽 부착 어깨 도르래 운동기 ───────────────────────
export function ShoulderPulley({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={26}>
      <Svg viewBox="0 0 12 26" width={12 * S} height={26 * S}>
        <Rect x={1} y={0} width={10} height={4} rx={0.5} fill="#DCE3E8" stroke={C} strokeWidth={0.5} />
        <Circle cx={6} cy={2} r={1.4} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Line x1={4.5} y1={2.5} x2={4} y2={16} stroke={C} strokeWidth={0.5} />
        <Line x1={7.5} y1={2.5} x2={8} y2={12} stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={16} width={2.4} height={3} rx={1} fill="#C99F68" stroke={C} strokeWidth={0.3} />
        <Rect x={7} y={12} width={2.4} height={3} rx={1} fill="#C99F68" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

// ─── GymBallRack — 짐볼 크래들 랙 (치료용 볼 3) ────────────────────────
export function GymBallRack({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={28} h={26}>
      <Svg viewBox="0 0 28 26" width={28 * S} height={26 * S}>
        <Ellipse cx={14} cy={24} rx={11} ry={2} fill="rgba(0,0,0,0.14)" />
        <Path d="M2 14 L26 14 L24 22 L4 22 Z" fill="#B7BEC6" stroke={C} strokeWidth={0.5} />
        <Circle cx={9} cy={11} r={6} fill="#EF6C6C" stroke={C} strokeWidth={0.5} />
        <Circle cx={20} cy={12} r={5} fill="#5A8AC0" stroke={C} strokeWidth={0.5} />
        <Circle cx={7} cy={12} r={1.4} fill="#fff" opacity={0.5} />
        <Circle cx={18} cy={11} r={1.2} fill="#fff" opacity={0.5} />
      </Svg>
    </Box>
  );
}

export function RehabObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  switch (type) {
    case 'parallelbars': return <ParallelBars x={x} y={y} w={num(props?.w, 4)} />;
    case 'therapymat': return <TherapyMat x={x} y={y} />;
    case 'treadmill': return <Treadmill x={x} y={y} />;
    case 'shoulderpulley': return <ShoulderPulley x={x} y={y} />;
    case 'gymballrack': return <GymBallRack x={x} y={y} />;
    default: return null;
  }
}
