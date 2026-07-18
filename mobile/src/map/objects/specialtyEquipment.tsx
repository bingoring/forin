// Specialty Outpatient (안과·이비인후과) objects — RN-svg ports of interior-objects-
// eye2.jsx: slit-lamp microscope, phoropter stand, ENT tower+powered chair, Snellen
// vision chart. Authored at ITILE=16, rendered at TILE px via S; Box maps handoff
// x*ITILE / top-N offsets 1:1. v13+ 2.5D ground shadow. VisionChart's SVG <text>
// eye-chart rows → decreasing shape bars. Dispatched via SpecialtyObjectView; reused
// pieces (otoscope/clinicReception/ultrasound/waitingdisplay/compcart/ibed/imonitor/
// ireception/ichair/icabinet/iplant) resolve on the shared chain.
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

// ─── SlitLamp — 세극등 현미경 (턱받침 + 조이스틱 본체) ──────────────────
export function SlitLamp({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={28} h={32}>
      <Svg viewBox="0 0 28 32" width={28 * S} height={32 * S}>
        <Ellipse cx={14} cy={27} rx={11} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 16 L26 16 L26 26 Q26 27 25 27 L3 27 Q2 27 2 26 Z" fill="#B7BEC6" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={16} width={24} height={3} fill="#CBD5E1" />
        <Rect x={5} y={8} width={2} height={8} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={21} y={8} width={2} height={8} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={4} y={6} width={20} height={2.5} rx={1} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Rect x={10} y={12} width={8} height={2} rx={1} fill="#E1E7EC" stroke={C} strokeWidth={0.3} />
        <Rect x={11} y={16.5} width={6} height={4} rx={1} fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={12} y={14.5} width={1.8} height={2.5} fill="#374151" />
        <Rect x={14.2} y={14.5} width={1.8} height={2.5} fill="#374151" />
        <Rect x={19} y={17} width={2} height={4} fill="#FBBF24" />
        <Circle cx={8} cy={21} r={1.6} fill="#5B6672" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

// ─── PhoropterStand — 검안기(포롭터) 아암 스탠드 ───────────────────────
export function PhoropterStand({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-8} w={24} h={36}>
      <Svg viewBox="0 0 24 36" width={24 * S} height={36 * S}>
        <Ellipse cx={14} cy={31.5} rx={8} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M3 4 L21 4 L21 12 L3 12 Z" fill="#475569" stroke={C} strokeWidth={0.5} />
        <Circle cx={8} cy={8} r={3.4} fill="#5B6672" stroke={C} strokeWidth={0.5} />
        <Circle cx={8} cy={8} r={1.4} fill="#0B1A22" />
        <Circle cx={16} cy={8} r={3.4} fill="#5B6672" stroke={C} strokeWidth={0.5} />
        <Circle cx={16} cy={8} r={1.4} fill="#0B1A22" />
        <Rect x={11} y={12} width={2} height={6} fill="#9CA3AF" />
        <Rect x={17} y={12} width={4} height={18} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={14} cy={31} rx={7} ry={2} fill="#8A929B" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── ENTTowerChair — 이비인후과 진료 유닛 (전동 체어 + 기구 타워) ───────
export function ENTTowerChair({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={42} h={48}>
      <Svg viewBox="0 0 42 48" width={42 * S} height={48 * S}>
        <Ellipse cx={12} cy={45} rx={10} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={33} cy={45} rx={6} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 22 L22 22 L22 36 Q22 38 20 38 L4 38 Q2 38 2 36 Z" fill="#3E6FA0" stroke={C} strokeWidth={0.7} />
        <Rect x={4} y={24} width={16} height={12} rx={2} fill="#5A8AC0" />
        <Path d="M2 4 L22 4 Q23 4 23 5 L23 22 L1 22 L1 5 Q1 4 2 4 Z" fill="#3E6FA0" stroke={C} strokeWidth={0.7} />
        <Rect x={4} y={6} width={16} height={14} rx={2.5} fill="#5A8AC0" />
        <Rect x={8} y={5} width={8} height={4} rx={2} fill="#7AA6D4" />
        <Line x1={1} y1={22} x2={23} y2={22} stroke={C} strokeWidth={0.5} opacity={0.5} />
        <Rect x={0} y={23} width={3} height={13} rx={1.2} fill="#2E5480" />
        <Rect x={21} y={23} width={3} height={13} rx={1.2} fill="#2E5480" />
        <Path d="M27 8 L39 8 Q40 8 40 9 L40 40 Q40 41 39 41 L28 41 Q27 41 27 40 L27 9 Q27 8 28 8 Z" fill="#5B6672" stroke={C} strokeWidth={0.7} />
        <Rect x={28} y={6} width={11} height={3} rx={1} fill="#6E7A86" />
        <Line x1={27} y1={9} x2={40} y2={9} stroke={C} strokeWidth={0.5} opacity={0.6} />
        <Rect x={29} y={11} width={9} height={6} rx={1} fill="#0F1A24" />
        <Rect x={30} y={12.2} width={7} height={1.2} fill="#22D3EE" />
        <Rect x={30} y={14.2} width={5} height={1} fill="#A7F3D0" />
        <Rect x={30} y={20} width={1.4} height={9} rx={0.6} fill="#9CA3AF" />
        <Rect x={33} y={20} width={1.4} height={7} rx={0.6} fill="#9CA3AF" />
        <Rect x={36} y={20} width={1.4} height={8} rx={0.6} fill="#9CA3AF" />
        <Rect x={29} y={31} width={9} height={6} rx={1} fill="#4B5563" />
      </Svg>
    </Box>
  );
}

// ─── VisionChart — 시력 검사표 (벽 조명 박스; Snellen 행은 shape로) ─────
export function VisionChart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={20}>
      <Svg viewBox="0 0 12 20" width={12 * S} height={20 * S}>
        <Rect x={1} y={1} width={10} height={18} rx={0.5} fill="#fff" stroke={C} strokeWidth={0.6} />
        {/* big-to-small rows suggested by decreasing dark bars */}
        <Rect x={4.6} y={3} width={2.8} height={2.8} fill={C} />
        <Rect x={3.4} y={8} width={1.6} height={1.8} fill={C} />
        <Rect x={6} y={8} width={1.6} height={1.8} fill={C} />
        {[3.6, 5.4, 7.2].map((bx, i) => <Rect key={i} x={bx} y={11.8} width={1} height={1.2} fill={C} />)}
        {[3.4, 4.7, 6.0, 7.3].map((bx, i) => <Rect key={'r' + i} x={bx} y={14.6} width={0.7} height={0.9} fill={C} />)}
        {[3.4, 4.5, 5.6, 6.7, 7.8].map((bx, i) => <Rect key={'s' + i} x={bx} y={16.9} width={0.5} height={0.7} fill={C} />)}
      </Svg>
    </Box>
  );
}

export function SpecialtyObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y } = object;
  switch (type) {
    case 'slitlamp': return <SlitLamp x={x} y={y} />;
    case 'phoropterstand': return <PhoropterStand x={x} y={y} />;
    case 'enttowerchair': return <ENTTowerChair x={x} y={y} />;
    case 'visionchart': return <VisionChart x={x} y={y} />;
    default: return null;
  }
}
