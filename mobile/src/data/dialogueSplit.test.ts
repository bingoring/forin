import {
  DOCK_H,
  PORTRAIT_MAX,
  PORTRAIT_MIN,
  TOP_BAND_MAX,
  TOP_BAND_MIN,
  clampChoices,
  clampSplit,
  portraitLayout,
} from './dialogueSplit';

// The top band goes through three stages as it runs out of room, and the order is the
// point: keep the drawing intact as long as possible, then rearrange, and only then
// shrink. Rearranging is free — a row is shorter than a stack — so it always comes first.
test('the top band rearranges before it shrinks', () => {
  const roomy = portraitLayout(TOP_BAND_MAX);
  expect(roomy.stage).toBe('roomy');
  expect(roomy.size).toBe(PORTRAIT_MAX);
  expect(roomy.nameBeside).toBe(false);

  // Just too tight for the stacked plate: the name moves beside the portrait and the
  // portrait is untouched. Shrinking here would throw away detail for nothing.
  const beside = portraitLayout(TOP_BAND_MAX - 20);
  expect(beside.stage).toBe('beside');
  expect(beside.size).toBe(PORTRAIT_MAX);
  expect(beside.nameBeside).toBe(true);
});

test('shrinking keeps the portrait square and stops at a floor', () => {
  const scaled = portraitLayout(TOP_BAND_MIN + 20);
  expect(scaled.stage).toBe('scaled');
  expect(scaled.size).toBeGreaterThanOrEqual(PORTRAIT_MIN);
  expect(scaled.size).toBeLessThan(PORTRAIT_MAX);

  // Past the floor it simply stops. Below it the face stops reading as a face, and the
  // mood — the whole reason the portrait is on screen — stops being legible.
  for (const tiny of [TOP_BAND_MIN, 100, 10, 0, -50]) {
    expect(portraitLayout(tiny).size).toBe(PORTRAIT_MIN);
  }
});

test('the stages never go backwards as room is taken away', () => {
  // A band that rearranged, then un-rearranged, then shrank would read as the layout
  // arguing with itself under the learner's finger.
  const rank = { roomy: 0, beside: 1, scaled: 2 } as const;
  let last = 0;
  for (let h = TOP_BAND_MAX + 40; h >= 0; h -= 4) {
    const r = rank[portraitLayout(h).stage];
    expect(r).toBeGreaterThanOrEqual(last);
    last = r;
  }
});

test('the portrait never grows past its drawn size, however much room there is', () => {
  expect(portraitLayout(2_000).size).toBe(PORTRAIT_MAX);
});

// ── the dragged edges ─────────────────────────────────────────────────────
test('the split leaves the conversation a floor of its own', () => {
  const screenH = 850;
  // Dragging the divider to the bottom of the screen would hand everything to the
  // portrait and leave the learner reading one line at a time.
  expect(clampSplit(screenH, screenH)).toBeLessThanOrEqual(screenH * 0.72);
  // And it cannot be dragged above the top band's own minimum.
  expect(clampSplit(0, screenH)).toBe(TOP_BAND_MIN);
  expect(clampSplit(-200, screenH)).toBe(TOP_BAND_MIN);
});

test('a short screen still gets a usable conversation', () => {
  // On a small device the top band's maximum is a large share of the screen, so the
  // thread's own floor is what has to win. Without that second clamp the divider would
  // be draggable to a place where nothing was readable.
  const screenH = 560;
  expect(clampSplit(TOP_BAND_MAX, screenH)).toBeLessThanOrEqual(screenH * 0.72 + 1);
});

test('the choices band has a floor and a ceiling', () => {
  const screenH = 850;
  // One card must always be readable…
  expect(clampChoices(0, screenH)).toBeGreaterThanOrEqual(96);
  // …and the band must never swallow the conversation, which is the complaint that
  // started this: the choices covered the exchange they were answers to.
  expect(clampChoices(screenH, screenH)).toBeLessThanOrEqual(screenH * 0.55);
});

test('the dock is inside the band, so the divider cannot cut through it', () => {
  // The QUICK INFO row sits between the name plate and the conversation. Left out of the
  // arithmetic it would be *below* the band's maximum, which means the thread's top edge
  // would land in the middle of 차트 / 약물 / 활력 at the widest setting.
  expect(TOP_BAND_MAX).toBeGreaterThanOrEqual(TOP_BAND_MIN + DOCK_H);
  // And the tightest setting still leaves the dock its own room, on top of the floor
  // the portrait needs.
  expect(TOP_BAND_MIN - DOCK_H).toBeGreaterThanOrEqual(PORTRAIT_MIN);
});

test('a learner who never drags anything sees the layout that shipped', () => {
  // The default resting divider, from the screen. Widening this band is not what the
  // drag was added for — someone who never touches the handle must get the same screen
  // as before, so the band's maximum has to reach the position it already rests at.
  for (const screenH of [850, 926, 800]) {
    const shipped = screenH * 0.41 + 34;
    expect(clampSplit(shipped, screenH)).toBe(shipped);
  }
});

test('shrinking scales every drawn dimension by one factor', () => {
  // One factor applied to width, height and the face is what keeps the frame from
  // distorting; a separately-computed width is how portraits end up squashed.
  expect(portraitLayout(TOP_BAND_MAX).scale).toBe(1);
  expect(portraitLayout(TOP_BAND_MAX - 20).scale).toBe(1);
  const s = portraitLayout(TOP_BAND_MIN + 20);
  expect(s.scale).toBeCloseTo(s.size / PORTRAIT_MAX);
  expect(s.scale).toBeLessThan(1);
  // The floor is a floor for the scale too.
  expect(portraitLayout(0).scale).toBeCloseTo(PORTRAIT_MIN / PORTRAIT_MAX);
});
