import { Stack } from 'expo-router';

// Root navigator: onboarding stack + main tabs. (Font loading wired once the
// pixel-font .ttf files land in assets/fonts — see that README.)
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
