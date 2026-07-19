// NURSERY — 신생아실 Well-Baby Nursery. 1:1 port of the v16 handoff master
// blueprint (design-handoff_v16/reference/interior-nursery.jsx): 28×42 tiles,
// peds tone, LEFT elevator door. 손위생·가운 착의 → 신생아실 배시넷 존 → 신생아
// 사정·워머 → 수유·모유 수유실 + 가족 면회 관람창. Distinct from NICU (intensive
// care). Reuses the L&D catalog (bassinet/infantwarmer/nursingrecliner/
// warmercabinet) + psych ObsWindow + peds/or/icu/er/shared pieces (sinkor/
// scrubdispenser/gownbox/babyscale/phototherapy/milkfridge/compcart/sofa/
// coffeetable/icurtain/ireception/ichair/iplant). Markers are label-only.
import type { Interior } from '@engine';

export const NURSERY_INTERIOR: Interior = {
  id: 'INT-NURSERY-00001',
  deptId: 'DEPT-NURSERY-00001',
  cols: 28,
  rows: 42,
  floorTheme: 'peds',
  scale: 0.9,
  playerStart: { x: 4, y: 7 }, // hygiene entry by the ← elevator door
  regions: [
    { id: 'nursery', name: '신생아실 (배시넷 존)', icon: '🍼', bounds: { x: 0, y: 8, w: 19, h: 20 } },
    { id: 'admit', name: '신생아 사정 · 워머', icon: '🌡', bounds: { x: 18, y: 8, w: 10, h: 20 } },
    { id: 'feeding', name: '수유 · 모유 수유실', icon: '🤱', bounds: { x: 0, y: 27, w: 14, h: 15 } },
    { id: 'viewing', name: '면회 관람창', icon: '👀', bounds: { x: 13, y: 27, w: 15, h: 15 } },
    { id: 'entry', name: '손위생 · 가운 착의', icon: '🧼', bounds: { x: 0, y: 0, w: 28, h: 9 } },
  ],
  rooms: [
    { id: 'entry', name: '손위생·가운', sub: '출입 위생', icon: '🧼', color: '#A7F3D0', x: 5, y: 4 },
    { id: 'nursery', name: '신생아실', sub: '배시넷 관리', icon: '🍼', color: '#FBCFE8', x: 8, y: 17 },
    { id: 'admit', name: '사정 워머', sub: '입원 사정', icon: '🌡', color: '#FED7AA', x: 22, y: 17 },
    { id: 'feeding', name: '수유실', sub: '모유 수유', icon: '🤱', color: '#FDE68A', x: 6, y: 35 },
    { id: 'viewing', name: '관람창', sub: '가족 면회', icon: '👀', color: '#BAE6FD', x: 21, y: 35 },
  ],
  collision: [
    // outer walls — LEFT 엘리베이터 door gap y5-6
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 1, w: 1, h: 4 }, { x: 0, y: 7, w: 1, h: 34 },
    { x: 27, y: 1, w: 1, h: 40 },
    { x: 0, y: 41, w: 28, h: 1 },
    // entry | ward divider (y8) — sterile hygiene gate x6-7
    { x: 1, y: 8, w: 5, h: 1 }, { x: 8, y: 8, w: 19, h: 1 },
    // nursery | admit vertical divider (x18) — doorway y17-18 (handoff drew this
    // wall fully sealed, leaving admit unreachable; a nursery↔admit passage for the
    // newborn assessment flow is the faithful reachability fix)
    { x: 18, y: 9, w: 1, h: 8 }, { x: 18, y: 19, w: 1, h: 9 },
    // upper | lower divider (y27) — threshold x6-7 (→수유실), ObsWindow solid x13-17
    { x: 1, y: 27, w: 5, h: 1 }, { x: 8, y: 27, w: 5, h: 1 },
    { x: 13, y: 27, w: 5, h: 1 }, { x: 18, y: 27, w: 9, h: 1 },
    // viewing | feeding vertical divider (x13) — doorway y34-35 (handoff sealed
    // viewing too; families reach the viewing lounge from the lower public area)
    { x: 13, y: 28, w: 1, h: 6 }, { x: 13, y: 36, w: 1, h: 5 },
  ],
  objects: [
    // ── structural openings ──
    { id: 'd-elev', type: 'door', x: 0, y: 5, props: { w: 1, h: 2, kind: 'auto', label: '← 엘리베이터' } },
    { id: 'th-gate', type: 'threshold', x: 6, y: 8, props: { w: 2, h: 1, tone: 'sterile', label: '손위생 게이트' } },
    { id: 'th-feed', type: 'threshold', x: 6, y: 27, props: { w: 2, h: 1, label: '→ 수유실' } },
    { id: 'th-admit', type: 'threshold', x: 18, y: 17, props: { w: 1, h: 2, label: '→ 사정 워머' } },
    { id: 'th-view', type: 'threshold', x: 13, y: 34, props: { w: 1, h: 2, label: '→ 관람창' } },
    { id: 'o-obswin', type: 'obswindow', x: 13, y: 27, props: { w: 5 } },

    // ════════ 손위생 · 가운 착의 (entry, y1-7) ════════
    { id: 'bl-entry', type: 'baylabel', x: 1, y: 1, props: { text: 'HAND HYGIENE · 가운 착의', highlight: true } },
    { id: 'o-en-sink', type: 'sinkor', x: 2, y: 2 },
    { id: 'o-en-scrub', type: 'scrubdispenser', x: 6, y: 2 },
    { id: 'o-en-gown', type: 'gownbox', x: 9, y: 2 },
    { id: 'o-en-warm', type: 'warmercabinet', x: 13, y: 2 },
    { id: 'o-en-recep', type: 'ireception', x: 18, y: 3, props: { w: 4, h: 1, label: '신생아실 데스크' } },

    // ════════ 신생아실 배시넷 존 (nursery, y9-26) ════════
    { id: 'bl-nurs', type: 'baylabel', x: 1, y: 9, props: { text: 'WELL-BABY NURSERY · 배시넷', highlight: true } },
    { id: 'o-bs-a1', type: 'bassinet', x: 2, y: 11, props: { tag: 'A-1', w: 2, h: 2 } },
    { id: 'o-bs-a2', type: 'bassinet', x: 6, y: 11, props: { tag: 'A-2', w: 2, h: 2 } },
    { id: 'o-bs-a3', type: 'bassinet', x: 10, y: 11, props: { tag: 'A-3', w: 2, h: 2 } },
    { id: 'o-bs-a4', type: 'bassinet', x: 14, y: 11, props: { tag: 'A-4', w: 2, h: 2 } },
    { id: 'o-bs-b1', type: 'bassinet', x: 2, y: 16, props: { tag: 'B-1', w: 2, h: 2 } },
    { id: 'o-bs-b2', type: 'bassinet', x: 6, y: 16, props: { tag: 'B-2', w: 2, h: 2 } },
    { id: 'o-bs-b3', type: 'bassinet', x: 10, y: 16, props: { tag: 'B-3', w: 2, h: 2 } },
    { id: 'o-bs-b4', type: 'bassinet', x: 14, y: 16, props: { tag: 'B-4', w: 2, h: 2 } },
    { id: 'o-bs-c1', type: 'bassinet', x: 2, y: 21, props: { tag: 'C-1', w: 2, h: 2 } },
    { id: 'o-bs-c2', type: 'bassinet', x: 6, y: 21, props: { tag: 'C-2', w: 2, h: 2 } },
    { id: 'o-ns-comp', type: 'compcart', x: 11, y: 22 },

    // ════════ 신생아 사정 · 워머 (admit, y9-26) ════════
    { id: 'bl-admit', type: 'baylabel', x: 19, y: 9, props: { text: 'ADMISSION · 사정 워머' } },
    { id: 'o-ad-warmer', type: 'infantwarmer', x: 20, y: 12, props: { w: 2, h: 2 } },
    { id: 'o-ad-scale', type: 'babyscale', x: 23, y: 17 },
    { id: 'o-ad-cab', type: 'warmercabinet', x: 25, y: 11 },
    { id: 'o-ad-photo', type: 'phototherapy', x: 20, y: 20, props: { w: 2 } },
    { id: 'o-ad-plant', type: 'iplant', x: 25, y: 25 },

    // ════════ 수유 · 모유 수유실 (feeding, y28-40) ════════
    { id: 'bl-feed', type: 'baylabel', x: 1, y: 28, props: { text: 'LACTATION · 수유실' } },
    { id: 'o-fd-rec1', type: 'nursingrecliner', x: 2, y: 31, props: { w: 2, h: 2 } },
    { id: 'o-fd-rec2', type: 'nursingrecliner', x: 7, y: 31, props: { w: 2, h: 2 } },
    { id: 'o-fd-rec3', type: 'nursingrecliner', x: 2, y: 36, props: { w: 2, h: 2 } },
    { id: 'o-fd-milk', type: 'milkfridge', x: 10, y: 31 },
    { id: 'o-fd-curtain', type: 'icurtain', x: 6, y: 31, props: { w: 1, h: 8, color: '#FBD0E0' } },

    // ════════ 면회 관람창 (viewing, y28-40) ════════
    { id: 'bl-view', type: 'baylabel', x: 14, y: 28, props: { text: 'VIEWING · 면회 관람창' } },
    { id: 'o-vw-sofa', type: 'sofa', x: 15, y: 33, props: { w: 3, h: 2, color: '#A7C7E7' } },
    { id: 'o-vw-table', type: 'coffeetable', x: 16, y: 36, props: { w: 2, h: 1 } },
    { id: 'o-vw-ch1', type: 'ichair', x: 20, y: 33, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-vw-ch2', type: 'ichair', x: 22, y: 33, props: { color: '#BAE6FD', facing: 'down' } },
    { id: 'o-vw-plant', type: 'iplant', x: 25, y: 39 },
  ],
  hotspots: [
    { id: 'hs-hygiene', kind: 'quest', x: 3, y: 2, label: '손위생 3분·가운', scenarioId: 'SCN-NURSERY-00001' },
    { id: 'hs-vitals', kind: 'quest', x: 2, y: 11, label: '신생아 활력징후' },
    { id: 'hs-admit', kind: 'info', x: 20, y: 12, label: '입원 사정·계측' },
    { id: 'hs-lactation', kind: 'info', x: 3, y: 31, label: '모유 수유 교육' },
    { id: 'hs-family', kind: 'info', x: 16, y: 33, label: '가족 면회' },
  ],
  npcs: [
    // entry
    { id: 'nu-en-n', kind: 'nurse', mode: 'idle', seed: 831, start: { x: 4, y: 5 } },
    { id: 'nu-en-p', kind: 'parent', mode: 'idle', seed: 832, start: { x: 19, y: 5 } },
    // nursery
    { id: 'nu-ns-n1', kind: 'nurse', mode: 'idle', seed: 833, start: { x: 5, y: 14 } },
    { id: 'nu-ns-n2', kind: 'nurse', mode: 'idle', seed: 834, start: { x: 10, y: 19 } },
    // admit
    { id: 'nu-ad-n', kind: 'nurse', mode: 'idle', seed: 835, start: { x: 22, y: 16 } },
    // feeding
    { id: 'nu-fd-p', kind: 'parent', mode: 'idle', seed: 836, start: { x: 3, y: 34 } },
    { id: 'nu-fd-n', kind: 'nurse', mode: 'idle', seed: 837, start: { x: 8, y: 34 } },
    // viewing
    { id: 'nu-vw-v', kind: 'visitor', mode: 'idle', seed: 838, start: { x: 16, y: 35 } },
    { id: 'nu-vw-p', kind: 'parent', mode: 'idle', seed: 839, start: { x: 21, y: 35 } },
  ],
};
