// Hemodialysis objects — RN-svg ports of interior-objects-dial2.jsx: dialysis
// machine (blood pump + dialyzer + touchscreen), dialysis recliner (AV-fistula arm
// board), RO water-treatment unit. Authored at ITILE=16, rendered at TILE px via S;
// Box maps handoff x*ITILE / top-N offsets 1:1. v13+ 2.5D ground shadow. Dispatched
// via DialObjectView; reused pieces (compcart/nursestation/sinkor/stadiometer/
// wastebin/imonitor/ireception/ichair/iplant) resolve on the shared chain.
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

// ─── DialysisMachine — 혈액투석기 (혈액펌프 + 다이알라이저 + 화면) ──────
export function DialysisMachine({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-18} w={24} h={52}>
      <Svg viewBox="0 0 24 52" width={24 * S} height={52 * S}>
        <Ellipse cx={12} cy={50} rx={8} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 6 L22 6 L22 47 Q22 48 21 48 L3 48 Q2 48 2 47 Z" fill="#8E99A4" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={6} width={20} height={2.6} fill="#AEB6BE" />
        <Rect x={4} y={9} width={16} height={10} rx={1} fill="#111827" stroke={C} strokeWidth={0.5} />
        <Rect x={5} y={10.2} width={14} height={7.6} fill="#0B1A22" />
        <Path d="M6 14 Q9 12.5 12 14 T18 14" fill="none" stroke="#F87171" strokeWidth={0.6} />
        <Rect x={6} y={15.5} width={8} height={1} fill="#22D3EE" />
        <Circle cx={8} cy={24} r={3.4} fill="#1F2937" stroke={C} strokeWidth={0.5} />
        <Circle cx={8} cy={24} r={1.2} fill="#DC2626" />
        <Rect x={7.4} y={20.6} width={1.2} height={3.4} fill="#7F1D1D" />
        <Rect x={15} y={21} width={3.4} height={12} rx={1.5} fill="#E4A94B" stroke={C} strokeWidth={0.5} />
        <Rect x={15.6} y={22} width={2.2} height={10} fill="#F1C56E" />
        <Path d="M11 24 Q15 22 15 25" fill="none" stroke="#DC2626" strokeWidth={0.8} />
        <Path d="M18 33 Q20 36 16 37" fill="none" stroke="#3B82F6" strokeWidth={0.8} />
        <Circle cx={8} cy={34} r={1.6} fill="#10B981" stroke={C} strokeWidth={0.3} />
        <Rect x={4} y={40} width={16} height={4} fill="#5B6672" />
        <Ellipse cx={6} cy={48} rx={2} ry={1.4} fill={C} />
        <Ellipse cx={18} cy={48} rx={2} ry={1.4} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── DialysisChair — 투석용 리클라이너 (AV-fistula 팔 지지대 + 담요) ────
export function DialysisChair({ x, y, occupied }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} offY={-4} w={38} h={50}>
      <Svg viewBox="0 0 38 50" width={38 * S} height={50 * S}>
        <Ellipse cx={19} cy={45.5} rx={15} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M8 34 L30 34 L30 42 L8 42 Z" fill="#6E9A82" stroke={C} strokeWidth={0.6} />
        <Path d="M8 42 L30 42 L30 44.5 Q30 45 29 45 L9 45 Q8 45 8 44.5 Z" fill="#3E6050" stroke={C} strokeWidth={0.6} />
        <Rect x={10} y={35.5} width={18} height={5.5} rx={2} fill="#8BB89E" />
        <Path d="M4 12 L34 12 L34 34 L4 34 Z" fill="#5E8A72" stroke={C} strokeWidth={0.7} />
        <Rect x={6} y={14} width={26} height={19} rx={2} fill="#7CA891" />
        <Path d="M19 14 L19 33" stroke="#6B9880" strokeWidth={0.5} />
        <Path d="M4 2 L34 2 Q35 2 35 3 L35 10 L3 10 L3 3 Q3 2 4 2 Z" fill="#5E8A72" stroke={C} strokeWidth={0.7} />
        <Rect x={6} y={3.5} width={26} height={6} rx={2.5} fill="#7CA891" />
        <Path d="M3 10 L35 10 L35 13 L3 13 Z" fill="#4C7460" stroke={C} strokeWidth={0.6} />
        <Rect x={12} y={1.5} width={14} height={3.5} rx={2} fill="#93BBA5" />
        <Rect x={34} y={16} width={4} height={12} rx={1.2} fill="#4C7460" stroke={C} strokeWidth={0.5} />
        <Rect x={0} y={14} width={4} height={22} rx={1.5} fill="#48697A" />
        {occupied && (
          <G>
            <Rect x={15.5} y={4} width={7} height={6} rx={2.6} fill="#FBD9C0" stroke={C} strokeWidth={0.3} />
            <Rect x={15.8} y={3.1} width={6.4} height={1.6} fill="#5B4636" />
            <Ellipse cx={19} cy={24} rx={9} ry={9} fill="#CFE0EA" opacity={0.6} />
            <Path d="M23 20 Q30 20 34 22" fill="none" stroke="#C0392B" strokeWidth={0.7} />
          </G>
        )}
      </Svg>
    </Box>
  );
}

// ─── ROWaterUnit — 역삼투압(RO) 수처리 장치 (트윈 멤브레인 + 제어 캐비닛) ─
export function ROWaterUnit({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-10} w={34} h={44}>
      <Svg viewBox="0 0 34 44" width={34 * S} height={44 * S}>
        <Ellipse cx={17} cy={41.5} rx={13} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={7} cy={5} rx={3} ry={1.5} fill="#D4E6EE" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={5} width={6} height={27} fill="#BFD8E4" stroke={C} strokeWidth={0.5} />
        <Rect x={5} y={6} width={1.6} height={24} fill="#DCEAF0" />
        <Ellipse cx={14} cy={5} rx={3} ry={1.5} fill="#C2D8E4" stroke={C} strokeWidth={0.4} />
        <Rect x={11} y={5} width={6} height={27} fill="#A7C7D8" stroke={C} strokeWidth={0.5} />
        <Path d="M19 14 L31 14 L31 32 Q31 33 30 33 L20 33 Q19 33 19 32 Z" fill="#8E99A4" stroke={C} strokeWidth={0.6} />
        <Rect x={19} y={9} width={12} height={5} fill="#A6B0BA" stroke={C} strokeWidth={0.5} />
        <Rect x={20.5} y={10} width={9} height={1.6} fill="#BBC4CC" />
        <Line x1={19} y1={14} x2={31} y2={14} stroke={C} strokeWidth={0.5} />
        <Rect x={20.5} y={16} width={9} height={4} fill="#0F1A24" />
        <Rect x={21} y={17} width={6} height={1} fill="#22D3EE" />
        <Circle cx={23} cy={24} r={1.8} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Circle cx={27.5} cy={24} r={1.8} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={32} width={27} height={4} rx={1} fill="#B7BEC6" stroke={C} strokeWidth={0.5} />
        <Rect x={7} y={30} width={14} height={2} fill="#9CA3AF" />
        <Ellipse cx={8} cy={37} rx={2.2} ry={1.5} fill={C} />
        <Ellipse cx={17} cy={37} rx={2.2} ry={1.5} fill={C} />
        <Ellipse cx={27} cy={37} rx={2.2} ry={1.5} fill={C} />
      </Svg>
    </Box>
  );
}

export function DialObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'dialysismachine': return <DialysisMachine x={x} y={y} />;
    case 'dialysischair': return <DialysisChair x={x} y={y} occupied={props?.occupied === true} />;
    case 'rowaterunit': return <ROWaterUnit x={x} y={y} />;
    default: return null;
  }
}
