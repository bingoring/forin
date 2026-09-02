// 오늘의 성장 리포트 (growth report) — the detail screen behind the "나" tab's
// growth-report card. 1:1 in layout with the v17 handoff ScreenGrowth: a hero
// report card, this-week attendance strip, a 2×2 stat grid, and a praise-sticker
// board. Wired to live data (GET /me/progress + /me/review); metrics without a
// server source yet are derived honestly from what we have.
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, ScrollView, Text, View , useWindowDimensions } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { PixelChip } from '@/components/PixelChip';
import { PixelIcon, iconFor } from '@/components/PixelIcon';
import { FIcon } from '@/components/FIcon';
import { EmojiIcon } from '@/components/EmojiIcon';
import { api, type CalendarDay, type Progress, type GrowthStats } from '@/api/client';
import { careerFor } from '@/data/economy';
import { colors, fonts, fs } from '@/theme/tokens';
import { t, type Translate, useLocale, useT } from '@/i18n';
import { ActivityCalendar } from '@/components/growth/ActivityCalendar';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbMark, NbPaper, NbStamp, NbTag, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, nb, nbFonts } from '@/theme/nb';
import { DayDetail } from '@/components/growth/DayDetail';
import { PLACE_SCREEN } from '@/theme/transitions';

const C = colors.ink;
/** Today's weekday and date in the reader's language.
 *
 *  Intl rather than a Korean array plus a "월 일" template: the order of month and
 *  day differs per language, so a translated template would still read wrong. */
function weekdayLabel(d: Date, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
  } catch {
    return '';
  }
}

function monthDayLabel(d: Date, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric' }).format(d);
  } catch {
    return d.toDateString();
  }
}
// The attendance strip is a rolling window ending today — 10 days, not a week.
const STRIP_DAYS = 10;

// Local yyyy-mm-dd for a Date. The server buckets activeDates in the device
// timezone (sent by the client), so the week grid is built in local time too.
function localDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function fmtMinutes(t: Translate, seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 60) return t('growth.minutes', { n: m });
  return t('growth.hoursMinutes', { h: Math.floor(m / 60), m: m % 60 });
}

export default function Growth() {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [stats, setStats] = useState<GrowthStats | null>(null);
  // The calendar is the report's new opening: it answers when and what, which the
  // counters never did. Month is what the SERVER answered with, so paging cannot drift
  // from what is drawn.
  // null means the calendar could not be loaded at all — deliberately NOT the same value
  // as a month with no study in it. Collapsing the two is what produced the report the
  // user saw: a full grid of pale, dead cells that looked like data and answered nothing.
  const [cal, setCal] = useState<{ month: string; days: CalendarDay[] } | null>(null);
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [job, setJob] = useState<string | undefined>(undefined);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const [p, s, c, me] = await Promise.all([
            api.progress(), api.growthStats(),
            // Caught, not awaited bare: GET /me/calendar is newer than some running
            // servers, and a 404 here used to reject the whole Promise.all and put the
            // screen into its error state — the report vanished because ONE optional
            // panel could not load. Degrading to null keeps the rest of the report while
            // letting the panel say what happened.
            api.calendar().catch(() => null),
            api.me().catch(() => null),
          ]);
          if (!alive) return;
          setProgress(p);
          setStats(s);
          setCal(c);
          // The job decides what the bands are CALLED — a nurse reads shifts, everyone
          // else reads the time of day (data/shifts.ts).
          setJob((me as { profile?: { job?: string } } | null)?.profile?.job);
          setState('ok');
        } catch {
          if (alive) setState('error');
        }
      })();
      return () => { alive = false; };
    }, []),
  );

  // Paging asks the server for a month and takes the month it answers with. Computing
  // the next month locally and then trusting it would drift the moment the server
  // clamps or normalises the range.
  const shiftMonth = async (delta: number) => {
    const [y, m] = (cal?.month || monthNow()).split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    // A failed page used to be swallowed, so the arrows looked broken rather than
    // unavailable — the same silence that made the first load unreadable.
    const got = await api.calendar(next).catch(() => null);
    setCal(got);
    setPickedDay(null);
  };

  const reloadCalendar = async () => {
    setCal(await api.calendar().catch(() => null));
    setPickedDay(null);
  };

  // today's date + weekday, and the current-week attendance from the server's
  // activeDates (bucketed in the device timezone → built in local time here).
  // A rolling window ending today, not a calendar week. Feedback: the week
  // number told the learner nothing — "how many days in a row" is the thing
  // they actually care about, and a Mon-anchored strip makes a Sunday start
  // look like a broken streak.
  const { dateLabel, dow, days, attended } = useMemo(() => {
    const now = new Date();
    const d = monthDayLabel(now, locale);
    const active = new Set(stats?.activeDates ?? []);
    const ds = Array.from({ length: STRIP_DAYS }, (_, i) => {
      const cell = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (STRIP_DAYS - 1 - i));
      return {
        key: localDate(cell),
        label: `${cell.getDate()}`,
        today: i === STRIP_DAYS - 1,
        filled: active.has(localDate(cell)),
      };
    });
    return { dateLabel: d, dow: weekdayLabel(now, locale), days: ds, attended: ds.filter((x) => x.filled).length };
  }, [stats, locale]);

  const back = () => router.back();

  return (
    <View style={{ flex: 1, backgroundColor: nb.cream }}>
      <Stack.Screen options={PLACE_SCREEN} />
      <Rules />

      {/* The date is TYPED and the heading is written: the day is a fact the calendar
          stamps, the report is the nurse's own page. */}
      <View style={{ paddingTop: 52, paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable onPress={back} hitSlop={8}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <Text numberOfLines={1} style={[nbText.hand(24), { flex: 1, minWidth: 0 }]}>{t('growth.nbTitle')}</Text>
        <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 9.5, letterSpacing: 1.5, color: nb.soft }}>
          {dateLabel}
        </Text>
      </View>

      {state === 'loading' && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={nb.ink} /></View>}
      {state === 'error' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
          <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('growth.loadFailed')}</Text>
          <NbButton variant="paper" onPress={back}>{t('common.back')}</NbButton>
        </View>
      )}

      {state === 'ok' && progress && stats && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40, gap: 16 }}>
          {/* The calendar opens the report. The counters below still answer "how much",
              but "when, and what" is the question a roster-shaped week actually asks,
              and it had no answer here before. */}
          <NbPaper rot={-0.5} tape tapeLeft={130} style={{ padding: 12 }}>
              {!cal ? (
                <View style={{ paddingVertical: 22, alignItems: 'center', gap: 12 }}>
                  <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center' }]}>
                    {t('growth.calendarUnavailable')}
                  </Text>
                  <NbButton variant="paper" onPress={() => void reloadCalendar()}>{t('common.retry')}</NbButton>
                </View>
              ) : (
                <>
              <ActivityCalendar
                month={cal.month || monthNow()}
                days={cal.days}
                job={job}
                selected={pickedDay}
                onSelect={setPickedDay}
                onMonth={(d) => void shiftMonth(d)}
              />
              {cal.days.length === 0 && (
                /* An empty grid needs to say it is empty. Without this the month reads as
                   a loading failure, which is exactly how it was read. */
                <Text style={[nbText.hand(15, nb.soft), { textAlign: 'center', marginTop: 9 }]}>
                  {t('growth.calendarEmpty')}
                </Text>
              )}
              {(() => {
                const day = cal.days.find((x) => x.date === pickedDay);
                return day ? (
                  <DayDetail
                    day={day}
                    job={job}
                    // Straight into the thing they studied — the report is a way back in,
                    // not a dead end.
                    onOpen={(id) => router.push(id.startsWith('QZ-') ? `/quiz/${id}` : `/scenario/${id}`)}
                  />
                ) : null;
              })()}
                </>
              )}
          </NbPaper>

          {/* The report card. One line, and the streak stamped beside it — the row of
              ten day-boxes that used to sit under this is GONE (07: 연속스트립 삭제 확정).
              It was a chart of your own emptiness on a quiet week, and the stamp says the
              same thing without drawing the gaps. */}
          <NbPaper rot={0.5} style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 11, color: nb.blue, letterSpacing: 1 }}>
                {t('growth.reportTitle')}
              </Text>
              <Text style={[nbText.hand(19), { marginTop: 6, lineHeight: 24 }]}>
                {progress.streakCurrent > 0 ? t('growth.cameInAgain') : t('growth.goodToSeeYou')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
                <NbTag color={nb.soft}>{t('growth.longest', { n: progress.streakLongest })}</NbTag>
                <NbTag color={nb.soft}>{progress.xp.toLocaleString()} XP</NbTag>
              </View>
            </View>
            {progress.streakCurrent > 0 && (
              <NbStamp color={nb.red} rot={9} size={66} top={t('home.streakStamp')} bottom={t('home.streakDays', { n: progress.streakCurrent })} />
            )}
          </NbPaper>

          {/* stat grid — this week's live activity (GET /me/stats) */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <StatTile label={t('growth.scenarios')} value={`${stats.scenariosWeek}`} sub={t('growth.thisWeekDone')} rot={-0.5} />
            <StatTile label={t('growth.newPhrases')} value={`${stats.newCardsWeek}`} sub={t('growth.thisWeekLearned')} rot={0.4} />
            <StatTile label={t('growth.talkTime')} value={fmtMinutes(t, stats.conversationSecondsWeek)} sub={t('growth.thisWeekFloor')} rot={-0.5} />
            <StatTile label={t('growth.level')} value={`Lv.${progress.level}`} sub={careerFor(progress.level).label} rot={-0.4} />
          </View>

          {/* The praise-sticker board stood here and is GONE (07: 스티커보드 삭제 확정).
              It was a hundred slots filled one per lifetime clear — a collection nobody
              could act on, on a screen whose job is to answer "when, and what". */}

          {/* The report is a way back in, not a dead end. */}
          <View style={{ marginTop: 2 }}>
            <NbButton variant="ink" size="lg" full icon="pencil" iconColor={nb.paper} onPress={() => router.replace('/campus')}>
              {t('growth.startShift')}
            </NbButton>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

/** The notebook's ruled lines, behind the report. */
function Rules() {
  const { height } = useWindowDimensions();
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
      {Array.from({ length: Math.ceil(height / RULE_H) }).map((_, i) => (
        <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
      ))}
    </View>
  );
}

/** One of the four counts. The big number is written; its label and unit are printed,
 *  because those are the column headings of a form and the number is what you filled in. */
function StatTile({ label, value, sub, rot }: { label: string; value: string; sub: string; rot: number }) {
  return (
    <View style={{ width: '47.5%' }}>
      <NbPaper rot={rot} style={{ padding: 12 }}>
        <Text numberOfLines={1} style={nbText.body(10.5, nb.soft)}>{label}</Text>
        <Text numberOfLines={1} style={[nbText.hand(26), { marginTop: 2 }]}>{value}</Text>
        <Text numberOfLines={1} style={[nbText.body(10, nb.soft), { marginTop: 2 }]}>{sub}</Text>
      </NbPaper>
    </View>
  );
}

/** This month, as the calendar API wants it. */
function monthNow(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// The praise-sticker board lived here — a hundred slots filled one per lifetime clear,
// toward a "자격증" nobody could reach. v29 removes it (07: 스티커보드 삭제 확정): it was a
// collection you could look at and not act on, on a screen whose job is to answer "when,
// and what did I do". The lifetime count it drew from is still in the stats.
