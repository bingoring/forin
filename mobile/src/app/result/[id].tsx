// Scenario result / reward screen — shown after clearing a scenario (e.g. the
// final quiz step). 1:1 port of the v16 handoff `screens-dialogue.jsx`
// ScreenDialogueResult: SCENARIO CLEAR banner, a rotated "참잘했어요" sticker, a
// REWARDS card (from the scenario's briefing rewards), a warm message, and a
// footer. Confetti is a lightweight RN Animated burst (the handoff's Web
// Animations parabolas don't exist in RN). Rewards come from api.scenario(id).
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View, type ViewStyle } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { api, type ScenarioDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;
const CONFETTI_COLORS = [colors.mint, colors.peach, colors.yellow, colors.pink, '#A78BFA', '#FCA5A5', '#10B981', '#60A5FA'];

export default function ResultRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);

  useEffect(() => {
    let alive = true;
    api.scenario(id).then((s) => { if (alive) setScenario(s); }).catch(() => {});
    return () => { alive = false; };
  }, [id]);

  const rewards = scenario?.briefing?.rewards ?? [
    { icon: '⭐', label: '경험치', value: '+ 120 XP' },
  ];
  const subtitle = scenario?.briefing?.dept || scenario?.title || '';

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <Confetti />

      {/* topbar */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 52, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', zIndex: 3 }}>
        <PixelButton label="‹ 맵으로" bg="#fff" shadowColor={C} offset={2} onPress={() => router.replace('/campus')} style={{ paddingVertical: 4, paddingHorizontal: 10 }} />
        <PixelButton label="↗ 공유" bg={colors.yellow} shadowColor={colors.yellowShadow} offset={2} onPress={() => {}} style={{ paddingVertical: 4, paddingHorizontal: 10 }} />
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 96, alignItems: 'center', zIndex: 2 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: colors.textSoft }}>SCENARIO CLEAR!</Text>
        {/* yellow text-shadow via a stacked offset copy */}
        <View style={{ marginTop: 6 }}>
          <Text style={{ position: 'absolute', left: 3, top: 3, fontFamily: fonts.heading, fontSize: 34, color: colors.yellow }}>참 잘했어요!</Text>
          <Text style={{ fontFamily: fonts.heading, fontSize: 34, color: C }}>참 잘했어요!</Text>
        </View>
        {!!subtitle && <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textSoft, marginTop: 10 }}>{subtitle}</Text>}

        {/* sticker */}
        <Shadowed offset={5} style={{ marginVertical: 18, transform: [{ rotate: '-4deg' }] }}>
          <View style={{ width: 130, height: 130, backgroundColor: colors.yellow, borderWidth: 4, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: C, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 30 }}>⭐</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C, marginTop: 2 }}>참잘했</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>어요</Text>
            </View>
          </View>
        </Shadowed>

        {/* rewards card */}
        <Shadowed offset={4} style={{ alignSelf: 'stretch' }}>
          <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 14 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: colors.textSoft, marginBottom: 10 }}>REWARDS</Text>
            {rewards.map((r, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, borderBottomWidth: i < rewards.length - 1 ? 1.5 : 0, borderBottomColor: '#2A252222', borderStyle: 'dotted' }}>
                <View style={{ width: 28, height: 28, backgroundColor: i === 1 ? colors.mint : i === 3 ? colors.peach : colors.cream, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 14 }}>{r.icon}</Text>
                </View>
                <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 12, color: C }}>{r.label}</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>{r.value}</Text>
              </View>
            ))}
            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 2, borderTopColor: '#2A252233', borderStyle: 'dotted' }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C, lineHeight: 16 }}>"오늘 당신은 환자에게 따뜻한 한마디를 건넸습니다." 💌</Text>
            </View>
          </View>
        </Shadowed>

        {/* footer */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 16, alignSelf: 'stretch' }}>
          <PixelButton label="📓 리뷰랩" bg="#fff" shadowColor={C} onPress={() => router.replace('/lab')} style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <PixelButton label="다음 ▶" bg={colors.mint} shadowColor={colors.mintShadow} onPress={() => router.replace('/campus')} full />
          </View>
        </View>
      </View>
    </View>
  );
}

// ── confetti (Animated burst from the top-center) ─────────────────────
function Confetti() {
  const pieces = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      pid: i,
      left: 10 + ((i * 37) % 80), // spread % across width
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: (i % 6) * 90,
      drift: ((i % 5) - 2) * 20,
      rotate: (i % 2 === 0 ? 1 : -1) * (180 + (i % 3) * 120),
      size: 8 + (i % 3) * 3,
    })),
  ).current;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
      {pieces.map(({ pid, ...p }) => (
        <ConfettiPiece key={pid} {...p} />
      ))}
    </View>
  );
}

function ConfettiPiece({ left, color, delay, drift, rotate, size }: { left: number; color: string; delay: number; drift: number; rotate: number; size: number }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 2200, delay, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [t, delay]);
  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [-40, 700] });
  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [0, drift] });
  const rot = t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${rotate}deg`] });
  const opacity = t.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] });
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: 80,
        width: size,
        height: size,
        backgroundColor: color,
        borderWidth: 1,
        borderColor: C,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate: rot }],
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
