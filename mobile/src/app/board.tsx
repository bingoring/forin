// 오늘의 상황판 — the notebook line's corkboard (v29).
//
// The data is unchanged: a daily-rotated set of scenario cards from the server
// (api.dailyBoard, falling back to the global api.boardToday), grouped into department
// sections with a filter row, a top-up that opens three more, and a reset countdown that
// only ticks while this tab is on screen.
//
// What changed is the metaphor. This is the board on a break-room wall: every card is a
// slip of paper PINNED to it — pin colour by urgency, pin position varied per card so the
// wall does not look like a spreadsheet. That is also why the summary is taped rather
// than pinned: it is the ward's own notice, not one of today's situations.
//
// The 라운지 TAB is now the community feed (see (tabs)/lounge.tsx, and the lounge tables
// behind it). This screen kept the board and lost the tab slot: it is reached from the
// lounge header and from the home screen. Deleting a working daily rotation to make room
// for the feed would have cost the learner a feature to gain one.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { api, type BoardCard } from '@/api/client';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbButton, NbChip, NbMemo, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { PLACE_SCREEN } from '@/theme/transitions';
import { resetLabel } from '@/data/boardReset';
import { useT } from '@/i18n';

// dept code → label key + short code + doodle + pen colour. Canonical order first.
//
// `nameKey` rather than a Korean literal: this map is a module constant, so a t() call
// here would freeze the labels to the language at startup.
//
// The doodle set has 37 drawings and the hospital has 25 departments, so several share
// one — a section already carries its own name, and the icon's job is to make the row
// findable while scrolling, not to be a unique key.
const DEPT_META: Record<string, { nameKey: string; short: string; nbIcon: NbIconName; color: string }> = {
  ER: { nameKey: 'dept.ER', short: 'ER', nbIcon: 'siren', color: '#C75146' },
  ICU: { nameKey: 'dept.ICU', short: 'ICU', nbIcon: 'monitor', color: '#8E3A32' },
  OR: { nameKey: 'dept.OR', short: 'OR', nbIcon: 'scalpel', color: '#7B5EA7' },
  PEDS: { nameKey: 'dept.PEDS', short: 'PEDS', nbIcon: 'baby', color: '#4A6FA5' },
  PHARMA: { nameKey: 'dept.PHARMA', short: 'PHARMA', nbIcon: 'pill', color: '#5F8D5A' },
  LD: { nameKey: 'dept.LD', short: 'LD', nbIcon: 'baby', color: '#C2487E' },
  NICU: { nameKey: 'dept.NICU', short: 'NICU', nbIcon: 'baby', color: '#3E8CA8' },
  PICU: { nameKey: 'dept.PICU', short: 'PICU', nbIcon: 'monitor', color: '#5B62A8' },
  NURSERY: { nameKey: 'dept.NURSERY', short: 'NURSERY', nbIcon: 'baby', color: '#D07CA0' },
  WOMENKIDS: { nameKey: 'dept.WOMENKIDS', short: 'W&K', nbIcon: 'stetho', color: '#C2487E' },
  RAD: { nameKey: 'dept.RAD', short: 'RAD', nbIcon: 'monitor', color: '#0E7490' },
  ENDO: { nameKey: 'dept.ENDO', short: 'ENDO', nbIcon: 'magnify', color: '#0D8074' },
  DIAL: { nameKey: 'dept.DIAL', short: 'DIAL', nbIcon: 'monitor', color: '#2563A8' },
  SPECIALTY: { nameKey: 'dept.SPECIALTY', short: 'SPEC', nbIcon: 'stetho', color: '#6E4FA8' },
  INFUSION: { nameKey: 'dept.INFUSION', short: 'INFU', nbIcon: 'bandage', color: '#1E8A5B' },
  ONCO: { nameKey: 'dept.ONCO', short: 'ONCO', nbIcon: 'shield', color: '#8A4FA8' },
  HOSPICE: { nameKey: 'dept.HOSPICE', short: 'HOSP', nbIcon: 'bulb', color: '#6E7480' },
  GERI: { nameKey: 'dept.GERI', short: 'GERI', nbIcon: 'stetho', color: '#A2701A' },
  PSYCH: { nameKey: 'dept.PSYCH', short: 'PSYCH', nbIcon: 'speech', color: '#7B5EA7' },
  REHAB: { nameKey: 'dept.REHAB', short: 'REHAB', nbIcon: 'bandage', color: '#1E7FA8' },
  SIM: { nameKey: 'dept.SIM', short: 'SIM', nbIcon: 'lab', color: '#4A50A8' },
  LOUNGE: { nameKey: 'dept.LOUNGE', short: 'LOUNGE', nbIcon: 'coffee', color: '#9A6B1A' },
  SPD: { nameKey: 'dept.SPD', short: 'SPD', nbIcon: 'board', color: '#5C5C5C' },
  MORGUE: { nameKey: 'dept.MORGUE', short: 'MORGUE', nbIcon: 'bulb', color: '#48525E' },
  GEN: { nameKey: 'dept.GEN', short: 'GEN', nbIcon: 'hospital', color: '#6E6354' },
};
const DEPT_ORDER = Object.keys(DEPT_META);

// urgency → paper tint, pin colour, tag. The pin is how the wall is read at a glance:
// red heads are the ones that cannot wait.
const URGENCY: Record<string, { tint?: string; pin: string; pinDark: string; label: string }> = {
  urgent: { tint: '#FFF0EC', pin: nb.red, pinDark: '#8E3A32', label: 'URGENT' },
  quest: { pin: '#E9C45A', pinDark: '#A2701A', label: 'QUEST' },
  info: { pin: nb.blue, pinDark: '#2E4A73', label: 'INFO' },
};
const urg = (u: string) => URGENCY[u] ?? URGENCY.quest;

/** Pins land at a few different places along the top edge — fixed per index rather than
 *  random, so the wall does not reshuffle itself on every render. */
const PIN_X = [150, 34, 250, 96, 200, 62];
const ROT = [-0.5, 0.5, -0.4, 0.45, -0.3, 0.4];

export default function Board() {
  const t = useT();
  const router = useRouter();
  const [cards, setCards] = useState<BoardCard[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [filter, setFilter] = useState('ALL');
  const [adPlaying, setAdPlaying] = useState(false);
  const [topping, setTopping] = useState(false);
  const [capReached, setCapReached] = useState(false);

  // Rewarded-ad stub: real SDK (react-native-google-mobile-ads) needs a dev build,
  // so in Expo Go this simulates a short ad view. Swap for the SDK in production.
  const watchAd = () => new Promise<void>((resolve) => {
    setAdPlaying(true);
    setTimeout(() => { setAdPlaying(false); resolve(); }, 1600);
  });

  const onTopUp = async () => {
    if (topping || capReached) return;
    setTopping(true);
    await watchAd();
    try {
      const r = await api.topUpDailyBoard();
      setCards(r.scenarios);
      if (r.adGrants >= r.cap) setCapReached(true);
    } catch (e) {
      if ((e as { capReached?: boolean }).capReached) setCapReached(true);
    } finally {
      setTopping(false);
    }
  };

  // Ticked while this tab is on screen, and only then: an interval that keeps running
  // behind four other tabs is spending battery to keep a chip nobody is looking at
  // current. Re-reading the clock on focus is what makes it right again on return.
  const [now, setNow] = useState(() => new Date());
  useFocusEffect(
    useCallback(() => {
      setNow(new Date());
      // Half a minute for a chip that shows minutes: fine enough that it is never more
      // than 30s stale, coarse enough to be free.
      const id = setInterval(() => setNow(new Date()), 30_000);
      return () => clearInterval(id);
    }, []),
  );

  useEffect(() => {
    let alive = true;
    // Personalized daily pool (weighted, per-user, resets 00:00 local); fall back
    // to the global rotated board if the authed call fails (offline / not authed).
    api.dailyBoard()
      .then((c) => { if (alive) { setCards(c); setState('ok'); } })
      .catch(() => api.boardToday()
        .then((c) => { if (alive) { setCards(c); setState('ok'); } })
        .catch(() => { if (alive) setState('error'); }));
    return () => { alive = false; };
  }, []);

  const reset = resetLabel(now);

  const byDept = useMemo(() => {
    const m: Record<string, BoardCard[]> = {};
    for (const c of cards) (m[c.dept] = m[c.dept] || []).push(c);
    return m;
  }, [cards]);
  // depts present, in canonical order (unknown depts appended).
  const presentDepts = useMemo(() => {
    const present = Object.keys(byDept);
    return [...DEPT_ORDER.filter((d) => present.includes(d)), ...present.filter((d) => !DEPT_ORDER.includes(d))];
  }, [byDept]);
  const urgent = cards.filter((c) => c.urgency === 'urgent').length;
  const quest = cards.filter((c) => c.urgency === 'quest').length;
  const shownDepts = filter === 'ALL' ? presentDepts : presentDepts.filter((d) => d === filter);

  if (state !== 'ok') {
    return (
      <Page>
        <Stack.Screen options={PLACE_SCREEN} />
        {/* The way back belongs here too: a load failure is exactly when the learner
            wants to leave, and this screen has no tab bar to leave by. */}
        <View style={{ paddingTop: TOP_INSET, paddingHorizontal: 20 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <NbPaper rot={-1} style={styles.back}><NbIcon name="chevronLeft" size={16} /></NbPaper>
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
          {state === 'loading'
            ? <ActivityIndicator color={nb.ink} />
            : <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('board.loadFailed')}</Text>}
        </View>
      </Page>
    );
  }

  return (
    <Page>
      {/* The wall's own header stays put while the cards scroll: the count and the reset
          are what the whole screen is about, and losing them on the first flick is how a
          board becomes a list. */}
      <Stack.Screen options={PLACE_SCREEN} />
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {/* No longer a tab, so the way back has to be on the page. */}
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <NbPaper rot={-1} style={styles.back}><NbIcon name="chevronLeft" size={16} /></NbPaper>
          </Pressable>
          <Text numberOfLines={1} style={[nbText.hand(28), { flex: 1, minWidth: 0 }]}>{t('board.nbTitle')}</Text>
          <Text style={nbText.mono(11)}>{todayLabel()}</Text>
        </View>

        <NbPaper rot={-0.5} tape tapeLeft={130} bg="rgba(168,217,151,.28)" style={styles.summary}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <NbIcon name="board" size={28} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={nbText.mono(10)}>{monthDay()}</Text>
              <Text numberOfLines={1} style={[nbText.hand(19), { marginTop: 1 }]}>{t('board.todayCount', { n: cards.length })}</Text>
            </View>
            {/* Flat, not raised: this reports, it does not respond. */}
            <View style={styles.reset}>
              <Text numberOfLines={1} style={nbText.body(9, nb.soft)}>{t('board.resetLabel')}</Text>
              <Text numberOfLines={1} style={nbText.mono(11, nb.ink)}>{t(reset.key, reset.params)}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
            <Counter label="URGENT" value={urgent} accent={nb.red} />
            <Counter label="QUEST" value={quest} accent="#C99A1E" />
            <Counter label={t('board.cleared')} value={0} accent={nb.green} />
            <Counter label={t('board.remaining')} value={cards.length} accent={nb.ink} />
          </View>
        </NbPaper>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingVertical: 10 }}>
          <NbChip on={filter === 'ALL'} rot={-0.8} onPress={() => setFilter('ALL')}>{t('board.all')}</NbChip>
          {presentDepts.map((d, i) => (
            <NbChip key={d} on={filter === d} rot={i % 2 ? 0.8 : -0.8} onPress={() => setFilter(d)}>
              {`${DEPT_META[d]?.short ?? d} ${byDept[d].length}`}
            </NbChip>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {shownDepts.map((dept) => {
          const list = byDept[dept] ?? [];
          const m = DEPT_META[dept];
          return (
            <View key={dept}>
              <View style={styles.sectionHead}>
                <NbIcon name={m?.nbIcon ?? 'hospital'} size={22} />
                <Text numberOfLines={1} style={[nbText.hand(18), { flex: 1, minWidth: 0 }]}>{m ? t(m.nameKey) : dept}</Text>
                <Text numberOfLines={1} style={nbText.hand(14, nb.soft)}>{t('board.deptCount', { n: list.length })}</Text>
              </View>
              {list.map((c, i) => (
                <EventCard key={c.id} c={c} i={i} onPress={() => router.push(`/scenario/${c.id}`)} />
              ))}
            </View>
          );
        })}

        {shownDepts.length === 0 && (
          <View style={styles.empty}>
            <NbIcon name={DEPT_META[filter]?.nbIcon ?? 'calendar'} size={30} />
            <Text style={[nbText.hand(16), { textAlign: 'center' }]}>
              {t('board.emptyDept', { dept: DEPT_META[filter] ? t(DEPT_META[filter].nameKey) : filter })}
            </Text>
            <Text style={nbText.hand(14, nb.soft)}>{t('board.emptyTomorrow')}</Text>
          </View>
        )}

        {/* Top-up. Only under 전체: filtered to one department, three more cards spread
            across the hospital is not an answer to "this ward is quiet". */}
        {filter === 'ALL' && (
          <Pressable onPress={onTopUp} disabled={topping || capReached}>
            <NbPaper rot={0.4} bg={capReached ? nb.paper : 'rgba(249,227,123,.5)'} style={styles.topUp}>
              <NbIcon name={capReached ? 'check' : 'star'} size={26} color={capReached ? nb.green : '#C99A1E'} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={nbText.hand(17)}>{capReached ? t('board.rewardsDone') : t('board.watchAd')}</Text>
                <Text style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>
                  {capReached ? t('board.midnight') : t('board.quietHint')}
                </Text>
              </View>
              {topping && <ActivityIndicator color={nb.ink} />}
            </NbPaper>
          </Pressable>
        )}

        <NbMemo color={nb.blue} rot={-0.3}>
          <Text style={nbText.hand(13.5)}>{t('board.rotationNote', { n: cards.length })}</Text>
        </NbMemo>
      </ScrollView>

      {/* rewarded-ad stub overlay */}
      <Modal visible={adPlaying} transparent animationType="fade">
        <View style={styles.adOverlay}>
          <NbIcon name="board" size={40} color={nb.cream} />
          <Text style={nbText.hand(18, nb.cream)}>{t('board.adPlaying')}</Text>
          <ActivityIndicator color={nb.cream} />
          <Text style={nbText.body(11, 'rgba(241,235,221,.7)')}>{t('board.adDevNote')}</Text>
        </View>
      </Modal>
    </Page>
  );
}

/** One situation, pinned to the wall. */
function EventCard({ c, i, onPress }: { c: BoardCard; i: number; onPress: () => void }) {
  const t = useT();
  const u = urg(c.urgency);
  return (
    <NbPaper
      rot={ROT[i % ROT.length]}
      pinned={PIN_X[i % PIN_X.length]}
      pinColor={u.pin}
      bg={u.tint}
      style={styles.card}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <NbTag color={u.pin} fill>{u.label}</NbTag>
        {!!c.room && <Text numberOfLines={1} style={[nbText.mono(9.5), { flex: 1, minWidth: 0 }]}>{c.room}</Text>}
        <DifficultyMini n={c.difficulty ?? 1} />
      </View>

      <Text style={[nbText.hand(20), { marginTop: 7, lineHeight: 23 }]}>{c.title}</Text>
      {!!c.npcName && (
        <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>
          {c.npcName}{c.npcSub ? ` · ${c.npcSub}` : ''}
        </Text>
      )}

      {/* What they said, in their own words — so it is quoted rather than boxed. */}
      {!!c.tagline && (
        <View style={styles.quote}>
          <Text numberOfLines={2} style={[nbText.body(11, nb.ink), { fontStyle: 'italic' }]}>{c.tagline}</Text>
        </View>
      )}

      {(!!c.skills?.length || !!c.timeLabel) && (
        <View style={styles.metaRow}>
          {(c.skills ?? []).slice(0, 2).map((sk, k) => (
            <NbTag key={k} color={nb.green} rot={k % 2 ? 0.6 : -0.6}>{sk}</NbTag>
          ))}
          {(c.skills?.length ?? 0) > 2 && (
            <Text style={nbText.hand(13, nb.soft)}>{`+${(c.skills!.length) - 2}`}</Text>
          )}
          {!!c.timeLabel && (
            <Text numberOfLines={1} style={[nbText.mono(9.5), { marginLeft: 'auto' }]}>{c.timeLabel}</Text>
          )}
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 11 }}>
        <View style={{ flex: 1 }}>
          <NbButton variant="paper" full size="sm" icon="compass" onPress={onPress}>{t('board.showPlace')}</NbButton>
        </View>
        <View style={{ flex: 2 }}>
          <NbButton variant="ink" full size="sm" icon="pencil" iconColor={nb.paper} onPress={onPress}>{t('board.proceed')}</NbButton>
        </View>
      </View>
    </NbPaper>
  );
}

/** Three boxes, filled to the difficulty. Countable rather than a word: "보통" means
 *  nothing until you have seen all three. */
function DifficultyMini({ n }: { n: number }) {
  const fill = ['rgba(168,217,151,.85)', 'rgba(249,227,123,.85)', 'rgba(244,164,155,.85)'];
  return (
    <View style={{ flexDirection: 'row', gap: 2.5, flexShrink: 0 }}>
      {[1, 2, 3].map((k) => (
        <View
          key={k}
          style={{
            width: 8, height: 8, borderWidth: 1.2, borderColor: nb.ink,
            backgroundColor: k <= n ? fill[Math.min(Math.max(n, 1), 3) - 1] : 'transparent',
          }}
        />
      ))}
    </View>
  );
}

function Counter({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <View style={styles.counter}>
      <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 8.5, color: accent, letterSpacing: 0.5 }}>{label}</Text>
      <Text numberOfLines={1} style={[nbText.hand(20), { marginTop: 1 }]}>{value}</Text>
    </View>
  );
}

/** The ruled page. Not NbScreen: this screen scrolls two things — a header that stays and
 *  the sections that move. */
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

// Local date labels.
function todayLabel(): string {
  const d = new Date();
  const wd = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()} ${wd}`;
}
function monthDay(): string {
  const d = new Date();
  const mon = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][d.getMonth()];
  return `TODAY · ${mon} ${d.getDate()}`;
}

const styles = {
  header: { paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 6, zIndex: 2 } as const,
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' } as const,
  summary: { marginTop: 12, paddingVertical: 13, paddingHorizontal: 14 } as const,
  reset: {
    flexShrink: 0, alignItems: 'center', backgroundColor: 'rgba(255,253,244,.85)',
    borderWidth: 1.3, borderColor: nb.paperEdge, paddingVertical: 3, paddingHorizontal: 8,
  } as const,
  counter: {
    flex: 1, alignItems: 'center', backgroundColor: nb.paper,
    borderWidth: 1.3, borderColor: nb.paperEdge, paddingVertical: 5,
  } as const,
  scroll: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 40, gap: 16 } as const,
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 } as const,
  card: { marginTop: 14, paddingTop: 13, paddingBottom: 11, paddingHorizontal: 14 } as const,
  quote: {
    marginTop: 8, paddingTop: 7, paddingLeft: 9,
    borderLeftWidth: 2.5, borderLeftColor: 'rgba(62,54,43,.18)',
    borderTopWidth: 1.3, borderTopColor: 'rgba(62,54,43,.12)', borderStyle: 'dashed',
  } as const,
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 9, flexWrap: 'wrap' } as const,
  empty: {
    alignItems: 'center', gap: 7, paddingVertical: 28,
    borderWidth: 1.7, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.3)',
    backgroundColor: 'rgba(255,253,244,.6)',
  } as const,
  topUp: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14 } as const,
  adOverlay: { flex: 1, backgroundColor: 'rgba(46,40,35,.88)', alignItems: 'center', justifyContent: 'center', gap: 14 } as const,
};
