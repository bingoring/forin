// 홈 — "달력 한 장 + 버튼 하나" (handoff v47 · forin-notebook-home3.jsx HomeCal).
//
// A home where the places to press show without words: the top row (face · streak · the
// call, only while there is one), the work calendar (tap a day for its stamps), and one
// continue button. The drawing lives in components/home/HomeCal; this file is the data and
// the routing.
//
// What left (v47 · v48, user decisions 2026-10-17 — home-calendar-v47 §3):
//  · 오늘의 문장 · 할 일 체크 · 멘토 쪽지 · 복습 미리보기 — off the home only; the server
//    still serves them and their new places wait for the next handoff.
//  · 쉬는 시간 → 라운지 휴게실 card; 인수인계 노트 · 슬랭 → 리뷰랩 자료 선반 (v48).
//  · 과별 출근 카드 — removed with no new door, so the campus map is unreachable for now.
//  · 라이브 병동 — on hold (v47 keeps it on the HomeV2 artboard). The component and the
//    app-wide presence heartbeat stay; only the home's roster poll is gone with it.
//
// Kept from before: the cold-start retry and "the server is waking" wait, and the rule that
// a call is ACCEPTED on the server before the app navigates into it.
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { NbButton, NbPaper, nbText } from '@/components/nb/NbUI';
import { ContinueBar, HomeCalendar, HomeTopRow, continueCells } from '@/components/home/HomeCal';
import { useMyAvatar } from '@/hooks/useMyAvatar';
import { RULE_COLOR, RULE_H, TOP_INSET, nb } from '@/theme/nb';
import { bandLabelKey } from '@/data/shifts';
import { api, type CalendarDay, type Home } from '@/api/client';
import { useLocale, useT } from '@/i18n';

/** How many times the home read is retried before it is called a failure. Cloud Run
 *  scales to zero, so the first request after an idle period is a WAIT, not an error. */
const HOME_RETRIES = 3;

export default function HomeTab() {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const face = useMyAvatar();
  const [home, setHome] = useState<Home | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [cal, setCal] = useState<{ month: string; days: CalendarDay[] }>({ month: '', days: [] });
  const [selected, setSelected] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const load = async (n: number) => {
        try {
          // In parallel, and the calendar may fail on its own: a home without its month
          // is still a home (R1) — the grid draws empty.
          const [h, c] = await Promise.all([
            api.home(),
            // Wrapped so even a synchronous throw lands in the catch, not in the home's.
            Promise.resolve().then(() => api.calendar()).catch(() => null),
          ]);
          if (!alive) return;
          setHome(h);
          if (c) setCal(c);
          setState('ok');
          setAttempt(0);
        } catch {
          if (!alive) return;
          if (n < HOME_RETRIES) {
            setAttempt(n + 1);
            // Growing gaps: a cold start is seconds, and hammering it does not help.
            timer = setTimeout(() => load(n + 1), 1_500 * (n + 1));
            return;
          }
          setState('error');
        }
      };
      setState((cur) => (cur === 'ok' ? cur : 'loading'));
      void load(0);
      return () => { alive = false; if (timer) clearTimeout(timer); };
      // locale: the continue-card title is localized server-side, so reload on a language change
    }, [locale]),
  );

  const retry = () => {
    setState('loading');
    setAttempt(0);
    void api.home().then((h) => { setHome(h); setState('ok'); }).catch(() => setState('error'));
  };

  if (state !== 'ok' || !home) {
    return (
      <Sheet>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 }}>
          {state === 'loading' ? (
            <>
              <ActivityIndicator color={nb.ink} />
              <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center' }]}>
                {attempt > 0 ? t('home.waking') : ''}
              </Text>
            </>
          ) : (
            <>
              <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('home.loadFailed')}</Text>
              <NbButton variant="ink" onPress={retry} icon="pencil" iconColor={nb.paper}>
                {t('common.retry')}
              </NbButton>
            </>
          )}
        </View>
      </Sheet>
    );
  }

  const go = (id: string) => router.push(id.startsWith('QZ-') ? `/quiz/${id}` : `/scenario/${id}`);

  const startToday = () => {
    const id = home.todayOne?.scenarioId;
    // Same routing rule the 일터 tab uses — the home task is a shortcut into the existing
    // curriculum flow, not a parallel one.
    if (id) go(id);
  };

  /** Answer today's 호출, then enter the scenario it points at.
   *
   *  The server is asked FIRST and the navigation follows its answer: it decides whether
   *  the bonus is payable (once) and whether the window is still open. Entering the
   *  scenario before hearing back would let an expired call still be played. */
  const answerPage = async () => {
    try {
      const { scenarioId } = await api.acceptPage();
      const id = scenarioId || home.page?.scenarioId;
      if (!id) return;
      // ACCEPTED, not answered. The bonus is the server's to grant, on the next home read,
      // once it can see the scenario was actually started.
      setHome({ ...home, page: { ...home.page!, accepted: true } });
      go(id);
    } catch {
      // Expired or gone: the next home load drops the badge on its own.
    }
  };

  /** Paging asks the server, and shows the month it ANSWERED with. */
  const pageMonth = (delta: number) => {
    const base = cal.month || home.date.slice(0, 7);
    const [y, m] = base.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    setSelected(null);
    void api.calendar(next).then(setCal).catch(() => {});
  };

  // A call is drawn while it can still be acted on: open with time left, or accepted and
  // not yet answered — the accepted one is the way back into a conversation left midway (R5).
  const page = home.page;
  const ringing = !!page && !page.answered && (page.accepted || page.secondsLeft > 0);

  const one = home.todayOne;
  const dp = one?.deptProgress ?? one?.progress;
  const ring = dp && dp.total > 0 ? dp.done / dp.total : 0;
  const cells = one?.progress ? continueCells(one.progress.done, one.progress.total) : 0;

  return (
    <Sheet>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: TOP_INSET - 10, paddingBottom: 150 }}>
        <HomeTopRow
          face={face}
          streak={home.streak}
          ringing={ringing}
          labels={{
            face: t('home.a11y.face'),
            streak: t('home.a11y.streak', { n: home.streak }),
            call: page?.line ?? '',
          }}
          onFace={() => router.push('/me')}
          onCall={answerPage}
        />
        <HomeCalendar
          month={cal.month || home.date.slice(0, 7)}
          days={cal.days}
          today={home.date}
          selected={selected}
          onSelect={setSelected}
          onMonth={pageMonth}
          dayLabel={(d) => t('home.a11y.day', {
            date: d.date,
            band: t(bandLabelKey(undefined, d.band)),
            n: d.cleared,
          })}
        />
      </ScrollView>

      {/* ③ 버튼 하나 — pinned 30 above the tab bar (home3: bottom 98 over a 68 bar). */}
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 30 }}>
        {one ? (
          <ContinueBar
            dept={one.dept}
            ring={ring}
            cells={cells}
            label={t('home.a11y.continue', { chapter: one.chapter, title: one.title })}
            onPress={startToday}
          />
        ) : (
          // Everything finished: the rest card in the button's place (R6).
          <NbPaper rot={-0.5} tape tapeLeft={90} style={{ paddingVertical: 16, paddingHorizontal: 16 }}>
            <Text style={[nbText.hand(20)]}>{t('home.restToday')}</Text>
            <Text style={[nbText.body(11, nb.soft), { marginTop: 4 }]}>
              {t('home.restSub', { n: home.streak + 1 })}
            </Text>
          </NbPaper>
        )}
      </View>
    </Sheet>
  );
}

/** The ruled page everything sits on. Local to this screen so the rule count can follow
 *  the screen height rather than a guess. */
function Sheet({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(900);
  return (
    <View
      style={{ flex: 1, backgroundColor: nb.cream }}
      onLayout={(e) => setH(e.nativeEvent.layout.height)}
    >
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
        {Array.from({ length: Math.ceil(h / RULE_H) }).map((_, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
        ))}
      </View>
      {children}
    </View>
  );
}
