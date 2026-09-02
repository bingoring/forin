import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { loadDraft, nextStep } from '@/lib/onboardingDraft';

// Entry gate: the root layout already rehydrated the session (secure-store) and
// learned onboarding state, so route to login → onboarding → app accordingly.
export default function Index() {
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const onboarded = useAuthStore((s) => s.onboarded);
  // Where an interrupted wizard should resume. `undefined` = not looked up yet.
  const [resume, setResume] = useState<'/passport' | undefined>();

  useEffect(() => {
    if (onboarded === false) loadDraft().then((d) => setResume(nextStep(d)));
  }, [onboarded]);

  if (!isAuthed) return <Redirect href="/splash" />;
  if (onboarded === false) {
    // Hold one frame for the draft rather than flashing step 1 and jumping.
    return resume ? <Redirect href={resume} /> : null;
  }
  // Home, not the career tab: the app's first screen shows today's ONE thing
  // rather than the curriculum/building/situation lists (handoff v21 §①b).
  return <Redirect href="/(tabs)" />;
}
