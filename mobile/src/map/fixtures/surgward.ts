// SURGWARD — 일반 외과 병동 (General Surgery inpatient ward). 1:1 port of the v15
// handoff master blueprint (design-handoff_v15/reference/interior-surgward.jsx +
// interior-objects-surg2.jsx): 28×52 tiles, vertical flow, LEFT campus door
// (matches ward v14 layout). Perioperative care: 린넨·배식 + 중앙 처치/드레싱룸 →
// 간호 스테이션·보행 복도(OP 보드·워커) → 4인 수술후 병실(PCA·JP·가스배출·퇴원) →
// 1인 대수술 중증실(NG흡인·Hemovac·SCD). Reuses the ward2 catalog + shared/OR/ER
// primitives; only surg2 (PCA/JP/Hemovac/NG/SCD/walker/OP-board/staple) is new.
// Markers are labels only (scenarioIds deferred).
import type { Interior } from '@engine';

export const SURGWARD_INTERIOR: Interior = {
  id: 'INT-SURGWARD-00001',
  deptId: 'DEPT-SURGWARD-00001',
  cols: 28,
  rows: 46,
  floorTheme: 'surgery',
  scale: 0.9,
  playerStart: { x: 4, y: 15 }, // station corridor by the ← 캠퍼스 door
  regions: [
    { id: 'linen', name: '린넨실 · 배식실', icon: '🍱', bounds: { x: 0, y: 0, w: 10, h: 11 } },
    { id: 'dressing', name: '중앙 처치실 · 드레싱룸', icon: '🩹', bounds: { x: 9, y: 0, w: 19, h: 11 } },
    { id: 'major', name: '1인용 대수술 후 중증실', icon: '🚨', bounds: { x: 0, y: 31, w: 28, h: 15 } },
    { id: 'room4', name: '4인용 수술 후 병실', icon: '🛏', bounds: { x: 0, y: 20, w: 28, h: 11 } },
    { id: 'station', name: '중앙 간호 스테이션 · 보행', icon: '🖥', bounds: { x: 0, y: 10, w: 28, h: 11 } },
  ],
  rooms: [
    { id: 'linen', name: '린넨·배식실', sub: '시트·식이', icon: '🍱', color: '#FED7AA', x: 4, y: 5 },
    { id: 'dressing', name: '처치·드레싱룸', sub: '상처 소독·실밥', icon: '🩹', color: '#A8DCEC', x: 17, y: 5 },
    { id: 'station', name: '간호 스테이션', sub: 'OP 인계·스케줄', icon: '🖥', color: '#BAE6FD', x: 13, y: 15 },
    { id: 'room4', name: '4인 수술후 병실', sub: 'PCA·배액관', icon: '🛏', color: '#FBCFE8', x: 13, y: 27 },
    { id: 'major', name: '대수술 중증실', sub: 'NG·Hemovac·SCD', icon: '🚨', color: '#FCA5A5', x: 13, y: 39 },
  ],
  collision: [
    // outer walls — LEFT 캠퍼스 door gap y14-16 (v15; bottom solid)
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 13 }, { x: 0, y: 17, w: 1, h: 28 }, { x: 27, y: 1, w: 1, h: 44 },
    { x: 0, y: 45, w: 28, h: 1 },
    // service strip divider (y10) — thresholds x5-6 / x13-15(sterile →처치실)
    { x: 1, y: 10, w: 4, h: 1 }, { x: 7, y: 10, w: 6, h: 1 }, { x: 16, y: 10, w: 11, h: 1 },
    // linen | dressing vertical divider (x9), threshold gap y6-8
    { x: 9, y: 1, w: 1, h: 5 }, { x: 9, y: 9, w: 1, h: 1 },
    // station | room4 divider (y20) — thresholds x7-9 / x18-20
    { x: 1, y: 20, w: 6, h: 1 }, { x: 10, y: 20, w: 8, h: 1 }, { x: 21, y: 20, w: 6, h: 1 },
    // room4 | major divider (y35) — threshold x10-12 (→중증실)
    { x: 1, y: 31, w: 9, h: 1 }, { x: 13, y: 31, w: 14, h: 1 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-campus', type: 'door', x: 0, y: 14, props: { w: 1, h: 3, kind: 'auto', label: '← 캠퍼스로' } },
    { id: 'th-l', type: 'threshold', x: 5, y: 10, props: { w: 2, h: 1, label: '→ 복도' } },
    { id: 'th-dr', type: 'threshold', x: 13, y: 10, props: { w: 3, h: 1, tone: 'sterile', label: '→ 처치실' } },
    { id: 'th-lv', type: 'threshold', x: 9, y: 6, props: { w: 1, h: 3 } },
    { id: 'th-r4a', type: 'threshold', x: 7, y: 20, props: { w: 3, h: 1 } },
    { id: 'th-r4b', type: 'threshold', x: 18, y: 20, props: { w: 3, h: 1 } },
    { id: 'th-major', type: 'threshold', x: 10, y: 31, props: { w: 3, h: 1, label: '→ 중증실' } },

    // ════════ 린넨실 · 배식실 (y1-9) ════════
    { id: 'bl-linen', type: 'baylabel', x: 1, y: 1, props: { text: '린넨 · 배식실' } },
    { id: 'o-l-cab1', type: 'icabinet', x: 1, y: 2, props: { w: 3, h: 1, variant: 'linen', label: 'LINEN' } },
    { id: 'o-l-cab2', type: 'icabinet', x: 5, y: 2, props: { w: 3, h: 1, variant: 'linen' } },
    { id: 'o-l-meal', type: 'mealcart', x: 2, y: 5, props: { w: 2, h: 2 } },
    { id: 'o-l-cab3', type: 'icabinet', x: 6, y: 6, props: { w: 2, h: 1, variant: 'supply' } },

    // ════════ 중앙 처치실 · 드레싱룸 (y1-9) ════════
    { id: 'bl-dr', type: 'baylabel', x: 10, y: 1, props: { text: 'TREATMENT · DRESSING ROOM', highlight: true } },
    { id: 'o-dr-light', type: 'surgicallight', x: 14, y: 2 },
    { id: 'o-dr-bed', type: 'ibed', x: 12, y: 3, props: { variant: 'or', occupied: true } },
    { id: 'o-dr-cart', type: 'dressing', x: 16, y: 4, props: { w: 2, h: 1 } },
    { id: 'o-dr-tray', type: 'instrumenttray', x: 19, y: 3, props: { w: 2, h: 1 } },
    { id: 'o-dr-staple', type: 'stapleremover', x: 22, y: 3 },
    { id: 'o-dr-cab', type: 'icabinet', x: 24, y: 2, props: { w: 3, h: 1, variant: 'sterile', label: 'STERILE' } },
    { id: 'o-dr-waste', type: 'wastebin', x: 24, y: 6, props: { tone: 'infectious' } },

    // ════════ 중앙 간호 스테이션 · 보행 복도 (y11-19) ════════
    { id: 'bl-station', type: 'baylabel', x: 1, y: 11, props: { text: 'CENTRAL STATION · AMBULATION', highlight: true } },
    { id: 'o-s-rail', type: 'handrail', x: 27, y: 11, props: { w: 8, vertical: true } },
    { id: 'o-s-desk', type: 'nursestation', x: 8, y: 13, props: { w: 12, h: 5 } },
    { id: 'o-s-board', type: 'opscheduleboard', x: 2, y: 11, props: { w: 5 } },
    { id: 'o-s-ph1', type: 'deskphone', x: 9, y: 13 },
    { id: 'o-s-ph2', type: 'deskphone', x: 17, y: 13 },
    { id: 'o-s-walker', type: 'walkerrack', x: 21, y: 11, props: { w: 3, h: 1 } },
    { id: 'o-s-pca', type: 'pcapump', x: 6, y: 16, props: { w: 1, h: 2 } },

    // ════════ 4인용 수술 후 병실 (y21-34) ════════
    { id: 'bl-room4', type: 'baylabel', x: 1, y: 21, props: { text: '4-BED POST-OP RECOVERY' } },
    // Bed A — OP day (PCA + NPO, 심호흡 교육)
    { id: 'o-a-bed', type: 'ibed', x: 2, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-a-pca', type: 'pcapump', x: 5, y: 22, props: { w: 1, h: 2 } },
    { id: 'o-a-npo', type: 'npoboard', x: 2, y: 22 },
    { id: 'o-a-mon', type: 'imonitor', x: 1, y: 23, props: { beep: true } },
    // Bed B — JP drain
    { id: 'o-b-bed', type: 'ibed', x: 9, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-b-jp', type: 'jpdrain', x: 12, y: 25 },
    { id: 'o-b-iv', type: 'iiv', x: 8, y: 23 },
    // Bed C — flatus
    { id: 'o-c-bed', type: 'ibed', x: 17, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-c-iv', type: 'iiv', x: 20, y: 23 },
    // Bed D — discharge
    { id: 'o-d-bed', type: 'ibed', x: 24, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-d-chair', type: 'ichair', x: 21, y: 25, props: { color: '#FED7AA', facing: 'left' } },
    // curtains splitting the bays
    { id: 'o-cur1', type: 'icurtain', x: 8, y: 22, props: { w: 1, h: 6, color: '#BFE3EE' } },
    { id: 'o-cur2', type: 'icurtain', x: 16, y: 22, props: { w: 1, h: 6, color: '#BFE3EE' } },
    { id: 'o-cur3', type: 'icurtain', x: 23, y: 22, props: { w: 1, h: 6, color: '#BFE3EE' } },

    // ════════ 1인용 대수술 후 중증실 (major, y36-50) ════════
    { id: 'bl-major', type: 'baylabel', x: 1, y: 32, props: { text: 'MAJOR POST-OP · 대장암/위암 절제', highlight: true } },
    { id: 'o-m-bed', type: 'ibed', x: 4, y: 34, props: { variant: 'ward', occupied: true } },
    { id: 'o-m-ng', type: 'ngsuction', x: 1, y: 34, props: { w: 1, h: 2 } },
    { id: 'o-m-mon', type: 'imonitor', x: 8, y: 34, props: { beep: true } },
    { id: 'o-m-iv', type: 'iiv', x: 9, y: 34 },
    { id: 'o-m-pca', type: 'pcapump', x: 11, y: 34, props: { w: 1, h: 2 } },
    { id: 'o-m-hemo1', type: 'hemovac', x: 4, y: 36.5 },
    { id: 'o-m-hemo2', type: 'hemovac', x: 6, y: 36.5 },
    { id: 'o-m-scd', type: 'scddevice', x: 13, y: 38, props: { w: 2, h: 2 } },
    { id: 'o-m-suction', type: 'suction', x: 16, y: 35 },
    { id: 'o-m-sofa', type: 'sofa', x: 13, y: 41, props: { w: 3, h: 2, color: '#9CB4C8' } },
    { id: 'o-m-chair', type: 'ichair', x: 17, y: 40, props: { color: '#FED7AA', facing: 'left' } },
    { id: 'o-m-plant', type: 'iplant', x: 20, y: 41 },
  ],
  hotspots: [
    { id: 'hs-meal', kind: 'info', x: 2, y: 5, label: '식이 배식' },
    { id: 'hs-dress', kind: 'quest', x: 13, y: 4, label: '복부 드레싱 교체' },
    { id: 'hs-orcall', kind: 'urgent', x: 11, y: 15, label: 'OR 인계 콜' },
    { id: 'hs-order', kind: 'info', x: 15, y: 15, label: '수술 상처 오더' },
    { id: 'hs-ambul', kind: 'info', x: 23, y: 16, label: '조기 이상(보행)' },
    { id: 'hs-breath', kind: 'quest', x: 3, y: 23, label: '심호흡·기침 교육' },
    { id: 'hs-jp', kind: 'info', x: 9, y: 23, label: 'JP 배액량 측정' },
    { id: 'hs-flatus', kind: 'info', x: 17, y: 23, label: '가스 배출 확인' },
    { id: 'hs-dc', kind: 'info', x: 24, y: 23, label: '퇴원 약 대기' },
    { id: 'hs-drain', kind: 'quest', x: 5, y: 34, label: '배액관 개통성 확인' },
  ],
  npcs: [
    { id: 'sw-l-n', kind: 'nurse', mode: 'idle', seed: 601, start: { x: 4, y: 8 } },
    { id: 'sw-dr-s', kind: 'surgeon', mode: 'idle', seed: 602, start: { x: 12, y: 6 } },
    { id: 'sw-dr-n', kind: 'nurse', mode: 'idle', seed: 603, start: { x: 15, y: 6 } },
    { id: 'sw-s-n', kind: 'nurse', mode: 'idle', seed: 604, start: { x: 11, y: 16 } },
    { id: 'sw-s-d', kind: 'doctor', mode: 'idle', seed: 605, start: { x: 15, y: 16 } },
    { id: 'sw-s-pt', kind: 'patient', mode: 'idle', seed: 606, start: { x: 23, y: 16 } },
    { id: 'sw-s-pa', kind: 'parent', mode: 'idle', seed: 607, start: { x: 24, y: 18 } },
    { id: 'sw-a-n', kind: 'nurse', mode: 'idle', seed: 608, start: { x: 4, y: 26 } },
    { id: 'sw-b-n', kind: 'nurse', mode: 'idle', seed: 609, start: { x: 12, y: 26 } },
    { id: 'sw-c-pt', kind: 'patient', mode: 'idle', seed: 610, start: { x: 20, y: 26 } },
    { id: 'sw-d-pa', kind: 'parent', mode: 'idle', seed: 611, start: { x: 21, y: 26 } },
    { id: 'sw-r-d', kind: 'doctor', mode: 'idle', seed: 612, start: { x: 3, y: 29 } },
    { id: 'sw-m-n', kind: 'nurse', mode: 'idle', seed: 613, start: { x: 8, y: 37 } },
    { id: 'sw-m-pa', kind: 'parent', mode: 'idle', seed: 614, start: { x: 14, y: 39 } },
  ],
};
