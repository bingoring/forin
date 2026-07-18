// NICU objects — RN-svg ports of interior-objects-nicu2.jsx: enclosed isolette
// incubators, giraffe warmer beds, nasal-CPAP, overhead phototherapy LED. Distinct
// from the open Nursery. Authored at ITILE=16, rendered at TILE px via S; Box maps
// handoff x*ITILE / top-N offsets 1:1. v13+ 2.5D ground shadow. SVG <text> (temp/
// humidity) → shape blocks. Dispatched via NicuObjectView; reused pieces
// (bankofmonitors/milkfridge/nursingrecliner/gownbox/handsanitizer/scrubdispenser/
// sinkor/crashcart/deskphone/nursestation/imonitor/iplant/glass/tint) resolve on
// the shared chain.
import { type ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;

function Box({ x, y, offX = 0, offY = 0, w, h, z, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; z?: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S, zIndex: z }}>{children}</View>
  );
}

// ─── NICUIsolette — 폐쇄형 신생아 인큐베이터 (온·습도 표시 + 포트홀) ──
export function NICUIsolette({ x, y, occupied = true }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} offY={-4} w={38} h={38}>
      <Svg viewBox="0 0 38 38" width={38 * S} height={38 * S}>
        <Ellipse cx={19} cy={36.5} rx={15} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Path d="M3 20 L35 20 L35 32 Q35 33 34 33 L4 33 Q3 33 3 32 Z" fill="#7FB8C8" stroke={C} strokeWidth={0.7} />
        <Rect x={3} y={20} width={32} height={2} fill="#A7D2DE" />
        <Rect x={6} y={24} width={12} height={6} rx={0.6} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Rect x={8} y={25} width={4} height={1.8} fill="#FBBF24" />
        <Rect x={8} y={27.6} width={3.2} height={1.6} fill="#22D3EE" />
        <Circle cx={24} cy={26} r={1.8} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Circle cx={29} cy={26} r={1.8} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Rect x={5} y={8} width={28} height={14} rx={4} fill="#DDEFF5" fillOpacity={0.82} stroke={C} strokeWidth={0.6} />
        <Rect x={7} y={10} width={24} height={9} rx={3} fill="#C4E2EC" fillOpacity={0.8} />
        <Path d="M8 10.5 L16 10.5 L10 20.5 L8 20.5 Z" fill="#FFFFFF" opacity={0.28} />
        <Circle cx={13} cy={20} r={2.6} fill="#BFE0EA" stroke={C} strokeWidth={0.5} />
        <Circle cx={25} cy={20} r={2.6} fill="#BFE0EA" stroke={C} strokeWidth={0.5} />
        {occupied && (
          <G>
            <Ellipse cx={19} cy={14} rx={6} ry={3} fill="#FBE3EE" />
            <Circle cx={14} cy={14} r={1.7} fill="#FBD9C0" stroke={C} strokeWidth={0.3} />
          </G>
        )}
      </Svg>
    </Box>
  );
}

// ─── GiraffeWarmer — 개방·폐쇄 겸용 신생아 워머 (승강 후드 기둥) ──────
export function GiraffeWarmer({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-14} w={32} h={48}>
      <Svg viewBox="0 0 32 48" width={32 * S} height={48 * S}>
        <Ellipse cx={16} cy={42} rx={12} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Rect x={14.5} y={0} width={3} height={10} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={7} y={9} width={18} height={4} rx={1} fill="#5B6672" stroke={C} strokeWidth={0.5} />
        <Rect x={9} y={11.5} width={14} height={1.4} fill="#F59E0B" />
        <Path d="M9 13 L7 21 M16 13 L16 21 M23 13 L25 21" stroke="#FBBF24" strokeWidth={0.5} opacity={0.45} />
        <Path d="M4 21 L28 21 L28 30 Q28 31 27 31 L5 31 Q4 31 4 30 Z" fill="#DDEFF5" fillOpacity={0.9} stroke={C} strokeWidth={0.6} />
        <Rect x={6} y={22} width={20} height={7} rx={2} fill="#FDE4EE" />
        <Ellipse cx={16} cy={25.5} rx={5} ry={2.4} fill="#FFF3F7" />
        <Circle cx={12} cy={25.5} r={1.6} fill="#FBD9C0" stroke={C} strokeWidth={0.3} />
        <Path d="M10 31 L22 31 L22 39 Q22 40 21 40 L11 40 Q10 40 10 39 Z" fill="#B7BEC6" stroke={C} strokeWidth={0.5} />
        <Rect x={11} y={33} width={10} height={3} fill="#0F1A24" />
        <Rect x={12} y={33.6} width={4} height={1} fill="#A7F3D0" />
        <Ellipse cx={9} cy={41} rx={2} ry={1.4} fill={C} />
        <Ellipse cx={23} cy={41} rx={2} ry={1.4} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── CPAPUnit — 신생아 비강 CPAP (가습 챔버 + 가열 회로) ──────────────
export function CPAPUnit({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-14} w={18} h={42}>
      <Svg viewBox="0 0 18 42" width={18 * S} height={42 * S}>
        <Ellipse cx={9} cy={40.5} rx={6} ry={1.7} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={4} width={14} height={10} rx={1} fill="#475569" stroke={C} strokeWidth={0.5} />
        <Rect x={3.5} y={5.5} width={11} height={7} fill="#0B1A22" />
        <Path d="M4.5 9 Q7 7.5 9.5 9 T14 9" fill="none" stroke="#22D3EE" strokeWidth={0.6} />
        <Rect x={4} y={15} width={10} height={5} rx={1} fill="#BFE3EE" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={17.5} width={10} height={2.5} fill="#9FD0E4" />
        <Path d="M14 12 Q19 16 15 22" fill="none" stroke="#D4E8F0" strokeWidth={1.4} />
        <Rect x={8} y={20} width={2} height={16} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={9} cy={37} rx={5} ry={1.7} fill="#6B7280" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── PhototherapyLED — 신생아 황달 LED 광선판 (인큐 위 청색광) ────────
export function PhototherapyLED({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  const n = Math.max(3, w * 2);
  return (
    <Box x={x} y={y} offY={-6} w={vw} h={18} z={1}>
      <Svg viewBox={`0 0 ${vw} 18`} width={vw * S} height={18 * S} preserveAspectRatio="none">
        <Rect x={vw / 2 - 1} y={0} width={2} height={3} fill="#9CA3AF" />
        <Rect x={2} y={3} width={vw - 4} height={5} rx={1} fill="#475569" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={7} width={vw - 6} height={2.4} fill="#3B82F6" />
        {[...Array(n)].map((_, i) => (
          <Rect key={i} x={4 + i * ((vw - 8) / n)} y={7.4} width={2} height={1.8} fill="#7DD3FC" />
        ))}
        <Rect x={1} y={9.4} width={vw - 2} height={7} fill="#60A5FA" opacity={0.3} />
      </Svg>
    </Box>
  );
}

export function NicuObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  switch (type) {
    case 'nicuisolette': return <NICUIsolette x={x} y={y} occupied={props?.occupied !== false} />;
    case 'giraffewarmer': return <GiraffeWarmer x={x} y={y} />;
    case 'cpapunit': return <CPAPUnit x={x} y={y} />;
    case 'phototherapyled': return <PhototherapyLED x={x} y={y} w={num(props?.w, 2)} />;
    default: return null;
  }
}
