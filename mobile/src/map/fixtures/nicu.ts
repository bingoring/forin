// NICU — 신생아 중환자실 (여성소아 센터, 엘리베이터 WOMEN 4F). 1:1 port of the v16
// handoff master blueprint (design-handoff_v16/reference/interior-nicu.jsx): 28×44
// tiles, peds tone, dim low-light pods, LEFT elevator door. 전실 스크럽 게이트 →
// 중앙 모니터 스테이션 · 신생아 소생 베이 → A 포드(인큐베이터) · B 포드(캥거루
// 케어, 유리 분리). New objects in nicuEquipment.tsx (NICUIsolette/GiraffeWarmer/
// CPAPUnit/PhototherapyLED); reuses BankOfMonitors/MilkFridge/NursingRecliner/
// GownBox/ScrubDispenser/HandSanitizer/CrashCart/SinkOR/shared. Markers label-only.
import type { Interior } from '@engine';

export const NICU_INTERIOR: Interior = {
  id: 'INT-NICU-00001',
  deptId: 'DEPT-NICU-00001',
  cols: 28,
  rows: 44,
  floorTheme: 'peds',
  scale: 0.9,
  playerStart: { x: 4, y: 7 }, // anteroom by the ← elevator door
  regions: [
    { id: 'station', name: '중앙 모니터 스테이션', icon: '🖥', bounds: { x: 0, y: 8, w: 14, h: 14 } },
    { id: 'resus', name: '신생아 소생 베이', icon: '🚨', bounds: { x: 13, y: 8, w: 15, h: 14 } },
    { id: 'podA', name: 'A 포드 (인큐베이터)', icon: '👶', bounds: { x: 0, y: 21, w: 14, h: 23 } },
    { id: 'podB', name: 'B 포드 · 캥거루 케어', icon: '🍼', bounds: { x: 13, y: 21, w: 15, h: 23 } },
    { id: 'ante', name: 'NICU 전실 · 스크럽', icon: '🧼', bounds: { x: 0, y: 0, w: 28, h: 9 } },
  ],
  rooms: [
    { id: 'ante', name: 'NICU 전실', sub: '가운·손위생', icon: '🧼', color: '#A7F3D0', x: 5, y: 4 },
    { id: 'station', name: '모니터 스테이션', sub: '중앙 감시', icon: '🖥', color: '#BAE6FD', x: 6, y: 14 },
    { id: 'resus', name: '소생 베이', sub: '기린 워머', icon: '🚨', color: '#FCA5A5', x: 21, y: 14 },
    { id: 'podA', name: 'A 포드', sub: '인큐베이터 3', icon: '👶', color: '#C7D2FE', x: 6, y: 33 },
    { id: 'podB', name: 'B 포드', sub: '캥거루 케어', icon: '🍼', color: '#FBCFE8', x: 21, y: 33 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y5-6
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 4 }, { x: 0, y: 7, w: 1, h: 36 },
    { x: 27, y: 1, w: 1, h: 42 },
    { x: 0, y: 43, w: 28, h: 1 },
    // anteroom | ward divider (y8) — sterile scrub gate x6-7
    { x: 1, y: 8, w: 5, h: 1 }, { x: 8, y: 8, w: 19, h: 1 },
    // station | resus divider (x13) — threshold y13-16
    { x: 13, y: 9, w: 1, h: 4 }, { x: 13, y: 17, w: 1, h: 5 },
    // mid | pods divider (y21) — thresholds x6-7 (→A) / x14-15 (→B)
    { x: 1, y: 21, w: 5, h: 1 }, { x: 8, y: 21, w: 6, h: 1 }, { x: 16, y: 21, w: 11, h: 1 },
    // pod A | pod B glass divider (x13)
  ],
  objects: [
    // low-light NICU tint over the pods (non-blocking overlay)
    { id: 'o-tint', type: 'tint', x: 1, y: 22, props: { w: 26, h: 21, color: '#1E2A40', op: 0.15 } },
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 5, props: { w: 1, h: 2, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-scrub', type: 'threshold', x: 6, y: 8, props: { w: 2, h: 1, tone: 'sterile', label: '스크럽 후 입장' } },
    { id: 'th-resus', type: 'threshold', x: 13, y: 13, props: { w: 1, h: 4 } },
    { id: 'th-podA', type: 'threshold', x: 6, y: 21, props: { w: 2, h: 1, label: '→ A 포드' } },
    { id: 'th-podB', type: 'threshold', x: 14, y: 21, props: { w: 2, h: 1, label: '→ B 포드' } },
    { id: 'o-glass', type: 'glass', x: 13, y: 22, props: { w: 1, h: 21 } },

    // ════════ NICU 전실 · 스크럽 (ante, y1-7) ════════
    { id: 'bl-ante', type: 'baylabel', x: 1, y: 1, props: { text: 'NICU ANTEROOM · 전실', highlight: true } },
    { id: 'o-an-sink', type: 'sinkor', x: 2, y: 2 },
    { id: 'o-an-gown', type: 'gownbox', x: 6, y: 2 },
    { id: 'o-an-scrub', type: 'scrubdispenser', x: 9, y: 2 },
    { id: 'o-an-san', type: 'handsanitizer', x: 12, y: 2 },
    { id: 'bl-scrub', type: 'baylabel', x: 15, y: 2, props: { text: '3분 스크럽 · 가운 착용' } },

    // ════════ 중앙 모니터 스테이션 (station, y9-20) ════════
    { id: 'bl-stn', type: 'baylabel', x: 1, y: 9, props: { text: 'CENTRAL MONITOR STATION', highlight: true } },
    { id: 'o-st-bank', type: 'bankofmonitors', x: 2, y: 11 },
    { id: 'o-st-desk', type: 'nursestation', x: 2, y: 15, props: { w: 9, h: 4 } },
    { id: 'o-st-phone', type: 'deskphone', x: 3, y: 15 },

    // ════════ 신생아 소생 베이 (resus, y9-20) ════════
    { id: 'bl-res', type: 'baylabel', x: 14, y: 9, props: { text: 'RESUSCITATION BAY' } },
    { id: 'o-rs-giraffe', type: 'giraffewarmer', x: 16, y: 12, props: { w: 2, h: 2 } },
    { id: 'o-rs-crash', type: 'crashcart', x: 22, y: 11 },
    { id: 'o-rs-cpap', type: 'cpapunit', x: 24, y: 13, props: { w: 1, h: 1 } },

    // ════════ A 포드 (인큐베이터) (podA, y22-43) ════════
    { id: 'bl-pA', type: 'baylabel', x: 1, y: 22, props: { text: 'POD A · INCUBATORS' } },
    { id: 'o-pA-led1', type: 'phototherapyled', x: 2, y: 25, props: { w: 2 } },
    { id: 'o-pA-iso1', type: 'nicuisolette', x: 2, y: 27, props: { w: 2, h: 2 } },
    { id: 'o-pA-mon1', type: 'imonitor', x: 7, y: 27, props: { beep: true } },
    { id: 'o-pA-cpap', type: 'cpapunit', x: 9, y: 26, props: { w: 1, h: 1 } },
    { id: 'o-pA-iso2', type: 'nicuisolette', x: 2, y: 37, props: { w: 2, h: 2 } },
    { id: 'o-pA-mon2', type: 'imonitor', x: 7, y: 37, props: { beep: true } },
    { id: 'o-pA-milk', type: 'milkfridge', x: 11, y: 40 },

    // ════════ B 포드 · 캥거루 케어 (podB, y22-43) ════════
    { id: 'bl-pB', type: 'baylabel', x: 14, y: 22, props: { text: 'POD B · KANGAROO CARE' } },
    { id: 'o-pB-iso1', type: 'nicuisolette', x: 15, y: 26, props: { w: 2, h: 2 } },
    { id: 'o-pB-mon1', type: 'imonitor', x: 20, y: 26, props: { beep: true } },
    { id: 'o-pB-led', type: 'phototherapyled', x: 15, y: 24, props: { w: 2 } },
    { id: 'o-pB-rec', type: 'nursingrecliner', x: 20, y: 33, props: { w: 2, h: 2 } },
    { id: 'o-pB-iso2', type: 'nicuisolette', x: 15, y: 37, props: { w: 2, h: 2 } },
    { id: 'o-pB-mon2', type: 'imonitor', x: 20, y: 37 },
    { id: 'o-pB-plant', type: 'iplant', x: 25, y: 43 },
  ],
  hotspots: [
    { id: 'hs-scrub', kind: 'quest', x: 3, y: 2, label: '손위생·가운 착용', scenarioId: 'SCN-NICU-00001' },
    { id: 'hs-central', kind: 'info', x: 6, y: 17, label: '중앙 활력 감시' },
    { id: 'hs-resus', kind: 'urgent', x: 16, y: 12, label: '미숙아 소생·기도' },
    { id: 'hs-incubator', kind: 'quest', x: 3, y: 27, label: '온·습도·활력 확인' },
    { id: 'hs-kangaroo', kind: 'info', x: 20, y: 33, label: '캥거루 케어 지지' },
  ],
  npcs: [
    // ante
    { id: 'ni-an-n', kind: 'nurse', mode: 'idle', seed: 881, start: { x: 5, y: 5 } },
    { id: 'ni-an-v', kind: 'visitor', mode: 'idle', seed: 882, start: { x: 16, y: 5 } },
    // station
    { id: 'ni-st-n', kind: 'nurse', mode: 'idle', seed: 883, start: { x: 6, y: 18 } },
    // resus
    { id: 'ni-rs-d', kind: 'doctor', mode: 'idle', seed: 884, start: { x: 19, y: 18 } },
    { id: 'ni-rs-n', kind: 'nurse', mode: 'idle', seed: 885, start: { x: 21, y: 18 } },
    // podA
    { id: 'ni-pA-n', kind: 'nurse', mode: 'idle', seed: 886, start: { x: 6, y: 33 } },
    // podB
    { id: 'ni-pB-p', kind: 'parent', mode: 'idle', seed: 887, start: { x: 22, y: 35 } },
    { id: 'ni-pB-n', kind: 'nurse', mode: 'idle', seed: 888, start: { x: 18, y: 40 } },
  ],
};
