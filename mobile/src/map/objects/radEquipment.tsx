// Radiology objects — RN-svg ports of interior-objects-rad2.jsx: CT donut gantry,
// large-bore MRI, ceiling X-ray tube + wall Bucky, shielded control console, lead
// apron rack. Authored at ITILE=16, rendered at TILE px via S; Box maps handoff
// x*ITILE / top-N offsets 1:1. v13+ 2.5D ground shadow. SVG <text> (⚠ MAGNET ON)
// → shape block. Dispatched via RadObjectView; reused pieces (pacsviewer/
// waitingdisplay/handrail/vitals/ibed/imonitor/ireception/ichair/glass/tint/iplant)
// resolve on the shared chain.
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

// ─── CTScanner — CT 도넛형 갠트리 + 환자 테이블 ───────────────────────
export function CTScanner({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-8} w={64} h={54}>
      <Svg viewBox="0 0 64 54" width={64 * S} height={54 * S}>
        <Ellipse cx={32} cy={51} rx={29} ry={3} fill="rgba(0,0,0,0.17)" />
        <Path d="M6 6 L58 6 Q62 6 62 12 L62 30 Q62 34 58 34 L6 34 Q2 34 2 30 L2 12 Q2 6 6 6 Z" fill="#D2DAE0" stroke={C} strokeWidth={1} />
        <Path d="M6 6 L58 6 Q62 6 62 12 L62 14 L2 14 L2 12 Q2 6 6 6 Z" fill="#E4EAEF" />
        <Ellipse cx={32} cy={20} rx={20} ry={14} fill="#B4BEC6" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={32} cy={20} rx={15} ry={10.5} fill="#98A2AA" />
        <Ellipse cx={32} cy={20} rx={10.5} ry={7.5} fill="#3A434C" />
        <Ellipse cx={32} cy={20} rx={7} ry={5} fill="#12181E" />
        <Ellipse cx={32} cy={20} rx={10.5} ry={7.5} fill="none" stroke="#22D3EE" strokeWidth={0.7} opacity={0.8} />
        <Ellipse cx={32} cy={13.5} rx={9} ry={1.8} fill="#67E8F9" opacity={0.45} />
        <Circle cx={12} cy={20} r={1.2} fill="#22C55E" />
        <Circle cx={52} cy={20} r={1.2} fill="#EF4444" />
        <Path d="M2 30 L62 30" stroke={C} strokeWidth={0.5} opacity={0.5} />
        <Path d="M24 32 L40 32 L40 50 Q40 51 39 51 L25 51 Q24 51 24 50 Z" fill="#C7D0D8" stroke={C} strokeWidth={0.7} />
        <Rect x={25.5} y={33.5} width={13} height={16} rx={1.5} fill="#E1E7EC" />
        <Rect x={27} y={35} width={10} height={2} rx={1} fill="#B7C0C8" />
        <Rect x={29} y={49} width={6} height={3} fill="#8A929B" />
      </Svg>
    </Box>
  );
}

// ─── MRIScanner — 대형 MRI (긴 보어 자석 + 환자 테이블 + 안전존) ───────
export function MRIScanner({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-8} w={70} h={51}>
      <Svg viewBox="0 0 70 51" width={70 * S} height={51 * S}>
        <Ellipse cx={35} cy={47} rx={32} ry={3} fill="rgba(0,0,0,0.18)" />
        <Path d="M4 6 L66 6 L66 38 Q66 42 62 42 L8 42 Q4 42 4 38 Z" fill="#C6D0D8" stroke={C} strokeWidth={1} />
        <Rect x={4} y={6} width={62} height={20} rx={7} fill="#DCE4EA" />
        <Path d="M4 26 L66 26" stroke={C} strokeWidth={0.5} opacity={0.5} />
        <Rect x={10} y={30} width={14} height={8} rx={1} fill="#B4BEC6" />
        {[0, 1, 2, 3].map((i) => <Line key={i} x1={11} y1={31.5 + i * 1.7} x2={23} y2={31.5 + i * 1.7} stroke="#9AA6AE" strokeWidth={0.5} />)}
        <Rect x={46} y={30} width={14} height={8} rx={1} fill="#B4BEC6" />
        {[0, 1, 2, 3].map((i) => <Line key={'r' + i} x1={47} y1={31.5 + i * 1.7} x2={59} y2={31.5 + i * 1.7} stroke="#9AA6AE" strokeWidth={0.5} />)}
        <Ellipse cx={35} cy={21} rx={15} ry={15} fill="#AEB8C0" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={35} cy={21} rx={12} ry={12} fill="#8A96A0" />
        <Ellipse cx={35} cy={21} rx={9} ry={9} fill="#3A434C" />
        <Ellipse cx={35} cy={21} rx={6.5} ry={6.5} fill="#1B2128" />
        <Ellipse cx={35} cy={21} rx={6.5} ry={6.5} fill="none" stroke="#3B82F6" strokeWidth={0.8} opacity={0.8} />
        <Ellipse cx={35} cy={14.5} rx={8} ry={1.8} fill="#60A5FA" opacity={0.5} />
        <Rect x={29} y={21} width={12} height={28} rx={1.5} fill="#B7C0C8" stroke={C} strokeWidth={0.6} />
        <Rect x={30.5} y={24} width={9} height={23} fill="#D2D9DE" />
        <Rect x={31.5} y={42} width={7} height={3.5} fill="#9FB6C8" />
        <Rect x={4} y={44} width={62} height={1.6} fill="#3B82F6" opacity={0.4} />
        <Rect x={30} y={44.2} width={10} height={1.2} fill="#1E3A8A" opacity={0.55} />
      </Svg>
    </Box>
  );
}

// ─── XrayUnit — 천장형 X선 튜브 암 + 벽 부착 버키 (Bucky) + 촬영 테이블 ─
export function XrayUnit({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-8} w={42} h={44}>
      <Svg viewBox="0 0 42 44" width={42 * S} height={44 * S}>
        <Ellipse cx={21} cy={42} rx={16} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M3 18 L33 18 L33 36 Q33 38 31 38 L5 38 Q3 38 3 36 Z" fill="#C7D0D8" stroke={C} strokeWidth={0.8} />
        <Rect x={4} y={19.5} width={28} height={14} rx={2} fill="#E1E7EC" />
        <Rect x={6} y={21} width={24} height={2} fill="#D2DAE0" />
        <Line x1={3} y1={33.5} x2={33} y2={33.5} stroke={C} strokeWidth={0.5} />
        <Rect x={15} y={38} width={6} height={3} fill="#8A929B" />
        <Rect x={6} y={0} width={30} height={2.4} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={18} y={2.4} width={2.4} height={6} fill="#B7BEC6" stroke={C} strokeWidth={0.3} />
        <Rect x={12} y={8} width={14} height={4} fill="#727E8C" stroke={C} strokeWidth={0.5} />
        <Path d="M12 12 L26 12 L25 16 L13 16 Z" fill="#5B6672" stroke={C} strokeWidth={0.5} />
        <Rect x={17} y={16} width={4} height={2.2} fill="#374151" />
        <Path d="M18 18 L15 24 M20 18 L23 24" stroke="#FBBF24" strokeWidth={0.5} opacity={0.45} />
        <Rect x={35} y={12} width={5} height={22} rx={1} fill="#AEB6BE" stroke={C} strokeWidth={0.5} />
        <Rect x={34} y={18} width={7} height={9} rx={1} fill="#E1E7EC" stroke={C} strokeWidth={0.5} />
      </Svg>
    </Box>
  );
}

// ─── ControlConsole — 촬영 제어 콘솔 (납유리 차폐창 + 듀얼 모니터) ──────
export function ControlConsole({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={38} h={32}>
      <Svg viewBox="0 0 38 32" width={38 * S} height={32 * S}>
        <Rect x={2} y={26} width={34} height={4} rx={1.5} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 12 L36 12 L36 26 Q36 27 35 27 L3 27 Q2 27 2 26 Z" fill="#9BA2AB" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={12} width={34} height={4} fill="#B0B7BF" />
        <Rect x={2} y={1} width={34} height={11} rx={1} fill="#BFE0EA" fillOpacity={0.55} stroke={C} strokeWidth={0.6} />
        <Line x1={13} y1={1} x2={13} y2={12} stroke={C} strokeWidth={0.4} opacity={0.5} />
        <Line x1={25} y1={1} x2={25} y2={12} stroke={C} strokeWidth={0.4} opacity={0.5} />
        <Rect x={3} y={2.5} width={10} height={2.5} fill="#FFFFFF" opacity={0.35} />
        <Rect x={6} y={13.5} width={10} height={7} fill="#111827" stroke={C} strokeWidth={0.5} />
        <Rect x={7} y={14.5} width={8} height={5} fill="#0B1A22" />
        <Rect x={8} y={15.4} width={6} height={1} fill="#22D3EE" />
        <Rect x={22} y={13.5} width={10} height={7} fill="#111827" stroke={C} strokeWidth={0.5} />
        <Rect x={23} y={14.5} width={8} height={5} fill="#0B1220" />
        <Rect x={24} y={15.4} width={4} height={3} fill="#9FB6C8" />
        <Rect x={12} y={22} width={14} height={2.6} rx={0.5} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
        <Circle cx={30} cy={23} r={1.6} fill="#DC2626" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── LeadApronRack — 납 방호복 걸이대 ─────────────────────────────────
export function LeadApronRack({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={22} h={30}>
      <Svg viewBox="0 0 22 30" width={22 * S} height={30 * S}>
        <Ellipse cx={11} cy={28.5} rx={8} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={2} width={18} height={2} rx={1} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={0.5} width={1.4} height={27} fill="#B7BEC6" />
        <Rect x={16.6} y={0.5} width={1.4} height={27} fill="#B7BEC6" />
        <Path d="M5 4 Q8 3 11 4 L11.5 18 Q8 20 4.5 18 Z" fill="#3E6FA0" stroke={C} strokeWidth={0.5} />
        <Path d="M6 6 L10 6" stroke="#5A8AC0" strokeWidth={0.6} />
        <Path d="M11.5 4 Q14.5 3 17.5 4 L18 16 Q14.5 18 11 16 Z" fill="#5B7C4A" stroke={C} strokeWidth={0.5} />
        <Path d="M12.5 6 L16.5 6" stroke="#7BA45E" strokeWidth={0.6} />
        <Ellipse cx={11} cy={26.5} rx={6} ry={1.4} fill="#6B7280" />
      </Svg>
    </Box>
  );
}

export function RadObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y } = object;
  switch (type) {
    case 'ctscanner': return <CTScanner x={x} y={y} />;
    case 'mriscanner': return <MRIScanner x={x} y={y} />;
    case 'xrayunit': return <XrayUnit x={x} y={y} />;
    case 'controlconsole': return <ControlConsole x={x} y={y} />;
    case 'leadapronrack': return <LeadApronRack x={x} y={y} />;
    default: return null;
  }
}
