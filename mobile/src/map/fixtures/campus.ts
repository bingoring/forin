// Campus outdoor map — v20 rebuild: a 1:1 port of the LATEST design-handoff
// (v19 screens-explore-v2) RADIAL CENTRAL-HUB campus. A central Healing Garden
// plaza (clock tower + statue) is ringed by the FIVE trademark 2.5D pavilions —
// 본관(N) · 암센터(NW) · 행정(NE) · 외래(SW) · 여성소아(SE) — each rendered by the
// confirmed buildings-v2 landmark architecture (landmarks.tsx). A south main-gate
// avenue leads up into the garden; a backstage service road runs along the top.
// Buildings block via their footprint (props.w/h); plaza/paths/roads are walkable.
// Each pavilion's front-door spoke is a hotspot opening that building's elevator.
import type { Interior } from '@engine';

// Per-tile ground legend (see CampusGround): g/G grass, p/P stone path,
// z plaza, r/l road, c curb. 26 cols × 60 rows.
const GROUND = [
  'gggggggggggggggggggggggggg', //  0 north service yard
  'cccccccccccccccccccccccccc', //  1 service sidewalk
  'rrrrrrrrrrrrrrrrrrrrrrrrrr', //  2 backstage service road
  'cccccccccccccccccccccccccc', //  3 service sidewalk
  'gggggggggggggggggggggggggg', //  4 building tops (drawn on top)
  'ggGgggggggggggggggggGggggg', //  5
  'gggggggggggggggggggggggggg', //  6
  'gggggggggggggggggggggggggg', //  7  암센터(NW) · 행정(NE)
  'ggGgggggggggggggggggggGggg', //  8
  'gggggggggggggggggggggggggg', //  9
  'gggggggggggggggggggggggggg', // 10
  'ggggggggggggGggggggggggggg', // 11
  'gggppgggggggppgggggggppggg', // 12 front-door spokes (NW · 본관 · NE)
  'gggppgggggggppgggggggppggg', // 13
  'gggppgggggggppgggggggppggg', // 14
  'gggppgggggggppgggggggppggg', // 15
  'gggppgggggggppgggggggppggg', // 16
  'gggppgggggggppgggggggppggg', // 17
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 18 ─ Healing Garden plaza begins ─
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 19
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 20
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 21
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 22
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 23 (clock tower)
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 24 (statue)
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 25
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 26
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 27
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 28
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 29
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 30
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 31 ─ Healing Garden plaza ends ─
  'gggggggggggpPPpggggggggggg', // 32 avenue south
  'ggggppggggggppggggggppgggg', // 33 spokes (외래 SW · avenue · 여성소아 SE)
  'ggggppggggggppggggggppgggg', // 34
  'ggggppggggggppggggggppgggg', // 35
  'ggggppggggggppggggggppgggg', // 36
  'ggggppggggggppggggggppgggg', // 37
  'ggggppggggggppggggggppgggg', // 38
  'ggggppggggggppgggggggggggg', // 39 SE building top
  'ggggggggggggppgggggggggggg', // 40 외래(SW) footprint · avenue
  'ggggggggggggppgggggggggggg', // 41
  'ggggggggggggppgggggggggggg', // 42
  'ggggggggggggppgggggggggggg', // 43
  'ggggggggggggppgggggggggggg', // 44
  'ggGgggggggggppggggggggGggg', // 45
  'ggggggggggggppgggggggggggg', // 46
  'cccccccccccccccccccccccccc', // 47 gate sidewalk
  'rrrrrrrrrrrrllrrrrrrrrrrrr', // 48 main gate road
  'rrrrrrrrrrrrllrrrrrrrrrrrr', // 49
  'cccccccccccccccccccccccccc', // 50 gate sidewalk
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 51 ─ Main Gate forecourt ─
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 52
  'ggggzzzzzzzzzzzzzzzzzzgggg', // 53
  'ggggggggggggppgggggggggggg', // 54
  'gggggggggggggggggggggggggg', // 55
  'ggGgggggggggggggggggGggggg', // 56
  'gggggggggggggggggggggggggg', // 57
  'gggggggggggggggggggggggggg', // 58
  'gggggggggggggggggggggggggg', // 59
];

export const CAMPUS_INTERIOR: Interior = {
  id: 'CAMPUS-00001',
  deptId: 'CAMPUS',
  cols: 26,
  rows: 60,
  floorTheme: 'grass',
  groundMap: GROUND,
  scale: 0.7, // pulled back so the garden + ringing pavilions read at once
  playerStart: { x: 12, y: 45 }, // south avenue, facing up into the garden
  regions: [],
  rooms: [],
  objects: [
    // ── FIVE trademark pavilions (landmark art) — block via props.w/h ─────────
    // 본관 (N) — Main Medical Tower: ER·OR·ICU·Pharmacy + 내/외/정형/피부.
    { id: 'b-main', type: 'landmark', x: 8, y: 5, props: { w: 10, h: 7, landmark: 'main', label: '본관 · 메인 메디컬 타워', sign: '🚑 MEDICAL TOWER', signColor: '#D14B3D' } },
    // 암센터·재활관 (NW) — curved eco-glass.
    { id: 'b-onco', type: 'landmark', x: 1, y: 6, props: { w: 6, h: 6, landmark: 'curved', label: '암센터 · 재활관', sign: '🎗 ONCOLOGY · REHAB', signColor: '#1E8A5B' } },
    // 행정·지원동 (NE) — utilitarian concrete/brick.
    { id: 'b-admin', type: 'landmark', x: 19, y: 7, props: { w: 6, h: 5, landmark: 'admin', label: '행정 · 지원동', sign: '📦 ADMIN · SUPPORT', signColor: '#6E6354' } },
    // 외래·진단 지원동 (SW) — low wide silver monolith.
    { id: 'b-dx', type: 'landmark', x: 1, y: 40, props: { w: 8, h: 5, landmark: 'horizontal', label: '외래 · 진단 지원동', sign: '🔬 OUTPATIENT · DX', signColor: '#0E7490' } },
    // 여성소아 센터 (SE) — warm rounded pavilion.
    { id: 'b-women', type: 'landmark', x: 18, y: 39, props: { w: 7, h: 6, landmark: 'victorian', label: '여성소아 센터', sign: '🤰 WOMEN & CHILDREN', signColor: '#C2487E' } },

    // ── Healing Garden centrepiece: clock tower + statue + roof helipad ──────
    { id: 'b-clock', type: 'landmark', x: 6, y: 21, props: { w: 4, h: 4, landmark: 'clock' } },
    { id: 'statue', type: 'statue', x: 16, y: 24 },
    { id: 'helipad', type: 'helipad', x: 11, y: 4 }, // on the Main Tower roof

    // ── Trees (reuse engine `tree`), bushes, flowers ─────────────────────────
    ...([
      // south gate avenue (rows flanking the entry road)
      [8, 51, 0], [16, 51, 0], [8, 54, 1], [16, 54, 0], [8, 57, 0], [16, 57, 0], [10, 58, 0], [14, 58, 1],
      // garden ring
      [3, 18, 0], [21, 18, 1], [3, 24, 0], [21, 24, 0], [3, 30, 0], [21, 30, 1],
      // between SW/SE buildings and garden
      [10, 36, 0], [15, 36, 1], [9, 45, 0], [16, 45, 0],
      // corners / north
      [0, 6, 1], [25, 6, 0], [0, 12, 0], [25, 12, 0], [0, 45, 1], [25, 45, 0], [0, 58, 0], [25, 58, 1],
    ] as [number, number, number][]).map(([x, y, big], i) => ({ id: `tree-${i}`, type: 'tree', x, y, props: big ? { big: true } : {} })),
    ...([[5, 17], [20, 17], [5, 32], [20, 32], [11, 17], [14, 17]] as [number, number][]).map(([x, y], i) => ({ id: `bush-${i}`, type: 'cbush', x, y })),
    ...([
      [5, 19, '#C284D6'], [19, 19, '#C284D6'], [6, 30, '#E8C25A'],
      [18, 30, '#E8C25A'], [11, 31, '#E47C7C'], [14, 31, '#E47C7C'],
    ] as [number, number, string][]).map(([x, y, color], i) => ({ id: `flower-${i}`, type: 'cflowers', x, y, props: { color } })),

    // ── Garden + forecourt furniture ─────────────────────────────────────────
    { id: 'bench-1', type: 'cbench', x: 6, y: 20 },
    { id: 'bench-2', type: 'cbench', x: 18, y: 20 },
    { id: 'bench-3', type: 'cbench', x: 6, y: 28 },
    { id: 'bench-4', type: 'cbench', x: 18, y: 28 },
    { id: 'bench-5', type: 'cbench', x: 9, y: 52 },
    { id: 'bench-6', type: 'cbench', x: 15, y: 52 },
    { id: 'picnic-1', type: 'picnictable', x: 9, y: 27 },
    { id: 'picnic-2', type: 'picnictable', x: 15, y: 29 },
    { id: 'hedge-1', type: 'hedge', x: 8, y: 3, props: { hw: 4 } },
    { id: 'hedge-2', type: 'hedge', x: 14, y: 3, props: { hw: 4 } },
    { id: 'hedge-3', type: 'hedge', x: 5, y: 32, props: { hw: 3 } },
    { id: 'hedge-4', type: 'hedge', x: 16, y: 32, props: { hw: 3 } },
    { id: 'bike-1', type: 'bikerack', x: 6, y: 52 },
    { id: 'bike-2', type: 'bikerack', x: 18, y: 52 },

    // ── Street props (service road + gate road + sidewalks) ──────────────────
    ...([[4, 18], [20, 18], [4, 31], [20, 31], [2, 47], [24, 47], [2, 1], [24, 1]] as [number, number][])
      .map(([x, y], i) => ({ id: `lamp-${i}`, type: 'streetlamp', x, y })),
    { id: 'trash-1', type: 'trashcan', x: 9, y: 47, props: { color: '#16A34A' } },
    { id: 'trash-2', type: 'trashcan', x: 10, y: 47, props: { color: '#1E40AF' } },
    { id: 'trash-3', type: 'trashcan', x: 15, y: 47, props: { color: '#16A34A' } },
    { id: 'mail-1', type: 'mailbox', x: 16, y: 47 },
    { id: 'hyd-1', type: 'hydrant', x: 6, y: 47 },
    { id: 'hyd-2', type: 'hydrant', x: 19, y: 47 },
    { id: 'hyd-3', type: 'hydrant', x: 6, y: 1 },
    { id: 'bus-1', type: 'busstop', x: 16, y: 50 },
    { id: 'amb-1', type: 'ambulance', x: 2, y: 2 },
    { id: 'amb-2', type: 'ambulance', x: 22, y: 2 },
    { id: 'amb-3', type: 'ambulance', x: 2, y: 48 },
    { id: 'car-1', type: 'parkedcar', x: 5, y: 48, props: { color: '#FACC15' } },
    { id: 'car-2', type: 'parkedcar', x: 7, y: 48, props: { color: '#3B82F6' } },
    { id: 'car-3', type: 'parkedcar', x: 20, y: 48, props: { color: '#EF4444' } },
    { id: 'car-4', type: 'parkedcar', x: 22, y: 48, props: { color: '#10B981' } },
  ],

  // Front-door spokes → open each pavilion's elevator (building-entry selector).
  hotspots: [
    { id: 'hs-main', kind: 'elevator', x: 12, y: 12, label: '본관 · 메인 타워', building: 'tower' },
    { id: 'hs-onco', kind: 'elevator', x: 3, y: 12, label: '암센터 · 재활관', building: 'onco' },
    { id: 'hs-admin', kind: 'elevator', x: 20, y: 12, label: '행정 · 지원동', building: 'admin' },
    { id: 'hs-dx', kind: 'elevator', x: 4, y: 39, label: '외래 · 진단', building: 'dx' },
    { id: 'hs-women', kind: 'elevator', x: 20, y: 38, label: '여성소아 센터', building: 'women' },
  ],

  // Perimeter only — buildings block via their footprints; plaza/paths walkable.
  collision: [
    { x: 0, y: 0, w: 26, h: 1 },
    { x: 0, y: 0, w: 1, h: 60 },
    { x: 25, y: 0, w: 1, h: 60 },
    { x: 0, y: 59, w: 26, h: 1 },
  ],

  // Campus life — idle/roaming NPCs in the garden; Dr. Patel carries the quest.
  npcs: [
    { id: 'c-patel', kind: 'doctor', mode: 'idle', seed: 2, start: { x: 12, y: 19 }, marker: 'quest', markerLabel: 'Dr. Patel', scenarioId: 'SCN-ER-00002' },
    { id: 'c-nurse-1', kind: 'nurse', mode: 'wander', seed: 11, bound: { x: 5, y: 19, w: 6, h: 4 }, start: { x: 6, y: 20 } },
    { id: 'c-patient-1', kind: 'patient', mode: 'idle', seed: 63, start: { x: 19, y: 19 }, marker: 'info', markerLabel: '방문객' },
    { id: 'c-nurse-2', kind: 'nurse', mode: 'wander', seed: 13, bound: { x: 13, y: 19, w: 6, h: 4 }, start: { x: 14, y: 20 } },
    { id: 'c-patient-2', kind: 'patient', mode: 'wander', seed: 88, bound: { x: 5, y: 26, w: 6, h: 4 }, start: { x: 6, y: 27 } },
    { id: 'c-doctor-2', kind: 'doctor', mode: 'idle', seed: 9, start: { x: 20, y: 27 } },
    { id: 'c-child-1', kind: 'child', mode: 'wander', seed: 95, bound: { x: 13, y: 26, w: 6, h: 4 }, start: { x: 15, y: 27 }, tickMs: 1400 },
    { id: 'c-visitor-1', kind: 'visitor', mode: 'wander', seed: 41, bound: { x: 10, y: 40, w: 4, h: 5 }, start: { x: 12, y: 43 } },
    { id: 'c-nurse-3', kind: 'nurse', mode: 'idle', seed: 27, start: { x: 8, y: 52 } },
  ],
};
