// 오늘의 성장 리포트 (growth report) — the detail screen behind the "나" tab's
// growth-report card. 1:1 in layout with the v17 handoff ScreenGrowth: a hero
// report card, this-week attendance strip, a 2×2 stat grid, and a praise-sticker
// board. Wired to live data (GET /me/progress + /me/review); metrics without a
// server source yet are derived honestly from what we have.
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { PixelChip } from '@/components/PixelChip';
import { api, type Progress } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;
const WD = ['월', '화', '수', '목', '금', '토', '일']; // Monday-first week strip

function careerTitle(level: number) {
  if (level >= 30) return 'Head Nurse';
  if (level >= 15) return 'Senior Nurse';
  if (level >= 5) return 'Junior Nurse';
  return 'Learner';
}

export default function Growth() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [cardCount, setCardCount] = useState(0);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const [p, cards] = await Promise.all([api.progress(), api.reviewDue().catch(() => [])]);
          if (!alive) return;
          setProgress(p);
          setCardCount(cards.length);
          setState('ok');
        } catch {
          if (alive) setState('error');
        }
      })();
      return () => { alive = false; };
    }, []),
  );

  // today's date + weekday, and the current-week attendance derived from the streak.
  const { dateLabel, dow, week, attended } = useMemo(() => {
    const now = new Date();
    const d = `${now.getMonth() + 1}월 ${now.getDate()}일`;
    const todayIdx = (now.getDay() + 6) % 7; // Mon=0 … Sun=6
    const streak = progress?.streakCurrent ?? 0;
    const w = WD.map((label, i) => ({
      label,
      today: i === todayIdx,
      // filled = a day on/before today that falls inside the current streak run
      filled: i <= todayIdx && todayIdx - i < streak,
    }));
    return { dateLabel: d, dow: WD[todayIdx], week: w, attended: w.filter((x) => x.filled).length };
  }, [progress]);

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

      {state === 'ok' && progress && (
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

          {/* stat grid — live metrics */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <StatTile label="레벨" value={`Lv.${progress.level}`} sub={careerTitle(progress.level)} color={colors.mint} />
            <StatTile label="누적 XP" value={progress.xp.toLocaleString()} sub="성장" color={colors.peach} />
            <StatTile label="환자 만족" value={`${progress.patientSatisfaction}%`} sub="평판" color={colors.yellow} />
            <StatTile label="복습 카드" value={`${cardCount}`} sub="오늘 대기" color={colors.pink} />
          </View>

          {/* reputation snapshot */}
          <Shadowed offset={3}>
            <View style={{ backgroundColor: colors.paper, borderWidth: 3, borderColor: C, padding: 14, gap: 2 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: colors.textSoft, marginBottom: 8 }}>평판 스냅샷</Text>
              <RepRow label="환자 만족도" value={progress.patientSatisfaction} color={colors.mint} />
              <RepRow label="동료 신뢰도" value={progress.peerTrust} color={colors.peach} />
              <RepRow label="응급 대응력" value={progress.emergencyResponse} color={colors.yellow} />
            </View>
          </Shadowed>

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

function RepRow({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 }}>
      <Text style={{ width: 78, fontFamily: fonts.body, fontSize: 11, color: C }}>{label}</Text>
      <View style={{ flex: 1, height: 12, backgroundColor: colors.cream, borderWidth: 2, borderColor: C }}>
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: color }} />
      </View>
      <Text style={{ width: 34, textAlign: 'right', fontFamily: fonts.heading, fontSize: 11, color: C }}>{pct}%</Text>
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
