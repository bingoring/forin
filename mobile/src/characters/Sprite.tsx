// Character sprites — faithful RN port of design-handoff/reference/forin-npcs-smooth.jsx.
// "Smooth Derp" chibi: a big round head over a small body + short legs (viewBox 64×80,
// head fills the upper ~55%). Same role palette, deterministic x,y variation, and 12
// expressions as the reference. Rendered with react-native-svg (rect/path/ellipse 1:1).
import { memo, useEffect, useMemo } from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

const INK = '#3A2E26'; // soft dark-brown outline (not pure black)

// Animated SVG group — limbs rotate around a hip/shoulder pivot when walking
// (06_CHARACTER_MOTION §2). react-native-svg has no SMIL, so we drive rotation
// on the UI thread via reanimated. `clock` ticks 0→1 every stride; `gate` is
// 0/1 for walking so a single shared clock can run continuously.
const AnimatedG = Animated.createAnimatedComponent(G);

function SwingLimb({
  swing,
  gate,
  amp,
  dirSign,
  pivotX,
  pivotY,
  children,
}: {
  swing: SharedValue<number>; // ping-pongs 0↔1
  gate: SharedValue<number>; // 0 standing / 1 walking
  amp: number; // peak rotation (deg)
  dirSign: 1 | -1; // opposite limbs swing in anti-phase
  pivotX: number;
  pivotY: number;
  children: React.ReactNode;
}) {
  // NOTE: react-native-svg's animated `rotation`/`originX`/`originY` props are a
  // no-op here (verified on device), so rotate via the `transform` array instead
  // — translate to the pivot, rotate, translate back. This react-native-svg path
  // actually applies under reanimated.
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const rot = (swing.value * 2 - 1) * amp * dirSign * gate.value; // -amp..amp
    return {
      transform: [
        { translateX: pivotX },
        { translateY: pivotY },
        { rotate: `${rot}deg` },
        { translateX: -pivotX },
        { translateY: -pivotY },
      ],
    };
  });
  return <AnimatedG animatedProps={animatedProps}>{children}</AnimatedG>;
}

function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return '#' + [r, g, bl].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export type Expression =
  | 'neutral' | 'derp' | 'happy' | 'sad' | 'worried' | 'pain'
  | 'surprised' | 'angry' | 'thinking' | 'sleepy' | 'panic' | 'focused' | 'shy';

export type HairStyle =
  | 'short' | 'long' | 'bob' | 'pigtails' | 'bun' | 'curly' | 'mohawk'
  | 'bald' | 'cap' | 'peakedCap';

export interface SmoothSpriteProps {
  hair?: string;
  hairStyle?: HairStyle;
  skin?: string;
  shirt?: string;
  shirtDk?: string;
  leg?: string;
  shoe?: string;
  hatTone?: string;
  hatTrim?: string;
  chestCross?: boolean;
  chestMark?: React.ReactNode;
  expression?: Expression;
  mask?: boolean;
  width?: number;
  /** Facing — front(down)/back(up)/3-4 side(left|right). Left mirrors right. */
  dir?: SpriteDir;
  /** Walking gate (limb-swing/bob animation lands in 5c-ii). */
  walking?: boolean;
}

export type SpriteDir = 'down' | 'up' | 'left' | 'right';

function SmoothSpriteBase({
  hair = '#3C2A18',
  hairStyle = 'short',
  skin = '#F8D7B2',
  shirt = '#A7F3D0',
  shirtDk,
  leg = '#3F3D52',
  shoe = '#2A1B0E',
  hatTone,
  hatTrim,
  chestCross = false,
  chestMark,
  expression = 'neutral',
  mask = false,
  width = 40,
  dir = 'down',
  walking = false,
}: SmoothSpriteProps) {
  const facingSide = dir === 'left' || dir === 'right';
  const flip = dir === 'left';

  // ── Motion (06_CHARACTER_MOTION §2-3), reanimated on the UI thread ──
  // Continuous PING-PONG clocks (reverse=true). NOTE: withRepeat(withTiming(1),
  // -1, false) does NOT loop a ramp — it sticks at 1 (1→1 each repeat), which
  // froze the motion after one cycle. reverse=true gives a real 0↔1 oscillation.
  // Per-instance random start `phase` desyncs a crowd without a dead delay.
  const phase = useMemo(() => Math.random(), []);
  const swing = useSharedValue(phase); // 0↔1 every 0.5s — limb swing + walk bob
  const breathe = useSharedValue(phase); // 0↔1 every ~3.2s — idle breathing
  const gate = useSharedValue(0); // 0 standing / 1 walking
  const blink = useSharedValue(0); // eyelid opacity pulse (front idle)

  useEffect(() => {
    swing.value = withRepeat(withTiming(1, { duration: 250, easing: Easing.linear }), -1, true);
    breathe.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), -1, true);
    // idle blink: closed ~120ms on a ~5.5s cycle, desynced.
    blink.value = withDelay(
      Math.round(phase * 5000),
      withRepeat(withSequence(withTiming(0, { duration: 5380 }), withTiming(1, { duration: 60 }), withTiming(0, { duration: 60 })), -1, false),
    );
  }, [swing, breathe, blink, phase]);

  useEffect(() => {
    gate.value = withTiming(walking ? 1 : 0, { duration: 140 });
  }, [walking, gate]);

  const bodyStyle = useAnimatedStyle(() => {
    'worklet';
    const idle = 1 - gate.value;
    const walkBobY = -Math.sin(swing.value * Math.PI) * 2 * gate.value; // 2 bobs/stride
    const breatheY = -breathe.value * 2.5 * idle; // visible gentle rise (~2.5px)
    return {
      transform: [{ translateY: walkBobY + breatheY }, { scaleY: 1 + breathe.value * 0.02 * idle }],
    };
  });

  const blinkProps = useAnimatedProps(() => ({ opacity: blink.value }));
  const H = hair;
  const HL = mix(hair, '#FFFFFF', 0.22);
  const HD = mix(hair, INK, 0.3);
  const sh = mix(skin, '#C98A5E', 0.3); // skin shadow
  const slo = mix(skin, INK, 0.35); // skin outline
  const shirtDark = shirtDk || mix(shirt, INK, 0.28);
  const legDk = mix(leg, INK, 0.3);
  const height = (width * 80) / 64;

  const HX = 32, HY = 26, HRX = 22, HRY = 21; // head: center (32,26), rx 22, ry 21

  const hairBack = () => {
    switch (hairStyle) {
      case 'long':
        return <Path d="M8 22 Q6 50 12 60 L18 58 Q15 38 17 24 Z M56 22 Q58 50 52 60 L46 58 Q49 38 47 24 Z" fill={HD} />;
      case 'bob':
        return <Path d="M9 24 Q8 44 14 50 L18 48 Q15 34 16 24 Z M55 24 Q56 44 50 50 L46 48 Q49 34 48 24 Z" fill={HD} />;
      case 'pigtails':
        return (
          <G>
            <Ellipse cx={9} cy={34} rx={7} ry={9} fill={H} />
            <Ellipse cx={55} cy={34} rx={7} ry={9} fill={H} />
            <Ellipse cx={8} cy={31} rx={2.5} ry={3} fill={HL} />
            <Ellipse cx={54} cy={31} rx={2.5} ry={3} fill={HL} />
          </G>
        );
      default:
        return null;
    }
  };

  const hairFront = () => {
    switch (hairStyle) {
      case 'bald':
        return (
          <G>
            <Path d="M12 28 Q11 20 18 16" fill="none" stroke={H} strokeWidth={3} strokeLinecap="round" />
            <Path d="M52 28 Q53 20 46 16" fill="none" stroke={H} strokeWidth={3} strokeLinecap="round" />
          </G>
        );
      case 'cap':
        return (
          <G>
            {/* SOLID dome — no inner cut-out, zero scalp shows. Head spans x 8-56. */}
            <Path d="M8 21 Q6 1 32 0 Q58 1 56 21 Q32 26 8 21 Z" fill={hatTone} />
            <Path d="M13 11 Q32 3 51 11" fill="none" stroke={hatTone ? mix(hatTone, '#FFFFFF', 0.3) : '#FFF'} strokeWidth={2.5} strokeLinecap="round" />
            {hatTrim ? <Path d="M8 21 Q32 26 56 21" fill="none" stroke={hatTrim} strokeWidth={3.5} strokeLinecap="round" /> : null}
            {hatTrim === '#EF4444' ? (
              <G>
                <Rect x={29.5} y={5} width={5} height={10} rx={1} fill="#EF4444" />
                <Rect x={27} y={8} width={10} height={4} rx={1} fill="#EF4444" />
              </G>
            ) : null}
          </G>
        );
      case 'peakedCap':
        return (
          <G>
            <Path d="M9 21 Q7 1 32 0 Q57 1 55 21 Q32 25 9 21 Z" fill={hatTone} />
            <Path d="M5 21 Q32 16 59 21 L57 26 Q32 21 7 26 Z" fill={hatTone ? mix(hatTone, INK, 0.35) : INK} />
            {hatTrim ? <Ellipse cx={32} cy={12} rx={4} ry={3} fill={hatTrim} /> : null}
          </G>
        );
      case 'bun':
        return (
          <G>
            <Ellipse cx={32} cy={6} rx={7} ry={6} fill={H} />
            <Ellipse cx={30} cy={4.5} rx={2.5} ry={2} fill={HL} />
            <Path d="M11 26 Q12 8 32 6 Q52 8 53 26 Q50 15 32 13 Q14 15 11 26 Z" fill={H} />
            <Path d="M16 16 Q32 8 48 16" fill="none" stroke={HL} strokeWidth={2} strokeLinecap="round" />
          </G>
        );
      case 'curly':
        return (
          <G>
            {([[14, 16, 7], [24, 9, 8], [36, 9, 8], [48, 15, 7], [12, 26, 6], [52, 26, 6]] as const).map((c, i) => (
              <Circle key={i} cx={c[0]} cy={c[1]} r={c[2]} fill={H} />
            ))}
            {([[22, 8, 3], [36, 8, 3], [13, 22, 2.5]] as const).map((c, i) => (
              <Circle key={'h' + i} cx={c[0]} cy={c[1]} r={c[2]} fill={HL} />
            ))}
          </G>
        );
      case 'long':
        return (
          <G>
            <Path d="M11 26 Q12 4 32 4 Q52 4 53 26 Q48 14 38 13 Q40 18 36 20 Q32 12 28 20 Q24 18 26 13 Q16 14 11 26 Z" fill={H} />
            <Path d="M18 14 Q28 7 40 11" fill="none" stroke={HL} strokeWidth={2.5} strokeLinecap="round" />
          </G>
        );
      case 'pigtails':
        return (
          <G>
            <Path d="M12 24 Q14 6 32 6 Q50 6 52 24 Q46 14 38 13 Q40 18 36 20 Q32 13 28 20 Q24 18 26 13 Q18 14 12 24 Z" fill={H} />
            <Path d="M18 14 Q30 8 40 12" fill="none" stroke={HL} strokeWidth={2} strokeLinecap="round" />
          </G>
        );
      case 'mohawk':
        return (
          <G>
            <Path d="M27 2 Q32 -2 37 2 L36 18 Q32 15 28 18 Z" fill={H} />
            <Path d="M29 3 Q32 1 33 4 L32.5 14 Q31 13 30 14 Z" fill={HL} />
            <Path d="M14 24 Q13 18 20 15" fill="none" stroke={mix(skin, INK, 0.12)} strokeWidth={3} strokeLinecap="round" />
            <Path d="M50 24 Q51 18 44 15" fill="none" stroke={mix(skin, INK, 0.12)} strokeWidth={3} strokeLinecap="round" />
          </G>
        );
      case 'short':
      default:
        return (
          <G>
            <Path d="M11 27 Q11 5 32 5 Q53 5 53 27 Q49 15 39 14 Q41 19 37 20 Q33 13 30 20 Q26 18 25 14 Q15 15 11 27 Z" fill={H} />
            <Path d="M18 13 Q30 7 43 13" fill="none" stroke={HL} strokeWidth={2.5} strokeLinecap="round" />
          </G>
        );
    }
  };

  // Face features — derp aesthetic (small dot eyes) across 12 emotions.
  const face = () => {
    const eyeY = 27;
    const E = INK;

    const dotEyes = (dy = 1.5) => (
      <G>
        <Circle cx={23} cy={eyeY + dy} r={2} fill={E} />
        <Circle cx={41} cy={eyeY + dy} r={2} fill={E} />
      </G>
    );
    const dotEyesUp = (
      <G>
        <Circle cx={23} cy={eyeY - 1} r={2} fill={E} />
        <Circle cx={41} cy={eyeY - 1} r={2} fill={E} />
      </G>
    );
    const dotEyesWide = (
      <G>
        <Circle cx={22} cy={eyeY} r={2.4} fill={E} />
        <Circle cx={42} cy={eyeY} r={2.4} fill={E} />
      </G>
    );
    const lineEyes = (
      <G>
        <Path d="M20 28 Q23 29.5 26 28" fill="none" stroke={E} strokeWidth={1.6} strokeLinecap="round" />
        <Path d="M38 28 Q41 29.5 44 28" fill="none" stroke={E} strokeWidth={1.6} strokeLinecap="round" />
      </G>
    );
    const squintEyes = (
      <G>
        <Path d="M20 26 L25 28 L20 30" fill="none" stroke={E} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M44 26 L39 28 L44 30" fill="none" stroke={E} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </G>
    );

    const browsAngry = (
      <G>
        <Path d="M19 22 L27 25" fill="none" stroke={E} strokeWidth={1.6} strokeLinecap="round" />
        <Path d="M45 22 L37 25" fill="none" stroke={E} strokeWidth={1.6} strokeLinecap="round" />
      </G>
    );
    const browsSad = (
      <G>
        <Path d="M20 24 L27 22" fill="none" stroke={E} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M44 24 L37 22" fill="none" stroke={E} strokeWidth={1.5} strokeLinecap="round" />
      </G>
    );

    const mWobble = <Path d="M29 34 Q31 33 33 34 Q35 35 37 34" fill="none" stroke={E} strokeWidth={1.6} strokeLinecap="round" />;
    const mFlat = <Path d="M29 34.5 L37 34.5" fill="none" stroke={E} strokeWidth={1.6} strokeLinecap="round" />;
    const mSmile = <Path d="M28 33 Q32 37 36 33" fill="none" stroke={E} strokeWidth={1.7} strokeLinecap="round" />;
    const mFrown = <Path d="M28 36 Q32 32 36 36" fill="none" stroke={E} strokeWidth={1.7} strokeLinecap="round" />;
    const mOpenO = <Ellipse cx={33} cy={35} rx={2.4} ry={3} fill={E} />;
    const mGrit = (
      <G>
        <Rect x={28} y={33.5} width={10} height={3.4} rx={1.2} fill={E} />
        <Line x1={33} y1={33.5} x2={33} y2={36.9} stroke="#FFF" strokeWidth={0.8} />
      </G>
    );
    const mYawn = <Ellipse cx={33} cy={35.5} rx={2.8} ry={3.4} fill={E} />;
    const mTiny = <Circle cx={33} cy={35} r={1.3} fill={E} />;

    const tear = (
      <G>
        <Ellipse cx={45} cy={31} rx={1.4} ry={2.2} fill="#7DD3FC" />
        <Ellipse cx={44.6} cy={30.4} rx={0.5} ry={0.7} fill="#FFF" />
      </G>
    );
    const sweat = (
      <G>
        <Ellipse cx={47} cy={22} rx={1.8} ry={2.8} fill="#7DD3FC" />
        <Ellipse cx={46.4} cy={21.2} rx={0.6} ry={0.9} fill="#FFF" />
      </G>
    );
    const anger = <Path d="M44 19 L48 19 M46 17 L46 21 M45 22 L49 18 M45 18 L49 22" stroke="#EF4444" strokeWidth={1} strokeLinecap="round" />;
    const qmark = <SvgText x={46} y={20} fontSize={9} fill={E} fontFamily="monospace" fontWeight="bold">?</SvgText>;
    const zzz = <SvgText x={45} y={20} fontSize={8} fill={E} fontFamily="monospace">z</SvgText>;

    const blush = (op = 0.4) => (
      <G>
        <Ellipse cx={19} cy={33} rx={2.8} ry={1.7} fill="#F9A8B4" opacity={op} />
        <Ellipse cx={45} cy={32.5} rx={3} ry={1.8} fill="#F9A8B4" opacity={op} />
      </G>
    );
    const bigBlush = (
      <G>
        <Ellipse cx={19} cy={33} rx={4} ry={2.6} fill="#F9A8B4" opacity={0.7} />
        <Ellipse cx={45} cy={32.5} rx={4.2} ry={2.7} fill="#F9A8B4" opacity={0.72} />
      </G>
    );

    let eyes = dotEyes();
    let brows: React.ReactNode = null;
    let mouth: React.ReactNode = mWobble;
    let marks: React.ReactNode = null;
    let bl: React.ReactNode = blush();
    switch (expression) {
      case 'happy': eyes = dotEyes(0.5); mouth = mSmile; break;
      case 'sad': eyes = dotEyes(2); brows = browsSad; mouth = mFrown; marks = tear; bl = blush(0.25); break;
      case 'worried': eyes = dotEyes(1); brows = browsSad; mouth = mWobble; marks = sweat; break;
      case 'pain': eyes = squintEyes; mouth = mGrit; marks = sweat; bl = null; break;
      case 'surprised': eyes = dotEyesWide; mouth = mOpenO; break;
      case 'angry': eyes = dotEyes(0.5); brows = browsAngry; mouth = mFrown; marks = anger; bl = null; break;
      case 'thinking': eyes = dotEyesUp; mouth = mFlat; marks = qmark; break;
      case 'sleepy': eyes = lineEyes; mouth = mYawn; marks = zzz; break;
      case 'panic': eyes = dotEyesWide; mouth = mOpenO; marks = sweat; bl = null; break;
      case 'focused': eyes = dotEyes(0.5); brows = browsAngry; mouth = mFlat; bl = null; break;
      case 'shy': eyes = dotEyes(1.5); mouth = mTiny; bl = bigBlush; break;
      case 'neutral':
      case 'derp':
      default: eyes = dotEyes(); mouth = mWobble; break;
    }

    return (
      <G>
        {bl}
        {brows}
        {eyes}
        {!mask && mouth}
        {marks}
      </G>
    );
  };

  // Back-of-head (dir 'up') — hair/hat fills the crown, no face.
  const backHead = () => {
    if (hairStyle === 'cap' || hairStyle === 'peakedCap') {
      return (
        <G>
          <Ellipse cx={HX} cy={HY - 2} rx={HRX - 1} ry={HRY - 1} fill={hatTone} />
          {hairStyle === 'peakedCap' ? <Path d="M9 24 Q32 20 55 24 Q32 27 9 24 Z" fill={hatTone ? mix(hatTone, INK, 0.2) : INK} /> : null}
          <Path d="M16 40 Q32 46 48 40 Q32 44 16 40 Z" fill={H} />
        </G>
      );
    }
    if (hairStyle === 'bald') {
      return <Path d="M14 38 Q32 44 50 38 Q32 42 14 38 Z" fill={H} opacity={0.9} />;
    }
    return (
      <G>
        <Ellipse cx={HX} cy={HY - 1} rx={HRX - 1} ry={HRY - 1} fill={H} />
        <Path d="M32 7 L32 42" stroke={HD} strokeWidth={1.2} opacity={0.5} />
        <Path d="M18 14 Q32 8 46 14" fill="none" stroke={HL} strokeWidth={2.5} strokeLinecap="round" />
        {hairStyle === 'bun' ? <Ellipse cx={32} cy={6} rx={7} ry={6} fill={H} /> : null}
        {hairStyle === 'pigtails' ? (
          <G>
            <Ellipse cx={9} cy={34} rx={7} ry={9} fill={H} />
            <Ellipse cx={55} cy={34} rx={7} ry={9} fill={H} />
          </G>
        ) : null}
      </G>
    );
  };

  // 3/4 side face (dir 'left'/'right') — drawn right-facing; 'left' mirrors the whole group.
  const sideFace = () => {
    const E = INK;
    return (
      <G>
        <Path d="M53 25 Q57 27 53 29 Z" fill={skin} stroke={slo} strokeWidth={1} />
        <Circle cx={42} cy={27} r={2} fill={E} />
        {expression === 'happy' ? (
          <Path d="M39 33 Q42 36 45 33" fill="none" stroke={E} strokeWidth={1.6} strokeLinecap="round" />
        ) : (
          <Path d="M40 34 Q42 33.4 44 34" fill="none" stroke={E} strokeWidth={1.6} strokeLinecap="round" />
        )}
        <Ellipse cx={44} cy={31} rx={2.6} ry={1.6} fill="#F9A8B4" opacity={0.4} />
      </G>
    );
  };

  // Side-profile hat (cap / peakedCap) — designed right-facing. Visor/brim and
  // the nurse cross / police badge sit toward the FRONT of the cap.
  const hatSide = () => {
    if (hairStyle === 'peakedCap') {
      return (
        <G>
          <Path d="M11 21 Q9 2 35 1 Q56 3 55 21 Q34 25 11 21 Z" fill={hatTone} />
          <Path d="M50 20 Q63 20 61 25 Q53 25 50 23 Z" fill={hatTone ? mix(hatTone, INK, 0.35) : INK} />
          {hatTrim ? <Ellipse cx={49} cy={12} rx={3} ry={2.6} fill={hatTrim} /> : null}
        </G>
      );
    }
    return (
      <G>
        <Path d="M10 21 Q8 1 34 0 Q56 2 55 21 Q33 25 10 21 Z" fill={hatTone} />
        <Path d="M14 11 Q31 4 49 12" fill="none" stroke={hatTone ? mix(hatTone, '#FFFFFF', 0.3) : '#FFF'} strokeWidth={2.5} strokeLinecap="round" />
        {hatTrim ? <Path d="M10 21 Q33 25 55 21" fill="none" stroke={hatTrim} strokeWidth={3.5} strokeLinecap="round" /> : null}
        {hatTrim === '#EF4444' ? (
          <G>
            <Rect x={46} y={5} width={4} height={9} rx={1} fill="#EF4444" />
            <Rect x={44} y={7.5} width={8} height={4} rx={1} fill="#EF4444" />
          </G>
        ) : null}
      </G>
    );
  };
  const isHat = hairStyle === 'cap' || hairStyle === 'peakedCap';

  return (
    <Animated.View style={[{ width, height }, bodyStyle]}>
    <Svg viewBox="0 0 64 80" width={width} height={height}>
      {/* left = the right-facing base mirrored around the viewBox center (x=32).
          Origin-aware scaleX (not a transform string) — robust on react-native-svg. */}
      <G originX={32} scaleX={flip ? -1 : 1}>
        {/* ground shadow */}
        <Ellipse cx={32} cy={77} rx={15} ry={2.4} fill="#000" opacity={0.13} />

        {dir !== 'up' ? hairBack() : null}

        {/* ARMS (front/back) — two swinging arms. Side view's single arm is drawn
            ON TOP of the body, after the legs (see below). */}
        {facingSide ? null : (
          <>
            <SwingLimb swing={swing} gate={gate} amp={8} dirSign={-1} pivotX={20} pivotY={52}>
              <Path d="M20 52 Q14 56 15 64" fill="none" stroke={shirt} strokeWidth={6} strokeLinecap="round" />
              <Path d="M20 52 Q14 56 15 64" fill="none" stroke={slo} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
              <Circle cx={15} cy={64} r={3} fill={skin} stroke={slo} strokeWidth={1.2} />
            </SwingLimb>
            <SwingLimb swing={swing} gate={gate} amp={8} dirSign={1} pivotX={44} pivotY={52}>
              <Path d="M44 52 Q50 56 49 64" fill="none" stroke={shirt} strokeWidth={6} strokeLinecap="round" />
              <Path d="M44 52 Q50 56 49 64" fill="none" stroke={slo} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
              <Circle cx={49} cy={64} r={3} fill={skin} stroke={slo} strokeWidth={1.2} />
            </SwingLimb>
          </>
        )}

        {/* BODY — side view: narrower profile with back-edge shading */}
        {facingSide ? (
          <>
            <Path d="M26 52 Q26 47 32 47 Q39 47 39 52 L40 66 Q32 69 25 66 Z" fill={shirt} stroke={slo} strokeWidth={1.6} strokeLinejoin="round" />
            <Path d="M26 50 Q26 48 28 47 L28 68 Q26 67 25 66 Z" fill={shirtDark} opacity={0.5} />
          </>
        ) : (
          <>
            <Path d="M20 52 Q20 47 32 47 Q44 47 44 52 L46 66 Q32 70 18 66 Z" fill={shirt} stroke={slo} strokeWidth={1.6} strokeLinejoin="round" />
            <Path d="M38 49 Q44 50 44 53 L46 66 Q41 68 38 68 Z" fill={shirtDark} opacity={0.55} />
          </>
        )}

        {/* chest marker — FRONT only (hidden in side & back profile) */}
        {!facingSide && dir !== 'up' && chestCross ? (
          <G>
            <Rect x={29} y={52} width={6} height={9} rx={1.5} fill="#EF4444" />
            <Rect x={26.5} y={54.5} width={11} height={4} rx={1.5} fill="#EF4444" />
          </G>
        ) : null}
        {!facingSide && dir !== 'up' ? chestMark : null}

        {/* LEGS — side view (v4): two legs at body center swinging in opposite
            phase so they cross front↔back; the far leg is darker for depth. */}
        {facingSide ? (
          <>
            {/* far leg (behind, darker) */}
            <SwingLimb swing={swing} gate={gate} amp={22} dirSign={1} pivotX={32} pivotY={64}>
              <Rect x={29} y={65} width={6} height={9} rx={3} fill={legDk} />
              <Ellipse cx={32} cy={75} rx={4.6} ry={2.6} fill={mix(shoe, INK, 0.25)} />
            </SwingLimb>
            {/* near leg (front) */}
            <SwingLimb swing={swing} gate={gate} amp={22} dirSign={-1} pivotX={32} pivotY={64}>
              <Rect x={29} y={65} width={6} height={9} rx={3} fill={leg} />
              <Rect x={32} y={65} width={2.4} height={9} rx={1.2} fill={legDk} opacity={0.5} />
              <Ellipse cx={32} cy={75} rx={4.8} ry={2.6} fill={shoe} />
            </SwingLimb>
          </>
        ) : (
          <>
            <SwingLimb swing={swing} gate={gate} amp={10} dirSign={1} pivotX={27} pivotY={65}>
              <Rect x={24} y={65} width={6.5} height={9} rx={3} fill={leg} />
              <Rect x={27.5} y={65} width={2.6} height={9} rx={1.3} fill={legDk} opacity={0.5} />
              <Ellipse cx={27.2} cy={75} rx={4.4} ry={2.6} fill={shoe} />
            </SwingLimb>
            <SwingLimb swing={swing} gate={gate} amp={10} dirSign={-1} pivotX={37} pivotY={65}>
              <Rect x={33.5} y={65} width={6.5} height={9} rx={3} fill={leg} />
              <Rect x={37} y={65} width={2.6} height={9} rx={1.3} fill={legDk} opacity={0.5} />
              <Ellipse cx={36.8} cy={75} rx={4.4} ry={2.6} fill={shoe} />
            </SwingLimb>
          </>
        )}

        {/* SIDE ARM (v4) — single arm tucked along the torso, drawn on top, swings */}
        {facingSide ? (
          <SwingLimb swing={swing} gate={gate} amp={20} dirSign={-1} pivotX={34} pivotY={53}>
            <Path d="M33 52 Q37 57 35 64" fill="none" stroke={shirt} strokeWidth={5} strokeLinecap="round" />
            <Path d="M33 52 Q37 57 35 64" fill="none" stroke={slo} strokeWidth={1.2} strokeLinecap="round" opacity={0.4} />
            <Circle cx={35} cy={64} r={2.8} fill={skin} stroke={slo} strokeWidth={1.2} />
          </SwingLimb>
        ) : null}

        {/* HEAD */}
        <Ellipse cx={HX} cy={HY} rx={HRX} ry={HRY} fill={skin} stroke={slo} strokeWidth={1.6} />
        {dir !== 'up' ? (
          <Path d={`M${HX + 6} ${HY - HRY + 4} Q${HX + HRX} ${HY} ${HX + 6} ${HY + HRY - 4} Q${HX + HRX - 3} ${HY} ${HX + 6} ${HY - HRY + 4} Z`} fill={sh} opacity={0.4} />
        ) : null}

        {dir === 'up' ? (
          backHead()
        ) : (
          <>
            {facingSide && isHat ? hatSide() : hairFront()}
            {facingSide ? sideFace() : face()}
            {/* idle blink — skin eyelids briefly cover the dot eyes (front only) */}
            {!facingSide ? (
              <AnimatedG animatedProps={blinkProps}>
                <Rect x={20} y={24} width={6} height={5} rx={2} fill={skin} />
                <Rect x={38} y={24} width={6} height={5} rx={2} fill={skin} />
              </AnimatedG>
            ) : null}
          </>
        )}

        {/* surgical mask (front & side) */}
        {mask && dir !== 'up' ? (
          <G>
            <Path d="M18 30 Q32 28 46 30 L44 40 Q32 46 20 40 Z" fill="#FFFFFF" stroke={slo} strokeWidth={1.4} strokeLinejoin="round" />
            <Path d="M20 33 Q32 32 44 33" fill="none" stroke="#D9DEE3" strokeWidth={1.2} />
            <Path d="M20 36 Q32 35 44 36" fill="none" stroke="#D9DEE3" strokeWidth={1.2} />
            <Path d="M18 31 Q12 33 14 39" fill="none" stroke={slo} strokeWidth={1.2} strokeLinecap="round" />
            <Path d="M46 31 Q52 33 50 39" fill="none" stroke={slo} strokeWidth={1.2} strokeLinecap="round" />
          </G>
        ) : null}
      </G>
    </Svg>
    </Animated.View>
  );
}

export const SmoothSprite = memo(SmoothSpriteBase);

// ── Shared palette + deterministic variation (mirrors the reference) ──
const HAIR_VARIANTS = ['#1F2937', '#3C2A18', '#5C3A1A', '#7C3F00', '#9A6B3F', '#C28E5C', '#E2B16B', '#FACC15', '#EF4444', '#B45309', '#D1D5DB', '#A78BFA', '#22D3EE'];
const SKIN_VARIANTS = ['#FCE5C8', '#F8D7B2', '#E9BE93', '#C99066', '#9A6B45'];

export function spriteHash(x: number, y: number, salt = 0): number {
  const v = Math.floor((x * 73856093) ^ (y * 19349663) ^ (salt * 83492791));
  return Math.abs(v);
}
const pick = <T,>(arr: readonly T[], h: number): T => arr[h % arr.length];

export type RoleKind =
  | 'nurse' | 'doctor' | 'surgeon' | 'paramedic' | 'police'
  | 'patient' | 'child' | 'parent' | 'visitor' | 'pharmacist';

const ROLES: Record<RoleKind, (h: number, shirt?: string) => SmoothSpriteProps> = {
  nurse: (h, shirt) => ({
    hair: pick(HAIR_VARIANTS, h), hairStyle: 'cap', hatTone: '#FFFFFF', hatTrim: '#EF4444',
    skin: pick(SKIN_VARIANTS, h >> 5), shirt: shirt || '#A7F3D0', shirtDk: '#4FC79D', leg: '#FFFFFF', shoe: '#1F2937',
    chestMark: (
      <G>
        <Rect x={29.5} y={53} width={5} height={8} rx={1} fill="#EF4444" />
        <Rect x={27.5} y={55} width={9} height={4} rx={1} fill="#EF4444" />
      </G>
    ),
  }),
  doctor: (h) => ({
    hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['short', 'bob', 'curly', 'short'] as const, h >> 3),
    skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#FFFFFF', shirtDk: '#B0B5BD', leg: '#475569', shoe: '#1F2937',
    chestMark: (
      <G>
        <Path d="M27 49 Q27 56 32 57" fill="none" stroke={INK} strokeWidth={1.4} />
        <Circle cx={32} cy={58} r={1.8} fill={INK} />
      </G>
    ),
  }),
  surgeon: (h) => ({
    hair: '#3C2A18', hairStyle: 'cap', hatTone: '#A8DCEC', hatTrim: '#5E8FA8',
    skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#A8DCEC', shirtDk: '#5E8FA8', leg: '#A8DCEC', shoe: '#FFFFFF', mask: true,
  }),
  paramedic: (h) => ({
    hair: pick(HAIR_VARIANTS, h), hairStyle: 'peakedCap', hatTone: '#0F172A', hatTrim: '#FACC15',
    skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#FACC15', shirtDk: '#CA8A04', leg: '#1F2937', shoe: '#0F172A',
  }),
  police: (h) => ({
    hair: '#1F2937', hairStyle: 'peakedCap', hatTone: '#1E3A8A', hatTrim: '#FACC15',
    skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#1E3A8A', shirtDk: '#0F172A', leg: '#1E3A8A', shoe: '#0F172A',
    chestMark: <Ellipse cx={26} cy={55} rx={2.4} ry={2.8} fill="#FACC15" />,
  }),
  patient: (h) => ({
    hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['short', 'bob', 'long', 'curly', 'bald'] as const, h >> 3),
    skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#FED7AA', shirtDk: '#C99066', leg: '#FED7AA', shoe: '#FCE5C8',
  }),
  child: (h) => ({
    hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['short', 'pigtails', 'bob', 'curly', 'mohawk'] as const, h >> 3),
    skin: pick(SKIN_VARIANTS, h >> 5), shirt: pick(['#FBCFE8', '#FDE68A', '#A7F3D0', '#BAE6FD', '#FCA5A5', '#DDD6FE'], h >> 7),
    leg: pick(['#3F2A18', '#1E40AF', '#7C2D12', '#4338CA'], h >> 9), shoe: '#1F2937',
  }),
  parent: (h) => ({
    hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['bob', 'long', 'short', 'bun', 'curly', 'short'] as const, h >> 3),
    skin: pick(SKIN_VARIANTS, h >> 5), shirt: pick(['#FBCFE8', '#7DD3FC', '#A78BFA', '#FCA5A5', '#BBF7D0', '#94A3B8'], h >> 7),
    leg: pick(['#3F2A18', '#1E40AF', '#52525B'], h >> 9), shoe: '#2A1B0E',
  }),
  visitor: (h) => ({
    hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['short', 'bob', 'long', 'curly', 'bald', 'short'] as const, h >> 3),
    skin: pick(SKIN_VARIANTS, h >> 5), shirt: pick(['#A78BFA', '#0EA5E9', '#94A3B8', '#F59E0B', '#65A30D', '#9333EA'], h >> 7),
    leg: pick(['#3F2A18', '#1E3A8A', '#52525B', '#27272A'], h >> 9), shoe: '#2A1B0E',
  }),
  pharmacist: (h) => ({
    hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['short', 'bob', 'bun', 'curly'] as const, h >> 3),
    skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#FFFFFF', shirtDk: '#B0B5BD', leg: '#475569', shoe: '#1F2937',
    chestMark: <Rect x={28} y={53} width={8} height={6} rx={1.5} fill="#10B981" />,
  }),
};
const ROLE_SALT: Record<RoleKind, number> = { nurse: 1, doctor: 2, surgeon: 3, paramedic: 4, police: 5, patient: 6, child: 7, parent: 8, visitor: 9, pharmacist: 10 };

export interface RoleSpriteProps {
  kind: RoleKind;
  x?: number;
  y?: number;
  /** Stable identity seed. When set, appearance is hashed from this (not x,y),
   * so a moving/ambient NPC keeps its skin/hair/outfit instead of flickering. */
  seed?: number;
  mood?: 'happy' | 'derp';
  hair?: string;
  shirt?: string;
  size?: number;
  expression?: Expression;
  dir?: SpriteDir;
  walking?: boolean;
}

/** A role NPC. Appearance is deterministic from `seed` (preferred) or tile (x,y). */
export function RoleSprite({ kind, x = 0, y = 0, seed, mood = 'happy', hair, shirt, size, expression, dir, walking }: RoleSpriteProps) {
  const h = seed != null ? spriteHash(seed, seed * 7 + 13, ROLE_SALT[kind]) : spriteHash(x, y, ROLE_SALT[kind]);
  const cfg = ROLES[kind](h, shirt);
  const sz = size || (kind === 'child' ? 34 : 40);
  const expr: Expression = expression || (mood === 'derp' ? 'neutral' : 'happy');
  return <SmoothSprite width={sz} {...cfg} hair={hair || cfg.hair} expression={expr} dir={dir} walking={walking} />;
}

/** The player character (white cap + red cross, light skin). */
export function PlayerSprite({ size = 40, expression = 'neutral' as Expression, dir, walking }: { size?: number; expression?: Expression; dir?: SpriteDir; walking?: boolean }) {
  return (
    <SmoothSprite
      width={size}
      hair="#3C2A18"
      hairStyle="cap"
      hatTone="#FFFFFF"
      hatTrim="#EF4444"
      skin="#FCE5C8"
      shirt="#A7F3D0"
      shirtDk="#4FC79D"
      leg="#3F3D52"
      shoe="#1F2937"
      chestCross
      expression={expression}
      dir={dir}
      walking={walking}
    />
  );
}
