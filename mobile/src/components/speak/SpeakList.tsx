// Every sentence the learner has said out loud (04_SCREENS ⑨ "11b").
//
// Two controls, the learner's call: a sort dropdown and department chips. Search was
// here (v31) and is gone again — "검색도 누가 할까 싶으니 빼고": on one's own few-hundred
// spoken sentences a substring search earns its keep less than the two-tap filter the
// chips already are. The sort is an inline dropdown (낮은순 / 높은순 / 최신순), NOT a
// bottom sheet: for a three-way ordering the sheet sliding up from the bottom read as
// heavier than the choice, so the options drop down from the control itself.
//
// Two things here deliberately differ from the handoff's prose, both because the prose
// describes a web mock whose mechanics do not survive the port:
//
//  1. No `height: 186` header. The handoff pins that number to work around a CSS
//     content-box bug (a header with padding growing past its declared height and
//     painting over the first row); RN has no such bug, and a fixed 186 spent a
//     quarter of the screen on a title, a control and a chip row. The header sizes to
//     its content and the list gets the rest.
//  2. Filtering happens on the SERVER. A client-side department filter made the count
//     line lie ("3 of 128" for "3 matched among the pages loaded so far") and pulled
//     more matches in as the learner scrolled, which reads as the filter being broken.
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api, type SpeakSort, type SpokenSentence } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbChip, NbPaper, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { NbInlineSelect } from '@/components/nb/NbInlineSelect';
import { SpokenRow } from '@/components/speak/SpokenRow';
import { BandBar, type BandCounts } from '@/components/speak/BandBar';
import { useT } from '@/i18n';

const PAGE = 20;

/**
 * Nothing to show — and WHICH nothing.
 *
 * Telling a learner with 128 sentences that they have never spoken (the unfiltered
 * copy) is the worse of the two, so a department that filtered everything out says so
 * on its own terms rather than falling back to the never-spoken line.
 */
function EmptyState({ dept }: { dept: string }) {
  const t = useT();
  return (
    <View style={styles.center}>
      <NbIcon name="mic" size={34} color={nb.soft} />
      <Text style={styles.emptyTitle}>{dept ? t('list.emptyInDept', { dept }) : t('speak.listEmpty')}</Text>
      <Text style={styles.emptyHint}>{dept ? t('list.emptyInDeptHint') : t('speak.listEmptyHint')}</Text>
    </View>
  );
}

export function SpeakList({ embedded = false, above }: {
  /** True inside the review-lab tab: no screen chrome, and the header scrolls with the
   *  list instead of being pinned above it. */
  embedded?: boolean;
  /** Rendered at the very top of the scroll when embedded — the lab's screen title and
   *  its section tabs, so tapping a tab lands on the list itself rather than on a
   *  summary of it. */
  above?: React.ReactNode;
}) {
  const t = useT();
  const router = useRouter();
  const params = useLocalSearchParams<{ sort?: string }>();
  // A deep link may pin the ordering; anything else opens on 낮은순, the sentences that
  // most need the practice this list exists for.
  const [sort, setSort] = useState<SpeakSort>(
    params.sort === 'high' || params.sort === 'recent' ? params.sort : 'weak',
  );
  const [dept, setDept] = useState('');
  const [rows, setRows] = useState<SpokenSentence[]>([]);
  const [total, setTotal] = useState(0);
  // Every department the learner has spoken in, from the server. Held across reloads
  // so the chip row does not flicker empty while a filtered page is in flight.
  const [depts, setDepts] = useState<string[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  // The score-band distribution (60↓ / 60–79 / 80+) OF THE CURRENT FILTER. It rides on
  // the same response as the page, so picking a department re-reads the gauge as that
  // department's spread (v35) — and the bars and the list can never disagree, because
  // one request computed both. BandBar animates between two of these.
  const [dist, setDist] = useState<BandCounts>({ total: 0, low: 0, mid: 0, high: 0 });
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
        // The distribution of this filter — total is the filtered count, so it doubles
        // as the gauge's denominator and the list's "N문장" number.
        setDist({ total: page.total, low: page.low, mid: page.mid, high: page.high });
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
        // Dedup by sentenceKey: under 낮은순 a sentence re-scored between two fetches
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

  const sortOptions: { value: SpeakSort; label: string }[] = [
    { value: 'weak', label: t('list.sortWeak') },
    { value: 'high', label: t('list.sortHigh') },
    { value: 'recent', label: t('list.sortRecent') },
  ];

  const headerInner = (
    <>
        {/* Filter left, sort right, on ONE line — the v35 말하기 탭. The chips scroll
            within their half; the sort holds the right end where the handoff draws
            "점수 낮은순 ∨". When there is only one department there is nothing to filter,
            so a spacer keeps the sort where it always sits rather than letting it drift
            left. */}
        <View style={styles.controlRow}>
          {depts.length > 1 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroller} contentContainerStyle={styles.chipRow}>
              {['', ...depts].map((d, i) => (
                <NbChip key={d || 'ALL'} on={dept === d} rot={i % 2 ? 0.8 : -0.8} onPress={() => onDept(d)}>
                  {d || t('list.allDepts')}
                </NbChip>
              ))}
            </ScrollView>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          <NbInlineSelect title={t('list.sortTitle')} value={sort} options={sortOptions} onSelect={onSort} />
        </View>

        {/* The score distribution, UNDER the filter — and OF the filter: it animates to
            the selected chip's spread. Absent only before the first page lands. */}
        {dist.total > 0 && (
          <View style={{ marginTop: 4 }}>
            <BandBar counts={dist} />
          </View>
        )}

        {/* Says what it means: `total` is what matches the current filter, so once
            everything is loaded the "중 N개 표시" half would read "128 of 128". */}
        {state === 'ok' && total > 0 && (
          <Text numberOfLines={1} style={styles.count}>
            {done ? t('list.countAll', { total }) : t('list.countPartial', { shown: rows.length, total })}
          </Text>
        )}
    </>
  );

  // One list, two placements. On its own screen the header is PINNED above the list, as
  // it always was; inside the lab tab it rides in ListHeaderComponent so the section tabs
  // above it scroll away with it — nesting a FlatList in a ScrollView to get a shared
  // scroll would break virtualization, which is the whole reason that tab is fast.
  const list = (
    <>
      {state === 'loading' ? (
      <View style={styles.center}><ActivityIndicator color={nb.ink} /></View>
    ) : state === 'error' ? (
      <View style={styles.center}>
        <NbIcon name="bell" size={26} color={nb.red} />
        <Text style={styles.emptyHint}>{t('list.loadFailed')}</Text>
        <NbButton variant="paper" onPress={() => reload(sort, dept)}>{t('list.retry')}</NbButton>
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
        ListEmptyComponent={<EmptyState dept={dept} />}
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
    </>
  );

  if (embedded) {
    return (
      <View style={styles.embedded}>
        <FlatList
          data={rows}
          keyExtractor={(r) => r.sentenceKey}
          contentContainerStyle={styles.embeddedBody}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <View style={styles.embeddedHeader}>
              {above}
              {headerInner}
              {state === 'loading' && <ActivityIndicator color={nb.ink} style={{ marginTop: 24 }} />}
              {state === 'error' && (
                <View style={styles.center}>
                  <NbIcon name="bell" size={26} color={nb.red} />
                  <Text style={styles.emptyHint}>{t('list.loadFailed')}</Text>
                  <NbButton variant="paper" onPress={() => reload(sort, dept)}>{t('list.retry')}</NbButton>
                </View>
              )}
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={{ marginTop: 10 }}>
              <SpokenRow sentence={item} onPractise={practise} card rot={index % 2 ? 0.4 : -0.4} />
            </View>
          )}
          ListEmptyComponent={
            state === 'ok' ? <EmptyState dept={dept} /> : null
          }
          ListFooterComponent={
            !done && rows.length > 0 ? (
              <View style={styles.footer}>
                <View style={styles.pips}>{[0, 1, 2].map((i) => <View key={i} style={styles.pip} />)}</View>
                <Text style={styles.footerText}>{t('list.loading')}</Text>
              </View>
            ) : null
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Rules />
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <NbPaper rot={-1} style={styles.back}><NbIcon name="chevronLeft" size={16} /></NbPaper>
          </Pressable>
          <Text numberOfLines={1} style={[nbText.hand(26), { flex: 1, minWidth: 0 }]}>{t('list.speakTitle')}</Text>
        </View>
        {/* The same header as the embedded placement — one control set, not two that
            have to be kept in agreement. */}
        {headerInner}
      </View>
      {list}
    </View>
  );
}

/** The notebook's ruled lines, behind the pinned header — the list scrolls over them. */
function Rules() {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
      {Array.from({ length: 34 }).map((_, i) => (
        <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nb.cream },
  // Embedded: no status-bar inset of its own (the lab's header carries it) and no
  // pinned header, so the padding lives on the scroll content instead.
  embedded: { flex: 1, backgroundColor: nb.cream },
  embeddedBody: { paddingBottom: 40, paddingHorizontal: 20 },
  // TOP_INSET, not 4: this header IS the top of the screen in the review lab (the tab
  // renders the list itself), so it carries the status bar the way every other page does.
  // The port dropped it to 4 and both tabs slid under the notch.
  embeddedHeader: { paddingTop: TOP_INSET, paddingBottom: 9, gap: 9 },
  header: {
    // No fixed height: it sizes to what it holds, so the chip row can be absent without
    // leaving a gap and present without clipping. 52 is the app's own status-bar inset,
    // used by every other screen here.
    paddingTop: 52,
    paddingBottom: 9,
    paddingHorizontal: 20,
    gap: 9,
    // 1.5pt of paper edge rather than 3pt of ink: the header is the top of the same
    // sheet, not a bar bolted above it.
    borderBottomWidth: 1.5,
    borderBottomColor: nb.paperEdge,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  // Filter chips (left, scrolling) and the sort control (right) share one line — v35.
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chipScroller: { flex: 1 },
  chipRow: { gap: 7, paddingVertical: 2, paddingRight: 8, alignItems: 'center' },
  count: { fontFamily: nbFonts.mono, fontSize: 9.5, color: nb.soft },
  scroller: { flex: 1 },
  listBody: { paddingBottom: 40, paddingHorizontal: 20 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 9, paddingHorizontal: 24 },
  emptyTitle: { fontFamily: nbFonts.hand, fontSize: 17, color: nb.ink },
  emptyHint: { fontFamily: nbFonts.body, fontSize: 11, color: nb.soft, textAlign: 'center', lineHeight: 17 },
  footer: { alignItems: 'center', paddingVertical: 18, gap: 6 },
  pips: { flexDirection: 'row', gap: 4 },
  pip: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(62,54,43,.3)' },
  footerText: { fontFamily: nbFonts.hand, fontSize: 14, color: nb.soft },
});
