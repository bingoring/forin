// DERM CENTER — 피부과 센터 (Dermatology Clinic & Center). 1:1 port of the v15
// handoff master blueprint (design-handoff_v15/reference/interior-dermcenter.jsx +
// interior-objects-derm2.jsx): 28×52 tiles, bright rose tone, TOP campus door.
// 로비·접수·대기 → 제1/제2 진료실(더마토스코프·우드등) → 광선 치료실(전신 UV 부스) →
// 소수술·레이저 처치실(펀치 생검·냉동·CO2 레이저). Reuses clinicReception/sofa/
// coffeetable/walltv/watercooler/surgicallight/dressing/shared; only derm2
// (dermatoscope/UV/biopsy/cryo/laser) + SkinAnatomy is new. Markers label-only.
import type { Interior } from '@engine';

export const DERMCENTER_INTERIOR: Interior = {
  id: 'INT-DERM-00001',
  deptId: 'DEPT-DERM-00001',
  cols: 28,
  rows: 52,
  floorTheme: 'derm',
  scale: 0.9,
  playerStart: { x: 14, y: 11 }, // lobby by the ↓ 캠퍼스 door
  regions: [
    { id: 'exam1', name: '제1진료실 · 병변 진단', icon: '🔬', bounds: { x: 0, y: 13, w: 14, h: 13 } },
    { id: 'exam2', name: '제2진료실', icon: '🩺', bounds: { x: 13, y: 13, w: 15, h: 13 } },
    { id: 'laser', name: '소수술 · 레이저 처치실', icon: '✨', bounds: { x: 0, y: 37, w: 28, h: 15 } },
    { id: 'photo', name: '광선 치료실', icon: '💜', bounds: { x: 0, y: 25, w: 28, h: 13 } },
    { id: 'lobby', name: '로비 · 접수 · 대기', icon: '🌸', bounds: { x: 0, y: 0, w: 28, h: 14 } },
  ],
  rooms: [
    { id: 'lobby', name: '로비 · 접수', sub: '문진·대기', icon: '🌸', color: '#FBCFE8', x: 14, y: 6 },
    { id: 'exam1', name: '제1진료실', sub: '더마토스코프·우드등', icon: '🔬', color: '#F0E6EA', x: 6, y: 19 },
    { id: 'exam2', name: '제2진료실', sub: '피부 진찰', icon: '🩺', color: '#F0E6EA', x: 20, y: 19 },
    { id: 'photo', name: '광선 치료실', sub: '전신 UV 부스', icon: '💜', color: '#DDD6FE', x: 13, y: 31 },
    { id: 'laser', name: '레이저 처치실', sub: '생검·냉동·레이저', icon: '✨', color: '#FCE7F0', x: 13, y: 44 },
  ],
  collision: [
    // outer walls — TOP 캠퍼스 door gap x13-15
    { x: 0, y: 0, w: 13, h: 1 }, { x: 16, y: 0, w: 12, h: 1 },
    { x: 0, y: 1, w: 1, h: 50 }, { x: 27, y: 1, w: 1, h: 50 },
    { x: 0, y: 51, w: 28, h: 1 },
    // divider y13 (lobby | exam) — thresholds x5-7 / x13-15
    { x: 1, y: 13, w: 4, h: 1 }, { x: 8, y: 13, w: 5, h: 1 }, { x: 16, y: 13, w: 11, h: 1 },
    // exam1 | exam2 vertical divider (x13) — threshold gap y18-20
    { x: 13, y: 14, w: 1, h: 4 }, { x: 13, y: 21, w: 1, h: 5 },
    // divider y25 (exam | phototherapy) — threshold x7-9
    { x: 1, y: 25, w: 6, h: 1 }, { x: 10, y: 25, w: 17, h: 1 },
    // divider y37 (phototherapy | laser) — sterile threshold x7-9
    { x: 1, y: 37, w: 6, h: 1 }, { x: 10, y: 37, w: 17, h: 1 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-campus', type: 'door', x: 13, y: 0, props: { w: 3, h: 1, kind: 'auto', label: '↓ 캠퍼스로' } },
    { id: 'th-e1', type: 'threshold', x: 5, y: 13, props: { w: 3, h: 1, label: '→ 진료실' } },
    { id: 'th-e2', type: 'threshold', x: 13, y: 13, props: { w: 3, h: 1, label: '→ 진료실 2' } },
    { id: 'th-ex', type: 'threshold', x: 13, y: 18, props: { w: 1, h: 3 } },
    { id: 'th-photo', type: 'threshold', x: 7, y: 25, props: { w: 3, h: 1, label: '→ 광선실' } },
    { id: 'th-laser', type: 'threshold', x: 7, y: 37, props: { w: 3, h: 1, tone: 'sterile', label: '→ 처치실' } },

    // ════════ 로비 · 접수 · 대기 (y1-12) ════════
    { id: 'bl-lobby', type: 'baylabel', x: 1, y: 1, props: { text: 'DERMATOLOGY · 접수 & 대기' } },
    { id: 'o-lb-recep', type: 'clinicReception', x: 3, y: 3, props: { w: 6, h: 2, tone: '#DB2777', label: '접수' } },
    { id: 'o-lb-chart', type: 'lesionchart', x: 10, y: 1, props: { w: 3 } },
    { id: 'o-lb-sofa1', type: 'sofa', x: 18, y: 3, props: { w: 2, h: 2, color: '#E2C0CE' } },
    { id: 'o-lb-sofa2', type: 'sofa', x: 21, y: 3, props: { w: 2, h: 2, color: '#C9B0D8' } },
    { id: 'o-lb-sofa3', type: 'sofa', x: 24, y: 3, props: { w: 2, h: 2, color: '#B8C8DC' } },
    { id: 'o-lb-table', type: 'coffeetable', x: 20, y: 6, props: { w: 2, h: 1 } },
    { id: 'o-lb-ch1', type: 'ichair', x: 18, y: 9, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-lb-ch2', type: 'ichair', x: 20, y: 9, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-lb-ch3', type: 'ichair', x: 22, y: 9, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-lb-ch4', type: 'ichair', x: 24, y: 9, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-lb-water', type: 'watercooler', x: 26, y: 6 },
    { id: 'o-lb-tv', type: 'walltv', x: 1, y: 9, props: { w: 2 } },
    { id: 'o-lb-plant', type: 'iplant', x: 26, y: 10 },

    // ════════ 제1진료실 · 병변 진단 (y14-24) ════════
    { id: 'bl-e1', type: 'baylabel', x: 1, y: 14, props: { text: 'EXAM 1 · 병변 진단', highlight: true } },
    { id: 'o-e1-bed', type: 'ibed', x: 2, y: 16, props: { variant: 'ward', occupied: true } },
    { id: 'o-e1-derm', type: 'dermatoscope', x: 6, y: 16, props: { w: 1, h: 2 } },
    { id: 'o-e1-wood', type: 'woodslamp', x: 8, y: 17 },
    { id: 'o-e1-mon', type: 'imonitor', x: 10, y: 16 },
    { id: 'o-e1-recep', type: 'ireception', x: 9, y: 20, props: { w: 3, h: 1, label: '진료' } },
    { id: 'o-e1-chart', type: 'lesionchart', x: 1, y: 22, props: { w: 2 } },

    // ════════ 제2진료실 (y14-24) ════════
    { id: 'bl-e2', type: 'baylabel', x: 14, y: 14, props: { text: 'EXAM 2' } },
    { id: 'o-e2-bed', type: 'ibed', x: 15, y: 16, props: { variant: 'ward' } },
    { id: 'o-e2-derm', type: 'dermatoscope', x: 19, y: 16, props: { w: 1, h: 2 } },
    { id: 'o-e2-recep', type: 'ireception', x: 22, y: 20, props: { w: 3, h: 1, label: '진료' } },
    { id: 'o-e2-mon', type: 'imonitor', x: 25, y: 16 },
    { id: 'o-e2-skin', type: 'skinanatomy', x: 24, y: 14 },
    { id: 'o-e2-chair', type: 'ichair', x: 20, y: 22, props: { color: '#F0E6EA', facing: 'up' } },
    { id: 'o-e2-plant', type: 'iplant', x: 26, y: 23 },

    // ════════ 광선 치료실 (y26-36) ════════
    { id: 'bl-photo', type: 'baylabel', x: 1, y: 26, props: { text: 'PHOTOTHERAPY · 광선 치료실', highlight: true } },
    { id: 'o-ph-booth', type: 'uvbooth', x: 3, y: 29, props: { w: 2, h: 3 } },
    { id: 'o-ph-hand', type: 'handuvbox', x: 9, y: 31, props: { w: 1, h: 1 } },
    { id: 'o-ph-goggle', type: 'gogglesanitizer', x: 12, y: 29, props: { w: 1, h: 1 } },
    { id: 'o-ph-console', type: 'ireception', x: 15, y: 31, props: { w: 4, h: 1, label: '조사 콘솔' } },
    { id: 'o-ph-mon', type: 'imonitor', x: 19, y: 30 },
    { id: 'o-ph-sofa', type: 'sofa', x: 22, y: 33, props: { w: 3, h: 2, color: '#C9B0D8' } },
    { id: 'o-ph-plant', type: 'iplant', x: 25, y: 29 },

    // ════════ 소수술 · 레이저 처치실 (laser, y38-50) ════════
    { id: 'bl-laser', type: 'baylabel', x: 1, y: 38, props: { text: 'MINOR SURGERY · LASER', highlight: true } },
    { id: 'o-ls-light', type: 'surgicallight', x: 6, y: 39 },
    { id: 'o-ls-chair', type: 'ibed', x: 4, y: 41, props: { variant: 'or', occupied: true } },
    { id: 'o-ls-kit', type: 'biopsykit', x: 8, y: 41, props: { w: 1, h: 1 } },
    { id: 'o-ls-bottle', type: 'biopsybottle', x: 10, y: 44 },
    { id: 'o-ls-cryo', type: 'cryotank', x: 13, y: 41, props: { w: 1, h: 2 } },
    { id: 'o-ls-laser', type: 'co2laser', x: 16, y: 42, props: { w: 1, h: 2 } },
    { id: 'o-ls-dress', type: 'dressing', x: 20, y: 41, props: { w: 2, h: 1 } },
    { id: 'o-ls-cab', type: 'icabinet', x: 23, y: 39, props: { w: 4, h: 1, variant: 'sterile', label: 'STERILE' } },
    { id: 'o-ls-waste', type: 'wastebin', x: 23, y: 44, props: { tone: 'infectious' } },
    { id: 'o-ls-plant', type: 'iplant', x: 25, y: 48 },
  ],
  hotspots: [
    { id: 'hs-history', kind: 'quest', x: 4, y: 5, label: '발진 히스토리 문진' },
    { id: 'hs-atopy', kind: 'info', x: 19, y: 5, label: '아토피 대기 환자' },
    { id: 'hs-abcd', kind: 'quest', x: 3, y: 16, label: '점 ABCD 사정' },
    { id: 'hs-uvset', kind: 'quest', x: 15, y: 31, label: 'UV 강도·시간 세팅' },
    { id: 'hs-uvbooth', kind: 'info', x: 4, y: 29, label: '전신 UVB 부스' },
    { id: 'hs-biopsy', kind: 'quest', x: 5, y: 41, label: '펀치 생검 처치' },
  ],
  npcs: [
    // lobby
    { id: 'dm-lb-n', kind: 'nurse', mode: 'idle', seed: 801, start: { x: 4, y: 6 } },
    { id: 'dm-lb-p1', kind: 'patient', mode: 'idle', seed: 802, start: { x: 19, y: 5 } },
    { id: 'dm-lb-p2', kind: 'patient', mode: 'idle', seed: 803, start: { x: 23, y: 5 } },
    { id: 'dm-lb-v', kind: 'visitor', mode: 'idle', seed: 804, start: { x: 20, y: 10 } },
    // exam1
    { id: 'dm-e1-d', kind: 'doctor', mode: 'idle', seed: 805, start: { x: 4, y: 19 } },
    { id: 'dm-e1-n', kind: 'nurse', mode: 'idle', seed: 806, start: { x: 10, y: 22 } },
    // exam2
    { id: 'dm-e2-d', kind: 'doctor', mode: 'idle', seed: 807, start: { x: 17, y: 22 } },
    // photo
    { id: 'dm-ph-n', kind: 'nurse', mode: 'idle', seed: 808, start: { x: 16, y: 33 } },
    { id: 'dm-ph-p', kind: 'patient', mode: 'idle', seed: 809, start: { x: 6, y: 33 } },
    // laser
    { id: 'dm-ls-s', kind: 'surgeon', mode: 'idle', seed: 810, start: { x: 5, y: 43 } },
    { id: 'dm-ls-n', kind: 'nurse', mode: 'idle', seed: 811, start: { x: 8, y: 44 } },
  ],
};
