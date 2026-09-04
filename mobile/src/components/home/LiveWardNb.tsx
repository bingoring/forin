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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { NbCharacter } from '@/components/nb/NbCharacter';
import { useMyAvatar } from '@/hooks/useMyAvatar';
import { useWardVisible } from '@/lib/wardPresence';
import { MOOD_SUB_KEY, SHIFT_LABEL, moodAt, msUntilNextMood, type WardMood } from '@/data/wardMood';
import { nbText } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';
import { useT } from '@/i18n';
import { avatarSpecFromSeed, type AvatarSpec } from '@/data/nbAvatar';

const C = nb.ink;

/** Per-mood palette — the handoff's DAY / EVENING / NIGHT values. */
const MOODS: Record<WardMood, { sky: string; wall: string; floor: string; window: string }> = {
  day: { sky: '#BAE6FD', wall: '#FFFDF5', floor: '#E8E2D4', window: '#7CB3F0' },
  evening: { sky: '#FBCFE8', wall: '#FFF6E8', floor: '#E4D9C4', window: '#F4A261' },
  night: { sky: '#213B4A', wall: '#EFEAE0', floor: '#D8D2C2', window: '#FEF08A' },
};
const MINT = '#A8D9C3';

/** A stable empty roster: a fresh `[]` default would be a new array every render, which
 *  makes the members memo recompute and the displayed effect loop forever. */
const EMPTY_ROSTER: { id: string; avatar?: Partial<AvatarSpec> }[] = [];

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

/** One figure. It scatters to a per-id spot (so a join or a leave never reflows the
 *  others), wanders a little left↔right, and — when it arrives or departs — slides in from
 *  off the LEFT edge or out past the RIGHT edge, as the handoff asks. */
function Patrol({ id, spec, floorW, bottom, entering, leaving, onExited }: {
  id: string;
  spec?: Partial<AvatarSpec>;
  floorW: number;
  bottom: number;
  entering: boolean;
  leaving: boolean;
  onExited: (id: string) => void;
}) {
  const seed = unit(id);
  const startX = 6 + seed * Math.max(0, floorW - CHAR_W - 12);
  const range = 18 + seed * 22;
  const period = 3000 + Math.round(seed * 3000);

  // x is the translateX offset from startX. Entering figures begin off the left edge.
  const x = useRef(new Animated.Value(entering ? -(startX + CHAR_W + 6) : 0)).current;
  const patrol = useRef<Animated.CompositeAnimation | null>(null);

  const startPatrol = () => {
    patrol.current = Animated.loop(
      Animated.sequence([
        Animated.timing(x, { toValue: range, duration: period, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(x, { toValue: 0, duration: period, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    patrol.current.start();
  };

  useEffect(() => {
    if (entering) {
      Animated.timing(x, { toValue: 0, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true })
        .start(({ finished }) => { if (finished) startPatrol(); });
    } else {
      startPatrol();
    }
    return () => patrol.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!leaving) return;
    patrol.current?.stop();
    Animated.timing(x, { toValue: floorW - startX + CHAR_W, duration: 650, easing: Easing.in(Easing.quad), useNativeDriver: true })
      .start(({ finished }) => { if (finished) onExited(id); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving]);

  return (
    <Animated.View style={{ position: 'absolute', left: startX, bottom, transform: [{ translateX: x }] }}>
      <NbCharacter spec={spec} walking size={CHAR_W} />
    </Animated.View>
  );
}

export function LiveWardNb({ mood: forced, now, roster }: {
  /** Overrides the clock — for tests and the handoff's three static screens. */
  mood?: WardMood;
  /** Injectable clock, so a test can stand at 23:00 without touching the system time. */
  now?: () => Date;
  /** The people currently studying (Phase 2). Phase 1 leaves it empty and walks only self.
   *  `avatar` is absent when they never chose one — the id then seeds a face. */
  roster?: { id: string; avatar?: Partial<AvatarSpec> }[];
}) {
  roster = roster ?? EMPTY_ROSTER;
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

  // self is on the floor UNLESS the learner opted out of the ward — then they see only the
  // others (their own figure vanishing is the opt-out's visible proof). The roster fills the
  // rest, capped so the ward stays legible.
  const visible = useWardVisible();
  const members = useMemo(() => {
    const list: { id: string; spec?: Partial<AvatarSpec> }[] = [];
    if (visible) list.push({ id: 'self', spec: myAvatar ?? undefined });
    // A face they chose, or one seeded from their id so a ward of avatar-less learners is
    // still a crowd of different people rather than the same default face ten times.
    const cap = visible ? 9 : 10;
    for (const r of roster.slice(0, cap)) list.push({ id: r.id, spec: r.avatar ?? avatarSpecFromSeed(r.id) });
    return list;
  }, [visible, myAvatar, roster]);

  // displayed holds who is on screen, INCLUDING figures animating out: a leaver stays
  // mounted until it has walked off the right edge, then removeExited drops it.
  const [displayed, setDisplayed] = useState<{ id: string; spec?: Partial<AvatarSpec>; leaving?: boolean }[]>([]);
  // Key on the ids only: the members array identity changes every poll, but the displayed
  // set should reshuffle only when someone actually joins or leaves.
  const memberKey = members.map((m) => m.id).join('|');
  useEffect(() => {
    setDisplayed((prev) => {
      const want = new Set(members.map((m) => m.id));
      const next: { id: string; spec?: Partial<AvatarSpec>; leaving?: boolean }[] =
        members.map((m) => ({ id: m.id, spec: m.spec }));
      for (const d of prev) {
        if (!want.has(d.id) && !next.some((n) => n.id === d.id)) {
          next.push({ id: d.id, spec: d.spec, leaving: true }); // just left — let its exit play
        }
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberKey]);
  const removeExited = useCallback((id: string) => {
    setDisplayed((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // The floor width is measured so the figures stay in-bounds on any screen.
  const [floorW, setFloorW] = useState(0);

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

          {/* The figures, once the floor has been measured. Self never enters or leaves. */}
          {floorW > 0 && displayed.map((d) => (
            <Patrol
              key={d.id}
              id={d.id}
              spec={d.spec}
              floorW={floorW}
              bottom={6}
              entering={d.id !== 'self'}
              leaving={!!d.leaving}
              onExited={removeExited}
            />
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
