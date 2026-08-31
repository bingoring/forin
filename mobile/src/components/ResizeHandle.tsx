// A grabbable edge: drag it and the band above or below it resizes.
//
// The app's third gesture, after the bottom sheet's grabber and the map's pan. It exists
// because the dialogue screen has two edges nobody but the reader can place: how much
// room the character needs, and how much the reply choices need. Every fixed fraction was
// wrong for somebody — the choices covered the conversation they were answers to, and
// moving the number only moved whose complaint it was.
//
// Two things are borrowed from BottomSheet's grabber, for the same reasons:
//
//  · It claims the responder on MOVEMENT, not on touch. Claiming on touch would steal
//    taps from whatever sits either side of the line.
//  · The bar is the sign and the padded view is the target. A 4pt line is not something
//    a thumb can find; the hit area is several times taller than the mark.
//
// The value is reported as a DELTA per gesture rather than an absolute, so the caller
// keeps ownership of the number it is clamping — this component knows nothing about what
// is above or below it.
import { useMemo, useRef } from 'react';
import { PanResponder, View } from 'react-native';
import { colors } from '@/theme/tokens';

const C = colors.ink;
/** Vertical movement before the drag is claimed. Below this a wobble during a tap would
 *  turn into a resize. */
const CLAIM_PX = 4;

export function ResizeHandle({ onDrag, onDone, testID }: {
  /** Called with the total movement since this gesture began, in points. Down is
   *  positive. The caller applies and clamps it — see data/dialogueSplit. */
  onDrag: (dy: number) => void;
  /** Gesture over: a good place to persist whatever the caller settled on. */
  onDone?: () => void;
  testID?: string;
}) {
  // The callbacks are read through a ref because PanResponder is built once and would
  // otherwise close over the first render's functions — the same trap the sheet's drag
  // fell into, where it kept animating to a stale height.
  const live = useRef({ onDrag, onDone });
  live.current = { onDrag, onDone };

  const pan = useMemo(
    () =>
      PanResponder.create({
        // Movement, not touch. On touch this would eat taps aimed at the rows either
        // side of the line.
        onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > CLAIM_PX,
        onPanResponderMove: (_e, g) => live.current.onDrag(g.dy),
        onPanResponderRelease: () => live.current.onDone?.(),
        onPanResponderTerminate: () => live.current.onDone?.(),
      }),
    [],
  );

  return (
    <View
      testID={testID}
      {...pan.panHandlers}
      // The target, not the mark: tall enough to find without aiming.
      style={{ paddingVertical: 7, alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{ height: 4, width: 46, backgroundColor: C, opacity: 0.45 }} />
    </View>
  );
}
