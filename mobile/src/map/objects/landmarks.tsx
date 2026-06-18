// Flagship campus landmark buildings (5d-v) — ports of screens-explore-v2
// MedCenter / MedCenterH / MedCenterV / MedCenterC. The reference uses CSS
// gradients + glow; here MedCenter/H/C are View-based (gradients approximated
// with layered solid fills), and MedCenterV is a direct react-native-svg port
// (brick Pattern + slate mansard + copper dome). Authored at the reference's
// ~16px/tile; scaled by S=TILE/16. Footprints block via props.w/h; the facades
// rise above the footprint (overflow visible). Reserved for marquee departments.
import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import Svg, { Defs, G, Path, Pattern, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import { fonts } from '@/theme/tokens';
import type { MapObject } from '@engine';

const INK = '#2A2522';
const S = TILE / 16;

function NameTag({ label, sign, signColor, topPx }: { label?: string; sign?: string; signColor?: string; topPx: number }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: topPx, alignItems: 'center' }}>
      {sign ? (
        <View style={{ backgroundColor: signColor ?? '#3E6E62', borderWidth: 1.5, borderColor: INK, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 2 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: '#fff' }}>{sign}</Text>
        </View>
      ) : null}
      {label ? (
        <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: INK, paddingHorizontal: 6, paddingVertical: 2 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: INK }}>{label}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ── 본관 MedCenter — dark-glass tower + glowing amber atrium + white-stone tower ──
function MedCenter({ w, h, label, sign, signColor }: LMProps) {
  const pw = w * TILE;
  const ph = h * TILE;
  const L = (v: number) => v * S;
  const win = (left: number, top: number, lit: boolean) => (
    <View style={{ position: 'absolute', left: L(left), top: L(top), width: L(2.4), height: L(1.6), backgroundColor: lit ? '#FFE3A0' : '#1E2832' }} />
  );
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph }}>
      {/* left dark-glass tower */}
      <View style={{ position: 'absolute', left: L(0), width: L(38), bottom: L(16), height: L(146), backgroundColor: '#30414E', borderWidth: 2, borderColor: INK }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: L(4), backgroundColor: '#5E6C7A' }} />
        {[0, 1, 2, 3, 4, 5].map((r) => [0, 1, 2].map((c) => win(4 + c * 11, 8 + r * 22, (c + r) % 2 === 0)))}
      </View>
      {/* right white-stone tower */}
      <View style={{ position: 'absolute', left: L(60), width: L(38), bottom: L(16), height: L(118), backgroundColor: '#D8D1BE', borderWidth: 2, borderColor: INK }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: L(4), backgroundColor: '#F0EAD8' }} />
        {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => win(64 + c * 11, 8 + r * 24, (c + r) % 3 === 0)))}
      </View>
      {/* connecting glass bridge */}
      <View style={{ position: 'absolute', left: L(56), width: L(12), bottom: L(72), height: L(22), backgroundColor: '#8FB8D2', borderWidth: 1.5, borderColor: INK }} />
      {/* center amber atrium (glowing) */}
      <View style={{ position: 'absolute', left: L(34), width: L(30), bottom: L(16), height: L(160), backgroundColor: '#EAA63C', borderWidth: 2, borderColor: INK, borderTopLeftRadius: L(9), borderTopRightRadius: L(9), alignItems: 'center' }}>
        <View style={{ position: 'absolute', left: '16%', right: '16%', top: '9%', bottom: 0, backgroundColor: '#FBE3A0', opacity: 0.92 }} />
      </View>
      {/* center crown */}
      <View style={{ position: 'absolute', left: L(37), width: L(24), bottom: L(176), height: L(8), backgroundColor: '#D89A38', borderWidth: 1.5, borderColor: INK, borderTopLeftRadius: L(7), borderTopRightRadius: L(7) }} />
      {/* podium + entrance */}
      <View style={{ position: 'absolute', left: L(-4), right: L(-4), bottom: 0, height: L(24), backgroundColor: '#CFC8B6', borderWidth: 2, borderColor: INK }}>
        <View style={{ position: 'absolute', left: L(4), right: L(4), top: L(6), height: L(6), backgroundColor: '#F4D27A' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -L(17), bottom: 0, width: L(34), height: L(15), backgroundColor: '#28333D', borderWidth: 2, borderColor: INK }} />
      </View>
      <NameTag label={label} sign={sign} signColor={signColor} topPx={-L(34)} />
    </View>
  );
}

// ── 외래 MedCenterH — sun-shade bands over dark-glass ribbon windows ──
function MedCenterH({ w, h, label, sign, signColor }: LMProps) {
  const pw = w * TILE;
  const ph = h * TILE;
  const L = (v: number) => v * S;
  const facadeH = 100;
  const floors = 5;
  const signH = 10;
  const groundH = 16;
  const floorH = (facadeH - signH - groundH) / floors;
  const cols = Math.max(3, w);
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph }}>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: L(facadeH), backgroundColor: '#E2E7EB', borderWidth: 2, borderColor: INK }}>
        {/* rooftop parapet */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: L(signH), backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#C6CCD2' }} />
        {/* ribbon windows + sun-shade fins */}
        {Array.from({ length: floors }).map((_, i) => {
          const top = signH + i * floorH;
          return (
            <View key={i}>
              <View style={{ position: 'absolute', left: L(3), right: L(9), top: L(top), height: L(floorH * 0.5), backgroundColor: '#7E97A6' }} />
              <View style={{ position: 'absolute', left: 0, right: 0, top: L(top + floorH * 0.5), height: L(floorH * 0.5), backgroundColor: '#F2F4F6' }} />
            </View>
          );
        })}
        {/* ground-floor recessed lobby + pilotis */}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: L(groundH), backgroundColor: '#33414C' }}>
          <View style={{ position: 'absolute', left: L(3), right: L(3), top: L(2), bottom: L(4), backgroundColor: '#6E90A2', opacity: 0.85 }} />
          {Array.from({ length: cols }).map((_, i) => (
            <View key={i} style={{ position: 'absolute', bottom: 0, left: `${((i + 0.5) * 100) / cols}%`, marginLeft: -L(1.5), width: L(3), height: L(groundH), backgroundColor: '#E8EBEE', borderWidth: 1, borderColor: INK }} />
          ))}
        </View>
      </View>
      <NameTag label={label} sign={sign} signColor={signColor ?? '#3E6E62'} topPx={-L(28)} />
    </View>
  );
}

// ── 암병원 MedCenterC — convex curved-glass tower + roof dish + green podium ──
function MedCenterC({ w, h, label, sign, signColor }: LMProps) {
  const pw = w * TILE;
  const ph = h * TILE;
  const L = (v: number) => v * S;
  const towerH = 96;
  const podiumH = 16;
  const bands = Math.floor(towerH / 11);
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph }}>
      {/* roof dish sculpture (signature) */}
      <View style={{ position: 'absolute', left: L(6), bottom: L(podiumH + towerH + 1), width: L(15), height: L(7), backgroundColor: '#F4F6F8', borderWidth: 1.5, borderColor: INK, borderRadius: L(4), transform: [{ rotate: '-18deg' }] }} />
      {/* curved glass tower */}
      <View style={{ position: 'absolute', left: L(2), right: L(2), bottom: L(podiumH - 2), height: L(towerH), backgroundColor: '#9FC0D2', borderWidth: 2, borderColor: INK, borderTopLeftRadius: L(24), borderTopRightRadius: L(24), borderBottomLeftRadius: L(4), borderBottomRightRadius: L(4), overflow: 'hidden' }}>
        {/* horizontal glass bands */}
        {Array.from({ length: bands }).map((_, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: L(i * 11), height: L(7), backgroundColor: '#A8C6D6' }} />
        ))}
        {/* center-lit vertical sheen */}
        <View style={{ position: 'absolute', left: '40%', right: '40%', top: 0, bottom: 0, backgroundColor: '#E9EFF3', opacity: 0.5 }} />
        {/* rooftop sign band */}
        <View style={{ position: 'absolute', left: L(10), right: L(10), top: L(7), height: L(6), backgroundColor: '#fff', borderWidth: 1, borderColor: INK }} />
      </View>
      {/* green-glass podium + entrance */}
      <View style={{ position: 'absolute', left: L(-2), right: L(-2), bottom: 0, height: L(podiumH), backgroundColor: '#6E957F', borderWidth: 2, borderColor: INK }}>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -L(11), bottom: 0, width: L(22), height: L(11), backgroundColor: '#2E3A44', borderWidth: 2, borderColor: INK }} />
      </View>
      <NameTag label={label} sign={sign} signColor={signColor ?? '#1E6FA8'} topPx={-L(20)} />
    </View>
  );
}

// ── 의과대학 MedCenterV — brick + mansard + copper dome (direct SVG port) ──
function MedCenterV({ w, h, label, sign, signColor }: LMProps) {
  const pw = w * TILE;
  const ph = h * TILE;
  const C = {
    brick: '#9E4A3C', brickDk: '#7E3A2E', stone: '#E0D4BB', stoneDk: '#BCA98A',
    slate: '#3B414C', slateLt: '#535B68', slateDk: '#2A2F38',
    copper: '#5E9486', copperDk: '#3C6A5E', copperLt: '#8FBCAE', glass: '#2E3A44', lit: '#ECC766', sash: '#E0D4BB',
  };
  const winRow = (bx: number, bw: number, by: number, count: number, salt: number, key: string) => {
    const out: ReactElement[] = [];
    const gap = bw / count;
    for (let i = 0; i < count; i++) {
      const wx = bx + i * gap + gap * 0.28;
      const ww = gap * 0.44;
      const lit = (i * 5 + salt * 7) % 10 < 3;
      out.push(
        <G key={key + i}>
          <Rect x={wx} y={by} width={ww} height={6.5} fill={lit ? C.lit : C.glass} stroke={C.sash} strokeWidth={0.6} />
          <Path d={`M${wx - 0.3} ${by} Q${wx + ww / 2} ${by - 2.6} ${wx + ww + 0.3} ${by}`} fill={C.stone} stroke={INK} strokeWidth={0.4} />
        </G>,
      );
    }
    return out;
  };
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph }}>
      <Svg viewBox="0 0 144 80" width={pw} height={ph}>
        <Defs>
          <Pattern id="brkV" width={9} height={6} patternUnits="userSpaceOnUse">
            <Rect width={9} height={6} fill={C.brick} />
            <Rect width={9} height={0.7} y={5.3} fill={C.brickDk} />
            <Rect width={0.7} height={3} x={0} fill={C.brickDk} />
            <Rect width={0.7} height={3} x={4.5} y={3} fill={C.brickDk} />
          </Pattern>
        </Defs>
        {/* corner turrets */}
        {[12, 132].map((cx, i) => (
          <G key={i}>
            <Rect x={cx - 7} y={34} width={14} height={46} fill="url(#brkV)" stroke={INK} strokeWidth={0.8} />
            <Path d={`M${cx - 9} 35 L${cx} 16 L${cx + 9} 35 Z`} fill={C.slate} stroke={INK} strokeWidth={0.8} />
            <Rect x={cx - 1.6} y={32} width={3.2} height={5} fill={C.lit} stroke={C.sash} strokeWidth={0.5} />
          </G>
        ))}
        {/* wings: brick body + mansard + dormers + windows */}
        {([[16, 52], [92, 128]] as const).map(([x0, x1], i) => (
          <G key={i}>
            <Rect x={x0} y={40} width={x1 - x0} height={40} fill="url(#brkV)" stroke={INK} strokeWidth={0.8} />
            <Path d={`M${x0 - 1} 41 L${x1 + 1} 41 L${x1 - 4} 27 L${x0 + 4} 27 Z`} fill={C.slate} stroke={INK} strokeWidth={0.8} />
            {[0.28, 0.62].map((f, d) => {
              const dx = x0 + (x1 - x0) * f;
              return (
                <G key={d}>
                  <Path d={`M${dx - 3} 34 L${dx} 29 L${dx + 3} 34 Z`} fill={C.slateLt} stroke={INK} strokeWidth={0.5} />
                  <Rect x={dx - 2} y={34} width={4} height={5} fill={C.lit} stroke={C.sash} strokeWidth={0.5} />
                </G>
              );
            })}
            <Rect x={x0} y={47} width={x1 - x0} height={1.4} fill={C.stone} />
            {winRow(x0 + 2, x1 - x0 - 4, 51, 4, i + 1, `wA${i}`)}
            <Rect x={x0} y={62} width={x1 - x0} height={1.4} fill={C.stone} />
            {winRow(x0 + 2, x1 - x0 - 4, 66, 4, i + 3, `wB${i}`)}
          </G>
        ))}
        {/* central pavilion */}
        <Rect x={52} y={30} width={40} height={50} fill="url(#brkV)" stroke={INK} strokeWidth={0.9} />
        <Rect x={52} y={30} width={40} height={2} fill={C.stone} />
        <Rect x={52} y={44} width={40} height={1.4} fill={C.stone} />
        {winRow(55, 34, 34, 4, 9, 'cT')}
        {winRow(55, 34, 48, 4, 2, 'cM')}
        <Path d="M64 80 L64 70 Q72 60 80 70 L80 80 Z" fill={C.glass} stroke={C.stone} strokeWidth={1.4} />
        {/* stone drum + copper dome + lantern */}
        <Rect x={60} y={18} width={24} height={13} rx={1} fill={C.stone} stroke={INK} strokeWidth={0.8} />
        {[64, 70.5, 77].map((wx, i) => (
          <Rect key={i} x={wx} y={21} width={3.2} height={7} fill={C.glass} />
        ))}
        <Rect x={59} y={17} width={26} height={1.6} fill={C.stoneDk} />
        <Path d="M58 18 C58 8 63 5 72 5 C81 5 86 8 86 18 Z" fill={C.copper} stroke={INK} strokeWidth={0.9} />
        <Path d="M63 16 C63 9 66 6 71 6" fill="none" stroke={C.copperLt} strokeWidth={1.4} strokeLinecap="round" />
        <Rect x={68.5} y={1} width={7} height={6} rx={1} fill={C.stone} stroke={INK} strokeWidth={0.7} />
      </Svg>
      <NameTag label={label} sign={sign} signColor={signColor ?? '#7E3A2E'} topPx={-14 * S} />
    </View>
  );
}

interface LMProps {
  w: number;
  h: number;
  label?: string;
  sign?: string;
  signColor?: string;
}

/** Render a flagship landmark by its `landmark` kind. Returns null if not a landmark. */
export function LandmarkView({ object }: { object: MapObject }): ReactElement | null {
  if (object.type !== 'landmark') return null;
  const p = object.props ?? {};
  const props: LMProps = {
    w: (p.w as number) ?? 6,
    h: (p.h as number) ?? 5,
    label: p.label as string | undefined,
    sign: p.sign as string | undefined,
    signColor: p.signColor as string | undefined,
  };
  const kind = (p.landmark as string) ?? 'default';
  const Inner = kind === 'horizontal' ? MedCenterH : kind === 'victorian' ? MedCenterV : kind === 'curved' ? MedCenterC : MedCenter;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: object.x * TILE, top: object.y * TILE, width: props.w * TILE, height: props.h * TILE }}>
      <Inner {...props} />
    </View>
  );
}
