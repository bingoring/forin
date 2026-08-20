// 오늘의 성장 리포트 (growth report) — the detail screen behind the "나" tab's
// growth-report card. 1:1 in layout with the v17 handoff ScreenGrowth: a hero
// report card, this-week attendance strip, a 2×2 stat grid, and a praise-sticker
// board. Wired to live data (GET /me/progress + /me/review); metrics without a
// server source yet are derived honestly from what we have.
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { PixelChip } from '@/components/PixelChip';
import { InfoSheet, type InfoSheetData } from '@/components/InfoSheet';
import { PixelIcon, iconFor } from '@/components/PixelIcon';
import { api, type CalendarDay, type Progress, type GrowthStats } from '@/api/client';
import { careerFor } from '@/data/economy';
import { colors, fonts, fs } from '@/theme/tokens';
import { t, useLocale } from '@/i18n';
import { ActivityCalendar } from '@/components/growth/ActivityCalendar';
import { DayDetail } from '@/components/growth/DayDetail';

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
function fmtMinutes(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 60) return t('growth.minutes', { n: m });
  return t('growth.hoursMinutes', { h: Math.floor(m / 60), m: m % 60 });
}

export default function Growth() {
  const locale = useLocale();
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [stats, setStats] = useState<GrowthStats | null>(null);
  // The calendar is the report's new opening: it answers when and what, which the
  // counters never did. Month is what the SERVER answered with, so paging cannot drift
  // from what is drawn.
  const [cal, setCal] = useState<{ month: string; days: CalendarDay[] }>({ month: '', days: [] });
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [job, setJob] = useState<string | undefined>(undefined);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [sheet, setSheet] = useState<InfoSheetData | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const [p, s, c, me] = await Promise.all([
            api.progress(), api.growthStats(),
            // Caught, not awaited bare: GET /me/calendar is newer than some deployed
            // servers, and a 404 here used to reject the whole Promise.all and put the
            // screen into its error state — the report vanished because ONE optional
            // panel could not load. An empty calendar is the correct degradation.
            api.calendar().catch(() => ({ month: '', days: [] as CalendarDay[] })),
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
    const [y, m] = (cal.month || monthNow()).split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const got = await api.calendar(next).catch(() => null);
    if (got) {
      setCal(got);
      setPickedDay(null);
    }
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
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack.Screen options={{ headerShown: false, animation: 'slide_from_right' }} />

      {/* top bar */}
      <View style={{ paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <PixelButton label={t('common.back')} bg="#fff" shadowColor={C} offset={2} fontSize={11} borderWidth={2} paddingV={4} paddingH={10} onPress={back} />
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>TODAY · {dateLabel}</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: colors.textSoft, width: 44, textAlign: 'right' }}>{dow}요일</Text>
      </View>

      {state === 'loading' && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C} /></View>}
      {state === 'error' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(13), color: colors.textSoft, textAlign: 'center' }}>리포트를 불러오지 못했어요.</Text>
          <PixelButton label={t('common.back')} onPress={back} />
        </View>
      )}

      {state === 'ok' && progress && stats && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40, gap: 16 }}>
          {/* The calendar opens the report. The counters below still answer "how much",
              but "when, and what" is the question a roster-shaped week actually asks,
              and it had no answer here before. */}
          <Shadowed offset={4}>
            <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 12 }}>
              <ActivityCalendar
                month={cal.month || monthNow()}
                days={cal.days}
                job={job}
                selected={pickedDay}
                onSelect={setPickedDay}
                onMonth={(d) => void shiftMonth(d)}
              />
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
            </View>
          </Shadowed>

          {/* hero report card */}
          <Shadowed offset={4} shadowColor={colors.mintShadow}>
            <View style={{ backgroundColor: colors.mint, borderWidth: 3, borderColor: C, padding: 16 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C, opacity: 0.7 }}>{t('growth.reportTitle')}</Text>
              {progress.streakCurrent > 0 ? (
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(19), color: C, lineHeight: 27, marginTop: 6 }}>
                  오늘도 출근했어요!{'\n'}
                  <Text style={{ backgroundColor: colors.yellow }}> {progress.streakCurrent}일 연속 </Text> 성장 중이에요
                </Text>
              ) : (
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(19), color: C, lineHeight: 27, marginTop: 6 }}>
                  다시 만나 반가워요!{'\n'}오늘 <Text style={{ backgroundColor: colors.yellow }}> 첫 걸음 </Text>을 떼어볼까요?
                </Text>
              )}
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
                <PixelChip icon="flame" label={t('growth.longest', { n: progress.streakLongest })} bg={colors.yellow} />
                <PixelChip label={`${progress.xp.toLocaleString()} XP`} bg="#fff" />
              </View>
              <View style={{ position: 'absolute', top: -6, right: -2, transform: [{ rotate: '12deg' }] }}>
                <PixelIcon name="sparkle" color={colors.yellowDeep} size={24} sw={1.8} />
              </View>
            </View>
          </Shadowed>

          {/* this-week attendance */}
          <Shadowed offset={3}>
            <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>
                  {progress.streakCurrent > 0 ? t('growth.streakLearning', { n: progress.streakCurrent }) : t('growth.streak')}
                </Text>
                <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft }}>최근 {STRIP_DAYS}일 중 {attended}일</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 3 }}>
                {days.map((d) => (
                  <View key={d.key} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: colors.textSoft, marginBottom: 4 }}>{d.label}</Text>
                    <Shadowed offset={d.today ? 2 : 0} shadowColor={colors.yellowShadow} style={{ alignSelf: 'stretch' }}>
                      <View style={{ height: 30, backgroundColor: d.filled ? colors.mint : '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                        {d.filled ? (
                          <PixelIcon name="check" color={C} size={13} sw={2} />
                        ) : (
                          <View style={{ width: 4, height: 4, backgroundColor: d.today ? colors.yellowDeep : colors.textFaint }} />
                        )}
                      </View>
                    </Shadowed>
                  </View>
                ))}
              </View>
            </View>
          </Shadowed>

          {/* stat grid — this week's live activity (GET /me/stats) */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <StatTile label={t('growth.scenarios')} value={`${stats.scenariosWeek}`} sub={t('growth.thisWeekDone')} color={colors.mint} />
            <StatTile label={t('growth.newPhrases')} value={`${stats.newCardsWeek}`} sub={t('growth.thisWeekLearned')} color={colors.peach} />
            <StatTile label={t('growth.talkTime')} value={fmtMinutes(stats.conversationSecondsWeek)} sub={t('growth.thisWeekFloor')} color={colors.pink} />
            <StatTile label={t('growth.level')} value={`Lv.${progress.level}`} sub={careerFor(progress.level).label} color={colors.yellow} />
          </View>

          {/* 칭찬 스티커 보드 — 시나리오 클리어 1회당 스티커 1장(누적) */}
          <StickerBoard earned={stats.scenariosTotal} onPick={setSheet} />

          {/* go practice */}
          <View style={{ marginTop: 2 }}>
            <PixelButton icon="play" label={t('growth.startShift')} bg={colors.yellow} shadowColor={colors.yellowShadow} full onPress={() => router.replace('/campus')} />
          </View>
        </ScrollView>
      )}
      <InfoSheet data={sheet} onClose={() => setSheet(null)} />
    </View>
  );
}

function StatTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <Shadowed offset={3} shadowColor={C + '66'} style={{ width: '47.5%' }}>
      <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 12 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>{label}</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(24), color: C, marginTop: 4 }}>{value}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 2 }}>{sub}</Text>
        <View style={{ position: 'absolute', right: 8, top: 8, width: 12, height: 12, backgroundColor: color, borderWidth: 2, borderColor: C }} />
      </View>
    </Shadowed>
  );
}

// StickerBoard — 1:1 with the handoff ScreenGrowth praise-sticker board: a ruled
// paper card with a grid of collected stickers (earned = colored + rotated, locked
// = dashed), toward a 100-sticker "자격증" unlock. earned = lifetime scenario clears.
const STICKERS = [
  { e: '⭐', rot: '-6deg', bg: colors.yellow },
  { e: '❤', rot: '4deg', bg: colors.peach },
  { e: '🌸', rot: '-2deg', bg: colors.pink },
  { e: '✿', rot: '8deg', bg: colors.mint },
  { e: '★', rot: '-4deg', bg: colors.yellow },
  { e: '♡', rot: '2deg', bg: colors.peach },
  { e: '✚', rot: '-5deg', bg: colors.mint },
  { e: '☺', rot: '6deg', bg: colors.pink },
];
const SLOTS = 12; // preview slots (3 rows × 4)
const CAPACITY = 100;
const GAP = 12;
// Fixed square size — percentage width + aspectRatio collapses empty rows in a
// wrapped flex row, so derive an explicit tile size from the screen width.
const TILE = Math.floor((Dimensions.get('window').width - 36 /*page*/ - 34 /*card*/ - GAP * 3) / 4);

function StickerBoard({ earned, onPick }: { earned: number; onPick: (d: InfoSheetData) => void }) {
  const filled = Math.max(0, Math.min(SLOTS, earned));
  const howText = t('growth.stickerIntro');
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <PixelIcon name="star" color={C} size={16} sw={1.6} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: C }}>칭찬 스티커 보드</Text>
        </View>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft }}>{earned} / {CAPACITY}</Text>
      </View>
      <Shadowed offset={3}>
        <View style={{ backgroundColor: colors.paper, borderWidth: 3, borderColor: C, padding: 14, overflow: 'hidden' }}>
          {/* ruled-paper hairlines */}
          {Array.from({ length: 9 }).map((_, i) => (
            <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: 22 * (i + 1), height: 1, backgroundColor: C + '11' }} />
          ))}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
            {Array.from({ length: SLOTS }).map((_, i) => {
              const got = i < filled;
              const s = STICKERS[i % STICKERS.length];
              return got ? (
                <Shadowed key={i} offset={3} style={{ width: TILE, height: TILE }}>
                  <Pressable
                    onPress={() => onPick({
                      icon: s.e, iconNode: iconFor(s.e) ? <PixelIcon name={iconFor(s.e)!} color={C} size={34} sw={1.6} /> : undefined, iconBg: s.bg, title: t('growth.stickerNo', { n: i + 1 }),
                      status: { label: t('badge.earned'), bg: colors.mint },
                      what: t('growth.stickerBody', { n: earned }),
                      how: howText,
                    })}
                    style={{ width: TILE, height: TILE, backgroundColor: s.bg, borderWidth: 3, borderColor: C, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: s.rot }] }}>
                    {iconFor(s.e) ? <PixelIcon name={iconFor(s.e)!} color={C} size={24} /> : <Text style={{ fontSize: fs(22), color: C }}>{s.e}</Text>}
                  </Pressable>
                </Shadowed>
              ) : (
                <Pressable
                  key={i}
                  onPress={() => onPick({
                    icon: '➕', iconNode: <PixelIcon name="plus" color={C} size={30} sw={1.8} />, iconBg: colors.cream, title: t('growth.emptySticker'),
                    status: { label: t('badge.locked'), bg: colors.cream },
                    what: t('growth.emptyStickerBody'),
                    how: howText,
                  })}
                  style={{ width: TILE, height: TILE, borderWidth: 2, borderColor: C + '33', borderStyle: 'dashed' }} />
              );
            })}
          </View>
          <Text style={{ marginTop: 12, fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, textAlign: 'center' }}>· · · 빈 칸이 채워질 때마다 새 자격증이 열려요 · · ·</Text>
        </View>
      </Shadowed>
    </View>
  );
}

function Shadowed({ children, offset = 4, shadowColor = C, style }: { children: React.ReactNode; offset?: number; shadowColor?: string; style?: object }) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}

/** Current month as YYYY-MM, for the first page when the server has said nothing yet. */
function monthNow(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
