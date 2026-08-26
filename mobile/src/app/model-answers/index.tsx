// ScreenModelAnswerList (04_SCREENS ⑨ "11c") — where every scenario the player
// has model answers for is actually browsed. Mobile patterns, explicitly not web
// ones: infinite scroll, a segmented sort (최신 / 개선 필요), toggle chips, and a
// bottom-sheet filter behind ⚙ 필터 N for compound conditions.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { api, type ModelAnswerGroup, type ModelAnswerSort } from '@/api/client';
import { PixelIcon } from '@/components/PixelIcon';
import { FIcon } from '@/components/FIcon';
import { Shadowed } from '@/components/campus/parts';
import { ModelAnswerGroupRow } from '@/components/model/ModelAnswerGroupRow';
import { colors, fonts, fs } from '@/theme/tokens';
import { PLACE_SCREEN } from '@/theme/transitions';
import { useT } from '@/i18n';

const PAGE = 10;

/** Department code from a scenario id (SCN-ER-00002 → ER); '' when there is none. */
function deptOfScenario(id: string): string {
  const m = /^SCN-([A-Z0-9]+)-/.exec(id);
  return m ? m[1] : '';
}

export default function ModelAnswerList() {
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

  return (
    <View style={styles.screen}>
      <Stack.Screen options={PLACE_SCREEN} />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
            <PixelIcon name="chevron-left" color={colors.ink} size={14} sw={2.2} />
          </Pressable>
          <Text style={styles.title}>{t('list.modelTitle')}</Text>
        </View>

        <View style={styles.controls}>
          {/* Segmented sort — two halves of one control, not a dropdown. */}
          <Shadowed offset={2}>
            <View style={styles.segment}>
              {(['recent', 'needs-work'] as ModelAnswerSort[]).map((s) => (
                <Pressable key={s} onPress={() => onSort(s)} style={[styles.segHalf, sort === s && styles.segActive]}>
                  <Text style={[styles.segText, sort === s && styles.segTextActive]}>
                    {t(s === 'recent' ? 'list.sortRecent' : 'list.sortNeedsWork')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Shadowed>
          <View style={styles.spacer} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {available.map((d) => {
            const active = depts.includes(d);
            return (
              <Pressable key={d} onPress={() => toggleDept(d)}>
                <View style={[styles.chip, active && styles.chipActive]}>
                  {active && <FIcon name="check" size={11} />}
                  <Text style={styles.chipText}>{d}</Text>
                </View>
              </Pressable>
            );
          })}
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
      </View>

      {state === 'loading' ? (
        <View style={styles.center}><ActivityIndicator color={colors.ink} /></View>
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
              <PixelIcon name="note" color={colors.textFaint} size={36} sw={1.5} />
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

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    // No fixed height — see the speak list for why the handoff's 186 does not port.
    paddingTop: 52,
    paddingBottom: 9,
    paddingHorizontal: 14,
    backgroundColor: colors.cream,
    borderBottomWidth: 3,
    borderBottomColor: colors.ink,
    gap: 7,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  back: { padding: 4 },
  title: { fontFamily: fonts.heading, fontSize: fs(16), color: colors.ink },
  controls: { flexDirection: 'row', alignItems: 'center' },
  spacer: { flex: 1 },
  segment: { flexDirection: 'row', borderWidth: 2.5, borderColor: colors.ink, backgroundColor: '#fff' },
  segHalf: { paddingVertical: 5, paddingHorizontal: 12 },
  segActive: { backgroundColor: colors.yellow },
  segText: { fontFamily: fonts.heading, fontSize: fs(10.5), color: colors.textSoft },
  segTextActive: { color: colors.ink },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  filterText: { fontFamily: fonts.heading, fontSize: fs(10), color: colors.ink },
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
  sheet: { padding: 16, gap: 12 },
  sheetTitle: { fontFamily: fonts.heading, fontSize: fs(13), color: colors.ink },
  sheetChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  sheetActions: { flexDirection: 'row', gap: 8 },
});
