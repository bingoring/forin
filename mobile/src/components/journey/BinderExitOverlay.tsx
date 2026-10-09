// Task J — the binder cover's OUTBOUND flight (⑤), lifted clear of journey/dept/
// [dept].tsx so it keeps flying after that screen is already gone (task-J-brief.md §2).
//
// A note on why this does not just call `useBinderCoverFlight` again: that hook's whole
// job is to run ①②④ against a rect it reads out of `journeyBinderFly` at ITS OWN mount —
// the dept screen mounting IS the moment it wants a rect. This component has no such
// mount to key off: it is mounted ONCE, permanently, beside the stack in
// journey/_layout.tsx, standing there empty long before any request ever arrives and
// staying mounted long after. It owns only ⑤, driven by whatever `journeyBinderExit`
// hands it, whenever that happens to be.
//
// This is also why it is NOT built on `components/SheetOverlay.tsx`'s registry pattern,
// even though that is this repo's usual "render outside the screen that owns it"
// convention (see `BottomSheet.tsx`'s `overlay` prop for the textbook use of it). That
// registry deliberately keeps the STATE with the registering screen and only hoists the
// rendered `ReactNode` — every republish comes from that screen re-rendering, which is
// exactly what Task J cannot rely on: the dept screen is UNMOUNTING at the moment this
// hand-off happens, not re-rendering. So this overlay has to hold the animation itself —
// its own `Animated.Value`, its own `Animated.timing`, started from its own effect —
// rather than being handed someone else's already-playing one.
import { useEffect, useRef } from 'react';
import { Animated, useWindowDimensions } from 'react-native';
import { BinderCoverFace } from './BinderCoverFace';
import {
  LEAVE_EASING,
  LEAVE_MS,
  START_ROTATE,
  START_SCALE,
} from './useBinderCoverFlight';
import { clearBinderExit, useBinderExitRequest } from '@/data/journeyBinderExit';
import { nb } from '@/theme/nb';

export function BinderExitOverlay() {
  const request = useBinderExitRequest();
  const { width, height } = useWindowDimensions();
  // 0 = flat and full-screen, 1 = shrunk onto the shelf binder's spot — the same
  // convention `useBinderCoverFlight`'s ① uses, so the two read the same way.
  //
  // This one runs 0 -> 1: the cover starts exactly where ④ left it, filling the screen,
  // and shrinks away to the binder. The very first frame this overlay draws has to match
  // the dept screen's last frame, or the switch-over shows — which is the whole point of
  // hoisting the cover out of that screen. Running it the other way makes the cover
  // appear tiny at the shelf and GROW, which is the arrival, not the departure.
  const flight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!request) return undefined;
    flight.setValue(0);
    const anim = Animated.timing(flight, {
      toValue: 1,
      duration: LEAVE_MS,
      easing: LEAVE_EASING,
      useNativeDriver: true,
    });
    anim.start(({ finished }) => { if (finished) clearBinderExit(); });
    return () => anim.stop();
  }, [request, flight]);

  if (!request) return null; // nothing in flight: draw nothing at all (task-J-brief.md §6)

  const { dept, rect, doneTopics, totalTopics } = request;
  // Same maths as useBinderCoverFlight's dx/dy — the shelf binder's centre, offset from
  // the screen's own centre, because this layer is always full-screen and "look like a
  // small book at the shelf" comes entirely from scaling it down and sliding it there.
  const dx = rect.x + rect.width / 2 - width / 2;
  const dy = rect.y + rect.height / 2 - height / 2;
  const translateX = flight.interpolate({ inputRange: [0, 1], outputRange: [0, dx] });
  const translateY = flight.interpolate({ inputRange: [0, 1], outputRange: [0, dy] });
  const rotate = flight.interpolate({ inputRange: [0, 1], outputRange: ['0deg', START_ROTATE] });
  const scale = flight.interpolate({ inputRange: [0, 1], outputRange: [1, START_SCALE] });

  return (
    <Animated.View
      testID="binder-exit-flight"
      pointerEvents="none"
      style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 12,
        shadowColor: nb.ink, shadowOpacity: 0.35, shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 }, elevation: 16,
        transform: [{ translateX }, { translateY }, { rotate }, { scale }],
      }}
    >
      <BinderCoverFace dept={dept} doneTopics={doneTopics} totalTopics={totalTopics} />
    </Animated.View>
  );
}
