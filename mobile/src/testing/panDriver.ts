// A faithful driver for PanResponder-based gestures in tests.
//
// Calling `onMoveShouldSetResponder` directly with a hand-made gesture object does
// NOT work: PanResponder ignores the argument you pass and hands the config its own
// `gestureState`, which it derives from the event's touch history. And only the
// CAPTURE handler (`onMoveShouldSetResponderCapture`) recomputes that state — the
// bubbling one just reads it. A driver that skips the capture call therefore sees
// dy = 0 forever and reports a working sheet as broken.
//
// So this replays the real sequence — capture, then bubble, then grant, then moves,
// then release — over a touch bank that advances position and timestamp the way a
// finger does. Velocity falls out of the px/ms it is driven at, so a "flick" here is
// a flick in the same units the component thresholds against.

type Handlers = Record<string, (e: never) => unknown>;

const START_Y = 300;
const T0 = 1000;

export function panDriver(h: Handlers, opts: { frameMs?: number } = {}) {
  const frameMs = opts.frameMs ?? 16;
  let t = T0;
  const touch = {
    touchActive: true,
    startPageX: 0,
    startPageY: START_Y,
    startTimeStamp: t,
    currentPageX: 0,
    currentPageY: START_Y,
    currentTimeStamp: t,
    previousPageX: 0,
    previousPageY: START_Y,
    previousTimeStamp: t,
  };
  // numberActiveTouches === 1 makes TouchHistoryMath read indexOfSingleActiveTouch
  // straight out of the bank, so a one-entry bank is the whole single-finger case.
  const touchHistory = {
    touchBank: [touch],
    numberActiveTouches: 1,
    indexOfSingleActiveTouch: 0,
    mostRecentTimeStamp: t,
  };
  const evt = () =>
    ({ nativeEvent: { touches: [{}], changedTouches: [{}] }, touchHistory }) as never;

  const step = (dy: number) => {
    touch.previousPageX = touch.currentPageX;
    touch.previousPageY = touch.currentPageY;
    touch.previousTimeStamp = touch.currentTimeStamp;
    t += frameMs;
    touch.currentPageY += dy;
    touch.currentTimeStamp = t;
    touchHistory.mostRecentTimeStamp = t;
  };

  return {
    /** Finger down. Returns whether anything claimed the touch on start. */
    down(): boolean {
      h.onStartShouldSetResponderCapture?.(evt());
      return h.onStartShouldSetResponder?.(evt()) === true;
    },
    /** Finger moves before anyone owns the gesture. Returns "did the view claim it". */
    claim(dy: number): boolean {
      step(dy);
      h.onMoveShouldSetResponderCapture?.(evt());
      const won = h.onMoveShouldSetResponder?.(evt()) === true;
      if (won) h.onResponderGrant?.(evt());
      return won;
    },
    /** Finger moves while the view owns the gesture. */
    move(dy: number) {
      step(dy);
      h.onResponderMove?.(evt());
    },
    /** Finger up. */
    up() {
      touch.touchActive = false;
      touchHistory.numberActiveTouches = 0;
      h.onResponderRelease?.(evt());
    },
  };
}
