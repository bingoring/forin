import { keyframeInputRange, keyframeSegments } from '@/data/keyframes';

// The officer's cap: @keyframes nb-pop-cap has stops at 0/42/62/80/91/100% over 1.25s.
const CAP = [0, 0.42, 0.62, 0.8, 0.91, 1];

test('each keyframe segment gets its own share of the duration', () => {
  const segs = keyframeSegments(1250, CAP);
  // Five segments, and their lengths are the GAPS between the stops — not 1250/5 each.
  // Equal slices are exactly the linear travel this replaced: the cap's flight up takes
  // 42% of the time and its landing 9%, and that difference is the snap.
  expect(segs.map((s) => Math.round(s.duration))).toEqual([525, 250, 225, 137, 112]);
  expect(segs.reduce((n, s) => n + s.duration, 0)).toBeCloseTo(1250);
});

test('the value advances one even step per segment', () => {
  // Evenly spaced on purpose: the caller maps segment index → position, so a long
  // segment still covers one stop. Positions weighted by time would double-apply the
  // keyframe spacing and flatten the fast legs again.
  expect(keyframeSegments(1000, CAP).map((s) => s.toValue)).toEqual([0.2, 0.4, 0.6, 0.8, 1]);
});

test('the input range matches the positions the segments produce', () => {
  const outputs = [210, -84, -80, 10, -4, 0];   // the cap's translateY keyframes
  const range = keyframeInputRange(outputs);
  expect(range).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
  // Every segment's end position has a stop in the range, or the interpolate would
  // read a value between two keyframes for a keyframe boundary.
  for (const seg of keyframeSegments(1000, CAP)) {
    expect(range).toContain(seg.toValue);
  }
});

test('a two-stop list is one segment, and a degenerate one is none', () => {
  expect(keyframeSegments(400, [0, 1])).toEqual([{ toValue: 1, duration: 400 }]);
  expect(keyframeSegments(400, [1])).toEqual([]);
  expect(keyframeSegments(400, [])).toEqual([]);
});

test('a non-ascending stop never asks for a negative duration', () => {
  // Animated.timing with a negative duration silently never finishes, which would
  // freeze whichever character got the bad segment halfway through its jump.
  for (const seg of keyframeSegments(500, [0, 0.6, 0.4, 1])) {
    expect(seg.duration).toBeGreaterThanOrEqual(0);
  }
});
