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
import { View } from 'react-native';
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
  return (
    <Box x={x} y={y} offY={-6} w={16} h={22}>
      <Svg viewBox="0 0 16 22" width={16 * S} height={22 * S}>
        <Rect x={6} y={3} width={3} height={9} fill="#4A7A4A" />
        <Rect x={4} y={5} width={3} height={7} fill="#3E6B3A" />
        <Rect x={9} y={4} width={3} height={8} fill="#3E6B3A" />
        <Rect x={3} y={7} width={2} height={5} fill="#5E9554" />
        <Rect x={11} y={6} width={2} height={6} fill="#5E9554" />
        <Rect x={7} y={2} width={2} height={3} fill="#5E9554" />
        <Rect x={5} y={6} width={1} height={2} fill="#94BC85" />
        <Rect x={10} y={7} width={1} height={2} fill="#94BC85" />
        <Rect x={3} y={12} width={10} height={2} fill="#A0531C" stroke={C} strokeWidth={0.5} />
        <Path d="M4 14 L12 14 L11 21 L5 21 Z" fill="#7C3F1A" stroke={C} strokeWidth={0.7} />
        <Path d="M5 17 L11 17 L11 21 L5 21 Z" fill="#5C2A0D" opacity={0.4} />
        <Rect x={4} y={12.5} width={8} height={0.8} fill="#B8702A" />
      </Svg>
    </Box>
  );
}

// ─── ExamStool — doctor's rolling stool (1 tile) ────────────────────
export function ExamStool({ x, y, color = '#4B5563' }: { x: number; y: number; color?: string }) {
  return (
    <Box x={x} y={y} offX={2} offY={2} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
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
  return (
    <Box x={x} y={y} offX={-16} w={64} h={32}>
      <Svg viewBox="0 0 64 32" width={64 * S} height={32 * S}>
        <Rect x={30} y={0} width={4} height={3} fill="#374151" stroke={C} strokeWidth={0.4} />
        <Rect x={31} y={3} width={2} height={10} fill={METAL} stroke={C} strokeWidth={0.3} />
        <Ellipse cx={32} cy={17} rx={22} ry={6} fill="#F1F5F9" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={32} cy={15.5} rx={20} ry={4} fill="#FFFFFF" />
        <Path d="M10 17 L54 17 L51 21 L13 21 Z" fill="#E5E7EB" stroke={C} strokeWidth={0.4} />
        {[14, 20, 26, 32, 38, 44, 50].map((bx, i) => (
          <Circle key={i} cx={bx} cy={22.5} r={2.5} fill="#FEF08A" stroke={C} strokeWidth={0.3} />
        ))}
        <Circle cx={32} cy={22.5} r={2.5} fill="#FFFFFF" />
        <Ellipse cx={32} cy={28} rx={24} ry={3} fill="#FEF08A" opacity={0.35} />
      </Svg>
    </Box>
  );
}

// ─── InstrumentTray — Mayo stand with sterile drape (2×1.4) ─────────
export function InstrumentTray({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={28} h={22}>
      <Svg viewBox="0 0 28 22" width={28 * S} height={22 * S}>
        <Ellipse cx={14} cy={5} rx={13} ry={3} fill="#A5D8E8" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={14} cy={4} rx={12} ry={2} fill="#C8E5F0" />
        <Line x1={3} y1={5} x2={25} y2={5} stroke={C} strokeWidth={0.2} opacity={0.3} />
        <Path d="M1 5 L27 5 L25 11 L3 11 Z" fill="#7DBFD9" stroke={C} strokeWidth={0.4} />
        <Path d="M3 11 L25 11 L24 13 L4 13 Z" fill="#A5D8E8" stroke={C} strokeWidth={0.3} />
        <Rect x={4} y={3} width={10} height={1.2} fill={METAL} stroke={C} strokeWidth={0.25} />
        <Rect x={3} y={3.2} width={2} height={0.7} fill="#374151" />
        <Rect x={6} y={2} width={8} height={0.8} fill={METAL} stroke={C} strokeWidth={0.25} />
        <Rect x={16} y={3} width={6} height={1} fill={METAL} stroke={C} strokeWidth={0.25} />
        <Rect x={22} y={3.2} width={2} height={0.7} fill="#374151" />
        <Rect x={17} y={4.5} width={7} height={0.7} fill={METAL} />
        <Rect x={13} y={13} width={2} height={7} fill={METAL} stroke={C} strokeWidth={0.3} />
        <Rect x={13.3} y={13.2} width={0.7} height={6.5} fill="#CBD5E1" />
        <Ellipse cx={14} cy={20} rx={6} ry={1.5} fill="#4B5563" stroke={C} strokeWidth={0.3} />
        <Circle cx={9} cy={21} r={1.2} fill={C} />
        <Circle cx={19} cy={21} r={1.2} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── XrayViewbox — wall lightbox with films (2×1.4, wall, non-blocking) ─
export function XrayViewbox({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={32} h={22}>
      <Svg viewBox="0 0 32 22" width={32 * S} height={22 * S}>
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

// ─── Ventilator — bedside ventilator on pole (1×2) ──────────────────
export function Ventilator({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={16} h={36}>
      <Svg viewBox="0 0 16 36" width={16 * S} height={36 * S}>
        {/* pole */}
        <Rect x={6} y={8} width={4} height={8} fill={METAL} stroke={C} strokeWidth={0.4} />
        {/* body */}
        <Rect x={1} y={14} width={14} height={22} fill="#475569" stroke={C} strokeWidth={0.6} />
        {/* screen */}
        <Rect x={3} y={16} width={10} height={8} fill="#0F1A24" />
        <Rect x={4} y={17} width={8} height={1} fill="#22D3EE" />
        <Rect x={4} y={20} width={8} height={1} fill="#FACC15" />
        {/* knobs */}
        <Rect x={3} y={26} width={2} height={2} fill="#EF4444" />
        <Rect x={6} y={26} width={2} height={2} fill="#3B82F6" />
        <Rect x={9} y={26} width={2} height={2} fill="#10B981" />
        <Rect x={12} y={26} width={2} height={2} fill="#FACC15" />
        {/* VENT badge */}
        <Rect x={9} y={11} width={6} height={3} fill="#22D3EE" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── CrashCart — red emergency cart with defib on top (1×2) ─────────
export function CrashCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-8} w={16} h={40}>
      <Svg viewBox="0 0 16 40" width={16 * S} height={40 * S}>
        {/* defib box on top */}
        <Rect x={4} y={0} width={8} height={5} fill="#FACC15" stroke={C} strokeWidth={0.4} />
        <Path d="M7.5 1 L6 3 L8 3 L6.5 4.5" fill="none" stroke={C} strokeWidth={0.5} />
        {/* yellow top tray */}
        <Rect x={1} y={5} width={14} height={4} fill="#FACC15" stroke={C} strokeWidth={0.4} />
        {/* red body */}
        <Rect x={1} y={9} width={14} height={26} fill="#DC2626" stroke={C} strokeWidth={0.6} />
        {/* drawers */}
        <Rect x={3} y={12} width={10} height={6} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={20} width={10} height={6} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={28} width={10} height={6} fill="#fff" stroke={C} strokeWidth={0.4} />
        {/* wheels */}
        <Ellipse cx={3} cy={37} rx={2} ry={1.5} fill={C} />
        <Ellipse cx={13} cy={37} rx={2} ry={1.5} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── PyxisMachine — automated drug dispensing cabinet (2×2) ─────────
export function PyxisMachine({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={32} h={32}>
      <Svg viewBox="0 0 32 32" width={32 * S} height={32 * S}>
        <Rect x={0} y={0} width={32} height={32} fill="#94A3B8" stroke={C} strokeWidth={1} />
        {/* terminal screen */}
        <Rect x={3} y={3} width={26} height={14} fill="#1F2937" stroke={C} strokeWidth={0.8} />
        <Rect x={5} y={5} width={10} height={2} fill="#22D3EE" />
        <Rect x={5} y={9} width={22} height={1.5} fill="#10B981" />
        <Rect x={5} y={12} width={22} height={1.5} fill="#22D3EE" />
        {/* dispense drawers */}
        <Rect x={3} y={19} width={26} height={5} fill="#fff" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={25} width={26} height={5} fill="#fff" stroke={C} strokeWidth={0.5} />
        <Rect x={14} y={21} width={4} height={1.4} fill="#9CA3AF" />
        <Rect x={14} y={27} width={4} height={1.4} fill="#9CA3AF" />
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
              <Rect x={px + 2} y={9} width={panelW - 5} height={1} fill="#22D3EE" />
              <Rect x={px + 2} y={14} width={panelW - 5} height={1} fill="#F87171" />
              <Rect x={px + 2} y={20} width={panelW - 5} height={1} fill="#FACC15" />
              {i % 2 === 0 ? <Circle cx={px + panelW - 4} cy={4} r={1.4} fill="#EF4444" /> : null}
            </G>
          );
        })}
      </Svg>
    </Box>
  );
}

// ─── ICabinet — 2.5D wall cabinet (w×1), content variants ───────────
const CABINET_VARIANTS: Record<string, { frame: string; top: string; tag: string }> = {
  supply: { frame: '#D6CFB8', top: '#A89378', tag: '#DC2626' },
  drug: { frame: '#94A3B8', top: '#6B7280', tag: '#FACC15' },
  linen: { frame: '#E8DCC0', top: '#C8B68C', tag: '#3B82F6' },
  chart: { frame: '#7C5A38', top: '#5C3A1A', tag: '#A88862' },
  sterile: { frame: '#4F76A4', top: '#385878', tag: '#A5D8E8' },
  equipment: { frame: '#475569', top: '#1F2937', tag: '#EF4444' },
  pharma: { frame: '#D6CFB8', top: '#A89378', tag: '#16A34A' },
};
export function ICabinet({ x, y, w = 2, h = 1, variant = 'supply' }: { x: number; y: number; w?: number; h?: number; variant?: string }) {
  const v = CABINET_VARIANTS[variant] ?? CABINET_VARIANTS.supply;
  const W = w * 16;
  const H = h * 16;
  return (
    <Box x={x} y={y} offY={-4} w={W + 4} h={H + 6}>
      <Svg viewBox={`0 0 ${W + 4} ${H + 6}`} width={(W + 4) * S} height={(H + 6) * S}>
        {/* TOP face (above the body) */}
        <Rect x={3} y={0} width={W - 1} height={5} fill={v.top} stroke={C} strokeWidth={2} />
        <Rect x={4} y={1} width={W - 3} height={1.5} fill="#ffffff" opacity={0.4} />
        {/* RIGHT side face */}
        <Rect x={W} y={4} width={4} height={H} fill={v.top} stroke={C} strokeWidth={1.5} />
        {/* FRONT body */}
        <Rect x={0} y={4} width={W} height={H} fill={v.frame} stroke={C} strokeWidth={2} />
        {/* category tag strip (left) */}
        <Rect x={0} y={4} width={3} height={H} fill={v.tag} />
        {/* per-tile compartments */}
        {Array.from({ length: w }).map((_, i) => {
          const cx0 = i * 16 + 3;
          if (variant === 'drug') {
            return (
              <G key={i}>
                <Rect x={cx0} y={7} width={10} height={H - 6} fill="#1F2937" stroke={C} strokeWidth={0.6} />
                <Rect x={cx0 + 3} y={9} width={4} height={3} fill={['#F87171', '#FACC15', '#A7F3D0'][i % 3]} />
                <Rect x={cx0 + 3.5} y={8} width={3} height={1.2} fill="#fff" />
                <Rect x={cx0 + 4} y={H - 3} width={3} height={3} fill="#FACC15" stroke={C} strokeWidth={0.4} />
              </G>
            );
          }
          // generic supply-style compartment
          return (
            <G key={i}>
              <Rect x={cx0} y={7} width={10} height={H - 6} fill="#FFF8E7" stroke={C} strokeWidth={0.6} />
              <Rect x={cx0 + 4} y={8} width={1} height={4} fill={v.tag} />
              <Rect x={cx0 + 3} y={9.5} width={3} height={1} fill={v.tag} />
              <Rect x={cx0 + 2} y={H - 3} width={6} height={1.5} fill="#FED7AA" />
            </G>
          );
        })}
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
    case 'icabinet': return <ICabinet x={x} y={y} w={n(props, 'w', 2)} h={n(props, 'h', 1)} variant={props?.variant as string | undefined} />;
    case 'surgicallight': return <SurgicalLight x={x} y={y} />;
    case 'instrumenttray': return <InstrumentTray x={x} y={y} />;
    case 'xrayviewbox': return <XrayViewbox x={x} y={y} />;
    case 'castcart': return <CastCart x={x} y={y} />;
    case 'ventilator': return <Ventilator x={x} y={y} />;
    case 'crashcart': return <CrashCart x={x} y={y} />;
    case 'pyxis': return <PyxisMachine x={x} y={y} />;
    case 'bankofmonitors': return <BankOfMonitors x={x} y={y} />;
    default: return null;
  }
}
