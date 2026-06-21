// Pure stepping logic for ambient grid NPCs (06_CHARACTER_MOTION §4). No React,
// no randomness baked in (rng is passed in) — so it's deterministic & unit-tested.
// The useGridMover hook wraps these with a timer + Math.random.
import { Bounds, Coord, Dir, DIRS, dirBetween, inBounds, step } from './coords';

// ── patrol: walk ONE TILE per step toward the current waypoint; when reached,
// advance to the next (ping-pong). Waypoints may be far apart — the agent walks
// the route tile-by-tile (NOT teleporting waypoint→waypoint, which looked insanely fast). ──
export interface PatrolState {
  target: number; // index of the waypoint currently being walked toward
  fwd: boolean; // ping-pong direction along the path
}

/** Advance the target waypoint index, bouncing at both ends. */
export function advanceTarget(s: PatrolState, n: number): PatrolState {
  if (n <= 1) return { target: 0, fwd: true };
  const dir = s.fwd ? 1 : -1;
  let target = s.target + dir;
  let fwd = s.fwd;
  if (target >= n) {
    target = n - 2;
    fwd = false;
  } else if (target < 0) {
    target = 1;
    fwd = true;
  }
  return { target, fwd };
}

/** One patrol step: move a single tile from `pos` toward the target waypoint
 * (x first, then y); if already there, advance to the next waypoint and step. */
export function patrolStep(path: Coord[], pos: Coord, s: PatrolState): { pos: Coord; dir: Dir; state: PatrolState } {
  if (path.length === 0) return { pos, dir: 'down', state: s };
  const clampIdx = (i: number) => Math.max(0, Math.min(i, path.length - 1));
  let state = s;
  let tgt = path[clampIdx(state.target)];
  if (pos.x === tgt.x && pos.y === tgt.y) {
    state = advanceTarget(state, path.length);
    tgt = path[clampIdx(state.target)]; // defense-in-depth: clamp post-advance read too
  }
  let nx = pos.x;
  let ny = pos.y;
  if (pos.x !== tgt.x) nx += Math.sign(tgt.x - pos.x);
  else if (pos.y !== tgt.y) ny += Math.sign(tgt.y - pos.y);
  const next = { x: nx, y: ny };
  return { pos: next, dir: dirBetween(pos, next), state };
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

// ── idle: stand still, face front. Never moves or turns. ──
export type MoverMode = 'patrol' | 'wander' | 'idle';

/**
 * Pure per-tick movement decision shared by useGridMover (the hook adds timers +
 * emotes on top). Deterministic given `rng`. `idle` (or a misconfigured agent)
 * stands still facing front so a stationary NPC never spins — the bug that
 * motivated the idle mode: 1×1-wander kept returning a fresh random `dir`.
 */
export function moverStep(
  mode: MoverMode,
  pos: Coord,
  opts: { path?: Coord[]; bound?: Bounds },
  state: PatrolState,
  rng: number,
): { pos: Coord; dir: Dir; walking: boolean; state: PatrolState } {
  if (mode === 'patrol' && opts.path && opts.path.length) {
    const r = patrolStep(opts.path, pos, state);
    return { pos: r.pos, dir: r.dir, walking: true, state: r.state };
  }
  if (mode === 'wander' && opts.bound) {
    const r = wanderStep(pos, opts.bound, rng);
    return { pos: r.pos, dir: r.dir, walking: r.moved, state };
  }
  return { pos, dir: 'down', walking: false, state }; // idle / unconfigured
}
