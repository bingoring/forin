// 쉬는 시간 미니게임 허브 (v38 GameHub).
//
// Break-time casual games, unrelated to nursing. The weekly colleague ranking and the
// challenge system are a server feature and ship later; this is the local hub — a grid of
// games with a per-day play limit and per-game best score. Only 완벽한 원 is playable so
// far; the others are marked 준비 중 until they are built.
import { Stack, useRouter, type Href } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbButton, NbMemo, NbPaper, NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { TOP_INSET, nb } from '@/theme/nb';
import { MAX_PLAYS_PER_DAY, playsLeft, startPlay, useBestScore, usePlaysToday } from '@/lib/gameScores';
import { useT } from '@/i18n';

// labelKey/subKey, not t(...): the array is evaluated once at import (see
// i18n/module-scope.test.ts), so the strings must be keys resolved in render.
const GAMES: { id: string; icon: NbIconName; nameKey: string; subKey: string; bg: string; route?: Href }[] = [
  { id: 'plane', icon: 'plane', nameKey: 'games.plane', subKey: 'games.planeSub', bg: 'rgba(169,203,227,.28)' },
  { id: 'penCap', icon: 'bell', nameKey: 'games.penCap', subKey: 'games.penCapSub', bg: 'rgba(233,196,90,.2)' },
  { id: 'circle', icon: 'pencil', nameKey: 'games.circle', subKey: 'games.circleSub', bg: 'rgba(168,217,195,.28)', route: '/games/circle' },
  { id: 'runner', icon: 'compass', nameKey: 'games.runner', subKey: 'games.runnerSub', bg: 'rgba(201,162,39,.16)' },
];

export default function GameHub() {
  const t = useT();
  const router = useRouter();
  const plays = usePlaysToday();
  const left = playsLeft();

  return (
    <NbSheet>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 4 }}>
        <Pressable onPress={() => router.back()}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <Text style={nbText.hand(24)}>{t('games.title')}</Text>
        <View style={{ flex: 1 }} />
        <NbTag color={nb.blue} rot={2}>{t('games.playsToday', { n: plays, max: MAX_PLAYS_PER_DAY })}</NbTag>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text style={[nbText.body(11, nb.soft), { marginTop: 4 }]}>{t('games.sub')}</Text>

        {GAMES.map((g, i) => (
          <GameRow key={g.id} game={g} index={i} canPlay={!!g.route && left > 0}
            onStart={() => { if (!g.route) return; startPlay(); router.push(g.route); }} />
        ))}

        <NbMemo rot={0.3} style={{ marginTop: 15 }}>{t('games.rankingSoon')}</NbMemo>
        <NbMemo rot={-0.3} color={nb.blue} style={{ marginTop: 11 }}>{t('games.noStudy')}</NbMemo>
      </ScrollView>
    </NbSheet>
  );
}

function GameRow({ game, index, canPlay, onStart }: {
  game: (typeof GAMES)[number];
  index: number;
  canPlay: boolean;
  onStart: () => void;
}) {
  const t = useT();
  const best = useBestScore(game.id);
  const ready = !!game.route;
  return (
    <NbPaper rot={index % 2 ? 0.5 : -0.5} style={{ marginTop: 13, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: game.bg }}>
      <View style={{ width: 44, height: 44, backgroundColor: nb.paper, borderWidth: 1.5, borderColor: nb.ink, borderRadius: 6, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: index % 2 ? '3deg' : '-3deg' }] }}>
        <NbIcon name={game.icon} size={26} />
      </View>
      <View style={{ minWidth: 0, flex: 1 }}>
        <Text style={nbText.hand(18)}>{t(game.nameKey)}</Text>
        <Text numberOfLines={2} style={[nbText.body(10, nb.soft), { marginTop: 2 }]}>{t(game.subKey)}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
        <Text style={nbText.mono(10, ready ? nb.soft : nb.red)}>
          {!ready ? t('games.soon') : best != null ? t('games.bestPoints', { score: best }) : t('games.new')}
        </Text>
        <View style={{ marginTop: 5 }}>
          <NbButton variant="ink" size="sm" disabled={!canPlay} onPress={onStart}>{t('games.start')}</NbButton>
        </View>
      </View>
    </NbPaper>
  );
}
