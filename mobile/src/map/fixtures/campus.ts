// Campus outdoor map — v20 rebuild: a 1:1 port of the design-handoff
// screens-explore-v2 top-down GBA campus. A 26×60-tile hand-painted ground
// (grass / stone paths / plaza / 3 crossing roads + sidewalks / ponds) with 16
// roofed hospital buildings (red-cross emblems, facility signs, hovering
// labels), a central fountain plaza, helipad, and street/garden props. Buildings
// block via their footprint (props.w/h); décor is walkable (free-roam plaza).
// Clinical buildings' front doors are hotspots that open the matching elevator
// or walk straight into that department's interior.
import type { Interior } from '@engine';

// Hand-painted ground legend (see CampusGround): g/G grass, p/P stone path,
// z plaza, r/l road, c curb, w pond. 26 cols × 60 rows.
const GROUND = [
  'gggggggggggggggggggggggggg', //  0
  'ggggggggggggggggggggggGggg', //  1
  'ggGgggggggggggggggggggggGg', //  2
  'ggggggggggggGggggggggggggg', //  3
  'cccccccccccccccccccccccccc', //  4 sidewalk
  'rrrrrrrrrrrrlrrrrrrrrrrrrr', //  5 road
  'rrrrrrrrrrrrlrrrrrrrrrrrrr', //  6
  'cccccccccccccccccccccccccc', //  7 sidewalk
  'ggggppppppgggggggggppppgGg', //  8
  'ggggpPPPpgggggGgggggpPPpgg', //  9
  'ggggpPPPpgggggggggggpPPpgg', // 10
  'ggGgpPPPpzzzzzzzzzggpPPpgg', // 11
  'ggggpPPPpzzzzzzzzzggpPPpgg', // 12
  'ggggppppppzzzzzzzzggppppgg', // 13
  'ggggggggggzzzzzzzzgggGgggg', // 14
  'ggGgggGggggzzzzzggggggggGg', // 15
  'ggggggggggggppppgggggggGgg', // 16
  'gGgggppppppppPPppppppppggg', // 17 horizontal path
  'ggggpPPPPPPPPPPPPPPPPPPpgg', // 18
  'gggGppppppppppppppppppppgg', // 19
  'ggggggggggggggggggGggggggg', // 20
  'gggGggggGgggggggggggggGggg', // 21
  'ggppppgggggppppppgggppppgg', // 22
  'gpPPPpgggggpPPPPpgggpPPPpg', // 23
  'gpPPPpzzzzzpPPPPpzzzpPPPpg', // 24
  'gpPPPpzzzzzpPPPPpzzzpPPPpg', // 25
  'gppppppzzzpppppppzzpppppgg', // 26
  'gggGgggzzzggggGggzzgggggGg', // 27
  'gGggggggggggggggggggGggggg', // 28
  'ggggggggggggggGggggggggGgg', // 29
  'cccccccccccccccccccccccccc', // 30 road
  'rrrrrrrrrrrrlrrrrrrrrrrrrr', // 31
  'rrrrrrrrrrrrlrrrrrrrrrrrrr', // 32
  'cccccccccccccccccccccccccc', // 33
  'ggGgggggggggggggggggggGggg', // 34
  'gggppppggGggggggggggppppgg', // 35
  'gggpPPpgggggppppggggpPPpgg', // 36
  'gggpPPpgggggpPPpggggpPPpgg', // 37
  'gggpPPpgggggpPPpggggpPPpgg', // 38
  'gggppppggGgggppppgggppppgg', // 39
  'ggGggggggggggggGggggggGggg', // 40
  'gggggggwwwwgggggggwwwggGgg', // 41 pond
  'ggGggwwwwwwwwgggwwwwwwwggg', // 42 pond
  'gggggggggggggggggggggggggg', // 43
  'cccccccccccccccccccccccccc', // 44 road
  'rrrrrrrrrrrrlrrrrrrrrrrrrr', // 45
  'rrrrrrrrrrrrlrrrrrrrrrrrrr', // 46
  'cccccccccccccccccccccccccc', // 47
  'gGggggggggggggGgggggggGggg', // 48
  'gggggggggggggggggggggggggg', // 49
  'gggggggggggggggggggggggggg', // 50
  'ggGgggggggggggggggggGggggg', // 51
  'gggggggggggggggggggggggGgg', // 52
  'ggggppppppppppppppppppgggg', // 53 plaza path
  'gggpPPPPPPPPPPPPPPPPPPpggg', // 54
  'gggpPPPPPPPPPPPPPPPPPPpggg', // 55
  'ggGppppppppppppppppppppGgg', // 56
  'ggggggggggggGgggggGgggggGg', // 57
  'gggggwwwwwwwwgggggggggggGg', // 58 pond
  'ggGggwwwwwwwwgggGgggggGggg', // 59 pond
];

// door tile for a building = front-centre, one row below its footprint.
const door = (x: number, y: number, w: number, h: number) => ({ x: x + Math.floor(w / 2), y: y + h });

export const CAMPUS_INTERIOR: Interior = {
  id: 'CAMPUS-00001',
  deptId: 'CAMPUS',
  cols: 26,
  rows: 60,
  floorTheme: 'grass',
  groundMap: GROUND,
  scale: 0.72, // pulled back so several buildings + the plaza read at once
  playerStart: { x: 12, y: 19 },
  regions: [],
  rooms: [],
  objects: [
    // ── Buildings (block via props.w/h) ──────────────────────────────────────
    { id: 'b-lab', type: 'cbuilding', x: 0, y: 0, props: { w: 5, h: 4, roof: 'red', label: '연구동', sign: 'LAB', emblem: '🔬' } },
    { id: 'b-edu', type: 'cbuilding', x: 6, y: 0, props: { w: 5, h: 4, roof: 'green', label: '교육관', sign: 'EDU', emblem: '📚' } },
    { id: 'b-cafe', type: 'cbuilding', x: 16, y: 0, props: { w: 6, h: 4, roof: 'teal', label: '카페테리아', sign: 'CAFE', signColor: '#3E6E62', emblem: '🍱' } },
    { id: 'b-main', type: 'cbuilding', x: 1, y: 8, props: { w: 6, h: 6, roof: 'red', label: '본관 · MAIN', sign: 'HOSPITAL', signColor: '#D14242', redCross: true, mainEntrance: true } },
    { id: 'b-er', type: 'cbuilding', x: 19, y: 8, props: { w: 6, h: 6, roof: 'white', label: '응급실 ER', sign: 'ER', signColor: '#D14242', redCross: true, mainEntrance: true } },
    { id: 'b-peds', type: 'cbuilding', x: 1, y: 22, props: { w: 5, h: 5, roof: 'blue', label: '소아과', sign: 'PEDS', emblem: '🧸' } },
    { id: 'b-or', type: 'cbuilding', x: 10, y: 22, props: { w: 7, h: 5, roof: 'mauve', label: '수술실 OR', sign: 'OR', signColor: '#6E4F7C', redCross: true, mainEntrance: true } },
    { id: 'b-pharma', type: 'cbuilding', x: 20, y: 22, props: { w: 4, h: 5, roof: 'green', label: '약국', sign: 'PHARMA', emblem: '💊' } },
    { id: 'b-dorm', type: 'cbuilding', x: 3, y: 35, props: { w: 4, h: 5, roof: 'blue', label: '직원기숙사', sign: 'DORM', emblem: '🏠' } },
    { id: 'b-icu', type: 'cbuilding', x: 12, y: 35, props: { w: 4, h: 5, roof: 'red', label: 'ICU', sign: 'ICU', signColor: '#D14242', redCross: true } },
    { id: 'b-rehab', type: 'cbuilding', x: 19, y: 35, props: { w: 4, h: 5, roof: 'teal', label: '재활센터', sign: 'REHAB', emblem: '🦽' } },
    { id: 'b-xray', type: 'cbuilding', x: 0, y: 49, props: { w: 5, h: 4, roof: 'red', label: '영상의학', sign: 'X-RAY', signColor: '#D14242', redCross: true } },
    { id: 'b-mat', type: 'cbuilding', x: 6, y: 48, props: { w: 6, h: 5, roof: 'mauve', label: '산부인과', sign: 'MATERNITY', signColor: '#6E4F7C', emblem: '👶', mainEntrance: true } },
    { id: 'b-cardio', type: 'cbuilding', x: 13, y: 49, props: { w: 4, h: 4, roof: 'red', label: '심장내과', sign: 'CARDIO', signColor: '#D14242', redCross: true } },
    { id: 'b-opd', type: 'cbuilding', x: 18, y: 48, props: { w: 6, h: 5, roof: 'green', label: '외래 클리닉', sign: 'OPD', emblem: '🩺', mainEntrance: true } },
    { id: 'b-chapel', type: 'cbuilding', x: 14, y: 56, props: { w: 3, h: 3, roof: 'white', label: '채플', sign: 'CHAPEL', special: 'flat', emblem: '✟' } },

    // ── Central fountain plaza + helipad ─────────────────────────────────────
    { id: 'fountain', type: 'fountain', x: 11, y: 11 },
    { id: 'helipad', type: 'helipad', x: 11, y: 0 },
    { id: 'statue', type: 'statue', x: 17, y: 12 },

    // ── Trees (reuse engine `tree`), bushes, flowers ─────────────────────────
    ...([
      [0, 6, 1], [3, 6, 0], [8, 6, 0], [22, 6, 0], [24, 6, 0], [25, 8, 0],
      [0, 14, 0], [8, 16, 1], [17, 16, 0], [24, 14, 0], [0, 20, 0], [25, 20, 1],
      [7, 27, 0], [17, 28, 1], [25, 28, 0], [0, 34, 0], [9, 33, 1], [25, 34, 0],
      [1, 41, 0], [10, 42, 1], [22, 41, 0], [23, 43, 0],
      [0, 48, 1], [13, 48, 0], [24, 47, 0], [25, 49, 0],
      [0, 54, 1], [12, 54, 0], [25, 54, 0], [4, 57, 0], [22, 57, 1], [25, 57, 0],
      [0, 59, 0], [3, 59, 0], [13, 58, 0], [25, 59, 1],
    ] as [number, number, number][]).map(([x, y, big], i) => ({ id: `tree-${i}`, type: 'tree', x, y, props: big ? { big: true } : {} })),
    ...([[3, 14], [21, 14], [3, 28], [22, 28], [13, 8], [13, 14]] as [number, number][]).map(([x, y], i) => ({ id: `bush-${i}`, type: 'cbush', x, y })),
    ...([
      [4, 7, '#E47C7C'], [22, 7, '#C284D6'], [3, 21, '#E8C25A'],
      [13, 28, '#E47C7C'], [22, 21, '#C284D6'], [11, 21, '#E8C25A'],
    ] as [number, number, string][]).map(([x, y, color], i) => ({ id: `flower-${i}`, type: 'cflowers', x, y, props: { color } })),

    // ── Plaza furniture ──────────────────────────────────────────────────────
    { id: 'bench-1', type: 'cbench', x: 13, y: 15 },
    { id: 'bench-2', type: 'cbench', x: 9, y: 15 },
    { id: 'bench-3', type: 'cbench', x: 3, y: 56 },
    { id: 'bench-4', type: 'cbench', x: 20, y: 56 },
    { id: 'picnic-1', type: 'picnictable', x: 11, y: 15.5 },
    { id: 'picnic-2', type: 'picnictable', x: 15, y: 15.5 },
    { id: 'hedge-1', type: 'hedge', x: 10, y: 9, props: { hw: 3 } },
    { id: 'hedge-2', type: 'hedge', x: 15, y: 9, props: { hw: 3 } },
    { id: 'hedge-3', type: 'hedge', x: 11, y: 23, props: { hw: 2 } },
    { id: 'hedge-4', type: 'hedge', x: 14, y: 23, props: { hw: 2 } },
    { id: 'bike-1', type: 'bikerack', x: 6, y: 51 },
    { id: 'bike-2', type: 'bikerack', x: 18, y: 51 },
    { id: 'bball', type: 'bballcourt', x: 0, y: 42 },
    { id: 'lily-1', type: 'lilypad', x: 6, y: 58.5, props: { color: '#94BC85' } },
    { id: 'lily-2', type: 'lilypad', x: 9, y: 58.7, props: { color: '#6E9560' } },

    // ── Street props (sidewalks + roads) ─────────────────────────────────────
    ...([[2, 4], [8, 4], [14, 4], [20, 4], [24, 4], [2, 30], [8, 30], [14, 30], [20, 30], [24, 30], [2, 47], [14, 47], [24, 47]] as [number, number][])
      .map(([x, y], i) => ({ id: `lamp-${i}`, type: 'streetlamp', x, y })),
    { id: 'trash-1', type: 'trashcan', x: 5, y: 4, props: { color: '#16A34A' } },
    { id: 'trash-2', type: 'trashcan', x: 6, y: 4, props: { color: '#1E40AF' } },
    { id: 'trash-3', type: 'trashcan', x: 17, y: 4, props: { color: '#16A34A' } },
    { id: 'trash-4', type: 'trashcan', x: 18, y: 4, props: { color: '#1E40AF' } },
    { id: 'trash-5', type: 'trashcan', x: 5, y: 30, props: { color: '#16A34A' } },
    { id: 'trash-6', type: 'trashcan', x: 17, y: 30, props: { color: '#1E40AF' } },
    { id: 'mail-1', type: 'mailbox', x: 11, y: 4 },
    { id: 'mail-2', type: 'mailbox', x: 15, y: 30 },
    { id: 'hyd-1', type: 'hydrant', x: 3, y: 4 },
    { id: 'hyd-2', type: 'hydrant', x: 21, y: 4 },
    { id: 'hyd-3', type: 'hydrant', x: 11, y: 30 },
    { id: 'hyd-4', type: 'hydrant', x: 21, y: 47 },
    { id: 'bus-1', type: 'busstop', x: 9, y: 4 },
    { id: 'bus-2', type: 'busstop', x: 19, y: 30 },
    { id: 'vend-1', type: 'vending', x: 1, y: 36 },
    { id: 'vend-2', type: 'vending', x: 7, y: 36 },
    { id: 'vend-3', type: 'vending', x: 20, y: 36 },
    { id: 'amb-1', type: 'ambulance', x: 17, y: 5 },
    { id: 'amb-2', type: 'ambulance', x: 25.5, y: 5 },
    { id: 'amb-3', type: 'ambulance', x: 2, y: 45 },
    { id: 'car-1', type: 'parkedcar', x: 5, y: 45, props: { color: '#3B82F6' } },
    { id: 'car-2', type: 'parkedcar', x: 7, y: 45, props: { color: '#EF4444' } },
    { id: 'car-3', type: 'parkedcar', x: 20, y: 45, props: { color: '#FACC15' } },
    { id: 'car-4', type: 'parkedcar', x: 22, y: 45, props: { color: '#10B981' } },
    { id: 'car-5', type: 'parkedcar', x: 3, y: 31, props: { color: '#3B82F6' } },
    { id: 'car-6', type: 'parkedcar', x: 5, y: 31, props: { color: '#10B981' } },
    { id: 'car-7', type: 'parkedcar', x: 22, y: 31, props: { color: '#FACC15' } },
  ],

  // Front doors → open the matching elevator / walk into that dept's interior.
  hotspots: [
    { id: 'hs-main', kind: 'elevator', ...door(1, 8, 6, 6), label: '본관', building: 'tower' },
    { id: 'hs-er', kind: 'portal', ...door(19, 8, 6, 6), label: '응급실 ER', target: 'INT-ER-00001' },
    { id: 'hs-peds', kind: 'elevator', ...door(1, 22, 5, 5), label: '소아과', building: 'women' },
    { id: 'hs-or', kind: 'portal', ...door(10, 22, 7, 5), label: '수술실 OR', target: 'INT-OR-00001' },
    { id: 'hs-pharma', kind: 'portal', ...door(20, 22, 4, 5), label: '약국', target: 'INT-PHARMA-00001' },
    { id: 'hs-icu', kind: 'portal', ...door(12, 35, 4, 5), label: 'ICU', target: 'INT-ICU-00001' },
    { id: 'hs-rehab', kind: 'portal', ...door(19, 35, 4, 5), label: '재활센터', target: 'INT-REHAB-00001' },
    { id: 'hs-xray', kind: 'portal', ...door(0, 49, 5, 4), label: '영상의학', target: 'INT-RAD-00001' },
    { id: 'hs-mat', kind: 'elevator', ...door(6, 48, 6, 5), label: '산부인과', building: 'women' },
    { id: 'hs-cardio', kind: 'elevator', ...door(13, 49, 4, 4), label: '심장내과', building: 'dx' },
    { id: 'hs-opd', kind: 'elevator', ...door(18, 48, 6, 5), label: '외래 클리닉', building: 'dx' },
  ],

  // Perimeter + ponds (buildings block via their footprints).
  collision: [
    { x: 0, y: 0, w: 26, h: 1 },
    { x: 0, y: 0, w: 1, h: 60 },
    { x: 25, y: 0, w: 1, h: 60 },
    { x: 0, y: 59, w: 26, h: 1 },
    { x: 5, y: 41, w: 8, h: 2 }, // north pond (left)
    { x: 15, y: 41, w: 7, h: 2 }, // north pond (right)
    { x: 5, y: 58, w: 8, h: 2 }, // south pond
  ],

  // Campus life — idle NPCs at the plaza/paths; two carry a quest marker.
  npcs: [
    { id: 'c-doctor-1', kind: 'doctor', mode: 'idle', seed: 2, start: { x: 12, y: 16 }, marker: 'quest', markerLabel: 'Dr. Patel', scenarioId: 'SCN-ER-00002' },
    { id: 'c-nurse-1', kind: 'nurse', mode: 'wander', seed: 6, bound: { x: 5, y: 18, w: 6, h: 3 }, start: { x: 6, y: 19 } },
    { id: 'c-patient-1', kind: 'patient', mode: 'idle', seed: 11, start: { x: 20, y: 18 } },
    { id: 'c-nurse-2', kind: 'nurse', mode: 'wander', seed: 13, bound: { x: 12, y: 18, w: 6, h: 3 }, start: { x: 14, y: 20 } },
    { id: 'c-patient-2', kind: 'patient', mode: 'idle', seed: 5, start: { x: 4, y: 28 } },
    { id: 'c-doctor-2', kind: 'doctor', mode: 'wander', seed: 9, bound: { x: 19, y: 27, w: 5, h: 3 }, start: { x: 21, y: 28 } },
    { id: 'c-nurse-3', kind: 'nurse', mode: 'idle', seed: 4, start: { x: 8, y: 34 } },
    { id: 'c-child-1', kind: 'child', mode: 'wander', seed: 42, bound: { x: 15, y: 32, w: 5, h: 3 }, start: { x: 17, y: 33 }, tickMs: 1400 },
    { id: 'c-nurse-4', kind: 'nurse', mode: 'idle', seed: 7, start: { x: 9, y: 54 } },
    { id: 'c-patient-3', kind: 'patient', mode: 'idle', seed: 31, start: { x: 21, y: 54 }, marker: 'quest', markerLabel: '보호자' },
    { id: 'c-visitor-1', kind: 'visitor', mode: 'wander', seed: 17, bound: { x: 13, y: 53, w: 5, h: 3 }, start: { x: 15, y: 54 } },
    { id: 'c-doctor-3', kind: 'doctor', mode: 'idle', seed: 3, start: { x: 12, y: 47 } },
  ],
};
