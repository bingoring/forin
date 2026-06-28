// Operating-suite (OR & PACU) objects — faithful RN-svg ports of the handoff
// interior-objects-or2.jsx catalog plus the OR-native AnesthesiaMachine /
// StatusBoard (interior-or.jsx). Authored at ITILE=16, rendered at TILE px via S.
// `<text>` glyphs are replaced by shape equivalents. Dispatched via OrObjectView.
import type { ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;

function Box({ x, y, offX = 0, offY = 0, w, h, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S }}>{children}</View>
  );
}

// ─── BairHugger — patient-warming forced-air unit + hose + blanket ──
export function BairHugger({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={26} h={34}>
      <Svg viewBox="0 0 26 34" width={26 * S} height={34 * S}>
        <Path d="M20 8 Q26 6 24 1" fill="none" stroke="#BBD7E2" strokeWidth={3} />
        <Rect x={20} y={0} width={6} height={3} fill="#CFE6EE" stroke={C} strokeWidth={0.4} />
        <Path d="M2 8 L16 8 L17 10 L1 10 Z" fill="#3E7CA8" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={10} width={16} height={13} fill="#4F90BE" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={10.5} width={15} height={1.5} fill="#7DB4D4" />
        <Rect x={3} y={12} width={8} height={4} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={13.2} width={5} height={1.6} fill="#FACC15" />
        <Circle cx={13.5} cy={14} r={2} fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={17} width={11} height={4} fill="#1F2937" />
        <Rect x={3} y={17.6} width={11} height={2.6} fill="none" stroke="#6B7280" strokeWidth={0.4} strokeDasharray="1 1" />
        <Rect x={2} y={23} width={14} height={3} fill="#374151" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={4} cy={28} rx={2} ry={1.4} fill={C} />
        <Ellipse cx={14} cy={28} rx={2} ry={1.4} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── Bovie / ESU — electrosurgical generator + pencil + foot pedal ──
export function Bovie({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={16} h={36}>
      <Svg viewBox="0 0 16 36" width={16 * S} height={36 * S}>
        <Path d="M1 2 L15 2 L16 4 L0 4 Z" fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={0} y={4} width={16} height={13} fill="#5B6776" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={5.5} width={6} height={4} fill="#0F1A24" />
        <Rect x={2.5} y={6.5} width={3} height={2} fill="#FBBF24" />
        <Rect x={8.5} y={5.5} width={6} height={4} fill="#0F1A24" />
        <Rect x={9.5} y={6.5} width={3} height={2} fill="#22D3EE" />
        <Circle cx={4} cy={13} r={1.6} fill="#FBBF24" stroke={C} strokeWidth={0.3} />
        <Circle cx={11.5} cy={13} r={1.6} fill="#22D3EE" stroke={C} strokeWidth={0.3} />
        <Rect x={13} y={3} width={2} height={7} fill="#E5E7EB" stroke={C} strokeWidth={0.3} />
        <Rect x={13.4} y={2} width={1.2} height={2} fill="#EAB308" />
        <Path d="M14 10 Q17 13 14 16" fill="none" stroke={C} strokeWidth={0.5} />
        <Rect x={1} y={17} width={14} height={10} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={18} width={12} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={8} cy={30} rx={4} ry={1.6} fill="#FBBF24" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={3} cy={33} rx={2} ry={1.4} fill={C} />
        <Ellipse cx={13} cy={33} rx={2} ry={1.4} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── KickBucket — wheeled gauze-collection bucket (floor) ───────────
export function KickBucket({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={2} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
        <Ellipse cx={6} cy={4} rx={5.5} ry={2.3} fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={6} cy={3.6} rx={4.3} ry={1.6} fill="#9CA3AF" />
        <Path d="M2 4 L10 4 L9 9 L3 9 Z" fill="#DC2626" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={3} width={2.2} height={2} fill="#F8FAFC" stroke={C} strokeWidth={0.25} />
        <Rect x={6.5} y={3.4} width={2} height={1.8} fill="#E5E7EB" stroke={C} strokeWidth={0.25} />
        <Circle cx={3.5} cy={10} r={1.2} fill={C} />
        <Circle cx={8.5} cy={10} r={1.2} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── TimeoutBoard — wall timeout board (patient/site/abx) ───────────
export function TimeoutBoard({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} w={W} h={20}>
      <Svg viewBox={`0 0 ${W} 20`} width={W * S} height={20 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={20} fill="#E5E7EB" stroke={C} strokeWidth={0.6} />
        <Rect x={1.5} y={1.5} width={W - 3} height={17} fill="#fff" />
        <Rect x={1.5} y={1.5} width={W - 3} height={4} fill="#DC2626" />
        <Rect x={3} y={2.6} width={w * 7} height={1.6} fill="#fff" />
        <Rect x={3} y={7.5} width={w * 9} height={1.3} fill="#3B82F6" />
        <Rect x={3} y={10.5} width={w * 7} height={1.3} fill={C} opacity={0.6} />
        <Rect x={W - 9} y={10} width={2.2} height={2.2} fill="#16A34A" />
        <Rect x={3} y={13.5} width={w * 6} height={1.3} fill={C} opacity={0.6} />
        <Rect x={W - 9} y={13} width={2.4} height={2.4} fill="#fff" stroke={C} strokeWidth={0.5} />
        <Path d={`M${W - 8.6} 14.2 L${W - 7.8} 15 L${W - 6.6} 13.4`} fill="none" stroke="#16A34A" strokeWidth={0.7} />
      </Svg>
    </Box>
  );
}

// ─── RoboticConsole — robotic surgery control console ───────────────
export function RoboticConsole({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-8} w={36} h={42}>
      <Svg viewBox="0 0 36 42" width={36 * S} height={42 * S}>
        <Rect x={14} y={2} width={8} height={10} fill="#475569" stroke={C} strokeWidth={0.5} />
        <Path d="M8 8 L28 8 L25 16 L11 16 Z" fill="#1F2937" stroke={C} strokeWidth={0.5} />
        <Rect x={13} y={10} width={4} height={3} fill="#0B1620" />
        <Rect x={19} y={10} width={4} height={3} fill="#0B1620" />
        <Rect x={9} y={8} width={18} height={1.4} fill="#374151" />
        <Path d="M6 18 L30 18 L32 24 L4 24 Z" fill="#9CA3AF" stroke={C} strokeWidth={0.5} />
        <Rect x={9} y={19.5} width={4} height={3} fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={23} y={19.5} width={4} height={3} fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={14} y={24} width={8} height={9} fill="#6B7280" stroke={C} strokeWidth={0.5} />
        <Rect x={8} y={33} width={20} height={3} fill="#374151" stroke={C} strokeWidth={0.4} />
        <Rect x={11} y={33.4} width={4} height={2} fill="#FBBF24" />
        <Rect x={21} y={33.4} width={4} height={2} fill="#22D3EE" />
        <Ellipse cx={18} cy={39} rx={12} ry={2.4} fill="#4B5563" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── LapTower — laparoscopic monitor tower (scope view + light + CO2) ─
export function LapTower({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-18} w={24} h={56}>
      <Svg viewBox="0 0 24 56" width={24 * S} height={56 * S}>
        <Rect x={1} y={0} width={22} height={15} fill="#111827" stroke={C} strokeWidth={0.6} />
        <Rect x={2.5} y={1.5} width={19} height={12} fill="#3A1414" />
        <Ellipse cx={12} cy={7.5} rx={7} ry={5} fill="#7C2D2D" />
        <Ellipse cx={10} cy={7} rx={2.5} ry={3.5} fill="#A83A3A" />
        <Rect x={11} y={3} width={1.5} height={9} fill="#D9C8A8" />
        <Rect x={3} y={16} width={18} height={9} fill="#374151" stroke={C} strokeWidth={0.5} />
        <Rect x={4.5} y={17.5} width={15} height={3} fill="#0F1A24" />
        <Rect x={5} y={18} width={6} height={2} fill="#22D3EE" />
        <Circle cx={17} cy={22.5} r={1.4} fill="#A7F3D0" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={26} width={18} height={6} fill="#5B6776" stroke={C} strokeWidth={0.5} />
        <Rect x={4.5} y={27.5} width={6} height={3} fill="#0F1A24" />
        <Rect x={5.2} y={28.3} width={4.5} height={1.6} fill="#FBBF24" />
        <Circle cx={16} cy={29} r={1.6} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={32} width={18} height={13} fill="#9CA3AF" stroke={C} strokeWidth={0.5} />
        <Rect x={4.5} y={33.5} width={15} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={4.5} y={38} width={15} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={5} cy={48} rx={2.2} ry={1.6} fill={C} />
        <Ellipse cx={19} cy={48} rx={2.2} ry={1.6} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── CO2Insufflator — CO2 insufflator + green tank ──────────────────
export function CO2Insufflator({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} w={14} h={24}>
      <Svg viewBox="0 0 14 24" width={14 * S} height={24 * S}>
        <Path d="M1 2 L13 2 L14 4 L0 4 Z" fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={0} y={4} width={14} height={11} fill="#5B6776" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={5.5} width={7} height={3.5} fill="#0F1A24" />
        <Rect x={2.5} y={6.3} width={4} height={1.8} fill="#22D3EE" />
        <Circle cx={11} cy={7.5} r={2} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={1.5} y={10} width={11} height={3.5} fill="#1F2937" />
        <Ellipse cx={2.5} cy={16} rx={2} ry={0.8} fill="#15803D" stroke={C} strokeWidth={0.3} />
        <Rect x={0.5} y={16} width={4} height={6} fill="#16A34A" stroke={C} strokeWidth={0.3} />
        <Rect x={6} y={15} width={8} height={7} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── ScrubDispenser — wall antiseptic bottles + brush/towel box ─────
export function ScrubDispenser({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} w={14} h={24}>
      <Svg viewBox="0 0 14 24" width={14 * S} height={24 * S}>
        <Rect x={0} y={0} width={14} height={24} fill="#D6DCE2" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={2} width={4} height={8} fill="#F9C9D6" stroke={C} strokeWidth={0.4} />
        <Rect x={2.4} y={3} width={1.2} height={6} fill="#FBDCE5" />
        <Rect x={1} y={10} width={6} height={1.6} fill="#9CA3AF" />
        <Rect x={8} y={2} width={4} height={8} fill="#B45309" stroke={C} strokeWidth={0.4} />
        <Rect x={8.4} y={3} width={1.2} height={6} fill="#D97706" />
        <Rect x={7} y={10} width={6} height={1.6} fill="#9CA3AF" />
        <Rect x={1.5} y={13} width={11} height={9} fill="#fff" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={13} width={11} height={2} fill="#3B82F6" />
        <Rect x={3} y={16} width={8} height={2} fill="#E5E7EB" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={19} width={4} height={2.4} fill="#16A34A" />
      </Svg>
    </Box>
  );
}

// ─── ScrubTimer — wall digital scrub timer ──────────────────────────
export function ScrubTimer({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={1} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
        <Rect x={0} y={0} width={12} height={12} fill="#1F2937" stroke={C} strokeWidth={0.6} />
        <Rect x={1.5} y={2} width={9} height={5} fill="#0B2A3A" />
        <Rect x={2.5} y={3.5} width={7} height={2.2} fill="#22D3EE" />
        <Rect x={2} y={8.5} width={8} height={1.6} fill="#16A34A" />
      </Svg>
    </Box>
  );
}

// ─── ConsentClipboard — surgical consent clipboard (tabletop) ───────
export function ConsentClipboard({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={3} w={10} h={12}>
      <Svg viewBox="0 0 10 12" width={10 * S} height={12 * S}>
        <Rect x={1} y={1} width={8} height={11} fill="#A88862" stroke={C} strokeWidth={0.4} />
        <Rect x={1.6} y={2} width={6.8} height={9} fill="#FEFCF2" stroke={C} strokeWidth={0.3} />
        <Rect x={3.5} y={0.4} width={3} height={1.6} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={2.4} y={3.4} width={5} height={0.5} fill={C} opacity={0.5} />
        <Rect x={2.4} y={4.6} width={5} height={0.5} fill={C} opacity={0.5} />
        <Rect x={2.4} y={5.8} width={4} height={0.5} fill={C} opacity={0.5} />
        <Rect x={2.4} y={9} width={4} height={0.5} fill={C} />
        <Path d="M2.6 8.6 Q3.4 7.8 4.2 8.6 T5.8 8.6" fill="none" stroke="#1E3A8A" strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── SoiledCart — sealed contaminated-instrument transport cart ─────
export function SoiledCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={20} h={28}>
      <Svg viewBox="0 0 20 28" width={20 * S} height={28 * S}>
        <Path d="M2 2 L18 2 L19 5 L1 5 Z" fill="#8A929B" stroke={C} strokeWidth={0.5} />
        <Rect x={1} y={5} width={18} height={17} fill="#A8AEB6" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={5.5} width={2} height={16} fill="#C2C7CE" />
        <Rect x={6} y={9} width={8} height={8} fill="#FACC15" stroke={C} strokeWidth={0.4} />
        {/* biohazard mark */}
        <Circle cx={10} cy={13.5} r={1.7} fill="none" stroke={C} strokeWidth={0.5} />
        <Circle cx={10} cy={13.5} r={0.7} fill={C} />
        <Circle cx={10} cy={11.6} r={1} fill="none" stroke={C} strokeWidth={0.5} />
        <Circle cx={8.4} cy={14.4} r={1} fill="none" stroke={C} strokeWidth={0.5} />
        <Circle cx={11.6} cy={14.4} r={1} fill="none" stroke={C} strokeWidth={0.5} />
        <Rect x={9} y={5} width={2} height={2} fill="#4B5563" />
        <Ellipse cx={4} cy={24} rx={2.4} ry={1.7} fill={C} />
        <Ellipse cx={16} cy={24} rx={2.4} ry={1.7} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── ORBoomMonitor — ceiling boom surgical display (scope view) ─────
export function ORBoomMonitor({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} offY={-6} w={W} h={26}>
      <Svg viewBox={`0 0 ${W} 26`} width={W * S} height={26 * S} preserveAspectRatio="none">
        <Rect x={w * 8 - 1} y={0} width={2} height={5} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={1} y={5} width={W - 2} height={18} fill="#111827" stroke={C} strokeWidth={0.6} />
        <Rect x={2.5} y={6.5} width={W - 5} height={15} fill="#3A1414" />
        <Ellipse cx={w * 8} cy={14} rx={w * 5} ry={6} fill="#7C2D2D" />
        <Ellipse cx={w * 8 - 3} cy={13} rx={w * 1.6} ry={4} fill="#A83A3A" />
        <Rect x={w * 8 - 0.5} y={8} width={1.5} height={11} fill="#D9C8A8" />
        <Rect x={3} y={7} width={w * 5} height={1.4} fill="#22D3EE" opacity={0.6} />
      </Svg>
    </Box>
  );
}

// ─── CArm — mobile C-arm fluoroscopy unit ───────────────────────────
export function CArm({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-10} w={36} h={46}>
      <Svg viewBox="0 0 36 46" width={36 * S} height={46 * S}>
        <Path d="M10 6 A16 16 0 1 0 10 38" fill="none" stroke="#CBD5E1" strokeWidth={4} />
        <Path d="M10 6 A16 16 0 1 0 10 38" fill="none" stroke={C} strokeWidth={0.6} />
        <Rect x={6} y={2} width={10} height={6} fill="#94A3B8" stroke={C} strokeWidth={0.5} />
        <Rect x={6} y={36} width={10} height={6} fill="#6B7280" stroke={C} strokeWidth={0.5} />
        <Rect x={22} y={18} width={10} height={4} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={30} y={8} width={5} height={32} fill="#B7BEC6" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={32} cy={43} rx={5} ry={2} fill="#4B5563" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── AnesthesiaMachine — screen + knobs + gas cylinders + cart ──────
export function AnesthesiaMachine({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-20} w={24} h={42}>
      <Svg viewBox="0 0 24 42" width={24 * S} height={42 * S}>
        <Path d="M2 1 L22 1 L23 3 L1 3 Z" fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={3} width={22} height={13} fill="#374151" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={5} width={18} height={9} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={6} width={16} height={1} fill="#22D3EE" />
        <Rect x={4} y={8} width={16} height={1} fill="#FACC15" />
        <Rect x={4} y={10} width={12} height={1} fill="#10B981" />
        <Rect x={19} y={14} width={3} height={2} fill="#94A3B8" stroke={C} strokeWidth={0.3} />
        <Path d="M22 15 Q24 17 22 20" fill="none" stroke="#94A3B8" strokeWidth={1.5} />
        <Rect x={1} y={16} width={22} height={1} fill="#1F2937" />
        <Rect x={1} y={17} width={22} height={6} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Circle cx={5} cy={20} r={1.5} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        <Circle cx={10} cy={20} r={1.5} fill="#3B82F6" stroke={C} strokeWidth={0.3} />
        <Circle cx={15} cy={20} r={1.5} fill="#10B981" stroke={C} strokeWidth={0.3} />
        <Circle cx={20} cy={20} r={1.5} fill="#FACC15" stroke={C} strokeWidth={0.3} />
        <Rect x={2} y={24} width={20} height={5} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={25} width={6} height={3} fill="#0F1A24" />
        <Rect x={3.8} y={25.8} width={4} height={1.4} fill="#10B981" />
        <Rect x={11} y={25} width={6} height={3} fill="#0F1A24" />
        <Rect x={11.8} y={25.8} width={4} height={1.4} fill="#FACC15" />
        <Ellipse cx={2.5} cy={30} rx={2} ry={0.8} fill="#15803D" stroke={C} strokeWidth={0.3} />
        <Rect x={0.5} y={30} width={4} height={6} fill="#16A34A" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={2.5} cy={36} rx={2} ry={0.8} fill="#15803D" stroke={C} strokeWidth={0.3} />
        <Rect x={1} y={29} width={22} height={9} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Rect x={5} y={30} width={17} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={5} y={34} width={17} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={3} cy={40} rx={2} ry={1.5} fill={C} />
        <Ellipse cx={21} cy={40} rx={2} ry={1.5} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── StatusBoard — OR wall status board (TIME / ELAPSED / NEXT case) ─
export function StatusBoard({ x, y, w = 6 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  const H = 22;
  const col = W / 3;
  return (
    <Box x={x} y={y} w={W} h={H}>
      <Svg viewBox={`0 0 ${W} ${H}`} width={W * S} height={H * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={H} fill="#0F1A24" stroke={C} strokeWidth={2.5} />
        <Line x1={col} y1={1} x2={col} y2={H - 1} stroke={C} strokeWidth={1} opacity={0.6} />
        <Line x1={col * 2} y1={1} x2={col * 2} y2={H - 1} stroke={C} strokeWidth={1} opacity={0.6} />
        {/* TIME (cyan) */}
        <Rect x={3} y={3} width={col - 8} height={1.6} fill="#94A3B8" />
        <Rect x={3} y={7} width={col - 10} height={4} fill="#22D3EE" />
        {/* ELAPSED (yellow) */}
        <Rect x={col + 3} y={3} width={col - 8} height={1.6} fill="#94A3B8" />
        <Rect x={col + 3} y={7} width={col - 12} height={4} fill="#FACC15" />
        {/* NEXT case (green) */}
        <Rect x={col * 2 + 3} y={3} width={col - 8} height={1.6} fill="#94A3B8" />
        <Rect x={col * 2 + 3} y={7} width={col - 6} height={2.4} fill="#10B981" />
        <Rect x={col * 2 + 3} y={11} width={col - 9} height={2.4} fill="#10B981" opacity={0.7} />
      </Svg>
    </Box>
  );
}

/** Render an OR-suite object by type. null if unknown. */
export function OrObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'bairhugger': return <BairHugger x={x} y={y} />;
    case 'bovie': return <Bovie x={x} y={y} />;
    case 'kickbucket': return <KickBucket x={x} y={y} />;
    case 'timeoutboard': return <TimeoutBoard x={x} y={y} w={typeof props?.w === 'number' ? props.w : 3} />;
    case 'roboticconsole': return <RoboticConsole x={x} y={y} />;
    case 'laptower': return <LapTower x={x} y={y} />;
    case 'co2insufflator': return <CO2Insufflator x={x} y={y} />;
    case 'scrubdispenser': return <ScrubDispenser x={x} y={y} />;
    case 'scrubtimer': return <ScrubTimer x={x} y={y} />;
    case 'consentclipboard': return <ConsentClipboard x={x} y={y} />;
    case 'soiledcart': return <SoiledCart x={x} y={y} />;
    case 'orboommonitor': return <ORBoomMonitor x={x} y={y} w={typeof props?.w === 'number' ? props.w : 2} />;
    case 'carm': return <CArm x={x} y={y} />;
    case 'anesthesia': return <AnesthesiaMachine x={x} y={y} />;
    case 'statusboard': return <StatusBoard x={x} y={y} w={typeof props?.w === 'number' ? props.w : 6} />;
    default: return null;
  }
}
