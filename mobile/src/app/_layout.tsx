import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { bootstrapSession, initKakao } from '@/lib/auth';
import { api } from '@/api/client';
import { hydrateEconomy } from '@/data/economy';
import { BootSplash } from '@/components/BootSplash';
import { loadSfxPreference, primeSfx } from '@/lib/sfx';
import { loadLocale, onLocaleChange, useLocale, useT } from '@/i18n';
import { loadAvatar } from '@/lib/avatar';
import { loadDialogueLayout } from '@/lib/dialogueLayout';
import { loadFavorites } from '@/lib/favorites';
import { initPresence } from '@/lib/wardPresence';

/** How long before the splash admits it is waiting on something. Long enough that a
 *  warm launch never shows it, short enough to land before a cold start's first
 *  retry. */
const SLOW_BOOT_MS = 2_500;

// The two pixel fonts the whole design is drawn in. The KEYS are what
// `fontFamily` resolves against, so they must match theme/tokens exactly — every
// screen already asks for "DungGeunMo"/"Galmuri11", and until these were loaded
// React Native silently fell back to the system face, quietly undoing the
// typography the handoff specifies.
const FONTS = {
  DungGeunMo: require('../../assets/fonts/DungGeunMo.ttf'),
  Galmuri11: require('../../assets/fonts/Galmuri11.ttf'),
  'Galmuri11-Bold': require('../../assets/fonts/Galmuri11-Bold.ttf'),
  // The 근무 수첩 line (v29). Three faces, three jobs — see theme/nb.ts: Gaegu is the
  // handwriting, Pretendard is what has to be read, IBM Plex Mono is what is
  // machine-printed inside the fiction (codes, IPA, the passport's MRZ).
  Gaegu: require('../../assets/fonts/Gaegu-Regular.ttf'),
  'Gaegu-Bold': require('../../assets/fonts/Gaegu-Bold.ttf'),
  Pretendard: require('../../assets/fonts/Pretendard-Regular.ttf'),
  'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
  'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.ttf'),
  IBMPlexMono: require('../../assets/fonts/IBMPlexMono-Regular.ttf'),
  'IBMPlexMono-SemiBold': require('../../assets/fonts/IBMPlexMono-SemiBold.ttf'),
};

// Root navigator: onboarding stack + main tabs. Rehydrates the session from
// secure-store here (not just the entry gate) so DEEP-LINKING straight to an
// authed screen — or a Fast-Refresh reload that wipes the in-memory store —
// still restores the token instead of failing with 401.
export default function RootLayout() {
  const t = useT();
  const [hydrated, setHydrated] = useState(false);
  // Boot taking long enough to wonder about. The server scales to zero, so the first
  // launch after an idle period waits on a cold start — and a silent wait is what makes
  // a working app look broken.
  const [slow, setSlow] = useState(false);
  const [fontsLoaded, fontError] = useFonts(FONTS);

  useEffect(() => {
    initKakao(); // must run before the login screen can call Kakao's SDK
    // Hydrate the economy config (single source of truth) alongside the session.
    // Mirror a language change to the profile so a reinstall restores it. Best
    // effort: the local setting has already applied, and a failed sync costs a
    // preference rather than a session.
    onLocaleChange((l) => { void api.setUILang(l).catch(() => {}); });
    // Create the sound players now, not on the first tap. createAudioPlayer loads
    // asynchronously and play() on a player that has not finished loading is dropped,
    // which is why the first tap on each sound was silent. Six short blips.
    primeSfx();
    // The live-ward heartbeat: app-wide, foreground-only. Idempotent, so a re-mount of
    // the root (a locale change) does not stack listeners.
    initPresence();
    const slowTimer = setTimeout(() => setSlow(true), SLOW_BOOT_MS);
    Promise.all([bootstrapSession(), hydrateEconomy(() => api.economyConfig()), loadSfxPreference(), loadLocale(), loadAvatar(), loadFavorites(), loadDialogueLayout()])
      .finally(() => { clearTimeout(slowTimer); setHydrated(true); });
    return () => clearTimeout(slowTimer);
  }, []);

  // Wait for the fonts too: rendering first and swapping later reflows every
  // screen. A font that fails to load must NOT block the app — falling back to
  // the system face is ugly, being unable to start is worse.
  if (!hydrated || (!fontsLoaded && !fontError)) {
    // The wordmark is drawn in DungGeunMo, which may not have loaded yet — the sky and
    // the plane are pure geometry and do not care, so the splash is worth showing
    // either way rather than holding a blank frame until the fonts land.
    return <BootSplash slow={slow} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
