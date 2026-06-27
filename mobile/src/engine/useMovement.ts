// Player movement state for an interior: D-pad stepping + tap-to-walk (BFS path
// advanced one tile per tick). Walkability/pathfinding live in the pure collision
// module; this hook only owns React state + the step timer.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Coord, Dir, DIRS, dirBetween, step } from './coords';
import { buildBlocked, canEnter, findPath, nearestOpen } from './collision';
import { objectCollision } from './footprint';
import type { Interior } from './types';

const STEP_MS = 240; // tile cadence while auto-walking a path (matches the render glide GLIDE_MS)
const WALK_MS = 300; // walking pose hold after a step; > STEP_MS so it stays on through a path

export function useMovement(interior: Interior) {
  // Walkability = authored structural walls + solid-object footprints.
  const blocked = useMemo(
    () => buildBlocked({ ...interior, collision: [...interior.collision, ...objectCollision(interior.objects)] }),
    [interior],
  );
  const [pos, setPos] = useState<Coord>(interior.playerStart);
  const [facing, setFacing] = useState<Dir>('down');
  const [walking, setWalking] = useState(false);
  const [path, setPath] = useState<Coord[]>([]);

  const posRef = useRef(pos);
  posRef.current = pos;
  const walkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hold the walking pose briefly after each step; re-armed on every step.
  const bumpWalking = useCallback(() => {
    setWalking(true);
    if (walkTimer.current) clearTimeout(walkTimer.current);
    walkTimer.current = setTimeout(() => setWalking(false), WALK_MS);
  }, []);

  // Reset when switching interiors (fast travel between maps is a future stage).
  useEffect(() => {
    setPos(interior.playerStart);
    setFacing('down');
    setPath([]);
  }, [interior]);

  useEffect(() => () => { if (walkTimer.current) clearTimeout(walkTimer.current); }, []);

  /** Single step from the D-pad; cancels any queued auto-walk. */
  const moveDir = useCallback(
    (dir: Dir) => {
      setPath([]);
      setFacing(dir);
      setPos((p) => {
        const next = step(p, DIRS[dir]);
        if (!canEnter(next, interior, blocked)) return p; // blocked → no walk
        bumpWalking();
        return next;
      });
    },
    [interior, blocked, bumpWalking],
  );

  /** Tap-to-walk: queue the shortest path to a target tile. */
  const moveTo = useCallback(
    (target: Coord) => {
      setPath(findPath(posRef.current, target, interior, blocked));
    },
    [interior, blocked],
  );

  /** Jump directly to a tile (fast travel within the map). */
  const warpTo = useCallback(
    (target: Coord) => {
      setPath([]);
      const dest = nearestOpen(target, interior, blocked); // anchor may sit on furniture
      if (dest) setPos(dest);
    },
    [interior, blocked],
  );

  // Advance the queued path one tile per STEP_MS. Re-runs after each step (pos
  // changes), scheduling the next until the path is drained.
  useEffect(() => {
    if (!path.length) return;
    const t = setTimeout(() => {
      const [next, ...rest] = path;
      setFacing(dirBetween(posRef.current, next));
      bumpWalking();
      setPos(next);
      setPath(rest);
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [path, bumpWalking]);

  return { pos, facing, walking, moving: path.length > 0, moveDir, moveTo, warpTo };
}
