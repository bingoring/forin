// General-Surgery Ward objects — faithful RN-svg ports of the handoff
// interior-objects-surg2.jsx catalog (perioperative nursing: PCA pump, surgical
// drains JP/Hemovac, NG-to-suction, SCD/DVT device, walker rack, OP schedule
// board, staple remover). Authored at ITILE=16, rendered at TILE px via S; Box
// maps the handoff x*ITILE / top-N offsets 1:1. SVG `<text>` → shape blocks. v13+
// 2.5D: floor objects carry a ground shadow. Dispatched via SurgObjectView.
// Cross-dept pieces (ibed/imonitor/iiv/ichair/icurtain/icabinet/nursestation/
// surgicallight/instrumenttray/suction/dressing/wastebin/sofa/iplant/baylabel +
// ward2 mealcart/npoboard/ivstoragecart/supplybasketshelf/handrail/deskphone/
// sharpsbin/linenhamper/sluicesink) resolve on the shared dispatch chain.
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

// ─── PCAPump — patient-controlled analgesia pump on an IV pole ─────────
export function PCAPump({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-18} w={16} h={48}>
      <Svg viewBox="0 0 16 48" width={16 * S} height={48 * S}>
        <Ellipse cx={8.0} cy={47.0} rx={5.4} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={5} y={0} width={6} height={1.4} fill="#9CA3AF" />
        <Rect x={4.5} y={1.4} width={5} height={7} fill="#BFE3EE" stroke={C} strokeWidth={0.4} />
        <Rect x={5} y={2.4} width={2} height={5} fill="#D4F0F8" />
        <Path d="M2 12.5 L14 12.5 L14 21 Q14 22 13 22 L3 22 Q2 22 2 21 Z" fill="#3E4756" stroke={C} strokeWidth={0.55} />
        <Rect x={2} y={9} width={12} height={3.5} rx={0.8} fill="#586471" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={9.6} width={10} height={1.1} fill="#6E7C8C" />
        <Line x1={2} y1={12.5} x2={14} y2={12.5} stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={13.4} width={10} height={4.2} rx={0.4} fill="#0F1A24" />
        <Rect x={3.6} y={14.2} width={6} height={1.2} fill="#22D3EE" />
        <Rect x={3.6} y={16} width={8} height={1} fill="#10B981" />
        <Rect x={10.5} y={18.4} width={2.5} height={2.5} rx={0.4} fill="#FACC15" />
        <Path d="M14 17 Q18 20 15 24" fill="none" stroke={C} strokeWidth={0.5} />
        <Rect x={13.5} y={24} width={3.5} height={4.5} rx={1.4} fill="#DC2626" stroke={C} strokeWidth={0.4} />
        <Circle cx={15.2} cy={26.2} r={1} fill="#FCA5A5" />
        <Rect x={7} y={22} width={2} height={20} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={8} cy={44} rx={6} ry={2} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={3} cy={45.5} rx={1.3} ry={1} fill={C} />
        <Ellipse cx={13} cy={45.5} rx={1.3} ry={1} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── JPDrain — Jackson-Pratt drain (grenade bulb) ──────────────────────
export function JPDrain({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={2} w={10} h={16}>
      <Svg viewBox="0 0 10 16" width={10 * S} height={16 * S}>
        <Ellipse cx={5.0} cy={15.0} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M5 0 Q2 3 4 6" fill="none" stroke="#E0A0A0" strokeWidth={0.7} />
        <Rect x={3.5} y={5} width={3} height={1.6} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Path d="M2 8 Q5 6 8 8 L8 13 Q5 15 2 13 Z" fill="#C97B6E" stroke={C} strokeWidth={0.5} />
        <Path d="M2.4 9.5 Q5 8.6 7.6 9.5" fill="none" stroke={C} strokeWidth={0.3} opacity={0.5} />
        <Path d="M2.3 11 Q5 10.2 7.7 11" fill="none" stroke={C} strokeWidth={0.3} opacity={0.5} />
        <Path d="M2.6 11.5 Q5 13.6 7.4 11.5 L7.4 12.6 Q5 14.6 2.6 12.6 Z" fill="#8B2530" />
      </Svg>
    </Box>
  );
}

// ─── Hemovac — large disc negative-pressure drain ─────────────────────
export function Hemovac({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={2} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
        <Ellipse cx={6.0} cy={11.0} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M6 0 Q3 2 5 3.5" fill="none" stroke="#E0A0A0" strokeWidth={0.7} />
        <Ellipse cx={6} cy={7.5} rx={5} ry={4} fill="#B86B5E" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={6} cy={7} rx={4} ry={3} fill="#C97B6E" />
        <Ellipse cx={6} cy={7} rx={2.6} ry={2} fill="none" stroke={C} strokeWidth={0.3} opacity={0.5} />
        <Ellipse cx={6} cy={7} rx={1.2} ry={1} fill="#8B2530" />
        <Rect x={5.4} y={3.4} width={1.2} height={1.6} fill="#9CA3AF" />
      </Svg>
    </Box>
  );
}

// ─── NGSuction — NG tube to wall suction (bile-green gastric fluid) ────
export function NGSuction({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={20} h={30}>
      <Svg viewBox="0 0 20 30" width={20 * S} height={30 * S}>
        <Ellipse cx={10.0} cy={25.5} rx={4} ry={1.6} fill="rgba(0,0,0,0.16)" />
        <Rect x={11} y={1} width={8} height={9} fill="#475569" stroke={C} strokeWidth={0.5} />
        <Circle cx={15} cy={5.5} r={2.6} fill="#0F1A24" />
        <Line x1={15} y1={5.5} x2={16.6} y2={4} stroke="#22D3EE" strokeWidth={0.5} />
        <Rect x={12.5} y={7.6} width={5} height={1.2} fill="#FBBF24" />
        <Rect x={11} y={11} width={7} height={14} fill="#D4E8E0" stroke={C} strokeWidth={0.5} opacity={0.9} />
        <Rect x={11} y={17} width={7} height={8} fill="#6FA03C" opacity={0.7} />
        {[0, 1, 2].map((i) => <Rect key={i} x={11} y={13 + i * 3} width={2} height={0.5} fill={C} opacity={0.4} />)}
        <Path d="M0 20 Q6 16 11 19" fill="none" stroke="#C6E0A0" strokeWidth={1} />
      </Svg>
    </Box>
  );
}

// ─── SCDDevice — sequential compression device (DVT prophylaxis) ───────
export function SCDDevice({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-3} w={26} h={28}>
      <Svg viewBox="0 0 26 28" width={26 * S} height={28 * S}>
        <Ellipse cx={7.5} cy={20.5} rx={6} ry={1.8} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={20} cy={25} rx={4.5} ry={1.7} fill="rgba(0,0,0,0.16)" />
        <Path d="M1 12 L15 12 L15 19 Q15 20 14 20 L2 20 Q1 20 1 19 Z" fill="#4E5865" stroke={C} strokeWidth={0.7} />
        <Rect x={1} y={3} width={14} height={9} rx={1.2} fill="#5E6B7A" stroke={C} strokeWidth={0.7} />
        <Rect x={2.4} y={4.2} width={11} height={1.5} fill="#77869A" />
        <Line x1={1} y1={12} x2={15} y2={12} stroke={C} strokeWidth={0.55} />
        <Rect x={3} y={13.4} width={7} height={4} rx={0.5} fill="#0F1A24" />
        <Rect x={4} y={14.4} width={5} height={1} fill="#22D3EE" />
        <Circle cx={12} cy={15.4} r={1.4} fill="#10B981" stroke={C} strokeWidth={0.35} />
        <Path d="M15 9 Q20 10 20 14" fill="none" stroke="#94A3B8" strokeWidth={1.3} />
        <Path d="M15 11 Q22 12 22 16" fill="none" stroke="#94A3B8" strokeWidth={1.3} />
        <Rect x={17} y={14} width={8} height={12} rx={2} fill="#A8C7DC" stroke={C} strokeWidth={0.55} />
        <Line x1={17} y1={18} x2={25} y2={18} stroke={C} strokeWidth={0.4} />
        <Line x1={17} y1={21.5} x2={25} y2={21.5} stroke={C} strokeWidth={0.4} />
        <Rect x={18} y={15} width={6} height={1.6} fill="#C3DAEA" />
      </Svg>
    </Box>
  );
}

// ─── Walker — a single walking frame (post-op ambulation aid) ──────────
export function Walker({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={22} h={24}>
      <Svg viewBox="0 0 22 24" width={22 * S} height={24 * S}>
        <Ellipse cx={11.0} cy={22.4} rx={7.5} ry={2.6} fill="rgba(0,0,0,0.16)" />
        <Path d="M3 4 L19 4 L17 7 L5 7 Z" fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={3} width={4} height={1.6} fill="#374151" />
        <Rect x={14} y={3} width={4} height={1.6} fill="#374151" />
        <Rect x={5} y={11} width={12} height={1.6} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={7} width={1.8} height={15} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
        <Rect x={17.2} y={7} width={1.8} height={15} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
        <Rect x={6} y={12} width={1.6} height={10} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={14.4} y={12} width={1.6} height={10} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        {[3.4, 6.2, 14.6, 17.6].map((fx, i) => <Rect key={i} x={fx} y={22} width={2} height={2} fill={C} />)}
      </Svg>
    </Box>
  );
}

// ─── WalkerRack — rack of parked walking frames (w tiles) ──────────────
export function WalkerRack({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} w={W} h={22}>
      <Svg viewBox={`0 0 ${W} 22`} width={W * S} height={22 * S} preserveAspectRatio="none">
        <Rect x={0} y={2} width={W} height={20} fill="#E8EEF0" stroke={C} strokeWidth={0.5} />
        <Rect x={0} y={2} width={W} height={2} fill="#3B82F6" />
        {Array.from({ length: w }).map((_, i) => (
          <G key={i}>
            <Rect x={3 + i * 16} y={6} width={10} height={1.6} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
            <Rect x={3.5 + i * 16} y={7} width={1.6} height={13} fill="#B7BEC6" stroke={C} strokeWidth={0.3} />
            <Rect x={11 + i * 16} y={7} width={1.6} height={13} fill="#B7BEC6" stroke={C} strokeWidth={0.3} />
            <Rect x={3.5 + i * 16} y={13} width={9} height={1.2} fill="#CBD5E1" />
          </G>
        ))}
      </Svg>
    </Box>
  );
}

// ─── OPScheduleBoard — OR schedule whiteboard w/ status chips (w tiles) ─
export function OPScheduleBoard({ x, y, w = 4 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  const rows: [string, number][] = [['#F87171', 7], ['#FBBF24', 11], ['#34D399', 15], ['#94A3B8', 19]];
  return (
    <Box x={x} y={y} w={W} h={24} z={1}>
      <Svg viewBox={`0 0 ${W} 24`} width={W * S} height={24 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={24} fill="#E5E7EB" stroke={C} strokeWidth={0.7} />
        <Rect x={1.5} y={1.5} width={W - 3} height={21} fill="#fff" />
        <Rect x={1.5} y={1.5} width={W - 3} height={4} fill="#2563EB" />
        <Rect x={3} y={2.6} width={w * 9} height={1.8} fill="#fff" />
        <Line x1={w * 7} y1={6} x2={w * 7} y2={23} stroke={C} strokeWidth={0.3} opacity={0.4} />
        <Line x1={w * 12} y1={6} x2={w * 12} y2={23} stroke={C} strokeWidth={0.3} opacity={0.4} />
        {rows.map(([col, ry], i) => (
          <G key={i}>
            <Rect x={3} y={ry} width={w * 5} height={1.4} fill={C} opacity={0.5} />
            <Rect x={w * 7 + 2} y={ry} width={w * 3.5} height={1.4} fill={C} opacity={0.4} />
            <Rect x={w * 12 + 2} y={ry - 0.4} width={w * 2.6} height={2.4} rx={1} fill={col} />
          </G>
        ))}
      </Svg>
    </Box>
  );
}

// ─── StapleRemover — skin-staple remover on a sterile tray ─────────────
export function StapleRemover({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={4} w={12} h={8}>
      <Svg viewBox="0 0 12 8" width={12 * S} height={8 * S}>
        <Ellipse cx={6.0} cy={7.0} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={0} y={3} width={12} height={5} rx={1} fill="#A5D8E8" stroke={C} strokeWidth={0.4} />
        <Path d="M1 6 L7 4 L11 1.5" fill="none" stroke="#9CA3AF" strokeWidth={1.2} />
        <Path d="M1 6 L7 5.4 L11 4" fill="none" stroke="#CBD5E1" strokeWidth={1.2} />
        <Circle cx={5.5} cy={5} r={0.8} fill="#374151" />
        <Rect x={10} y={0.6} width={2} height={2} fill="#475569" />
      </Svg>
    </Box>
  );
}

const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);

export function SurgObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'pcapump': return <PCAPump x={x} y={y} />;
    case 'jpdrain': return <JPDrain x={x} y={y} />;
    case 'hemovac': return <Hemovac x={x} y={y} />;
    case 'ngsuction': return <NGSuction x={x} y={y} />;
    case 'scddevice': return <SCDDevice x={x} y={y} />;
    case 'walker': return <Walker x={x} y={y} />;
    case 'walkerrack': return <WalkerRack x={x} y={y} w={num(props?.w, 3)} />;
    case 'opscheduleboard': return <OPScheduleBoard x={x} y={y} w={num(props?.w, 4)} />;
    case 'stapleremover': return <StapleRemover x={x} y={y} />;
    default: return null;
  }
}
