// A bottom sheet you can actually drag.
//
// Replaces `Modal animationType="slide"` + a static scrim, which gave a sheet
// that only opened and closed: the handle bar was decoration, and the only way
// out was tapping the backdrop (which also threw away whatever you had typed).
//
// Built on core PanResponder + Animated rather than react-native-gesture-handler
// ON PURPOSE. gesture-handler is in package.json but is used in ZERO files here,
// and its root view is not mounted — introducing the app's first gesture-handler
// surface inside a Modal (which needs its own GestureHandlerRootView) is a new
// failure mode we cannot see, since this environment has no way to tap a
// simulator. A vertical drag does not need it.
//
// On the scrim: dimming the screen behind IS the platform convention (Material's
// scrim, iOS's sheet dim) — it says "this is modal, the thing behind is parked".
// What was wrong here was the amount: a flat 0.55 reads as a grey wash. This
// fades in to a lighter value and tracks the drag, so pulling the sheet down
// brightens the screen behind as it goes.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { colors } from '@/theme/tokens';

const SCREEN_H = Dimensions.get('window').height;
/** Collapsed sheets never take more than this much of the screen. */
const COLLAPSED_MAX = SCREEN_H * 0.6;
/** Expanded snap — leaves the status bar and a sliver of context visible. */
const EXPANDED_H = SCREEN_H * 0.9;
/** Drag further than this and the gesture is a dismiss, not a nudge. */
const CLOSE_THRESHOLD = 90;
/** Or flick faster than this. */
const FLICK = 0.6;
/**
 * A flick only counts once the finger has actually travelled this far.
 *
 * Velocity alone made the sheet twitchy: a 20px jerk on the handle clears 0.6 easily,
 * so the sheet pinned at the top would vanish on a movement the person read as "barely
 * touched it". Distance OR velocity still dismisses — velocity just has to be going
 * somewhere.
 */
const FLICK_MIN_DY = 40;
/**
 * Slack at the top detent, in points — roughly 2cm on a phone.
 *
 * From the expanded position a downward drag inside this range springs back to the top
 * instead of leaving it. The top is a place you have to mean to leave.
 */
const SLACK_EXPANDED = 120;
const SCRIM_MAX = 0.38;

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** False for short sheets that have nothing more to reveal when dragged up. */
  expandable?: boolean;
};

export function BottomSheet({ visible, onClose, children, expandable = true }: Props) {
  // Measured once the content lays out; until then the sheet sits offscreen so
  // it never flashes at the wrong height.
  const [contentH, setContentH] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const collapsedH = Math.min(contentH || COLLAPSED_MAX, COLLAPSED_MAX);
  // Trust the caller rather than the measurement: the sheet clamps its own
  // height with maxHeight, so onLayout can never report a content taller than
  // the collapsed cap — deriving "is there more to reveal" from it would always
  // say no for exactly the long lists that need expanding.
  const canExpand = expandable;
  const restH = expanded && canExpand ? EXPANDED_H : collapsedH;

  // translateY is measured from "resting at restH", so 0 = shown, restH = gone.
  const y = useRef(new Animated.Value(SCREEN_H)).current;
  const dragStart = useRef(0);
  const [kbH, setKbH] = useState(0);

  // Everything the gesture reads, refreshed every render.
  //
  // The PanResponder is built once in a useRef, so its handlers close over the FIRST
  // render's values — restH was the pre-measurement default, kbH was 0, and onClose was
  // whatever the caller passed initially. The close animation therefore travelled the
  // wrong distance once the keyboard was up or the content had measured. It was survivable
  // while the whole sheet was draggable and mostly closed by other means; now that the
  // handle is the only way to move the sheet, the gesture has to read live values.
  //
  // A ref rather than rebuilding the responder on every change: recreating it mid-drag
  // drops the gesture, and the handlers would be reinstalled while a finger is down.
  const live = useRef({ restH, kbH, canExpand, onClose, expanded });
  live.current = { restH, kbH, canExpand, onClose, expanded };

  // The sheet's visible height, animated.
  //
  // Expansion used to be a `maxHeight` SWITCH between two constants while the spring
  // moved translateY a few rubber-banded pixels. So the only thing that actually
  // changed on screen was a layout, instantly — the sheet appeared to teleport to the
  // top no matter how the spring was tuned. The spring was animating the wrong
  // property. Height is what changes, so height is what animates.
  const h = useRef(new Animated.Value(COLLAPSED_MAX)).current;

  // useNativeDriver is OFF, and has to be: height is a layout prop the native driver
  // cannot touch, and a view may not mix a natively-driven prop with a JS-driven one.
  // One sheet's transform on the JS driver is cheap; a teleporting sheet is not.
  const springTo = useCallback(
    (to: number, cb?: () => void) => {
      Animated.spring(y, { toValue: to, useNativeDriver: false, damping: 24, stiffness: 190, mass: 0.9 }).start(
        ({ finished }) => finished && cb?.()
      );
    },
    [y]
  );

  // Height follows the detent. Slightly softer than the drag spring: it is travelling
  // further, and a fast height change reads as a snap even when it is animated.
  useEffect(() => {
    Animated.spring(h, {
      toValue: expanded && canExpand ? EXPANDED_H : collapsedH,
      useNativeDriver: false,
      damping: 26,
      stiffness: 160,
      mass: 1,
    }).start();
  }, [expanded, canExpand, collapsedH, h]);

  useEffect(() => {
    if (visible) {
      setExpanded(false);
      springTo(0);
    } else {
      y.setValue(SCREEN_H);
    }
  }, [visible, springTo, y]);

  // Lift the sheet above the keyboard instead of letting it cover the input —
  // the reason the cheer sheet's text field was unusable.
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s = Keyboard.addListener(showEvt, (e) => setKbH(e.endCoordinates.height));
    const h = Keyboard.addListener(hideEvt, () => setKbH(0));
    return () => {
      s.remove();
      h.remove();
    };
  }, []);

  const close = useCallback(() => {
    Keyboard.dismiss();
    springTo(restH + kbH, onClose);
  }, [springTo, restH, kbH, onClose]);

  // The backdrop dismisses the KEYBOARD first when it is up. Closing the whole
  // sheet on that tap is what silently discarded half-written messages.
  const onBackdrop = useCallback(() => {
    if (kbH > 0) {
      Keyboard.dismiss();
      return;
    }
    close();
  }, [kbH, close]);

  // WARNING — editing anything inside this config does NOT take effect on a running app.
  // PanResponder.create() runs once, inside a useRef, and Fast Refresh preserves ref
  // state: a mounted sheet keeps driving the responder built when it first mounted. This
  // cost three rounds of debugging a gesture that was already fixed in source and had
  // never once run on the device. The spread of `panHandlers` onto an element IS a normal
  // prop and does refresh, which makes the situation especially misleading — the handlers
  // move, their behaviour does not. Reload the app fully (not Fast Refresh) after touching
  // this block. The ref itself is correct for production, where the config never changes;
  // everything mutable is read through `live.current` for exactly that reason.
  const pan = useRef(
    PanResponder.create({
      // Claim the touch the instant it lands. The grabber is a dedicated strip: nothing
      // to tap, nothing to scroll, no competing gesture to lose a negotiation to. Relying
      // on the move-phase negotiation alone means the drag only works if every view above
      // it declines the touch first, and there is no reason to depend on that here.
      onStartShouldSetPanResponder: () => true,
      // Still needed for the case where the touch began before the finger moved enough to
      // be a drag: only vertical movement is ours, so a horizontal swipe is left alone.
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderGrant: () => {
        dragStart.current = 0;
        y.setValue(0);
      },
      onPanResponderMove: (_e, g) => {
        // Downward follows the finger 1:1. Upward is rubber-banded when there is
        // nothing more to reveal, so the sheet never detaches from the bottom.
        y.setValue(g.dy > 0 ? g.dy : g.dy * 0.35);
      },
      onPanResponderRelease: (_e, g) => {
        const { restH: rh, kbH: kb, canExpand: grow, onClose: done, expanded: up } = live.current;
        const flungDown = g.vy > FLICK && g.dy > FLICK_MIN_DY;
        const flungUp = g.vy < -FLICK && g.dy < -FLICK_MIN_DY;

        // From the top, down goes to the middle detent — not straight out. Two steps
        // out of a sheet you deliberately expanded, with slack before the first one.
        if (up) {
          if (g.dy > SLACK_EXPANDED || flungDown) setExpanded(false);
          springTo(0);
          return;
        }

        if (g.dy > CLOSE_THRESHOLD || flungDown) {
          springTo(rh + kb, done);
          return;
        }
        if (g.dy < -CLOSE_THRESHOLD / 2 || flungUp) {
          // Only where the caller declared it can grow: a sheet with nothing more to
          // reveal would animate to a height it never fills and sit there looking stuck.
          if (grow) setExpanded(true);
        }
        springTo(0);
      },
      onPanResponderTerminate: () => springTo(0),
    })
  ).current;

  if (!visible) return null;

  return (
    // Hosted in a Modal rather than an absolute overlay in the caller's tree:
    // that guarantees it covers the screen wherever it is mounted (an overlay
    // nested in a ScrollView would not), and gives Android's back button a
    // handler. animationType is 'none' because the drag animation is ours.
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={close}>
      <View style={{ flex: 1 }}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: colors.ink,
          // Brightens as the sheet is pulled down: the scrim reports how modal
          // the sheet currently is instead of being a constant wash.
          opacity: y.interpolate({
            inputRange: [0, Math.max(restH, 1)],
            outputRange: [SCRIM_MAX, 0],
            extrapolate: 'clamp',
          }),
        }}
      >
        <Pressable onPress={onBackdrop} style={{ flex: 1 }} />
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: kbH,
          maxHeight: h,
          backgroundColor: colors.paper,
          borderTopWidth: 4,
          borderTopColor: colors.ink,
          transform: [{ translateY: y }],
        }}
      >
        {/* The grabber, and the ONLY thing the drag is attached to.
            The handlers used to sit on the whole sheet, which meant any vertical
            movement inside it — including scrolling a list — was claimed as a sheet
            drag once it passed 6px. Scrolling a long situation list dragged the sheet
            up and down with it. A gesture that competes with scrolling is a gesture in
            the wrong place: the sheet moves when you grab its handle, and at no other
            time.
            The touch area is padded well past the 5px bar so it is grabbable without
            aiming — the bar is the sign, this View is the target. */}
        {/* Measured here rather than on the sheet itself.
            The sheet's height is animated now, so onLayout on the sheet reported the
            in-flight animation value and fed it straight back into the collapsed height
            it was animating towards. Measuring the CONTENT gives a number that does not
            move while the sheet does, which is what "how tall does this sheet want to
            be" always meant. */}
        <View
          onLayout={(e: LayoutChangeEvent) => {
            const measured = e.nativeEvent.layout.height;
            if (measured > 0 && Math.abs(measured - contentH) > 1) setContentH(measured);
          }}
        >
        <View
          {...pan.panHandlers}
          // hitSlop extends the touch target past the padding without moving the bar or
          // pushing the content down: the strip is 27px tall and reads as small on a
          // phone, and a handle you have to aim at is not a handle.
          hitSlop={{ top: 10, bottom: 14, left: 0, right: 0 }}
          style={{ paddingTop: 12, paddingBottom: 10, alignItems: 'center', backgroundColor: colors.paper }}
        >
          <View style={{ width: 52, height: 5, backgroundColor: colors.ink + '55' }} />
        </View>
        {children}
        </View>
      </Animated.View>
      </View>
    </Modal>
  );
}
