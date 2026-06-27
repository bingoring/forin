// Flagship campus landmark buildings — v8 2.5D rework (5f-i). Ports of
// buildings-v2.jsx. The campus is viewed from a slightly-elevated diagonal, so
// every landmark shows BOTH a front face AND a flat rectangular TOP face
// (Block3D). Authored in the reference's px (TILE=16) and scaled to render px by
// a single parent transform (RS = TILE/16) — no per-value scaling.
//
// CSS gradients/glow from the reference are approximated with solid fills + a
// couple of accent layers (consistent with the existing pixel-object style; an
// expo-linear-gradient upgrade is a possible later fidelity pass). The brick
// 여성소아 building + cupola stay as a react-native-svg port.
//
// landmark kinds (props.landmark): main=본관 MedCenter · horizontal=외래·진단 ·
// victorian=여성소아 · curved=암센터 · admin=행정(flat) · clock=시계탑.
import { useEffect, useState, type ReactElement } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Line, Path, Pattern, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import { fonts } from '@/theme/tokens';
import type { MapObject } from '@engine';

const INK = '#2A2522';
const RS = TILE / 16; // reference px → render px

// ── Block3D: front face + a big rectangular TOP face (the 2.5D extrusion). All
// values in reference px. `front`/`top` are solid colors (gradient mids). ──
function Block3D({
  left = 0, bottom = 0, fw, fh, d = 14, front, top, radius = 0, topInset, topRim, glow, children,
}: {
  left?: number; bottom?: number; fw: number; fh: number; d?: number; front: string; top: string;
  radius?: number; topInset?: boolean; topRim?: string; glow?: string; children?: React.ReactNode;
}) {
  const td = Math.round(d * 2.3); // visible roof depth (high POV)
  return (
    <View style={{ position: 'absolute', left, bottom, width: fw, height: fh }}>
      {/* TOP face — rectangle, flush with the front face (no right overhang) */}
      <View style={{ position: 'absolute', left: 0, top: -td, width: fw, height: td + 2, backgroundColor: topInset ? (topRim ?? top) : top, borderLeftWidth: 2, borderRightWidth: 2, borderTopWidth: 2, borderColor: INK, borderTopLeftRadius: radius, borderTopRightRadius: radius }}>
        {topInset ? <View style={{ position: 'absolute', left: 4, right: 4, top: 4, bottom: 4, backgroundColor: top, borderWidth: 2, borderColor: INK }} /> : null}
      </View>
      {/* FRONT face */}
      <View style={{ position: 'absolute', left: 0, top: 0, width: fw, height: fh, backgroundColor: front, borderWidth: 2, borderColor: INK, overflow: 'hidden', borderTopLeftRadius: radius, borderTopRightRadius: radius }}>
        {glow ? <View style={{ position: 'absolute', left: -2, right: -2, top: -2, height: 4, backgroundColor: glow }} /> : null}
        {children}
      </View>
    </View>
  );
}

// dusk-lit window grid for tower fronts (reference `grid`)
function grid(cols: number, rows: number, litRatio: number, salt: number, on: string, off: string) {
  const cells: ReactElement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = ((c * 7 + r * 13 + salt * 31) % 10) < litRatio * 10;
      cells.push(
        <View key={`${r}-${c}`} style={{ position: 'absolute', left: `${(c + 0.5) * (100 / cols)}%`, top: `${(r + 0.5) * (100 / rows)}%`, width: `${(100 / cols) * 0.62}%`, height: `${(100 / rows) * 0.5}%`, marginLeft: `${-(100 / cols) * 0.31}%`, marginTop: `${-(100 / rows) * 0.25}%`, backgroundColor: lit ? on : off }} />,
      );
    }
  }
  return cells;
}

function Plaque({ sign, signColor, label }: { sign?: string; signColor?: string; label?: string }) {
  return (
    <>
      {sign ? (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 27, alignItems: 'center' }}>
          <View style={{ backgroundColor: signColor ?? '#D14B3D', borderWidth: 1.5, borderColor: INK, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: '#fff' }}>{sign}</Text>
          </View>
        </View>
      ) : null}
      {label ? (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 43, alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: INK, paddingHorizontal: 4, paddingVertical: 1 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: INK }}>{label}</Text>
          </View>
        </View>
      ) : null}
    </>
  );
}

// ── 본관 · MAIN MEDICAL TOWER — 3 towers on a podium ──
function MedCenter({ w, h, label, sign, signColor }: LMProps) {
  const pw = w * 16;
  const ph = h * 16;
  return (
    <View style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph }}>
      <View style={{ position: 'absolute', left: pw, bottom: 0, width: 16, height: ph - 4, backgroundColor: 'rgba(40,32,28,0.28)' }} />
      {/* left dark-glass tower */}
      <Block3D left={24} bottom={16} fw={40} fh={150} d={11} front="#34414E" top="#4C5A68">
        {grid(4, 16, 0.45, 1, '#FFE3A0', '#1E2832')}
      </Block3D>
      {/* right white-stone tower */}
      <Block3D left={92} bottom={16} fw={40} fh={120} d={10} front="#D9D2C0" top="#EDE7D6">
        {grid(4, 12, 0.28, 5, '#FFEDB0', '#A9B7C0')}
      </Block3D>
      {/* center amber atrium (showpiece, tallest) */}
      <Block3D left={62} bottom={16} fw={32} fh={166} d={12} front="#F0B648" top="#F2C257" glow="#FFF0BE">
        <View style={{ position: 'absolute', left: '14%', right: '14%', top: '8%', bottom: 0, backgroundColor: '#FCE39A', opacity: 0.9 }} />
      </Block3D>
      {/* glass bridge */}
      <View style={{ position: 'absolute', left: 56, bottom: 78, width: 8, height: 20, backgroundColor: '#8FB8D2', borderWidth: 1.5, borderColor: INK }} />
      {/* podium + entrance */}
      <Block3D left={-4} bottom={0} fw={pw + 8} fh={28} d={11} front="#CFC8B6" top="#E2DBC8">
        <View style={{ position: 'absolute', left: 6, right: 6, top: 7, height: 6, backgroundColor: '#F4D27A' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -18, bottom: 0, width: 36, height: 18, backgroundColor: '#28333D', borderWidth: 2, borderBottomWidth: 0, borderColor: INK }}>
          <View style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 3, backgroundColor: '#FFE6A6' }} />
        </View>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -24, bottom: 16, width: 48, height: 5, backgroundColor: '#9FA8B0', borderWidth: 1.5, borderColor: INK }} />
      </Block3D>
      <Plaque sign={sign} signColor={signColor ?? '#D14B3D'} label={label} />
    </View>
  );
}

// ── 외래·진단 · HORIZONTAL — sun-shade ribbon facade + flat top ──
function MedCenterH({ w, h, label, sign, signColor }: LMProps) {
  const pw = w * 16;
  const ph = h * 16;
  const facadeH = 100;
  const floors = 5;
  const signH = 10;
  const groundH = 16;
  const floorH = (facadeH - signH - groundH) / floors;
  const cols = Math.max(3, w);
  const td = Math.round(14 * 2.3);
  return (
    <View style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph }}>
      <View style={{ position: 'absolute', left: pw, bottom: 0, width: 14, height: facadeH, backgroundColor: 'rgba(40,32,28,0.30)' }} />
      {/* top roof rectangle */}
      <View style={{ position: 'absolute', left: 0, top: ph - facadeH - td, width: pw, height: td + 2, backgroundColor: '#D2D7DB', borderLeftWidth: 2, borderRightWidth: 2, borderTopWidth: 2, borderColor: INK }} />
      {/* front facade */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: facadeH, borderWidth: 2, borderColor: INK, backgroundColor: '#E2E7EB', overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: signH, backgroundColor: '#F6F8FA', borderBottomWidth: 1, borderColor: '#C6CCD2', flexDirection: 'row', alignItems: 'center', paddingLeft: 5 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#E06A2C' }} />
          <View style={{ width: '46%', height: 2, marginLeft: 2, backgroundColor: '#5A6E8C' }} />
        </View>
        {Array.from({ length: floors }).map((_, i) => {
          const top = signH + i * floorH;
          return (
            <View key={i}>
              <View style={{ position: 'absolute', left: 3, right: 9, top, height: floorH * 0.5, backgroundColor: '#8AA5B5' }} />
              <View style={{ position: 'absolute', left: 0, right: 0, top: top + floorH * 0.5, height: floorH * 0.5, backgroundColor: '#F4F6F8', borderTopWidth: 1, borderColor: '#C6CCD2' }} />
            </View>
          );
        })}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: groundH, backgroundColor: '#33414C' }}>
          <View style={{ position: 'absolute', left: 3, right: 3, top: 2, bottom: 4, backgroundColor: '#6E90A2', opacity: 0.85 }} />
          {Array.from({ length: cols }).map((_, i) => (
            <View key={i} style={{ position: 'absolute', bottom: 0, left: `${(i + 0.5) * (100 / cols)}%`, marginLeft: -1.5, width: 3, height: groundH, backgroundColor: '#E8EBEE', borderWidth: 1, borderColor: INK }} />
          ))}
        </View>
      </View>
      <Plaque sign={sign} signColor={signColor ?? '#0E7490'} label={label} />
    </View>
  );
}

// ── 여성소아 센터 — brick facade + flat 2.5D roof slabs + low cupola (SVG) ──
function MedCenterV({ w, h, label, sign, signColor }: LMProps) {
  const pw = w * 16;
  const ph = h * 16;
  const C = {
    brick: '#9E4A3C', brickDk: '#7E3A2E', stone: '#E0D4BB', stoneDk: '#BCA98A',
    slate: '#3B414C', slateLt: '#535B68', copper: '#5E9486', copperDk: '#3C6A5E', copperLt: '#8FBCAE', glass: '#2E3A44', lit: '#ECC766', sash: '#E0D4BB',
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
  // The brick building (viewBox 144×80, ~1.8:1) was being letterboxed into the
  // footprint box (~1.17:1) → rendered small. Draw it ~1.5× at its natural aspect,
  // bottom-anchored + centered so it rises above the footprint like the others.
  const sw = pw * 1.5;
  const sh = sw * (80 / 144);
  const sx = (pw - sw) / 2;
  return (
    <View style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph }}>
      <View style={{ position: 'absolute', left: sx + sw, bottom: 0, width: 14, height: sh - 6, backgroundColor: 'rgba(40,32,28,0.24)' }} />
      <View style={{ position: 'absolute', left: sx, bottom: 0, width: sw, height: sh }}>
      <Svg viewBox="0 0 144 80" width={sw} height={sh}>
        <Defs>
          <Pattern id="brkV8" width={9} height={6} patternUnits="userSpaceOnUse">
            <Rect width={9} height={6} fill={C.brick} />
            <Rect width={9} height={0.7} y={5.3} fill={C.brickDk} />
            <Rect width={0.7} height={3} x={0} fill={C.brickDk} />
            <Rect width={0.7} height={3} x={4.5} y={3} fill={C.brickDk} />
          </Pattern>
        </Defs>
        {/* corner turrets — flat-topped caps */}
        {[12, 132].map((cx, i) => (
          <G key={i}>
            <Rect x={cx - 7} y={30} width={14} height={50} fill="url(#brkV8)" stroke={INK} strokeWidth={0.8} />
            <Rect x={cx - 8} y={24} width={16} height={8} fill={C.slateLt} stroke={INK} strokeWidth={0.8} />
            <Rect x={cx - 5} y={26} width={10} height={4} fill={C.slate} />
            <Rect x={cx - 1.6} y={33} width={3.2} height={5} fill={C.lit} stroke={C.sash} strokeWidth={0.5} />
          </G>
        ))}
        {/* wings — brick + flat roof slab */}
        {([[16, 52], [92, 128]] as const).map(([x0, x1], i) => (
          <G key={i}>
            <Rect x={x0 + 3} y={20} width={x1 - x0 - 6} height={20} fill={C.slateLt} stroke={INK} strokeWidth={0.8} />
            <Rect x={x0 + 6} y={23} width={x1 - x0 - 12} height={14} fill={C.slate} />
            <Rect x={x0} y={40} width={x1 - x0} height={40} fill="url(#brkV8)" stroke={INK} strokeWidth={0.8} />
            <Rect x={x0} y={47} width={x1 - x0} height={1.4} fill={C.stone} />
            {winRow(x0 + 2, x1 - x0 - 4, 51, 4, i + 1, `wA${i}`)}
            <Rect x={x0} y={62} width={x1 - x0} height={1.4} fill={C.stone} />
            {winRow(x0 + 2, x1 - x0 - 4, 66, 4, i + 3, `wB${i}`)}
          </G>
        ))}
        {/* central pavilion + flat roof slab + low cupola */}
        <Rect x={53} y={18} width={38} height={14} fill={C.slateLt} stroke={INK} strokeWidth={0.9} />
        <Rect x={57} y={21} width={30} height={8} fill={C.slate} />
        <Rect x={52} y={30} width={40} height={50} fill="url(#brkV8)" stroke={INK} strokeWidth={0.9} />
        <Rect x={52} y={30} width={40} height={2} fill={C.stone} />
        <Rect x={52} y={44} width={40} height={1.4} fill={C.stone} />
        {winRow(55, 34, 34, 4, 9, 'cT')}
        {winRow(55, 34, 48, 4, 2, 'cM')}
        <Path d="M64 80 L64 70 Q72 60 80 70 L80 80 Z" fill={C.glass} stroke={C.stone} strokeWidth={1.4} />
        {/* RAISED LANTERN: an opaque short cylinder (drum) standing centered on
            the central flat roof, capped by the rotunda dome — all read from the
            high-angle view. No shading; the rounded bottom matches the wall tone
            so no back face shows through. */}
        {/* cylinder body — front wall + rounded bottom, as one outlined path */}
        <Path d="M62 14 L62 24 A10 4.5 0 0 0 82 24 L82 14 Z" fill={C.stone} stroke={INK} strokeWidth={0.8} />
        {/* lantern windows — holes following the cylinder curve: lower at center,
            rising toward the sides (center a touch wider) for a 3D read. */}
        {[-7.5, -4, 0, 4, 7.5].map((dx, i) => {
          const t = 1 - (dx / 9) ** 2;
          const ww = 1.4 + 1.2 * t;
          const top = 14 + 1.5 + 3 * t;
          return <Rect key={i} x={72 + dx - ww / 2} y={top} width={ww} height={5} fill={C.glass} />;
        })}
        {/* top rim — the surface the dome sits on */}
        <Ellipse cx={72} cy={14} rx={10} ry={4.5} fill={C.sash} stroke={INK} strokeWidth={0.6} />
        {/* rotunda dome on the rim, drawn from above */}
        <Ellipse cx={72} cy={13} rx={10} ry={5} fill={C.copper} stroke={INK} strokeWidth={0.8} />
        {[[79, 16.5], [65, 16.5], [65, 9.5], [79, 9.5]].map(([x, y], i) => (
          <Line key={i} x1={72} y1={11} x2={x} y2={y} stroke={C.copperDk} strokeWidth={0.5} opacity={0.6} />
        ))}
        <Ellipse cx={72} cy={11.5} rx={6.2} ry={3.4} fill={C.copperLt} />
        <Ellipse cx={72} cy={10.7} rx={3.2} ry={1.8} fill={C.copper} />
        <Ellipse cx={72} cy={10.2} rx={1.5} ry={0.9} fill={C.copperLt} />
        <Circle cx={72} cy={9.8} r={1.1} fill="#F0CC66" stroke={INK} strokeWidth={0.4} />
      </Svg>
      </View>
      <Plaque sign={sign} signColor={signColor ?? '#C2487E'} label={label} />
    </View>
  );
}

// ── 암센터 — eco "healing" tower: cream facade + green vertical garden +
//    glass bays + wood base + roof garden ──
function MedCenterC({ w, h, label, sign, signColor }: LMProps) {
  const pw = w * 16;
  const ph = h * 16;
  const cream = '#F3ECDD';
  const creamDk = '#E0D6C0';
  const warm = '#EAD9B8';
  const glass = '#9FCEDD';
  const green = '#5C9A52';
  const greenDk = '#3E7338';
  const greenLt = '#82BE6E';
  const wood = '#A37945';
  const woodDk = '#8E6638';
  const roof = '#EDE6D6';
  const sc = signColor ?? '#2E9E6E';
  const podH = 26;
  const towerH = ph - podH - 4;
  return (
    <View style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph }}>
      <View style={{ position: 'absolute', left: pw, bottom: 0, width: 14, height: ph - 6, backgroundColor: 'rgba(40,32,28,0.22)' }} />
      {/* tower with planted roof */}
      <Block3D left={6} bottom={podH} fw={pw - 12} fh={towerH} d={13} front={cream} top={roof} topInset topRim={creamDk}>
        {[0, 0.5, 1].map((f, i) => (
          <View key={`pl${i}`} style={{ position: 'absolute', left: `${f * 100}%`, marginLeft: -3, top: 0, bottom: 0, width: 6, backgroundColor: warm }} />
        ))}
        {[0.12, 0.62].map((f, i) => (
          <View key={`gl${i}`} style={{ position: 'absolute', left: `${f * 100}%`, top: 8, bottom: 8, width: '26%', backgroundColor: glass, borderWidth: 1.5, borderColor: INK }}>
            <View style={{ position: 'absolute', left: 1, top: 1, width: '40%', height: 4, backgroundColor: '#DCF1F6', opacity: 0.8 }} />
          </View>
        ))}
        {/* living green garden ribbon (signature) */}
        <View style={{ position: 'absolute', left: '44%', top: 2, bottom: 2, width: '12%', backgroundColor: green, borderWidth: 1.5, borderColor: INK, overflow: 'hidden' }}>
          {[0.28, 0.55, 0.82].map((t, i) => (
            <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${t * 100}%`, height: 5, backgroundColor: greenDk, opacity: 0.85 }} />
          ))}
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 6, backgroundColor: greenLt, opacity: 0.6 }} />
        </View>
        {/* sign band */}
        <View style={{ position: 'absolute', left: '30%', top: 4, width: '40%', height: 5, backgroundColor: '#fff', borderWidth: 1, borderColor: INK }} />
      </Block3D>
      {/* roof garden: planters + slim tree */}
      {[0.26, 0.5, 0.74].map((f, i) => (
        <View key={`rp${i}`} style={{ position: 'absolute', left: 6 + f * (pw - 12) - 5, bottom: podH + towerH + 6, width: 10, height: 6, backgroundColor: green, borderWidth: 1.5, borderColor: INK }} />
      ))}
      <View style={{ position: 'absolute', left: '50%', marginLeft: -2, bottom: podH + towerH + 10, width: 4, height: 12, backgroundColor: woodDk }} />
      <View style={{ position: 'absolute', left: '50%', marginLeft: -8, bottom: podH + towerH + 18, width: 16, height: 12, borderRadius: 8, backgroundColor: green, borderWidth: 1.5, borderColor: INK }} />
      {/* wood base + glazed entrance */}
      <View style={{ position: 'absolute', left: -2, right: -2, bottom: 0, height: podH, backgroundColor: wood, borderWidth: 2, borderColor: INK, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -(pw * 0.23), bottom: 0, width: '46%', height: 18, backgroundColor: glass, borderWidth: 2, borderBottomWidth: 0, borderColor: INK }}>
          <View style={{ position: 'absolute', left: '42%', bottom: 0, width: '16%', height: 10, backgroundColor: '#2E5C52' }} />
        </View>
        <View style={{ position: 'absolute', left: 6, bottom: 2, width: 18, height: 7, backgroundColor: green, borderWidth: 1, borderColor: INK }} />
        <View style={{ position: 'absolute', right: 6, bottom: 2, width: 18, height: 7, backgroundColor: green, borderWidth: 1, borderColor: INK }} />
      </View>
      <Plaque sign={sign} signColor={sc} label={label} />
    </View>
  );
}

// ── 행정·지원동 — institutional concrete admin/support block: banded office
//    facade + circulation core + glazed lobby & canopy + rooftop plant ──
function MedCenterAdmin({ w, h, label, sign, signColor }: LMProps) {
  const pw = w * 16;
  const ph = h * 16;
  const concrete = '#C8BBA6';
  const concreteDk = '#A89A82';
  const concreteLt = '#DDD3C1';
  const glassOff = '#8AA0AE';
  const glassLit = '#F2E2A8';
  const td = Math.round(13 * 2.3);
  const floors = Math.max(3, h - 1);
  return (
    <View style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph }}>
      <View style={{ position: 'absolute', left: pw, bottom: 0, width: 14, height: ph - 4, backgroundColor: 'rgba(40,32,28,0.26)' }} />
      {/* rooftop mechanical/stair penthouse (rises above the roof, toward back) */}
      <View style={{ position: 'absolute', left: pw * 0.16, top: -(td + 13), width: pw * 0.34, height: 17, backgroundColor: concreteDk, borderWidth: 2, borderColor: INK }}>
        <View style={{ position: 'absolute', left: 3, top: 3, width: 6, height: 5, backgroundColor: glassOff }} />
      </View>
      {/* rooftop HVAC units sitting on the top face */}
      <View style={{ position: 'absolute', left: pw * 0.56, top: -(td - 3), width: 17, height: 10, backgroundColor: concreteLt, borderWidth: 1.5, borderColor: INK }}>
        <View style={{ position: 'absolute', left: 2, top: 2.5, right: 2, height: 1.6, backgroundColor: concreteDk }} />
        <View style={{ position: 'absolute', left: 2, top: 5.5, right: 2, height: 1.6, backgroundColor: concreteDk }} />
      </View>
      <View style={{ position: 'absolute', left: pw * 0.8, top: -(td - 6), width: 11, height: 7, backgroundColor: concreteLt, borderWidth: 1.5, borderColor: INK }} />
      {/* main block */}
      <Block3D left={0} bottom={0} fw={pw} fh={ph} d={13} front={concrete} top={concreteLt}>
        {/* office window grid + floor slab bands */}
        {grid(Math.max(4, w), floors, 0.22, 3, glassLit, glassOff)}
        {Array.from({ length: floors - 1 }).map((_, i) => (
          <View key={`fb${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${10 + ((i + 1) / floors) * 86}%`, height: 1.5, backgroundColor: concreteDk, opacity: 0.6 }} />
        ))}
        {/* vertical circulation core (stair/elevator) */}
        <View style={{ position: 'absolute', left: '45%', top: 10, bottom: 0, width: '11%', backgroundColor: concreteDk }}>
          <View style={{ position: 'absolute', left: '30%', top: 6, width: '40%', bottom: 8, backgroundColor: glassOff, opacity: 0.7 }} />
        </View>
        {/* top parapet + signage band */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 10, backgroundColor: concreteLt, borderBottomWidth: 1.5, borderColor: concreteDk }} />
        <View style={{ position: 'absolute', left: '24%', right: '24%', top: 2.5, height: 5, backgroundColor: '#fff', borderWidth: 1, borderColor: INK }} />
        {/* ground-floor glazed lobby + flat entrance canopy */}
        <View style={{ position: 'absolute', left: '50%', marginLeft: -22, bottom: 0, width: 44, height: 16, backgroundColor: '#33414C' }}>
          <View style={{ position: 'absolute', left: 2, top: 2, right: 2, bottom: 0, backgroundColor: glassOff, opacity: 0.85 }} />
          <View style={{ position: 'absolute', left: '50%', marginLeft: -5, bottom: 0, width: 10, height: 12, backgroundColor: '#28333D', borderWidth: 1.5, borderBottomWidth: 0, borderColor: INK }} />
        </View>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -27, bottom: 15, width: 54, height: 4, backgroundColor: concreteDk, borderWidth: 1.5, borderColor: INK }} />
      </Block3D>
      <Plaque sign={sign} signColor={signColor ?? '#6B5B45'} label={label} />
    </View>
  );
}

// ── 시계탑 — timber tower + clock head (central healing garden). Drawn at full
//    size in a bottom-anchored box that's shrunk to ~60% (40% smaller) and sits
//    on the footprint bottom, rising up. The clock shows the device's time. ──
const CLOCK_SCALE = 0.6; // 40% smaller than the original
function ClockTower({ ph }: { ph: number }) {
  const wood = '#9C7A4A';
  const woodLt = '#B89866';
  const woodDk = '#6E5230';
  const woodTop = '#C2A472';
  const vine = '#5C8A3A';
  const vineDk = '#3E6326';
  const stone = '#C9CDD2';
  const stoneDk = '#9AA0A8';
  // live device clock — snapshot on mount, then tick each half-minute
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const hourAngle = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;
  const minAngle = now.getMinutes() * 6;
  const hr = (hourAngle * Math.PI) / 180;
  const mn = (minAngle * Math.PI) / 180;
  return (
    <View style={{ position: 'absolute', left: 0, top: 0, width: 6 * 16, height: ph }}>
      {/* bottom-anchored, shrunk content (base stays on the footprint) */}
      <View style={{ position: 'absolute', left: 0, bottom: 0, width: 6 * 16, height: 300, transform: [{ scale: CLOCK_SCALE }], transformOrigin: 'bottom left' }}>
      <View style={{ position: 'absolute', left: 84, bottom: 0, width: 14, height: 40, backgroundColor: 'rgba(40,32,28,0.26)' }} />
      {/* base plinth */}
      <Block3D left={2} bottom={0} fw={92} fh={40} d={9} front={woodLt} top={woodTop}>
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, backgroundColor: woodDk }} />
        <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 6, backgroundColor: woodDk }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -13, bottom: 0, width: 26, height: 26, backgroundColor: '#3A2C1C', borderTopLeftRadius: 13, borderTopRightRadius: 13, borderWidth: 2, borderColor: INK }} />
        <View style={{ position: 'absolute', left: 9, bottom: 2, width: 8, height: 5, backgroundColor: vine, borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
        <View style={{ position: 'absolute', right: 9, bottom: 2, width: 8, height: 5, backgroundColor: vine, borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
      </Block3D>
      {/* shaft */}
      <Block3D left={16} bottom={40} fw={64} fh={150} d={10} front={wood} top={woodTop}>
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, backgroundColor: woodDk }} />
        <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 8, backgroundColor: woodDk }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -3, top: 0, bottom: 0, width: 6, backgroundColor: woodDk }} />
        {[0.27, 0.73].map((fx, i) => (
          <View key={i} style={{ position: 'absolute', left: `${fx * 100}%`, marginLeft: -4.5, top: 6, bottom: 6, width: 9, backgroundColor: vine, borderWidth: 1, borderColor: vineDk }}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: '33%', height: 3, backgroundColor: vineDk }} />
            <View style={{ position: 'absolute', left: 0, right: 0, top: '66%', height: 3, backgroundColor: vineDk }} />
          </View>
        ))}
      </Block3D>
      {/* clock head */}
      <Block3D left={6} bottom={190} fw={84} fh={70} d={12} front={wood} top={woodTop} topInset topRim={woodDk}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderWidth: 7, borderColor: woodDk }} />
        {/* dial + hands as vector SVG (crisp circles/lines at small size, unlike
            View borderRadius). Hand endpoints from the device-clock angles —
            0° = 12 o'clock, x=sin, y=-cos. */}
        <View style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -25, marginTop: -25, width: 50, height: 50 }}>
          <Svg viewBox="0 0 50 50" width={50} height={50}>
            <Circle cx={25} cy={25} r={23.5} fill={stoneDk} stroke={INK} strokeWidth={2} />
            <Circle cx={25} cy={25} r={19.5} fill={stone} />
            <Circle cx={25} cy={25} r={16} fill="#FBF8EE" stroke={stoneDk} strokeWidth={0.8} />
            {[[0, -1], [1, 0], [0, 1], [-1, 0]].map(([dx, dy], i) => (
              <Circle key={i} cx={25 + dx * 13.5} cy={25 + dy * 13.5} r={1.1} fill={INK} />
            ))}
            <Line x1={25} y1={25} x2={25 + Math.sin(hr) * 8.5} y2={25 - Math.cos(hr) * 8.5} stroke="#5A3A1E" strokeWidth={2.2} strokeLinecap="round" />
            <Line x1={25} y1={25} x2={25 + Math.sin(mn) * 12.5} y2={25 - Math.cos(mn) * 12.5} stroke="#7A4A2A" strokeWidth={1.6} strokeLinecap="round" />
            <Circle cx={25} cy={25} r={2} fill={INK} />
          </Svg>
        </View>
      </Block3D>
      </View>
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
  const w = Math.max(1, typeof p.w === 'number' ? p.w : 6);
  const h = Math.max(1, typeof p.h === 'number' ? p.h : 5);
  const props: LMProps = { w, h, label: p.label as string | undefined, sign: p.sign as string | undefined, signColor: p.signColor as string | undefined };
  const kind = (p.landmark as string) ?? 'main';
  let inner: ReactElement;
  if (kind === 'clock') inner = <ClockTower ph={h * 16} />;
  else if (kind === 'horizontal') inner = <MedCenterH {...props} />;
  else if (kind === 'victorian') inner = <MedCenterV {...props} />;
  else if (kind === 'curved') inner = <MedCenterC {...props} />;
  else if (kind === 'admin') inner = <MedCenterAdmin {...props} />;
  else inner = <MedCenter {...props} />;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: object.x * TILE, top: object.y * TILE, width: w * TILE, height: h * TILE }}>
      <View style={{ position: 'absolute', left: 0, top: 0, transform: [{ scale: RS }], transformOrigin: 'top left' }}>{inner}</View>
    </View>
  );
}
