// Outpatient-clinic equipment — RN-svg ports of design-handoff interior-clinics.jsx
// (5d-iii). Authored at ITILE=16; rendered at TILE px via SCALE. Positioned by the
// clinic generator; decorative props don't block (collision is the wall layer +
// objectCollision footprints).
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { TILE } from '../coords';
import type { MapObject } from '../types';

const C = '#2A2522';
const S = TILE / 16; // ref px → screen px

function mixC(a: string, b: string, t: number) {
  const p = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  return '#' + [Math.round(ar + (br - ar) * t), Math.round(ag + (bg - ag) * t), Math.round(ab + (bb - ab) * t)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

// positioned wrapper: tile (x,y) + ref-px offset, sized in ref px × SCALE
function Box({ x, y, offX = 0, offY = 0, w, h, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S }}>
      {children}
    </View>
  );
}

export function UltrasoundCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={22.4} h={38.4}>
      <Svg viewBox="0 0 22 38" width={22.4 * S} height={38.4 * S}>
        <Rect x={3} y={0} width={16} height={12} fill="#1F2937" stroke={C} strokeWidth={0.5} />
        <Rect x={4} y={1} width={14} height={9} fill="#0F1A24" />
        <Path d="M 11 2 L 6 9 L 16 9 Z" fill="#15314A" />
        <Path d="M 11 2 L 8 9 L 14 9 Z" fill="#22506E" />
        <Rect x={10} y={4} width={2} height={2} fill="#A7F3D0" />
        <Path d="M 4 12 L 18 12 L 19 14 L 3 14 Z" fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={14} width={18} height={6} fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        <Rect x={4} y={16} width={14} height={2} fill="#94A3B8" />
        <Rect x={9} y={20} width={4} height={12} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={22} width={16} height={4} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={5} cy={34} rx={2} ry={1.5} fill={C} />
        <Ellipse cx={17} cy={34} rx={2} ry={1.5} fill={C} />
      </Svg>
    </Box>
  );
}

export function XrayViewbox({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={32} h={22.4}>
      <Svg viewBox="0 0 32 22" width={32 * S} height={22.4 * S}>
        <Rect x={1} y={1} width={30} height={20} fill="#E5E7EB" stroke={C} strokeWidth={0.6} />
        <Rect x={3} y={3} width={12} height={16} fill="#1E3A5F" />
        <Rect x={17} y={3} width={12} height={16} fill="#1E3A5F" />
        <Rect x={7} y={4} width={4} height={14} fill="#BFD3E6" />
        <Ellipse cx={9} cy={5} rx={3} ry={2} fill="#D8E6F2" />
        <Ellipse cx={9} cy={17} rx={3} ry={2} fill="#D8E6F2" />
        {[5, 8, 11, 14].map((ry, i) => (
          <Rect key={i} x={19} y={ry} width={9} height={1.5} fill="#9DB8D2" />
        ))}
        <Rect x={9} y={1} width={3} height={2} fill="#6B7280" />
        <Rect x={22} y={1} width={3} height={2} fill="#6B7280" />
      </Svg>
    </Box>
  );
}

export function CastCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={22.4} h={25.6}>
      <Svg viewBox="0 0 22 26" width={22.4 * S} height={25.6 * S}>
        <Path d="M 2 2 L 20 2 L 21 4 L 1 4 Z" fill="#94A3B8" stroke={C} strokeWidth={0.4} />
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

export function Crutches({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={-6} w={16} h={32}>
      <Svg viewBox="0 0 12 34" width={16 * S} height={32 * S}>
        {[2, 6].map((ox, i) => (
          <G key={i}>
            <Rect x={ox} y={2} width={3} height={2} fill="#E8DCC0" stroke={C} strokeWidth={0.3} />
            <Rect x={ox + 1} y={4} width={1} height={26} fill="#C8A876" stroke={C} strokeWidth={0.3} />
            <Rect x={ox - 0.5} y={12} width={4} height={1.5} fill="#A88862" />
            <Rect x={ox} y={30} width={3} height={2} fill="#4B5563" />
          </G>
        ))}
      </Svg>
    </Box>
  );
}

export function DermLamp({ x, y }: { x: number; y: number }) {
  const dots = [0, 1, 2, 3].map((i) => ({ cx: 6 + 3 * Math.cos(i * 1.57), cy: 6 + 3 * Math.sin(i * 1.57) }));
  return (
    <Box x={x} y={y} offY={-8} w={20.8} h={35.2}>
      <Svg viewBox="0 0 20 36" width={20.8 * S} height={35.2 * S}>
        <Circle cx={6} cy={6} r={5} fill="none" stroke="#94A3B8" strokeWidth={1.5} />
        <Circle cx={6} cy={6} r={3.5} fill="#D4F0F8" opacity={0.7} />
        <Circle cx={6} cy={6} r={3.5} fill="none" stroke={C} strokeWidth={0.4} />
        {dots.map((d, i) => (
          <Circle key={i} cx={d.cx} cy={d.cy} r={0.6} fill="#FEF9C3" />
        ))}
        <Rect x={10} y={5} width={6} height={2} fill="#9CA3AF" stroke={C} strokeWidth={0.3} rotation={20} originX={10} originY={6} />
        <Rect x={15} y={6} width={2} height={14} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />
        <Rect x={11} y={20} width={4} height={10} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={13} cy={32} rx={6} ry={2} fill="#6B7280" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

export function LaserUnit({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={19.2} h={35.2}>
      <Svg viewBox="0 0 18 36" width={19.2 * S} height={35.2 * S}>
        <Path d="M 2 1 L 16 1 L 17 3 L 1 3 Z" fill="#475569" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={3} width={16} height={14} fill="#E2E8F0" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={5} width={12} height={7} fill="#0F1A24" stroke={C} strokeWidth={0.3} />
        <Rect x={4} y={6} width={10} height={2} fill="#A78BFA" />
        <Rect x={4} y={9} width={7} height={1.5} fill="#22D3EE" />
        <Rect x={14} y={14} width={3} height={2} fill="#1F2937" />
        <Rect x={15} y={16} width={2} height={6} fill="#374151" stroke={C} strokeWidth={0.3} />
        <Rect x={1} y={17} width={16} height={13} fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={19} width={12} height={3} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={4} cy={32} rx={2} ry={1.5} fill={C} />
        <Ellipse cx={14} cy={32} rx={2} ry={1.5} fill={C} />
      </Svg>
    </Box>
  );
}

export function ExamStool({ x, y, color = '#4B5563' }: { x: number; y: number; color?: string }) {
  return (
    <Box x={x} y={y} offX={2} offY={2} w={12} h={16}>
      <Svg viewBox="0 0 12 12" width={12 * S} height={16 * S}>
        <Ellipse cx={6} cy={3} rx={5} ry={2.5} fill={color} stroke={C} strokeWidth={0.4} />
        <Ellipse cx={6} cy={2.4} rx={4} ry={1.6} fill="#6B7280" />
        <Rect x={5} y={4} width={2} height={4} fill="#9CA3AF" />
        {[3, 6, 9].map((lx, i) => (
          <Rect key={i} x={lx} y={8} width={1.5} height={3} fill="#6B7280" rotation={(i - 1) * 25} originX={lx} originY={8} />
        ))}
      </Svg>
    </Box>
  );
}

export function BoneModel({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={-8} w={12} h={32}>
      <Svg viewBox="0 0 12 32" width={12 * S} height={32 * S}>
        <Circle cx={6} cy={4} r={3} fill="#F3F0E6" stroke={C} strokeWidth={0.4} />
        <Rect x={4.5} y={3.5} width={1} height={1} fill={C} />
        <Rect x={6.5} y={3.5} width={1} height={1} fill={C} />
        <Rect x={5} y={7} width={2} height={8} fill="#F3F0E6" stroke={C} strokeWidth={0.3} />
        {[8, 10, 12].map((ry, i) => (
          <Ellipse key={i} cx={6} cy={ry} rx={3} ry={1} fill="none" stroke="#E8E2D2" strokeWidth={0.6} />
        ))}
        <Rect x={5} y={15} width={2} height={12} fill="#9CA3AF" />
        <Ellipse cx={6} cy={28} rx={4} ry={1.5} fill="#6B7280" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

export function SkincareShelf({ x, y, w = 3 }: { x: number; y: number; w?: number }) {
  const top = ['#FBCFE8', '#A7F3D0', '#BAE6FD', '#FDE68A'];
  const bot = ['#DDD6FE', '#FED7AA'];
  return (
    <Box x={x} y={y} w={w * 16} h={12}>
      <Svg viewBox={`0 0 ${w * 16} 12`} width={w * 16 * S} height={12 * S} preserveAspectRatio="none">
        <Rect x={1} y={1} width={w * 16 - 2} height={10} fill="#F0E6EA" stroke={C} strokeWidth={0.5} />
        <Rect x={1} y={6} width={w * 16 - 2} height={1.5} fill={C} opacity={0.25} />
        {Array.from({ length: w * 2 }).map((_, i) => (
          <Rect key={i} x={3 + i * 7} y={2} width={3} height={4} fill={top[i % 4]} stroke={C} strokeWidth={0.3} />
        ))}
        {Array.from({ length: w * 2 }).map((_, i) => (
          <Rect key={`b${i}`} x={3 + i * 7} y={7.5} width={3} height={3} fill={bot[i % 2]} stroke={C} strokeWidth={0.3} />
        ))}
      </Svg>
    </Box>
  );
}

// Modern clinic reception desk (sign band + white top + wood front + monitors).
export function ClinicReception({ x, y, w = 6, tone = '#0E7490' }: { x: number; y: number; w?: number; tone?: string }) {
  const W = w * 16;
  const mons = Math.max(2, Math.floor(w / 2));
  return (
    <Box x={x} y={y} offY={-6} w={W} h={38.4}>
      <Svg viewBox={`0 0 ${W} 38`} width={W * S} height={38.4 * S} preserveAspectRatio="none">
        <Rect x={3} y={0} width={W - 6} height={6} fill={tone} stroke={C} strokeWidth={0.5} />
        <Rect x={5} y={1.5} width={W - 10} height={3} fill={mixC(tone, '#FFFFFF', 0.5)} />
        <Rect x={1} y={8} width={W - 2} height={6} fill="#FFFFFF" stroke={C} strokeWidth={0.6} />
        <Rect x={1} y={13.5} width={W - 2} height={2} fill="#1F2937" />
        <Rect x={1} y={15} width={W - 2} height={20} fill="#C8A165" stroke={C} strokeWidth={0.6} />
        <Rect x={1} y={15} width={W - 2} height={1.5} fill="#D9B988" />
        <Rect x={1} y={34} width={W - 2} height={2} fill="#8A6A3C" />
        {Array.from({ length: mons }).map((_, i) => {
          const mx = 8 + i * ((W - 16) / Math.max(1, mons - 1));
          return (
            <G key={i}>
              <Rect x={mx} y={4} width={9} height={6} fill="#1F2937" stroke={C} strokeWidth={0.4} />
              <Rect x={mx + 1} y={5} width={7} height={4} fill="#0F1A24" />
              <Rect x={mx + 1.5} y={5.6} width={6} height={1} fill={mixC(tone, '#7DD3FC', 0.4)} />
            </G>
          );
        })}
      </Svg>
    </Box>
  );
}

// Simple supply cabinet (w tiles). variant tweaks the door tint.
export function Cabinet({ x, y, w = 2, variant = 'supply' }: { x: number; y: number; w?: number; variant?: string }) {
  const door = variant === 'drug' ? '#DCFCE7' : variant === 'sterile' ? '#DBEAFE' : '#F1F5F9';
  const W = w * 16;
  return (
    <Box x={x} y={y} w={W} h={14}>
      <Svg viewBox={`0 0 ${W} 14`} width={W * S} height={14 * S} preserveAspectRatio="none">
        <Path d={`M 1 1 L ${W - 1} 1 L ${W - 2} 3 L 2 3 Z`} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={3} width={W - 2} height={10} fill="#CBD5E1" stroke={C} strokeWidth={0.5} />
        {Array.from({ length: w }).map((_, i) => (
          <Rect key={i} x={3 + i * 16} y={5} width={12} height={6} fill={door} stroke={C} strokeWidth={0.4} />
        ))}
      </Svg>
    </Box>
  );
}

export function Chair({ x, y, color = '#FED7AA' }: { x: number; y: number; color?: string }) {
  return (
    <Box x={x} y={y} offX={2} offY={1} w={12} h={14}>
      <Svg viewBox="0 0 12 14" width={12 * S} height={14 * S}>
        <Rect x={2} y={1} width={8} height={5} rx={1} fill={color} stroke={C} strokeWidth={0.4} />
        <Rect x={2} y={6} width={8} height={3} fill={mixC(color, C, 0.2)} stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={9} width={1.5} height={4} fill="#6B7280" />
        <Rect x={7.5} y={9} width={1.5} height={4} fill="#6B7280" />
      </Svg>
    </Box>
  );
}

export function Plant({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={16} h={22}>
      <Svg viewBox="0 0 16 22" width={16 * S} height={22 * S}>
        <Circle cx={8} cy={7} r={6} fill="#3E6B3A" stroke={C} strokeWidth={0.4} />
        <Circle cx={5} cy={5} r={3} fill="#5E9554" />
        <Circle cx={10} cy={8} r={2.5} fill="#5E9554" />
        <Path d="M 4 14 L 12 14 L 11 21 L 5 21 Z" fill="#C8A165" stroke={C} strokeWidth={0.5} />
        <Rect x={4} y={14} width={8} height={1.5} fill="#D9B988" />
      </Svg>
    </Box>
  );
}

/** Render a clinic-equipment object by type. Returns null if not a clinic type. */
export function ClinicObjectView({ object }: { object: MapObject }): React.ReactElement | null {
  const { type, x, y, props } = object;
  const num = (k: string, d: number) => (typeof props?.[k] === 'number' ? (props[k] as number) : d);
  const str = (k: string, d: string) => (typeof props?.[k] === 'string' ? (props[k] as string) : d);
  switch (type) {
    case 'ultrasound': return <UltrasoundCart x={x} y={y} />;
    case 'xray': return <XrayViewbox x={x} y={y} />;
    case 'castcart': return <CastCart x={x} y={y} />;
    case 'crutches': return <Crutches x={x} y={y} />;
    case 'dermlamp': return <DermLamp x={x} y={y} />;
    case 'laser': return <LaserUnit x={x} y={y} />;
    case 'stool': return <ExamStool x={x} y={y} color={str('color', '#4B5563')} />;
    case 'bonemodel': return <BoneModel x={x} y={y} />;
    case 'shelf': return <SkincareShelf x={x} y={y} w={num('w', 3)} />;
    case 'clinicReception': return <ClinicReception x={x} y={y} w={num('w', 6)} tone={str('tone', '#0E7490')} />;
    case 'cabinet': return <Cabinet x={x} y={y} w={num('w', 2)} variant={str('variant', 'supply')} />;
    case 'chair': return <Chair x={x} y={y} color={str('color', '#FED7AA')} />;
    case 'plant': return <Plant x={x} y={y} />;
    default: return null;
  }
}
