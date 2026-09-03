// 스플래시 — the held beat before the passport opens.
//
// It carries no buttons any more. The old one asked "처음 시작하기 / 로그인" before the
// app knew anything, which made the FIRST tap a question the app could have answered
// itself: signing in is the passport's COVER now (v30), and a returning learner's session
// is already being restored behind this screen.
//
// The drawing is BootSplash's, not a copy of it — the launch screen and this one are the
// same cover, and rendering the same component is what keeps them identical when either
// changes.
import { useEffect } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { BootSplash } from '@/components/BootSplash';

/** How long the beat lasts. Long enough to read the wordmark, short enough that nobody
 *  waits for it. */
const HOLD_MS = 1400;

/** Where it hands over by default: the passport, whose COVER is the sign-in (v31 flow
 *  page 0). There is no separate login route — one door in, and it is the one the
 *  fiction opens with.
 *
 *  `?to=home` is the returning learner's path: they signed in on the cover, the
 *  passport closed, and this beat is the last thing between them and the app. Without
 *  the parameter the splash would send them back to the cover they just closed. */
const NEXT = '/passport' as const;

export default function Splash() {
  const router = useRouter();
  const { to } = useLocalSearchParams<{ to?: string }>();

  useEffect(() => {
    const timer = setTimeout(() => router.replace(to === 'home' ? '/(tabs)' : NEXT), HOLD_MS);
    return () => clearTimeout(timer);
  }, [router, to]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BootSplash />
    </>
  );
}
