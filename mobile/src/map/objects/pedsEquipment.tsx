// Pediatrics & Neonatal Center objects — faithful RN-svg ports of the handoff
// interior-objects-peds2.jsx catalog plus the play-area objects from
// interior-peds.jsx (SmallSlide, RockingHorse, ToyChest, Blocks, Mural,
// Balloon). Authored at ITILE=16, rendered at TILE px via S. `<text>` glyphs are
// replaced by shape equivalents. Div-based objects (Blocks, Mural) are recreated
// with nested absolute <View>s. Dispatched via PedsObjectView.
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

// ─── Incubator / Isolette — 신생아 인큐베이터 (온도·습도 표시) ───────
export function Incubator({ x, y, occupied = true }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} offY={-8} w={36} h={42}>
      <Svg viewBox="0 0 36 42" width={36 * S} height={42 * S}>
        <Ellipse cx={18.0} cy={38.9} rx={12.2} ry={4.1} fill="rgba(0,0,0,0.16)" />
        {/* base cabinet drawn FIRST (behind), then the hood in front */}
        <Path d="M3 29 L33 29 L33 32.5 Q33 33.1 32.4 33.1 L3.6 33.1 Q3 33.1 3 32.5 Z" fill="#5F94A4" />
        <Path d="M3 19 L33 19 Q34 19 34 20 L34 28 Q34 29 33 29 L3 29 Q2 29 2 28 L2 20 Q2 19 3 19 Z" fill="#7FB8C8" />
        <Rect x={4} y={20.2} width={28} height={1.4} fill="#9CC8D4" />
        <Line x1={3} y1={29} x2={33} y2={29} stroke={C} strokeWidth={0.5} />
        {/* control cluster on the viewer-facing FRONT band */}
        <Rect x={4.5} y={29.4} width={12} height={3.2} rx={0.5} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        {/* "36.5°" (amber) readout block */}
        <Rect x={5} y={30.4} width={5.2} height={1.6} fill="#FBBF24" />
        {/* "60%" (cyan) readout block */}
        <Rect x={11.5} y={30.4} width={3.4} height={1.6} fill="#22D3EE" />
        <Circle cx={21} cy={31} r={1.4} fill="#CBD5E1" stroke={C} strokeWidth={0.35} />
        <Circle cx={24.6} cy={31} r={1.4} fill="#CBD5E1" stroke={C} strokeWidth={0.35} />
        <Rect x={27.5} y={29.6} width={4} height={2.8} rx={0.4} fill="#475569" />
        {/* base silhouette outline (top + front, continuous) */}
        <Path d="M3 19 L33 19 Q34 19 34 20 L34 32.5 Q34 33.1 33.4 33.1 L3.6 33.1 Q3 33.1 3 32.5 L2.9 20 Q2.9 19 3 19 Z" fill="none" stroke={C} strokeWidth={0.6} />
        {/* column + wheeled base */}
        <Rect x={16.5} y={33.1} width={3} height={3.4} fill="#C6CBD1" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={18} cy={38} rx={12} ry={2.6} fill="#D7DBDF" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={8} cy={40} rx={2.2} ry={1.6} fill={C} />
        <Ellipse cx={28} cy={40} rx={2.2} ry={1.6} fill={C} />
        {/* clear acrylic hood IN FRONT, slightly transparent */}
        <G opacity={0.9}>
          <Rect x={3} y={12} width={30} height={16} rx={4} fill="#DDEFF5" fillOpacity={0.82} stroke={C} strokeWidth={0.6} />
          <Rect x={5.5} y={14} width={25} height={12} rx={3} fill="#C4E2EC" fillOpacity={0.8} />
          <Path d="M6 14.5 L15 14.5 L9 25.5 L6 25.5 Z" fill="#FFFFFF" opacity={0.28} />
          <Circle cx={11} cy={26} r={2.4} fill="#AFD3DE" stroke={C} strokeWidth={0.5} />
          <Circle cx={25} cy={26} r={2.4} fill="#AFD3DE" stroke={C} strokeWidth={0.5} />
          {occupied && (
            <G>
              <Ellipse cx={18} cy={20} rx={7} ry={3.4} fill="#FBE3EE" />
              <Circle cx={12.5} cy={20} r={2} fill="#FBD9C0" stroke={C} strokeWidth={0.3} />
              <Path d="M11 18.8 Q12.5 17.8 14 18.8" fill="none" stroke="#7C5230" strokeWidth={0.7} />
            </G>
          )}
        </G>
      </Svg>
    </Box>
  );
}

// ─── PhototherapyLamp — 황달 광선치료기 (청색광) ───────────────────
export function PhototherapyLamp({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  const count = Math.max(4, w * 3);
  return (
    <Box x={x} y={y} offY={-8} w={W} h={30}>
      <Svg viewBox={`0 0 ${W} 30`} width={W * S} height={30 * S} preserveAspectRatio="none">
        {/* blue light beam cast down onto the incubator */}
        <Path d={`M ${w * 4} 20 L ${w * 12} 20 L ${w * 14} 29 L ${w * 2} 29 Z`} fill="#60A5FA" opacity={0.28} />
        {/* arm from ceiling */}
        <Rect x={w * 8 - 1.5} y={0} width={3} height={3.5} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        {/* LIT UNDERSIDE (tilted toward us) with blue LED array */}
        <Path d={`M2 8 L ${w * 16 - 2} 8 L ${w * 16 - 2} 13 L2 13 Z`} fill="#2C4A6E" />
        <Ellipse cx={w * 8} cy={13} rx={w * 8 - 2} ry={3.4} fill="#1E3A5F" stroke={C} strokeWidth={0.5} />
        {[...Array(count)].map((_, i) => (
          <Ellipse key={i} cx={4 + i * ((w * 16 - 8) / (w * 3 - 1))} cy={12.5} rx={1.6} ry={1.1} fill="#7DD3FC" />
        ))}
        {/* TOP housing (clean, dominant) */}
        <Ellipse cx={w * 8} cy={7} rx={w * 8 - 2} ry={5} fill="#5B6672" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={w * 8} cy={5.6} rx={w * 8 - 6} ry={3} fill="#727E8C" opacity={0.8} />
        {/* "UVB" label block (pale blue) */}
        <Rect x={w * 8 - 3.5} y={5.8} width={7} height={2.4} fill="#BFD8F0" />
      </Svg>
    </Box>
  );
}

// ─── MetalCrib — 철제 창살 안전 크립 베드 (핵심) ──────────────────
export function MetalCrib({ x, y, occupied }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} w={32} h={48}>
      <Svg viewBox="0 0 32 48" width={32 * S} height={48 * S}>
        <Ellipse cx={16.0} cy={45.3} rx={10.9} ry={3.7} fill="rgba(0,0,0,0.16)" />
        {/* far (rear) rail seen edge-on at the top */}
        <Rect x={2} y={3} width={28} height={2.2} fill="#B7C0C8" stroke={C} strokeWidth={0.5} />
        {[4, 7, 10, 13, 16, 19, 22, 25, 28].map((sx) => <Rect key={'b' + sx} x={sx} y={5} width={1.1} height={3} fill="#9CA3AF" />)}
        {/* TOP face — mattress + blanket seen from above (dominant) */}
        <Rect x={4} y={8} width={24} height={30} fill="#FDE4EE" stroke={C} strokeWidth={0.5} />
        <Rect x={4.5} y={8.5} width={23} height={1.2} fill="#fff" />
        <Rect x={4} y={24} width={24} height={14} fill="#A7F3D0" />
        <Rect x={4} y={24} width={24} height={1} fill="#fff" />
        {/* baby lying in the crib */}
        {occupied && (
          <G>
            <Rect x={13} y={13} width={6} height={4.5} rx={1} fill="#FBD9C0" />
            <Rect x={13.3} y={12.4} width={5.4} height={1.2} fill="#6B4423" />
            <Rect x={11} y={26} width={10} height={4} rx={1.5} fill="#7DCEA0" opacity={0.5} />
          </G>
        )}
        {/* near (front/foot) rail — short thickness band at the bottom edge */}
        <Rect x={2} y={38} width={28} height={3} fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        {[4, 7, 10, 13, 16, 19, 22, 25, 28].map((sx) => <Rect key={'f' + sx} x={sx} y={38.4} width={1.1} height={2.2} fill="#9CA3AF" />)}
        {/* side rails (thin, along left/right edges of the top face) */}
        <Rect x={2} y={5} width={2.4} height={34} fill="#7E8893" stroke={C} strokeWidth={0.5} />
        <Rect x={27.6} y={5} width={2.4} height={34} fill="#7E8893" stroke={C} strokeWidth={0.5} />
        {/* legs + wheels */}
        <Rect x={3} y={41} width={3} height={4} fill="#6B7280" />
        <Rect x={26} y={41} width={3} height={4} fill="#6B7280" />
        <Ellipse cx={4.5} cy={45.5} rx={2} ry={1.3} fill={C} />
        <Ellipse cx={27.5} cy={45.5} rx={2} ry={1.3} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── IVBoard — 캐릭터 모양 수액 익판 (손등 고정) ──────────────────
export function IVBoard({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={3} w={10} h={10}>
      <Svg viewBox="0 0 10 10" width={10 * S} height={10 * S}>
        <Ellipse cx={5.0} cy={9.0} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* star/character splint board */}
        <Path d="M5 0 L6.3 3 L9.5 3 L7 5.2 L8 8.5 L5 6.6 L2 8.5 L3 5.2 L0.5 3 L3.7 3 Z" fill="#FBBF24" stroke={C} strokeWidth={0.4} />
        {/* taped IV line */}
        <Rect x={4.4} y={4} width={1.2} height={4} fill="#FBD9C0" />
        <Rect x={3.5} y={5} width={3} height={0.8} fill="#fff" opacity={0.8} />
        <Rect x={5} y={3.5} width={0.5} height={3} fill="#A8DCEC" />
      </Svg>
    </Box>
  );
}

// ─── BabyScale — 영유아 바구니형 체중계 ───────────────────────────
export function BabyScale({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={24} h={24}>
      <Svg viewBox="0 0 24 24" width={24 * S} height={24 * S}>
        <Ellipse cx={12.0} cy={22.2} rx={8.2} ry={2.8} fill="rgba(0,0,0,0.16)" />
        {/* base cabinet: top face + short front, continuous silhouette */}
        <Path d="M3 13 L21 13 L21 19 Q21 19.6 20.4 19.6 L3.6 19.6 Q3 19.6 3 19 Z" fill="#B9C1C9" />
        <Path d="M4 11 L20 11 Q21 11 21 12 L21 13 L3 13 L3 12 Q3 11 4 11 Z" fill="#8E99A4" />
        <Line x1={3} y1={13} x2={21} y2={13} stroke={C} strokeWidth={0.5} />
        {/* viewer-facing display on the front band; "4.2kg" (green) block */}
        <Rect x={7} y={14.4} width={10} height={4} rx={0.5} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Rect x={8} y={15.6} width={8} height={1.6} fill="#10B981" />
        {/* contoured weighing basin sitting on top (oval tray seen from above) */}
        <Ellipse cx={12} cy={8} rx={11} ry={5} fill="#FDE4EE" stroke={C} strokeWidth={0.55} />
        <Ellipse cx={12} cy={7.4} rx={9} ry={3.6} fill="#FBD0E0" />
        <Ellipse cx={12} cy={7} rx={6} ry={2.2} fill="#F7BBD2" />
        <Path d="M6 6.4 Q12 4.6 18 6.4" fill="none" stroke="#FFFFFF" strokeWidth={0.7} opacity={0.6} />
      </Svg>
    </Box>
  );
}

// ─── StadiometerScale — 학령기 자동 신장/체중계 (캐릭터) ───────────
export function StadiometerScale({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-20} w={22} h={46}>
      <Svg viewBox="0 0 22 46" width={22 * S} height={46 * S}>
        <Ellipse cx={11.0} cy={44.4} rx={7.5} ry={2.6} fill="rgba(0,0,0,0.16)" />
        {/* ground platform: big TOP face + short front (child stands here) */}
        <Path d="M2 40 L20 40 L20 44 Q20 44.6 19.4 44.6 L2.6 44.6 Q2 44.6 2 44 Z" fill="#9AA6B2" />
        <Path d="M2 34 L20 34 L20 40 L2 40 Z" fill="#C3CAD1" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={11} cy={37} rx={6.5} ry={2.4} fill="#AEB6BE" />
        <Line x1={2} y1={40} x2={20} y2={40} stroke={C} strokeWidth={0.5} />
        {/* measuring column rising from the back of the platform */}
        <Rect x={8} y={6} width={6} height={29} rx={1} fill="#7FB8D6" stroke={C} strokeWidth={0.5} />
        <Rect x={8.8} y={7} width={1.6} height={27} fill="#A5D2E6" />
        {/* tick marks up the column */}
        {[...Array(9)].map((_, i) => <Rect key={i} x={11.6} y={9 + i * 3} width={2} height={0.5} fill={C} opacity={0.55} />)}
        {/* sliding head-bar (viewer-facing) */}
        <Rect x={5.5} y={13} width={11} height={2.4} rx={0.5} fill="#EF4444" stroke={C} strokeWidth={0.4} />
        <Rect x={14} y={13.3} width={3} height={1.8} fill="#B91C1C" />
        {/* friendly animal-ear + face topper */}
        <Circle cx={7.5} cy={3.5} r={2.4} fill="#FBBF24" stroke={C} strokeWidth={0.4} />
        <Circle cx={14.5} cy={3.5} r={2.4} fill="#FBBF24" stroke={C} strokeWidth={0.4} />
        <Rect x={6} y={4} width={10} height={4.5} rx={2} fill="#FCD34D" stroke={C} strokeWidth={0.5} />
        <Circle cx={9} cy={6.2} r={0.7} fill={C} />
        <Circle cx={13} cy={6.2} r={0.7} fill={C} />
        <Path d="M9.5 7.4 Q11 8.4 12.5 7.4" fill="none" stroke={C} strokeWidth={0.4} />
        {/* digital display mounted on the column front; "112cm" (cyan) block */}
        <Rect x={6.5} y={27} width={9} height={4} rx={0.5} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Rect x={7.5} y={28.2} width={7} height={1.6} fill="#22D3EE" />
      </Svg>
    </Box>
  );
}

// ─── TongueDepressorJar — 설압자 통 ───────────────────────────────
export function TongueDepressorJar({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={4} offY={3} w={8} h={10}>
      <Svg viewBox="0 0 8 10" width={8 * S} height={10 * S}>
        <Ellipse cx={4.0} cy={9.0} rx={2.7} ry={2} fill="rgba(0,0,0,0.16)" />
        {/* sticks poking out */}
        {[0, 1, 2, 3].map((i) => <Rect key={i} x={1.4 + i * 1.4} y={0} width={1} height={4} fill="#E0B070" stroke={C} strokeWidth={0.2} />)}
        {/* jar */}
        <Rect x={1} y={3.5} width={6} height={6} fill="#D7EEF5" stroke={C} strokeWidth={0.5} />
        <Rect x={1.5} y={4} width={1.4} height={5} fill="#EAF6FA" />
      </Svg>
    </Box>
  );
}

// ─── StickerRoll — 캐릭터 보상 스티커 통 ──────────────────────────
export function StickerRoll({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={4} offY={4} w={8} h={8}>
      <Svg viewBox="0 0 8 8" width={8 * S} height={8 * S}>
        <Ellipse cx={4.0} cy={7.0} rx={2.7} ry={2} fill="rgba(0,0,0,0.16)" />
        <Circle cx={4} cy={4} r={3.6} fill="#FBCFE8" stroke={C} strokeWidth={0.5} />
        <Circle cx={4} cy={4} r={1.4} fill="#fff" stroke={C} strokeWidth={0.3} />
        {/* peeling sticker star */}
        <Path d="M7 1 L7.6 2.4 L9 2.4 L7.9 3.4 L8.3 4.8 L7 4 L5.7 4.8 L6.1 3.4 L5 2.4 L6.4 2.4 Z" fill="#FACC15" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

// ─── DosingChart — 체중 기반 소아 투약 계산표 (벽) ─────────────────
export function DosingChart({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  const W = w * 16;
  return (
    <Box x={x} y={y} w={W} h={18}>
      <Svg viewBox={`0 0 ${W} 18`} width={W * S} height={18 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={18} fill="#fff" stroke={C} strokeWidth={0.6} />
        <Rect x={0} y={0} width={W} height={4} fill="#3B82F6" />
        <Rect x={2} y={1.2} width={w * 9} height={1.6} fill="#fff" />
        {/* dosing rows (kg → mL) */}
        {[0, 1, 2, 3].map((r) => (
          <G key={r}>
            <Rect x={2} y={6 + r * 2.8} width={w * 5} height={1.2} fill={C} opacity={0.55} />
            <Rect x={W - w * 6} y={6 + r * 2.8} width={w * 4} height={1.2} fill="#10B981" />
          </G>
        ))}
      </Svg>
    </Box>
  );
}

// ─── MilkFridge — 모유 보관 전용 냉장고 (네임 라벨 젖병) ────────────
export function MilkFridge({ x, y }: { x: number; y: number }) {
  const sil = 'M2 2 Q1 2 1 3 L1 34 Q1 35 2 35 L22 35 Q23 35 23 34 L23 3 Q23 2 22 2 Z';
  return (
    <Box x={x} y={y} offX={-2} offY={-5} w={24} h={37}>
      <Svg viewBox="0 0 24 37" width={24 * S} height={37 * S}>
        <Ellipse cx={12.0} cy={35.2} rx={8.2} ry={2.8} fill="rgba(0,0,0,0.16)" />
        {/* continuous silhouette (top face + front) */}
        <Path d={sil} fill="#E9EBEC" />
        {/* TOP face */}
        <Path d="M2 2 Q1 2 1 3 L1 8 L23 8 L23 3 Q23 2 22 2 Z" fill="#CBD2D6" />
        <Line x1={1} y1={8} x2={23} y2={8} stroke={C} strokeWidth={0.5} />
        {/* glass door showing labeled milk bottles on shelves */}
        <Rect x={2.5} y={10} width={19} height={22} rx={0.8} fill="#D7EEF5" stroke={C} strokeWidth={0.5} />
        {[12, 19, 26].map((sy, r) => (
          <G key={r}>
            <Rect x={3} y={sy + 4} width={18} height={0.9} fill="#AFD3DE" />
            {[0, 1, 2, 3].map((i) => (
              <G key={i}>
                <Rect x={3.8 + i * 4.4} y={sy} width={3} height={4.2} rx={0.6} fill="#FFFDF5" stroke={C} strokeWidth={0.25} />
                <Rect x={4.3 + i * 4.4} y={sy - 1} width={2} height={1.4} fill="#E8E0D0" />
                <Rect x={3.8 + i * 4.4} y={sy + 2.6} width={3} height={1.2} fill="#FBE3C8" />
              </G>
            ))}
          </G>
        ))}
        {/* vertical handle */}
        <Rect x={18.5} y={14} width={1.6} height={14} rx={0.6} fill="#9AA6B2" stroke={C} strokeWidth={0.3} />
        {/* temp display on the top-front; "4°" (cyan) block */}
        <Rect x={3} y={3.4} width={6} height={3} rx={0.4} fill="#0B2A3A" />
        <Rect x={4} y={4.2} width={2.4} height={1.6} fill="#22D3EE" />
        {/* re-stroke silhouette */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.7} />
      </Svg>
    </Box>
  );
}

// ─── SmallSlide — 놀이방 미끄럼틀 ─────────────────────────────────
export function SmallSlide({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={42} h={38}>
      <Svg viewBox="0 0 42 38" width={42 * S} height={38 * S}>
        <Ellipse cx={21.0} cy={34.1} rx={14.3} ry={4.9} fill="rgba(0,0,0,0.16)" />
        {/* climbing ladder (back-right), seen from above-front */}
        <Path d="M33 15 L35.5 5" stroke="#4F7CC4" strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M39 15 L41 5" stroke="#3A63A8" strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M34.6 8.4 L40.2 8.4 M34 11 L39.6 11 M33.4 13.6 L39 13.6" stroke="#F4B740" strokeWidth={1.2} strokeLinecap="round" />
        {/* top platform (deck), a raised slab */}
        <Path d="M20 16.5 L34 16.5 L34 20 Q34 20.6 33.4 20.6 L20.6 20.6 Q20 20.6 20 20 Z" fill="#C1443C" />
        <Path d="M21 11 L35 11 L34 16.5 L20 16.5 Z" fill="#F87171" stroke={C} strokeWidth={0.55} />
        <Path d="M22 12 L34 12" stroke="#FCA5A5" strokeWidth={0.7} />
        <Line x1={20} y1={16.5} x2={34} y2={16.5} stroke={C} strokeWidth={0.5} />
        {/* safety guard rail behind the deck */}
        <Path d="M21.5 11 L21.5 7 M27.5 11 L27.5 6.5 M34 11 L34 7" stroke="#4F7CC4" strokeWidth={1.2} strokeLinecap="round" />
        <Path d="M21 7.2 L34.4 6.6" stroke="#4F7CC4" strokeWidth={1.2} strokeLinecap="round" />
        {/* platform legs */}
        <Rect x={21} y={20} width={1.8} height={12} fill="#7C4A24" stroke={C} strokeWidth={0.3} />
        <Rect x={31.5} y={20} width={1.8} height={12} fill="#7C4A24" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={21.9} cy={32.5} rx={1.6} ry={0.8} fill="#5E3410" />
        <Ellipse cx={32.4} cy={32.5} rx={1.6} ry={0.8} fill="#5E3410" />
        {/* the slide chute, curving down-left */}
        <Path d="M20 12.5 L25.5 12.5 Q10 18 8.5 30 L2.5 30 Q4.5 17 20 12.5 Z" fill="#FCD34D" stroke={C} strokeWidth={0.6} />
        <Path d="M21 13.6 Q9 19 7 29.4" fill="none" stroke="#FEF08A" strokeWidth={1.4} strokeLinecap="round" />
        <Path d="M20 12.5 Q4.5 17 2.5 30" fill="none" stroke="#E0A020" strokeWidth={1.3} strokeLinecap="round" />
        {/* run-out lip at the bottom (front thickness) */}
        <Path d="M2.5 30 L8.5 30 L7.6 33.4 Q7.5 34 6.9 34 L2.2 34 Q1.6 34 1.7 33.4 Z" fill="#E0A020" stroke={C} strokeWidth={0.5} />
        <Path d="M2.4 31 L8.2 31" stroke="#F4B740" strokeWidth={0.6} />
      </Svg>
    </Box>
  );
}

// ─── RockingHorse — 놀이방 흔들목마 (원래 forinBob bob 애니메이션 → 정적 렌더) ──
export function RockingHorse({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={36} h={34}>
      <Svg viewBox="0 0 36 34" width={36 * S} height={34 * S}>
        <Ellipse cx={18.0} cy={30.9} rx={12.2} ry={4.1} fill="rgba(0,0,0,0.16)" />
        {/* twin curved rockers (runners), seen from above-front */}
        <Path d="M4 27 Q18 22 32 27 Q31.6 28.4 31 28.4 Q18 24.4 5 28.4 Q4.4 28.4 4 27 Z" fill="#8A4A1E" stroke={C} strokeWidth={0.5} />
        <Path d="M6 30 Q18 26 30 30 Q29.6 31.2 29 31.2 Q18 27.8 7 31.2 Q6.4 31.2 6 30 Z" fill="#6E3A16" stroke={C} strokeWidth={0.5} />
        {/* cross strut between the rockers */}
        <Path d="M12 28.5 L12 30.4 M24 28.5 L24 30.4" stroke="#5E3210" strokeWidth={1.2} />
        {/* body: rounded pony seen 3/4 from above */}
        <Path d="M9 15 Q8 11.5 12 11 L22 10.5 Q26 10.5 26.5 14 L26 21 Q25.6 23.5 22.5 23.5 L12 23.5 Q9.2 23.5 9 20 Z" fill="#F7A8C0" />
        <Path d="M9 15 Q8 11.5 12 11 L22 10.5 Q26 10.5 26.5 14 L26 16 Q17 14.5 9.4 16.5 Z" fill="#FCC7D8" />
        <Path d="M9.4 16.2 Q17 14.4 26 15.8" fill="none" stroke={C} strokeWidth={0.4} opacity={0.5} />
        <Path d="M9 15 Q8 11.5 12 11 L22 10.5 Q26 10.5 26.5 14 L26 21 Q25.6 23.5 22.5 23.5 L12 23.5 Q9.2 23.5 9 20 Z" fill="none" stroke={C} strokeWidth={0.6} />
        {/* dapple spots */}
        <Circle cx={14} cy={18.5} r={1.1} fill="#FFFFFF" opacity={0.55} />
        <Circle cx={19} cy={19.5} r={0.9} fill="#FFFFFF" opacity={0.55} />
        <Circle cx={22} cy={17.5} r={0.8} fill="#FFFFFF" opacity={0.5} />
        {/* saddle + blanket on the top face */}
        <Rect x={13} y={12.5} width={9} height={5} rx={1.4} fill="#8B5CF6" stroke={C} strokeWidth={0.4} />
        <Rect x={14} y={13.4} width={7} height={1.2} fill="#C4B5FD" />
        <Circle cx={17.5} cy={15.4} r={1} fill="#FACC15" stroke={C} strokeWidth={0.3} />
        {/* neck + head (up-right), with flowing mane */}
        <Path d="M24 13 Q29 10 30.5 6 Q31 4 33 5 Q34 8 31.5 12 Q29.5 15 25.5 15.5 Z" fill="#F7A8C0" stroke={C} strokeWidth={0.6} />
        <Ellipse cx={32} cy={6} rx={2} ry={1.6} fill="#F49BB6" stroke={C} strokeWidth={0.4} />
        <Circle cx={32.6} cy={6} r={0.5} fill={C} />
        <Path d="M29.5 6.5 L30.5 4 L31.6 6 Z" fill="#F7A8C0" stroke={C} strokeWidth={0.35} />
        <Circle cx={30} cy={8.5} r={0.9} fill={C} />
        <Circle cx={30.3} cy={8.2} r={0.28} fill="#FFF" />
        {/* golden flowing mane along the neck */}
        <Path d="M25 12 Q27 9 29 6.5" fill="none" stroke="#FACC15" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M24 13.5 Q26.5 11 28 8" fill="none" stroke="#F4B740" strokeWidth={1.2} strokeLinecap="round" />
        {/* swishing tail (down-left) */}
        <Path d="M9 15 Q4 15 3 20 Q2.6 22.5 4.5 23" fill="none" stroke="#FACC15" strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M9 16.5 Q5.5 17 4.8 21" fill="none" stroke="#F4B740" strokeWidth={1.2} strokeLinecap="round" />
        {/* stubby legs meeting the rockers */}
        <Rect x={12} y={22} width={2.4} height={5} rx={1} fill="#EC8FAC" stroke={C} strokeWidth={0.4} />
        <Rect x={21} y={22} width={2.4} height={5} rx={1} fill="#E67F9F" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── ToyChest — 놀이방 장난감 상자 ────────────────────────────────
export function ToyChest({ x, y }: { x: number; y: number }) {
  const sil = 'M3 2 L29 2 Q30 2 30 3 L30 24 Q30 25 29 25 L3 25 Q2 25 2 24 L2 3 Q2 2 3 2 Z';
  return (
    <Box x={x} y={y} offY={-4} w={32} h={28}>
      <Svg viewBox="0 0 32 28" width={32 * S} height={28 * S}>
        <Ellipse cx={16.0} cy={25.3} rx={10.9} ry={3.7} fill="rgba(0,0,0,0.16)" />
        {/* continuous silhouette (top face + front band) */}
        <Path d={sil} fill="#8B4513" />
        {/* TOP face — open chest showing toys inside */}
        <Path d="M3 2 L29 2 Q30 2 30 3 L30 17 L2 17 L2 3 Q2 2 3 2 Z" fill="#A0531C" />
        <Rect x={4.5} y={3.8} width={23} height={11.5} rx={1.5} fill="#5E3210" />
        <Circle cx={9} cy={9.5} r={3} fill="#EF4444" stroke={C} strokeWidth={0.4} />
        <Rect x={14} y={6.5} width={5} height={6} rx={1} fill="#3B82F6" stroke={C} strokeWidth={0.4} />
        <Circle cx={23} cy={9.5} r={2.6} fill="#10B981" stroke={C} strokeWidth={0.4} />
        <Rect x={18} y={9.5} width={4} height={4} fill="#FACC15" stroke={C} strokeWidth={0.3} />
        {/* seam top → front */}
        <Line x1={2} y1={17} x2={30} y2={17} stroke={C} strokeWidth={0.55} />
        {/* FRONT band with wood plank + heart latch */}
        <Rect x={3.5} y={18.4} width={25} height={1.3} fill="#A0531C" />
        <Path d="M16 20.2 l1.2 -1.2 a.9 .9 0 0 1 1.3 1.3 l-2.5 2.4 l-2.5 -2.4 a.9 .9 0 0 1 1.3 -1.3 z" fill="#FACC15" stroke={C} strokeWidth={0.3} />
        {/* re-stroke silhouette */}
        <Path d={sil} fill="none" stroke={C} strokeWidth={0.7} />
      </Svg>
    </Box>
  );
}

// ─── Blocks — 놀이방 블록 (div-based → nested absolute Views) ──────
export function Blocks({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={1.2 * 16} h={0.8 * 16}>
      <View style={{ position: 'absolute', left: 0 * S, top: 6 * S, width: 6 * S, height: 6 * S, backgroundColor: '#EF4444', borderWidth: 1 * S, borderColor: C }} />
      <View style={{ position: 'absolute', left: 6 * S, top: 4 * S, width: 6 * S, height: 8 * S, backgroundColor: '#3B82F6', borderWidth: 1 * S, borderColor: C }} />
      <View style={{ position: 'absolute', left: 3 * S, top: 0 * S, width: 6 * S, height: 6 * S, backgroundColor: '#FACC15', borderWidth: 1 * S, borderColor: C }} />
      <View style={{ position: 'absolute', left: 12 * S, top: 6 * S, width: 6 * S, height: 6 * S, backgroundColor: '#10B981', borderWidth: 1 * S, borderColor: C }} />
    </Box>
  );
}

// ─── Mural — wall nature painting (SVG so the ground is ROLLING HILLS, matching
// the handoff clipPath polygon — a straight band read wrong). Handoff 4×2. ──
export function Mural({ x, y, w = 4 }: { x: number; y: number; w?: number }) {
  const W = w * 16, H = 32;
  // rolling green hills across the bottom (handoff clipPath
  // 0/60% 30/30% 60/70% 100/40% → jagged ground line)
  const hills = `M0 ${H - 12.8} L${W * 0.3} ${H - 8.4} L${W * 0.6} ${H - 3.6} L${W} ${H - 7.2} L${W} ${H} L0 ${H} Z`;
  return (
    <Box x={x} y={y} w={W} h={H}>
      <Svg viewBox={`0 0 ${W} ${H}`} width={W * S} height={H * S} preserveAspectRatio="none">
        {/* frame + sky */}
        <Rect x={0} y={0} width={W} height={H} fill="#FEF3C7" stroke={C} strokeWidth={2} />
        {/* sun (top-right) */}
        <Circle cx={W - 9} cy={7} r={3.5} fill="#FACC15" stroke={C} strokeWidth={0.6} />
        {/* cloud */}
        <Rect x={9} y={5} width={16} height={4} rx={2} fill="#fff" stroke={C} strokeWidth={0.5} />
        {/* rolling grassy ground (curved hilltop) */}
        <Path d={hills} fill="#86EFAC" stroke={C} strokeWidth={0.7} />
        {/* little house/bush sitting on the hill */}
        <Rect x={7} y={H - 11} width={8} height={6} fill="#FCA5A5" stroke={C} strokeWidth={0.6} />
        <Path d={`M6 ${H - 11} L11 ${H - 15} L16 ${H - 11} Z`} fill="#F87171" stroke={C} strokeWidth={0.6} />
      </Svg>
    </Box>
  );
}

// ─── Balloon — 놀이방 풍선 (color prop c; forinBob bob 애니메이션 → 정적 렌더) ──
export function Balloon({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <Box x={x} y={y} offX={4} offY={-4} w={8} h={14}>
      <Svg viewBox="0 0 8 14" width={12 * S} height={20 * S}>
        <Ellipse cx={4.0} cy={13.0} rx={2.7} ry={2} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={4} cy={4} rx={3} ry={4} fill={c} stroke={C} strokeWidth={0.5} />
        <Rect x={4} y={8} width={0.5} height={6} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── PlayMat — welcome-area play zone floor (opaque salmon + dashed border) ──
export function PlayMat({ x, y, w = 12, h = 8 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x * TILE + 2,
        top: y * TILE + 2,
        width: w * TILE - 4,
        height: h * TILE - 4,
        backgroundColor: '#FED7AA',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#2A252555',
      }}
    />
  );
}

/** Render a Pediatrics-specific object by type. null if unknown. */
export function PedsObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'playmat': return <PlayMat x={x} y={y} w={typeof props?.w === 'number' ? props.w : 12} h={typeof props?.h === 'number' ? props.h : 8} />;
    case 'incubator': return <Incubator x={x} y={y} occupied={props?.occupied !== false} />;
    case 'phototherapy': return <PhototherapyLamp x={x} y={y} w={typeof props?.w === 'number' ? props.w : 2} />;
    case 'metalcrib': return <MetalCrib x={x} y={y} occupied={!!props?.occupied} />;
    case 'ivboard': return <IVBoard x={x} y={y} />;
    case 'babyscale': return <BabyScale x={x} y={y} />;
    case 'stadiometer': return <StadiometerScale x={x} y={y} />;
    case 'tonguejar': return <TongueDepressorJar x={x} y={y} />;
    case 'stickerroll': return <StickerRoll x={x} y={y} />;
    case 'dosingchart': return <DosingChart x={x} y={y} w={typeof props?.w === 'number' ? props.w : 2} />;
    case 'milkfridge': return <MilkFridge x={x} y={y} />;
    case 'smallslide': return <SmallSlide x={x} y={y} />;
    case 'rockinghorse': return <RockingHorse x={x} y={y} />;
    case 'toychest': return <ToyChest x={x} y={y} />;
    case 'blocks': return <Blocks x={x} y={y} />;
    case 'mural': return <Mural x={x} y={y} w={typeof props?.w === 'number' ? props.w : 4} />;
    case 'balloon': return <Balloon x={x} y={y} c={typeof props?.color === 'string' ? props.color : '#EF4444'} />;
    default: return null;
  }
}
