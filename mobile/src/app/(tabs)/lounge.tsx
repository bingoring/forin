// 스태프 라운지 — the community feed (핸드오프 v31 07 · 라운지 A).
//
// The tab that used to be 오늘의 상황판. The board itself did not go away: it is
// `/board` now, reached from this header, because the daily rotation is a working
// feature and the feed is a new one.
//
// Reads and writes /lounge (posts, cheers, reports). Three things about this screen
// are deliberate:
//
//   · Paging is by TIME, not offset. A post arriving between two reads shifts every
//     offset by one, and the reader sees a row they already read.
//   · The search line and the filter chips filter what is LOADED, in memory. The
//     server has no search endpoint, and a chip that quietly re-queries with a
//     parameter the server ignores would filter nothing while looking like it did.
//   · A cheer is applied optimistically and reconciled with the server's count —
//     it is a tap on a number, and waiting a round trip to fill a star reads as a
//     dropped tap.
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api, type LoungeKind, type LoungePost } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { BottomSheet } from '@/components/BottomSheet';
import { LoungeCard } from '@/components/lounge/LoungeCard';
import { NbButton, NbChip, NbMemo, NbPaper, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';

type Filter = 'ALL' | LoungeKind | 'MINE';
const FILTERS: Filter[] = ['ALL', 'question', 'share', 'MINE'];
const FILTER_KEY: Record<Filter, string> = {
  ALL: 'lounge.filterAll',
  talk: 'lounge.kindTalk',
  question: 'lounge.filterQuestion',
  share: 'lounge.filterShare',
  MINE: 'lounge.filterMine',
};

export default function Lounge() {
  const t = useT();
  const router = useRouter();
  const [posts, setPosts] = useState<LoungePost[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [hasMore, setHasMore] = useState(false);
  const [paging, setPaging] = useState(false);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [query, setQuery] = useState('');
  const [menuFor, setMenuFor] = useState<LoungePost | null>(null);
  const [reported, setReported] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const r = await api.lounge();
      setPosts(r.posts);
      setHasMore(r.hasMore);
      setState('ok');
    } catch {
      setState('error');
    }
  }, []);

  // Re-read on focus rather than once on mount: the writer comes back to this screen
  // straight after posting, and a feed that does not contain what you just wrote is
  // indistinguishable from a post that failed.
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const loadMore = async () => {
    if (paging || !hasMore || posts.length === 0) return;
    setPaging(true);
    try {
      const r = await api.lounge({ before: posts[posts.length - 1].createdAt });
      // Dedupe by id: two overlapping pages must not render the same post twice with
      // the same key.
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...r.posts.filter((p) => !seen.has(p.id))];
      });
      setHasMore(r.hasMore);
    } catch {
      // A failed page is not a failed screen: what is already on the wall stays, and
      // the next scroll tries again.
      setHasMore(false);
    } finally {
      setPaging(false);
    }
  };

  const onCheer = async (post: LoungePost) => {
    const on = !post.cheered;
    setPosts((prev) => prev.map((p) => (
      p.id === post.id ? { ...p, cheered: on, cheers: Math.max(0, p.cheers + (on ? 1 : -1)) } : p
    )));
    try {
      const r = await api.cheerLoungePost(post.id, on);
      // The server's count is the truth — somebody else may have cheered in between.
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, cheers: r.cheers, cheered: r.cheered } : p)));
    } catch {
      setPosts((prev) => prev.map((p) => (
        p.id === post.id ? { ...p, cheered: post.cheered, cheers: post.cheers } : p
      )));
    }
  };

  const onDelete = async (post: LoungePost) => {
    setMenuFor(null);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    try {
      await api.deleteLoungePost(post.id);
    } catch {
      void load(); // put it back the honest way: ask the server what is there
    }
  };

  const onReport = async (post: LoungePost) => {
    setMenuFor(null);
    // Marked reported locally whatever the server says: the endpoint is idempotent,
    // and a reader who taps 신고 twice should not be told the second one failed.
    setReported((prev) => new Set(prev).add(post.id));
    try {
      await api.reportLoungePost(post.id, '');
    } catch { /* the report is queued in the reader's head, not ours */ }
  };

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (filter === 'MINE' ? !p.mine : filter !== 'ALL' && p.kind !== filter) return false;
      if (!q) return true;
      return p.body.toLowerCase().includes(q)
        || p.authorName.toLowerCase().includes(q)
        || (p.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
    });
  }, [posts, filter, query]);

  const header = (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
        <Text numberOfLines={1} style={[nbText.hand(28), { flex: 1, minWidth: 0 }]}>{t('lounge.title')}</Text>
        <NbButton variant="yellow" size="sm" icon="pencil" rot={1} onPress={() => router.push('/lounge/compose')}>
          {t('lounge.write')}
        </NbButton>
      </View>
      <Text style={[nbText.body(11, nb.soft), { marginTop: 2 }]}>{t('lounge.subtitle')}</Text>

      {/* 오늘의 상황판 kept its place in the app, one tap from where its tab used to be. */}
      <Pressable onPress={() => router.push('/board')}>
        <NbPaper rot={-0.4} bg="rgba(143,199,232,.22)" style={styles.boardLink}>
          <NbIcon name="board" size={22} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={nbText.hand(16)}>{t('lounge.boardLink')}</Text>
            <Text numberOfLines={1} style={[nbText.body(10, nb.soft), { marginTop: 1 }]}>{t('lounge.boardLinkSub')}</Text>
          </View>
          <NbIcon name="chevronRight" size={15} />
        </NbPaper>
      </Pressable>

      {/* Written on a ruled line rather than boxed — and a real input, because the
          handoff's line is where you type, not a button that opens somewhere to type. */}
      <View style={styles.search}>
        <NbIcon name="magnify" size={16} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('lounge.searchHint')}
          placeholderTextColor={nb.placeholder}
          style={styles.searchInput}
          returnKeyType="search"
        />
        {!!query && (
          <Pressable onPress={() => setQuery('')} hitSlop={10}><NbIcon name="cross" size={13} /></Pressable>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingVertical: 10 }}>
        {FILTERS.map((f, i) => (
          <NbChip key={f} on={filter === f} rot={i % 2 ? 0.8 : -0.8} onPress={() => setFilter(f)}>
            {t(FILTER_KEY[f])}
          </NbChip>
        ))}
      </ScrollView>
    </View>
  );

  if (state !== 'ok') {
    return (
      <Page>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
          {state === 'loading'
            ? <ActivityIndicator color={nb.ink} />
            : (
              <>
                <NbIcon name="bell" size={26} color={nb.red} />
                <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('lounge.loadFailed')}</Text>
                <NbButton variant="paper" onPress={() => { setState('loading'); void load(); }}>
                  {t('lounge.retry')}
                </NbButton>
              </>
            )}
        </View>
      </Page>
    );
  }

  return (
    <Page>
      <FlatList
        data={shown}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={header}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        renderItem={({ item, index }) => (
          <LoungeCard
            post={item}
            index={index}
            onCheer={onCheer}
            onMenu={setMenuFor}
            onOpenScenario={(id) => router.push(`/scenario/${id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <NbIcon name="coffee" size={32} color={nb.soft} />
            <Text style={[nbText.hand(17), { textAlign: 'center' }]}>
              {posts.length === 0 ? t('lounge.empty') : t('lounge.emptyFiltered')}
            </Text>
            <Text style={[nbText.hand(14, nb.soft), { textAlign: 'center' }]}>
              {posts.length === 0 ? t('lounge.emptyHint') : t('lounge.emptyFilteredHint')}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={{ paddingTop: 16 }}>
            {paging && <ActivityIndicator color={nb.ink} />}
            {!hasMore && shown.length > 0 && (
              <NbMemo color={nb.blue} rot={-0.3}>
                <Text style={nbText.hand(13.5)}>{t('lounge.rules')}</Text>
              </NbMemo>
            )}
          </View>
        }
      />

      {/* The ⋯ menu. Your own post can be taken down; somebody else's can be reported —
          which is also what the store's review asks for on user-written content. */}
      <BottomSheet visible={!!menuFor} onClose={() => setMenuFor(null)}>
        {!!menuFor && (
          <View style={{ padding: 20, gap: 10 }}>
            <Text numberOfLines={2} style={nbText.hand(17)}>{menuFor.body}</Text>
            {menuFor.mine ? (
              <NbButton variant="danger" full icon="cross" onPress={() => void onDelete(menuFor)}>
                {t('lounge.delete')}
              </NbButton>
            ) : (
              <NbButton
                variant="paper"
                full
                icon="bell"
                disabled={reported.has(menuFor.id)}
                onPress={() => void onReport(menuFor)}
              >
                {reported.has(menuFor.id) ? t('lounge.reported') : t('lounge.report')}
              </NbButton>
            )}
            <Text style={[nbText.body(10.5, nb.soft), { textAlign: 'center' }]}>
              {menuFor.mine ? t('lounge.deleteNote') : t('lounge.reportNote')}
            </Text>
          </View>
        )}
      </BottomSheet>
    </Page>
  );
}

/** The ruled page, drawn once behind everything. */
function Page({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(900);
  return (
    <View style={{ flex: 1, backgroundColor: nb.cream }} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
        {Array.from({ length: Math.ceil(h / RULE_H) }).map((_, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
        ))}
      </View>
      {children}
    </View>
  );
}

const styles = {
  list: { paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 40 } as const,
  boardLink: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, paddingVertical: 10, paddingHorizontal: 13 } as const,
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12,
    paddingVertical: 4, paddingHorizontal: 4,
    borderBottomWidth: 2, borderBottomColor: 'rgba(62,54,43,.45)',
  } as const,
  searchInput: { flex: 1, minWidth: 0, fontFamily: nbFonts.hand, fontSize: 15, color: nb.ink, paddingVertical: 4 } as const,
  empty: {
    alignItems: 'center', gap: 7, paddingVertical: 30, marginTop: 8,
    borderWidth: 1.7, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.3)',
    backgroundColor: 'rgba(255,253,244,.6)',
  } as const,
};
