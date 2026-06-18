// Campus outdoor map (5d-ii) — faithful-ish art: grass lawn + 2.5D buildings
// (roof + facade + windows + door) and trees, ported from screens-explore-v2.
// Buildings/trees are OBJECTS (block via footprint from props.w/h); `collision`
// is just the map perimeter. Roaming NPCs (useGridMover) amble the plaza.
import type { Interior } from '@engine';

export const CAMPUS_INTERIOR: Interior = {
  id: 'CAMPUS-00001',
  deptId: 'CAMPUS',
  cols: 28,
  rows: 20,
  floorTheme: 'grass',
  scale: 0.7, // viewed from further back than interiors (handoff: campus objects look smaller)
  playerStart: { x: 14, y: 16 },
  regions: [],
  rooms: [],
  objects: [
    // Flagship landmarks (handoff v7) — bespoke MedCenter art (5d-v). `landmark`
    // dispatches the facade: default=본관(multi-tower), victorian=의과대학(brick+dome),
    // curved=암병원(curved glass+dish), horizontal=외래(sun-shade bands). Facades rise
    // above the footprint; the footprint (props.w/h) is what blocks movement.
    { id: 'b-main', type: 'landmark', x: 1, y: 3, props: { w: 6, h: 4, landmark: 'default', label: '본관 · MAIN', sign: '메디컬센터', signColor: '#B0524A' } },
    { id: 'b-medschool', type: 'landmark', x: 8, y: 3, props: { w: 5, h: 4, landmark: 'victorian', label: '의과대학', sign: 'MEDICAL SCHOOL' } },
    { id: 'b-cancer', type: 'landmark', x: 14, y: 3, props: { w: 5, h: 4, landmark: 'curved', label: '암병원', sign: 'CANCER CENTER' } },
    { id: 'b-opd', type: 'landmark', x: 20, y: 3, props: { w: 6, h: 4, landmark: 'horizontal', label: '외래 클리닉', sign: 'OUTPATIENT' } },
    // trees (trunk-only collision; canopy overhangs)
    { id: 't1', type: 'tree', x: 5, y: 11, props: { big: true } },
    { id: 't2', type: 'tree', x: 23, y: 10 },
    { id: 't3', type: 'tree', x: 2, y: 15 },
    { id: 't4', type: 'tree', x: 25, y: 16, props: { big: true } },
    { id: 't5', type: 'tree', x: 16, y: 18 },
  ],
  hotspots: [],
  collision: [
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 0, w: 1, h: 20 },
    { x: 27, y: 0, w: 1, h: 20 },
    { x: 0, y: 19, w: 28, h: 1 },
  ],
  // Roaming campus life — nurses patrol the paths, visitors/patients/kids wander the plaza.
  npcs: [
    { id: 'c-nurse', kind: 'nurse', mode: 'patrol', seed: 3, path: [{ x: 6, y: 12 }, { x: 22, y: 12 }, { x: 22, y: 15 }, { x: 6, y: 15 }] },
    { id: 'c-visitor', kind: 'visitor', mode: 'wander', seed: 17, bound: { x: 3, y: 9, w: 9, h: 8 }, start: { x: 7, y: 12 } },
    { id: 'c-patient', kind: 'patient', mode: 'wander', seed: 31, bound: { x: 16, y: 9, w: 9, h: 8 }, start: { x: 20, y: 12 } },
    { id: 'c-child', kind: 'child', mode: 'wander', seed: 42, bound: { x: 10, y: 13, w: 9, h: 5 }, start: { x: 14, y: 14 }, tickMs: 1400 },
    { id: 'c-doctor', kind: 'doctor', mode: 'patrol', seed: 9, path: [{ x: 13, y: 9 }, { x: 13, y: 17 }] },
  ],
};
