// Campus outdoor map — a bundled fixture so the explore engine + ambient NPC
// engine (useGridMover) are reachable offline. 5d-i: open lawn + placeholder
// building footprints (rendered as Walls) + roaming NPCs (patrol/wander + emotes).
// Faithful building/path/tree art is 5d-ii (port from screens-explore-v2).
import type { Interior } from '../types';

export const CAMPUS_INTERIOR: Interior = {
  id: 'CAMPUS-00001',
  deptId: 'CAMPUS',
  cols: 28,
  rows: 20,
  floorTheme: 'grass',
  playerStart: { x: 14, y: 16 },
  regions: [],
  rooms: [],
  objects: [],
  hotspots: [],
  // perimeter + 3 building footprints (placeholder blocks until 5d-ii art).
  collision: [
    { x: 0, y: 0, w: 28, h: 1 },
    { x: 0, y: 0, w: 1, h: 20 },
    { x: 27, y: 0, w: 1, h: 20 },
    { x: 0, y: 19, w: 28, h: 1 },
    { x: 3, y: 3, w: 6, h: 4 }, // building A (left)
    { x: 11, y: 2, w: 6, h: 5 }, // hospital (center)
    { x: 19, y: 3, w: 6, h: 4 }, // building B (right)
  ],
  // Roaming campus life — nurses patrol the paths, visitors/patients/kids wander.
  npcs: [
    { id: 'c-nurse', kind: 'nurse', mode: 'patrol', seed: 3, path: [{ x: 6, y: 12 }, { x: 22, y: 12 }, { x: 22, y: 15 }, { x: 6, y: 15 }] },
    { id: 'c-visitor', kind: 'visitor', mode: 'wander', seed: 17, bound: { x: 3, y: 9, w: 9, h: 8 }, start: { x: 6, y: 11 } },
    { id: 'c-patient', kind: 'patient', mode: 'wander', seed: 31, bound: { x: 16, y: 9, w: 9, h: 8 }, start: { x: 20, y: 11 } },
    { id: 'c-child', kind: 'child', mode: 'wander', seed: 42, bound: { x: 9, y: 13, w: 10, h: 5 }, start: { x: 13, y: 15 }, tickMs: 1400 },
    { id: 'c-doctor', kind: 'doctor', mode: 'patrol', seed: 9, path: [{ x: 10, y: 9 }, { x: 10, y: 17 }] },
  ],
};
