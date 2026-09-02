// 오늘의 복습 세션 — the 근무 수첩 line (v30).
//
// A focused, one-card-at-a-time spaced-repetition run launched from the review lab's
// 오늘의 복습 시작. For each due card: recall the natural phrasing from your original
// line, reveal the correction + why-note (speaker to hear it, mic to say it), then
// self-grade (다시/어려움/알맞음/쉬움 → POST /me/review/{id}/grade, SM-2). Ends with a
// completion summary.
//
// The drawing is a STACK of index cards with the current one on top, and the two behind it
// are not decoration: they appear only while cards are actually still due, so the stack's
// depth is the honest "there is more behind this".
//
// The v30 artboard's front face reads "이 상황, 영어로 뭐라고 하죠?" over a Korean
// sentence. These cards are not that: they are corrections (front = what you said, back =
// the natural version) and suggestions (front = the meaning, back = the phrase), and the
// server labels which — see data/reviewCardFace for why drawing one as the other tells a
// learner they said a sentence they never said. So the prompt line comes from the card's
// own face rather than from the mock.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbMark, NbMemo, NbPaper, NbSheet, NbStamp, NbTag, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { faceOf } from '@/data/reviewCardFace';
import { api, type ReviewCard, type ReviewGrade } from '@/api/client';
import { type Translate, useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

// Keys, not t(...): evaluated once at import (see i18n/module-scope.test.ts).
//
// The colour is the PEN each answer is written in — red for "again", amber for hard, blue
// for good, green for easy. Same four colours the review lab's SRS row uses, because it is
// the same judgement.
const GRADES: { g: ReviewGrade; labelKey: string; color: string; blurbKey: string }[] = [
  { g: 'again', labelKey: 'lab.again', color: nb.red, blurbKey: 'lab.againSub' },
  { g: 'hard', labelKey: 'lab.hard', color: '#C77E2E', blurbKey: 'lab.hardSub' },
  { g: 'good', labelKey: 'lab.good', color: nb.blue, blurbKey: 'lab.goodSub' },
  { g: 'easy', labelKey: 'lab.easy', color: nb.green, blurbKey: 'lab.easySub' },
];

/** The SM-2 next-interval, humanised. */
function nextLabel(t: Translate, days: number): string {
  if (days <= 1) return t('lab.tomorrow');
  if (days < 14) return t('lab.inDays', { n: days });
  if (days < 60) return t('lab.inWeeks', { n: Math.round(days / 7) });
  return t('lab.inMonths', { n: Math.round(days / 30) });
}

export default function ReviewSession() {
  const t = useT();
  const router = useRouter();
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState(0); // how many completed this session
  const [toast, setToast] = useState<{ label: string; color: string; blurb: string; next: string } | null>(null);
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
  const face = faceOf(card?.source ?? '');
  const done = state === 'ok' && idx >= cards.length;
  const left = cards.length - idx - 1;

  const grade = async (g: ReviewGrade) => {
    if (!card || busy) return;
    Speech.stop();
    setBusy(true);
    const meta = GRADES.find((x) => x.g === g)!;
    let interval = 1;
    try { const r = await api.gradeReview(card.id, g); interval = r.intervalDays; } catch { /* best-effort */ }
    // A short confirmation so the card does not just vanish silently, then advance.
    setToast({ label: t(meta.labelKey), color: meta.color, blurb: t(meta.blurbKey), next: nextLabel(t, interval) });
    setTimeout(() => {
      setToast(null);
      setBusy(false);
      setGraded((n) => n + 1);
      setRevealed(false);
      setIdx((i) => i + 1);
    }, 1300);
  };

  const back = () => { Speech.stop(); router.replace('/lab'); };

  // 따라 말하기 — pushes to the standalone pronunciation route so the learner records
  // themselves saying the CORRECTED line (card.back), not the original mistake
  // (card.front). reviewCardId is the server's ownership-checked param (a foreign card's
  // id 403s), so this only ever sends the id of the card being reviewed right now.
  const practicePronunciation = (c: ReviewCard) => {
    Speech.stop();
    // One single template literal (not string concatenation) — see the same note in
    // dialogue/[id].tsx's openPronunciation.
    router.push(
      `/pronunciation/${encodeURIComponent(c.back.slice(0, 40))}?referenceText=${encodeURIComponent(c.back)}&origin=review&reviewCardId=${encodeURIComponent(c.id)}&ctx=${encodeURIComponent(c.context?.title || c.topicTag || '')}&step=${encodeURIComponent(t('lab.likeALocal'))}`
    );
  };

  return (
    <NbSheet>
      <Stack.Screen options={TASK_SCREEN} />

      {/* The way out is a written chip, and the progress is a row of tilted ink strokes —
          countable, unlike a bar. */}
      <View style={styles.head}>
        <View style={styles.headRow}>
          <Pressable onPress={back} hitSlop={8}>
            <View style={styles.exit}>
              <NbIcon name="cross" size={12} />
              <Text numberOfLines={1} style={nbText.hand(15)}>{t('quiz.exit')}</Text>
            </View>
          </Pressable>
          <View style={{ flex: 1 }} />
          <NbTag color={nb.red} rot={1}>{t('review.todayReview')}</NbTag>
          {state === 'ok' && cards.length > 0 && !done && (
            <Text numberOfLines={1} style={styles.progressText}>{idx + 1}/{cards.length}</Text>
          )}
        </View>
        {state === 'ok' && cards.length > 0 && !done && (
          <View style={styles.strokes}>
            {cards.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stroke,
                  { backgroundColor: i <= idx ? nb.ink : 'rgba(62,54,43,.15)', transform: [{ rotate: i % 2 ? '0.7deg' : '-0.7deg' }] },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {state === 'loading' && <View style={styles.centre}><ActivityIndicator color={nb.ink} /></View>}
      {state === 'error' && (
        <View style={styles.centre}>
          <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('review.loadFailed')}</Text>
          <NbButton variant="paper" onPress={back}>{t('review.backToLab')}</NbButton>
        </View>
      )}

      {/* The end of the run — and the empty case, which is the same page with a different
          line: nothing due is a finished day, not a failure. */}
      {done && (
        <View style={styles.centre}>
          <NbStamp
            color={graded > 0 ? nb.green : nb.soft}
            size={104}
            rot={-9}
            top={graded > 0 ? 'DONE' : 'CLEAR'}
            bottom={graded > 0 ? t('review.stampDone') : t('review.stampClear')}
          />
          <Text style={[nbText.hand(22), { textAlign: 'center', marginTop: 6 }]}>
            {graded > 0 ? t('review.doneToday') : t('review.noCards')}
          </Text>
          {graded > 0 && (
            <Text style={[nbText.body(12, nb.soft), { textAlign: 'center' }]}>{t('review.reviewedCount', { n: graded })}</Text>
          )}
          <View style={{ marginTop: 10, alignSelf: 'stretch' }}>
            <NbButton variant="ink" size="lg" full icon="check" iconColor={nb.paper} onPress={back}>{t('common.done')}</NbButton>
          </View>
        </View>
      )}

      {state === 'ok' && !done && card && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.stackWrap}>
            {/* The cards still due behind this one. Two at most — a third adds no
                information and eats the page. */}
            {left > 1 && <NbPaper rot={2.2} style={[styles.behind, { left: 14, right: -6, top: 10 }]} />}
            {left > 0 && <NbPaper rot={-1.4} style={[styles.behind, { left: -4, right: 8, top: 5 }]} />}

            <NbPaper rot={-0.3} tape tapeLeft={140} style={styles.card}>
              <View style={styles.cardHead}>
                <NbTag color={nb.blue}>{card.topicTag || t('lab.correctionNote')}</NbTag>
                <View style={{ flex: 1 }} />
                {/* Mastery, as pips you can count — the same three the lab draws. */}
                <View style={{ flexDirection: 'row', gap: 3 }}>
                  {[0, 1, 2].map((i) => (
                    <View key={i} style={[styles.pip, { backgroundColor: i < card.masteryPips ? nb.green : 'transparent' }]} />
                  ))}
                </View>
              </View>

              <Context card={card} />

              {/* What you said (or, for a suggestion, what it means). */}
              <Text numberOfLines={2} style={[nbText.hand(15, nb.soft), { marginTop: 14 }]}>{t(face.promptKey)}</Text>
              <Text
                style={[
                  styles.front,
                  {
                    color: face.correction ? nb.soft : nb.ink,
                    textDecorationLine: face.strike ? 'line-through' : 'none',
                    textDecorationColor: nb.red,
                  },
                ]}
              >
                {card.front}
              </Text>

              {!revealed ? (
                <Text style={[nbText.hand(15.5, nb.ink), { marginTop: 14 }]}>{t('review.tryFirst')}</Text>
              ) : (
                <View style={styles.reveal}>
                  <Text numberOfLines={1} style={nbText.hand(15, nb.soft)}>{t('lab.likeALocal')}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 4 }}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <NbMark textStyle={styles.back}>{card.back}</NbMark>
                    </View>
                    <Pressable onPress={() => Speech.speak(card.back, { language: 'en-US', rate: 0.92 })} hitSlop={8}>
                      <NbPaper rot={1.5} bg="rgba(143,199,232,.3)" style={styles.iconChip}><NbIcon name="speaker" size={16} /></NbPaper>
                    </Pressable>
                    <Pressable onPress={() => practicePronunciation(card)} hitSlop={8}>
                      <NbPaper rot={-1.5} bg="rgba(199,81,70,.14)" style={styles.iconChip}><NbIcon name="mic" size={16} /></NbPaper>
                    </Pressable>
                  </View>
                  {!!card.note && (
                    <NbMemo color={nb.blue} rot={0.3} style={{ marginTop: 12 }}>
                      <Text style={nbText.hand(14.5)}>
                        <Text style={{ color: nb.blue }}>{t('lab.whyLabel')} </Text>{card.note}
                      </Text>
                    </NbMemo>
                  )}
                </View>
              )}
            </NbPaper>
          </View>

          <View style={{ flex: 1 }} />

          {!revealed ? (
            <View style={{ marginTop: 18 }}>
              {/* Say it out loud BEFORE checking — that is the whole exercise, so the
                  quiet option is the dashed one and the CTA says what it reveals. */}
              <NbButton
                variant="ink"
                size="lg"
                full
                icon="pencil"
                iconColor={nb.paper}
                onPress={() => { setRevealed(true); Speech.speak(card.back, { language: 'en-US', rate: 0.92 }); }}
              >
                {t('review.showAnswer')}
              </NbButton>
            </View>
          ) : (
            <View style={{ marginTop: 18 }}>
              <Text style={[nbText.hand(15, nb.soft), { textAlign: 'center', marginBottom: 9 }]}>{t('review.howWell')}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {GRADES.map(({ g, labelKey, color, blurbKey }, i) => (
                  <Pressable key={g} onPress={() => grade(g)} disabled={busy} style={{ flex: 1 }}>
                    <View style={[styles.srs, { borderColor: color, transform: [{ rotate: i % 2 ? '0.6deg' : '-0.6deg' }] }]}>
                      <Text numberOfLines={1} style={[nbText.hand(16.5, color), { lineHeight: 18 }]}>{t(labelKey)}</Text>
                      <Text numberOfLines={1} style={styles.srsSub}>{t(blurbKey)}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* The grade's confirmation, so the card does not silently vanish. */}
      {toast && (
        <View pointerEvents="none" style={styles.toastWrap}>
          <NbPaper rot={-0.5} style={styles.toast}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <NbTag color={toast.color} fill rot={-2}>{toast.label}</NbTag>
              <Text numberOfLines={1} style={nbText.hand(17)}>{toast.next}</Text>
            </View>
            <Text numberOfLines={2} style={[nbText.body(11, nb.soft), { marginTop: 5, textAlign: 'center' }]}>{toast.blurb}</Text>
          </NbPaper>
        </View>
      )}
    </NbSheet>
  );
}

/**
 * Where the correction came from: the situation, and the line the learner was replying to.
 *
 * Absent unless the server sent something to say — "왜 저 말을 했는지" is only recallable
 * when there is a context, and an empty card here would read as a missing one.
 */
function Context({ card }: { card: ReviewCard }) {
  const t = useT();
  const ctx = card.context;
  if (!ctx || (!ctx.title && !ctx.situation && !ctx.npc)) return null;
  return (
    <View style={styles.ctx}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <Text numberOfLines={1} style={styles.ctxLabel}>{t('review.thatSituation')}</Text>
        {!!ctx.dept && <NbTag color={nb.soft}>{ctx.dept}</NbTag>}
      </View>
      {!!ctx.title && <Text numberOfLines={1} style={[nbText.hand(16), { marginTop: 3 }]}>{ctx.title}</Text>}
      {!!ctx.situation && <Text style={[nbText.body(11, nb.soft), { marginTop: 2 }]}>{ctx.situation}</Text>}
      {!!ctx.npc && (
        <View style={styles.ctxNpc}>
          <Text numberOfLines={1} style={nbText.hand(13.5, nb.soft)}>{t('review.theySaid')}</Text>
          <Text style={[nbText.body(11.5), { marginTop: 1 }]}>{ctx.npc}</Text>
        </View>
      )}
    </View>
  );
}

const styles = {
  head: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 6 } as const,
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 8 } as const,
  exit: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderColor: nb.ink, borderRadius: 3, paddingVertical: 1, paddingHorizontal: 8,
    transform: [{ rotate: '-1deg' }],
  } as const,
  progressText: { fontFamily: nbFonts.monoBold, fontSize: 12, color: nb.soft } as const,
  strokes: { flexDirection: 'row', gap: 5, marginTop: 10 } as const,
  stroke: { flex: 1, height: 5, borderRadius: 2 } as const,

  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 28 } as const,
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 26, flexGrow: 1 } as const,

  stackWrap: { position: 'relative' } as const,
  behind: { position: 'absolute', height: 260 } as const,
  card: { paddingVertical: 18, paddingHorizontal: 18 } as const,
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8 } as const,
  pip: { width: 7, height: 7, borderRadius: 4, borderWidth: 1.3, borderColor: nb.green } as const,

  /** The learner's own line, in the reading face: it is English to be read, not a label. */
  front: { fontFamily: nbFonts.body, fontSize: 15, lineHeight: 23, marginTop: 3 } as const,
  reveal: { marginTop: 14, paddingTop: 14, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.2)' } as const,
  back: { fontFamily: nbFonts.bodyBold, fontSize: 16, color: nb.ink, lineHeight: 24 } as const,
  iconChip: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as const,

  ctx: {
    marginTop: 12, paddingLeft: 10, paddingVertical: 2,
    borderLeftWidth: 2.5, borderLeftColor: 'rgba(62,54,43,.18)',
  } as const,
  ctxLabel: { fontFamily: nbFonts.bodyBold, fontSize: 10, color: nb.blue, letterSpacing: 1 } as const,
  ctxNpc: {
    marginTop: 8, paddingVertical: 7, paddingHorizontal: 9,
    borderWidth: 1.3, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.25)',
  } as const,

  /** Four paper buttons, each in its own pen. */
  srs: {
    borderWidth: 1.8, borderRadius: 4, backgroundColor: nb.paper,
    paddingTop: 9, paddingBottom: 6, alignItems: 'center',
  } as const,
  srsSub: { fontFamily: nbFonts.body, fontSize: 9, color: nb.soft, marginTop: 3 } as const,

  toastWrap: { position: 'absolute', left: 0, right: 0, bottom: 30, alignItems: 'center', paddingHorizontal: 20 } as const,
  toast: { minWidth: 250, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' } as const,
};
