// 캠퍼스 홈 (tab 1) — the service home, built around the main-route curriculum.
// Greets the player with their rank, leads with a "이어하기" hero for the next
// curriculum step (→ scenario briefing), then offers the campus map, quick dept
// entry, and a situation-board teaser. The full tile-walk campus lives behind
// "캠퍼스 둘러보기" (the 2-5 explore engine); this hub frames the journey.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { PixelChip } from '@/components/PixelChip';
import { api, type RouteNode, type Progress } from '@/api/client';
import { careerFor } from '@/data/economy';
import { colors, fonts, space } from '@/theme/tokens';

const C = colors.ink;

const CLINICS = [
  { label: '내과', id: 'CLINIC-IM-00001', bg: colors.mint, shadow: colors.mintShadow },
  { label: '외과', id: 'CLINIC-GS-00001', bg: colors.blue, shadow: colors.text },
  { label: '정형외과', id: 'CLINIC-OS-00001', bg: colors.peachDeep, shadow: colors.peachShadow },
  { label: '피부과', id: 'CLINIC-DM-00001', bg: colors.pink, shadow: colors.text },
];

export default function Campus() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [nodes, setNodes] = useState<RouteNode[]>([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      Promise.all([api.progress().catch(() => null), api.mainRoute().catch(() => [] as RouteNode[])])
        .then(([p, n]) => { if (alive) { setProgress(p); setNodes(n); setLoaded(true); } });
      return () => { alive = false; };
    }, []),
  );

  const done = nodes.filter((n) => n.state === 'completed').length;
  const next = nodes.find((n) => n.state === 'available');
  const allDone = loaded && nodes.length > 0 && done === nodes.length;
  const rank = progress ? careerFor(progress.level).label : '';

  const startNext = () => {
    if (next?.scenarioId) router.push(`/scenario/${next.scenarioId}`);
    else router.push('/route');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 56, paddingBottom: 40, gap: space.md }}>
        {/* greeting */}
        <View>
          <Text style={{ fontFamily: fonts.heading, fontSize: 22, color: C }}>캠퍼스</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textSoft }}>forin 병원에 오신 걸 환영해요</Text>
            {!!rank && <PixelChip label={`Lv.${progress!.level} · ${rank}`} bg={colors.yellow} />}
          </View>
        </View>

        {/* ── curriculum hero: continue the main route ── */}
        <Pressable onPress={startNext} disabled={!loaded}>
          <Shadowed offset={5} shadowColor={colors.mintShadow}>
            <View style={{ backgroundColor: colors.mint, borderWidth: 3, borderColor: C, padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C, opacity: 0.7 }}>🧭 메인 루트 · 커리큘럼</Text>
                {nodes.length > 0 && <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C, opacity: 0.7 }}>{done} / {nodes.length} 완료</Text>}
              </View>

              {!loaded ? (
                <View style={{ paddingVertical: 18, alignItems: 'center' }}><ActivityIndicator color={C} /></View>
              ) : allDone ? (
                <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: C, marginTop: 8, lineHeight: 26 }}>커리큘럼을 모두 마쳤어요! 🎉</Text>
              ) : next ? (
                <>
                  <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C, marginTop: 8, opacity: 0.8 }}>TIER {next.tier} · 다음 단계</Text>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 19, color: C, marginTop: 3, lineHeight: 26 }}>{next.title}</Text>
                  <View style={{ marginTop: 12 }}>
                    <PixelButton label={next.scenarioId ? '▶  이어서 도전하기' : '🗺  루트 보기'} bg={colors.yellow} shadowColor={colors.yellowShadow} full onPress={startNext} />
                  </View>
                </>
              ) : (
                <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: C, marginTop: 8, lineHeight: 24 }}>곧 새로운 여정이 열려요</Text>
              )}

              {/* progress bar */}
              {nodes.length > 0 && (
                <View style={{ height: 8, backgroundColor: '#fff', borderWidth: 2, borderColor: C, marginTop: 12 }}>
                  <View style={{ width: `${(done / nodes.length) * 100}%`, height: '100%', backgroundColor: colors.yellow }} />
                </View>
              )}
              <Text style={{ position: 'absolute', top: -8, right: -2, fontSize: 22, transform: [{ rotate: '10deg' }] }}>🧭</Text>
            </View>
          </Shadowed>
        </Pressable>

        <Pressable onPress={() => router.push('/route')} style={{ alignSelf: 'flex-end' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: colors.textSoft }}>전체 여정 보기 ›</Text>
        </Pressable>

        {/* campus map (the tile explore engine) */}
        <PixelButton label="🗺  캠퍼스 둘러보기" bg="#fff" shadowColor={C} full onPress={() => router.push('/interior/CAMPUS-00001')} />

        {/* quick entry */}
        <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: colors.textSoft, marginTop: 4 }}>빠른 입장</Text>
        <PixelButton label="🚑  응급실 (ER)" bg={colors.peach} shadowColor={colors.peachShadow} full onPress={() => router.push('/interior/INT-ER-00001')} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {CLINICS.map((c) => (
            <View key={c.id} style={{ width: '47.5%' }}>
              <PixelButton label={c.label} bg={c.bg} shadowColor={c.shadow} full onPress={() => router.push(`/interior/${c.id}`)} />
            </View>
          ))}
        </View>

        {/* situation-board teaser */}
        <Pressable onPress={() => router.push('/board')}>
          <Shadowed offset={3}>
            <View style={{ backgroundColor: colors.lilac, borderWidth: 3, borderColor: C, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 24 }}>📋</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>오늘의 상황판</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.text, marginTop: 2 }}>부서별로 발생한 오늘의 현장 상황을 확인해요.</Text>
              </View>
              <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: C }}>▶</Text>
            </View>
          </Shadowed>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Shadowed({ children, offset = 4, shadowColor = C, style }: { children: React.ReactNode; offset?: number; shadowColor?: string; style?: object }) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}
