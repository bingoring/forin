// OR — Operating Suite (OR & PACU). A 1:1 port of the handoff master blueprint
// (design-handoff_v9/reference/interior-or.jsx): 40×52 tiles with strict 3-stage
// zoning (unrestricted → semi-restricted → restricted/positive-pressure):
//   비제한: 보호자 대기실 · 탈의실/락커룸
//   준제한: Pre-Op Holding · Clean/Dirty Utility · PACU 회복실(+nurse desk)
//   제한(양압): OR 1(일반/정형) · Scrub · OR 2(복강경/로봇)
// Restricted (OR) entries use blue `sterile` thresholds (gowning required).
import type { Interior } from '@engine';

export const OR_INTERIOR: Interior = {
  id: 'INT-OR-00001',
  deptId: 'DEPT-OR-00001',
  cols: 40,
  rows: 52,
  floorTheme: 'sterile',
  playerStart: { x: 7, y: 40 },
  regions: [
    { id: 'family', name: '보호자 대기실 (비제한)', icon: '🪑', bounds: { x: 0, y: 0, w: 20, h: 15 } },
    { id: 'locker', name: '탈의실 · 락커룸 (비제한)', icon: '🧥', bounds: { x: 19, y: 0, w: 21, h: 15 } },
    { id: 'preop', name: '수술 전 대기실 (준제한)', icon: '💤', bounds: { x: 0, y: 14, w: 14, h: 18 } },
    { id: 'clean', name: 'Clean Utility · 멸균물품', icon: '📦', bounds: { x: 13, y: 14, w: 8, h: 9 } },
    { id: 'dirty', name: 'Dirty Utility · 오염반출', icon: '☣', bounds: { x: 13, y: 22, w: 8, h: 10 } },
    { id: 'pacu', name: '회복실 PACU (준제한)', icon: '❤', bounds: { x: 20, y: 14, w: 20, h: 18 } },
    { id: 'or1', name: '제1수술실 (제한·양압)', icon: '🔪', bounds: { x: 0, y: 31, w: 16, h: 21 } },
    { id: 'scrub', name: '스크럽 스테이션', icon: '🚿', bounds: { x: 15, y: 31, w: 9, h: 21 } },
    { id: 'or2', name: '제2수술실 (복강경/로봇)', icon: '🤖', bounds: { x: 23, y: 31, w: 17, h: 21 } },
  ],
  rooms: [
    { id: 'family', name: '보호자 대기실', sub: '비제한 구역', icon: '🪑', color: '#FED7AA', x: 10, y: 7 },
    { id: 'locker', name: '탈의실·락커룸', sub: '수술복 착용', icon: '🧥', color: '#BAE6FD', x: 28, y: 7 },
    { id: 'preop', name: 'Pre-Op 대기', sub: '수술 전 확인', icon: '💤', color: '#FBCFE8', x: 5, y: 20 },
    { id: 'clean', name: 'Clean Utility', sub: '멸균 물품', icon: '📦', color: '#A7F3D0', x: 16, y: 18 },
    { id: 'dirty', name: 'Dirty Utility', sub: '오염 반출', icon: '☣', color: '#FDE68A', x: 16, y: 27 },
    { id: 'pacu', name: 'PACU 회복실', sub: '술 후 모니터링', icon: '❤', color: '#A7F3D0', x: 24, y: 20 },
    { id: 'or1', name: 'OR 1', sub: '일반/정형', icon: '🔪', color: '#DDD6FE', x: 7, y: 39 },
    { id: 'scrub', name: '스크럽', sub: '손 소독 5분', icon: '🚿', color: '#BAE6FD', x: 18, y: 39 },
    { id: 'or2', name: 'OR 2', sub: '복강경/로봇', icon: '🤖', color: '#C7D2FE', x: 31, y: 39 },
  ],
  collision: [
    // outer walls (top campus door x17-20 is a gap)
    { x: 0, y: 0, w: 17, h: 1 }, { x: 21, y: 0, w: 19, h: 1 },
    { x: 0, y: 1, w: 1, h: 50 }, { x: 39, y: 1, w: 1, h: 50 }, { x: 0, y: 51, w: 40, h: 1 },
    // divider y14 (unrestricted / semi) — thresholds x5-7 / x17-19 / x29-31
    { x: 1, y: 14, w: 4, h: 1 }, { x: 8, y: 14, w: 9, h: 1 }, { x: 20, y: 14, w: 9, h: 1 }, { x: 32, y: 14, w: 7, h: 1 },
    // divider y31 (semi / restricted — STERILE) — thresholds x5-7 / x17-19 / x29-31
    { x: 1, y: 31, w: 4, h: 1 }, { x: 8, y: 31, w: 9, h: 1 }, { x: 20, y: 31, w: 9, h: 1 }, { x: 32, y: 31, w: 7, h: 1 },
    // vertical preop|utility x13 (gap y18-20)
    { x: 13, y: 15, w: 1, h: 3 }, { x: 13, y: 21, w: 1, h: 11 },
    // vertical utility|pacu x20 (gap y19-21)
    { x: 20, y: 15, w: 1, h: 4 }, { x: 20, y: 22, w: 1, h: 10 },
    // clean|dirty y22 (gap x16-17)
    { x: 14, y: 22, w: 2, h: 1 }, { x: 18, y: 22, w: 2, h: 1 },
    // family|locker x19 (gap y6-8)
    { x: 19, y: 1, w: 1, h: 5 }, { x: 19, y: 9, w: 1, h: 5 },
    // or1|scrub x15 (gap y36-38)
    { x: 15, y: 32, w: 1, h: 4 }, { x: 15, y: 39, w: 1, h: 12 },
    // scrub|or2 x23 (gap y36-38)
    { x: 23, y: 32, w: 1, h: 4 }, { x: 23, y: 39, w: 1, h: 12 },
  ],
  objects: [
    // restricted-OR green ambience tints (non-blocking)
    { id: 't-or1', type: 'tint', x: 1, y: 32, props: { w: 14, h: 19, color: '#CDE3D6', op: 0.28 } },
    { id: 't-or2', type: 'tint', x: 24, y: 32, props: { w: 15, h: 19, color: '#CDE3D6', op: 0.28 } },
    // exterior auto door (campus)
    { id: 'd-campus', type: 'door', x: 17, y: 0, props: { w: 4, kind: 'auto', label: '↓ 캠퍼스로' } },
    // thresholds (y14)
    { id: 'th-y14-a', type: 'threshold', x: 5, y: 14, props: { w: 3, h: 1, label: '→ Pre-Op' } },
    { id: 'th-y14-b', type: 'threshold', x: 17, y: 14, props: { w: 3, h: 1, label: '→ 복도' } },
    { id: 'th-y14-c', type: 'threshold', x: 29, y: 14, props: { w: 3, h: 1, label: '→ PACU' } },
    // thresholds (y31 — sterile gowning)
    { id: 'th-y31-a', type: 'threshold', x: 5, y: 31, props: { w: 3, h: 1, tone: 'sterile', label: 'STERILE → OR1' } },
    { id: 'th-y31-b', type: 'threshold', x: 17, y: 31, props: { w: 3, h: 1, tone: 'sterile', label: '→ 스크럽' } },
    { id: 'th-y31-c', type: 'threshold', x: 29, y: 31, props: { w: 3, h: 1, tone: 'sterile', label: 'STERILE → OR2' } },
    // vertical thresholds
    { id: 'th-x13', type: 'threshold', x: 13, y: 18, props: { w: 1, h: 3 } },
    { id: 'th-x20', type: 'threshold', x: 20, y: 19, props: { w: 1, h: 3 } },
    { id: 'th-cd', type: 'threshold', x: 16, y: 22, props: { w: 2, h: 1 } },
    { id: 'th-fl', type: 'threshold', x: 19, y: 6, props: { w: 1, h: 3 } },
    { id: 'th-x15', type: 'threshold', x: 15, y: 36, props: { w: 1, h: 3, tone: 'sterile' } },
    { id: 'th-x23', type: 'threshold', x: 23, y: 36, props: { w: 1, h: 3, tone: 'sterile' } },

    // ════════════ 보호자 대기실 (family) ════════════
    { id: 'bl-fam', type: 'baylabel', x: 1, y: 1, props: { text: '보호자 대기실 · WAITING' } },
    { id: 'o-fam-tv', type: 'walltv', x: 9, y: 1, props: { w: 2 } },
    { id: 'o-fam-sofa1', type: 'sofa', x: 2, y: 4, props: { w: 3, h: 1, color: '#9CB4C8' } },
    { id: 'o-fam-sofa2', type: 'sofa', x: 2, y: 9, props: { w: 3, h: 1, color: '#C0A6B8' } },
    { id: 'o-fam-table', type: 'coffeetable', x: 3, y: 6, props: { w: 2 } },
    { id: 'o-fam-ch-a0', type: 'ichair', x: 10, y: 5, props: { color: '#FED7AA', facing: 'down' } },
    { id: 'o-fam-ch-a1', type: 'ichair', x: 12, y: 5, props: { color: '#FED7AA', facing: 'down' } },
    { id: 'o-fam-ch-a2', type: 'ichair', x: 14, y: 5, props: { color: '#FED7AA', facing: 'down' } },
    { id: 'o-fam-ch-a3', type: 'ichair', x: 16, y: 5, props: { color: '#FED7AA', facing: 'down' } },
    { id: 'o-fam-ch-b0', type: 'ichair', x: 10, y: 9, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-fam-ch-b1', type: 'ichair', x: 12, y: 9, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-fam-ch-b2', type: 'ichair', x: 14, y: 9, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-fam-ch-b3', type: 'ichair', x: 16, y: 9, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-fam-wcool', type: 'watercooler', x: 17, y: 3 },
    { id: 'o-fam-plant', type: 'iplant', x: 17, y: 11 },

    // ════════════ 탈의실 · 락커룸 (locker) ════════════
    { id: 'bl-lk', type: 'baylabel', x: 20, y: 1, props: { text: '탈의실 · LOCKER' } },
    { id: 'o-lk-c1', type: 'icabinet', x: 21, y: 3, props: { w: 3, h: 1, variant: 'linen', label: 'GOWN' } },
    { id: 'o-lk-c2', type: 'icabinet', x: 25, y: 3, props: { w: 3, h: 1, variant: 'linen' } },
    { id: 'o-lk-c3', type: 'icabinet', x: 29, y: 3, props: { w: 3, h: 1, variant: 'linen' } },
    { id: 'o-lk-c4', type: 'icabinet', x: 33, y: 3, props: { w: 3, h: 1, variant: 'linen' } },
    { id: 'o-lk-c5', type: 'icabinet', x: 21, y: 6, props: { w: 3, h: 1, variant: 'linen' } },
    { id: 'o-lk-c6', type: 'icabinet', x: 25, y: 6, props: { w: 3, h: 1, variant: 'linen' } },
    { id: 'o-lk-san', type: 'sanitizer', x: 37, y: 3 },
    { id: 'o-lk-ch0', type: 'ichair', x: 22, y: 10, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-lk-ch1', type: 'ichair', x: 24, y: 10, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-lk-ch2', type: 'ichair', x: 26, y: 10, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-lk-ch3', type: 'ichair', x: 28, y: 10, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-lk-plant', type: 'iplant', x: 37, y: 11 },

    // ════════════ PRE-OP HOLDING (preop) ════════════
    { id: 'bl-preop', type: 'baylabel', x: 1, y: 15, props: { text: 'PRE-OP HOLDING', highlight: true } },
    { id: 'o-po1-bed', type: 'ibed', x: 2, y: 17, props: { variant: 'ward', occupied: true } },
    { id: 'o-po1-mon', type: 'imonitor', x: 1, y: 17, props: { beep: true } },
    { id: 'o-po1-comp', type: 'compcart', x: 5, y: 16 },
    { id: 'o-po1-consent', type: 'consentclipboard', x: 2, y: 20 },
    { id: 'o-po3-bed', type: 'ibed', x: 8, y: 17, props: { variant: 'ward', occupied: true } },
    { id: 'o-po3-iv', type: 'iiv', x: 10, y: 17 },
    { id: 'o-po3-mon', type: 'imonitor', x: 11, y: 17 },
    { id: 'o-po-curtain', type: 'icurtain', x: 1, y: 21, props: { w: 11, h: 1, color: '#A7C7E7' } },
    { id: 'o-po2-bed', type: 'ibed', x: 2, y: 23, props: { variant: 'ward', occupied: true } },
    { id: 'o-po2-iv', type: 'iiv', x: 5, y: 23 },
    { id: 'o-po2-bair', type: 'bairhugger', x: 6, y: 25 },
    { id: 'o-po-plant', type: 'iplant', x: 11, y: 29 },

    // ════════════ CLEAN UTILITY (clean) ════════════
    { id: 'bl-clean', type: 'baylabel', x: 14, y: 15, props: { text: 'CLEAN UTILITY' } },
    { id: 'o-cl-c1', type: 'icabinet', x: 14, y: 17, props: { w: 5, h: 1, variant: 'sterile', label: 'STERILE' } },
    { id: 'o-cl-c2', type: 'icabinet', x: 14, y: 19, props: { w: 5, h: 1, variant: 'sterile' } },
    { id: 'o-cl-c3', type: 'icabinet', x: 14, y: 20, props: { w: 5, h: 1, variant: 'supply' } },

    // ════════════ DIRTY UTILITY (dirty) ════════════
    { id: 'bl-dirty', type: 'baylabel', x: 14, y: 23, props: { text: 'DIRTY UTILITY · 오염' } },
    { id: 'o-dt-c1', type: 'soiledcart', x: 14, y: 26 },
    { id: 'o-dt-c2', type: 'soiledcart', x: 17, y: 26 },
    { id: 'o-dt-wb1', type: 'wastebin', x: 14, y: 29, props: { tone: 'infectious' } },
    { id: 'o-dt-wb2', type: 'wastebin', x: 18, y: 29, props: { tone: 'infectious' } },

    // ════════════ PACU 회복실 (pacu) ════════════
    { id: 'bl-pacu', type: 'baylabel', x: 21, y: 15, props: { text: 'PACU · RECOVERY' } },
    { id: 'o-pacu1-bed', type: 'ibed', x: 22, y: 17, props: { variant: 'ward', occupied: true } },
    { id: 'o-pacu2-bed', type: 'ibed', x: 26, y: 17, props: { variant: 'ward', occupied: true } },
    { id: 'o-pacu3-bed', type: 'ibed', x: 30, y: 17, props: { variant: 'ward', occupied: true } },
    { id: 'o-pacu4-bed', type: 'ibed', x: 34, y: 17, props: { variant: 'ward' } },
    { id: 'o-pacu1-mon', type: 'imonitor', x: 21, y: 17, props: { beep: true } },
    { id: 'o-pacu2-mon', type: 'imonitor', x: 25, y: 17, props: { beep: true } },
    { id: 'o-pacu3-mon', type: 'imonitor', x: 29, y: 17 },
    { id: 'o-pacu4-mon', type: 'imonitor', x: 33, y: 17 },
    { id: 'o-pacu-suction', type: 'suction', x: 29, y: 20 },
    { id: 'o-pacu-bair', type: 'bairhugger', x: 28, y: 19 },
    { id: 'o-pacu-bank', type: 'bankofmonitors', x: 30, y: 22 },
    { id: 'o-pacu-desk', type: 'nursedeski', x: 30, y: 24, props: { w: 4, h: 2 } },
    { id: 'o-pacu-comp', type: 'compcart', x: 34, y: 24 },
    { id: 'o-pacu-crash', type: 'crashcart', x: 36, y: 25 },
    { id: 'o-pacu-plant', type: 'iplant', x: 37, y: 29 },

    // ════════════ OR 1 · GENERAL/ORTHO (or1) ════════════
    { id: 'bl-or1', type: 'baylabel', x: 1, y: 32, props: { text: 'OR 1 · GENERAL/ORTHO', highlight: true } },
    { id: 'o-or1-light', type: 'surgicallight', x: 7, y: 34 },
    { id: 'o-or1-boom', type: 'orboommonitor', x: 11, y: 34, props: { w: 2 } },
    { id: 'o-or1-bed', type: 'ibed', x: 6, y: 37, props: { variant: 'or', occupied: true } },
    { id: 'o-or1-anes', type: 'anesthesia', x: 4, y: 36 },
    { id: 'o-or1-mon', type: 'imonitor', x: 3, y: 37, props: { beep: true } },
    { id: 'o-or1-tray', type: 'instrumenttray', x: 9, y: 38 },
    { id: 'o-or1-bovie', type: 'bovie', x: 12, y: 38 },
    { id: 'o-or1-iv', type: 'iiv', x: 4, y: 41 },
    { id: 'o-or1-kick', type: 'kickbucket', x: 8, y: 41 },
    { id: 'o-or1-cab1', type: 'icabinet', x: 1, y: 34, props: { w: 3, h: 1, variant: 'sterile', label: 'STERILE' } },
    { id: 'o-or1-cab2', type: 'icabinet', x: 1, y: 45, props: { w: 3, h: 1, variant: 'equipment' } },
    { id: 'o-or1-comp', type: 'compcart', x: 12, y: 42 },
    { id: 'o-or1-timeout', type: 'timeoutboard', x: 1, y: 48, props: { w: 3 } },

    // ════════════ SCRUB STATION (scrub) ════════════
    { id: 'bl-scrub', type: 'baylabel', x: 16, y: 32, props: { text: 'SCRUB' } },
    { id: 'o-sc-sink1', type: 'sinkor', x: 16, y: 35 },
    { id: 'o-sc-sink2', type: 'sinkor', x: 16, y: 40 },
    { id: 'o-sc-disp1', type: 'scrubdispenser', x: 19, y: 35 },
    { id: 'o-sc-disp2', type: 'scrubdispenser', x: 19, y: 40 },
    { id: 'o-sc-timer', type: 'scrubtimer', x: 20, y: 33 },

    // ════════════ OR 2 · LAP/ROBOTIC (or2) ════════════
    { id: 'bl-or2', type: 'baylabel', x: 24, y: 32, props: { text: 'OR 2 · LAP/ROBOTIC', highlight: true } },
    { id: 'o-or2-light', type: 'surgicallight', x: 30, y: 34 },
    { id: 'o-or2-boom', type: 'orboommonitor', x: 33, y: 34, props: { w: 2 } },
    { id: 'o-or2-bed', type: 'ibed', x: 29, y: 37, props: { variant: 'or', occupied: true } },
    { id: 'o-or2-anes', type: 'anesthesia', x: 27, y: 36 },
    { id: 'o-or2-mon', type: 'imonitor', x: 26, y: 37, props: { beep: true } },
    { id: 'o-or2-lap', type: 'laptower', x: 25, y: 37 },
    { id: 'o-or2-co2', type: 'co2insufflator', x: 26, y: 41 },
    { id: 'o-or2-robot', type: 'roboticconsole', x: 33, y: 42 },
    { id: 'o-or2-comp', type: 'compcart', x: 37, y: 44 },
    { id: 'o-or2-cab1', type: 'icabinet', x: 24, y: 34, props: { w: 3, h: 1, variant: 'sterile', label: 'STERILE' } },
    { id: 'o-or2-cab2', type: 'icabinet', x: 36, y: 34, props: { w: 3, h: 1, variant: 'drug' } },
    { id: 'o-or2-status', type: 'statusboard', x: 24, y: 49, props: { w: 6 } },
  ],
  hotspots: [
    { id: 'hs-fam', kind: 'info', x: 12, y: 6, label: '가족 대기', scenarioId: 'SCN-OR-00005' },
    { id: 'hs-lk', kind: 'info', x: 24, y: 7, label: '수술복 착용' },
    { id: 'hs-po-id', kind: 'quest', x: 3, y: 17, label: '환자 확인 · ID', scenarioId: 'SCN-OR-00001' },
    { id: 'hs-po-anes', kind: 'info', x: 3, y: 23, label: '마취 면담' },
    { id: 'hs-clean', kind: 'info', x: 16, y: 18, label: '멸균 물품' },
    { id: 'hs-dirty', kind: 'info', x: 16, y: 25, label: '기구 반출 → SPD' },
    { id: 'hs-pacu-ho', kind: 'quest', x: 22, y: 17, label: '인계 Hand-off', scenarioId: 'SCN-OR-00004' },
    { id: 'hs-pacu-care', kind: 'info', x: 26, y: 17, label: '오한 케어 · O2' },
    { id: 'hs-pacu-desk', kind: 'info', x: 31, y: 25, label: 'PACU 데스크' },
    { id: 'hs-or1-pass', kind: 'quest', x: 7, y: 37, label: '기구 패스', scenarioId: 'SCN-OR-00003' },
    { id: 'hs-or1-count', kind: 'info', x: 13, y: 42, label: '카운트 (순회)' },
    { id: 'hs-scrub', kind: 'info', x: 17, y: 35, label: '5분 스크럽' },
    { id: 'hs-or2-robot', kind: 'quest', x: 33, y: 43, label: '로봇 콘솔', scenarioId: 'SCN-OR-00002' },
    { id: 'hs-or2-lap', kind: 'info', x: 29, y: 37, label: '복강경 화면' },
  ],
  npcs: [
    // family + locker
    { id: 'or-fam-par', kind: 'parent', mode: 'idle', seed: 101, start: { x: 11, y: 7 } },
    { id: 'or-fam-vis', kind: 'visitor', mode: 'idle', seed: 102, start: { x: 13, y: 7 } },
    { id: 'or-lk-n', kind: 'nurse', mode: 'idle', seed: 103, start: { x: 24, y: 8 } },
    { id: 'or-lk-s', kind: 'surgeon', mode: 'idle', seed: 104, start: { x: 30, y: 8 } },
    // preop
    { id: 'or-po1-n', kind: 'nurse', mode: 'idle', seed: 105, start: { x: 5, y: 19 } },
    { id: 'or-po2-d', kind: 'doctor', mode: 'idle', seed: 106, start: { x: 5, y: 25 } },
    // clean
    { id: 'or-cl-n', kind: 'nurse', mode: 'idle', seed: 107, start: { x: 16, y: 20 } },
    // pacu
    { id: 'or-pacu1-n1', kind: 'nurse', mode: 'idle', seed: 108, start: { x: 22, y: 20 } },
    { id: 'or-pacu1-n2', kind: 'nurse', mode: 'idle', seed: 109, start: { x: 24, y: 20 } },
    { id: 'or-pacu2-n', kind: 'nurse', mode: 'idle', seed: 110, start: { x: 26, y: 20 } },
    { id: 'or-pacu-d1', kind: 'nurse', mode: 'idle', seed: 111, start: { x: 31, y: 27 } },
    { id: 'or-pacu-d2', kind: 'nurse', mode: 'idle', seed: 112, start: { x: 33, y: 27 } },
    // OR1 team
    { id: 'or1-s1', kind: 'surgeon', mode: 'idle', seed: 113, start: { x: 5, y: 39 } },
    { id: 'or1-s2', kind: 'surgeon', mode: 'idle', seed: 114, start: { x: 7, y: 39 } },
    { id: 'or1-n', kind: 'nurse', mode: 'idle', seed: 115, start: { x: 9, y: 40 } },
    { id: 'or1-d', kind: 'doctor', mode: 'idle', seed: 116, start: { x: 4, y: 37 } },
    { id: 'or1-circ', kind: 'nurse', mode: 'idle', seed: 117, start: { x: 13, y: 43 } },
    // scrub
    { id: 'or-sc-s', kind: 'surgeon', mode: 'idle', seed: 118, start: { x: 17, y: 38 } },
    { id: 'or-sc-n', kind: 'nurse', mode: 'idle', seed: 119, start: { x: 17, y: 43 } },
    // OR2 team
    { id: 'or2-n', kind: 'nurse', mode: 'idle', seed: 120, start: { x: 31, y: 40 } },
    { id: 'or2-d', kind: 'doctor', mode: 'idle', seed: 121, start: { x: 27, y: 37 } },
    { id: 'or2-s', kind: 'surgeon', mode: 'idle', seed: 122, start: { x: 34, y: 45 } },
    { id: 'or2-n2', kind: 'nurse', mode: 'idle', seed: 123, start: { x: 37, y: 45 } },
  ],
};
