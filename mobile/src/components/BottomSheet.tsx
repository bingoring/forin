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
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  BackHandler,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { colors } from '@/theme/tokens';
import { useSheetOverlay } from '@/components/SheetOverlay';

const SCREEN_H = Dimensions.get('window').height;
/** A content-sized sheet never takes more than this much of the screen. */
const CONTENT_MAX = SCREEN_H * 0.6;
/**
 * How tall a `tall` sheet is.
 *
 * Not the whole screen on purpose. Pinned flush to the top there is no "outside" left to
 * tap, and tapping outside is one of the two ways out that people already reach for. The
 * strip that remains is what keeps that exit, and reads the sheet as a sheet rather than
 * as a screen.
 */
const TALL_H = SCREEN_H * 0.92;
/** Drag a content-sized sheet further than this and the gesture is a dismiss. */
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
 * A tall sheet closes once its top edge has been dragged past the middle of the screen.
 *
 * Half the screen of slack, rather than the ~2cm a fixed threshold gave: the top is
 * where a tall sheet lives, so leaving it should take a deliberate haul, and the halfway
 * line is a target you can see without measuring. Expressed as the distance the sheet has
 * to travel for its top edge to reach the midpoint, because that is the rule — the number
 * is just where this height puts it.
 */
const TALL_CLOSE_TRAVEL = TALL_H - SCREEN_H / 2;
const SCRIM_MAX = 0.38;

/** What the sheet is for, which decides how tall it opens and how hard it is to leave. */
export type SheetSize = 'content' | 'tall';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /**
   * How much room the sheet asks for, and therefore how it behaves.
   *
   * `content` hugs its content up to 60% of the screen and closes on a short downward
   * drag. Right for a sheet you glance at and dismiss — a message box, a detail card.
   *
   * `tall` opens at the top and stays there. There is no middle detent to stop at, and it
   * takes a drag past the middle of the screen to close. Right where the content is the
   * point rather than a summary: stopping such a sheet halfway shows a fraction of a long
   * list and asks for a second gesture to see the rest.
   */
  size?: SheetSize;
  /**
   * Covered by a pushed screen — still open, just not on screen.
   *
   * Distinct from `visible: false`, which means dismissed. A RN Modal renders above
   * whatever screen is pushed on top of the caller, so a sheet that stays mounted hides
   * the screen it just opened; the caller sets this instead of throwing the sheet away,
   * and the difference is what lets the way back land where you left.
   */
  /**
   * Rendered directly under the grabber, and DRAGGABLE with it.
   *
   * The 27px strip is a target you have to aim at; a sheet's title is right there and
   * is what a hand reaches for. Passing the title here makes the whole top of the sheet
   * the handle. It claims only on vertical MOVEMENT, so anything interactive inside it
   * still gets its taps.
   */
  header?: React.ReactNode;
  suspended?: boolean;
  /**
   * Render into the tab-level overlay host (SheetOverlay) when there is one.
   *
   * Opt in for sheets you navigate OUT of. A Modal sits above the pushed screen, so those
   * sheets had to be taken down before navigating and put back afterwards, which showed
   * the bare screen underneath for an instant each way. In the host the sheet is simply
   * below the pushed screen, so it stays put — and keeps its scroll position, which the
   * take-down could not.
   *
   * Sheets that never navigate have nothing to gain and stay on Modal, which needs no
   * host to exist wherever it is mounted.
   */
  overlay?: boolean;
};

export function BottomSheet({ visible, onClose, children, header, size = 'content', suspended = false, overlay = false }: Props) {
  // Measured once the content lays out; until then the sheet sits offscreen so
  // it never flashes at the wrong height.
  const [contentH, setContentH] = useState(0);
  const tall = size === 'tall';

  // One resting height per sheet, decided by the caller.
  //
  // There used to be two — a content-sized detent and a taller one you dragged up to —
  // and that middle stop is what made the floor sheet awkward: it opened showing a
  // fraction of a long list and asked for a second gesture to see the rest. A sheet whose
  // content IS the point should already be where you were going.
  const restH = tall ? TALL_H : Math.min(contentH || CONTENT_MAX, CONTENT_MAX);

  // translateY is measured from "resting at restH", so 0 = shown and restH = gone.
  //
  // `gone` is exactly restH: at that offset the sheet's top edge sits on the screen's
  // bottom edge, flush, with nothing of it showing. It used to be parked a further 8% of
  // the screen below that, which made the first stretch of every entry a move nobody
  // could see — the sheet looked like it started partway up because that is where it
  // first became visible. It is also where closing leaves it, so there is one offscreen
  // position rather than two.
  const y = useRef(new Animated.Value(restH)).current;
  const [kbH, setKbH] = useState(0);
  const offscreenY = restH + kbH;

  // On the native driver, and that is the point.
  //
  // A JS-driven spring advances on the JS thread, which is exactly the thread that is
  // busy mounting a floor's worth of content at the moment the sheet opens. The frames
  // are not rendered but its clock still runs, so the first frame that DID render was
  // already well along and the sheet seemed to pop into view partway up. Waiting for
  // layout shrank that; it could not remove it, because the contention is after layout.
  // On the UI thread the travel is unaffected by whatever JS is doing.
  //
  // Possible now only because a single resting height means nothing layout-driven
  // animates: `height` is a constant and the two animated props — this transform and the
  // scrim's opacity — are both native-capable. A view may not mix the two drivers, which
  // is why the height animation ruled this out before.
  const springTo = useCallback(
    (to: number, cb?: () => void) => {
      Animated.spring(y, { toValue: to, useNativeDriver: true, damping: 24, stiffness: 190, mass: 0.9 }).start(
        ({ finished }) => finished && cb?.()
      );
    },
    [y]
  );

  /**
   * Animate out and report the dismissal — whatever happens to the animation.
   *
   * The decision was made when the finger left the glass; the animation is how it looks,
   * not whether it happened. Reporting it only from a completion callback that only runs
   * on `finished` made every way of losing that callback — an interruption, an exception
   * thrown mid-flight — leave the sheet logically OPEN and parked offscreen. That state is
   * unrecoverable from the outside: the caller still thinks the sheet is up, so opening it
   * again changes no prop the sheet watches, and nothing the user can do brings it back.
   * A dismissal must not be able to go missing.
   */
  const dismiss = useCallback(
    (to: number, done: () => void) => {
      let fired = false;
      const fire = () => {
        if (fired) return;
        fired = true;
        done();
      };
      const watchdog = setTimeout(fire, 600);
      Animated.spring(y, { toValue: to, useNativeDriver: true, damping: 24, stiffness: 190, mass: 0.9 }).start(
        () => {
          clearTimeout(watchdog);
          fire();
        }
      );
    },
    [y]
  );

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
  //
  // springTo goes through here too, and that is not decoration. It used to be called
  // directly from the handlers, which means the frozen responder held whichever version
  // of it existed at mount. Change the driver from JS to native and a running app ends up
  // with an open effect that makes the value native and a release handler that still
  // animates it with the JS driver — which throws. Nothing the responder touches may be
  // captured; this ref is the whole reason it works.
  const live = useRef({ restH, kbH, tall, onClose, springTo, dismiss });
  live.current = { restH, kbH, tall, onClose, springTo, dismiss };

  // Is the sheet logically open — opened by someone and not yet dismissed?
  //
  // Separate from whether it is on screen, because being covered is not being closed.
  // Sliding up again on the way back is a lie about what happened: nothing was dismissed,
  // a screen was simply taken off the top. It also announces itself for no reason, which
  // is what it looked like.
  const openedRef = useRef(false);
  /** Opened, offscreen, waiting for the content to exist before it travels. */
  const pendingOpen = useRef(false);
  /** Was covered by a pushed screen. Only a sheet coming back from THAT should be
   *  planted at its resting position; see the effect below for what went wrong when
   *  any re-run could do it. */
  const wasSuspended = useRef(false);

  /** The pending entry frame, so it can be cancelled. */
  const entryFrame = useRef<number | null>(null);
  /** False once unmounted. Read by anything that was scheduled before that. */
  const alive = useRef(true);

  const beginEntry = useCallback(() => {
    if (!pendingOpen.current) return;
    pendingOpen.current = false;
    // One frame after layout. Layout is not paint — the same lesson the elevator
    // transition records — and travelling from a position that has not been drawn yet
    // spends the first stretch of the trip on an empty stage.
    //
    // The handle is kept because this frame outlives the sheet otherwise. The effect's
    // 250ms fallback was already cleared on cleanup, but the frame it schedules was not:
    // a sheet unmounted in between would start a spring on a gone component. On CI that
    // surfaced as `Cannot read properties of undefined (reading 'spring')` in an
    // unrelated suite — the callback ran after jest had torn the module registry down,
    // so `Animated` itself was gone. Locally it never fired, which is exactly what a
    // teardown race looks like.
    entryFrame.current = requestAnimationFrame(() => {
      entryFrame.current = null;
      // Belt and braces with the cancel below. Cancelling depends on the host's
      // cancelAnimationFrame actually cancelling — under jest's preset rAF is a
      // setTimeout shim, and the same crash came back from CI after the cancel was in
      // place. A callback that checks whether the sheet is still there cannot be
      // defeated by an environment where the cancel is a no-op.
      if (!alive.current) return;
      springTo(0);
    });
  }, [springTo]);

  // Nothing scheduled may outlive the sheet.
  useEffect(() => () => {
    alive.current = false;
    if (entryFrame.current !== null) cancelAnimationFrame(entryFrame.current);
  }, []);

  useEffect(() => {
    if (!visible) {
      openedRef.current = false;
      y.setValue(offscreenY);
      return;
    }
    if (suspended) {
      wasSuspended.current = true;
      return; // covered: leave the position and the detent exactly as they are
    }
    if (openedRef.current) {
      // Uncovered after being suspended — already open, so just be there.
      //
      // Guarded by wasSuspended, and that guard is the whole fix for a content-sized
      // sheet appearing fully formed instead of sliding up. This effect also re-runs
      // when `offscreenY` changes, and offscreenY moves the moment the content is
      // MEASURED (restH is derived from contentH for a content-sized sheet). So the
      // sequence was:
      //
      //   1. visible -> park offscreen with the old restH, arm the entry
      //   2. content lays out at a different height -> restH changes -> offscreenY
      //      changes -> effect re-runs
      //   3. openedRef is already true, so this branch fires and plants the sheet at
      //      its resting position mid-entry
      //
      // The closing animation was untouched, which is exactly the reported shape: it
      // appeared instantly and left smoothly. A size="tall" sheet never hit it because
      // TALL_H is a constant, so its offscreenY never moves — which is why the career
      // tab looked right and the profile's badge sheet did not.
      if (wasSuspended.current) {
        wasSuspended.current = false;
        y.setValue(0);
      }
      return;
    }
    openedRef.current = true;
    y.setValue(offscreenY);
    // Parked offscreen, and it stays there until the content has actually laid out.
    //
    // Starting the spring here instead is why the sheet seemed to appear a quarter of the
    // way up and rise from there: the animation began immediately while the content — a
    // whole floor's worth of curricula and situations — was still mounting. The spring's
    // clock does not wait, so by the time there was anything to see it had already
    // travelled. Nothing was skipping; the first quarter of the trip was played to an
    // empty stage.
    pendingOpen.current = true;
    // If layout never arrives the sheet must not be stranded offscreen. It always does
    // for a mounted view, so this is a floor, not a schedule.
    const fallback = setTimeout(() => beginEntry(), 250);
    return () => clearTimeout(fallback);
  }, [visible, suspended, beginEntry, offscreenY, y]);

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
    dismiss(restH + kbH, onClose);
  }, [dismiss, restH, kbH, onClose]);

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
  // What a released drag does. Shared by BOTH responders — the grabber strip and the
  // header area below it — so the two cannot disagree about what counts as leaving.
  // Read through live.current for the same reason everything else here is: the
  // responder configs are built once and frozen (see the WARNING above).
  const release = useCallback((_e: unknown, g: { dy: number; vy: number }) => {
    const { restH: rh, kbH: kb, tall: isTall, onClose: done, springTo: spring, dismiss: leave } = live.current;
    const flungDown = g.vy > FLICK && g.dy > FLICK_MIN_DY;
    // How far it has to be hauled down to count as leaving. A tall sheet is measured
    // against the middle of the screen; a content sheet against a short nudge, since it
    // is a glance-and-dismiss surface and its whole height may be less than that.
    const leaveAt = isTall ? TALL_CLOSE_TRAVEL : CLOSE_THRESHOLD;
    if (g.dy > leaveAt || flungDown) {
      leave(rh + kb, done);
      return;
    }
    // Anything short of that returns to where it was — including a haul most of the way
    // down, which is the point of measuring against the midpoint.
    spring(0);
  }, [live]);

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
        y.setValue(0);
      },
      onPanResponderMove: (_e, g) => {
        // Downward follows the finger 1:1. Upward is rubber-banded when there is
        // nothing more to reveal, so the sheet never detaches from the bottom.
        y.setValue(g.dy > 0 ? g.dy : g.dy * 0.35);
      },
      onPanResponderRelease: (e, g) => release(e, g),
      onPanResponderTerminate: () => live.current.springTo(0),
    })
  ).current;

  // A SECOND responder, for the area below the strip that the caller marks as its
  // header.
  //
  // The 27px strip alone is a target you have to aim at, and the sheet's own comment
  // already admitted as much with a hitSlop. Extending the strip's responder over the
  // header is not the same thing though: it claims on TOUCH START, which would steal a
  // tap from anything interactive a header grows later — a close button, a pin toggle.
  // So this one claims only once the finger has actually moved vertically. A tap goes
  // to whatever is under it; a drag becomes the sheet's.
  const headerPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderGrant: () => { y.setValue(0); },
      onPanResponderMove: (_e, g) => { y.setValue(g.dy > 0 ? g.dy : g.dy * 0.35); },
      onPanResponderRelease: (e, g) => release(e, g),
      onPanResponderTerminate: () => { live.current.springTo(0); },
    }),
  ).current;

  const shown = visible && !suspended;

  // The sheet itself, independent of what presents it.
  const body = (
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
          // Straight off restH, not a second copy of the same constant. Writing the
          // rendered height and the height the gesture measures against as two separate
          // expressions let them disagree — and a test that read only the rendered one
          // passed while the drag was measuring the wrong sheet.
          ...(tall ? { height: restH } : { maxHeight: CONTENT_MAX }),
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
            // The content exists now, so the sheet can travel. Also the moment a
            // content-sized sheet learns how tall it is, which is the same moment.
            beginEntry();
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
        {header != null && <View {...headerPan.panHandlers}>{header}</View>}
        {children}
        </View>
      </Animated.View>
    </View>
  );

  // Hoisted into the tab-level host when one is offered and the caller asked for it.
  // Hooks run either way — a presentation choice must not change the hook order.
  const hosted = useSheetOverlay(useId(), body, overlay && shown);

  // Android's back button. The Modal path gets this for free through onRequestClose; in
  // the host the sheet is an ordinary view, so it has to ask. Registered only while the
  // sheet is actually on screen, so it never swallows a back press meant for the screen.
  useEffect(() => {
    if (!overlay || !hosted || !shown) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => sub.remove();
  }, [overlay, hosted, shown, close]);

  if (overlay && hosted) return null; // it is rendering over there
  if (!shown) return null;

  return (
    // Modal, for sheets with no host: it covers the screen wherever it is mounted (an
    // overlay nested in a ScrollView would not) and answers Android's back button.
    // animationType is 'none' because the drag animation is ours.
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={close}>
      {body}
    </Modal>
  );
}
