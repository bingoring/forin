// Orthopedics Ward objects — faithful RN-svg ports of the handoff
// interior-objects-ortho2.jsx catalog (impaired-mobility care: skeletal traction,
// CPM, casting, braces, abduction pillow, bed alarm, PACS) + the ortho-local
// CMSChart in interior-orthoward.jsx. Authored at ITILE=16, rendered at TILE px
// via S; Box maps the handoff x*ITILE / top-N offsets 1:1. SVG `<text>` → shape
// blocks. v13+ 2.5D: floor objects carry a ground shadow. Dispatched via
// OrthoObjectView. Cross-dept pieces (ibed/imonitor/iiv/ichair/icurtain/
// nursestation/surgicallight/dressing/wheelchair/sofa/iplant/baylabel + ward2
// handrail/deskphone/fallrisksign + surg2 walker/walkerrack) resolve on the chain.
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

// ─── TractionFrame — skeletal traction (steel frame + pulley + weights) ─
export function TractionFrame({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-20} w={38} h={54}>
      <Svg viewBox="0 0 38 54" width={38 * S} height={54 * S}>
        <Ellipse cx={19.0} cy={44} rx={11} ry={3} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={2} width={3} height={40} fill="#9CA3AF" stroke={C} strokeWidth={0.5} />
        <Rect x={33} y={2} width={3} height={40} fill="#9CA3AF" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={2} width={34} height={3} fill="#B7BEC6" stroke={C} strokeWidth={0.5} />
        <Circle cx={30} cy={10} r={2.6} fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        <Circle cx={30} cy={10} r={0.9} fill="#475569" />
        <Path d="M14 18 L30 8" stroke={C} strokeWidth={0.7} />
        <Path d="M30 12 L30 34" stroke={C} strokeWidth={0.7} />
        <Rect x={8} y={16} width={12} height={4} rx={2} fill="#FBD9C0" stroke={C} strokeWidth={0.4} />
        <Rect x={13.5} y={14.5} width={1.4} height={5} fill="#9CA3AF" />
        <Rect x={6} y={15} width={4} height={6} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={27} y={34} width={6} height={3} fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={27.5} y={37} width={5} height={3} fill="#374151" stroke={C} strokeWidth={0.4} />
        <Rect x={28} y={40} width={4} height={3} fill="#475569" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── CPMMachine — continuous passive motion machine (knee cradle) ──────
export function CPMMachine({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={36} h={28}>
      <Svg viewBox="0 0 36 28" width={36 * S} height={28 * S}>
        <Ellipse cx={18.0} cy={24.9} rx={12.2} ry={4.1} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 18 L14 18 L20 8 L26 8" fill="none" stroke="#7FA8C0" strokeWidth={5} strokeLinejoin="round" />
        <Path d="M2 18 L14 18 L20 8 L26 8" fill="none" stroke={C} strokeWidth={0.6} strokeLinejoin="round" />
        <Circle cx={17} cy={13} r={2.6} fill="#475569" stroke={C} strokeWidth={0.5} />
        <Circle cx={17} cy={13} r={0.9} fill="#FBBF24" />
        <Rect x={3} y={14} width={11} height={3.5} rx={1.7} fill="#FBD9C0" />
        <Rect x={20} y={5} width={7} height={3.5} rx={1.7} fill="#FBD9C0" />
        <Path d="M1 21 L21 21 L21 25 Q21 26 20 26 L2 26 Q1 26 1 25 Z" fill="#454E5B" stroke={C} strokeWidth={0.55} />
        <Rect x={1} y={18} width={20} height={3.2} rx={0.8} fill="#5B6776" stroke={C} strokeWidth={0.5} />
        <Rect x={2.5} y={18.6} width={17} height={1} fill="#6F7C8B" />
        <Line x1={1} y1={21} x2={21} y2={21} stroke={C} strokeWidth={0.5} />
        <Rect x={2.5} y={22} width={6} height={3} rx={0.4} fill="#0F1A24" />
        <Rect x={3} y={22.7} width={4} height={1} fill="#22D3EE" />
        <Ellipse cx={4} cy={26.5} rx={2} ry={1.2} fill={C} />
        <Ellipse cx={18} cy={26.5} rx={2} ry={1.2} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── PlasterTrapSink — plaster-trap sink (settling filter) ─────────────
export function PlasterTrapSink({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={26} h={34}>
      <Svg viewBox="0 0 26 34" width={26 * S} height={34 * S}>
        <Ellipse cx={13.0} cy={25.5} rx={9} ry={2.6} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 15 L24 15 L24 24 Q24 25 23 25 L3 25 Q2 25 2 24 Z" fill="#9AA6B2" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={4} width={22} height={11} rx={1} fill="#C3CAD1" stroke={C} strokeWidth={0.7} />
        <Rect x={5} y={6} width={16} height={7.5} rx={1.2} fill="#7E8893" stroke={C} strokeWidth={0.6} />
        <Rect x={6.5} y={7} width={13} height={5.5} rx={0.8} fill="#C4CBC6" />
        <Ellipse cx={13} cy={9.6} rx={2.2} ry={1.2} fill="#AAB2AC" />
        <Rect x={11.5} y={1.5} width={1.8} height={4} rx={0.6} fill="#9CA3AF" stroke={C} strokeWidth={0.35} />
        <Path d="M12.4 2 Q17 1.4 17 5.6" fill="none" stroke="#9CA3AF" strokeWidth={1.4} />
        <Line x1={2} y1={15} x2={24} y2={15} stroke={C} strokeWidth={0.55} />
        <Rect x={4} y={16.5} width={18} height={7.5} rx={0.4} fill="#EDEFF2" stroke={C} strokeWidth={0.4} />
        <Rect x={8.5} y={18} width={9} height={5} rx={0.5} fill="#B7BEC6" stroke={C} strokeWidth={0.45} />
        <Ellipse cx={13} cy={20.5} rx={3.4} ry={1.6} fill="#94A3B8" />
      </Svg>
    </Box>
  );
}

// ─── CastCutter — electric cast-cutting saw ────────────────────────────
export function CastCutter({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={3} w={14} h={10}>
      <Svg viewBox="0 0 14 10" width={14 * S} height={10 * S}>
        <Ellipse cx={7.0} cy={9.0} rx={4.8} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={1} y={3} width={8} height={4.5} rx={1.5} fill="#F59E0B" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={4} width={3} height={2.5} fill="#0F1A24" />
        <Circle cx={11} cy={5.2} r={3} fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        <Circle cx={11} cy={5.2} r={0.8} fill="#475569" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * 6.283;
          return <Rect key={i} x={11 + Math.cos(a) * 2.6 - 0.2} y={5.2 + Math.sin(a) * 2.6 - 0.2} width={0.5} height={0.5} fill={C} />;
        })}
        <Path d="M1 5 Q-1 7 1 9" fill="none" stroke={C} strokeWidth={0.5} />
      </Svg>
    </Box>
  );
}

// ─── CastRollShelf — cast/fiberglass roll storage (by colour, w tiles) ─
export function CastRollShelf({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  const cols = ['#FFFFFF', '#34D399', '#60A5FA', '#F87171', '#FFFFFF', '#FBBF24'];
  return (
    <Box x={x} y={y} offY={-4} w={W} h={24} z={1}>
      <Svg viewBox={`0 0 ${W} 24`} width={W * S} height={24 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={24} fill="#E8E5DB" stroke={C} strokeWidth={0.6} />
        {[2, 13].map((sy, r) => (
          <G key={r}>
            <Rect x={1} y={sy + 9} width={W - 2} height={1.4} fill="#D2CDBE" />
            {Array.from({ length: w * 2 }).map((_, i) => {
              const col = cols[(i + r * 2) % 6];
              const cx = 3.5 + i * ((W - 5) / (w * 2));
              return (
                <G key={i}>
                  <Ellipse cx={cx} cy={sy + 2} rx={2.6} ry={1.4} fill={col} stroke={C} strokeWidth={0.3} />
                  <Rect x={cx - 2.6} y={sy + 2} width={5.2} height={7} fill={col} stroke={C} strokeWidth={0.3} />
                  <Circle cx={cx} cy={sy + 2} r={0.8} fill={C} opacity={0.3} />
                </G>
              );
            })}
          </G>
        ))}
      </Svg>
    </Box>
  );
}

// ─── BraceRack — brace/crutch/cane wall rack (w tiles) ─────────────────
export function BraceRack({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} offY={-8} w={W} h={36} z={1}>
      <Svg viewBox={`0 0 ${W} 36`} width={W * S} height={36 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={22} fill="#D6DCE2" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={2} width={1.4} height={18} fill="#B7BEC6" stroke={C} strokeWidth={0.3} />
        <Rect x={5} y={2} width={1.4} height={18} fill="#B7BEC6" stroke={C} strokeWidth={0.3} />
        <Rect x={2.4} y={3} width={4.6} height={1.6} fill="#9CA3AF" />
        <Rect x={3} y={9} width={3.4} height={1.2} fill="#374151" />
        <Rect x={10} y={3} width={1.4} height={17} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Path d="M10 3 Q12.5 2 12.5 4" fill="none" stroke="#94A3B8" strokeWidth={1.4} />
        <Rect x={W - 12} y={3} width={9} height={7} fill="#5B6776" stroke={C} strokeWidth={0.4} />
        <Circle cx={W - 7.5} cy={6.5} r={1.6} fill="#FBBF24" />
        <Rect x={W - 12} y={12} width={9} height={7} fill="#A8C7DC" stroke={C} strokeWidth={0.4} />
        <Rect x={W - 11} y={16} width={7} height={2.5} fill="#7FA8C0" />
        <Rect x={0} y={22} width={W} height={2} fill="#C6C2B6" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── AbductionPillow — abduction wedge (between the legs) ──────────────
export function AbductionPillow({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={1} w={12} h={16} z={2}>
      <Svg viewBox="0 0 12 16" width={12 * S} height={16 * S}>
        <Ellipse cx={6.0} cy={15.0} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M4 1 L8 1 L11 15 L1 15 Z" fill="#5B9BD5" stroke={C} strokeWidth={0.5} />
        <Path d="M4.5 1.6 L7.5 1.6 L8.2 6 L3.8 6 Z" fill="#7FB3E0" />
        <Rect x={1.4} y={6} width={9.2} height={1.4} fill="#3E6FA0" />
        <Rect x={0.8} y={11} width={10.4} height={1.4} fill="#3E6FA0" />
      </Svg>
    </Box>
  );
}

// ─── ElevatedToiletGuard — raised toilet seat + safety rails ───────────
export function ElevatedToiletGuard({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={22} h={24}>
      <Svg viewBox="0 0 22 24" width={22 * S} height={24 * S}>
        <Ellipse cx={11.0} cy={22.4} rx={7.5} ry={2.6} fill="rgba(0,0,0,0.16)" />
        <Rect x={1} y={6} width={2} height={16} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={19} y={6} width={2} height={16} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={6} width={6} height={2} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Rect x={15} y={6} width={6} height={2} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={11} cy={13} rx={7} ry={4} fill="#FFFFFF" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={11} cy={13} rx={4} ry={2} fill="#D7DCD6" />
        <Rect x={5} y={16} width={12} height={5} fill="#E5E7EB" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── BedAlarm — fall-prevention pressure mat + alarm box ───────────────
export function BedAlarm({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={2} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
        <Ellipse cx={6.0} cy={11.0} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={0.5} y={5} width={11} height={6.5} rx={1} fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={1.5} y={6} width={9} height={1} fill="#64748B" />
        <Rect x={1.5} y={8} width={9} height={1} fill="#64748B" />
        <Rect x={3} y={0.6} width={6} height={4} rx={1} fill="#DC2626" stroke={C} strokeWidth={0.4} />
        <Circle cx={6} cy={2.6} r={1} fill="#FCA5A5" />
      </Svg>
    </Box>
  );
}

// ─── PACSViewer — PACS dual monitor (bone-alignment X-ray) ─────────────
export function PACSViewer({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={32} h={22}>
      <Svg viewBox="0 0 32 22" width={32 * S} height={22 * S}>
        <Ellipse cx={16.0} cy={19.3} rx={10.9} ry={3.7} fill="rgba(0,0,0,0.16)" />
        {[0, 16].map((mx, i) => (
          <G key={i}>
            <Path d={`M${mx + 2} 0 L${mx + 14} 0 L${mx + 15} 1.6 L${mx + 1} 1.6 Z`} fill="#2C333B" stroke={C} strokeWidth={0.4} />
            <Rect x={mx + 1} y={1.6} width={14} height={12} fill="#111827" stroke={C} strokeWidth={0.5} />
            <Rect x={mx + 2} y={2.6} width={12} height={10} fill="#0B1220" />
            <Rect x={mx + 7} y={4} width={2} height={7.5} fill="#9FB6C8" />
            <Ellipse cx={mx + 8} cy={7.5} rx={2.6} ry={1.4} fill="#C3D2DC" />
            <Rect x={mx + 5} y={7} width={6} height={1.4} fill="#7E96A8" />
          </G>
        ))}
        <Rect x={14} y={13.6} width={4} height={5.4} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={16} cy={20} rx={7} ry={1.6} fill="#6B7280" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── CMSChart — neurovascular (CMS) assessment wall board ──────────────
export function CMSChart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={32} h={18} z={1}>
      <Svg viewBox="0 0 32 18" width={32 * S} height={18 * S} preserveAspectRatio="none">
        <Ellipse cx={16.0} cy={15.3} rx={10.9} ry={3.7} fill="rgba(0,0,0,0.16)" />
        <Rect x={0} y={0} width={32} height={18} fill="#fff" stroke={C} strokeWidth={0.6} />
        <Rect x={0} y={0} width={32} height={3.5} fill="#B45309" />
        <Rect x={2} y={1} width={16} height={1.6} fill="#fff" />
        {[5, 8.5, 12].map((ry, i) => (
          <G key={i}>
            <Rect x={2} y={ry} width={3} height={2.4} fill="none" stroke={C} strokeWidth={0.5} />
            <Path d={`M2.6 ${ry + 1.2} L3.4 ${ry + 2} L4.6 ${ry + 0.4}`} fill="none" stroke="#16A34A" strokeWidth={0.7} />
            <Rect x={6.5} y={ry + 0.4} width={[16, 13, 11][i]} height={1.4} fill={C} opacity={0.5} />
          </G>
        ))}
      </Svg>
    </Box>
  );
}

const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);

export function OrthoObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'tractionframe': return <TractionFrame x={x} y={y} />;
    case 'cpmmachine': return <CPMMachine x={x} y={y} />;
    case 'plastertrapsink': return <PlasterTrapSink x={x} y={y} />;
    case 'castcutter': return <CastCutter x={x} y={y} />;
    case 'castrollshelf': return <CastRollShelf x={x} y={y} w={num(props?.w, 3)} />;
    case 'bracerack': return <BraceRack x={x} y={y} w={num(props?.w, 3)} />;
    case 'abductionpillow': return <AbductionPillow x={x} y={y} />;
    case 'elevatedtoiletguard': return <ElevatedToiletGuard x={x} y={y} />;
    case 'bedalarm': return <BedAlarm x={x} y={y} />;
    case 'pacsviewer': return <PACSViewer x={x} y={y} />;
    case 'cmschart': return <CMSChart x={x} y={y} />;
    default: return null;
  }
}
