import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { restoreSession } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/tokens';

// Entry gate: rehydrate the session, then route to the app or onboarding.
export default function Index() {
  const [ready, setReady] = useState(false);
  const isAuthed = useAuthStore((s) => s.isAuthed);

  useEffect(() => {
    restoreSession().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper }}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }
  return <Redirect href={isAuthed ? '/campus' : '/login'} />;
}
