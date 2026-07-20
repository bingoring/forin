// WOMEN & KIDS OPD — 소아·산부인과 외래 + 키즈 놀이광장 (여성소아 센터 1F). 1:1
// port of the v16 handoff master blueprint (design-handoff_v16/reference/
// interior-womenkids-opd.jsx): 28×40 tiles, peds tone, TOP campus door. v16 이
// 인테리어가 기존 monolithic peds 센터(외래+병동+NICU)의 **1F 외래 부분을 대체**
// (병동→WOMEN 2F, NICU→4F로 분리 예정). 로비·접수·계측 → 키즈 놀이광장 → 소아
// 청소년과 외래 → 산부인과 외래 + 초음파실. 신규 오브젝트는 FetalMonitor 1종뿐,
// 나머지는 peds 완구/clinic/shared 재사용. Markers label-only.
import type { Interior } from '@engine';

export const WOMENKIDS_INTERIOR: Interior = {
  id: 'INT-WOMENKIDS-OPD-00001',
  deptId: 'DEPT-WOMENKIDS-OPD-00001',
  cols: 28,
  rows: 40,
  floorTheme: 'peds',
  scale: 0.9,
  playerStart: { x: 4, y: 8 }, // lobby by the ↓ 캠퍼스/엘리베이터 door
  regions: [
    { id: 'play', name: '키즈 놀이광장', icon: '🛝', bounds: { x: 0, y: 9, w: 14, h: 16 } },
    { id: 'pedopd', name: '소아청소년과 외래', icon: '🧸', bounds: { x: 13, y: 9, w: 15, h: 16 } },
    { id: 'obopd', name: '산부인과 외래', icon: '🤰', bounds: { x: 0, y: 24, w: 15, h: 16 } },
    { id: 'usroom', name: '초음파실', icon: '📡', bounds: { x: 14, y: 24, w: 14, h: 16 } },
    { id: 'lobby', name: '로비 · 접수 · 계측', icon: '🎈', bounds: { x: 0, y: 0, w: 28, h: 10 } },
  ],
  rooms: [
    { id: 'lobby', name: '로비·접수', sub: '계측·대기', icon: '🎈', color: '#FBCFE8', x: 6, y: 5 },
    { id: 'play', name: '키즈 광장', sub: '놀이·대기', icon: '🛝', color: '#FDE68A', x: 6, y: 17 },
    { id: 'pedopd', name: '소아 외래', sub: '진찰·성장', icon: '🧸', color: '#BAE6FD', x: 20, y: 17 },
    { id: 'obopd', name: '산부인과 외래', sub: '산전 진찰', icon: '🤰', color: '#A7F3D0', x: 6, y: 32 },
    { id: 'usroom', name: '초음파실', sub: '태아 초음파', icon: '📡', color: '#DDD6FE', x: 21, y: 32 },
  ],
  collision: [
    // outer walls — TOP 캠퍼스/엘리베이터 door gap x12-14
    { x: 0, y: 0, w: 12, h: 1 }, { x: 15, y: 0, w: 13, h: 1 },
    { x: 0, y: 1, w: 1, h: 38 }, { x: 27, y: 1, w: 1, h: 38 },
    { x: 0, y: 39, w: 28, h: 1 },
    // lobby | mid divider (y9) — thresholds x6-7 (→놀이) / x13-14 (→소아외래)
    { x: 1, y: 9, w: 5, h: 1 }, { x: 8, y: 9, w: 5, h: 1 }, { x: 15, y: 9, w: 12, h: 1 },
    // play | pedopd vertical divider (x13)
    { x: 13, y: 10, w: 1, h: 15 },
    // mid | lower divider (y24) — thresholds x6-7 (→산부인과) / x14-15 (→초음파)
    { x: 1, y: 24, w: 5, h: 1 }, { x: 8, y: 24, w: 6, h: 1 }, { x: 16, y: 24, w: 11, h: 1 },
    // obopd | usroom vertical divider (x14)
    { x: 14, y: 25, w: 1, h: 14 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-campus', type: 'door', x: 12, y: 0, props: { w: 3, h: 1, kind: 'auto', label: '↓ 캠퍼스/엘리베이터' } },
    { id: 'th-play', type: 'threshold', x: 6, y: 9, props: { w: 2, h: 1, label: '→ 놀이광장' } },
    { id: 'th-ped', type: 'threshold', x: 13, y: 9, props: { w: 2, h: 1, label: '→ 소아 외래' } },
    { id: 'th-ob', type: 'threshold', x: 6, y: 24, props: { w: 2, h: 1, label: '→ 산부인과' } },
    { id: 'th-us', type: 'threshold', x: 14, y: 24, props: { w: 2, h: 1, label: '→ 초음파' } },

    // ════════ 로비 · 접수 · 계측 (lobby, y1-8) ════════
    { id: 'bl-lobby', type: 'baylabel', x: 1, y: 1, props: { text: 'LOBBY · 접수 · 계측', highlight: true } },
    { id: 'o-lb-recep', type: 'clinicReception', x: 2, y: 3, props: { w: 5, h: 2, tone: '#DB2777', label: '접수' } },
    { id: 'o-lb-scale', type: 'babyscale', x: 9, y: 3 },
    { id: 'o-lb-stad', type: 'stadiometer', x: 12, y: 2 },
    { id: 'o-lb-water', type: 'watercooler', x: 16, y: 2 },
    { id: 'o-lb-ch1', type: 'ichair', x: 18, y: 5, props: { color: '#FBCFE8', facing: 'up' } },
    { id: 'o-lb-ch2', type: 'ichair', x: 20, y: 5, props: { color: '#BAE6FD', facing: 'up' } },
    { id: 'o-lb-ch3', type: 'ichair', x: 22, y: 5, props: { color: '#FDE68A', facing: 'up' } },
    { id: 'o-lb-ch4', type: 'ichair', x: 24, y: 5, props: { color: '#A7F3D0', facing: 'up' } },

    // ════════ 키즈 놀이광장 (play, y10-23) ════════
    { id: 'bl-play', type: 'baylabel', x: 1, y: 10, props: { text: 'KIDS PLAZA · 놀이광장' } },
    { id: 'o-pl-mat', type: 'playmat', x: 1, y: 12, props: { w: 11, h: 10 } },
    { id: 'o-pl-slide', type: 'smallslide', x: 2, y: 13 },
    { id: 'o-pl-horse', type: 'rockinghorse', x: 8, y: 13 },
    { id: 'o-pl-chest', type: 'toychest', x: 9, y: 18 },
    { id: 'o-pl-blocks', type: 'blocks', x: 4, y: 18 },
    { id: 'o-pl-mural', type: 'mural', x: 2, y: 10, props: { w: 3 } },
    { id: 'o-pl-plant', type: 'iplant', x: 11, y: 21 },

    // ════════ 소아청소년과 외래 (pedopd, y10-23) ════════
    { id: 'bl-ped', type: 'baylabel', x: 14, y: 10, props: { text: 'PEDIATRIC OPD · 소아 진료', highlight: true } },
    { id: 'o-pd-bed1', type: 'ibed', x: 15, y: 12, props: { variant: 'ward', occupied: true, label: '진찰 1' } },
    { id: 'o-pd-recep1', type: 'ireception', x: 18, y: 12, props: { w: 3, h: 1, label: '진료' } },
    { id: 'o-pd-tongue', type: 'tonguejar', x: 21, y: 11 },
    { id: 'o-pd-sticker', type: 'stickerroll', x: 23, y: 11 },
    { id: 'o-pd-bed2', type: 'ibed', x: 15, y: 18, props: { variant: 'peds', occupied: true, label: '진찰 2' } },
    { id: 'o-pd-recep2', type: 'ireception', x: 18, y: 18, props: { w: 3, h: 1 } },
    { id: 'o-pd-chair', type: 'ichair', x: 22, y: 19, props: { color: '#BAE6FD', facing: 'left' } },
    { id: 'o-pd-plant', type: 'iplant', x: 25, y: 22 },

    // ════════ 산부인과 외래 (obopd, y25-38) ════════
    { id: 'bl-ob', type: 'baylabel', x: 1, y: 25, props: { text: 'OB/GYN OPD · 산전 진찰', highlight: true } },
    { id: 'o-ob-bed', type: 'ibed', x: 2, y: 28, props: { variant: 'ward', occupied: true, label: '산전 진찰' } },
    { id: 'o-ob-fetal', type: 'fetalmonitor', x: 5, y: 28, props: { w: 2, h: 2 } },
    { id: 'o-ob-recep', type: 'ireception', x: 8, y: 29, props: { w: 3, h: 1, label: '진료' } },
    { id: 'o-ob-chair', type: 'ichair', x: 11, y: 30, props: { color: '#A7F3D0', facing: 'left' } },
    { id: 'o-ob-plant', type: 'iplant', x: 12, y: 36 },

    // ════════ 초음파실 (usroom, y25-38) ════════
    { id: 'bl-us', type: 'baylabel', x: 15, y: 25, props: { text: 'ULTRASOUND · 초음파실' } },
    { id: 'o-us-bed', type: 'ibed', x: 16, y: 28, props: { variant: 'ward', occupied: true, label: '초음파 베드' } },
    { id: 'o-us-cart', type: 'ultrasound', x: 20, y: 28 },
    { id: 'o-us-mon', type: 'imonitor', x: 19, y: 27 },
    { id: 'o-us-plant', type: 'iplant', x: 25, y: 36 },
  ],
  hotspots: [
    { id: 'hs-growth', kind: 'quest', x: 3, y: 3, label: '영유아 성장 계측', scenarioId: 'SCN-WOMENKIDS-00001' },
    { id: 'hs-play', kind: 'quest', x: 5, y: 15, label: '놀이·대기', scenarioId: 'SCN-WOMENKIDS-00002' },
    { id: 'hs-pedexam', kind: 'quest', x: 16, y: 12, label: '소아 진찰·성장상담', scenarioId: 'SCN-WOMENKIDS-00003' },
    { id: 'hs-antenatal', kind: 'quest', x: 3, y: 28, label: '산전 진찰·상담', scenarioId: 'SCN-WOMENKIDS-00004' },
    { id: 'hs-usscan', kind: 'quest', x: 17, y: 28, label: '태아 초음파', scenarioId: 'SCN-WOMENKIDS-00005' },
  ],
  npcs: [
    // lobby
    { id: 'wk-lb-n', kind: 'nurse', mode: 'idle', seed: 841, start: { x: 4, y: 5 }, marker: 'quest', markerLabel: '성장통 상담', scenarioId: 'SCN-WOMENKIDS-00006' },
    { id: 'wk-lb-p', kind: 'parent', mode: 'idle', seed: 842, start: { x: 19, y: 6 }, marker: 'quest', markerLabel: '발달 지연 상담', scenarioId: 'SCN-WOMENKIDS-00007' },
    { id: 'wk-lb-c', kind: 'child', mode: 'idle', seed: 843, start: { x: 21, y: 6 }, marker: 'quest', markerLabel: '야뇨증 상담', scenarioId: 'SCN-WOMENKIDS-00008' },
    // play
    { id: 'wk-pl-c1', kind: 'child', mode: 'idle', seed: 844, start: { x: 4, y: 16 }, marker: 'quest', markerLabel: '소아 비만 상담', scenarioId: 'SCN-WOMENKIDS-00009' },
    { id: 'wk-pl-c2', kind: 'child', mode: 'idle', seed: 845, start: { x: 6, y: 19 }, marker: 'quest', markerLabel: '사춘기 건강 상담', scenarioId: 'SCN-WOMENKIDS-00010' },
    { id: 'wk-pl-p', kind: 'parent', mode: 'idle', seed: 846, start: { x: 9, y: 16 }, marker: 'quest', markerLabel: 'ADHD 부모 상담', scenarioId: 'SCN-WOMENKIDS-00011' },
    // pedopd
    { id: 'wk-pd-d', kind: 'doctor', mode: 'idle', seed: 847, start: { x: 17, y: 15 }, marker: 'quest', markerLabel: '식품 알레르기 관리', scenarioId: 'SCN-WOMENKIDS-00012' },
    { id: 'wk-pd-c', kind: 'child', mode: 'idle', seed: 848, start: { x: 19, y: 20 } },
    { id: 'wk-pd-p', kind: 'parent', mode: 'idle', seed: 849, start: { x: 21, y: 20 } },
    // obopd
    { id: 'wk-ob-d', kind: 'doctor', mode: 'idle', seed: 850, start: { x: 7, y: 32 } },
    { id: 'wk-ob-p', kind: 'parent', mode: 'idle', seed: 851, start: { x: 3, y: 32 } },
    // usroom
    { id: 'wk-us-d', kind: 'doctor', mode: 'idle', seed: 852, start: { x: 18, y: 32 } },
  ],
};
