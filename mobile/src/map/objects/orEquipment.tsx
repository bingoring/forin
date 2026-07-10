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
  const sil = 'M2 8 Q1 8 1 9 L1 25 Q1 26 2 26 L16 26 Q17 26 17 25 L17 9 Q17 8 16 8 Z';
  return (
    <Box x={x} y={y} offY={-4} w={25.6} h={33.6}>
      <Svg viewBox="0 0 26 34" width={26 * S} height={34 * S}>
        <Ellipse cx={9.0} cy={28.5} rx={8.5} ry={2.9} fill="rgba(0,0,0,0.16)" />
        <Path d="M17 9 Q24 7 23 11 Q22 15 25 16" fill="none" stroke="#BBD7E2" strokeWidth={2.6} strokeLinecap="round" />
        <Ellipse cx={16} cy={9} rx={1.6} ry={1} fill="#9CA3AF" stroke={C} strokeWidth={0.35} />
        <Path d={sil} fill="#3E7CA8" />
        <Path d="M2 8 Q1 8 1 9 L1 14 L17 14 L17 9 Q17 8 16 8 Z" fill="#5A9AC6" />
        <Circle cx={13} cy={11} r={1.8} fill="#CBD5E1" stroke={C} strokeWidth={0.35} />
        <Line x1={1} y1={14} x2={17} y2={14} stroke={C} strokeWidth={0.55} />
        <Rect x={2.5} y={15} width={8} height={4} rx={0.5} fill="#0F1A24" />
        <Rect x={4.5} y={16.4} width={4} height={1.6} fill="#FACC15" />
        <Rect x={2.5} y={20} width={12} height={3.4} rx={0.3} fill="#1F2937" />
        <Rect x={2.5} y={20.6} width={12} height={2.2} fill="none" stroke="#6B7280" strokeWidth={0.4} strokeDasharray="1 1" />
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.65} />
        <Ellipse cx={4} cy={27.5} rx={2} ry={1.4} fill="#2C3239" />
        <Ellipse cx={14} cy={27.5} rx={2} ry={1.4} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

// ─── Bovie / ESU — v11 2.5D: top face (pencil holster) + front control panel ──
export function Bovie({ x, y }: { x: number; y: number }) {
  const sil = 'M2 2 Q1 2 1 3 L1 24 Q1 25 2 25 L18 25 Q19 25 19 24 L19 3 Q19 2 18 2 Z';
  return (
    <Box x={x} y={y} offY={-4} w={20.8} h={30.4}>
      <Svg viewBox="0 0 20 30" width={20.8 * S} height={30.4 * S}>
        <Ellipse cx={10.0} cy={28.7} rx={6.8} ry={2.3} fill="rgba(0,0,0,0.16)" />
        <Path d={sil} fill="#54606C" />
        {/* TOP face — bovie pencil in holster */}
        <Path d="M2 2 Q1 2 1 3 L1 11 L19 11 L19 3 Q19 2 18 2 Z" fill="#6B7580" />
        <Rect x={14.5} y={3.5} width={2} height={6} rx={1} fill="#E5E7EB" stroke={C} strokeWidth={0.4} />
        <Rect x={14.8} y={3} width={1.4} height={1.6} fill="#EAB308" />
        <Path d="M16.5 9 Q20 12 16.5 16" fill="none" stroke={C} strokeWidth={0.5} />
        <Line x1={1} y1={11} x2={19} y2={11} stroke={C} strokeWidth={0.6} />
        {/* viewer-facing panel — cut/coag displays (blocks) + dials */}
        <Rect x={2.5} y={12.5} width={6} height={4} rx={0.5} fill="#0F1A24" />
        <Rect x={3.5} y={13.3} width={4} height={2.4} fill="#FBBF24" />
        <Rect x={11.5} y={12.5} width={6} height={4} rx={0.5} fill="#0F1A24" />
        <Rect x={12.5} y={13.3} width={4} height={2.4} fill="#22D3EE" />
        <Circle cx={6} cy={21} r={2.2} fill="#FBBF24" stroke={C} strokeWidth={0.4} />
        <Line x1={6} y1={21} x2={7.4} y2={19.8} stroke={C} strokeWidth={0.4} />
        <Circle cx={14} cy={21} r={2.2} fill="#22D3EE" stroke={C} strokeWidth={0.4} />
        <Line x1={14} y1={21} x2={15.4} y2={19.8} stroke={C} strokeWidth={0.4} />
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={4} cy={26.5} rx={1.8} ry={1.4} fill="#2C3239" />
        <Ellipse cx={16} cy={26.5} rx={1.8} ry={1.4} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

// ─── KickBucket — wheeled gauze-collection bucket (floor) ───────────
export function KickBucket({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={2} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
        <Ellipse cx={6.0} cy={11.0} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
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

// ─── RoboticConsole — v11 2.5D: top face (viewport hood) + front armrest console ─
export function RoboticConsole({ x, y }: { x: number; y: number }) {
  const sil = 'M6 6 Q4 6 4 8 L4 34 Q4 36 6 36 L30 36 Q32 36 32 34 L32 8 Q32 6 30 6 Z';
  return (
    <Box x={x} y={y} offY={-8} w={35.2} h={41.6}>
      <Svg viewBox="0 0 36 42" width={35.2 * S} height={41.6 * S}>
        <Ellipse cx={18.0} cy={38.9} rx={12.2} ry={4.1} fill="rgba(0,0,0,0.16)" />
        <Path d={sil} fill="#8A929B" />
        {/* TOP face — binocular viewport hood from above */}
        <Path d="M6 6 Q4 6 4 8 L4 17 L32 17 L32 8 Q32 6 30 6 Z" fill="#A6ADB5" />
        <Path d="M10 8 L26 8 L24 14 L12 14 Z" fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Rect x={13} y={9.4} width={4} height={3} fill="#0B1620" />
        <Rect x={19} y={9.4} width={4} height={3} fill="#0B1620" />
        <Line x1={4} y1={17} x2={32} y2={17} stroke={C} strokeWidth={0.6} />
        {/* viewer-facing armrest console + hand controls */}
        <Rect x={6} y={18.5} width={24} height={6} rx={1} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
        <Rect x={9} y={19.6} width={4} height={3.4} rx={0.5} fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={23} y={19.6} width={4} height={3.4} rx={0.5} fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={14} y={25} width={8} height={8} fill="#727E8C" />
        {/* foot-pedal tray on the floor in front */}
        <Path d="M8 33 L28 33 L30 36.5 L6 36.5 Z" fill="#374151" stroke={C} strokeWidth={0.4} />
        <Rect x={11} y={33.8} width={4} height={2} fill="#FBBF24" />
        <Rect x={21} y={33.8} width={4} height={2} fill="#22D3EE" />
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.7} />
      </Svg>
    </Box>
  );
}

// ─── LapTower — v11 2.5D: viewer-facing scope monitor + cabinet (top cap + modules) ─
export function LapTower({ x, y }: { x: number; y: number }) {
  const cab = 'M3.5 16 L20.5 16 L20.5 45 Q20.5 45.6 20 45.6 L4 45.6 Q3.5 45.6 3.5 45 Z';
  return (
    <Box x={x} y={y} offY={-18} w={24} h={54.4}>
      <Svg viewBox="0 0 24 56" width={24 * S} height={54.4 * S}>
        <Ellipse cx={12.0} cy={48.5} rx={9} ry={3} fill="rgba(0,0,0,0.16)" />
        {/* viewer-facing endoscopy monitor + top bezel cap */}
        <Path d="M2 0.4 L22 0.4 L23 1.8 L1 1.8 Z" fill="#2C333B" />
        <Rect x={1} y={1.8} width={22} height={13.5} fill="#111827" stroke={C} strokeWidth={0.6} />
        <Rect x={2.5} y={3} width={19} height={11} rx={0.4} fill="#3A1414" />
        <Ellipse cx={12} cy={8.5} rx={7} ry={5} fill="#7C2D2D" />
        <Ellipse cx={10} cy={8} rx={2.5} ry={3.5} fill="#A83A3A" />
        <Rect x={11} y={4} width={1.5} height={9} fill="#D9C8A8" />
        {/* cabinet silhouette + top cap face */}
        <Path d={cab} fill="#9CA3AF" />
        <Path d="M3.5 16 L20.5 16 L19.4 18 L4.6 18 Z" fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
        {/* light-source module */}
        <Rect x={4} y={18.5} width={16} height={7} fill="#374151" stroke={C} strokeWidth={0.5} />
        <Rect x={5} y={20} width={9} height={3} fill="#0F1A24" />
        <Rect x={5.5} y={20.6} width={6} height={1.4} fill="#22D3EE" />
        <Circle cx={17} cy={22} r={1.6} fill="#A7F3D0" stroke={C} strokeWidth={0.3} />
        {/* insufflator/recorder module ("CO₂" as amber block) */}
        <Rect x={4} y={26} width={16} height={6} fill="#5B6776" stroke={C} strokeWidth={0.5} />
        <Rect x={5.5} y={27.5} width={6} height={3} fill="#0F1A24" />
        <Rect x={6} y={28.1} width={4.5} height={1.8} fill="#FBBF24" />
        <Circle cx={16} cy={29} r={1.6} fill="#fff" stroke={C} strokeWidth={0.3} />
        {/* drawers */}
        <Rect x={4.5} y={33} width={15} height={3} fill="#EDEFF2" stroke={C} strokeWidth={0.3} />
        <Rect x={4.5} y={37.5} width={15} height={3} fill="#EDEFF2" stroke={C} strokeWidth={0.3} />
        <Path d={cab} fill="none" stroke={C} strokeWidth={0.6} />
        <Ellipse cx={6} cy={47.5} rx={2.2} ry={1.6} fill="#2C3239" />
        <Ellipse cx={18} cy={47.5} rx={2.2} ry={1.6} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

// ─── CO2Insufflator — v11 2.5D: standing CO2 cylinder + top-face unit + panel ──
export function CO2Insufflator({ x, y }: { x: number; y: number }) {
  const sil = 'M2 6 Q1 6 1 7 L1 20 Q1 21 2 21 L12 21 Q13 21 13 20 L13 7 Q13 6 12 6 Z';
  return (
    <Box x={x} y={y} offX={1} offY={-2} w={14} h={26}>
      <Svg viewBox="0 0 14 26" width={14 * S} height={26 * S}>
        <Ellipse cx={7.0} cy={21} rx={5} ry={1.8} fill="rgba(0,0,0,0.16)" />
        {/* green CO2 cylinder standing behind */}
        <Ellipse cx={3} cy={3} rx={1.8} ry={1} fill="#4ADE80" stroke={C} strokeWidth={0.3} />
        <Path d="M1.2 3 L1.2 9 Q1.2 10 3 10 Q4.8 10 4.8 9 L4.8 3" fill="#16A34A" stroke={C} strokeWidth={0.35} />
        {/* full unit silhouette + top face */}
        <Path d={sil} fill="#54606C" />
        <Path d="M2 6 Q1 6 1 7 L1 12 L13 12 L13 7 Q13 6 12 6 Z" fill="#6B7580" />
        <Circle cx={10} cy={9} r={1.8} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Line x1={10} y1={9} x2={11.1} y2={8} stroke={C} strokeWidth={0.3} />
        <Line x1={1} y1={12} x2={13} y2={12} stroke={C} strokeWidth={0.55} />
        {/* viewer-facing panel ("12" as cyan block) */}
        <Rect x={2} y={13} width={7} height={4} rx={0.4} fill="#0F1A24" />
        <Rect x={3} y={13.8} width={4} height={2.4} fill="#22D3EE" />
        <Rect x={10} y={13.4} width={2.4} height={2.4} rx={0.4} fill="#334155" stroke={C} strokeWidth={0.3} />
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.6} />
      </Svg>
    </Box>
  );
}

// ─── ScrubDispenser — v11 2.5D: wall unit top bevel + bottles + brush/towel box ─
export function ScrubDispenser({ x, y }: { x: number; y: number }) {
  const sil = 'M1 2 L13 2 L13 23 Q13 24 12 24 L2 24 Q1 24 1 23 Z';
  return (
    <Box x={x} y={y} offX={1} offY={-2} w={14} h={26}>
      <Svg viewBox="0 0 14 26" width={14 * S} height={26 * S}>
        <Ellipse cx={7.0} cy={25.0} rx={4.8} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d={sil} fill="#C7CDD4" />
        {/* TOP bevel face */}
        <Path d="M1 2 L13 2 L12 4.4 L2 4.4 Z" fill="#DDE1E6" />
        <Line x1={1} y1={4.4} x2={13} y2={4.4} stroke={C} strokeWidth={0.5} />
        {/* chlorhexidine (pink) + betadine (amber) bottles + elbow levers */}
        <Rect x={2} y={5.4} width={4} height={7} rx={0.4} fill="#F9C9D6" stroke={C} strokeWidth={0.4} />
        <Rect x={2.4} y={6.2} width={1.2} height={5} fill="#FBDCE5" />
        <Rect x={1} y={12.4} width={6} height={1.6} rx={0.3} fill="#9CA3AF" />
        <Rect x={8} y={5.4} width={4} height={7} rx={0.4} fill="#B45309" stroke={C} strokeWidth={0.4} />
        <Rect x={8.4} y={6.2} width={1.2} height={5} fill="#D97706" />
        <Rect x={7} y={12.4} width={6} height={1.6} rx={0.3} fill="#9CA3AF" />
        {/* towel / brush box */}
        <Rect x={1.5} y={15} width={11} height={8} rx={0.3} fill="#fff" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={15} width={11} height={2} fill="#3B82F6" />
        <Rect x={3} y={18} width={8} height={2} fill="#E5E7EB" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={20.6} width={4} height={2} fill="#16A34A" />
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.6} />
      </Svg>
    </Box>
  );
}

// ─── ScrubTimer — wall digital scrub timer ──────────────────────────
export function ScrubTimer({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={1} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
        <Ellipse cx={6.0} cy={11.0} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
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
        <Ellipse cx={5.0} cy={11.0} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
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

// ─── SoiledCart — v11 2.5D: closed lid top + biohazard front panel ──
export function SoiledCart({ x, y }: { x: number; y: number }) {
  const sil = 'M2 2 Q1 2 1 3 L1 22 Q1 23 2 23 L18 23 Q19 23 19 22 L19 3 Q19 2 18 2 Z';
  return (
    <Box x={x} y={y} offY={-4} w={20} h={28}>
      <Svg viewBox="0 0 20 28" width={20 * S} height={28 * S}>
        <Ellipse cx={10.0} cy={26.7} rx={6.8} ry={2.3} fill="rgba(0,0,0,0.16)" />
        <Path d={sil} fill="#9AA1A9" />
        {/* TOP lid face — closed hinged lid + latch */}
        <Path d="M2 2 Q1 2 1 3 L1 11 L19 11 L19 3 Q19 2 18 2 Z" fill="#B4BAC2" />
        <Rect x={3} y={3.4} width={14} height={5.6} rx={0.6} fill="#A6ADB5" stroke={C} strokeWidth={0.35} />
        <Rect x={8.5} y={2} width={3} height={1.6} fill="#4B5563" />
        <Line x1={1} y1={11} x2={19} y2={11} stroke={C} strokeWidth={0.6} />
        {/* front biohazard panel (☣ as drawn mark) */}
        <Rect x={6} y={13} width={8} height={8} rx={0.5} fill="#FACC15" stroke={C} strokeWidth={0.4} />
        <Circle cx={10} cy={17.5} r={1.5} fill="none" stroke={C} strokeWidth={0.5} />
        <Circle cx={10} cy={17.5} r={0.6} fill={C} />
        <Circle cx={10} cy={15.7} r={0.9} fill="none" stroke={C} strokeWidth={0.5} />
        <Circle cx={8.5} cy={18.4} r={0.9} fill="none" stroke={C} strokeWidth={0.5} />
        <Circle cx={11.5} cy={18.4} r={0.9} fill="none" stroke={C} strokeWidth={0.5} />
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={4} cy={24.5} rx={2.4} ry={1.6} fill="#2C3239" />
        <Ellipse cx={16} cy={24.5} rx={2.4} ry={1.6} fill="#2C3239" />
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
        <Ellipse cx={18.0} cy={42.9} rx={12.2} ry={4.1} fill="rgba(0,0,0,0.16)" />
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

// ─── AnesthesiaMachine — v11 2.5D top-down: gas cylinders/absorber on top + front panel ─
export function AnesthesiaMachine({ x, y }: { x: number; y: number }) {
  const body = 'M5 8 Q3 8 3 10 L3 28 Q3 30 5 30 L25 30 Q27 30 27 28 L27 10 Q27 8 25 8 Z';
  return (
    <Box x={x} y={y} offY={-8} w={28.8} h={35.2}>
      <Svg viewBox="0 0 30 36" width={28.8 * S} height={35.2 * S}>
        <Ellipse cx={15.0} cy={33.5} rx={10.2} ry={3.5} fill="rgba(0,0,0,0.16)" />
        {/* gas cylinders (round tops from above) */}
        <Ellipse cx={7} cy={4} rx={2.6} ry={2} fill="#16A34A" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={7} cy={3.4} rx={1.4} ry={1} fill="#4ADE80" />
        <Ellipse cx={12} cy={4} rx={2.6} ry={2} fill="#3B82F6" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={12} cy={3.4} rx={1.4} ry={1} fill="#7DB4F0" />
        {/* CO2 absorber canister */}
        <Ellipse cx={21} cy={5} rx={4} ry={2.4} fill="#D9DEE4" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={21} cy={4.4} rx={2.6} ry={1.4} fill="#EBEEF2" />
        {/* body silhouette + top face */}
        <Path d={body} fill="#AEB4BC" />
        <Path d="M5 8 Q3 8 3 10 L3 16 L27 16 L27 10 Q27 8 25 8 Z" fill="#B8BEC6" />
        <Rect x={4.5} y={9.5} width={21} height={1.4} fill="#C7CDD4" />
        {/* breathing bag arm */}
        <Path d="M27 12 Q31 14 29 18" fill="none" stroke="#94A3B8" strokeWidth={1.6} />
        <Ellipse cx={29} cy={19.5} rx={1.6} ry={2.2} fill="#3B4550" stroke={C} strokeWidth={0.4} />
        {/* viewer-facing front: monitor waveform + vaporizer readouts (blocks) */}
        <Rect x={4.5} y={17.5} width={12} height={6} rx={0.6} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Path d="M5.5 21 L7 21 L8 18.8 L9 22.4 L10 20 L11 21 L16 21" fill="none" stroke="#22D3EE" strokeWidth={0.55} />
        <Rect x={17.5} y={17.5} width={8} height={6} rx={0.6} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Rect x={19} y={18.6} width={5} height={1.6} fill="#10B981" />
        <Rect x={19} y={20.8} width={5} height={1.6} fill="#FACC15" />
        {/* flow knobs */}
        <Circle cx={7} cy={26.5} r={1.7} fill="#EF4444" stroke={C} strokeWidth={0.4} />
        <Circle cx={13} cy={26.5} r={1.7} fill="#3B82F6" stroke={C} strokeWidth={0.4} />
        <Circle cx={19} cy={26.5} r={1.7} fill="#10B981" stroke={C} strokeWidth={0.4} />
        <Rect x={22.5} y={25} width={3} height={3} rx={0.4} fill="#C7CDD4" stroke={C} strokeWidth={0.3} />
        {/* re-stroke silhouette + seam */}
        <Path d={body} fill="none" stroke={C} strokeWidth={0.7} />
        <Line x1={3} y1={24} x2={27} y2={24} stroke={C} strokeWidth={0.6} />
        {/* casters */}
        <Ellipse cx={6} cy={31.5} rx={1.8} ry={1.4} fill="#2C3239" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={24} cy={31.5} rx={1.8} ry={1.4} fill="#2C3239" stroke={C} strokeWidth={0.3} />
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
