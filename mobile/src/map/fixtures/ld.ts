// L&D — 가족 분만실 Labor & Delivery + 산후 모아동실 + 신생아실 (여성소아 센터 3F).
// 1:1 port of the v16 handoff master blueprint (design-handoff_v16/reference/
// interior-ld.jsx): 28×50 tiles, peds tone, LEFT elevator door. This is the
// COMBINED obstetric floor — OB triage · epidural prep · central station · LDR
// birthing rooms · postpartum mother-baby room · glass nursery — matching the
// elevator's 3F label. Reuses the L&D catalog (birthing bed/delivery cart new in
// ldEquipment.tsx; bassinet/infantwarmer/nursingrecliner/warmercabinet/
// fetalmonitor from nursery/womenkids) + ER/ward/shared pieces. Markers label-only.
import type { Interior } from '@engine';

export const LD_INTERIOR: Interior = {
  id: 'INT-LD-00001',
  deptId: 'DEPT-LD-00001',
  cols: 28,
  rows: 50,
  floorTheme: 'peds',
  scale: 0.9,
  playerStart: { x: 4, y: 15 }, // central station corridor by the ← elevator door
  regions: [
    { id: 'triage', name: '산모 분류 · OB Triage', icon: '🤰', bounds: { x: 0, y: 0, w: 14, h: 11 } },
    { id: 'anes', name: '무통 · 마취 준비', icon: '💉', bounds: { x: 13, y: 0, w: 15, h: 11 } },
    { id: 'station', name: '중앙 간호 스테이션', icon: '🖥', bounds: { x: 0, y: 10, w: 28, h: 11 } },
    { id: 'ldr', name: 'LDR 분만실', icon: '👶', bounds: { x: 0, y: 20, w: 28, h: 16 } },
    { id: 'postpartum', name: '산후 모아동실', icon: '🛏', bounds: { x: 0, y: 35, w: 15, h: 15 } },
    { id: 'nursery', name: '신생아실 Nursery', icon: '🍼', bounds: { x: 14, y: 35, w: 14, h: 15 } },
  ],
  rooms: [
    { id: 'triage', name: 'OB Triage', sub: '산모 분류·모니터', icon: '🤰', color: '#F9C9D6', x: 4, y: 5 },
    { id: 'anes', name: '무통·마취 준비', sub: 'Epidural', icon: '💉', color: '#DDD6FE', x: 20, y: 5 },
    { id: 'station', name: '간호 스테이션', sub: '분만 조율', icon: '🖥', color: '#BAE6FD', x: 13, y: 15 },
    { id: 'ldr', name: 'LDR 분만실', sub: '진통·분만·회복', icon: '👶', color: '#FBCFE8', x: 8, y: 27 },
    { id: 'postpartum', name: '산후 모아동실', sub: '모유수유 교육', icon: '🛏', color: '#FDE68A', x: 7, y: 44 },
    { id: 'nursery', name: '신생아실', sub: '바시넷·수유', icon: '🍼', color: '#A7F3D0', x: 21, y: 44 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y14-16
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 13 }, { x: 0, y: 17, w: 1, h: 32 },
    { x: 27, y: 1, w: 1, h: 48 },
    { x: 0, y: 49, w: 28, h: 1 },
    // service strip divider (y10) — thresholds x6-7 / x13-14
    { x: 1, y: 10, w: 5, h: 1 }, { x: 8, y: 10, w: 5, h: 1 }, { x: 15, y: 10, w: 12, h: 1 },
    // triage | anes divider (x13) — threshold y6-8
    { x: 13, y: 1, w: 1, h: 5 }, { x: 13, y: 9, w: 1, h: 1 },
    // station | ldr divider (y20) — thresholds x7-9 / x18-20
    { x: 1, y: 20, w: 6, h: 1 }, { x: 10, y: 20, w: 8, h: 1 }, { x: 21, y: 20, w: 6, h: 1 },
    // ldr | lower divider (y35) — threshold x6-7 (→산후) / x17-18 (→신생아실 sterile)
    { x: 1, y: 35, w: 5, h: 1 }, { x: 8, y: 35, w: 9, h: 1 }, { x: 19, y: 35, w: 8, h: 1 },
    // postpartum | nursery divider (x14) — wall y36-37 then glass y38-48
    { x: 14, y: 36, w: 1, h: 2 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 14, props: { w: 1, h: 3, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-corr1', type: 'threshold', x: 6, y: 10, props: { w: 2, h: 1, label: '→ 복도' } },
    { id: 'th-corr2', type: 'threshold', x: 13, y: 10, props: { w: 2, h: 1, label: '→ 복도' } },
    { id: 'th-tri', type: 'threshold', x: 13, y: 6, props: { w: 1, h: 3 } },
    { id: 'th-ldr1', type: 'threshold', x: 7, y: 20, props: { w: 3, h: 1 } },
    { id: 'th-ldr2', type: 'threshold', x: 18, y: 20, props: { w: 3, h: 1 } },
    { id: 'th-pp', type: 'threshold', x: 6, y: 35, props: { w: 2, h: 1, label: '→ 산후' } },
    { id: 'th-nur', type: 'threshold', x: 17, y: 35, props: { w: 2, h: 1, tone: 'sterile', label: '→ 신생아실' } },
    { id: 'o-pp-glass', type: 'glass', x: 14, y: 38, props: { w: 1, h: 11 } },

    // ════════ OB Triage (y1-9) ════════
    { id: 'bl-tri', type: 'baylabel', x: 1, y: 1, props: { text: 'OB TRIAGE · 산모 분류', highlight: true } },
    { id: 'o-tr-bed', type: 'ibed', x: 2, y: 3, props: { variant: 'ward', occupied: true, label: 'TRIAGE' } },
    { id: 'o-tr-fetal', type: 'fetalmonitor', x: 5, y: 2, props: { w: 2, h: 2 } },
    { id: 'o-tr-iv', type: 'iiv', x: 7, y: 3 },
    { id: 'o-tr-vitals', type: 'vitals', x: 9, y: 5 },

    // ════════ 무통 · 마취 준비 (y1-9) ════════
    { id: 'bl-anes', type: 'baylabel', x: 14, y: 1, props: { text: 'EPIDURAL PREP' } },
    { id: 'o-an-cab1', type: 'icabinet', x: 14, y: 2, props: { w: 3, variant: 'drug', label: 'EPIDURAL' } },
    { id: 'o-an-cab2', type: 'icabinet', x: 17, y: 2, props: { w: 3, variant: 'sterile' } },
    { id: 'o-an-recep', type: 'ireception', x: 21, y: 3, props: { w: 3, h: 1, label: '마취 기록' } },
    { id: 'o-an-comp', type: 'compcart', x: 24, y: 2 },

    // ════════ 중앙 간호 스테이션 · 복도 (y11-19) ════════
    { id: 'bl-stn', type: 'baylabel', x: 1, y: 11, props: { text: 'L&D NURSING STATION', highlight: true } },
    { id: 'o-st-rail', type: 'handrail', x: 27, y: 11, props: { w: 1, h: 8, vertical: true } },
    { id: 'o-st-desk', type: 'nursestation', x: 8, y: 12, props: { w: 12, h: 5 } },
    { id: 'o-st-ph1', type: 'deskphone', x: 9, y: 12 },
    { id: 'o-st-ph2', type: 'deskphone', x: 17, y: 12 },
    { id: 'o-st-chart', type: 'chartbinder', x: 20, y: 12 },
    { id: 'o-st-fetal', type: 'fetalmonitor', x: 4, y: 12, props: { w: 2, h: 2 } },
    { id: 'o-st-vitals', type: 'vitals', x: 23, y: 16 },

    // ════════ LDR 분만실 (y21-34) ════════
    { id: 'bl-ldr1', type: 'baylabel', x: 1, y: 21, props: { text: 'LDR 1 · 진통·분만·회복', highlight: true } },
    { id: 'o-l1-bed', type: 'birthingbed', x: 2, y: 23, props: { w: 3, h: 2 } },
    { id: 'o-l1-fetal', type: 'fetalmonitor', x: 6, y: 23, props: { w: 2, h: 2 } },
    { id: 'o-l1-cart', type: 'deliverycart', x: 2, y: 29, props: { w: 2, h: 1 } },
    { id: 'bl-ldr2', type: 'baylabel', x: 11, y: 21, props: { text: 'LDR 2' } },
    { id: 'o-l2-bed', type: 'birthingbed', x: 11, y: 23, props: { w: 3, h: 2 } },
    { id: 'o-l2-fetal', type: 'fetalmonitor', x: 15, y: 23, props: { w: 2, h: 2 } },
    { id: 'o-l2-iv', type: 'iiv', x: 10, y: 23 },
    { id: 'bl-warm', type: 'baylabel', x: 20, y: 21, props: { text: 'INFANT WARMER' } },
    { id: 'o-iw-warmer', type: 'infantwarmer', x: 21, y: 24, props: { w: 2, h: 2 } },
    { id: 'o-iw-cab', type: 'warmercabinet', x: 25, y: 23 },
    { id: 'o-ldr-cur1', type: 'icurtain', x: 10, y: 22, props: { w: 1, h: 12, color: '#F5C6D8' } },
    { id: 'o-ldr-cur2', type: 'icurtain', x: 19, y: 22, props: { w: 1, h: 12, color: '#F5C6D8' } },

    // ════════ 산후 모아동실 (postpartum, y36-48) ════════
    { id: 'bl-pp', type: 'baylabel', x: 1, y: 36, props: { text: '산후 모아동실 · POSTPARTUM' } },
    { id: 'o-pp-bed', type: 'ibed', x: 2, y: 38, props: { variant: 'ward', occupied: true, label: '산모' } },
    { id: 'o-pp-bass', type: 'bassinet', x: 6, y: 38, props: { tag: 'girl', w: 2, h: 2 } },
    { id: 'o-pp-mon', type: 'imonitor', x: 1, y: 38 },
    { id: 'o-pp-rec', type: 'nursingrecliner', x: 9, y: 40, props: { w: 2, h: 2 } },
    { id: 'o-pp-plant', type: 'iplant', x: 12, y: 47 },

    // ════════ 신생아실 Nursery (y36-48) ════════
    { id: 'bl-nur', type: 'baylabel', x: 15, y: 36, props: { text: '신생아실 · NURSERY' } },
    { id: 'o-nu-b1', type: 'bassinet', x: 16, y: 38, props: { tag: 'boy', w: 2, h: 2 } },
    { id: 'o-nu-b2', type: 'bassinet', x: 19, y: 38, props: { tag: 'girl', w: 2, h: 2 } },
    { id: 'o-nu-b3', type: 'bassinet', x: 22, y: 38, props: { tag: 'boy', w: 2, h: 2 } },
    { id: 'o-nu-b4', type: 'bassinet', x: 16, y: 43, props: { tag: 'girl', w: 2, h: 2 } },
    { id: 'o-nu-b5', type: 'bassinet', x: 19, y: 43, props: { tag: 'boy', w: 2, h: 2 } },
    { id: 'o-nu-warmer', type: 'infantwarmer', x: 23, y: 44, props: { w: 2, h: 2 } },
    { id: 'o-nu-sink', type: 'sinkor', x: 25, y: 37 },
  ],
  hotspots: [
    { id: 'hs-contract', kind: 'quest', x: 3, y: 3, label: '자궁수축·태동 사정' },
    { id: 'hs-epidural', kind: 'info', x: 15, y: 4, label: '무통 카트 점검' },
    { id: 'hs-imminent', kind: 'urgent', x: 11, y: 14, label: '분만 임박 콜' },
    { id: 'hs-ctg', kind: 'quest', x: 3, y: 23, label: '태아 심박(CTG)' },
    { id: 'hs-ldr2', kind: 'info', x: 12, y: 23, label: '분만 진행' },
    { id: 'hs-apgar', kind: 'info', x: 21, y: 24, label: '아기 보온·아프가' },
    { id: 'hs-breastfeed', kind: 'quest', x: 3, y: 38, label: '모유수유 교육' },
    { id: 'hs-newborn', kind: 'info', x: 17, y: 38, label: '신생아 관찰·수유' },
  ],
  npcs: [
    // triage
    { id: 'ld-tr-n', kind: 'nurse', mode: 'idle', seed: 861, start: { x: 4, y: 7 } },
    { id: 'ld-tr-p', kind: 'patient', mode: 'idle', seed: 862, start: { x: 7, y: 7 } },
    // anes
    { id: 'ld-an-d', kind: 'doctor', mode: 'idle', seed: 863, start: { x: 16, y: 7 } },
    // station
    { id: 'ld-st-n1', kind: 'nurse', mode: 'idle', seed: 864, start: { x: 11, y: 15 } },
    { id: 'ld-st-d', kind: 'doctor', mode: 'idle', seed: 865, start: { x: 15, y: 15 } },
    { id: 'ld-st-n2', kind: 'nurse', mode: 'idle', seed: 866, start: { x: 5, y: 18 } },
    // ldr
    { id: 'ld-l1-n', kind: 'nurse', mode: 'idle', seed: 867, start: { x: 5, y: 31 } },
    { id: 'ld-l1-d', kind: 'doctor', mode: 'idle', seed: 868, start: { x: 3, y: 27 } },
    { id: 'ld-l2-p', kind: 'parent', mode: 'idle', seed: 869, start: { x: 14, y: 31 } },
    { id: 'ld-iw-n', kind: 'nurse', mode: 'idle', seed: 870, start: { x: 24, y: 30 } },
    // postpartum
    { id: 'ld-pp-n', kind: 'nurse', mode: 'idle', seed: 871, start: { x: 4, y: 42 } },
    { id: 'ld-pp-p', kind: 'parent', mode: 'idle', seed: 872, start: { x: 10, y: 43 } },
    // nursery
    { id: 'ld-nu-n', kind: 'nurse', mode: 'idle', seed: 873, start: { x: 21, y: 47 } },
  ],
};
