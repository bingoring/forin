import { advanceTarget, patrolStep, wanderStep, moverStep, PatrolState } from '@engine/gridmover';
import type { Coord, Bounds } from '@engine/coords';

describe('patrol', () => {
  test('advanceTarget ping-pongs the waypoint index within [0, n-1]', () => {
    const n = 3;
    let s: PatrolState = { target: 0, fwd: true };
    const visited: number[] = [s.target];
    for (let i = 0; i < 8; i++) {
      s = advanceTarget(s, n);
      expect(s.target).toBeGreaterThanOrEqual(0);
      expect(s.target).toBeLessThan(n);
      visited.push(s.target);
    }
    expect(visited).toEqual([0, 1, 2, 1, 0, 1, 2, 1, 0]);
  });

  test('moves ONE tile per step toward the waypoint (never teleports)', () => {
    const path: Coord[] = [
      { x: 2, y: 2 },
      { x: 5, y: 2 }, // 3 tiles to the right
    ];
    let pos: Coord = { x: 2, y: 2 };
    let s: PatrolState = { target: 0, fwd: true };
    const xs: number[] = [];
    for (let i = 0; i < 3; i++) {
      const r = patrolStep(path, pos, s);
      // each step advances at most one tile (Manhattan)
      expect(Math.abs(r.pos.x - pos.x) + Math.abs(r.pos.y - pos.y)).toBe(1);
      pos = r.pos;
      s = r.state;
      xs.push(pos.x);
    }
    expect(xs).toEqual([3, 4, 5]); // walks 2→3→4→5, not a jump to 5
  });

  test('walks the route tile-by-tile and ping-pongs at the ends', () => {
    const path: Coord[] = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
    ];
    let pos: Coord = { x: 0, y: 0 };
    let s: PatrolState = { target: 0, fwd: true };
    const visited: string[] = [`${pos.x},${pos.y}`];
    for (let i = 0; i < 6; i++) {
      const r = patrolStep(path, pos, s);
      pos = r.pos;
      s = r.state;
      visited.push(`${pos.x},${pos.y}`);
    }
    // 0→1→2 (reached end) →1→0 (reached start) →1→2
    expect(visited).toEqual(['0,0', '1,0', '2,0', '1,0', '0,0', '1,0', '2,0']);
  });

  test('empty path does not crash', () => {
    expect(patrolStep([], { x: 1, y: 1 }, { target: 0, fwd: true }).pos).toEqual({ x: 1, y: 1 });
  });

  test('out-of-range target index is clamped, never throws (R-1 #4)', () => {
    const path: Coord[] = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
    // a stale/overflowed target index must not read undefined → crash
    expect(() => patrolStep(path, { x: 0, y: 0 }, { target: 99, fwd: true })).not.toThrow();
    expect(() => patrolStep(path, { x: 1, y: 0 }, { target: -5, fwd: true })).not.toThrow();
  });
});

// moverStep — the pure per-tick decision shared by useGridMover (R-1: idle had no test)
describe('moverStep', () => {
  const noState: PatrolState = { target: 0, fwd: true };

  test('idle stands still facing front regardless of rng or repetition', () => {
    let pos: Coord = { x: 4, y: 4 };
    for (const rng of [0, 0.25, 0.5, 0.75, 0.999]) {
      const r = moverStep('idle', pos, {}, noState, rng);
      expect(r.pos).toEqual({ x: 4, y: 4 }); // never moves
      expect(r.dir).toBe('down'); // never turns — always front
      expect(r.walking).toBe(false);
      pos = r.pos;
    }
  });

  test('idle ignores any path/bound it happens to be given', () => {
    const r = moverStep('idle', { x: 2, y: 2 }, { path: [{ x: 9, y: 9 }], bound: { x: 0, y: 0, w: 9, h: 9 } }, noState, 0);
    expect(r.pos).toEqual({ x: 2, y: 2 });
    expect(r.dir).toBe('down');
  });

  test('patrol delegates: one tile toward the waypoint, walking=true', () => {
    const r = moverStep('patrol', { x: 2, y: 2 }, { path: [{ x: 2, y: 2 }, { x: 5, y: 2 }] }, noState, 0);
    expect(Math.abs(r.pos.x - 2) + Math.abs(r.pos.y - 2)).toBe(1);
    expect(r.walking).toBe(true);
  });

  test('wander delegates: stays in bound, walking reflects whether it moved', () => {
    const bound: Bounds = { x: 1, y: 1, w: 3, h: 3 };
    const moved = moverStep('wander', { x: 2, y: 2 }, { bound }, noState, 0); // up → in bound
    expect(moved.walking).toBe(true);
    const clamped = moverStep('wander', { x: 2, y: 1 }, { bound }, noState, 0); // up → out → clamp
    expect(clamped.walking).toBe(false);
    expect(clamped.pos).toEqual({ x: 2, y: 1 });
  });

  test('a misconfigured mover (no path/bound) falls back to idle, not a crash', () => {
    const r = moverStep('patrol', { x: 1, y: 1 }, {}, noState, 0);
    expect(r.pos).toEqual({ x: 1, y: 1 });
    expect(r.walking).toBe(false);
  });
});

describe('wander', () => {
  const bound: Bounds = { x: 1, y: 1, w: 3, h: 3 }; // tiles x1..3, y1..3

  test('steps inside the bound and reports facing', () => {
    // rng 0 → 'up' from (2,2) → (2,1), in bound
    expect(wanderStep({ x: 2, y: 2 }, bound, 0)).toEqual({ pos: { x: 2, y: 1 }, dir: 'up', moved: true });
    // rng ~0.5 → 'left' from (2,2) → (1,2), in bound
    expect(wanderStep({ x: 2, y: 2 }, bound, 0.55)).toEqual({ pos: { x: 1, y: 2 }, dir: 'left', moved: true });
  });

  test('never leaves the bound — clamps at edges (moved=false)', () => {
    // at top edge (2,1), picking 'up' → (2,0) is out of bound → stay
    const r = wanderStep({ x: 2, y: 1 }, bound, 0);
    expect(r.moved).toBe(false);
    expect(r.pos).toEqual({ x: 2, y: 1 });
    expect(r.dir).toBe('up');
  });

  test('exhaustive: from every in-bound tile, no rng ever escapes the bound', () => {
    for (let y = bound.y; y < bound.y + bound.h; y++) {
      for (let x = bound.x; x < bound.x + bound.w; x++) {
        for (const rng of [0, 0.3, 0.55, 0.8, 0.999]) {
          const { pos } = wanderStep({ x, y }, bound, rng);
          expect(pos.x).toBeGreaterThanOrEqual(bound.x);
          expect(pos.x).toBeLessThan(bound.x + bound.w);
          expect(pos.y).toBeGreaterThanOrEqual(bound.y);
          expect(pos.y).toBeLessThan(bound.y + bound.h);
        }
      }
    }
  });
});
