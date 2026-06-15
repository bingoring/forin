// Ambient grid NPC driver (06_CHARACTER_MOTION §4). Wraps the pure step logic
// (gridmover.ts) with a calm timer + randomness. Yields {x,y,dir,walking,emote}
// for an ambient agent. Used by the campus engine (5d); keep one per agent and
// give the sprite a stable `seed` so its identity doesn't flicker while moving.
import { useEffect, useRef, useState } from 'react';
import type { Bounds, Coord, Dir } from './coords';
import { PatrolState, patrolStep, wanderStep } from './gridmover';

export const EMOTES = ['💬', '😄', '🤔', '☕', '👍', '✨', '😮', '🩺', '📋', '❤️'];

export interface GridMoverOpts {
  mode: 'patrol' | 'wander';
  path?: Coord[]; // patrol waypoints
  bound?: Bounds; // wander rectangle
  start?: Coord; // wander start tile
  tickMs?: number; // cadence (default 1800 — calm/readable)
  emoteChance?: number; // chance per tick to pause & emote (default 0.22)
}

export interface GridMoverState {
  x: number;
  y: number;
  dir: Dir;
  walking: boolean;
  emote: string | null;
}

export function useGridMover(opts: GridMoverOpts): GridMoverState {
  const { mode, path, bound, start, tickMs = 1800, emoteChance = 0.22 } = opts;
  const initial: Coord =
    mode === 'patrol' ? path?.[0] ?? { x: 0, y: 0 } : start ?? { x: bound?.x ?? 0, y: bound?.y ?? 0 };

  const [st, setSt] = useState<GridMoverState>({ x: initial.x, y: initial.y, dir: 'down', walking: false, emote: null });
  const patrolRef = useRef<PatrolState>({ idx: 0, fwd: true });
  const pauseRef = useRef(0);
  const walkClear = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      // mid-emote: stand still, count down, then clear.
      if (pauseRef.current > 0) {
        pauseRef.current -= 1;
        if (pauseRef.current === 0) setSt((s) => ({ ...s, emote: null }));
        return;
      }
      // maybe stop and pop an emote (2–3 ticks).
      if (Math.random() < emoteChance) {
        pauseRef.current = 1 + Math.floor(Math.random() * 2);
        const emote = EMOTES[Math.floor(Math.random() * EMOTES.length)];
        setSt((s) => ({ ...s, emote, walking: false }));
        return;
      }
      // else take a step.
      setSt((s) => {
        if (mode === 'patrol' && path && path.length) {
          const r = patrolStep(path, patrolRef.current);
          patrolRef.current = r.state;
          return { x: r.pos.x, y: r.pos.y, dir: r.dir, walking: true, emote: null };
        }
        if (mode === 'wander' && bound) {
          const r = wanderStep({ x: s.x, y: s.y }, bound, Math.random());
          return { x: r.pos.x, y: r.pos.y, dir: r.dir, walking: r.moved, emote: null };
        }
        return s;
      });
      if (walkClear.current) clearTimeout(walkClear.current);
      walkClear.current = setTimeout(() => setSt((s) => ({ ...s, walking: false })), Math.min(tickMs - 50, 340));
    }, tickMs);
    return () => {
      clearInterval(id);
      if (walkClear.current) clearTimeout(walkClear.current);
    };
  }, [mode, path, bound, tickMs, emoteChance]);

  return st;
}
