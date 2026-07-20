// REHABILITATION — 대형 재활치료실 PT/OT Gym (암센터·재활관 ONCO 1F). 1:1 port of the
// v16 handoff master blueprint (design-handoff_v16/reference/interior-rehab.jsx):
// 28×44 tiles, peds tone, LEFT elevator door. One big open therapy gym — 재활
// 접수·평가 → 보행 훈련존(평행봉·트레드밀) · 매트 치료존 → 유산소·근력 존 · OT
// 일상생활(ADL) 훈련 코너. New objects in rehabEquipment.tsx (ParallelBars/
// TherapyMat/Treadmill/ShoulderPulley/GymBallRack); ADLKitchen(hospice)·WalkerRack
// (surg)·shared reused. Markers label-only.
import type { Interior } from '@engine';

export const REHAB_INTERIOR: Interior = {
  id: 'INT-REHAB-00001',
  deptId: 'DEPT-REHAB-00001',
  cols: 28,
  rows: 44,
  floorTheme: 'peds',
  scale: 0.9,
  playerStart: { x: 4, y: 8 }, // rehab reception by the ← elevator door
  regions: [
    { id: 'gait', name: '보행 훈련존', icon: '🚶', bounds: { x: 0, y: 9, w: 14, h: 18 } },
    { id: 'mat', name: '매트 치료존', icon: '🧘', bounds: { x: 13, y: 9, w: 15, h: 18 } },
    { id: 'cardio', name: '유산소 · 근력 존', icon: '🏃', bounds: { x: 0, y: 26, w: 15, h: 18 } },
    { id: 'adl', name: 'OT · 일상생활 훈련', icon: '🍳', bounds: { x: 14, y: 26, w: 14, h: 18 } },
    { id: 'reception', name: '재활 접수 · 평가', icon: '📋', bounds: { x: 0, y: 0, w: 28, h: 10 } },
  ],
  rooms: [
    { id: 'reception', name: '재활 접수', sub: '평가·스케줄', icon: '📋', color: '#BAE6FD', x: 5, y: 5 },
    { id: 'gait', name: '보행 훈련', sub: '평행봉·트레드밀', icon: '🚶', color: '#A7D0BC', x: 6, y: 17 },
    { id: 'mat', name: '매트 치료', sub: '도수·운동치료', icon: '🧘', color: '#C7B8E8', x: 21, y: 17 },
    { id: 'cardio', name: '유산소·근력', sub: '지구력 훈련', icon: '🏃', color: '#FBCFE8', x: 6, y: 35 },
    { id: 'adl', name: 'ADL 훈련', sub: '작업치료(OT)', icon: '🍳', color: '#FDE68A', x: 21, y: 35 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y7-9
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 6 }, { x: 0, y: 10, w: 1, h: 33 },
    { x: 27, y: 1, w: 1, h: 42 },
    { x: 0, y: 43, w: 28, h: 1 },
    // reception | gym divider (y9) — wide openings x5-8 / x14-17 (open gym)
    { x: 1, y: 9, w: 4, h: 1 }, { x: 9, y: 9, w: 5, h: 1 }, { x: 18, y: 9, w: 9, h: 1 },
    // gait | mat divider (x13, partial) — threshold y14-18; ends y25 so it clears
    // the y26 lower-gym threshold row (handoff drew it 1 tile too long, overlapping)
    { x: 13, y: 10, w: 1, h: 4 }, { x: 13, y: 19, w: 1, h: 7 },
    // upper | lower gym divider (y26) — threshold x13-14
    { x: 1, y: 26, w: 12, h: 1 }, { x: 15, y: 26, w: 12, h: 1 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 7, props: { w: 1, h: 3, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-gait', type: 'threshold', x: 5, y: 9, props: { w: 4, h: 1 } },
    { id: 'th-mat', type: 'threshold', x: 14, y: 9, props: { w: 4, h: 1 } },
    { id: 'th-gm', type: 'threshold', x: 13, y: 14, props: { w: 1, h: 5 } },
    { id: 'th-lower', type: 'threshold', x: 13, y: 26, props: { w: 2, h: 1 } },

    // ════════ 재활 접수 · 평가 (reception, y1-8) ════════
    { id: 'bl-rc', type: 'baylabel', x: 1, y: 1, props: { text: 'REHAB RECEPTION · 평가' } },
    { id: 'o-rc-recep', type: 'ireception', x: 2, y: 3, props: { w: 4, h: 1, label: '접수·평가' } },
    { id: 'o-rc-mon', type: 'imonitor', x: 6, y: 2 },
    { id: 'o-rc-comp', type: 'compcart', x: 9, y: 2 },
    { id: 'o-rc-c1', type: 'ichair', x: 13, y: 4, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-rc-c2', type: 'ichair', x: 15, y: 4, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-rc-c3', type: 'ichair', x: 13, y: 6, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-rc-c4', type: 'ichair', x: 15, y: 6, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-rc-plant', type: 'iplant', x: 17, y: 5 },

    // ════════ 보행 훈련존 (gait, y10-25) ════════
    { id: 'bl-ga', type: 'baylabel', x: 1, y: 10, props: { text: 'GAIT TRAINING', highlight: true } },
    { id: 'o-ga-bars', type: 'parallelbars', x: 2, y: 12, props: { w: 4 } },
    { id: 'o-ga-tread', type: 'treadmill', x: 3, y: 18, props: { w: 2, h: 1 } },
    { id: 'o-ga-pulley', type: 'shoulderpulley', x: 10, y: 11 },
    { id: 'o-ga-walker', type: 'walkerrack', x: 9, y: 22, props: { w: 3 } },

    // ════════ 매트 치료존 (mat, y10-25) ════════
    { id: 'bl-ma', type: 'baylabel', x: 14, y: 10, props: { text: 'MAT THERAPY' } },
    { id: 'o-ma-mat1', type: 'therapymat', x: 15, y: 13, props: { w: 2, h: 1 } },
    { id: 'o-ma-mat2', type: 'therapymat', x: 15, y: 20, props: { w: 2, h: 1 } },
    { id: 'o-ma-pulley', type: 'shoulderpulley', x: 24, y: 11 },
    { id: 'o-ma-plant', type: 'iplant', x: 25, y: 24 },

    // ════════ 유산소 · 근력 존 (cardio, y27-42) ════════
    { id: 'bl-cd', type: 'baylabel', x: 1, y: 27, props: { text: 'CARDIO · STRENGTH' } },
    { id: 'o-cd-tread1', type: 'treadmill', x: 2, y: 30, props: { w: 2, h: 1 } },
    { id: 'o-cd-tread2', type: 'treadmill', x: 7, y: 30, props: { w: 2, h: 1 } },
    { id: 'o-cd-balls', type: 'gymballrack', x: 2, y: 37, props: { w: 2, h: 1 } },
    { id: 'o-cd-bars', type: 'parallelbars', x: 7, y: 38, props: { w: 4 } },

    // ════════ OT · 일상생활 훈련 (adl, y27-42) ════════
    { id: 'bl-ad', type: 'baylabel', x: 15, y: 27, props: { text: 'OT · ADL TRAINING', highlight: true } },
    { id: 'o-ad-kitchen', type: 'adlkitchen', x: 15, y: 30, props: { w: 4, h: 1 } },
    { id: 'o-ad-bed', type: 'ibed', x: 20, y: 35, props: { variant: 'ward', label: '이동 훈련' } },
    { id: 'o-ad-balls', type: 'gymballrack', x: 24, y: 37, props: { w: 2, h: 1 } },
    { id: 'o-ad-plant', type: 'iplant', x: 25, y: 41 },
  ],
  hotspots: [
    { id: 'hs-eval', kind: 'quest', x: 4, y: 3, label: '초기 기능 평가', scenarioId: 'SCN-REHAB-00001' },
    { id: 'hs-gait', kind: 'quest', x: 4, y: 13, label: '평행봉 보행 보조', scenarioId: 'SCN-REHAB-00002' },
    { id: 'hs-manual', kind: 'quest', x: 16, y: 13, label: '도수 치료·ROM', scenarioId: 'SCN-REHAB-00003' },
    { id: 'hs-cardio', kind: 'quest', x: 3, y: 31, label: '지구력 훈련', scenarioId: 'SCN-REHAB-00004' },
    { id: 'hs-adl', kind: 'quest', x: 16, y: 30, label: '부엌 일상동작 훈련', scenarioId: 'SCN-REHAB-00005' },
  ],
  npcs: [
    // reception
    { id: 're-rc-d', kind: 'doctor', mode: 'idle', seed: 1061, start: { x: 4, y: 6 }, marker: 'quest', markerLabel: '가정 복귀 평가', scenarioId: 'SCN-REHAB-00006' },
    { id: 're-rc-p', kind: 'patient', mode: 'idle', seed: 1062, start: { x: 7, y: 6 }, marker: 'quest', markerLabel: '연하 재활 훈련', scenarioId: 'SCN-REHAB-00007' },
    // gait
    { id: 're-ga-p', kind: 'patient', mode: 'idle', seed: 1063, start: { x: 5, y: 15 }, marker: 'quest', markerLabel: '상지 재활 훈련', scenarioId: 'SCN-REHAB-00008' },
    { id: 're-ga-n', kind: 'nurse', mode: 'idle', seed: 1064, start: { x: 7, y: 16 }, marker: 'quest', markerLabel: '재활 중 통증 관리', scenarioId: 'SCN-REHAB-00009' },
    // mat
    { id: 're-ma-n', kind: 'nurse', mode: 'idle', seed: 1065, start: { x: 17, y: 16 }, marker: 'quest', markerLabel: '보조기·의지 적응', scenarioId: 'SCN-REHAB-00010' },
    { id: 're-ma-p', kind: 'patient', mode: 'idle', seed: 1066, start: { x: 21, y: 22 }, marker: 'quest', markerLabel: '재활 동기 지지', scenarioId: 'SCN-REHAB-00011' },
    // cardio
    { id: 're-cd-p', kind: 'patient', mode: 'idle', seed: 1067, start: { x: 4, y: 35 }, marker: 'quest', markerLabel: '퇴원 운동 교육', scenarioId: 'SCN-REHAB-00012' },
    { id: 're-cd-n', kind: 'nurse', mode: 'idle', seed: 1068, start: { x: 9, y: 35 } },
    // adl
    { id: 're-ad-n', kind: 'nurse', mode: 'idle', seed: 1069, start: { x: 17, y: 33 } },
    { id: 're-ad-p', kind: 'patient', mode: 'idle', seed: 1070, start: { x: 19, y: 33 } },
  ],
};
