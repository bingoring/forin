// Bundled ER interior — a verbatim mirror of the server seed
// (server/content/nurse/interiors/er.yaml). Used as an offline fallback so the
// explore engine is reachable in Expo Go without a running server (dev login).
import type { Interior } from '../types';

export const ER_INTERIOR: Interior = {
  id: 'INT-ER-00001',
  deptId: 'DEPT-ER-00001',
  cols: 24,
  rows: 18,
  floorTheme: 'clinical',
  playerStart: { x: 12, y: 15 },
  regions: [
    { id: 'triage', name: '트리아지', icon: '🩺', bounds: { x: 1, y: 1, w: 10, h: 8 } },
    { id: 'trauma', name: '트라우마 룸', icon: '🚑', bounds: { x: 12, y: 1, w: 11, h: 8 } },
  ],
  rooms: [
    { id: 'triage', name: '트리아지', sub: '접수·사정', icon: '🩺', color: '#A7F3D0', x: 5, y: 4 },
    { id: 'trauma', name: '트라우마 룸', sub: '응급 처치', icon: '🚑', color: '#FCA5A5', x: 17, y: 4 },
  ],
  objects: [
    { id: 'bed1', type: 'bed', x: 4, y: 3, props: { occupied: true } },
    { id: 'monitor1', type: 'monitor', x: 6, y: 3, props: { beep: true } },
    { id: 'reception', type: 'reception', x: 5, y: 7 },
  ],
  hotspots: [{ id: 'hs1', kind: 'quest', x: 4, y: 4, label: '흉통 환자', scenarioId: 'SCN-ER-00001' }],
  collision: [
    { x: 0, y: 0, w: 24, h: 1 },
    { x: 0, y: 0, w: 1, h: 18 },
    { x: 23, y: 0, w: 1, h: 18 },
    { x: 0, y: 17, w: 24, h: 1 },
    { x: 11, y: 1, w: 1, h: 7 },
    { x: 1, y: 9, w: 11, h: 1 },
    { x: 13, y: 9, w: 10, h: 1 },
    { x: 4, y: 3, w: 1, h: 1 },
    { x: 6, y: 3, w: 1, h: 1 },
    { x: 5, y: 7, w: 1, h: 1 },
  ],
};

export const FIXTURES: Record<string, Interior> = {
  [ER_INTERIOR.id]: ER_INTERIOR,
};
