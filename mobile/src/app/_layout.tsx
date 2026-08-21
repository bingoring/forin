import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { bootstrapSession, initKakao } from '@/lib/auth';
import { api } from '@/api/client';
import { hydrateEconomy } from '@/data/economy';
import { colors } from '@/theme/tokens';
import { loadSfxPreference } from '@/lib/sfx';
import { loadLocale, onLocaleChange, useLocale } from '@/i18n';
import { loadAvatar } from '@/lib/avatar';
import { loadFavorites } from '@/lib/favorites';

// The two pixel fonts the whole design is drawn in. The KEYS are what
// `fontFamily` resolves against, so they must match theme/tokens exactly — every
// screen already asks for "DungGeunMo"/"Galmuri11", and until these were loaded
// React Native silently fell back to the system face, quietly undoing the
// typography the handoff specifies.
const FONTS = {
  DungGeunMo: require('../../assets/fonts/DungGeunMo.ttf'),
  Galmuri11: require('../../assets/fonts/Galmuri11.ttf'),
  'Galmuri11-Bold': require('../../assets/fonts/Galmuri11-Bold.ttf'),
};

// Root navigator: onboarding stack + main tabs. Rehydrates the session from
// secure-store here (not just the entry gate) so DEEP-LINKING straight to an
// authed screen — or a Fast-Refresh reload that wipes the in-memory store —
// still restores the token instead of failing with 401.
export default function RootLayout() {
  // Keyed on the language, which remounts every screen when it changes.
  //
  // Not decoration. React Compiler is on (app.json experiments) and it caches expressions
  // by their reactive inputs — `t("campus.favTitle")` takes a constant, so 66 of these
  // calls sit in memo slots in the bundle, computed once per component instance. A screen
  // that re-renders on a language change therefore re-renders with the strings it was
  // first mounted with. Subscribing to the locale is not enough; the cached value has to
  // be thrown away, and remounting is what throws it away.
  //
  // The thorough alternative is a locale-bound translate function (`const tr = useT()`),
  // which gives the compiler a reactive input at every call site — several hundred of them.
  // Worth doing; not worth doing blind. Changing language costs the screens' scroll
  // positions here, which for a setting people touch once is the right trade.
  const locale = useLocale();
  const [hydrated, setHydrated] = useState(false);
  const [fontsLoaded, fontError] = useFonts(FONTS);

  useEffect(() => {
    initKakao(); // must run before the login screen can call Kakao's SDK
    // Hydrate the economy config (single source of truth) alongside the session.
    // Mirror a language change to the profile so a reinstall restores it. Best
    // effort: the local setting has already applied, and a failed sync costs a
    // preference rather than a session.
    onLocaleChange((l) => { void api.setUILang(l).catch(() => {}); });
    Promise.all([bootstrapSession(), hydrateEconomy(() => api.economyConfig()), loadSfxPreference(), loadLocale(), loadAvatar(), loadFavorites()])
      .finally(() => setHydrated(true));
  }, []);

  // Wait for the fonts too: rendering first and swapping later reflows every
  // screen. A font that fails to load must NOT block the app — falling back to
  // the system face is ugly, being unable to start is worse.
  if (!hydrated || (!fontsLoaded && !fontError)) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper }}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <Stack key={locale} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
