// Interior content shape as returned by GET /interiors/{id}. The server handler
// is currently untyped in the OpenAPI contract (swag couldn't resolve the nested
// content types), so we mirror the JSON shape here. Field names are camelCase to
// match the server's json tags (deptId/playerStart/floorTheme).

import type { Coord, Bounds } from './coords';
import type { RegionLike } from './regions';

export type Region = RegionLike;

export interface Room {
  id: string;
  name: string;
  sub?: string;
  icon?: string;
  color?: string;
  x: number;
  y: number;
}

export interface MapObject {
  id: string;
  type: string;
  x: number;
  y: number;
  props?: Record<string, unknown>;
}

export interface Hotspot {
  id: string;
  kind: string;
  x: number;
  y: number;
  label?: string;
  scenarioId?: string;
}

export interface Interior {
  id: string;
  profession?: string;
  deptId: string;
  cols: number;
  rows: number;
  floorTheme: string;
  playerStart: Coord;
  regions: Region[];
  rooms: Room[];
  objects: MapObject[];
  hotspots: Hotspot[];
  collision: Bounds[];
}
