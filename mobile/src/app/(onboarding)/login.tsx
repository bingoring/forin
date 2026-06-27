import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { signIn, type Provider } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { colors, fonts, space, type as t } from '@/theme/tokens';

// Social one-tap sign-in → server /auth/social → JWT (secure-store), then enter the app.
export default function Login() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const devLogin = useAuthStore((s) => s.devLogin);

  async function onProvider(provider: Provider) {
    if (busy) return;
    setBusy(true);
    try {
      await signIn(provider);
      router.replace('/campus');
    } catch (e) {
      Alert.alert('로그인 실패', e instanceof Error ? e.message : '다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  }

  function onDevLogin() {
    devLogin();
    router.replace('/campus');
  }

  return (
    <View style={styles.s}>
      <Text style={styles.logo}>forin</Text>
      <Text style={styles.tag}>해외 이직, 언어로 막막할 때{'\n'}가장 따뜻한 현장 시뮬레이션</Text>
      <View style={styles.btns}>
        <PixelButton label="Google로 계속하기" bg={colors.cream} shadowColor={colors.ink} disabled={busy} onPress={() => onProvider('google')} full />
        <PixelButton label="Apple로 계속하기" bg={colors.ink} textColor={colors.cream} shadowColor={colors.text} disabled={busy} onPress={() => onProvider('apple')} full />
        <PixelButton label="카카오로 시작하기" bg={colors.yellow} shadowColor={colors.yellowShadow} disabled={busy} onPress={() => onProvider('kakao')} full />
      </View>

      {/* Dev-only bypass: real provider sign-in needs a dev build + credentials,
          so this lets you walk the UI/map in Expo Go. Stripped from production builds. */}
      {__DEV__ && (
        <View style={styles.dev}>
          <Text style={styles.devNote}>개발 모드 · 소셜 로그인은 dev build 필요</Text>
          <PixelButton label="🛠  개발자 로그인 (둘러보기)" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onDevLogin} full />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  s: { flex: 1, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.lg },
  logo: { fontFamily: fonts.heading, fontSize: t.hero, color: colors.ink, letterSpacing: 2 },
  tag: { fontFamily: fonts.body, fontSize: t.body, color: colors.textSoft, textAlign: 'center', lineHeight: 22 },
  btns: { alignSelf: 'stretch', gap: space.md, marginTop: space.xxl },
  dev: { alignSelf: 'stretch', gap: space.sm, marginTop: space.xl, alignItems: 'center' },
  devNote: { fontFamily: fonts.body, fontSize: t.caption, color: colors.textFaint },
});
