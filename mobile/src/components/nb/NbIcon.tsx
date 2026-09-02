// The 근무 수첩 icon set — 24×24 pen doodles.
//
// A 1.7pt ink stroke with a weak watercolour fill. Deliberately weak: the drawing is the
// stroke, and a strong fill turns a pen sketch into a sticker.
//
// This is the notebook line's icon system, beside FIcon (the pixel line's). Two sets
// rather than one because they are not the same drawing at different sizes — FIcon is
// built from square pixels on a grid, these are strokes with rounded caps. A screen uses
// one set or the other, matching the line it belongs to.
//
// Ported from reference/forin-notebook.jsx (NbIcon): every path is the same path. An
// unknown name falls back to `star`, which is what the prototype does — and the reason
// the handoff warns to add an icon to the set BEFORE using its name, since a fallback is
// silent.
import type { ReactElement } from 'react';
import { Circle, Ellipse, G, Path, Rect, Svg } from 'react-native-svg';
import { nb } from '@/theme/nb';

export type NbIconName =
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronDown'
  | 'chevronUp'
  | 'cross'
  | 'check'
  | 'home'
  | 'hospital'
  | 'board'
  | 'lab'
  | 'me'
  | 'mic'
  | 'speaker'
  | 'siren'
  | 'scalpel'
  | 'baby'
  | 'monitor'
  | 'pill'
  | 'bandage'
  | 'bell'
  | 'star'
  | 'magnify'
  | 'bulb'
  | 'trophy'
  | 'speech'
  | 'compass'
  | 'chartup'
  | 'shield'
  | 'handshake2'
  | 'pushpin'
  | 'stetho'
  | 'plane'
  | 'coffee'
  | 'gear'
  | 'calendar'
  | 'lock'
  | 'pencil';

export function NbIcon({ name, size = 20, color = nb.ink }: {
  name: NbIconName | string;
  size?: number;
  color?: string;
}) {
  // The shared stroke, spread into every shape. `fill: 'none'` matters: react-native-svg
  // defaults a shape's fill to black, so an outline that forgot the spread would come out
  // a solid blob rather than a drawing.
  // Spread FIRST, so a shape's own `fill` wins.
  //
  // The prototype spreads it LAST — `<rect fill={wash.yellow} {...P}/>` — and JSX gives
  // the later prop, so every watercolour fill in the reference was silently overwritten
  // with 'none'. The washes are authored per icon with per-icon colours and the handoff
  // defines the set as "1.7px 스트로크 + 옅은 수채 필", so the intent is not in doubt;
  // what shipped in the HTML was outline-only by accident. Order fixed here.
  const P = { stroke: color, strokeWidth: 1.7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const, fill: 'none' };
  const SET: Record<string, ReactElement> = {
    // Added for the passport flow's back and next controls. The handoff's rule is to add
    // an icon to the set BEFORE using its name, because a missing name falls back to the
    // star in silence — and the app's own ratchet (theme/glyphs.test.ts) bans the ‹ › these
    // replace: a typographic arrow renders at whatever weight the font decides, next to
    // icons drawn at 1.7.
    chevronLeft: (
      <G><Path {...P} d="M14.5 5 L8 12 L14.5 19"/></G>
    ),
    chevronRight: (
      <G><Path {...P} d="M9.5 5 L16 12 L9.5 19"/></G>
    ),
    // The accordion's ∨ / ∧. Drawn rather than typed: the prototype uses the characters,
    // and theme/glyphs.test.ts ratchets those down for the reason it names — a glyph
    // renders at whatever weight the font decides, beside icons drawn at 1.7.
    chevronDown: (
      <G><Path {...P} d="M5 9.5 L12 16 L19 9.5"/></G>
    ),
    chevronUp: (
      <G><Path {...P} d="M5 14.5 L12 8 L19 14.5"/></G>
    ),
    // The way out and the way to finish. Drawn, not typed: ✕ and ✓ are in the ratchet
    // (theme/glyphs.test.ts) for the reason it names — they render at the font's weight,
    // beside icons drawn at 1.7.
    cross: (
      <G><Path {...P} d="M6 6 L18 18 M18 6 L6 18"/></G>
    ),
    check: (
      <G><Path {...P} strokeWidth={2.4} d="M5 12.5 L10 17.5 L19.5 6.5"/></G>
    ),
    home: (
      <G><Path {...P} d="M4.5 11.5 L12 4.5 L19.5 11.5"/><Path {...P} d="M6.5 10.5 V19 H17.5 V10.5"/><Rect {...P} x="10" y="13.5" width="4" height="5.5" fill={nb.wash.yellow}/></G>
    ),
    hospital: (
      <G><Rect {...P} x="5" y="5" width="14" height="14.5" rx="1.5" fill={nb.wash.blue}/><Path d="M12 9 V15 M9 12 H15" stroke={nb.red} strokeWidth="2.4" strokeLinecap="round"/></G>
    ),
    board: (
      <G><Rect {...P} x="6" y="4.5" width="12" height="15" rx="1.5"/><Path {...P} d="M9.5 4.5 V3 H14.5 V4.5"/><Path {...P} d="M9 10 H15 M9 13 H13.5 M9 16 H14.5"/><Path d="M8.7 7.2 L10 8.3 L12 6" stroke={nb.green} strokeWidth="1.7" fill="none" strokeLinecap="round"/></G>
    ),
    lab: (
      <G><Path {...P} d="M6 5.5 Q12 3.5 18 5.5 V18.5 Q12 16.5 6 18.5 Z" fill={nb.wash.green}/><Path {...P} d="M12 4.8 V17.3"/><Path {...P} d="M8 9 Q10 8.4 10.5 8.6 M8 12 Q10 11.4 10.5 11.6"/></G>
    ),
    me: (
      <G><Circle {...P} cx="12" cy="9" r="4" fill={nb.wash.peach}/><Path {...P} d="M5.5 19.5 Q6 14 12 14 Q18 14 18.5 19.5" fill={nb.wash.blue}/></G>
    ),
    mic: (
      <G><Rect {...P} x="9.5" y="4" width="5" height="9" rx="2.5" fill={nb.wash.red}/><Path {...P} d="M6.5 11 Q12 16.5 17.5 11"/><Path {...P} d="M12 14.8 V18.5 M9.5 18.5 H14.5"/></G>
    ),
    speaker: (
      <G><Path {...P} d="M5 10 H8 L12.5 5.8 V18.2 L8 14 H5 Z" fill={nb.wash.blue}/><Path {...P} d="M15.5 9.5 Q17 12 15.5 14.5 M18 7 Q20.7 12 18 17"/></G>
    ),
    siren: (
      <G><Path {...P} d="M7.5 14.5 A4.5 4.5 0 0 1 16.5 14.5" fill={nb.wash.red}/><Path {...P} d="M5.5 14.5 H18.5 V17.5 H5.5 Z"/><Path d="M12 4.5 V7 M6.5 6.5 L8.2 8.6 M17.5 6.5 L15.8 8.6" stroke={nb.red} strokeWidth="1.7" strokeLinecap="round"/></G>
    ),
    scalpel: (
      <G><Path {...P} d="M5 17.5 C9 16.5 13 13.5 16 9.8 L18.7 6.2 C19.6 7.3 19.4 8.8 18.4 10.2 C15.4 14.2 10.4 17 5 17.5 Z" fill={nb.wash.blue}/><Path {...P} d="M15.8 9.5 L17.8 11.4"/></G>
    ),
    baby: (
      <G><Circle {...P} cx="12" cy="13" r="6" fill={nb.wash.peach}/><Path {...P} d="M12 7 Q11.2 4.8 13.4 4.2"/><Circle cx="10" cy="12.5" r="0.7" fill={nb.ink} stroke="none"/><Circle cx="14" cy="12.5" r="0.7" fill={nb.ink} stroke="none"/><Path {...P} d="M10.8 15.4 Q12 16.4 13.2 15.4"/></G>
    ),
    monitor: (
      <G><Rect {...P} x="4.5" y="6" width="15" height="10.5" rx="1.5" fill={nb.wash.blue}/><Path d="M7 11.5 H9.2 L10.6 9 L12.4 13.8 L13.8 11.5 H17" stroke={nb.green} strokeWidth="1.7" fill="none" strokeLinejoin="round" strokeLinecap="round"/><Path {...P} d="M10 19 H14"/></G>
    ),
    pill: (
      <G transform="rotate(-32 12 12)"><Rect {...P} x="4.5" y="9" width="15" height="6" rx="3"/><Path {...P} d="M12 9 V15"/><Path d="M12.4 9.5 H16 A2.6 2.6 0 0 1 16 14.5 H12.4 Z" fill={nb.wash.green} stroke="none"/></G>
    ),
    bandage: (
      <G transform="rotate(-28 12 12)"><Rect {...P} x="4" y="9" width="16" height="6" rx="3" fill={nb.wash.peach}/><Path {...P} d="M9.3 9 V15 M14.7 9 V15"/><Circle cx="11.3" cy="11" r="0.5" fill={nb.ink} stroke="none"/><Circle cx="12.7" cy="13" r="0.5" fill={nb.ink} stroke="none"/><Circle cx="12.7" cy="11" r="0.5" fill={nb.ink} stroke="none"/><Circle cx="11.3" cy="13" r="0.5" fill={nb.ink} stroke="none"/></G>
    ),
    bell: (
      <G><Path {...P} d="M12 4.5 Q7 5.5 7 11 L6 15.5 H18 L17 11 Q17 5.5 12 4.5 Z" fill={nb.wash.yellow}/><Path {...P} d="M10.3 18 Q12 19.6 13.7 18"/></G>
    ),
    star: (
      <G><Path {...P} d="M12 4 L14 9.3 L19.5 9.6 L15.2 13 L16.7 18.5 L12 15.3 L7.3 18.5 L8.8 13 L4.5 9.6 L10 9.3 Z" fill={nb.wash.yellow}/></G>
    ),
    magnify: (
      <G><Circle {...P} cx="10.5" cy="10.5" r="5.5" fill={nb.wash.blue}/><Path {...P} d="M14.7 14.7 L19 19"/></G>
    ),
    bulb: (
      <G><Circle {...P} cx="12" cy="9.5" r="5" fill={nb.wash.yellow}/><Path {...P} d="M10.2 16 H13.8 M10.7 18.3 H13.3"/><Path {...P} d="M11 14.5 L11 12.5 M13 14.5 L13 12.5"/><Path d="M12 2 V3.2 M5.5 5 L6.6 6 M18.5 5 L17.4 6" stroke={nb.ink} strokeWidth="1.4" strokeLinecap="round"/></G>
    ),
    trophy: (
      <G><Path {...P} d="M8 5 H16 V10 A4 4 0 0 1 8 10 Z" fill={nb.wash.yellow}/><Path {...P} d="M8 6.5 H5.5 A2.5 2.5 0 0 0 8 9.5 M16 6.5 H18.5 A2.5 2.5 0 0 1 16 9.5"/><Path {...P} d="M12 14 V16.5 M9 19 H15 M10 19 Q10 16.5 12 16.5 Q14 16.5 14 19"/></G>
    ),
    speech: (
      <G><Path {...P} d="M4.5 6.5 Q4.5 4.5 6.5 4.5 H17.5 Q19.5 4.5 19.5 6.5 V13 Q19.5 15 17.5 15 H10 L6 18.5 V15 Q4.5 15 4.5 13 Z" fill={nb.wash.blue}/><Path {...P} d="M8 8.5 H16 M8 11.5 H13"/></G>
    ),
    compass: (
      <G><Circle {...P} cx="12" cy="12" r="7.5" fill={nb.wash.yellow}/><Path {...P} d="M14.8 9.2 L13 13 L9.2 14.8 L11 11 Z" fill={nb.wash.red}/><Circle cx="12" cy="12" r="0.8" fill={nb.ink} stroke="none"/></G>
    ),
    chartup: (
      <G><Path {...P} d="M4.5 4.5 V19 H19.5"/><Path d="M7.5 15.5 L11 11.5 L13.5 13.5 L18.5 7" stroke={nb.green} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><Path d="M15.5 6.5 H18.8 V9.8" stroke={nb.green} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></G>
    ),
    shield: (
      <G><Path {...P} d="M12 3.5 L19 6 V12 Q19 17.5 12 20.5 Q5 17.5 5 12 V6 Z" fill={nb.wash.blue}/><Path {...P} d="M8.8 12 L11.2 14.4 L15.5 9.5"/></G>
    ),
    handshake2: (
      <G><Path {...P} d="M2 8 L8 6.5 L12 10.5 L16 6.5 L22 8"/><Path {...P} d="M8 6.5 V13 Q8 15 10 15 H14 Q16 15 16 13 V6.5"/><Path {...P} d="M10 10.5 L12 12.5 L14 10.5"/></G>
    ),
    pushpin: (
      <G><Path {...P} d="M9 3.5 H15 L14 9 H10 Z" fill={nb.wash.red}/><Path {...P} d="M7.5 9 H16.5 L15.5 12 H8.5 Z" fill={nb.wash.red}/><Path {...P} d="M12 12 V19.5"/></G>
    ),
    stetho: (
      <G><Path {...P} d="M7 3.5 V9 Q7 13 11 13 Q15 13 15 9 V3.5"/><Path {...P} d="M6 3 H8.2 M13.8 3 H16"/><Path {...P} d="M11 13 V15.5 Q11 18 14 18 Q17 18 17 15.5"/><Circle {...P} cx="17" cy="13.5" r="2.6" fill={nb.wash.yellow}/></G>
    ),
    plane: (
      <G><Path {...P} d="M3 13.5 L20 7 L15.5 15 L10 14 Z" fill={nb.wash.blue}/><Path {...P} d="M10 14 L9 18 L11.7 14.9"/><Path {...P} d="M20 7 L10 12.5"/></G>
    ),
    coffee: (
      <G><Path {...P} d="M5.5 8.5 H16 V15 Q16 18.5 10.75 18.5 Q5.5 18.5 5.5 15 Z" fill={nb.wash.peach}/><Path {...P} d="M16 10 H18 Q19.8 10 19.8 12 Q19.8 14 18 14 H16"/><Path {...P} d="M8.5 3.5 Q7.5 5 8.5 6.5 M12 3.5 Q11 5 12 6.5"/></G>
    ),
    gear: (
      <G><Path {...P} d="M12 3.5 V6 M12 18 V20.5 M3.5 12 H6 M18 12 H20.5 M6 6 L7.8 7.8 M16.2 16.2 L18 18 M18 6 L16.2 7.8 M7.8 16.2 L6 18"/><Circle {...P} cx="12" cy="12" r="5" fill={nb.wash.blue}/><Circle cx="12" cy="12" r="1.6" fill={nb.ink} stroke="none"/></G>
    ),
    calendar: (
      <G><Rect {...P} x="4.5" y="5.5" width="15" height="14" rx="1.5" fill={nb.wash.yellow}/><Path {...P} d="M4.5 9.5 H19.5"/><Path {...P} d="M8.5 3.5 V7 M15.5 3.5 V7"/><Circle cx="9" cy="13" r="0.8" fill={nb.ink} stroke="none"/><Circle cx="12.5" cy="13" r="0.8" fill={nb.ink} stroke="none"/><Circle cx="16" cy="13" r="0.8" fill={nb.ink} stroke="none"/><Circle cx="9" cy="16.3" r="0.8" fill={nb.ink} stroke="none"/></G>
    ),
    lock: (
      <G><Rect {...P} x="6.5" y="10.5" width="11" height="8.5" rx="1.5" fill={nb.wash.yellow}/><Path {...P} d="M8.5 10.5 V8 A3.5 3.5 0 0 1 15.5 8 V10.5"/><Circle cx="12" cy="14" r="1.1" fill={nb.ink} stroke="none"/><Path {...P} d="M12 15 V16.8"/></G>
    ),
    pencil: (
      <G><Path {...P} d="M14.5 5 L19 9.5 L9.5 19 L4.8 19.2 L5 14.5 Z" fill={nb.wash.yellow}/><Path {...P} d="M12.8 6.7 L17.3 11.2"/><Path {...P} d="M5 14.5 L9.5 19"/></G>
    ),
  };
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      {SET[name] ?? SET.star}
    </Svg>
  );
}
