// SIM LAB / NURSING ADMIN / INFECTION CONTROL — 간호부·감염관리·시뮬레이션 랩 (지원동
// ADMIN 3F). 1:1 port of the v16 handoff master blueprint (design-handoff_v16/
// reference/interior-sim.jsx): 28×42 tiles, clinical tone, LEFT elevator door. 간호부
// 총괄 사무실 → 감염관리실(PPE 착탈의) · 디브리핑 강의실 → 시뮬레이션 랩(마네킹) ·
// 원웨이 미러 제어실. New objects in simEquipment.tsx (SimManikin/ControlBooth/
// OfficeDesk/PPEBoard); shared/er/or/icu pieces reused. Markers label-only.
import type { Interior } from '@engine';

export const SIM_INTERIOR: Interior = {
  id: 'INT-SIM-00001',
  deptId: 'DEPT-SIM-00001',
  cols: 28,
  rows: 42,
  floorTheme: 'clinical',
  scale: 0.9,
  playerStart: { x: 4, y: 8 }, // nursing-admin office by the ← elevator door
  regions: [
    { id: 'infection', name: '감염관리실', icon: '🦠', bounds: { x: 0, y: 11, w: 14, h: 14 } },
    { id: 'debrief', name: '디브리핑 · 강의실', icon: '📽', bounds: { x: 13, y: 11, w: 15, h: 14 } },
    { id: 'simlab', name: '시뮬레이션 랩', icon: '🩺', bounds: { x: 0, y: 24, w: 19, h: 18 } },
    { id: 'booth', name: '제어실 (Control)', icon: '🎛', bounds: { x: 18, y: 24, w: 10, h: 18 } },
    { id: 'admin', name: '간호부 총괄 사무실', icon: '🗂', bounds: { x: 0, y: 0, w: 28, h: 12 } },
  ],
  rooms: [
    { id: 'admin', name: '간호부 사무실', sub: '행정·배치', icon: '🗂', color: '#BAE6FD', x: 6, y: 6 },
    { id: 'infection', name: '감염관리실', sub: 'PPE 착탈의', icon: '🦠', color: '#A7F3D0', x: 6, y: 17 },
    { id: 'debrief', name: '디브리핑실', sub: '강의·복기', icon: '📽', color: '#DDD6FE', x: 20, y: 17 },
    { id: 'simlab', name: '시뮬 랩', sub: '마네킹 실습', icon: '🩺', color: '#FBCFE8', x: 8, y: 34 },
    { id: 'booth', name: '제어실', sub: '시나리오 조작', icon: '🎛', color: '#C4CBD2', x: 23, y: 34 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y7-9
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 6 }, { x: 0, y: 10, w: 1, h: 31 },
    { x: 27, y: 1, w: 1, h: 40 },
    { x: 0, y: 41, w: 28, h: 1 },
    // admin | mid divider (y11) — thresholds x5-6 (→감염관리) / x13-14 (→강의실)
    { x: 1, y: 11, w: 4, h: 1 }, { x: 7, y: 11, w: 6, h: 1 }, { x: 15, y: 11, w: 12, h: 1 },
    // infection | debrief divider (x13)
    { x: 13, y: 12, w: 1, h: 13 },
    // mid | sim divider (y24) — threshold x7-8 (→시뮬랩)
    { x: 1, y: 24, w: 6, h: 1 }, { x: 9, y: 24, w: 18, h: 1 },
    // sim | control booth one-way-mirror wall (x18) — staff door y37 (handoff sealed
    // the booth; controllers enter beside the observation mirror)
    { x: 18, y: 25, w: 1, h: 12 }, { x: 18, y: 38, w: 1, h: 3 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 7, props: { w: 1, h: 3, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-inf', type: 'threshold', x: 5, y: 11, props: { w: 2, h: 1, label: '→ 감염관리' } },
    { id: 'th-deb', type: 'threshold', x: 13, y: 11, props: { w: 2, h: 1, label: '→ 강의실' } },
    { id: 'th-sim', type: 'threshold', x: 7, y: 24, props: { w: 2, h: 1, label: '→ 시뮬랩' } },
    { id: 'th-booth', type: 'threshold', x: 18, y: 37, props: { w: 1, h: 1, label: '→ 제어실' } },

    // ════════ 간호부 총괄 사무실 (admin, y1-10) ════════
    { id: 'bl-ad', type: 'baylabel', x: 1, y: 1, props: { text: 'NURSING ADMIN OFFICE · 간호부' } },
    { id: 'o-ad-d1', type: 'officedesk', x: 2, y: 3, props: { w: 2, h: 1 } },
    { id: 'o-ad-d2', type: 'officedesk', x: 7, y: 3, props: { w: 2, h: 1 } },
    { id: 'o-ad-d3', type: 'officedesk', x: 12, y: 3, props: { w: 2, h: 1 } },
    { id: 'o-ad-cab1', type: 'icabinet', x: 18, y: 2, props: { w: 4, variant: 'supply' } },
    { id: 'o-ad-cab2', type: 'icabinet', x: 22, y: 2, props: { w: 4, variant: 'supply' } },
    { id: 'o-ad-shelf', type: 'shelflabel', x: 18, y: 2, props: { text: '인사·근무표' } },
    { id: 'o-ad-water', type: 'watercooler', x: 25, y: 6 },
    { id: 'o-ad-plant', type: 'iplant', x: 25, y: 9 },

    // ════════ 감염관리실 (infection, y12-23) ════════
    { id: 'bl-in', type: 'baylabel', x: 1, y: 12, props: { text: 'INFECTION CONTROL · 감염관리', highlight: true } },
    { id: 'o-in-ppe', type: 'ppeboard', x: 2, y: 13, props: { w: 3 } },
    { id: 'o-in-gown', type: 'gownbox', x: 2, y: 16 },
    { id: 'o-in-scrub', type: 'scrubdispenser', x: 5, y: 16 },
    { id: 'o-in-waste', type: 'wastebin', x: 8, y: 16, props: { tone: 'infectious' } },
    { id: 'o-in-desk', type: 'officedesk', x: 2, y: 19, props: { w: 2, h: 1 } },

    // ════════ 디브리핑 · 강의실 (debrief, y12-23) ════════
    { id: 'bl-de', type: 'baylabel', x: 14, y: 12, props: { text: 'DEBRIEF · 강의실' } },
    { id: 'o-de-tv', type: 'walltv', x: 22, y: 12, props: { w: 2 } },
    { id: 'o-de-table', type: 'coffeetable', x: 17, y: 16, props: { w: 3, h: 1 } },
    { id: 'o-de-c1', type: 'ichair', x: 16, y: 14, props: { color: '#DDD6FE', facing: 'down' } },
    { id: 'o-de-c2', type: 'ichair', x: 18, y: 14, props: { color: '#DDD6FE', facing: 'down' } },
    { id: 'o-de-c3', type: 'ichair', x: 20, y: 14, props: { color: '#DDD6FE', facing: 'down' } },
    { id: 'o-de-c4', type: 'ichair', x: 16, y: 20, props: { color: '#DDD6FE', facing: 'up' } },
    { id: 'o-de-c5', type: 'ichair', x: 18, y: 20, props: { color: '#DDD6FE', facing: 'up' } },
    { id: 'o-de-c6', type: 'ichair', x: 20, y: 20, props: { color: '#DDD6FE', facing: 'up' } },

    // ════════ 시뮬레이션 랩 (simlab, y25-40) ════════
    { id: 'bl-sl', type: 'baylabel', x: 1, y: 25, props: { text: 'SIMULATION LAB · 시뮬 실습' } },
    { id: 'o-sl-manikin', type: 'simmanikin', x: 2, y: 28, props: { w: 2, h: 3 } },
    { id: 'o-sl-mon', type: 'imonitor', x: 1, y: 28, props: { beep: true } },
    { id: 'o-sl-crash', type: 'crashcart', x: 7, y: 28 },
    { id: 'o-sl-iv', type: 'ivpump', x: 6, y: 32 },
    { id: 'o-sl-vent', type: 'ventilator', x: 9, y: 30 },
    { id: 'o-sl-plant', type: 'iplant', x: 16, y: 38 },

    // ════════ 제어실 (booth, y25-40) ════════
    { id: 'bl-bo', type: 'baylabel', x: 19, y: 25, props: { text: 'CONTROL BOOTH' } },
    { id: 'o-bo-booth', type: 'controlbooth', x: 19, y: 27, props: { w: 1 } },
    { id: 'o-bo-desk', type: 'officedesk', x: 20, y: 33, props: { w: 2, h: 1 } },
  ],
  hotspots: [
    { id: 'hs-admin', kind: 'info', x: 3, y: 3, label: '근무 배치·행정' },
    { id: 'hs-ppe', kind: 'quest', x: 3, y: 16, label: 'PPE 착탈의 감사', scenarioId: 'SCN-SIM-00001' },
    { id: 'hs-debrief', kind: 'info', x: 18, y: 16, label: '사례 디브리핑' },
    { id: 'hs-scenario', kind: 'quest', x: 3, y: 28, label: '응급 시나리오 실습' },
    { id: 'hs-control', kind: 'info', x: 20, y: 30, label: '마네킹 시나리오 조작' },
  ],
  npcs: [
    // admin
    { id: 'si-ad-d', kind: 'doctor', mode: 'idle', seed: 1081, start: { x: 3, y: 7 } },
    { id: 'si-ad-n1', kind: 'nurse', mode: 'idle', seed: 1082, start: { x: 8, y: 7 } },
    { id: 'si-ad-n2', kind: 'nurse', mode: 'idle', seed: 1083, start: { x: 13, y: 7 } },
    // infection
    { id: 'si-in-n', kind: 'nurse', mode: 'idle', seed: 1084, start: { x: 6, y: 21 } },
    // debrief
    { id: 'si-de-d', kind: 'doctor', mode: 'idle', seed: 1085, start: { x: 22, y: 16 } },
    { id: 'si-de-n', kind: 'nurse', mode: 'idle', seed: 1086, start: { x: 17, y: 19 } },
    // simlab
    { id: 'si-sl-n1', kind: 'nurse', mode: 'idle', seed: 1087, start: { x: 4, y: 36 } },
    { id: 'si-sl-n2', kind: 'nurse', mode: 'idle', seed: 1088, start: { x: 7, y: 37 } },
    { id: 'si-sl-d', kind: 'doctor', mode: 'idle', seed: 1089, start: { x: 11, y: 34 } },
    // booth
    { id: 'si-bo-d', kind: 'doctor', mode: 'idle', seed: 1090, start: { x: 22, y: 37 } },
  ],
};
