// Outpatient clinic engine (5d-iii) — config-driven generator that builds one
// standard clinic Interior (reception+waiting → 3 exam rooms → procedure room).
// Port of design-handoff interior-clinics.jsx ClinicInterior. Adding a department
// = one config object (see the four at the bottom). Bespoke equipment lives in
// objects/clinicEquipment; this file only lays out the floor plan as data.
import type { Bounds } from './coords';
import type { Interior, MapObject, NpcSpec, Region, Room, Hotspot } from './types';
import type { RoleKind } from '@/characters/Sprite';

interface ObjSpec {
  type: string;
  x: number;
  y: number;
  props?: Record<string, unknown>;
}

export interface ClinicCfg {
  id: string;
  deptId: string;
  code: string;
  floor: string; // TileFloor theme
  accent: string; // staff scrub tint
  chairColor: string;
  cabinet: string; // cabinet variant
  deptColor: string; // reception sign tone
  examLabels: [string, string, string];
  procedureLabel: string;
  procedureIcon: string;
  procedureSub?: string;
  waitingDecor?: ObjSpec[];
  examDecor?: (i: number, ox: number) => ObjSpec[];
  procedure: ObjSpec[];
}

const COLS = 22;
const ROWS = 24;

/** Build the clinic Interior from a department config. */
export function clinicInterior(cfg: ClinicCfg): Interior {
  const regions: Region[] = [
    { id: 'reception', name: '접수·대기', icon: '🪑', bounds: { x: 0, y: 0, w: 22, h: 8 } },
    { id: 'exam', name: '진료실', icon: '🩺', bounds: { x: 0, y: 8, w: 22, h: 8 } },
    { id: 'procedure', name: cfg.procedureLabel, icon: cfg.procedureIcon, bounds: { x: 0, y: 16, w: 22, h: 8 } },
  ];
  const rooms: Room[] = [
    { id: 'reception', name: '접수 데스크', sub: '대기·접수', icon: '🪑', color: cfg.accent, x: 4, y: 4 },
    { id: 'exam1', name: cfg.examLabels[0], sub: '진료', icon: '🩺', color: '#BAE6FD', x: 3, y: 12 },
    { id: 'exam2', name: cfg.examLabels[1], sub: '진료', icon: '🩺', color: '#BAE6FD', x: 10, y: 12 },
    { id: 'exam3', name: cfg.examLabels[2], sub: '진료', icon: '🩺', color: '#BAE6FD', x: 17, y: 12 },
    { id: 'procedure', name: cfg.procedureLabel, sub: cfg.procedureSub ?? '', icon: cfg.procedureIcon, color: cfg.accent, x: 11, y: 20 },
  ];

  // Structural walls (doors are gaps + a 'door' object drawn over them).
  // Reception→exam: one door per room (x3/x10/x17) so every exam room is directly
  // enterable. Exam dividers x7/x14 are full-height. Procedure door at x10-11.
  const collision: Bounds[] = [
    { x: 0, y: 0, w: 9, h: 1 }, { x: 11, y: 0, w: 11, h: 1 }, // top (campus door gap x9-10)
    { x: 0, y: 1, w: 1, h: 22 }, { x: 21, y: 1, w: 1, h: 22 }, { x: 0, y: 23, w: 22, h: 1 }, // sides + bottom
    { x: 1, y: 8, w: 2, h: 1 }, { x: 4, y: 8, w: 6, h: 1 }, { x: 11, y: 8, w: 6, h: 1 }, { x: 18, y: 8, w: 3, h: 1 }, // divider y8 (doors x3/x10/x17)
    { x: 7, y: 9, w: 1, h: 7 }, { x: 14, y: 9, w: 1, h: 7 }, // exam room dividers
    { x: 1, y: 16, w: 9, h: 1 }, { x: 12, y: 16, w: 9, h: 1 }, // divider y16 (door x10-11)
  ];

  const objects: MapObject[] = [];
  const npcs: NpcSpec[] = [];
  const hotspots: Hotspot[] = [];
  let n = 0;
  const add = (s: ObjSpec) => objects.push({ id: `o${n++}`, type: s.type, x: s.x, y: s.y, props: s.props });
  // a stationary NPC stands + breathes/emotes (1×1 wander bound = can't move)
  const stand = (kind: RoleKind, x: number, y: number, seed: number) => npcs.push({ id: `npc${seed}`, kind, mode: 'wander', bound: { x, y, w: 1, h: 1 }, start: { x, y }, seed });

  // doors (walkable openings): one into each exam room + procedure
  add({ type: 'door', x: 9, y: 0, props: { w: 2, kind: 'auto' } });
  add({ type: 'door', x: 3, y: 8, props: { kind: 'wood' } });
  add({ type: 'door', x: 10, y: 8, props: { kind: 'wood' } });
  add({ type: 'door', x: 17, y: 8, props: { kind: 'wood' } });
  add({ type: 'door', x: 10, y: 16, props: { w: 2, kind: 'wood' } });

  // reception + waiting
  add({ type: 'clinicReception', x: 1, y: 2, props: { w: 6, h: 2, tone: cfg.deptColor } });
  add({ type: 'plant', x: 1, y: 6 });
  add({ type: 'plant', x: 20, y: 2 });
  [14, 16, 18, 20].forEach((cx) => add({ type: 'chair', x: cx, y: 3, props: { color: cfg.chairColor } }));
  [14, 16, 18, 20].forEach((cx) => add({ type: 'chair', x: cx, y: 6, props: { color: cfg.chairColor } }));
  stand('nurse', 3, 4, 1);
  stand('nurse', 5, 4, 2);
  npcs.push({ id: 'npcw1', kind: 'patient', mode: 'wander', seed: 11, bound: { x: 14, y: 3, w: 6, h: 4 }, start: { x: 15, y: 4 } });
  hotspots.push({ id: 'hs-info', kind: 'info', x: 16, y: 6, label: '접수 안내' });
  (cfg.waitingDecor ?? []).forEach(add);

  // 3 exam rooms (left edges 1, 8, 15)
  for (let i = 0; i < 3; i++) {
    const ox = i * 7 + 1;
    add({ type: 'bed', x: ox, y: 10 });
    add({ type: 'stool', x: ox + 3, y: 11 });
    add({ type: 'cabinet', x: ox + 3, y: 10, props: { w: 2, h: 1, variant: cfg.cabinet } });
    stand('doctor', ox + 1, 13, 20 + i);
    (cfg.examDecor?.(i, ox) ?? []).forEach(add);
    if (i === 0 || i === 2) {
      hotspots.push({ id: `hs-exam${i}`, kind: 'quest', x: ox + 1, y: 13, label: '진료', scenarioId: `SCN-${cfg.code}-EXAM${i + 1}` });
    }
  }

  // procedure / treatment room (dept-specific equipment)
  cfg.procedure.forEach(add);
  hotspots.push({ id: 'hs-proc', kind: 'quest', x: 11, y: 20, label: cfg.procedureLabel, scenarioId: `SCN-${cfg.code}-PROC` });
  stand('doctor', 9, 21, 30);

  return {
    id: cfg.id,
    deptId: cfg.deptId,
    cols: COLS,
    rows: ROWS,
    floorTheme: cfg.floor,
    playerStart: { x: 11, y: 6 },
    regions,
    rooms,
    objects,
    hotspots,
    collision,
    npcs,
  };
}

// ── Department configs — add a department by adding one of these ──
export const INTERNAL = clinicInterior({
  id: 'CLINIC-IM-00001', deptId: 'DEPT-IM', code: 'IM', floor: 'internal',
  accent: '#A7E3D0', chairColor: '#BBF7D0', cabinet: 'drug', deptColor: '#0E7490',
  examLabels: ['진료실 1', '진료실 2', '진료실 3'],
  procedureLabel: '검사실', procedureIcon: '🫀', procedureSub: '심전도·초음파',
  procedure: [
    { type: 'ultrasound', x: 2, y: 18 },
    { type: 'bed', x: 5, y: 18, props: { occupied: true } },
    { type: 'monitor', x: 9, y: 20, props: { beep: true } },
    { type: 'cabinet', x: 15, y: 18, props: { w: 4, h: 1, variant: 'drug' } },
    { type: 'plant', x: 20, y: 21 },
  ],
});

export const SURGERY = clinicInterior({
  id: 'CLINIC-GS-00001', deptId: 'DEPT-GS', code: 'GS', floor: 'surgery',
  accent: '#A8DCEC', chairColor: '#BAE6FD', cabinet: 'sterile', deptColor: '#2563EB',
  examLabels: ['외래 1', '외래 2', '상처 드레싱'],
  procedureLabel: '소수술실', procedureIcon: '🔪', procedureSub: '국소마취 처치',
  examDecor: (_i, ox) => [{ type: 'cabinet', x: ox, y: 9, props: { w: 2, h: 1, variant: 'sterile' } }],
  procedure: [
    { type: 'bed', x: 4, y: 18, props: { occupied: true } },
    { type: 'monitor', x: 2, y: 18, props: { beep: true } },
    { type: 'cabinet', x: 15, y: 18, props: { w: 4, h: 1, variant: 'sterile' } },
    { type: 'stool', x: 8, y: 20 },
  ],
});

export const ORTHO = clinicInterior({
  id: 'CLINIC-OS-00001', deptId: 'DEPT-OS', code: 'OS', floor: 'ortho',
  accent: '#FDE9C8', chairColor: '#FED7AA', cabinet: 'supply', deptColor: '#B45309',
  examLabels: ['진료실 1', '진료실 2', '깁스실'],
  procedureLabel: '캐스팅·재활', procedureIcon: '🦴', procedureSub: '깁스·물리치료',
  waitingDecor: [{ type: 'xray', x: 11, y: 1 }, { type: 'crutches', x: 13, y: 4 }],
  examDecor: (_i, ox) => [{ type: 'bonemodel', x: ox + 5, y: 10 }],
  procedure: [
    { type: 'xray', x: 2, y: 17 },
    { type: 'bed', x: 2, y: 19, props: { occupied: true } },
    { type: 'castcart', x: 6, y: 19 },
    { type: 'crutches', x: 9, y: 18 },
    { type: 'bonemodel', x: 19, y: 17 },
    { type: 'cabinet', x: 14, y: 18, props: { w: 4, h: 1, variant: 'supply' } },
    { type: 'plant', x: 20, y: 21 },
  ],
});

export const DERM = clinicInterior({
  id: 'CLINIC-DM-00001', deptId: 'DEPT-DM', code: 'DM', floor: 'derm',
  accent: '#FBCFE8', chairColor: '#FBCFE8', cabinet: 'supply', deptColor: '#DB2777',
  examLabels: ['진료실 1', '진료실 2', '레이저실'],
  procedureLabel: '시술실', procedureIcon: '✨', procedureSub: '레이저·광치료',
  waitingDecor: [{ type: 'shelf', x: 11, y: 1, props: { w: 3 } }, { type: 'shelf', x: 11, y: 5, props: { w: 3 } }],
  examDecor: (_i, ox) => [{ type: 'dermlamp', x: ox + 4, y: 10 }],
  procedure: [
    { type: 'dermlamp', x: 2, y: 17 },
    { type: 'bed', x: 4, y: 18, props: { occupied: true } },
    { type: 'laser', x: 8, y: 18 },
    { type: 'shelf', x: 14, y: 17, props: { w: 4 } },
    { type: 'cabinet', x: 15, y: 19, props: { w: 4, h: 1, variant: 'supply' } },
    { type: 'stool', x: 6, y: 21, props: { color: '#BE185D' } },
    { type: 'plant', x: 20, y: 21 },
  ],
});

export const CLINICS = [INTERNAL, SURGERY, ORTHO, DERM];
