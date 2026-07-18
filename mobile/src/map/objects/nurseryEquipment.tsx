// Well-Baby Nursery objects — faithful RN-svg ports of the handoff. Four pieces
// come from interior-objects-ld2.jsx (nursery reuses the L&D catalog: Bassinet /
// InfantWarmer / NursingRecliner / WarmerCabinet); ObsWindow is lifted from
// interior-objects-psych2.jsx (the family viewing window). Authored at ITILE=16,
// rendered at TILE px via S; Box maps the handoff x*ITILE / top-N offsets 1:1.
// v13+ 2.5D: floor objects carry a ground-contact ellipse shadow. Dispatched via
// NurseryObjectView. Cross-dept reused pieces (sinkor/scrubdispenser/gownbox/
// babyscale/phototherapylamp/milkfridge/compcart/sofa/coffeetable/ireception/
// ichair/icurtain/iplant/baylabel) resolve on the shared dispatch chain.
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

// ─── InfantWarmer — 신생아 개방형 워머 (복사 히터 + 배시넷 트레이) ──────
export function InfantWarmer({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-12} w={28} h={44}>
      <Svg viewBox="0 0 28 44" width={28 * S} height={44 * S}>
        <Ellipse cx={14} cy={42.5} rx={10} ry={2.4} fill="rgba(0,0,0,0.16)" />
        <Rect x={12.5} y={0} width={3} height={9} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={6} y={8} width={16} height={4} rx={1} fill="#5B6672" stroke={C} strokeWidth={0.5} />
        <Rect x={8} y={10.5} width={12} height={1.4} fill="#F59E0B" />
        <Path d="M8 12 L6 20 M14 12 L14 20 M20 12 L22 20" stroke="#FBBF24" strokeWidth={0.5} opacity={0.5} />
        <Path d="M4 20 L24 20 L24 30 Q24 31.5 22.5 31.5 L5.5 31.5 Q4 31.5 4 30 Z" fill="#F7C9D9" stroke={C} strokeWidth={0.6} />
        <Rect x={5.5} y={21} width={17} height={7} rx={2} fill="#FDE4EE" />
        <Ellipse cx={14} cy={24.5} rx={5} ry={2.6} fill="#FFF3F7" />
        <Circle cx={10.5} cy={24.5} r={1.6} fill="#FBD9C0" stroke={C} strokeWidth={0.3} />
        <Line x1={4} y1={20} x2={24} y2={20} stroke={C} strokeWidth={0.5} />
        <Rect x={10} y={31.5} width={8} height={8} fill="#B7BEC6" stroke={C} strokeWidth={0.5} />
        <Rect x={11} y={33} width={6} height={2.5} fill="#0F1A24" />
        <Ellipse cx={8} cy={40} rx={2} ry={1.4} fill={C} />
        <Ellipse cx={20} cy={40} rx={2} ry={1.4} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── Bassinet — 신생아 이동 카트형 아기 침대 (투명 아크릴 통) ──────────
export function Bassinet({ x, y, tag }: { x: number; y: number; tag?: string }) {
  return (
    <Box x={x} y={y} offY={-2} w={24} h={32}>
      <Svg viewBox="0 0 24 32" width={24 * S} height={32 * S}>
        <Ellipse cx={12} cy={30.5} rx={8} ry={2.2} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={12} cy={8} rx={10} ry={4.4} fill="#DDEFF5" fillOpacity={0.85} stroke={C} strokeWidth={0.6} />
        <Ellipse cx={12} cy={7.4} rx={7.6} ry={3} fill="#EAF6FA" />
        <Ellipse cx={12} cy={8} rx={5} ry={2.2} fill="#FFF3F7" />
        <Circle cx={8.5} cy={8} r={1.5} fill="#FBD9C0" stroke={C} strokeWidth={0.3} />
        <Path d="M2 8 L2 15 Q2 17 4 17 L20 17 Q22 17 22 15 L22 8" fill="#CFE6EE" fillOpacity={0.5} stroke={C} strokeWidth={0.5} />
        <Rect x={8} y={12} width={8} height={3} rx={0.5} fill={tag === 'boy' ? '#BFE0EA' : '#F9C9D6'} stroke={C} strokeWidth={0.3} />
        <Rect x={4} y={17} width={16} height={9} fill="#B7BEC6" stroke={C} strokeWidth={0.5} />
        <Rect x={5.5} y={19} width={13} height={4} fill="#CBD5E1" />
        <Ellipse cx={7} cy={28} rx={2} ry={1.4} fill={C} />
        <Ellipse cx={17} cy={28} rx={2} ry={1.4} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── NursingRecliner — 수유용 리클라이너 (C자 수유 쿠션) ───────────────
export function NursingRecliner({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={26} h={30}>
      <Svg viewBox="0 0 26 30" width={26 * S} height={30 * S}>
        <Ellipse cx={13} cy={25.8} rx={9.5} ry={2.4} fill="rgba(0,0,0,0.16)" />
        <Path d="M4 12 L22 12 L23 24 Q23 25 22 25 L4 25 Q3 25 3 24 Z" fill="#8FB5A0" stroke={C} strokeWidth={0.6} />
        <Path d="M5 13 L21 13 L21.6 22 L4.4 22 Z" fill="#A7D0BC" />
        <Path d="M4 3 L22 3 L22 12 L4 12 Z" fill="#8FB5A0" stroke={C} strokeWidth={0.6} />
        <Rect x={5.5} y={4.5} width={15} height={6} rx={2} fill="#A7D0BC" />
        <Rect x={2} y={12} width={3} height={10} rx={1} fill="#7BA491" stroke={C} strokeWidth={0.4} />
        <Rect x={21} y={12} width={3} height={10} rx={1} fill="#7BA491" stroke={C} strokeWidth={0.4} />
        <Path d="M8 18 Q13 14 18 18 Q18 21 15 20 Q13 18 11 20 Q8 21 8 18 Z" fill="#FDE4EE" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── WarmerCabinet — 보온 담요/수액 캐비닛 (유리문 벽 부착) ────────────
export function WarmerCabinet({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={1} w={14} h={22}>
      <Svg viewBox="0 0 14 22" width={14 * S} height={22 * S}>
        <Ellipse cx={7} cy={20.5} rx={5} ry={1.6} fill="rgba(0,0,0,0.14)" />
        <Path d="M1 3 L13 3 L13 19 Q13 20 12 20 L2 20 Q1 20 1 19 Z" fill="#CF9E6E" stroke={C} strokeWidth={0.6} />
        <Rect x={1} y={1} width={12} height={2.4} fill="#B98A5A" />
        <Rect x={2} y={4.5} width={10} height={13.5} rx={0.6} fill="#E8D2B0" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={6} width={8} height={2.4} fill="#F2E0C4" stroke={C} strokeWidth={0.25} />
        <Rect x={3} y={9} width={8} height={2.4} fill="#F2E0C4" stroke={C} strokeWidth={0.25} />
        <Rect x={3} y={12} width={8} height={2.4} fill="#F2E0C4" stroke={C} strokeWidth={0.25} />
        <Rect x={8.5} y={1.2} width={4} height={1.4} fill="#0B2A1A" />
        <Rect x={8.6} y={1.5} width={2.4} height={0.8} fill="#F59E0B" />
        <Rect x={10.6} y={10} width={1} height={4} fill="#8A6A40" />
      </Svg>
    </Box>
  );
}

// ─── ObsWindow — 가족 면회 관람창 (안전유리 + 멀리언), from psych2 ──────
export function ObsWindow({ x, y, w = 4 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  return (
    <Box x={x} y={y} offY={-6} w={vw} h={26} z={3}>
      <Svg viewBox={`0 0 ${vw} 26`} width={vw * S} height={26 * S} preserveAspectRatio="none">
        <Rect x={0} y={16} width={vw} height={9} fill="#8E99A4" stroke={C} strokeWidth={0.5} />
        <Rect x={0} y={16} width={vw} height={2} fill="#AEB6BE" />
        <Rect x={1} y={1} width={vw - 2} height={15} fill="#CFE6EE" fillOpacity={0.5} stroke={C} strokeWidth={0.7} />
        {[...Array(w)].map((_, i) => {
          const lx = (i + 1) * (vw / (w + 1));
          return <Line key={i} x1={lx} y1={1} x2={lx} y2={16} stroke={C} strokeWidth={0.5} opacity={0.5} />;
        })}
        <Rect x={2} y={2.5} width={w * 5} height={3} fill="#FFFFFF" opacity={0.35} />
      </Svg>
    </Box>
  );
}

export function NurseryObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  switch (type) {
    case 'infantwarmer': return <InfantWarmer x={x} y={y} />;
    case 'bassinet': return <Bassinet x={x} y={y} tag={typeof props?.tag === 'string' ? props.tag : undefined} />;
    case 'nursingrecliner': return <NursingRecliner x={x} y={y} />;
    case 'warmercabinet': return <WarmerCabinet x={x} y={y} />;
    case 'obswindow': return <ObsWindow x={x} y={y} w={num(props?.w, 4)} />;
    default: return null;
  }
}
