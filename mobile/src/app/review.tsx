// 오늘의 복습 세션 — a focused, one-card-at-a-time spaced-repetition run launched
// from the review lab's "오늘의 복습 시작". For each due card: recall the natural
// phrasing from your original line, reveal the AI correction + why-note (speaker to
// hear it), then self-grade (다시/어려움/알맞음/쉬움 → POST /me/review/{id}/grade,
// SM-2). Ends with a completion summary. 1:1 in spirit with the review-lab flow.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { PixelButton } from '@/components/PixelButton';
import { api, type ReviewCard, type ReviewGrade } from '@/api/client';
import { PixelIcon } from '@/components/PixelIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { t, useLocale } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

const C = colors.ink;
// Keys, not t(...): evaluated once at import (see i18n/module-scope.test.ts).
const GRADES: { g: ReviewGrade; labelKey: string; bg: string; blurbKey: string }[] = [
  { g: 'again', labelKey: 'lab.again', bg: '#FCA5A5', blurbKey: 'lab.againSub' },
  { g: 'hard', labelKey: 'lab.hard', bg: colors.peach, blurbKey: 'lab.hardSub' },
  { g: 'good', labelKey: 'lab.good', bg: colors.mint, blurbKey: 'lab.goodSub' },
  { g: 'easy', labelKey: 'lab.easy', bg: colors.yellow, blurbKey: 'lab.easySub' },
];

// humanize the SM-2 next-interval into a friendly "next review" label.
function nextLabel(days: number): string {
  if (days <= 1) return t('lab.tomorrow');
  if (days < 14) return t('lab.inDays', { n: days });
  if (days < 60) return t('lab.inWeeks', { n: Math.round(days / 7) });
  return t('lab.inMonths', { n: Math.round(days / 30) });
}

export default function ReviewSession() {
  useLocale();
  const router = useRouter();
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState(0); // how many completed this session
  const [toast, setToast] = useState<{ label: string; bg: string; blurb: string; next: string } | null>(null);
  const [busy, setBusy] = useState(false);

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
    if (!card || busy) return;
    Speech.stop();
    setBusy(true);
    const meta = GRADES.find((x) => x.g === g)!;
    let interval = 1;
    try { const r = await api.gradeReview(card.id, g); interval = r.intervalDays; } catch { /* best-effort */ }
    // Show a short confirmation so the card doesn't just vanish silently, then advance.
    setToast({ label: t(meta.labelKey), bg: meta.bg, blurb: t(meta.blurbKey), next: nextLabel(interval) });
    setTimeout(() => {
      setToast(null);
      setBusy(false);
      setGraded((n) => n + 1);
      setRevealed(false);
      setIdx((i) => i + 1);
    }, 1300);
  };

  const back = () => { Speech.stop(); router.replace('/lab'); };

  // 🎤 따라 말하기 (04_SCREENS.md:397, PhraseCard actions) — pushes to the
  // standalone pronunciation route (T8) so the learner records themselves
  // saying the CORRECTED line (card.back), not the original mistake
  // (card.front). reviewCardId is the server's ownership-checked param
  // (business-rules: a foreign card's id 403s), so this only ever sends the
  // id of the card actually being reviewed right now.
  const practicePronunciation = (c: ReviewCard) => {
    Speech.stop();
    // One single template literal (not string concatenation) — see the same
    // note in dialogue/[id].tsx's openPronunciation.
    router.push(
      `/pronunciation/${encodeURIComponent(c.back.slice(0, 40))}?referenceText=${encodeURIComponent(c.back)}&origin=review&reviewCardId=${encodeURIComponent(c.id)}&ctx=${encodeURIComponent(c.context?.title || c.topicTag || '')}&step=${encodeURIComponent(t('lab.likeALocal'))}`
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack.Screen options={TASK_SCREEN} />

      {/* top bar: exit + progress */}
      <View style={{ paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <PixelButton label={t('quiz.exit')} bg="#fff" shadowColor={C} offset={2} fontSize={11} borderWidth={2} paddingV={4} paddingH={10} onPress={back} />
        {state === 'ok' && cards.length > 0 && !done && (
          <View style={{ backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C }}>{idx + 1} / {cards.length}</Text>
          </View>
        )}
      </View>

      {state === 'loading' && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C} /></View>}
      {state === 'error' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(13), color: colors.textSoft, textAlign: 'center' }}>복습 카드를 불러오지 못했어요.</Text>
          <PixelButton label={t('review.backToLab')} onPress={back} />
        </View>
      )}

      {/* completion summary (also covers the empty case) */}
      {done && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
          <PixelIcon name={graded > 0 ? 'burst' : 'note'} color={C} size={52} sw={1.5} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(20), color: C, textAlign: 'center' }}>{graded > 0 ? t('review.doneToday') : t('review.noCards')}</Text>
          {graded > 0 && <Text style={{ fontFamily: fonts.body, fontSize: fs(13), color: colors.textSoft }}>{graded}개 카드를 복습했어요. 내일 또 만나요!</Text>}
          <View style={{ marginTop: 8, width: 200 }}><PixelButton icon="check" label={t('common.done')} bg={colors.mint} shadowColor={colors.mintShadow} onPress={back} full /></View>
        </View>
      )}

      {/* current card */}
      {state === 'ok' && !done && card && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24, flexGrow: 1 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: colors.textSoft, marginBottom: 10 }}>{card.topicTag || t('lab.correctionNote')}</Text>

          {/* 맥락: which situation / dialogue this correction came from */}
          <ContextCard card={card} />

          {/* prompt: what you said → recall the natural version */}
          <Shadowed offset={4}>
            <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 16 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft, marginBottom: 6 }}>이렇게 말했어요</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: fs(15), color: colors.textFaint, textDecorationLine: 'line-through', lineHeight: 22 }}>{card.front}</Text>

              {!revealed ? (
                <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: C, marginTop: 14, lineHeight: 18 }}>더 자연스러운 표현이 떠오르나요? 머릿속으로 말해본 뒤 정답을 확인하세요.</Text>
              ) : (
                <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: 2, borderTopColor: '#2A252222', borderStyle: 'dashed' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft, marginBottom: 6 }}>현지인처럼 말하기</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                    <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(16), color: C, lineHeight: 24 }}><Text style={{ backgroundColor: colors.mint }}>{card.back}</Text></Text>
                    <Pressable onPress={() => Speech.speak(card.back, { language: 'en-US', rate: 0.92 })} hitSlop={8}><PixelIcon name="volume" color={C} size={20} sw={1.8} /></Pressable>
                    <Pressable onPress={() => practicePronunciation(card)} hitSlop={8}><PixelIcon name="mic" color={C} size={20} sw={1.8} /></Pressable>
                  </View>
                  {!!card.note && (
                    <View style={{ marginTop: 12, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: '#2A252255', borderStyle: 'dashed', paddingVertical: 8, paddingHorizontal: 10 }}>
                      <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.text, lineHeight: 16 }}><Text style={{ fontFamily: fonts.heading, color: C }}>왜? </Text>{card.note}</Text>
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
              <PixelButton icon="eye" label={t('review.showAnswer')} bg={colors.mint} shadowColor={colors.mintShadow} full onPress={() => { setRevealed(true); Speech.speak(card.back, { language: 'en-US', rate: 0.92 }); }} />
            </View>
          ) : (
            <View style={{ marginTop: 16, gap: 8 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft, textAlign: 'center' }}>얼마나 잘 기억했나요?</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {GRADES.map(({ g, labelKey, bg }) => (
                  <View key={g} style={{ flex: 1 }}>
                    <PixelButton label={t(labelKey)} bg={bg} shadowColor={C} offset={2} fontSize={12} borderWidth={2} paddingV={9} onPress={() => grade(g)} full />
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* grade confirmation — so the card doesn't just silently vanish */}
      {toast && (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 28, alignItems: 'center', paddingHorizontal: 18 }}>
          <Shadowed offset={3}>
            <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 12, paddingHorizontal: 16, minWidth: 260, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: toast.bg, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>{toast.label}</Text>
                </View>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>{toast.next}</Text>
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, marginTop: 6, textAlign: 'center' }}>{toast.blurb}</Text>
            </View>
          </Shadowed>
        </View>
      )}
    </View>
  );
}

// ContextCard shows what situation the correction came from and the line the
// learner was replying to — so "왜 저 말을 했는지" is recallable at review time.
function ContextCard({ card }: { card: ReviewCard }) {
  const ctx = card.context;
  if (!ctx || (!ctx.title && !ctx.situation && !ctx.npc)) return null;
  return (
    <View style={{ marginBottom: 12 }}>
      <Shadowed offset={3} shadowColor={colors.lilac}>
        <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>이때의 상황</Text>
            {!!ctx.dept && (
              <View style={{ backgroundColor: colors.lilac, borderWidth: 1.5, borderColor: C, paddingVertical: 1, paddingHorizontal: 5 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C }}>{ctx.dept}</Text>
              </View>
            )}
          </View>
          {!!ctx.title && <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C, marginBottom: 4 }}>{ctx.title}</Text>}
          {!!ctx.situation && <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.text, lineHeight: 16 }}>{ctx.situation}</Text>}
          {!!ctx.npc && (
            <View style={{ marginTop: 10, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: '#2A252255', borderStyle: 'dashed', paddingVertical: 7, paddingHorizontal: 9 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: colors.textSoft, marginBottom: 3 }}>상대가 이렇게 말했고</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.text, lineHeight: 17 }}>{ctx.npc}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, lineHeight: 16, marginTop: 4 }}>→ 여기에 내가 답하면서 한 말이에요.</Text>
            </View>
          )}
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
