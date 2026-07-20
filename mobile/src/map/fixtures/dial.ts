// HEMODIALYSIS — 인공신장실 (외래·진단동 DX 3F). 1:1 port of the v16 handoff master
// blueprint (design-handoff_v16/reference/interior-dial.jsx): 28×44 tiles, clinical
// tone, LEFT elevator door. 접수·체중 측정 → 오픈 투석 치료실(체어+투석기 열, 중앙
// 간호 아일랜드) → RO 수처리실 · 격리 투석 스테이션. New objects in dialEquipment.tsx
// (DialysisMachine/DialysisChair/ROWaterUnit); reuses NurseStationDesk/CompCart/
// SinkOR/StadiometerScale/WasteBin/shared. Markers label-only.
import type { Interior } from '@engine';

export const DIAL_INTERIOR: Interior = {
  id: 'INT-DIAL-00001',
  deptId: 'DEPT-DIAL-00001',
  cols: 28,
  rows: 44,
  floorTheme: 'clinical',
  scale: 0.9,
  playerStart: { x: 4, y: 8 }, // check-in by the ← elevator door
  regions: [
    { id: 'floor', name: '투석 치료실 (오픈 플로어)', icon: '🩸', bounds: { x: 0, y: 9, w: 28, h: 26 } },
    { id: 'water', name: 'RO 수처리실', icon: '💧', bounds: { x: 0, y: 34, w: 14, h: 10 } },
    { id: 'iso', name: '격리 투석 스테이션', icon: '⚠️', bounds: { x: 13, y: 34, w: 15, h: 10 } },
    { id: 'checkin', name: '접수 · 체중 측정', icon: '⚖️', bounds: { x: 0, y: 0, w: 28, h: 10 } },
  ],
  rooms: [
    { id: 'checkin', name: '접수·체중', sub: '투석 전 체중', icon: '⚖️', color: '#BAE6FD', x: 5, y: 5 },
    { id: 'floor', name: '투석 치료실', sub: '혈액투석 HD', icon: '🩸', color: '#FCA5A5', x: 13, y: 20 },
    { id: 'water', name: 'RO 수처리실', sub: '역삼투 정수', icon: '💧', color: '#A7F3D0', x: 6, y: 39 },
    { id: 'iso', name: '격리 투석', sub: 'B형간염 격리', icon: '⚠️', color: '#FDE68A', x: 21, y: 39 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y7-9
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 6 }, { x: 0, y: 10, w: 1, h: 33 },
    { x: 27, y: 1, w: 1, h: 42 },
    { x: 0, y: 43, w: 28, h: 1 },
    // check-in | floor divider (y9) — threshold x6-8 (→치료실)
    { x: 1, y: 9, w: 5, h: 1 }, { x: 9, y: 9, w: 18, h: 1 },
    // floor | support divider (y34) — thresholds x6-7 (→수처리) / x14-15 (→격리 sterile)
    { x: 1, y: 34, w: 5, h: 1 }, { x: 8, y: 34, w: 6, h: 1 }, { x: 16, y: 34, w: 11, h: 1 },
    // water | iso divider (x13)
    { x: 13, y: 35, w: 1, h: 8 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 7, props: { w: 1, h: 3, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-floor', type: 'threshold', x: 6, y: 9, props: { w: 3, h: 1, label: '→ 치료실' } },
    { id: 'th-water', type: 'threshold', x: 6, y: 34, props: { w: 2, h: 1, label: '→ 수처리' } },
    { id: 'th-iso', type: 'threshold', x: 14, y: 34, props: { w: 2, h: 1, tone: 'sterile', label: '→ 격리' } },

    // ════════ 접수 · 체중 측정 (checkin, y1-8) ════════
    { id: 'bl-ck', type: 'baylabel', x: 1, y: 1, props: { text: 'DIALYSIS CHECK-IN · 체중' } },
    { id: 'o-ck-recep', type: 'ireception', x: 2, y: 3, props: { w: 4, h: 1, label: '접수', marker: 'quest', markerLabel: '만성질환 정서 지지', scenarioId: 'SCN-DIAL-00012' } },
    { id: 'o-ck-scale', type: 'stadiometer', x: 7, y: 2 },
    { id: 'o-ck-mon', type: 'imonitor', x: 9, y: 2 },
    { id: 'o-ck-c1', type: 'ichair', x: 16, y: 6, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-c2', type: 'ichair', x: 18, y: 6, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-c3', type: 'ichair', x: 20, y: 6, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-c4', type: 'ichair', x: 22, y: 6, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-plant', type: 'iplant', x: 25, y: 2 },

    // ════════ 투석 치료실 오픈 플로어 (floor, y10-33) ════════
    { id: 'bl-fl', type: 'baylabel', x: 1, y: 10, props: { text: 'HEMODIALYSIS FLOOR', highlight: true } },
    { id: 'o-l-ch1', type: 'dialysischair', x: 2, y: 13, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-l-m1', type: 'dialysismachine', x: 6, y: 13, props: { w: 1, h: 1 } },
    { id: 'o-l-ch2', type: 'dialysischair', x: 2, y: 20, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-l-m2', type: 'dialysismachine', x: 6, y: 20, props: { w: 1, h: 1 } },
    { id: 'o-l-ch3', type: 'dialysischair', x: 2, y: 27, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-l-m3', type: 'dialysismachine', x: 6, y: 27, props: { w: 1, h: 1 } },
    { id: 'o-fl-desk', type: 'nursestation', x: 10, y: 16, props: { w: 8, h: 5 } },
    { id: 'o-fl-comp', type: 'compcart', x: 11, y: 22 },
    { id: 'o-r-ch1', type: 'dialysischair', x: 20, y: 13, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-r-m1', type: 'dialysismachine', x: 24, y: 13, props: { w: 1, h: 1 } },
    { id: 'o-r-ch2', type: 'dialysischair', x: 20, y: 20, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-r-m2', type: 'dialysismachine', x: 24, y: 20, props: { w: 1, h: 1 } },
    { id: 'o-r-ch3', type: 'dialysischair', x: 20, y: 27, props: { w: 2, h: 2 } },
    { id: 'o-r-m3', type: 'dialysismachine', x: 24, y: 27, props: { w: 1, h: 1 } },

    // ════════ RO 수처리실 (water, y35-42) ════════
    { id: 'bl-wt', type: 'baylabel', x: 1, y: 35, props: { text: 'RO WATER · 수처리' } },
    { id: 'o-wt-ro', type: 'rowaterunit', x: 2, y: 38, props: { w: 2, h: 2 } },
    { id: 'o-wt-sink', type: 'sinkor', x: 8, y: 38 },

    // ════════ 격리 투석 스테이션 (iso, y35-42) ════════
    { id: 'bl-is', type: 'baylabel', x: 14, y: 35, props: { text: 'ISOLATION HD · B형간염' } },
    { id: 'o-is-ch', type: 'dialysischair', x: 15, y: 37, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-is-m', type: 'dialysismachine', x: 19, y: 37, props: { w: 1, h: 1 } },
    { id: 'o-is-waste', type: 'wastebin', x: 23, y: 37, props: { tone: 'infectious' } },
    { id: 'o-is-plant', type: 'iplant', x: 25, y: 41 },
  ],
  hotspots: [
    { id: 'hs-weigh', kind: 'quest', x: 7, y: 3, label: '투석 전 체중 측정', scenarioId: 'SCN-DIAL-00001' },
    { id: 'hs-avf', kind: 'quest', x: 3, y: 20, label: '바이탈·천자(AVF) 확인', scenarioId: 'SCN-DIAL-00002' },
    { id: 'hs-rowater', kind: 'quest', x: 3, y: 38, label: '역삼투 수질 점검', scenarioId: 'SCN-DIAL-00003' },
    { id: 'hs-iso', kind: 'quest', x: 15, y: 37, label: '전용 격리 투석', scenarioId: 'SCN-DIAL-00004' },
  ],
  npcs: [
    // checkin
    { id: 'di-ck-n', kind: 'nurse', mode: 'idle', seed: 941, start: { x: 3, y: 4 }, marker: 'quest', markerLabel: '투석 환자 식이 상담', scenarioId: 'SCN-DIAL-00005' },
    { id: 'di-ck-p', kind: 'patient', mode: 'idle', seed: 942, start: { x: 8, y: 5 }, marker: 'quest', markerLabel: '응급 투석 안내', scenarioId: 'SCN-DIAL-00006' },
    // floor
    { id: 'di-fl-n1', kind: 'nurse', mode: 'idle', seed: 943, start: { x: 13, y: 19 }, marker: 'quest', markerLabel: '투석 카테터 감염 관찰', scenarioId: 'SCN-DIAL-00007' },
    { id: 'di-fl-n2', kind: 'nurse', mode: 'idle', seed: 944, start: { x: 5, y: 17 }, marker: 'quest', markerLabel: '투석 중 근경련 대응', scenarioId: 'SCN-DIAL-00008' },
    { id: 'di-fl-d', kind: 'doctor', mode: 'idle', seed: 945, start: { x: 19, y: 24 }, marker: 'quest', markerLabel: '신장이식 대기 상담', scenarioId: 'SCN-DIAL-00009' },
    // water
    { id: 'di-wt-d', kind: 'doctor', mode: 'idle', seed: 946, start: { x: 6, y: 41 }, marker: 'quest', markerLabel: '빈혈 관리(EPO) 교육', scenarioId: 'SCN-DIAL-00010' },
    // iso
    { id: 'di-is-n', kind: 'nurse', mode: 'idle', seed: 947, start: { x: 17, y: 41 }, marker: 'quest', markerLabel: '인결합제 복약 교육', scenarioId: 'SCN-DIAL-00011' },
  ],
};
