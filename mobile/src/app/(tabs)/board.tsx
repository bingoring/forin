// 오늘의 상황판 (situation board) — a daily-rotated set of scenario cards from
// the server (api.boardToday), grouped by department with filter chips. Tapping a
// card fast-travels to that scenario's briefing. 1:1 with the v17 handoff
// screen-event-board (per-scenario cards, urgent/quest counts, dept filter).
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { api, type BoardCard } from '@/api/client';
import { colors, fonts, space, type as t } from '@/theme/tokens';

const C = colors.ink;

// dept code → label + icon. Falls back to the code + card color for unknown depts.
const DEPT_META: Record<string, { label: string; icon: string }> = {
  ER: { label: '응급실', icon: '🚑' }, OR: { label: '수술실', icon: '🔪' }, ICU: { label: '중환자실', icon: '🛏' },
  PEDS: { label: '소아과', icon: '👶' }, PHARMA: { label: '약국', icon: '💊' },
  LD: { label: '분만실', icon: '🤰' }, NICU: { label: '신생아중환자실', icon: '🍼' }, PICU: { label: '소아중환자실', icon: '🧸' },
  NURSERY: { label: '신생아실', icon: '👶' }, WOMENKIDS: { label: '여성소아외래', icon: '🌸' },
  RAD: { label: '영상의학', icon: '🩻' }, ENDO: { label: '내시경', icon: '🔬' }, DIAL: { label: '인공신장실', icon: '💧' },
  SPECIALTY: { label: '특수외래', icon: '👁' }, INFUSION: { label: '주사센터', icon: '💉' },
  ONCO: { label: '암센터', icon: '🎗' }, HOSPICE: { label: '호스피스', icon: '🕊' }, GERI: { label: '노인병동', icon: '👵' },
  PSYCH: { label: '정신과', icon: '🧠' }, REHAB: { label: '재활', icon: '🦿' },
  SIM: { label: '시뮬레이션랩', icon: '🎓' }, LOUNGE: { label: '라운지', icon: '☕' }, SPD: { label: '중앙공급', icon: '📦' },
  MORGUE: { label: '영안실', icon: '🕯' }, GEN: { label: '공통', icon: '🏥' },
};
const urgencyColor = (u: string) => (u === 'urgent' ? '#FCA5A5' : u === 'info' ? colors.mint : colors.yellow);

export default function Board() {
  const router = useRouter();
  const [cards, setCards] = useState<BoardCard[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    let alive = true;
    api.boardToday().then((c) => { if (alive) { setCards(c); setState('ok'); } }).catch(() => { if (alive) setState('error'); });
    return () => { alive = false; };
  }, []);

  const depts = useMemo(() => Array.from(new Set(cards.map((c) => c.dept))), [cards]);
  const urgent = cards.filter((c) => c.urgency === 'urgent').length;
  const quest = cards.filter((c) => c.urgency === 'quest').length;
  const shown = filter === 'ALL' ? cards : cards.filter((c) => c.dept === filter);

  if (state !== 'ok') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        {state === 'loading' ? <ActivityIndicator color={C} /> : <Text style={{ fontFamily: fonts.body, fontSize: t.body, color: colors.textSoft, textAlign: 'center' }}>상황판을 불러오지 못했어요. (서버 확인)</Text>}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 40, gap: space.md }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: t.screenHeading, color: C }}>오늘의 상황판</Text>

        {/* summary */}
        <View style={{ backgroundColor: colors.mint, borderWidth: 3, borderColor: C, padding: space.lg }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: t.section, color: C }}>현장 상황 {cards.length}건 발생</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: t.caption, color: C, marginTop: 4 }}>🔴 긴급 {urgent} · 🟡 일반 {quest}</Text>
        </View>

        {/* filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 2 }}>
          {['ALL', ...depts].map((d) => {
            const active = filter === d;
            const label = d === 'ALL' ? '✨ 전체' : `${DEPT_META[d]?.icon ?? ''} ${DEPT_META[d]?.label ?? d}`;
            return (
              <Pressable key={d} onPress={() => setFilter(d)} style={{ backgroundColor: active ? C : '#fff', borderWidth: 2, borderColor: C, paddingVertical: 5, paddingHorizontal: 10 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: active ? '#fff' : C }}>{label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* cards */}
        {shown.map((c) => (
          <Pressable key={c.id} onPress={() => router.push(`/scenario/${c.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.cream, borderWidth: 3, borderColor: C, padding: space.md }}>
            <View style={{ width: 8, alignSelf: 'stretch', backgroundColor: urgencyColor(c.urgency), borderWidth: 1.5, borderColor: C }} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ backgroundColor: c.deptColor || C, paddingHorizontal: 5, paddingVertical: 1 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: '#fff' }}>{DEPT_META[c.dept]?.icon ?? ''} {DEPT_META[c.dept]?.label ?? c.dept}</Text>
                </View>
                {c.urgency === 'urgent' && <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: '#DC2626' }}>❗긴급</Text>}
              </View>
              <Text style={{ fontFamily: fonts.heading, fontSize: t.body, color: C, marginTop: 4 }}>{c.title}</Text>
              {!!c.tagline && <Text style={{ fontFamily: fonts.body, fontSize: t.caption, color: colors.textSoft, fontStyle: 'italic', marginTop: 2 }} numberOfLines={1}>{c.tagline}</Text>}
            </View>
            <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: colors.textSoft }}>›</Text>
          </Pressable>
        ))}
        {shown.length === 0 && <Text style={{ fontFamily: fonts.body, fontSize: t.caption, color: colors.textFaint, textAlign: 'center', marginTop: 20 }}>이 부서엔 오늘 발생한 상황이 없어요.</Text>}
      </ScrollView>
    </View>
  );
}
