// A portrait that is alive: it breathes, it blinks, and it reacts.
//
// The walking sprite has had idle breathing and a blink since the motion spec
// (Sprite.tsx §2-3) while the portrait — the face on the home screen, the profile card
// and the dialogue frame — sat perfectly still. TestFlight feedback asked for a
// character that moves like Duolingo's, and the honest reading of that is not a new
// mascot: it is the face already on screen doing the two things the sprite does, plus
// reacting when something happens.
//
// The same reanimated primitives as Sprite, deliberately: one motion vocabulary means
// the portrait and the sprite read as the same character rather than two.
import { useEffect, useMemo } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { FacePlayer } from './Face';
import type { Expression, HairStyle } from './Sprite';

export type FaceReaction = 'none' | 'cheer' | 'slump' | 'nod';

export function AnimatedFace({
  size = 80,
  expression = 'focused',
  avatar,
  reaction = 'none',
  /** Motion off. Honoured automatically for "reduce motion", but callers can force it
   *  — a face that bobs behind a modal scrim is a distraction, not life. */
  still = false,
}: {
  size?: number;
  expression?: Expression;
  avatar?: { hairStyle?: HairStyle; hair?: string; skin?: string; scrub?: string };
  reaction?: FaceReaction;
  still?: boolean;
}) {
  // A per-instance phase so two faces on one screen do not breathe in lockstep, which
  // reads as a screensaver rather than as two people.
  const phase = useMemo(() => Math.random(), []);
  const breathe = useSharedValue(phase);
  const blink = useSharedValue(0);
  const react = useSharedValue(0);
  const motion = useSharedValue(still ? 0 : 1);

  // Reduce Motion is a system setting people turn on because movement makes them ill.
  // Idle breathing is exactly the kind of ambient motion it means to stop.
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (alive) motion.value = reduced || still ? 0 : 1;
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (reduced) => {
      motion.value = reduced || still ? 0 : 1;
    });
    return () => {
      alive = false;
      sub.remove();
    };
  }, [motion, still]);

  useEffect(() => {
    // withRepeat(..., false) sticks at 1, so the ping-pong needs reverse=true — the
    // same trap Sprite.tsx documents.
    breathe.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true);
    blink.value = withDelay(
      Math.round(phase * 4000),
      withRepeat(
        withSequence(
          withTiming(0, { duration: 4200 }),
          withTiming(1, { duration: 70 }),
          withTiming(0, { duration: 70 }),
        ),
        -1,
        false,
      ),
    );
  }, [breathe, blink, phase]);

  // Reactions are one-shots, not states: the face returns to idle on its own so no
  // caller has to remember to clear it.
  useEffect(() => {
    if (reaction === 'none') return;
    react.value = 0;
    react.value = withSequence(
      withTiming(1, { duration: reaction === 'slump' ? 220 : 140, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: reaction === 'slump' ? 420 : 260, easing: Easing.inOut(Easing.quad) }),
    );
  }, [reaction, react]);

  const style = useAnimatedStyle(() => {
    'worklet';
    const m = motion.value;
    const lift = -breathe.value * size * 0.012 * m; // a couple of pixels at size 80
    const r = react.value * m;
    // cheer rises and grows slightly; slump sinks and shrinks; nod only dips.
    const reactY = reaction === 'cheer' ? -r * size * 0.11 : reaction === 'slump' ? r * size * 0.06 : r * size * 0.05;
    const scale = reaction === 'cheer' ? 1 + r * 0.06 : reaction === 'slump' ? 1 - r * 0.04 : 1;
    return { transform: [{ translateY: lift + reactY }, { scale }] };
  });

  // The blink is a lid drawn over the eye row rather than an expression swap: swapping
  // to a closed-eye expression would change the mouth too, so the face would smile
  // differently every four seconds.
  const lidStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: blink.value * motion.value };
  });

  const skin = avatar?.skin ?? '#F8D7B2';

  return (
    <Animated.View style={style}>
      <FacePlayer size={size} expression={expression} avatar={avatar} />
      {/* Eye row of the 16×18 face viewBox sits a little above the middle. Positioned
          in fractions of `size` so it tracks every call site's scale. */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            left: size * 0.24,
            right: size * 0.24,
            top: size * 0.47,
            height: Math.max(1, size * 0.045),
            backgroundColor: skin,
          },
          lidStyle,
        ]}
      />
    </Animated.View>
  );
}

/** Non-animated fallback, for lists where dozens of faces would each start a clock. */
export function StillFace(props: Parameters<typeof AnimatedFace>[0]) {
  return (
    <View>
      <FacePlayer size={props.size} expression={props.expression} avatar={props.avatar} />
    </View>
  );
}
