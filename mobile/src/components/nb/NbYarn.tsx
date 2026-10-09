// NbYarn — the red thread that pins together every stamp the learner has already
// passed. journey-binder-v42 Task H, task-H-brief.md §4 (정본) ·
// docs/dlc/projects/forin/inputs/design-handoff_v42/reference/forin-notebook-journey2.jsx
// `Yarn()` 78~100행.
//
// A quadratic Bezier through every point, with the control point nudged off the true
// midpoint (alternating sign by segment index) so the thread reads as slack cloth rather
// than a ruler-straight line — the same trick MissionCluster and PathSegment already use
// for their own curves, just with a bigger wobble because this is meant to look pinned
// down, not printed.
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Circle, G, Path } from 'react-native-svg';
import { nb } from '@/theme/nb';

// Animated.createAnimatedComponent belongs at module scope (Sprite.tsx's AnimatedG does
// the same) — calling it inside the component body would rebuild the wrapped component
// type every render, which react-native-svg has never been asked to tolerate here.
const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface YarnPoint { x: number; y: number }

/** The reference's CSS reveal trick normalises the path to 100 units via the SVG2
 *  `pathLength` attribute, which react-native-svg's TypeScript surface does not expose on
 *  `Path` in this version (and Android's own renderable prop list does not show it either
 *  — only iOS's `RNSVGRenderableModule.mm` does), so a value passed through would be a
 *  silent no-op on at least one platform. `stroke-dasharray`/`stroke-dashoffset` reveal
 *  just as well in real user-space units without it: a single dash exactly as long as the
 *  path (with an equally long gap after it) IS the whole path, and animating the offset
 *  from that length down to 0 slides the dash into place. The polyline distance between
 *  the raw points (ignoring the small Bezier wobble) is close enough for this — the
 *  wobble is a handful of px, the thread is dozens to hundreds. */
function approxLength(pts: YarnPoint[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return len || 1;
}

export function NbYarn({ pts, endPin = true, reduceMotion = false }: {
  pts: YarnPoint[];
  endPin?: boolean;
  /** K7 — the same switch StationTrack already reads from AccessibilityInfo. Not part of
   *  the brief's literal prop list (§4 names only `pts`/`endPin`), but the draw animation
   *  in §7 is unconditional on "모션 줄이기가 켜져 있으면 하지 않는다" for all three
   *  effects it names, and the thread has no other way to hear that than a prop — so this
   *  is threaded through rather than baked into StationTrack as a second copy of the same
   *  draw logic. Defaults to false (animate) so a caller that never passes it gets the
   *  brief's literal 7-prop shape's behaviour unchanged. */
  reduceMotion?: boolean;
}) {
  // Hooks run every render regardless of `pts.length` — the "too short to draw" bail-out
  // sits AFTER them, never before. A hook behind an early return is called on some renders
  // and not others, which is exactly what React's rules of hooks forbid (and here it is
  // reachable: a caller can legitimately go from 2 points to 1 across a re-render as the
  // learner's progress moves).
  const progress = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  useEffect(() => {
    if (reduceMotion) { progress.setValue(1); return; }
    const t = Animated.timing(progress, {
      toValue: 1,
      duration: 1400,
      delay: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // strokeDashoffset is not a native-driver prop.
    });
    t.start();
    return () => t.stop();
  }, [reduceMotion, progress]);
  if (pts.length < 2) return null;

  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const mx = (p0.x + p1.x) / 2 + (i % 2 ? 7 : -7);
    const my = (p0.y + p1.y) / 2 + (i % 2 ? -5 : 6);
    d += ` Q${mx} ${my} ${p1.x} ${p1.y}`;
  }
  const len = approxLength(pts);
  const dashoffset = progress.interpolate({ inputRange: [0, 1], outputRange: [len, 0] });

  return (
    <G>
      <AnimatedPath
        d={d}
        stroke={nb.yarn}
        strokeWidth={2.2}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${len}`}
        strokeDashoffset={dashoffset as unknown as number}
      />
      {/* The reference's fine "3 5" texture dash rides the SAME normalised offset via
          `pathLength` — without that normalisation a literal "3 5" would be a few px of
          repeat over a path that can run to hundreds, reading as noise rather than a
          stitched highlight. Reusing the single-dash reveal here instead keeps the
          highlight in lockstep with the main thread (still very much a "draw-in", just
          without the finer repeat) rather than shipping a highlight that free-floats
          ahead of or behind the thread it is meant to sit on. */}
      <AnimatedPath
        d={d}
        stroke="rgba(255,255,255,.55)"
        strokeWidth={0.7}
        fill="none"
        strokeDasharray={`${len}`}
        strokeDashoffset={dashoffset as unknown as number}
      />
      {pts.map((p, i) => (i < pts.length - 1 || endPin) && (
        <G key={i} x={p.x} y={p.y}>
          <Circle r={4.2} fill={i === pts.length - 1 ? nb.marker : nb.red} stroke={nb.ink} strokeWidth={1.2} />
          <Circle cx={-1.2} cy={-1.2} r={1.2} fill="rgba(255,255,255,.7)" />
        </G>
      ))}
    </G>
  );
}
