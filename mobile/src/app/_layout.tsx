import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { bootstrapSession, initKakao } from '@/lib/auth';
import { api } from '@/api/client';
import { hydrateEconomy } from '@/data/economy';
import { colors } from '@/theme/tokens';

// Root navigator: onboarding stack + main tabs. Rehydrates the session from
// secure-store here (not just the entry gate) so DEEP-LINKING straight to an
// authed screen — or a Fast-Refresh reload that wipes the in-memory store —
// still restores the token instead of failing with 401.
export default function RootLayout() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    initKakao(); // must run before the login screen can call Kakao's SDK
    // Hydrate the economy config (single source of truth) alongside the session.
    Promise.all([bootstrapSession(), hydrateEconomy(() => api.economyConfig())]).finally(() => setHydrated(true));
  }, []);

  if (!hydrated) {
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
