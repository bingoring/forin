// Campus outdoor objects — react-native-svg ports of the design-handoff
// screens-explore-v2 catalog (top-down 2.5D buildings + street/garden props).
// Authored at the handoff's source px (ITILE=16) and scaled by S = TILE/16 so
// tile coords line up with the engine. Self-contained: every type here is
// `c`-namespaced or campus-only, so interiors never dispatch into it (no
// regression). Buildings carry props.w/h → they block; decor omits w/h → walkable
// (matching the handoff's free-roam plaza).
import { Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import { fonts, fs } from '@/theme/tokens';
import type { MapObject } from '@engine';

const INK = '#2A2522';
const S = TILE / 16; // source-px → screen-px (=2)

// Design-handoff campus palette (P).
const P = {
  pathLine: '#897852',
  water: '#6FA8C7', waterDeep: '#3F86A8',
  wallA: '#E8DCC0', wallShade: '#9C8866',
  door: '#5C3A1A', doorAccent: '#C97E3A',
  window: '#9BC8E4', windowFrame: '#3C2A18',
  tree: '#3E6B3A', treeLt: '#5E9554', treeDk: '#274422', trunk: '#5C3A1A',
  bush: '#5E9554',
  flower1: '#E8C25A', flower2: '#E47C7C', flower3: '#C284D6',
  red: '#D14242',
  sign: '#3C2A18',
};

// Named roof colour sets (fixtures pass a key).
export const ROOFS: Record<string, { mid: string; dk: string; lt: string }> = {
  red: { mid: '#B0524A', dk: '#7E342E', lt: '#D58074' },
  blue: { mid: '#5C7AA8', dk: '#3C5380', lt: '#8AA8D0' },
  green: { mid: '#6E9560', dk: '#4E6A42', lt: '#94BC85' },
  teal: { mid: '#5E978A', dk: '#3E6E62', lt: '#85B5A8' },
  mauve: { mid: '#9573A0', dk: '#6E4F7C', lt: '#B89BC0' },
  white: { mid: '#E8E2D2', dk: '#A8A292', lt: '#F2EDDE' },
};

// ── BUILDING — top-down roof + front wall (windows + door), roof emblem/cross,
//    wall sign plaque + hovering label. Ported from handoff Building(). ─────────
function CBuilding({ o }: { o: MapObject }) {
  const w = (o.props?.w as number) ?? 4;
  const h = (o.props?.h as number) ?? 4;
  const roof = ROOFS[(o.props?.roof as string) ?? 'blue'] ?? ROOFS.blue;
  const label = o.props?.label as string | undefined;
  const sign = o.props?.sign as string | undefined;
  const signColor = (o.props?.signColor as string) ?? P.sign;
  const emblem = o.props?.emblem as string | undefined;
  const redCross = !!o.props?.redCross;
  const mainEntrance = !!o.props?.mainEntrance;

  // Work in source px (16 per tile); render at ×S. Overhang the top so the
  // roof emblem + hovering label aren't clipped by the SVG box.
  const W = w * 16, H = h * 16;
  const wallH = 24; // 1.5 tiles front wall face
  const PADT = 20; // top overhang (label + eaves)
  const vbW = W, vbH = H + PADT;
  const winCount = Math.max(1, w - 2);
  const centerIdx = Math.floor((w - 1) / 2) - 1;

  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: o.x * TILE, top: o.y * TILE - PADT * S, width: W * S, height: (H + PADT) * S }}>
      <Svg width={W * S} height={(H + PADT) * S} viewBox={`0 0 ${vbW} ${vbH}`}>
        <G y={PADT}>
          {/* ground shadow */}
          <Rect x={3} y={H - wallH + 3} width={W} height={wallH} fill="#000" opacity={0.16} />
          {/* ROOF top face */}
          <Rect x={0} y={0} width={W} height={H - wallH} fill={roof.mid} stroke={INK} strokeWidth={1.5} />
          <Rect x={2} y={2} width={W - 4} height={3} fill={roof.lt} />
          <Rect x={W - 5} y={2} width={3} height={H - wallH - 4} fill={roof.dk} opacity={0.5} />
          {/* eaves overhang at base of roof */}
          <Rect x={-2} y={H - wallH - 3} width={W + 4} height={4} fill={roof.dk} stroke={INK} strokeWidth={1} />
          {/* FRONT WALL */}
          <Rect x={0} y={H - wallH} width={W} height={wallH} fill={P.wallA} stroke={INK} strokeWidth={1.5} />
          <Rect x={0} y={H - wallH} width={W} height={2} fill={P.wallShade} opacity={0.55} />
          {/* windows */}
          {Array.from({ length: winCount }).map((_, i) => {
            if (i === centerIdx) return null;
            const wx = 16 * (i + 1) + 2;
            return (
              <G key={i}>
                <Rect x={wx - 2} y={H - wallH + 15} width={14} height={2} fill="#8E7A5E" stroke={INK} strokeWidth={0.5} />
                <Rect x={wx} y={H - wallH + 5} width={10} height={10} fill={P.window} stroke={P.windowFrame} strokeWidth={1} />
                <Line x1={wx} y1={H - wallH + 10} x2={wx + 10} y2={H - wallH + 10} stroke={P.windowFrame} strokeWidth={0.6} />
                <Line x1={wx + 5} y1={H - wallH + 5} x2={wx + 5} y2={H - wallH + 15} stroke={P.windowFrame} strokeWidth={0.6} />
              </G>
            );
          })}
          {/* DOOR (centred) */}
          <Rect x={W / 2 - 8} y={H - 16} width={16} height={16} fill={(o.props?.accent as string) ?? P.door} stroke={INK} strokeWidth={1.5} />
          <Rect x={W / 2 - 7} y={H - 15} width={14} height={2} fill={P.doorAccent} opacity={0.7} />
          {mainEntrance && (
            <>
              <Rect x={W / 2 - 12} y={H - 3} width={24} height={3} fill="#C8C0A8" stroke={INK} strokeWidth={1} />
              <Rect x={W / 2 - 12} y={H - 26} width={24} height={7} fill={P.red} stroke={INK} strokeWidth={1} />
            </>
          )}
          {/* ROOF emblem — red cross or facility emblem plate */}
          {redCross ? (
            <G>
              <Rect x={W / 2 - 9} y={6} width={18} height={18} fill="#fff" stroke={INK} strokeWidth={1.6} />
              <Rect x={W / 2 - 2.5} y={9} width={5} height={12} fill={P.red} />
              <Rect x={W / 2 - 7} y={12.5} width={14} height={5} fill={P.red} />
            </G>
          ) : null}
        </G>
      </Svg>

      {/* facility emblem (emoji) plate — game signage, not a reward glyph */}
      {emblem && !redCross && (
        <View style={{ position: 'absolute', left: (W / 2 - 9) * S, top: (6) * S, width: 18 * S, height: 18 * S, backgroundColor: '#fff', borderWidth: 1.6, borderColor: INK, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: fs(11) * S * 0.5 }}>{emblem}</Text>
        </View>
      )}
      {/* wall sign plaque */}
      {sign && (
        <View style={{ position: 'absolute', left: 0, right: 0, top: (PADT + H - wallH - 4) * S, alignItems: 'center' }}>
          <View style={{ backgroundColor: signColor, borderWidth: 1.4, borderColor: INK, paddingHorizontal: 4, paddingVertical: 1 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: '#fff' }} numberOfLines={1}>{sign}</Text>
          </View>
        </View>
      )}
      {/* hovering label tag */}
      {label && (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderWidth: 1.4, borderColor: INK, paddingHorizontal: 4, paddingVertical: 1 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(7.5), color: INK }} numberOfLines={1}>{label}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// Small helper to place a source-px SVG sprite at a tile with sub-tile offset.
function Sprite({ o, dx = 0, dy = 0, vbW, vbH, children }: { o: MapObject; dx?: number; dy?: number; vbW: number; vbH: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: o.x * TILE + dx * S, top: o.y * TILE + dy * S, width: vbW * S, height: vbH * S }}>
      <Svg width={vbW * S} height={vbH * S} viewBox={`0 0 ${vbW} ${vbH}`}>{children}</Svg>
    </View>
  );
}

function Fountain({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} dy={-4} vbW={48} vbH={52}>
      <Ellipse cx={24} cy={24} rx={22} ry={6} fill="#A89272" stroke={INK} strokeWidth={0.8} />
      <Ellipse cx={24} cy={22.5} rx={21} ry={4.5} fill="#C4A878" />
      <Path d="M 2 24 L 46 24 L 46 30 L 2 30 Z" fill="#7B6B4E" stroke={INK} strokeWidth={0.5} />
      <Ellipse cx={24} cy={30} rx={22} ry={4} fill="#5C4E32" />
      <Ellipse cx={24} cy={23} rx={18} ry={4} fill={P.water} />
      <Ellipse cx={24} cy={22} rx={17} ry={3} fill={P.waterDeep} />
      <Ellipse cx={24} cy={18} rx={6} ry={2} fill="#A89272" stroke={INK} strokeWidth={0.4} />
      <Rect x={22} y={10} width={4} height={8} fill="#C8C0B0" stroke={INK} strokeWidth={0.4} />
      <Ellipse cx={24} cy={10} rx={3} ry={1} fill="#A89272" stroke={INK} strokeWidth={0.3} />
      <Rect x={23.5} y={3} width={1} height={7} fill={P.water} />
      <Rect x={20} y={6} width={1} height={4} fill={P.water} />
      <Rect x={27} y={6} width={1} height={4} fill={P.water} />
      <Circle cx={24} cy={3} r={1} fill="#fff" opacity={0.8} />
      <Ellipse cx={14} cy={24} rx={2} ry={0.5} fill="#fff" opacity={0.5} />
      <Ellipse cx={34} cy={24} rx={2} ry={0.5} fill="#fff" opacity={0.5} />
    </Sprite>
  );
}

function Helipad({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} vbW={64} vbH={64}>
      <Rect x={2} y={2} width={60} height={60} fill="#4A4A52" stroke="#FFEC60" strokeWidth={2.5} />
      <Circle cx={32} cy={32} r={22} fill="none" stroke="#FFEC60" strokeWidth={2.5} />
      <Rect x={20} y={18} width={6} height={28} fill="#FFEC60" />
      <Rect x={38} y={18} width={6} height={28} fill="#FFEC60" />
      <Rect x={20} y={30} width={24} height={4} fill="#FFEC60" />
    </Sprite>
  );
}

function Ambulance({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} dy={-6} vbW={14} vbH={26}>
      <Rect x={2} y={2} width={10} height={3} fill="#E5E7EB" stroke={INK} strokeWidth={0.4} />
      <Rect x={3} y={0.5} width={8} height={2} fill="#fff" stroke={INK} strokeWidth={0.4} />
      <Rect x={4} y={0.7} width={2} height={1.2} fill="#3B82F6" />
      <Rect x={8} y={0.7} width={2} height={1.2} fill={P.red} />
      <Path d="M 2 5 L 12 5 L 13 8 L 1 8 Z" fill="#A8DCEC" stroke={INK} strokeWidth={0.4} />
      <Rect x={1} y={8} width={12} height={14} fill="#fff" stroke={INK} strokeWidth={0.5} />
      <Rect x={11} y={8} width={2} height={14} fill="#E5E7EB" opacity={0.7} />
      <Rect x={1} y={11} width={12} height={2} fill={P.red} />
      <Rect x={5} y={14} width={4} height={6} fill={P.red} />
      <Rect x={3} y={16} width={8} height={2} fill={P.red} />
      <Rect x={1} y={22} width={12} height={2} fill="#94A3B8" stroke={INK} strokeWidth={0.4} />
      <Ellipse cx={1.5} cy={10} rx={1} ry={1.5} fill={INK} />
      <Ellipse cx={12.5} cy={10} rx={1} ry={1.5} fill={INK} />
      <Ellipse cx={1.5} cy={20} rx={1} ry={1.5} fill={INK} />
      <Ellipse cx={12.5} cy={20} rx={1} ry={1.5} fill={INK} />
    </Sprite>
  );
}

function ParkedCar({ o }: { o: MapObject }) {
  const color = (o.props?.color as string) ?? '#EF4444';
  const dark = color === '#EF4444' ? '#991B1B' : color === '#3B82F6' ? '#1E3A8A' : color === '#FACC15' ? '#A16207' : '#15803D';
  return (
    <Sprite o={o} dy={-4} vbW={38} vbH={24}>
      <Path d="M 11 1 L 27 1 L 28 4 L 10 4 Z" fill={color} stroke={INK} strokeWidth={0.5} />
      <Path d="M 10 4 L 28 4 L 30 8 L 8 8 Z" fill="#A8DCEC" stroke={INK} strokeWidth={0.5} />
      <Rect x={18} y={4} width={1} height={4} fill={dark} />
      <Rect x={3} y={8} width={32} height={10} fill={color} stroke={INK} strokeWidth={0.5} />
      <Rect x={3} y={16} width={32} height={2} fill={dark} opacity={0.55} />
      <Line x1={18} y1={8} x2={18} y2={18} stroke={dark} strokeWidth={0.4} opacity={0.7} />
      <Ellipse cx={8} cy={18.5} rx={3} ry={2.5} fill={INK} />
      <Ellipse cx={30} cy={18.5} rx={3} ry={2.5} fill={INK} />
      <Ellipse cx={8} cy={18.5} rx={1.5} ry={1.3} fill="#6B7280" />
      <Ellipse cx={30} cy={18.5} rx={1.5} ry={1.3} fill="#6B7280" />
      <Ellipse cx={35} cy={11} rx={1.2} ry={1.5} fill="#FACC15" stroke={INK} strokeWidth={0.3} />
    </Sprite>
  );
}

function Streetlamp({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} dy={-32} vbW={16} vbH={48}>
      <Rect x={6} y={42} width={4} height={4} fill="#4B5563" stroke={INK} strokeWidth={0.4} />
      <Rect x={7} y={12} width={2} height={30} fill="#4B5563" />
      <Rect x={7} y={12} width={1} height={30} fill="#6B7280" />
      <Rect x={3} y={3} width={10} height={2} fill="#4B5563" stroke={INK} strokeWidth={0.4} />
      <Path d="M 3 5 L 13 5 L 11 10 L 5 10 Z" fill="#4B5563" stroke={INK} strokeWidth={0.5} />
      <Rect x={6} y={8} width={4} height={3} fill="#FACC15" />
      <Rect x={5} y={9} width={6} height={2} fill="#FEF08A" />
      <Path d="M 6 11 L 10 11 L 14 18 L 2 18 Z" fill="#FEF08A" opacity={0.3} />
    </Sprite>
  );
}

function TrashCan({ o }: { o: MapObject }) {
  const color = (o.props?.color as string) ?? '#16A34A';
  const dark = color === '#16A34A' ? '#15803D' : '#1E40AF';
  return (
    <Sprite o={o} dx={2} dy={-4} vbW={12} vbH={20}>
      <Ellipse cx={6} cy={4} rx={5} ry={1.5} fill={dark} stroke={INK} strokeWidth={0.5} />
      <Ellipse cx={6} cy={3.5} rx={4} ry={1} fill="#1F2937" />
      <Path d="M 1 4 L 11 4 L 10 18 L 2 18 Z" fill={color} stroke={INK} strokeWidth={0.5} />
      <Rect x={4} y={9} width={4} height={4} fill="#fff" stroke={INK} strokeWidth={0.3} />
    </Sprite>
  );
}

function Mailbox({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} dy={-10} vbW={16} vbH={26}>
      <Rect x={7} y={14} width={2} height={11} fill="#4B5563" stroke={INK} strokeWidth={0.4} />
      <Ellipse cx={8} cy={3} rx={6} ry={2} fill="#3B82F6" stroke={INK} strokeWidth={0.5} />
      <Path d="M 2 3 L 14 3 L 14 13 L 2 13 Z" fill="#3B82F6" stroke={INK} strokeWidth={0.5} />
      <Rect x={2.5} y={3.5} width={11} height={1.2} fill="#60A5FA" />
      <Rect x={4} y={6} width={8} height={1.5} fill="#1F2937" />
      <Rect x={13} y={6} width={2} height={3} fill="#EF4444" stroke={INK} strokeWidth={0.3} />
    </Sprite>
  );
}

function Hydrant({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} dx={4} dy={2} vbW={8} vbH={14}>
      <Rect x={1} y={12} width={6} height={2} fill="#4B5563" stroke={INK} strokeWidth={0.4} />
      <Rect x={2} y={3} width={4} height={9} fill="#DC2626" stroke={INK} strokeWidth={0.4} />
      <Rect x={2} y={3.5} width={1} height={8} fill="#F87171" />
      <Rect x={0} y={6} width={2} height={3} fill="#B91C1C" stroke={INK} strokeWidth={0.3} />
      <Rect x={6} y={6} width={2} height={3} fill="#B91C1C" stroke={INK} strokeWidth={0.3} />
      <Ellipse cx={4} cy={3} rx={2.5} ry={1.2} fill="#FACC15" stroke={INK} strokeWidth={0.4} />
    </Sprite>
  );
}

function BusStop({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} dx={2} dy={-18} vbW={16} vbH={32}>
      <Rect x={7} y={14} width={2} height={16} fill="#4B5563" stroke={INK} strokeWidth={0.4} />
      <Path d="M 1 1 L 15 1 L 14 3 L 2 3 Z" fill="#1E40AF" stroke={INK} strokeWidth={0.4} />
      <Rect x={1} y={3} width={14} height={11} fill="#3B82F6" stroke={INK} strokeWidth={0.5} />
      <Rect x={3} y={5} width={10} height={3} fill="#fff" />
    </Sprite>
  );
}

function Vending({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} dy={-8} vbW={16} vbH={28}>
      <Path d="M 1 2 L 15 2 L 14 4 L 2 4 Z" fill="#94A3B8" stroke={INK} strokeWidth={0.4} />
      <Rect x={1} y={4} width={14} height={20} fill="#DC2626" stroke={INK} strokeWidth={0.5} />
      <Rect x={1} y={4} width={1} height={20} fill="#F87171" />
      <Rect x={3} y={6} width={10} height={11} fill="#1F2937" stroke={INK} strokeWidth={0.4} />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <Rect key={r * 3 + c} x={3.5 + c * 3} y={6.5 + r * 3} width={2.5} height={2.5} fill={['#FACC15', '#3B82F6', '#10B981', '#FBCFE8', '#A78BFA', '#FB923C', '#EF4444', '#22D3EE', '#84CC16'][r * 3 + c]} stroke={INK} strokeWidth={0.2} />
      )))}
      <Rect x={3} y={18} width={10} height={2} fill="#fff" stroke={INK} strokeWidth={0.3} />
      <Rect x={3} y={20.5} width={6} height={2.5} fill="#1F2937" stroke={INK} strokeWidth={0.3} />
      <Rect x={1} y={24} width={14} height={2} fill="#3F3D52" stroke={INK} strokeWidth={0.4} />
    </Sprite>
  );
}

function PicnicTable({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} dy={-4} vbW={32} vbH={32}>
      <Rect x={2} y={6} width={28} height={3} fill="#A88862" stroke={INK} strokeWidth={0.4} />
      <Rect x={2} y={11} width={28} height={6} fill="#7C4F2C" stroke={INK} strokeWidth={0.5} />
      <Rect x={3} y={11.5} width={26} height={1.2} fill="#A88862" />
      <Rect x={2} y={16} width={28} height={2} fill="#5C3A1A" stroke={INK} strokeWidth={0.4} />
      <Rect x={2} y={20} width={28} height={3} fill="#A88862" stroke={INK} strokeWidth={0.4} />
      <Line x1={5} y1={9} x2={5} y2={29} stroke="#5C3A1A" strokeWidth={2} />
      <Line x1={27} y1={9} x2={27} y2={29} stroke="#5C3A1A" strokeWidth={2} />
    </Sprite>
  );
}

function Hedge({ o }: { o: MapObject }) {
  const w = (o.props?.hw as number) ?? 2;
  const W = w * 16;
  return (
    <Sprite o={o} dy={-6} vbW={W} vbH={22}>
      <Rect x={1} y={2} width={W - 2} height={4} fill={P.bush} stroke={INK} strokeWidth={0.4} />
      <Rect x={2} y={2.5} width={W - 4} height={1} fill={P.treeLt} />
      <Rect x={1} y={5} width={W - 2} height={14} fill="#4E7A4E" stroke={INK} strokeWidth={0.4} />
      {Array.from({ length: Math.floor(w * 5) }).map((_, i) => (
        <Rect key={i} x={2 + i * 3} y={7} width={2} height={2} fill={P.bush} />
      ))}
      {Array.from({ length: Math.floor(w * 5) }).map((_, i) => (
        <Rect key={`b${i}`} x={3 + i * 3} y={10} width={2} height={2} fill={P.treeLt} />
      ))}
      <Rect x={1} y={17} width={W - 2} height={2} fill="#3B5C3B" />
    </Sprite>
  );
}

function BikeRack({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} dy={-4} vbW={32} vbH={22}>
      <Rect x={1} y={18} width={30} height={2} fill="#4B5563" stroke={INK} strokeWidth={0.4} />
      {[3, 14, 25].map((rx) => (
        <G key={rx}>
          <Rect x={rx} y={6} width={2} height={13} fill="#4B5563" stroke={INK} strokeWidth={0.3} />
          <Rect x={rx + 4} y={6} width={2} height={13} fill="#4B5563" stroke={INK} strokeWidth={0.3} />
          <Rect x={rx} y={6} width={6} height={2} fill="#4B5563" stroke={INK} strokeWidth={0.3} />
        </G>
      ))}
      <Circle cx={7} cy={14} r={3} fill="none" stroke={INK} strokeWidth={0.6} />
      <Circle cx={15} cy={14} r={3} fill="none" stroke={INK} strokeWidth={0.6} />
      <Rect x={7} y={8} width={9} height={1} fill="#3B82F6" />
    </Sprite>
  );
}

function LilyPad({ o }: { o: MapObject }) {
  const c = (o.props?.color as string) ?? '#94BC85';
  return (
    <Sprite o={o} vbW={14} vbH={8}>
      <Ellipse cx={7} cy={4} rx={6} ry={3} fill={c} stroke={INK} strokeWidth={0.5} />
      <Rect x={6} y={1} width={2} height={2} fill="#fff" />
      <Rect x={5} y={2} width={4} height={0.5} fill="#FBCFE8" />
    </Sprite>
  );
}

function BBallCourt({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} vbW={64} vbH={48}>
      <Rect x={2} y={2} width={60} height={44} fill="#B05A4C" stroke={INK} strokeWidth={1.5} />
      <Rect x={20} y={2} width={24} height={20} fill="none" stroke="#fff" strokeWidth={1.5} />
      <Path d="M 16 22 A 16 12 0 0 0 48 22" fill="none" stroke="#fff" strokeWidth={1.5} />
      <Rect x={28} y={3} width={8} height={2} fill="#fff" stroke={INK} strokeWidth={0.5} />
    </Sprite>
  );
}

function Statue({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} dy={-14} vbW={16} vbH={28}>
      <Path d="M 2 22 L 14 22 L 15 25 L 1 25 Z" fill="#A89272" stroke={INK} strokeWidth={0.4} />
      <Rect x={2} y={22} width={12} height={6} fill="#8E7A5E" stroke={INK} strokeWidth={0.5} />
      <Rect x={5} y={13} width={6} height={9} fill="#B8B098" stroke={INK} strokeWidth={0.4} />
      <Ellipse cx={8} cy={11} rx={2.5} ry={2.5} fill="#B8B098" stroke={INK} strokeWidth={0.4} />
      <Rect x={10} y={13} width={2} height={6} fill="#B8B098" stroke={INK} strokeWidth={0.3} />
      <Ellipse cx={11} cy={11} rx={1.5} ry={2} fill="#B8B098" />
    </Sprite>
  );
}

function CBench({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} dy={-6} vbW={32} vbH={22}>
      <Rect x={3} y={0} width={2} height={8} fill="#5C3A1A" />
      <Rect x={27} y={0} width={2} height={8} fill="#5C3A1A" />
      <Rect x={2} y={2} width={28} height={3} fill="#8B5A2B" stroke={INK} strokeWidth={0.4} />
      <Rect x={2} y={9} width={28} height={3} fill="#A88862" stroke={INK} strokeWidth={0.4} />
      <Rect x={2} y={12} width={28} height={2} fill="#5C3A1A" stroke={INK} strokeWidth={0.4} />
      <Rect x={3} y={14} width={3} height={7} fill="#3F2A10" stroke={INK} strokeWidth={0.4} />
      <Rect x={14.5} y={14} width={3} height={7} fill="#3F2A10" stroke={INK} strokeWidth={0.4} />
      <Rect x={26} y={14} width={3} height={7} fill="#3F2A10" stroke={INK} strokeWidth={0.4} />
    </Sprite>
  );
}

function CBush({ o }: { o: MapObject }) {
  return (
    <Sprite o={o} vbW={16} vbH={16}>
      <Rect x={2} y={6} width={12} height={8} fill={P.bush} stroke={INK} strokeWidth={0.5} />
      <Rect x={4} y={4} width={8} height={2} fill={P.bush} />
      <Rect x={3} y={7} width={2} height={2} fill={P.treeLt} />
      <Rect x={9} y={9} width={2} height={1} fill={P.treeLt} />
    </Sprite>
  );
}

function CFlowers({ o }: { o: MapObject }) {
  const c = (o.props?.color as string) ?? P.flower2;
  return (
    <Sprite o={o} vbW={16} vbH={16}>
      <Rect x={2} y={10} width={12} height={4} fill="#7A5C32" stroke={INK} strokeWidth={0.5} />
      <Rect x={3} y={7} width={2} height={2} fill={c} />
      <Rect x={7} y={6} width={2} height={2} fill={P.flower1} />
      <Rect x={11} y={7} width={2} height={2} fill={P.flower3} />
      <Rect x={5} y={9} width={1} height={1} fill={P.treeLt} />
      <Rect x={9} y={9} width={1} height={1} fill={P.treeLt} />
    </Sprite>
  );
}

// Dispatcher — returns null for any non-campus type so the main dispatcher can
// fall through to the interior catalogs.
export function CampusObjectView({ object }: { object: MapObject }): React.ReactElement | null {
  switch (object.type) {
    case 'cbuilding': return <CBuilding o={object} />;
    case 'fountain': return <Fountain o={object} />;
    case 'helipad': return <Helipad o={object} />;
    case 'ambulance': return <Ambulance o={object} />;
    case 'parkedcar': return <ParkedCar o={object} />;
    case 'streetlamp': return <Streetlamp o={object} />;
    case 'trashcan': return <TrashCan o={object} />;
    case 'mailbox': return <Mailbox o={object} />;
    case 'hydrant': return <Hydrant o={object} />;
    case 'busstop': return <BusStop o={object} />;
    case 'vending': return <Vending o={object} />;
    case 'picnictable': return <PicnicTable o={object} />;
    case 'hedge': return <Hedge o={object} />;
    case 'bikerack': return <BikeRack o={object} />;
    case 'lilypad': return <LilyPad o={object} />;
    case 'bballcourt': return <BBallCourt o={object} />;
    case 'statue': return <Statue o={object} />;
    case 'cbench': return <CBench o={object} />;
    case 'cbush': return <CBush o={object} />;
    case 'cflowers': return <CFlowers o={object} />;
    default: return null;
  }
}
