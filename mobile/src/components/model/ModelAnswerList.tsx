// 모범답안 요약 (04_SCREENS ⑨ 리뷰랩 C) — the handoff's LabModel: the most recent
// correction worked through as a hero card, then the list of completed scenarios.
//
// No sort dropdown, no filter chips. The handoff's summary deliberately carries neither
// ("모범답안에 왜 아직 정렬, 필터칩이 있어") — those belong to the separate full-list
// screen, not to this in-tab summary. What stays is infinite scroll and the hero.
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { api, type ModelAnswerGroup } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { ModelAnswerGroupRow } from '@/components/model/ModelAnswerGroupRow';
import { ModelAnswerHero } from '@/components/model/ModelAnswerHero';
import { useT } from '@/i18n';

const PAGE = 10;

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
  const [groups, setGroups] = useState<ModelAnswerGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [done, setDone] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  // Always 최신: the summary shows the correction the learner most likely still
  // remembers making. The handoff has no sort control here, so there is nothing to vary.
  const reload = useCallback(() => {
    setState('loading');
    setDone(false);
    api.modelAnswers({ sort: 'recent', limit: PAGE, offset: 0 })
      .then((page) => {
        setGroups(page.groups);
        setTotal(page.total);
        setDone(page.groups.length < PAGE);
        // Everything starts collapsed: the worked example is the hero card above the
        // list now (v31), and auto-opening the same scenario's row printed the same
        // correction twice on one screen.
        setOpen(null);
        setState('ok');
      })
      .catch(() => setState('error'));
  }, []);

  // One-shot, NOT useFocusEffect: returning from anywhere must not discard the
  // pages already pulled in or the scroll position they were being read at.
  useEffect(() => { reload(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = () => {
    if (done || loadingMore || state !== 'ok') return;
    setLoadingMore(true);
    api.modelAnswers({ sort: 'recent', limit: PAGE, offset: groups.length })
      .then((page) => {
        // Dedup by scenarioId, in case a scenario shifted position between two fetches:
        // a duplicate would break FlatList's key invariant and show the row twice.
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

  // The most recent correction that actually has cards to work through.
  const hero = groups.find((g) => (g.cards?.length ?? 0) > 0);

  /** 따라 말하기 — the same pronunciation route the speak list opens, so a sentence
   *  practised from here lands in the same history. One template literal: expo-router's
   *  typed-routes generator matches statically against one backtick expression. */
  const practise = (model: string) => {
    router.push(
      `/pronunciation/${encodeURIComponent(model.slice(0, 40))}?referenceText=${encodeURIComponent(model)}&origin=review`
    );
  };

  const headerInner = (
    <>
        {/* Count only — no sort, no chips (핸드오프 요약 그대로). */}
        {total > 0 && (
          <Text style={styles.count}>
            {done ? t('list.countAllGroups', { total }) : t('list.countPartialGroups', { shown: groups.length, total })}
          </Text>
        )}

        {/* The most recent correction, worked through, then the completed-scenario list. */}
        {!!hero && (
          <>
            <ModelAnswerHero group={hero} onPractise={practise} />
            <Text style={[nbText.hand(16), { marginTop: 13 }]}>{t('model.completedScenarios')}</Text>
          </>
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
          data={groups}
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
              divider={index < groups.length - 1}
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
          data={groups}
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
              divider={index < groups.length - 1}
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
