// HOSPICE / PALLIATIVE — 완화의료·호스피스 병동 (암센터·재활관 ONCO 4F). 1:1 port of
// the v16 handoff master blueprint (design-handoff_v16/reference/interior-hospice.jsx):
// 28×44 tiles, warm home-like peds tone, LEFT elevator door. NOT a clinical ward —
// 가족 라운지·키친 → 완화 케어 스테이션 · 명상/추모실 → 가정형 1인 완화 병실 A ·
// 정원뷰 선룸 병실 B. New objects in hospiceEquipment.tsx (HospiceBed/ComfortCart/
// SyringeDriver/ADLKitchen); ReclinerDaybed(picu)·Fridge(onco)·shared reused.
import type { Interior } from '@engine';

export const HOSPICE_INTERIOR: Interior = {
  id: 'INT-HOSPICE-00001',
  deptId: 'DEPT-HOSPICE-00001',
  cols: 28,
  rows: 44,
  floorTheme: 'peds',
  scale: 0.9,
  playerStart: { x: 4, y: 8 }, // family lounge by the ← elevator door
  regions: [
    { id: 'station', name: '완화 케어 스테이션', icon: '🕊', bounds: { x: 0, y: 9, w: 14, h: 14 } },
    { id: 'reflection', name: '명상 · 추모실', icon: '🕯', bounds: { x: 13, y: 9, w: 15, h: 14 } },
    { id: 'room1', name: '1인 완화 병실 A', icon: '🛏', bounds: { x: 0, y: 22, w: 14, h: 22 } },
    { id: 'sunroom', name: '정원뷰 선룸 · 병실 B', icon: '🌿', bounds: { x: 13, y: 22, w: 15, h: 22 } },
    { id: 'lounge', name: '가족 라운지 · 키친', icon: '🍵', bounds: { x: 0, y: 0, w: 28, h: 10 } },
  ],
  rooms: [
    { id: 'lounge', name: '가족 라운지', sub: '키친·휴식', icon: '🍵', color: '#E4DAC8', x: 6, y: 5 },
    { id: 'station', name: '완화 케어 데스크', sub: '통증·정서 케어', icon: '🕊', color: '#BAE6FD', x: 6, y: 15 },
    { id: 'reflection', name: '명상·추모실', sub: '조용한 공간', icon: '🕯', color: '#E4ECE0', x: 20, y: 15 },
    { id: 'room1', name: '완화 병실 A', sub: '가정형 1인실', icon: '🛏', color: '#B7C9A8', x: 6, y: 34 },
    { id: 'sunroom', name: '선룸 · 병실 B', sub: '정원뷰 임종실', icon: '🌿', color: '#C7E8D8', x: 21, y: 34 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y7-9
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 6 }, { x: 0, y: 10, w: 1, h: 33 },
    { x: 27, y: 1, w: 1, h: 42 },
    { x: 0, y: 43, w: 28, h: 1 },
    // lounge | mid divider (y9) — thresholds x5-7 (→복도) / x14-16 (→명상실)
    { x: 1, y: 9, w: 4, h: 1 }, { x: 8, y: 9, w: 6, h: 1 }, { x: 17, y: 9, w: 10, h: 1 },
    // station | reflection divider (x13) — threshold y14-17
    { x: 13, y: 10, w: 1, h: 4 }, { x: 13, y: 18, w: 1, h: 5 },
    // mid | rooms divider (y22) — thresholds x5-7 (→병실 A) / x14-16 (→선룸 B)
    { x: 1, y: 22, w: 4, h: 1 }, { x: 8, y: 22, w: 6, h: 1 }, { x: 17, y: 22, w: 10, h: 1 },
    // room A | sunroom divider (x13)
    { x: 13, y: 23, w: 1, h: 20 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 7, props: { w: 1, h: 3, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-corr', type: 'threshold', x: 5, y: 9, props: { w: 3, h: 1, label: '→ 복도' } },
    { id: 'th-refl', type: 'threshold', x: 14, y: 9, props: { w: 3, h: 1, label: '→ 명상실' } },
    { id: 'th-refl2', type: 'threshold', x: 13, y: 14, props: { w: 1, h: 4 } },
    { id: 'th-roomA', type: 'threshold', x: 5, y: 22, props: { w: 3, h: 1, label: '→ 병실 A' } },
    { id: 'th-sunB', type: 'threshold', x: 14, y: 22, props: { w: 3, h: 1, label: '→ 선룸 B' } },

    // ════════ 가족 라운지 · 키친 (lounge, y1-8) ════════
    { id: 'bl-lg', type: 'baylabel', x: 1, y: 1, props: { text: 'FAMILY LOUNGE · 가족 라운지' } },
    { id: 'o-lg-kitchen', type: 'adlkitchen', x: 2, y: 2, props: { w: 3, h: 1 } },
    { id: 'o-lg-fridge', type: 'fridge', x: 6, y: 2, props: { w: 1, h: 1 } },
    { id: 'o-lg-water', type: 'watercooler', x: 8, y: 2 },
    { id: 'o-lg-sofa', type: 'sofa', x: 12, y: 3, props: { w: 3, h: 2, color: '#B7C9A8' } },
    { id: 'o-lg-table', type: 'coffeetable', x: 16, y: 4, props: { w: 2, h: 1 } },
    { id: 'o-lg-day', type: 'reclinerdaybed', x: 19, y: 3, props: { w: 2, h: 2 } },
    { id: 'o-lg-pic', type: 'framedpic', x: 13, y: 1, props: { w: 2 } },
    { id: 'o-lg-plant', type: 'iplant', x: 25, y: 2 },

    // ════════ 완화 케어 스테이션 (station, y10-21) ════════
    { id: 'bl-st', type: 'baylabel', x: 1, y: 10, props: { text: 'PALLIATIVE CARE DESK', highlight: true } },
    { id: 'o-st-desk', type: 'nursestation', x: 2, y: 13, props: { w: 9, h: 5 } },
    { id: 'o-st-phone', type: 'deskphone', x: 3, y: 13 },
    { id: 'o-st-chart', type: 'chartbinder', x: 9, y: 13 },
    { id: 'o-st-comfort', type: 'comfortcart', x: 2, y: 19, props: { w: 1, h: 1 } },

    // ════════ 명상 · 추모실 (reflection, y10-21) ════════
    { id: 'o-rf-tint', type: 'tint', x: 14, y: 10, props: { w: 13, h: 12, color: '#2A2440', op: 0.1 } },
    { id: 'bl-rf', type: 'baylabel', x: 14, y: 10, props: { text: 'REFLECTION ROOM · 명상' } },
    { id: 'o-rf-sofa1', type: 'sofa', x: 15, y: 13, props: { w: 2, h: 2, color: '#A9B5C4' } },
    { id: 'o-rf-sofa2', type: 'sofa', x: 20, y: 13, props: { w: 2, h: 2, color: '#A9B5C4' } },
    { id: 'o-rf-table', type: 'coffeetable', x: 17, y: 17, props: { w: 2, h: 1 } },
    { id: 'o-rf-pic', type: 'framedpic', x: 23, y: 11, props: { w: 2 } },
    { id: 'o-rf-plant', type: 'iplant', x: 25, y: 19 },

    // ════════ 1인 완화 병실 A (room1, y23-42) ════════
    { id: 'bl-a', type: 'baylabel', x: 1, y: 23, props: { text: 'PALLIATIVE ROOM A · 가정형' } },
    { id: 'o-a-bed', type: 'hospicebed', x: 2, y: 26, props: { occupied: true, w: 2, h: 3 } },
    { id: 'o-a-driver', type: 'syringedriver', x: 7, y: 27, props: { w: 1, h: 1 } },
    { id: 'o-a-mon', type: 'imonitor', x: 1, y: 26 },
    { id: 'o-a-day', type: 'reclinerdaybed', x: 2, y: 37, props: { w: 2, h: 2 } },
    { id: 'o-a-pic', type: 'framedpic', x: 9, y: 23, props: { w: 2 } },
    { id: 'o-a-plant', type: 'iplant', x: 11, y: 30 },

    // ════════ 정원뷰 선룸 · 병실 B (sunroom, y23-42) ════════
    { id: 'o-b-glass', type: 'glass', x: 26, y: 24, props: { w: 1, h: 18 } },
    { id: 'o-b-tint', type: 'tint', x: 20, y: 24, props: { w: 7, h: 18, color: '#EAF6DE', op: 0.16 } },
    { id: 'bl-b', type: 'baylabel', x: 14, y: 23, props: { text: 'SUNROOM · 정원뷰 병실 B' } },
    { id: 'o-b-bed', type: 'hospicebed', x: 15, y: 27, props: { occupied: true, w: 2, h: 3 } },
    { id: 'o-b-driver', type: 'syringedriver', x: 20, y: 28, props: { w: 1, h: 1 } },
    { id: 'o-b-p1', type: 'iplant', x: 24, y: 26 },
    { id: 'o-b-p2', type: 'iplant', x: 24, y: 33 },
    { id: 'o-b-p3', type: 'iplant', x: 24, y: 40 },
    { id: 'o-b-day', type: 'reclinerdaybed', x: 15, y: 38, props: { w: 2, h: 2 } },
  ],
  hotspots: [
    { id: 'hs-lounge', kind: 'info', x: 13, y: 4, label: '가족 휴식 공간' },
    { id: 'hs-pain', kind: 'info', x: 6, y: 15, label: '통증·증상 관리' },
    { id: 'hs-reflect', kind: 'info', x: 17, y: 14, label: '조용한 성찰' },
    { id: 'hs-infpain', kind: 'quest', x: 3, y: 26, label: '지속주입 통증 조절', scenarioId: 'SCN-HOSPICE-00001' },
    { id: 'hs-dignity', kind: 'info', x: 16, y: 27, label: '임종 돌봄·존엄 케어' },
  ],
  npcs: [
    // lounge
    { id: 'ho-lg-p', kind: 'parent', mode: 'idle', seed: 1001, start: { x: 14, y: 7 } },
    { id: 'ho-lg-v', kind: 'visitor', mode: 'idle', seed: 1002, start: { x: 20, y: 7 } },
    // station
    { id: 'ho-st-n', kind: 'nurse', mode: 'idle', seed: 1003, start: { x: 6, y: 16 } },
    { id: 'ho-st-d', kind: 'doctor', mode: 'idle', seed: 1004, start: { x: 9, y: 19 } },
    // reflection
    { id: 'ho-rf-v', kind: 'visitor', mode: 'idle', seed: 1005, start: { x: 18, y: 19 } },
    // room A
    { id: 'ho-a-n', kind: 'nurse', mode: 'idle', seed: 1006, start: { x: 6, y: 31 } },
    { id: 'ho-a-p', kind: 'parent', mode: 'idle', seed: 1007, start: { x: 4, y: 40 } },
    // sunroom B
    { id: 'ho-b-n', kind: 'nurse', mode: 'idle', seed: 1008, start: { x: 19, y: 32 } },
    { id: 'ho-b-v', kind: 'visitor', mode: 'idle', seed: 1009, start: { x: 18, y: 41 } },
  ],
};
