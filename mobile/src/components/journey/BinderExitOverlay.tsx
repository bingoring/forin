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
  // 1 = at rest over the shelf binder's spot (where the request started); 0 = fully
  // flat, full-screen — the mirror image of useBinderCoverFlight's ① (which runs 0 -> 1
  // FROM the shelf). Starting at 1 here, not 0, is what makes this a *continuation* of
  // ④'s already-flat cover rather than a fresh fly-in: the very first frame this overlay
  // ever draws must match the dept screen's last frame exactly, or the switch-over shows.
  const flight = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!request) return undefined;
    flight.setValue(1);
    const anim = Animated.timing(flight, {
      toValue: 0,
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
