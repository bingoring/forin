// ENDOSCOPY — 내시경실 Endoscopy Suite (외래·진단동 DX 4F). 1:1 port of the v16
// handoff master blueprint (design-handoff_v16/reference/interior-endo.jsx): 28×44
// tiles, clinical tone, LEFT elevator door. 접수·대기 → 전처치·회복 베이 · 세척·
// 재처리실(AER) → 내시경 시술실 1(상부)·2(대장). New objects in endoEquipment.tsx
// (EndoTower/ScopeWasher/ScopeCabinet/ProcedureBed); reuses OxygenTank/SuctionUnit/
// SinkOR/WasteBin/shared. Markers label-only.
import type { Interior } from '@engine';

export const ENDO_INTERIOR: Interior = {
  id: 'INT-ENDO-00001',
  deptId: 'DEPT-ENDO-00001',
  cols: 28,
  rows: 44,
  floorTheme: 'clinical',
  scale: 0.9,
  playerStart: { x: 4, y: 8 }, // check-in by the ← elevator door
  regions: [
    { id: 'prep', name: '전처치 · 회복 베이', icon: '🛏', bounds: { x: 0, y: 9, w: 14, h: 18 } },
    { id: 'reproc', name: '세척 · 재처리실', icon: '🧼', bounds: { x: 13, y: 9, w: 15, h: 18 } },
    { id: 'proc1', name: '내시경 시술실 1', icon: '🔬', bounds: { x: 0, y: 26, w: 14, h: 18 } },
    { id: 'proc2', name: '내시경 시술실 2', icon: '🔬', bounds: { x: 13, y: 26, w: 15, h: 18 } },
    { id: 'checkin', name: '접수 · 대기', icon: '🪑', bounds: { x: 0, y: 0, w: 28, h: 10 } },
  ],
  rooms: [
    { id: 'checkin', name: '접수·대기', sub: '금식 확인', icon: '🪑', color: '#BAE6FD', x: 5, y: 5 },
    { id: 'prep', name: '전처치·회복', sub: '진정·모니터', icon: '🛏', color: '#FBCFE8', x: 6, y: 17 },
    { id: 'reproc', name: '세척·재처리', sub: 'AER·소독', icon: '🧼', color: '#A7F3D0', x: 21, y: 17 },
    { id: 'proc1', name: '시술실 1', sub: '상부 위내시경', icon: '🔬', color: '#DDD6FE', x: 6, y: 36 },
    { id: 'proc2', name: '시술실 2', sub: '대장내시경', icon: '🔬', color: '#C7D2FE', x: 21, y: 36 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y7-9
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 6 }, { x: 0, y: 10, w: 1, h: 33 },
    { x: 27, y: 1, w: 1, h: 42 },
    { x: 0, y: 43, w: 28, h: 1 },
    // check-in | mid divider (y9) — thresholds x5-6 (→전처치) / x13-14 (→재처리 sterile)
    { x: 1, y: 9, w: 4, h: 1 }, { x: 7, y: 9, w: 6, h: 1 }, { x: 15, y: 9, w: 12, h: 1 },
    // prep | reproc divider (x13)
    { x: 13, y: 10, w: 1, h: 16 },
    // mid | proc divider (y26) — thresholds x6-7 (→시술1) / x14-15 (→시술2)
    { x: 1, y: 26, w: 5, h: 1 }, { x: 8, y: 26, w: 6, h: 1 }, { x: 16, y: 26, w: 11, h: 1 },
    // proc1 | proc2 divider (x13)
    { x: 13, y: 27, w: 1, h: 16 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 7, props: { w: 1, h: 3, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-prep', type: 'threshold', x: 5, y: 9, props: { w: 2, h: 1, label: '→ 전처치' } },
    { id: 'th-reproc', type: 'threshold', x: 13, y: 9, props: { w: 2, h: 1, tone: 'sterile', label: '→ 재처리' } },
    { id: 'th-proc1', type: 'threshold', x: 6, y: 26, props: { w: 2, h: 1, label: '→ 시술1' } },
    { id: 'th-proc2', type: 'threshold', x: 14, y: 26, props: { w: 2, h: 1, label: '→ 시술2' } },

    // ════════ 접수 · 대기 (checkin, y1-8) ════════
    { id: 'bl-ck', type: 'baylabel', x: 1, y: 1, props: { text: 'ENDO CHECK-IN · 금식 확인' } },
    { id: 'o-ck-recep', type: 'ireception', x: 2, y: 3, props: { w: 4, h: 1, label: '접수' } },
    { id: 'o-ck-mon', type: 'imonitor', x: 6, y: 2 },
    { id: 'o-ck-c1', type: 'ichair', x: 15, y: 6, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-c2', type: 'ichair', x: 17, y: 6, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-c3', type: 'ichair', x: 19, y: 6, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-c4', type: 'ichair', x: 21, y: 6, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-c5', type: 'ichair', x: 23, y: 6, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-ck-plant', type: 'iplant', x: 25, y: 2 },

    // ════════ 전처치 · 회복 베이 (prep, y10-25) ════════
    { id: 'bl-pr', type: 'baylabel', x: 1, y: 10, props: { text: 'PREP · RECOVERY', highlight: true } },
    { id: 'o-pr-bed1', type: 'ibed', x: 2, y: 12, props: { variant: 'ward', occupied: true, label: '전처치' } },
    { id: 'o-pr-mon1', type: 'imonitor', x: 1, y: 12, props: { beep: true } },
    { id: 'o-pr-iv', type: 'iiv', x: 6, y: 12 },
    { id: 'o-pr-o2', type: 'oxygen', x: 7, y: 12 },
    { id: 'o-pr-cur', type: 'icurtain', x: 1, y: 17, props: { w: 11, h: 1, color: '#F5C6D8' } },
    { id: 'o-pr-bed2', type: 'ibed', x: 2, y: 19, props: { variant: 'ward', occupied: true, label: '회복' } },
    { id: 'o-pr-mon2', type: 'imonitor', x: 1, y: 19 },
    { id: 'o-pr-suction', type: 'suction', x: 6, y: 20 },

    // ════════ 세척 · 재처리실 (reproc, y10-25) ════════
    { id: 'bl-rp', type: 'baylabel', x: 14, y: 10, props: { text: 'REPROCESSING · 소독' } },
    { id: 'o-rp-washer', type: 'scopewasher', x: 14, y: 13, props: { w: 2, h: 1 } },
    { id: 'o-rp-cab', type: 'scopecabinet', x: 22, y: 12, props: { w: 2, h: 1 } },
    { id: 'o-rp-sink', type: 'sinkor', x: 14, y: 19 },
    { id: 'o-rp-waste', type: 'wastebin', x: 19, y: 20, props: { tone: 'infectious' } },

    // ════════ 내시경 시술실 1 (proc1, y27-43) ════════
    { id: 'bl-p1', type: 'baylabel', x: 1, y: 27, props: { text: 'ENDO SUITE 1 · 상부' } },
    { id: 'o-p1-bed', type: 'procedurebed', x: 2, y: 31, props: { w: 3, h: 1 } },
    { id: 'o-p1-tower', type: 'endotower', x: 2, y: 37, props: { w: 2, h: 1 } },
    { id: 'o-p1-mon', type: 'imonitor', x: 9, y: 30, props: { beep: true } },
    { id: 'o-p1-suction', type: 'suction', x: 11, y: 31 },

    // ════════ 내시경 시술실 2 (proc2, y27-43) ════════
    { id: 'bl-p2', type: 'baylabel', x: 14, y: 27, props: { text: 'ENDO SUITE 2 · 대장' } },
    { id: 'o-p2-bed', type: 'procedurebed', x: 15, y: 31, props: { w: 3, h: 1 } },
    { id: 'o-p2-tower', type: 'endotower', x: 23, y: 37, props: { w: 2, h: 1 } },
    { id: 'o-p2-mon', type: 'imonitor', x: 14, y: 30, props: { beep: true } },
    { id: 'o-p2-suction', type: 'suction', x: 22, y: 31 },
    { id: 'o-p2-plant', type: 'iplant', x: 25, y: 41 },
  ],
  hotspots: [
    { id: 'hs-npo', kind: 'quest', x: 3, y: 3, label: '금식(NPO) 확인', scenarioId: 'SCN-ENDO-00001' },
    { id: 'hs-sedation', kind: 'info', x: 3, y: 12, label: '진정 회복 관찰' },
    { id: 'hs-aer', kind: 'info', x: 15, y: 13, label: '내시경 재처리(AER)' },
    { id: 'hs-upper', kind: 'quest', x: 3, y: 31, label: '진정 모니터·스코프' },
    { id: 'hs-colon', kind: 'info', x: 16, y: 31, label: '대장내시경 진행' },
  ],
  npcs: [
    // checkin
    { id: 'en-ck-n', kind: 'nurse', mode: 'idle', seed: 921, start: { x: 3, y: 4 } },
    { id: 'en-ck-p', kind: 'patient', mode: 'idle', seed: 922, start: { x: 16, y: 7 } },
    // prep
    { id: 'en-pr-n', kind: 'nurse', mode: 'idle', seed: 923, start: { x: 5, y: 15 } },
    // reproc
    { id: 'en-rp-n', kind: 'nurse', mode: 'idle', seed: 924, start: { x: 17, y: 22 } },
    // proc1
    { id: 'en-p1-d', kind: 'doctor', mode: 'idle', seed: 925, start: { x: 6, y: 35 } },
    { id: 'en-p1-n1', kind: 'nurse', mode: 'idle', seed: 926, start: { x: 9, y: 35 } },
    { id: 'en-p1-n2', kind: 'nurse', mode: 'idle', seed: 927, start: { x: 3, y: 34 } },
    // proc2
    { id: 'en-p2-d', kind: 'doctor', mode: 'idle', seed: 928, start: { x: 19, y: 35 } },
    { id: 'en-p2-n', kind: 'nurse', mode: 'idle', seed: 929, start: { x: 16, y: 35 } },
  ],
};
