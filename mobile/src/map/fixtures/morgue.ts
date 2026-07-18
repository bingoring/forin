// MORGUE & AUTOPSY — 영안실 · 부검실 (지원동 ADMIN B1).
// 1:1 port of the v16 handoff master blueprint (design-handoff_v16/reference/
// interior-morgue.jsx): 28×40 tiles, clinical tone, LEFT elevator door. Somber,
// controlled-access basement: 접수·인수인계 → 시신 냉장 보관실(CadaverFridge bank)
// → 부검실(AutopsyTable·SinkOR·InstrumentTray) → 유족 참관실(ViewingBier) →
// 시설팀 기계실(Autoclave·설비 캐비닛). A dim basement Tint over the whole floor.
// New objects in morgueEquipment.tsx (CadaverFridge/AutopsyTable/ViewingBier);
// Gurney(er)·Autoclave(spd)·InstrumentTray/SinkOR(or)·shared struct reused.
import type { Interior } from '@engine';

export const MORGUE_INTERIOR: Interior = {
  id: 'INT-MORGUE-00001',
  deptId: 'DEPT-MORGUE-00001',
  cols: 28,
  rows: 40,
  floorTheme: 'clinical',
  playerStart: { x: 4, y: 7 }, // reception, by the ← elevator door
  regions: [
    { id: 'reception', name: '접수 · 인수인계', icon: '📋', bounds: { x: 0, y: 0, w: 28, h: 9 } },
    { id: 'cold', name: '시신 냉장 보관실', icon: '🧊', bounds: { x: 0, y: 8, w: 14, h: 18 } },
    { id: 'autopsy', name: '부검실 (Autopsy)', icon: '🔬', bounds: { x: 13, y: 8, w: 15, h: 18 } },
    { id: 'viewing', name: '유족 참관실', icon: '🕯', bounds: { x: 0, y: 25, w: 15, h: 15 } },
    { id: 'mech', name: '시설팀 기계실', icon: '🔧', bounds: { x: 14, y: 25, w: 14, h: 15 } },
  ],
  rooms: [
    { id: 'reception', name: '접수·인수', sub: '고인 확인', icon: '📋', color: '#BAE6FD', x: 6, y: 4 },
    { id: 'cold', name: '냉장 보관실', sub: '시신 안치', icon: '🧊', color: '#A7C7DC', x: 6, y: 16 },
    { id: 'autopsy', name: '부검실', sub: '검안·부검', icon: '🔬', color: '#C7D0D8', x: 20, y: 16 },
    { id: 'viewing', name: '유족 참관실', sub: '고별·참관', icon: '🕯', color: '#DDD6FE', x: 6, y: 33 },
    { id: 'mech', name: '기계실', sub: '시설·설비', icon: '🔧', color: '#C4CBD2', x: 21, y: 33 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 문(y5-6)
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 4 }, { x: 0, y: 7, w: 1, h: 32 },
    { x: 27, y: 1, w: 1, h: 38 },
    { x: 0, y: 39, w: 28, h: 1 },
    // reception | cold, reception | autopsy divider (y8)
    // thresholds: x6-7 (→냉장실) · x13-14 (→부검실)
    { x: 1, y: 8, w: 5, h: 1 }, { x: 8, y: 8, w: 5, h: 1 }, { x: 15, y: 8, w: 12, h: 1 },
    { x: 13, y: 9, w: 1, h: 17 }, // cold | autopsy vertical (y9-25)
    // cold | viewing, autopsy | mech divider (y25)
    // thresholds: x6-7 (→참관실) · x14-15 (→기계실)
    { x: 1, y: 25, w: 5, h: 1 }, { x: 8, y: 25, w: 6, h: 1 }, { x: 16, y: 25, w: 11, h: 1 },
    { x: 14, y: 26, w: 1, h: 13 }, // viewing | mech vertical (y26-38)
  ],
  objects: [
    // ── dim basement tint over the whole floor ──
    { id: 'o-tint', type: 'tint', x: 1, y: 1, props: { w: 26, h: 38, color: '#1E2530', op: 0.14 } },

    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 5, props: { w: 1, h: 2, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-cold', type: 'threshold', x: 6, y: 8, props: { w: 2, h: 1, label: '→ 냉장실' } },
    { id: 'th-autopsy', type: 'threshold', x: 13, y: 8, props: { w: 2, h: 1, tone: 'sterile', label: '→ 부검실' } },
    { id: 'th-viewing', type: 'threshold', x: 6, y: 25, props: { w: 2, h: 1, label: '→ 참관실' } },
    { id: 'th-mech', type: 'threshold', x: 14, y: 25, props: { w: 2, h: 1, label: '→ 기계실' } },

    // ════════ 접수 · 인수인계 (reception, y1-7) ════════
    { id: 'bl-rc', type: 'baylabel', x: 1, y: 1, props: { text: 'RECEPTION · 인수인계' } },
    { id: 'o-rc-recep', type: 'ireception', x: 2, y: 3, props: { w: 5, h: 1, label: '영안실 접수' } },
    { id: 'o-rc-chart', type: 'chartbinder', x: 9, y: 2 },
    { id: 'o-rc-phone', type: 'deskphone', x: 11, y: 2 },
    { id: 'o-rc-san', type: 'handsanitizer', x: 14, y: 2 },
    { id: 'o-rc-plant', type: 'plant', x: 25, y: 5 },

    // ════════ 시신 냉장 보관실 (cold, y9-24) ════════
    { id: 'bl-cd', type: 'baylabel', x: 1, y: 9, props: { text: 'COLD STORAGE · 냉장 보관', highlight: true } },
    { id: 'o-cd-f1', type: 'cadaverfridge', x: 2, y: 11, props: { w: 4, h: 2 } },
    { id: 'o-cd-f2', type: 'cadaverfridge', x: 7, y: 11, props: { w: 4, h: 2 } },
    { id: 'o-cd-f3', type: 'cadaverfridge', x: 2, y: 18, props: { w: 4, h: 2 } },
    { id: 'o-cd-gurney', type: 'gurney', x: 8, y: 19 },

    // ════════ 부검실 (autopsy, y9-24) ════════
    { id: 'bl-au', type: 'baylabel', x: 14, y: 9, props: { text: 'AUTOPSY SUITE' } },
    { id: 'o-au-table', type: 'autopsytable', x: 15, y: 12, props: { w: 3, h: 2 } },
    { id: 'o-au-sink', type: 'sinkor', x: 22, y: 11 },
    { id: 'o-au-tray', type: 'instrumenttray', x: 22, y: 16 },
    { id: 'o-au-mon', type: 'monitor', x: 15, y: 11 },
    { id: 'o-au-waste', type: 'wastebin', x: 25, y: 20, props: { tone: 'infectious' } },

    // ════════ 유족 참관실 (viewing, y26-38) ════════
    { id: 'bl-vw', type: 'baylabel', x: 1, y: 26, props: { text: 'VIEWING ROOM · 유족 참관' } },
    { id: 'o-vw-bier', type: 'viewingbier', x: 2, y: 29, props: { w: 2, h: 1 } },
    { id: 'o-vw-c1', type: 'chair', x: 2, y: 34, props: { color: '#DDD6FE', facing: 'down' } },
    { id: 'o-vw-c2', type: 'chair', x: 4, y: 34, props: { color: '#DDD6FE', facing: 'down' } },
    { id: 'o-vw-c3', type: 'chair', x: 6, y: 34, props: { color: '#DDD6FE', facing: 'down' } },
    { id: 'o-vw-plant', type: 'plant', x: 11, y: 29 },

    // ════════ 시설팀 기계실 (mech, y26-38) ════════
    { id: 'bl-mc', type: 'baylabel', x: 15, y: 26, props: { text: 'MECHANICAL · 기계실' } },
    { id: 'o-mc-cab1', type: 'icabinet', x: 15, y: 28, props: { w: 4, variant: 'equipment', label: '설비' } },
    { id: 'o-mc-cab2', type: 'icabinet', x: 19, y: 28, props: { w: 4, variant: 'equipment' } },
    { id: 'o-mc-auto', type: 'autoclave', x: 15, y: 32, props: { w: 2, h: 2 } },
    { id: 'o-mc-plant', type: 'plant', x: 25, y: 37 },
  ],
  hotspots: [
    { id: 'hs-id', kind: 'quest', x: 3, y: 3, label: '고인 신원 확인' },
    { id: 'hs-label', kind: 'info', x: 3, y: 11, label: '안치·라벨 대조' },
    { id: 'hs-autopsy', kind: 'quest', x: 16, y: 12, label: '검안·부검 기록' },
    { id: 'hs-farewell', kind: 'info', x: 3, y: 29, label: '고별 참관' },
    { id: 'hs-facility', kind: 'info', x: 16, y: 32, label: '설비 점검' },
  ],
  npcs: [
    // reception
    { id: 'mg-rc-d', kind: 'doctor', mode: 'idle', seed: 1131, start: { x: 4, y: 5 } },
    { id: 'mg-rc-v', kind: 'visitor', mode: 'idle', seed: 1132, start: { x: 17, y: 5 } },
    // cold
    { id: 'mg-cd-n', kind: 'nurse', mode: 'idle', seed: 1133, start: { x: 6, y: 16 } },
    // autopsy
    { id: 'mg-au-d', kind: 'doctor', mode: 'idle', seed: 1134, start: { x: 17, y: 19 } },
    { id: 'mg-au-n', kind: 'nurse', mode: 'idle', seed: 1135, start: { x: 20, y: 20 } },
    // viewing
    { id: 'mg-vw-v1', kind: 'visitor', mode: 'idle', seed: 1136, start: { x: 8, y: 31 } },
    { id: 'mg-vw-v2', kind: 'visitor', mode: 'idle', seed: 1137, start: { x: 9, y: 33 } },
    // mech
    { id: 'mg-mc-d', kind: 'doctor', mode: 'idle', seed: 1138, start: { x: 21, y: 34 } },
  ],
};
