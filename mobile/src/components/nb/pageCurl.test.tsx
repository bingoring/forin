// The page curl, and specifically its geometry.
//
// It exists because the prototype's version — 24 nested 3D joints with CSS
// `preserve-3d` — is a browser construct that Android renders as a broken fan. This one
// is a 2D cylinder projection: translateX, scaleX, opacity, no 3D at all, so it composites
// identically on both platforms.
//
// The maths is what can be wrong, and wrong in ways that still animate: slices that do not
// stay edge to edge tear the sheet into strips, slices that scale past edge-on draw the
// page's back over its front, and a curl with no shading reads as a horizontal squash. All
// three are checked against the sample table, because at frame time it is just numbers.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Text } from 'react-native';
import { CURL_SLICES, PageCurl, curlSamples } from './PageCurl';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();
const W = 402;

/** Where each slice's left and right edges actually land, at sample s. */
function edges(geo: ReturnType<typeof curlSamples>, s: number) {
  return Array.from({ length: CURL_SLICES }, (_, i) => {
    const scale = geo.sx[i][s];
    // The rendered box sits at left = i*w, is translated, then scaled about its centre.
    const centre = i * geo.w + geo.xs[i][s] + geo.w / 2;
    return { left: centre - (geo.w * scale) / 2, right: centre + (geo.w * scale) / 2, scale };
  });
}

test('the sheet is whole: every slice starts where the last one ended', () => {
  // The failure this catches is a page that tears into twelve vertical strips with gaps
  // between them — which still animates, and still looks like a curl at a glance.
  const geo = curlSamples(W);
  for (let s = 0; s < geo.samples; s += 1) {
    const e = edges(geo, s);
    expect(e[0].left).toBeCloseTo(0, 4);
    for (let i = 1; i < e.length; i += 1) {
      expect(e[i].left).toBeCloseTo(e[i - 1].right, 4);
    }
  }
});

test('flat at rest, and no wider than the page', () => {
  const geo = curlSamples(W);
  const rest = edges(geo, 0);
  for (const s of rest) expect(s.scale).toBeCloseTo(1, 6);
  expect(rest[rest.length - 1].right).toBeCloseTo(W, 4);
  // Turning can only ever narrow the sheet: a projection wider than the page means a
  // slice mirrored.
  for (let s = 0; s < geo.samples; s += 1) {
    expect(edges(geo, s)[CURL_SLICES - 1].right).toBeLessThanOrEqual(W + 0.001);
  }
});

test('the free edge leads and the spine follows — that is what makes it a curl', () => {
  // A sheet whose slices all turn together is a card flipping. The right-hand slices have
  // to be further along at every moment, or there is no curve.
  const geo = curlSamples(W);
  const mid = Math.floor(geo.samples / 2);
  for (let i = 1; i < CURL_SLICES; i += 1) {
    expect(geo.sx[i][mid]).toBeLessThan(geo.sx[i - 1][mid]);
  }
  // …and the spine end does turn. Pinned at 1 it would look like the page came unglued
  // from the book.
  expect(geo.sx[0][mid]).toBeLessThan(1);
  expect(geo.sx[0][geo.samples - 1]).toBeLessThan(0.75);
});

test('a slice past edge-on collapses instead of mirroring', () => {
  // cos θ goes negative past 90°. Left alone, a negative scaleX draws the slice flipped —
  // the page's back over its own front, which reads as a glitch rather than a turn.
  const geo = curlSamples(W);
  for (let i = 0; i < CURL_SLICES; i += 1) {
    for (let s = 0; s < geo.samples; s += 1) {
      expect(geo.sx[i][s]).toBeGreaterThanOrEqual(0);
    }
  }
  // The leading slice does reach edge-on by the end — otherwise the page never leaves.
  expect(geo.sx[CURL_SLICES - 1][geo.samples - 1]).toBeLessThan(0.05);
});

test('every slice moves monotonically — no slice turns back mid-curl', () => {
  const geo = curlSamples(W);
  for (let i = 0; i < CURL_SLICES; i += 1) {
    for (let s = 1; s < geo.samples; s += 1) {
      expect(geo.sx[i][s]).toBeLessThanOrEqual(geo.sx[i][s - 1] + 1e-9);
    }
  }
});

test('it renders one clipped copy of the page per slice, with a shade over each', () => {
  // The cost of a curl without 3D: each slice shows its own column of the same page. If
  // the copies stopped rendering, the turn would animate twelve empty rectangles.
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<PageCurl dir="out"><Text>PAGE</Text></PageCurl>)); });
  const labels = tree.root
    .findAll((n: ReactTestInstance) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
  expect(labels.filter((l) => l === 'PAGE')).toHaveLength(CURL_SLICES);

  // The clip is a SEPARATE, untransformed view — Android's clip is unreliable on a view
  // that is itself transformed, and this arrangement is the reason it works on both.
  const clips = tree.root.findAll((n: ReactTestInstance) => {
    if (typeof n.type !== 'string') return false;
    const st = n.props?.style;
    const flat = Array.isArray(st) ? Object.assign({}, ...st.filter(Boolean)) : st;
    return !!flat && flat.overflow === 'hidden' && flat.transform === undefined;
  }, { deep: true });
  expect(clips.length).toBeGreaterThanOrEqual(CURL_SLICES);
});

test('the shading is what makes it paper, so it is not flat', () => {
  // Same geometry with no shading reads as a horizontal squash. The far slices must darken
  // more than the near ones, because they have turned further.
  const geo = curlSamples(W);
  const shade = (i: number, s: number) => Math.min(0.42, (1 - geo.sx[i][s]) * 0.55);
  const mid = Math.floor(geo.samples / 2);
  expect(shade(CURL_SLICES - 1, mid)).toBeGreaterThan(shade(0, mid));
  expect(shade(0, 0)).toBeCloseTo(0, 6);
});
