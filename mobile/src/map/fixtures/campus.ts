// Campus outdoor map — v8 rebuild (5f-i): five landmark pavilions + central
// clock tower in a healing garden, on grass. Buildings are 2.5D `landmark`
// objects (front + flat top face); their footprints (props.w/h) block movement
// while the facades rise above. `collision` is just the map perimeter. Roaming
// NPCs amble the lower plaza. Departments live INSIDE the pavilions; entry will
// route through the Elevator (5f-ii) — for now the campus is visual exploration
// (the clinic-tab buttons still open interiors directly while the clinic engine
// is kept). Exact ground tiling/props are refinable later.
import type { Interior } from '@engine';

export const CAMPUS_INTERIOR: Interior = {
  id: 'CAMPUS-00001',
  deptId: 'CAMPUS',
  cols: 40,
  rows: 28,
  floorTheme: 'grass',
  scale: 0.6, // viewed from further back than interiors (v8: campus zoomed out)
  playerStart: { x: 20, y: 26 },
  regions: [],
  rooms: [],
  objects: [
    // Five flagship pavilions (handoff v8). Footprints block; facades rise above.
    { id: 'b-main', type: 'landmark', x: 15, y: 9, props: { w: 9, h: 8, landmark: 'main', label: '본관 · 메인 메디컬 타워', sign: '메디컬센터', signColor: '#B0524A' } },
    { id: 'b-onco', type: 'landmark', x: 2, y: 10, props: { w: 8, h: 7, landmark: 'curved', label: '암센터 · 재활관', sign: 'CANCER · REHAB' } },
    { id: 'b-women', type: 'landmark', x: 31, y: 10, props: { w: 7, h: 6, landmark: 'victorian', label: '여성소아 센터', sign: 'WOMEN · CHILDREN' } },
    { id: 'b-opd', type: 'landmark', x: 3, y: 19, props: { w: 8, h: 5, landmark: 'horizontal', label: '외래 · 진단 지원동', sign: 'OUTPATIENT · DX' } },
    { id: 'b-admin', type: 'landmark', x: 31, y: 19, props: { w: 6, h: 5, landmark: 'admin', label: '행정 · 지원동', sign: 'ADMIN' } },
    // central clock tower in the healing garden (small footprint, tall facade)
    { id: 'b-clock', type: 'landmark', x: 18, y: 19, props: { w: 4, h: 2, landmark: 'clock' } },
    // garden trees around the plaza
    { id: 't1', type: 'tree', x: 12, y: 18, props: { big: true } },
    { id: 't2', type: 'tree', x: 27, y: 18 },
    { id: 't3', type: 'tree', x: 6, y: 25 },
    { id: 't4', type: 'tree', x: 34, y: 25, props: { big: true } },
    { id: 't5', type: 'tree', x: 24, y: 24 },
  ],
  // tapping a pavilion's entrance (walk adjacent → A) opens that building's elevator
  hotspots: [
    { id: 'hs-main', kind: 'elevator', x: 19, y: 17, label: '본관', building: 'tower' },
    { id: 'hs-onco', kind: 'elevator', x: 5, y: 17, label: '암센터', building: 'onco' },
    { id: 'hs-women', kind: 'elevator', x: 34, y: 16, label: '여성소아', building: 'women' },
    { id: 'hs-opd', kind: 'elevator', x: 6, y: 18, label: '외래·진단', building: 'dx' },
    { id: 'hs-admin', kind: 'elevator', x: 33, y: 18, label: '행정', building: 'admin' },
  ],
  collision: [
    { x: 0, y: 0, w: 40, h: 1 },
    { x: 0, y: 0, w: 1, h: 28 },
    { x: 39, y: 0, w: 1, h: 28 },
    { x: 0, y: 27, w: 40, h: 1 },
  ],
  // Roaming campus life — nurses patrol the paths, visitors/patients/kids wander the lower plaza.
  npcs: [
    { id: 'c-nurse', kind: 'nurse', mode: 'patrol', seed: 3, path: [{ x: 12, y: 22 }, { x: 28, y: 22 }, { x: 28, y: 25 }, { x: 12, y: 25 }] },
    { id: 'c-visitor', kind: 'visitor', mode: 'wander', seed: 17, bound: { x: 3, y: 21, w: 12, h: 5 }, start: { x: 8, y: 23 } },
    { id: 'c-patient', kind: 'patient', mode: 'wander', seed: 31, bound: { x: 25, y: 21, w: 12, h: 5 }, start: { x: 30, y: 23 } },
    { id: 'c-child', kind: 'child', mode: 'wander', seed: 42, bound: { x: 16, y: 22, w: 9, h: 4 }, start: { x: 20, y: 24 }, tickMs: 1400 },
    { id: 'c-doctor', kind: 'doctor', mode: 'patrol', seed: 9, path: [{ x: 20, y: 17 }, { x: 20, y: 25 }] },
  ],
};
