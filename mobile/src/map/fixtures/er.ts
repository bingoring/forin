// ER — Emergency Medical Center. A 1:1 port of the handoff master blueprint
// (design-handoff_v9/reference/interior-er.jsx): 40×60 tiles, a full-width public
// lobby (ambulance handoff · security · 원무과 · KTAS triage · waiting) over a
// 3-column × 3-band treatment grid (resus / nurse-station+pyxis / exam1 — iso /
// suture / exam2 — psych / quiet / decon). Internal zone borders are leafless
// `threshold` openings; only the lobby's exterior doors are auto `door`s; vertical
// dividers x13/x26 and the y16/y33/y49 dividers have per-band threshold gaps.
// IGlass partitions wall the pyxis alcove + isolation anteroom. Special rooms get
// a translucent `tint`. Region bounds overlap the dividing walls so the player
// always resolves to a region.
import type { Interior } from '@engine';
import { CAMPUS_INTERIOR } from './campus';
import { OR_INTERIOR } from './or';
import { ICU_INTERIOR } from './icu';
import { PEDS_INTERIOR } from './peds';
import { PHARMA_INTERIOR } from './pharma';
import { WARD_INTERIOR } from './ward';
import { SURGWARD_INTERIOR } from './surgward';
import { ORTHO_INTERIOR } from './ortho';
import { DERMCENTER_INTERIOR } from './dermcenter';
import { INFUSION_INTERIOR } from './infusion';
import { NURSERY_INTERIOR } from './nursery';
import { WOMENKIDS_INTERIOR } from './womenkids';
import { LD_INTERIOR } from './ld';
import { NICU_INTERIOR } from './nicu';
import { PICU_INTERIOR } from './picu';
import { RAD_INTERIOR } from './rad';
import { ENDO_INTERIOR } from './endo';
import { DIAL_INTERIOR } from './dial';
import { SPECIALTY_INTERIOR } from './specialty';
import { ONCO_INTERIOR } from './onco';
import { HOSPICE_INTERIOR } from './hospice';
import { GERI_INTERIOR } from './geri';
import { PSYCH_INTERIOR } from './psych';
import { REHAB_INTERIOR } from './rehab';
import { SIM_INTERIOR } from './sim';
import { LOUNGE_INTERIOR } from './lounge';
import { SPD_INTERIOR } from './spd';
import { MORGUE_INTERIOR } from './morgue';
import { INTERNAL, SURGERY, ORTHO, DERM } from '../clinic';

export const ER_INTERIOR: Interior = {
  id: 'INT-ER-00001',
  deptId: 'DEPT-ER-00001',
  cols: 40,
  rows: 60,
  floorTheme: 'clinical',
  // dept wards are up to 14 tiles wide; <1 zoom so a whole room fits the viewport
  // (at 1.0 a 14-wide room is clipped → objects look "missing").
  scale: 0.85,
  playerStart: { x: 19, y: 28 },
  regions: [
    { id: 'lobby', name: '공공 로비 · 접수 · 트리아지', icon: '🚑', bounds: { x: 0, y: 0, w: 40, h: 17 } },
    { id: 'resus', name: '응급 소생실', icon: '🚨', bounds: { x: 0, y: 16, w: 14, h: 18 } },
    { id: 'nurse', name: '중앙 너스 스테이션 · 약품실', icon: '🩺', bounds: { x: 13, y: 16, w: 14, h: 18 } },
    { id: 'exam1', name: '제1진료실 · 내과', icon: '🩺', bounds: { x: 26, y: 16, w: 14, h: 18 } },
    { id: 'iso', name: '음압 격리실', icon: '😷', bounds: { x: 0, y: 33, w: 14, h: 17 } },
    { id: 'suture', name: '소처치 · 봉합실', icon: '🩹', bounds: { x: 13, y: 33, w: 14, h: 17 } },
    { id: 'exam2', name: '제2진료실 · 외상/정형', icon: '🦴', bounds: { x: 26, y: 33, w: 14, h: 17 } },
    { id: 'psych', name: '정신과 안전 격리실', icon: '🧠', bounds: { x: 0, y: 49, w: 14, h: 11 } },
    { id: 'quiet', name: '가족 상담 · 임종실', icon: '🕊', bounds: { x: 13, y: 49, w: 14, h: 11 } },
    { id: 'decon', name: '제염실 (외부 연결)', icon: '🚿', bounds: { x: 26, y: 49, w: 14, h: 11 } },
  ],
  rooms: [
    { id: 'amb', name: '앰뷸런스 인계', sub: '도착 환자', icon: '🚑', color: '#FCA5A5', x: 6, y: 4 },
    { id: 'triage', name: '트리아지 · KTAS', sub: '응급도 분류', icon: '📋', color: '#FBCFE8', x: 4, y: 10 },
    { id: 'reg', name: '원무과 접수', sub: '등록', icon: '📝', color: '#BAE6FD', x: 31, y: 6 },
    { id: 'wait', name: '대기실', sub: '경증 대기', icon: '🪑', color: '#FED7AA', x: 19, y: 12 },
    { id: 'resus', name: '응급 소생실', sub: '중증', icon: '🚨', color: '#FCA5A5', x: 5, y: 26 },
    { id: 'nurse', name: '너스 스테이션', sub: '중앙 허브', icon: '🩺', color: '#FFEDD5', x: 19, y: 28 },
    { id: 'pyxis', name: '약품실 PYXIS', sub: '자동 약장', icon: '💊', color: '#DDD6FE', x: 16, y: 19 },
    { id: 'exam1', name: '제1진료실', sub: '내과', icon: '🩺', color: '#A7F3D0', x: 33, y: 22 },
    { id: 'iso', name: '음압 격리실', sub: '감염 관리', icon: '😷', color: '#FEF08A', x: 4, y: 44 },
    { id: 'suture', name: '소처치·봉합실', sub: '드레싱·봉합', icon: '🩹', color: '#DDD6FE', x: 18, y: 44 },
    { id: 'exam2', name: '제2진료실', sub: '외상/정형', icon: '🦴', color: '#FED7AA', x: 33, y: 42 },
    { id: 'psych', name: '정신과 격리실', sub: '1:1 관찰', icon: '🧠', color: '#C7D2FE', x: 5, y: 55 },
    { id: 'quiet', name: '가족 상담실', sub: '임종·상담', icon: '🕊', color: '#FBCFE8', x: 19, y: 55 },
    { id: 'decon', name: '제염실', sub: '외부 제염', icon: '🚿', color: '#A7E3D0', x: 32, y: 55 },
  ],
  collision: [
    // ── outer walls (top: ambulance x4-7 + entrance x18-21 doors are gaps) ──
    { x: 0, y: 0, w: 4, h: 1 }, { x: 8, y: 0, w: 10, h: 1 }, { x: 22, y: 0, w: 18, h: 1 },
    { x: 0, y: 1, w: 1, h: 58 }, { x: 39, y: 1, w: 1, h: 58 },
    // bottom (campus-exit x18-21 + decon-exterior x34-36 doors are gaps)
    { x: 0, y: 59, w: 18, h: 1 }, { x: 22, y: 59, w: 12, h: 1 }, { x: 37, y: 59, w: 3, h: 1 },
    // ── divider y16 (lobby / treatment) — thresholds at x5-7 / x17-20 / x31-33 ──
    { x: 1, y: 16, w: 4, h: 1 }, { x: 8, y: 16, w: 9, h: 1 }, { x: 21, y: 16, w: 10, h: 1 }, { x: 34, y: 16, w: 5, h: 1 },
    // ── divider y33 (upper / lower treatment) ──
    { x: 1, y: 33, w: 4, h: 1 }, { x: 8, y: 33, w: 9, h: 1 }, { x: 21, y: 33, w: 10, h: 1 }, { x: 34, y: 33, w: 5, h: 1 },
    // ── divider y49 (lower / back) ──
    { x: 1, y: 49, w: 4, h: 1 }, { x: 8, y: 49, w: 9, h: 1 }, { x: 21, y: 49, w: 10, h: 1 }, { x: 34, y: 49, w: 5, h: 1 },
    // ── vertical divider x13 (threshold gaps y21-23 / y38-40 / y53-55) ──
    { x: 13, y: 17, w: 1, h: 4 }, { x: 13, y: 24, w: 1, h: 9 },
    { x: 13, y: 34, w: 1, h: 4 }, { x: 13, y: 41, w: 1, h: 8 },
    { x: 13, y: 50, w: 1, h: 3 }, { x: 13, y: 56, w: 1, h: 3 },
    // ── vertical divider x26 ──
    { x: 26, y: 17, w: 1, h: 4 }, { x: 26, y: 24, w: 1, h: 9 },
    { x: 26, y: 34, w: 1, h: 4 }, { x: 26, y: 41, w: 1, h: 8 },
    { x: 26, y: 50, w: 1, h: 3 }, { x: 26, y: 56, w: 1, h: 3 },
    // ── ㄷ nurse-station desk (x14-23,y23-28): back bar + two side arms block;
    //    the open well (x16-21,y25-28) stays walkable so staff stand inside it ──
    { x: 14, y: 23, w: 10, h: 2 }, { x: 14, y: 25, w: 2, h: 4 }, { x: 22, y: 25, w: 2, h: 4 },
  ],
  objects: [
    // ── special-room floor tints (drawn above floor, below objects; non-blocking) ──
    { id: 't-psych', type: 'tint', x: 1, y: 50, props: { w: 11, h: 8, color: '#C7D6E8', op: 0.32 } },
    { id: 't-quiet', type: 'tint', x: 14, y: 50, props: { w: 12, h: 8, color: '#F1DCC0', op: 0.4 } },
    { id: 't-decon', type: 'tint', x: 27, y: 50, props: { w: 12, h: 8, color: '#BFD8DE', op: 0.4 } },
    // ── exterior auto doors (top: ambulance + entrance, bottom: campus + decon) ──
    { id: 'd-amb', type: 'door', x: 4, y: 0, props: { w: 4, kind: 'auto', label: '🚑 AMBULANCE' } },
    { id: 'd-main', type: 'door', x: 18, y: 0, props: { w: 4, kind: 'auto', label: '정문 ENTRANCE' } },
    { id: 'd-campus', type: 'door', x: 18, y: 59, props: { w: 4, kind: 'auto', label: '↓ 캠퍼스로' } },
    { id: 'd-deconext', type: 'door', x: 34, y: 59, props: { w: 3, kind: 'auto', label: '🚿 외부' } },
    // ── internal zone thresholds (leafless openings) ──
    { id: 'th-y16-a', type: 'threshold', x: 5, y: 16, props: { w: 3, h: 1, label: '→ 소생실' } },
    { id: 'th-y16-b', type: 'threshold', x: 17, y: 16, props: { w: 4, h: 1, label: '→ 스테이션' } },
    { id: 'th-y16-c', type: 'threshold', x: 31, y: 16, props: { w: 3, h: 1, label: '→ 내과' } },
    { id: 'th-y33-a', type: 'threshold', x: 5, y: 33, props: { w: 3, h: 1, label: '→ 격리' } },
    { id: 'th-y33-b', type: 'threshold', x: 17, y: 33, props: { w: 4, h: 1, label: '→ 처치실' } },
    { id: 'th-y33-c', type: 'threshold', x: 31, y: 33, props: { w: 3, h: 1, label: '→ 외상' } },
    { id: 'th-y49-a', type: 'threshold', x: 5, y: 49, props: { w: 3, h: 1, label: '→ 정신과' } },
    { id: 'th-y49-b', type: 'threshold', x: 17, y: 49, props: { w: 4, h: 1, label: '→ 상담실' } },
    { id: 'th-y49-c', type: 'threshold', x: 31, y: 49, props: { w: 3, h: 1, label: '→ 제염실' } },
    { id: 'th-x13-1', type: 'threshold', x: 13, y: 21, props: { w: 1, h: 3 } },
    { id: 'th-x26-1', type: 'threshold', x: 26, y: 21, props: { w: 1, h: 3 } },
    { id: 'th-x13-2', type: 'threshold', x: 13, y: 38, props: { w: 1, h: 3 } },
    { id: 'th-x26-2', type: 'threshold', x: 26, y: 38, props: { w: 1, h: 3 } },
    { id: 'th-x13-3', type: 'threshold', x: 13, y: 53, props: { w: 1, h: 3 } },
    { id: 'th-x26-3', type: 'threshold', x: 26, y: 53, props: { w: 1, h: 3 } },

    // ════════════ LOBBY ════════════
    { id: 'tl-r', type: 'triageline', x: 6, y: 13, props: { w: 1, h: 3, color: '#EF4444' } },
    // yellow lane centered on the lobby→station threshold opening (x17-20 → center x19)
    { id: 'tl-y', type: 'triageline', x: 18, y: 13, props: { w: 2, h: 3, color: '#FACC15' } },
    { id: 'tl-g', type: 'triageline', x: 32, y: 13, props: { w: 1, h: 3, color: '#16A34A' } },
    // ambulance intake
    { id: 'bl-amb', type: 'baylabel', x: 2, y: 1, props: { text: '🚑 AMBULANCE INTAKE', highlight: true } },
    { id: 'o-amb-gur', type: 'gurney', x: 4, y: 3, props: { occupied: true, marker: 'urgent', markerLabel: '핸드오프 SBAR' } },
    { id: 'o-amb-iv', type: 'ivpump', x: 7, y: 3 },
    { id: 'o-amb-ox', type: 'oxygen', x: 3, y: 3 },
    // security
    { id: 'bl-sec', type: 'baylabel', x: 15, y: 1, props: { text: 'SECURITY' } },
    { id: 'o-sec-det', type: 'detector', x: 18, y: 2 },
    { id: 'o-sec-scan', type: 'scanner', x: 21, y: 3 },
    // registration · 원무과
    { id: 'bl-reg', type: 'baylabel', x: 28, y: 1, props: { text: '원무과 REGISTER' } },
    { id: 'o-reg-recep', type: 'ireception', x: 29, y: 4, props: { w: 4, h: 1, marker: 'quest', markerLabel: '접수 등록' } },
    { id: 'o-reg-comp', type: 'compcart', x: 34, y: 3 },
    { id: 'o-reg-bc', type: 'barcodeprinter', x: 35, y: 6 },
    { id: 'o-reg-ticket', type: 'ticket', x: 37, y: 6 },
    { id: 'o-reg-broch', type: 'brochure', x: 28, y: 6 },
    { id: 'o-reg-phone', type: 'phone', x: 31, y: 3 },
    { id: 'o-reg-san', type: 'sanitizer', x: 37, y: 2 },
    // triage · KTAS
    { id: 'bl-tri', type: 'baylabel', x: 1, y: 6, props: { text: 'TRIAGE · KTAS', highlight: true } },
    { id: 'o-tri-recep', type: 'ireception', x: 2, y: 8, props: { w: 3, h: 1, marker: 'quest', markerLabel: 'KTAS 분류', scenarioId: 'SCN-ER-00002' } },
    { id: 'o-tri-vit', type: 'vitals', x: 6, y: 7 },
    { id: 'o-tri-bp', type: 'bpcuff', x: 1, y: 7 },
    { id: 'o-tri-san', type: 'sanitizer', x: 1, y: 9 },
    { id: 'o-tri-wc1', type: 'wheelchair', x: 6, y: 10 },
    { id: 'o-tri-wc2', type: 'wheelchair', x: 7, y: 11 },
    // small triage waiting nook bridging triage ↔ central waiting (lobby polish)
    { id: 'o-tri-w1', type: 'ichair', x: 9, y: 11, props: { color: '#FED7AA', facing: 'up' } },
    { id: 'o-tri-w2', type: 'ichair', x: 11, y: 11, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-tri-plant', type: 'iplant', x: 12, y: 8 },
    { id: 'o-amb-plant', type: 'iplant', x: 10, y: 4 },
    // waiting — two back-to-back rows (row A faces the entrance, row B the rooms)
    { id: 'bl-wait', type: 'baylabel', x: 14, y: 7, props: { text: 'WAITING · 대기' } },
    { id: 'o-wait-disp', type: 'waitingdisplay', x: 14, y: 8, props: { w: 3 } },
    { id: 'o-wait-tv', type: 'walltv', x: 22, y: 8, props: { w: 2 } },
    { id: 'o-wait-wcool', type: 'watercooler', x: 25, y: 9 },
    { id: 'o-wait-ch-a0', type: 'ichair', x: 15, y: 10, props: { color: '#FED7AA', facing: 'down' } },
    { id: 'o-wait-ch-a1', type: 'ichair', x: 17, y: 10, props: { color: '#FBCFE8', facing: 'down' } },
    { id: 'o-wait-ch-a2', type: 'ichair', x: 19, y: 10, props: { color: '#FED7AA', facing: 'down' } },
    { id: 'o-wait-ch-a3', type: 'ichair', x: 21, y: 10, props: { color: '#FBCFE8', facing: 'down' } },
    { id: 'o-wait-ch-a4', type: 'ichair', x: 23, y: 10, props: { color: '#FED7AA', facing: 'down' } },
    { id: 'o-wait-ch-b0', type: 'ichair', x: 15, y: 13, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-wait-ch-b1', type: 'ichair', x: 17, y: 13, props: { color: '#FED7AA', facing: 'up' } },
    { id: 'o-wait-ch-b2', type: 'ichair', x: 19, y: 13, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-wait-ch-b3', type: 'ichair', x: 21, y: 13, props: { color: '#FED7AA', facing: 'up' } },
    { id: 'o-wait-ch-b4', type: 'ichair', x: 23, y: 13, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-wait-plant', type: 'iplant', x: 25, y: 13 },

    // ════════════ RESUS · 소생실 ════════════
    { id: 'bl-resus', type: 'baylabel', x: 1, y: 17, props: { text: 'RESUS · 소생실', highlight: true } },
    // trauma bay 1
    { id: 'o-r1-light', type: 'surgicallight', x: 4, y: 17 },
    { id: 'o-r1-bed', type: 'ibed', x: 3, y: 18, props: { variant: 'or', occupied: true, marker: 'urgent', markerLabel: 'CODE', scenarioId: 'SCN-ER-00003' } },
    { id: 'o-r1-mon', type: 'imonitor', x: 1, y: 18, props: { beep: true } },
    { id: 'o-r1-vent', type: 'ventilator', x: 6, y: 18 },
    { id: 'o-r1-crash', type: 'crashcart', x: 8, y: 18 },
    { id: 'o-r1-defib', type: 'defib', x: 10, y: 18 },
    { id: 'o-r1-iv', type: 'ivpump', x: 2, y: 17 },
    { id: 'o-r1-suction', type: 'suction', x: 1, y: 21 },
    { id: 'o-r-curtain', type: 'icurtain', x: 1, y: 23, props: { w: 11, h: 1, color: '#A7C7E7' } },
    // trauma bay 2
    { id: 'o-r2-light', type: 'surgicallight', x: 4, y: 24 },
    { id: 'o-r2-bed', type: 'ibed', x: 3, y: 25, props: { variant: 'or', occupied: true } },
    { id: 'o-r2-mon', type: 'imonitor', x: 1, y: 25, props: { beep: true } },
    { id: 'o-r2-vent', type: 'ventilator', x: 6, y: 25 },
    { id: 'o-r2-iv', type: 'ivpump', x: 2, y: 24 },
    { id: 'o-r2-ox', type: 'oxygen', x: 10, y: 25 },
    { id: 'o-r2-wb', type: 'wastebin', x: 10, y: 28, props: { tone: 'infectious' } },

    // ════════════ NURSE STATION + 약품실 ════════════
    // pyxis / 약품실
    { id: 'bl-pyxis', type: 'baylabel', x: 14, y: 17, props: { text: '약품실 · PYXIS' } },
    { id: 'o-pyxis', type: 'pyxis', x: 14, y: 18 },
    { id: 'o-px-fridge', type: 'medfridge', x: 17, y: 18 },
    { id: 'o-px-cab', type: 'icabinet', x: 14, y: 21, props: { w: 2, h: 1, variant: 'drug', label: '마약 보관' } },
    { id: 'o-px-sharps', type: 'sharps', x: 18, y: 21 },
    { id: 'o-px-glass', type: 'glass', x: 19, y: 18, props: { w: 1, h: 4 } },
    // central nurse station
    { id: 'bl-nurse', type: 'baylabel', x: 21, y: 17, props: { text: 'NURSE STATION' } },
    { id: 'o-ns-bank', type: 'bankofmonitors', x: 21, y: 17 },
    { id: 'o-ns-desk', type: 'nursestation', x: 14, y: 23, props: { w: 10, h: 6 } },
    { id: 'o-ns-chart', type: 'chartbinder', x: 14, y: 25 },
    { id: 'o-ns-bc', type: 'barcodeprinter', x: 23, y: 26 },
    { id: 'o-ns-phone', type: 'phone', x: 14, y: 27 },
    { id: 'o-ns-stool', type: 'examstool', x: 16, y: 31 },
    { id: 'o-ns-dr1', type: 'dressing', x: 19, y: 30 },
    { id: 'o-ns-dr2', type: 'dressing', x: 22, y: 30 },

    // ════════════ EXAM1 · 내과 ════════════
    { id: 'bl-exam1', type: 'baylabel', x: 27, y: 17, props: { text: '제1진료실 · 내과' } },
    { id: 'o-e1-oto', type: 'otoscope', x: 27, y: 17 },
    { id: 'o-e1-anat', type: 'anatomy', x: 37, y: 17 },
    { id: 'o-e1-recep', type: 'ireception', x: 28, y: 20, props: { w: 3, h: 1 } },
    { id: 'o-e1-comp', type: 'compcart', x: 27, y: 19 },
    { id: 'o-e1-mon', type: 'imonitor', x: 31, y: 19 },
    { id: 'o-e1-stool', type: 'examstool', x: 30, y: 22 },
    { id: 'o-e1-bed', type: 'ibed', x: 34, y: 20, props: { variant: 'ward', occupied: true, marker: 'quest', markerLabel: '복통 문진', scenarioId: 'SCN-ER-00001' } },
    { id: 'o-e1-chair', type: 'ichair', x: 32, y: 24, props: { color: '#A8C7DC', facing: 'up' } },
    { id: 'o-e1-plant', type: 'iplant', x: 37, y: 30 },

    // ════════════ ISOLATION · 음압격리 ════════════
    // anteroom (전실)
    { id: 'bl-ante', type: 'baylabel', x: 1, y: 34, props: { text: '전실 · ANTEROOM' } },
    { id: 'o-iso-ppe', type: 'ppestand', x: 2, y: 34 },
    { id: 'o-iso-wb1', type: 'wastebin', x: 5, y: 35, props: { tone: 'infectious' } },
    { id: 'o-iso-gauge', type: 'pressuregauge', x: 8, y: 34 },
    { id: 'o-iso-san', type: 'sanitizer', x: 10, y: 35 },
    { id: 'o-iso-glass1', type: 'glass', x: 1, y: 38, props: { w: 4, h: 1 } },
    { id: 'th-iso', type: 'threshold', x: 5, y: 38, props: { w: 2, h: 1, label: '격리실' } },
    { id: 'o-iso-glass2', type: 'glass', x: 7, y: 38, props: { w: 5, h: 1 } },
    // inner isolation room
    { id: 'bl-iso', type: 'baylabel', x: 1, y: 39, props: { text: '음압 격리실' } },
    { id: 'o-iso-bed', type: 'ibed', x: 3, y: 41, props: { variant: 'ward', occupied: true, marker: 'info', markerLabel: '감염 관리' } },
    { id: 'o-iso-mon', type: 'imonitor', x: 1, y: 41, props: { beep: true } },
    { id: 'o-iso-iv', type: 'iiv', x: 6, y: 41 },
    { id: 'o-iso-dr', type: 'dressing', x: 8, y: 42 },
    { id: 'o-iso-wb2', type: 'wastebin', x: 10, y: 46, props: { tone: 'infectious' } },
    { id: 'o-iso-cctv', type: 'cctv', x: 10, y: 39 },

    // ════════════ SUTURE · 소처치·봉합 ════════════
    { id: 'bl-suture', type: 'baylabel', x: 14, y: 34, props: { text: '소처치 · 봉합실' } },
    { id: 'o-su-light', type: 'surgicallight', x: 18, y: 34 },
    { id: 'o-su-bed', type: 'ibed', x: 17, y: 37, props: { variant: 'or', occupied: true, marker: 'quest', markerLabel: '봉합 처치' } },
    { id: 'o-su-dr', type: 'dressing', x: 14, y: 38 },
    { id: 'o-su-tray', type: 'instrumenttray', x: 21, y: 37 },
    { id: 'o-su-suction', type: 'suction', x: 23, y: 35 },
    { id: 'o-su-sharps', type: 'sharps', x: 23, y: 46 },
    { id: 'o-su-glove', type: 'glovebox', x: 14, y: 46 },

    // ════════════ EXAM2 · 외상/정형 ════════════
    { id: 'bl-exam2', type: 'baylabel', x: 27, y: 34, props: { text: '제2진료실 · 외상/정형' } },
    { id: 'o-e2-xray', type: 'xrayviewbox', x: 35, y: 34 },
    { id: 'o-e2-recep', type: 'ireception', x: 28, y: 37, props: { w: 3, h: 1 } },
    { id: 'o-e2-comp', type: 'compcart', x: 27, y: 36 },
    { id: 'o-e2-cast', type: 'castcart', x: 28, y: 40 },
    { id: 'o-e2-bed', type: 'ibed', x: 34, y: 37, props: { variant: 'ward', occupied: true, marker: 'quest', markerLabel: '부목 고정' } },
    { id: 'o-e2-stool', type: 'examstool', x: 32, y: 41 },
    { id: 'o-e2-plant', type: 'iplant', x: 37, y: 46 },

    // ════════════ PSYCH · 정신과 안전 격리실 ════════════
    { id: 'bl-psych', type: 'baylabel', x: 1, y: 50, props: { text: '정신과 안전 격리실' } },
    { id: 'o-ps-bed', type: 'boltedbed', x: 4, y: 51, props: { occupied: true, marker: 'info', markerLabel: '1:1 관찰 (Sitter)' } },
    { id: 'o-ps-cctv', type: 'cctv', x: 10, y: 50 },
    { id: 'o-ps-chair', type: 'ichair', x: 2, y: 55, props: { color: '#94A3B8', facing: 'down' } },

    // ════════════ QUIET · 가족 상담·임종실 ════════════
    { id: 'bl-quiet', type: 'baylabel', x: 14, y: 50, props: { text: '가족 상담 · 임종실' } },
    { id: 'o-q-pic', type: 'framedpic', x: 18, y: 50, props: { w: 2 } },
    { id: 'o-q-sofa1', type: 'sofa', x: 15, y: 52, props: { w: 3, h: 1, color: '#8FA9C4' } },
    { id: 'o-q-sofa2', type: 'sofa', x: 21, y: 55, props: { w: 3, h: 1, color: '#C0A6B8' } },
    { id: 'o-q-table', type: 'coffeetable', x: 17, y: 54, props: { w: 2 } },
    { id: 'o-q-tissue', type: 'tissuebox', x: 18, y: 53 },
    { id: 'o-q-lamp', type: 'floorlamp', x: 24, y: 51 },
    { id: 'o-q-plant', type: 'iplant', x: 25, y: 57 },

    // ════════════ DECON · 제염실 ════════════
    { id: 'bl-decon', type: 'baylabel', x: 27, y: 50, props: { text: '제염실 · DECON' } },
    { id: 'o-dec-sh1', type: 'deconshower', x: 29, y: 50 },
    { id: 'o-dec-sh2', type: 'deconshower', x: 33, y: 50 },
    { id: 'o-dec-dr1', type: 'floordrain', x: 29, y: 53, props: { w: 2 } },
    { id: 'o-dec-dr2', type: 'floordrain', x: 32, y: 53, props: { w: 2 } },
    { id: 'o-dec-chem1', type: 'chemdrum', x: 37, y: 51, props: { tone: 'chem' } },
    { id: 'o-dec-chem2', type: 'chemdrum', x: 37, y: 54, props: { tone: 'waste' } },
  ],
  hotspots: [
    // adjoining central pharmacy (원내 약국) — walk through from the 약품실 PYXIS
    { id: 'hs-pharma', kind: 'portal', x: 18, y: 20, label: '→ 원내 약국', target: 'INT-PHARMA-00001', entry: { x: 9, y: 9 } },
  ],
  npcs: [
    // lobby
    { id: 'er-amb-p1', kind: 'paramedic', mode: 'idle', seed: 41, start: { x: 3, y: 7 } },
    { id: 'er-amb-p2', kind: 'paramedic', mode: 'idle', seed: 42, start: { x: 7, y: 7 } },
    { id: 'er-sec-1', kind: 'police', mode: 'idle', seed: 43, start: { x: 16, y: 4 } },
    { id: 'er-sec-2', kind: 'police', mode: 'idle', seed: 44, start: { x: 24, y: 4 } },
    { id: 'er-reg-n1', kind: 'nurse', mode: 'idle', seed: 45, start: { x: 30, y: 6 } },
    { id: 'er-reg-n2', kind: 'nurse', mode: 'idle', seed: 46, start: { x: 32, y: 6 } },
    { id: 'er-reg-pat', kind: 'patient', mode: 'idle', seed: 47, start: { x: 30, y: 8 } },
    { id: 'er-reg-vis', kind: 'visitor', mode: 'idle', seed: 48, start: { x: 33, y: 8 } },
    { id: 'er-tri-n', kind: 'nurse', mode: 'idle', seed: 49, start: { x: 4, y: 10 } },
    { id: 'er-tri-pat', kind: 'patient', mode: 'idle', seed: 50, start: { x: 2, y: 11 } },
    { id: 'er-tri-vis', kind: 'visitor', mode: 'idle', seed: 51, start: { x: 3, y: 12 } },
    { id: 'er-wait-pat', kind: 'patient', mode: 'idle', seed: 52, start: { x: 16, y: 11 } },
    { id: 'er-wait-par', kind: 'parent', mode: 'idle', seed: 53, start: { x: 20, y: 11 } },
    { id: 'er-wait-chd', kind: 'child', mode: 'idle', seed: 54, start: { x: 21, y: 11 } },
    { id: 'er-wait-vis', kind: 'visitor', mode: 'idle', seed: 55, start: { x: 24, y: 13 } },
    // resus
    { id: 'er-r1-doc', kind: 'doctor', mode: 'idle', seed: 56, start: { x: 3, y: 21 } },
    { id: 'er-r1-n1', kind: 'nurse', mode: 'idle', seed: 57, start: { x: 5, y: 21 } },
    { id: 'er-r1-n2', kind: 'nurse', mode: 'idle', seed: 58, start: { x: 6, y: 20 } },
    { id: 'er-r2-p1', kind: 'paramedic', mode: 'idle', seed: 59, start: { x: 3, y: 29 } },
    { id: 'er-r2-p2', kind: 'paramedic', mode: 'idle', seed: 60, start: { x: 6, y: 29 } },
    // nurse station + pyxis
    { id: 'er-px-n', kind: 'nurse', mode: 'idle', seed: 61, start: { x: 16, y: 20 } },
    { id: 'er-ns-n1', kind: 'nurse', mode: 'idle', seed: 62, start: { x: 16, y: 27 } },
    { id: 'er-ns-d1', kind: 'doctor', mode: 'idle', seed: 63, start: { x: 18, y: 27 }, marker: 'urgent', markerLabel: 'Dr. Patel', scenarioId: 'SCN-ER-00004' },
    { id: 'er-ns-n2', kind: 'nurse', mode: 'idle', seed: 64, start: { x: 20, y: 27 } },
    { id: 'er-ns-d2', kind: 'doctor', mode: 'idle', seed: 65, start: { x: 22, y: 27 } },
    // exam1
    { id: 'er-e1-doc', kind: 'doctor', mode: 'idle', seed: 66, start: { x: 28, y: 23 } },
    { id: 'er-e1-pat', kind: 'patient', mode: 'idle', seed: 67, start: { x: 34, y: 24 } },
    // iso
    { id: 'er-iso-n', kind: 'nurse', mode: 'idle', seed: 68, start: { x: 6, y: 45 } },
    // suture
    { id: 'er-su-n', kind: 'nurse', mode: 'idle', seed: 69, start: { x: 15, y: 44 } },
    { id: 'er-su-d', kind: 'doctor', mode: 'idle', seed: 70, start: { x: 20, y: 44 } },
    // exam2
    { id: 'er-e2-d', kind: 'doctor', mode: 'idle', seed: 71, start: { x: 29, y: 41 } },
    { id: 'er-e2-n', kind: 'nurse', mode: 'idle', seed: 72, start: { x: 34, y: 41 } },
    // psych
    { id: 'er-ps-pat', kind: 'patient', mode: 'idle', seed: 73, start: { x: 5, y: 55 } },
    { id: 'er-ps-vis', kind: 'visitor', mode: 'idle', seed: 74, start: { x: 2, y: 56 } },
    // quiet
    { id: 'er-q-doc', kind: 'doctor', mode: 'idle', seed: 75, start: { x: 16, y: 54 }, marker: 'info', markerLabel: '가족 상담' },
    { id: 'er-q-vis', kind: 'visitor', mode: 'idle', seed: 76, start: { x: 22, y: 56 } },
    { id: 'er-q-par', kind: 'parent', mode: 'idle', seed: 77, start: { x: 23, y: 56 } },
    // decon
    { id: 'er-dec-p', kind: 'paramedic', mode: 'idle', seed: 78, start: { x: 31, y: 56 }, marker: 'info', markerLabel: '제염 처치' },
  ],
};

export const FIXTURES: Record<string, Interior> = {
  [ER_INTERIOR.id]: ER_INTERIOR,
  [OR_INTERIOR.id]: OR_INTERIOR,
  [ICU_INTERIOR.id]: ICU_INTERIOR,
  [PEDS_INTERIOR.id]: PEDS_INTERIOR,
  [PHARMA_INTERIOR.id]: PHARMA_INTERIOR,
  [WARD_INTERIOR.id]: WARD_INTERIOR,
  [SURGWARD_INTERIOR.id]: SURGWARD_INTERIOR,
  [ORTHO_INTERIOR.id]: ORTHO_INTERIOR,
  [DERMCENTER_INTERIOR.id]: DERMCENTER_INTERIOR,
  [INFUSION_INTERIOR.id]: INFUSION_INTERIOR,
  [NURSERY_INTERIOR.id]: NURSERY_INTERIOR,
  [WOMENKIDS_INTERIOR.id]: WOMENKIDS_INTERIOR,
  [LD_INTERIOR.id]: LD_INTERIOR,
  [NICU_INTERIOR.id]: NICU_INTERIOR,
  [PICU_INTERIOR.id]: PICU_INTERIOR,
  [RAD_INTERIOR.id]: RAD_INTERIOR,
  [ENDO_INTERIOR.id]: ENDO_INTERIOR,
  [DIAL_INTERIOR.id]: DIAL_INTERIOR,
  [SPECIALTY_INTERIOR.id]: SPECIALTY_INTERIOR,
  [ONCO_INTERIOR.id]: ONCO_INTERIOR,
  [HOSPICE_INTERIOR.id]: HOSPICE_INTERIOR,
  [GERI_INTERIOR.id]: GERI_INTERIOR,
  [PSYCH_INTERIOR.id]: PSYCH_INTERIOR,
  [REHAB_INTERIOR.id]: REHAB_INTERIOR,
  [SIM_INTERIOR.id]: SIM_INTERIOR,
  [LOUNGE_INTERIOR.id]: LOUNGE_INTERIOR,
  [SPD_INTERIOR.id]: SPD_INTERIOR,
  [MORGUE_INTERIOR.id]: MORGUE_INTERIOR,
  [CAMPUS_INTERIOR.id]: CAMPUS_INTERIOR,
  [INTERNAL.id]: INTERNAL,
  [SURGERY.id]: SURGERY,
  [ORTHO.id]: ORTHO,
  [DERM.id]: DERM,
};
