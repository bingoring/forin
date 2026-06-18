// Campus outdoor map (5d-ii) — faithful-ish art: grass lawn + 2.5D buildings
// (roof + facade + windows + door) and trees, ported from screens-explore-v2.
// Buildings/trees are OBJECTS (block via footprint from props.w/h); `collision`
// is just the map perimeter. Roaming NPCs (useGridMover) amble the plaza.
import type { Interior } from '../types';

export const CAMPUS_INTERIOR: Interior = {
  id: 'CAMPUS-00001',
  deptId: 'CAMPUS',
  cols: 28,
  rows: 20,
  floorTheme: 'grass',
  playerStart: { x: 14, y: 16 },
  regions: [],
  rooms: [],
  objects: [
    // buildings (block via props.w/h footprint)
    { id: 'b-hospital', type: 'building', x: 11, y: 2, props: { w: 6, h: 5, roof: 'blue', label: '종합병원', redCross: true, mainEntrance: true } },
    { id: 'b-clinic', type: 'building', x: 3, y: 3, props: { w: 6, h: 4, roof: 'green', label: '외래 클리닉' } },
    { id: 'b-pharm', type: 'building', x: 19, y: 3, props: { w: 6, h: 4, roof: 'red', label: '약국' } },
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
