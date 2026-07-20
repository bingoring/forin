// ONCOLOGY / BMT — 종양학 병동 · 조혈모세포 이식실 (암센터 ONCO 3F). 1:1 port of the
// v16 handoff master blueprint (design-handoff_v16/reference/interior-onco.jsx):
// 28×50 tiles, internal-med tone, LEFT elevator door. 약물 조제 확인 · 상담실 →
// 중앙 간호 스테이션 → 개방형 항암 주입 베이(리클라이너) → BMT 전실 · 양압 무균
// 이식실 2(유리 격리). New objects in oncoEquipment.tsx (BMTPod/ChemoHazardBin/
// Fridge); chemo infusion pieces (infusionchair/smartinfusionpump/ppestation) reuse
// infusionEquipment; warmercabinet/shared reused. Markers label-only.
import type { Interior } from '@engine';

export const ONCO_INTERIOR: Interior = {
  id: 'INT-ONCO-00001',
  deptId: 'DEPT-ONCO-00001',
  cols: 28,
  rows: 50,
  floorTheme: 'internal',
  scale: 0.9,
  playerStart: { x: 4, y: 15 }, // central station corridor by the ← elevator door
  regions: [
    { id: 'verify', name: '약물 조제 확인', icon: '💊', bounds: { x: 0, y: 0, w: 14, h: 11 } },
    { id: 'quiet', name: '상담실 · Quiet Room', icon: '🕊', bounds: { x: 13, y: 0, w: 15, h: 11 } },
    { id: 'station', name: '중앙 간호 스테이션', icon: '🖥', bounds: { x: 0, y: 10, w: 28, h: 10 } },
    { id: 'infusion', name: '항암 주입 베이', icon: '🧪', bounds: { x: 0, y: 19, w: 28, h: 16 } },
    { id: 'ante', name: 'BMT 전실 (Anteroom)', icon: '🧼', bounds: { x: 0, y: 34, w: 9, h: 16 } },
    { id: 'bmt', name: 'BMT 무균 이식실', icon: '🎗', bounds: { x: 8, y: 34, w: 20, h: 16 } },
  ],
  rooms: [
    { id: 'verify', name: '조제 확인', sub: '항암 더블체크', icon: '💊', color: '#DDD6FE', x: 4, y: 5 },
    { id: 'quiet', name: '상담실', sub: '가족 상담', icon: '🕊', color: '#E4ECE0', x: 20, y: 5 },
    { id: 'station', name: '간호 스테이션', sub: '주입 조율', icon: '🖥', color: '#BAE6FD', x: 13, y: 15 },
    { id: 'infusion', name: '항암 주입 베이', sub: 'Infusion', icon: '🧪', color: '#C7B8E8', x: 13, y: 26 },
    { id: 'ante', name: 'BMT 전실', sub: '양압·방호구', icon: '🧼', color: '#A7F3D0', x: 4, y: 43 },
    { id: 'bmt', name: 'BMT 이식실', sub: '무균 격리', icon: '🎗', color: '#FBCFE8', x: 18, y: 43 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y14-16
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 13 }, { x: 0, y: 17, w: 1, h: 32 },
    { x: 27, y: 1, w: 1, h: 48 },
    { x: 0, y: 49, w: 28, h: 1 },
    // service strip divider (y10) — thresholds x6-7 / x13-14
    { x: 1, y: 10, w: 5, h: 1 }, { x: 8, y: 10, w: 5, h: 1 }, { x: 15, y: 10, w: 12, h: 1 },
    // verify | quiet divider (x13) — threshold y6-8
    { x: 13, y: 1, w: 1, h: 5 }, { x: 13, y: 9, w: 1, h: 1 },
    // station | infusion divider (y19) — thresholds x8-10 / x18-20
    { x: 1, y: 19, w: 7, h: 1 }, { x: 11, y: 19, w: 7, h: 1 }, { x: 21, y: 19, w: 6, h: 1 },
    // infusion | bmt divider (y34) — sterile 전실 게이트 x4 (handoff drew this
    // threshold at x8 = the ante|bmt boundary column, sealing the anteroom; moved it
    // into the anteroom width so 전실 is reachable)
    { x: 1, y: 34, w: 3, h: 1 }, { x: 5, y: 34, w: 4, h: 1 }, { x: 9, y: 34, w: 18, h: 1 },
    // ante | bmt: wall y35-36, sterile air-lock y37-38, glass y39-48
    { x: 8, y: 35, w: 1, h: 2 },
    // BMT room1 | room2 glass divider (x18) — object
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 14, props: { w: 1, h: 3, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-corr1', type: 'threshold', x: 6, y: 10, props: { w: 2, h: 1, label: '→ 복도' } },
    { id: 'th-corr2', type: 'threshold', x: 13, y: 10, props: { w: 2, h: 1, label: '→ 복도' } },
    { id: 'th-quiet', type: 'threshold', x: 13, y: 6, props: { w: 1, h: 3 } },
    { id: 'th-inf1', type: 'threshold', x: 8, y: 19, props: { w: 3, h: 1 } },
    { id: 'th-inf2', type: 'threshold', x: 18, y: 19, props: { w: 3, h: 1 } },
    { id: 'th-ante', type: 'threshold', x: 4, y: 34, props: { w: 1, h: 1, tone: 'sterile', label: '→ 전실' } },
    { id: 'th-airlock', type: 'threshold', x: 8, y: 37, props: { w: 1, h: 2, tone: 'sterile' } },
    { id: 'o-bmt-glass1', type: 'glass', x: 8, y: 39, props: { w: 1, h: 10 } },
    // room1 | room2 glass with a connecting door y43 (handoff sealed room 2; both
    // transplant pods must be reachable through the sterile wing)
    { id: 'o-bmt-glass2a', type: 'glass', x: 18, y: 36, props: { w: 1, h: 7 } },
    { id: 'th-bmt2', type: 'threshold', x: 18, y: 43, props: { w: 1, h: 1, tone: 'sterile' } },
    { id: 'o-bmt-glass2b', type: 'glass', x: 18, y: 44, props: { w: 1, h: 5 } },

    // ════════ 약물 조제 확인 (verify, y1-9) ════════
    { id: 'bl-vf', type: 'baylabel', x: 1, y: 1, props: { text: 'CHEMO VERIFY · 조제 확인', highlight: true } },
    { id: 'o-vf-recep', type: 'ireception', x: 2, y: 3, props: { w: 4, h: 1, label: '더블체크' } },
    { id: 'o-vf-mon', type: 'imonitor', x: 6, y: 2 },
    { id: 'o-vf-bin', type: 'chemohazardbin', x: 2, y: 6 },
    { id: 'o-vf-cab', type: 'icabinet', x: 8, y: 2, props: { w: 4, variant: 'drug', label: 'CHEMO' } },
    { id: 'o-vf-fridge', type: 'fridge', x: 10, y: 6, props: { w: 1, h: 1 } },

    // ════════ 상담실 · Quiet Room (quiet, y1-9) ════════
    { id: 'bl-qt', type: 'baylabel', x: 14, y: 1, props: { text: 'QUIET ROOM · 상담' } },
    { id: 'o-qt-sofa1', type: 'sofa', x: 15, y: 3, props: { w: 3, h: 2, color: '#8FB59E' } },
    { id: 'o-qt-table', type: 'coffeetable', x: 19, y: 4, props: { w: 2, h: 1 } },
    { id: 'o-qt-sofa2', type: 'sofa', x: 22, y: 3, props: { w: 3, h: 2, color: '#B7A6C8' } },
    { id: 'o-qt-plant', type: 'iplant', x: 25, y: 2 },
    { id: 'o-qt-pic', type: 'framedpic', x: 16, y: 1, props: { w: 2 } },

    // ════════ 중앙 간호 스테이션 (station, y11-18) ════════
    { id: 'bl-st', type: 'baylabel', x: 1, y: 11, props: { text: 'ONCOLOGY NURSING STATION', highlight: true } },
    { id: 'o-st-rail', type: 'handrail', x: 27, y: 11, props: { w: 1, h: 7, vertical: true } },
    { id: 'o-st-desk', type: 'nursestation', x: 8, y: 12, props: { w: 12, h: 5 } },
    { id: 'o-st-phone', type: 'deskphone', x: 9, y: 12 },
    { id: 'o-st-chart', type: 'chartbinder', x: 18, y: 12 },
    { id: 'o-st-comp', type: 'compcart', x: 4, y: 12 },

    // ════════ 항암 주입 베이 (infusion, y20-33) ════════
    { id: 'bl-if', type: 'baylabel', x: 1, y: 20, props: { text: 'CHEMO INFUSION BAY' } },
    { id: 'o-if-c1', type: 'infusionchair', x: 2, y: 22, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-if-p1', type: 'smartinfusionpump', x: 5, y: 22, props: { w: 1, h: 1 } },
    { id: 'o-if-c2', type: 'infusionchair', x: 7, y: 22, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-if-p2', type: 'smartinfusionpump', x: 10, y: 22, props: { w: 1, h: 1 } },
    { id: 'o-if-c3', type: 'infusionchair', x: 13, y: 22, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-if-p3', type: 'smartinfusionpump', x: 16, y: 22, props: { w: 1, h: 1 } },
    { id: 'o-if-c4', type: 'infusionchair', x: 2, y: 28, props: { occupied: true, w: 2, h: 2 } },
    { id: 'o-if-p4', type: 'smartinfusionpump', x: 5, y: 28, props: { w: 1, h: 1 } },
    { id: 'o-if-c5', type: 'infusionchair', x: 7, y: 28, props: { w: 2, h: 2 } },
    { id: 'o-if-p5', type: 'smartinfusionpump', x: 10, y: 28, props: { w: 1, h: 1 } },
    { id: 'o-if-warm', type: 'warmercabinet', x: 20, y: 22 },
    { id: 'o-if-water', type: 'watercooler', x: 24, y: 22 },
    { id: 'o-if-tv', type: 'walltv', x: 23, y: 28, props: { w: 2 } },
    { id: 'o-if-plant', type: 'iplant', x: 25, y: 32 },

    // ════════ BMT 전실 (ante, y35-48) ════════
    { id: 'bl-an', type: 'baylabel', x: 1, y: 35, props: { text: 'BMT 전실 · ANTEROOM', highlight: true } },
    { id: 'o-an-ppe', type: 'ppestation', x: 1, y: 37 },
    { id: 'o-an-sink', type: 'sinkor', x: 2, y: 41 },
    { id: 'o-an-san', type: 'handsanitizer', x: 6, y: 40 },
    { id: 'o-an-bin', type: 'chemohazardbin', x: 5, y: 44 },

    // ════════ BMT 무균 이식실 (bmt, y35-48) ════════
    { id: 'bl-bm', type: 'baylabel', x: 9, y: 35, props: { text: 'BMT ISOLATION' } },
    { id: 'o-bm-hepa', type: 'bmtpod', x: 9, y: 36, props: { w: 18 } },
    { id: 'o-bm-bed1', type: 'ibed', x: 10, y: 40, props: { variant: 'ward', occupied: true, label: 'BMT 1' } },
    { id: 'o-bm-mon1', type: 'imonitor', x: 9, y: 40, props: { beep: true } },
    { id: 'o-bm-pump1', type: 'smartinfusionpump', x: 14, y: 40, props: { w: 1, h: 1 } },
    { id: 'o-bm-bed2', type: 'ibed', x: 20, y: 40, props: { variant: 'ward', occupied: true, label: 'BMT 2' } },
    { id: 'o-bm-mon2', type: 'imonitor', x: 26, y: 40 },
    { id: 'o-bm-pump2', type: 'smartinfusionpump', x: 24, y: 40, props: { w: 1, h: 1 } },
    { id: 'o-bm-tv', type: 'walltv', x: 20, y: 48, props: { w: 2 } },
  ],
  hotspots: [
    { id: 'hs-verify', kind: 'quest', x: 3, y: 3, label: '항암제 이중 확인', scenarioId: 'SCN-ONCO-00001' },
    { id: 'hs-family', kind: 'quest', x: 19, y: 5, label: '가족 면담', scenarioId: 'SCN-ONCO-00002' },
    { id: 'hs-schedule', kind: 'quest', x: 11, y: 14, label: '주입 스케줄', scenarioId: 'SCN-ONCO-00003' },
    { id: 'hs-infusion', kind: 'quest', x: 8, y: 22, label: '주입 속도·부작용 관찰', scenarioId: 'SCN-ONCO-00004' },
    { id: 'hs-ante', kind: 'quest', x: 2, y: 41, label: '양압 손위생·방호', scenarioId: 'SCN-ONCO-00005' },
    { id: 'hs-engraft', kind: 'quest', x: 10, y: 40, label: '이식·생착 모니터', scenarioId: 'SCN-ONCO-00006' },
  ],
  npcs: [
    // verify
    { id: 'on-vf-d', kind: 'doctor', mode: 'idle', seed: 981, start: { x: 4, y: 7 }, marker: 'quest', markerLabel: '오심·구토 관리', scenarioId: 'SCN-ONCO-00007' },
    { id: 'on-vf-n', kind: 'nurse', mode: 'idle', seed: 982, start: { x: 7, y: 7 }, marker: 'quest', markerLabel: '암성 통증 관리', scenarioId: 'SCN-ONCO-00008' },
    // quiet
    { id: 'on-qt-d', kind: 'doctor', mode: 'idle', seed: 983, start: { x: 18, y: 7 }, marker: 'quest', markerLabel: '임상시험 설명', scenarioId: 'SCN-ONCO-00009' },
    { id: 'on-qt-p', kind: 'parent', mode: 'idle', seed: 984, start: { x: 21, y: 7 }, marker: 'quest', markerLabel: '항암 영양 상담', scenarioId: 'SCN-ONCO-00010' },
    // station
    { id: 'on-st-n1', kind: 'nurse', mode: 'idle', seed: 985, start: { x: 11, y: 15 }, marker: 'quest', markerLabel: '항암 말초신경병증 관리', scenarioId: 'SCN-ONCO-00011' },
    { id: 'on-st-n2', kind: 'nurse', mode: 'idle', seed: 986, start: { x: 15, y: 15 }, marker: 'quest', markerLabel: '암 생존자 관리 안내', scenarioId: 'SCN-ONCO-00012' },
    // infusion
    { id: 'on-if-n', kind: 'nurse', mode: 'idle', seed: 987, start: { x: 12, y: 30 } },
    { id: 'on-if-p', kind: 'parent', mode: 'idle', seed: 988, start: { x: 20, y: 30 } },
    // ante
    { id: 'on-an-n', kind: 'nurse', mode: 'idle', seed: 989, start: { x: 4, y: 47 } },
    // bmt
    { id: 'on-bm-n', kind: 'nurse', mode: 'idle', seed: 990, start: { x: 12, y: 44 } },
    { id: 'on-bm-p', kind: 'parent', mode: 'idle', seed: 991, start: { x: 23, y: 45 } },
  ],
};
