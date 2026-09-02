// The three ways in, in each brand's own clothes (v30).
//
// Written once and used twice — the passport cover (first launch, dark green) and the
// re-login screen (paper). That is not tidiness: the Google button OWNS an auth hook
// (`Google.useAuthRequest`), and a hook that runs with an empty client ID throws. Keeping
// the mounting rule in two files is how one of them ends up wrong.
//
// The buttons deliberately do NOT wear the notebook line. Each provider publishes brand
// guidelines that fix its button's colour, mark and proportions — Google's white sheet
// with the four-colour G, Apple's black, Kakao's own image asset — and a hand-drawn
// version of a sign-in button is both a guideline violation and, for the person looking at
// it, a worse button: these three shapes are recognised before they are read. So this is
// the one place in the app that is not drawn by hand, and the paper around them carries
// the notebook instead.
//
// id/pw is not offered at all (v30 07). A returning user signs in with the same provider
// and the server recognises them; resetting is a profile action, not a login one.
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Svg, { Path } from 'react-native-svg';
import {
  SOCIAL_CONFIG, completeSocialLogin, devSignIn, isProviderConfigured, signInApple, signInKakao,
} from '@/lib/auth';
import { nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';

// Lets the auth popup redirect back and dismiss the in-app browser.
WebBrowser.maybeCompleteAuthSession();

/** Height of all three buttons. Kakao's asset is 600×90, so it scales to this exactly. */
const H = 50;

/** Google's published G, at its own viewBox. Redrawing it smaller loses the arc weights
 *  the guidelines specify, so the paths are the published ones. */
function GoogleG({ size = 19 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </Svg>
  );
}

/** Apple's mark. Solid, single colour, as the guidelines require. */
function AppleMark({ size = 19, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={(size * 22) / 18} viewBox="0 0 18 22">
      <Path
        fill={color}
        d="M14.5 11.6c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.7 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.7 2.5 2.9 2.4 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.4-1-2.4-3.6zM12.3 4.2c.6-.8 1.1-1.8 1-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2-.5 2.7-1.3z"
      />
    </Svg>
  );
}

/** A provider button: mark pinned left, label centred on the button — the layout all
 *  three brands specify, and the reason the label is not simply beside the mark. */
function BrandButton({ bg, border, label, labelColor, mark, disabled, onPress }: {
  bg: string; border?: string; label: string; labelColor: string;
  mark: React.ReactNode; disabled?: boolean; onPress: () => void;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        height: H, borderRadius: 6, paddingLeft: 18, justifyContent: 'center',
        backgroundColor: bg,
        borderWidth: border ? 1 : 0, borderColor: border,
        opacity: disabled ? 0.55 : pressed ? 0.85 : 1,
        shadowColor: '#000', shadowOpacity: pressed ? 0.06 : 0.18, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
        elevation: pressed ? 1 : 2,
      })}
    >
      {mark}
      <Text
        numberOfLines={1}
        style={{
          position: 'absolute', left: 0, right: 0, textAlign: 'center',
          fontFamily: nbFonts.bodyMid, fontSize: 15, color: labelColor,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type Complete = (label: string, run: () => Promise<void>) => void;

/** Google — owns the auth hook, so it mounts ONLY when configured (see SocialSignIn). */
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
  return (
    <BrandButton
      bg="#fff" border="#DADCE0" label={t('login.google')} labelColor="#1F1F1F"
      mark={<GoogleG />} disabled={busy || !prompt} onPress={() => prompt?.()}
    />
  );
}

/**
 * The three buttons, plus the dev bypass.
 *
 * `onDone` runs after a successful sign-in — where to go next is the caller's business:
 * the passport cover turns its own page, the login screen replaces the route.
 */
export function SocialSignIn({ onDone, tone = 'paper' }: {
  onDone: () => void | Promise<void>;
  /** `dark` sits on the passport cover; only the dev bypass's colour differs. */
  tone?: 'paper' | 'dark';
}) {
  const t = useT();
  const [busy, setBusy] = useState(false);

  const complete: Complete = async (label, run) => {
    if (busy) return;
    setBusy(true);
    try {
      await run();
      await onDone();
    } catch (e) {
      Alert.alert(t('login.failed', { provider: label }), e instanceof Error ? e.message : t('common.retryHint'));
    } finally {
      setBusy(false);
    }
  };

  const notConfigured = (label: string) =>
    Alert.alert(t('login.notReady', { provider: label }), t('login.notReadyBody', { provider: label }));

  return (
    <View>
      <View style={{ gap: 11 }}>
        {isProviderConfigured('google')
          ? <GoogleButton busy={busy} complete={complete} />
          : (
            <BrandButton
              bg="#fff" border="#DADCE0" label={t('login.google')} labelColor="#1F1F1F"
              mark={<GoogleG />} disabled={busy} onPress={() => notConfigured('Google')}
            />
          )}

        <BrandButton
          bg="#000" label={t('login.apple')} labelColor="#fff"
          mark={<AppleMark />} disabled={busy} onPress={() => complete('Apple', signInApple)}
        />

        {/* Kakao publishes the whole button as an image, label included, so there is no
            text of ours to translate here. That is the brand requirement, and Kakao is a
            Korean service — a learner signing in with it reads Korean. */}
        <Pressable
          onPress={() => (isProviderConfigured('kakao') ? complete(t('provider.kakao'), signInKakao) : notConfigured(t('provider.kakao')))}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel={t('login.kakao')}
          style={({ pressed }) => ({
            height: H, borderRadius: 6, overflow: 'hidden',
            opacity: busy ? 0.55 : pressed ? 0.85 : 1,
            shadowColor: '#000', shadowOpacity: pressed ? 0.06 : 0.18, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
            elevation: pressed ? 1 : 2,
          })}
        >
          <Image
            source={require('../../../assets/brand/kakao_login_wide.png')}
            resizeMode="cover"
            style={{ width: '100%', height: H }}
          />
        </Pressable>
      </View>

      {/* Dev-only bypass — real provider auth needs a dev build + credentials. */}
      {__DEV__ && (
        <Pressable onPress={() => complete(t('login.developer'), devSignIn)} disabled={busy} hitSlop={8} style={{ marginTop: 14, alignSelf: 'center' }}>
          <Text style={{ fontFamily: nbFonts.hand, fontSize: 13, color: tone === 'dark' ? 'rgba(243,230,200,.5)' : nb.soft }}>
            {t('login.devBypass')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
