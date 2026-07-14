// ORTHO — 정형외과 병동 (Orthopedics inpatient ward). 1:1 port of the v15 handoff
// master blueprint (design-handoff_v15/reference/interior-orthoward.jsx +
// interior-objects-ortho2.jsx): 28×52 tiles, LEFT campus door (ward layout).
// Impaired-mobility care: PT 연계 통로 + 석고실/소처치 → 간호 스테이션·보조기 베이
// (PACS·CMS·BraceRack) → 4인 골절/견인 병실(견인·CPM·구획증후군·석고) → 1인 고령
// 고관절 골절실(외전베개·낙상경보·변기가드). Reuses ward2/surg2/shared/OR/ER; only
// ortho2 (traction/CPM/cast/brace/abduction/bed-alarm/PACS) + CMSChart is new.
// Markers are labels only (scenarioIds deferred).
import type { Interior } from '@engine';

export const ORTHO_INTERIOR: Interior = {
  id: 'INT-ORTHOWARD-00001',
  deptId: 'DEPT-ORTHOWARD-00001',
  cols: 28,
  rows: 52,
  floorTheme: 'ortho',
  scale: 0.9,
  playerStart: { x: 4, y: 15 }, // station corridor by the ← 캠퍼스 door
  regions: [
    { id: 'pt', name: '물리치료 연계 통로', icon: '🦮', bounds: { x: 0, y: 0, w: 10, h: 11 } },
    { id: 'cast', name: '석고실 · 소처치실', icon: '🦴', bounds: { x: 9, y: 0, w: 19, h: 11 } },
    { id: 'hip', name: '1인용 고관절 골절 병실', icon: '🦯', bounds: { x: 0, y: 35, w: 28, h: 17 } },
    { id: 'room4', name: '4인용 골절/견인 병실', icon: '🦵', bounds: { x: 0, y: 20, w: 28, h: 16 } },
    { id: 'station', name: '중앙 간호 스테이션 · 보조기', icon: '🖥', bounds: { x: 0, y: 10, w: 28, h: 11 } },
  ],
  rooms: [
    { id: 'pt', name: 'PT 연계 통로', sub: '재활 이동', icon: '🦮', color: '#FED7AA', x: 4, y: 5 },
    { id: 'cast', name: '석고실·처치', sub: '깁스·소독', icon: '🦴', color: '#A8DCEC', x: 17, y: 5 },
    { id: 'station', name: '간호 스테이션', sub: 'CMS·보조기', icon: '🖥', color: '#BAE6FD', x: 13, y: 15 },
    { id: 'room4', name: '4인 골절 병실', sub: '견인·CPM·석고', icon: '🦵', color: '#FBCFE8', x: 13, y: 27 },
    { id: 'hip', name: '고관절 골절실', sub: '탈구 방지', icon: '🦯', color: '#FCA5A5', x: 13, y: 44 },
  ],
  collision: [
    // outer walls — LEFT 캠퍼스 door gap y14-16 (bottom solid)
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 13 }, { x: 0, y: 17, w: 1, h: 34 }, { x: 27, y: 1, w: 1, h: 50 },
    { x: 0, y: 51, w: 28, h: 1 },
    // service strip divider (y10) — thresholds x4-6 / x12-15(sterile →석고실)
    { x: 1, y: 10, w: 3, h: 1 }, { x: 7, y: 10, w: 5, h: 1 }, { x: 16, y: 10, w: 11, h: 1 },
    // pt | cast vertical divider (x9), threshold gap y5-8
    { x: 9, y: 1, w: 1, h: 4 }, { x: 9, y: 9, w: 1, h: 1 },
    // station | room4 divider (y20) — extra-wide thresholds x6-9 / x16-19
    { x: 1, y: 20, w: 5, h: 1 }, { x: 10, y: 20, w: 6, h: 1 }, { x: 20, y: 20, w: 7, h: 1 },
    // room4 | hip divider (y35) — threshold x9-12 (→고관절실)
    { x: 1, y: 35, w: 8, h: 1 }, { x: 13, y: 35, w: 14, h: 1 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-campus', type: 'door', x: 0, y: 14, props: { w: 1, h: 3, kind: 'auto', label: '← 캠퍼스로' } },
    { id: 'th-l', type: 'threshold', x: 4, y: 10, props: { w: 3, h: 1, label: '→ 복도' } },
    { id: 'th-cast', type: 'threshold', x: 12, y: 10, props: { w: 4, h: 1, tone: 'sterile', label: '→ 석고실' } },
    { id: 'th-lv', type: 'threshold', x: 9, y: 5, props: { w: 1, h: 4 } },
    { id: 'th-r4a', type: 'threshold', x: 6, y: 20, props: { w: 4, h: 1 } },
    { id: 'th-r4b', type: 'threshold', x: 16, y: 20, props: { w: 4, h: 1 } },
    { id: 'th-hip', type: 'threshold', x: 9, y: 35, props: { w: 4, h: 1, label: '→ 고관절실' } },

    // ════════ 물리치료 연계 통로 (y1-9) ════════
    { id: 'bl-pt', type: 'baylabel', x: 1, y: 1, props: { text: 'PT 연계 통로' } },
    { id: 'o-pt-rail', type: 'handrail', x: 1, y: 2, props: { w: 7, vertical: true } },
    { id: 'o-pt-wrack', type: 'walkerrack', x: 2, y: 2, props: { w: 2, h: 1 } },
    { id: 'o-pt-wc', type: 'wheelchair', x: 2, y: 6 },
    { id: 'o-pt-plant', type: 'iplant', x: 7, y: 8 },

    // ════════ 석고실 · 소처치실 (y1-9) ════════
    { id: 'bl-cast', type: 'baylabel', x: 10, y: 1, props: { text: 'CAST ROOM · 소처치', highlight: true } },
    { id: 'o-c-bed', type: 'ibed', x: 11, y: 3, props: { variant: 'or', occupied: true } },
    { id: 'o-c-sink', type: 'plastertrapsink', x: 15, y: 3, props: { w: 2, h: 2 } },
    { id: 'o-c-rolls', type: 'castrollshelf', x: 18, y: 2, props: { w: 3 } },
    { id: 'o-c-cutter', type: 'castcutter', x: 22, y: 6 },
    { id: 'o-c-dress', type: 'dressing', x: 24, y: 3, props: { w: 2, h: 1 } },

    // ════════ 중앙 간호 스테이션 · 보조기 베이 (y11-19) ════════
    { id: 'bl-station', type: 'baylabel', x: 1, y: 11, props: { text: 'CENTRAL STATION · DME BAY', highlight: true } },
    { id: 'o-s-rail', type: 'handrail', x: 27, y: 11, props: { w: 8, vertical: true } },
    { id: 'o-s-desk', type: 'nursestation', x: 6, y: 13, props: { w: 11, h: 5 } },
    { id: 'o-s-pacs', type: 'pacsviewer', x: 2, y: 12, props: { w: 2, h: 1 } },
    { id: 'o-s-ph', type: 'deskphone', x: 7, y: 13 },
    { id: 'o-s-cms', type: 'cmschart', x: 15, y: 12 },
    { id: 'o-s-brace', type: 'bracerack', x: 20, y: 12, props: { w: 3 } },
    { id: 'o-s-walker', type: 'walker', x: 24, y: 16, props: { w: 1, h: 1 } },

    // ════════ 4인용 골절/견인 병실 (y21-34) ════════
    { id: 'bl-room4', type: 'baylabel', x: 1, y: 21, props: { text: '4-BED · 골절/견인' } },
    // Bed A — skeletal traction
    { id: 'o-a-bed', type: 'ibed', x: 2, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-a-traction', type: 'tractionframe', x: 4, y: 22 },
    { id: 'o-a-mon', type: 'imonitor', x: 1, y: 23 },
    // Bed B — TKA + CPM
    { id: 'o-b-bed', type: 'ibed', x: 9, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-b-cpm', type: 'cpmmachine', x: 11, y: 26, props: { w: 2, h: 1 } },
    { id: 'o-b-iv', type: 'iiv', x: 8, y: 23 },
    // Bed C — compartment syndrome (urgent)
    { id: 'o-c4-bed', type: 'ibed', x: 17, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-c4-fall', type: 'fallrisksign', x: 20, y: 22 },
    // Bed D — cast
    { id: 'o-d-bed', type: 'ibed', x: 24, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-d-chair', type: 'ichair', x: 21, y: 25, props: { color: '#FED7AA', facing: 'left' } },
    // curtains splitting the bays
    { id: 'o-cur1', type: 'icurtain', x: 8, y: 22, props: { w: 1, h: 11, color: '#BFE3EE' } },
    { id: 'o-cur2', type: 'icurtain', x: 16, y: 22, props: { w: 1, h: 11, color: '#BFE3EE' } },
    { id: 'o-cur3', type: 'icurtain', x: 23, y: 22, props: { w: 1, h: 11, color: '#BFE3EE' } },

    // ════════ 1인용 고령 고관절 골절 병실 (hip, y36-50) ════════
    { id: 'bl-hip', type: 'baylabel', x: 1, y: 36, props: { text: 'GERIATRIC HIP FRACTURE · THR', highlight: true } },
    { id: 'o-h-bed', type: 'ibed', x: 4, y: 38, props: { variant: 'ward', occupied: true } },
    { id: 'o-h-pillow', type: 'abductionpillow', x: 6, y: 40 },
    { id: 'o-h-mon', type: 'imonitor', x: 3, y: 38, props: { beep: true } },
    { id: 'o-h-iv', type: 'iiv', x: 9, y: 38 },
    { id: 'o-h-alarm', type: 'bedalarm', x: 4, y: 42 },
    { id: 'o-h-toilet', type: 'elevatedtoiletguard', x: 24, y: 37, props: { w: 1, h: 1 } },
    { id: 'o-h-chair', type: 'ichair', x: 11, y: 43, props: { color: '#FED7AA', facing: 'left' } },
    { id: 'o-h-sofa', type: 'sofa', x: 20, y: 45, props: { w: 3, h: 2, color: '#9CB4C8' } },
    { id: 'o-h-plant', type: 'iplant', x: 25, y: 48 },
  ],
  hotspots: [
    { id: 'hs-rehab', kind: 'info', x: 3, y: 5, label: '재활 이동' },
    { id: 'hs-cast', kind: 'quest', x: 12, y: 4, label: '화이버글래스 깁스' },
    { id: 'hs-ptcall', kind: 'urgent', x: 9, y: 15, label: 'PT 스케줄 콜' },
    { id: 'hs-xray', kind: 'info', x: 13, y: 15, label: 'X-ray 정렬 검토' },
    { id: 'hs-crutch', kind: 'info', x: 21, y: 15, label: '목발 높이 조절' },
    { id: 'hs-traction', kind: 'quest', x: 3, y: 23, label: '견인 추·줄 사정' },
    { id: 'hs-cpm', kind: 'info', x: 9, y: 23, label: 'CPM 각도 확인' },
    { id: 'hs-cms', kind: 'urgent', x: 17, y: 23, label: 'CMS 사정 (5P)' },
    { id: 'hs-castedema', kind: 'info', x: 24, y: 23, label: '석고 부종 사정' },
    { id: 'hs-dislocation', kind: 'quest', x: 5, y: 38, label: '탈구 방지 교육' },
  ],
  npcs: [
    { id: 'ow-pt-pt', kind: 'patient', mode: 'idle', seed: 701, start: { x: 5, y: 7 } },
    { id: 'ow-c-s', kind: 'surgeon', mode: 'idle', seed: 702, start: { x: 11, y: 6 } },
    { id: 'ow-c-n', kind: 'nurse', mode: 'idle', seed: 703, start: { x: 14, y: 6 } },
    { id: 'ow-s-n1', kind: 'nurse', mode: 'idle', seed: 704, start: { x: 9, y: 16 } },
    { id: 'ow-s-d', kind: 'doctor', mode: 'idle', seed: 705, start: { x: 13, y: 16 } },
    { id: 'ow-s-n2', kind: 'nurse', mode: 'idle', seed: 706, start: { x: 22, y: 16 } },
    { id: 'ow-a-n', kind: 'nurse', mode: 'idle', seed: 707, start: { x: 3, y: 27 } },
    { id: 'ow-c4-n', kind: 'nurse', mode: 'idle', seed: 708, start: { x: 20, y: 26 } },
    { id: 'ow-r-d', kind: 'doctor', mode: 'idle', seed: 709, start: { x: 3, y: 31 } },
    { id: 'ow-h-n', kind: 'nurse', mode: 'idle', seed: 710, start: { x: 8, y: 41 } },
    { id: 'ow-h-pa', kind: 'parent', mode: 'idle', seed: 711, start: { x: 11, y: 41 } },
  ],
};
