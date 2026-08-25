// Onboarding 1 — one-tap sign-in (handoff ScreenLogin). A soft pixel sky
// (mint→cream) with clouds and the forin wordmark over three provider One-Tap
// buttons (Google / Apple / Kakao) with crisp SVG glyphs, then terms text.
//
// Apple → native (expo-apple-authentication). Google → expo-auth-session Google
// provider (OIDC id_token). Kakao → expo-auth-session code flow + token exchange
// (Kakao issues an id_token when `openid` is granted). Each id_token is POSTed to
// /auth/social, which OIDC-verifies it. Client IDs come from env (SOCIAL_CONFIG);
// a provider's real button (which owns the auth hook) mounts ONLY when its client
// ID is set — otherwise a "설정 필요" placeholder shows, so the hook never runs
// with an empty client ID (which throws). A dev bypass covers Expo Go.
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { completeSocialLogin, signInApple, signInKakao, devSignIn, syncOnboarded, SOCIAL_CONFIG, isProviderConfigured } from '@/lib/auth';
import { VertGradient, Cloud, GoogleGlyph, AppleGlyph, KakaoGlyph } from '@/components/onboardingArt';

import { colors, fonts, fs } from '@/theme/tokens';
import { t, useLocale, useT } from '@/i18n';

// Lets the auth popup redirect back and dismiss the in-app browser.
WebBrowser.maybeCompleteAuthSession();

const C = colors.ink;
const KAKAO_ISSUER = 'https://kauth.kakao.com';

type Complete = (label: string, run: () => Promise<void>) => void;

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
      <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: fs(14), color }}>{label}</Text>
    </Pressable>
  );
}

// Google — owns the auth hook, so it mounts ONLY when configured (see Login).
function GoogleButton({ busy, complete }: { busy: boolean; complete: Complete }) {
  const t = useT();
  const [, res, prompt] = Google.useAuthRequest({
    iosClientId: SOCIAL_CONFIG.googleIosClientId || undefined,
    androidClientId: SOCIAL_CONFIG.googleAndroidClientId || undefined,
    webClientId: SOCIAL_CONFIG.googleWebClientId || undefined,
  });
  useEffect(() => {
    if (res?.type !== 'success') return;
    const idToken = res.authentication?.idToken ?? (res.params as Record<string, string> | undefined)?.id_token;
    if (idToken) complete('Google', () => completeSocialLogin('google', idToken));
    else Alert.alert(t('login.googleFailed'), t('login.noIdToken'));
  }, [res]); // eslint-disable-line react-hooks/exhaustive-deps
  return <OneTap bg="#fff" color={C} shadow={C + '55'} icon={<GoogleGlyph />} label={t('login.google')} disabled={busy || !prompt} onPress={() => prompt?.()} />;
}

// Kakao — official SDK (KakaoTalk app when installed, account web login when not).
// No auth hook to own, so unlike Google this needs no conditional mounting.
function KakaoButton({ busy, complete }: { busy: boolean; complete: Complete }) {
  const t = useT();
  return <OneTap bg="#FEE500" color="#3C1E1E" shadow="#CCB800" icon={<KakaoGlyph />} label={t('login.kakao')} disabled={busy} onPress={() => complete(t('provider.kakao'), signInKakao)} />;
}

export default function Login() {
  const t = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const enter = async () => router.replace((await syncOnboarded()) ? '/(tabs)' : '/locale');

  // Wrap a provider's id_token exchange with busy/error handling + navigation.
  const complete: Complete = async (label, run) => {
    if (busy) return;
    setBusy(true);
    try {
      await run();
      await enter();
    } catch (e) {
      Alert.alert(t('login.failed', { provider: label }), e instanceof Error ? e.message : t('common.retryHint'));
    } finally {
      setBusy(false);
    }
  };

  const notConfigured = (label: string) =>
    Alert.alert(t('login.notReady', { provider: label }), t('login.notReadyBody', { provider: label }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.mint }}>
      <Stack.Screen options={{ headerShown: false }} />
      <VertGradient from={colors.mint} to={colors.cream} bands={14} />
      <Cloud size={1.1} style={{ top: 90, left: 26 }} />
      <Cloud size={0.8} style={{ top: 140, right: 30 }} />

      {/* hero wordmark */}
      <View style={{ position: 'absolute', top: 150, left: 0, right: 0, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(48), color: C, letterSpacing: 3, textShadowColor: colors.yellow, textShadowOffset: { width: 4, height: 4 }, textShadowRadius: 0 }}>forin</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft, marginTop: 12 }}>한 번의 탭으로 시작하세요.</Text>
      </View>

      {/* providers — a provider's real (hook-owning) button mounts only when its
          client ID is set; otherwise a placeholder shows a "설정 필요" notice. */}
      <SafeAreaView edges={['bottom']} style={{ position: 'absolute', left: 0, right: 0, bottom: 24, paddingHorizontal: 28 }}>
        <View style={{ gap: 10 }}>
          {isProviderConfigured('google')
            ? <GoogleButton busy={busy} complete={complete} />
            : <OneTap bg="#fff" color={C} shadow={C + '55'} icon={<GoogleGlyph />} label={t('login.google')} disabled={busy} onPress={() => notConfigured('Google')} />}
          <OneTap bg="#000" color="#fff" shadow="#000" icon={<AppleGlyph />} label={t('login.apple')} disabled={busy} onPress={() => complete('Apple', signInApple)} />
          {isProviderConfigured('kakao')
            ? <KakaoButton busy={busy} complete={complete} />
            : <OneTap bg="#FEE500" color="#3C1E1E" shadow="#CCB800" icon={<KakaoGlyph />} label={t('login.kakao')} disabled={busy} onPress={() => notConfigured(t('provider.kakao'))} />}
        </View>

        <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, textAlign: 'center', marginTop: 16, lineHeight: 16 }}>
          계속 진행하면 <Text style={{ color: C, textDecorationLine: 'underline' }}>이용약관</Text> 및 <Text style={{ color: C, textDecorationLine: 'underline' }}>개인정보처리방침</Text>에{'\n'}동의하는 것으로 간주됩니다.
        </Text>

        {/* Dev-only bypass — real provider auth needs a dev build + credentials. */}
        {__DEV__ && (
          <Pressable onPress={() => complete(t('login.developer'), devSignIn)} disabled={busy} style={{ marginTop: 14, alignSelf: 'center' }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: colors.textFaint }}>개발자 로그인 (둘러보기)</Text>
          </Pressable>
        )}
      </SafeAreaView>
    </View>
  );
}
