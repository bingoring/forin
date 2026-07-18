// Geriatric / Dementia objects — RN-svg ports of interior-objects-geri2.jsx:
// dementia-friendly low fall-safe bed, memory shadow-box, reality-orientation board,
// high-arm geriatric recliner, continuous corridor handrail. Authored at ITILE=16,
// rendered at TILE px via S; Box maps handoff x*ITILE / top-N offsets 1:1. v13+ 2.5D
// ground shadow. SVG <text> (date) → shape blocks. Dispatched via GeriObjectView;
// reused pieces resolve on the shared chain.
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

// ─── LowBed — 초저상 낙상 방지 침대 (양옆 크래시 매트 + 센서 매트) ──────
export function LowBed({ x, y, occupied }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} offY={-2} w={42} h={50}>
      <Svg viewBox="0 0 42 50" width={42 * S} height={50 * S}>
        <Ellipse cx={21} cy={48} rx={18} ry={2.2} fill="rgba(0,0,0,0.14)" />
        <Rect x={1} y={16} width={5} height={26} rx={1.5} fill="#8FA9B8" stroke={C} strokeWidth={0.5} />
        <Rect x={36} y={16} width={5} height={26} rx={1.5} fill="#8FA9B8" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={17} width={3} height={1} fill="#A6C0CE" />
        <Rect x={37} y={17} width={3} height={1} fill="#A6C0CE" />
        <Path d="M6 6 L36 6 L36 42 Q36 43 35 43 L7 43 Q6 43 6 42 Z" fill="#E4DAC8" stroke={C} strokeWidth={0.7} />
        <Rect x={10} y={8} width={22} height={9} rx={3} fill="#FBFAF4" stroke={C} strokeWidth={0.4} />
        <Rect x={7} y={20} width={28} height={22} rx={1.5} fill="#C4B69A" />
        <Path d="M7 28 L35 28 M7 35 L35 35" stroke="#A89A7C" strokeWidth={0.5} />
        {occupied && (
          <G>
            <Rect x={18} y={9.5} width={6} height={5.5} rx={2.3} fill="#FBD9C0" stroke={C} strokeWidth={0.3} />
            <Rect x={18.4} y={8.6} width={5.2} height={1.4} fill="#8A8A8A" />
            <Ellipse cx={21} cy={30} rx={9} ry={6} fill="#B3A783" opacity={0.5} />
          </G>
        )}
        <Line x1={6} y1={42} x2={36} y2={42} stroke={C} strokeWidth={0.5} />
        <Rect x={13} y={44} width={16} height={4} rx={1} fill="#5B6672" />
        <Rect x={14} y={45} width={14} height={1} fill="#6E7A86" />
      </Svg>
    </Box>
  );
}

// ─── MemoryBox — 병실문 옆 회상 상자 (사진·추억 물건, 방 찾기 단서) ─────
export function MemoryBox({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} w={12} h={18}>
      <Svg viewBox="0 0 12 18" width={12 * S} height={18 * S}>
        <Ellipse cx={6} cy={17} rx={4.5} ry={1.2} fill="rgba(0,0,0,0.14)" />
        <Rect x={1} y={1} width={10} height={15} rx={0.5} fill="#C99F68" stroke={C} strokeWidth={0.6} />
        <Rect x={2} y={2} width={8} height={13} fill="#F4ECD8" />
        <Rect x={3} y={3.5} width={4} height={4} fill="#B7C9A8" stroke={C} strokeWidth={0.3} />
        <Circle cx={5} cy={5.5} r={1} fill="#9DB08C" />
        <Rect x={7.5} y={4} width={2.5} height={3} fill="#E4B7A0" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={9} width={6} height={1.4} fill="#CBA36B" />
        <Rect x={3} y={11.5} width={5} height={1} fill="#D8C6A0" />
      </Svg>
    </Box>
  );
}

// ─── OrientationBoard — 현실 인식 게시판 (날짜·요일·계절·날씨) ──────────
export function OrientationBoard({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  return (
    <Box x={x} y={y} w={vw} h={20}>
      <Svg viewBox={`0 0 ${vw} 20`} width={vw * S} height={20 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={vw} height={20} rx={1} fill="#fff" stroke={C} strokeWidth={0.7} />
        <Rect x={0} y={0} width={vw} height={4.5} fill="#5B8A6E" />
        <Rect x={2} y={1.3} width={w * 8} height={2} fill="#fff" />
        <Rect x={2} y={6.5} width={w * 6} height={4} fill="#3A4048" />
        {/* date "7/16 水" → amber bars */}
        <Rect x={4} y={7.6} width={w * 4} height={1.8} fill="#FBBF24" />
        <Circle cx={vw - 6} cy={8.5} r={2.6} fill="#FBBF24" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={12.5} width={w * 10} height={1.6} fill={C} opacity={0.4} />
        <Rect x={2} y={15.5} width={w * 7} height={1.6} fill={C} opacity={0.3} />
      </Svg>
    </Box>
  );
}

// ─── GeriReclineChair — 노인용 등받이·발판 리클라이너 (높은 팔걸이) ─────
export function GeriReclineChair({ x, y, occupied = true }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} offY={-4} w={36} h={48}>
      <Svg viewBox="0 0 36 48" width={36 * S} height={48 * S}>
        <Ellipse cx={18} cy={46} rx={14} ry={2.2} fill="rgba(0,0,0,0.15)" />
        <Path d="M6 34 L30 34 L30 42 Q30 43 29 43 L7 43 Q6 43 6 42 Z" fill="#B89A72" stroke={C} strokeWidth={0.6} />
        <Rect x={8} y={35} width={20} height={6} rx={2} fill="#C4A578" />
        <Path d="M4 12 L32 12 L32 34 L4 34 Z" fill="#A98D66" stroke={C} strokeWidth={0.7} />
        <Rect x={6} y={14} width={24} height={19} rx={2} fill="#C4A578" />
        <Path d="M4 2 L32 2 Q33 2 33 3 L33 12 L3 12 L3 3 Q3 2 4 2 Z" fill="#A98D66" stroke={C} strokeWidth={0.7} />
        <Rect x={6} y={3.5} width={24} height={8} rx={2.5} fill="#C4A578" />
        <Rect x={1.5} y={12} width={4} height={24} rx={1.5} fill="#8F7550" stroke={C} strokeWidth={0.5} />
        <Rect x={30.5} y={12} width={4} height={24} rx={1.5} fill="#8F7550" stroke={C} strokeWidth={0.5} />
        {occupied && (
          <G>
            <Rect x={14.5} y={4.5} width={7} height={6} rx={2.6} fill="#FBD9C0" stroke={C} strokeWidth={0.3} />
            <Rect x={14.8} y={3.6} width={6.4} height={1.6} fill="#9A9A9A" />
            <Ellipse cx={18} cy={24} rx={8} ry={9} fill="#B7C9A8" opacity={0.55} />
            <Rect x={12} y={34} width={12} height={4} rx={1.5} fill="#E4C9A0" />
          </G>
        )}
      </Svg>
    </Box>
  );
}

// ─── HandrailWall — 복도 연속 손잡이 (배회 안전, 벽 부착) ───────────────
export function HandrailWall({ x, y, w = 4 }: { x: number; y: number; w?: number }) {
  const vw = w * 16;
  return (
    <Box x={x} y={y} w={vw} h={8} z={1}>
      <Svg viewBox={`0 0 ${vw} 8`} width={vw * S} height={8 * S} preserveAspectRatio="none">
        <Rect x={0} y={2.5} width={vw} height={3} rx={1.5} fill="#C99F68" stroke={C} strokeWidth={0.5} />
        <Rect x={1} y={3} width={vw - 2} height={1} fill="#DBB884" />
        {[...Array(w)].map((_, i) => <Rect key={i} x={6 + i * 16} y={5.5} width={2} height={2.5} fill="#9CA3AF" />)}
      </Svg>
    </Box>
  );
}

export function GeriObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  switch (type) {
    case 'lowbed': return <LowBed x={x} y={y} occupied={props?.occupied === true} />;
    case 'memorybox': return <MemoryBox x={x} y={y} />;
    case 'orientationboard': return <OrientationBoard x={x} y={y} w={num(props?.w, 3)} />;
    case 'gerireclinechair': return <GeriReclineChair x={x} y={y} occupied={props?.occupied !== false} />;
    case 'handrailwall': return <HandrailWall x={x} y={y} w={num(props?.w, 4)} />;
    default: return null;
  }
}
