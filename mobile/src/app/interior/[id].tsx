// Interior route: loads the tile map for {id} and hands it to the explore engine.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '@/api/client';
import { colors, fonts, type as t } from '@/theme/tokens';
import { InteriorScreen } from '@/map/InteriorScreen';
import { FIXTURES } from '@/map/fixtures/er';
import type { Interior } from '@engine';

export default function InteriorRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [interior, setInterior] = useState<Interior | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setError(false);
    setInterior(null);
    api
      .interior(id)
      .then((data) => alive && setInterior(data))
      .catch(() => {
        // Offline / no server (e.g. dev login in Expo Go): fall back to the
        // bundled fixture if we have one for this interior.
        if (!alive) return;
        const fixture = FIXTURES[id];
        if (fixture) setInterior(fixture);
        else setError(true);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  const center = (child: React.ReactNode) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, gap: 12 }}>
      <Stack.Screen options={{ headerShown: false }} />
      {child}
    </View>
  );

  if (error) {
    return center(<Text style={{ fontFamily: fonts.body, fontSize: t.body, color: colors.text }}>맵을 불러오지 못했습니다.</Text>);
  }
  if (!interior) {
    return center(<ActivityIndicator color={colors.ink} />);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <InteriorScreen
        interior={interior}
        onExit={() => router.back()}
        onEnterScenario={(h) => h.scenarioId && router.push(`/scenario/${h.scenarioId}`)}
      />
    </>
  );
}
