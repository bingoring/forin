// Every sentence the learner has said out loud (04_SCREENS ⑨ "11b").
//
// Mobile patterns, per the handoff: infinite scroll rather than pagination, a
// segmented sort rather than a ▾ dropdown, tappable department chips.
//
// Three things here deliberately differ from the handoff's prose, all for the same
// reason — the prose describes a web mock and the mock's mechanics do not survive the
// port:
//
//  1. No `height: 186` header. The handoff pins that number to work around a CSS
//     content-box bug (a header with padding growing past its declared height and
//     painting over the first row); RN has no such bug, and a fixed 186 spent a
//     quarter of the screen on a title, a segment and a chip row. The header sizes to
//     its content and the list gets the rest.
//  2. No `⚙ 필터 N` sheet. The handoff wants one for "compound conditions"; the only
//     axis this list has is department, and the chip row IS that filter. A sheet
//     wrapping one axis, sitting directly under the chips that already do it, is
//     indirection — two ways to set one thing, which then have to agree.
//  3. Filtering happens on the SERVER. Client-side filtering made the count line
//     lie ("3 of 128" for "3 matched among the pages loaded so far") and pulled more
//     matches in as the learner scrolled, which reads as the filter being broken.
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { api, type SpeakSort, type SpokenSentence } from '@/api/client';
import { PixelIcon } from '@/components/PixelIcon';
import { Shadowed } from '@/components/campus/parts';
import { SpokenRow } from '@/components/speak/SpokenRow';
import { colors, fonts, fs } from '@/theme/tokens';
import { PLACE_SCREEN } from '@/theme/transitions';
import { useT } from '@/i18n';

const PAGE = 20;

export default function SpeakList() {
  const t = useT();
  const router = useRouter();
  const params = useLocalSearchParams<{ sort?: string }>();
  const [sort, setSort] = useState<SpeakSort>(params.sort === 'weak' ? 'weak' : 'recent');
  const [dept, setDept] = useState('');
  const [rows, setRows] = useState<SpokenSentence[]>([]);
  const [total, setTotal] = useState(0);
  // Every department the learner has spoken in, from the server. Held across reloads
  // so the chip row does not flicker empty while a filtered page is in flight.
  const [depts, setDepts] = useState<string[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  // `done` is what stops infinite scroll: a short page is the honest end-of-list
  // signal, and the only one that survives the total changing under a filter.
  const [done, setDone] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  /** Reloads from the top. Sort and filter both come through here: page 2 of one
   *  ordering has nothing to do with page 2 of another, and appending across a change
   *  interleaves two lists into one that means nothing. */
  const reload = useCallback((nextSort: SpeakSort, nextDept: string) => {
    setState('loading');
    setDone(false);
    api.speakSentences({ sort: nextSort, dept: nextDept, limit: PAGE, offset: 0 })
      .then((page) => {
        setRows(page.sentences);
        setTotal(page.total);
        if (page.depts.length > 0) setDepts(page.depts);
        setDone(page.sentences.length < PAGE);
        setState('ok');
      })
      .catch(() => setState('error'));
  }, []);

  // One-shot, NOT useFocusEffect: this is a pushed screen, and refetching every time
  // it regains focus (returning from the practice screen) would throw away the pages
  // already pulled in and the scroll position they were being read at.
  useEffect(() => { reload(sort, dept); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSort = (next: SpeakSort) => { if (next !== sort) { setSort(next); reload(next, dept); } };
  const onDept = (next: string) => { if (next !== dept) { setDept(next); reload(sort, next); } };

  const loadMore = () => {
    if (done || loadingMore || state !== 'ok') return;
    setLoadingMore(true);
    api.speakSentences({ sort, dept, limit: PAGE, offset: rows.length })
      .then((page) => {
        // Dedup by sentenceKey: under 약한 순 a sentence re-scored between two fetches
        // shifts position, and a duplicate breaks FlatList's key invariant as well as
        // showing the row twice.
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
          <Text style={styles.title}>{t('list.speakTitle')}</Text>
        </View>

        {/* Segmented sort — two halves of one control, not a dropdown. */}
        <Shadowed offset={2} style={styles.segmentWrap}>
          <View style={styles.segment}>
            {(['weak', 'recent'] as SpeakSort[]).map((s) => (
              <Pressable key={s} onPress={() => onSort(s)} style={[styles.segHalf, sort === s && styles.segActive]}>
                <Text style={[styles.segText, sort === s && styles.segTextActive]}>
                  {t(s === 'weak' ? 'list.sortWeak' : 'list.sortRecent')}
                </Text>
              </Pressable>
            ))}
          </View>
        </Shadowed>

        {/* Only when there is a choice to make: one department is not a filter. */}
        {depts.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {['', ...depts].map((d) => {
              const active = dept === d;
              return (
                <Pressable key={d || 'ALL'} onPress={() => onDept(d)}>
                  <View style={[styles.chip, active && styles.chipActive]}>
                    {active && <PixelIcon name="check" color={colors.ink} size={11} sw={2.2} />}
                    <Text style={styles.chipText}>{d || t('list.allDepts')}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* Says what it means: `total` is what matches the current filter, so once
            everything is loaded the "중 N개 표시" half would read "128 of 128". */}
        {state === 'ok' && total > 0 && (
          <Text style={styles.count}>
            {done ? t('list.countAll', { total }) : t('list.countPartial', { shown: rows.length, total })}
          </Text>
        )}
      </View>

      {state === 'loading' ? (
        <View style={styles.center}><ActivityIndicator color={colors.ink} /></View>
      ) : state === 'error' ? (
        <View style={styles.center}>
          <PixelIcon name="alert" color={colors.textFaint} size={30} sw={1.6} />
          <Text style={styles.emptyHint}>{t('list.loadFailed')}</Text>
          <Pressable onPress={() => reload(sort, dept)} hitSlop={8}>
            <View style={styles.retry}><Text style={styles.retryText}>{t('list.retry')}</Text></View>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(r) => r.sentenceKey}
          style={styles.scroller}
          contentContainerStyle={styles.listBody}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => (
            <SpokenRow sentence={item} onPractise={practise} divider={index < rows.length - 1} />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <PixelIcon name="mic" color={colors.textFaint} size={36} sw={1.5} />
              <Text style={styles.emptyTitle}>{dept ? t('list.emptyInDept', { dept }) : t('speak.listEmpty')}</Text>
              <Text style={styles.emptyHint}>{dept ? t('list.emptyInDeptHint') : t('speak.listEmptyHint')}</Text>
            </View>
          }
          ListFooterComponent={
            // Three pips + 불러오는 중… , the handoff's end-of-infinite-scroll
            // indicator. Absent once the list is complete — a spinner that never
            // resolves is how a finished list looks broken.
            !done && rows.length > 0 ? (
              <View style={styles.footer}>
                <View style={styles.pips}>{[0, 1, 2].map((i) => <View key={i} style={styles.pip} />)}</View>
                <Text style={styles.footerText}>{t('list.loading')}</Text>
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
    // No fixed height: it sizes to what it holds, so the chip row can be absent
    // without leaving a gap and present without clipping. 52 is the app's own
    // status-bar inset, used by every other screen here.
    paddingTop: 52,
    paddingBottom: 9,
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
  chipRow: { gap: 6, paddingVertical: 2, paddingRight: 14 },
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
  retry: { borderWidth: 2, borderColor: colors.ink, backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 14, marginTop: 4 },
  retryText: { fontFamily: fonts.heading, fontSize: fs(11), color: colors.ink },
  footer: { alignItems: 'center', paddingVertical: 18, gap: 6 },
  pips: { flexDirection: 'row', gap: 4 },
  pip: { width: 6, height: 6, backgroundColor: colors.ink + '55' },
  footerText: { fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft },
});
