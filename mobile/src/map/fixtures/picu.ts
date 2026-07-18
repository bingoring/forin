// PICU — 소아 중환자실 (여성소아 센터). 1:1 port of the v16 handoff master blueprint
// (design-handoff_v16/reference/interior-picu.jsx): 28×44 tiles, peds tone, dim
// low-light, LEFT elevator door. 전실 손위생 게이트 → 중앙 모니터 허브 → 3개 유리
// 격리 격실(PICU 1 vent·진정 / PICU 2 집중감시 / PICU 3 가족 상주). New objects in
// picuEquipment.tsx (PICUBed/PedVentilator/BroselowCart/ReclinerDaybed); reuses
// BankOfMonitors/CrashCart/IIV/GownBox/HandSanitizer/SinkOR/shared. WOMEN 4F는
// NICU가 선점 → 현재 딥링크/FIXTURES로만 접근(층당 sub-선택 도입 시 정식 배선).
import type { Interior } from '@engine';

export const PICU_INTERIOR: Interior = {
  id: 'INT-PICU-00001',
  deptId: 'DEPT-PICU-00001',
  cols: 28,
  rows: 44,
  floorTheme: 'peds',
  scale: 0.9,
  playerStart: { x: 4, y: 6 }, // anteroom by the ← elevator door
  regions: [
    { id: 'station', name: '중앙 모니터 허브', icon: '🖥', bounds: { x: 0, y: 7, w: 28, h: 11 } },
    { id: 'room1', name: 'PICU 1 (유리 격리실)', icon: '🧒', bounds: { x: 0, y: 17, w: 10, h: 27 } },
    { id: 'room2', name: 'PICU 2 (유리 격리실)', icon: '🧒', bounds: { x: 9, y: 17, w: 10, h: 27 } },
    { id: 'room3', name: 'PICU 3 · 가족 상주', icon: '👨‍👩‍👧', bounds: { x: 18, y: 17, w: 10, h: 27 } },
    { id: 'ante', name: '전실 · 손위생', icon: '🧼', bounds: { x: 0, y: 0, w: 28, h: 8 } },
  ],
  rooms: [
    { id: 'ante', name: '전실', sub: '가운·손위생', icon: '🧼', color: '#A7F3D0', x: 5, y: 4 },
    { id: 'station', name: '모니터 허브', sub: '3-방 감시', icon: '🖥', color: '#BAE6FD', x: 14, y: 12 },
    { id: 'room1', name: 'PICU 1', sub: '인공호흡·진정', icon: '🧒', color: '#C7D2FE', x: 5, y: 30 },
    { id: 'room2', name: 'PICU 2', sub: '집중 감시', icon: '🧒', color: '#FBCFE8', x: 14, y: 30 },
    { id: 'room3', name: 'PICU 3', sub: '가족 상주', icon: '👨‍👩‍👧', color: '#FDE68A', x: 23, y: 30 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y5-6
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 4 }, { x: 0, y: 7, w: 1, h: 36 },
    { x: 27, y: 1, w: 1, h: 42 },
    { x: 0, y: 43, w: 28, h: 1 },
    // anteroom | hub divider (y7) — sterile gate x6-7
    { x: 1, y: 7, w: 5, h: 1 }, { x: 8, y: 7, w: 19, h: 1 },
    // hub | rooms divider (y17) + room dividers are glass objects (block via objectCollision)
  ],
  objects: [
    // low-light PICU tint over the rooms (non-blocking overlay)
    { id: 'o-tint', type: 'tint', x: 1, y: 18, props: { w: 26, h: 25, color: '#232C48', op: 0.12 } },
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 5, props: { w: 1, h: 2, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-gate', type: 'threshold', x: 6, y: 7, props: { w: 2, h: 1, tone: 'sterile', label: '손위생 후 입장' } },
    // hub | rooms glass fronts with sliding doors (y17)
    { id: 'g-f1a', type: 'glass', x: 1, y: 17, props: { w: 2, h: 1 } },
    { id: 'd-r1', type: 'door', x: 3, y: 17, props: { w: 1, h: 1, kind: 'auto' } },
    { id: 'g-f1b', type: 'glass', x: 4, y: 17, props: { w: 5, h: 1 } },
    { id: 'g-f2a', type: 'glass', x: 10, y: 17, props: { w: 2, h: 1 } },
    { id: 'd-r2', type: 'door', x: 12, y: 17, props: { w: 1, h: 1, kind: 'auto' } },
    { id: 'g-f2b', type: 'glass', x: 13, y: 17, props: { w: 5, h: 1 } },
    { id: 'g-f3a', type: 'glass', x: 19, y: 17, props: { w: 2, h: 1 } },
    { id: 'd-r3', type: 'door', x: 21, y: 17, props: { w: 1, h: 1, kind: 'auto' } },
    { id: 'g-f3b', type: 'glass', x: 22, y: 17, props: { w: 5, h: 1 } },
    // room glass dividers
    { id: 'g-d1', type: 'glass', x: 9, y: 18, props: { w: 1, h: 25 } },
    { id: 'g-d2', type: 'glass', x: 18, y: 18, props: { w: 1, h: 25 } },

    // ════════ 전실 · 손위생 (ante, y1-6) ════════
    { id: 'bl-ante', type: 'baylabel', x: 1, y: 1, props: { text: 'ANTEROOM · 손위생', highlight: true } },
    { id: 'o-an-sink', type: 'sinkor', x: 2, y: 2 },
    { id: 'o-an-gown', type: 'gownbox', x: 6, y: 2 },
    { id: 'o-an-san', type: 'handsanitizer', x: 9, y: 2 },

    // ════════ 중앙 모니터 허브 (station, y8-16) ════════
    { id: 'bl-hub', type: 'baylabel', x: 1, y: 8, props: { text: 'CENTRAL MONITOR HUB', highlight: true } },
    { id: 'o-hb-bank', type: 'bankofmonitors', x: 9, y: 9 },
    { id: 'o-hb-desk', type: 'nursestation', x: 2, y: 11, props: { w: 6, h: 4 } },
    { id: 'o-hb-recep', type: 'ireception', x: 20, y: 10, props: { w: 5, h: 1, label: 'PICU DESK' } },
    { id: 'o-hb-crash', type: 'crashcart', x: 24, y: 13 },
    { id: 'o-hb-phone', type: 'deskphone', x: 3, y: 11 },

    // ════════ PICU 1 (room1, y18-42) ════════
    { id: 'bl-r1', type: 'baylabel', x: 1, y: 18, props: { text: 'PICU 1' } },
    { id: 'o-r1-bed', type: 'picubed', x: 2, y: 22, props: { occupied: true, w: 2, h: 3 } },
    { id: 'o-r1-vent', type: 'pedventilator', x: 1, y: 30, props: { w: 1, h: 1 } },
    { id: 'o-r1-mon', type: 'imonitor', x: 7, y: 21, props: { beep: true } },
    { id: 'o-r1-iv', type: 'iiv', x: 7, y: 24 },

    // ════════ PICU 2 (room2, y18-42) ════════
    { id: 'bl-r2', type: 'baylabel', x: 10, y: 18, props: { text: 'PICU 2' } },
    { id: 'o-r2-bed', type: 'picubed', x: 11, y: 22, props: { occupied: true, w: 2, h: 3 } },
    { id: 'o-r2-mon', type: 'imonitor', x: 16, y: 21, props: { beep: true } },
    { id: 'o-r2-brose', type: 'broselowcart', x: 11, y: 31, props: { w: 1, h: 1 } },

    // ════════ PICU 3 · 가족 상주 (room3, y18-42) ════════
    { id: 'bl-r3', type: 'baylabel', x: 19, y: 18, props: { text: 'PICU 3 · 가족 상주' } },
    { id: 'o-r3-bed', type: 'picubed', x: 20, y: 22, props: { occupied: true, w: 2, h: 3 } },
    { id: 'o-r3-mon', type: 'imonitor', x: 25, y: 21 },
    { id: 'o-r3-day', type: 'reclinerdaybed', x: 20, y: 31, props: { w: 2, h: 2 } },
    { id: 'o-r3-plant', type: 'iplant', x: 25, y: 42 },
  ],
  hotspots: [
    { id: 'hs-gown', kind: 'info', x: 3, y: 2, label: '가운·손위생' },
    { id: 'hs-monitor', kind: 'quest', x: 5, y: 13, label: '3-방 활력 감시' },
    { id: 'hs-vent', kind: 'quest', x: 3, y: 22, label: '소아 vent·진정 사정' },
    { id: 'hs-intensive', kind: 'info', x: 12, y: 22, label: '집중 감시' },
    { id: 'hs-family', kind: 'info', x: 20, y: 31, label: '가족 상주 지지' },
  ],
  npcs: [
    // ante
    { id: 'pi-an-n', kind: 'nurse', mode: 'idle', seed: 891, start: { x: 5, y: 5 } },
    // station
    { id: 'pi-st-n', kind: 'nurse', mode: 'idle', seed: 892, start: { x: 5, y: 14 } },
    { id: 'pi-st-d', kind: 'doctor', mode: 'idle', seed: 893, start: { x: 12, y: 14 } },
    // room1
    { id: 'pi-r1-n', kind: 'nurse', mode: 'idle', seed: 894, start: { x: 5, y: 35 } },
    // room2
    { id: 'pi-r2-n', kind: 'nurse', mode: 'idle', seed: 895, start: { x: 15, y: 36 } },
    // room3
    { id: 'pi-r3-p', kind: 'parent', mode: 'idle', seed: 896, start: { x: 22, y: 35 } },
  ],
};
