// INFUSION CENTER — 외래 주사센터 (Outpatient Infusion Center). 1:1 port of the
// v16 handoff master blueprint (design-handoff_v16/reference/interior-infusion.jsx):
// 28×40 tiles, clinical tone, LEFT elevator door. 접수·조제 전달 → 오픈 주입 베이
// (리클라이너 + 스마트 펌프) → 격리 주입실(과민반응 관찰) → 간이 휴게·다과 +
// 주입 간호 스테이션. Reuses the oncology chemo pieces (infusionchair/
// smartinfusionpump/ppestation) + ER/ICU/pharma catalog (pneumatictube/medfridge/
// handsanitizer/crashcart/compcart/watercooler/coffeetable/coffeemachine/
// nursestation/deskphone). Only 4 objects were new to port (infusionEquipment.tsx).
// Markers are label-only.
import type { Interior } from '@engine';

export const INFUSION_INTERIOR: Interior = {
  id: 'INT-INFUSION-00001',
  deptId: 'DEPT-INFUSION-00001',
  cols: 28,
  rows: 40,
  floorTheme: 'clinical',
  scale: 0.9,
  playerStart: { x: 4, y: 7 }, // check-in corridor by the ← elevator door
  regions: [
    { id: 'bay', name: '오픈 주입 베이', icon: '💉', bounds: { x: 0, y: 8, w: 20, h: 21 } },
    { id: 'private', name: '격리 주입실 (반응 관찰)', icon: '🚨', bounds: { x: 19, y: 8, w: 9, h: 21 } },
    { id: 'nourish', name: '간이 휴게 · 다과', icon: '🍵', bounds: { x: 0, y: 28, w: 14, h: 12 } },
    { id: 'station', name: '주입 간호 스테이션', icon: '🖥', bounds: { x: 13, y: 28, w: 15, h: 12 } },
    { id: 'check', name: '접수 · 조제 전달', icon: '📋', bounds: { x: 0, y: 0, w: 28, h: 9 } },
  ],
  rooms: [
    { id: 'check', name: '접수·조제전달', sub: '예약·약품 확인', icon: '📋', color: '#BAE6FD', x: 6, y: 4 },
    { id: 'bay', name: '주입 베이', sub: '리클라이너', icon: '💉', color: '#A7F3D0', x: 8, y: 17 },
    { id: 'private', name: '격리 주입실', sub: '과민반응 관찰', icon: '🚨', color: '#FCA5A5', x: 23, y: 17 },
    { id: 'nourish', name: '휴게·다과', sub: '수분·간식', icon: '🍵', color: '#FDE68A', x: 6, y: 34 },
    { id: 'station', name: '간호 스테이션', sub: '주입 관리', icon: '🖥', color: '#DDD6FE', x: 20, y: 34 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y5-6
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 4 }, { x: 0, y: 7, w: 1, h: 32 },
    { x: 27, y: 1, w: 1, h: 38 },
    { x: 0, y: 39, w: 28, h: 1 },
    // check | bay divider (y8) — thresholds x6-7 (→베이) / x19-20 (→격리, sterile)
    { x: 1, y: 8, w: 5, h: 1 }, { x: 8, y: 8, w: 11, h: 1 }, { x: 21, y: 8, w: 6, h: 1 },
    // bay | private vertical divider (x19)
    { x: 19, y: 9, w: 1, h: 20 },
    // bay | lower divider (y28) — threshold x6-7 (→휴게)
    { x: 1, y: 28, w: 5, h: 1 }, { x: 8, y: 28, w: 5, h: 1 },
    // nourish | station vertical divider (x13)
    { x: 13, y: 28, w: 1, h: 11 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 5, props: { w: 1, h: 2, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-bay', type: 'threshold', x: 6, y: 8, props: { w: 2, h: 1, label: '→ 주입 베이' } },
    { id: 'th-priv', type: 'threshold', x: 19, y: 8, props: { w: 2, h: 1, tone: 'sterile', label: '→ 격리실' } },
    { id: 'th-nour', type: 'threshold', x: 6, y: 28, props: { w: 2, h: 1, label: '→ 휴게' } },

    // ════════ 접수 · 조제 전달 (check, y1-7) ════════
    { id: 'bl-check', type: 'baylabel', x: 1, y: 1, props: { text: 'RECEPTION · 조제 전달' } },
    { id: 'o-ck-recep', type: 'ireception', x: 2, y: 3, props: { w: 5, h: 1, label: '접수' } },
    { id: 'o-ck-tube', type: 'pneumatictube', x: 9, y: 2 },
    { id: 'o-ck-cab', type: 'icabinet', x: 13, y: 2, props: { w: 3, variant: 'drug', label: '당일 약품' } },
    { id: 'o-ck-fridge', type: 'medfridge', x: 17, y: 2 },
    { id: 'o-ck-san', type: 'handsanitizer', x: 21, y: 2 },
    { id: 'o-ck-plant', type: 'iplant', x: 25, y: 5 },

    // ════════ 오픈 주입 베이 (bay, y9-27) ════════
    { id: 'bl-bay', type: 'baylabel', x: 1, y: 9, props: { text: 'INFUSION BAY · 오픈 주입', highlight: true } },
    { id: 'o-by-c1', type: 'infusionchair', x: 2, y: 11, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-by-p1', type: 'smartinfusionpump', x: 5, y: 11, props: { w: 1, h: 1 } },
    { id: 'o-by-c2', type: 'infusionchair', x: 7, y: 11, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-by-p2', type: 'smartinfusionpump', x: 10, y: 11, props: { w: 1, h: 1 } },
    { id: 'o-by-c3', type: 'infusionchair', x: 12, y: 11, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-by-p3', type: 'smartinfusionpump', x: 15, y: 11, props: { w: 1, h: 1 } },
    { id: 'o-by-c4', type: 'infusionchair', x: 2, y: 17, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-by-p4', type: 'smartinfusionpump', x: 5, y: 17, props: { w: 1, h: 1 } },
    { id: 'o-by-c5', type: 'infusionchair', x: 7, y: 17, props: { w: 2, h: 2 } },
    { id: 'o-by-p5', type: 'smartinfusionpump', x: 10, y: 17, props: { w: 1, h: 1 } },
    { id: 'o-by-c6', type: 'infusionchair', x: 12, y: 17, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-by-p6', type: 'smartinfusionpump', x: 15, y: 17, props: { w: 1, h: 1 } },
    { id: 'o-by-c7', type: 'infusionchair', x: 2, y: 23, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-by-p7', type: 'smartinfusionpump', x: 5, y: 23, props: { w: 1, h: 1 } },
    { id: 'o-by-c8', type: 'infusionchair', x: 7, y: 23, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-by-p8', type: 'smartinfusionpump', x: 10, y: 23, props: { w: 1, h: 1 } },

    // ════════ 격리 주입실 (private, y9-27) ════════
    { id: 'bl-priv', type: 'baylabel', x: 20, y: 9, props: { text: 'ISOLATION · 반응 관찰', highlight: true } },
    { id: 'o-pv-chair', type: 'infusionchair', x: 20, y: 12, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-pv-pump', type: 'smartinfusionpump', x: 23, y: 12, props: { w: 1, h: 1 } },
    { id: 'o-pv-mon', type: 'imonitor', x: 25, y: 12, props: { beep: true } },
    { id: 'o-pv-crash', type: 'crashcart', x: 24, y: 17 },
    { id: 'o-pv-ppe', type: 'ppestation', x: 20, y: 20 },

    // ════════ 간이 휴게 · 다과 (nourish, y29-38) ════════
    { id: 'bl-nour', type: 'baylabel', x: 1, y: 29, props: { text: 'NOURISHMENT · 다과' } },
    { id: 'o-no-water', type: 'watercooler', x: 2, y: 31 },
    { id: 'o-no-coffee', type: 'coffeemachine', x: 4, y: 31, props: { w: 1, h: 1 } },
    { id: 'o-no-table', type: 'coffeetable', x: 6, y: 33, props: { w: 2, h: 1 } },
    { id: 'o-no-ch1', type: 'ichair', x: 9, y: 32, props: { color: '#FDE68A', facing: 'left' } },
    { id: 'o-no-ch2', type: 'ichair', x: 9, y: 35, props: { color: '#FDE68A', facing: 'left' } },

    // ════════ 주입 간호 스테이션 (station, y29-38) ════════
    { id: 'bl-stn', type: 'baylabel', x: 14, y: 29, props: { text: 'INFUSION STATION' } },
    { id: 'o-st-desk', type: 'nursestation', x: 15, y: 31, props: { w: 9, h: 5 } },
    { id: 'o-st-phone', type: 'deskphone', x: 16, y: 31 },
    { id: 'o-st-comp', type: 'compcart', x: 22, y: 31 },
    { id: 'o-st-plant', type: 'iplant', x: 25, y: 37 },
  ],
  hotspots: [
    { id: 'hs-verify', kind: 'quest', x: 3, y: 3, label: '예약·약품 대조', scenarioId: 'SCN-INFUSION-00001' },
    { id: 'hs-rate', kind: 'quest', x: 7, y: 11, label: '주입 속도·부작용' },
    { id: 'hs-anaphylaxis', kind: 'urgent', x: 20, y: 12, label: '아나필락시스 관찰' },
    { id: 'hs-nourish', kind: 'info', x: 4, y: 31, label: '수분·간식 보충' },
    { id: 'hs-chart', kind: 'info', x: 18, y: 34, label: '주입 일정·차팅' },
  ],
  npcs: [
    // check
    { id: 'if-ck-n', kind: 'nurse', mode: 'idle', seed: 821, start: { x: 4, y: 5 } },
    { id: 'if-ck-p', kind: 'patient', mode: 'idle', seed: 822, start: { x: 12, y: 5 } },
    // bay
    { id: 'if-by-n', kind: 'nurse', mode: 'idle', seed: 823, start: { x: 9, y: 14 } },
    { id: 'if-by-p', kind: 'patient', mode: 'idle', seed: 824, start: { x: 13, y: 20 } },
    // private
    { id: 'if-pv-n', kind: 'nurse', mode: 'idle', seed: 825, start: { x: 22, y: 16 } },
    // nourish
    { id: 'if-no-v', kind: 'visitor', mode: 'idle', seed: 826, start: { x: 7, y: 35 } },
    // station
    { id: 'if-st-n', kind: 'nurse', mode: 'idle', seed: 827, start: { x: 18, y: 35 } },
    { id: 'if-st-d', kind: 'doctor', mode: 'idle', seed: 828, start: { x: 21, y: 35 } },
  ],
};
