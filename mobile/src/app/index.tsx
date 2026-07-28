import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

// Entry gate: the root layout already rehydrated the session (secure-store) and
// learned onboarding state, so route to login → onboarding → app accordingly.
export default function Index() {
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const onboarded = useAuthStore((s) => s.onboarded);
  if (!isAuthed) return <Redirect href="/login" />;
  if (onboarded === false) return <Redirect href="/locale" />;
  return <Redirect href="/campus" />;
}
