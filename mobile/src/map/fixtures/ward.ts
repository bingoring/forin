// WARD — 일반 내과 병동 (Internal Medicine inpatient ward). 1:1 port of the v13
// handoff master blueprint (design-handoff_v13/reference/interior-ward.jsx +
// interior-objects-ward2.jsx): 28×52 tiles, vertical flow. Service strip
// (린넨·배식 / clean utility / dirty utility) up top → 중앙 간호 스테이션 복도 →
// 4-bed chronic-care room (A COPD · B DM · C 간경변 · D NPO, curtain-split) →
// 1인실 + VRE 접촉 격리실. v13 2.5D objects carry ground-contact shadows. Markers
// are labels only (scenarioIds deferred until ward scenario content lands).
import type { Interior } from '@engine';

export const WARD_INTERIOR: Interior = {
  id: 'INT-WARD-00001',
  deptId: 'DEPT-WARD-00001',
  cols: 28,
  rows: 46,
  floorTheme: 'internal',
  scale: 0.9,
  playerStart: { x: 4, y: 15 }, // station corridor by the ← 캠퍼스 door (handoff v16: compacted)
  // smallest-area-wins region resolution (engine/regions.ts) — order is not
  // load-bearing, but keep rooms before the big station corridor for clarity.
  regions: [
    { id: 'linen', name: '린넨실 · 배식실', icon: '🍱', bounds: { x: 0, y: 0, w: 10, h: 11 } },
    { id: 'clean', name: 'Clean Utility · 물품', icon: '📦', bounds: { x: 9, y: 0, w: 10, h: 11 } },
    { id: 'dirty', name: 'Dirty Utility · 오염', icon: '☣️', bounds: { x: 18, y: 0, w: 10, h: 11 } },
    { id: 'private', name: '1인실', icon: '🚪', bounds: { x: 0, y: 31, w: 14, h: 15 } },
    { id: 'iso', name: 'VRE 접촉 격리실', icon: '⚠️', bounds: { x: 13, y: 31, w: 15, h: 15 } },
    { id: 'room4', name: '4인용 일반 병실', icon: '🛏', bounds: { x: 0, y: 20, w: 28, h: 11 } },
    { id: 'station', name: '중앙 간호 스테이션', icon: '🖥', bounds: { x: 0, y: 10, w: 28, h: 11 } },
  ],
  rooms: [
    { id: 'linen', name: '린넨·배식실', sub: '시트·식이', icon: '🍱', color: '#FED7AA', x: 4, y: 5 },
    { id: 'clean', name: 'Clean Utility', sub: '물품·수액', icon: '📦', color: '#A7F3D0', x: 13, y: 5 },
    { id: 'dirty', name: 'Dirty Utility', sub: '오염 처리', icon: '☣️', color: '#FDE68A', x: 22, y: 5 },
    { id: 'station', name: '간호 스테이션', sub: 'Hand-off·회진', icon: '🖥', color: '#BAE6FD', x: 13, y: 15 },
    { id: 'room4', name: '4인용 병실', sub: '만성질환 케어', icon: '🛏', color: '#FBCFE8', x: 13, y: 27 },
    { id: 'private', name: '1인실', sub: '면역저하', icon: '🚪', color: '#DDD6FE', x: 6, y: 44 },
    { id: 'iso', name: 'VRE 격리실', sub: '접촉 격리', icon: '⚠️', color: '#FCA5A5', x: 21, y: 44 },
  ],
  collision: [
    // outer walls — LEFT 캠퍼스 door gap y14-16 (v14; bottom is now solid)
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 13 }, { x: 0, y: 17, w: 1, h: 28 }, { x: 27, y: 1, w: 1, h: 44 },
    { x: 0, y: 45, w: 28, h: 1 },
    // service strip dividers (y10) — thresholds x5-6 / x13-14 / x21-22
    { x: 1, y: 10, w: 4, h: 1 }, { x: 7, y: 10, w: 6, h: 1 }, { x: 15, y: 10, w: 6, h: 1 }, { x: 23, y: 10, w: 4, h: 1 },
    // service vertical dividers (x9 / x18) with a threshold gap y6-8
    { x: 9, y: 1, w: 1, h: 5 }, { x: 9, y: 9, w: 1, h: 1 },
    { x: 18, y: 1, w: 1, h: 5 }, { x: 18, y: 9, w: 1, h: 1 },
    // station | room4 divider (y20) — thresholds x7-9 / x18-20
    { x: 1, y: 20, w: 6, h: 1 }, { x: 10, y: 20, w: 8, h: 1 }, { x: 21, y: 20, w: 6, h: 1 },
    // room4 | lower divider (y31, v16) — thresholds x6-7(→1인실) / x19-20(→격리)
    { x: 1, y: 31, w: 5, h: 1 }, { x: 8, y: 31, w: 11, h: 1 }, { x: 21, y: 31, w: 6, h: 1 },
    // private | isolation divider (x13)
    { x: 13, y: 32, w: 1, h: 13 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-campus', type: 'door', x: 0, y: 14, props: { w: 1, h: 3, kind: 'auto', label: '← 캠퍼스로' } },
    { id: 'th-l', type: 'threshold', x: 5, y: 10, props: { w: 2, h: 1, label: '→ 복도' } },
    { id: 'th-c', type: 'threshold', x: 13, y: 10, props: { w: 2, h: 1, label: '→ 복도' } },
    { id: 'th-d', type: 'threshold', x: 21, y: 10, props: { w: 2, h: 1 } },
    { id: 'th-lv', type: 'threshold', x: 9, y: 6, props: { w: 1, h: 3 } },
    { id: 'th-dv', type: 'threshold', x: 18, y: 6, props: { w: 1, h: 3 } },
    { id: 'th-r4a', type: 'threshold', x: 7, y: 20, props: { w: 3, h: 1 } },
    { id: 'th-r4b', type: 'threshold', x: 18, y: 20, props: { w: 3, h: 1 } },
    { id: 'th-priv', type: 'threshold', x: 6, y: 31, props: { w: 2, h: 1, label: '→ 1인실' } },
    { id: 'th-iso', type: 'threshold', x: 19, y: 31, props: { w: 2, h: 1, label: '→ 격리' } },

    // ════════ 린넨실 · 배식실 (y1-9) ════════
    { id: 'bl-linen', type: 'baylabel', x: 1, y: 1, props: { text: '린넨 · 배식실' } },
    { id: 'o-l-cab1', type: 'icabinet', x: 1, y: 2, props: { w: 3, h: 1, variant: 'linen', label: 'LINEN' } },
    { id: 'o-l-cab2', type: 'icabinet', x: 5, y: 2, props: { w: 3, h: 1, variant: 'linen' } },
    { id: 'o-l-meal', type: 'mealcart', x: 2, y: 5, props: { w: 2, h: 2 } },
    { id: 'o-l-cab3', type: 'icabinet', x: 6, y: 6, props: { w: 2, h: 1, variant: 'supply' } },

    // ════════ Clean Utility (y1-9) ════════
    { id: 'bl-clean', type: 'baylabel', x: 10, y: 1, props: { text: 'CLEAN UTILITY' } },
    { id: 'o-cl-shelf', type: 'supplybasketshelf', x: 10, y: 2, props: { w: 4, shelves: 4, h: 1 } },
    { id: 'o-cl-iv', type: 'ivstoragecart', x: 10, y: 6, props: { w: 2, h: 2 } },
    { id: 'o-cl-prep', type: 'ireception', x: 14, y: 7, props: { w: 3, h: 1, label: '투약 준비' } },
    { id: 'o-cl-scan', type: 'barcodescanner', x: 16, y: 6 },

    // ════════ Dirty Utility (y1-9) ════════
    { id: 'bl-dirty', type: 'baylabel', x: 19, y: 1, props: { text: 'DIRTY UTILITY' } },
    { id: 'o-d-sluice', type: 'sluicesink', x: 19, y: 3, props: { w: 2, h: 2 } },
    { id: 'o-d-waste', type: 'wastebin', x: 22, y: 2, props: { tone: 'infectious' } },
    { id: 'o-d-sharps', type: 'sharpsbin', x: 24, y: 2 },
    { id: 'o-d-ham1', type: 'linenhamper', x: 19, y: 6, props: { w: 1, h: 1, tone: 'soiled' } },
    { id: 'o-d-ham2', type: 'linenhamper', x: 22, y: 6, props: { w: 1, h: 1, tone: 'clean' } },

    // ════════ 중앙 간호 스테이션 · 복도 (y11-19) ════════
    { id: 'bl-station', type: 'baylabel', x: 1, y: 11, props: { text: 'CENTRAL NURSING STATION', highlight: true } },
    { id: 'o-s-rail2', type: 'handrail', x: 27, y: 11, props: { w: 8, vertical: true } },
    { id: 'o-s-desk', type: 'nursestation', x: 8, y: 12, props: { w: 12, h: 5 } },
    { id: 'o-s-tube', type: 'pneumatictube', x: 5, y: 11, props: { w: 2, h: 1 } },
    { id: 'o-s-binder', type: 'chartbinder', x: 20, y: 12 },
    { id: 'o-s-ph1', type: 'deskphone', x: 9, y: 12 },
    { id: 'o-s-ph2', type: 'deskphone', x: 17, y: 12 },
    { id: 'o-s-vc1', type: 'vitals', x: 3, y: 16 },
    { id: 'o-s-vc2', type: 'vitals', x: 23, y: 16 },

    // ════════ 4인용 일반 병실 (y21-34) ════════
    { id: 'bl-room4', type: 'baylabel', x: 1, y: 21, props: { text: '4-BED ROOM · 만성질환' } },
    // Bed A — COPD
    { id: 'o-a-bed', type: 'ibed', x: 2, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-a-o2', type: 'o2flowmeter', x: 1, y: 23 },
    { id: 'o-a-neb', type: 'nebulizer', x: 5, y: 23, props: { w: 1, h: 1 } },
    { id: 'o-a-mon', type: 'imonitor', x: 6, y: 22 },
    // Bed B — DM (BST mission)
    { id: 'o-b-bed', type: 'ibed', x: 9, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-b-air', type: 'airmattress', x: 12, y: 23, props: { w: 1, h: 1 } },
    { id: 'o-b-fall', type: 'fallrisksign', x: 9, y: 26 },
    { id: 'o-b-vc', type: 'vitals', x: 13, y: 25 },
    // Bed C — 간경변
    { id: 'o-c-bed', type: 'ibed', x: 17, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-c-iv', type: 'iiv', x: 20, y: 23 },
    { id: 'o-c-chair', type: 'ichair', x: 21, y: 25, props: { color: '#FED7AA', facing: 'left' } },
    // Bed D — NPO
    { id: 'o-d-bed', type: 'ibed', x: 24, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-d-npo', type: 'npoboard', x: 24, y: 22 },
    { id: 'o-d-mon', type: 'imonitor', x: 26, y: 23, props: { beep: true } },
    // curtains splitting the bays
    { id: 'o-cur1', type: 'icurtain', x: 8, y: 22, props: { w: 1, h: 6, color: '#BFE3EE' } },
    { id: 'o-cur2', type: 'icurtain', x: 16, y: 22, props: { w: 1, h: 6, color: '#BFE3EE' } },
    { id: 'o-cur3', type: 'icurtain', x: 23, y: 22, props: { w: 1, h: 6, color: '#BFE3EE' } },

    // ════════ 1인실 (private, y32-44 · v16) ════════
    { id: 'bl-priv', type: 'baylabel', x: 1, y: 32, props: { text: '1인실 · PRIVATE' } },
    { id: 'o-p-bed', type: 'ibed', x: 3, y: 34, props: { variant: 'ward', occupied: true } },
    { id: 'o-p-mon', type: 'imonitor', x: 2, y: 34, props: { beep: true } },
    { id: 'o-p-iv', type: 'iiv', x: 6, y: 34 },
    { id: 'o-p-tv', type: 'walltv', x: 2, y: 39, props: { w: 2 } },
    { id: 'o-p-chair', type: 'ichair', x: 8, y: 36, props: { color: '#FED7AA', facing: 'left' } },
    { id: 'o-p-sofa', type: 'sofa', x: 8, y: 41, props: { w: 3, h: 2, color: '#9CB4C8' } },
    { id: 'o-p-plant', type: 'iplant', x: 11, y: 43 },

    // ════════ VRE 접촉 격리실 (iso, y32-44 · v16) ════════
    { id: 'bl-iso', type: 'baylabel', x: 14, y: 32, props: { text: 'VRE 접촉 격리실', highlight: true } },
    { id: 'o-i-sign', type: 'isosign', x: 19, y: 31 },
    { id: 'o-i-cart', type: 'isolationcart', x: 15, y: 33, props: { w: 2, h: 2 } },
    { id: 'o-i-bed', type: 'ibed', x: 22, y: 34, props: { variant: 'ward', occupied: true } },
    { id: 'o-i-mon', type: 'imonitor', x: 26, y: 34 },
    { id: 'o-i-tv', type: 'walltv', x: 24, y: 32, props: { w: 2 } },
    { id: 'o-i-bp', type: 'dedicatedbp', x: 22, y: 38, props: { w: 1, h: 2 } },
    { id: 'o-i-waste', type: 'wastebin', x: 20, y: 39, props: { tone: 'infectious' } },
  ],
  hotspots: [
    { id: 'hs-meal', kind: 'info', x: 2, y: 5, label: '식이 배식' },
    { id: 'hs-ivlabel', kind: 'quest', x: 11, y: 6, label: '수액 라벨 출력' },
    { id: 'hs-dirty', kind: 'info', x: 20, y: 3, label: '오염물 처리' },
    { id: 'hs-crit', kind: 'urgent', x: 11, y: 14, label: 'Critical Value 콜' },
    { id: 'hs-order', kind: 'info', x: 15, y: 14, label: '구두 처방' },
    { id: 'hs-o2', kind: 'info', x: 3, y: 23, label: '산소 유량 확인' },
    { id: 'hs-bst', kind: 'quest', x: 9, y: 23, label: '식전 혈당(BST)' },
    { id: 'hs-ascites', kind: 'info', x: 17, y: 23, label: '복수 사정' },
    { id: 'hs-immuno', kind: 'info', x: 4, y: 34, label: '면역저하 케어' },
    { id: 'hs-gown', kind: 'quest', x: 15, y: 33, label: '가운·장갑 착용' },
    { id: 'hs-dedic', kind: 'info', x: 22, y: 34, label: '전용 의료기기' },
  ],
  npcs: [
    { id: 'wd-l-n', kind: 'nurse', mode: 'idle', seed: 501, start: { x: 4, y: 8 } },
    { id: 'wd-cl-n', kind: 'nurse', mode: 'idle', seed: 502, start: { x: 12, y: 8 } },
    { id: 'wd-s-n1', kind: 'nurse', mode: 'idle', seed: 503, start: { x: 11, y: 15 } },
    { id: 'wd-s-d', kind: 'doctor', mode: 'idle', seed: 504, start: { x: 15, y: 15 } },
    { id: 'wd-s-n2', kind: 'nurse', mode: 'idle', seed: 505, start: { x: 5, y: 18 } },
    { id: 'wd-r-n', kind: 'nurse', mode: 'idle', seed: 506, start: { x: 12, y: 26 } },
    { id: 'wd-r-p', kind: 'parent', mode: 'idle', seed: 507, start: { x: 21, y: 26 } },
    { id: 'wd-r-d', kind: 'doctor', mode: 'idle', seed: 508, start: { x: 3, y: 29 } },
    { id: 'wd-p-p', kind: 'parent', mode: 'idle', seed: 509, start: { x: 9, y: 37 } },
    { id: 'wd-p-n', kind: 'nurse', mode: 'idle', seed: 510, start: { x: 5, y: 38 } },
    { id: 'wd-i-n', kind: 'nurse', mode: 'idle', seed: 511, start: { x: 17, y: 35 } },
  ],
};
