import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { bootstrapSession, initKakao } from '@/lib/auth';
import { api } from '@/api/client';
import { hydrateEconomy } from '@/data/economy';
import { colors } from '@/theme/tokens';
import { loadSfxPreference } from '@/lib/sfx';

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
  const [hydrated, setHydrated] = useState(false);
  const [fontsLoaded, fontError] = useFonts(FONTS);

  useEffect(() => {
    initKakao(); // must run before the login screen can call Kakao's SDK
    // Hydrate the economy config (single source of truth) alongside the session.
    Promise.all([bootstrapSession(), hydrateEconomy(() => api.economyConfig()), loadSfxPreference()]).finally(() => setHydrated(true));
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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
