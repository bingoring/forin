// 오늘의 복습 세션 — a focused, one-card-at-a-time spaced-repetition run launched
// from the review lab's "오늘의 복습 시작". For each due card: recall the natural
// phrasing from your original line, reveal the AI correction + why-note (🔊 to
// hear it), then self-grade (다시/어려움/알맞음/쉬움 → POST /me/review/{id}/grade,
// SM-2). Ends with a completion summary. 1:1 in spirit with the review-lab flow.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { PixelButton } from '@/components/PixelButton';
import { api, type ReviewCard, type ReviewGrade } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;
const GRADES: { g: ReviewGrade; label: string; bg: string }[] = [
  { g: 'again', label: '다시', bg: '#FCA5A5' },
  { g: 'hard', label: '어려움', bg: colors.peach },
  { g: 'good', label: '알맞음', bg: colors.mint },
  { g: 'easy', label: '쉬움', bg: colors.yellow },
];

export default function ReviewSession() {
  const router = useRouter();
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState(0); // how many completed this session

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      api.reviewDue()
        .then((c) => { if (alive) { setCards(c); setState('ok'); } })
        .catch(() => { if (alive) setState('error'); });
      return () => { alive = false; };
    }, []),
  );

  const card = cards[idx];
  const done = state === 'ok' && idx >= cards.length;

  const grade = async (g: ReviewGrade) => {
    if (!card) return;
    Speech.stop();
    try { await api.gradeReview(card.id, g); } catch { /* best-effort */ }
    setGraded((n) => n + 1);
    setRevealed(false);
    setIdx((i) => i + 1);
  };

  const back = () => { Speech.stop(); router.replace('/lab'); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

      {/* top bar: exit + progress */}
      <View style={{ paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <PixelButton label="× 나가기" bg="#fff" shadowColor={C} offset={2} fontSize={11} borderWidth={2} paddingV={4} paddingH={10} onPress={back} />
        {state === 'ok' && cards.length > 0 && !done && (
          <View style={{ backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C }}>📓 {idx + 1} / {cards.length}</Text>
          </View>
        )}
      </View>

      {state === 'loading' && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C} /></View>}
      {state === 'error' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textSoft, textAlign: 'center' }}>복습 카드를 불러오지 못했어요.</Text>
          <PixelButton label="‹ 리뷰랩" onPress={back} />
        </View>
      )}

      {/* completion summary (also covers the empty case) */}
      {done && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
          <Text style={{ fontSize: 52 }}>{graded > 0 ? '🎉' : '📓'}</Text>
          <Text style={{ fontFamily: fonts.heading, fontSize: 20, color: C, textAlign: 'center' }}>{graded > 0 ? '오늘의 복습 완료!' : '복습할 카드가 없어요'}</Text>
          {graded > 0 && <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textSoft }}>{graded}개 카드를 복습했어요. 내일 또 만나요!</Text>}
          <View style={{ marginTop: 8 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={back} /></View>
        </View>
      )}

      {/* current card */}
      {state === 'ok' && !done && card && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24, flexGrow: 1 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: colors.textSoft, marginBottom: 10 }}>{card.topicTag || '교정 노트'}</Text>

          {/* prompt: what you said → recall the natural version */}
          <Shadowed offset={4}>
            <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 16 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft, marginBottom: 6 }}>이렇게 말했어요</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 15, color: colors.textFaint, textDecorationLine: 'line-through', lineHeight: 22 }}>{card.front}</Text>

              {!revealed ? (
                <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C, marginTop: 14, lineHeight: 18 }}>💭 더 자연스러운 표현이 떠오르나요? 머릿속으로 말해본 뒤 정답을 확인하세요.</Text>
              ) : (
                <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: 2, borderTopColor: '#2A252222', borderStyle: 'dashed' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft, marginBottom: 6 }}>현지인처럼 말하기</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                    <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 16, color: C, lineHeight: 24 }}><Text style={{ backgroundColor: colors.mint }}>{card.back}</Text></Text>
                    <Pressable onPress={() => Speech.speak(card.back, { language: 'en-US', rate: 0.92 })} hitSlop={8}><Text style={{ fontSize: 20 }}>🔊</Text></Pressable>
                  </View>
                  {!!card.note && (
                    <View style={{ marginTop: 12, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: '#2A252255', borderStyle: 'dashed', paddingVertical: 8, paddingHorizontal: 10 }}>
                      <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.text, lineHeight: 16 }}><Text style={{ fontFamily: fonts.heading, color: C }}>왜? </Text>{card.note}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </Shadowed>

          <View style={{ flex: 1 }} />

          {/* footer action */}
          {!revealed ? (
            <View style={{ marginTop: 16 }}>
              <PixelButton label="👀 정답 보기" bg={colors.mint} shadowColor={colors.mintShadow} full onPress={() => { setRevealed(true); Speech.speak(card.back, { language: 'en-US', rate: 0.92 }); }} />
            </View>
          ) : (
            <View style={{ marginTop: 16, gap: 8 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft, textAlign: 'center' }}>얼마나 잘 기억했나요?</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {GRADES.map(({ g, label, bg }) => (
                  <Pressable key={g} onPress={() => grade(g)} style={{ flex: 1 }}>
                    <Shadowed offset={2}>
                      <View style={{ backgroundColor: bg, borderWidth: 2, borderColor: C, paddingVertical: 9, alignItems: 'center' }}>
                        <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>{label}</Text>
                      </View>
                    </Shadowed>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}
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
