// ER master-blueprint equipment (5g-a) — compact RN-svg ports of the
// interior-objects-er2/er3 catalog. Authored at ITILE=16, rendered at TILE px
// via S. Room-defining objects (lobby security / triage / nursing station /
// critical / isolation / psych / decon / family). Minor desk props (tissue box,
// desk phone, chart binder, framed picture, etc.) are a later polish pass.
import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
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

// ── triage / waiting ──
export function VitalsCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} offY={-6} w={14} h={34}>
      <Svg viewBox="0 0 14 34" width={14 * S} height={34 * S}>
        <Ellipse cx={7} cy={29.6} rx={5} ry={1.7} fill="rgba(0,0,0,0.16)" />
        {/* FAR top face — monitor casing top + hanging SpO2 probe */}
        <Path d="M2 1 Q1 1 1 2 L1 6 L13 6 L13 2 Q13 1 12 1 Z" fill="#B7BEC6" stroke={C} strokeWidth={0.45} />
        <Path d="M13 4 q3 4 1 9" fill="none" stroke={C} strokeWidth={0.5} />
        <Rect x={12.6} y={12.4} width={2.6} height={2.4} rx={0.6} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        {/* seam top → screen panel */}
        <Line x1={1} y1={6} x2={13} y2={6} stroke={C} strokeWidth={0.55} />
        {/* NEAR viewer-facing SCREEN panel */}
        <Rect x={1} y={6} width={12} height={9} fill="#374151" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={7} width={10} height={7} rx={0.5} fill="#0F1A24" />
        {/* SpO2 readout (cyan) */}
        <Rect x={3.1} y={8} width={2.6} height={2.4} fill="#22D3EE" />
        {/* temp readout (amber) */}
        <Rect x={7.4} y={8.2} width={4} height={2} fill="#FACC15" />
        <Path d="M2.4 12.4 L4 12.4 L4.8 10.8 L5.6 13.4 L6.4 11.4 L7.2 12.4 L11.6 12.4" fill="none" stroke="#10B981" strokeWidth={0.55} />
        {/* pole */}
        <Rect x={6} y={15} width={2} height={7} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        {/* supply basket (top face) with thermometer */}
        <Path d="M2 21 L12 21 L11.4 25 L2.6 25 Z" fill="#CBD5E1" stroke={C} strokeWidth={0.45} />
        <Rect x={3.2} y={21.6} width={5} height={1.5} rx={0.4} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={3.5} y={21.9} width={1} height={1} fill="#EF4444" />
        {/* wheeled base */}
        <Rect x={3} y={25} width={8} height={2.4} rx={0.5} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={4.5} cy={28.6} rx={1.8} ry={1.3} fill="#2C3239" />
        <Ellipse cx={9.5} cy={28.6} rx={1.8} ry={1.3} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

export function IVPump({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-22} w={16} h={46}>
      <Svg viewBox="0 0 16 46" width={16 * S} height={46 * S}>
        <Ellipse cx={8} cy={45} rx={5.4} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* hook */}
        <Rect x={6} y={0} width={5} height={2} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={6} y={0} width={2} height={4} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        {/* IV bag */}
        <Rect x={4} y={4} width={8} height={9} fill="#A8DCEC" stroke={C} strokeWidth={0.5} />
        <Rect x={5} y={5} width={6} height={1} fill="#D4F0F8" />
        <Rect x={5} y={6.5} width={6} height={4} fill="#7DBFD9" />
        <Rect x={5} y={11} width={6} height={1.5} fill="#fff" />
        {/* pole */}
        <Rect x={7} y={13} width={2} height={9} fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
        {/* PUMP box mounted on pole — larger top face (higher angle) + viewer-facing screen */}
        <Path d="M2 19 L14 19 L14 23.5 L2 23.5 Z" fill="#5B6672" stroke={C} strokeWidth={0.45} />
        <Rect x={3} y={20} width={5} height={2.6} rx={0.4} fill="#3A424B" />
        <Line x1={2} y1={23.5} x2={14} y2={23.5} stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={23.5} width={12} height={8.5} fill="#475569" stroke={C} strokeWidth={0.6} />
        <Rect x={3} y={24.4} width={10} height={3.6} rx={0.4} fill="#0F1A24" />
        <Rect x={4} y={25.2} width={5} height={1.2} fill="#22D3EE" />
        <Rect x={4} y={26.8} width={3} height={1} fill="#10B981" />
        {/* buttons */}
        <Rect x={3.5} y={29} width={2} height={2} rx={0.4} fill="#10B981" stroke={C} strokeWidth={0.3} />
        <Rect x={6.5} y={29} width={2} height={2} rx={0.4} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        <Rect x={9.5} y={29} width={2.5} height={2} rx={0.4} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        {/* lower pole + spider base */}
        <Rect x={7} y={31} width={2} height={8} fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={8} cy={40} rx={6} ry={2} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={3} cy={42} rx={1.4} ry={1} fill={C} />
        <Ellipse cx={13} cy={42} rx={1.4} ry={1} fill={C} />
        <Ellipse cx={8} cy={43} rx={1.4} ry={1} fill={C} />
      </Svg>
    </Box>
  );
}

export function DressingCart({ x, y }: { x: number; y: number }) {
  const sil = 'M2 2 Q1 2 1 3 L1 24 Q1 25 2 25 L20 25 Q21 25 21 24 L21 3 Q21 2 20 2 Z';
  return (
    <Box x={x} y={y} offY={-4} w={22.4} h={28.8}>
      <Svg viewBox="0 0 22 30" width={22.4 * S} height={28.8 * S}>
        <Ellipse cx={11} cy={28.4} rx={7.5} ry={2.6} fill="rgba(0,0,0,0.16)" />
        {/* full silhouette */}
        <Path d={sil} fill="#AEB4BC" />
        {/* TOP tray face — supplies seen from above */}
        <Path d="M2 2 Q1 2 1 3 L1 13 L21 13 L21 3 Q21 2 20 2 Z" fill="#E1E5EA" />
        <Ellipse cx={5} cy={4.2} rx={1.7} ry={1} fill="#92400E" stroke={C} strokeWidth={0.3} />
        <Rect x={3.6} y={4.2} width={2.8} height={4.6} rx={0.4} fill="#B45309" stroke={C} strokeWidth={0.35} />
        <Rect x={8.5} y={4} width={4.4} height={4.6} rx={0.4} fill="#fff" stroke={C} strokeWidth={0.35} />
        <Line x1={8.5} y1={5.6} x2={12.9} y2={5.6} stroke="#D6DCE2" strokeWidth={0.5} />
        <Line x1={8.5} y1={7} x2={12.9} y2={7} stroke="#D6DCE2" strokeWidth={0.5} />
        <Rect x={14.5} y={4} width={4.6} height={4.6} rx={0.4} fill="#A5D8E8" stroke={C} strokeWidth={0.35} />
        <Rect x={15} y={4.6} width={3.4} height={1.2} fill="#fff" opacity={0.6} />
        <Ellipse cx={7} cy={11} rx={3.4} ry={1.4} fill="#E5E7EB" stroke={C} strokeWidth={0.35} />
        <Rect x={12} y={10.2} width={6} height={1.4} rx={0.5} fill="#9CA3AF" />
        {/* seam top → front */}
        <Line x1={1} y1={13} x2={21} y2={13} stroke={C} strokeWidth={0.55} />
        {/* FRONT band — two drawers */}
        <Rect x={2.5} y={14.2} width={17} height={4} rx={0.4} fill="#C6C2B6" stroke={C} strokeWidth={0.4} />
        <Rect x={9} y={15.6} width={4} height={1.2} fill="#8A8577" />
        <Rect x={2.5} y={19} width={17} height={4} rx={0.4} fill="#C6C2B6" stroke={C} strokeWidth={0.4} />
        <Rect x={9} y={20.4} width={4} height={1.2} fill="#8A8577" />
        {/* outer outline */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.65} />
        {/* wheels */}
        <Ellipse cx={4.5} cy={26.5} rx={2} ry={1.4} fill="#2C3239" />
        <Ellipse cx={17.5} cy={26.5} rx={2} ry={1.4} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

export function MedFridge({ x, y }: { x: number; y: number }) {
  const sil = 'M1 2 Q0.5 2 0.5 2.6 L0.5 27 Q0.5 27.6 1 27.6 L13 27.6 Q13.5 27.6 13.5 27 L13.5 2.6 Q13.5 2 13 2 Z';
  return (
    <Box x={x} y={y} offX={1} offY={-6} w={14} h={28.8}>
      <Svg viewBox="0 0 14 30" width={14 * S} height={28.8 * S}>
        <Ellipse cx={7} cy={29} rx={4.8} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* full silhouette */}
        <Path d={sil} fill="#C1C7CE" />
        {/* TOP face (high angle) + temp display */}
        <Path d="M1 2 Q0.5 2 0.5 2.6 L0.5 9 L13.5 9 L13.5 2.6 Q13.5 2 13 2 Z" fill="#D8DDE2" />
        <Rect x={8} y={3.4} width={4} height={1.8} rx={0.3} fill="#0B2A3A" />
        <Rect x={8.5} y={3.8} width={2.6} height={1} fill="#22D3EE" />
        {/* seam top → door */}
        <Line x1={0.5} y1={9} x2={13.5} y2={9} stroke={C} strokeWidth={0.55} />
        {/* FRONT glass door — shelves of vials */}
        <Rect x={1.5} y={10} width={11} height={16.4} rx={0.5} fill="#BFE3EE" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={10.5} width={3} height={15.4} fill="#D7F0F6" opacity={0.55} />
        {[11.5, 15.5, 19.5, 23].map((sy, r) => (
          <G key={r}>
            <Rect x={2} y={sy} width={10} height={3} fill="#A7CBD8" stroke={C} strokeWidth={0.25} />
            {[0, 1, 2, 3].map((i) => (
              <Rect key={i} x={2.6 + i * 2.4} y={sy + 0.4} width={1.6} height={2.2} fill={['#FCA5A5', '#FACC15', '#A7F3D0', '#BAE6FD'][(r + i) % 4]} stroke={C} strokeWidth={0.2} />
            ))}
          </G>
        ))}
        <Rect x={11.3} y={15} width={1.2} height={7} rx={0.4} fill="#6B7280" stroke={C} strokeWidth={0.3} />
        {/* outer outline */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.65} />
      </Svg>
    </Box>
  );
}

export function SecurityScanner({ x, y }: { x: number; y: number }) {
  const tunnel = 'M2 4 Q1 4 1 5 L1 16 Q1 17 2 17 L13 17 Q14 17 14 16 L14 5 Q14 4 13 4 Z';
  return (
    <Box x={x} y={y} offY={-4} w={32} h={25.6}>
      <Svg viewBox="0 0 32 26" width={32 * S} height={25.6 * S}>
        <Ellipse cx={16} cy={23.3} rx={10.9} ry={3.7} fill="rgba(0,0,0,0.16)" />
        {/* SCANNER TUNNEL (left) — top face + front with mouth */}
        <Path d={tunnel} fill="#5B6672" />
        <Path d="M2 4 Q1 4 1 5 L1 10 L14 10 L14 5 Q14 4 13 4 Z" fill="#8A929B" />
        <Rect x={10} y={5.4} width={3} height={3.4} rx={0.4} fill="#0F1A24" />
        <Rect x={10.4} y={5.9} width={2.2} height={1} fill="#F59E0B" />
        {/* tunnel mouth on the front */}
        <Rect x={2.5} y={11} width={6.5} height={5} rx={0.4} fill="#0B2A3A" stroke={C} strokeWidth={0.4} />
        {[0, 1, 2, 3].map((i) => <Rect key={i} x={2.9 + i * 1.5} y={11.3} width={1.05} height={4.4} fill="#0B1C26" />)}
        <Path d={tunnel} fill="none" stroke={C} strokeWidth={0.6} />
        {/* BELT LINE (right) — top belt surface + thin front edge */}
        <Path d="M14 8 L31 8 L31 15 L14 15 Z" fill="#6B7280" stroke={C} strokeWidth={0.45} />
        {[16.5, 20, 23.5, 27, 30].map((rx, i) => <Line key={i} x1={rx} y1={8} x2={rx} y2={15} stroke="#565E66" strokeWidth={0.5} />)}
        <Rect x={14} y={15} width={17} height={1.8} fill="#4B5563" stroke={C} strokeWidth={0.4} />
        {/* a tray + bag riding on the belt (top-down) */}
        <Rect x={22} y={9.5} width={7} height={4} rx={0.5} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={25.5} cy={11.5} rx={2.6} ry={1.6} fill="#7C3F00" stroke={C} strokeWidth={0.4} />
        {/* legs */}
        <Ellipse cx={3} cy={18} rx={1.6} ry={1.1} fill="#2C3239" />
        <Ellipse cx={12} cy={18} rx={1.6} ry={1.1} fill="#2C3239" />
        <Ellipse cx={17} cy={17} rx={1.4} ry={1} fill="#2C3239" />
        <Ellipse cx={29} cy={17} rx={1.4} ry={1} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

export function MetalDetector({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-10} w={32} h={32}>
      <Svg viewBox="0 0 32 32" width={32 * S} height={32 * S}>
        <Ellipse cx={16} cy={29.3} rx={10.9} ry={3.7} fill="rgba(0,0,0,0.16)" />
        {/* floor footprint (walk-through opening seen from above) */}
        <Path d="M4 20 L28 20 L26 30 L6 30 Z" fill="#0F1A24" opacity={0.14} />
        {/* LEFT pillar — top cap (parallelogram) + front face */}
        <Path d="M2 6 L9 6 L10.5 9 L3.5 9 Z" fill="#EDEFF2" stroke={C} strokeWidth={0.5} />
        <Rect x={3.5} y={9} width={7} height={19} fill="#D3D8DE" stroke={C} strokeWidth={0.5} />
        <Rect x={4.2} y={9.6} width={1.4} height={17.6} fill="#EDEFF2" />
        <Rect x={6} y={12} width={3} height={2.6} rx={0.4} fill="#10B981" stroke={C} strokeWidth={0.3} />
        <Rect x={6} y={15.4} width={3} height={2.6} rx={0.4} fill="#334155" stroke={C} strokeWidth={0.3} />
        {/* RIGHT pillar */}
        <Path d="M23 6 L30 6 L31.5 9 L24.5 9 Z" fill="#EDEFF2" stroke={C} strokeWidth={0.5} />
        <Rect x={24.5} y={9} width={7} height={19} fill="#D3D8DE" stroke={C} strokeWidth={0.5} />
        <Rect x={25.2} y={9.6} width={1.4} height={17.6} fill="#EDEFF2" />
        {/* TOP lintel — top face slab + thin front band */}
        <Path d="M2 2 L30 2 L28.5 5 L3.5 5 Z" fill="#DDE1E6" stroke={C} strokeWidth={0.5} />
        <Path d="M3.5 5 L28.5 5 L28.5 7 L3.5 7 Z" fill="#B7BEC6" stroke={C} strokeWidth={0.45} />
        <Circle cx={16} cy={3.4} r={1.4} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        {/* feet */}
        <Ellipse cx={6.5} cy={29} rx={2.4} ry={1.2} fill="#5B6672" />
        <Ellipse cx={27.5} cy={29} rx={2.4} ry={1.2} fill="#5B6672" />
      </Svg>
    </Box>
  );
}

export function BoltedBed({ x, y, occupied }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} w={32} h={48}>
      <Svg viewBox="0 0 32 48" width={32 * S} height={48 * S}>
        <Ellipse cx={16} cy={45.3} rx={10.9} ry={3.7} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={6} width={28} height={36} rx={3} fill="#6E6256" stroke={C} strokeWidth={0.7} />
        <Rect x={4} y={8} width={24} height={30} rx={2} fill="#8C9AA6" stroke={C} strokeWidth={0.5} />
        <Rect x={5} y={9} width={22} height={2} fill="#A6B2BC" />
        <Line x1={16} y1={9} x2={16} y2={37} stroke="#5E6A74" strokeWidth={0.4} opacity={0.5} />
        <Line x1={5} y1={23} x2={27} y2={23} stroke="#5E6A74" strokeWidth={0.4} opacity={0.5} />
        {[[4.5, 7.5], [27.5, 7.5], [4.5, 40.5], [27.5, 40.5]].map(([bx, by], i) => (
          <G key={i}>
            <Circle cx={bx} cy={by} r={1.3} fill="#3A4048" stroke={C} strokeWidth={0.4} />
            <Rect x={bx - 0.6} y={by - 0.2} width={1.2} height={0.4} fill="#9CA3AF" />
          </G>
        ))}
        {occupied ? (
          <G>
            <Rect x={13} y={12} width={6} height={4} fill="#FDE1C8" />
            <Rect x={13} y={11} width={6} height={1.2} fill="#4B2E18" />
            <Rect x={9} y={18} width={14} height={16} fill="#C7D0D8" opacity={0.8} />
          </G>
        ) : null}
        <Rect x={2} y={42} width={28} height={3} rx={1.5} fill="#5A4F44" stroke={C} strokeWidth={0.5} />
      </Svg>
    </Box>
  );
}

export function DeconShower({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={-6} w={12} h={30}>
      <Svg viewBox="0 0 12 30" width={12 * S} height={30 * S}>
        <Ellipse cx={6} cy={29} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={5} y={0} width={2} height={6} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        {/* pull-chain valve */}
        <Rect x={8} y={1} width={1} height={6} fill="#FACC15" />
        <Rect x={7.6} y={6.5} width={1.8} height={1.5} fill="#EAB308" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={6} cy={8} rx={5.5} ry={2} fill="#6B7280" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={6} cy={7.6} rx={4.5} ry={1.3} fill="#94A3B8" />
        {[2.5, 4, 5.5, 7, 8.5].map((jx, i) => (
          <Rect key={i} x={jx} y={10} width={0.8} height={i % 2 ? 16 : 12} fill="#9FD8EC" opacity={0.75} />
        ))}
        <Ellipse cx={6} cy={27} rx={5} ry={1.6} fill="#BFE3EE" opacity={0.5} />
      </Svg>
    </Box>
  );
}

export function Sofa({ x, y, w = 2, color = '#8FA9C4' }: { x: number; y: number; w?: number; color?: string }) {
  const W = w * 16;
  const dk = '#5E7286';
  const lt = '#A9C0D6';
  return (
    <Box x={x} y={y} offY={-6} w={W} h={26}>
      <Svg viewBox={`0 0 ${W} 26`} width={W * S} height={26 * S} preserveAspectRatio="none">
        <Ellipse cx={w * 8} cy={24.5 - w * 2.3} rx={w * 6.8} ry={w * 2.3} fill="rgba(0,0,0,0.16)" />
        <Path d={`M3 2 L${W - 3} 2 L${W - 2} 4 L2 4 Z`} fill={lt} stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={4} width={W - 4} height={7} fill={color} stroke={C} strokeWidth={0.4} />
        <Rect x={0} y={5} width={3.5} height={13} rx={1} fill={dk} stroke={C} strokeWidth={0.4} />
        <Rect x={W - 3.5} y={5} width={3.5} height={13} rx={1} fill={dk} stroke={C} strokeWidth={0.4} />
        <Path d={`M3 11 L${W - 3} 11 L${W - 3} 17 L3 17 Z`} fill={lt} stroke={C} strokeWidth={0.4} />
        {Array.from({ length: w }).map((_, i) => {
          const lx = 3 + (i + 1) * ((W - 6) / w);
          return <Line key={i} x1={lx} y1={11} x2={lx} y2={17} stroke={dk} strokeWidth={0.4} opacity={0.5} />;
        })}
        <Rect x={3} y={17} width={W - 6} height={2} fill={dk} stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={19} width={2} height={4} fill="#5C3A1A" />
        <Rect x={W - 5} y={19} width={2} height={4} fill="#5C3A1A" />
      </Svg>
    </Box>
  );
}

export function WaitingDisplay({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} w={W} h={14}>
      <Svg viewBox={`0 0 ${W} 14`} width={W * S} height={14 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={14} fill="#1F2937" stroke={C} strokeWidth={0.6} />
        <Rect x={1.5} y={1.5} width={W - 3} height={11} fill="#0B2A3A" />
        <Rect x={1.5} y={1.5} width={W - 3} height={3} fill="#DC2626" />
        <Rect x={3} y={2.3} width={10} height={1.4} fill="#fff" />
        <Rect x={3} y={6} width={7} height={5} fill="#FACC15" />
        <Rect x={W - 13} y={6} width={10} height={1.2} fill="#22D3EE" />
        <Rect x={W - 13} y={8} width={10} height={1.2} fill="#94A3B8" />
        <Rect x={W - 13} y={10} width={7} height={1.2} fill="#94A3B8" />
      </Svg>
    </Box>
  );
}

export function WasteBin({ x, y, tone = 'general' }: { x: number; y: number; tone?: string }) {
  const inf = tone === 'infectious';
  const body = inf ? '#FACC15' : '#CBD5E1';
  const bodyDk = inf ? '#CA8A04' : '#94A3B8';
  const lid = inf ? '#EAB308' : '#9CA3AF';
  return (
    <Box x={x} y={y} offX={3} w={10} h={18}>
      <Svg viewBox="0 0 10 18" width={10 * S} height={18 * S}>
        <Ellipse cx={5} cy={17} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* pedal lid top */}
        <Ellipse cx={5} cy={3} rx={4.5} ry={1.6} fill={lid} stroke={C} strokeWidth={0.4} />
        <Rect x={0.5} y={3} width={9} height={2} fill={lid} />
        {/* body + shaded side */}
        <Path d="M1 5 L9 5 L8.3 15 L1.7 15 Z" fill={body} stroke={C} strokeWidth={0.5} />
        <Path d="M5.5 5 L9 5 L8.3 15 L5 15 Z" fill={bodyDk} opacity={0.4} />
        {/* biohazard mark (infectious) / paper label (general) */}
        {inf ? (
          <>
            <Circle cx={5} cy={9.5} r={1.6} fill="none" stroke={C} strokeWidth={0.5} />
            <Circle cx={5} cy={9.5} r={0.6} fill={C} />
            <Circle cx={5} cy={7.7} r={0.9} fill="none" stroke={C} strokeWidth={0.5} />
            <Circle cx={3.5} cy={10.4} r={0.9} fill="none" stroke={C} strokeWidth={0.5} />
            <Circle cx={6.5} cy={10.4} r={0.9} fill="none" stroke={C} strokeWidth={0.5} />
          </>
        ) : (
          <Rect x={3} y={8} width={4} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        )}
        {/* foot pedal */}
        <Rect x={1} y={15.5} width={3} height={1.5} fill="#6B7280" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

export function PPEStand({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} offY={-8} w={14} h={34}>
      <Svg viewBox="0 0 14 34" width={14 * S} height={34 * S}>
        <Ellipse cx={7} cy={33} rx={4.8} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* rail top + post */}
        <Rect x={1} y={2} width={12} height={1.5} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={6.5} y={0} width={1} height={3} fill="#6B7280" />
        {/* hanger + level-D coverall */}
        <Rect x={6} y={3} width={2} height={1} fill="#374151" />
        <Path d="M3 4 L11 4 L12 8 L9.5 8 L9.5 20 L4.5 20 L4.5 8 L2 8 Z" fill="#FEFCE8" stroke={C} strokeWidth={0.5} />
        {/* hood + zipper */}
        <Rect x={6} y={4} width={2} height={3} fill="#FEF9C3" stroke={C} strokeWidth={0.3} />
        <Rect x={6.7} y={7} width={0.6} height={12} fill="#CA8A04" />
        {/* mask/glove box at base — top face + front */}
        <Path d="M2.6 21 L12 21 L12.8 22.4 L1.8 22.4 Z" fill="#5FA0D8" stroke={C} strokeWidth={0.45} />
        <Rect x={2} y={22.4} width={10} height={5.6} fill="#3B82F6" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={23.4} width={8} height={2.5} rx={0.3} fill="#fff" />
        <Rect x={3.5} y={23.9} width={3} height={1.5} fill="#A5D8E8" />
        {/* legs */}
        <Rect x={3} y={28} width={1.5} height={4} fill="#6B7280" />
        <Rect x={9.5} y={28} width={1.5} height={4} fill="#6B7280" />
      </Svg>
    </Box>
  );
}

export function FloorDrain({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} w={W} h={16}>
      <Svg viewBox={`0 0 ${W} 16`} width={W * S} height={16 * S} preserveAspectRatio="none">
        <Rect x={1} y={2} width={W - 2} height={12} rx={1} fill="#7E8A8E" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={3} width={W - 4} height={10} fill="#5E6E72" />
        {Array.from({ length: w * 4 }).map((_, i) => (
          <Rect key={i} x={2.5 + i * ((W - 5) / (w * 4))} y={3.5} width={1.2} height={9} fill="#3A4448" />
        ))}
        <Rect x={3} y={4} width={w * 5} height={1.5} fill="#A7C7D2" opacity={0.4} />
      </Svg>
    </Box>
  );
}

export function ChemDrum({ x, y, tone = 'chem' }: { x: number; y: number; tone?: string }) {
  const body = tone === 'waste' ? '#E0E4E8' : '#F0A93C';
  const bodyDk = tone === 'waste' ? '#A8AEB6' : '#C07E1E';
  return (
    <Box x={x} y={y} offX={2} offY={-4} w={12} h={26}>
      <Svg viewBox="0 0 12 26" width={12 * S} height={26 * S}>
        <Ellipse cx={6} cy={25} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* lid + bung */}
        <Ellipse cx={6} cy={3} rx={5} ry={1.8} fill={bodyDk} stroke={C} strokeWidth={0.4} />
        <Ellipse cx={6} cy={2.6} rx={4} ry={1.2} fill={body} />
        <Rect x={4.5} y={1.5} width={3} height={1.4} fill="#6B7280" />
        {/* body + side highlight */}
        <Rect x={1} y={3} width={10} height={20} fill={body} stroke={C} strokeWidth={0.5} />
        <Rect x={1.6} y={4} width={1.6} height={18} fill={tone === 'waste' ? '#F4F6F8' : '#F8C266'} />
        {/* hoop ribs */}
        <Rect x={1} y={9} width={10} height={1} fill={bodyDk} />
        <Rect x={1} y={16} width={10} height={1} fill={bodyDk} />
        {/* hazard label */}
        <Rect x={3} y={11} width={6} height={4.5} fill="#fff" stroke={C} strokeWidth={0.4} />
        {tone === 'waste' ? (
          <>
            <Circle cx={6} cy={13.2} r={1.3} fill="none" stroke={C} strokeWidth={0.4} />
            <Circle cx={6} cy={13.2} r={0.5} fill={C} />
            <Circle cx={6} cy={11.7} r={0.7} fill="none" stroke={C} strokeWidth={0.4} />
            <Circle cx={4.9} cy={14} r={0.7} fill="none" stroke={C} strokeWidth={0.4} />
            <Circle cx={7.1} cy={14} r={0.7} fill="none" stroke={C} strokeWidth={0.4} />
          </>
        ) : (
          <Path d="M6 11.6 L8 15 L4 15 Z" fill="#EF4444" stroke={C} strokeWidth={0.3} />
        )}
        {/* base */}
        <Ellipse cx={6} cy={23} rx={5} ry={1.6} fill={bodyDk} stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

export function TriageLine({ x, y, w = 1, h = 1, color = '#EF4444' }: { x: number; y: number; w?: number; h?: number; color?: string }) {
  const horiz = w >= h;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: w * TILE, height: h * TILE }}>
      <View style={horiz
        ? { position: 'absolute', left: 4, right: 4, top: '50%', height: 8, marginTop: -4, backgroundColor: color }
        : { position: 'absolute', top: 4, bottom: 4, left: '50%', width: 8, marginLeft: -4, backgroundColor: color }} />
    </View>
  );
}

// ── Nurse station — ㄷ/U open desk: wood U body (top bar + two side legs, open
//    well) + quartz tops + raised back ledge + monitor wall (1st=CT, rest=EMR +
//    keyboards) + drawer pedestals at the front corners + side accessories.
//    1:1 port of interior-objects-er3.jsx NurseStationDesk. ──
export function NurseStationDesk({ x, y, w = 10, h = 6 }: { x: number; y: number; w?: number; h?: number }) {
  const W = w * 16;
  const HH = h * 16;
  const R = 10;
  const TH = HH + R;
  const bar = 16;
  const wood = '#E4E2D8';
  const woodDk = '#BFBBAD';
  const qz = '#EAE3D0';
  const qzEdge = '#D2C9AE';
  const qzHi = '#F4EFDF';
  const nMon = Math.max(3, w - 4);
  const monXs: number[] = [];
  for (let i = 0; i < nMon; i++) monXs.push(24 + (i + 0.5) * ((W - 48) / nMon));
  return (
    <Box x={x} y={y} offY={-R} w={W} h={TH}>
      <Svg viewBox={`0 0 ${W} ${TH}`} width={W * S} height={TH * S}>
        {/* wood U body: top run + left run + right run (open well in the middle) */}
        <Rect x={4} y={R} width={W - 8} height={bar + 5} fill={wood} stroke={C} strokeWidth={0.7} />
        <Rect x={4} y={R} width={bar + 4} height={HH - 6} fill={wood} stroke={C} strokeWidth={0.7} />
        <Rect x={W - 4 - (bar + 4)} y={R} width={bar + 4} height={HH - 6} fill={wood} stroke={C} strokeWidth={0.7} />
        {/* wood grain hint */}
        <Rect x={6} y={R + bar + 2} width={W - 12} height={1} fill={woodDk} opacity={0.4} />
        {/* quartz tops on each run */}
        <Rect x={4} y={R - 2} width={W - 8} height={bar} fill={qz} stroke={C} strokeWidth={0.6} />
        <Rect x={4} y={R - 2} width={bar + 4} height={HH - 8} fill={qz} stroke={C} strokeWidth={0.6} />
        <Rect x={W - 4 - (bar + 4)} y={R - 2} width={bar + 4} height={HH - 8} fill={qz} stroke={C} strokeWidth={0.6} />
        {/* raised back ledge */}
        <Rect x={4} y={R - 4} width={W - 8} height={4} fill={qzEdge} stroke={C} strokeWidth={0.6} />
        <Rect x={5} y={R - 3.4} width={W - 10} height={1} fill={qzHi} />
        {/* quartz front edge highlight */}
        <Rect x={5} y={R + bar - 4} width={W - 10} height={1} fill={qzHi} opacity={0.7} />
        {/* monitor wall on the back run */}
        {monXs.map((mx, i) => (
          <G key={`m${i}`}>
            <Rect x={mx - 1} y={R + bar - 6} width={2} height={3} fill="#3A4048" />
            <Rect x={mx - 3} y={R + bar - 3} width={6} height={1.4} fill="#2A2F36" />
            <Rect x={mx - 7} y={R - 6} width={14} height={bar - 1} fill="#1B2128" stroke={C} strokeWidth={0.5} />
            <Rect x={mx - 5.6} y={R - 4.6} width={11.2} height={bar - 4} fill="#0F1A24" />
            {i === 0 ? (
              <G>
                <Rect x={mx - 5} y={R - 4} width={10.4} height={bar - 5} fill="#142028" />
                <Ellipse cx={mx} cy={R + 1} rx={3.4} ry={4} fill="#3A4A55" />
                <Ellipse cx={mx - 1} cy={R + 1} rx={1} ry={1.4} fill="#0B1116" />
                <Ellipse cx={mx + 1.2} cy={R + 1} rx={1} ry={1.4} fill="#0B1116" />
              </G>
            ) : (
              <G>
                <Rect x={mx - 4.6} y={R - 3.6} width={9} height={1.1} fill="#2BB3C8" />
                <Rect x={mx - 4.6} y={R - 1.6} width={7} height={0.9} fill="#5A6B78" />
                <Rect x={mx - 4.6} y={R} width={9} height={0.9} fill="#5A6B78" />
                <Rect x={mx - 4.6} y={R + 1.6} width={6} height={0.9} fill="#E0A23A" />
                <Rect x={mx - 4.6} y={R + 3.2} width={8} height={0.9} fill="#3FB07A" />
              </G>
            )}
            <Rect x={mx - 5} y={R + bar - 2.5} width={10} height={3} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
            <Rect x={mx - 4.4} y={R + bar - 2} width={8.8} height={2} fill="#8B939C" />
          </G>
        ))}
        {/* drawer pedestals at the two front corners */}
        {[6, W - 6 - 16].map((dx, i) => (
          <G key={`d${i}`}>
            <Rect x={dx} y={R + HH - 28} width={16} height={22} fill={woodDk} stroke={C} strokeWidth={0.6} />
            {[0, 1, 2].map((r) => (
              <G key={r}>
                <Rect x={dx + 1.5} y={R + HH - 26 + r * 7} width={13} height={5.5} fill={wood} stroke={C} strokeWidth={0.4} />
                <Rect x={dx + 5} y={R + HH - 23.5 + r * 7} width={6} height={1.2} fill="#9AA1A8" />
              </G>
            ))}
          </G>
        ))}
        {/* side-counter accessories: label printer (right), wire basket + pen caddy (left), coffee cup */}
        <Rect x={W - 4 - bar + 1} y={R + 2} width={12} height={9} fill="#F2EFE6" stroke={C} strokeWidth={0.5} />
        <Rect x={W - 4 - bar + 2} y={R + 3} width={10} height={2.5} fill="#0F1A24" />
        <Rect x={W - 4 - bar + 2} y={R + 8} width={10} height={1.5} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={7} y={R + 3} width={11} height={7} fill="#F7F7F4" stroke={C} strokeWidth={0.5} />
        <Rect x={7} y={R + 3} width={11} height={7} fill="none" stroke="#B7BEC6" strokeWidth={0.4} strokeDasharray="1 1" />
        <Rect x={8} y={R + 11} width={6} height={5} fill="#7E8893" stroke={C} strokeWidth={0.4} />
        <Rect x={9} y={R + 8} width={1} height={4} fill="#EF4444" />
        <Rect x={11} y={R + 8} width={1} height={4} fill="#3B82F6" />
        <Ellipse cx={W - 12} cy={R + 14} rx={2.4} ry={1.1} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Rect x={W - 14.2} y={R + 11} width={4.4} height={3.2} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={W - 12} cy={R + 11} rx={2.2} ry={0.9} fill="#7C4A22" />
      </Svg>
    </Box>
  );
}

// ── ER-native objects (interior-objects-er.jsx) ──
export function Gurney({ x, y, occupied }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} offY={-4} w={32} h={56}>
      <Svg viewBox="0 0 32 56" width={32 * S} height={56 * S}>
        <Ellipse cx={17} cy={48.5} rx={15} ry={5.5} fill="rgba(0,0,0,0.16)" />
        {/* hand rails (top) */}
        <Rect x={3} y={1} width={26} height={2} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={1} width={2} height={9} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Rect x={27} y={1} width={2} height={9} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        {/* mattress TOP */}
        <Rect x={2} y={10} width={28} height={30} fill="#FFFFFF" stroke={C} strokeWidth={0.5} />
        <Rect x={2.5} y={10.5} width={27} height={1.5} fill="#F3F4F6" />
        {/* pillow */}
        <Rect x={8} y={13} width={16} height={4.5} fill="#F8FAFC" />
        <Rect x={7.5} y={14} width={0.7} height={2.5} fill="#F8FAFC" />
        <Rect x={23.8} y={14} width={0.7} height={2.5} fill="#F8FAFC" />
        <Rect x={9} y={13.5} width={14} height={0.8} fill="#FFFFFF" />
        <Rect x={8} y={16.3} width={16} height={1.2} fill="#E8ECF1" />
        <Rect x={15.7} y={14} width={0.5} height={3} fill="#D8DEE6" opacity={0.55} />
        {/* sheet folds */}
        <Line x1={9} y1={19} x2={9} y2={38} stroke="#C4C4C4" strokeWidth={0.3} opacity={0.5} />
        <Line x1={23} y1={19} x2={23} y2={38} stroke="#C4C4C4" strokeWidth={0.3} opacity={0.5} />
        {/* mattress FRONT + frame */}
        <Rect x={2} y={40} width={28} height={3} fill="#E5E7EB" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={43} width={28} height={3} fill="#4B5563" stroke={C} strokeWidth={0.5} />
        <Rect x={2.5} y={43.5} width={27} height={1} fill="#6B7280" />
        {/* wheel posts */}
        <Rect x={3} y={46} width={3} height={4} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Rect x={26} y={46} width={3} height={4} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={4.5} cy={52} rx={2.5} ry={2} fill={C} />
        <Ellipse cx={27.5} cy={52} rx={2.5} ry={2} fill={C} />
        {/* IV pole left */}
        <Rect x={0} y={2} width={1.5} height={42} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={-1} y={2} width={4} height={5} fill="#A8DCEC" stroke={C} strokeWidth={0.3} />
        {occupied ? (
          <G>
            <Ellipse cx={16} cy={17} rx={3.5} ry={3.5} fill="#FDE1C8" stroke={C} strokeWidth={0.5} />
            <Rect x={14} y={13.5} width={4} height={2} fill="#6B4423" />
            <Rect x={6} y={22} width={20} height={18} fill="#FED7AA" stroke={C} strokeWidth={0.4} />
            <Line x1={6} y1={26} x2={26} y2={26} stroke="#E0A876" strokeWidth={0.5} />
          </G>
        ) : null}
      </Svg>
    </Box>
  );
}

export function Defib({ x, y }: { x: number; y: number }) {
  const sil = 'M4 1 Q2 1 2 3 L2 25 Q2 27 4 27 L20 27 Q22 27 22 25 L22 3 Q22 1 20 1 Z';
  return (
    <Box x={x} y={y} offY={-4} w={24} h={32}>
      <Svg viewBox="0 0 24 32" width={24 * S} height={32 * S}>
        <Ellipse cx={12} cy={30.2} rx={8.2} ry={2.8} fill="rgba(0,0,0,0.16)" />
        {/* full silhouette (top + front, single body) */}
        <Path d={sil} fill="#CA8A04" />
        {/* FAR top face (device top) — paddles resting in their wells */}
        <Path d="M4 1 Q2 1 2 3 L2 12 L22 12 L22 3 Q22 1 20 1 Z" fill="#FDE047" />
        <Ellipse cx={7} cy={6.5} rx={3.2} ry={2.2} fill="#F59E0B" stroke={C} strokeWidth={0.4} />
        <Rect x={6.2} y={4.6} width={1.6} height={1.4} fill="#B45309" />
        <Ellipse cx={16} cy={6.5} rx={3.2} ry={2.2} fill="#F59E0B" stroke={C} strokeWidth={0.4} />
        <Rect x={15.2} y={4.6} width={1.6} height={1.4} fill="#B45309" />
        <Path d="M4 9.6 Q12 8.6 20 9.6" fill="none" stroke={C} strokeWidth={0.5} opacity={0.5} />
        {/* seam: top → near control panel */}
        <Line x1={2} y1={12} x2={22} y2={12} stroke={C} strokeWidth={0.6} />
        {/* NEAR tilted control panel FACING THE VIEWER — screen + dials */}
        <Path d="M2 12 L22 12 L22 22 L2 22 Z" fill="#EAB308" />
        <Rect x={3.5} y={13.2} width={10} height={6.4} rx={0.6} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Path d="M4.2 17 L5.6 17 L6.6 14.4 L7.6 19.2 L8.6 15.6 L9.6 17 L13 17" fill="none" stroke="#10B981" strokeWidth={0.6} />
        {/* 200J readout */}
        <Rect x={9.8} y={13.6} width={4.4} height={1.8} fill="#F87171" />
        <Circle cx={16.5} cy={15} r={1.5} fill="#1F2937" stroke={C} strokeWidth={0.3} />
        <Circle cx={20} cy={15} r={1.5} fill="#DC2626" stroke={C} strokeWidth={0.3} />
        <Circle cx={16.5} cy={18.6} r={1.3} fill="#10B981" stroke={C} strokeWidth={0.3} />
        <Circle cx={20} cy={18.6} r={1.3} fill="#334155" stroke={C} strokeWidth={0.3} />
        {/* seam: panel → drawer band */}
        <Line x1={2} y1={22} x2={22} y2={22} stroke={C} strokeWidth={0.6} />
        {/* front drawer band */}
        <Rect x={4} y={23.4} width={6} height={2.6} rx={0.4} fill="#CA8A04" stroke={C} strokeWidth={0.3} />
        <Rect x={12} y={23.4} width={6} height={2.6} rx={0.4} fill="#CA8A04" stroke={C} strokeWidth={0.3} />
        {/* outer silhouette outline */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={5} cy={28.5} rx={1.8} ry={1.3} fill="#2C3239" />
        <Ellipse cx={19} cy={28.5} rx={1.8} ry={1.3} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

export function OxygenTank({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={-2} w={12} h={20}>
      <Svg viewBox="0 0 12 20" width={12 * S} height={20 * S}>
        <Ellipse cx={6} cy={19} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* valve/regulator seen from above (sits on the shoulder) */}
        <Ellipse cx={6} cy={2.4} rx={1.8} ry={1.1} fill="#B7BEC6" stroke={C} strokeWidth={0.35} />
        <Rect x={5.4} y={1.4} width={1.2} height={1.4} fill="#9CA3AF" />
        {/* big top ellipse (cylinder cap, high angle) */}
        <Ellipse cx={6} cy={5} rx={4.4} ry={2.4} fill="#22C55E" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={6} cy={4.4} rx={3} ry={1.4} fill="#4ADE80" />
        {/* cylinder body — vertical sides */}
        <Path d="M1.6 5 L1.6 15 Q1.6 17 6 17 Q10.4 17 10.4 15 L10.4 5" fill="#16A34A" stroke={C} strokeWidth={0.45} />
        <Rect x={2.4} y={6} width={1.6} height={9} fill="#22C55E" opacity={0.7} />
        {/* O2 label band */}
        <Rect x={3} y={9.5} width={6} height={4} rx={0.4} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={4.2} y={10.4} width={3.6} height={2.4} fill={C} />
        {/* bottom rim */}
        <Path d="M1.6 15 Q1.6 17 6 17 Q10.4 17 10.4 15" fill="none" stroke={C} strokeWidth={0.45} />
      </Svg>
    </Box>
  );
}

export function GloveDispenser({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={14}>
      <Svg viewBox="0 0 12 14" width={12 * S} height={14 * S}>
        <Ellipse cx={6} cy={13} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* top face */}
        <Path d="M1 1 L11 1 L12 2.5 L0 2.5 Z" fill="#94A3B8" stroke={C} strokeWidth={0.3} />
        {/* body */}
        <Rect x={1} y={2} width={10} height={9} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={2} width={10} height={1.5} fill="#3B82F6" />
        {/* glass window */}
        <Rect x={2} y={4} width={8} height={5} fill="#A8DCEC" stroke={C} strokeWidth={0.3} />
        <Rect x={2.5} y={4.5} width={7} height={0.8} fill="#D4F0F8" />
        {/* glove peeking out */}
        <Path d="M3.5 8 L8.5 8 L7.5 12 L4.5 12 Z" fill="#3B82F6" stroke={C} strokeWidth={0.3} />
        <Rect x={3.5} y={11.5} width={5} height={0.8} fill="#1E40AF" />
      </Svg>
    </Box>
  );
}

export function SharpsContainer({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={14}>
      <Svg viewBox="0 0 12 14" width={12 * S} height={14 * S}>
        <Ellipse cx={6} cy={13} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M1 1 L11 1 L12 3 L0 3 Z" fill="#FACC15" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={1.5} width={6} height={0.8} fill={C} />
        <Rect x={1} y={3} width={10} height={10} fill="#DC2626" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={3.5} width={1.5} height={9} fill="#F87171" />
        <Rect x={3} y={6} width={6} height={5} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Circle cx={6} cy={8.5} r={1.4} fill="none" stroke={C} strokeWidth={0.5} />
      </Svg>
    </Box>
  );
}

export function HandSanitizer({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={4} w={8} h={12}>
      <Svg viewBox="0 0 8 12" width={8 * S} height={12 * S}>
        <Ellipse cx={4} cy={11} rx={2.7} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* pump top */}
        <Rect x={3} y={0} width={2} height={2} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={2} y={2} width={4} height={1} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        {/* top face */}
        <Path d="M1 3 L7 3 L7.5 4 L0.5 4 Z" fill="#7DBFD9" stroke={C} strokeWidth={0.3} />
        {/* bottle body */}
        <Rect x={1} y={4} width={6} height={7} fill="#A8DCEC" stroke={C} strokeWidth={0.3} />
        <Rect x={1.5} y={4.5} width={1} height={6} fill="#D4F0F8" />
        {/* fluid label */}
        <Rect x={2} y={7} width={4} height={2} fill="#fff" stroke={C} strokeWidth={0.2} />
        <Line x1={2.5} y1={7.7} x2={5.5} y2={7.7} stroke={C} strokeWidth={0.2} />
      </Svg>
    </Box>
  );
}

export function CompCart({ x, y }: { x: number; y: number }) {
  const sil = 'M2 14 Q1.4 14 1.4 14.6 L1.4 30 Q1.4 30.6 2 30.6 L14 30.6 Q14.6 30.6 14.6 30 L14.6 14.6 Q14.6 14 14 14 Z';
  return (
    <Box x={x} y={y} offY={-4} w={16} h={35.2}>
      <Svg viewBox="0 0 16 36" width={16 * S} height={35.2 * S}>
        <Ellipse cx={8} cy={35} rx={5.4} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* viewer-facing monitor on a neck */}
        <Path d="M3 1.4 L13 1.4 L13.6 2.6 L2.4 2.6 Z" fill="#2C333B" />
        <Rect x={2} y={2.6} width={12} height={9} fill="#1F2937" stroke={C} strokeWidth={0.45} />
        <Rect x={3} y={3.4} width={10} height={7.4} rx={0.4} fill="#0F1A24" />
        <Rect x={4} y={4.4} width={8} height={1} fill="#22D3EE" />
        <Rect x={4} y={6.2} width={8} height={1} fill="#10B981" />
        <Rect x={4} y={8} width={6} height={1} fill="#FACC15" />
        <Rect x={7} y={11.6} width={2} height={2.4} fill="#374151" />
        {/* full cart silhouette (top keyboard tray + front drawers) */}
        <Path d={sil} fill="#AEB4BC" />
        {/* TOP keyboard tray face */}
        <Path d="M2 14 Q1.4 14 1.4 14.6 L1.4 20 L14.6 20 L14.6 14.6 Q14.6 14 14 14 Z" fill="#C7CDD4" />
        <Rect x={2.6} y={15} width={10.8} height={3.4} rx={0.4} fill="#1F2937" />
        {[0, 1, 2, 3, 4].map((i) => <Rect key={i} x={3.2 + i * 2.1} y={15.6} width={1.5} height={2.2} fill="#3A424B" />)}
        {/* seam → front drawers */}
        <Line x1={1.4} y1={20} x2={14.6} y2={20} stroke={C} strokeWidth={0.55} />
        <Rect x={2.4} y={21} width={11.2} height={3.4} rx={0.3} fill="#EDEFF2" stroke={C} strokeWidth={0.35} />
        <Rect x={6.6} y={22.2} width={2.8} height={1} fill="#9CA3AF" />
        <Rect x={2.4} y={25.2} width={11.2} height={3.4} rx={0.3} fill="#EDEFF2" stroke={C} strokeWidth={0.35} />
        <Rect x={6.6} y={26.4} width={2.8} height={1} fill="#9CA3AF" />
        {/* outer outline */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.6} />
        <Ellipse cx={3.4} cy={32} rx={1.8} ry={1.3} fill="#2C3239" />
        <Ellipse cx={12.6} cy={32} rx={1.8} ry={1.3} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

export function BPCuff({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={14}>
      <Svg viewBox="0 0 12 14" width={12 * S} height={14 * S}>
        <Ellipse cx={6} cy={13} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* top face */}
        <Path d="M1 0 L11 0 L12 1 L0 1 Z" fill="#374151" stroke={C} strokeWidth={0.3} />
        {/* device body + screen */}
        <Rect x={1} y={1} width={10} height={6} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={2} width={8} height={4} fill="#0F1A24" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={3} width={6} height={1} fill="#10B981" />
        <Rect x={4} y={4.6} width={4} height={0.8} fill="#22D3EE" />
        {/* cuff hanging */}
        <Path d="M2 7 L10 7 L9 12 L3 12 Z" fill="#1E40AF" stroke={C} strokeWidth={0.4} />
        <Rect x={2.5} y={7} width={7} height={1} fill="#3B82F6" />
        <Rect x={3.5} y={9} width={5} height={0.6} fill="#1E3A8A" />
        {/* hose */}
        <Path d="M10 8 Q11 10 9 12" fill="none" stroke={C} strokeWidth={0.5} />
      </Svg>
    </Box>
  );
}

export function SuctionUnit({ x, y }: { x: number; y: number }) {
  const sil = 'M2 1 Q1 1 1 2 L1 16 Q1 17 2 17 L12 17 Q13 17 13 16 L13 2 Q13 1 12 1 Z';
  return (
    <Box x={x} y={y} offX={1} offY={-2} w={14} h={22.4}>
      <Svg viewBox="0 0 14 20" width={14 * S} height={22.4 * S}>
        <Ellipse cx={7} cy={19} rx={4.8} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* full silhouette */}
        <Path d={sil} fill="#8A929B" />
        {/* TOP face — canister mouths + gauge seen from above */}
        <Path d="M2 1 Q1 1 1 2 L1 8 L13 8 L13 2 Q13 1 12 1 Z" fill="#B7BEC6" />
        <Ellipse cx={5} cy={4.6} rx={2.6} ry={1.8} fill="#D4F0F8" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={5} cy={4.6} rx={1.4} ry={1} fill="#A8DCEC" />
        <Circle cx={10.2} cy={4.6} r={2} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Line x1={10.2} y1={4.6} x2={11.4} y2={3.4} stroke="#DC2626" strokeWidth={0.45} />
        <Circle cx={10.2} cy={4.6} r={0.4} fill={C} />
        {/* seam */}
        <Line x1={1} y1={8} x2={13} y2={8} stroke={C} strokeWidth={0.55} />
        {/* FRONT band — collection canister with fluid level */}
        <Rect x={2.5} y={9.2} width={5} height={6.6} rx={0.5} fill="#EAF6FA" stroke={C} strokeWidth={0.4} />
        <Rect x={2.5} y={12.6} width={5} height={3.2} rx={0.4} fill="#FCA5A5" />
        <Rect x={9} y={9.6} width={2.6} height={5.6} rx={0.4} fill="#5B6672" />
        {/* outer outline */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.6} />
      </Svg>
    </Box>
  );
}

export function Wheelchair({ x, y }: { x: number; y: number }) {
  const backrest = 'M8 3 Q7 3 7 4 L7 12 L17 12 L17 4 Q17 3 16 3 Z';
  const seat = 'M7 12 L17 12 L17 21 Q17 22.4 15.6 22.4 L8.4 22.4 Q7 22.4 7 21 Z';
  return (
    <Box x={x} y={y} offY={-4} w={24} h={27.2}>
      <Svg viewBox="0 0 24 30" width={24 * S} height={27.2 * S}>
        <Ellipse cx={12} cy={28.2} rx={8.2} ry={2.8} fill="rgba(0,0,0,0.16)" />
        {/* push handles behind the backrest */}
        <Rect x={7} y={1} width={2.2} height={2.2} rx={1} fill="#4B5563" stroke={C} strokeWidth={0.4} />
        <Rect x={14.8} y={1} width={2.2} height={2.2} rx={1} fill="#4B5563" stroke={C} strokeWidth={0.4} />
        {/* BACKREST standing up — top face + tall padded front (seamless side) */}
        <Path d={backrest} fill="#586472" />
        <Path d="M7 6 L17 6 L17 12 L7 12 Z" fill="#3B4550" />
        <Path d={backrest} fill="none" stroke={C} strokeWidth={0.55} />
        <Line x1={7} y1={6} x2={17} y2={6} stroke={C} strokeWidth={0.45} />
        {/* big drive wheels — angled discs flanking the seat */}
        <Ellipse cx={3.4} cy={18} rx={3.2} ry={6.2} fill="#2C3239" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={3.4} cy={18} rx={1.7} ry={4.6} fill="#3A424B" />
        <Ellipse cx={3.4} cy={18} rx={1} ry={1.6} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={20.6} cy={18} rx={3.2} ry={6.2} fill="#2C3239" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={20.6} cy={18} rx={1.7} ry={4.6} fill="#3A424B" />
        <Ellipse cx={20.6} cy={18} rx={1} ry={1.6} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        {/* SEAT — top face + short front band, seamless side */}
        <Path d={seat} fill="#5B6672" />
        <Path d="M7 12 L17 12 L17 19 L7 19 Z" fill="#6E7A88" />
        <Line x1={12} y1={12.6} x2={12} y2={18.4} stroke="#4B5563" strokeWidth={0.4} opacity={0.5} />
        <Path d={seat} fill="none" stroke={C} strokeWidth={0.55} />
        <Line x1={7} y1={19} x2={17} y2={19} stroke={C} strokeWidth={0.45} />
        {/* footplate + small front casters */}
        <Rect x={8.5} y={22.4} width={7} height={2.2} rx={1} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={9} cy={26} rx={1.2} ry={1.6} fill="#2C3239" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={15} cy={26} rx={1.2} ry={1.6} fill="#2C3239" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

export function EKG({ x, y }: { x: number; y: number }) {
  const sil = 'M4 1 Q2 1 2 3 L2 25 Q2 27 4 27 L18 27 Q20 27 20 25 L20 3 Q20 1 18 1 Z';
  return (
    <Box x={x} y={y} offY={-2} w={22.4} h={32}>
      <Svg viewBox="0 0 22 32" width={22.4 * S} height={32 * S}>
        <Ellipse cx={11} cy={30.4} rx={7.5} ry={2.6} fill="rgba(0,0,0,0.16)" />
        {/* full silhouette */}
        <Path d={sil} fill="#8A929B" />
        {/* FAR top face — cable spool + lead ports resting on the cart top */}
        <Path d="M4 1 Q2 1 2 3 L2 12 L20 12 L20 3 Q20 1 18 1 Z" fill="#D2D6DC" />
        <Circle cx={7} cy={6.4} r={2.6} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
        <Circle cx={7} cy={6.4} r={1} fill="#8A929B" />
        <Path d="M9.4 6 Q13 5 15 7.2" fill="none" stroke={C} strokeWidth={0.5} opacity={0.55} />
        {[13.5, 15, 16.5].map((lx, i) => <Rect key={i} x={lx} y={4.2} width={1} height={2.4} rx={0.4} fill="#4B5563" />)}
        {/* seam: top → near control panel */}
        <Line x1={2} y1={12} x2={20} y2={12} stroke={C} strokeWidth={0.6} />
        {/* NEAR viewer-facing panel — the readable screen + printout + dials */}
        <Path d="M2 12 L20 12 L20 22 L2 22 Z" fill="#C7CDD4" />
        <Rect x={3.5} y={13.2} width={10} height={5.4} rx={0.5} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Path d="M4.2 16 L5.8 16 L6.8 13.8 L7.8 18 L8.8 14.8 L9.8 16 L13 16" fill="none" stroke="#10B981" strokeWidth={0.6} />
        <Circle cx={16} cy={14.6} r={1.3} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        <Circle cx={19} cy={14.6} r={1.3} fill="#3B82F6" stroke={C} strokeWidth={0.3} />
        <Rect x={15} y={16.6} width={4.6} height={2.6} rx={0.3} fill="#1F2937" />
        <Rect x={15.5} y={17.1} width={3.6} height={1.5} fill="#fff" />
        {/* seam: panel → drawer band */}
        <Line x1={2} y1={22} x2={20} y2={22} stroke={C} strokeWidth={0.6} />
        <Rect x={4} y={23.4} width={12} height={2.6} rx={0.4} fill="#8A929B" stroke={C} strokeWidth={0.3} />
        {/* outer silhouette outline */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={5} cy={28.5} rx={1.8} ry={1.3} fill="#2C3239" />
        <Ellipse cx={17} cy={28.5} rx={1.8} ry={1.3} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

export function Sink({ x, y }: { x: number; y: number }) {
  const sil = 'M1 2 L15 2 L15 16 Q15 17 14 17 L2 17 Q1 17 1 16 Z';
  return (
    <Box x={x} y={y} offY={-2} w={16} h={20.8}>
      <Svg viewBox="0 0 16 20" width={16 * S} height={20.8 * S}>
        <Ellipse cx={8} cy={19} rx={5.4} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* full silhouette (counter top + front cabinet) */}
        <Path d={sil} fill="#AEB4BC" />
        {/* TOP counter face */}
        <Path d="M1 2 L15 2 L15 12 L1 12 Z" fill="#E1E5EA" />
        {/* faucet at the back + knobs (seen from above) */}
        <Rect x={7} y={2.6} width={2} height={2.6} rx={0.4} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={7.4} y={5} width={1.2} height={2} fill="#7DD3FC" />
        <Circle cx={5} cy={3.6} r={0.9} fill="#3B82F6" stroke={C} strokeWidth={0.3} />
        <Circle cx={11} cy={3.6} r={0.9} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        {/* basin — inset oval on the counter */}
        <Ellipse cx={8} cy={8.4} rx={5.2} ry={3} fill="#C7CDD4" stroke={C} strokeWidth={0.45} />
        <Ellipse cx={8} cy={8.4} rx={4} ry={2.1} fill="#A8DCEC" />
        <Ellipse cx={8} cy={8.6} rx={1} ry={0.6} fill="#5B8FA8" />
        {/* seam → front cabinet */}
        <Line x1={1} y1={12} x2={15} y2={12} stroke={C} strokeWidth={0.55} />
        <Rect x={2.5} y={13} width={11} height={3.2} rx={0.3} fill="#C6C2B6" stroke={C} strokeWidth={0.35} />
        <Rect x={7} y={14.2} width={2} height={1} fill="#8A8577" />
        {/* outer outline */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.6} />
      </Svg>
    </Box>
  );
}

export function Whiteboard({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} w={W} h={12}>
      <Svg viewBox={`0 0 ${W} 12`} width={W * S} height={12 * S} preserveAspectRatio="none">
        {/* frame top face */}
        <Path d={`M1 0.5 L${W - 1} 0.5 L${W - 1.5} 1.5 L1.5 1.5 Z`} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        {/* frame + surface */}
        <Rect x={1} y={1} width={W - 2} height={10} fill="#E5E7EB" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={2} width={W - 4} height={7} fill="#fff" stroke={C} strokeWidth={0.2} />
        {/* notes */}
        <Rect x={4} y={3} width={6} height={0.8} fill="#3B82F6" />
        <Rect x={4} y={4.2} width={10} height={0.5} fill={C} />
        <Rect x={4} y={5.4} width={8} height={0.5} fill={C} />
        <Rect x={16} y={3} width={6} height={0.8} fill="#EF4444" />
        <Rect x={16} y={4.2} width={10} height={0.5} fill={C} />
        {/* marker tray + markers */}
        <Rect x={1} y={9} width={W - 2} height={2} fill="#6B7280" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={9.4} width={2} height={0.8} fill="#EF4444" />
        <Rect x={6} y={9.4} width={2} height={0.8} fill="#3B82F6" />
        <Rect x={9} y={9.4} width={2} height={0.8} fill="#10B981" />
      </Svg>
    </Box>
  );
}

export function Scale({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={14}>
      <Svg viewBox="0 0 12 14" width={12 * S} height={14 * S}>
        <Ellipse cx={6} cy={13} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* display unit */}
        <Rect x={3} y={0} width={6} height={4} fill="#1F2937" stroke={C} strokeWidth={0.3} />
        <Rect x={4} y={0.5} width={4} height={3} fill="#0F1A24" />
        <Rect x={5} y={1.5} width={2} height={1.2} fill="#10B981" />
        {/* neck */}
        <Rect x={5} y={4} width={2} height={2} fill="#4B5563" />
        {/* platform TOP + FRONT */}
        <Ellipse cx={6} cy={7} rx={5} ry={1.5} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={6} cy={6.5} rx={4} ry={1} fill="#CBD5E1" />
        <Path d="M1 7 L11 7 L10 11 L2 11 Z" fill="#6B7280" stroke={C} strokeWidth={0.4} />
        {/* feet */}
        <Rect x={2} y={11} width={2} height={2} fill="#1F2937" />
        <Rect x={8} y={11} width={2} height={2} fill="#1F2937" />
      </Svg>
    </Box>
  );
}

// ── er2 leftovers ──
export function TicketDispenser({ x, y }: { x: number; y: number }) {
  const sil = 'M1 2 Q0.5 2 0.5 2.6 L0.5 19 Q0.5 19.6 1 19.6 L11 19.6 Q11.5 19.6 11.5 19 L11.5 2.6 Q11.5 2 11 2 Z';
  return (
    <Box x={x} y={y} offX={2} offY={-8} w={12} h={25.6}>
      <Svg viewBox="0 0 12 26" width={12 * S} height={25.6 * S}>
        <Ellipse cx={6} cy={25} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* full silhouette */}
        <Path d={sil} fill="#B7BEC6" />
        {/* big TOP face (high-angle) — plain cabinet top */}
        <Path d="M1 2 Q0.5 2 0.5 2.6 L0.5 11 L11.5 11 L11.5 2.6 Q11.5 2 11 2 Z" fill="#D3D8DE" />
        <Rect x={2.5} y={3.4} width={7} height={5.6} rx={0.5} fill="#C1C7CE" />
        {/* seam top → front */}
        <Line x1={0.5} y1={11} x2={11.5} y2={11} stroke={C} strokeWidth={0.55} />
        {/* FRONT band — viewer-facing SCREEN + ticket slot */}
        <Rect x={2} y={11.8} width={8} height={4} rx={0.4} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={12.6} width={6} height={1.1} fill="#22D3EE" />
        <Rect x={3} y={14.1} width={4} height={1} fill="#FACC15" />
        <Rect x={2} y={16.2} width={8} height={1.4} rx={0.3} fill="#1F2937" />
        <Rect x={3.4} y={17.2} width={5} height={2.2} rx={0.3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={4} y={18} width={4} height={0.6} fill={C} opacity={0.5} />
        {/* outer outline */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.65} />
        {/* pedestal + base */}
        <Rect x={4.5} y={19.6} width={3} height={3.4} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={6} cy={24} rx={4} ry={1.4} fill="#4B5563" />
      </Svg>
    </Box>
  );
}

export function BrochureRack({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} offY={-4} w={14} h={22}>
      <Svg viewBox="0 0 14 22" width={14 * S} height={22 * S}>
        <Ellipse cx={7} cy={21} rx={4.8} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={1} y={0} width={12} height={16} fill="#A88862" stroke={C} strokeWidth={0.5} />
        {[0, 1, 2].map((r) => (
          <G key={r}>
            <Rect x={2} y={1 + r * 5} width={10} height={4} fill="#7C5A38" stroke={C} strokeWidth={0.3} />
            <Rect x={2.6} y={0.4 + r * 5} width={4} height={3} fill={['#F87171', '#FACC15', '#A7F3D0'][r]} stroke={C} strokeWidth={0.3} />
            <Rect x={7} y={0.4 + r * 5} width={4} height={3} fill={['#BAE6FD', '#FBCFE8', '#C4B5FD'][r]} stroke={C} strokeWidth={0.3} />
          </G>
        ))}
        <Rect x={3} y={16} width={1.5} height={5} fill="#5C3A1A" />
        <Rect x={9.5} y={16} width={1.5} height={5} fill="#5C3A1A" />
      </Svg>
    </Box>
  );
}

export function DeskPhone({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={4} w={10} h={10}>
      <Svg viewBox="0 0 10 10" width={10 * S} height={10 * S}>
        <Ellipse cx={5} cy={9} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={1} y={4} width={8} height={5} fill="#374151" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={5} width={4} height={3.5} fill="#1F2937" />
        <Rect x={6.5} y={1} width={2} height={8} fill="#111827" stroke={C} strokeWidth={0.4} />
        <Rect x={6.2} y={1} width={2.6} height={1.6} fill="#1F2937" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

export function WaterCooler({ x, y }: { x: number; y: number }) {
  const sil = 'M1.5 5 Q1 5 1 5.6 L1 21 Q1 21.5 1.5 21.5 L8.5 21.5 Q9 21.5 9 21 L9 5.6 Q9 5 8.5 5 Z';
  return (
    <Box x={x} y={y} offX={3} offY={-6} w={10} h={24}>
      <Svg viewBox="0 0 10 24" width={10 * S} height={24 * S}>
        <Ellipse cx={5} cy={23} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* full silhouette */}
        <Path d={sil} fill="#D1D5DB" />
        {/* TOP face — dispenser cabinet top (a cylinder bottle stands ON it) */}
        <Path d="M1.5 5 Q1 5 1 5.6 L1 12 L9 12 L9 5.6 Q9 5 8.5 5 Z" fill="#EDEFF2" />
        {/* WATER BOTTLE as an upright CYLINDER sitting on top (larger, lower) */}
        <Ellipse cx={5} cy={3.2} rx={3.2} ry={1.2} fill="#CDEAF3" stroke={C} strokeWidth={0.35} />
        <Path d="M1.8 3.2 L1.8 8.4 Q1.8 9.6 5 9.6 Q8.2 9.6 8.2 8.4 L8.2 3.2" fill="#A8DCEC" stroke={C} strokeWidth={0.4} />
        <Rect x={2.6} y={4} width={1.2} height={4.4} fill="#CDEAF3" opacity={0.7} />
        <Ellipse cx={5} cy={9} rx={1.7} ry={0.8} fill="#3B82F6" />
        {/* seam top → front */}
        <Line x1={1} y1={12} x2={9} y2={12} stroke={C} strokeWidth={0.5} />
        {/* FRONT band — taps (hot/cold) + drip tray + cup */}
        <Rect x={2.6} y={13.2} width={1.6} height={2} rx={0.3} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        <Rect x={5.8} y={13.2} width={1.6} height={2} rx={0.3} fill="#3B82F6" stroke={C} strokeWidth={0.3} />
        <Rect x={2.6} y={16} width={4.8} height={1.4} rx={0.3} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Path d="M3.6 17.6 L6.4 17.6 L6 20 L4 20 Z" fill="#fff" stroke={C} strokeWidth={0.3} />
        {/* outer outline */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.6} />
      </Svg>
    </Box>
  );
}

export function ChartBinder({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={2} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
        <Ellipse cx={6} cy={11} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        {[0, 1, 2].map((i) => (
          <G key={i}>
            <Rect x={1} y={8 - i * 2.4} width={10} height={2} fill={['#3B82F6', '#EF4444', '#16A34A'][i]} stroke={C} strokeWidth={0.4} />
            <Rect x={2} y={8.4 - i * 2.4} width={8} height={0.5} fill="#fff" opacity={0.7} />
          </G>
        ))}
      </Svg>
    </Box>
  );
}

export function PressureGauge({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={1} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
        <Ellipse cx={6} cy={11} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={0} y={0} width={12} height={12} fill="#E5E7EB" stroke={C} strokeWidth={0.6} />
        <Rect x={1.5} y={1.5} width={9} height={6} fill="#0B2A3A" stroke={C} strokeWidth={0.4} />
        <Rect x={2.5} y={2.5} width={6} height={2} fill="#22D3EE" />
        <Circle cx={2.5} cy={9.5} r={1} fill="#10B981" stroke={C} strokeWidth={0.3} />
        <Rect x={4.5} y={8.8} width={6} height={2} fill="#16A34A" />
      </Svg>
    </Box>
  );
}

export function Otoscope({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={1} w={12} h={14}>
      <Svg viewBox="0 0 12 14" width={12 * S} height={14 * S}>
        <Ellipse cx={6} cy={13} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* wall plate */}
        <Rect x={0} y={0} width={12} height={14} fill="#D6CFB8" stroke={C} strokeWidth={0.5} />
        {/* otoscope head unit (left) */}
        <Rect x={1.5} y={2} width={4} height={4} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Path d="M2 6 L5 6 L4 9 L3 9 Z" fill="#374151" stroke={C} strokeWidth={0.3} />
        <Path d="M3 9 L4 9 L3.6 11 L3.4 11 Z" fill="#FACC15" />
        {/* ophthalmoscope unit (right) */}
        <Rect x={6.5} y={2} width={4} height={4} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Circle cx={8.5} cy={7.5} r={1.6} fill="#374151" stroke={C} strokeWidth={0.3} />
        <Circle cx={8.5} cy={7.5} r={0.6} fill="#FACC15" />
        {/* charger base */}
        <Rect x={1} y={11.5} width={10} height={2} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

export function AnatomyPoster({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} w={14} h={22}>
      <Svg viewBox="0 0 14 22" width={14 * S} height={22 * S}>
        <Ellipse cx={7} cy={21} rx={4.8} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={0} y={0} width={14} height={22} fill="#fff" stroke={C} strokeWidth={0.6} />
        <Rect x={1} y={1} width={12} height={20} fill="#FDEBE0" />
        <Circle cx={7} cy={4.5} r={2} fill="#F4B89A" stroke={C} strokeWidth={0.3} />
        <Rect x={5} y={6.5} width={4} height={7} fill="#F4B89A" stroke={C} strokeWidth={0.3} />
        {/* ribcage lines */}
        <Rect x={5.5} y={7.5} width={3} height={0.5} fill="#C4705A" />
        <Rect x={5.5} y={8.8} width={3} height={0.5} fill="#C4705A" />
        <Rect x={5.5} y={10.1} width={3} height={0.5} fill="#C4705A" />
        <Rect x={6} y={8} width={1.2} height={1.2} fill="#DC2626" />
        {/* arms */}
        <Rect x={3} y={7} width={1.5} height={5} fill="#F4B89A" stroke={C} strokeWidth={0.3} />
        <Rect x={9.5} y={7} width={1.5} height={5} fill="#F4B89A" stroke={C} strokeWidth={0.3} />
        {/* legs */}
        <Rect x={5.2} y={13.5} width={1.5} height={6} fill="#F4B89A" stroke={C} strokeWidth={0.3} />
        <Rect x={7.3} y={13.5} width={1.5} height={6} fill="#F4B89A" stroke={C} strokeWidth={0.3} />
        <Rect x={1} y={20} width={12} height={1} fill="#3B82F6" />
      </Svg>
    </Box>
  );
}

// ── er3 leftovers ──
export function BarcodePrinter({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={2} w={10} h={10}>
      <Svg viewBox="0 0 10 10" width={10 * S} height={10 * S}>
        <Ellipse cx={5} cy={9} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={1} y={3} width={8} height={5} fill="#374151" stroke={C} strokeWidth={0.4} />
        <Rect x={2.5} y={4.5} width={5} height={2.5} fill="#fff" stroke={C} strokeWidth={0.3} />
        {[0, 1, 2, 3, 4].map((i) => <Rect key={i} x={3 + i * 0.9} y={5} width={0.4} height={1.6} fill={C} />)}
        <Rect x={7} y={6} width={1} height={1} fill="#10B981" />
      </Svg>
    </Box>
  );
}

export function WallTV({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} w={W} h={14}>
      <Svg viewBox={`0 0 ${W} 14`} width={W * S} height={14 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={14} fill="#111827" stroke={C} strokeWidth={0.6} />
        <Rect x={1.5} y={1.5} width={W - 3} height={11} fill="#1E3A5F" />
        {/* news scene + anchor */}
        <Rect x={2.5} y={2.5} width={W - 5} height={5} fill="#3B6CA8" />
        <Rect x={3.5} y={3.5} width={4} height={3} fill="#FDE1C8" />
        <Rect x={4} y={3.3} width={3} height={1} fill="#4B2E18" />
        {/* lower-third banner */}
        <Rect x={2.5} y={8.5} width={W - 5} height={2} fill="#DC2626" />
        <Rect x={3.2} y={9} width={w * 8} height={1} fill="#fff" />
        {/* ticker */}
        <Rect x={2.5} y={10.8} width={W - 5} height={1.4} fill="#0B2A3A" />
        <Rect x={3.2} y={11.2} width={w * 10} height={0.7} fill="#FACC15" />
      </Svg>
    </Box>
  );
}

export function CCTVCamera({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={14} h={12}>
      <Svg viewBox="0 0 14 12" width={14 * S} height={12 * S}>
        <Ellipse cx={7} cy={11} rx={4.8} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={0} y={2} width={3} height={3} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Path d="M3 3 L12 3 Q14 3 13 8 L4 9 Q2 6 3 3 Z" fill="#9CA3AF" stroke={C} strokeWidth={0.5} />
        <Circle cx={8} cy={6} r={2} fill="#0B1620" stroke={C} strokeWidth={0.4} />
        <Circle cx={8} cy={6} r={0.7} fill="#22D3EE" />
        <Circle cx={11.5} cy={4} r={0.8} fill="#EF4444" />
      </Svg>
    </Box>
  );
}

export function CoffeeTable({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} offY={1} w={W} h={16}>
      <Svg viewBox={`0 0 ${W} 16`} width={W * S} height={16 * S}>
        <Ellipse cx={w * 8} cy={12} rx={w * 5.4} ry={w * 1.8} fill="rgba(0,0,0,0.16)" />
        {/* legs peeking at the far corners */}
        <Rect x={3} y={2} width={1.8} height={3} rx={0.4} fill="#5C3A1A" />
        <Rect x={W - 4.8} y={2} width={1.8} height={3} rx={0.4} fill="#5C3A1A" />
        {/* big rectangular TOP face (high angle) */}
        <Rect x={2} y={2.5} width={W - 4} height={8} rx={1.2} fill="#C08B54" stroke={C} strokeWidth={0.5} />
        <Rect x={3.2} y={3.4} width={W - 6.4} height={2.4} rx={0.8} fill="#D2A672" />
        <Line x1={4} y1={7.6} x2={W - 4} y2={7.6} stroke="#A8764A" strokeWidth={0.5} opacity={0.6} />
        {/* front edge (thickness band) */}
        <Path d={`M2 10.5 L${W - 2} 10.5 L${W - 2} 12 L2 12 Z`} fill="#8A5A30" stroke={C} strokeWidth={0.45} />
        {/* front legs */}
        <Rect x={3} y={12} width={1.8} height={3} rx={0.4} fill="#5C3A1A" />
        <Rect x={W - 4.8} y={12} width={1.8} height={3} rx={0.4} fill="#5C3A1A" />
      </Svg>
    </Box>
  );
}

export function TissueBox({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={4} offY={4} w={8} h={7}>
      <Svg viewBox="0 0 8 7" width={8 * S} height={7 * S}>
        <Ellipse cx={4} cy={6} rx={2.7} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M1 1 L7 1 L7.5 2 L0.5 2 Z" fill="#BFD7E8" stroke={C} strokeWidth={0.3} />
        <Rect x={1} y={2} width={6} height={4} fill="#7FB0D8" stroke={C} strokeWidth={0.4} />
        <Rect x={1.4} y={2.4} width={5.2} height={1} fill="#A7CDE8" />
        <Path d="M3 1 Q4 0 5 1 Z" fill="#fff" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

export function FloorLamp({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={-14} w={10} h={34}>
      <Svg viewBox="0 0 10 34" width={10 * S} height={34 * S}>
        <Ellipse cx={5} cy={33} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={5} cy={6} rx={6} ry={5} fill="#FFE9A8" opacity={0.35} />
        <Path d="M2 2 L8 2 L9 8 L1 8 Z" fill="#F4D78C" stroke={C} strokeWidth={0.5} />
        <Path d="M2.5 2.5 L7.5 2.5 L8 4 L2 4 Z" fill="#FBE9B8" />
        <Rect x={4.5} y={8} width={1.2} height={21} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={5} cy={30} rx={4} ry={1.6} fill="#6B7280" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

export function FramedPicture({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} offY={1} w={W} h={12}>
      <Svg viewBox={`0 0 ${W} 12`} width={W * S} height={12 * S} preserveAspectRatio="none">
        {/* frame + mat */}
        <Rect x={0} y={0} width={W} height={12} fill="#8C6A42" stroke={C} strokeWidth={0.6} />
        <Rect x={1.2} y={1.2} width={W - 2.4} height={9.6} fill="#C8B488" />
        {/* sky + sun */}
        <Rect x={2} y={2} width={W - 4} height={4} fill="#BFE0F0" />
        <Circle cx={W - 5} cy={3.8} r={1.4} fill="#FBD877" />
        {/* hills */}
        <Path d={`M2 6 Q${w * 4} 3.5 ${w * 8} 6 T ${W - 2} 6 L${W - 2} 9.5 L2 9.5 Z`} fill="#7FB069" />
        <Path d={`M2 7.5 Q${w * 6} 6 ${W - 2} 8 L${W - 2} 9.5 L2 9.5 Z`} fill="#5E8C50" />
      </Svg>
    </Box>
  );
}

// ── BayLabel — small pixel label over a bay (text only; non-blocking) ──
export function BayLabel({ x, y, text, highlight }: { x: number; y: number; text: string; highlight?: boolean }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + 2, top: y * TILE + 1 }}>
      <View style={{ backgroundColor: highlight ? '#FEF08A' : '#FFFFFFDD', borderWidth: 1.5, borderColor: C, paddingHorizontal: 4, paddingVertical: 1 }}>
        <Text style={{ fontFamily: 'DungGeunMo', fontSize: 7, color: C }}>{text}</Text>
      </View>
    </View>
  );
}

/** Render an ER-catalog object by type. Returns null for non-ER types. */
export function ErObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  const n = (k: string, d: number) => (typeof props?.[k] === 'number' ? (props[k] as number) : d);
  switch (type) {
    case 'vitals': return <VitalsCart x={x} y={y} />;
    case 'ivpump': return <IVPump x={x} y={y} />;
    case 'dressing': return <DressingCart x={x} y={y} />;
    case 'medfridge': return <MedFridge x={x} y={y} />;
    case 'scanner': return <SecurityScanner x={x} y={y} />;
    case 'detector': return <MetalDetector x={x} y={y} />;
    case 'boltedbed': return <BoltedBed x={x} y={y} occupied={!!props?.occupied} />;
    case 'deconshower': return <DeconShower x={x} y={y} />;
    case 'sofa': return <Sofa x={x} y={y} w={n('w', 2)} color={props?.color as string | undefined} />;
    case 'waitingdisplay': return <WaitingDisplay x={x} y={y} w={n('w', 2)} />;
    case 'wastebin': return <WasteBin x={x} y={y} tone={props?.tone as string | undefined} />;
    case 'ppestand': return <PPEStand x={x} y={y} />;
    case 'floordrain': return <FloorDrain x={x} y={y} w={n('w', 2)} />;
    case 'chemdrum': return <ChemDrum x={x} y={y} tone={props?.tone as string | undefined} />;
    case 'triageline': return <TriageLine x={x} y={y} w={n('w', 1)} h={n('h', 1)} color={props?.color as string | undefined} />;
    case 'nursestation': return <NurseStationDesk x={x} y={y} w={n('w', 10)} h={n('h', 6)} />;
    case 'gurney': return <Gurney x={x} y={y} occupied={!!props?.occupied} />;
    case 'defib': return <Defib x={x} y={y} />;
    case 'oxygen': return <OxygenTank x={x} y={y} />;
    case 'glovebox': return <GloveDispenser x={x} y={y} />;
    case 'sharps': return <SharpsContainer x={x} y={y} />;
    case 'sanitizer': return <HandSanitizer x={x} y={y} />;
    case 'compcart': return <CompCart x={x} y={y} />;
    case 'bpcuff': return <BPCuff x={x} y={y} />;
    case 'suction': return <SuctionUnit x={x} y={y} />;
    case 'wheelchair': return <Wheelchair x={x} y={y} />;
    case 'ekg': return <EKG x={x} y={y} />;
    case 'sink': return <Sink x={x} y={y} />;
    case 'whiteboard': return <Whiteboard x={x} y={y} w={n('w', 3)} />;
    case 'scale': return <Scale x={x} y={y} />;
    case 'ticket': return <TicketDispenser x={x} y={y} />;
    case 'brochure': return <BrochureRack x={x} y={y} />;
    case 'phone': return <DeskPhone x={x} y={y} />;
    case 'watercooler': return <WaterCooler x={x} y={y} />;
    case 'chartbinder': return <ChartBinder x={x} y={y} />;
    case 'pressuregauge': return <PressureGauge x={x} y={y} />;
    case 'otoscope': return <Otoscope x={x} y={y} />;
    case 'anatomy': return <AnatomyPoster x={x} y={y} />;
    case 'barcodeprinter': return <BarcodePrinter x={x} y={y} />;
    case 'walltv': return <WallTV x={x} y={y} w={n('w', 2)} />;
    case 'cctv': return <CCTVCamera x={x} y={y} />;
    case 'coffeetable': return <CoffeeTable x={x} y={y} w={n('w', 2)} />;
    case 'tissuebox': return <TissueBox x={x} y={y} />;
    case 'floorlamp': return <FloorLamp x={x} y={y} />;
    case 'framedpic': return <FramedPicture x={x} y={y} w={n('w', 2)} />;
    case 'baylabel': return <BayLabel x={x} y={y} text={(props?.text as string) ?? ''} highlight={!!props?.highlight} />;
    default: return null;
  }
}
