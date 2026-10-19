// 쉬는 시간 미니게임 허브 (v38 GameHub).
//
// Break-time casual games, unrelated to nursing. v48: a 2×2 tile grid (big tilted icon circle,
// 🏆 best score in mono, Go), today's remaining plays as yellow dots, 준비 중 games as Locked
// chips with no copy. The weekly colleague ranking / challenge pager is a server feature that
// does not exist yet, so it is not drawn (nothing nobody earned).
import { useState } from 'react';
import { Stack, useRouter, type Href } from 'expo-router';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { Go, Locked } from '@/components/nb/V48';
import { useV48Press } from '@/components/nb/nbMotion';
import { NbButton, NbPaper, NbSheet, nbText } from '@/components/nb/NbUI';
import { TOP_INSET, nb } from '@/theme/nb';
import {
  AD_PLAYS_GRANT, canGrantPlays, grantPlaysFromAd, playAllowance, playsLeft, startPlay,
  useBestScore, usePlaysToday,
} from '@/lib/gameScores';
import { useT } from '@/i18n';

// nameKey, not t(...): the array is evaluated once at import (see i18n/module-scope.test.ts),
// so the strings must be keys resolved in render.
// v48 휴게실: 2×2 타일(앱에 있는 게임) + 준비 중 Locked 칩(글 없음). `ball`은 농구 전용 그림.
const GAMES: { id: string; icon?: NbIconName; ball?: boolean; nameKey: string; bg: string; rot: number; route: Href }[] = [
  { id: 'circle', icon: 'pencil', nameKey: 'games.circle', bg: 'rgba(168,217,195,.4)', rot: -5, route: '/games/circle' },
  { id: 'hoops', ball: true, nameKey: 'games.hoops', bg: 'rgba(233,150,100,.3)', rot: -3, route: '/games/hoops' },
];
const LOCKED: NbIconName[] = ['plane', 'pencil'];

function Ball({ s }: { s: number }) {
  return (
    <Svg viewBox="0 0 24 24" width={s} height={s}>
      <Circle cx={12} cy={12} r={8.5} fill="rgba(233,150,100,.55)" stroke={nb.ink} strokeWidth={1.7} />
      <Path d="M3.5 12 H20.5 M12 3.5 V20.5 M6 6 Q12 12 6 18 M18 6 Q12 12 18 18" fill="none" stroke={nb.ink} strokeWidth={1.4} />
    </Svg>
  );
}

export default function GameHub() {
  const t = useT();
  const router = useRouter();
  usePlaysToday(); // subscribe: re-render when a play is used
  const left = playsLeft();
  const allowance = playAllowance();
  // 점은 많아야 5개 — 하루 20판(+광고 보너스)을 점으로 다 그리면 머리줄을 넘친다. 5칸을 남은 비율만큼 채우고
  // 정확한 수는 접근성 라벨에 둔다. 판이 하나라도 남으면 점 하나는 켠다.
  const dotSlots = Math.min(allowance, 5);
  const dotsOn = allowance <= 5 ? left : left > 0 ? Math.max(1, Math.round((left / allowance) * dotSlots)) : 0;
  const [adBusy, setAdBusy] = useState(false);

  // Rewarded-ad stub: the real SDK (react-native-google-mobile-ads) needs a dev build, so
  // in Expo Go this simulates a short ad view. Swap for the SDK in production (see board.tsx).
  const watchAdForPlays = async () => {
    if (adBusy || !canGrantPlays()) return;
    setAdBusy(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 1600));
    grantPlaysFromAd();
    setAdBusy(false);
  };

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
        <View testID="games-plays-dots" accessibilityLabel={`${left}/${allowance}`} style={{ flexDirection: 'row', gap: 5 }}>
          {Array.from({ length: dotSlots }).map((_, i) => (
            <View key={i} testID={i < dotsOn ? 'games-dot-on' : 'games-dot-off'}
              style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 1.6, borderColor: nb.ink, backgroundColor: i < dotsOn ? nb.marker : 'transparent', transform: [{ rotate: `${i * 8 - 8}deg` }] }} />
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={{ paddingTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {GAMES.map((g, i) => (
            <GameTile key={g.id} game={g} index={i} canPlay={left > 0}
              onStart={() => { startPlay(); router.push(g.route); }} />
          ))}
        </View>
        {/* 준비 중 — 흐린 칩 + 자물쇠, 글 없이 */}
        <View style={{ flexDirection: 'row', gap: 10, paddingTop: 14, paddingHorizontal: 2 }}>
          {LOCKED.map((ic) => <Locked key={ic} size={38} icon={ic} />)}
        </View>

        {/* Out of plays → offer a rewarded ad for more, until today's ad cap is reached. */}
        {left <= 0 && (
          <NbPaper rot={-0.4} tape style={{ marginTop: 15, padding: 14, alignItems: 'center', backgroundColor: 'rgba(249,227,123,.18)' }}>
            <Text style={nbText.hand(15)}>{t('games.outOfPlays')}</Text>
            {canGrantPlays() ? (
              <View style={{ marginTop: 10 }}>
                <NbButton variant="ink" size="md" icon="speaker" disabled={adBusy} onPress={() => void watchAdForPlays()}>
                  {adBusy ? t('games.adPlaying') : t('games.watchAdForPlays', { n: AD_PLAYS_GRANT })}
                </NbButton>
              </View>
            ) : (
              <Text style={[nbText.body(11, nb.soft), { marginTop: 6 }]}>{t('games.adCapReached')}</Text>
            )}
          </NbPaper>
        )}

      </ScrollView>
    </NbSheet>
  );
}

function GameTile({ game, index, canPlay, onStart }: {
  game: (typeof GAMES)[number];
  index: number;
  canPlay: boolean;
  onStart: () => void;
}) {
  const t = useT();
  const best = useBestScore(game.id);
  const press = useV48Press('press', index % 2 ? 0.8 : -0.8);
  return (
    <Pressable onPress={onStart} onPressIn={press.onPressIn} onPressOut={press.onPressOut} disabled={!canPlay}
      accessibilityRole="button" accessibilityLabel={t(game.nameKey)} testID={`games-tile-${game.id}`}
      style={{ width: '48%', flexGrow: 1, flexBasis: '45%', opacity: canPlay ? 1 : 0.55 }}>
      <Animated.View style={{ transform: press.transform }}>
        <View pointerEvents="none" style={{ position: 'absolute', left: 2, right: -2, top: 3, bottom: -3, borderRadius: 8, backgroundColor: 'rgba(62,54,43,.22)' }} />
        <View style={{ backgroundColor: game.bg, borderWidth: 1.6, borderColor: nb.ink, borderRadius: 8, paddingTop: 16, paddingBottom: 12, paddingHorizontal: 12 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: nb.paper, borderWidth: 1.8, borderColor: nb.ink, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', transform: [{ rotate: `${game.rot}deg` }] }}>
            {game.ball ? <Ball s={38} /> : <NbIcon name={game.icon!} size={36} />}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            {best != null ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <NbIcon name="trophy" size={15} />
                <Text style={nbText.mono(13, nb.ink)}>{best}</Text>
              </View>
            ) : (
              <View testID="games-new-dot" style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: nb.red }} />
            )}
            <View style={{ flex: 1 }} />
            <Go size={38} onPress={canPlay ? onStart : undefined} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
