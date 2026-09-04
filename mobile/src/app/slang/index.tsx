// 병원 은어 도감 (v38 SlangDeck).
//
// One card drops per day — a US clinical abbreviation or benign hospital slang the textbook
// never taught. The deck is server content, so it grows without an app release. Collect
// today's card, and it joins the grid; 30 collected earns the '은어 마스터' recognition.
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbMemo, NbPaper, NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { api, type SlangDeck } from '@/api/client';
import { useT } from '@/i18n';

export default function SlangDeckScreen() {
  const t = useT();
  const router = useRouter();
  const [deck, setDeck] = useState<SlangDeck | null>(null);
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void api.slang().then((d) => { if (alive) setDeck(d); }).catch(() => {});
      return () => { alive = false; };
    }, []),
  );

  const collect = async () => {
    if (busy) return;
    setBusy(true);
    try { setDeck(await api.collectSlang()); } catch { /* best-effort */ } finally { setBusy(false); }
  };

  const today = deck?.todayCard;
  const listen = () => {
    if (!today) return;
    router.push({
      pathname: '/pronunciation/[sentenceKey]',
      params: { sentenceKey: (today.example || today.code).slice(0, 40), referenceText: today.example || today.code, origin: 'slang' },
    });
  };

  return (
    <NbSheet>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 2 }}>
        <Pressable onPress={() => router.back()}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={nbText.hand(22)}>{t('slang.title')}</Text>
          <Text numberOfLines={1} style={nbText.body(9.5, nb.soft)}>{t('slang.sub')}</Text>
        </View>
        {!!deck && <Text style={nbText.mono(12, nb.soft)}>{deck.collectedCount}/{deck.total}</Text>}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}>
        {/* 오늘의 카드 */}
        {today ? (
          <NbPaper rot={2} tape tapeLeft={150} style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <NbTag color={today.hidden ? nb.red : nb.blue} rot={-2}>{today.hidden ? t('slang.hiddenTag') : t('slang.todayCard')}</NbTag>
              <View style={{ flex: 1 }} />
              <Text style={nbText.mono(10, nb.soft)}>{t('slang.cardTag', { n: today.number })}</Text>
            </View>
            <Text style={{ fontFamily: nbFonts.mono, fontSize: 30, fontWeight: '700', color: nb.ink, marginTop: 12 }}>{today.code}</Text>
            <Text style={[nbText.hand(16.5), { marginTop: 5 }]}>{today.meaning}</Text>
            {!!today.example && (
              <View style={{ marginTop: 10, paddingVertical: 7, paddingHorizontal: 10, backgroundColor: 'rgba(74,111,165,.07)', borderWidth: 1.3, borderStyle: 'dashed', borderColor: nb.blue }}>
                <Text style={nbText.body(12.5)}>{today.example}</Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <NbButton variant="yellow" size="md" full icon="speaker" onPress={listen}>{t('slang.listen')}</NbButton>
              </View>
              {deck?.collectableToday
                ? <NbButton variant="paper" size="md" disabled={busy} onPress={collect}>{t('slang.collect')}</NbButton>
                : <NbButton variant="paper" size="md" disabled>{t('slang.collectedToday')}</NbButton>}
            </View>
          </NbPaper>
        ) : (
          <NbMemo rot={0.3}>{deck && deck.total > 0 ? t('slang.deckDone') : t('slang.empty')}</NbMemo>
        )}

        {/* 도감 그리드 */}
        <Text style={[nbText.hand(16), { marginTop: 18 }]}>{t('slang.collectedTitle')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 9 }}>
          {(deck?.collected ?? []).map((c, i) => (
            <NbPaper key={c.id} rot={i % 2 ? 0.8 : -0.8} style={{ width: '31%', paddingVertical: 9, paddingHorizontal: 6, alignItems: 'center' }}>
              <Text numberOfLines={1} style={nbText.mono(12.5, nb.ink)}>{c.code}</Text>
              <Text numberOfLines={1} style={[nbText.hand(11.5, nb.soft), { marginTop: 2 }]}>{c.meaning}</Text>
            </NbPaper>
          ))}
          {/* One "tomorrow" slot, when there is more to come. */}
          {!!deck && deck.collectedCount < deck.total && (
            <View style={{ width: '31%', paddingVertical: 9, paddingHorizontal: 6, alignItems: 'center', borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.25)' }}>
              <Text style={nbText.mono(12.5, 'rgba(62,54,43,.3)')}>?</Text>
              <Text style={[nbText.hand(11, nb.soft), { marginTop: 2 }]}>{t('slang.locked')}</Text>
            </View>
          )}
        </View>

        <NbMemo color={deck?.master ? nb.green : nb.soft} rot={-0.3} style={{ marginTop: 15 }}>
          {deck?.master ? t('slang.master') : t('slang.reward')}
        </NbMemo>
      </ScrollView>
    </NbSheet>
  );
}
