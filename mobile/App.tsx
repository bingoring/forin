import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import './src/locales';
import { AppNavigator } from './src/navigation/AppNavigator';
import { analytics, setAnalytics } from './src/analytics';
import { createPostHogAnalytics } from './src/analytics/posthog';

// Analytics — vendor is swappable. If POSTHOG_KEY is missing, the noop
// baseline set by src/analytics/index.ts stays active.
const posthogKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
if (posthogKey) {
  setAnalytics(
    createPostHogAnalytics({
      apiKey: posthogKey,
      host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
    }),
  );
}

// Initialise Sentry before anything else so early crashes are captured.
// DSN is wired through EXPO_PUBLIC_SENTRY_DSN so it's baked into the
// JS bundle at build time; missing DSN means the SDK no-ops.
const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.EXPO_PUBLIC_SENTRY_ENV ?? 'development',
    // Trace sample rate is small to keep within the free Developer-plan
    // budget; bump this when we switch to a paid plan.
    tracesSampleRate: 0.05,
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // Nunito is the brand face. We block the first render until the four
  // weights we actually use are loaded; otherwise RN falls back to the
  // system font for the initial frame and every heading flashes.
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  useEffect(() => {
    analytics.track({ name: 'session_start' });
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <AppNavigator />
            <StatusBar style="auto" />
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Sentry.wrap adds a crash boundary + native module wiring so unhandled
// errors in the JS tree reach Sentry. It's a no-op when Sentry wasn't
// initialised (empty DSN).
export default Sentry.wrap(App);
