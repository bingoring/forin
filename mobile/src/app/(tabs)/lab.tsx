// 리뷰랩 (review lab) tab — the "speak-like-a-local" oops-note. Shows the SM-2
// cards due today (GET /me/review), each an AI correction: the original phrasing
// struck through, the natural correction highlighted, and a why-note. The learner
// self-rates recall (다시/어려움/알맞음/쉬움 → POST /me/review/{id}/grade), which
// advances the spaced-repetition schedule; graded cards leave today's queue.
// 🔊 speaks the corrected line (expo-speech). 1:1 in spirit with v17 ScreenReviewLab.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Speech from 'expo-speech';
import { api, type ReviewCard, type ReviewGrade } from '@/api/client';
import { colors, fonts, space, type as t } from '@/theme/tokens';

const C = colors.ink;
const GRADES: { g: ReviewGrade; label: string; bg: string }[] = [
  { g: 'again', label: '다시', bg: '#FCA5A5' },
  { g: 'hard', label: '어려움', bg: colors.peach },
  { g: 'good', label: '알맞음', bg: colors.mint },
  { g: 'easy', label: '쉬움', bg: colors.yellow },
];

export default function Lab() {
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      api.reviewDue()
        .then((c) => { if (alive) { setCards(c); setState('ok'); } })
        .catch(() => { if (alive) setState('error'); });
      return () => { alive = false; };
    }, []),
  );

  const grade = async (id: string, g: ReviewGrade) => {
    setCards((prev) => prev.filter((c) => c.id !== id)); // optimistic: leave today's queue
    try { await api.gradeReview(id, g); } catch { /* best-effort; refreshes on next focus */ }
  };

  if (state !== 'ok') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        {state === 'loading' ? <ActivityIndicator color={C} /> : <Text style={{ fontFamily: fonts.body, fontSize: t.body, color: colors.textSoft, textAlign: 'center' }}>리뷰 카드를 불러오지 못했어요. (로그인·서버 확인)</Text>}
      </View>
    );
  }

  const mastered = cards.filter((c) => c.masteryPips >= 3).length;
  const favorites = cards.filter((c) => c.favorite).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 56, paddingBottom: 40, gap: space.md }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: t.screenHeading, color: C }}>리뷰랩 · 오답노트</Text>

        {/* hero */}
        <Shadowed offset={4}>
          <View style={{ backgroundColor: colors.pink, borderWidth: 3, borderColor: C, padding: 14 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C, opacity: 0.7 }}>오늘의 복습</Text>
            <Text style={{ fontFamily: fonts.heading, fontSize: 17, color: C, marginTop: 5, lineHeight: 23 }}>
              {cards.length > 0 ? `${cards.length}개 카드 복습할 시간이에요` : '오늘 복습할 카드가 없어요 🎉'}
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C, marginTop: 8, lineHeight: 16 }}>
              AI가 교정한 문장을 '현지인처럼 말하기' 카드로 바꿨어요. 기억이 흐려지기 전에 한 번 더 말해볼까요?
            </Text>
          </View>
        </Shadowed>

        {/* mini stats */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <MiniStat label="복습 대기" value={cards.length} color="#FCA5A5" />
          <MiniStat label="숙련(3)" value={mastered} color={colors.mint} />
          <MiniStat label="즐겨찾기" value={favorites} color={colors.yellow} />
        </View>

        {/* cards */}
        {cards.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40, gap: 8 }}>
            <Text style={{ fontSize: 40 }}>📓</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textSoft, textAlign: 'center', lineHeight: 18 }}>모든 복습을 마쳤어요!{'\n'}시나리오 대화에서 새 교정 카드가 쌓입니다.</Text>
          </View>
        ) : (
          cards.map((c) => <PhraseCard key={c.id} card={c} onGrade={grade} />)
        )}
      </ScrollView>
    </View>
  );
}

function PhraseCard({ card, onGrade }: { card: ReviewCard; onGrade: (id: string, g: ReviewGrade) => void }) {
  const speak = () => Speech.speak(card.back, { language: 'en-US', rate: 0.92 });
  return (
    <Shadowed offset={4}>
      <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C }}>
        {/* header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, paddingHorizontal: 10, backgroundColor: colors.mint, borderBottomWidth: 2.5, borderBottomColor: C }}>
          <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: 10, color: C }}>{card.topicTag || '교정 노트'}</Text>
          <View style={{ backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: C, paddingHorizontal: 5 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: '#fff' }}>복습</Text>
          </View>
        </View>

        <View style={{ padding: 12 }}>
          {/* bad */}
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
            <Badge text="✕" bg="#FEE2E2" color="#B91C1C" />
            <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 12, color: colors.textFaint, textDecorationLine: 'line-through', lineHeight: 17 }}>{card.front}</Text>
          </View>
          {/* good */}
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginTop: 8 }}>
            <Badge text="✓" bg={colors.mint} color={C} />
            <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 13, color: C, lineHeight: 18 }}>{card.back}</Text>
            <Pressable onPress={speak} hitSlop={8}><Text style={{ fontSize: 16 }}>🔊</Text></Pressable>
          </View>

          {/* note */}
          {!!card.note && (
            <View style={{ marginTop: 10, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: '#2A252255', borderStyle: 'dashed', paddingVertical: 6, paddingHorizontal: 8 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.text, lineHeight: 15 }}><Text style={{ fontFamily: fonts.heading, color: C }}>왜? </Text>{card.note}</Text>
            </View>
          )}

          {/* mastery pips */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft, marginRight: 2 }}>숙련</Text>
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ width: 10, height: 10, borderWidth: 1.5, borderColor: C, backgroundColor: i < card.masteryPips ? colors.mint : '#fff' }} />
            ))}
          </View>

          {/* grade buttons */}
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
            {GRADES.map(({ g, label, bg }) => (
              <Pressable key={g} onPress={() => onGrade(card.id, g)} style={{ flex: 1 }}>
                <View style={{ backgroundColor: bg, borderWidth: 2, borderColor: C, paddingVertical: 7, alignItems: 'center' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C }}>{label}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Shadowed>
  );
}

function Badge({ text, bg, color }: { text: string; bg: string; color: string }) {
  return (
    <View style={{ backgroundColor: bg, borderWidth: 1.5, borderColor: C, paddingHorizontal: 4, marginTop: 1 }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 9, color }}>{text}</Text>
    </View>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Shadowed offset={3} style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 10, alignItems: 'center' }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, backgroundColor: color, borderBottomWidth: 1.5, borderBottomColor: C }} />
        <Text style={{ fontFamily: fonts.heading, fontSize: 20, color: C, marginTop: 4 }}>{value}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 9, color: colors.textSoft, marginTop: 2 }}>{label}</Text>
      </View>
    </Shadowed>
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
