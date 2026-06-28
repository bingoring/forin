// ER — Emergency Medical Center (5g-a, handoff v8). A 40×60 master blueprint:
// a full-width public lobby (ambulance handoff · security screening · 원무과 ·
// KTAS triage · waiting) over a 3-column × 3-band room grid. Internal zone
// borders use `threshold` (leafless openings); only the lobby's exterior doors
// are auto `door`s. Special rooms get a translucent `tint`. Region bounds overlap
// the dividing walls so the player always resolves to a region.
import type { Interior } from '@engine';
import { CAMPUS_INTERIOR } from './campus';
import { INTERNAL, SURGERY, ORTHO, DERM } from '../clinic';

export const ER_INTERIOR: Interior = {
  id: 'INT-ER-00001',
  deptId: 'DEPT-ER-00001',
  cols: 40,
  rows: 60,
  floorTheme: 'sterile',
  playerStart: { x: 20, y: 8 },
  regions: [
    { id: 'lobby', name: '공공 로비', icon: '🚑', bounds: { x: 0, y: 0, w: 40, h: 14 } },
    { id: 'resus', name: '소생실', icon: '🫀', bounds: { x: 0, y: 13, w: 14, h: 16 } },
    { id: 'station', name: '중앙 너스 스테이션', icon: '🩺', bounds: { x: 13, y: 13, w: 13, h: 16 } },
    { id: 'exam1', name: '제1진료실 (내과)', icon: '🩺', bounds: { x: 26, y: 13, w: 14, h: 16 } },
    { id: 'isolation', name: '음압 격리실', icon: '😷', bounds: { x: 0, y: 29, w: 14, h: 15 } },
    { id: 'suture', name: '소처치·봉합실', icon: '🩹', bounds: { x: 13, y: 29, w: 13, h: 15 } },
    { id: 'exam2', name: '제2진료실 (외상)', icon: '🦴', bounds: { x: 26, y: 29, w: 14, h: 15 } },
    { id: 'psych', name: '정신과 안전 격리실', icon: '🧠', bounds: { x: 0, y: 44, w: 14, h: 16 } },
    { id: 'family', name: '가족 상담·임종실', icon: '🕊', bounds: { x: 13, y: 44, w: 13, h: 16 } },
    { id: 'decon', name: '제염실', icon: '🚿', bounds: { x: 26, y: 44, w: 14, h: 16 } },
  ],
  rooms: [
    { id: 'lobby', name: '공공 로비', sub: '접수·대기', icon: '🚑', color: '#BAE6FD', x: 20, y: 8 },
    { id: 'resus', name: '소생실', sub: '심정지·중증', icon: '🫀', color: '#FCA5A5', x: 6, y: 21 },
    { id: 'station', name: '너스 스테이션', sub: 'Pyxis·인계', icon: '🩺', color: '#A7F3D0', x: 19, y: 16 },
    { id: 'exam1', name: '제1진료실', sub: '내과', icon: '🩺', color: '#BAE6FD', x: 32, y: 21 },
    { id: 'isolation', name: '음압 격리실', sub: '전실+본실', icon: '😷', color: '#DDD6FE', x: 6, y: 37 },
    { id: 'suture', name: '소처치·봉합실', sub: '국소마취', icon: '🩹', color: '#FED7AA', x: 19, y: 37 },
    { id: 'exam2', name: '제2진료실', sub: '외상·정형', icon: '🦴', color: '#FDE68A', x: 32, y: 37 },
    { id: 'psych', name: '정신과 격리실', sub: '안전', icon: '🧠', color: '#C7D6E8', x: 6, y: 52 },
    { id: 'family', name: '가족 상담실', sub: '임종', icon: '🕊', color: '#F1DCC0', x: 19, y: 52 },
    { id: 'decon', name: '제염실', sub: '외부 연결', icon: '🚿', color: '#BFD8DE', x: 32, y: 52 },
  ],
  collision: [
    // perimeter (top split for ambulance x2-3 + main x30-31 doors)
    { x: 0, y: 0, w: 2, h: 1 }, { x: 4, y: 0, w: 26, h: 1 }, { x: 32, y: 0, w: 8, h: 1 },
    { x: 0, y: 0, w: 1, h: 60 }, { x: 39, y: 0, w: 1, h: 60 }, { x: 0, y: 59, w: 40, h: 1 },
    // lobby→rooms divider (y13), thresholds at x6/x19/x32
    { x: 1, y: 13, w: 5, h: 1 }, { x: 7, y: 13, w: 12, h: 1 }, { x: 20, y: 13, w: 12, h: 1 }, { x: 33, y: 13, w: 6, h: 1 },
    // column dividers x13 / x26 (full height through the room grid)
    { x: 13, y: 13, w: 1, h: 46 }, { x: 26, y: 13, w: 1, h: 46 },
    // band divider y29 (per column, thresholds at x6/x19/x32)
    { x: 1, y: 29, w: 5, h: 1 }, { x: 7, y: 29, w: 6, h: 1 },
    { x: 14, y: 29, w: 5, h: 1 }, { x: 20, y: 29, w: 6, h: 1 },
    { x: 27, y: 29, w: 5, h: 1 }, { x: 33, y: 29, w: 6, h: 1 },
    // band divider y44 (per column, thresholds at x6/x19/x32)
    { x: 1, y: 44, w: 5, h: 1 }, { x: 7, y: 44, w: 6, h: 1 },
    { x: 14, y: 44, w: 5, h: 1 }, { x: 20, y: 44, w: 6, h: 1 },
    { x: 27, y: 44, w: 5, h: 1 }, { x: 33, y: 44, w: 6, h: 1 },
  ],
  objects: [
    // special-room floor tints (drawn above floor, below objects; non-blocking)
    { id: 't-psych', type: 'tint', x: 1, y: 45, props: { w: 12, h: 13, color: '#C7D6E8', op: 0.32 } },
    { id: 't-family', type: 'tint', x: 14, y: 45, props: { w: 12, h: 13, color: '#F1DCC0', op: 0.3 } },
    { id: 't-decon', type: 'tint', x: 27, y: 45, props: { w: 12, h: 13, color: '#BFD8DE', op: 0.4 } },
    // exterior doors (auto)
    { id: 'd-amb', type: 'door', x: 2, y: 0, props: { w: 2, kind: 'auto' } },
    { id: 'd-main', type: 'door', x: 30, y: 0, props: { w: 2, kind: 'auto' } },
    // internal zone thresholds (leafless openings)
    { id: 'th-a1', type: 'threshold', x: 6, y: 13 }, { id: 'th-b1', type: 'threshold', x: 19, y: 13 }, { id: 'th-c1', type: 'threshold', x: 32, y: 13 },
    { id: 'th-a2', type: 'threshold', x: 6, y: 29, props: { tone: 'sterile' } }, { id: 'th-b2', type: 'threshold', x: 19, y: 29 }, { id: 'th-c2', type: 'threshold', x: 32, y: 29 },
    { id: 'th-a3', type: 'threshold', x: 6, y: 44 }, { id: 'th-b3', type: 'threshold', x: 19, y: 44 }, { id: 'th-c3', type: 'threshold', x: 32, y: 44, props: { tone: 'sterile' } },
    // ── LOBBY ──
    { id: 'o-detector', type: 'detector', x: 2, y: 2 },
    { id: 'o-scanner', type: 'scanner', x: 5, y: 4 },
    { id: 'o-recep', type: 'reception', x: 9, y: 7, props: { w: 3, h: 1 } },
    { id: 'o-vitals', type: 'vitals', x: 14, y: 6 },
    { id: 'o-tl-r', type: 'triageline', x: 14, y: 9, props: { w: 4, color: '#EF4444' } },
    { id: 'o-tl-y', type: 'triageline', x: 14, y: 10, props: { w: 4, color: '#FACC15' } },
    { id: 'o-tl-g', type: 'triageline', x: 14, y: 11, props: { w: 4, color: '#22C55E' } },
    { id: 'o-wd', type: 'waitingdisplay', x: 22, y: 1, props: { w: 3 } },
    { id: 'o-sofa1', type: 'sofa', x: 28, y: 9, props: { w: 3 } },
    { id: 'o-sofa2', type: 'sofa', x: 33, y: 9, props: { w: 2, color: '#C4A98F' } },
    { id: 'o-wb1', type: 'wastebin', x: 37, y: 10 },
    // ── 소생실 (A1) ──
    { id: 'o-resbed', type: 'bed', x: 3, y: 16, props: { occupied: true } },
    { id: 'o-resmon', type: 'monitor', x: 6, y: 15, props: { beep: true } },
    { id: 'o-resiv', type: 'ivpump', x: 9, y: 16 },
    { id: 'o-resdr', type: 'dressing', x: 3, y: 24 },
    // ── 너스 스테이션 (B1) + Pyxis ──
    { id: 'o-station', type: 'nursestation', x: 15, y: 18, props: { w: 9, h: 5 } },
    { id: 'o-pyxis', type: 'medfridge', x: 22, y: 15 },
    // ── 제1진료실 (C1) ──
    { id: 'o-e1bed', type: 'bed', x: 29, y: 16 },
    { id: 'o-e1mon', type: 'monitor', x: 31, y: 15 },
    { id: 'o-e1ch', type: 'chair', x: 33, y: 19, props: { color: '#BAE6FD' } },
    // ── 음압 격리실 (A2) ──
    { id: 'o-isoppe', type: 'ppestand', x: 3, y: 31 },
    { id: 'o-isofr', type: 'medfridge', x: 10, y: 40 },
    { id: 'o-isoiv', type: 'ivpump', x: 3, y: 40 },
    { id: 'o-isobed', type: 'bed', x: 6, y: 33, props: { occupied: true } },
    // ── 소처치·봉합실 (B2) ──
    { id: 'o-subed', type: 'bed', x: 16, y: 32 },
    { id: 'o-sudr', type: 'dressing', x: 22, y: 35 },
    { id: 'o-such', type: 'stool', x: 18, y: 37 },
    // ── 제2진료실 (C2) ──
    { id: 'o-e2bed', type: 'bed', x: 29, y: 32 },
    { id: 'o-e2mon', type: 'monitor', x: 31, y: 31 },
    // ── 정신과 안전 격리실 (A3) ──
    { id: 'o-psybed', type: 'boltedbed', x: 4, y: 49, props: { w: 2, h: 3, occupied: true } },
    // ── 가족 상담·임종실 (B3) ──
    { id: 'o-famsofa1', type: 'sofa', x: 15, y: 50, props: { w: 3, color: '#A9B8C9' } },
    { id: 'o-famsofa2', type: 'sofa', x: 20, y: 50, props: { w: 2, color: '#C4A98F' } },
    { id: 'o-famplant', type: 'plant', x: 23, y: 46 },
    // ── 제염실 (C3) ──
    { id: 'o-decsh', type: 'deconshower', x: 30, y: 46 },
    { id: 'o-decdr', type: 'floordrain', x: 28, y: 51, props: { w: 3 } },
    { id: 'o-decchem', type: 'chemdrum', x: 35, y: 49, props: { tone: 'chem' } },
    { id: 'o-decppe', type: 'ppestand', x: 37, y: 46 },
  ],
  hotspots: [
    { id: 'hs-resus', kind: 'quest', x: 4, y: 19, label: '소생', scenarioId: 'er-anaphylaxis' },
    { id: 'hs-triage', kind: 'quest', x: 14, y: 7, label: 'KTAS 트리아지', scenarioId: 'er-hopkins-pain' },
    { id: 'hs-exam1', kind: 'quest', x: 30, y: 19, label: '진료', scenarioId: 'er-chest-pain' },
    { id: 'hs-psych', kind: 'quest', x: 6, y: 53, label: '정신과 사정', scenarioId: 'er-mental-health' },
  ],
  npcs: [
    { id: 'er-nurse', kind: 'nurse', mode: 'idle', seed: 5, start: { x: 19, y: 23 } },
    { id: 'er-doc1', kind: 'doctor', mode: 'idle', seed: 7, start: { x: 33, y: 20 } },
    { id: 'er-doc2', kind: 'doctor', mode: 'idle', seed: 8, start: { x: 18, y: 35 } },
    { id: 'er-pat1', kind: 'patient', mode: 'wander', seed: 22, bound: { x: 24, y: 6, w: 12, h: 6 }, start: { x: 30, y: 9 } },
    { id: 'er-vis', kind: 'visitor', mode: 'wander', seed: 31, bound: { x: 2, y: 6, w: 8, h: 6 }, start: { x: 5, y: 10 } },
  ],
};

export const FIXTURES: Record<string, Interior> = {
  [ER_INTERIOR.id]: ER_INTERIOR,
  [CAMPUS_INTERIOR.id]: CAMPUS_INTERIOR,
  [INTERNAL.id]: INTERNAL,
  [SURGERY.id]: SURGERY,
  [ORTHO.id]: ORTHO,
  [DERM.id]: DERM,
};
