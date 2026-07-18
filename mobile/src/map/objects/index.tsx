// Interior objects — RN-svg ports of the design-handoff interior catalog
// (interior-shared.jsx IBed/IReception/IDoor + interior-objects-er.jsx EKG).
// Authored at ITILE=16; rendered at TILE px (SCALE = TILE/16). Each object is a
// positioned 2.5D pixel sprite. Collision is a SEPARATE authored layer (walls);
// objects contribute their footprint to the blocked set via objectCollision().
import { Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import { fonts } from '@/theme/tokens';
import { ClinicObjectView } from './clinicEquipment';
import { LandmarkView } from './landmarks';
import { IThreshold, IGlass } from './structures';
import { ErObjectView } from './erEquipment';
import { OrObjectView } from './orEquipment';
import { IcuObjectView } from './icuEquipment';
import { PedsObjectView } from './pedsEquipment';
import { PharmaObjectView } from './pharmaEquipment';
import { WardObjectView } from './wardEquipment';
import { SurgObjectView } from './surgEquipment';
import { OrthoObjectView } from './orthoEquipment';
import { DermObjectView } from './dermEquipment';
import { InfusionObjectView } from './infusionEquipment';
import { NurseryObjectView } from './nurseryEquipment';
import { WomenKidsObjectView } from './womenkidsEquipment';
import { LdObjectView } from './ldEquipment';
import { NicuObjectView } from './nicuEquipment';
import { PicuObjectView } from './picuEquipment';
import { RadObjectView } from './radEquipment';
import { EndoObjectView } from './endoEquipment';
import { DialObjectView } from './dialEquipment';
import { SpecialtyObjectView } from './specialtyEquipment';
import { OncoObjectView } from './oncoEquipment';
import { HospiceObjectView } from './hospiceEquipment';
import { GeriObjectView } from './geriEquipment';
import { PsychObjectView } from './psychEquipment';
import { RehabObjectView } from './rehabEquipment';
import { SimObjectView } from './simEquipment';
import { LoungeObjectView } from './loungeEquipment';
import { SpdObjectView } from './spdEquipment';
import { MorgueObjectView } from './morgueEquipment';
import { SharedObjectView } from './sharedEquipment';
import type { MapObject } from '@engine';

export { OBJECT_FOOTPRINT, objectCollision } from '@engine';

const INK = '#2A2522';
const SCALE = TILE / 16;

// ─── Bed (ward, 2×3) — faithful IBed port ───────────────────────────
function Bed({ x, y, occupied }: { x: number; y: number; occupied?: boolean }) {
  const C = INK;
  const p = {
    frame: '#9CA3AF', frameDk: '#6B7280', frameLt: '#CBD5E1',
    sheet: '#FFFFFF', sheetDk: '#E5E7EB',
    blanket: '#FED7AA', blanketDk: '#E0A876', blanketHi: '#FFE9CC',
  };
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: TILE * 2, height: TILE * 3 }}>
      <Svg viewBox="0 0 32 48" width={TILE * 2} height={TILE * 3}>
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
        {/* mattress front + frame */}
        <Rect x={1} y={33} width={30} height={2} fill={p.sheetDk} />
        <Rect x={2} y={33.2} width={28} height={0.4} fill={p.sheet} />
        <Rect x={1} y={35} width={30} height={3} fill={p.frame} />
        <Rect x={2} y={35.3} width={28} height={0.6} fill={p.frameLt} />
        <Rect x={1} y={38} width={30} height={3} fill={p.frameDk} />
        <Rect x={2} y={38.4} width={28} height={0.4} fill={p.frame} />
        {/* side rails */}
        <Rect x={-1} y={14} width={3} height={14} fill={p.frameDk} />
        <Rect x={30} y={14} width={3} height={14} fill={p.frameDk} />
        {/* legs + wheels */}
        <Rect x={2} y={41} width={3} height={5} fill={p.frameDk} />
        <Rect x={27} y={41} width={3} height={5} fill={p.frameDk} />
        <Ellipse cx={3.5} cy={46.5} rx={2} ry={1.3} fill={C} />
        <Ellipse cx={28.5} cy={46.5} rx={2} ry={1.3} fill={C} />
      </Svg>
    </View>
  );
}

// ─── Monitor (vitals, EKG cart, 1×~2) — faithful EKG port ───────────
function Monitor({ x, y }: { x: number; y: number }) {
  const C = INK;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE, top: y * TILE - 2 * SCALE, width: TILE, height: TILE * 2.2 }}>
      <Svg viewBox="0 0 16 36" width={TILE} height={TILE * 2.2}>
        <Path d="M 2 2 L 14 2 L 15 4 L 1 4 Z" fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={4} width={14} height={14} fill="#E5E7EB" stroke={C} strokeWidth={0.5} />
        <Rect x={2} y={5} width={12} height={6} fill="#0F1A24" stroke={C} strokeWidth={0.4} />
        <Path d="M 3 8 L 5 8 L 6 6 L 7 10 L 8 7 L 9 8 L 11 8 L 12 6 L 13 10" fill="none" stroke="#10B981" strokeWidth={0.5} />
        <Circle cx={3} cy={13} r={1} fill="#EF4444" stroke={C} strokeWidth={0.3} />
        <Circle cx={6} cy={13} r={1} fill="#3B82F6" stroke={C} strokeWidth={0.3} />
        <Circle cx={9} cy={13} r={1} fill="#10B981" stroke={C} strokeWidth={0.3} />
        <Rect x={2} y={15} width={12} height={1.5} fill="#1F2937" />
        <Rect x={2} y={16.5} width={12} height={1} fill="#fff" />
        <Rect x={2} y={18} width={12} height={11} fill="#9CA3AF" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={19} width={10} height={2.5} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Rect x={3} y={23} width={10} height={2.5} fill="#fff" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={3} cy={32} rx={2} ry={1.5} fill={C} />
        <Ellipse cx={13} cy={32} rx={2} ry={1.5} fill={C} />
      </Svg>
    </View>
  );
}

// ─── Reception desk (2×1) — faithful IReception port ────────────────
function Reception({ x, y, w = 2, h = 1 }: { x: number; y: number; w?: number; h?: number }) {
  const W = w * 16;
  const H = h * 16 + 8;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE, top: y * TILE - 4 * SCALE, width: w * TILE, height: h * TILE + 8 * SCALE }}>
      <Svg viewBox={`0 0 ${W} ${H}`} width={w * TILE} height={h * TILE + 8 * SCALE} preserveAspectRatio="none">
        <Path d={`M 3 1 L ${w * 16 - 3} 1 L ${w * 16 - 1} ${h * 16 - 12} L 1 ${h * 16 - 12} Z`} fill="#A88862" stroke={INK} strokeWidth={0.5} />
        <Path d={`M 4 1.5 L ${w * 16 - 4} 1.5 L ${w * 16 - 5} 3 L 5 3 Z`} fill="#C49D6C" />
        <Line x1={3} y1={8} x2={w * 16 - 3} y2={8} stroke={INK} strokeWidth={0.25} opacity={0.25} />
        <Rect x={1} y={h * 16 - 12} width={w * 16 - 2} height={4} fill="#7C5A38" stroke={INK} strokeWidth={0.4} />
        <Rect x={2} y={h * 16 - 11.5} width={w * 16 - 4} height={0.7} fill="#956B40" />
        <Rect x={3} y={0} width={2} height={2} fill="#5C3A1A" stroke={INK} strokeWidth={0.3} />
        <Rect x={w * 16 - 5} y={0} width={2} height={2} fill="#5C3A1A" stroke={INK} strokeWidth={0.3} />
        <Rect x={2} y={h * 16 - 8} width={3} height={8} fill="#5C3A1A" stroke={INK} strokeWidth={0.4} />
        <Rect x={w * 16 - 5} y={h * 16 - 8} width={3} height={8} fill="#5C3A1A" stroke={INK} strokeWidth={0.4} />
        {/* monitor on desk */}
        <Rect x={w * 8 - 6} y={3} width={12} height={8} fill="#1F2937" stroke={INK} strokeWidth={0.4} />
        <Rect x={w * 8 - 5} y={4} width={10} height={6} fill="#0F1A24" />
        <Rect x={w * 8 - 4} y={5} width={8} height={0.7} fill="#10B981" />
        <Rect x={w * 8 - 4} y={6.5} width={8} height={0.7} fill="#22D3EE" />
        <Rect x={w * 8 - 1} y={11} width={2} height={1.5} fill="#4B5563" />
        {/* clipboard */}
        <Rect x={6} y={4} width={7} height={9} fill="#FEF3C7" stroke={INK} strokeWidth={0.3} />
        <Line x1={7} y1={6.5} x2={12} y2={6.5} stroke={INK} strokeWidth={0.2} />
        <Line x1={7} y1={8} x2={12} y2={8} stroke={INK} strokeWidth={0.2} />
      </Svg>
    </View>
  );
}

// ─── Door (IDoor) — walkable opening graphic. View-based (no SVG). ──
function Door({ x, y, w = 1, h = 1, kind = 'wood' }: { x: number; y: number; w?: number; h?: number; kind?: string }) {
  const vertical = h > w;
  const bg = kind === 'auto' ? '#9CD3E0' : kind === 'sterile' ? '#4F76A4' : '#7C4F2C';
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x * TILE,
        top: y * TILE,
        width: w * TILE,
        height: h * TILE,
        backgroundColor: bg,
        borderWidth: 2,
        borderColor: INK,
      }}
    >
      {/* inset accent highlight (top-left) */}
      <View style={{ position: 'absolute', left: 0, top: 0, right: '55%', bottom: '55%', backgroundColor: '#C97E3A66' }} />
      {/* hinge */}
      <View style={{ position: 'absolute', left: 2, top: 2, width: 3, height: 3, backgroundColor: INK, opacity: 0.55 }} />
      {/* handle */}
      {vertical ? (
        <View style={{ position: 'absolute', left: '50%', bottom: 4, width: 4, height: 3, marginLeft: -2, backgroundColor: '#FACC15' }} />
      ) : (
        <View style={{ position: 'absolute', right: 4, top: '50%', width: 3, height: 4, marginTop: -2, backgroundColor: '#FACC15' }} />
      )}
    </View>
  );
}

/** Render an authored object by type. Returns null for unknown types. */
// ─── Campus outdoor art (5d-ii) — port of screens-explore-v2 ───
const CP = {
  wallA: '#E8DCC0',
  door: '#5C3A1A',
  window: '#9BC8E4',
  windowFrame: '#3C2A18',
  red: '#D14242',
};
const ROOFS: Record<string, { mid: string; dk: string; lt: string }> = {
  blue: { mid: '#5C7AA8', dk: '#3C5380', lt: '#8AA8D0' },
  red: { mid: '#B0524A', dk: '#7E342E', lt: '#D58074' },
  green: { mid: '#6E9560', dk: '#4E6A42', lt: '#94BC85' },
  teal: { mid: '#5E978A', dk: '#3E6E62', lt: '#7EB0A4' },
  mauve: { mid: '#9573A0', dk: '#6E4F7C', lt: '#B89AC0' },
  white: { mid: '#E8E2D2', dk: '#A8A292', lt: '#F4F0E4' },
};
const WALL_H = TILE * 1.5; // front wall face height

// 2.5D building — roof top-face + front wall (windows + door), optional red cross / awning.
// `roofPattern` is extensible: 'solid' (default) | 'grid' (shingle texture). Future
// patterns (panels, tiles) or roof-top objects (helipad, AC) can be added here.
function Building({ x, y, w = 4, h = 4, roofKey = 'blue', roofPattern = 'solid', label, redCross, emblem, mainEntrance, accent }: {
  x: number; y: number; w?: number; h?: number; roofKey?: string; roofPattern?: 'solid' | 'grid'; label?: string; redCross?: boolean; emblem?: string; mainEntrance?: boolean; accent?: string;
}) {
  const pw = w * TILE;
  const ph = h * TILE;
  const r = ROOFS[roofKey] ?? ROOFS.blue;
  const winCount = Math.max(1, w - 2);
  const centerIdx = Math.floor((w - 1) / 2) - 1;
  const roofH = ph - WALL_H;
  const seams = roofPattern === 'grid' ? Math.max(0, w - 1) : 0;
  const rows = roofPattern === 'grid' ? Math.max(0, Math.floor(roofH / (TILE / 2)) - 1) : 0;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: pw, height: ph }}>
      {/* roof top face (+ optional shingle texture per roofPattern) */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: WALL_H, backgroundColor: r.mid, borderWidth: 2, borderColor: INK }} />
      {Array.from({ length: seams }).map((_, i) => (
        <View key={`s${i}`} style={{ position: 'absolute', left: (i + 1) * TILE, top: 2, width: 2, height: roofH - 4, backgroundColor: r.dk, opacity: 0.55 }} />
      ))}
      {Array.from({ length: rows }).map((_, j) => (
        <View key={`r${j}`} style={{ position: 'absolute', left: 2, right: 2, top: (j + 1) * (TILE / 2), height: 1, backgroundColor: r.dk, opacity: 0.4 }} />
      ))}
      <View style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 3, backgroundColor: r.lt }} />
      <View style={{ position: 'absolute', right: 2, top: 2, bottom: WALL_H + 2, width: 3, backgroundColor: r.dk, opacity: 0.5 }} />
      {/* eaves overhang */}
      <View style={{ position: 'absolute', left: -2, right: -2, bottom: WALL_H - 2, height: 4, backgroundColor: r.dk, borderWidth: 1.5, borderColor: INK }} />
      {/* roof emblem — red cross centered inside the white plaque (center the
          bars via flex so the box border can't push them off-center). */}
      {redCross ? (
        <View style={{ position: 'absolute', left: pw / 2 - 12, top: 6, width: 24, height: 24, backgroundColor: '#fff', borderWidth: 2.5, borderColor: INK, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 14, height: 14, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ position: 'absolute', width: 4, height: 14, backgroundColor: CP.red }} />
            <View style={{ position: 'absolute', width: 14, height: 4, backgroundColor: CP.red }} />
          </View>
        </View>
      ) : emblem ? (
        <View style={{ position: 'absolute', left: pw / 2 - 12, top: 6, width: 24, height: 24, backgroundColor: '#fff', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, lineHeight: 16 }}>{emblem}</Text>
        </View>
      ) : null}
      {/* front wall */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: WALL_H, backgroundColor: CP.wallA, borderLeftWidth: 2, borderRightWidth: 2, borderBottomWidth: 2, borderColor: INK }}>
        {Array.from({ length: winCount }).map((_, i) =>
          i === centerIdx ? null : (
            <View key={i} style={{ position: 'absolute', left: TILE * (i + 1) + 2, top: 5, width: TILE - 6, height: TILE - 6, backgroundColor: CP.window, borderWidth: 1.5, borderColor: CP.windowFrame }}>
              <View style={{ position: 'absolute', left: 0, right: 0, top: '45%', height: 1, backgroundColor: CP.windowFrame }} />
              <View style={{ position: 'absolute', left: '45%', top: 0, bottom: 0, width: 1, backgroundColor: CP.windowFrame }} />
            </View>
          ),
        )}
        {/* door */}
        <View style={{ position: 'absolute', left: pw / 2 - TILE / 2, bottom: 0, width: TILE, height: TILE + 4, backgroundColor: accent ?? CP.door, borderWidth: 2, borderBottomWidth: 0, borderColor: INK }}>
          <View style={{ position: 'absolute', right: 2, top: '60%', width: 2, height: 3, backgroundColor: '#E8C25A' }} />
          {mainEntrance ? <View style={{ position: 'absolute', left: -3, right: -3, top: -10, height: 8, backgroundColor: CP.red, borderWidth: 1.5, borderColor: INK }} /> : null}
        </View>
      </View>
      {label ? (
        <View style={{ position: 'absolute', left: -20, right: -20, top: -22, alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: INK, paddingHorizontal: 7, paddingVertical: 3 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: INK, letterSpacing: 0.3 }}>{label}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

// 2.5D tree — layered canopy + trunk (port of Tree v2).
function Tree({ x, y, big }: { x: number; y: number; big?: boolean }) {
  const s = big ? TILE * 2.2 : TILE * 1.7;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE - (big ? 6 : 4), top: y * TILE - (big ? 14 : 10), width: s, height: s + 6 }}>
      <Svg viewBox="0 0 20 24" width={s} height={s + 6}>
        <Ellipse cx={10} cy={22} rx={6} ry={1.5} fill="rgba(0,0,0,0.22)" />
        <Rect x={8.5} y={17} width={3} height={5} fill="#5C3A1A" stroke={INK} strokeWidth={0.5} />
        <Rect x={8.5} y={17} width={1} height={5} fill="#7B5A38" />
        <Rect x={10.5} y={17} width={1} height={5} fill="#3F2A10" />
        <Ellipse cx={10} cy={17} rx={2} ry={0.7} fill="#7B5A38" stroke={INK} strokeWidth={0.3} />
        <Circle cx={10} cy={9} r={9} fill="#274422" stroke={INK} strokeWidth={0.5} />
        <Circle cx={8.5} cy={8.5} r={7.5} fill="#3E6B3A" />
        <Circle cx={11} cy={11} r={6} fill="#3E6B3A" />
        <Circle cx={7.5} cy={7} r={4} fill="#5E9554" />
        <Circle cx={12} cy={10} r={2.5} fill="#5E9554" />
        <Path d="M 1 12 Q 10 18 19 12" fill="none" stroke={INK} strokeWidth={0.5} />
        <Circle cx={13.5} cy={9} r={0.8} fill="#EF4444" />
        <Circle cx={7} cy={11} r={0.7} fill="#EF4444" />
      </Svg>
    </View>
  );
}

export function InteriorObjectView({ object }: { object: MapObject }) {
  const { type, x, y, props } = object;
  switch (type) {
    case 'bed':
      return <Bed x={x} y={y} occupied={!!props?.occupied} />;
    case 'monitor':
      return <Monitor x={x} y={y} />;
    case 'reception':
      return <Reception x={x} y={y} w={(props?.w as number) ?? 2} h={(props?.h as number) ?? 1} />;
    case 'door':
      return <Door x={x} y={y} w={(props?.w as number) ?? 1} h={(props?.h as number) ?? 1} kind={(props?.kind as string) ?? 'wood'} />;
    case 'building':
      return (
        <Building
          x={x}
          y={y}
          w={(props?.w as number) ?? 4}
          h={(props?.h as number) ?? 4}
          roofKey={(props?.roof as string) ?? 'blue'}
          roofPattern={(props?.roofPattern as 'solid' | 'grid') ?? 'solid'}
          label={props?.label as string | undefined}
          redCross={!!props?.redCross}
          emblem={props?.emblem as string | undefined}
          mainEntrance={!!props?.mainEntrance}
          accent={props?.accent as string | undefined}
        />
      );
    case 'tree':
      return <Tree x={x} y={y} big={!!props?.big} />;
    case 'landmark':
      return <LandmarkView object={object} />;
    case 'threshold':
      return <IThreshold x={x} y={y} w={(props?.w as number) ?? 1} h={(props?.h as number) ?? 1} tone={props?.tone as string | undefined} label={props?.label as string | undefined} />;
    case 'glass':
      return <IGlass x={x} y={y} w={(props?.w as number) ?? 1} h={(props?.h as number) ?? 1} />;
    default:
      // ER (5g-a) → OR suite (5g-b) → ICU (5g-c) → shared/cross-dept primitives →
      // outpatient-clinic equipment (5d-iii)
      return (
        ErObjectView({ object }) ??
        OrObjectView({ object }) ??
        IcuObjectView({ object }) ??
        PedsObjectView({ object }) ??
        PharmaObjectView({ object }) ??
        WardObjectView({ object }) ??
        SurgObjectView({ object }) ??
        OrthoObjectView({ object }) ??
        DermObjectView({ object }) ??
        InfusionObjectView({ object }) ??
        NurseryObjectView({ object }) ??
        WomenKidsObjectView({ object }) ??
        LdObjectView({ object }) ??
        NicuObjectView({ object }) ??
        PicuObjectView({ object }) ??
        RadObjectView({ object }) ??
        EndoObjectView({ object }) ??
        DialObjectView({ object }) ??
        SpecialtyObjectView({ object }) ??
        OncoObjectView({ object }) ??
        HospiceObjectView({ object }) ??
        GeriObjectView({ object }) ??
        PsychObjectView({ object }) ??
        RehabObjectView({ object }) ??
        SimObjectView({ object }) ??
        LoungeObjectView({ object }) ??
        SpdObjectView({ object }) ??
        MorgueObjectView({ object }) ??
        SharedObjectView({ object }) ??
        ClinicObjectView({ object })
      );
  }
}
