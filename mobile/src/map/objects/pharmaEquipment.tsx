// Central Pharmacy objects — faithful RN-svg ports of the handoff
// interior-pharma.jsx helpers + interior-objects-pharma2.jsx catalog. Authored at
// ITILE=16, rendered at TILE px via S (Box maps the handoff's `x*ITILE`/`top-N`
// offsets 1:1). SVG `<text>` glyphs → shape blocks; the handoff's DIV labels
// (CounterSign/ShelfLabel/FloorTape/WallPhone) are recreated with RN Views/Text.
// v13 2.5D: floor objects carry a ground-contact shadow ellipse. Dispatched via
// PharmaObjectView.
import { type ReactElement } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;
const FONT = 'DungGeunMo';

function Box({ x, y, offX = 0, offY = 0, w, h, z, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; z?: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S, zIndex: z }}>{children}</View>
  );
}

// ─── PharmaCounter — pick-up/drop-off work counter (w tiles) ───────────
export function PharmaCounter({ x, y, w = 11 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} offY={-4} w={W} h={28}>
      <Svg viewBox={`0 0 ${W} 28`} width={W * S} height={28 * S} preserveAspectRatio="none">
        <Path d={`M1 12 L${W - 1} 12 L${W - 1} 24 Q${W - 1} 25 ${W - 2} 25 L2 25 Q1 25 1 24 Z`} fill="#C6C2B6" stroke={C} strokeWidth={0.7} />
        <Rect x={1} y={1} width={W - 2} height={11} fill="#ECEAE1" stroke={C} strokeWidth={0.7} />
        <Rect x={2.5} y={2.4} width={W - 5} height={1.6} fill="#F7F5EE" />
        <Line x1={1} y1={12} x2={W - 1} y2={12} stroke={C} strokeWidth={0.55} />
        <G opacity={0.18}>
          {Array.from({ length: Math.max(1, Math.round(W / 8)) }).map((_, i) => (
            <Line key={i} x1={4 + i * 8} y1={13} x2={4 + i * 8} y2={24} stroke={C} strokeWidth={1} />
          ))}
        </G>
        <Rect x={2} y={23.5} width={W - 4} height={1.5} fill={C} opacity={0.22} />
      </Svg>
    </Box>
  );
}

// ─── CounterSign — bobbing hanging sign (PICK-UP / DROP-OFF) ────────────
export function CounterSign({ x, y, text = '', color = '#10B981' }: { x: number; y: number; text?: string; color?: string }) {
  return (
    <Box x={x} y={y} offY={-14} w={16} h={20} z={3}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ backgroundColor: color, borderWidth: 2, borderColor: C, paddingHorizontal: 4, paddingVertical: 1 }}>
          <Text style={{ fontFamily: FONT, fontSize: 8, color: C }}>{text}</Text>
        </View>
        <View style={{ width: 2, height: 8, backgroundColor: C }} />
      </View>
    </Box>
  );
}

// ─── ShelfLabel — small dark tag over a drug shelf (A · ANTIBIOTICS) ────
export function ShelfLabel({ x, y, text = '', warn = false }: { x: number; y: number; text?: string; warn?: boolean }) {
  return (
    <Box x={x} y={y} offX={2} offY={-9} w={80} h={12} z={4}>
      <View style={{ alignSelf: 'flex-start', backgroundColor: warn ? '#DC2626' : '#1F2937', borderWidth: 1.5, borderColor: C, paddingHorizontal: 4 }}>
        <Text style={{ fontFamily: FONT, fontSize: 6, color: warn ? '#fff' : '#FACC15' }}>{text}</Text>
      </View>
    </Box>
  );
}

// ─── FloorTape — sterile-line hazard floor tape (w tiles) ──────────────
export function FloorTape({ x, y, w = 12, text = '' }: { x: number; y: number; w?: number; text?: string }) {
  return (
    <Box x={x} y={y} w={w * 16} h={12}>
      <View style={{ flex: 1, backgroundColor: '#FACC15', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: FONT, fontSize: 7, color: C, letterSpacing: 1 }} numberOfLines={1}>{text}</Text>
      </View>
    </Box>
  );
}

// ─── WallPhone — wall telephone, shakes + ♪♫ when ringing ──────────────
export function WallPhone({ x, y, ringing = false }: { x: number; y: number; ringing?: boolean }) {
  return (
    <Box x={x} y={y} w={16} h={22}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#374151', borderWidth: 2, borderColor: C }} />
      <View style={{ position: 'absolute', left: 2, right: 2, top: 4, height: 10, backgroundColor: '#1F2937', borderWidth: 1, borderColor: '#00000088' }} />
      <View style={{ position: 'absolute', left: 4, top: 18, width: 24, height: 16, backgroundColor: '#6B7280', borderWidth: 1, borderColor: '#00000088' }} />
      {ringing ? (
        <>
          <Text style={{ position: 'absolute', top: -10, left: -6, fontFamily: FONT, fontSize: 9, color: '#EF4444' }}>♪</Text>
          <Text style={{ position: 'absolute', top: -10, right: -6, fontFamily: FONT, fontSize: 9, color: '#EF4444' }}>♫</Text>
        </>
      ) : null}
    </Box>
  );
}

// ─── FridgePharma — glass-door medication fridge (4°) ──────────────────
export function FridgePharma({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={22} h={30}>
      <Svg viewBox="0 0 22 30" width={22 * S} height={30 * S}>
        <Ellipse cx={11.0} cy={28.4} rx={7.5} ry={2.6} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 9 L20 9 L20 26 Q20 27 19 27 L3 27 Q2 27 2 26 Z" fill="#A7CFE0" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={1} width={18} height={8} rx={2} fill="#CBE8F5" stroke={C} strokeWidth={0.7} />
        <Rect x={3.5} y={2.5} width={15} height={1.5} fill="#E4F3FA" />
        <Line x1={2} y1={9} x2={20} y2={9} stroke={C} strokeWidth={0.5} />
        <Rect x={4} y={10.5} width={14} height={12} rx={1} fill="#9FD0E4" stroke={C} strokeWidth={0.5} />
        <Rect x={4.5} y={13.5} width={13} height={0.9} fill="#7FB8D8" />
        <Rect x={4.5} y={17.5} width={13} height={0.9} fill="#7FB8D8" />
        {[5.2, 8, 10.8, 13.6].map((vx, i) => <Rect key={i} x={vx} y={11} width={1.7} height={2.2} fill="#FEFCF2" stroke={C} strokeWidth={0.2} />)}
        {[5.2, 8, 10.8, 13.6].map((vx, i) => <Rect key={'b' + i} x={vx} y={14.8} width={1.7} height={2.2} fill="#DFF0E4" stroke={C} strokeWidth={0.2} />)}
        {[5.2, 8, 10.8, 13.6].map((vx, i) => <Rect key={'c' + i} x={vx} y={18.8} width={1.7} height={2.2} fill="#F4D29A" stroke={C} strokeWidth={0.2} />)}
        <Rect x={17} y={13} width={1.2} height={7} rx={0.4} fill="#6E9DB5" />
        <Rect x={5} y={23.5} width={5.2} height={2.2} rx={0.4} fill="#0B2A3A" />
        <Rect x={6} y={24.2} width={3} height={0.9} fill="#22D3EE" />
        <Ellipse cx={5} cy={28} rx={1.6} ry={1.2} fill="#2C3239" />
        <Ellipse cx={17} cy={28} rx={1.6} ry={1.2} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

// ─── MedCart — mobile med cart, AM/PM/HS colour-coded drawers ──────────
export function MedCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-3} w={24} h={28}>
      <Svg viewBox="0 0 24 28" width={24 * S} height={28 * S}>
        <Ellipse cx={12.0} cy={26.2} rx={8.2} ry={2.8} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 9 L22 9 L22 25 Q22 26 21 26 L3 26 Q2 26 2 25 Z" fill="#9BA2AB" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={1} width={20} height={8} rx={1.5} fill="#B7BEC6" stroke={C} strokeWidth={0.7} />
        <Rect x={3.5} y={2.4} width={17} height={1.4} fill="#D2D7DD" />
        <Rect x={12} y={3.4} width={7} height={4} rx={0.6} fill="#FEF3C7" stroke={C} strokeWidth={0.4} />
        <Line x1={2} y1={9} x2={22} y2={9} stroke={C} strokeWidth={0.5} />
        {([['#F87171', 10.5], ['#FBBF24', 14], ['#A7F3D0', 17.5]] as const).map(([c, ty], i) => (
          <G key={i}>
            <Rect x={4} y={ty} width={16} height={3} rx={0.5} fill="#E1E5EA" stroke={C} strokeWidth={0.4} />
            <Rect x={4} y={ty} width={2.4} height={3} fill={c} />
            <Rect x={14.5} y={ty + 1} width={3.5} height={1} rx={0.4} fill="#9AA1A8" />
          </G>
        ))}
        <Ellipse cx={5} cy={27} rx={1.6} ry={1.2} fill="#2C3239" />
        <Ellipse cx={19} cy={27} rx={1.6} ry={1.2} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

// ─── Centrifuge — spinning drum (cleanroom) ────────────────────────────
export function Centrifuge({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-3} w={24} h={26}>
      <Svg viewBox="0 0 24 26" width={24 * S} height={26 * S}>
        <Ellipse cx={12.0} cy={24.2} rx={8.2} ry={2.8} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 15 L22 15 L22 22 Q22 23 21 23 L3 23 Q2 23 2 22 Z" fill="#B4BAC2" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={12} cy={11} rx={10} ry={7} fill="#C3C9D0" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={12} cy={10.4} rx={7.5} ry={5.2} fill="#1F2937" />
        <Ellipse cx={12} cy={10.4} rx={4} ry={2.8} fill="#475569" />
        <Circle cx={12} cy={10.4} r={1} fill="#9AA1A8" />
        <Rect x={5} y={16.5} width={7} height={4} rx={0.5} fill="#0F1A24" />
        <Rect x={6} y={17.6} width={5} height={1.6} fill="#22D3EE" />
        <Circle cx={17} cy={18.5} r={1.6} fill="#10B981" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── PrintLabel — label printer emitting a printed strip ───────────────
export function PrintLabel({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-3} w={26} h={24}>
      <Svg viewBox="0 0 26 24" width={26 * S} height={24 * S}>
        <Ellipse cx={13.0} cy={22} rx={8.8} ry={3} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 12 L24 12 L24 20 Q24 21 23 21 L3 21 Q2 21 2 20 Z" fill="#B7BEC6" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={3} width={22} height={9} rx={1.5} fill="#D1D5DB" stroke={C} strokeWidth={0.7} />
        <Rect x={3.5} y={4.2} width={19} height={1.4} fill="#E1E5EA" />
        <Rect x={6} y={9} width={14} height={1.6} fill="#2C3239" />
        <Rect x={7} y={1} width={12} height={5} rx={0.5} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Rect x={8.5} y={2.2} width={8} height={0.9} fill={C} opacity={0.7} />
        <Rect x={8.5} y={3.8} width={6} height={0.9} fill={C} opacity={0.5} />
        <Line x1={2} y1={12} x2={24} y2={12} stroke={C} strokeWidth={0.55} />
        <Circle cx={19} cy={16} r={1.8} fill="#10B981" stroke={C} strokeWidth={0.4} />
        <Rect x={5} y={15} width={9} height={2} rx={0.4} fill="#0F1A24" />
      </Svg>
    </Box>
  );
}

// ─── PneumaticTube — wall-mounted pneumatic tube docking station ───────
export function PneumaticTube({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={28} h={32}>
      <Svg viewBox="0 0 28 32" width={28 * S} height={32 * S}>
        <Ellipse cx={14.0} cy={29.8} rx={9.5} ry={3.2} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={2} width={24} height={18} rx={2} fill="#AEB4BC" stroke={C} strokeWidth={0.7} />
        <Rect x={3.5} y={3.5} width={21} height={1.4} fill="#C7CDD4" />
        <Ellipse cx={10} cy={12} rx={6} ry={5} fill="#1F2937" stroke={C} strokeWidth={0.6} />
        <Ellipse cx={10} cy={12} rx={3.8} ry={3} fill="#0B1620" />
        <Rect x={7.6} y={9.5} width={4.8} height={5} rx={2.4} fill="#FBBF24" stroke={C} strokeWidth={0.4} />
        <Rect x={8.2} y={10.4} width={3.6} height={1.4} fill="#FDE68A" />
        <Rect x={18} y={8} width={6} height={7} rx={0.6} fill="#0F1A24" />
        <Rect x={19} y={9} width={4} height={1.2} fill="#22D3EE" />
        <Rect x={19} y={11} width={3} height={1.2} fill="#10B981" />
        <Path d="M20 3 Q26 0 25 6" fill="none" stroke="#CFE3EC" strokeWidth={3} />
        <Rect x={2} y={20} width={24} height={4} fill="#8A929B" stroke={C} strokeWidth={0.6} />
        <Circle cx={8.4} cy={5} r={2} fill="#EF4444" />
      </Svg>
    </Box>
  );
}

// ─── TubeCapsuleRack — rack of pneumatic capsules ──────────────────────
export function TubeCapsuleRack({ x, y }: { x: number; y: number }) {
  const cols = ['#FBBF24', '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#60A5FA'];
  return (
    <Box x={x} y={y} offY={1} w={26} h={12}>
      <Svg viewBox="0 0 26 12" width={26 * S} height={12 * S}>
        <Ellipse cx={13.0} cy={10} rx={8.8} ry={3} fill="rgba(0,0,0,0.16)" />
        <Rect x={1} y={8} width={24} height={3} fill="#94A3B8" stroke={C} strokeWidth={0.5} />
        {[2, 6, 10, 14, 18, 22].map((cx, i) => (
          <G key={i}>
            <Rect x={cx} y={2} width={3.4} height={7} rx={1.7} fill={cols[i]} stroke={C} strokeWidth={0.4} />
            <Rect x={cx + 0.4} y={3} width={2.6} height={2} fill="#fff" opacity={0.55} />
          </G>
        ))}
      </Svg>
    </Box>
  );
}

// ─── ReturnBox — blue medication return drop-box ───────────────────────
export function ReturnBox({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={21}>
      <Svg viewBox="0 0 12 18" width={12 * S} height={18 * S}>
        <Ellipse cx={6.0} cy={17.0} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={1} y={2} width={10} height={9} rx={1} fill="#3B82F6" stroke={C} strokeWidth={0.5} />
        <Rect x={2.5} y={3.2} width={7} height={1.4} rx={0.6} fill="#0F1A24" />
        <Rect x={2} y={6} width={8} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={7} width={6} height={1} fill={C} opacity={0.6} />
        <Rect x={1} y={11} width={10} height={5} fill="#2563EB" stroke={C} strokeWidth={0.5} />
      </Svg>
    </Box>
  );
}

// ─── BarcodeScanner — stand-mounted barcode scanner with laser fan ─────
export function BarcodeScanner({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={1} w={10} h={12}>
      <Svg viewBox="0 0 10 12" width={10 * S} height={12 * S}>
        <Ellipse cx={5.0} cy={11.0} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 8.5 L8 8.5 L8 10.5 Q8 11 7.5 11 L2.5 11 Q2 11 2 10.5 Z" fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={5} cy={8.5} rx={3.4} ry={1.6} fill="#8A929B" stroke={C} strokeWidth={0.4} />
        <Rect x={2.6} y={2} width={4.8} height={6} rx={1.4} fill="#1F2937" stroke={C} strokeWidth={0.4} />
        <Rect x={3.4} y={2.8} width={3.2} height={2.2} rx={0.4} fill="#0B1620" />
        <Path d="M3.4 5.4 L1.2 7.4 M6.6 5.4 L8.8 7.4" stroke="#EF4444" strokeWidth={0.5} />
        <Rect x={1.2} y={7.2} width={7.6} height={0.7} fill="#FCA5A5" opacity={0.7} />
      </Svg>
    </Box>
  );
}

// ─── ATCMachine — automatic tablet counter/packager (building form) ────
export function ATCMachine({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-10} w={38} h={44}>
      <Svg viewBox="0 0 38 44" width={38 * S} height={44 * S}>
        <Ellipse cx={19.0} cy={40.6} rx={12.9} ry={4.4} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={1} width={34} height={20} rx={2} fill="#D2D6DC" stroke={C} strokeWidth={0.7} />
        <Rect x={4} y={2.5} width={30} height={1.6} fill="#E8EBEE" />
        <Rect x={4} y={1} width={30} height={2} fill="#16A34A" />
        {[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
          <Rect key={r + '-' + c} x={4.5 + c * 3.9} y={5.5 + r * 4.5} width={3.2} height={3.4} rx={0.4} fill="#B7C4CC" stroke={C} strokeWidth={0.25} />
        )))}
        <Rect x={2} y={21} width={34} height={15} rx={1.5} fill="#C0C5CB" stroke={C} strokeWidth={0.7} />
        <Rect x={24} y={23} width={10} height={7} rx={0.8} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Rect x={25} y={24.2} width={8} height={1.4} fill="#22D3EE" />
        <Rect x={25} y={26.4} width={6} height={1.4} fill="#FBBF24" />
        <Rect x={5} y={24} width={13} height={4} rx={0.6} fill="#1F2937" stroke={C} strokeWidth={0.5} />
        <Rect x={6.5} y={28} width={10} height={6} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Line x1={9.8} y1={28} x2={9.8} y2={34} stroke={C} strokeWidth={0.3} />
        <Line x1={13.2} y1={28} x2={13.2} y2={34} stroke={C} strokeWidth={0.3} />
        <Ellipse cx={6} cy={37} rx={2} ry={1.4} fill="#2C3239" />
        <Ellipse cx={32} cy={37} rx={2} ry={1.4} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

// ─── LASAShelf — high-alert look-alike/sound-alike drug shelf (w tiles) ─
export function LASAShelf({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  const caps = ['#F59E0B', '#3B82F6', '#10B981'];
  return (
    <Box x={x} y={y} offY={-8} w={W} h={24}>
      <Svg viewBox={`0 0 ${W} 24`} width={W * S} height={24 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={5} fill="#DC2626" stroke={C} strokeWidth={0.5} />
        <Rect x={0} y={5} width={W} height={19} fill="#D6CFB8" stroke={C} strokeWidth={0.5} />
        {Array.from({ length: w }).map((_, i) => (
          <G key={i}>
            <Rect x={2 + i * 16} y={8} width={12} height={13} fill="#FFF8E7" stroke={C} strokeWidth={0.4} />
            <Rect x={2 + i * 16} y={8} width={12} height={2.4} fill={caps[i % 3]} />
            <Rect x={3 + i * 16} y={12} width={10} height={1} fill={C} opacity={0.5} />
            <Rect x={3 + i * 16} y={14.5} width={7} height={1} fill={C} opacity={0.5} />
          </G>
        ))}
      </Svg>
    </Box>
  );
}

// ─── NarcoticsVault — double-locked narcotics safe (fingerprint + dial) ─
export function NarcoticsVault({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-8} w={32} h={40}>
      <Svg viewBox="0 0 32 40" width={32 * S} height={40 * S}>
        <Ellipse cx={16.0} cy={37.3} rx={10.9} ry={3.7} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={1} width={28} height={15} rx={1.5} fill="#6B7480" stroke={C} strokeWidth={0.8} />
        <Rect x={3.5} y={2.4} width={25} height={1.6} fill="#889099" />
        <Rect x={6} y={5} width={20} height={8} rx={1} fill="#5B6470" />
        <Rect x={9} y={6.5} width={14} height={2} fill="#FACC15" />
        <Path d="M2 16 L2 37 Q2 39 4 39 L28 39 Q30 39 30 37 L30 16 Z" fill="#54606C" stroke={C} strokeWidth={0.8} />
        <Line x1={2} y1={16} x2={30} y2={16} stroke={C} strokeWidth={0.6} />
        <Rect x={4.5} y={17.5} width={2} height={20} fill="#6E7A86" />
        <Rect x={19} y={20} width={8} height={8} rx={0.6} fill="#0F1A24" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={23} cy={24} rx={2.6} ry={3} fill="#7F1D1D" />
        <Ellipse cx={23} cy={24} rx={1.5} ry={1.9} fill="#EF4444" />
        <Circle cx={23} cy={33} r={3.2} fill="#1F2937" stroke={C} strokeWidth={0.6} />
        <Circle cx={23} cy={33} r={1.2} fill="#FACC15" />
        <Rect x={8} y={26} width={8} height={2.6} rx={1} fill="#374151" stroke={C} strokeWidth={0.5} />
        <Rect x={13} y={26} width={3} height={7} rx={1} fill="#374151" stroke={C} strokeWidth={0.5} />
      </Svg>
    </Box>
  );
}

// ─── BSC — biological safety cabinet (chemo compounding) ───────────────
export function BSC({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={38} h={32}>
      <Svg viewBox="0 0 38 32" width={38 * S} height={32 * S}>
        <Ellipse cx={19.0} cy={28.6} rx={12.9} ry={4.4} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={1} width={34} height={4} rx={1} fill="#6B7280" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={5} width={34} height={19} rx={1.5} fill="#C7CDD4" stroke={C} strokeWidth={0.7} />
        <Rect x={3.5} y={6.2} width={31} height={1.4} fill="#E1E5EA" />
        <Rect x={3.5} y={6.2} width={31} height={1.4} fill="#34D399" opacity={0.5} />
        <Rect x={5} y={9} width={28} height={12} rx={1} fill="#E8EEF0" stroke={C} strokeWidth={0.5} />
        <Rect x={8} y={13} width={12} height={1.8} rx={0.9} fill="#64748B" />
        <Rect x={19} y={12.6} width={2.4} height={2.6} fill="#94A3B8" />
        <Ellipse cx={26} cy={15} rx={2.6} ry={2.2} fill="#A78BFA" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={26} cy={14.4} rx={1.3} ry={1} fill="#C4B5FD" />
        <Rect x={6} y={9.6} width={10} height={1.6} fill="#fff" opacity={0.45} />
        <Rect x={2} y={24} width={34} height={4} fill="#8A929B" stroke={C} strokeWidth={0.6} />
        <Ellipse cx={6} cy={29} rx={2} ry={1.4} fill="#2C3239" />
        <Ellipse cx={32} cy={29} rx={2} ry={1.4} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

// ─── MagnehelicGauge — differential-pressure dial gauge ────────────────
export function MagnehelicGauge({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={1} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
        <Ellipse cx={6.0} cy={11.0} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={0} y={0} width={12} height={12} fill="#E5E7EB" stroke={C} strokeWidth={0.6} />
        <Circle cx={6} cy={6} r={4.6} fill="#fff" stroke={C} strokeWidth={0.5} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * 6.283;
          return <Rect key={i} x={6 + Math.cos(a) * 3.6 - 0.2} y={6 + Math.sin(a) * 3.6 - 0.2} width={0.5} height={0.5} fill={C} />;
        })}
        <Line x1={6} y1={6} x2={8.6} y2={3.8} stroke="#DC2626" strokeWidth={0.6} />
        <Circle cx={6} cy={6} r={0.7} fill={C} />
        <Rect x={3.5} y={9.5} width={5} height={1.4} fill="#16A34A" />
      </Svg>
    </Box>
  );
}

// ─── ChemoSpillKit — yellow hazardous-spill response bag ───────────────
export function ChemoSpillKit({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={1} w={12} h={12}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={12 * S}>
        <Ellipse cx={6.0} cy={11.0} rx={4.1} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M4 2 Q6 0 8 2" fill="none" stroke={C} strokeWidth={0.7} />
        <Rect x={1} y={2.5} width={10} height={8.5} rx={1.5} fill="#FACC15" stroke={C} strokeWidth={0.6} />
        <Rect x={1.5} y={3} width={2} height={7.5} fill="#FDE68A" />
        <Path d="M6 4 L8 6 L6 8 L4 6 Z" fill="#fff" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── TackyMat — sticky floor mat at the cleanroom entry (w tiles) ──────
export function TackyMat({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} w={W} h={16}>
      <Svg viewBox={`0 0 ${W} 16`} width={W * S} height={16 * S} preserveAspectRatio="none">
        <Rect x={1} y={2} width={W - 2} height={12} fill="#7DC0D8" stroke={C} strokeWidth={0.5} opacity={0.75} />
        <Rect x={1} y={2} width={W - 2} height={12} fill="none" stroke="#fff" strokeWidth={0.4} strokeDasharray="2 2" opacity={0.6} />
      </Svg>
    </Box>
  );
}

// ─── MedWallShelf — white medication shelving, bottles/boxes (w tiles) ─
export function MedWallShelf({ x, y, w = 4, shelves = 5 }: { x: number; y: number; w?: number; shelves?: number }) {
  const W = w * 16;
  const pillCols = ['#FFFDF5', '#FDE9C8', '#E6F0D8', '#D8E8F0', '#F6DCE0', '#EDE4D2', '#FFFFFF', '#E0DCCE', '#F2E6C8', '#DCE8E2'];
  const capCols = ['#DC2626', '#2563EB', '#16A34A', '#F59E0B', '#7C3AED', '#0EA5A0', '#475569', '#DB2777'];
  const rowEls: ReactElement[] = [];
  for (let s = 0; s < shelves; s++) {
    const shelfTop = 2 + s * ((24 - 2) / shelves);
    const slotH = (24 - 2) / shelves;
    const items: ReactElement[] = [];
    let cx = 1.2;
    let i = 0;
    while (cx < W - 2.4) {
      const bw = 2.2 + ((i * 7) % 3) * 0.7;
      const bh = slotH - 1.6 - (i % 2) * 1.2;
      const isBox = i % 4 === 3;
      const by = shelfTop + (slotH - 1.4) - bh;
      const fill = pillCols[(i + s * 3) % pillCols.length];
      items.push(
        <G key={s + '-' + i}>
          <Rect x={cx} y={by} width={bw} height={bh} fill={fill} stroke={C} strokeWidth={0.3} />
          {isBox ? (
            <Rect x={cx + 0.4} y={by + 0.6} width={bw - 0.8} height={1} fill={capCols[(i + s) % capCols.length]} opacity={0.75} />
          ) : (
            <>
              <Rect x={cx + 0.4} y={by} width={bw - 0.8} height={1.1} fill={capCols[(i + s) % capCols.length]} />
              <Rect x={cx + 0.5} y={by + 1.6} width={bw - 1} height={1.2} fill="#fff" opacity={0.8} />
            </>
          )}
        </G>,
      );
      cx += bw + 0.5;
      i++;
    }
    rowEls.push(
      <G key={'shelf' + s}>
        {items}
        <Rect x={0.5} y={shelfTop + slotH - 1.4} width={W - 1} height={1.4} fill="#E8E5DB" stroke={C} strokeWidth={0.4} />
        <Rect x={0.5} y={shelfTop + slotH - 1.4} width={W - 1} height={0.5} fill="#FAF8F2" />
      </G>,
    );
  }
  return (
    <Box x={x} y={y} offY={-4} w={W} h={26} z={1}>
      <Svg viewBox={`0 0 ${W} 26`} width={W * S} height={26 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={26} fill="#EFEDE4" stroke={C} strokeWidth={0.7} />
        <Rect x={0} y={0} width={W} height={2} fill="#FAF8F2" />
        <Rect x={0} y={0} width={1} height={26} fill="#D7D3C6" />
        <Rect x={W - 1} y={0} width={1} height={26} fill="#D7D3C6" />
        {rowEls}
      </Svg>
    </Box>
  );
}

const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
const str = (v: unknown, d: string) => (typeof v === 'string' ? v : d);

export function PharmaObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'pharmacounter': return <PharmaCounter x={x} y={y} w={num(props?.w, 11)} />;
    case 'countersign': return <CounterSign x={x} y={y} text={str(props?.text, '')} color={str(props?.color, '#10B981')} />;
    case 'shelflabel': return <ShelfLabel x={x} y={y} text={str(props?.text, '')} warn={!!props?.warn} />;
    case 'floortape': return <FloorTape x={x} y={y} w={num(props?.w, 12)} text={str(props?.text, '')} />;
    case 'wallphone': return <WallPhone x={x} y={y} ringing={!!props?.ringing} />;
    case 'fridgepharma': return <FridgePharma x={x} y={y} />;
    case 'medcart': return <MedCart x={x} y={y} />;
    case 'centrifuge': return <Centrifuge x={x} y={y} />;
    case 'printlabel': return <PrintLabel x={x} y={y} />;
    case 'pneumatictube': return <PneumaticTube x={x} y={y} />;
    case 'tubecapsulerack': return <TubeCapsuleRack x={x} y={y} />;
    case 'returnbox': return <ReturnBox x={x} y={y} />;
    case 'barcodescanner': return <BarcodeScanner x={x} y={y} />;
    case 'atcmachine': return <ATCMachine x={x} y={y} />;
    case 'lasashelf': return <LASAShelf x={x} y={y} w={num(props?.w, 3)} />;
    case 'narcoticsvault': return <NarcoticsVault x={x} y={y} />;
    case 'bsc': return <BSC x={x} y={y} />;
    case 'magnehelicgauge': return <MagnehelicGauge x={x} y={y} />;
    case 'chemospillkit': return <ChemoSpillKit x={x} y={y} />;
    case 'tackymat': return <TackyMat x={x} y={y} w={num(props?.w, 2)} />;
    case 'medwallshelf': return <MedWallShelf x={x} y={y} w={num(props?.w, 4)} shelves={num(props?.shelves, 5)} />;
    default: return null;
  }
}
