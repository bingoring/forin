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
        <Path d="M1 1 L13 1 L14 3 L0 3 Z" fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={3} width={12} height={10} fill="#374151" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={4} width={10} height={8} fill="#0F1A24" />
        <Rect x={3} y={5} width={4} height={2} fill="#22D3EE" />
        <Rect x={8} y={5} width={3} height={2} fill="#FACC15" />
        <Rect x={3} y={9} width={8} height={1} fill="#10B981" />
        {/* SpO2 finger probe on a wire (hangs right) */}
        <Path d="M13 6 q3 3 1 7" fill="none" stroke={C} strokeWidth={0.5} />
        <Rect x={13} y={13} width={3} height={2.5} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        {/* pole */}
        <Rect x={6} y={13} width={2} height={9} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        {/* basket with thermometer */}
        <Rect x={2} y={20} width={10} height={4} fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={20.5} width={5} height={1.4} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={3.4} y={20.7} width={1} height={1} fill="#EF4444" />
        <Rect x={3} y={24} width={8} height={3} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={4.5} cy={28} rx={2} ry={1.3} fill={C} />
        <Ellipse cx={9.5} cy={28} rx={2} ry={1.3} fill={C} />
      </Svg>
    </Box>
  );
}

export function IVPump({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-22} w={16} h={46}>
      <Svg viewBox="0 0 16 46" width={16 * S} height={46 * S}>
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
        {/* pump box */}
        <Rect x={2} y={22} width={12} height={9} fill="#475569" stroke={C} strokeWidth={0.6} />
        <Rect x={3} y={23} width={10} height={4} fill="#0F1A24" />
        <Rect x={4} y={24} width={5} height={1.2} fill="#22D3EE" />
        <Rect x={4} y={25.6} width={3} height={1} fill="#10B981" />
        <Rect x={3.5} y={28} width={2} height={2} fill="#10B981" stroke={C} strokeWidth={0.3} />
        <Rect x={6.5} y={28} width={2} height={2} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        <Rect x={9.5} y={28} width={2.5} height={2} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
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
  return (
    <Box x={x} y={y} offY={-4} w={20} h={30}>
      <Svg viewBox="0 0 20 30" width={20 * S} height={30 * S}>
        {/* top tray (foreshortened) */}
        <Path d="M2 4 L18 4 L19 7 L1 7 Z" fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        <Path d="M3 4.5 L17 4.5 L17.5 6 L2.5 6 Z" fill="#E5E7EB" />
        {/* betadine bottle */}
        <Rect x={3} y={1} width={3} height={4} fill="#92400E" stroke={C} strokeWidth={0.4} />
        <Rect x={3.7} y={0.3} width={1.6} height={1} fill="#fff" />
        {/* gauze stack */}
        <Rect x={8} y={2} width={4} height={3} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Rect x={8.5} y={2.6} width={3} height={0.5} fill="#E5E7EB" />
        <Rect x={8.5} y={3.6} width={3} height={0.5} fill="#E5E7EB" />
        {/* sterile glove pouch */}
        <Rect x={13} y={2} width={4} height={3} fill="#A5D8E8" stroke={C} strokeWidth={0.4} />
        <Rect x={13.4} y={2.4} width={3.2} height={1} fill="#fff" opacity={0.6} />
        {/* body + lower shelf */}
        <Rect x={2} y={7} width={16} height={3} fill="#94A3B8" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={11} width={14} height={3} fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
        {/* suture set: kidney dish + instrument */}
        <Ellipse cx={7} cy={12.5} rx={3} ry={1} fill="#E5E7EB" stroke={C} strokeWidth={0.3} />
        <Rect x={11} y={11.5} width={4} height={1} fill="#9CA3AF" />
        {/* legs + wheels */}
        <Rect x={3} y={14} width={2} height={11} fill="#6B7280" />
        <Rect x={15} y={14} width={2} height={11} fill="#6B7280" />
        <Ellipse cx={4} cy={26} rx={2} ry={1.4} fill={C} />
        <Ellipse cx={16} cy={26} rx={2} ry={1.4} fill={C} />
      </Svg>
    </Box>
  );
}

export function MedFridge({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} offY={-4} w={14} h={28}>
      <Svg viewBox="0 0 14 28" width={14 * S} height={28 * S}>
        <Path d="M1 2 L13 2 L14 4 L0 4 Z" fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
        <Rect x={0} y={4} width={14} height={22} fill="#E5E7EB" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={5.5} width={11} height={19} fill="#BFE3EE" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={6} width={3.5} height={18} fill="#D7F0F6" opacity={0.6} />
        {[7, 11.5, 16, 20].map((sy, r) => (
          <G key={r}>
            <Rect x={2} y={sy} width={10} height={3} fill="#A7CBD8" stroke={C} strokeWidth={0.25} />
            {[0, 1, 2, 3].map((i) => (
              <Rect key={i} x={2.6 + i * 2.4} y={sy + 0.4} width={1.6} height={2.2} fill={['#FCA5A5', '#FACC15', '#A7F3D0', '#BAE6FD'][(r + i) % 4]} stroke={C} strokeWidth={0.2} />
            ))}
          </G>
        ))}
        <Rect x={11.5} y={11} width={1.2} height={7} fill="#6B7280" />
        <Rect x={9} y={2.3} width={4} height={1.4} fill="#0B2A3A" />
      </Svg>
    </Box>
  );
}

export function SecurityScanner({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={32} h={28}>
      <Svg viewBox="0 0 32 28" width={32 * S} height={28 * S}>
        <Path d="M2 6 L14 6 L15 8 L1 8 Z" fill="#94A3B8" stroke={C} strokeWidth={0.5} />
        <Rect x={1} y={8} width={14} height={10} fill="#475569" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={10} width={6} height={6} fill="#0B2A3A" stroke={C} strokeWidth={0.4} />
        {[0, 1, 2, 3].map((i) => <Rect key={i} x={3.4 + i * 1.4} y={10.4} width={1} height={4.6} fill="#0B1C26" />)}
        <Rect x={10} y={9} width={4} height={4} fill="#0F1A24" stroke={C} strokeWidth={0.3} />
        <Rect x={10.6} y={9.6} width={2.8} height={1.2} fill="#F59E0B" />
        <Path d="M14 12 L31 12 L32 14 L15 14 Z" fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Rect x={15} y={14} width={16} height={4} fill="#4B5563" stroke={C} strokeWidth={0.4} />
        {[16, 20, 24, 28].map((rx, i) => <Rect key={i} x={rx} y={14.5} width={1} height={3} fill="#9CA3AF" />)}
        <Rect x={2} y={18} width={2} height={6} fill="#1F2937" />
        <Rect x={28} y={18} width={2} height={6} fill="#1F2937" />
      </Svg>
    </Box>
  );
}

export function MetalDetector({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-18} w={32} h={38}>
      <Svg viewBox="0 0 32 38" width={32 * S} height={38 * S}>
        <Rect x={2} y={2} width={6} height={30} fill="#E5E7EB" stroke={C} strokeWidth={0.5} />
        <Rect x={4} y={6} width={2.5} height={2.5} fill="#10B981" stroke={C} strokeWidth={0.3} />
        <Rect x={24} y={2} width={6} height={30} fill="#E5E7EB" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={2} width={28} height={5} fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        <Circle cx={16} cy={4.5} r={1.6} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        <Rect x={1} y={32} width={8} height={2.5} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Rect x={23} y={32} width={8} height={2.5} fill="#6B7280" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

export function BoltedBed({ x, y, occupied }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} w={32} h={48}>
      <Svg viewBox="0 0 32 48" width={32 * S} height={48 * S}>
        <Rect x={2} y={6} width={28} height={36} rx={3} fill="#6E6256" stroke={C} strokeWidth={0.7} />
        <Rect x={4} y={8} width={24} height={30} rx={2} fill="#8C9AA6" stroke={C} strokeWidth={0.5} />
        <Line x1={16} y1={9} x2={16} y2={37} stroke="#5E6A74" strokeWidth={0.4} opacity={0.5} />
        <Line x1={5} y1={23} x2={27} y2={23} stroke="#5E6A74" strokeWidth={0.4} opacity={0.5} />
        {[[4.5, 7.5], [27.5, 7.5], [4.5, 40.5], [27.5, 40.5]].map(([bx, by], i) => (
          <Circle key={i} cx={bx} cy={by} r={1.3} fill="#3A4048" stroke={C} strokeWidth={0.4} />
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
        <Rect x={5} y={0} width={2} height={6} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={8} y={1} width={1} height={6} fill="#FACC15" />
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
        <Path d={`M3 2 L${W - 3} 2 L${W - 2} 4 L2 4 Z`} fill={lt} stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={4} width={W - 4} height={7} fill={color} stroke={C} strokeWidth={0.4} />
        <Rect x={0} y={5} width={3.5} height={13} rx={1} fill={dk} stroke={C} strokeWidth={0.4} />
        <Rect x={W - 3.5} y={5} width={3.5} height={13} rx={1} fill={dk} stroke={C} strokeWidth={0.4} />
        <Path d={`M3 11 L${W - 3} 11 L${W - 3} 17 L3 17 Z`} fill={lt} stroke={C} strokeWidth={0.4} />
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
        {/* rail top + post */}
        <Rect x={1} y={2} width={12} height={1.5} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={6.5} y={0} width={1} height={3} fill="#6B7280" />
        {/* hanger + level-D coverall */}
        <Rect x={6} y={3} width={2} height={1} fill="#374151" />
        <Path d="M3 4 L11 4 L12 8 L9.5 8 L9.5 20 L4.5 20 L4.5 8 L2 8 Z" fill="#FEFCE8" stroke={C} strokeWidth={0.5} />
        {/* hood + zipper */}
        <Rect x={6} y={4} width={2} height={3} fill="#FEF9C3" stroke={C} strokeWidth={0.3} />
        <Rect x={6.7} y={7} width={0.6} height={12} fill="#CA8A04" />
        {/* mask/glove box at base */}
        <Rect x={2} y={22} width={10} height={6} fill="#3B82F6" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={23} width={8} height={2.5} fill="#fff" />
        <Rect x={3.5} y={23.5} width={3} height={1.5} fill="#A5D8E8" />
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
        <Ellipse cx={6} cy={3} rx={5} ry={1.8} fill={bodyDk} stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={3} width={10} height={19} fill={body} stroke={C} strokeWidth={0.5} />
        <Rect x={6} y={3} width={5} height={19} fill={bodyDk} opacity={0.35} />
        <Rect x={3} y={9} width={6} height={6} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Path d="M6 10 L7.4 13.5 L4.6 13.5 Z" fill="#DC2626" />
        <Ellipse cx={6} cy={22} rx={5} ry={1.8} fill={bodyDk} stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

export function TriageLine({ x, y, w = 1, h = 1, color = '#EF4444' }: { x: number; y: number; w?: number; h?: number; color?: string }) {
  const horiz = w >= h;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: w * TILE, height: h * TILE }}>
      <View style={horiz
        ? { position: 'absolute', left: 4, right: 4, top: '50%', height: 4, marginTop: -2, backgroundColor: color }
        : { position: 'absolute', top: 4, bottom: 4, left: '50%', width: 4, marginLeft: -2, backgroundColor: color }} />
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
        {/* quartz tops on each run */}
        <Rect x={4} y={R - 2} width={W - 8} height={bar} fill={qz} stroke={C} strokeWidth={0.6} />
        <Rect x={4} y={R - 2} width={bar + 4} height={HH - 8} fill={qz} stroke={C} strokeWidth={0.6} />
        <Rect x={W - 4 - (bar + 4)} y={R - 2} width={bar + 4} height={HH - 8} fill={qz} stroke={C} strokeWidth={0.6} />
        {/* raised back ledge */}
        <Rect x={4} y={R - 4} width={W - 8} height={4} fill={qzEdge} stroke={C} strokeWidth={0.6} />
        <Rect x={5} y={R - 3.4} width={W - 10} height={1} fill={qzHi} />
        {/* monitor wall on the back run */}
        {monXs.map((mx, i) => (
          <G key={`m${i}`}>
            <Rect x={mx - 1} y={R + bar - 6} width={2} height={3} fill="#3A4048" />
            <Rect x={mx - 7} y={R - 6} width={14} height={bar - 1} fill="#1B2128" stroke={C} strokeWidth={0.5} />
            <Rect x={mx - 5.6} y={R - 4.6} width={11.2} height={bar - 4} fill="#0F1A24" />
            {i === 0 ? (
              <G>
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
        {/* side-counter accessories: label printer (right), wire basket + pen caddy (left) */}
        <Rect x={W - 4 - bar + 1} y={R + 2} width={12} height={9} fill="#F2EFE6" stroke={C} strokeWidth={0.5} />
        <Rect x={W - 4 - bar + 2} y={R + 3} width={10} height={2.5} fill="#0F1A24" />
        <Rect x={7} y={R + 3} width={11} height={7} fill="#F7F7F4" stroke={C} strokeWidth={0.5} />
        <Rect x={8} y={R + 11} width={6} height={5} fill="#7E8893" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ── ER-native objects (interior-objects-er.jsx) ──
export function Gurney({ x, y, occupied }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} offY={-4} w={32} h={56}>
      <Svg viewBox="0 0 32 56" width={32 * S} height={56 * S}>
        <Rect x={3} y={1} width={26} height={2} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={10} width={28} height={30} fill="#FFFFFF" stroke={C} strokeWidth={0.5} />
        <Rect x={8} y={13} width={16} height={4.5} fill="#F8FAFC" />
        <Rect x={2} y={40} width={28} height={3} fill="#E5E7EB" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={43} width={28} height={3} fill="#4B5563" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={46} width={3} height={4} fill="#1F2937" />
        <Rect x={26} y={46} width={3} height={4} fill="#1F2937" />
        <Ellipse cx={4.5} cy={52} rx={2.5} ry={2} fill={C} />
        <Ellipse cx={27.5} cy={52} rx={2.5} ry={2} fill={C} />
        <Rect x={0} y={2} width={1.5} height={42} fill="#9CA3AF" />
        <Rect x={-1} y={2} width={4} height={5} fill="#A8DCEC" stroke={C} strokeWidth={0.3} />
        {occupied ? (
          <G>
            <Ellipse cx={16} cy={17} rx={3.5} ry={3.5} fill="#FDE1C8" stroke={C} strokeWidth={0.5} />
            <Rect x={14} y={13.5} width={4} height={2} fill="#6B4423" />
            <Rect x={6} y={22} width={20} height={18} fill="#FED7AA" stroke={C} strokeWidth={0.4} />
          </G>
        ) : null}
      </Svg>
    </Box>
  );
}

export function Defib({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={20} h={40}>
      <Svg viewBox="0 0 20 40" width={20 * S} height={40 * S}>
        <Rect x={2} y={0} width={6} height={3} fill="#F59E0B" stroke={C} strokeWidth={0.4} />
        <Rect x={12} y={0} width={6} height={3} fill="#F59E0B" stroke={C} strokeWidth={0.4} />
        <Path d="M2 3 L18 3 L19 5 L1 5 Z" fill="#FACC15" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={5} width={18} height={15} fill="#FACC15" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={7} width={14} height={8} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Path d="M4 11 L6 11 L7 8 L8 14 L9 9 L10 11 L14 11" fill="none" stroke="#10B981" strokeWidth={0.7} />
        <Rect x={8} y={16} width={4} height={2} fill="#DC2626" />
        <Path d="M1 20 L19 20 L20 22 L0 22 Z" fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={22} width={18} height={13} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={3} cy={38} rx={2} ry={1.5} fill={C} />
        <Ellipse cx={17} cy={38} rx={2} ry={1.5} fill={C} />
      </Svg>
    </Box>
  );
}

export function OxygenTank({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={-2} w={12} h={20}>
      <Svg viewBox="0 0 12 20" width={12 * S} height={20 * S}>
        <Rect x={4} y={0} width={4} height={2} fill="#94A3B8" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={6} cy={4} rx={4} ry={1.5} fill="#15803D" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={4} width={8} height={13} fill="#16A34A" stroke={C} strokeWidth={0.4} />
        <Rect x={2.5} y={5} width={1.5} height={11} fill="#22C55E" />
        <Rect x={3} y={9} width={6} height={4} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={6} cy={17} rx={4} ry={1.5} fill="#15803D" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

export function GloveDispenser({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={14}>
      <Svg viewBox="0 0 12 14" width={12 * S} height={14 * S}>
        <Rect x={1} y={2} width={10} height={9} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={2} width={10} height={1.5} fill="#3B82F6" />
        <Rect x={2} y={4} width={8} height={5} fill="#A8DCEC" stroke={C} strokeWidth={0.3} />
        <Path d="M3.5 8 L8.5 8 L7.5 12 L4.5 12 Z" fill="#3B82F6" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

export function SharpsContainer({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={14}>
      <Svg viewBox="0 0 12 14" width={12 * S} height={14 * S}>
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
        <Rect x={3} y={0} width={2} height={2} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={2} y={2} width={4} height={1} fill="#9CA3AF" />
        <Rect x={1} y={4} width={6} height={7} fill="#A8DCEC" stroke={C} strokeWidth={0.3} />
        <Rect x={2} y={7} width={4} height={2} fill="#fff" stroke={C} strokeWidth={0.2} />
      </Svg>
    </Box>
  );
}

export function CompCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={16} h={36}>
      <Svg viewBox="0 0 16 36" width={16 * S} height={36 * S}>
        <Rect x={2} y={3} width={12} height={10} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={4} width={10} height={8} fill="#0F1A24" />
        <Rect x={4} y={5} width={8} height={1} fill="#22D3EE" />
        <Rect x={4} y={7} width={8} height={1} fill="#10B981" />
        <Path d="M2 16 L14 16 L15 18 L1 18 Z" fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={18} width={14} height={2} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Rect x={6} y={20} width={4} height={10} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={3} cy={33} rx={2} ry={1.5} fill={C} />
        <Ellipse cx={13} cy={33} rx={2} ry={1.5} fill={C} />
      </Svg>
    </Box>
  );
}

export function BPCuff({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={14}>
      <Svg viewBox="0 0 12 14" width={12 * S} height={14 * S}>
        <Rect x={1} y={1} width={10} height={6} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={2} width={8} height={4} fill="#0F1A24" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={3} width={6} height={1} fill="#10B981" />
        <Path d="M2 7 L10 7 L9 12 L3 12 Z" fill="#1E40AF" stroke={C} strokeWidth={0.4} />
        <Rect x={2.5} y={7} width={7} height={1} fill="#3B82F6" />
      </Svg>
    </Box>
  );
}

export function SuctionUnit({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} offY={1} w={14} h={14}>
      <Svg viewBox="0 0 14 14" width={14 * S} height={14 * S}>
        <Path d="M1 1 L13 1 L14 3 L0 3 Z" fill="#374151" stroke={C} strokeWidth={0.3} />
        <Rect x={1} y={3} width={12} height={10} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={4} width={5} height={8} fill="#D4F0F8" stroke={C} strokeWidth={0.3} />
        <Rect x={2} y={9} width={5} height={3} fill="#FCA5A5" />
        <Circle cx={10} cy={7} r={2.5} fill="#fff" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

export function Wheelchair({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={16} h={26}>
      <Svg viewBox="0 0 16 26" width={16 * S} height={26 * S}>
        <Rect x={3} y={3} width={10} height={8} fill="#374151" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={4} width={8} height={6} fill="#4B5563" />
        <Path d="M2 11 L14 11 L13 13 L3 13 Z" fill="#4B5563" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={13} width={10} height={2} fill="#1F2937" stroke={C} strokeWidth={0.3} />
        <Circle cx={3} cy={18} r={4} fill="none" stroke={C} strokeWidth={0.6} />
        <Circle cx={13} cy={18} r={4} fill="none" stroke={C} strokeWidth={0.6} />
        <Circle cx={3} cy={18} r={1.5} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Circle cx={13} cy={18} r={1.5} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={5} y={22} width={6} height={2} fill="#94A3B8" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

// ── er2 leftovers ──
export function TicketDispenser({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={-8} w={12} h={26}>
      <Svg viewBox="0 0 12 26" width={12 * S} height={26 * S}>
        <Rect x={0} y={4} width={12} height={16} fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={6} width={8} height={6} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={7.5} width={6} height={1} fill="#22D3EE" />
        <Rect x={3.5} y={15} width={5} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={4} y={20} width={4} height={4} fill="#6B7280" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

export function BrochureRack({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} offY={-4} w={14} h={22}>
      <Svg viewBox="0 0 14 22" width={14 * S} height={22 * S}>
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
        <Rect x={1} y={4} width={8} height={5} fill="#374151" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={5} width={4} height={3.5} fill="#1F2937" />
        <Rect x={6.5} y={1} width={2} height={8} fill="#111827" stroke={C} strokeWidth={0.4} />
        <Rect x={6.2} y={1} width={2.6} height={1.6} fill="#1F2937" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

export function WaterCooler({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={-8} w={10} h={26}>
      <Svg viewBox="0 0 10 26" width={10 * S} height={26 * S}>
        <Path d="M3 0 L7 0 L8 5 L2 5 Z" fill="#A8DCEC" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={4.5} width={2} height={1.5} fill="#3B82F6" />
        <Rect x={1} y={7} width={8} height={15} fill="#F3F4F6" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={11} width={1.5} height={2} fill="#EF4444" />
        <Rect x={5.5} y={11} width={1.5} height={2} fill="#3B82F6" />
        <Rect x={3} y={14} width={4} height={1.5} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

export function ChartBinder({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={2} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
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
        <Rect x={0} y={0} width={12} height={14} fill="#D6CFB8" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={2} width={4} height={4} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Rect x={6.5} y={2} width={4} height={4} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Circle cx={8.5} cy={7.5} r={1.6} fill="#374151" stroke={C} strokeWidth={0.3} />
        <Rect x={1} y={11.5} width={10} height={2} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

export function AnatomyPoster({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} w={14} h={22}>
      <Svg viewBox="0 0 14 22" width={14 * S} height={22 * S}>
        <Rect x={0} y={0} width={14} height={22} fill="#fff" stroke={C} strokeWidth={0.6} />
        <Rect x={1} y={1} width={12} height={20} fill="#FDEBE0" />
        <Circle cx={7} cy={4.5} r={2} fill="#F4B89A" stroke={C} strokeWidth={0.3} />
        <Rect x={5} y={6.5} width={4} height={7} fill="#F4B89A" stroke={C} strokeWidth={0.3} />
        <Rect x={6} y={8} width={1.2} height={1.2} fill="#DC2626" />
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
        <Rect x={2.5} y={2.5} width={W - 5} height={5} fill="#3B6CA8" />
        <Rect x={2.5} y={8.5} width={W - 5} height={2} fill="#DC2626" />
      </Svg>
    </Box>
  );
}

export function CCTVCamera({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={14} h={12}>
      <Svg viewBox="0 0 14 12" width={14 * S} height={12 * S}>
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
    <Box x={x} y={y} offY={2} w={W} h={14}>
      <Svg viewBox={`0 0 ${W} 14`} width={W * S} height={14 * S} preserveAspectRatio="none">
        <Path d={`M2 2 L${W - 2} 2 L${W - 4} 7 L4 7 Z`} fill="#A8764A" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={7} width={W - 8} height={2} fill="#7C5230" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={9} width={2} height={4} fill="#5C3A1A" />
        <Rect x={W - 6} y={9} width={2} height={4} fill="#5C3A1A" />
      </Svg>
    </Box>
  );
}

export function TissueBox({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={4} offY={4} w={8} h={7}>
      <Svg viewBox="0 0 8 7" width={8 * S} height={7 * S}>
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
        <Ellipse cx={5} cy={6} rx={6} ry={5} fill="#FFE9A8" opacity={0.35} />
        <Path d="M2 2 L8 2 L9 8 L1 8 Z" fill="#F4D78C" stroke={C} strokeWidth={0.5} />
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
        <Rect x={0} y={0} width={W} height={12} fill="#8C6A42" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={2} width={W - 4} height={4} fill="#BFE0F0" />
        <Circle cx={W - 5} cy={3.8} r={1.4} fill="#FBD877" />
        <Rect x={2} y={6} width={W - 4} height={3.5} fill="#7FB069" />
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
