// Pure stepping logic for ambient grid NPCs (06_CHARACTER_MOTION §4). No React,
// no randomness baked in (rng is passed in) — so it's deterministic & unit-tested.
// The useGridMover hook wraps these with a timer + Math.random.
import { Bounds, Coord, Dir, DIRS, dirBetween, inBounds, step } from './coords';

// ── patrol: ping-pong along an explicit waypoint path ──
export interface PatrolState {
  idx: number;
  fwd: boolean;
}

/** Next index along a path of length `n`, bouncing at both ends. */
export function patrolAdvance(s: PatrolState, n: number): PatrolState {
  if (n <= 1) return { idx: 0, fwd: true };
  const dir = s.fwd ? 1 : -1;
  let next = s.idx + dir;
  let fwd = s.fwd;
  if (next >= n) {
    next = n - 2;
    fwd = false;
  } else if (next < 0) {
    next = 1;
    fwd = true;
  }
  return { idx: next, fwd };
}

/** A patrol step: advance the index and report the new tile + facing. */
export function patrolStep(path: Coord[], s: PatrolState): { pos: Coord; dir: Dir; state: PatrolState } {
  const next = patrolAdvance(s, path.length);
  const from = path[s.idx] ?? path[0];
  const to = path[next.idx] ?? from;
  return { pos: to, dir: dirBetween(from, to), state: next };
}

// ── wander: random cardinal step, clamped to a rectangular bound ──
const CARDINALS: Dir[] = ['up', 'down', 'left', 'right'];

/**
 * Pick a cardinal from `rng` (0..1) and step if it stays inside `bound`;
 * otherwise face that way but don't move (clamped). Deterministic given rng.
 */
export function wanderStep(pos: Coord, bound: Bounds, rng: number): { pos: Coord; dir: Dir; moved: boolean } {
  const dir = CARDINALS[Math.min(3, Math.floor(rng * 4))];
  const next = step(pos, DIRS[dir]);
  if (inBounds(next, bound)) return { pos: next, dir, moved: true };
  return { pos, dir, moved: false };
}
