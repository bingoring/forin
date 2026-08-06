// PEDS — Pediatrics & Neonatal Center. 1:1 port of the v13 handoff master
// blueprint (design-handoff_v13/reference/interior-peds.jsx): 34×48 tiles.
// Public/friendly up front (외래·놀이·계측·접수) → clinical mid (소아 진료실 +
// 4-bed 병동) → innermost NICU (유리벽 전실 + 3분 스크럽 sterile threshold +
// 인큐베이터 존, 저조도 tint). v13 2.5D objects carry ground-contact shadows.
// Markers live on the nearest object (props.marker); scenarioIds are deferred
// (peds scenario content pending) so only labels are wired for now.
import type { Interior } from '@engine';

export const PEDS_INTERIOR: Interior = {
  id: 'INT-PEDS-00001',
  deptId: 'DEPT-PEDS-00001',
  cols: 34,
  rows: 47,
  floorTheme: 'peds',
  // 34-wide floor; <1 zoom so a room fits the viewport (matches ER/OR/ICU).
  scale: 0.85,
  playerStart: { x: 18, y: 20 },
  regions: [
    { id: 'welcome', name: '외래 · 대기 · 놀이', icon: '🌈', bounds: { x: 0, y: 0, w: 34, h: 15 } },
    { id: 'exam', name: '소아 진료실', icon: '🩺', bounds: { x: 0, y: 14, w: 12, h: 16 } },
    { id: 'ward', name: '소아 병동', icon: '🛏', bounds: { x: 11, y: 14, w: 23, h: 16 } },
    { id: 'ante', name: 'NICU 전실 · 세척', icon: '🧼', bounds: { x: 0, y: 29, w: 10, h: 17 } },
    { id: 'nicu', name: 'NICU 인큐베이터 존', icon: '👶', bounds: { x: 9, y: 29, w: 25, h: 17 } },
  ],
  rooms: [
    { id: 'welcome', name: '외래 대기·놀이', sub: '접수·계측·놀이방', icon: '🌈', color: '#FBCFE8', x: 16, y: 6 },
    { id: 'exam', name: '소아 진료실', sub: '성장·문진', icon: '🩺', color: '#BAE6FD', x: 5, y: 22 },
    { id: 'ward', name: '소아 병동', sub: '크립·투약', icon: '🛏', color: '#FED7AA', x: 22, y: 24 },
    { id: 'ante', name: 'NICU 전실', sub: '3분 스크럽', icon: '🧼', color: '#A7F3D0', x: 4, y: 38 },
    { id: 'nicu', name: 'NICU', sub: '인큐베이터 3', icon: '👶', color: '#C7D2FE', x: 20, y: 38 },
  ],
  collision: [
    // outer walls (top campus door x15-17 is a gap)
    { x: 0, y: 0, w: 15, h: 1 }, { x: 18, y: 0, w: 16, h: 1 },
    { x: 0, y: 1, w: 1, h: 45 }, { x: 33, y: 1, w: 1, h: 45 }, { x: 0, y: 46, w: 34, h: 1 },
    // divider y14 (welcome / exam+ward) — thresholds x5-7 (→진료실) / x16-18 (→병동)
    { x: 1, y: 14, w: 4, h: 1 }, { x: 8, y: 14, w: 8, h: 1 }, { x: 19, y: 14, w: 14, h: 1 },
    // exam | ward divider x11 (gap y20-22)
    { x: 11, y: 15, w: 1, h: 5 }, { x: 11, y: 23, w: 1, h: 6 },
    // divider y29 (mid / NICU) — threshold x5-7 (→NICU 전실)
    { x: 1, y: 29, w: 4, h: 1 }, { x: 8, y: 29, w: 25, h: 1 },
    // NOTE: NICU anteroom|zone wall (x9) blocks via glass objectCollision below.
  ],
  objects: [
    // NICU low-light tint (non-blocking)
    { id: 't-nicu', type: 'tint', x: 1, y: 30, props: { w: 32, h: 16, color: '#1E2A40', op: 0.15 } },
    // welcome play mat (opaque salmon floor mat + dashed border, per handoff)
    { id: 'o-play-mat', type: 'playmat', x: 20, y: 3, props: { w: 12, h: 8 } },
    // exterior campus auto door
    { id: 'd-campus', type: 'door', x: 15, y: 0, props: { w: 3, kind: 'auto', label: '↓ 커리어로' } },
    // internal thresholds
    { id: 'th-exam', type: 'threshold', x: 5, y: 14, props: { w: 3, h: 1, label: '→ 진료실' } },
    { id: 'th-ward', type: 'threshold', x: 16, y: 14, props: { w: 3, h: 1, label: '→ 병동' } },
    { id: 'th-ew', type: 'threshold', x: 11, y: 20, props: { w: 1, h: 3 } },
    { id: 'th-ante', type: 'threshold', x: 5, y: 29, props: { w: 3, h: 1, label: '→ NICU 전실' } },
    // NICU glass wall (x9) + sterile scrub threshold
    { id: 'g-nicu1', type: 'glass', x: 9, y: 30, props: { w: 1, h: 4 } },
    { id: 'th-scrub', type: 'threshold', x: 9, y: 34, props: { w: 1, h: 3, tone: 'sterile', label: '스크럽 후 입장' } },
    { id: 'g-nicu2', type: 'glass', x: 9, y: 37, props: { w: 1, h: 9 } },

    // ════════ WELCOME · 외래 (y1-13) ════════
    { id: 'bl-welcome', type: 'baylabel', x: 1, y: 1, props: { text: '환영 · 외래 · 4F' } },
    { id: 'o-w-recep', type: 'clinicReception', x: 13, y: 3, props: { w: 6, h: 2, tone: '#DB2777', label: '접수' } },
    { id: 'bl-measure', type: 'baylabel', x: 1, y: 2, props: { text: '계측' } },
    { id: 'o-w-babyscale', type: 'babyscale', x: 2, y: 4 },
    { id: 'o-w-stadiometer', type: 'stadiometer', x: 5, y: 4, props: { marker: 'info', markerLabel: '성장 계측' } },
    { id: 'o-w-bp', type: 'bpcuff', x: 1, y: 6 },
    { id: 'bl-play', type: 'baylabel', x: 26, y: 1, props: { text: 'PLAY', highlight: true } },
    { id: 'o-w-slide', type: 'smallslide', x: 29, y: 3 },
    { id: 'o-w-blocks', type: 'blocks', x: 24, y: 5 },
    { id: 'o-w-horse', type: 'rockinghorse', x: 21, y: 6, props: { marker: 'info', markerLabel: '놀이방' } },
    { id: 'o-w-chest', type: 'toychest', x: 30, y: 6 },
    { id: 'o-w-mural', type: 'mural', x: 20, y: 1, props: { w: 4 } },
    { id: 'o-w-bal1', type: 'balloon', x: 22, y: 2, props: { color: '#EF4444' } },
    { id: 'o-w-bal2', type: 'balloon', x: 23, y: 1.5, props: { color: '#3B82F6' } },
    { id: 'o-w-bal3', type: 'balloon', x: 24, y: 2.5, props: { color: '#10B981' } },
    { id: 'o-w-ch0', type: 'ichair', x: 2, y: 11, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-w-ch1', type: 'ichair', x: 4, y: 11, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-w-ch2', type: 'ichair', x: 6, y: 11, props: { color: '#FEF08A', facing: 'up' } },
    { id: 'o-w-ch3', type: 'ichair', x: 8, y: 11, props: { color: '#BBF7D0', facing: 'up' } },
    { id: 'o-w-plant1', type: 'iplant', x: 1, y: 12 },
    { id: 'o-w-plant2', type: 'iplant', x: 31, y: 11 },

    // ════════ 소아 진료실 (exam, y15-28) ════════
    { id: 'bl-exam', type: 'baylabel', x: 1, y: 15, props: { text: 'EXAM · 소아 진료실' } },
    { id: 'o-e-bed', type: 'ibed', x: 2, y: 17, props: { variant: 'ward', marker: 'quest', markerLabel: '성장 문진' } },
    { id: 'o-e-mon1', type: 'imonitor', x: 1, y: 17 },
    { id: 'o-e-recep', type: 'ireception', x: 6, y: 18, props: { w: 3, h: 1, label: '진료' } },
    { id: 'o-e-mon2', type: 'imonitor', x: 9, y: 17 },
    { id: 'o-e-tongue', type: 'tonguejar', x: 6, y: 16 },
    { id: 'o-e-sticker', type: 'stickerroll', x: 8, y: 16 },
    { id: 'o-e-chair', type: 'ichair', x: 9, y: 24, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-e-plant', type: 'iplant', x: 10, y: 27 },

    // ════════ 소아 병동 (ward, y15-28) ════════
    { id: 'bl-ward', type: 'baylabel', x: 12, y: 15, props: { text: 'PEDIATRIC WARD' } },
    { id: 'o-wd-desk', type: 'nursedeski', x: 12, y: 16, props: { w: 6, h: 2, label: 'PEDS STATION', marker: 'quest', markerLabel: '투약 소분' } },
    { id: 'o-wd-dosing', type: 'dosingchart', x: 19, y: 15, props: { w: 2 } },
    { id: 'o-wd-sticker', type: 'stickerroll', x: 22, y: 16 },
    { id: 'o-wd-crib1', type: 'metalcrib', x: 13, y: 23, props: { occupied: true, stuffie: '🐻' } },
    { id: 'o-wd-crib2', type: 'metalcrib', x: 17, y: 23, props: { occupied: true, stuffie: '🦊' } },
    { id: 'o-wd-bed1', type: 'ibed', x: 24, y: 23, props: { variant: 'ward', occupied: true, marker: 'info', markerLabel: '회진 · 촉진' } },
    { id: 'o-wd-bed2', type: 'ibed', x: 28, y: 23, props: { variant: 'peds', occupied: true } },
    { id: 'o-wd-ivboard', type: 'ivboard', x: 13, y: 24 },
    { id: 'o-wd-iv1', type: 'ivpump', x: 16, y: 23 },
    { id: 'o-wd-iv2', type: 'ivpump', x: 20, y: 23 },
    { id: 'o-wd-iv3', type: 'ivpump', x: 27, y: 23 },
    { id: 'o-wd-mon', type: 'imonitor', x: 12, y: 23, props: { beep: true } },
    { id: 'o-wd-plant', type: 'iplant', x: 32, y: 27 },

    // ════════ NICU 전실 (ante, y30-46) ════════
    { id: 'bl-ante', type: 'baylabel', x: 1, y: 30, props: { text: 'NICU 전실 · SCRUB' } },
    { id: 'o-a-sink', type: 'sinkor', x: 2, y: 33 },
    { id: 'o-a-scrub', type: 'scrubdispenser', x: 6, y: 33 },
    { id: 'o-a-gown', type: 'gownbox', x: 1, y: 37 },
    { id: 'o-a-san', type: 'sanitizer', x: 7, y: 36, props: { marker: 'info', markerLabel: '손 위생 3분' } },
    { id: 'bl-ante2', type: 'baylabel', x: 1, y: 41, props: { text: '3분 스크럽 후 입장', highlight: true } },

    // ════════ NICU 인큐베이터 존 (nicu, y30-46) ════════
    { id: 'bl-nicu', type: 'baylabel', x: 10, y: 30, props: { text: 'NICU · INCUBATOR ZONE' } },
    { id: 'o-n-photo1', type: 'phototherapy', x: 11, y: 32, props: { w: 2 } },
    { id: 'o-n-photo2', type: 'phototherapy', x: 18, y: 32, props: { w: 2 } },
    { id: 'o-n-photo3', type: 'phototherapy', x: 25, y: 32, props: { w: 2 } },
    { id: 'o-n-inc1', type: 'incubator', x: 11, y: 35, props: { occupied: true, marker: 'quest', markerLabel: '위관영양' } },
    { id: 'o-n-inc2', type: 'incubator', x: 18, y: 35, props: { occupied: true } },
    { id: 'o-n-inc3', type: 'incubator', x: 25, y: 35, props: { occupied: true, marker: 'info', markerLabel: '바이탈 차팅' } },
    { id: 'o-n-mon1', type: 'imonitor', x: 10, y: 35, props: { beep: true } },
    { id: 'o-n-mon2', type: 'imonitor', x: 17, y: 35, props: { beep: true } },
    { id: 'o-n-mon3', type: 'imonitor', x: 24, y: 35, props: { beep: true } },
    { id: 'o-n-milk', type: 'milkfridge', x: 30, y: 34 },
  ],
  hotspots: [],
  npcs: [
    // welcome
    { id: 'pd-w-n1', kind: 'nurse', mode: 'idle', seed: 301, start: { x: 14, y: 6 }, marker: 'quest', markerLabel: '소아 탈수 사정', scenarioId: 'SCN-PEDS-00006' },
    { id: 'pd-w-n2', kind: 'nurse', mode: 'idle', seed: 302, start: { x: 16, y: 6 }, marker: 'quest', markerLabel: '열성경련 대응', scenarioId: 'SCN-PEDS-00007' },
    { id: 'pd-w-n3', kind: 'nurse', mode: 'idle', seed: 303, start: { x: 3, y: 8 }, marker: 'quest', markerLabel: '크룹 호흡곤란', scenarioId: 'SCN-PEDS-00008' },
    { id: 'pd-w-c1', kind: 'child', mode: 'idle', seed: 304, start: { x: 25, y: 8 }, marker: 'urgent', markerLabel: '우는 아이', scenarioId: 'SCN-PEDS-00001' },
    { id: 'pd-w-c2', kind: 'child', mode: 'idle', seed: 305, start: { x: 27, y: 8 }, marker: 'quest', markerLabel: '중이염 상담', scenarioId: 'SCN-PEDS-00009' },
    { id: 'pd-w-p1', kind: 'parent', mode: 'idle', seed: 306, start: { x: 29, y: 9 }, marker: 'quest', markerLabel: '예방접종 설명', scenarioId: 'SCN-PEDS-00002' },
    { id: 'pd-w-p2', kind: 'parent', mode: 'idle', seed: 307, start: { x: 3, y: 11 }, marker: 'info', markerLabel: '부모 안심', scenarioId: 'SCN-PEDS-00004' },
    { id: 'pd-w-c3', kind: 'child', mode: 'idle', seed: 308, start: { x: 5, y: 11 }, marker: 'quest', markerLabel: '소아 성장 계측 상담', scenarioId: 'SCN-PEDS-00010' },
    // exam
    { id: 'pd-e-d', kind: 'doctor', mode: 'idle', seed: 309, start: { x: 4, y: 24 }, marker: 'quest', markerLabel: '아동학대 의심 대응', scenarioId: 'SCN-PEDS-00011' },
    { id: 'pd-e-c', kind: 'child', mode: 'idle', seed: 310, start: { x: 6, y: 25 }, marker: 'quest', markerLabel: '발열 아동', scenarioId: 'SCN-PEDS-00003' },
    { id: 'pd-e-p', kind: 'parent', mode: 'idle', seed: 311, start: { x: 7, y: 24 }, marker: 'info', markerLabel: '접종 동의', scenarioId: 'SCN-PEDS-00005' },
    // ward
    { id: 'pd-wd-n1', kind: 'nurse', mode: 'idle', seed: 312, start: { x: 13, y: 20 }, marker: 'quest', markerLabel: '소아 천식 발작', scenarioId: 'SCN-PEDS-00012' },
    { id: 'pd-wd-n2', kind: 'nurse', mode: 'idle', seed: 313, start: { x: 15, y: 20 }, marker: 'quest', markerLabel: '예방접종 이상반응', scenarioId: 'SCN-PEDS-00013' },
    { id: 'pd-wd-n3', kind: 'nurse', mode: 'idle', seed: 314, start: { x: 17, y: 20 }, marker: 'quest', markerLabel: '학령기 소아 통증 사정', scenarioId: 'SCN-PEDS-00014' },
    { id: 'pd-wd-p1', kind: 'parent', mode: 'idle', seed: 315, start: { x: 19, y: 21 } },
    { id: 'pd-wd-d', kind: 'doctor', mode: 'idle', seed: 316, start: { x: 23, y: 25 } },
    { id: 'pd-wd-n4', kind: 'nurse', mode: 'idle', seed: 317, start: { x: 25, y: 26 } },
    { id: 'pd-wd-p2', kind: 'parent', mode: 'idle', seed: 318, start: { x: 22, y: 26 } },
    { id: 'pd-wd-p3', kind: 'parent', mode: 'idle', seed: 319, start: { x: 31, y: 26 } },
    // ante
    { id: 'pd-a-n', kind: 'nurse', mode: 'idle', seed: 320, start: { x: 4, y: 43 } },
    // nicu
    { id: 'pd-n-n1', kind: 'nurse', mode: 'idle', seed: 321, start: { x: 14, y: 40 } },
    { id: 'pd-n-n2', kind: 'nurse', mode: 'idle', seed: 322, start: { x: 22, y: 41 } },
  ],
};
