// A CSS keyframe list, as timings.
//
// The difference this exists for: CSS applies an animation's easing BETWEEN EVERY PAIR
// of keyframes, so `cubic-bezier(.35,.6,.3,1)` on a five-stop animation fires four
// times and each leg of the move snaps on its own. `Animated.timing` + `interpolate`
// eases the whole run ONCE and travels LINEARLY between the stops, which turns three
// characters popping up from behind a counter into one slow float. The pop was in the
// code and not on the screen (핸드오프 온보딩 · 입국심사).
//
// So a keyframe list becomes one timing PER SEGMENT, with the segment's own share of
// the duration. The percentages are the prototype's; keeping them as the stop list
// rather than pre-multiplied durations is what makes them checkable against the CSS.

/** One segment: how far along the value goes, and how long that leg takes. */
export type Keyframe = { toValue: number; duration: number };

/**
 * `stops` are the keyframe offsets, 0..1, ascending — CSS's 0%/58%/78%/100%.
 *
 * The returned values are evenly spaced (1/n per segment) rather than the offsets
 * themselves: the caller's interpolate maps segment INDEX to position, so a segment
 * that takes 42% of the time still covers exactly one step of the value.
 */
export function keyframeSegments(total: number, stops: number[]): Keyframe[] {
  const n = stops.length - 1;
  if (n < 1) return [];
  return stops.slice(1).map((stop, i) => ({
    toValue: (i + 1) / n,
    duration: Math.max(0, total * (stop - stops[i])),
  }));
}

/** The matching interpolate input range: segment index → position.
 *
 *  Takes the OUTPUT range (numbers for a translate, `'10deg'` strings for a rotate —
 *  Animated accepts both) so the two can never disagree about how many stops there
 *  are, which is the one way this pairing goes wrong. */
export function keyframeInputRange(outputRange: readonly (number | string)[]): number[] {
  return outputRange.map((_, i) => i / (outputRange.length - 1));
}
