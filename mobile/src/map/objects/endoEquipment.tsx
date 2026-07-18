// Endoscopy objects — RN-svg ports of interior-objects-endo2.jsx: procedure tower
// (monitor+light source+processor+CO2), automated scope reprocessor (AER), vertical
// scope storage cabinet, electric procedure bed. Authored at ITILE=16, rendered at
// TILE px via S; Box maps handoff x*ITILE / top-N offsets 1:1. v13+ 2.5D ground
// shadow. SVG <text> (CO₂) → shape. Dispatched via EndoObjectView; reused pieces
// (oxygen/suction/sinkor/wastebin/ibed/imonitor/iiv/ireception/ichair/icurtain/
// iplant) resolve on the shared chain.
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

// ─── EndoTower — 내시경 타워 (모니터 + 광원 + 프로세서 + CO2) ───────────
export function EndoTower({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-18} w={26} h={54}>
      <Svg viewBox="0 0 26 54" width={26 * S} height={54 * S}>
        <Ellipse cx={13} cy={52} rx={9} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Rect x={1} y={0} width={24} height={16} rx={1} fill="#111827" stroke={C} strokeWidth={0.6} />
        <Rect x={2.5} y={1.5} width={21} height={13} fill="#2A0E10" />
        <Ellipse cx={13} cy={8} rx={8} ry={5.5} fill="#8B2E2E" />
        <Ellipse cx={10} cy={7.5} rx={3} ry={3.8} fill="#B54B4B" />
        <Ellipse cx={10} cy={7.5} rx={1.2} ry={1.6} fill="#3A1010" />
        <Path d="M3 17 L23 17 L23 49 Q23 50 22 50 L4 50 Q3 50 3 49 Z" fill="#8E99A4" stroke={C} strokeWidth={0.6} />
        <Rect x={3} y={17} width={20} height={2.4} fill="#AEB6BE" />
        <Rect x={4} y={20} width={18} height={6} fill="#5B6672" stroke={C} strokeWidth={0.4} />
        <Circle cx={8} cy={23} r={1.8} fill="#A7F3D0" />
        <Rect x={12} y={21.5} width={8} height={3} fill="#0F1A24" />
        <Rect x={4} y={27} width={18} height={6} fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={5} y={28.5} width={8} height={3} fill="#0F1A24" />
        <Rect x={5.6} y={29.4} width={5} height={1} fill="#22D3EE" />
        <Rect x={4} y={34} width={18} height={5} fill="#5B6672" stroke={C} strokeWidth={0.4} />
        <Rect x={5} y={35.2} width={5} height={2.4} rx={0.4} fill="#FBBF24" />
        <Circle cx={18} cy={36.5} r={1.6} fill="#CBD5E1" />
        <Rect x={4} y={40} width={18} height={4} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={6} cy={50} rx={2} ry={1.4} fill={C} />
        <Ellipse cx={20} cy={50} rx={2} ry={1.4} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── ScopeWasher — 내시경 자동 세척·재처리기 (AER, 원형 세척조) ─────────
export function ScopeWasher({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={36} h={30}>
      <Svg viewBox="0 0 36 30" width={36 * S} height={30 * S}>
        <Ellipse cx={18} cy={24.5} rx={15} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 6 L34 6 L34 24 Q34 25 33 25 L3 25 Q2 25 2 24 Z" fill="#B0B7BF" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={6} width={32} height={3} fill="#C7CDD4" />
        <Ellipse cx={11} cy={13} rx={7.5} ry={4.5} fill="#8A929B" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={11} cy={12.5} rx={5.5} ry={3} fill="#3E6470" />
        <Path d="M8 12 Q11 10 14 12 Q12 14 10 13 Q9 12 8 12 Z" fill="none" stroke="#CBD5E1" strokeWidth={1} />
        <Ellipse cx={26} cy={13} rx={7.5} ry={4.5} fill="#8A929B" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={26} cy={12.5} rx={5.5} ry={3} fill="#3E6470" />
        <Line x1={2} y1={19} x2={34} y2={19} stroke={C} strokeWidth={0.4} />
        <Rect x={5} y={20.5} width={10} height={3} fill="#0F1A24" />
        <Rect x={5.6} y={21.4} width={6} height={1} fill="#22D3EE" />
        <Circle cx={28} cy={22} r={1.8} fill="#10B981" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── ScopeCabinet — 내시경 수직 걸이 보관장 (유리문) ───────────────────
export function ScopeCabinet({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={26} h={36}>
      <Svg viewBox="0 0 26 36" width={26 * S} height={36 * S}>
        <Ellipse cx={13} cy={34.5} rx={10} ry={2} fill="rgba(0,0,0,0.14)" />
        <Path d="M2 6 L24 6 L24 32 Q24 33 23 33 L3 33 Q2 33 2 32 Z" fill="#CBD5DD" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={3} width={22} height={3} fill="#B7C0C8" />
        <Rect x={3.5} y={7.5} width={19} height={24} rx={1} fill="#CFE6EE" fillOpacity={0.55} stroke={C} strokeWidth={0.5} />
        {[7, 12, 17].map((sx, i) => (
          <G key={i}>
            <Circle cx={sx} cy={10} r={1.3} fill="#5B6672" />
            <Path d={`M${sx} 11 Q${sx + 2} 20 ${sx - 1} 29`} fill="none" stroke="#8A929B" strokeWidth={1.4} />
          </G>
        ))}
        <Rect x={21} y={17} width={1.2} height={7} fill="#6E7A86" />
        <Rect x={4} y={1} width={8} height={1.6} fill="#9CA3AF" />
      </Svg>
    </Box>
  );
}

// ─── ProcedureBed — 전동 시술 베드 (측와위, 머리 받침 + 웨지) ───────────
export function ProcedureBed({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={48} h={30}>
      <Svg viewBox="0 0 48 30" width={48 * S} height={30 * S}>
        <Ellipse cx={24} cy={28} rx={20} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M3 5 L45 5 L45 23 Q45 24 44 24 L4 24 Q3 24 3 23 Z" fill="#4F7C8A" stroke={C} strokeWidth={0.6} />
        <Rect x={3} y={5} width={42} height={13} fill="#6E9DAB" />
        <Rect x={5} y={6.5} width={9} height={10} rx={2} fill="#8FB8C4" />
        <Rect x={30} y={7} width={12} height={9} rx={1.5} fill="#5E8A98" opacity={0.7} />
        <Line x1={3} y1={18} x2={45} y2={18} stroke={C} strokeWidth={0.4} />
        <Rect x={8} y={4} width={14} height={1.4} rx={0.7} fill="#9CA3AF" />
        <Rect x={14} y={24} width={20} height={4} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={10} y={25.5} width={4} height={2.4} fill="#FBBF24" />
      </Svg>
    </Box>
  );
}

export function EndoObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y } = object;
  switch (type) {
    case 'endotower': return <EndoTower x={x} y={y} />;
    case 'scopewasher': return <ScopeWasher x={x} y={y} />;
    case 'scopecabinet': return <ScopeCabinet x={x} y={y} />;
    case 'procedurebed': return <ProcedureBed x={x} y={y} />;
    default: return null;
  }
}
