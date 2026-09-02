// ScreenModelAnswerList (04_SCREENS ⑨ "11c") — where every scenario the player
// has model answers for is actually browsed. Mobile patterns, explicitly not web
// ones: infinite scroll, a segmented sort (최신 / 개선 필요), toggle chips, and a
// bottom-sheet filter behind ⚙ 필터 N for compound conditions.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { api, type ModelAnswerGroup, type ModelAnswerSort } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbChip, NbIndexTabs, NbPaper, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { ModelAnswerGroupRow } from '@/components/model/ModelAnswerGroupRow';
import { colors, fonts, fs } from '@/theme/tokens';
import { useT } from '@/i18n';

const PAGE = 10;

/** Department code from a scenario id (SCN-ER-00002 → ER); '' when there is none. */
function deptOfScenario(id: string): string {
  const m = /^SCN-([A-Z0-9]+)-/.exec(id);
  return m ? m[1] : '';
}

export function ModelAnswerList({ embedded = false, above }: {
  /** True inside the review-lab tab: no screen chrome, and the header scrolls with the
   *  list instead of being pinned above it. */
  embedded?: boolean;
  /** Rendered at the very top of the scroll when embedded — the lab's screen title and
   *  section tabs, so tapping a tab lands on the list itself. */
  above?: React.ReactNode;
}) {
  const t = useT();
  const router = useRouter();
  const [sort, setSort] = useState<ModelAnswerSort>('recent');
  const [groups, setGroups] = useState<ModelAnswerGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [done, setDone] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  // Department filter, applied client-side. Lives in the sheet AND on the chip
  // row: the chips are the one-tap case, the sheet the compound one.
  const [depts, setDepts] = useState<string[]>([]);

  const reload = useCallback((nextSort: ModelAnswerSort) => {
    setState('loading');
    setDone(false);
    api.modelAnswers({ sort: nextSort, limit: PAGE, offset: 0 })
      .then((page) => {
        setGroups(page.groups);
        setTotal(page.total);
        setDone(page.groups.length < PAGE);
        // The first group opens by default so the screen shows a worked example
        // rather than a wall of collapsed titles.
        setOpen(page.groups[0]?.scenarioId ?? null);
        setState('ok');
      })
      .catch(() => setState('error'));
  }, []);

  // One-shot, NOT useFocusEffect: returning from anywhere must not discard the
  // pages already pulled in or the scroll position they were being read at.
  useEffect(() => { reload(sort); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSort = (next: ModelAnswerSort) => {
    if (next === sort) return;
    setSort(next);
    // Reset rather than merge: page 2 of 최신 has nothing to do with page 2 of
    // 개선 필요, and appending across a sort change interleaves two orderings.
    reload(next);
  };

  const loadMore = () => {
    if (done || loadingMore || state !== 'ok') return;
    setLoadingMore(true);
    api.modelAnswers({ sort, limit: PAGE, offset: groups.length })
      .then((page) => {
        // Dedup by scenarioId: under 개선 필요 a scenario that gained a correction
        // between two fetches shifts position, and a duplicate would break
        // FlatList's key invariant as well as showing the row twice.
        setGroups((prev) => {
          const seen = new Set(prev.map((g) => g.scenarioId));
          return [...prev, ...page.groups.filter((g) => !seen.has(g.scenarioId))];
        });
        if (page.total > 0) setTotal(page.total);
        setDone(page.groups.length < PAGE);
      })
      .catch(() => setDone(true)) // a failed page ends the scroll rather than looping
      .finally(() => setLoadingMore(false));
  };

  // Chips come from what has loaded, so a chip never offers a filter that yields
  // nothing. Client-side filtering keeps `total` and the page arithmetic honest —
  // a server-side department filter would make them disagree.
  const available = useMemo(() => {
    const set = new Set<string>();
    for (const g of groups) { const d = deptOfScenario(g.scenarioId); if (d) set.add(d); }
    return Array.from(set).sort();
  }, [groups]);
  const shown = depts.length === 0 ? groups : groups.filter((g) => depts.includes(deptOfScenario(g.scenarioId)));

  const toggleDept = (d: string) =>
    setDepts((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const headerInner = (
    <>
        {/* The sort is an index tab — two orderings of one list, not two lists. */}
        <NbIndexTabs
          tabs={[[t('list.sortRecent')], [t('list.sortNeedsWork')]]}
          active={sort === 'recent' ? 0 : 1}
          onSelect={(i) => onSort(i === 0 ? 'recent' : 'needs-work')}
        />

        {/* Departments are a MULTI-select, so these are chips rather than tabs: a tab row
            says "one of these", and this row says "any of these". */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {available.map((d, i) => (
            <NbChip key={d} on={depts.includes(d)} rot={i % 2 ? 0.8 : -0.8} onPress={() => toggleDept(d)}>
              {d}
            </NbChip>
          ))}
        </ScrollView>

        {/* `total` is the unfiltered group count and the department filter is still
            client-side here, so the count names what is SHOWN rather than implying a
            ratio. (The speak list filters server-side; groups carry their cards, so
            paging them per department is a bigger change than this screen needs.) */}
        {total > 0 && (
          <Text style={styles.count}>
            {done ? t('list.countAllGroups', { total }) : t('list.countPartialGroups', { shown: groups.length, total })}
          </Text>
        )}
    </>
  );

  // One list, two placements — see SpeakList for why the embedded header rides inside
  // ListHeaderComponent rather than being pinned above a nested scroll.
  const list = (
    <>
      {state === 'loading' ? (
        <View style={styles.center}><ActivityIndicator color={nb.ink} /></View>
      ) : state === 'error' ? (
        <View style={styles.center}><Text style={styles.emptyHint}>{t('model.emptyHint')}</Text></View>
      ) : (
        <FlatList
          data={shown}
          keyExtractor={(g) => g.scenarioId}
          style={styles.scroller}
          contentContainerStyle={styles.listBody}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => (
            <ModelAnswerGroupRow
              group={item}
              open={open === item.scenarioId}
              onToggle={() => setOpen((cur) => (cur === item.scenarioId ? null : item.scenarioId))}
              divider={index < shown.length - 1}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <NbIcon name="pencil" size={32} color={nb.soft} />
              <Text style={styles.emptyTitle}>{t('model.empty')}</Text>
              <Text style={styles.emptyHint}>{t('model.emptyHint')}</Text>
            </View>
          }
          ListFooterComponent={
            // Three pips + 불러오는 중… , the handoff's end-of-infinite-scroll
            // indicator. Absent once the list is complete.
            !done ? (
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
          data={shown}
          keyExtractor={(g) => g.scenarioId}
          contentContainerStyle={styles.embeddedBody}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <View style={styles.embeddedHeader}>
              {above}
              {headerInner}
              {state === 'loading' && <ActivityIndicator color={nb.ink} style={{ marginTop: 24 }} />}
              {state === 'error' && <Text style={styles.emptyHint}>{t('model.emptyHint')}</Text>}
            </View>
          }
          renderItem={({ item, index }) => (
            <ModelAnswerGroupRow
              group={item}
              open={open === item.scenarioId}
              onToggle={() => setOpen((cur) => (cur === item.scenarioId ? null : item.scenarioId))}
              divider={index < shown.length - 1}
            />
          )}
          ListEmptyComponent={
            state === 'ok' ? (
              <View style={styles.center}>
                <NbIcon name="pencil" size={32} color={nb.soft} />
                <Text style={styles.emptyTitle}>{t('model.empty')}</Text>
                <Text style={styles.emptyHint}>{t('model.emptyHint')}</Text>
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
          <Text numberOfLines={1} style={[nbText.hand(26), { flex: 1, minWidth: 0 }]}>{t('list.modelTitle')}</Text>
        </View>
        {/* The same controls as the embedded placement — one set, not two that have to
            be kept in agreement. */}
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
  embedded: { flex: 1, backgroundColor: nb.cream },
  embeddedBody: { paddingBottom: 40, paddingHorizontal: 20 },
  // TOP_INSET, not 4: this header IS the top of the screen in the review lab (the tab
  // renders the list itself), so it carries the status bar the way every other page does.
  // The port dropped it to 4 and both tabs slid under the notch.
  embeddedHeader: { paddingTop: TOP_INSET, paddingBottom: 9, gap: 9 },
  header: {
    // No fixed height — see the speak list for why the handoff's 186 does not port.
    paddingTop: 52,
    paddingBottom: 9,
    paddingHorizontal: 20,
    gap: 9,
    borderBottomWidth: 1.5,
    borderBottomColor: nb.paperEdge,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  chipRow: { gap: 7, paddingVertical: 2, paddingRight: 20 },
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
