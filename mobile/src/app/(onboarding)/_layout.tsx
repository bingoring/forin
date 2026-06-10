import { Stack } from 'expo-router';

// Onboarding flow: Splash → Login → Locale/Destination → Job → Level (handoff ①).
// Screens are route shells here; full UI lands in Stage 2-6.
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
