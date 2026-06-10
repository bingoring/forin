import { Redirect } from 'expo-router';

// Entry: send to the main tabs for now. 4b will gate on auth (→ onboarding when not signed in).
export default function Index() {
  return <Redirect href="/campus" />;
}
