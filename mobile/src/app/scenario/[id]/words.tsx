// STEP 1 단어 — 회상형 단어장 (lesson-four-steps-v44 §11, H'; handoff v45
// forin-notebook-lesson-words-live.jsx WordStudyLive). It replaced the v44 flashcard
// at the same route (결정 5).
//
// Not "look and memorise" but recall: the front shows the meaning and a clue, the
// learner answers (pick the English · build it from fragments · listen and pick the
// meaning — rotated, not authored: 결정 8), checks, and the explanation opens under the
// prompt on the same sheet. Then `아직 헷갈려요` (files the word into the review notes)
// or `외웠어요`. The situation's STEP 1 nuance cards (scale, collocations) follow the
// words. The last card shows the tally; the CTA records STEP 1 with the words missed —
// STEP 2 brings their sentences back first — and goes on to STEP 2.
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StepTrack } from '@/components/lesson/StepTrack';
import { RecallPrompt, RecallReveal } from '@/components/lesson/RecallPrompt';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbMark, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { api, type LessonDetail, type LessonStepView } from '@/api/client';
import { buildDeck, cardWordIds, hasAnswer, isRight, type RecallAnswer, type RecallCard } from '@/data/recall';
import { TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

/** The learner is on this step, whatever the level says — they opened it. So it is the
 *  one drawn current, and a step the server had as next is not current too. */
function onThisStep(steps: LessonStepView[]): LessonStepView[] {
  return steps.map((s) => {
    if (s.kind === 'words') return s.state === 'done' ? s : { ...s, state: 'now' };
    return s.state === 'now' ? { ...s, state: 'lock' } : s;
  });
}

type Outcome = 'right' | 'wrong';

export default function LessonWordsRoute() {
  const t = useT();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<RecallAnswer | null>(null);
  const [result, setResult] = useState<Outcome | null>(null);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  // Words not yet solid: answered wrong, or marked 아직 헷갈려요. STEP 2 brings them back.
  const missed = useRef(new Set<string>());
  // A guard, not state — disabled buttons draw at 45% and read as blinking (H fix).
  const finishing = useRef(false);

  useEffect(() => {
    let alive = true;
    api.lesson(id).then((l) => { if (alive) setLesson(l); }).catch(() => {});
    return () => { alive = false; };
  }, [id]);

  const deck = useMemo<RecallCard[]>(() => (lesson ? buildDeck(lesson.words, lesson.nuance ?? []) : []), [lesson]);
  const done = deck.length > 0 && idx >= deck.length;
  const card = deck[idx];

  const check = () => {
    if (!card || result || !hasAnswer(card, answer)) return;
    const r: Outcome = isRight(card, answer) ? 'right' : 'wrong';
    if (r === 'wrong') cardWordIds(card).forEach((w) => missed.current.add(w));
    setResult(r);
  };

  const next = (fuzzy: boolean) => {
    if (!card || !result) return;
    if (fuzzy) {
      cardWordIds(card).forEach((w) => missed.current.add(w));
      // Filed in the background: the next card must not wait on the review notes.
      if (card.kind === 'word') void api.confusedWord(id, card.word.id).catch(() => {});
    }
    setOutcomes((o) => [...o, result]);
    setIdx(idx + 1);
    setAnswer(null);
    setResult(null);
  };

  // Only on success: a failed save would otherwise drop the missed words (STEP 2 would
  // lose its review sentences) and leave STEP 1 undone on the hub, with nothing said.
  const [saveFailed, setSaveFailed] = useState(false);
  const finish = async () => {
    if (finishing.current) return;
    finishing.current = true;
    setSaveFailed(false);
    try {
      await api.clearLessonStep(id, 'words', [...missed.current]);
      router.replace(`/scenario/${id}/sentences`);
    } catch {
      setSaveFailed(true);
    } finally {
      finishing.current = false;
    }
  };

  const right = outcomes.filter((o) => o === 'right').length;
  const wrong = outcomes.length - right;
  const cue = card ? (card.kind === 'word' ? card.word.cue : card.item.cue) : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: nb.cream, paddingTop: TOP_INSET }}>
      <Stack.Screen options={TASK_SCREEN} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={nbText.hand(21)}>{t('lesson.words.title')}</Text>
          {!!lesson && <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 1 }]}>{lesson.situation.title}</Text>}
        </View>
        {deck.length > 0 && !done && <NbTag color={nb.amber} fill>{`${idx + 1} / ${deck.length}`}</NbTag>}
      </View>

      {!lesson ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={nb.ink} /></View>
      ) : deck.length === 0 ? (
        <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center', marginTop: 40 }]}>{t('lesson.hub.emptyNote')}</Text>
      ) : (
        <>
          <View style={{ marginTop: 10 }}><StepTrack steps={onThisStep(lesson.steps)} /></View>

          {/* One segment per card: ink = right, red = missed, blue = nuance still ahead. */}
          <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 20, marginTop: 12 }}>
            {deck.map((c, k) => (
              <View key={k} testID="recall-segment" style={{
                flex: 1, height: 5, borderRadius: 2,
                backgroundColor: k < outcomes.length ? (outcomes[k] === 'wrong' ? nb.red : nb.ink)
                  : c.kind === 'nuance' ? 'rgba(74,111,165,.25)' : 'rgba(62,54,43,.15)',
              }} />
            ))}
          </View>
          {!done && card && (
            <Text style={[nbText.hand(19), { paddingHorizontal: 20, marginTop: 10 }]}>
              {card.kind === 'nuance' ? t('recall.headNuance') : t('recall.headWords')}
            </Text>
          )}

          <ScrollView style={{ flex: 1, marginTop: 10 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
            {!done && card && (
              <View testID="recall-sheet" style={{ backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge, paddingTop: 16, paddingHorizontal: 18, paddingBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {card.kind === 'word' && !!card.word.tag && <NbTag color={nb.blue}>{card.word.tag}</NbTag>}
                  <Text testID="recall-type" style={nbText.hand(12.5, nb.soft)}>
                    {t(`recall.type.${card.kind === 'word' ? card.type : card.item.kind}`)}{result ? ` · ${t('recall.reveal')}` : ''}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 14 }}>
                  <View style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: `${nb.amber}22`, borderWidth: 2, borderColor: nb.amber, alignItems: 'center', justifyContent: 'center' }}>
                    <NbIcon name={card.kind === 'word' ? card.word.icon ?? 'pencil' : card.item.kind === 'pair' ? 'handshake2' : 'chartup'} size={32} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <NbMark textStyle={nbText.hand(23)}>
                      {card.kind === 'word'
                        ? (card.type === 'listen' ? t('recall.listenAsk') : card.word.ko)
                        : card.item.kind === 'slider' ? t('recall.sliderAsk') : t('recall.pairAsk')}
                    </NbMark>
                    {!!cue && (
                      <View style={{ flexDirection: 'row', gap: 4, marginTop: 4, alignItems: 'flex-start' }}>
                        <View style={{ marginTop: 2 }}><NbIcon name="pencil" size={12} color={nb.soft} /></View>
                        <Text style={[nbText.hand(13.5, nb.soft), { flex: 1, lineHeight: 18 }]}>{cue}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <RecallPrompt card={card} pool={lesson.words} answer={answer} onAnswer={setAnswer} result={result} />
                {!!result && <RecallReveal card={card} result={result} />}
              </View>
            )}

            {done && (
              <View testID="recall-done" style={{ backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge, paddingVertical: 28, paddingHorizontal: 18, alignItems: 'center' }}>
                <View style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: nb.green, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-10deg' }] }}>
                  <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 9, letterSpacing: 2, color: nb.green }}>DONE</Text>
                  <Text style={nbText.hand(20, nb.green)}>{t('recall.done')}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 18 }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text testID="recall-right-count" style={nbText.hand(24, nb.green)}>{String(right)}</Text>
                    <Text style={nbText.body(10.5, nb.soft)}>{t('recall.right')}</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: 'rgba(62,54,43,.2)' }} />
                  <View style={{ alignItems: 'center' }}>
                    <Text testID="recall-wrong-count" style={nbText.hand(24, nb.red)}>{String(wrong)}</Text>
                    <Text style={nbText.body(10.5, nb.soft)}>{t('recall.wrong')}</Text>
                  </View>
                </View>
                {missed.current.size > 0 && (
                  <Text style={[nbText.hand(13.5, nb.soft), { marginTop: 10, textAlign: 'center' }]}>{t('recall.missedNote')}</Text>
                )}
              </View>
            )}
          </ScrollView>

          <View style={{ position: 'absolute', left: 20, right: 20, bottom: 30 }}>
            {done ? (
              <View testID="recall-to-step2">
                {saveFailed && <Text testID="lesson-save-failed" style={[nbText.hand(14, nb.red), { textAlign: 'center', marginBottom: 8 }]}>{t('lesson.saveFailed')}</Text>}
                <NbButton variant="ink" size="lg" full icon="speech" iconColor={nb.paper} onPress={finish}>{t('recall.toStep2')}</NbButton>
              </View>
            ) : !result ? (
              <View testID="recall-check" style={{ opacity: card && hasAnswer(card, answer) ? 1 : 0.4 }}>
                <NbButton variant="ink" size="lg" full icon="pencil" iconColor={nb.paper} onPress={check}>{t('recall.check')}</NbButton>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {([
                  { testID: 'recall-fuzzy', fuzzy: true, col: nb.amber, icon: 'bulb', label: t('recall.fuzzy'), sub: t('recall.fuzzySub'), rot: -0.8 },
                  { testID: 'recall-known', fuzzy: false, col: nb.green, icon: 'check', label: result === 'right' ? t('recall.known') : t('recall.knownAfterWrong'), sub: t('recall.knownSub'), rot: 0.8 },
                ] as const).map((b) => (
                  <Pressable key={b.testID} testID={b.testID} onPress={() => next(b.fuzzy)} style={{ flex: 1 }}>
                    <NbPaper rot={b.rot} style={{ paddingVertical: 11, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.8, borderColor: b.col, backgroundColor: `${b.col}14` }}>
                      <NbIcon name={b.icon} size={30} />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text numberOfLines={1} style={nbText.hand(17, b.col)}>{b.label}</Text>
                        <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>{b.sub}</Text>
                      </View>
                    </NbPaper>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}
