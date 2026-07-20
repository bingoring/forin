// RADIOLOGY — 영상의학과 (외래·진단 지원동 DX 1F). 1:1 port of the v16 handoff master
// blueprint (design-handoff_v16/reference/interior-rad.jsx): 28×48 tiles, clinical
// tone, LEFT elevator door. 접수·대기 + 어두운 판독실(PACS) → 중앙 복도 → CT·MRI
// 촬영실(각 차폐 제어 부스) → X-ray 촬영실. New objects in radEquipment.tsx
// (CTScanner/MRIScanner/XrayUnit/ControlConsole/LeadApronRack); reuses PACSViewer/
// WaitingDisplay/Handrail/VitalsCart/shared. Markers label-only.
import type { Interior } from '@engine';

export const RAD_INTERIOR: Interior = {
  id: 'INT-RAD-00001',
  deptId: 'DEPT-RAD-00001',
  cols: 28,
  rows: 48,
  floorTheme: 'clinical',
  scale: 0.9,
  playerStart: { x: 4, y: 14 }, // central corridor by the ← elevator door
  regions: [
    { id: 'checkin', name: '접수 · 대기', icon: '🪑', bounds: { x: 0, y: 0, w: 14, h: 11 } },
    { id: 'reading', name: '판독실 · Reading Room', icon: '🖥', bounds: { x: 13, y: 0, w: 15, h: 11 } },
    { id: 'ct', name: 'CT 촬영실', icon: '🍩', bounds: { x: 0, y: 17, w: 14, h: 12 } },
    { id: 'mri', name: 'MRI 촬영실', icon: '🧲', bounds: { x: 13, y: 17, w: 15, h: 12 } },
    { id: 'xray', name: 'X-ray 촬영실', icon: '🦴', bounds: { x: 0, y: 28, w: 28, h: 20 } },
    { id: 'hall', name: '중앙 복도 · 안내', icon: '🧭', bounds: { x: 0, y: 10, w: 28, h: 8 } },
  ],
  rooms: [
    { id: 'checkin', name: '접수·대기', sub: '영상 접수', icon: '🪑', color: '#BAE6FD', x: 4, y: 5 },
    { id: 'reading', name: '판독실', sub: 'PACS 판독', icon: '🖥', color: '#C4CBD2', x: 20, y: 5 },
    { id: 'ct', name: 'CT 촬영실', sub: '조영 CT', icon: '🍩', color: '#DDD6FE', x: 6, y: 23 },
    { id: 'mri', name: 'MRI 촬영실', sub: '3T MRI', icon: '🧲', color: '#C7D2FE', x: 20, y: 23 },
    { id: 'xray', name: 'X-ray 촬영실', sub: '일반 촬영', icon: '🦴', color: '#A7F3D0', x: 13, y: 40 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y13-15
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 12 }, { x: 0, y: 16, w: 1, h: 31 },
    { x: 27, y: 1, w: 1, h: 46 },
    { x: 0, y: 47, w: 28, h: 1 },
    // check-in | hall divider (y10) — thresholds x6-7 / x13-14 (→판독)
    { x: 1, y: 10, w: 5, h: 1 }, { x: 8, y: 10, w: 5, h: 1 }, { x: 15, y: 10, w: 12, h: 1 },
    // check-in | reading divider (x13) — threshold y6-8
    { x: 13, y: 1, w: 1, h: 5 }, { x: 13, y: 9, w: 1, h: 1 },
    // hall | scan divider (y17) — thresholds x6-7 (→CT) / x14-15 (→MRI)
    { x: 1, y: 17, w: 5, h: 1 }, { x: 8, y: 17, w: 6, h: 1 }, { x: 16, y: 17, w: 11, h: 1 },
    // CT | MRI divider (x13)
    { x: 13, y: 18, w: 1, h: 11 },
    // scan | xray divider (y28) — threshold x11-12 (→X-ray)
    { x: 1, y: 28, w: 10, h: 1 }, { x: 13, y: 28, w: 14, h: 1 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 13, props: { w: 1, h: 3, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-hall', type: 'threshold', x: 6, y: 10, props: { w: 2, h: 1, label: '→ 복도' } },
    { id: 'th-read', type: 'threshold', x: 13, y: 10, props: { w: 2, h: 1, label: '→ 판독' } },
    { id: 'th-read2', type: 'threshold', x: 13, y: 6, props: { w: 1, h: 3 } },
    { id: 'th-ct', type: 'threshold', x: 6, y: 17, props: { w: 2, h: 1, label: '→ CT' } },
    { id: 'th-mri', type: 'threshold', x: 14, y: 17, props: { w: 2, h: 1, label: '→ MRI' } },
    { id: 'th-xray', type: 'threshold', x: 11, y: 28, props: { w: 2, h: 1, label: '→ X-ray' } },

    // ════════ 접수 · 대기 (checkin, y1-9) ════════
    { id: 'bl-ck', type: 'baylabel', x: 1, y: 1, props: { text: '영상 접수 · CHECK-IN' } },
    { id: 'o-ck-recep', type: 'ireception', x: 2, y: 3, props: { w: 4, h: 1, label: '접수' } },
    { id: 'o-ck-mon', type: 'imonitor', x: 6, y: 2 },
    { id: 'o-ck-c1', type: 'ichair', x: 2, y: 7, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-c2', type: 'ichair', x: 4, y: 7, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-c3', type: 'ichair', x: 6, y: 7, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-c4', type: 'ichair', x: 8, y: 7, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-c5', type: 'ichair', x: 10, y: 7, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-plant', type: 'iplant', x: 11, y: 8 },

    // ════════ 판독실 · Reading Room (reading, y1-9) ════════
    { id: 'o-rd-tint', type: 'tint', x: 14, y: 1, props: { w: 13, h: 9, color: '#1E2A40', op: 0.18 } },
    { id: 'bl-rd', type: 'baylabel', x: 14, y: 1, props: { text: 'READING ROOM · 판독', highlight: true } },
    { id: 'o-rd-pacs1', type: 'pacsviewer', x: 15, y: 3 },
    { id: 'o-rd-pacs2', type: 'pacsviewer', x: 20, y: 3 },
    { id: 'o-rd-recep', type: 'ireception', x: 23, y: 5, props: { w: 3, h: 1, label: '판독 데스크' } },

    // ════════ 중앙 복도 · 안내 (hall, y11-16) ════════
    { id: 'bl-hl', type: 'baylabel', x: 1, y: 11, props: { text: 'RADIOLOGY CORRIDOR', highlight: true } },
    { id: 'o-hl-rail', type: 'handrail', x: 27, y: 11, props: { w: 1, h: 5, vertical: true } },
    { id: 'o-hl-apron', type: 'leadapronrack', x: 3, y: 12, props: { w: 1, h: 1 } },
    { id: 'o-hl-vitals', type: 'vitals', x: 22, y: 13 },
    { id: 'o-hl-display', type: 'waitingdisplay', x: 16, y: 11 },

    // ════════ CT 촬영실 (ct, y18-27) ════════
    { id: 'bl-ct', type: 'baylabel', x: 1, y: 18, props: { text: 'CT SCAN' } },
    { id: 'o-ct-scanner', type: 'ctscanner', x: 2, y: 21, props: { w: 3, h: 3 } },
    { id: 'o-ct-glass', type: 'glass', x: 11, y: 19, props: { w: 1, h: 8 } },
    { id: 'o-ct-console', type: 'controlconsole', x: 8, y: 24, props: { w: 2, h: 1 } },

    // ════════ MRI 촬영실 (mri, y18-27) ════════
    { id: 'bl-mri', type: 'baylabel', x: 14, y: 18, props: { text: 'MRI SCAN' } },
    { id: 'o-mri-scanner', type: 'mriscanner', x: 14, y: 21, props: { w: 4, h: 3 } },
    { id: 'o-mri-console', type: 'controlconsole', x: 22, y: 24, props: { w: 2, h: 1 } },

    // ════════ X-ray 촬영실 (xray, y29-46) ════════
    { id: 'bl-xr', type: 'baylabel', x: 1, y: 29, props: { text: 'GENERAL X-RAY' } },
    { id: 'o-xr-unit', type: 'xrayunit', x: 4, y: 33, props: { w: 2, h: 2 } },
    { id: 'o-xr-glass', type: 'glass', x: 12, y: 30, props: { w: 1, h: 9 } },
    { id: 'o-xr-console', type: 'controlconsole', x: 14, y: 33, props: { w: 2, h: 1 } },
    { id: 'o-xr-apron', type: 'leadapronrack', x: 20, y: 31, props: { w: 1, h: 1 } },
    { id: 'o-xr-bed', type: 'ibed', x: 3, y: 40, props: { variant: 'ward', label: '촬영 대기' } },
    { id: 'o-xr-plant', type: 'iplant', x: 25, y: 45 },
  ],
  hotspots: [
    { id: 'hs-checkin', kind: 'quest', x: 3, y: 3, label: '검사 접수', scenarioId: 'SCN-RAD-00002' },
    { id: 'hs-read', kind: 'quest', x: 16, y: 4, label: '영상 판독 (Read)', scenarioId: 'SCN-RAD-00003' },
    { id: 'hs-guide', kind: 'quest', x: 9, y: 13, label: '검사 안내', scenarioId: 'SCN-RAD-00004' },
    { id: 'hs-ct', kind: 'quest', x: 3, y: 22, label: '조영제·포지셔닝', scenarioId: 'SCN-RAD-00001' },
    { id: 'hs-mri', kind: 'quest', x: 15, y: 22, label: '금속 반입 금지', scenarioId: 'SCN-RAD-00005' },
    { id: 'hs-xray', kind: 'quest', x: 5, y: 34, label: '흉부 촬영 포지셔닝', scenarioId: 'SCN-RAD-00006' },
  ],
  npcs: [
    // checkin
    { id: 'rd-ck-n', kind: 'nurse', mode: 'idle', seed: 901, start: { x: 3, y: 4 }, marker: 'quest', markerLabel: '유방촬영(맘모) 안내', scenarioId: 'SCN-RAD-00007' },
    { id: 'rd-ck-p', kind: 'patient', mode: 'idle', seed: 902, start: { x: 5, y: 8 }, marker: 'quest', markerLabel: 'PET-CT 안내', scenarioId: 'SCN-RAD-00008' },
    // reading
    { id: 'rd-rd-d1', kind: 'doctor', mode: 'idle', seed: 903, start: { x: 16, y: 7 }, marker: 'quest', markerLabel: '소아 촬영 협조 유도', scenarioId: 'SCN-RAD-00009' },
    { id: 'rd-rd-d2', kind: 'doctor', mode: 'idle', seed: 904, start: { x: 21, y: 7 }, marker: 'quest', markerLabel: '조영제 전 신기능 확인', scenarioId: 'SCN-RAD-00010' },
    // hall
    { id: 'rd-hl-n', kind: 'nurse', mode: 'idle', seed: 905, start: { x: 9, y: 14 }, marker: 'quest', markerLabel: 'MRI 중 움직임·불편 대응', scenarioId: 'SCN-RAD-00011' },
    { id: 'rd-hl-p', kind: 'patient', mode: 'idle', seed: 906, start: { x: 13, y: 14 }, marker: 'quest', markerLabel: '영상 판독 결과 안내', scenarioId: 'SCN-RAD-00012' },
    // ct
    { id: 'rd-ct-d', kind: 'doctor', mode: 'idle', seed: 907, start: { x: 9, y: 26 } },
    // mri
    { id: 'rd-mri-n', kind: 'nurse', mode: 'idle', seed: 908, start: { x: 22, y: 26 } },
    // xray
    { id: 'rd-xr-d', kind: 'doctor', mode: 'idle', seed: 909, start: { x: 8, y: 37 } },
    { id: 'rd-xr-n', kind: 'nurse', mode: 'idle', seed: 910, start: { x: 16, y: 36 } },
    { id: 'rd-xr-p', kind: 'patient', mode: 'idle', seed: 911, start: { x: 20, y: 44 } },
  ],
};
