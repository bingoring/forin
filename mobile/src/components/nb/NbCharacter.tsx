// NbCharacter — the notebook line's full-body 2-head character (handoff v37 §07).
//
// The home ward used to walk a PIXEL sprite, and a pixel sprite on a paper page is the one
// thing the notebook line forbids. This is the same walk, redrawn in ink: the FACE is
// NbAvatar's own head (its back/front hair, eyes, mouth, hat and accessory layers, reused
// at 0.8 so a face the learner built shows up unchanged), and the BODY is a short 2-head
// figure — an outfit-colour torso with a V-neck, two stub arms with skin hands, two stub
// legs. It shares AvatarSpec with NbAvatar, so one stored face draws both the portrait and
// the walker.
//
// The waddle is an Animated loop on the native driver (not reanimated — this is the sibling
// of home/LiveWard, which drives its blinks and patrol the same way): the whole body sways
// ±3.5° around the FEET (transformOrigin bottom) with a small vertical bob, which reads as
// 아장아장 without per-limb SVG rotation. `flip` mirrors the whole drawing for the walk
// direction.
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { ACCS, BACK, EYES, FRONT, HAIRC, HATS, K, MOUTHS, OUTC, SKINS, W } from './NbAvatar';
import { DEFAULT_AVATAR_SPEC, type AvatarSpec } from '@/data/nbAvatar';

/** `size` is the WIDTH; the frame is 64×96, so the height follows. */
export function NbCharacter({ spec, walking = false, flip = false, size = 40 }: {
  spec?: Partial<AvatarSpec>;
  walking?: boolean;
  flip?: boolean;
  size?: number;
}) {
  const s = { ...DEFAULT_AVATAR_SPEC, ...spec };
  const sk = SKINS[s.skin] ?? SKINS.beige;
  const hc = HAIRC[s.hairColor] ?? HAIRC.darkbrown;
  const oc = OUTC[s.outfitColor] ?? OUTC.sage;
  const ocDk = K; // the ink outline is the only shading the notebook line uses.

  // The waddle: one clock, sway + bob. Held off the JS thread so the home screen's load
  // never stutters the ward.
  const wob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!walking) { wob.setValue(0); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wob, { toValue: 1, duration: 220, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(wob, { toValue: 0, duration: 220, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [walking, wob]);
  const rotate = wob.interpolate({ inputRange: [0, 1], outputRange: ['-3.5deg', '3.5deg'] });
  const bob = wob.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -1.5, 0] });

  return (
    <View style={{ width: size, height: (size * 96) / 64, transform: [{ scaleX: flip ? -1 : 1 }] }}>
      <Animated.View style={{ flex: 1, transformOrigin: 'bottom center', transform: [{ translateY: bob }, { rotate }] }}>
        <Svg viewBox="0 0 64 96" width="100%" height="100%">
          {/* ── body (2-head), drawn before the head so the neck tucks under the chin ── */}
          {/* legs: two stubs with kicked feet, parted for a mid-stride stance. */}
          <Path d="M27 72 L25 88 L20 89 L20 86 L25 84 Z" fill={oc} stroke={ocDk} strokeWidth={W} strokeLinejoin="round" />
          <Path d="M37 72 L39 88 L44 89 L44 86 L39 84 Z" fill={oc} stroke={ocDk} strokeWidth={W} strokeLinejoin="round" />
          {/* torso: outfit-colour, slightly trapezoidal, starting at y38 so it overlaps the chin. */}
          <Path d="M22 40 Q32 37 42 40 L44 73 Q32 77 20 73 Z" fill={oc} stroke={ocDk} strokeWidth={W} strokeLinejoin="round" />
          {/* V-neck line. */}
          <Path d="M28 40 L32 46 L36 40" fill="none" stroke={ocDk} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          {/* arms: outfit stubs ending in skin hands. */}
          <Path d="M22 42 L18 58" fill="none" stroke={oc} strokeWidth={5} strokeLinecap="round" />
          <Path d="M22 42 L18 58" fill="none" stroke={ocDk} strokeWidth={1.4} strokeLinecap="round" />
          <Circle cx="18" cy="59" r="3" fill={sk} stroke={K} strokeWidth={1.4} />
          <Path d="M42 42 L46 58" fill="none" stroke={oc} strokeWidth={5} strokeLinecap="round" />
          <Path d="M42 42 L46 58" fill="none" stroke={ocDk} strokeWidth={1.4} strokeLinecap="round" />
          <Circle cx="46" cy="59" r="3" fill={sk} stroke={K} strokeWidth={1.4} />
          {/* neck: a short skin bridge under the head. */}
          <Rect x="29.5" y="33" width="5" height="8" fill={sk} stroke={K} strokeWidth={1.2} />

          {/* ── head: NbAvatar's own layers, at 0.8 and centred (no background, no portrait
              shoulders — the body above is this figure's outfit). ── */}
          <G transform="translate(6.4, 0) scale(0.8)">
            {(BACK[s.hair] ?? BACK.short)(hc)}
            <Circle cx="32" cy="32" r="14" fill={sk} stroke={K} strokeWidth={W} />
            {(MOUTHS[s.mouth] ?? MOUTHS.line)()}
            {(EYES[s.eyes] ?? EYES.dot)()}
            {(FRONT[s.hair] ?? FRONT.short)(hc)}
            {(HATS[s.hat] ?? HATS.none)(oc)}
            {(ACCS[s.acc] ?? ACCS.none)()}
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}
