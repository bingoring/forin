// Structural zoning primitives (5f-iii) — RN ports of the v8 interior primitives
// used to lay out the master-blueprint departments (5g):
//  • IThreshold — a leafless dark doorway between internal zones (walkable).
//  • IGlass     — a glass wall/partition (blocks, but you can see through).
//  • Tint       — a translucent floor overlay marking a special room (psych/quiet/
//                 decon/OR/ICU lighting). Non-blocking; drawn above the floor.
import { Text, View } from 'react-native';
import { TILE } from '@engine';

const INK = '#2A2522';

// ── IThreshold — open doorway (no leaf). tone 'sterile' = blue (gowning). ──
export function IThreshold({ x, y, w = 1, h = 1, tone, label }: { x: number; y: number; w?: number; h?: number; tone?: string; label?: string }) {
  const vertical = h > w;
  const fill = tone === 'sterile' ? '#16384A' : '#1A1712';
  const sill = tone === 'sterile' ? '#3E7C9A' : '#5C5648';
  // grating stripes (every half-tile across the long axis) so the dark opening
  // reads as a threshold passage rather than a flat black rect.
  const stripeCount = Math.max(1, Math.round(((vertical ? h : w) * TILE) / (TILE / 2)));
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: w * TILE, height: h * TILE, backgroundColor: fill }}>
      {Array.from({ length: stripeCount }).map((_, i) =>
        vertical ? (
          <View key={`s${i}`} style={{ position: 'absolute', left: 0, right: 0, top: i * (TILE / 2), height: 1, backgroundColor: '#000', opacity: 0.6 }} />
        ) : (
          <View key={`s${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: i * (TILE / 2), width: 1, backgroundColor: '#000', opacity: 0.6 }} />
        ),
      )}
      {/* jamb shadows on the two wall sides */}
      {vertical ? (
        <>
          <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: '#000', opacity: 0.55 }} />
          <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 2, backgroundColor: '#000', opacity: 0.55 }} />
          <View style={{ position: 'absolute', left: 1, right: 1, top: '50%', height: 2, marginTop: -1, backgroundColor: sill }} />
        </>
      ) : (
        <>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#000', opacity: 0.55 }} />
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: '#000', opacity: 0.55 }} />
          <View style={{ position: 'absolute', top: 1, bottom: 1, left: '50%', width: 2, marginLeft: -1, backgroundColor: sill }} />
        </>
      )}
      {label ? (
        <View style={{ position: 'absolute', left: 0, right: 0, top: -12, alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: INK, paddingHorizontal: 3 }}>
            <Text style={{ fontFamily: 'DungGeunMo', fontSize: 7, color: INK }}>{label}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

// ── IGlass — glass wall/partition (blocks; see-through). ──
export function IGlass({ x, y, w = 1, h = 1 }: { x: number; y: number; w?: number; h?: number }) {
  const vertical = h > w;
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: w * TILE, height: h * TILE, backgroundColor: 'rgba(191,227,238,0.30)', borderWidth: 2, borderColor: '#7FB9CC' }}
    >
      {/* inner highlight */}
      <View style={{ position: 'absolute', left: 1, top: 1, right: 1, bottom: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }} />
      {/* pane divider along the long axis */}
      {vertical ? (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, marginLeft: -1, backgroundColor: 'rgba(127,185,204,0.6)' }} />
      ) : (
        <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, marginTop: -1, backgroundColor: 'rgba(127,185,204,0.6)' }} />
      )}
    </View>
  );
}

// ── Tint — translucent room overlay (non-blocking). ──
export function Tint({ x, y, w = 1, h = 1, color = '#000000', op = 0.35 }: { x: number; y: number; w?: number; h?: number; color?: string; op?: number }) {
  return <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: w * TILE, height: h * TILE, backgroundColor: color, opacity: op }} />;
}
