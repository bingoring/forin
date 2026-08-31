// A block that slides open and shut. The app's one disclosure.
//
// Written once because it was written once already, for the building dropdown, and every
// other expandable block in the app was still `open && <View/>` — attached and detached, so
// the list changed height in a single frame and the revealed rows arrived already in place.
// Nothing says which part of the screen just changed, which is the whole job of the motion.
//
// Two things here are load-bearing and easy to lose:
//
//  1. The children are ALWAYS mounted and clipped, never conditionally rendered. That is
//     what makes the height knowable: `height: auto` cannot be animated, so the content has
//     to be measured at its natural size, and overflow does not affect layout — onLayout
//     reports the full height even while the container is clipped to nothing.
//
//  2. useNativeDriver is false and must be. Height is a layout property the native driver
//     cannot touch, and a view may not mix a natively-driven prop with a JS-driven one.
//
// 190ms with an ease-out: long enough to read as movement, short enough that it never
// stands between a tap and the content.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, View } from 'react-native';
import { PixelIcon } from '@/components/PixelIcon';

/** The shared timing. Exported so a caller that animates alongside can match it. */
export const DISCLOSURE_MS = 190;

export function Collapsible({ open, children, style }: {
  open: boolean;
  children: ReactNode;
  /** Applied to the clipping container — borders that should only show when open, etc. */
  /** Applied to the clipping container — borders that should only show when open, and
   *  a WIDTH where the caller needs one.
   *
   *  Width matters more than it looks: this component sits between a caller and its
   *  content, and its own box is auto-width. A caller whose content is a `flex: 1` child
   *  needs a definite width all the way down, and a parent's width does not reach
   *  through an auto-width link. The mission panel laid out at ~0pt for exactly that
   *  reason — the width was set above this and stretched below it, with nothing in
   *  between. */
  style?: { borderTopWidth?: number; borderTopColor?: string; marginTop?: number; width?: number; alignSelf?: 'stretch' };
}) {
  const [contentH, setContentH] = useState(0);
  // Starts where the state already is, so a block that begins open is simply open rather
  // than unfolding at whoever just arrived on the screen.
  const anim = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: DISCLOSURE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [open, anim]);

  return (
    <Animated.View
      style={{
        ...style,
        overflow: 'hidden',
        // Before the first measurement there is nothing to interpolate towards, and
        // `undefined` would mean "natural height" — a closed block showing its contents for
        // a frame. Zero is the honest placeholder, and the measurement still happens because
        // clipping does not change layout.
        height: contentH === 0 ? (open ? undefined : 0) : anim.interpolate({ inputRange: [0, 1], outputRange: [0, contentH] }),
      }}
    >
      <View
        // Inherits the container's width, so the chain has no auto link inside this
        // component either.
        style={{ alignSelf: 'stretch' }}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0 && Math.abs(h - contentH) > 1) setContentH(h);
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}

/**
 * The chevron that turns instead of swapping.
 *
 * Swapping chevron-down for chevron-up says the state changed; turning says it is
 * changing, at the same time and speed as the block it describes.
 */
export function DisclosureChevron({ open, color, size = 13, sw = 2 }: {
  open: boolean;
  color: string;
  size?: number;
  sw?: number;
}) {
  const anim = useRef(new Animated.Value(open ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: DISCLOSURE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [open, anim]);
  return (
    <Animated.View style={{ transform: [{ rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>
      <PixelIcon name="chevron-down" color={color} size={size} sw={sw} />
    </Animated.View>
  );
}
