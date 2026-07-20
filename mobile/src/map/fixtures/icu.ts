// ICU — Intensive Care Unit. A 1:1 port of the handoff master blueprint
// (design-handoff_v10/reference/interior-icu.jsx): 34×44 tiles — four private
// GLASS-walled patient rooms (VENT / CRRT / EVD / TTM) across the top, a wide
// central telemetry/control hub, and a support row (visitor waiting / dirty
// utility / med-equipment). Rooms are entered from the hub via per-room auto
// doors in the y17 glass boundary. Markers live on the bed/NPC (props.marker).
import type { Interior } from '@engine';

export const ICU_INTERIOR: Interior = {
  id: 'INT-ICU-00001',
  deptId: 'DEPT-ICU-00001',
  cols: 34,
  rows: 44,
  floorTheme: 'ICU',
  // 34-wide floor; <1 zoom so the hub + a room fit the viewport.
  scale: 0.85,
  // hub open floor just in front of the charting desks (16,23 is on a desk)
  playerStart: { x: 16, y: 26 },
  regions: [
    { id: 'r1', name: 'Room 1 · 인공호흡 (A)', icon: '🫁', bounds: { x: 0, y: 0, w: 9, h: 18 } },
    { id: 'r2', name: 'Room 2 · CRRT 투석 (A)', icon: '🩸', bounds: { x: 8, y: 0, w: 9, h: 18 } },
    { id: 'r3', name: 'Room 3 · 뇌압/EVD (B)', icon: '🧠', bounds: { x: 16, y: 0, w: 9, h: 18 } },
    { id: 'r4', name: 'Room 4 · TTM 저체온 (B)', icon: '❄', bounds: { x: 24, y: 0, w: 10, h: 18 } },
    { id: 'station', name: '중앙 제어 허브', icon: '🖥', bounds: { x: 0, y: 17, w: 34, h: 14 } },
    { id: 'family', name: '면회 대기실', icon: '💔', bounds: { x: 0, y: 30, w: 14, h: 14 } },
    { id: 'dirty', name: 'Dirty Utility · 오염', icon: '☣', bounds: { x: 13, y: 30, w: 11, h: 14 } },
    { id: 'equip', name: 'Med · 장비 보관실', icon: '💊', bounds: { x: 23, y: 30, w: 11, h: 14 } },
  ],
  rooms: [
    { id: 'r1', name: 'Room 1 · VENT', sub: '인공호흡·다약물', icon: '🫁', color: '#FCA5A5', x: 3, y: 7 },
    { id: 'r2', name: 'Room 2 · CRRT', sub: '지속적 신대체', icon: '🩸', color: '#FECACA', x: 11, y: 7 },
    { id: 'r3', name: 'Room 3 · EVD', sub: '뇌압 모니터링', icon: '🧠', color: '#DDD6FE', x: 19, y: 7 },
    { id: 'r4', name: 'Room 4 · TTM', sub: '목표 체온 유지', icon: '❄', color: '#BAE6FD', x: 27, y: 7 },
    { id: 'station', name: '중앙 제어 허브', sub: '4-방 텔레메트리', icon: '🖥', color: '#A7F3D0', x: 16, y: 23 },
    { id: 'family', name: '면회 대기실', sub: '인터폰·통제', icon: '💔', color: '#FBCFE8', x: 5, y: 36 },
    { id: 'dirty', name: 'Dirty Utility', sub: '오염 처리', icon: '☣', color: '#FDE68A', x: 18, y: 36 },
    { id: 'equip', name: 'Med · 장비', sub: 'Pyxis·Vent', icon: '💊', color: '#DDD6FE', x: 28, y: 36 },
  ],
  collision: [
    // perimeter (bottom campus door x6-8 is a gap)
    { x: 0, y: 0, w: 34, h: 1 }, { x: 0, y: 1, w: 1, h: 42 }, { x: 33, y: 1, w: 1, h: 42 },
    { x: 0, y: 43, w: 6, h: 1 }, { x: 9, y: 43, w: 24, h: 1 },
    // divider y30 (hub / support) — thresholds x5-7 / x13-15 / x22-24
    { x: 1, y: 30, w: 4, h: 1 }, { x: 8, y: 30, w: 5, h: 1 }, { x: 16, y: 30, w: 6, h: 1 }, { x: 25, y: 30, w: 8, h: 1 },
    // support vertical dividers x13 / x23 (gap y35-37)
    { x: 13, y: 31, w: 1, h: 4 }, { x: 13, y: 38, w: 1, h: 5 },
    { x: 23, y: 31, w: 1, h: 4 }, { x: 23, y: 38, w: 1, h: 5 },
    // NOTE: the 4 glass patient-room walls (vertical x8/x16/x24 + y17 boundary)
    // block via objectCollision on the `glass` objects below (see-through walls).
  ],
  objects: [
    // dimmer ICU ambience over the patient rooms
    { id: 't-rooms', type: 'tint', x: 1, y: 1, props: { w: 32, h: 16, color: '#26354D', op: 0.16 } },
    // ── glass room walls + per-room auto doors ──
    { id: 'g-v1', type: 'glass', x: 8, y: 1, props: { w: 1, h: 16 } },
    { id: 'g-v2', type: 'glass', x: 16, y: 1, props: { w: 1, h: 16 } },
    { id: 'g-v3', type: 'glass', x: 24, y: 1, props: { w: 1, h: 16 } },
    { id: 'g-h1a', type: 'glass', x: 1, y: 17, props: { w: 3, h: 1 } }, { id: 'd-r1', type: 'door', x: 4, y: 17, props: { w: 1, kind: 'auto' } }, { id: 'g-h1b', type: 'glass', x: 5, y: 17, props: { w: 3, h: 1 } },
    { id: 'g-h2a', type: 'glass', x: 9, y: 17, props: { w: 3, h: 1 } }, { id: 'd-r2', type: 'door', x: 12, y: 17, props: { w: 1, kind: 'auto' } }, { id: 'g-h2b', type: 'glass', x: 13, y: 17, props: { w: 3, h: 1 } },
    { id: 'g-h3a', type: 'glass', x: 17, y: 17, props: { w: 3, h: 1 } }, { id: 'd-r3', type: 'door', x: 20, y: 17, props: { w: 1, kind: 'auto' } }, { id: 'g-h3b', type: 'glass', x: 21, y: 17, props: { w: 3, h: 1 } },
    { id: 'g-h4a', type: 'glass', x: 25, y: 17, props: { w: 3, h: 1 } }, { id: 'd-r4', type: 'door', x: 28, y: 17, props: { w: 1, kind: 'auto' } }, { id: 'g-h4b', type: 'glass', x: 29, y: 17, props: { w: 4, h: 1 } },
    // bottom campus door + support thresholds
    { id: 'd-campus', type: 'door', x: 6, y: 43, props: { w: 3, kind: 'auto', label: '↓ 캠퍼스로' } },
    { id: 'th-fam', type: 'threshold', x: 5, y: 30, props: { w: 3, h: 1, label: '→ 면회' } },
    { id: 'th-dirty', type: 'threshold', x: 13, y: 30, props: { w: 3, h: 1, label: '→ 오염' } },
    { id: 'th-med', type: 'threshold', x: 22, y: 30, props: { w: 3, h: 1, label: '→ MED' } },
    { id: 'th-x13', type: 'threshold', x: 13, y: 35, props: { w: 1, h: 3 } },
    { id: 'th-x23', type: 'threshold', x: 23, y: 35, props: { w: 1, h: 3 } },

    // ════════ ROOM 1 · 인공호흡 ════════
    { id: 'bl-r1', type: 'baylabel', x: 1, y: 1, props: { text: 'ROOM 1 · 인공호흡', highlight: true } },
    { id: 'o-r1-bed', type: 'ibed', x: 2, y: 3, props: { variant: 'ward', occupied: true, marker: 'quest', markerLabel: 'ICU 섬망 대응', scenarioId: 'SCN-ICU-00009' } },
    { id: 'o-r1-vent', type: 'ventilator', x: 1, y: 8 },
    { id: 'o-r1-tower', type: 'ivpumptower', x: 5, y: 6 },
    { id: 'o-r1-mon', type: 'imonitor', x: 4, y: 2, props: { beep: true } },
    { id: 'o-r1-iv', type: 'iiv', x: 6, y: 3 },
    { id: 'o-r1-foley', type: 'foleybag', x: 2, y: 11 },
    // ════════ ROOM 2 · CRRT ════════
    { id: 'bl-r2', type: 'baylabel', x: 9, y: 1, props: { text: 'ROOM 2 · CRRT' } },
    { id: 'o-r2-bed', type: 'ibed', x: 10, y: 3, props: { variant: 'ward', occupied: true, marker: 'quest', markerLabel: '욕창 예방 체위변경', scenarioId: 'SCN-ICU-00010' } },
    { id: 'o-r2-mon', type: 'imonitor', x: 12, y: 2, props: { beep: true } },
    { id: 'o-r2-iv', type: 'iiv', x: 12, y: 4 },
    { id: 'o-r2-crrt', type: 'crrt', x: 13, y: 7 },
    // ════════ ROOM 3 · 뇌압/EVD ════════
    { id: 'bl-r3', type: 'baylabel', x: 17, y: 1, props: { text: 'ROOM 3 · 뇌압/EVD' } },
    { id: 'o-r3-bed', type: 'ibed', x: 18, y: 3, props: { variant: 'ward', occupied: true, marker: 'quest', markerLabel: '중심정맥관 삽입 보조', scenarioId: 'SCN-ICU-00011' } },
    { id: 'o-r3-mon', type: 'imonitor', x: 20, y: 2, props: { beep: true } },
    { id: 'o-r3-evd', type: 'evdstand', x: 21, y: 6 },
    { id: 'o-r3-icp', type: 'icpmonitor', x: 22, y: 10 },
    // ════════ ROOM 4 · TTM ════════
    { id: 'bl-r4', type: 'baylabel', x: 25, y: 1, props: { text: 'ROOM 4 · TTM' } },
    { id: 'o-r4-bed', type: 'ibed', x: 26, y: 3, props: { variant: 'ward', occupied: true, marker: 'quest', markerLabel: '코드블루 대응', scenarioId: 'SCN-ICU-00012' } },
    { id: 'o-r4-mon', type: 'imonitor', x: 28, y: 2, props: { beep: true } },
    { id: 'o-r4-ttm', type: 'ttmunit', x: 29, y: 7 },

    // ════════ CENTRAL ICU STATION ════════
    { id: 'bl-hub', type: 'baylabel', x: 12, y: 18, props: { text: 'CENTRAL ICU STATION' } },
    { id: 'o-hub-bank', type: 'bankofmonitors', x: 11, y: 18 },
    { id: 'o-hub-ppe', type: 'icabinet', x: 1, y: 19, props: { w: 4, h: 1, variant: 'linen', label: 'PPE' } },
    { id: 'o-hub-cab', type: 'icabinet', x: 29, y: 19, props: { w: 4, h: 1, variant: 'equipment' } },
    { id: 'o-hub-desk1', type: 'nursedeski', x: 6, y: 23, props: { w: 6, h: 2, label: 'ORDER PC' } },
    { id: 'o-hub-desk2', type: 'nursedeski', x: 15, y: 23, props: { w: 6, h: 2 } },
    { id: 'o-hub-ph1', type: 'phone', x: 9, y: 22 },
    { id: 'o-hub-ph2', type: 'phone', x: 18, y: 22 },
    { id: 'bl-code', type: 'baylabel', x: 23, y: 20, props: { text: 'CODE BLUE' } },
    { id: 'o-hub-crash', type: 'crashcart', x: 24, y: 22, props: { marker: 'urgent', markerLabel: 'CODE BLUE', scenarioId: 'SCN-ICU-00003' } },

    // ════════ 면회 대기실 (family) ════════
    { id: 'bl-fam', type: 'baylabel', x: 1, y: 31, props: { text: '면회 대기실 · VISITOR' } },
    { id: 'o-fam-screen', type: 'visitorscreen', x: 9, y: 31, props: { w: 2 } },
    { id: 'o-fam-gown', type: 'gownbox', x: 1, y: 32 },
    { id: 'o-fam-intercom', type: 'intercom', x: 3, y: 39 },
    { id: 'o-fam-san', type: 'sanitizer', x: 11, y: 32 },
    { id: 'o-fam-sofa', type: 'sofa', x: 2, y: 35, props: { w: 3, h: 1, color: '#9CB4C8' } },
    { id: 'o-fam-table', type: 'coffeetable', x: 3, y: 37, props: { w: 2 } },
    { id: 'o-fam-wcool', type: 'watercooler', x: 11, y: 35 },
    { id: 'o-fam-plant', type: 'iplant', x: 12, y: 41 },

    // ════════ DIRTY UTILITY ════════
    { id: 'bl-dirty', type: 'baylabel', x: 14, y: 31, props: { text: 'DIRTY UTILITY · 오염' } },
    { id: 'o-dt-sink', type: 'sinkor', x: 14, y: 34, props: { marker: 'info', markerLabel: '오염 처리 · C-line' } },
    { id: 'o-dt-wb1', type: 'wastebin', x: 18, y: 33, props: { tone: 'infectious' } },
    { id: 'o-dt-wb2', type: 'wastebin', x: 21, y: 33, props: { tone: 'infectious' } },
    { id: 'o-dt-soiled', type: 'soiledcart', x: 18, y: 37 },
    { id: 'o-dt-cab', type: 'icabinet', x: 20, y: 40, props: { w: 3, h: 1, variant: 'supply' } },

    // ════════ MED · 장비 보관실 ════════
    { id: 'bl-med', type: 'baylabel', x: 24, y: 31, props: { text: 'MED · 장비 보관실' } },
    { id: 'o-med-pyxis', type: 'pyxis', x: 24, y: 33 },
    { id: 'o-med-drug', type: 'icabinet', x: 27, y: 33, props: { w: 3, h: 1, variant: 'drug', label: 'DRUGS' } },
    { id: 'o-med-vent', type: 'icabinet', x: 24, y: 37, props: { w: 4, h: 1, variant: 'equipment', label: 'VENT' } },
    { id: 'o-med-sup', type: 'icabinet', x: 28, y: 37, props: { w: 4, h: 1, variant: 'supply' } },
    { id: 'o-med-crash', type: 'crashcart', x: 31, y: 40 },
    { id: 'o-med-plant', type: 'iplant', x: 31, y: 36 },
  ],
  hotspots: [],
  npcs: [
    // room nurses (markers = the room task)
    { id: 'icu-r1-n', kind: 'nurse', mode: 'idle', seed: 201, start: { x: 4, y: 11 }, marker: 'quest', markerLabel: '승압제 적정', scenarioId: 'SCN-ICU-00001' },
    { id: 'icu-r2-n', kind: 'nurse', mode: 'idle', seed: 202, start: { x: 10, y: 11 }, marker: 'quest', markerLabel: '임종 임박 소통', scenarioId: 'SCN-ICU-00013' },
    { id: 'icu-r3-n', kind: 'nurse', mode: 'idle', seed: 203, start: { x: 18, y: 11 }, marker: 'quest', markerLabel: '동공·GCS 사정', scenarioId: 'SCN-ICU-00004' },
    { id: 'icu-r4-n', kind: 'nurse', mode: 'idle', seed: 204, start: { x: 26, y: 11 }, marker: 'quest', markerLabel: '인공호흡기 이탈', scenarioId: 'SCN-ICU-00014' },
    // central hub team
    { id: 'icu-hub-n1', kind: 'nurse', mode: 'idle', seed: 205, start: { x: 8, y: 25 }, marker: 'quest', markerLabel: 'SBAR / ABGA', scenarioId: 'SCN-ICU-00005' },
    { id: 'icu-hub-d1', kind: 'doctor', mode: 'idle', seed: 206, start: { x: 13, y: 25 }, marker: 'quest', markerLabel: '인공호흡기 환자 소통', scenarioId: 'SCN-ICU-00006' },
    { id: 'icu-hub-d2', kind: 'doctor', mode: 'idle', seed: 207, start: { x: 18, y: 25 }, marker: 'info', markerLabel: 'RT · VENT 설정' },
    { id: 'icu-hub-n2', kind: 'nurse', mode: 'idle', seed: 208, start: { x: 22, y: 25 }, marker: 'quest', markerLabel: '진정 관리 설명', scenarioId: 'SCN-ICU-00007' },
    // family
    { id: 'icu-fam-v1', kind: 'visitor', mode: 'idle', seed: 209, start: { x: 6, y: 37 }, marker: 'info', markerLabel: '면회 대기', scenarioId: 'SCN-ICU-00002' },
    { id: 'icu-fam-v2', kind: 'visitor', mode: 'idle', seed: 210, start: { x: 9, y: 40 }, marker: 'quest', markerLabel: '패혈증 상태 설명', scenarioId: 'SCN-ICU-00008' },
    // med
    { id: 'icu-med-n', kind: 'nurse', mode: 'idle', seed: 211, start: { x: 26, y: 40 }, marker: 'quest', markerLabel: '투약 준비' },
  ],
};
