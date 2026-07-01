// ICU (Intensive Care Unit) objects — faithful RN-svg ports of the handoff
// interior-objects-icu2.jsx catalog. Authored at ITILE=16, rendered at TILE px
// via S. `<text>` glyphs are replaced by shape equivalents. Dispatched via
// IcuObjectView.
import type { ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;

function Box({ x, y, offX = 0, offY = 0, w, h, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S }}>{children}</View>
  );
}

// ─── CRRTMachine — continuous renal replacement (dialysis) + 4 fluid bags ──
export function CRRTMachine({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-14} w={32} h={54}>
      <Svg viewBox="0 0 32 54" width={32 * S} height={54 * S}>
        <Rect x={2} y={0} width={28} height={1.5} fill="#9CA3AF" />
        {[4, 11, 18, 25].map((bx, i) => (
          <G key={i}>
            <Rect x={bx} y={1.5} width={5} height={8} fill={i % 2 ? '#D7F0E0' : '#FCE7C8'} stroke={C} strokeWidth={0.4} />
            <Rect x={bx + 0.6} y={2.5} width={1.4} height={6} fill={i % 2 ? '#A7E0BE' : '#F4D29A'} />
          </G>
        ))}
        <Path d="M3 11 L29 11 L30 13 L2 13 Z" fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={13} width={28} height={11} fill="#5B6776" stroke={C} strokeWidth={0.5} />
        <Rect x={4} y={14.5} width={14} height={8} fill="#0F1A24" />
        <Rect x={5} y={15.5} width={11} height={1.3} fill="#22D3EE" />
        <Rect x={5} y={17.5} width={9} height={1.3} fill="#F87171" />
        <Rect x={5} y={19.5} width={11} height={1.3} fill="#FACC15" />
        {/* blood pump */}
        <Circle cx={24} cy={18.5} r={4} fill="#1F2937" stroke={C} strokeWidth={0.5} />
        <Circle cx={24} cy={18.5} r={1.4} fill="#DC2626" />
        <Rect x={23.4} y={14.8} width={1.2} height={3.7} fill="#7F1D1D" />
        {/* filter column + blood lines */}
        <Rect x={3} y={25} width={3} height={14} fill="#FCA5A5" stroke={C} strokeWidth={0.4} />
        <Rect x={3.6} y={26} width={1.8} height={12} fill="#DC2626" />
        <Path d="M6 27 Q10 26 10 30" fill="none" stroke="#DC2626" strokeWidth={1} />
        <Path d="M6 36 Q12 38 12 33" fill="none" stroke="#3B82F6" strokeWidth={1} />
        {/* body + drawers + wheels */}
        <Rect x={8} y={25} width={22} height={14} fill="#9CA3AF" stroke={C} strokeWidth={0.5} />
        <Rect x={9} y={26.5} width={20} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={9} y={31} width={20} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={6} cy={48} rx={2.4} ry={1.7} fill={C} />
        <Ellipse cx={26} cy={48} rx={2.4} ry={1.7} fill={C} />
        <Rect x={14} y={45} width={2} height={3} fill="#6B7280" />
      </Svg>
    </Box>
  );
}

// ─── IVPumpTower — 6-module stacked infusion pump tower (C-line polypharmacy) ──
export function IVPumpTower({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-22} w={16} h={54}>
      <Svg viewBox="0 0 16 54" width={16 * S} height={54 * S}>
        <Rect x={5} y={0} width={6} height={1.4} fill="#9CA3AF" />
        <Rect x={3} y={1.4} width={4} height={6} fill="#A8DCEC" stroke={C} strokeWidth={0.4} />
        <Rect x={9} y={1.4} width={4} height={6} fill="#FCE7C8" stroke={C} strokeWidth={0.4} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <G key={i}>
            <Rect x={2} y={9 + i * 6} width={12} height={5.4} fill="#475569" stroke={C} strokeWidth={0.5} />
            <Rect x={3} y={9.6 + i * 6} width={6} height={3} fill="#0F1A24" />
            <Rect x={3.6} y={10.2 + i * 6} width={4.6} height={1} fill={['#22D3EE', '#10B981', '#FACC15', '#F87171', '#22D3EE', '#A78BFA'][i]} />
            <Rect x={10} y={9.8 + i * 6} width={1.6} height={1.6} fill="#10B981" />
            <Rect x={10} y={11.8 + i * 6} width={1.6} height={1.6} fill="#EF4444" />
          </G>
        ))}
        <Rect x={7} y={45} width={2} height={5} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={8} cy={51} rx={6} ry={2} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={3} cy={52.5} rx={1.3} ry={1} fill={C} />
        <Ellipse cx={13} cy={52.5} rx={1.3} ry={1} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── EVDStand — external ventricular drain (ruler + drip chamber + CSF bag) ──
export function EVDStand({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-20} w={16} h={48}>
      <Svg viewBox="0 0 16 48" width={16 * S} height={48 * S}>
        <Rect x={7} y={0} width={2} height={40} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Rect x={9} y={4} width={3} height={22} fill="#fff" stroke={C} strokeWidth={0.4} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <Rect key={i} x={9} y={5 + i * 2.6} width={i % 2 ? 3 : 2} height={0.5} fill={C} />)}
        <Rect x={6} y={12} width={9} height={0.8} fill="#EF4444" />
        <Rect x={5} y={14} width={4} height={6} fill="#D4F0F8" stroke={C} strokeWidth={0.4} />
        <Rect x={5.6} y={17} width={2.8} height={2.5} fill="#BFE3EE" />
        <Path d="M7 20 Q4 26 6 32" fill="none" stroke="#E9D8A6" strokeWidth={0.8} />
        <Rect x={3} y={32} width={8} height={11} fill="#FCF6DC" stroke={C} strokeWidth={0.5} />
        <Rect x={3.5} y={36} width={7} height={6.5} fill="#F2E6A8" />
        {[0, 1, 2, 3].map((i) => <Rect key={i} x={3} y={34 + i * 2.2} width={2} height={0.5} fill={C} opacity={0.5} />)}
        <Ellipse cx={8} cy={45} rx={5} ry={1.8} fill="#6B7280" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── ICPMonitor — intracranial-pressure monitor (blinking readout) ──
export function ICPMonitor({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} offY={-6} w={14} h={26}>
      <Svg viewBox="0 0 14 26" width={14 * S} height={26 * S}>
        <Rect x={0} y={0} width={14} height={11} fill="#1F2937" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={1.5} width={11} height={8} fill="#0B1A22" />
        {/* "12" readout (cyan) + "ICP" tag (gray) as blocks */}
        <Rect x={3} y={3.5} width={4} height={3} fill="#22D3EE" />
        <Rect x={9.5} y={2.8} width={3} height={1.4} fill="#94A3B8" />
        <Path d="M2 8 L4 8 L5 6.5 L6 9 L7 7.5 L12 7.5" fill="none" stroke="#10B981" strokeWidth={0.4} />
        <Rect x={6} y={11} width={2} height={9} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={7} cy={22} rx={5} ry={1.8} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        {/* blink alarm dot */}
        <Circle cx={3.5} cy={2.5} r={1.5} fill="#EF4444" />
      </Svg>
    </Box>
  );
}

// ─── TTMUnit — targeted temperature management (cooling-blanket unit + hose) ──
export function TTMUnit({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={26} h={38}>
      <Svg viewBox="0 0 26 38" width={26 * S} height={38 * S}>
        <Path d="M2 6 Q-2 10 4 13 Q9 16 3 19" fill="none" stroke="#7FB8D8" strokeWidth={2.5} />
        <Path d="M3 4 L20 4 L21 6 L2 6 Z" fill="#2C5E7C" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={6} width={19} height={15} fill="#3E7CA0" stroke={C} strokeWidth={0.5} />
        <Rect x={4} y={8} width={11} height={7} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        {/* "34°" target-temp readout (cyan block) */}
        <Rect x={6} y={10} width={7} height={3} fill="#7DD3FC" />
        <Rect x={4} y={15.5} width={11} height={1} fill="#22D3EE" />
        <Rect x={16} y={8} width={4} height={10} fill="#BFE3EE" stroke={C} strokeWidth={0.4} />
        <Rect x={16} y={13} width={4} height={5} fill="#9FD0E4" />
        <Rect x={2} y={21} width={19} height={9} fill="#6B7280" stroke={C} strokeWidth={0.5} />
        <Rect x={3.5} y={22.5} width={16} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={5} cy={33} rx={2.2} ry={1.6} fill={C} />
        <Ellipse cx={18} cy={33} rx={2.2} ry={1.6} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── FoleyBag — hourly-urine-output bag (under the bed) ──
export function FoleyBag({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={4} offY={2} w={8} h={16}>
      <Svg viewBox="0 0 8 16" width={8 * S} height={16 * S}>
        <Path d="M4 0 Q1 3 3 5" fill="none" stroke="#E9D8A6" strokeWidth={0.7} />
        <Rect x={1} y={5} width={6} height={9} fill="#FCF6DC" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={9} width={5} height={4.5} fill="#E9D86A" />
        {[0, 1, 2].map((i) => <Rect key={i} x={1} y={7 + i * 2} width={1.5} height={0.5} fill={C} opacity={0.5} />)}
      </Svg>
    </Box>
  );
}

// ─── Intercom — security intercom + camera (ICU door wall) ──
export function Intercom({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={1} w={10} h={18}>
      <Svg viewBox="0 0 10 18" width={10 * S} height={18 * S}>
        <Ellipse cx={5} cy={2} rx={3} ry={2} fill="#374151" stroke={C} strokeWidth={0.4} />
        <Circle cx={5} cy={2.2} r={1} fill="#0B1620" />
        <Circle cx={5} cy={2.2} r={0.4} fill="#22D3EE" />
        <Rect x={1} y={5} width={8} height={12} fill="#9CA3AF" stroke={C} strokeWidth={0.5} />
        <Rect x={2.5} y={6.5} width={5} height={3} fill="#1F2937" />
        {[0, 1, 2].map((i) => <Rect key={i} x={3} y={7 + i} width={4} height={0.4} fill="#4B5563" />)}
        <Circle cx={5} cy={13} r={2} fill="#EF4444" stroke={C} strokeWidth={0.4} />
        <Circle cx={5} cy={13} r={0.8} fill="#FCA5A5" />
      </Svg>
    </Box>
  );
}

// ─── GownBox — visitor disposable-gown dispenser (wall) ──
export function GownBox({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={22}>
      <Svg viewBox="0 0 12 22" width={12 * S} height={22 * S}>
        <Rect x={1} y={0} width={10} height={4} fill="#3B82F6" stroke={C} strokeWidth={0.4} />
        <Rect x={2.5} y={1.4} width={7} height={1.4} fill="#fff" />
        <Rect x={1} y={5} width={10} height={14} fill="#E5E7EB" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={6.5} width={8} height={3} fill="#FEF3C7" stroke={C} strokeWidth={0.3} />
        <Rect x={2} y={10} width={8} height={3} fill="#FDE68A" stroke={C} strokeWidth={0.3} />
        <Rect x={2.5} y={15.5} width={7} height={2.5} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Path d="M3.5 15.5 Q6 13.5 8.5 15.5 Z" fill="#FEF3C7" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

// ─── VisitorScreen — visitor-info screen ("no visits allowed") ──
export function VisitorScreen({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} w={W} h={14}>
      <Svg viewBox={`0 0 ${W} 14`} width={W * S} height={14 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={14} fill="#111827" stroke={C} strokeWidth={0.6} />
        <Rect x={1.5} y={1.5} width={W - 3} height={11} fill="#1A0B0B" />
        <Rect x={2.5} y={3} width={W - 5} height={4} fill="#DC2626" />
        <Rect x={4} y={4.2} width={w * 9} height={1.6} fill="#fff" />
        <Rect x={2.5} y={8.5} width={w * 10} height={1} fill="#7F1D1D" />
        <Rect x={2.5} y={10.2} width={w * 7} height={1} fill="#7F1D1D" />
        <Rect x={W - 7} y={8.5} width={3.5} height={3} fill="#FACC15" />
      </Svg>
    </Box>
  );
}

/** Render an ICU-specific object by type. null if unknown. */
export function IcuObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'crrt': return <CRRTMachine x={x} y={y} />;
    case 'ivpumptower': return <IVPumpTower x={x} y={y} />;
    case 'evdstand': return <EVDStand x={x} y={y} />;
    case 'icpmonitor': return <ICPMonitor x={x} y={y} />;
    case 'ttmunit': return <TTMUnit x={x} y={y} />;
    case 'foleybag': return <FoleyBag x={x} y={y} />;
    case 'intercom': return <Intercom x={x} y={y} />;
    case 'gownbox': return <GownBox x={x} y={y} />;
    case 'visitorscreen': return <VisitorScreen x={x} y={y} w={typeof props?.w === 'number' ? props.w : 2} />;
    default: return null;
  }
}
