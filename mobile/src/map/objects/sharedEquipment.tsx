// Shared + cross-department interior primitives — faithful RN-svg ports of the
// handoff `interior-shared.jsx` atoms (IBed/IMonitor/IIV/ICurtain/ICabinet/
// IReception/IChair/IPlant/ExamStool) and the cross-dept objects the ER master
// blueprint composes (SurgicalLight/InstrumentTray from OR, Ventilator/CrashCart/
// PyxisMachine/BankOfMonitors from ICU, XrayViewbox/CastCart from clinics).
//
// Authored at ITILE=16, rendered at TILE px via S. div-based reference objects
// are reconstructed with SVG rects (1:1 element geometry). Used via SharedObjectView
// with `i*`-prefixed types so the existing clinic bed/monitor/reception stay intact.
import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;
const METAL = '#9CA3AF';
const METAL_DK = '#4B5563';

function Box({ x, y, offX = 0, offY = 0, w, h, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S }}>{children}</View>
  );
}

function darkenHex(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.floor(((n >> 16) & 255) * f));
  const g = Math.max(0, Math.floor(((n >> 8) & 255) * f));
  const b = Math.max(0, Math.floor((n & 255) * f));
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}
function lightenHex(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.floor(((n >> 16) & 255) * f));
  const g = Math.min(255, Math.floor(((n >> 8) & 255) * f));
  const b = Math.min(255, Math.floor((n & 255) * f));
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

// ─── IBed — ward/or/peds variants, 2×3 ──────────────────────────────
const BED_PALETTE: Record<string, Record<string, string>> = {
  ward: { frame: '#9CA3AF', frameDk: '#6B7280', frameLt: '#CBD5E1', sheet: '#FFFFFF', sheetDk: '#E5E7EB', blanket: '#FED7AA', blanketDk: '#E0A876', blanketHi: '#FFE9CC' },
  or: { frame: '#64748B', frameDk: '#334155', frameLt: '#94A3B8', sheet: '#D5E2EC', sheetDk: '#A8C2D4', blanket: '#5E8FA8', blanketDk: '#3F6680', blanketHi: '#7DABC4' },
  peds: { frame: '#F59E0B', frameDk: '#B45309', frameLt: '#FBBF24', sheet: '#FDE4EE', sheetDk: '#F0C8D9', blanket: '#A7F3D0', blanketDk: '#7DCEA0', blanketHi: '#C7F8DE' },
};
export function IBed({ x, y, variant = 'ward', occupied }: { x: number; y: number; variant?: string; occupied?: boolean }) {
  const p = BED_PALETTE[variant] ?? BED_PALETTE.ward;
  return (
    <Box x={x} y={y} w={32} h={48}>
      <Svg viewBox="0 0 32 48" width={32 * S} height={48 * S}>
        <Ellipse cx={16} cy={45} rx={14} ry={4} fill="rgba(0,0,0,0.16)" />
        {/* headboard */}
        <Rect x={1} y={0} width={30} height={2} fill={p.frameLt} />
        <Rect x={2} y={0.5} width={28} height={0.6} fill={p.frame} />
        <Rect x={1} y={2} width={30} height={5} fill={p.frameDk} />
        <Rect x={8} y={3} width={0.7} height={3} fill={p.frame} />
        <Rect x={15.5} y={3} width={0.7} height={3} fill={p.frame} />
        <Rect x={23} y={3} width={0.7} height={3} fill={p.frame} />
        <Rect x={1} y={6.4} width={30} height={0.6} fill="#000" opacity={0.25} />
        {/* mattress top */}
        <Rect x={1} y={7} width={30} height={26} fill={p.sheet} />
        <Rect x={1} y={7} width={30} height={0.6} fill="#FFFFFF" />
        <Rect x={1} y={31.4} width={30} height={1.2} fill={p.sheetDk} />
        <Rect x={1} y={20} width={30} height={0.4} fill={p.sheetDk} opacity={0.55} />
        {/* pillow */}
        <Rect x={8} y={9} width={16} height={4.5} fill="#FFFFFF" />
        <Rect x={7.3} y={10} width={0.7} height={2.5} fill="#FFFFFF" />
        <Rect x={23.8} y={10} width={0.7} height={2.5} fill="#FFFFFF" />
        <Rect x={9} y={9.4} width={14} height={0.8} fill="#FEFEFE" />
        <Rect x={8} y={12.4} width={16} height={1.1} fill="#E5E7EB" />
        <Rect x={15.7} y={10} width={0.5} height={3} fill="#D1D5DB" opacity={0.55} />
        {/* occupant */}
        {occupied ? (
          <G>
            <Rect x={13} y={10.5} width={6} height={4} fill="#FDE1C8" />
            <Rect x={12} y={11.5} width={1} height={2} fill="#FDE1C8" />
            <Rect x={19} y={11.5} width={1} height={2} fill="#FDE1C8" />
            <Rect x={13} y={10} width={6} height={1} fill="#6B4423" />
            <Rect x={14} y={9.5} width={4} height={0.7} fill="#6B4423" />
            <Rect x={14} y={12.6} width={1} height={0.4} fill={C} />
            <Rect x={17} y={12.6} width={1} height={0.4} fill={C} />
            <Rect x={12.4} y={10.5} width={0.4} height={4} fill={C} opacity={0.4} />
            <Rect x={19.2} y={10.5} width={0.4} height={4} fill={C} opacity={0.4} />
            <Rect x={13} y={14.2} width={6} height={0.4} fill={C} opacity={0.4} />
          </G>
        ) : null}
        {/* blanket */}
        <Rect x={1} y={18} width={30} height={14} fill={p.blanket} />
        <Rect x={1} y={17.4} width={30} height={0.8} fill="#FFFFFF" />
        <Rect x={1} y={18} width={30} height={0.5} fill={p.blanketHi} />
        <Rect x={1} y={18.5} width={30} height={0.4} fill={p.blanketDk} />
        <Rect x={9} y={19} width={0.4} height={12} fill={p.blanketDk} opacity={0.4} />
        <Rect x={16} y={19} width={0.4} height={12} fill={p.blanketDk} opacity={0.25} />
        <Rect x={23} y={19} width={0.4} height={12} fill={p.blanketDk} opacity={0.4} />
        <Rect x={1} y={30.5} width={30} height={1.5} fill={p.blanketDk} opacity={0.55} />
        {occupied ? (
          <G>
            <Rect x={6} y={29} width={6} height={2} fill={p.blanketDk} opacity={0.55} />
            <Rect x={20} y={29} width={6} height={2} fill={p.blanketDk} opacity={0.55} />
          </G>
        ) : null}
        {/* mattress front + frame / foot panel */}
        <Rect x={1} y={33} width={30} height={2} fill={p.sheetDk} />
        <Rect x={2} y={33.2} width={28} height={0.4} fill={p.sheet} />
        <Rect x={1} y={35} width={30} height={3} fill={p.frame} />
        <Rect x={2} y={35.3} width={28} height={0.6} fill={p.frameLt} />
        <Rect x={1} y={38} width={30} height={3} fill={p.frameDk} />
        <Rect x={2} y={38.4} width={28} height={0.4} fill={p.frame} />
        {/* side rails */}
        <Rect x={-1} y={14} width={3} height={14} fill={p.frameDk} />
        <Rect x={-0.6} y={15} width={0.6} height={12} fill={p.frameLt} />
        <Rect x={30} y={14} width={3} height={14} fill={p.frameDk} />
        <Rect x={32} y={15} width={0.6} height={12} fill={p.frameLt} />
        {/* legs + wheels */}
        <Rect x={2} y={41} width={3} height={5} fill={p.frameDk} />
        <Rect x={27} y={41} width={3} height={5} fill={p.frameDk} />
        <Ellipse cx={3.5} cy={46.5} rx={2} ry={1.3} fill={C} />
        <Ellipse cx={28.5} cy={46.5} rx={2} ry={1.3} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── IMonitor — vitals monitor on a wheeled pole (1×2), optional beep ─
export function IMonitor({ x, y, beep }: { x: number; y: number; beep?: boolean }) {
  return (
    <Box x={x} y={y} offY={-2} w={18} h={34}>
      <Svg viewBox="0 0 18 34" width={18 * S} height={34 * S}>
        <Ellipse cx={9} cy={33} rx={6} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* top face + right side */}
        <Rect x={4} y={0} width={13} height={3} fill={METAL} stroke={C} strokeWidth={0.5} />
        <Rect x={15} y={2} width={3} height={20} fill={METAL_DK} stroke={C} strokeWidth={0.4} />
        {/* front face + screen */}
        <Rect x={2} y={2} width={12} height={20} fill={METAL_DK} stroke={C} strokeWidth={0.7} />
        <Rect x={3.5} y={3.5} width={9} height={17} fill="#0F1A24" />
        <Rect x={4.5} y={5.5} width={8} height={1} fill="#22D3EE" />
        <Rect x={4.5} y={9.5} width={8} height={1} fill="#F87171" />
        <Rect x={4.5} y={12.5} width={8} height={1} fill="#FACC15" />
        <Circle cx={13} cy={4} r={0.8} fill="#10B981" />
        {/* pole + wheeled base */}
        <Rect x={7} y={22} width={3} height={6} fill={METAL} stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={28} width={14} height={4} fill={METAL_DK} stroke={C} strokeWidth={0.5} />
        <Ellipse cx={2} cy={32} rx={1.6} ry={1.3} fill={C} />
        <Ellipse cx={14} cy={32} rx={1.6} ry={1.3} fill={C} />
        {/* beep alarm dot */}
        {beep ? <Circle cx={16.5} cy={1.5} r={1.4} fill="#EF4444" stroke={C} strokeWidth={0.3} /> : null}
      </Svg>
    </Box>
  );
}

// ─── IIV — IV pole + bag + drip chamber + spider base (1×~2.6) ──────
export function IIV({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-22} w={16} h={42}>
      <Svg viewBox="0 0 16 42" width={16 * S} height={42 * S}>
        {/* hook curling upward */}
        <Rect x={7} y={6} width={2} height={6} fill={METAL} stroke={C} strokeWidth={0.5} />
        <Rect x={5} y={4} width={2} height={3} fill={METAL} stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={2} width={2} height={3} fill={METAL} stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={0} width={6} height={2} fill={METAL} stroke={C} strokeWidth={0.5} />
        <Rect x={9} y={2} width={2} height={3} fill={METAL} stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={1} width={1} height={1} fill="#E2E5EB" />
        {/* IV bag */}
        <Rect x={13} y={15} width={3} height={12} fill="#5E8FA8" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={14} width={14} height={14} fill="#A8DCEC" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={15} width={12} height={1.5} fill="#D4F0F8" />
        <Rect x={2} y={17} width={12} height={6} fill="#7DBFD9" />
        <Rect x={2} y={24} width={12} height={3} fill="#fff" stroke={C} strokeWidth={0.2} />
        <Rect x={3} y={24.6} width={10} height={0.8} fill={C} opacity={0.53} />
        <Circle cx={8} cy={12} r={1.6} fill="none" stroke={C} strokeWidth={0.6} />
        {/* drip chamber */}
        <Rect x={5} y={30} width={6} height={8} fill="#D4F0F8" stroke={C} strokeWidth={0.6} />
        <Rect x={6} y={33} width={4} height={3} fill="#A8DCEC" />
        <Rect x={7.5} y={31.5} width={1} height={1} fill="#5E8FA8" />
        {/* pole */}
        <Rect x={7.4} y={38} width={1.2} height={2} fill="#E2E5EB" />
        {/* spider base */}
        <Ellipse cx={8} cy={40} rx={3} ry={1.2} fill={METAL_DK} stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={40} width={5} height={1.6} fill={METAL_DK} stroke={C} strokeWidth={0.3} />
        <Rect x={9} y={40} width={5} height={1.6} fill={METAL_DK} stroke={C} strokeWidth={0.3} />
        <Circle cx={2} cy={41.4} r={1} fill={C} />
        <Circle cx={14} cy={41.4} r={1} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── ICurtain — privacy drape divider (non-blocking visual) ─────────
export function ICurtain({ x, y, w = 1, h = 1, color = '#A7C7E7' }: { x: number; y: number; w?: number; h?: number; color?: string }) {
  const W = w * 16;
  const H = h * 16;
  const stripes = Math.max(1, Math.round(W / 3));
  return (
    <Box x={x} y={y} w={W} h={H}>
      <Svg viewBox={`0 0 ${W} ${H}`} width={W * S} height={H * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={H} fill={color} stroke={C} strokeWidth={1.5} />
        {Array.from({ length: stripes }).map((_, i) => (
          <Rect key={i} x={i * 3} y={0} width={1} height={H} fill={C} opacity={0.2} />
        ))}
      </Svg>
    </Box>
  );
}

// ─── IReception — white clinical reception desk (w×h) ───────────────
export function IReception({ x, y, w = 4, h = 2 }: { x: number; y: number; w?: number; h?: number }) {
  const W = w * 16;
  const legH = 8, apronH = 4;
  const H = h * 16 + 8;
  const topB = H - legH - apronH;
  const cx = w * 8;
  const monH = Math.min(8, topB - 6);
  const monY = 2;
  return (
    <Box x={x} y={y} offY={-4} w={W} h={H}>
      <Svg viewBox={`0 0 ${W} ${H}`} width={W * S} height={H * S} preserveAspectRatio="none">
        <Ellipse cx={W / 2} cy={H - 0.5 - W * 0.08} rx={W * 0.42} ry={W * 0.08} fill="rgba(0,0,0,0.16)" />
        {/* desk top */}
        <Path d={`M3 1 L${W - 3} 1 L${W - 1} ${topB} L1 ${topB} Z`} fill="#ECEAE1" stroke={C} strokeWidth={0.5} />
        <Path d={`M4 1.5 L${W - 4} 1.5 L${W - 5} 3.4 L5 3.4 Z`} fill="#FAF8F2" />
        <Line x1={2} y1={topB - 2.5} x2={W - 2} y2={topB - 2.5} stroke={C} strokeWidth={0.25} opacity={0.15} />
        {/* apron */}
        <Rect x={1} y={topB} width={W - 2} height={apronH} fill="#C6C2B6" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={topB + 0.5} width={W - 4} height={0.7} fill="#DAD6CA" />
        {/* back leg stubs + front legs */}
        <Rect x={3} y={0} width={2} height={1.6} fill={METAL} stroke={C} strokeWidth={0.3} />
        <Rect x={W - 5} y={0} width={2} height={1.6} fill={METAL} stroke={C} strokeWidth={0.3} />
        <Rect x={2} y={H - legH} width={3} height={legH} fill={METAL} stroke={C} strokeWidth={0.4} />
        <Rect x={2.5} y={H - legH + 0.5} width={1} height={legH - 1} fill="#CBD5E1" />
        <Rect x={W - 5} y={H - legH} width={3} height={legH} fill={METAL} stroke={C} strokeWidth={0.4} />
        <Rect x={W - 4.5} y={H - legH + 0.5} width={1} height={legH - 1} fill="#CBD5E1" />
        {/* monitor */}
        <Rect x={cx - 6} y={monY} width={12} height={monH} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Rect x={cx - 5} y={monY + 1} width={10} height={monH - 2} fill="#0F1A24" />
        <Rect x={cx - 4} y={monY + 1.8} width={8} height={0.7} fill="#10B981" />
        <Rect x={cx - 4} y={monY + 3.2} width={8} height={0.7} fill="#22D3EE" />
        <Rect x={cx - 4} y={monY + 4.6} width={6} height={0.7} fill="#FACC15" />
        <Rect x={cx - 1} y={monY + monH} width={2} height={1.4} fill="#4B5563" />
        <Ellipse cx={cx} cy={monY + monH + 2} rx={3.5} ry={1} fill="#374151" />
        {/* clipboard */}
        <Rect x={5} y={topB - 7} width={6.5} height={6} fill="#FEF3C7" stroke={C} strokeWidth={0.3} />
        <Rect x={7} y={topB - 7.8} width={2.5} height={1.2} fill={METAL} stroke={C} strokeWidth={0.25} />
        <Line x1={6} y1={topB - 5} x2={10.5} y2={topB - 5} stroke={C} strokeWidth={0.2} />
        <Line x1={6} y1={topB - 3.5} x2={10.5} y2={topB - 3.5} stroke={C} strokeWidth={0.2} />
        {/* coffee mug */}
        {w >= 3 ? (
          <G>
            <Ellipse cx={W - 8} cy={topB - 4} rx={2.6} ry={2.2} fill="#FFFFFF" stroke={C} strokeWidth={0.4} />
            <Ellipse cx={W - 8} cy={topB - 4} rx={1.7} ry={1.4} fill="#6B2C0E" />
            <Path d={`M${W - 5.6} ${topB - 5} Q${W - 3.6} ${topB - 4} ${W - 5.6} ${topB - 3}`} fill="none" stroke={C} strokeWidth={0.5} />
          </G>
        ) : null}
      </Svg>
    </Box>
  );
}

// ─── IChair — spindle chair, 4 facings (1 tile) ─────────────────────
export function IChair({ x, y, color = '#FED7AA', facing = 'down' }: { x: number; y: number; color?: string; facing?: string }) {
  const dark = darkenHex(color, 0.55);
  const gap = darkenHex(color, 0.32);
  const lite = lightenHex(color, 1.15);
  const liter = lightenHex(color, 1.32);
  const leg = METAL, legHi = '#CBD5E1', ink = C;
  const spindles = (yTop: number, hh: number) => [0, 1, 2, 3, 4].map((i) => (
    <Rect key={i} x={3.6 + i * 1.95} y={yTop} width={1.15} height={hh} fill={color} stroke={ink} strokeWidth={0.2} />
  ));
  let inner: ReactElement;
  let flip = false;
  if (facing === 'up') {
    inner = (
      <G>
        <Path d="M3 10.5 L13 10.5 L12 12.6 L4 12.6 Z" fill={lite} stroke={ink} strokeWidth={0.35} />
        <Rect x={2.2} y={1} width={11.6} height={2.8} rx={1.2} fill={lite} stroke={ink} strokeWidth={0.4} />
        <Rect x={3} y={1.4} width={10} height={1.1} fill={liter} />
        <Rect x={2.9} y={3.8} width={10.2} height={6.9} fill={gap} stroke={ink} strokeWidth={0.4} />
        {spindles(4.0, 6.5)}
        <Rect x={3} y={12.4} width={2.2} height={5.4} fill={leg} stroke={ink} strokeWidth={0.35} />
        <Rect x={3.5} y={12.9} width={0.9} height={4.4} fill={legHi} />
        <Rect x={10.8} y={12.4} width={2.2} height={5.4} fill={leg} stroke={ink} strokeWidth={0.35} />
        <Rect x={11.3} y={12.9} width={0.9} height={4.4} fill={legHi} />
      </G>
    );
  } else if (facing === 'left' || facing === 'right') {
    flip = facing === 'left';
    inner = (
      <G>
        <Path d="M1.6 1.4 L5.6 1.4 L5.6 8 L1.6 8 Z" fill={liter} stroke={ink} strokeWidth={0.4} />
        <Rect x={1.6} y={8} width={4} height={9.4} fill={color} stroke={ink} strokeWidth={0.4} />
        <Line x1={1.6} y1={8} x2={5.6} y2={8} stroke={ink} strokeWidth={0.45} />
        <Rect x={2.6} y={2.2} width={1.8} height={5.4} fill={gap} opacity={0.4} />
        <Path d="M5.6 7 L15 7 L15 16.6 L5.6 16.6 Z" fill={lite} stroke={ink} strokeWidth={0.4} />
        <Path d="M6.2 7.8 L14.2 7.8 L14.2 15.8 L6.2 15.8 Z" fill={color} />
        <Path d="M5.6 16.6 L15 16.6 L15 18.4 L5.6 18.4 Z" fill={dark} stroke={ink} strokeWidth={0.4} />
        <Rect x={2.4} y={16.8} width={2.2} height={7.8} fill={leg} stroke={ink} strokeWidth={0.4} />
        <Rect x={2.9} y={17.3} width={1} height={6.8} fill={legHi} />
        <Rect x={12.4} y={18.4} width={2.2} height={6.2} fill={leg} stroke={ink} strokeWidth={0.4} />
        <Rect x={12.9} y={18.9} width={1} height={5.2} fill={legHi} />
      </G>
    );
  } else {
    inner = (
      <G>
        <Rect x={2.6} y={0.4} width={1.8} height={1.6} fill={leg} stroke={ink} strokeWidth={0.25} />
        <Rect x={11.6} y={0.4} width={1.8} height={1.6} fill={leg} stroke={ink} strokeWidth={0.25} />
        <Rect x={2.2} y={1} width={11.6} height={2.6} rx={1.2} fill={lite} stroke={ink} strokeWidth={0.4} />
        <Rect x={3} y={1.4} width={10} height={1} fill={liter} />
        <Rect x={2.9} y={3.6} width={10.2} height={5.2} fill={gap} stroke={ink} strokeWidth={0.4} />
        {spindles(3.8, 4.8)}
        <Path d="M2.4 9 L13.6 9 L15 16.6 L1 16.6 Z" fill={lite} stroke={ink} strokeWidth={0.4} />
        <Path d="M3.4 9.8 L12.6 9.8 L13.7 15.8 L2.3 15.8 Z" fill={color} />
        <Path d="M4 11.8 L12 11.8" stroke={dark} strokeWidth={0.5} opacity={0.3} />
        <Path d="M1 16.6 L15 16.6 L15 18.4 L1 18.4 Z" fill={dark} stroke={ink} strokeWidth={0.4} />
        <Rect x={1.8} y={18.4} width={2.4} height={6} fill={leg} stroke={ink} strokeWidth={0.4} />
        <Rect x={2.3} y={18.9} width={1} height={5} fill={legHi} />
        <Rect x={11.8} y={18.4} width={2.4} height={6} fill={leg} stroke={ink} strokeWidth={0.4} />
        <Rect x={12.3} y={18.9} width={1} height={5} fill={legHi} />
      </G>
    );
  }
  return (
    <Box x={x} y={y} offY={-8} w={16} h={26}>
      <Svg viewBox="0 0 16 26" width={16 * S} height={26 * S}>
        {flip ? <G transform="translate(16,0) scale(-1,1)">{inner}</G> : inner}
      </Svg>
    </Box>
  );
}

// ─── IPlant — potted plant (1 tile) ─────────────────────────────────
export function IPlant({ x, y }: { x: number; y: number }) {
  // v11 2.5D: foreshortened tapered pot + elliptical rim & soil opening.
  return (
    <Box x={x} y={y} offY={-6} w={16} h={22}>
      <Svg viewBox="0 0 16 22" width={16 * S} height={22 * S}>
        <Ellipse cx={8} cy={21} rx={5.4} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* foliage rising from the pot */}
        <Rect x={6} y={2} width={3} height={8} fill="#4A7A4A" />
        <Rect x={4} y={4} width={3} height={6} fill="#3E6B3A" />
        <Rect x={9} y={3} width={3} height={7} fill="#3E6B3A" />
        <Rect x={3} y={6} width={2} height={4} fill="#5E9554" />
        <Rect x={11} y={5} width={2} height={5} fill="#5E9554" />
        <Rect x={7} y={1} width={2} height={3} fill="#5E9554" />
        {/* pot BODY — foreshortened tapered tub */}
        <Path d="M 4 13 L 12 13 L 10.6 20 L 5.4 20 Z" fill="#7C3F1A" stroke={C} strokeWidth={0.7} />
        <Path d="M 5.4 20 A 3 1.2 0 0 0 10.6 20" fill="#7C3F1A" stroke={C} strokeWidth={0.6} />
        <Path d="M 6 16 L 10 16 L 9.4 19.6 A 2 .8 0 0 1 6.6 19.6 Z" fill="#5C2A0D" opacity={0.35} />
        {/* pot TOP face — elliptical rim + soil opening */}
        <Ellipse cx={8} cy={13} rx={4} ry={1.7} fill="#A0531C" stroke={C} strokeWidth={0.6} />
        <Ellipse cx={8} cy={13} rx={2.7} ry={1} fill="#3A2A1A" />
        <Ellipse cx={8} cy={12.7} rx={4} ry={1.4} fill="none" stroke="#B8702A" strokeWidth={0.6} />
      </Svg>
    </Box>
  );
}

// ─── ExamStool — doctor's rolling stool (1 tile) ────────────────────
export function ExamStool({ x, y, color = '#4B5563' }: { x: number; y: number; color?: string }) {
  return (
    <Box x={x} y={y} offX={2} offY={2} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
        <Ellipse cx={6} cy={11} rx={4} ry={1.5} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={6} cy={3} rx={5} ry={2.5} fill={color} stroke={C} strokeWidth={0.4} />
        <Ellipse cx={6} cy={2.4} rx={4} ry={1.6} fill="#6B7280" />
        <Rect x={5} y={4} width={2} height={4} fill={METAL} />
        {[3, 6, 9].map((lx, i) => (
          <Rect key={i} x={lx} y={8} width={1.5} height={3} fill="#6B7280" transform={`rotate(${(i - 1) * 25} ${lx} 8)`} />
        ))}
      </Svg>
    </Box>
  );
}

// ─── SurgicalLight — overhead OR light dome (4×2, ceiling, non-blocking) ─
export function SurgicalLight({ x, y }: { x: number; y: number }) {
  // v10 (2.5D, diagonal-above): clean smooth TOP housing (no bulbs) + a tilted
  // LIT UNDERSIDE band carrying the bulbs, casting a downward beam cone + floor
  // glow onto the surgical field.
  const cx = 32, cyTop = 22, rx = 22, ry = 12, band = 7, cyUnder = cyTop + band;
  const bulbs: [number, number][] = [];
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; bulbs.push([cx + Math.cos(a) * (rx - 5), cyUnder + Math.sin(a) * (ry - 3)]); }
  for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + 0.4; bulbs.push([cx + Math.cos(a) * (rx - 14), cyUnder + Math.sin(a) * (ry - 8)]); }
  return (
    <Box x={x} y={y} offX={-6.4} offY={-4.8} w={44.8} h={33.6}>
      <Svg viewBox="0 0 64 48" width={44.8 * S} height={33.6 * S}>
        {/* downward light beam (cone) + floor glow */}
        <Path d="M14 30 L50 30 L58 46 L6 46 Z" fill="#FEF3C7" opacity={0.34} />
        <Ellipse cx={cx} cy={45} rx={24} ry={3.5} fill="#FEF08A" opacity={0.4} />
        {/* suspension arm + ceiling mount */}
        <Rect x={30} y={0} width={4} height={3.5} rx={1} fill="#374151" stroke={C} strokeWidth={0.5} />
        <Rect x={31} y={3} width={2} height={7} fill={METAL} stroke={C} strokeWidth={0.4} />
        {/* lit underside face (tilted toward viewer, below the housing) */}
        <Path d={`M ${cx - rx} ${cyTop} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cyTop} L ${cx + rx} ${cyUnder} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cyUnder} Z`} fill="#D2D9E0" stroke={C} strokeWidth={0.6} />
        <Ellipse cx={cx} cy={cyUnder} rx={rx} ry={ry} fill="#EAF0F5" stroke={C} strokeWidth={0.6} />
        {/* bulb cells on the lit underside */}
        {bulbs.map(([bx, by], i) => (
          <G key={i}>
            <Ellipse cx={bx} cy={by} rx={2.8} ry={2} fill="#FFF8DC" stroke={C} strokeWidth={0.4} />
            <Ellipse cx={bx} cy={by} rx={1.5} ry={1.1} fill="#FDE047" />
          </G>
        ))}
        <Ellipse cx={cx} cy={cyUnder} rx={3.2} ry={2.4} fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        {/* top housing — clean smooth dome (no bulbs) */}
        <Ellipse cx={cx} cy={cyTop} rx={rx} ry={ry} fill="#F1F5F9" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={cx} cy={cyTop - 1.5} rx={rx - 4} ry={ry - 3} fill="#FFFFFF" opacity={0.7} />
        <Ellipse cx={cx} cy={cyTop} rx={rx - 8} ry={ry - 5} fill="none" stroke={C} strokeWidth={0.4} opacity={0.18} />
      </Svg>
    </Box>
  );
}

// ─── InstrumentTray — Mayo stand with sterile drape (v11 2.5D top face) ─
export function InstrumentTray({ x, y }: { x: number; y: number }) {
  const sil = 'M4 3 Q1 3 1 6 L1 14 Q1 17 4 17 L26 17 Q29 17 29 14 L29 6 Q29 3 26 3 Z';
  return (
    <Box x={x} y={y} offY={-4} w={30.4} h={25.6}>
      <Svg viewBox="0 0 30 26" width={30.4 * S} height={25.6 * S}>
        <Ellipse cx={15} cy={23.5} rx={10.2} ry={3.5} fill="rgba(0,0,0,0.16)" />
        {/* stand pole + base behind */}
        <Rect x={14} y={17} width={2} height={6} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={15} cy={24} rx={6} ry={1.6} fill="#4B5563" stroke={C} strokeWidth={0.3} />
        {/* body silhouette: top face + front rim as one outline */}
        <Path d={sil} fill="#7DBFD9" stroke={C} strokeWidth={0.7} />
        {/* TOP face fill */}
        <Path d="M4 3 Q1 3 1 6 L1 11 Q15 13.4 29 11 L29 6 Q29 3 26 3 Z" fill="#C8E5F0" />
        <Path d="M4 3 Q1 3 1 6 L1 11" fill="none" stroke="#E4F3FA" strokeWidth={1} />
        {/* instruments on the tray */}
        <Rect x={4} y={4.4} width={9} height={1.3} rx={0.6} fill="#CBD5E1" stroke={C} strokeWidth={0.25} />
        <Path d="M13 4.4 l3 .65 l-3 .65 z" fill="#E5E7EB" stroke={C} strokeWidth={0.25} />
        <Path d="M4 7.6 Q10 6.9 16 8" fill="none" stroke="#9CA3AF" strokeWidth={1} />
        <Path d="M4 9.2 Q10 8.7 16 9" fill="none" stroke="#9CA3AF" strokeWidth={1} />
        <Line x1={19} y1={4.4} x2={25} y2={7.8} stroke="#9CA3AF" strokeWidth={1} />
        <Line x1={19} y1={7.8} x2={25} y2={4.4} stroke="#9CA3AF" strokeWidth={1} />
        <Rect x={20} y={8.2} width={2.6} height={2.2} fill="#FEFCF2" stroke={C} strokeWidth={0.25} />
        {/* re-stroke silhouette + curved seam */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.7} />
        <Path d="M1 11 Q15 13.4 29 11" fill="none" stroke={C} strokeWidth={0.6} />
      </Svg>
    </Box>
  );
}

// ─── XrayViewbox — wall lightbox with films (2×1.4, wall, non-blocking) ─
export function XrayViewbox({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={32} h={22}>
      <Svg viewBox="0 0 32 22" width={32 * S} height={22 * S}>
        <Ellipse cx={16} cy={20.5} rx={10.9} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Rect x={1} y={1} width={30} height={20} fill="#E5E7EB" stroke={C} strokeWidth={0.6} />
        <Rect x={3} y={3} width={12} height={16} fill="#1E3A5F" />
        <Rect x={17} y={3} width={12} height={16} fill="#1E3A5F" />
        <Rect x={7} y={4} width={4} height={14} fill="#BFD3E6" />
        <Ellipse cx={9} cy={5} rx={3} ry={2} fill="#D8E6F2" />
        <Ellipse cx={9} cy={17} rx={3} ry={2} fill="#D8E6F2" />
        {[5, 8, 11, 14].map((ry, i) => <Rect key={i} x={19} y={ry} width={9} height={1.5} fill="#9DB8D2" />)}
        <Rect x={9} y={1} width={3} height={2} fill="#6B7280" />
        <Rect x={22} y={1} width={3} height={2} fill="#6B7280" />
      </Svg>
    </Box>
  );
}

// ─── CastCart — plaster/supply cart (1.4×1.6) ───────────────────────
export function CastCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={22} h={26}>
      <Svg viewBox="0 0 22 26" width={22 * S} height={26 * S}>
        <Ellipse cx={11} cy={24} rx={7.5} ry={2.4} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 2 L20 2 L21 4 L1 4 Z" fill={METAL} stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={4} width={20} height={16} fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={6} cy={8} rx={3} ry={2} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={14} cy={8} rx={3} ry={2} fill="#FDE9D2" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={12} width={16} height={2} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={15} width={16} height={2} fill="#FDE9D2" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={4} cy={24} rx={2} ry={1.5} fill={C} />
        <Ellipse cx={18} cy={24} rx={2} ry={1.5} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── Ventilator — v11 2.5D: touchscreen on stalk + top-face body + spider base ─
export function Ventilator({ x, y }: { x: number; y: number }) {
  const body = 'M7.1 13 L17.9 13 Q18.5 13 18.5 13.6 L18.5 31 Q18.5 31.6 17.9 31.6 L7.1 31.6 Q6.5 31.6 6.5 31 L6.5 13.6 Q6.5 13 7.1 13 Z';
  const hose = 'M8.4 24 Q1.5 24 2.5 29 Q3.2 32.5 8 30.5';
  return (
    <Box x={x} y={y} offY={-8} w={25.6} h={46.4}>
      <Svg viewBox="0 0 26 46" width={25.6 * S} height={46.4 * S}>
        <Ellipse cx={13} cy={44} rx={8.8} ry={3} fill="rgba(0,0,0,0.16)" />
        {/* touchscreen monitor on a stalk */}
        <Rect x={3} y={1} width={18} height={12} rx={1.2} fill="#1B2128" stroke={C} strokeWidth={0.6} />
        <Rect x={4.2} y={2.2} width={15.6} height={9.6} rx={0.5} fill="#0B1622" />
        <Path d="M5 5.5 L7 5.5 L8 3.6 L9 7.2 L10 5.5 L14 5.5" fill="none" stroke="#22D3EE" strokeWidth={0.55} />
        <Path d="M5 8.6 L8 8.6 L8 6.9 L11 6.9 L11 8.6 L14 8.6" fill="none" stroke="#FACC15" strokeWidth={0.5} />
        <Rect x={15.5} y={3.2} width={3.4} height={2.2} fill="#10B981" opacity={0.85} />
        <Rect x={15.5} y={6.2} width={3.4} height={2.2} fill="#F87171" opacity={0.85} />
        <Rect x={15.5} y={9.2} width={3.4} height={1.6} fill="#38BDF8" opacity={0.7} />
        <Rect x={11.5} y={13} width={2.4} height={4} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
        {/* central body — dominant top face + short front */}
        <Path d="M6.5 20 L18.5 20 L18.5 31 Q18.5 31.6 17.9 31.6 L7.1 31.6 Q6.5 31.6 6.5 31 Z" fill="#E4E5E3" />
        <Path d="M7.1 13 L17.9 13 Q18.5 13 18.5 13.6 L18.5 20 L6.5 20 L6.5 13.6 Q6.5 13 7.1 13 Z" fill="#54606C" />
        <Rect x={8} y={14.2} width={9} height={1.4} fill="#6B7885" />
        <Rect x={8.2} y={16.2} width={4} height={3} rx={0.4} fill="#3A424C" />
        <Circle cx={15} cy={17.6} r={1.4} fill="#9AA6B2" stroke={C} strokeWidth={0.35} />
        <Line x1={6.5} y1={20} x2={18.5} y2={20} stroke={C} strokeWidth={0.55} />
        {/* viewer-facing front: patient port + valve + label */}
        <Circle cx={10} cy={26} r={1.6} fill="#CBD5E1" stroke={C} strokeWidth={0.4} />
        <Circle cx={14.6} cy={26} r={1.3} fill="#9AA6B2" stroke={C} strokeWidth={0.4} />
        <Rect x={7.6} y={29} width={9.4} height={1.4} fill="#D2D6D4" />
        {/* blue breathing-circuit hose */}
        <Path d={hose} fill="none" stroke="#7FB8E6" strokeWidth={2.4} strokeLinecap="round" />
        <Path d={hose} fill="none" stroke="#5B95C9" strokeWidth={0.5} strokeLinecap="round" opacity={0.5} />
        <Path d={body} fill="none" stroke={C} strokeWidth={0.6} />
        {/* column + spider wheel base */}
        <Rect x={11.5} y={31.6} width={2.4} height={6} fill="#C6CBD1" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={12.6} cy={39} rx={9} ry={2.4} fill="#D7DBDF" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={4.5} cy={41.5} rx={2.1} ry={1.6} fill="#2C3239" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={20.5} cy={41.5} rx={2.1} ry={1.6} fill="#2C3239" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={12.6} cy={43} rx={2.1} ry={1.6} fill="#2C3239" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── CrashCart — v11 2.5D: red lid top (defib) + viewer-facing screen + drawers ─
export function CrashCart({ x, y }: { x: number; y: number }) {
  const sil = 'M2 1 Q1 1 1 2 L1 25 Q1 26 2 26 L20 26 Q21 26 21 25 L21 2 Q21 1 20 1 Z';
  return (
    <Box x={x} y={y} offY={-3} w={22.4} h={30.4}>
      <Svg viewBox="0 0 22 30" width={22.4 * S} height={30.4 * S}>
        <Ellipse cx={11} cy={28.4} rx={7.5} ry={2.6} fill="rgba(0,0,0,0.16)" />
        <Path d={sil} fill="#B91C1C" />
        {/* TOP lid face — defib on top */}
        <Path d="M2 1 Q1 1 1 2 L1 9 L21 9 L21 2 Q21 1 20 1 Z" fill="#DC2626" />
        <Ellipse cx={15.5} cy={5} rx={2.2} ry={1.6} fill="#374151" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={18.5} cy={5} rx={1.6} ry={1.4} fill="#4B5563" stroke={C} strokeWidth={0.35} />
        <Rect x={3} y={3} width={8} height={3.4} rx={0.4} fill="#7F1D1D" />
        <Line x1={1} y1={9} x2={21} y2={9} stroke={C} strokeWidth={0.6} />
        {/* viewer-facing defib screen */}
        <Rect x={2.5} y={10} width={9} height={5} rx={0.5} fill="#0B3A1E" stroke={C} strokeWidth={0.4} />
        <Path d="M3.2 12.4 L5 12.4 L6 10.6 L7 13.8 L8 12.4 L11 12.4" fill="none" stroke="#4ADE80" strokeWidth={0.55} />
        <Rect x={13} y={10.4} width={2} height={2} rx={0.3} fill="#DC2626" stroke={C} strokeWidth={0.3} />
        <Rect x={16} y={10.4} width={2} height={2} rx={0.3} fill="#FACC15" stroke={C} strokeWidth={0.3} />
        <Rect x={13} y={13} width={5} height={2} rx={0.3} fill="#fff" stroke={C} strokeWidth={0.3} />
        {/* drawers */}
        <Line x1={1} y1={16} x2={21} y2={16} stroke={C} strokeWidth={0.55} />
        <Rect x={3} y={17} width={16} height={3} rx={0.3} fill="#fff" stroke={C} strokeWidth={0.35} />
        <Rect x={9.5} y={18.1} width={3} height={1} fill="#DC2626" />
        <Rect x={3} y={20.5} width={16} height={3} rx={0.3} fill="#fff" stroke={C} strokeWidth={0.35} />
        <Rect x={9.5} y={21.6} width={3} height={1} fill="#DC2626" />
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={4.5} cy={27.5} rx={1.8} ry={1.3} fill="#2C3239" />
        <Ellipse cx={17.5} cy={27.5} rx={1.8} ry={1.3} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

// ─── PyxisMachine — v11 2.5D: plain lid top + viewer-facing screen + drawers ─
export function PyxisMachine({ x, y }: { x: number; y: number }) {
  const sil = 'M3 1 Q2 1 2 2 L2 30 Q2 31 3 31 L29 31 Q30 31 30 30 L30 2 Q30 1 29 1 Z';
  return (
    <Box x={x} y={y} offY={-3} w={32} h={33.6}>
      <Svg viewBox="0 0 32 34" width={32 * S} height={33.6 * S}>
        <Ellipse cx={16} cy={31.3} rx={10.9} ry={3.7} fill="rgba(0,0,0,0.16)" />
        <Path d={sil} fill="#8A929B" />
        {/* TOP lid face */}
        <Path d="M3 1 Q2 1 2 2 L2 8 L30 8 L30 2 Q30 1 29 1 Z" fill="#AEB4BC" />
        <Rect x={4} y={2.4} width={24} height={2} rx={0.4} fill="#C7CDD4" />
        <Line x1={2} y1={8} x2={30} y2={8} stroke={C} strokeWidth={0.6} />
        {/* viewer-facing touchscreen ("PYXIS" as cyan block) + fingerprint reader */}
        <Rect x={4} y={9} width={15} height={10} rx={0.8} fill="#0F1A24" stroke={C} strokeWidth={0.5} />
        <Rect x={6} y={10.6} width={11} height={2.4} fill="#22D3EE" />
        <Rect x={5.5} y={14} width={12} height={1.4} fill="#10B981" />
        <Rect x={5.5} y={16.2} width={9} height={1.4} fill="#22D3EE" />
        <Ellipse cx={24.5} cy={13} rx={3} ry={3.4} fill="#7F1D1D" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={24.5} cy={13} rx={1.6} ry={2} fill="#EF4444" />
        {/* drawers */}
        <Line x1={2} y1={20} x2={30} y2={20} stroke={C} strokeWidth={0.55} />
        <Rect x={4} y={21} width={24} height={2.6} rx={0.4} fill="#C7CDD4" stroke={C} strokeWidth={0.3} />
        <Rect x={4} y={24.2} width={24} height={2.6} rx={0.4} fill="#C7CDD4" stroke={C} strokeWidth={0.3} />
        <Rect x={4} y={27.4} width={24} height={2.6} rx={0.4} fill="#C7CDD4" stroke={C} strokeWidth={0.3} />
        <Rect x={14} y={21.9} width={4} height={1} fill="#64748B" />
        <Rect x={14} y={25.1} width={4} height={1} fill="#64748B" />
        <Rect x={14} y={28.3} width={4} height={1} fill="#64748B" />
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.7} />
      </Svg>
    </Box>
  );
}

// ─── BankOfMonitors — wall bank of 4 ICU monitors (12×1.8, wall) ────
export function BankOfMonitors({ x, y }: { x: number; y: number }) {
  const W = 192, H = 29;
  const panelW = (W - 6) / 4;
  return (
    <Box x={x} y={y} w={W} h={H}>
      <Svg viewBox={`0 0 ${W} ${H}`} width={W * S} height={H * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={H} fill="#1F2937" stroke={C} strokeWidth={2} />
        {[0, 1, 2, 3].map((i) => {
          const px = 2 + i * panelW;
          return (
            <G key={i}>
              <Rect x={px} y={2} width={panelW - 1} height={H - 4} fill="#0F1A24" stroke={C} strokeWidth={0.6} />
              {/* channel label tag (R1..R4) */}
              <Rect x={px + 2} y={3.5} width={5} height={2} fill="#94A3B8" />
              <Rect x={px + 2} y={9} width={panelW - 5} height={1} fill="#22D3EE" />
              <Rect x={px + 2} y={14} width={panelW - 5} height={1} fill="#F87171" />
              <Rect x={px + 2} y={20} width={panelW - 5} height={1} fill="#FACC15" />
              {/* red alarm dot on panels 2 & 4 (odd 0-indexed) */}
              {i % 2 === 1 ? <Circle cx={px + panelW - 4} cy={4} r={1.4} fill="#EF4444" /> : null}
            </G>
          );
        })}
      </Svg>
    </Box>
  );
}

// ─── ICabinet — 2.5D wall cabinet (w×1), content variants ───────────
const CABINET_VARIANTS: Record<string, { frame: string; top: string; topLight: string; tag: string; tagText: string }> = {
  supply: { frame: '#D6CFB8', top: '#A89378', topLight: '#E8DCC0', tag: '#DC2626', tagText: '#fff' },
  drug: { frame: '#94A3B8', top: '#6B7280', topLight: '#ffffff', tag: '#FACC15', tagText: '#1F2937' },
  linen: { frame: '#E8DCC0', top: '#C8B68C', topLight: '#F2EAD6', tag: '#3B82F6', tagText: '#fff' },
  chart: { frame: '#7C5A38', top: '#5C3A1A', topLight: '#8A6A44', tag: '#A88862', tagText: '#fff' },
  sterile: { frame: '#4F76A4', top: '#385878', topLight: '#5A86B4', tag: '#A5D8E8', tagText: '#1F2937' },
  equipment: { frame: '#475569', top: '#1F2937', topLight: '#3A4655', tag: '#EF4444', tagText: '#fff' },
  pharma: { frame: '#D6CFB8', top: '#A89378', topLight: '#E8DCC0', tag: '#16A34A', tagText: '#fff' },
};
export function ICabinet({ x, y, w = 2, h = 1, variant = 'supply', label }: { x: number; y: number; w?: number; h?: number; variant?: string; label?: string }) {
  const v = CABINET_VARIANTS[variant] ?? CABINET_VARIANTS.supply;
  const W = w * 16;
  const H = h * 16;
  return (
    <Box x={x} y={y} offY={-4} w={W + 4} h={H + 6}>
      <Svg viewBox={`0 0 ${W + 4} ${H + 6}`} width={(W + 4) * S} height={(H + 6) * S}>
        {/* TOP face (above the body) */}
        <Rect x={3} y={0} width={W - 1} height={5} fill={v.top} stroke={C} strokeWidth={2} />
        <Rect x={4} y={1} width={W - 3} height={1.5} fill={v.topLight} opacity={0.5} />
        {/* RIGHT side face */}
        <Rect x={W} y={4} width={4} height={H} fill={v.top} stroke={C} strokeWidth={1.5} />
        {/* FRONT body */}
        <Rect x={0} y={4} width={W} height={H} fill={v.frame} stroke={C} strokeWidth={2} />
        {/* category tag strip (left) */}
        <Rect x={0} y={4} width={3} height={H} fill={v.tag} />
        {/* per-tile compartments (variant-specific content) */}
        {Array.from({ length: w }).map((_, i) => {
          const cx0 = i * 16 + 3;
          switch (variant) {
            case 'drug':
              return (
                <G key={i}>
                  <Rect x={cx0} y={7} width={10} height={H - 6} fill="#1F2937" stroke={C} strokeWidth={0.6} />
                  <Rect x={cx0 + 3} y={9} width={4} height={3} fill={['#F87171', '#FACC15', '#A7F3D0'][i % 3]} />
                  <Rect x={cx0 + 3.5} y={8} width={3} height={1.2} fill="#fff" />
                  <Rect x={cx0 + 4} y={H - 3} width={3} height={3} fill="#FACC15" stroke={C} strokeWidth={0.4} />
                </G>
              );
            case 'linen':
              return (
                <G key={i}>
                  <Rect x={cx0} y={7} width={10} height={H - 6} fill="#fff" stroke={C} strokeWidth={0.6} />
                  <Rect x={cx0 + 1} y={8} width={8} height={2} fill="#BAE6FD" />
                  <Rect x={cx0 + 1} y={10.5} width={8} height={2} fill="#FBCFE8" />
                  <Rect x={cx0 + 1} y={13} width={8} height={2} fill="#F3F4F6" stroke={C} strokeWidth={0.3} />
                </G>
              );
            case 'chart':
              return (
                <G key={i}>
                  <Rect x={cx0} y={7} width={10} height={H - 6} fill="#1F2937" stroke={C} strokeWidth={0.6} />
                  {[0, 1, 2, 3].map((k) => (
                    <Rect key={k} x={cx0 + 1.5 + k * 2} y={8} width={1.5} height={H - 12} fill={['#FCD34D', '#FB923C', '#A7F3D0', '#FBCFE8'][k]} />
                  ))}
                  <Rect x={cx0 + 4} y={H - 3} width={4} height={1.5} fill="#FACC15" />
                </G>
              );
            case 'sterile':
              return (
                <G key={i}>
                  <Rect x={cx0} y={7} width={10} height={H - 6} fill="#A5D8E8" stroke={C} strokeWidth={0.6} />
                  <Rect x={cx0 + 2} y={8} width={6} height={2.5} fill="#fff" stroke={C} strokeWidth={0.3} />
                  <Rect x={cx0 + 2} y={H - 4} width={6} height={2.5} fill="#fff" stroke={C} strokeWidth={0.3} />
                  <Line x1={cx0 + 1} y1={12} x2={cx0 + 9} y2={11} stroke="#fff" strokeWidth={0.4} opacity={0.6} />
                </G>
              );
            case 'equipment':
              return (
                <G key={i}>
                  <Rect x={cx0} y={7} width={10} height={H - 6} fill="#1F2937" stroke={C} strokeWidth={0.6} />
                  <Rect x={cx0 + 1.5} y={8} width={7} height={3} fill="#FACC15" stroke={C} strokeWidth={0.3} />
                  <Rect x={cx0 + 1.5} y={12} width={7} height={1.5} fill="#9CA3AF" />
                  <Rect x={cx0 + 1.5} y={H - 3} width={7} height={2} fill="#6B7280" />
                </G>
              );
            case 'pharma':
              return (
                <G key={i}>
                  <Rect x={cx0} y={7} width={10} height={H - 6} fill="#fff" stroke={C} strokeWidth={0.6} />
                  <Rect x={cx0 + 1} y={8} width={8} height={2} fill="#F87171" />
                  <Rect x={cx0 + 1} y={10.5} width={8} height={2} fill="#FACC15" />
                  <Rect x={cx0 + 1} y={13} width={8} height={2} fill="#A7F3D0" />
                </G>
              );
            default: // supply — gauze/bandage/syringe
              return (
                <G key={i}>
                  <Rect x={cx0} y={7} width={10} height={H - 6} fill="#FFF8E7" stroke={C} strokeWidth={0.6} />
                  <Rect x={cx0 + 4.5} y={8} width={1} height={4} fill="#DC2626" />
                  <Rect x={cx0 + 3} y={9.5} width={4} height={1} fill="#DC2626" />
                  <Rect x={cx0 + 1.5} y={13} width={7} height={1.5} fill="#FED7AA" stroke={C} strokeWidth={0.3} />
                  <Rect x={cx0 + 1} y={H - 3} width={6} height={1.2} fill="#94A3B8" />
                  <Rect x={cx0 + 6} y={H - 3} width={1} height={1.2} fill="#DC2626" />
                </G>
              );
          }
        })}
        {/* base shadow line (grounds the box) */}
        <Rect x={0} y={H + 4} width={W + 4} height={1.5} fill={C} opacity={0.4} />
      </Svg>
      {/* category label tag (above the cabinet) */}
      {label ? (
        <View style={{ position: 'absolute', left: 2 * S, top: -2 * S }}>
          <View style={{ backgroundColor: v.tag, borderWidth: 1, borderColor: C, paddingHorizontal: 3 }}>
            <Text style={{ fontFamily: 'DungGeunMo', fontSize: 7, color: v.tagText }}>{label}</Text>
          </View>
        </View>
      ) : null}
    </Box>
  );
}

// ─── SinkOR — OR scrub sink (v11 top-down trough: counter top + basin + apron) ─
export function SinkOR({ x, y }: { x: number; y: number }) {
  const sil = 'M2 3 L30 3 L30 26 Q30 28 28 28 L4 28 Q2 28 2 26 Z';
  return (
    <Box x={x} y={y} offY={-4} w={32} h={32}>
      <Svg viewBox="0 0 32 32" width={32 * S} height={32 * S}>
        <Ellipse cx={16} cy={29.3} rx={10.9} ry={3.7} fill="rgba(0,0,0,0.16)" />
        {/* full silhouette (counter top + front apron) */}
        <Path d={sil} fill="#AEB4BC" />
        {/* TOP counter face */}
        <Path d="M2 3 L30 3 L30 20 L2 20 Z" fill="#E1E5EA" />
        {/* gooseneck faucet + hot/cold seen from above */}
        <Rect x={15} y={4} width={2} height={4} rx={0.4} fill="#9CA3AF" stroke={C} strokeWidth={0.35} />
        <Path d="M16 4.5 Q21 4.5 21 9" fill="none" stroke="#B7BEC6" strokeWidth={1.6} />
        <Rect x={20.4} y={9} width={1.2} height={2.4} fill="#7DD3FC" />
        <Circle cx={11} cy={5.4} r={1.4} fill="#3B82F6" stroke={C} strokeWidth={0.3} />
        <Circle cx={21} cy={5.4} r={1.4} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        {/* deep elongated scrub basin inset on the counter */}
        <Rect x={5} y={9.5} width={22} height={9} rx={3} fill="#C7CDD4" stroke={C} strokeWidth={0.5} />
        <Rect x={6.5} y={10.6} width={19} height={6.6} rx={2.4} fill="#A8DCEC" />
        <Ellipse cx={16} cy={14} rx={1.3} ry={0.8} fill="#5B8FA8" />
        {/* seam → front apron */}
        <Line x1={2} y1={20} x2={30} y2={20} stroke={C} strokeWidth={0.55} />
        <Rect x={3} y={21} width={26} height={1} fill="#C6C2B6" />
        {/* knee/foot paddle on the front apron */}
        <Rect x={12} y={22.4} width={8} height={2.2} rx={1} fill="#8A929B" stroke={C} strokeWidth={0.4} />
        {/* outer outline */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.65} />
      </Svg>
    </Box>
  );
}

// ─── NurseDeskI — straight I-bar charting station (w×h) ──────────────
export function NurseDeskI({ x, y, w = 8, h = 2 }: { x: number; y: number; w?: number; h?: number }) {
  const W = w * 16, HH = h * 16, R = 10, TH = HH + R;
  const qz = '#ECEAE1', qzEdge = '#D2CDBE', qzHi = '#FAF8F2';
  const body = '#E4E2D8', bodyDk = '#C6C2B6';
  const nMon = Math.max(2, w - 3);
  const monXs: number[] = [];
  for (let i = 0; i < nMon; i++) monXs.push(10 + (i + 0.5) * ((W - 20) / nMon));
  return (
    <Box x={x} y={y} offY={-R} w={W} h={TH}>
      <Svg viewBox={`0 0 ${W} ${TH}`} width={W * S} height={TH * S} preserveAspectRatio="none">
        {/* counter body */}
        <Rect x={2} y={R} width={W - 4} height={HH - 2} fill={body} stroke={C} strokeWidth={0.7} />
        {/* quartz top + raised back ledge */}
        <Rect x={2} y={R - 2} width={W - 4} height={12} fill={qz} stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={R - 4} width={W - 4} height={3} fill={qzEdge} stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={R - 3.4} width={W - 6} height={1} fill={qzHi} />
        {/* monitor wall */}
        {monXs.map((mx, i) => (
          <G key={i}>
            <Rect x={mx - 1} y={R + 5} width={2} height={2} fill="#3A4048" />
            <Rect x={mx - 6} y={R - 6} width={12} height={12} fill="#1B2128" stroke={C} strokeWidth={0.5} />
            <Rect x={mx - 4.8} y={R - 4.8} width={9.6} height={9} fill="#0F1A24" />
            <Rect x={mx - 4} y={R - 3.6} width={8} height={1} fill="#2BB3C8" />
            <Rect x={mx - 4} y={R - 1.8} width={6} height={0.9} fill="#5A6B78" />
            <Rect x={mx - 4} y={R - 0.2} width={8} height={0.9} fill="#E0A23A" />
            <Rect x={mx - 5} y={R + 8} width={10} height={2.4} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
          </G>
        ))}
        {/* drawer pedestals at the ends */}
        {[3, W - 3 - 14].map((dx, i) => (
          <G key={`d${i}`}>
            <Rect x={dx} y={R + HH - 18} width={14} height={14} fill={bodyDk} stroke={C} strokeWidth={0.5} />
            {[0, 1].map((r) => (
              <G key={r}>
                <Rect x={dx + 1.5} y={R + HH - 16 + r * 6} width={11} height={4.6} fill={body} stroke={C} strokeWidth={0.4} />
                <Rect x={dx + 5} y={R + HH - 14 + r * 6} width={4} height={1} fill="#9AA1A8" />
              </G>
            ))}
          </G>
        ))}
      </Svg>
    </Box>
  );
}

const n = (props: MapObject['props'], k: string, d: number) => (typeof props?.[k] === 'number' ? (props[k] as number) : d);

/** Render a shared / cross-dept primitive by `i*`/cross-dept type. null if unknown. */
export function SharedObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'ibed': return <IBed x={x} y={y} variant={props?.variant as string | undefined} occupied={!!props?.occupied} />;
    case 'imonitor': return <IMonitor x={x} y={y} beep={!!props?.beep} />;
    case 'iiv': return <IIV x={x} y={y} />;
    case 'icurtain': return <ICurtain x={x} y={y} w={n(props, 'w', 1)} h={n(props, 'h', 1)} color={props?.color as string | undefined} />;
    case 'ireception': return <IReception x={x} y={y} w={n(props, 'w', 4)} h={n(props, 'h', 2)} />;
    case 'ichair': return <IChair x={x} y={y} color={props?.color as string | undefined} facing={props?.facing as string | undefined} />;
    case 'iplant': return <IPlant x={x} y={y} />;
    case 'examstool': return <ExamStool x={x} y={y} color={props?.color as string | undefined} />;
    case 'icabinet': return <ICabinet x={x} y={y} w={n(props, 'w', 2)} h={n(props, 'h', 1)} variant={props?.variant as string | undefined} label={props?.label as string | undefined} />;
    case 'surgicallight': return <SurgicalLight x={x} y={y} />;
    case 'instrumenttray': return <InstrumentTray x={x} y={y} />;
    case 'xrayviewbox': return <XrayViewbox x={x} y={y} />;
    case 'castcart': return <CastCart x={x} y={y} />;
    case 'ventilator': return <Ventilator x={x} y={y} />;
    case 'crashcart': return <CrashCart x={x} y={y} />;
    case 'pyxis': return <PyxisMachine x={x} y={y} />;
    case 'bankofmonitors': return <BankOfMonitors x={x} y={y} />;
    case 'sinkor': return <SinkOR x={x} y={y} />;
    case 'nursedeski': return <NurseDeskI x={x} y={y} w={n(props, 'w', 8)} h={n(props, 'h', 2)} />;
    default: return null;
  }
}
