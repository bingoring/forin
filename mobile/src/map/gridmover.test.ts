import { patrolAdvance, patrolStep, wanderStep, PatrolState } from './gridmover';
import type { Coord, Bounds } from './coords';

describe('patrol', () => {
  test('ping-pongs along a path and never leaves [0, n-1]', () => {
    const n = 3;
    let s: PatrolState = { idx: 0, fwd: true };
    const visited: number[] = [s.idx];
    for (let i = 0; i < 8; i++) {
      s = patrolAdvance(s, n);
      expect(s.idx).toBeGreaterThanOrEqual(0);
      expect(s.idx).toBeLessThan(n);
      visited.push(s.idx);
    }
    // 0,1,2,1,0,1,2,1,0
    expect(visited).toEqual([0, 1, 2, 1, 0, 1, 2, 1, 0]);
  });

  test('handles a length-1 / empty path without crashing', () => {
    expect(patrolAdvance({ idx: 0, fwd: true }, 1)).toEqual({ idx: 0, fwd: true });
    expect(patrolAdvance({ idx: 0, fwd: true }, 0)).toEqual({ idx: 0, fwd: true });
  });

  test('patrolStep reports tile + facing from the path', () => {
    const path: Coord[] = [
      { x: 2, y: 2 },
      { x: 5, y: 2 },
    ];
    const r = patrolStep(path, { idx: 0, fwd: true });
    expect(r.pos).toEqual({ x: 5, y: 2 });
    expect(r.dir).toBe('right');
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
