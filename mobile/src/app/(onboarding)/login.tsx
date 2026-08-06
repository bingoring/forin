// Onboarding 1 — one-tap sign-in (handoff ScreenLogin). A soft pixel sky
// (mint→cream) with clouds and the forin wordmark over three provider One-Tap
// buttons (Google / Apple / Kakao) with crisp SVG glyphs, then terms text. Social
// sign-in hits the server /auth/social → JWT (secure-store); a dev bypass lets
// you walk the app in Expo Go where real provider auth needs a native build.
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signIn, devSignIn, syncOnboarded, type Provider } from '@/lib/auth';
import { VertGradient, Cloud, GoogleGlyph, AppleGlyph, KakaoGlyph } from '@/components/onboardingArt';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;

// One-Tap provider button — icon + label, hard pixel shadow (handoff OneTapButton).
function OneTap({ bg, color, shadow, icon, label, disabled, onPress }: {
  bg: string; color: string; shadow: string; icon: React.ReactNode; label: string; disabled?: boolean; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => ({
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: bg, borderWidth: 3, borderColor: C,
      paddingVertical: 12, paddingHorizontal: 16,
      opacity: disabled ? 0.6 : 1,
      transform: [{ translateX: pressed ? 4 : 0 }, { translateY: pressed ? 4 : 0 }],
      shadowColor: shadow, shadowOffset: { width: pressed ? 0 : 4, height: pressed ? 0 : 4 }, shadowOpacity: 1, shadowRadius: 0,
    })}>
      <View style={{ width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
      <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: 14, color }}>{label}</Text>
    </Pressable>
  );
}

export default function Login() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function enter() {
    router.replace((await syncOnboarded()) ? '/campus' : '/locale');
  }
  async function onProvider(provider: Provider) {
    if (busy) return;
    setBusy(true);
    try {
      await signIn(provider);
      await enter();
    } catch (e) {
      Alert.alert('로그인 실패', e instanceof Error ? e.message : '다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  }
  async function onDev() {
    if (busy) return;
    setBusy(true);
    try {
      await devSignIn();
      await enter();
    } catch (e) {
      Alert.alert('개발자 로그인 실패', e instanceof Error ? e.message : '서버(ENV=dev)가 실행 중인지 확인하세요.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.mint }}>
      <Stack.Screen options={{ headerShown: false }} />
      <VertGradient from={colors.mint} to={colors.cream} bands={14} />
      <Cloud size={1.1} style={{ top: 90, left: 26 }} />
      <Cloud size={0.8} style={{ top: 140, right: 30 }} />

      {/* hero wordmark */}
      <View style={{ position: 'absolute', top: 150, left: 0, right: 0, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 48, color: C, letterSpacing: 3, textShadowColor: colors.yellow, textShadowOffset: { width: 4, height: 4 }, textShadowRadius: 0 }}>forin</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textSoft, marginTop: 12 }}>한 번의 탭으로 시작하세요.</Text>
      </View>

      {/* providers */}
      <SafeAreaView edges={['bottom']} style={{ position: 'absolute', left: 0, right: 0, bottom: 24, paddingHorizontal: 28 }}>
        <View style={{ gap: 10 }}>
          <OneTap bg="#fff" color={C} shadow={C + '55'} icon={<GoogleGlyph />} label="Google로 계속하기" disabled={busy} onPress={() => onProvider('google')} />
          <OneTap bg="#000" color="#fff" shadow="#000" icon={<AppleGlyph />} label="Apple로 계속하기" disabled={busy} onPress={() => onProvider('apple')} />
          <OneTap bg="#FEE500" color="#3C1E1E" shadow="#CCB800" icon={<KakaoGlyph />} label="카카오로 시작하기" disabled={busy} onPress={() => onProvider('kakao')} />
        </View>

        <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, textAlign: 'center', marginTop: 16, lineHeight: 16 }}>
          계속 진행하면 <Text style={{ color: C, textDecorationLine: 'underline' }}>이용약관</Text> 및 <Text style={{ color: C, textDecorationLine: 'underline' }}>개인정보처리방침</Text>에{'\n'}동의하는 것으로 간주됩니다.
        </Text>

        {/* Dev-only bypass — real provider auth needs a dev build + credentials. */}
        {__DEV__ && (
          <Pressable onPress={onDev} disabled={busy} style={{ marginTop: 14, alignSelf: 'center' }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: colors.textFaint }}>🛠 개발자 로그인 (둘러보기)</Text>
          </Pressable>
        )}
      </SafeAreaView>
    </View>
  );
}
