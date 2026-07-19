import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

// Entry gate: the root layout already rehydrated the session (secure-store),
// so just route to the app or onboarding based on auth state.
export default function Index() {
  const isAuthed = useAuthStore((s) => s.isAuthed);
  return <Redirect href={isAuthed ? '/campus' : '/login'} />;
}
