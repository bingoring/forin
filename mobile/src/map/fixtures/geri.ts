// GERIATRIC / DEMENTIA — 치매·노인성 질환 병동 (암센터·재활관 ONCO 4F). 1:1 port of the
// v16 handoff master blueprint (design-handoff_v16/reference/interior-geri.jsx):
// 28×44 tiles, warm peds tone, LEFT elevator door. Dementia-friendly: 데이 커먼
// 배회 안전존(연속 손잡이·현실인식 게시판) → 노인 간호 스테이션(시야 확보) · 회상
// 라운지 → 치매 병실 A·B(초저상 침대·회상 상자). New objects in geriEquipment.tsx
// (LowBed/MemoryBox/OrientationBoard/GeriReclineChair/HandrailWall); ComfortCart
// (hospice)·er/shared reused. Markers label-only.
import type { Interior } from '@engine';

export const GERI_INTERIOR: Interior = {
  id: 'INT-GERI-00001',
  deptId: 'DEPT-GERI-00001',
  cols: 28,
  rows: 44,
  floorTheme: 'peds',
  scale: 0.9,
  playerStart: { x: 4, y: 8 }, // day common by the ← elevator door
  regions: [
    { id: 'station', name: '노인 간호 스테이션', icon: '👁', bounds: { x: 0, y: 9, w: 14, h: 14 } },
    { id: 'reminis', name: '회상 라운지', icon: '📻', bounds: { x: 13, y: 9, w: 15, h: 14 } },
    { id: 'roomA', name: '치매 병실 A', icon: '🛏', bounds: { x: 0, y: 22, w: 14, h: 22 } },
    { id: 'roomB', name: '치매 병실 B', icon: '🛏', bounds: { x: 13, y: 22, w: 15, h: 22 } },
    { id: 'daycommon', name: '데이 커먼 · 배회 안전존', icon: '🔆', bounds: { x: 0, y: 0, w: 28, h: 10 } },
  ],
  rooms: [
    { id: 'daycommon', name: '데이 커먼', sub: '배회 안전·활동', icon: '🔆', color: '#FDE68A', x: 6, y: 5 },
    { id: 'station', name: '노인 간호 스테이션', sub: '시야 확보', icon: '👁', color: '#BAE6FD', x: 6, y: 15 },
    { id: 'reminis', name: '회상 라운지', sub: '추억·정서 안정', icon: '📻', color: '#E4DAC8', x: 21, y: 15 },
    { id: 'roomA', name: '치매 병실 A', sub: '초저상·회상상자', icon: '🛏', color: '#B7C9A8', x: 6, y: 34 },
    { id: 'roomB', name: '치매 병실 B', sub: '낙상 방지', icon: '🛏', color: '#C7B8E8', x: 21, y: 34 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y7-9
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 6 }, { x: 0, y: 10, w: 1, h: 33 },
    { x: 27, y: 1, w: 1, h: 42 },
    { x: 0, y: 43, w: 28, h: 1 },
    // day common | mid divider (y9) — thresholds x5-7 (→복도) / x14-16 (→회상실)
    { x: 1, y: 9, w: 4, h: 1 }, { x: 8, y: 9, w: 6, h: 1 }, { x: 17, y: 9, w: 10, h: 1 },
    // station | reminis divider (x13) — threshold y14-17
    { x: 13, y: 10, w: 1, h: 4 }, { x: 13, y: 18, w: 1, h: 5 },
    // mid | rooms divider (y22) — thresholds x5-7 (→병실 A) / x14-16 (→병실 B)
    { x: 1, y: 22, w: 4, h: 1 }, { x: 8, y: 22, w: 6, h: 1 }, { x: 17, y: 22, w: 10, h: 1 },
    // room A | room B divider (x13)
    { x: 13, y: 23, w: 1, h: 20 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 7, props: { w: 1, h: 3, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-corr', type: 'threshold', x: 5, y: 9, props: { w: 3, h: 1, label: '→ 복도' } },
    { id: 'th-remi', type: 'threshold', x: 14, y: 9, props: { w: 3, h: 1, label: '→ 회상실' } },
    { id: 'th-remi2', type: 'threshold', x: 13, y: 14, props: { w: 1, h: 4 } },
    { id: 'th-roomA', type: 'threshold', x: 5, y: 22, props: { w: 3, h: 1, label: '→ 병실 A' } },
    { id: 'th-roomB', type: 'threshold', x: 14, y: 22, props: { w: 3, h: 1, label: '→ 병실 B' } },

    // ════════ 데이 커먼 · 배회 안전존 (daycommon, y1-8) ════════
    { id: 'bl-dc', type: 'baylabel', x: 1, y: 1, props: { text: 'DAY COMMON · 배회 안전존' } },
    { id: 'o-dc-rail', type: 'handrailwall', x: 2, y: 1, props: { w: 8 } },
    { id: 'o-dc-board', type: 'orientationboard', x: 2, y: 3, props: { w: 3 } },
    { id: 'o-dc-ch1', type: 'gerireclinechair', x: 12, y: 3, props: { w: 2, h: 2 } },
    { id: 'o-dc-table', type: 'coffeetable', x: 15, y: 4, props: { w: 2, h: 1 } },
    { id: 'o-dc-ch2', type: 'gerireclinechair', x: 18, y: 3, props: { w: 2, h: 2 } },
    { id: 'o-dc-tv', type: 'walltv', x: 23, y: 1, props: { w: 2 } },
    { id: 'o-dc-plant', type: 'iplant', x: 25, y: 7 },

    // ════════ 노인 간호 스테이션 (station, y10-21) ════════
    { id: 'bl-st', type: 'baylabel', x: 1, y: 10, props: { text: 'GERIATRIC STATION', highlight: true } },
    { id: 'o-st-desk', type: 'nursestation', x: 2, y: 13, props: { w: 9, h: 5 } },
    { id: 'o-st-phone', type: 'deskphone', x: 3, y: 13 },
    { id: 'o-st-chart', type: 'chartbinder', x: 9, y: 13 },
    { id: 'o-st-vitals', type: 'vitals', x: 2, y: 19 },

    // ════════ 회상 라운지 (reminis, y10-21) ════════
    { id: 'bl-rm', type: 'baylabel', x: 14, y: 10, props: { text: 'REMINISCENCE LOUNGE · 회상' } },
    { id: 'o-rm-sofa', type: 'sofa', x: 15, y: 13, props: { w: 3, h: 2, color: '#C4A578' } },
    { id: 'o-rm-table', type: 'coffeetable', x: 19, y: 14, props: { w: 2, h: 1 } },
    { id: 'o-rm-pic1', type: 'framedpic', x: 15, y: 10, props: { w: 2 } },
    { id: 'o-rm-pic2', type: 'framedpic', x: 21, y: 10, props: { w: 2 } },
    { id: 'o-rm-comfort', type: 'comfortcart', x: 23, y: 13, props: { w: 1, h: 1 } },
    { id: 'o-rm-plant', type: 'iplant', x: 25, y: 20 },

    // ════════ 치매 병실 A (roomA, y23-42) ════════
    { id: 'bl-a', type: 'baylabel', x: 1, y: 23, props: { text: 'DEMENTIA ROOM A' } },
    { id: 'o-a-mem', type: 'memorybox', x: 1, y: 24 },
    { id: 'o-a-bed1', type: 'lowbed', x: 3, y: 27, props: { occupied: true, w: 2, h: 3 } },
    { id: 'o-a-bed2', type: 'lowbed', x: 9, y: 27, props: { occupied: true, w: 2, h: 3 } },
    { id: 'o-a-chair', type: 'gerireclinechair', x: 3, y: 38, props: { w: 2, h: 2 } },
    { id: 'o-a-pic', type: 'framedpic', x: 11, y: 23, props: { w: 1 } },

    // ════════ 치매 병실 B (roomB, y23-42) ════════
    { id: 'bl-b', type: 'baylabel', x: 14, y: 23, props: { text: 'DEMENTIA ROOM B' } },
    { id: 'o-b-mem', type: 'memorybox', x: 14, y: 24 },
    { id: 'o-b-bed1', type: 'lowbed', x: 16, y: 27, props: { occupied: true, w: 2, h: 3 } },
    { id: 'o-b-bed2', type: 'lowbed', x: 22, y: 27, props: { w: 2, h: 3 } },
    { id: 'o-b-chair', type: 'gerireclinechair', x: 16, y: 38, props: { w: 2, h: 2 } },
    { id: 'o-b-plant', type: 'iplant', x: 25, y: 42 },
  ],
  hotspots: [
    { id: 'hs-orient', kind: 'info', x: 3, y: 3, label: '현실 인식 (날짜·계절)' },
    { id: 'hs-fall', kind: 'info', x: 6, y: 15, label: '배회·낙상 관찰' },
    { id: 'hs-reminis', kind: 'info', x: 16, y: 14, label: '추억 회상 요법' },
    { id: 'hs-lowbed', kind: 'quest', x: 4, y: 27, label: '초저상 낙상 사정' },
    { id: 'hs-night', kind: 'info', x: 17, y: 27, label: '야간 배회 관찰' },
  ],
  npcs: [
    // day common
    { id: 'ge-dc-p1', kind: 'patient', mode: 'idle', seed: 1021, start: { x: 13, y: 7 } },
    { id: 'ge-dc-p2', kind: 'patient', mode: 'idle', seed: 1022, start: { x: 19, y: 7 } },
    // station
    { id: 'ge-st-n', kind: 'nurse', mode: 'idle', seed: 1023, start: { x: 6, y: 16 } },
    { id: 'ge-st-d', kind: 'doctor', mode: 'idle', seed: 1024, start: { x: 9, y: 19 } },
    // reminis
    { id: 'ge-rm-p', kind: 'patient', mode: 'idle', seed: 1025, start: { x: 17, y: 19 } },
    { id: 'ge-rm-v', kind: 'visitor', mode: 'idle', seed: 1026, start: { x: 20, y: 19 } },
    // room A
    { id: 'ge-a-n', kind: 'nurse', mode: 'idle', seed: 1027, start: { x: 7, y: 33 } },
    { id: 'ge-a-p', kind: 'patient', mode: 'idle', seed: 1028, start: { x: 10, y: 40 } },
    // room B
    { id: 'ge-b-n', kind: 'nurse', mode: 'idle', seed: 1029, start: { x: 20, y: 33 } },
    { id: 'ge-b-v', kind: 'visitor', mode: 'idle', seed: 1030, start: { x: 23, y: 40 } },
  ],
};
