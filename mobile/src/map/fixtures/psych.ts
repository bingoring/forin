// INPATIENT PSYCH — 정신과 폐쇄병동 (암센터 ONCO 2F). 1:1 port of the v16 handoff
// master blueprint (design-handoff_v16/reference/interior-psych.jsx): 28×44 tiles,
// internal-med tone, LEFT elevator door. 이중 통제문·소지품 보관 → 관찰 간호
// 스테이션(유리 ObsWindow로 데이룸 상시 관찰) · 데이룸(공동 활동) → 안전 병실(자해
// 방지 볼트 침대) · 안정실(패딩 seclusion). New objects in psychEquipment.tsx
// (SafeBed/SeclusionPad/GroupTable); ObsWindow(nursery)·MetalDetector(er)·shared
// reused. Markers label-only.
import type { Interior } from '@engine';

export const PSYCH_INTERIOR: Interior = {
  id: 'INT-PSYCH-00001',
  deptId: 'DEPT-PSYCH-00001',
  cols: 28,
  rows: 44,
  floorTheme: 'internal',
  scale: 0.9,
  playerStart: { x: 4, y: 7 }, // secure entry by the ← elevator door
  regions: [
    { id: 'station', name: '관찰 간호 스테이션', icon: '👁', bounds: { x: 0, y: 8, w: 14, h: 16 } },
    { id: 'dayroom', name: '데이룸 (공동 활동)', icon: '🎲', bounds: { x: 13, y: 8, w: 15, h: 16 } },
    { id: 'rooms', name: '안전 병실', icon: '🛏', bounds: { x: 0, y: 23, w: 14, h: 21 } },
    { id: 'seclusion', name: '안정실 (Seclusion)', icon: '🧩', bounds: { x: 13, y: 23, w: 15, h: 21 } },
    { id: 'sally', name: '이중 통제문 · 소지품 보관', icon: '🔒', bounds: { x: 0, y: 0, w: 28, h: 9 } },
  ],
  rooms: [
    { id: 'sally', name: '이중 통제문', sub: '소지품·금속 확인', icon: '🔒', color: '#FDE68A', x: 5, y: 4 },
    { id: 'station', name: '관찰 스테이션', sub: '상시 관찰', icon: '👁', color: '#BAE6FD', x: 6, y: 15 },
    { id: 'dayroom', name: '데이룸', sub: '집단 프로그램', icon: '🎲', color: '#A7D0BC', x: 21, y: 15 },
    { id: 'rooms', name: '안전 병실', sub: '자해 방지', icon: '🛏', color: '#DDD6FE', x: 6, y: 35 },
    { id: 'seclusion', name: '안정실', sub: '격리·진정', icon: '🧩', color: '#C7B8E8', x: 21, y: 35 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y5-6
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 4 }, { x: 0, y: 7, w: 1, h: 36 },
    { x: 27, y: 1, w: 1, h: 42 },
    { x: 0, y: 43, w: 28, h: 1 },
    // sally-port | ward divider (y8) — single controlled card door x6-7
    { x: 1, y: 8, w: 5, h: 1 }, { x: 8, y: 8, w: 19, h: 1 },
    // station | dayroom divider (x13) — ObsWindow at y11-13 (passable observation gap)
    { x: 13, y: 9, w: 1, h: 2 }, { x: 13, y: 14, w: 1, h: 10 },
    // upper | lower divider (y23) — thresholds x6-7 (→병실) / x14-15 (→안정실 sterile)
    { x: 1, y: 23, w: 5, h: 1 }, { x: 8, y: 23, w: 6, h: 1 }, { x: 16, y: 23, w: 11, h: 1 },
    // rooms | seclusion divider (x13)
    { x: 13, y: 24, w: 1, h: 19 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 5, props: { w: 1, h: 2, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-gate', type: 'threshold', x: 6, y: 8, props: { w: 2, h: 1, tone: 'sterile', label: '통제문 (카드)' } },
    { id: 'o-obswin', type: 'obswindow', x: 13, y: 12, props: { w: 1 } },
    { id: 'th-rooms', type: 'threshold', x: 6, y: 23, props: { w: 2, h: 1, label: '→ 병실' } },
    { id: 'th-secl', type: 'threshold', x: 14, y: 23, props: { w: 2, h: 1, tone: 'sterile', label: '→ 안정실' } },

    // ════════ 이중 통제문 · 소지품 보관 (sally, y1-7) ════════
    { id: 'bl-sl', type: 'baylabel', x: 1, y: 1, props: { text: 'SECURE ENTRY · 소지품 보관', highlight: true } },
    { id: 'o-sl-detector', type: 'detector', x: 3, y: 2 },
    { id: 'o-sl-cab1', type: 'icabinet', x: 7, y: 2, props: { w: 3, variant: 'linen', label: 'LOCKER' } },
    { id: 'o-sl-cab2', type: 'icabinet', x: 11, y: 2, props: { w: 3, variant: 'linen' } },
    { id: 'o-sl-recep', type: 'ireception', x: 16, y: 3, props: { w: 4, h: 1, label: '보안 데스크' } },

    // ════════ 관찰 간호 스테이션 (station, y9-22) ════════
    { id: 'bl-st', type: 'baylabel', x: 1, y: 9, props: { text: 'OBSERVATION STATION', highlight: true } },
    { id: 'o-st-desk', type: 'nursestation', x: 2, y: 12, props: { w: 9, h: 5 } },
    { id: 'o-st-phone', type: 'deskphone', x: 3, y: 12 },
    { id: 'o-st-chart', type: 'chartbinder', x: 9, y: 12 },
    { id: 'o-st-comp', type: 'compcart', x: 2, y: 18 },
    { id: 'o-st-med', type: 'icabinet', x: 2, y: 20, props: { w: 3, variant: 'drug', label: 'MED' } },

    // ════════ 데이룸 (dayroom, y9-22) ════════
    { id: 'bl-dr', type: 'baylabel', x: 14, y: 9, props: { text: 'DAY ROOM · 공동 활동' } },
    { id: 'o-dr-t1', type: 'grouptable', x: 15, y: 12, props: { w: 2, h: 1 } },
    { id: 'o-dr-t2', type: 'grouptable', x: 20, y: 17, props: { w: 2, h: 1 } },
    { id: 'o-dr-tv', type: 'walltv', x: 24, y: 9, props: { w: 2 } },
    { id: 'o-dr-c1', type: 'ichair', x: 15, y: 15, props: { color: '#A7D0BC', facing: 'up' } },
    { id: 'o-dr-c2', type: 'ichair', x: 17, y: 15, props: { color: '#A7D0BC', facing: 'up' } },
    { id: 'o-dr-c3', type: 'ichair', x: 19, y: 20, props: { color: '#A7D0BC', facing: 'up' } },
    { id: 'o-dr-c4', type: 'ichair', x: 23, y: 20, props: { color: '#A7D0BC', facing: 'up' } },
    { id: 'o-dr-water', type: 'watercooler', x: 25, y: 13 },
    { id: 'o-dr-plant', type: 'iplant', x: 25, y: 21 },

    // ════════ 안전 병실 (rooms, y24-42) ════════
    { id: 'bl-rm', type: 'baylabel', x: 1, y: 24, props: { text: 'SAFE ROOMS · 자해 방지' } },
    { id: 'o-rm-b1', type: 'safebed', x: 2, y: 27, props: { w: 2, h: 3 } },
    { id: 'o-rm-b2', type: 'safebed', x: 8, y: 27, props: { w: 2, h: 3 } },
    { id: 'o-rm-b3', type: 'safebed', x: 2, y: 37, props: { w: 2, h: 3 } },
    { id: 'o-rm-b4', type: 'safebed', x: 8, y: 37, props: { w: 2, h: 3 } },

    // ════════ 안정실 Seclusion (seclusion, y24-42) ════════
    { id: 'bl-sc', type: 'baylabel', x: 14, y: 24, props: { text: 'SECLUSION · 안정실' } },
    { id: 'o-sc-pad1', type: 'seclusionpad', x: 15, y: 28, props: { w: 4 } },
    { id: 'o-sc-pad2', type: 'seclusionpad', x: 15, y: 34, props: { w: 4 } },
    { id: 'o-sc-obswin', type: 'obswindow', x: 20, y: 26, props: { w: 3 } },
    { id: 'o-sc-plant', type: 'iplant', x: 25, y: 41 },
  ],
  hotspots: [
    { id: 'hs-contraband', kind: 'quest', x: 4, y: 3, label: '반입 금지품 확인' },
    { id: 'hs-observe', kind: 'info', x: 6, y: 15, label: '상시 관찰·라운드' },
    { id: 'hs-group', kind: 'info', x: 16, y: 12, label: '집단 치료 프로그램' },
    { id: 'hs-oneone', kind: 'info', x: 3, y: 27, label: '1:1 관찰' },
    { id: 'hs-cctv', kind: 'urgent', x: 16, y: 28, label: 'CCTV 상시 관찰' },
  ],
  npcs: [
    // sally
    { id: 'ps-sl-n', kind: 'nurse', mode: 'idle', seed: 1041, start: { x: 5, y: 5 } },
    { id: 'ps-sl-p', kind: 'patient', mode: 'idle', seed: 1042, start: { x: 17, y: 5 } },
    // station
    { id: 'ps-st-n', kind: 'nurse', mode: 'idle', seed: 1043, start: { x: 6, y: 16 } },
    { id: 'ps-st-d', kind: 'doctor', mode: 'idle', seed: 1044, start: { x: 9, y: 19 } },
    // dayroom
    { id: 'ps-dr-p', kind: 'patient', mode: 'idle', seed: 1045, start: { x: 18, y: 13 } },
    { id: 'ps-dr-n', kind: 'nurse', mode: 'idle', seed: 1046, start: { x: 22, y: 18 } },
    // rooms
    { id: 'ps-rm-n', kind: 'nurse', mode: 'idle', seed: 1047, start: { x: 6, y: 33 } },
    { id: 'ps-rm-p', kind: 'patient', mode: 'idle', seed: 1048, start: { x: 10, y: 31 } },
    // seclusion
    { id: 'ps-sc-p', kind: 'patient', mode: 'idle', seed: 1049, start: { x: 17, y: 32 } },
    { id: 'ps-sc-n', kind: 'nurse', mode: 'idle', seed: 1050, start: { x: 22, y: 38 } },
  ],
};
