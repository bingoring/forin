// Onboarding 0 — app-launch landing (handoff ScreenSplash). A warm pixel sky
// (peach→mint) with drifting clouds, a friendly sun, and an airplane over the big
// forin wordmark, then the "처음 시작하기 / 로그인" entry into the auth flow.
import { Pressable, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PixelButton } from '@/components/PixelButton';
import { VertGradient, Cloud, PixelSun, PixelPlane } from '@/components/onboardingArt';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;

export default function Splash() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.peach }}>
      <Stack.Screen options={{ headerShown: false }} />
      <VertGradient from={colors.peach} to={colors.mint} bands={16} />

      {/* sky decor */}
      <Cloud size={1} style={{ top: 110, left: 24 }} />
      <Cloud size={1.3} style={{ top: 180, right: 30 }} />
      <Cloud size={0.8} style={{ top: 268, left: 80 }} />
      <Cloud size={1} style={{ top: 348, right: 56 }} />
      <PixelSun size={72} style={{ top: 84, right: 30 }} />
      <PixelPlane size={150} style={{ top: 206, alignSelf: 'center' }} />

      {/* logo + tagline */}
      <View style={{ position: 'absolute', top: 402, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 24 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 60, color: C, letterSpacing: 3, textShadowColor: colors.yellow, textShadowOffset: { width: 4, height: 4 }, textShadowRadius: 0 }}>forin</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.text, marginTop: 16, textAlign: 'center', lineHeight: 21 }}>
          해외 이직, 언어로 막막할 때{'\n'}
          <Text style={{ color: C, fontSize: 14 }}>가장 따뜻한 현장 시뮬레이션</Text>
        </Text>
      </View>

      {/* CTA */}
      <SafeAreaView edges={['bottom']} style={{ position: 'absolute', left: 0, right: 0, bottom: 24, paddingHorizontal: 32 }}>
        <PixelButton label="▶  처음 시작하기" bg={colors.yellow} shadowColor={colors.yellowShadow} paddingV={15} fontSize={15} full onPress={() => router.push('/login')} />
        <Pressable onPress={() => router.push('/login')} hitSlop={8} style={{ marginTop: 14, alignSelf: 'center' }}>
          <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft }}>
            이미 계정이 있다면 · <Text style={{ color: C, textDecorationLine: 'underline' }}>로그인</Text>
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
