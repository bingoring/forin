// A page of the passport, curling as it turns — on both platforms.
//
// WHY NOT THE PROTOTYPE'S APPROACH. The reference builds the curl from 24 vertical joints
// nested inside one another, each with its own `rotateY`, relying on CSS
// `transform-style: preserve-3d` and a shared `perspective-origin`. That is a browser
// construct. Android composites each View with its own camera, so nested rotateY does not
// accumulate into one curved surface — it produces 24 independently skewed cards — and a
// rotated view's `overflow` clip is unreliable there. Shipping that would mean a curl on
// iOS and a broken fan on Android.
//
// WHAT THIS DOES INSTEAD. The sheet is sliced vertically and each slice is projected as if
// it were wrapped on a cylinder, using only `translateX`, `scaleX` and `opacity` — three
// transforms every platform agrees on, all native-drivable. No 3D, no perspective, no
// nesting: the slices are siblings.
//
// The projection, per slice, at curl progress p:
//   · θ  — how far this slice has rotated away. Slices near the free (right) edge turn
//          first and furthest, which is what makes the sheet look like it is being peeled
//          rather than swung.
//   · cos θ — the slice's foreshortened width. Summed left to right, that also gives each
//          slice's x: every slice's left edge sits on the previous slice's right edge, so
//          the sheet stays continuous instead of tearing into strips.
//   · shading — a slice turning away catches less light. This is what sells the curve;
//          with flat slices the same geometry reads as a horizontal squash.
//
// Positions are SAMPLED rather than composed from Animated arithmetic. Each slice gets one
// interpolation with a 21-point range, so the whole curl is one Animated.Value driving
// simple transforms on the UI thread. Chaining Animated.add across 12 slices would put the
// same arithmetic on the JS thread every frame, and a page turn is exactly when the JS
// thread is busy mounting the next screen.
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, View, useWindowDimensions } from 'react-native';
import { nb } from '@/theme/nb';

/** Vertical slices. Twelve is where the silhouette stops improving on a phone: at eight
 *  the leading edge is visibly faceted, at twenty the cost doubles for nothing. */
export const CURL_SLICES = 12;
/** Sample points per slice. The curve is smooth in p; the interpolation between samples
 *  is linear, and 21 points keeps the error under a pixel. */
const SAMPLES = 21;
/** How far the sheet ends up rotated. Past 128° it is edge-on and there is nothing left
 *  to see — the prototype's number. */
const MAX_ANGLE = 128;
/** The spine end of the sheet turns too, or the page detaches from the book. 0.42 is the
 *  share of the full angle the innermost slice takes. */
const SPINE_SHARE = 0.42;

const rad = (d: number) => (d * Math.PI) / 180;

/**
 * The curl's geometry, precomputed.
 *
 * Returns, per slice, the sampled x offset and horizontal scale — everything the render
 * needs, with no maths at frame time.
 */
export function curlSamples(width: number, slices = CURL_SLICES, samples = SAMPLES) {
  const w = width / slices;
  const xs: number[][] = Array.from({ length: slices }, () => []);
  const sx: number[][] = Array.from({ length: slices }, () => []);

  for (let s = 0; s < samples; s += 1) {
    const p = s / (samples - 1);
    let edge = 0; // running left edge of the current slice, in screen points
    for (let i = 0; i < slices; i += 1) {
      // u = 0 at the spine, 1 at the free edge. The free edge leads.
      const u = slices === 1 ? 1 : i / (slices - 1);
      const theta = rad(p * MAX_ANGLE * (SPINE_SHARE + (1 - SPINE_SHARE) * u));
      // Past 90° the slice faces away; clamp so it collapses instead of mirroring, which
      // would draw the page's back over its front.
      const scale = Math.max(0, Math.cos(theta));
      // A scaleX applies about the view's centre, so a slice pinned at `edge` would drift
      // inward by half of what it lost. Compensated here, in the sample.
      xs[i].push(edge - (w * (1 - scale)) / 2 - i * w);
      sx[i].push(scale);
      edge += w * scale;
    }
  }
  return { w, xs, sx, samples };
}

/**
 * @param dir 'out' turns the page away (forward), 'in' brings one back over the top
 *            (backward, and the passport closing).
 */
export function PageCurl({ dir, onDone, children }: {
  dir: 'out' | 'in';
  onDone?: () => void;
  children: React.ReactNode;
}) {
  const { width } = useWindowDimensions();
  const t = useRef(new Animated.Value(dir === 'out' ? 0 : 1)).current;
  const geo = useMemo(() => curlSamples(width), [width]);

  useEffect(() => {
    const a = Animated.timing(t, {
      toValue: dir === 'out' ? 1 : 0,
      duration: dir === 'out' ? 1250 : 1100,
      easing: dir === 'out' ? Easing.bezier(0.45, 0.05, 0.28, 0.98) : Easing.bezier(0.3, 0.6, 0.3, 1),
      useNativeDriver: true,
    });
    a.start(({ finished }) => { if (finished) onDone?.(); });
    return () => a.stop();
    // onDone is a fresh closure every render; listing it would restart the turn mid-flight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dir, t]);

  const input = useMemo(
    () => Array.from({ length: geo.samples }, (_, s) => s / (geo.samples - 1)),
    [geo.samples],
  );

  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 12 }}>
      {Array.from({ length: CURL_SLICES }).map((_, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute', left: i * geo.w, top: 0, bottom: 0, width: geo.w,
            transform: [
              { translateX: t.interpolate({ inputRange: input, outputRange: geo.xs[i] }) },
              { scaleX: t.interpolate({ inputRange: input, outputRange: geo.sx[i] }) },
            ],
            // A slice that has turned past edge-on has nothing to draw; fading it out also
            // hides the seam where its scale reaches zero.
            opacity: t.interpolate({ inputRange: input, outputRange: geo.sx[i].map((s) => (s <= 0.02 ? 0 : 1)) }),
          }}
        >
          {/* The clip is a SEPARATE, untransformed view. Android's clip is unreliable on a
              view that is itself transformed, and this is the arrangement that works on
              both: the child clips in its own coordinate space, then the parent's
              transform applies to the result. */}
          <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: geo.w + 0.5, overflow: 'hidden' }}>
            {/* The page, shifted so this slice shows its own column of it. Every slice
                renders the same subtree — that is the cost of a curl without 3D, and it is
                a one-shot transition over a static page. */}
            <View style={{ position: 'absolute', left: -i * geo.w, top: 0, bottom: 0, width }}>
              {children}
            </View>
          </View>
          {/* Shading. Without it the same geometry reads as a horizontal squash rather
              than a curve — this is the part that makes it paper. */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, backgroundColor: nb.ink,
              opacity: t.interpolate({
                inputRange: input,
                // Slices further from the spine darken sooner and further, because they
                // have turned further: 1 - cos θ is exactly how much they have turned.
                outputRange: geo.sx[i].map((s) => Math.min(0.42, (1 - s) * 0.55)),
              }),
            }}
          />
        </Animated.View>
      ))}
    </View>
  );
}

/** The shadow the turning page throws across the page underneath. */
export function CurlSweep() {
  const t = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 1250, easing: Easing.bezier(0.45, 0.05, 0.28, 0.98), useNativeDriver: true }).start();
  }, [t]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 11, backgroundColor: nb.ink,
        opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.32, 0] }),
        transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, -width] }) }],
      }}
    />
  );
}
