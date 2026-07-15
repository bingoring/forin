// Dermatology Center objects — faithful RN-svg ports of the handoff
// interior-objects-derm2.jsx catalog (skin assessment + phototherapy + minor-
// surgery/laser) + the derm-local SkinAnatomy in interior-dermcenter.jsx.
// Authored at ITILE=16, rendered at TILE px via S; Box maps the handoff x*ITILE
// / top-N offsets 1:1. SVG `<text>` → shape blocks. v13+ 2.5D: floor objects
// carry a ground shadow. Dispatched via DermObjectView. Cross-dept pieces
// (clinicReception/ibed/imonitor/ireception/ichair/icabinet/sofa/walltv/
// watercooler/coffeetable/surgicallight/instrumenttray/dressing/wastebin/iplant/
// baylabel) resolve on the shared dispatch chain.
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

// ─── Dermatoscope — skin-magnifier camera on an articulated stand ──────
export function Dermatoscope({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-16} w={20} h={42}>
      <Svg viewBox="0 0 20 42" width={20 * S} height={42 * S}>
        <Ellipse cx={10.0} cy={40.7} rx={6.8} ry={2.3} fill="rgba(0,0,0,0.16)" />
        <Path d="M10 22 L4 14 L12 6" fill="none" stroke="#B7BEC6" strokeWidth={2} />
        <G rotation={-30} originX={12} originY={6}>
          <Rect x={8} y={2} width={9} height={5} rx={2.5} fill="#475569" stroke={C} strokeWidth={0.5} />
          <Circle cx={9.5} cy={4.5} r={2.4} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
          <Circle cx={9.5} cy={4.5} r={1.4} fill="#7DD3FC" />
          <Circle cx={9.5} cy={4.5} r={2.9} fill="none" stroke="#FACC15" strokeWidth={0.3} />
        </G>
        <Rect x={2} y={14} width={6} height={5} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Rect x={2.8} y={15} width={4.4} height={3} fill="#5A3A2A" />
        <Circle cx={5} cy={16.5} r={1} fill="#3A2018" />
        <Rect x={9} y={22} width={2} height={16} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={10} cy={40} rx={6} ry={2} fill="#6B7280" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── WoodsLamp — handheld UV diagnostic lamp ───────────────────────────
export function WoodsLamp({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={26}>
      <Svg viewBox="0 0 12 26" width={12 * S} height={26 * S}>
        <Ellipse cx={6.0} cy={25.0} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={1} y={1} width={10} height={7} rx={1.5} fill="#374151" stroke={C} strokeWidth={0.5} />
        <Rect x={2.5} y={2.5} width={2} height={4} fill="#A78BFA" />
        <Rect x={5.5} y={2.5} width={2} height={4} fill="#A78BFA" />
        <Ellipse cx={6} cy={9.5} rx={5} ry={2.5} fill="#8B5CF6" opacity={0.4} />
        <Rect x={5} y={8} width={2} height={10} fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={3.5} y={18} width={5} height={6} rx={1.5} fill="#5B6776" stroke={C} strokeWidth={0.4} />
        <Rect x={4.5} y={19.5} width={3} height={1.4} fill="#A78BFA" />
      </Svg>
    </Box>
  );
}

// ─── UVBooth — whole-body phototherapy booth (311nm blue array) ────────
export function UVBooth({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-16} w={38} h={66}>
      <Svg viewBox="0 0 38 66" width={38 * S} height={66 * S}>
        <Ellipse cx={19.0} cy={62.6} rx={12.9} ry={4.4} fill="rgba(0,0,0,0.16)" />
        <Path d="M1 22 L1 60 Q1 62 3 62 L35 62 Q37 62 37 60 L37 22 Z" fill="#D6DCE2" stroke={C} strokeWidth={0.8} />
        <Rect x={1} y={3} width={36} height={19} rx={3} fill="#E4E9EE" stroke={C} strokeWidth={0.8} />
        <Rect x={4} y={5} width={30} height={2.6} rx={1} fill="#F1F4F7" />
        <Rect x={6} y={10} width={26} height={9} rx={1.5} fill="#C6CDD5" stroke={C} strokeWidth={0.45} />
        {[8.5, 12, 15.5, 19, 22.5, 26, 29.5].map((gx, i) => <Line key={i} x1={gx} y1={11} x2={gx} y2={18} stroke="#9AA2AB" strokeWidth={0.6} />)}
        <Line x1={1} y1={22} x2={37} y2={22} stroke={C} strokeWidth={0.6} />
        <Rect x={6} y={25} width={26} height={28} rx={3} fill="#1B1838" stroke={C} strokeWidth={0.6} />
        {[9, 12.5, 16, 19.5, 23, 26.5, 30].map((tx, i) => <Rect key={i} x={tx} y={27} width={1.6} height={24} fill="#5B8DEF" />)}
        <Rect x={7} y={26} width={24} height={26} rx={3} fill="#3B82F6" opacity={0.28} />
        <Rect x={32} y={34} width={2} height={9} fill="#9CA3AF" />
        <Rect x={4} y={55} width={30} height={5} rx={1} fill="#94A3B8" stroke={C} strokeWidth={0.5} />
        <Rect x={6} y={56} width={9} height={3} fill="#0F1A24" />
        <Rect x={6.6} y={56.7} width={6} height={1.4} fill="#22D3EE" />
        <Circle cx={30} cy={57.5} r={1.6} fill="#10B981" stroke={C} strokeWidth={0.35} />
      </Svg>
    </Box>
  );
}

// ─── HandUVBox — localized hand/foot UV treatment box ──────────────────
export function HandUVBox({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={22} h={20}>
      <Svg viewBox="0 0 22 20" width={22 * S} height={20 * S}>
        <Ellipse cx={11.0} cy={18.4} rx={7.5} ry={2.6} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 2 Q1 2 1 3 L1 16 Q1 17 2 17 L20 17 Q21 17 21 16 L21 3 Q21 2 20 2 Z" fill="#C1C7CE" />
        <Path d="M2 2 Q1 2 1 3 L1 12 L21 12 L21 3 Q21 2 20 2 Z" fill="#D6DCE2" />
        <Rect x={3} y={3.6} width={16} height={6.6} rx={0.6} fill="#1B1838" stroke={C} strokeWidth={0.4} />
        {[4.6, 7.4, 10.2, 13, 15.8].map((tx, i) => <Rect key={i} x={tx} y={4.4} width={1.2} height={5} fill="#5B8DEF" />)}
        <Rect x={3} y={3.6} width={16} height={6.6} rx={0.6} fill="#3B82F6" opacity={0.22} />
        <Line x1={1} y1={12} x2={21} y2={12} stroke={C} strokeWidth={0.55} />
        <Circle cx={6} cy={14.6} r={1.8} fill="#0F1A24" stroke={C} strokeWidth={0.3} />
        <Line x1={6} y1={14.6} x2={7.1} y2={13.6} stroke="#22D3EE" strokeWidth={0.45} />
        <Rect x={11} y={13.4} width={7} height={2.4} rx={0.4} fill="#334155" />
        <Rect x={11.6} y={14} width={2} height={1.2} fill="#10B981" />
      </Svg>
    </Box>
  );
}

// ─── GoggleSanitizer — UV goggle storage/sanitizer cabinet ─────────────
export function GoggleSanitizer({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} w={14} h={24}>
      <Svg viewBox="0 0 14 24" width={14 * S} height={24 * S}>
        <Ellipse cx={7.0} cy={23.0} rx={4.8} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={0} y={0} width={14} height={24} fill="#475569" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={1.5} width={11} height={21} fill="#2A3550" stroke={C} strokeWidth={0.4} opacity={0.85} />
        {[4, 11, 18].map((sy, r) => (
          <G key={r}>
            <Rect x={2} y={sy} width={10} height={1} fill="#1B2438" />
            <Path d={`M3 ${sy - 2.5} Q5 ${sy - 3.5} 7 ${sy - 2.5} Q9 ${sy - 3.5} 11 ${sy - 2.5} L11 ${sy - 1} L3 ${sy - 1} Z`} fill="#0B1020" stroke={C} strokeWidth={0.3} />
          </G>
        ))}
        <Rect x={1.5} y={1.5} width={11} height={2} fill="#A78BFA" opacity={0.5} />
      </Svg>
    </Box>
  );
}

// ─── BiopsyKit — skin-biopsy set on a Mayo stand ───────────────────────
export function BiopsyKit({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={28} h={22}>
      <Svg viewBox="0 0 28 22" width={28 * S} height={22 * S}>
        <Ellipse cx={14.0} cy={19.8} rx={9.5} ry={3.2} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={14} cy={5} rx={13} ry={3} fill="#A5D8E8" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={14} cy={4.5} rx={11.5} ry={2} fill="#C8E5F0" />
        <Rect x={4} y={2.6} width={6} height={1.2} fill="#9CA3AF" stroke={C} strokeWidth={0.25} />
        <Circle cx={3.5} cy={3.2} r={1} fill="#475569" />
        <Path d="M12 2 L16 4.5 M12 3 L16 4.5" stroke="#9CA3AF" strokeWidth={0.7} />
        <Path d="M18 2.2 L22 4.4 M18 3.4 L22 4.4" stroke="#CBD5E1" strokeWidth={0.7} />
        <Circle cx={18} cy={2.2} r={0.7} fill="#374151" />
        <Circle cx={18} cy={3.4} r={0.7} fill="#374151" />
        <Rect x={22} y={2.6} width={3.5} height={2} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={13} y={13} width={2} height={7} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={14} cy={20} rx={6} ry={1.5} fill="#4B5563" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

// ─── BiopsyBottle — formalin specimen bottle ───────────────────────────
export function BiopsyBottle({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={4} offY={3} w={8} h={10}>
      <Svg viewBox="0 0 8 10" width={8 * S} height={10 * S}>
        <Ellipse cx={4.0} cy={9.0} rx={2.7} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={2.5} y={0.4} width={3} height={1.6} fill="#DC2626" stroke={C} strokeWidth={0.3} />
        <Rect x={1.5} y={2} width={5} height={7.5} rx={1} fill="#DDF0F5" stroke={C} strokeWidth={0.4} opacity={0.9} />
        <Rect x={1.5} y={5} width={5} height={4.5} fill="#BCDCE6" opacity={0.7} />
        <Circle cx={4} cy={7} r={0.7} fill="#C97B6E" />
        <Rect x={2} y={3} width={4} height={1.6} fill="#fff" stroke={C} strokeWidth={0.2} />
      </Svg>
    </Box>
  );
}

// ─── CryoTank — liquid-nitrogen cryotherapy dewar + spray ──────────────
export function CryoTank({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={20} h={32}>
      <Svg viewBox="0 0 20 32" width={20 * S} height={32 * S}>
        <Ellipse cx={10.0} cy={30.7} rx={6.8} ry={2.3} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={16} cy={4} rx={2.6} ry={1.6} fill="#fff" opacity={0.75} />
        <Ellipse cx={17.5} cy={2.6} rx={1.4} ry={1} fill="#fff" opacity={0.55} />
        <Rect x={8.5} y={3} width={3} height={3.5} rx={0.6} fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={11} y={3.6} width={4} height={1.6} fill="#94A3B8" />
        <Path d="M3 8 L3 25 Q3 29 10 29 Q17 29 17 25 L17 8 Z" fill="#CBD5E1" stroke={C} strokeWidth={0.6} />
        <Ellipse cx={10} cy={8} rx={7} ry={3} fill="#DCE2E8" stroke={C} strokeWidth={0.6} />
        <Ellipse cx={10} cy={7.6} rx={4.6} ry={1.8} fill="#EEF2F6" />
        <Rect x={4.6} y={10} width={2.4} height={14} fill="#E5EAF0" opacity={0.7} />
        <Rect x={4.5} y={15} width={11} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={7} y={16} width={6} height={1.2} fill={C} opacity={0.55} />
      </Svg>
    </Box>
  );
}

// ─── CO2Laser — medical CO2 laser with articulated arm + red aim dot ───
export function CO2Laser({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-14} w={24} h={46}>
      <Svg viewBox="0 0 24 46" width={24 * S} height={46 * S}>
        <Ellipse cx={12.0} cy={44.2} rx={8.2} ry={2.8} fill="rgba(0,0,0,0.16)" />
        <Path d="M12 14 L20 9 L22 13" fill="none" stroke="#B7BEC6" strokeWidth={2} />
        <Rect x={20} y={12} width={3} height={5} rx={1} fill="#475569" stroke={C} strokeWidth={0.4} />
        <Line x1={21.5} y1={17} x2={21.5} y2={22} stroke="#EF4444" strokeWidth={0.6} />
        <Circle cx={21.5} cy={22.5} r={1} fill="#EF4444" />
        <Path d="M2 14 L16 14 L17 16 L1 16 Z" fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={16} width={16} height={14} fill="#5B6776" stroke={C} strokeWidth={0.5} />
        <Rect x={2.5} y={17.5} width={9} height={6} fill="#0F1A24" />
        <Rect x={3} y={18.5} width={6} height={1.2} fill="#22D3EE" />
        <Rect x={3} y={20.5} width={7} height={1.2} fill="#F87171" />
        <Circle cx={14} cy={20.5} r={2} fill="#FBBF24" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={30} width={16} height={10} fill="#9CA3AF" stroke={C} strokeWidth={0.5} />
        <Rect x={2.5} y={31.5} width={13} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={4} cy={43} rx={2.2} ry={1.6} fill={C} />
        <Ellipse cx={14} cy={43} rx={2.2} ry={1.6} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── LesionChart — skin-lesion classification wall chart (w tiles) ─────
export function LesionChart({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  const cells = ['#E8A0A0', '#D98080', '#F0C0B0', '#E0B0D0', '#C8A0C0', '#F0D0A0'];
  return (
    <Box x={x} y={y} w={W} h={22} z={1}>
      <Svg viewBox={`0 0 ${W} 22`} width={W * S} height={22 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={22} fill="#fff" stroke={C} strokeWidth={0.6} />
        <Rect x={0} y={0} width={W} height={3.5} fill="#0EA5A0" />
        <Rect x={2} y={1} width={w * 9} height={1.6} fill="#fff" />
        {cells.map((col, i) => {
          const cx = 3 + (i % 3) * ((W - 6) / 3);
          const cy = 6 + Math.floor(i / 3) * 7;
          return (
            <G key={i}>
              <Rect x={cx} y={cy} width={(W - 8) / 3} height={5.5} fill="#FCEFE8" stroke={C} strokeWidth={0.3} />
              <Circle cx={cx + 3} cy={cy + 2.6} r={1.8} fill={col} />
            </G>
          );
        })}
      </Svg>
    </Box>
  );
}

// ─── SkinAnatomy — skin cross-section framed wall poster ───────────────
export function SkinAnatomy({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={32} h={22} z={1}>
      <Svg viewBox="0 0 32 22" width={32 * S} height={22 * S} preserveAspectRatio="none">
        <Ellipse cx={16.0} cy={19.3} rx={10.9} ry={3.7} fill="rgba(0,0,0,0.16)" />
        <Rect x={0} y={0} width={32} height={22} fill="#fff" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={2} width={28} height={4} fill="#F0C8B0" />
        <Rect x={2} y={6} width={28} height={8} fill="#E0A890" />
        <Rect x={2} y={14} width={28} height={6} fill="#F4D8A0" />
        <Line x1={10} y1={2} x2={12} y2={18} stroke="#6B4423" strokeWidth={0.6} />
        <Ellipse cx={12} cy={18} rx={2} ry={1.4} fill="#8B5A2B" />
        <Line x1={22} y1={4} x2={30} y2={4} stroke={C} strokeWidth={0.3} opacity={0.5} />
        <Line x1={22} y1={10} x2={30} y2={10} stroke={C} strokeWidth={0.3} opacity={0.5} />
      </Svg>
    </Box>
  );
}

const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);

export function DermObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'dermatoscope': return <Dermatoscope x={x} y={y} />;
    case 'woodslamp': return <WoodsLamp x={x} y={y} />;
    case 'uvbooth': return <UVBooth x={x} y={y} />;
    case 'handuvbox': return <HandUVBox x={x} y={y} />;
    case 'gogglesanitizer': return <GoggleSanitizer x={x} y={y} />;
    case 'biopsykit': return <BiopsyKit x={x} y={y} />;
    case 'biopsybottle': return <BiopsyBottle x={x} y={y} />;
    case 'cryotank': return <CryoTank x={x} y={y} />;
    case 'co2laser': return <CO2Laser x={x} y={y} />;
    case 'lesionchart': return <LesionChart x={x} y={y} w={num(props?.w, 2)} />;
    case 'skinanatomy': return <SkinAnatomy x={x} y={y} />;
    default: return null;
  }
}
