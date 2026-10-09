// journey-binder-v42 Task I — the fly-in state machine behind journey/dept/[dept].tsx's
// binder cover (task-I-brief.md §1, §2, §4, §6). Pulled out of the screen itself so the
// screen's own JSX stays about WHAT renders, not the phase-by-phase dance that gets it
// there.
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
//
// ⑤ (flying back OUT to the shelf) used to be a fifth phase here, `'leaving'`, run by
// this same hook while the dept screen stayed mounted to host it. Task J (task-J-brief.md)
// pulled it out: the screen this hook lives in disappears the moment ④ finishes
// (`onExit()`, below), so anything that flight needed to survive past that moment cannot
// live in THIS hook's state — it has to be handed to something that outlives the screen.
// `onCoverClosed` now does exactly that hand-off (`requestBinderExit`, into
// `journeyBinderExit.ts`) immediately before calling `onExit()`, and
// `components/journey/BinderExitOverlay.tsx` — mounted once, beside the stack, in
// journey/_layout.tsx — plays ⑤ itself using the exact same constants this file still
// owns (`LEAVE_MS`, `LEAVE_EASING`, `START_SCALE`, `START_ROTATE`, all exported below).
// `flightTransform` below is therefore only ever read during `entering` now — ⑤'s own
// transform is computed inside the overlay, off the same numbers.
//
// `settled -> entering` fires at most once (`startedRef`), and only once the store had a
// rect for THIS dept AND reduce motion has resolved to `false`. Task-I-brief.md §5 wants
// an "unknown" reduce-motion reading to behave like "on" until proven otherwise —
// StationTrack.tsx's own K7 makes the identical call, for the identical reason: a flight
// that starts and is then told to stop reads worse than a flight that, rarely (a device
// slow to answer the query), never plays at all.
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, useWindowDimensions } from 'react-native';
import { requestBinderExit } from '@/data/journeyBinderExit';
import { takeBinderFlyRect, type BinderRect } from '@/data/journeyBinderFly';

export type BinderFlyPhase = 'settled' | 'entering' | 'opening' | 'closing';

/** ① — task-I-brief.md §4 row 1. Exported for the same reason CLOSE_CURL_MS is: tests
 *  drive the state machine forward by finishing the exact `Animated.timing` call these
 *  numbers identify, and a magic 640 duplicated into a test file is a number that can
 *  silently drift out of sync with this one. */
export const ENTER_MS = 640;
const ENTER_EASING = Easing.bezier(0.3, 0.8, 0.3, 1);
/** ⑤ — task-I-brief.md §4 row 4. Now played by `BinderExitOverlay.tsx`, not this hook
 *  (see the file banner) — exported (with the three constants below it) so that overlay
 *  imports these numbers instead of copying them. Two copies is a place where only one
 *  ever gets fixed (task-J-brief.md §2). */
export const LEAVE_MS = 600;
export const LEAVE_EASING = Easing.bezier(0.5, 0, 0.6, 0.5);
/** ④ — task-I-brief.md §4 row 3 ("온보딩 기본 1.1초보다 빠르다"). Exported so the screen
 *  can hand it to `PageCurl`'s own `durationMs` without a second copy of the number. */
export const CLOSE_CURL_MS = 800;
/** The backdrop dim's own timing (§4's last line) — separate from the flight because it
 *  only ever plays during `entering`. */
const SCRIM_MS = 300;
export const SCRIM_MAX_OPACITY = 0.55;
/** §4: "시작 변환은 누른 바인더 자리에서 scale .22, rotate -10deg다." Fixed constants,
 *  not derived from the measured rect's size — only the rect's CENTRE matters, for where
 *  the cover flies from (or, for ⑤, back to). Exported for the same reason `LEAVE_MS` is —
 *  `BinderExitOverlay.tsx` plays ⑤ against these same numbers. */
export const START_SCALE = 0.22;
export const START_ROTATE = '-10deg';

export function useBinderCoverFlight(
  dept: string,
  onExit: () => void,
  cover: { doneTopics: number; totalTopics: number },
) {
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
  /**
   * 이 화면이 **자기 도착 연출을 쥐고 있는 동안**만 참이다. 첫 렌더부터 참이고(좌표를
   * 동기로 읽으므로), 표지가 다 펼쳐지면 거짓이 된다.
   *
   * 화면 전환 설정을 이 값으로 고른다. 도착하는 동안에는 기본 밀기를 꺼야 두 움직임이
   * 겹치지 않지만, 도착이 끝난 뒤에도 꺼 두면 **왼쪽 가장자리 스와이프로 뒤로 가는
   * 동작이 죽는다** — iOS는 전환이 'none'인 화면에서 그 제스처를 내주지 않는다.
   * 실기에서 뒤로가기가 안 되는 것처럼 보인 원인이 이것이다. 도착이 끝나면 평소의
   * 밀기로 돌려놓아 제스처를 되살린다(그때 바꿔도 이미 끝난 도착에는 영향이 없다).
   */
  const [owningArrival, setOwningArrival] = useState(rect !== null);
  const startedRef = useRef(false);
  const closingRef = useRef(false);
  const flight = useRef(new Animated.Value(0)).current;
  const scrim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion === null) return;
    // 모션 줄이기가 켜져 있으면 연출이 없다 — 도착을 쥘 일도 없으니 곧바로 놓아준다.
    if (reduceMotion || !rect) { setOwningArrival(false); return; }
    if (startedRef.current) return;
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
    return undefined;
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
  // The 55%-overshoot (§4 row 1) is entering's own shape. flightTransform is only ever
  // rendered during 'entering' now (see the file banner) — ⑤'s transform is computed
  // separately, inside BinderExitOverlay.tsx, off the same START_SCALE/START_ROTATE.
  const scale = flight.interpolate({ inputRange: [0, 0.55, 1], outputRange: [START_SCALE, 1.03, 1] });
  const flightTransform = [{ translateX }, { translateY }, { rotate }, { scale }];

  /** The dept screen's own back control calls this — the only path that can start ④. The
   *  device back button/swipe never call it (task-I-brief.md §6: that path must not wait
   *  on this animation, so it is wired straight to the router instead, never through this
   *  hook at all). */
  const requestClose = () => {
    if (!startedRef.current) { onExit(); return; }
    if (closingRef.current) return; // §6: a second press while closing does not replay it.
    closingRef.current = true;
    setPhase('closing');
  };

  return {
    /**
     * Whether this screen owns its arrival — known on the FIRST render, because the rect
     * is read from the store synchronously.
     *
     * The screen's `Stack.Screen` options key off this, not off `hasCover`: `hasCover`
     * only turns true once the reduce-motion read resolves, so choosing the transition by
     * it would hand the platform a slide, then swap to 'none' a tick later — after the
     * push has already begun. And without this split the route carried `animation: 'none'`
     * unconditionally, so a screen reached WITHOUT a rect (a deep link, a measurement that
     * did not land) appeared as a hard cut with no motion at all.
     */
    willFly: rect !== null,
    owningArrival,
    /** Whether a cover belongs on screen at all — false skips every layer below outright
     *  (no rect ever consumed, or reduce motion). */
    hasCover: phase !== 'settled',
    phase,
    flightTransform,
    scrim,
    requestClose,
    /** ② finished — the cover is fully turned away; drop it and show the plain screen. */
    onCoverOpened: () => { setPhase('settled'); setOwningArrival(false); },
    /**
     * ④ finished — the cover sits flat again, still filling the screen. This is the
     * hand-off task-J-brief.md exists for: `rect` is guaranteed non-null here (`closing`
     * is only reachable through `requestClose`, which only starts it once `startedRef`
     * is true — and that only ever becomes true when a rect was consumed at mount), so
     * the overlay is handed everything BinderCoverFace needs to keep drawing the exact
     * same cover, in the exact same place, one frame before this screen goes away. Order
     * matters: `requestBinderExit` first, `onExit()` second — reversed, the dept screen
     * would disappear (taking its own cover layer with it) one frame before the overlay
     * has anything to paint over it, and the shelf underneath would show through bare.
     */
    onCoverClosed: () => {
      if (rect) requestBinderExit({ dept, rect, doneTopics: cover.doneTopics, totalTopics: cover.totalTopics });
      onExit();
    },
  };
}
