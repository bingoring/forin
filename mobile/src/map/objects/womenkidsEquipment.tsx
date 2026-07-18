// Women & Kids Outpatient (여성소아 1F OPD) objects — the blueprint reuses peds
// toys + clinic + shared pieces, so the only new port is FetalMonitor (from
// interior-objects-ld2.jsx: the OB/GYN cardiotocograph cart). Authored at
// ITILE=16, rendered at TILE px via S; Box maps the handoff x*ITILE / top-N
// offsets 1:1. v13+ 2.5D ground shadow. SVG <text> (FHR "142") → shape. Dispatched
// via WomenKidsObjectView; every other object resolves on the shared chain
// (clinicReception/babyscale/stadiometer/watercooler/smallslide/rockinghorse/
// toychest/blocks/mural/tonguejar/stickerroll/ultrasound/playmat/ibed/…).
import { type ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;

function Box({ x, y, offX = 0, offY = 0, w, h, z, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; z?: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S, zIndex: z }}>{children}</View>
  );
}

// ─── FetalMonitor — 태아 심박·자궁수축 감시 카트 (CTG, 이중 파형 + 트랜스듀서) ─
export function FetalMonitor({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-8} w={22} h={36}>
      <Svg viewBox="0 0 22 36" width={22 * S} height={36 * S}>
        <Ellipse cx={11} cy={31.5} rx={8} ry={2.4} fill="rgba(0,0,0,0.16)" />
        <Path d="M3 12 L19 12 L19 30 Q19 31 18 31 L4 31 Q3 31 3 30 Z" fill="#8E99A4" stroke={C} strokeWidth={0.6} />
        <Rect x={3} y={9} width={16} height={3.5} fill="#AEB6BE" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={1} width={18} height={11} rx={1} fill="#111827" stroke={C} strokeWidth={0.6} />
        <Rect x={3.2} y={2.2} width={15.6} height={8.6} fill="#0B1A22" />
        <Path d="M4 5 Q7 3.5 10 5 T16 5" fill="none" stroke="#F472B6" strokeWidth={0.6} />
        <Path d="M4 8.4 Q7 7.4 10 8.4 T16 8.4" fill="none" stroke="#22D3EE" strokeWidth={0.6} />
        <Rect x={15.4} y={2.6} width={3} height={1.8} rx={0.3} fill="#F9A8D4" />
        <Circle cx={7} cy={15} r={2.2} fill="#E5E7EB" stroke={C} strokeWidth={0.4} />
        <Circle cx={13} cy={15} r={2.2} fill="#F9C9D6" stroke={C} strokeWidth={0.4} />
        <Circle cx={6} cy={26} r={1.6} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Rect x={10} y={24.5} width={7} height={3} fill="#fff" stroke={C} strokeWidth={0.4} />
        <Line x1={10} y1={26} x2={17} y2={26} stroke={C} strokeWidth={0.2} />
      </Svg>
    </Box>
  );
}

export function WomenKidsObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y } = object;
  switch (type) {
    case 'fetalmonitor': return <FetalMonitor x={x} y={y} />;
    default: return null;
  }
}
