// Hospice / Palliative objects — RN-svg ports of interior-objects-hospice2.jsx:
// warm home-like HospiceBed, ComfortCart (aroma diffuser + teapot), SyringeDriver
// (continuous SC pain pump) + ADLKitchen (from rehab2, a training kitchen used by
// both hospice and rehab). ReclinerDaybed lives in picuEquipment and resolves on the
// shared chain. Authored at ITILE=16, rendered at TILE px via S; Box maps handoff
// x*ITILE / top-N offsets 1:1. v13+ 2.5D ground shadow. Dispatched via
// HospiceObjectView; reused pieces resolve on the shared chain.
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

// ─── HospiceBed — 완화의료 침대 (원목 헤드보드 + 패턴 퀼트) ─────────────
export function HospiceBed({ x, y, occupied }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} offY={-4} w={40} h={52}>
      <Svg viewBox="0 0 40 52" width={40 * S} height={52 * S}>
        <Ellipse cx={20} cy={49} rx={17} ry={2.4} fill="rgba(0,0,0,0.16)" />
        <Path d="M3 3 L37 3 L37 11 L3 11 Z" fill="#C99F68" stroke={C} strokeWidth={0.7} />
        <Rect x={4} y={4} width={32} height={1.6} fill="#DBB884" />
        <Rect x={9} y={4.5} width={1} height={6} fill="#B0854E" />
        <Rect x={20} y={4.5} width={1} height={6} fill="#B0854E" />
        <Rect x={31} y={4.5} width={1} height={6} fill="#B0854E" />
        <Path d="M3 11 L37 11 L37 44 Q37 46 35 46 L5 46 Q3 46 3 44 Z" fill="#E4DAC8" stroke={C} strokeWidth={0.7} />
        <Rect x={6} y={13} width={12} height={8} rx={3} fill="#FBFAF4" stroke={C} strokeWidth={0.4} />
        <Rect x={22} y={13} width={12} height={8} rx={3} fill="#FBFAF4" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={23} width={32} height={20} rx={1.5} fill="#B7C9A8" />
        <Path d="M4 30 L36 30 M4 37 L36 37" stroke="#9DB08C" strokeWidth={0.6} />
        <Path d="M13 23 L13 43 M22 23 L22 43 M31 23 L31 43" stroke="#9DB08C" strokeWidth={0.5} opacity={0.6} />
        {occupied && (
          <G>
            <Rect x={16} y={14.5} width={6.5} height={5.5} rx={2.4} fill="#FBD9C0" stroke={C} strokeWidth={0.3} />
            <Rect x={16.4} y={13.6} width={5.7} height={1.5} fill="#8A8A8A" />
            <Ellipse cx={20} cy={32} rx={10} ry={6.5} fill="#A8BE97" opacity={0.5} />
          </G>
        )}
        <Line x1={3} y1={44} x2={37} y2={44} stroke={C} strokeWidth={0.5} />
        <Rect x={4} y={46} width={3} height={3} fill="#A57C44" />
        <Rect x={33} y={46} width={3} height={3} fill="#A57C44" />
      </Svg>
    </Box>
  );
}

// ─── ComfortCart — 아로마·음악 완화 케어 카트 (디퓨저·티포트) ───────────
export function ComfortCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={24} h={30}>
      <Svg viewBox="0 0 24 30" width={24 * S} height={30 * S}>
        <Ellipse cx={12} cy={28.5} rx={8} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 8 L22 8 L22 25 Q22 26 21 26 L3 26 Q2 26 2 25 Z" fill="#B8A98E" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={8} width={20} height={4} fill="#CCBE9E" />
        <Rect x={5} y={4} width={4} height={4.5} rx={1.5} fill="#DCE8DE" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={7} cy={3} rx={1.6} ry={1} fill="#CFE6EE" opacity={0.7} />
        <Path d="M13 5 L18 5 L17 8.5 L14 8.5 Z" fill="#E4B7A0" stroke={C} strokeWidth={0.4} />
        <Rect x={15} y={3.5} width={1.4} height={1.8} fill="#E4B7A0" />
        <Line x1={2} y1={12} x2={22} y2={12} stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={14} width={16} height={4} rx={0.5} fill="#E0D6BE" stroke={C} strokeWidth={0.4} />
        <Rect x={10} y={15.5} width={4} height={1} fill="#9C8F70" />
        <Rect x={4} y={19.5} width={16} height={4} rx={0.5} fill="#E0D6BE" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={5} cy={27.5} rx={1.6} ry={1.2} fill={C} />
        <Ellipse cx={19} cy={27.5} rx={1.6} ry={1.2} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── SyringeDriver — 지속 피하주입 통증펌프 (소형, 폴대 거치) ───────────
export function SyringeDriver({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-16} w={14} h={42}>
      <Svg viewBox="0 0 14 42" width={14 * S} height={42 * S}>
        <Ellipse cx={7} cy={40.5} rx={5} ry={1.7} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={6} width={10} height={8} rx={1} fill="#5B6672" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={7} width={8} height={3} fill="#0F1A24" />
        <Rect x={3.6} y={7.8} width={5} height={1} fill="#A7F3D0" />
        <Rect x={1} y={11} width={11} height={2} rx={1} fill="#E5E7EB" stroke={C} strokeWidth={0.3} />
        <Rect x={1.5} y={11.4} width={6} height={1.2} fill="#CFE6EE" />
        <Rect x={6} y={14} width={2} height={22} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={7} cy={37} rx={5} ry={1.7} fill="#6B7280" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── ADLKitchen — 일상생활 훈련 주방 (재활/호스피스 공용, from rehab2) ──
export function ADLKitchen({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  return (
    <Box x={x} y={y} offY={-4} w={vw} h={30}>
      <Svg viewBox={`0 0 ${vw} 30`} width={vw * S} height={30 * S} preserveAspectRatio="none">
        <Ellipse cx={vw / 2} cy={28} rx={w * 7} ry={2} fill="rgba(0,0,0,0.14)" />
        <Path d={`M2 8 L${vw - 2} 8 L${vw - 2} 25 Q${vw - 2} 26 ${vw - 3} 26 L3 26 Q2 26 2 25 Z`} fill="#CBBFA6" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={8} width={vw - 4} height={5} fill="#E0D6BE" />
        <Rect x={6} y={9} width={8} height={3} rx={0.6} fill="#B7BEC6" stroke={C} strokeWidth={0.4} />
        <Rect x={9} y={8} width={1.4} height={2} fill="#9CA3AF" />
        <Circle cx={vw - 8} cy={10.5} r={1.8} fill="#5B6672" />
        <Circle cx={vw - 13} cy={10.5} r={1.8} fill="#5B6672" />
        <Line x1={vw / 2} y1={13} x2={vw / 2} y2={25} stroke={C} strokeWidth={0.4} opacity={0.5} />
        <Rect x={5} y={17} width={3} height={1} fill="#9AA1A8" />
        <Rect x={vw - 8} y={17} width={3} height={1} fill="#9AA1A8" />
      </Svg>
    </Box>
  );
}

export function HospiceObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  switch (type) {
    case 'hospicebed': return <HospiceBed x={x} y={y} occupied={props?.occupied === true} />;
    case 'comfortcart': return <ComfortCart x={x} y={y} />;
    case 'syringedriver': return <SyringeDriver x={x} y={y} />;
    case 'adlkitchen': return <ADLKitchen x={x} y={y} w={num(props?.w, 3)} />;
    default: return null;
  }
}
