// Sim Lab / Nursing Admin / Infection Control objects — RN-svg ports of
// interior-objects-sim2.jsx: high-fidelity SimManikin (tablet-linked sim bed),
// one-way-mirror ControlBooth, nursing-admin OfficeDesk, PPE don/doff PPEBoard.
// Authored at ITILE=16, rendered at TILE px via S; Box maps handoff x*ITILE / top-N
// offsets 1:1. v13+ 2.5D ground shadow. SVG <text> (step numbers) → shape blocks.
// Dispatched via SimObjectView.
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

// ─── SimManikin — 고성능 시뮬레이션 마네킹 (제어 태블릿 연동 베드) ──────
export function SimManikin({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={42} h={52}>
      <Svg viewBox="0 0 42 52" width={42 * S} height={52 * S}>
        <Ellipse cx={21} cy={50} rx={17} ry={2.4} fill="rgba(0,0,0,0.16)" />
        <Path d="M4 3 L38 3 L38 8 L4 8 Z" fill="#AEB6BE" stroke={C} strokeWidth={0.7} />
        <Rect x={5} y={4} width={32} height={1.4} fill="#CBD5E1" />
        <Path d="M4 8 L38 8 L38 44 Q38 46 36 46 L6 46 Q4 46 4 44 Z" fill="#C7D0D8" stroke={C} strokeWidth={0.7} />
        <Rect x={4} y={8} width={34} height={3} fill="#DCE4EA" />
        <Rect x={9} y={10} width={24} height={8} rx={3} fill="#EDF1F4" stroke={C} strokeWidth={0.3} />
        <Rect x={16.5} y={11} width={9} height={7} rx={3} fill="#E8CBB0" stroke={C} strokeWidth={0.4} />
        <Path d="M13 19 L29 19 L27 34 L15 34 Z" fill="#EAD3BC" stroke={C} strokeWidth={0.4} />
        <Rect x={15} y={34} width={5} height={9} rx={1.5} fill="#EAD3BC" stroke={C} strokeWidth={0.3} />
        <Rect x={22} y={34} width={5} height={9} rx={1.5} fill="#EAD3BC" stroke={C} strokeWidth={0.3} />
        <Circle cx={17.5} cy={24} r={1.1} fill="#DC2626" />
        <Circle cx={24.5} cy={24} r={1.1} fill="#22C55E" />
        <Circle cx={21} cy={29} r={1.1} fill="#3B82F6" />
        <Path d="M17.5 24 Q12 24 10 21 M24.5 24 Q30 24 32 21" fill="none" stroke="#9CA3AF" strokeWidth={0.4} />
        <Line x1={4} y1={44} x2={38} y2={44} stroke={C} strokeWidth={0.5} />
        <Rect x={30} y={38} width={7} height={5} rx={0.6} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Rect x={31} y={39} width={5} height={3} fill="#22D3EE" />
        <Rect x={5} y={46} width={3} height={3.5} fill="#6B7280" />
        <Rect x={34} y={46} width={3} height={3.5} fill="#6B7280" />
      </Svg>
    </Box>
  );
}

// ─── ControlBooth — 시뮬 제어실 원웨이 미러 부스 (관찰창 + 디브리핑 모니터) ─
export function ControlBooth({ x, y, w = 4 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  return (
    <Box x={x} y={y} offY={-6} w={vw} h={26} z={3}>
      <Svg viewBox={`0 0 ${vw} 26`} width={vw * S} height={26 * S} preserveAspectRatio="none">
        <Rect x={0} y={16} width={vw} height={9} fill="#8E99A4" stroke={C} strokeWidth={0.5} />
        <Rect x={0} y={16} width={vw} height={2} fill="#AEB6BE" />
        <Rect x={1} y={1} width={vw - 2} height={15} fill="#3A4A55" fillOpacity={0.55} stroke={C} strokeWidth={0.7} />
        {[...Array(w)].map((_, i) => {
          const lx = (i + 1) * (vw / (w + 1));
          return <Line key={i} x1={lx} y1={1} x2={lx} y2={16} stroke={C} strokeWidth={0.4} opacity={0.5} />;
        })}
        <Rect x={2} y={2.5} width={w * 5} height={3} fill="#6E8894" opacity={0.4} />
        <Rect x={4} y={17.5} width={7} height={5} fill="#0F1A24" />
        <Rect x={5} y={18.4} width={5} height={3} fill="#22D3EE" opacity={0.7} />
        <Rect x={vw - 11} y={17.5} width={7} height={5} fill="#0F1A24" />
        <Rect x={vw - 10} y={18.4} width={5} height={3} fill="#A7F3D0" opacity={0.7} />
      </Svg>
    </Box>
  );
}

// ─── OfficeDesk — 간호부 사무 데스크 (모니터 + 서류·필통) ───────────────
export function OfficeDesk({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={32} h={30}>
      <Svg viewBox="0 0 32 30" width={32 * S} height={30 * S}>
        <Ellipse cx={16} cy={25.5} rx={13} ry={2.2} fill="rgba(0,0,0,0.14)" />
        <Path d="M2 8 L30 8 L30 24 Q30 25 29 25 L3 25 Q2 25 2 24 Z" fill="#B8A98E" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={8} width={28} height={4} fill="#CCBE9E" />
        <Rect x={11} y={2} width={10} height={7} rx={0.6} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Rect x={12} y={3} width={8} height={5} fill="#0B1A22" />
        <Rect x={12.8} y={3.8} width={6} height={1} fill="#22D3EE" />
        <Rect x={15} y={9} width={2} height={1.5} fill="#4B5563" />
        <Rect x={10} y={13} width={12} height={3} rx={0.5} fill="#B7BEC6" stroke={C} strokeWidth={0.3} />
        <Rect x={4} y={13} width={5} height={6} fill="#FBFAF4" stroke={C} strokeWidth={0.3} />
        <Rect x={24} y={12} width={3} height={4} rx={1} fill="#5A8AC0" />
      </Svg>
    </Box>
  );
}

// ─── PPEBoard — 감염관리 방호구 착탈의 보드 (색상 단계 안내) ────────────
export function PPEBoard({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  const steps = ['#FEF3C7', '#A5D8E8', '#DDD6FE', '#F9C9D6'];
  const seg = (vw - 6) / 4;
  return (
    <Box x={x} y={y} w={vw} h={22}>
      <Svg viewBox={`0 0 ${vw} 22`} width={vw * S} height={22 * S} preserveAspectRatio="none">
        <Ellipse cx={vw / 2} cy={20.5} rx={w * 7} ry={1.4} fill="rgba(0,0,0,0.1)" />
        <Rect x={0} y={0} width={vw} height={20} rx={1} fill="#fff" stroke={C} strokeWidth={0.6} />
        <Rect x={0} y={0} width={vw} height={4} fill="#0E9488" />
        <Rect x={2} y={1.2} width={w * 9} height={1.8} fill="#fff" />
        {steps.map((col, i) => {
          const sx = 3 + i * seg;
          return (
            <G key={i}>
              <Rect x={sx} y={7} width={seg - 2} height={6} fill={col} stroke={C} strokeWidth={0.3} />
              <Circle cx={sx + 2} cy={9} r={0.9} fill="#0E9488" />
              <Rect x={sx + (seg - 2) / 2 - 0.5} y={14.8} width={1} height={1.6} fill={C} />
            </G>
          );
        })}
      </Svg>
    </Box>
  );
}

export function SimObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  switch (type) {
    case 'simmanikin': return <SimManikin x={x} y={y} />;
    case 'controlbooth': return <ControlBooth x={x} y={y} w={num(props?.w, 4)} />;
    case 'officedesk': return <OfficeDesk x={x} y={y} />;
    case 'ppeboard': return <PPEBoard x={x} y={y} w={num(props?.w, 3)} />;
    default: return null;
  }
}
