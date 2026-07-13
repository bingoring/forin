// Object footprints — pure (no RN imports) so it's unit-testable and shared by
// the engine (collision) and the renderer (art size).
import type { Bounds } from './coords';
import type { MapObject } from './types';

/** Default tile footprint per solid object type. Doors are walkable → omitted.
 * Buildings vary in size, so they take their footprint from props.w/h instead. */
export const OBJECT_FOOTPRINT: Record<string, { w: number; h: number }> = {
  bed: { w: 2, h: 3 },
  monitor: { w: 1, h: 2 },
  reception: { w: 2, h: 1 },
  tree: { w: 1, h: 1 }, // trunk tile only; the canopy overhangs (walkable)
  // ER/clinic floor equipment — solid, so they block their ground tile(s).
  // (Walk-through gates, wall-mounted screens, floor lines/tints don't block.)
  vitals: { w: 1, h: 1 },
  ivpump: { w: 1, h: 1 },
  dressing: { w: 2, h: 1 },
  medfridge: { w: 1, h: 1 },
  scanner: { w: 2, h: 1 },
  chemdrum: { w: 1, h: 1 },
  ppestand: { w: 1, h: 1 },
  wastebin: { w: 1, h: 1 },
  gurney: { w: 2, h: 3 },
  defib: { w: 1, h: 2 },
  compcart: { w: 1, h: 2 },
  oxygen: { w: 1, h: 1 },
  suction: { w: 1, h: 1 },
  wheelchair: { w: 1, h: 2 },
  watercooler: { w: 1, h: 1 },
  ekg: { w: 1, h: 2 },
  sink: { w: 1, h: 1 },
  scale: { w: 1, h: 1 },
  // shared / cross-dept primitives (interior-shared + OR/ICU/clinic catalog).
  // Ceiling/wall-mounted ones (surgicallight/xrayviewbox/bankofmonitors) and the
  // privacy drape (icurtain) are walkable → no footprint / skipped in collision.
  boltedbed: { w: 2, h: 3 },
  ibed: { w: 2, h: 3 },
  imonitor: { w: 1, h: 1 },
  iiv: { w: 1, h: 1 },
  iplant: { w: 1, h: 1 },
  examstool: { w: 1, h: 1 },
  ventilator: { w: 1, h: 2 },
  crashcart: { w: 1, h: 2 },
  pyxis: { w: 2, h: 2 },
  instrumenttray: { w: 2, h: 1 },
  castcart: { w: 1, h: 2 },
  // OR-suite floor equipment (interior-objects-or2 + OR-native). Wall/ceiling/
  // tabletop pieces (timeoutboard/orboommonitor/scrubdispenser/scrubtimer/
  // consentclipboard/statusboard) are walkable → no footprint.
  sinkor: { w: 2, h: 2 },
  anesthesia: { w: 2, h: 2 },
  bairhugger: { w: 1, h: 2 },
  bovie: { w: 1, h: 2 },
  kickbucket: { w: 1, h: 1 },
  roboticconsole: { w: 2, h: 2 },
  laptower: { w: 1, h: 2 },
  co2insufflator: { w: 1, h: 2 },
  soiledcart: { w: 1, h: 2 },
  carm: { w: 2, h: 2 },
  // ICU floor equipment (interior-objects-icu2). Wall/tabletop pieces
  // (intercom/gownbox/visitorscreen/foleybag) are walkable → no footprint.
  crrt: { w: 2, h: 2 },
  ivpumptower: { w: 1, h: 1 },
  evdstand: { w: 1, h: 1 },
  icpmonitor: { w: 1, h: 1 },
  ttmunit: { w: 2, h: 2 },
  // Peds floor equipment (interior-objects-peds2 + play). Wall/tabletop/ceiling
  // pieces (dosingchart/mural/stickerroll/tonguejar/ivboard/balloon/blocks/
  // phototherapy) are walkable → no footprint.
  incubator: { w: 2, h: 2 },
  metalcrib: { w: 2, h: 3 },
  babyscale: { w: 1, h: 1 },
  stadiometer: { w: 1, h: 2 },
  milkfridge: { w: 1, h: 2 },
  toychest: { w: 2, h: 1 },
  rockinghorse: { w: 2, h: 1 },
  smallslide: { w: 2, h: 2 },
};

/** Blocked rectangles contributed by solid objects (doors are walkable → skipped).
 * An object with explicit props.w/props.h (e.g. a building) blocks that rect. */
export function objectCollision(objects: MapObject[]): Bounds[] {
  const out: Bounds[] = [];
  for (const o of objects) {
    // walkable / non-blocking types (open doorways + floor overlays)
    // walkable / non-blocking: doorways, floor overlays, the floor triage lines,
    // and the ㄷ-desk (open well → players stand inside it). The privacy curtain
    // (icurtain) IS a solid divider — it blocks via its props.w/h rect, with the
    // bay layout leaving an opening at its open end.
    if (
      o.type === 'door' || o.type === 'threshold' || o.type === 'tint' ||
      o.type === 'triageline' || o.type === 'nursestation' ||
      // peds floor-overlay / wall / ceiling pieces (props.w/h are visual spans,
      // not collision): the play mat, wall chart, wall mural, ceiling lamp.
      o.type === 'playmat' || o.type === 'dosingchart' || o.type === 'mural' ||
      o.type === 'phototherapy' ||
      // pharmacy wall-mounted / floor-overlay / hanging pieces (props.w spans are
      // visual, not collision): hanging signs, shelf tags, floor tape, sticky mat,
      // wall shelving/phone/gauge/spill-kit, counter-top scanner.
      o.type === 'countersign' || o.type === 'shelflabel' || o.type === 'floortape' ||
      o.type === 'tackymat' || o.type === 'wallphone' || o.type === 'magnehelicgauge' ||
      o.type === 'chemospillkit' || o.type === 'barcodescanner' || o.type === 'medwallshelf'
    ) continue;
    const pw = o.props?.w;
    const ph = o.props?.h;
    if (typeof pw === 'number' && typeof ph === 'number') {
      out.push({ x: o.x, y: o.y, w: pw, h: ph });
      continue;
    }
    const fp = OBJECT_FOOTPRINT[o.type];
    if (fp) out.push({ x: o.x, y: o.y, w: fp.w, h: fp.h });
  }
  return out;
}
