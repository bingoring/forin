// PHARMA — Central Pharmacy (중앙 약제부). 1:1 port of the v13 handoff master
// blueprint (design-handoff_v13/reference/interior-pharma.jsx + interior-objects-
// pharma2.jsx): 36×42 tiles. Public pick-up window + pneumatic-tube hub up front
// (y0-11) → main dispensing with LASA/ATC/verify desk + a locked narcotics vault
// alcove (left) → sterile anteroom + cleanroom (항암/TPN, right, glass + air-shower
// threshold). v13 2.5D objects carry ground-contact shadows. Markers are labels
// only (scenarioIds deferred until pharmacy scenario content lands).
import type { Interior } from '@engine';

export const PHARMA_INTERIOR: Interior = {
  id: 'INT-PHARMA-00001',
  deptId: 'DEPT-PHARMA-00001',
  cols: 36,
  rows: 42,
  floorTheme: 'pharma',
  // 36-wide → <1 zoom so a room fits the viewport (matches ER/OR/ICU/Peds).
  scale: 0.8,
  playerStart: { x: 9, y: 9 }, // pick-up window lobby (handoff)
  // ORDER matters: regionAt returns the FIRST region containing the tile, so the
  // small enclosed rooms (vault/ante/cleanroom) must be listed BEFORE the large
  // 조제실 rectangle — else 조제실 shadows the 마약류 보관고 (which sits inside its
  // bounds) and the room-focus mask/ZONE stays stuck on 조제실 in the vault.
  regions: [
    { id: 'window', name: '수령 창구 · 기송관 허브', icon: '💊', bounds: { x: 0, y: 0, w: 36, h: 13 } },
    { id: 'vault', name: '마약류 보관고', icon: '🔒', bounds: { x: 0, y: 28, w: 13, h: 14 } },
    { id: 'ante', name: '무균 전실 (Anteroom)', icon: '🚿', bounds: { x: 20, y: 12, w: 16, h: 9 } },
    { id: 'cleanroom', name: '무균 조제실 (Cleanroom)', icon: '🧪', bounds: { x: 20, y: 19, w: 16, h: 23 } },
    { id: 'dispense', name: '일반 약품 조제실', icon: '⚗', bounds: { x: 0, y: 12, w: 21, h: 30 } },
  ],
  rooms: [
    { id: 'window', name: '수령 창구', sub: '처방·반납', icon: '💊', color: '#A7F3D0', x: 6, y: 9 },
    { id: 'tube', name: '기송관 허브', sub: 'Pneumatic', icon: '📮', color: '#BAE6FD', x: 18, y: 6 },
    { id: 'dispense', name: '조제실', sub: 'ATC · 검수', icon: '⚗', color: '#FBCFE8', x: 6, y: 20 },
    { id: 'vault', name: '마약류 보관고', sub: '이중 잠금', icon: '🔒', color: '#FCA5A5', x: 4, y: 33 },
    { id: 'ante', name: '무균 전실', sub: '방진복·에어샤워', icon: '🚿', color: '#A7F3D0', x: 27, y: 16 },
    { id: 'cleanroom', name: '무균 조제실', sub: '항암·TPN', icon: '🧪', color: '#DDD6FE', x: 27, y: 28 },
  ],
  collision: [
    // outer walls — left has a 간호사 출입 door gap (y4-5); bottom has the 캠퍼스 door (x15-17)
    { x: 0, y: 0, w: 36, h: 1 },
    { x: 0, y: 1, w: 1, h: 3 }, { x: 0, y: 6, w: 1, h: 35 },
    { x: 35, y: 1, w: 1, h: 40 },
    { x: 0, y: 41, w: 15, h: 1 }, { x: 18, y: 41, w: 18, h: 1 },
    // divider y12 (window hub | dispense/ante) — thresholds x6-7(STAFF)/x20-21(무균전실)
    { x: 1, y: 12, w: 5, h: 1 }, { x: 8, y: 12, w: 12, h: 1 }, { x: 22, y: 12, w: 13, h: 1 },
    // dispense | cleanroom vertical wall (x21) — starts at y20 so the 무균 전실
    // (anteroom, y13-18) opens off the hub threshold (x20-21 y12); the handoff
    // ran this wall from y13 which sealed the anteroom (no reachable entrance).
    { x: 21, y: 20, w: 1, h: 21 },
    // vault alcove walls (threshold x5-6 → 보관고) + right wall x12
    { x: 1, y: 28, w: 4, h: 1 }, { x: 7, y: 28, w: 6, h: 1 }, { x: 12, y: 29, w: 1, h: 12 },
    // NOTE: ante|cleanroom partition (y19) blocks via the glass objects below.
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-nurse', type: 'door', x: 0, y: 4, props: { w: 1, h: 2, kind: 'auto', label: '간호사 출입' } },
    { id: 'd-campus', type: 'door', x: 15, y: 41, props: { w: 3, h: 1, kind: 'auto', label: '↑ 캠퍼스로' } },
    { id: 'th-staff', type: 'threshold', x: 6, y: 12, props: { w: 2, h: 1, label: 'STAFF ONLY' } },
    { id: 'th-ante', type: 'threshold', x: 20, y: 12, props: { w: 2, h: 1, tone: 'sterile', label: '무균 전실' } },
    { id: 'th-vault', type: 'threshold', x: 5, y: 28, props: { w: 2, h: 1, tone: 'sterile', label: '마약류 보관고' } },
    // ante | cleanroom glass partition (y19) + air-shower threshold
    { id: 'g-ante1', type: 'glass', x: 22, y: 19, props: { w: 5, h: 1 } },
    { id: 'th-air', type: 'threshold', x: 27, y: 19, props: { w: 2, h: 1, tone: 'sterile', label: '에어샤워' } },
    { id: 'g-ante2', type: 'glass', x: 29, y: 19, props: { w: 6, h: 1 } },

    // ════════ 수령 창구 · 기송관 허브 (y1-11) ════════
    { id: 'bl-window', type: 'baylabel', x: 1, y: 1, props: { text: '약품 수령 창구 · PICK-UP WINDOW' } },
    { id: 'o-w-shelf', type: 'medwallshelf', x: 1, y: 1, props: { w: 11, shelves: 3 } },
    { id: 'o-w-counter', type: 'pharmacounter', x: 1, y: 4, props: { w: 11, h: 1 } },
    { id: 'g-counter', type: 'glass', x: 1, y: 3, props: { w: 11, h: 1 } },
    { id: 'o-w-sign1', type: 'countersign', x: 2, y: 4, props: { text: 'PICK-UP', color: '#10B981' } },
    { id: 'o-w-sign2', type: 'countersign', x: 6, y: 4, props: { text: 'DROP-OFF', color: '#FACC15' } },
    { id: 'o-w-scan', type: 'barcodescanner', x: 9, y: 4 },
    { id: 'o-w-return', type: 'returnbox', x: 11, y: 3, props: { w: 1, h: 1 } },
    { id: 'bl-tube', type: 'baylabel', x: 15, y: 1, props: { text: '기송관 PNEUMATIC TUBE' } },
    { id: 'o-w-tube', type: 'pneumatictube', x: 16, y: 3, props: { w: 2, h: 1 } },
    { id: 'o-w-caprack', type: 'tubecapsulerack', x: 19, y: 7, props: { w: 2, h: 1 } },
    { id: 'o-w-shelf2', type: 'medwallshelf', x: 26, y: 1, props: { w: 8, shelves: 4 } },
    { id: 'o-w-fridge', type: 'fridgepharma', x: 32, y: 5, props: { w: 1, h: 1 } },
    { id: 'o-w-plant', type: 'iplant', x: 33, y: 9 },

    // ════════ 일반 약품 조제실 (dispense, y13-40) ════════
    { id: 'bl-disp', type: 'baylabel', x: 1, y: 13, props: { text: 'MAIN DISPENSING' } },
    { id: 'o-d-atc', type: 'atcmachine', x: 2, y: 16, props: { w: 2, h: 2, marker: 'quest', markerLabel: '약물 조정', scenarioId: 'SCN-PHARMA-00013' } },
    { id: 'o-d-lasa', type: 'lasashelf', x: 8, y: 15, props: { w: 3, h: 1 } },
    { id: 'o-d-cabA', type: 'icabinet', x: 14, y: 14, props: { w: 3, h: 1, variant: 'pharma' } },
    { id: 'o-d-cabB', type: 'icabinet', x: 17, y: 14, props: { w: 3, h: 1, variant: 'pharma' } },
    { id: 'sl-A', type: 'shelflabel', x: 14, y: 14, props: { text: 'A · ANTIBIOTICS' } },
    { id: 'sl-B', type: 'shelflabel', x: 17, y: 14, props: { text: 'B · CARDIAC' } },
    { id: 'o-d-verify', type: 'ireception', x: 13, y: 19, props: { w: 4, h: 1, label: '검수대 · DOUBLE-CHECK', marker: 'quest', markerLabel: '오피오이드 안전 상담', scenarioId: 'SCN-PHARMA-00012' } },
    { id: 'o-d-mon', type: 'imonitor', x: 18, y: 19 },
    { id: 'o-d-cart', type: 'medcart', x: 9, y: 23, props: { w: 2, h: 1 } },
    { id: 'o-d-cabC', type: 'icabinet', x: 14, y: 25, props: { w: 3, h: 1, variant: 'pharma' } },
    { id: 'o-d-cabD', type: 'icabinet', x: 17, y: 25, props: { w: 3, h: 1, variant: 'pharma' } },
    { id: 'sl-C', type: 'shelflabel', x: 14, y: 25, props: { text: 'C · INSULIN' } },
    { id: 'sl-D', type: 'shelflabel', x: 17, y: 25, props: { text: 'D · PRN' } },

    // ════════ 마약류 보관고 (vault, y29-40) ════════
    { id: 'bl-vault', type: 'baylabel', x: 1, y: 29, props: { text: 'NARCOTICS VAULT' } },
    { id: 'o-v-vault', type: 'narcoticsvault', x: 2, y: 32, props: { w: 2, h: 2, marker: 'info', markerLabel: '마약류 관리 대장' } },
    { id: 'o-v-binder', type: 'chartbinder', x: 6, y: 34 },

    // ════════ 무균 전실 (ante, y13-18) ════════
    { id: 'bl-ante', type: 'baylabel', x: 22, y: 13, props: { text: '전실 · ANTEROOM' } },
    { id: 'o-a-sink', type: 'sinkor', x: 22, y: 15 },
    { id: 'o-a-gown', type: 'gownbox', x: 26, y: 14 },
    { id: 'o-a-scrub', type: 'scrubdispenser', x: 29, y: 14 },
    { id: 'o-a-tacky', type: 'tackymat', x: 31, y: 16, props: { w: 2 } },
    { id: 'o-a-san', type: 'sanitizer', x: 34, y: 14, props: { marker: 'info', markerLabel: '방진복 · 에어샤워' } },

    // ════════ 무균 조제실 (cleanroom, y20-40) ════════
    { id: 'bl-clean', type: 'baylabel', x: 22, y: 20, props: { text: 'STERILE CLEANROOM · 항암/TPN' } },
    { id: 'o-c-bsc1', type: 'bsc', x: 23, y: 25, props: { w: 2, h: 2, marker: 'quest', markerLabel: '항암제 믹스 (BSC)' } },
    { id: 'o-c-bsc2', type: 'bsc', x: 23, y: 31, props: { w: 2, h: 2 } },
    { id: 'o-c-gauge', type: 'magnehelicgauge', x: 34, y: 22 },
    { id: 'o-c-spill', type: 'chemospillkit', x: 34, y: 27 },
    { id: 'o-c-centri', type: 'centrifuge', x: 31, y: 33, props: { w: 1, h: 1 } },
    { id: 'o-c-print', type: 'printlabel', x: 28, y: 36, props: { w: 2, h: 1 } },
    { id: 'o-c-phone', type: 'wallphone', x: 34, y: 32, props: { ringing: true, marker: 'urgent', markerLabel: 'STAT 콜' } },
    { id: 'o-c-tape', type: 'floortape', x: 22, y: 39, props: { w: 12, text: '━ STERILE LINE · NO STREET CLOTHES ━' } },
  ],
  hotspots: [
    { id: 'hs-missing', kind: 'quest', x: 4, y: 6, label: '누락 약 확인', scenarioId: 'SCN-PHARMA-00006' },
    { id: 'hs-tube', kind: 'quest', x: 16, y: 5, label: '캡슐 송수신', scenarioId: 'SCN-PHARMA-00007' },
    { id: 'hs-inhaler', kind: 'quest', x: 18, y: 5, label: '흡입기 사용법 교육', scenarioId: 'SCN-PHARMA-00014' },
  ],
  npcs: [
    // pick-up window
    { id: 'ph-w-rx', kind: 'doctor', mode: 'idle', seed: 401, start: { x: 4, y: 3 }, marker: 'quest', markerLabel: '구두 처방', scenarioId: 'SCN-PHARMA-00002' }, // pharmacist behind glass
    { id: 'ph-w-n1', kind: 'nurse', mode: 'idle', seed: 402, start: { x: 5, y: 9 }, marker: 'quest', markerLabel: '고위험 약물 이중확인', scenarioId: 'SCN-PHARMA-00008' },
    { id: 'ph-w-n2', kind: 'nurse', mode: 'idle', seed: 403, start: { x: 8, y: 9 }, marker: 'quest', markerLabel: '퇴원 약물 상담', scenarioId: 'SCN-PHARMA-00009' },
    { id: 'ph-w-n3', kind: 'nurse', mode: 'idle', seed: 404, start: { x: 18, y: 9 }, marker: 'quest', markerLabel: '약물 상호작용 확인', scenarioId: 'SCN-PHARMA-00010' },
    // dispensing
    { id: 'ph-d-p1', kind: 'doctor', mode: 'idle', seed: 405, start: { x: 14, y: 22 }, marker: 'quest', markerLabel: '헤파린 체크', scenarioId: 'SCN-PHARMA-00001' },
    { id: 'ph-d-p2', kind: 'doctor', mode: 'idle', seed: 406, start: { x: 16, y: 22 }, marker: 'quest', markerLabel: '소아 용량', scenarioId: 'SCN-PHARMA-00003' },
    { id: 'ph-d-n', kind: 'nurse', mode: 'idle', seed: 407, start: { x: 10, y: 25 }, marker: 'info', markerLabel: '마약류 픽업', scenarioId: 'SCN-PHARMA-00004' },
    // vault
    { id: 'ph-v-p', kind: 'doctor', mode: 'idle', seed: 408, start: { x: 8, y: 36 }, marker: 'quest', markerLabel: '소아 용량 확인', scenarioId: 'SCN-PHARMA-00011' },
    // cleanroom
    { id: 'ph-c-s', kind: 'surgeon', mode: 'idle', seed: 409, start: { x: 26, y: 28 }, marker: 'urgent', markerLabel: 'IV 혼합', scenarioId: 'SCN-PHARMA-00005' },
  ],
};
