// ER master-blueprint equipment (5g-a) — compact RN-svg ports of the
// interior-objects-er2/er3 catalog. Authored at ITILE=16, rendered at TILE px
// via S. Room-defining objects (lobby security / triage / nursing station /
// critical / isolation / psych / decon / family). Minor desk props (tissue box,
// desk phone, chart binder, framed picture, etc.) are a later polish pass.
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
        <Rect x={6} y={13} width={2} height={9} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={20} width={10} height={4} fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
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
        <Rect x={6} y={0} width={5} height={2} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={4} width={8} height={9} fill="#A8DCEC" stroke={C} strokeWidth={0.5} />
        <Rect x={5} y={6.5} width={6} height={4} fill="#7DBFD9" />
        <Rect x={7} y={13} width={2} height={9} fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={22} width={12} height={9} fill="#475569" stroke={C} strokeWidth={0.6} />
        <Rect x={3} y={23} width={10} height={4} fill="#0F1A24" />
        <Rect x={4} y={24} width={5} height={1.2} fill="#22D3EE" />
        <Rect x={3.5} y={28} width={2} height={2} fill="#10B981" />
        <Rect x={6.5} y={28} width={2} height={2} fill="#EF4444" />
        <Rect x={7} y={31} width={2} height={8} fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={8} cy={40} rx={6} ry={2} fill="#6B7280" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

export function DressingCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={20} h={30}>
      <Svg viewBox="0 0 20 30" width={20 * S} height={30 * S}>
        <Path d="M2 4 L18 4 L19 7 L1 7 Z" fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={1} width={3} height={4} fill="#92400E" stroke={C} strokeWidth={0.4} />
        <Rect x={8} y={2} width={4} height={3} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Rect x={13} y={2} width={4} height={3} fill="#A5D8E8" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={7} width={16} height={3} fill="#94A3B8" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={11} width={14} height={3} fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={7} cy={12.5} rx={3} ry={1} fill="#E5E7EB" stroke={C} strokeWidth={0.3} />
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
        <Rect x={3} y={6} width={7} height={5} fill="#FACC15" />
        <Rect x={W - 13} y={6} width={10} height={1.2} fill="#22D3EE" />
        <Rect x={W - 13} y={8} width={10} height={1.2} fill="#94A3B8" />
      </Svg>
    </Box>
  );
}

export function WasteBin({ x, y, tone = 'general' }: { x: number; y: number; tone?: string }) {
  const inf = tone === 'infectious';
  const body = inf ? '#FACC15' : '#CBD5E1';
  const lid = inf ? '#EAB308' : '#9CA3AF';
  return (
    <Box x={x} y={y} offX={3} w={10} h={18}>
      <Svg viewBox="0 0 10 18" width={10 * S} height={18 * S}>
        <Ellipse cx={5} cy={3} rx={4.5} ry={1.6} fill={lid} stroke={C} strokeWidth={0.4} />
        <Rect x={0.5} y={3} width={9} height={2} fill={lid} />
        <Path d="M1 5 L9 5 L8.3 15 L1.7 15 Z" fill={body} stroke={C} strokeWidth={0.5} />
        {inf ? null : <Rect x={3} y={8} width={4} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />}
      </Svg>
    </Box>
  );
}

export function PPEStand({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} offY={-8} w={14} h={34}>
      <Svg viewBox="0 0 14 34" width={14 * S} height={34 * S}>
        <Rect x={1} y={2} width={12} height={1.5} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Path d="M3 4 L11 4 L12 8 L9.5 8 L9.5 20 L4.5 20 L4.5 8 L2 8 Z" fill="#FEFCE8" stroke={C} strokeWidth={0.5} />
        <Rect x={6} y={4} width={2} height={3} fill="#FEF9C3" stroke={C} strokeWidth={0.3} />
        <Rect x={2} y={22} width={10} height={6} fill="#3B82F6" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={23} width={8} height={2.5} fill="#fff" />
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

// ── Nurse station — big U/ㄷ open counter (monitor wall + quartz top) ──
export function NurseStationDesk({ x, y, w = 10, h = 6 }: { x: number; y: number; w?: number; h?: number }) {
  const W = w * 16;
  const HH = h * 16;
  const R = 10;
  const body = '#E4E2D8';
  const qz = '#ECEAE1';
  const nMon = Math.max(2, w - 3);
  const monXs: number[] = [];
  for (let i = 0; i < nMon; i++) monXs.push(10 + (i + 0.5) * ((W - 20) / nMon));
  return (
    <Box x={x} y={y} offY={-R} w={W} h={HH + R}>
      <Svg viewBox={`0 0 ${W} ${HH + R}`} width={W * S} height={(HH + R) * S} preserveAspectRatio="none">
        <Rect x={2} y={R} width={W - 4} height={HH - 2} fill={body} stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={R - 2} width={W - 4} height={12} fill={qz} stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={R - 4} width={W - 4} height={3} fill="#D2CDBE" stroke={C} strokeWidth={0.5} />
        {monXs.map((mx, i) => (
          <G key={i}>
            <Rect x={mx - 6} y={R - 6} width={12} height={12} fill="#1B2128" stroke={C} strokeWidth={0.5} />
            <Rect x={mx - 4.8} y={R - 4.8} width={9.6} height={9} fill="#0F1A24" />
            <Rect x={mx - 4} y={R - 3.6} width={8} height={1} fill="#2BB3C8" />
            <Rect x={mx - 4} y={R - 0.2} width={8} height={0.9} fill="#E0A23A" />
            <Rect x={mx - 5} y={R + 8} width={10} height={2.4} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
          </G>
        ))}
      </Svg>
    </Box>
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
    default: return null;
  }
}
