// 라이브 병동 — the live pixel ward at the top of the home screen (v27).
//
// Three moods, from the DEVICE clock (see data/wardMood): DAY 회진, EVENING 인계 준비,
// NIGHT 밤근. The sky, the window light, the overlay and the number of people on the
// floor all follow it, and the bar underneath says what the mood changes about today's
// content.
//
// The walking nurse is the LEARNER — their own avatar from the profile, hair, skin and
// scrubs. It is their ward; a stranger patrolling it would be a decoration, and the
// same three choices already draw their face on the profile card and in the dialogue
// frame.
//
// Animations are Animated loops with the native driver, not CSS keyframes: opacity for
// the blinks and the monitor pulse, translateX for the patrol. The handoff writes them
// as `fw-blink` / `fw-pulse` / `fw-walk`; these are the same three, with the same
// periods.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { SmoothSprite } from '@/engine/Sprite';
import { useAvatar } from '@/hooks/useAvatar';
import { MOOD_SUB_KEY, SHIFT_LABEL, moodAt, msUntilNextMood, type WardMood } from '@/data/wardMood';
import { colors, fonts, fs } from '@/theme/tokens';
import { useT } from '@/i18n';

const C = colors.ink;

/** Per-mood palette. The keys are the handoff's, and so are the values. */
const MOODS: Record<WardMood, { sky: string; wall: string; floor: string; window: string; people: number }> = {
  day: { sky: '#BAE6FD', wall: '#FFFDF5', floor: '#E8E2D4', window: '#7CB3F0', people: 2 },
  evening: { sky: '#FBCFE8', wall: '#FFF6E8', floor: '#E4D9C4', window: '#F4A261', people: 2 },
  night: { sky: '#213B4A', wall: '#EFEAE0', floor: '#D8D2C2', window: '#FEF08A', people: 1 },
};

const SKY_H = 26;
const ROOM_H = 74;
/** Where the stars sit in the night sky, as fractions of the width so they land in the
 *  same places on any screen. The handoff pins pixel offsets against a 300pt mock. */
const STARS: [number, number][] = [[0.05, 6], [0.18, 12], [0.33, 4], [0.52, 10], [0.72, 7], [0.89, 13]];

/** A loop between two opacities, held at each end — the handoff's `fw-blink` is a step
 *  animation, so this is stepped too rather than eased. A smoothly fading indicator
 *  light reads as a fade; a hard blink reads as electronics. */
function useBlink(periodMs: number, low = 0.15) {
  const v = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: periodMs * 0.6, easing: Easing.step0, useNativeDriver: true }),
        Animated.timing(v, { toValue: low, duration: periodMs * 0.4, easing: Easing.step0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, periodMs, low]);
  return v;
}

/** The monitor's trace — a soft pulse, not a blink. */
function usePulse(periodMs: number) {
  const v = useRef(new Animated.Value(0.9)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 0.4, duration: periodMs / 2, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0.9, duration: periodMs / 2, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, periodMs]);
  return v;
}

/** One bed: frame, pillow, mint blanket. */
function Bed({ left }: { left: number }) {
  return (
    <View style={{ position: 'absolute', left, bottom: 8, width: 34, height: 16 }}>
      <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderWidth: 2, borderColor: C }} />
      <View style={{ position: 'absolute', left: 2, top: 2, width: 8, height: 5, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C }} />
      <View style={{ position: 'absolute', left: 11, top: 2, right: 2, bottom: 3, backgroundColor: colors.mint, borderLeftWidth: 1.5, borderLeftColor: C }} />
    </View>
  );
}

export function LiveWard({ mood: forced, now }: {
  /** Overrides the clock. For tests and for the handoff's three static screens. */
  mood?: WardMood;
  /** Injectable clock, so a test can stand at 23:00 without touching the system time. */
  now?: () => Date;
}) {
  const t = useT();
  const avatar = useAvatar();
  const clock = now ?? (() => new Date());

  // Re-read the clock exactly when the mood can next change, rather than polling. A
  // learner studying at 14:58 sees the ward turn over at 15:00 without leaving the
  // screen, and an app left open overnight does not still say DAY in the morning.
  // Forces a re-read of the clock when the boundary passes.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (forced) return;
    const id = setTimeout(() => setTick((n) => n + 1), msUntilNextMood(clock()));
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced, tick]);

  const mood = forced ?? moodAt(clock());
  const M = MOODS[mood];

  const skyBlink = useBlink(2_400);
  const monitorPulse = usePulse(1_200);
  const monitorBlink = useBlink(1_600);
  const barBlink = useBlink(1_400);

  // The patrol. translateX only — the sprite itself is a fixed drawing, and moving it
  // on the native driver keeps the walk off the JS thread while the home screen loads.
  const walk = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(walk, { toValue: 1, duration: 3_500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(walk, { toValue: 0, duration: 3_500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [walk]);
  const patrol = useMemo(() => walk.interpolate({ inputRange: [0, 1], outputRange: [0, 46] }), [walk]);

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
      <View style={{ position: 'absolute', left: 3, top: 3, right: -3, bottom: -3, backgroundColor: C }} />
      <View style={{ borderWidth: 3, borderColor: C, backgroundColor: M.wall, overflow: 'hidden' }}>
        {/* ── sky ── */}
        <View style={{ height: SKY_H, backgroundColor: M.sky, borderBottomWidth: 2.5, borderBottomColor: C }}>
          {mood === 'night' && STARS.map(([fx, top], i) => (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                left: `${fx * 100}%`,
                top,
                width: 3,
                height: 3,
                backgroundColor: '#FEF08A',
                opacity: skyBlink,
              }}
            />
          ))}
          {mood === 'day' && <View style={{ position: 'absolute', right: 14, top: 5, width: 14, height: 14, backgroundColor: '#FEF08A', borderWidth: 2, borderColor: C }} />}
          {mood === 'evening' && <View style={{ position: 'absolute', right: 14, top: 8, width: 14, height: 9, backgroundColor: '#F4A261', borderWidth: 2, borderColor: C }} />}
          <View style={{ position: 'absolute', left: 8, top: 5, backgroundColor: C, paddingVertical: 1, paddingHorizontal: 5 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: colors.cream }}>
              {SHIFT_LABEL[mood]} · {t(`ward.${mood}Title`)}
            </Text>
          </View>
        </View>

        {/* ── the room ── */}
        <View style={{ height: ROOM_H, backgroundColor: M.wall }}>
          {/* The floor is the lower 38%, as a flat band rather than a gradient: the
              handoff writes a hard stop at 62%, which is a two-tone floor line, not a
              fade. */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: ROOM_H * 0.62, bottom: 0, backgroundColor: M.floor }} />

          {[18, 64].map((left) => (
            <View key={left} style={{ position: 'absolute', left, top: 8, width: 20, height: 16, backgroundColor: M.window, borderWidth: 2, borderColor: C }}>
              <View style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1.5, backgroundColor: C }} />
            </View>
          ))}

          {/* vitals monitor */}
          <View style={{ position: 'absolute', right: 14, top: 6, width: 26, height: 19, backgroundColor: '#213B4A', borderWidth: 2, borderColor: C }}>
            <Animated.View style={{ position: 'absolute', left: 3, top: 8, width: 12, height: 2, backgroundColor: colors.mint, opacity: monitorPulse }} />
            <Animated.View style={{ position: 'absolute', right: 3, top: 3, width: 4, height: 3, backgroundColor: '#F58A8A', opacity: monitorBlink }} />
          </View>

          <Bed left={120} />
          <Bed left={168} />
          <Bed left={216} />

          {/* The learner, walking their own ward. */}
          <Animated.View style={{ position: 'absolute', left: 20, bottom: 7, transform: [{ translateX: patrol }] }}>
            <SmoothSprite
              width={26}
              hairStyle={avatar.hairStyle}
              hair={avatar.hair}
              skin={avatar.skin}
              shirt={avatar.scrub}
              shirtDk={C}
              leg="#475569"
              shoe="#1F2937"
              expression="happy"
              dir="down"
              walking
            />
          </Animated.View>

          {/* A colleague, on the shifts busy enough to have one. */}
          {M.people >= 2 && (
            <View style={{ position: 'absolute', right: 18, bottom: 7 }}>
              <SmoothSprite
                width={26}
                hairStyle="ponytail"
                hair="#5C3A1A"
                skin="#F0C8A0"
                shirt="#BFDBFE"
                shirtDk="#7CB3F0"
                leg="#475569"
                shoe="#1F2937"
                expression="neutral"
                dir="left"
              />
            </View>
          )}

          {/* Night falls over the whole room, people included — so it dims the scene
              rather than only the walls. */}
          {mood === 'night' && (
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#213B4A', opacity: 0.28 }} />
          )}
        </View>

        {/* ── what this mood changes ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderTopWidth: 2.5, borderTopColor: C, backgroundColor: '#fff' }}>
          <Animated.View style={{ width: 7, height: 7, backgroundColor: '#F58A8A', borderWidth: 1.5, borderColor: C, opacity: barBlink }} />
          <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(9.5), color: colors.text, lineHeight: 13 }}>
            {t(MOOD_SUB_KEY[mood])}
          </Text>
        </View>
      </View>
    </View>
  );
}
