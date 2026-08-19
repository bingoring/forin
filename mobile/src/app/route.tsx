// 메인 루트 (main-route curriculum) — the guided progression path. A vertical
// stepper of event nodes from the server (GET /me/route): completed ✓, the
// current available node (play icon; tap → scenario briefing), and locked nodes gated
// by prerequisites. Nodes whose scenario isn't authored yet show 준비 중.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { api, type RouteNode } from '@/api/client';
import { PixelIcon, type IconName } from '@/components/PixelIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { t, useLocale } from '@/i18n';

const C = colors.ink;

export default function Route() {
  const router = useRouter();
  const [nodes, setNodes] = useState<RouteNode[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      api.mainRoute()
        .then((n) => { if (alive) { setNodes(n); setState('ok'); } })
        .catch(() => { if (alive) setState('error'); });
      return () => { alive = false; };
    }, []),
  );

  const done = nodes.filter((n) => n.state === 'completed').length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack.Screen options={{ headerShown: false, animation: 'slide_from_right' }} />
      <View style={{ paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <PixelButton label={t('common.back')} bg="#fff" shadowColor={C} offset={2} fontSize={11} borderWidth={2} paddingV={4} paddingH={10} onPress={() => router.back()} />
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>메인 루트</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, width: 44, textAlign: 'right' }}>{done}/{nodes.length}</Text>
      </View>

      {state === 'loading' && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C} /></View>}
      {state === 'error' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(13), color: colors.textSoft }}>루트를 불러오지 못했어요.</Text>
          <PixelButton label={t('common.back')} onPress={() => router.back()} />
        </View>
      )}

      {state === 'ok' && (
        <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 40 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(20), color: C, lineHeight: 28 }}>커리큘럼 여정</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft, marginTop: 6, marginBottom: 18 }}>단계를 하나씩 클리어하면 다음 현장이 열려요.</Text>

          {nodes.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40, gap: 8 }}>
              <PixelIcon name="map" color={colors.textFaint} size={40} sw={1.5} />
              <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft, textAlign: 'center' }}>아직 열린 루트가 없어요.</Text>
            </View>
          ) : (
            nodes.map((n, i) => <RouteStep key={n.eventId} node={n} last={i === nodes.length - 1} onPress={() => n.scenarioId && router.push(`/scenario/${n.scenarioId}`)} />)
          )}
        </ScrollView>
      )}
    </View>
  );
}

function RouteStep({ node, last, onPress }: { node: RouteNode; last: boolean; onPress: () => void }) {
  const completed = node.state === 'completed';
  const available = node.state === 'available';
  const noScenario = available && !node.scenarioId; // graph node authored ahead of its content
  const tappable = available && !!node.scenarioId;

  const dotBg = completed ? colors.mint : available ? colors.yellow : '#fff';
  const icon: IconName = completed ? 'check' : available ? 'play' : 'lock';
  const cardBg = completed ? '#fff' : available ? colors.paper : colors.cream;

  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {/* rail: node dot + connector */}
      <View style={{ alignItems: 'center', width: 34 }}>
        <Shadowed offset={available ? 3 : 0} shadowColor={colors.yellowShadow}>
          <View style={{ width: 34, height: 34, borderWidth: 2.5, borderColor: C, backgroundColor: dotBg, alignItems: 'center', justifyContent: 'center' }}>
            <PixelIcon name={icon} color={C} size={16} sw={1.9} />
          </View>
        </Shadowed>
        {!last && <View style={{ flex: 1, width: 3, backgroundColor: completed ? colors.mint : '#2A252233', marginVertical: 4, minHeight: 24 }} />}
      </View>

      {/* card */}
      <Pressable onPress={onPress} disabled={!tappable} style={{ flex: 1, marginBottom: 14 }}>
        <Shadowed offset={available ? 4 : 2} shadowColor={available ? C : C + '33'}>
          <View style={{ backgroundColor: cardBg, borderWidth: available ? 3 : 2, borderColor: C, padding: 13, opacity: node.state === 'locked' ? 0.6 : 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <View style={{ backgroundColor: colors.lilac, borderWidth: 1.5, borderColor: C, paddingVertical: 1, paddingHorizontal: 5 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C }}>TIER {node.tier}</Text>
              </View>
              {completed && <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.mintShadow }}>✓ 완료</Text>}
              {available && !noScenario && <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.yellowShadow }}>● 지금 도전</Text>}
              {noScenario && <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft }}>준비 중</Text>}
              {node.state === 'locked' && <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft }}>잠김</Text>}
            </View>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: C }}>{node.title}</Text>
            {node.state === 'locked' && <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 3 }}>이전 단계를 완료하면 열려요.</Text>}
            {noScenario && <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 3 }}>곧 새로운 시나리오가 추가돼요.</Text>}
          </View>
        </Shadowed>
      </Pressable>
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
