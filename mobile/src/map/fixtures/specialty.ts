// SPECIALTY OPD — 전문 외래 (안과·이비인후과·비뇨·신경과, 외래진단동 DX 2F). 1:1 port
// of the v16 handoff master blueprint (design-handoff_v16/reference/
// interior-specialty.jsx): 28×44 tiles, clinical tone, LEFT elevator door. 통합
// 접수·대기에서 4개 전문 진료실이 갈라짐 — 안과(세극등·검안·시력) · 이비인후과(ENT
// 타워·이경) · 비뇨(초음파·요검사) · 신경과(EEG·신경학 검사). New objects in
// specialtyEquipment.tsx (SlitLamp/PhoropterStand/ENTTowerChair/VisionChart from
// eye2); reuses Otoscope/ClinicReception/UltrasoundCart/WaitingDisplay/CompCart/
// shared. Markers label-only.
import type { Interior } from '@engine';

export const SPECIALTY_INTERIOR: Interior = {
  id: 'INT-SPECIALTY-00001',
  deptId: 'DEPT-SPECIALTY-00001',
  cols: 28,
  rows: 44,
  floorTheme: 'clinical',
  scale: 0.9,
  playerStart: { x: 4, y: 10 }, // integrated check-in by the ← elevator door
  regions: [
    { id: 'eye', name: '안과 진료실', icon: '👁', bounds: { x: 0, y: 11, w: 14, h: 13 } },
    { id: 'ent', name: '이비인후과 진료실', icon: '👂', bounds: { x: 13, y: 11, w: 15, h: 13 } },
    { id: 'uro', name: '비뇨의학과 진료실', icon: '🚹', bounds: { x: 0, y: 23, w: 14, h: 21 } },
    { id: 'neuro', name: '신경과 진료실', icon: '🧠', bounds: { x: 13, y: 23, w: 15, h: 21 } },
    { id: 'checkin', name: '통합 접수 · 대기', icon: '🪑', bounds: { x: 0, y: 0, w: 28, h: 12 } },
  ],
  rooms: [
    { id: 'checkin', name: '통합 접수', sub: '전문외래 대기', icon: '🪑', color: '#BAE6FD', x: 6, y: 6 },
    { id: 'eye', name: '안과', sub: '세극등·검안', icon: '👁', color: '#DDD6FE', x: 6, y: 18 },
    { id: 'ent', name: '이비인후과', sub: '내시경·처치', icon: '👂', color: '#FBCFE8', x: 21, y: 18 },
    { id: 'uro', name: '비뇨의학과', sub: '초음파·요검사', icon: '🚹', color: '#A7F3D0', x: 6, y: 36 },
    { id: 'neuro', name: '신경과', sub: '신경학 검사', icon: '🧠', color: '#FDE68A', x: 21, y: 36 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y9-11
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 8 }, { x: 0, y: 12, w: 1, h: 29 },
    { x: 27, y: 1, w: 1, h: 40 },
    { x: 0, y: 41, w: 28, h: 1 },
    // check-in | rooms divider (y11) — thresholds x5-6 (→안과) / x13-14 (→이비인후과)
    { x: 1, y: 11, w: 4, h: 1 }, { x: 7, y: 11, w: 6, h: 1 }, { x: 15, y: 11, w: 12, h: 1 },
    // eye | ent divider (x13)
    { x: 13, y: 12, w: 1, h: 11 },
    // upper | lower rooms divider (y23) — thresholds x5-6 (→비뇨) / x13-14 (→신경과)
    { x: 1, y: 23, w: 4, h: 1 }, { x: 7, y: 23, w: 6, h: 1 }, { x: 15, y: 23, w: 12, h: 1 },
    // uro | neuro divider (x13)
    { x: 13, y: 24, w: 1, h: 17 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 9, props: { w: 1, h: 3, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-eye', type: 'threshold', x: 5, y: 11, props: { w: 2, h: 1, label: '→ 안과' } },
    { id: 'th-ent', type: 'threshold', x: 13, y: 11, props: { w: 2, h: 1, label: '→ 이비인후과' } },
    { id: 'th-uro', type: 'threshold', x: 5, y: 23, props: { w: 2, h: 1, label: '→ 비뇨' } },
    { id: 'th-neuro', type: 'threshold', x: 13, y: 23, props: { w: 2, h: 1, label: '→ 신경과' } },

    // ════════ 통합 접수 · 대기 (checkin, y1-10) ════════
    { id: 'bl-ck', type: 'baylabel', x: 1, y: 1, props: { text: 'SPECIALTY OPD · 통합 접수' } },
    { id: 'o-ck-recep', type: 'clinicReception', x: 2, y: 3, props: { w: 5, h: 2, tone: '#2A7C8C', label: '접수' } },
    { id: 'o-ck-display', type: 'waitingdisplay', x: 9, y: 1 },
    { id: 'o-ck-a1', type: 'ichair', x: 13, y: 4, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-ck-a2', type: 'ichair', x: 15, y: 4, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-ck-a3', type: 'ichair', x: 17, y: 4, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-ck-a4', type: 'ichair', x: 19, y: 4, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-ck-a5', type: 'ichair', x: 21, y: 4, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-ck-a6', type: 'ichair', x: 23, y: 4, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-ck-b1', type: 'ichair', x: 13, y: 8, props: { color: '#DDD6FE', facing: 'up' } },
    { id: 'o-ck-b2', type: 'ichair', x: 15, y: 8, props: { color: '#DDD6FE', facing: 'up' } },
    { id: 'o-ck-b3', type: 'ichair', x: 17, y: 8, props: { color: '#DDD6FE', facing: 'up' } },
    { id: 'o-ck-b4', type: 'ichair', x: 19, y: 8, props: { color: '#DDD6FE', facing: 'up' } },
    { id: 'o-ck-b5', type: 'ichair', x: 21, y: 8, props: { color: '#DDD6FE', facing: 'up' } },
    { id: 'o-ck-b6', type: 'ichair', x: 23, y: 8, props: { color: '#DDD6FE', facing: 'up' } },
    { id: 'o-ck-plant', type: 'iplant', x: 25, y: 2 },

    // ════════ 안과 진료실 (eye, y12-22) ════════
    { id: 'bl-eye', type: 'baylabel', x: 1, y: 12, props: { text: 'OPHTHALMOLOGY · 안과', highlight: true } },
    { id: 'o-ey-slit', type: 'slitlamp', x: 2, y: 15, props: { w: 2, h: 1 } },
    { id: 'o-ey-phor', type: 'phoropterstand', x: 7, y: 14, props: { w: 1, h: 1 } },
    { id: 'o-ey-chart', type: 'visionchart', x: 10, y: 13 },
    { id: 'o-ey-chair', type: 'ichair', x: 4, y: 19, props: { color: '#DDD6FE', facing: 'up' } },

    // ════════ 이비인후과 진료실 (ent, y12-22) ════════
    { id: 'bl-ent', type: 'baylabel', x: 14, y: 12, props: { text: 'ENT · 이비인후과' } },
    { id: 'o-en-tower', type: 'enttowerchair', x: 15, y: 14, props: { w: 3, h: 2 } },
    { id: 'o-en-oto', type: 'otoscope', x: 20, y: 13 },
    { id: 'o-en-recep', type: 'ireception', x: 22, y: 19, props: { w: 3, h: 1, label: '진료' } },

    // ════════ 비뇨의학과 진료실 (uro, y24-44) ════════
    { id: 'bl-uro', type: 'baylabel', x: 1, y: 24, props: { text: 'UROLOGY · 비뇨의학과' } },
    { id: 'o-ur-bed', type: 'ibed', x: 2, y: 27, props: { variant: 'ward', label: '검사 베드' } },
    { id: 'o-ur-us', type: 'ultrasound', x: 6, y: 28, props: { w: 1, h: 1 } },
    { id: 'o-ur-recep', type: 'ireception', x: 2, y: 36, props: { w: 4, h: 1, label: '진료' } },
    { id: 'o-ur-mon', type: 'imonitor', x: 9, y: 27 },
    { id: 'o-ur-cab', type: 'icabinet', x: 9, y: 31, props: { w: 3, variant: 'supply', label: '요검사' } },

    // ════════ 신경과 진료실 (neuro, y24-44) ════════
    { id: 'bl-neu', type: 'baylabel', x: 14, y: 24, props: { text: 'NEUROLOGY · 신경과' } },
    { id: 'o-nu-bed', type: 'ibed', x: 15, y: 27, props: { variant: 'ward', occupied: true, label: '신경학 검사' } },
    { id: 'o-nu-recep', type: 'ireception', x: 22, y: 28, props: { w: 3, h: 1, label: '진료' } },
    { id: 'o-nu-mon', type: 'imonitor', x: 22, y: 31 },
    { id: 'o-nu-comp', type: 'compcart', x: 15, y: 35 },
    { id: 'o-nu-cab', type: 'icabinet', x: 22, y: 35, props: { w: 3, variant: 'equipment', label: 'EEG' } },
    { id: 'o-nu-plant', type: 'iplant', x: 25, y: 39 },
  ],
  hotspots: [
    { id: 'hs-recep', kind: 'info', x: 3, y: 3, label: '전문외래 접수' },
    { id: 'hs-slit', kind: 'quest', x: 3, y: 15, label: '세극등 검사 준비' },
    { id: 'hs-ent', kind: 'info', x: 15, y: 14, label: '내시경 이경 처치' },
    { id: 'hs-bladder', kind: 'info', x: 3, y: 27, label: '방광 초음파' },
    { id: 'hs-neuro', kind: 'quest', x: 16, y: 27, label: '신경학적 사정 (GCS·반사)' },
  ],
  npcs: [
    // checkin
    { id: 'sp-ck-n', kind: 'nurse', mode: 'idle', seed: 961, start: { x: 3, y: 6 } },
    { id: 'sp-ck-p', kind: 'patient', mode: 'idle', seed: 962, start: { x: 14, y: 7 } },
    { id: 'sp-ck-v', kind: 'visitor', mode: 'idle', seed: 963, start: { x: 20, y: 7 } },
    // eye
    { id: 'sp-ey-d', kind: 'doctor', mode: 'idle', seed: 964, start: { x: 2, y: 19 } },
    { id: 'sp-ey-p', kind: 'patient', mode: 'idle', seed: 965, start: { x: 4, y: 20 } },
    // ent
    { id: 'sp-en-d', kind: 'doctor', mode: 'idle', seed: 966, start: { x: 16, y: 20 } },
    { id: 'sp-en-p', kind: 'patient', mode: 'idle', seed: 967, start: { x: 19, y: 19 } },
    // uro
    { id: 'sp-ur-d', kind: 'doctor', mode: 'idle', seed: 968, start: { x: 4, y: 39 } },
    { id: 'sp-ur-p', kind: 'patient', mode: 'idle', seed: 969, start: { x: 7, y: 38 } },
    // neuro
    { id: 'sp-nu-d', kind: 'doctor', mode: 'idle', seed: 970, start: { x: 17, y: 31 } },
    { id: 'sp-nu-p', kind: 'patient', mode: 'idle', seed: 971, start: { x: 16, y: 39 } },
  ],
};
