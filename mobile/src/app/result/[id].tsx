// Scenario result / reward screen — shown after clearing a scenario (final quiz
// step, or a no-quiz scenario's dialogue). It now connects to the real growth
// system: on mount it records the attempt (POST /attempts) which awards XP and
// advances the daily streak, then celebrates the ACTUAL result — animated XP
// count-up to the new total, a level-progress bar, a level-up banner when the
// level ticks over, and the current streak. Falls back to the scenario's static
// briefing rewards if the progress API is unavailable (offline / not authed).
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, Share, Text, View, type GestureResponderEvent, type ViewStyle } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { api, type Progress, type ScenarioDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;
const XP_PER_LEVEL = 100; // server: level = 1 + floor(xp / 100)

// Parse the scenario's authored XP reward ("+ 120 XP" → 120); default 100.
function baseXpOf(s: ScenarioDetail | null): number {
  const r = s?.briefing?.rewards?.find((x) => x.label.includes('경험치') || /xp/i.test(x.value));
  const n = r ? parseInt(r.value.replace(/[^0-9]/g, ''), 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 100;
}

export default function ResultRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);
  const [before, setBefore] = useState<Progress | null>(null);
  const [after, setAfter] = useState<Progress | null>(null);
  const [failed, setFailed] = useState(false);
  const recorded = useRef(false);

  // Firework bursts (1:1 with the v17 handoff): one anchored to the sticker on
  // mount, plus one wherever the user taps the background. Each auto-expires.
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextBurst = useRef(1);
  const stickerRef = useRef<View>(null);
  const spawnBurst = (x: number, y: number) => {
    const id = nextBurst.current++;
    setBursts((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setBursts((curr) => curr.filter((b) => b.id !== id)), 4600);
  };
  const onBgTap = (e: GestureResponderEvent) => spawnBurst(e.nativeEvent.locationX, e.nativeEvent.locationY);
  const onStickerLayout = () => {
    stickerRef.current?.measureInWindow((x, y, w, h) => spawnBurst(x + w / 2, y + h / 2));
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      const s = await api.scenario(id).catch(() => null);
      if (alive) setScenario(s);
      if (recorded.current) return;
      recorded.current = true; // guard StrictMode double-invoke / re-award
      try {
        const b = await api.progress();
        const a = await api.recordAttempt(id, baseXpOf(s));
        if (alive) { setBefore(b); setAfter(a); }
      } catch {
        if (alive) setFailed(true); // not authed / offline → static fallback
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const baseXp = baseXpOf(scenario);
  const subtitle = scenario?.briefing?.dept || scenario?.title || '';
  const leveledUp = !!before && !!after && after.level > before.level;

  const onShare = () => {
    const lv = after ? ` (Lv.${after.level}${after.streakCurrent > 1 ? ` · 🔥${after.streakCurrent}일` : ''})` : '';
    Share.share({ message: `forin에서 "${scenario?.title || '시나리오'}"를 클리어하고 +${baseXp} XP를 얻었어요!${lv}` }).catch(() => {});
  };

  return (
    <Pressable onPress={onBgTap} style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

      {/* confetti layer — above background, below content, tap-transparent */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, overflow: 'hidden' }}>
        {bursts.map((b) => <ConfettiBurst key={b.id} x={b.x} y={b.y} />)}
      </View>

      {/* topbar */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 52, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', zIndex: 3 }}>
        <PixelButton label="‹ 맵으로" bg="#fff" shadowColor={C} offset={2} fontSize={11} borderWidth={2} paddingV={4} paddingH={10} onPress={() => router.replace('/campus')} />
        <PixelButton label="↗ 공유" bg={colors.yellow} shadowColor={colors.yellowShadow} offset={2} fontSize={11} borderWidth={2} paddingV={4} paddingH={10} onPress={onShare} />
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 92, alignItems: 'center', zIndex: 2 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: colors.textSoft }}>SCENARIO CLEAR!</Text>
        <View style={{ marginTop: 6 }}>
          <Text style={{ position: 'absolute', left: 3, top: 3, fontFamily: fonts.heading, fontSize: 34, color: colors.yellow }}>참 잘했어요!</Text>
          <Text style={{ fontFamily: fonts.heading, fontSize: 34, color: C }}>참 잘했어요!</Text>
        </View>
        {!!subtitle && <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textSoft, marginTop: 8 }}>{subtitle}</Text>}

        {/* level-up banner */}
        {leveledUp && (
          <Shadowed offset={4} style={{ alignSelf: 'stretch', marginTop: 14 }}>
            <View style={{ backgroundColor: colors.yellow, borderWidth: 3, borderColor: C, paddingVertical: 10, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: C }}>🎉 레벨 업!  Lv.{before!.level} → Lv.{after!.level}</Text>
            </View>
          </Shadowed>
        )}

        {/* sticker */}
        <Shadowed offset={5} style={{ marginTop: 16, marginBottom: 16, transform: [{ rotate: '-4deg' }] }}>
          <View ref={stickerRef} onLayout={onStickerLayout} style={{ width: 130, height: 130, backgroundColor: colors.yellow, borderWidth: 4, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: C, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 32 }}>⭐</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C, marginTop: 4 }}>참잘했</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>어요</Text>
            </View>
          </View>
        </Shadowed>

        {/* XP + level card */}
        <Shadowed offset={4} style={{ alignSelf: 'stretch' }}>
          <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 14 }}>
            {after ? (
              <XpCard baseXp={baseXp} before={before} after={after} />
            ) : failed ? (
              <StaticRewards scenario={scenario} baseXp={baseXp} />
            ) : (
              <View style={{ paddingVertical: 18, alignItems: 'center' }}>
                <ActivityIndicator color={C} />
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft, marginTop: 8 }}>보상 적립 중…</Text>
              </View>
            )}

            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 2, borderTopColor: '#2A252233', borderStyle: 'dotted' }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C, lineHeight: 16 }}>"오늘 당신은 환자에게 따뜻한 미소를 주었습니다." 💌</Text>
            </View>
          </View>
        </Shadowed>

        {/* footer */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 16, alignSelf: 'stretch' }}>
          <PixelButton label="📓 리뷰랩에 저장" bg="#fff" shadowColor={C + '33'} onPress={() => router.replace('/lab')} style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <PixelButton label="다음 시나리오 ▶" bg={colors.mint} shadowColor={colors.mintShadow} onPress={() => router.replace('/campus')} full />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ── XP + level card (real progress) ───────────────────────────────────
function XpCard({ baseXp, before, after }: { baseXp: number; before: Progress | null; after: Progress }) {
  const startXp = before?.xp ?? Math.max(0, after.xp - baseXp);
  const inLevel = after.xp % XP_PER_LEVEL;
  const toNext = XP_PER_LEVEL - inLevel;
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <View style={{ width: 30, height: 30, backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 15 }}>⭐</Text>
        </View>
        <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 12, color: C }}>경험치 획득</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: '#10B981' }}>+{baseXp} XP</Text>
      </View>

      {/* level + progress bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>Lv. {after.level}</Text>
        <CountUp from={startXp} to={after.xp} suffix=" XP" style={{ fontFamily: fonts.heading, fontSize: 12, color: colors.textSoft }} />
      </View>
      <LevelBar ratio={inLevel / XP_PER_LEVEL} />
      <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, marginTop: 5, textAlign: 'right' }}>다음 레벨까지 {toNext} XP</Text>

      {/* streak */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1.5, borderTopColor: '#2A252222', borderStyle: 'dotted' }}>
        <View style={{ width: 28, height: 28, backgroundColor: colors.peach, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14 }}>🔥</Text>
        </View>
        <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 12, color: C }}>연속 학습</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>{after.streakCurrent}일{after.streakCurrent >= after.streakLongest && after.streakCurrent > 1 ? ' 🏅최고' : ''}</Text>
      </View>
    </View>
  );
}

function LevelBar({ ratio }: { ratio: number }) {
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(w, { toValue: Math.max(0.02, Math.min(1, ratio)), duration: 900, delay: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [w, ratio]);
  return (
    <View style={{ height: 14, backgroundColor: colors.cream, borderWidth: 2, borderColor: C, overflow: 'hidden' }}>
      <Animated.View style={{ height: '100%', backgroundColor: colors.mint, width: w.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
    </View>
  );
}

function CountUp({ from, to, suffix = '', style }: { from: number; to: number; suffix?: string; style?: object }) {
  const [n, setN] = useState(from);
  const v = useRef(new Animated.Value(from)).current;
  useEffect(() => {
    const sub = v.addListener(({ value }) => setN(Math.round(value)));
    Animated.timing(v, { toValue: to, duration: 1100, delay: 250, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => v.removeListener(sub);
  }, [v, to]);
  return <Text style={style}>{n.toLocaleString()}{suffix}</Text>;
}

// ── static fallback (offline / not authed) ────────────────────────────
function StaticRewards({ scenario, baseXp }: { scenario: ScenarioDetail | null; baseXp: number }) {
  const rewards = scenario?.briefing?.rewards ?? [{ icon: '⭐', label: '경험치', value: `+ ${baseXp} XP` }];
  return (
    <View>
      <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: colors.textSoft, marginBottom: 10 }}>REWARDS</Text>
      {rewards.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, borderBottomWidth: i < rewards.length - 1 ? 1.5 : 0, borderBottomColor: '#2A252222', borderStyle: 'dotted' }}>
          <View style={{ width: 28, height: 28, backgroundColor: colors.cream, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14 }}>{r.icon}</Text>
          </View>
          <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 12, color: C }}>{r.label}</Text>
          <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

// ── confetti burst (1:1 with v17 handoff ConfettiBurst) ───────────────
// A one-shot firework at container-local (x, y): 48 embers each follow a real
// parabola sampled through (0,0), (peakT, peakY), (1, finalY) — up fast, arc
// over, fall past the bottom — plus a warm flash at the origin. The handoff
// drives this with the Web Animations API; here each ember rides one Animated
// value with a multi-point interpolation that reproduces the same curve.
const BURST_COLORS = [colors.mint, colors.peach, colors.yellow, colors.pink, colors.blue, '#A78BFA', '#FCA5A5', '#10B981'];
const N_SAMPLES = 24;

function ConfettiBurst({ x, y }: { x: number; y: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 70 + Math.random() * 180;
        const peakT = 0.32 + Math.random() * 0.1;
        const peakY = -(60 + Math.random() * 130);
        const finalY = 480 + Math.round(Math.random() * 260);
        // sample the parabola at N evenly-spaced times for a smooth Animated curve
        const ins: number[] = [];
        const ys: number[] = [];
        for (let k = 0; k <= N_SAMPLES; k++) {
          const t = k / N_SAMPLES;
          const alpha = (t * (t - 1)) / (peakT * (peakT - 1));
          const beta = (t * (t - peakT)) / (1 - peakT);
          ins.push(t);
          ys.push(alpha * peakY + beta * finalY);
        }
        return {
          finalX: Math.round(Math.cos(angle) * speed),
          ins, ys,
          c: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
          dur: (2.6 + Math.random() * 1.4) * 1000,
          rot: Math.round(Math.random() * 720 - 360),
          size: 7 + Math.floor(Math.random() * 3) * 2,
        };
      }),
    [],
  );
  const flash = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(flash, { toValue: 1, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [flash]);

  return (
    <>
      {/* warm flash at the origin */}
      <Animated.View
        style={{
          position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: 30,
          backgroundColor: 'rgba(255,236,150,0.9)',
          opacity: flash.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.9, 0.5, 0] }),
          transform: [{ scale: flash.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.6] }) }],
        }}
      />
      {pieces.map((p, i) => <Ember key={i} x={x} y={y} {...p} />)}
    </>
  );
}

function Ember({ x, y, finalX, ins, ys, c, dur, rot, size }: { x: number; y: number; finalX: number; ins: number[]; ys: number[]; c: string; dur: number; rot: number; size: number }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: dur, easing: Easing.linear, useNativeDriver: true }).start();
  }, [t, dur]);
  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [0, finalX] });
  const translateY = t.interpolate({ inputRange: ins, outputRange: ys });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${rot}deg`] });
  const opacity = t.interpolate({ inputRange: [0, 0.05, 0.88, 1], outputRange: [0, 1, 1, 0] });
  return (
    <Animated.View
      style={{
        position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size,
        backgroundColor: c, borderWidth: 1.5, borderColor: C, opacity,
        transform: [{ translateX }, { translateY }, { rotate }],
      }}
    />
  );
}

function Shadowed({ children, offset = 4, shadowColor = C, style }: { children: React.ReactNode; offset?: number; shadowColor?: string; style?: ViewStyle }) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}
