// 로그인 — the way back in, for someone who has been here before (v30).
//
// Not the first screen. A first launch opens the passport, whose COVER is the sign-in
// (see (onboarding)/passport.tsx): opening the passport and identifying yourself are one
// act there. This screen is what signing out leads to — the same three providers on paper
// instead of green, with a line that says welcome back rather than one that sells the app.
//
// The auth wiring lives in components/auth/SocialSignIn, shared with the cover. It has to
// be one implementation: the Google button owns an auth hook that throws when it runs
// with an empty client ID, so the rule about when to mount it cannot live in two files.
//
// The handoff's subtitle reads "어제까지 연속 12일 — 오늘도 이어가요". It is not drawn:
// nobody is signed in yet, so the streak is not knowable here, and a number the app cannot
// have would be an invention on the one screen where trust is being asked for.
import { Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SocialSignIn } from '@/components/auth/SocialSignIn';
import { NbSheet, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { syncOnboarded } from '@/lib/auth';
import { useT } from '@/i18n';

export default function Login() {
  const t = useT();
  const router = useRouter();

  // A profile that was never finished resumes in the passport; a finished one goes home.
  const enter = async () => router.replace((await syncOnboarded()) ? '/(tabs)' : '/passport');

  return (
    <NbSheet>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, paddingHorizontal: 28 }}>
        {/* The same f as the passport's gold emblem, in ink: this is the notebook's side
            of the same door. */}
        <View style={styles.emblem}>
          <Text style={styles.emblemF}>f</Text>
        </View>
        <Text style={[nbText.hand(27), styles.title]}>{t('login.welcomeBack')}</Text>
        <Text style={[nbText.body(12, nb.soft), styles.sub]}>{t('login.welcomeBackSub')}</Text>

        <View style={{ flex: 1 }} />

        <SocialSignIn onDone={enter} />

        <Text style={[nbText.hand(12.5, nb.soft), styles.terms]}>{t('login.terms')}</Text>
        <View style={{ height: 20 }} />
      </SafeAreaView>
    </NbSheet>
  );
}

const styles = {
  emblem: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: nb.ink,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 34,
  } as const,
  emblemF: { fontFamily: nbFonts.hand, fontSize: 38, lineHeight: 44, color: nb.ink, marginTop: -4 } as const,
  title: { textAlign: 'center', marginTop: 16, lineHeight: 34 } as const,
  sub: { textAlign: 'center', marginTop: 2 } as const,
  terms: { textAlign: 'center', marginTop: 18, lineHeight: 20 } as const,
};
