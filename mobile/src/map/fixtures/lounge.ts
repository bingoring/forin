// STAFF LOUNGE / LOCKER / CAFETERIA — 직원 락커룸·의료진 휴게실·식당 (지원동 ADMIN 2F).
// 1:1 port of the v16 handoff master blueprint (design-handoff_v16/reference/
// interior-lounge.jsx): 28×40 tiles, clinical tone, LEFT elevator door. Staff-only:
// 락커룸 A·B(사물함·벤치) → 의료진 휴게실(소파·자판기·당직 리클라이너) · 직원 식당
// (배식 라인·식탁). New objects in loungeEquipment.tsx (LockerBank/Vending/
// DiningTable/ServeryCounter); coffeemachine(infusion)·nursingrecliner(nursery)·
// sink/shared reused. Markers label-only.
import type { Interior } from '@engine';

export const LOUNGE_INTERIOR: Interior = {
  id: 'INT-LOUNGE-00001',
  deptId: 'DEPT-LOUNGE-00001',
  cols: 28,
  rows: 40,
  floorTheme: 'clinical',
  scale: 0.9,
  playerStart: { x: 4, y: 14 }, // locker room A by the ← elevator door
  regions: [
    { id: 'lockerA', name: '락커룸 A · 탈의', icon: '🚹', bounds: { x: 0, y: 0, w: 14, h: 16 } },
    { id: 'lockerB', name: '락커룸 B · 탈의', icon: '🚺', bounds: { x: 13, y: 0, w: 15, h: 16 } },
    { id: 'lounge', name: '의료진 휴게실', icon: '☕', bounds: { x: 0, y: 15, w: 14, h: 25 } },
    { id: 'cafe', name: '직원 식당 (배식·식사)', icon: '🍽', bounds: { x: 13, y: 15, w: 15, h: 25 } },
  ],
  rooms: [
    { id: 'lockerA', name: '락커룸 A', sub: '탈의·사물함', icon: '🚹', color: '#BAE6FD', x: 6, y: 8 },
    { id: 'lockerB', name: '락커룸 B', sub: '탈의·사물함', icon: '🚺', color: '#FBCFE8', x: 20, y: 8 },
    { id: 'lounge', name: '휴게실', sub: '소파·자판기', icon: '☕', color: '#FDE68A', x: 6, y: 28 },
    { id: 'cafe', name: '직원 식당', sub: '배식·식사', icon: '🍽', color: '#A7F3D0', x: 20, y: 28 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y12-13
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 11 }, { x: 0, y: 14, w: 1, h: 25 },
    { x: 27, y: 1, w: 1, h: 38 },
    { x: 0, y: 39, w: 28, h: 1 },
    // locker | lounge divider (y15) — thresholds x6-7 (→휴게실) / x13-14 (→식당)
    { x: 1, y: 15, w: 5, h: 1 }, { x: 8, y: 15, w: 5, h: 1 }, { x: 15, y: 15, w: 12, h: 1 },
    // locker A | B divider (x13)
    { x: 13, y: 1, w: 1, h: 14 },
    // lounge | cafe divider (x13) — doorway y27 (handoff walled lounge↔cafe fully,
    // disconnecting the cafeteria/locker-B half from the elevator side)
    { x: 13, y: 16, w: 1, h: 11 }, { x: 13, y: 28, w: 1, h: 11 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 12, props: { w: 1, h: 2, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-lounge', type: 'threshold', x: 6, y: 15, props: { w: 2, h: 1, label: '→ 휴게실' } },
    { id: 'th-cafe', type: 'threshold', x: 13, y: 15, props: { w: 2, h: 1, label: '→ 식당' } },
    { id: 'th-locafe', type: 'threshold', x: 13, y: 27, props: { w: 1, h: 1, label: '→ 식당' } },

    // ════════ 락커룸 A (lockerA, y1-14) ════════
    { id: 'bl-la', type: 'baylabel', x: 1, y: 1, props: { text: 'LOCKER ROOM A', highlight: true } },
    { id: 'o-la-l1', type: 'lockerbank', x: 2, y: 2, props: { w: 3 } },
    { id: 'o-la-l2', type: 'lockerbank', x: 7, y: 2, props: { w: 3 } },
    { id: 'o-la-l3', type: 'lockerbank', x: 2, y: 9, props: { w: 3 } },
    { id: 'o-la-bench', type: 'coffeetable', x: 7, y: 9, props: { w: 2, h: 1 } },
    { id: 'o-la-san', type: 'handsanitizer', x: 11, y: 2 },

    // ════════ 락커룸 B (lockerB, y1-14) ════════
    { id: 'bl-lb', type: 'baylabel', x: 14, y: 1, props: { text: 'LOCKER ROOM B' } },
    { id: 'o-lb-l1', type: 'lockerbank', x: 15, y: 2, props: { w: 3 } },
    { id: 'o-lb-l2', type: 'lockerbank', x: 19, y: 2, props: { w: 3 } },
    { id: 'o-lb-l3', type: 'lockerbank', x: 23, y: 2, props: { w: 3 } },
    { id: 'o-lb-bench', type: 'coffeetable', x: 18, y: 9, props: { w: 2, h: 1 } },
    { id: 'o-lb-sink', type: 'sink', x: 24, y: 9 },

    // ════════ 의료진 휴게실 (lounge, y16-38) ════════
    { id: 'bl-lo', type: 'baylabel', x: 1, y: 16, props: { text: 'STAFF LOUNGE · 휴게실' } },
    { id: 'o-lo-tv', type: 'walltv', x: 3, y: 16, props: { w: 2 } },
    { id: 'o-lo-sofa1', type: 'sofa', x: 2, y: 20, props: { w: 3, h: 2, color: '#C0A6B8' } },
    { id: 'o-lo-sofa2', type: 'sofa', x: 2, y: 25, props: { w: 3, h: 2, color: '#8FA9C4' } },
    { id: 'o-lo-table', type: 'coffeetable', x: 6, y: 22, props: { w: 2, h: 1 } },
    { id: 'o-lo-vend', type: 'vending', x: 10, y: 17, props: { w: 1, h: 1 } },
    { id: 'o-lo-coffee', type: 'coffeemachine', x: 11, y: 22, props: { w: 1, h: 1 } },
    { id: 'o-lo-water', type: 'watercooler', x: 11, y: 26 },
    { id: 'o-lo-rec1', type: 'nursingrecliner', x: 2, y: 31, props: { w: 2, h: 2 } },
    { id: 'o-lo-rec2', type: 'nursingrecliner', x: 7, y: 31, props: { w: 2, h: 2 } },
    { id: 'o-lo-plant', type: 'iplant', x: 11, y: 36 },

    // ════════ 직원 식당 (cafe, y16-38) ════════
    { id: 'bl-ca', type: 'baylabel', x: 14, y: 16, props: { text: 'STAFF CAFETERIA · 식당' } },
    { id: 'o-ca-servery', type: 'serverycounter', x: 15, y: 18, props: { w: 4, h: 1 } },
    { id: 'o-ca-coffee', type: 'coffeemachine', x: 24, y: 17, props: { w: 1, h: 1 } },
    { id: 'o-ca-t1', type: 'diningtable', x: 15, y: 23, props: { w: 2, h: 1 } },
    { id: 'o-ca-t2', type: 'diningtable', x: 21, y: 23, props: { w: 2, h: 1 } },
    { id: 'o-ca-t3', type: 'diningtable', x: 15, y: 30, props: { w: 2, h: 1 } },
    { id: 'o-ca-t4', type: 'diningtable', x: 21, y: 30, props: { w: 2, h: 1 } },
    { id: 'o-ca-c1', type: 'ichair', x: 15, y: 26, props: { color: '#A7F3D0', facing: 'up' } },
    { id: 'o-ca-c2', type: 'ichair', x: 17, y: 26, props: { color: '#A7F3D0', facing: 'up' } },
    { id: 'o-ca-c3', type: 'ichair', x: 21, y: 26, props: { color: '#A7F3D0', facing: 'up' } },
    { id: 'o-ca-c4', type: 'ichair', x: 23, y: 26, props: { color: '#A7F3D0', facing: 'up' } },
    { id: 'o-ca-c5', type: 'ichair', x: 15, y: 33, props: { color: '#A7F3D0', facing: 'up' } },
    { id: 'o-ca-c6', type: 'ichair', x: 17, y: 33, props: { color: '#A7F3D0', facing: 'up' } },
    { id: 'o-ca-c7', type: 'ichair', x: 21, y: 33, props: { color: '#A7F3D0', facing: 'up' } },
    { id: 'o-ca-c8', type: 'ichair', x: 23, y: 33, props: { color: '#A7F3D0', facing: 'up' } },
    { id: 'o-ca-plant', type: 'iplant', x: 25, y: 36 },
  ],
  hotspots: [
    { id: 'hs-change', kind: 'quest', x: 3, y: 2, label: '근무복 환복' },
    { id: 'hs-tidy', kind: 'info', x: 16, y: 2, label: '탈의·정리' },
    { id: 'hs-rest', kind: 'info', x: 4, y: 20, label: '교대 휴식' },
    { id: 'hs-meal', kind: 'quest', x: 16, y: 18, label: '배식·식사' },
  ],
  npcs: [
    // lockerA
    { id: 'lo-la-n', kind: 'nurse', mode: 'idle', seed: 1101, start: { x: 5, y: 6 } },
    { id: 'lo-la-d', kind: 'doctor', mode: 'idle', seed: 1102, start: { x: 9, y: 11 } },
    // lockerB
    { id: 'lo-lb-n1', kind: 'nurse', mode: 'idle', seed: 1103, start: { x: 17, y: 6 } },
    { id: 'lo-lb-n2', kind: 'nurse', mode: 'idle', seed: 1104, start: { x: 22, y: 11 } },
    // lounge
    { id: 'lo-lo-n', kind: 'nurse', mode: 'idle', seed: 1105, start: { x: 4, y: 23 } },
    { id: 'lo-lo-d', kind: 'doctor', mode: 'idle', seed: 1106, start: { x: 9, y: 34 } },
    // cafe
    { id: 'lo-ca-n1', kind: 'nurse', mode: 'idle', seed: 1107, start: { x: 17, y: 20 } },
    { id: 'lo-ca-d', kind: 'doctor', mode: 'idle', seed: 1108, start: { x: 22, y: 27 } },
    { id: 'lo-ca-n2', kind: 'nurse', mode: 'idle', seed: 1109, start: { x: 16, y: 34 } },
  ],
};
