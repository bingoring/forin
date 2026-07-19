// SPD / CSD · NUTRITION · LOADING DOCK — 중앙공급실·영양팀·하역장 (지원동 ADMIN 1F).
// 1:1 port of the v16 handoff master blueprint (design-handoff_v16/reference/
// interior-spd.jsx): 30×44 tiles (wide), pharma tone, LEFT elevator door + RIGHT
// loading-dock gate. Industrial back-of-house: 오염 세척(Decon) → 멸균·보관(SPD)
// → 영양팀 배식실 → 화물 하역장. New objects in spdEquipment.tsx (Autoclave/
// SterileRack/WasherDisinfector/FoodCartColumn/PalletStack/CargoTruck); ADLKitchen
// (hospice)·Fridge(onco)·MedCart/FloorTape(pharma)·SoiledCart(or)·shared reused.
import type { Interior } from '@engine';

export const SPD_INTERIOR: Interior = {
  id: 'INT-SPD-00001',
  deptId: 'DEPT-SPD-00001',
  cols: 30,
  rows: 44,
  floorTheme: 'pharma',
  scale: 0.9,
  playerStart: { x: 4, y: 8 }, // decontamination zone by the ← elevator door
  regions: [
    { id: 'soiled', name: '오염 세척 구역 (Decon)', icon: '🧽', bounds: { x: 0, y: 0, w: 15, h: 12 } },
    { id: 'sterile', name: '멸균 · 보관 구역', icon: '📦', bounds: { x: 14, y: 0, w: 16, h: 12 } },
    { id: 'kitchen', name: '영양팀 · 배식실', icon: '🍚', bounds: { x: 0, y: 11, w: 30, h: 15 } },
    { id: 'dock', name: '화물 하역장 (Loading Dock)', icon: '🚚', bounds: { x: 0, y: 25, w: 30, h: 19 } },
  ],
  rooms: [
    { id: 'soiled', name: '오염 세척', sub: '기구 세척·소독', icon: '🧽', color: '#FDE68A', x: 6, y: 6 },
    { id: 'sterile', name: '멸균·보관', sub: 'Autoclave·SPD', icon: '📦', color: '#A7F3D0', x: 22, y: 6 },
    { id: 'kitchen', name: '영양팀 배식', sub: '조리·트레이', icon: '🍚', color: '#FED7AA', x: 8, y: 18 },
    { id: 'dock', name: '하역장', sub: '물류 입·출고', icon: '🚚', color: '#C4CBD2', x: 8, y: 35 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 문(y7-9) · RIGHT 하역장 게이트(y31-36)
    { x: 0, y: 0, w: 30, h: 1 },
    { x: 0, y: 1, w: 1, h: 6 }, { x: 0, y: 10, w: 1, h: 33 },
    { x: 29, y: 1, w: 1, h: 30 }, { x: 29, y: 37, w: 1, h: 6 },
    { x: 0, y: 43, w: 30, h: 1 },
    // soiled/sterile | kitchen divider (y11) — thresholds x6-7 / x14-15 (→배식)
    { x: 1, y: 11, w: 5, h: 1 }, { x: 8, y: 11, w: 6, h: 1 }, { x: 16, y: 11, w: 13, h: 1 },
    // soiled | sterile barrier (x14) — sterile pass-through washer y5-7
    { x: 14, y: 1, w: 1, h: 4 }, { x: 14, y: 8, w: 1, h: 3 },
    // kitchen | dock divider (y25) — threshold x7-9 (→하역장)
    { x: 1, y: 25, w: 6, h: 1 }, { x: 10, y: 25, w: 19, h: 1 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 7, props: { w: 1, h: 3, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'd-dock', type: 'door', x: 29, y: 31, props: { w: 1, h: 6, kind: 'auto', label: '하역장 게이트' } },
    { id: 'th-kit1', type: 'threshold', x: 6, y: 11, props: { w: 2, h: 1, label: '→ 배식' } },
    { id: 'th-kit2', type: 'threshold', x: 14, y: 11, props: { w: 2, h: 1, label: '→ 배식' } },
    { id: 'th-steril', type: 'threshold', x: 14, y: 5, props: { w: 1, h: 3, tone: 'sterile', label: '세척→멸균' } },
    { id: 'th-dock', type: 'threshold', x: 7, y: 25, props: { w: 3, h: 1, label: '→ 하역장' } },

    // ════════ 오염 세척 구역 (soiled, y1-10) ════════
    { id: 'bl-so', type: 'baylabel', x: 1, y: 1, props: { text: 'DECONTAMINATION · 오염 세척', highlight: true } },
    { id: 'o-so-sink', type: 'sinkor', x: 2, y: 2 },
    { id: 'o-so-washer', type: 'washerdisinfector', x: 6, y: 2, props: { w: 2, h: 2 } },
    { id: 'o-so-cart', type: 'soiledcart', x: 10, y: 3 },
    { id: 'o-so-waste', type: 'wastebin', x: 2, y: 7, props: { tone: 'infectious' } },

    // ════════ 멸균 · 보관 구역 (sterile, y1-10) ════════
    { id: 'bl-st', type: 'baylabel', x: 15, y: 1, props: { text: 'STERILE PROCESSING · 멸균' } },
    { id: 'o-st-a1', type: 'autoclave', x: 16, y: 2, props: { w: 2, h: 2 } },
    { id: 'o-st-a2', type: 'autoclave', x: 20, y: 2, props: { w: 2, h: 2 } },
    { id: 'o-st-r1', type: 'sterilerack', x: 24, y: 3, props: { w: 3 } },
    { id: 'o-st-r2', type: 'sterilerack', x: 16, y: 8, props: { w: 4 } },

    // ════════ 영양팀 · 배식실 (kitchen, y12-24) ════════
    { id: 'bl-ki', type: 'baylabel', x: 1, y: 12, props: { text: 'NUTRITION · 배식실' } },
    { id: 'o-ki-kitchen', type: 'adlkitchen', x: 2, y: 14, props: { w: 4, h: 1 } },
    { id: 'o-ki-fridge', type: 'fridge', x: 7, y: 14, props: { w: 1, h: 1 } },
    { id: 'o-ki-fc1', type: 'foodcartcolumn', x: 2, y: 19, props: { w: 1, h: 2 } },
    { id: 'o-ki-fc2', type: 'foodcartcolumn', x: 5, y: 19, props: { w: 1, h: 2 } },
    { id: 'o-ki-fc3', type: 'foodcartcolumn', x: 8, y: 19, props: { w: 1, h: 2 } },
    { id: 'o-ki-recep', type: 'ireception', x: 12, y: 14, props: { w: 5, h: 1, label: '식단 검수' } },
    { id: 'o-ki-shelf', type: 'shelflabel', x: 19, y: 13, props: { text: 'DIET ORDERS' } },
    { id: 'o-ki-cab1', type: 'icabinet', x: 19, y: 14, props: { w: 4, variant: 'supply' } },
    { id: 'o-ki-cab2', type: 'icabinet', x: 23, y: 14, props: { w: 4, variant: 'supply' } },
    { id: 'o-ki-fc4', type: 'foodcartcolumn', x: 20, y: 19, props: { w: 1, h: 2 } },
    { id: 'o-ki-fc5', type: 'foodcartcolumn', x: 23, y: 19, props: { w: 1, h: 2 } },

    // ════════ 화물 하역장 (dock, y26-42) ════════
    { id: 'o-dk-tint', type: 'tint', x: 1, y: 26, props: { w: 28, h: 16, color: '#9CA3AF', op: 0.14 } },
    { id: 'bl-dk', type: 'baylabel', x: 1, y: 26, props: { text: 'LOADING DOCK · 하역장' } },
    { id: 'o-dk-p1', type: 'palletstack', x: 2, y: 30, props: { w: 2, h: 1 } },
    { id: 'o-dk-p2', type: 'palletstack', x: 6, y: 30, props: { w: 2, h: 1 } },
    { id: 'o-dk-p3', type: 'palletstack', x: 2, y: 37, props: { w: 2, h: 1 } },
    { id: 'o-dk-truck', type: 'cargotruck', x: 22, y: 31, props: { w: 2, h: 3 } },
    { id: 'o-dk-cart', type: 'medcart', x: 12, y: 33 },
    { id: 'o-dk-tape', type: 'floortape', x: 1, y: 41, props: { w: 20, text: '━━ 안전선 · DOCK EDGE ━━' } },
  ],
  hotspots: [
    { id: 'hs-decon', kind: 'quest', x: 7, y: 3, label: '기구 세척·소독 사이클', scenarioId: 'SCN-SPD-00001' },
    { id: 'hs-autoclave', kind: 'quest', x: 17, y: 3, label: '오토클레이브·팩 검수' },
    { id: 'hs-tray', kind: 'info', x: 12, y: 14, label: '치료식 트레이 준비' },
    { id: 'hs-logistics', kind: 'info', x: 12, y: 33, label: '물류 입·출고 검수' },
  ],
  npcs: [
    // soiled
    { id: 'sp-so-n', kind: 'nurse', mode: 'idle', seed: 1121, start: { x: 5, y: 7 } },
    // sterile
    { id: 'sp-st-n', kind: 'nurse', mode: 'idle', seed: 1122, start: { x: 22, y: 8 } },
    // kitchen
    { id: 'sp-ki-n1', kind: 'nurse', mode: 'idle', seed: 1123, start: { x: 4, y: 17 } },
    { id: 'sp-ki-n2', kind: 'nurse', mode: 'idle', seed: 1124, start: { x: 13, y: 17 } },
    // dock
    { id: 'sp-dk-n', kind: 'nurse', mode: 'idle', seed: 1125, start: { x: 10, y: 35 } },
    { id: 'sp-dk-v', kind: 'visitor', mode: 'idle', seed: 1126, start: { x: 16, y: 34 } },
  ],
};
