// journey-binder-v42 Task I — the fly-in/fly-out state machine behind journey/dept/
// [dept].tsx's binder cover (task-I-brief.md §1, §2, §4, §6). Pulled out of the screen
// itself so the screen's own JSX stays about WHAT renders, not the five-phase dance that
// gets it there.
//
// Phases, and what plays in each (every time and curve below is task-I-brief.md §4,
// verbatim):
//
//   settled  — no cover at all. Either the store had nothing for this dept (no shelf
//              press led here — a deep link, a re-focus) or reduce motion is on: land
//              here immediately, the department screen underneath is simply what's shown.
//   entering — ① flies in: 640ms, bezier(.3,.8,.3,1), scale overshoots to 1.03 at 55%.
//   opening  — ② the cover's own PageCurl (dir="out", the onboarding default 1250ms)
//              turns it away.
//   closing  — ④ the reverse curl (dir="in", durationMs={CLOSE_CURL_MS}) brings it back
//              down flat — the screen only asks for this; it does not touch PageCurl.
//   leaving  — ⑤ flies back to the shelf: 600ms, bezier(.5,0,.6,.5) — then calls onExit.
//
// `settled -> entering` fires at most once (`startedRef`), and only once the store had a
// rect for THIS dept AND reduce motion has resolved to `false`. Task-I-brief.md §5 wants
// an "unknown" reduce-motion reading to behave like "on" until proven otherwise —
// StationTrack.tsx's own K7 makes the identical call, for the identical reason: a flight
// that starts and is then told to stop reads worse than a flight that, rarely (a device
// slow to answer the query), never plays at all.
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, useWindowDimensions } from 'react-native';
import { takeBinderFlyRect, type BinderRect } from '@/data/journeyBinderFly';

export type BinderFlyPhase = 'settled' | 'entering' | 'opening' | 'closing' | 'leaving';

/** ① — task-I-brief.md §4 row 1. Exported for the same reason CLOSE_CURL_MS is: tests
 *  drive the state machine forward by finishing the exact `Animated.timing` call these
 *  numbers identify, and a magic 640 duplicated into a test file is a number that can
 *  silently drift out of sync with this one. */
export const ENTER_MS = 640;
const ENTER_EASING = Easing.bezier(0.3, 0.8, 0.3, 1);
/** ⑤ — task-I-brief.md §4 row 4. */
export const LEAVE_MS = 600;
const LEAVE_EASING = Easing.bezier(0.5, 0, 0.6, 0.5);
/** ④ — task-I-brief.md §4 row 3 ("온보딩 기본 1.1초보다 빠르다"). Exported so the screen
 *  can hand it to `PageCurl`'s own `durationMs` without a second copy of the number. */
export const CLOSE_CURL_MS = 800;
/** The backdrop dim's own timing (§4's last line) — separate from the flight because it
 *  only ever plays during `entering`, never `leaving`. */
const SCRIM_MS = 300;
export const SCRIM_MAX_OPACITY = 0.55;
/** §4: "시작 변환은 누른 바인더 자리에서 scale .22, rotate -10deg다." Fixed constants,
 *  not derived from the measured rect's size — only the rect's CENTRE matters, for where
 *  the cover flies from. */
const START_SCALE = 0.22;
const START_ROTATE = '-10deg';

export function useBinderCoverFlight(dept: string, onExit: () => void) {
  // Read once, at mount — task-I-brief.md §2 point 3 ("스토어에서 좌표를 꺼내"). A second
  // mount of this same screen (back out with the device button, re-enter by any other
  // path) must not replay a flight that belongs to a press that is long gone, which is
  // exactly what `takeBinderFlyRect` already guarantees by consuming the store.
  const [rect] = useState<BinderRect | null>(() => takeBinderFlyRect(dept));

  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (alive) setReduceMotion(v); });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v: boolean) => setReduceMotion(v));
    return () => { alive = false; sub.remove(); };
  }, []);

  const [phase, setPhase] = useState<BinderFlyPhase>('settled');
  const startedRef = useRef(false);
  const closingRef = useRef(false);
  const flight = useRef(new Animated.Value(0)).current;
  const scrim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (startedRef.current || reduceMotion !== false || !rect) return;
    startedRef.current = true;
    setPhase('entering');
  }, [reduceMotion, rect]);

  useEffect(() => {
    if (phase === 'entering') {
      flight.setValue(0);
      scrim.setValue(0);
      const fly = Animated.timing(flight, { toValue: 1, duration: ENTER_MS, easing: ENTER_EASING, useNativeDriver: true });
      const dim = Animated.timing(scrim, { toValue: SCRIM_MAX_OPACITY, duration: SCRIM_MS, easing: Easing.linear, useNativeDriver: true });
      fly.start(({ finished }) => { if (finished) setPhase('opening'); });
      dim.start();
      return () => { fly.stop(); dim.stop(); };
    }
    if (phase === 'leaving') {
      const back = Animated.timing(flight, { toValue: 0, duration: LEAVE_MS, easing: LEAVE_EASING, useNativeDriver: true });
      back.start(({ finished }) => { if (finished) onExit(); });
      return () => back.stop();
    }
    return undefined;
    // onExit is a fresh closure every render (same reasoning as StationTrack.tsx's
    // walkTo effect) — listing it would restart the flight-out mid-play.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const { width, height } = useWindowDimensions();
  // Where the cover flies FROM: the pressed binder's centre, offset from the screen's own
  // centre — the cover layer is always full-screen (§3), so "look like a small book at
  // the shelf" comes entirely from scaling that full-screen layer down and sliding it to
  // this offset, the same trick the reference demo's CSS transform does.
  const dx = rect ? rect.x + rect.width / 2 - width / 2 : 0;
  const dy = rect ? rect.y + rect.height / 2 - height / 2 : 0;
  const translateX = flight.interpolate({ inputRange: [0, 1], outputRange: [dx, 0] });
  const translateY = flight.interpolate({ inputRange: [0, 1], outputRange: [dy, 0] });
  const rotate = flight.interpolate({ inputRange: [0, 1], outputRange: [START_ROTATE, '0deg'] });
  // The 55%-overshoot (§4 row 1) is only entering's shape — ⑤ has no such note, so the
  // way back scales down plainly under its own ease-in curve.
  const scale = phase === 'leaving'
    ? flight.interpolate({ inputRange: [0, 1], outputRange: [START_SCALE, 1] })
    : flight.interpolate({ inputRange: [0, 0.55, 1], outputRange: [START_SCALE, 1.03, 1] });
  const flightTransform = [{ translateX }, { translateY }, { rotate }, { scale }];

  /** The dept screen's own back control calls this — the only path that can start the
   *  ④→⑤ sequence. The device back button/swipe never call it (task-I-brief.md §6: that
   *  path must not wait on this animation, so it is wired straight to the router instead,
   *  never through this hook at all). */
  const requestClose = () => {
    if (!startedRef.current) { onExit(); return; }
    if (closingRef.current) return; // §6: a second press while closing does not replay it.
    closingRef.current = true;
    setPhase('closing');
  };

  return {
    /** Whether a cover belongs on screen at all — false skips every layer below outright
     *  (no rect ever consumed, or reduce motion). */
    hasCover: phase !== 'settled',
    phase,
    flightTransform,
    scrim,
    requestClose,
    /** ② finished — the cover is fully turned away; drop it and show the plain screen. */
    onCoverOpened: () => setPhase('settled'),
    /** ④ finished — the cover is flat again; start ⑤. */
    onCoverClosed: () => setPhase('leaving'),
  };
}
