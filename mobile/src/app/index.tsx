import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

// Entry gate: the root layout already rehydrated the session (secure-store) and
// learned onboarding state, so route to login → onboarding → app accordingly.
export default function Index() {
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const onboarded = useAuthStore((s) => s.onboarded);
  if (!isAuthed) return <Redirect href="/splash" />;
  if (onboarded === false) return <Redirect href="/locale" />;
  // Home, not the career tab: the app's first screen shows today's ONE thing
  // rather than the curriculum/building/situation lists (handoff v21 §①b).
  return <Redirect href="/(tabs)" />;
}
