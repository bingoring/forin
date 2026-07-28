// 오늘의 성장 리포트 (growth report) — the detail screen behind the "나" tab's
// growth-report card. 1:1 in layout with the v17 handoff ScreenGrowth: a hero
// report card, this-week attendance strip, a 2×2 stat grid, and a praise-sticker
// board. Wired to live data (GET /me/progress + /me/review); metrics without a
// server source yet are derived honestly from what we have.
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { PixelChip } from '@/components/PixelChip';
import { api, type Progress, type GrowthStats } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;
const WD = ['월', '화', '수', '목', '금', '토', '일']; // Monday-first week strip

// Local yyyy-mm-dd for a Date. The server buckets activeDates in the device
// timezone (sent by the client), so the week grid is built in local time too.
function localDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function fmtMinutes(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}분`;
  return `${Math.floor(m / 60)}시간 ${m % 60}분`;
}

function careerTitle(level: number) {
  if (level >= 30) return 'Head Nurse';
  if (level >= 15) return 'Senior Nurse';
  if (level >= 5) return 'Junior Nurse';
  return 'Learner';
}

export default function Growth() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [stats, setStats] = useState<GrowthStats | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const [p, s] = await Promise.all([api.progress(), api.growthStats()]);
          if (!alive) return;
          setProgress(p);
          setStats(s);
          setState('ok');
        } catch {
          if (alive) setState('error');
        }
      })();
      return () => { alive = false; };
    }, []),
  );

  // today's date + weekday, and the current-week attendance from the server's
  // activeDates (bucketed in the device timezone → built in local time here).
  const { dateLabel, dow, week, attended } = useMemo(() => {
    const now = new Date();
    const d = `${now.getMonth() + 1}월 ${now.getDate()}일`;
    const todayIdx = (now.getDay() + 6) % 7; // Mon=0 … Sun=6
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - todayIdx);
    const active = new Set(stats?.activeDates ?? []);
    const w = WD.map((label, i) => {
      const cell = new Date(monday);
      cell.setDate(monday.getDate() + i);
      return { label, today: i === todayIdx, filled: active.has(localDate(cell)) };
    });
    return { dateLabel: d, dow: WD[todayIdx], week: w, attended: w.filter((x) => x.filled).length };
  }, [stats]);

  const back = () => router.back();

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack.Screen options={{ headerShown: false, animation: 'slide_from_right' }} />

      {/* top bar */}
      <View style={{ paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <PixelButton label="‹ 뒤로" bg="#fff" shadowColor={C} offset={2} fontSize={11} borderWidth={2} paddingV={4} paddingH={10} onPress={back} />
        <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>TODAY · {dateLabel}</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: colors.textSoft, width: 44, textAlign: 'right' }}>{dow}요일</Text>
      </View>

      {state === 'loading' && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C} /></View>}
      {state === 'error' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textSoft, textAlign: 'center' }}>리포트를 불러오지 못했어요.</Text>
          <PixelButton label="‹ 돌아가기" onPress={back} />
        </View>
      )}

      {state === 'ok' && progress && stats && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40, gap: 16 }}>
          {/* hero report card */}
          <Shadowed offset={4} shadowColor={colors.mintShadow}>
            <View style={{ backgroundColor: colors.mint, borderWidth: 3, borderColor: C, padding: 16 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C, opacity: 0.7 }}>오늘의 성장 리포트</Text>
              {progress.streakCurrent > 0 ? (
                <Text style={{ fontFamily: fonts.heading, fontSize: 19, color: C, lineHeight: 27, marginTop: 6 }}>
                  오늘도 출근했어요!{'\n'}
                  <Text style={{ backgroundColor: colors.yellow }}> {progress.streakCurrent}일 연속 </Text> 성장 중이에요
                </Text>
              ) : (
                <Text style={{ fontFamily: fonts.heading, fontSize: 19, color: C, lineHeight: 27, marginTop: 6 }}>
                  다시 만나 반가워요!{'\n'}오늘 <Text style={{ backgroundColor: colors.yellow }}> 첫 걸음 </Text>을 떼어볼까요?
                </Text>
              )}
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
                <PixelChip label={`🔥 최장 ${progress.streakLongest}일`} bg={colors.yellow} />
                <PixelChip label={`${progress.xp.toLocaleString()} XP`} bg="#fff" />
              </View>
              <Text style={{ position: 'absolute', top: -6, right: -2, fontSize: 24, transform: [{ rotate: '12deg' }] }}>✨</Text>
            </View>
          </Shadowed>

          {/* this-week attendance */}
          <Shadowed offset={3}>
            <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>이번 주 출석</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft }}>{attended}/7일</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {week.map((d) => (
                  <View key={d.label} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft, marginBottom: 4 }}>{d.label}</Text>
                    <Shadowed offset={d.today ? 2 : 0} shadowColor={colors.yellowShadow} style={{ alignSelf: 'stretch' }}>
                      <View style={{ height: 30, backgroundColor: d.filled ? colors.mint : '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>{d.filled ? '✓' : d.today ? '!' : '·'}</Text>
                      </View>
                    </Shadowed>
                  </View>
                ))}
              </View>
            </View>
          </Shadowed>

          {/* stat grid — this week's live activity (GET /me/stats) */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <StatTile label="시나리오" value={`${stats.scenariosWeek}`} sub="이번 주 완료" color={colors.mint} />
            <StatTile label="새 표현" value={`${stats.newCardsWeek}`} sub="이번 주 배움" color={colors.peach} />
            <StatTile label="대화 시간" value={fmtMinutes(stats.conversationSecondsWeek)} sub="이번 주 현장" color={colors.pink} />
            <StatTile label="레벨" value={`Lv.${progress.level}`} sub={careerTitle(progress.level)} color={colors.yellow} />
          </View>

          {/* 칭찬 스티커 보드 — 시나리오 클리어 1회당 스티커 1장(누적) */}
          <StickerBoard earned={stats.scenariosTotal} />

          {/* go practice */}
          <View style={{ marginTop: 2 }}>
            <PixelButton label="▶  오늘의 근무 시작하기" bg={colors.yellow} shadowColor={colors.yellowShadow} full onPress={() => router.replace('/campus')} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function StatTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <Shadowed offset={3} shadowColor={C + '66'} style={{ width: '47.5%' }}>
      <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 12 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft }}>{label}</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: 24, color: C, marginTop: 4 }}>{value}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, marginTop: 2 }}>{sub}</Text>
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

function StickerBoard({ earned }: { earned: number }) {
  const filled = Math.max(0, Math.min(SLOTS, earned));
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>★ 칭찬 스티커 보드</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft }}>{earned} / {CAPACITY}</Text>
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
                  <View style={{ width: TILE, height: TILE, backgroundColor: s.bg, borderWidth: 3, borderColor: C, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: s.rot }] }}>
                    <Text style={{ fontSize: 22, color: C }}>{s.e}</Text>
                  </View>
                </Shadowed>
              ) : (
                <View key={i} style={{ width: TILE, height: TILE, borderWidth: 2, borderColor: C + '33', borderStyle: 'dashed' }} />
              );
            })}
          </View>
          <Text style={{ marginTop: 12, fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, textAlign: 'center' }}>· · · 빈 칸이 채워질 때마다 새 자격증이 열려요 · · ·</Text>
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
