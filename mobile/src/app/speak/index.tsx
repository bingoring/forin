// ScreenSpeakList (04_SCREENS ⑨ "11b") — where the 100+ sentences the player has
// said out loud are actually browsed. The handoff is explicit that this follows
// MOBILE patterns, not web ones: infinite scroll instead of pagination, a
// segmented sort instead of a ▾ dropdown, tappable department chips, and a soft
// count rather than page numbers.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { api, type SpeakSort, type SpokenSentence } from '@/api/client';
import { PixelIcon } from '@/components/PixelIcon';
import { Shadowed } from '@/components/campus/parts';
import { SpokenRow } from '@/components/speak/SpokenRow';
import { colors, fonts, fs } from '@/theme/tokens';
import { deptOf } from '@/data/speakBands';
import { PLACE_SCREEN } from '@/theme/transitions';
import { useT } from '@/i18n';

// The handoff pins the sticky header at 186 and starts the scroller at the same
// number, warning that a content-box header with padding silently grows past its
// declared height and paints over the first (highest-priority) row. In RN there
// is no content-box/border-box ambiguity — height already includes padding — but
// the two numbers must still be ONE number, so they are.
const HEADER_H = 186;
const PAGE = 20;

export default function SpeakList() {
  const t = useT();
  const router = useRouter();
  const params = useLocalSearchParams<{ sort?: string }>();
  const [sort, setSort] = useState<SpeakSort>(params.sort === 'weak' ? 'weak' : 'recent');
  const [dept, setDept] = useState<string>('');
  const [rows, setRows] = useState<SpokenSentence[]>([]);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  // `done` is what stops infinite scroll: the server answering with a short page
  // is the only honest end-of-list signal, since `total` counts sentences before
  // the department filter narrows them.
  const [done, setDone] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Sort changes reset the list rather than merging: page 2 of 최신 has nothing to
  // do with page 2 of 약한 순, and appending across a sort change interleaves two
  // orderings into one nonsensical list.
  const load = useCallback(async (nextSort: SpeakSort, offset: number) => {
    const page = await api.speakSentences({ sort: nextSort, limit: PAGE, offset });
    return page;
  }, []);

  const reload = useCallback((nextSort: SpeakSort) => {
    setState('loading');
    setDone(false);
    load(nextSort, 0)
      .then((page) => {
        setRows(page.sentences);
        setTotal(page.total);
        setDone(page.sentences.length < PAGE);
        setState('ok');
      })
      .catch(() => setState('error'));
  }, [load]);

  // A one-shot effect, NOT useFocusEffect: the list is a pushed screen, and
  // refetching every time it regains focus (returning from the practice screen)
  // would throw away the scroll position the user was reading from and every page
  // they had already pulled in. Deliberately not useMemo either — a side effect
  // inside useMemo is not guaranteed to run exactly once, least of all under the
  // React Compiler.
  useEffect(() => { reload(sort); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSort = (next: SpeakSort) => {
    if (next === sort) return;
    setSort(next);
    reload(next);
  };

  const loadMore = () => {
    if (done || loadingMore || state !== 'ok') return;
    setLoadingMore(true);
    load(sort, rows.length)
      .then((page) => {
        // Dedup by sentenceKey: a sentence re-scored between two page fetches
        // shifts position under 약한 순, and without this it would appear twice
        // (and crash FlatList's key invariant).
        setRows((prev) => {
          const seen = new Set(prev.map((r) => r.sentenceKey));
          return [...prev, ...page.sentences.filter((r) => !seen.has(r.sentenceKey))];
        });
        if (page.total > 0) setTotal(page.total);
        setDone(page.sentences.length < PAGE);
      })
      .catch(() => setDone(true)) // a failed page ends the scroll rather than looping on it
      .finally(() => setLoadingMore(false));
  };

  // Department chips are derived from what has actually loaded, so a chip never
  // offers a filter that yields nothing. Filtering is client-side on purpose:
  // the server paginates over sentences and a server-side dept filter would make
  // `total` and the page arithmetic disagree.
  const depts = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) { const d = deptOf(r); if (d) set.add(d); }
    return Array.from(set).sort();
  }, [rows]);
  const shown = dept ? rows.filter((r) => deptOf(r) === dept) : rows;

  const practise = (s: SpokenSentence) => {
    // One single template literal — expo-router's typed-routes generator matches
    // statically against one backtick expression.
    router.push(
      `/pronunciation/${encodeURIComponent(s.referenceText.slice(0, 40))}?referenceText=${encodeURIComponent(s.referenceText)}&origin=review&scenarioId=${encodeURIComponent(s.scenarioId ?? '')}`
    );
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={PLACE_SCREEN} />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
            <PixelIcon name="chevron-left" color={colors.ink} size={14} sw={2.2} />
          </Pressable>
          <Text style={styles.title}>{t('speak.listTitle')}</Text>
        </View>

        {/* Segmented sort — two halves of one control, not a dropdown. */}
        <Shadowed offset={2} style={styles.segmentWrap}>
          <View style={styles.segment}>
            {(['weak', 'recent'] as SpeakSort[]).map((s) => (
              <Pressable key={s} onPress={() => onSort(s)} style={[styles.segHalf, sort === s && styles.segActive]}>
                <Text style={[styles.segText, sort === s && styles.segTextActive]}>
                  {t(s === 'weak' ? 'speak.sortWeak' : 'speak.sortRecent')}
                </Text>
              </Pressable>
            ))}
          </View>
        </Shadowed>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['', ...depts]}
          keyExtractor={(d) => d || 'ALL'}
          contentContainerStyle={styles.chipRow}
          renderItem={({ item }) => {
            const active = dept === item;
            return (
              <Pressable onPress={() => setDept(item)}>
                <View style={[styles.chip, active && styles.chipActive]}>
                  {active && <PixelIcon name="check" color={colors.ink} size={9} sw={2.2} />}
                  <Text style={styles.chipText}>{item || t('speak.allDepts')}</Text>
                </View>
              </Pressable>
            );
          }}
        />

        <Text style={styles.count}>{t('speak.shown', { shown: shown.length, total })}</Text>
      </View>

      {state === 'loading' ? (
        <View style={styles.center}><ActivityIndicator color={colors.ink} /></View>
      ) : state === 'error' ? (
        <View style={styles.center}>
          <Text style={styles.emptyHint}>{t('speak.listEmptyHint')}</Text>
        </View>
      ) : (
        <FlatList
          data={shown}
          keyExtractor={(r) => r.sentenceKey}
          style={styles.scroller}
          contentContainerStyle={styles.listBody}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => (
            <SpokenRow sentence={item} onPractise={practise} divider={index < shown.length - 1} />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <PixelIcon name="mic" color={colors.textFaint} size={36} sw={1.5} />
              <Text style={styles.emptyTitle}>{t('speak.listEmpty')}</Text>
              <Text style={styles.emptyHint}>{t('speak.listEmptyHint')}</Text>
            </View>
          }
          ListFooterComponent={
            // Three pips + 불러오는 중… , exactly as the handoff describes the
            // end of an infinite-scroll list. Absent once the list is complete.
            !done ? (
              <View style={styles.footer}>
                <View style={styles.pips}>
                  {[0, 1, 2].map((i) => <View key={i} style={styles.pip} />)}
                </View>
                <Text style={styles.footerText}>{t('speak.loading')}</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    height: HEADER_H,
    paddingTop: 52,
    paddingHorizontal: 14,
    backgroundColor: colors.cream,
    borderBottomWidth: 3,
    borderBottomColor: colors.ink,
    gap: 8,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  back: { padding: 4 },
  title: { fontFamily: fonts.heading, fontSize: fs(16), color: colors.ink },
  segmentWrap: { alignSelf: 'flex-start' },
  segment: { flexDirection: 'row', borderWidth: 2.5, borderColor: colors.ink, backgroundColor: '#fff' },
  segHalf: { paddingVertical: 5, paddingHorizontal: 14 },
  segActive: { backgroundColor: colors.yellow },
  segText: { fontFamily: fonts.heading, fontSize: fs(11), color: colors.textSoft },
  segTextActive: { color: colors.ink },
  chipRow: { gap: 6, paddingVertical: 2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  chipActive: { backgroundColor: colors.mint },
  chipText: { fontFamily: fonts.heading, fontSize: fs(10), color: colors.ink },
  count: { fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft },
  scroller: { flex: 1 },
  listBody: { paddingBottom: 40 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 8, paddingHorizontal: 24 },
  emptyTitle: { fontFamily: fonts.heading, fontSize: fs(12), color: colors.ink },
  emptyHint: { fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, textAlign: 'center', lineHeight: 17 },
  footer: { alignItems: 'center', paddingVertical: 18, gap: 6 },
  pips: { flexDirection: 'row', gap: 4 },
  pip: { width: 6, height: 6, backgroundColor: colors.ink + '55' },
  footerText: { fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft },
});
