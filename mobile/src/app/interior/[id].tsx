// Interior route: loads the tile map for {id} and hands it to the explore engine.
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '@/api/client';
import { colors, fonts, type as t } from '@/theme/tokens';
import { InteriorScreen } from '@/map/InteriorScreen';
import { DoorReveal } from '@/map/DoorReveal';
import { FIXTURES } from '@/map/fixtures/er';
import type { Interior } from '@engine';

export default function InteriorRoute() {
  const { id, via, c, ex, ey } = useLocalSearchParams<{ id: string; via?: string; c?: string; ex?: string; ey?: string }>();
  const router = useRouter();
  const [interior, setInterior] = useState<Interior | null>(null);
  const [error, setError] = useState(false);
  const [revealDone, setRevealDone] = useState(false);
  const viaElevator = via === 'elevator';
  // entering via the elevator: skip the route's sideways slide so only the
  // DoorReveal plays (the slide + doors opening together looked awkward).
  const enterAnim: 'none' | 'default' = viaElevator ? 'none' : 'default';
  // elevator arrival can spawn the player at the floor's doorway (?ex&ey)
  const spawned = useMemo(() => {
    if (!interior) return null;
    const sx = Number(ex);
    const sy = Number(ey);
    return Number.isFinite(sx) && Number.isFinite(sy) && ex != null && ey != null
      ? { ...interior, playerStart: { x: sx, y: sy } }
      : interior;
  }, [interior, ex, ey]);

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
      <Stack.Screen options={{ headerShown: false, animation: enterAnim }} />
      {child}
    </View>
  );

  // When entered via the elevator, a closed DoorReveal overlay sits on top while
  // the map loads behind it, then slides apart to reveal the map.
  const reveal = viaElevator && !revealDone ? (
    <DoorReveal ready={!!interior || error} wall={typeof c === 'string' ? c : undefined} onDone={() => setRevealDone(true)} />
  ) : null;

  if (error) {
    return (
      <>
        {center(<Text style={{ fontFamily: fonts.body, fontSize: t.body, color: colors.text }}>맵을 불러오지 못했습니다.</Text>)}
        {reveal}
      </>
    );
  }
  if (!interior) {
    return (
      <>
        {center(<ActivityIndicator color={colors.ink} />)}
        {reveal}
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: enterAnim }} />
      <InteriorScreen
        interior={spawned ?? interior}
        onExit={() => router.back()}
        onEnterScenario={(h) => {
          if (h.kind === 'elevator' && h.building) router.push(`/elevator/${h.building}`);
          else if (h.scenarioId) router.push(`/scenario/${h.scenarioId}`);
        }}
      />
      {reveal}
    </>
  );
}
