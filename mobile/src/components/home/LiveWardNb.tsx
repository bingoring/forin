// 라이브 병동 — the notebook-line live ward at the top of the home screen (핸드오프 v37).
//
// This is the pixel LiveWard (v27) redrawn in the notebook line: same three moods from the
// DEVICE clock (data/wardMood — DAY 회진 / EVENING 인계 준비 / NIGHT 밤근), same beds,
// window light, pulsing monitor and mood bar. What changed is who walks it. The pixel ward
// patrolled a SmoothSprite; a pixel sprite on a paper page is what 07 forbids, so the
// figures here are NbCharacter — the notebook 2-head walker, drawn from each learner's own
// AvatarSpec.
//
// Phase 1 walks ONE figure: the learner (useMyAvatar). `roster` is the hook for Phase 2 —
// the real people currently studying — and everything below already lays out `[self,
// ...roster]` into lanes, so wiring the roster in is data, not layout.
//
// Animations are Animated loops on the native driver, as in the pixel ward: opacity for the
// blinks and the monitor pulse, translateX for each figure's patrol within its lane.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { NbCharacter } from '@/components/nb/NbCharacter';
import { useMyAvatar } from '@/hooks/useMyAvatar';
import { MOOD_SUB_KEY, SHIFT_LABEL, moodAt, msUntilNextMood, type WardMood } from '@/data/wardMood';
import { nbText } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';
import { useT } from '@/i18n';
import type { AvatarSpec } from '@/data/nbAvatar';

const C = nb.ink;

/** Per-mood palette — the handoff's DAY / EVENING / NIGHT values. */
const MOODS: Record<WardMood, { sky: string; wall: string; floor: string; window: string }> = {
  day: { sky: '#BAE6FD', wall: '#FFFDF5', floor: '#E8E2D4', window: '#7CB3F0' },
  evening: { sky: '#FBCFE8', wall: '#FFF6E8', floor: '#E4D9C4', window: '#F4A261' },
  night: { sky: '#213B4A', wall: '#EFEAE0', floor: '#D8D2C2', window: '#FEF08A' },
};
const MINT = '#A8D9C3';

const SKY_H = 26;
const ROOM_H = 78;
const CHAR_W = 26;
/** Stars as fractions of the width, so they land the same on any screen. */
const STARS: [number, number][] = [[0.05, 6], [0.18, 12], [0.33, 4], [0.52, 10], [0.72, 7], [0.89, 13]];

/** A stepped blink — electronics, not a fade. */
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

/** The monitor's trace — a soft pulse. */
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

/** One bed. */
function Bed({ left }: { left: number }) {
  return (
    <View style={{ position: 'absolute', left, bottom: 8, width: 34, height: 16 }}>
      <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderWidth: 2, borderColor: C }} />
      <View style={{ position: 'absolute', left: 2, top: 2, width: 8, height: 5, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C }} />
      <View style={{ position: 'absolute', left: 11, top: 2, right: 2, bottom: 3, backgroundColor: MINT, borderLeftWidth: 1.5, borderLeftColor: C }} />
    </View>
  );
}

/** A stable 0–1 from an id, so a figure keeps the same lane offset and gait every frame. */
function unit(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

/** One figure, patrolling left↔right inside its own lane so a crowd never stacks up. */
function Patrol({ id, spec, lane, laneW, bottom }: {
  id: string;
  spec?: Partial<AvatarSpec>;
  lane: number;
  laneW: number;
  bottom: number;
}) {
  const seed = useMemo(() => unit(id), [id]);
  const range = Math.max(0, Math.min(laneW - CHAR_W, 22 + seed * 20));
  const base = lane * laneW + Math.max(0, (laneW - CHAR_W - range) / 2);
  const period = 3000 + Math.round(seed * 3000);

  const walk = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(walk, { toValue: 1, duration: period, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(walk, { toValue: 0, duration: period, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [walk, period]);
  const tx = walk.interpolate({ inputRange: [0, 1], outputRange: [0, range] });

  return (
    <Animated.View style={{ position: 'absolute', left: base, bottom, transform: [{ translateX: tx }] }}>
      <NbCharacter spec={spec} walking size={CHAR_W} />
    </Animated.View>
  );
}

export function LiveWardNb({ mood: forced, now, roster = [] }: {
  /** Overrides the clock — for tests and the handoff's three static screens. */
  mood?: WardMood;
  /** Injectable clock, so a test can stand at 23:00 without touching the system time. */
  now?: () => Date;
  /** The people currently studying (Phase 2). Phase 1 leaves it empty and walks only self. */
  roster?: { id: string; avatar: AvatarSpec }[];
}) {
  const t = useT();
  const myAvatar = useMyAvatar();
  const clock = now ?? (() => new Date());

  // Re-read the clock exactly when the mood can next change, not by polling.
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

  // self is always on the floor; the roster fills the rest, capped so the ward stays legible.
  const members = useMemo(() => {
    const list: { id: string; spec?: Partial<AvatarSpec> }[] = [{ id: 'self', spec: myAvatar ?? undefined }];
    for (const r of roster.slice(0, 9)) list.push({ id: r.id, spec: r.avatar });
    return list;
  }, [myAvatar, roster]);

  // The floor width decides the lanes; measured so the figures stay in-bounds on any screen.
  const [floorW, setFloorW] = useState(0);
  const laneW = members.length > 0 ? floorW / members.length : floorW;

  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ position: 'absolute', left: 3, top: 3, right: -3, bottom: -3, backgroundColor: C }} />
      <View style={{ borderWidth: 3, borderColor: C, backgroundColor: M.wall, overflow: 'hidden' }}>
        {/* ── sky ── */}
        <View style={{ height: SKY_H, backgroundColor: M.sky, borderBottomWidth: 2.5, borderBottomColor: C }}>
          {mood === 'night' && STARS.map(([fx, top], i) => (
            <Animated.View key={i} style={{ position: 'absolute', left: `${fx * 100}%`, top, width: 3, height: 3, backgroundColor: '#FEF08A', opacity: skyBlink }} />
          ))}
          {mood === 'day' && <View style={{ position: 'absolute', right: 14, top: 5, width: 14, height: 14, backgroundColor: '#FEF08A', borderWidth: 2, borderColor: C }} />}
          {mood === 'evening' && <View style={{ position: 'absolute', right: 14, top: 8, width: 14, height: 9, backgroundColor: '#F4A261', borderWidth: 2, borderColor: C }} />}
          <View style={{ position: 'absolute', left: 8, top: 5, backgroundColor: C, paddingVertical: 1, paddingHorizontal: 5 }}>
            <Text style={nbText.hand(9, nb.cream)}>{SHIFT_LABEL[mood]} · {t(`ward.${mood}Title`)}</Text>
          </View>
        </View>

        {/* ── the room ── */}
        <View style={{ height: ROOM_H, backgroundColor: M.wall }} onLayout={(e) => setFloorW(e.nativeEvent.layout.width)}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: ROOM_H * 0.62, bottom: 0, backgroundColor: M.floor }} />

          {[18, 64].map((left) => (
            <View key={left} style={{ position: 'absolute', left, top: 8, width: 20, height: 16, backgroundColor: M.window, borderWidth: 2, borderColor: C }}>
              <View style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1.5, backgroundColor: C }} />
            </View>
          ))}

          {/* vitals monitor */}
          <View style={{ position: 'absolute', right: 14, top: 6, width: 26, height: 19, backgroundColor: '#213B4A', borderWidth: 2, borderColor: C }}>
            <Animated.View style={{ position: 'absolute', left: 3, top: 8, width: 12, height: 2, backgroundColor: MINT, opacity: monitorPulse }} />
            <Animated.View style={{ position: 'absolute', right: 3, top: 3, width: 4, height: 3, backgroundColor: '#F58A8A', opacity: monitorBlink }} />
          </View>

          <Bed left={120} />
          <Bed left={168} />
          <Bed left={216} />

          {/* The figures, once the floor has been measured. */}
          {floorW > 0 && members.map((m, i) => (
            <Patrol key={m.id} id={m.id} spec={m.spec} lane={i} laneW={laneW} bottom={6} />
          ))}

          {mood === 'night' && (
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#213B4A', opacity: 0.28 }} />
          )}
        </View>

        {/* ── what this mood changes ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderTopWidth: 2.5, borderTopColor: C, backgroundColor: '#fff' }}>
          <Animated.View style={{ width: 7, height: 7, backgroundColor: '#F58A8A', borderWidth: 1.5, borderColor: C, opacity: barBlink }} />
          <Text style={[nbText.body(9.5, nb.soft), { flex: 1 }]}>{t(MOOD_SUB_KEY[mood])}</Text>
        </View>
      </View>
    </View>
  );
}
