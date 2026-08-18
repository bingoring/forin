// Interior route: loads the tile map for {id} and hands it to the explore engine.
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '@/api/client';
import { colors, fonts, type as typeScale } from '@/theme/tokens';
import { InteriorScreen } from '@/map/InteriorScreen';
import { DoorReveal } from '@/map/DoorReveal';
import { FIXTURES } from '@/map/fixtures/er';
import type { Interior } from '@engine';

export default function InteriorRoute() {
  const { id, via, c, ex, ey, from, to, dept, dir } = useLocalSearchParams<{
    id: string; via?: string; c?: string; ex?: string; ey?: string;
    from?: string; to?: string; dept?: string; dir?: string;
  }>();
  const router = useRouter();
  const [interior, setInterior] = useState<Interior | null>(null);
  const [error, setError] = useState(false);
  const [revealDone, setRevealDone] = useState(false);
  // Doors open only once the world is actually laid out + drawn (InteriorScreen
  // .onReady), not merely once the data loaded — otherwise the map is revealed
  // mid-layout and visibly slides/pops into place.
  const [mapReady, setMapReady] = useState(false);
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
    setMapReady(false);
    // Bespoke dept interiors (ER/OR/ICU/Peds/…) are authored client-side and the
    // bundled FIXTURE is the source of truth — it is always complete and current.
    // Prefer it over the server: a running dev server can hold a STALE/partial
    // seed (older than the latest fixture), and since that returns 200 the old
    // server-first path accepted it → thresholds/reception silently missing on
    // some elevator entries. Use the fixture synchronously (also removes the
    // load race behind the elevator DoorReveal). Only non-bundled interiors hit
    // the server.
    const fixture = FIXTURES[id];
    if (fixture) {
      setInterior(fixture);
      return () => {
        alive = false;
      };
    }
    api
      .interior(id)
      .then((data) => alive && setInterior(data))
      .catch(() => {
        if (alive) setError(true);
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

  // When entered via the elevator, a closed cab-door overlay rides with a floor
  // ticker while the map loads AND fully renders behind it, then opens.
  const reveal = viaElevator && !revealDone ? (
    <DoorReveal
      ready={mapReady || error}
      wall={typeof c === 'string' && c ? (c.startsWith('#') ? c : `#${c}`) : undefined}
      fromFloor={typeof from === 'string' ? from : undefined}
      toFloor={typeof to === 'string' ? to : undefined}
      dept={typeof dept === 'string' ? dept : undefined}
      dir={dir === 'up' || dir === 'down' ? dir : undefined}
      onDone={() => setRevealDone(true)}
    />
  ) : null;

  if (error) {
    return (
      <>
        {center(<Text style={{ fontFamily: fonts.body, fontSize: typeScale.body, color: colors.text }}>맵을 불러오지 못했습니다.</Text>)}
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
        onReady={() => setMapReady(true)}
        onExit={() => router.back()}
        onEnterScenario={(h) => {
          if (h.kind === 'elevator' && h.building) router.push(`/elevator/${h.building}`);
          else if (h.kind === 'portal' && h.target) {
            // walk through an adjoining-dept door: push the target interior (so
            // 캠퍼스/back returns here), spawning at its doorway if given.
            const at = h.entry ? `?ex=${h.entry.x}&ey=${h.entry.y}` : '';
            router.push(`/interior/${h.target}${at}`);
          } else if (h.scenarioId) router.push(`/scenario/${h.scenarioId}`);
        }}
      />
      {reveal}
    </>
  );
}
