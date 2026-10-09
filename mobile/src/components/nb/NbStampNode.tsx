// NbStampNode — the postage-stamp waypoint on the irregular stamp trail.
// journey-binder-v42 Task H, task-H-brief.md §3 (정본) ·
// docs/dlc/projects/forin/inputs/design-handoff_v42/reference/forin-notebook-journey2.jsx
// `Stamp()` 42~76행.
//
// Purely presentational — it does not know about pressing (StationTrack wraps it in its
// own Pressable, same split as the old Station.tsx) and does not know the learner's
// scenario data, only the four visual facts the brief lists: state/icon/n/wash/rot/delay.
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { Circle, G, Rect, Svg, Path, Text as SvgText } from 'react-native-svg';
import { NbIcon, type NbIconName } from './NbIcon';
import { nb, nbFonts } from '@/theme/nb';

export type NbStampState = 'done' | 'here' | 'next' | 'locked';

export function NbStampNode({ size = 62, state, icon, n, wash, rot = 0, delay = 0, animate = true }: {
  size?: number;
  state: NbStampState;
  icon: NbIconName;
  n: number;
  wash?: string;
  rot?: number;
  delay?: number;
  /** Gates the pop-in (scale/rotate) AND the `here` flag's bob/wag loops. Not one of the
   *  brief's literal §3 props — those describe what the stamp looks like, not the two
   *  cross-cutting reasons an instance might have to hold still: K7 (reduce motion, read
   *  once by StationTrack from AccessibilityInfo) and the "only the initially-visible
   *  stamps animate" rule §7 spells out (a screen holds 41~47 of these; starting 47
   *  Animated.timing loops on the same tick is the dropped first frame the brief warns
   *  about). Both collapse to the same switch from this component's point of view: when
   *  false, render the FINAL pose immediately rather than a half-finished frame. Defaults
   *  to true so a caller that never passes it keeps the brief's plain animated stamp. */
  animate?: boolean;
}) {
  const tooth = 6;
  const teeth = Math.round(size / tooth);
  const dots: [number, number][] = [];
  for (let i = 0; i < teeth; i++) {
    const p = i * tooth + tooth / 2;
    dots.push([p, 0], [p, size], [0, p], [size, p]);
  }

  const locked = state === 'locked';
  const fill = state === 'done' ? (wash || 'rgba(95,141,90,.16)') : state === 'here' ? 'rgba(233,196,90,.28)' : nb.paper;
  const stroke = state === 'here' ? nb.marker : locked ? nb.soft : nb.ink;
  const strokeWidth = state === 'here' ? 2 : 1.4;

  // ── pop-in (scale 0→1.1→1, rotate -12deg→2deg→0, 0.4s) ──────────────────────────────
  const progress = useRef(new Animated.Value(animate ? 0 : 1)).current;
  useEffect(() => {
    if (!animate) { progress.setValue(1); return; }
    const t = Animated.timing(progress, {
      toValue: 1,
      duration: 400,
      delay: delay * 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true, // scale + rotate only.
    });
    t.start();
    return () => t.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);
  // Three-stop interpolation reproduces the CSS keyframes' 0%/70%/100% overshoot from one
  // linear 0→1 clock, the same trick the reference's `nbj2-pop` keyframes use.
  const scale = progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 1.1, 1] });
  const entranceRotate = progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: ['-12deg', '2deg', '0deg'] });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        opacity: locked ? 0.5 : 1,
        // Two `rotate` entries compose additively (RN applies transforms in array order):
        // `entranceRotate` is the transient -12deg→2deg→0deg flourish (§7), `rot` is the
        // stamp's own lasting scatter tilt (§3) — the entrance settles INTO `rot`, not
        // past it back to flat. (The reference's CSS keyframes literally clobber the
        // static `rotate(rot deg)` for the element's whole life once the animation's
        // `both` fill-mode takes over, which would flatten every stamp to 0deg at rest —
        // read as an artefact of porting a one-off inline style into an animation
        // shorthand, not an intentional "stamps end up flat" rule; the brief states the
        // scatter tilt as its own standing requirement in §3, separately from §7's
        // transient, so this composes them instead of reproducing that collision.)
        transform: [{ rotate: entranceRotate }, { rotate: `${rot}deg` }, { scale }],
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Rect x={1} y={1} width={size - 2} height={size - 2} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={locked ? '3 3' : undefined} />
        {dots.map(([cx, cy], i) => <Circle key={i} cx={cx} cy={cy} r={2.6} fill={nb.cream} />)}
        <Rect x={7} y={7} width={size - 14} height={size - 14} fill="none" stroke={locked ? 'rgba(62,54,43,.25)' : 'rgba(62,54,43,.35)'} strokeWidth={1} strokeDasharray="2 2" />
        <SvgText x={size - 9} y={15} textAnchor="end" fontFamily={nbFonts.monoBold} fontSize={7.5} fill={locked ? nb.soft : nb.ink}>
          {String(n).padStart(2, '0')}
        </SvgText>
      </Svg>

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
        {locked ? <NbIcon name="lock" size={size * 0.3} color={nb.soft} /> : <NbIcon name={icon} size={size * 0.38} />}
      </View>

      {state === 'done' && (
        <View style={{ position: 'absolute', right: -6, bottom: -6, width: 24, height: 24, transform: [{ rotate: '-14deg' }] }}>
          <Svg width={24} height={24} viewBox="0 0 24 24" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Two concentric rings stand in for CSS's `border: 2px double` — RN has no
                double border style, so the "겹줄" is drawn as two strokes instead of one. */}
            <Circle cx={12} cy={12} r={11} fill="rgba(241,235,221,.85)" stroke={nb.green} strokeWidth={1.3} />
            <Circle cx={12} cy={12} r={8.4} fill="none" stroke={nb.green} strokeWidth={1} />
          </Svg>
          {/* Drawn, not typed: NbIcon.tsx already banks a `check` glyph in the same
              24×24 space for exactly this reason (its own comment cites the same
              ratchet — theme/glyphs.test.ts) — a typographic ✓ would sit at the font's
              weight and baseline instead of this icon set's 1.7px stroke. */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="check" size={14} color={nb.green} />
          </View>
        </View>
      )}

      {state === 'here' && <HereFlag size={size} animate={animate} />}
    </Animated.View>
  );
}

/** The flagpole above a `here` stamp — bobs (±3px, 2s loop) while its flag independently
 *  wags (-3deg↔3deg, 2s loop) around the pole-side pivot. Split into two layers (a static
 *  pole Svg + a rotating flag Svg) rather than one Svg with an animated `rotation` prop:
 *  react-native-svg's own rotation/origin props don't reliably animate under either driver
 *  (Sprite.tsx hit the same wall with reanimated and works around it the same way, one
 *  layer up — via a wrapping transform rather than an SVG-native one), but RN's
 *  `transformOrigin` style DOES apply to an Animated.View (NbCharacter already leans on
 *  this for its waddle's foot-pivot sway), so the flag gets its own small Animated.View
 *  layered over the static pole instead. */
function HereFlag({ size, animate }: { size: number; animate: boolean }) {
  const bob = useRef(new Animated.Value(0)).current;
  const wag = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!animate) { bob.setValue(0); wag.setValue(0); return; }
    const bobLoop = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    const wagLoop = Animated.loop(Animated.sequence([
      Animated.timing(wag, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(wag, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    bobLoop.start();
    wagLoop.start();
    return () => { bobLoop.stop(); wagLoop.stop(); };
  }, [animate, bob, wag]);
  const translateY = bob.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -3, 0] });
  const rotate = wag.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['-3deg', '3deg', '-3deg'] });

  return (
    <Animated.View
      testID="stamp-here-flag"
      style={{ position: 'absolute', left: size / 2 - 13, top: -30, width: 26, height: 30, transform: [{ translateY }] }}
    >
      <Svg width={26} height={30} viewBox="0 0 26 30" style={{ position: 'absolute', top: 0, left: 0 }}>
        <Path d="M6 2 V29" stroke={nb.ink} strokeWidth={1.8} />
      </Svg>
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, width: 26, height: 30, transformOrigin: '6px 8px', transform: [{ rotate }] }}>
        <Svg width={26} height={30} viewBox="0 0 26 30">
          <Path d="M6 3 L22 8 L6 13 Z" fill={nb.red} stroke={nb.ink} strokeWidth={1.3} />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}
