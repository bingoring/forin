// STEP 2 문장 — lesson-four-steps-v44 I (handoff v44 LessonSentences·SentBlank·SentOrder·
// SentListen·SentenceDone, v45 ImmersionReel·ContextMatch·SwapOne).
//
// The deck is data/sentenceDrill: the reel warm-up, the sentences (the ones using a word
// missed in STEP 1 first) with a rotated exercise each, one order card, then the STEP 2
// nuance drills. Every card is answered, checked and explained on the same sheet; the
// reel is read, not answered. The last card shows the PASSED page, and its CTA records
// STEP 2 and goes straight into STEP 3 — the guided dialogue.
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StepTrack } from '@/components/lesson/StepTrack';
import { SentPrompt, SentReveal } from '@/components/lesson/SentPrompt';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbPaper, NbStamp, NbTag, nbText } from '@/components/nb/NbUI';
import { api, type LessonDetail, type LessonStepView } from '@/api/client';
import { buildDrillDeck, hasDrillAnswer, isDrillRight, type DrillAnswer, type DrillCard } from '@/data/sentenceDrill';
import { TOP_INSET, nb } from '@/theme/nb';
import { useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

/** This step drawn current; the step the server had as next is not current too. */
function onThisStep(steps: LessonStepView[]): LessonStepView[] {
  return steps.map((s) => {
    if (s.kind === 'sentences') return s.state === 'done' ? s : { ...s, state: 'now' };
    return s.state === 'now' ? { ...s, state: 'lock' } : s;
  });
}

/** The instruction line's catalog key for a card. A key, not a string: translating
 *  here, outside the component, would be cached once (useT.test). */
function askKey(card: DrillCard): string {
  switch (card.kind) {
    case 'sentence': return card.type === 'listen' ? 'sent.listenAsk' : card.type === 'chunks' ? 'sent.chunksAsk' : 'sent.blankAsk';
    case 'order': return 'sent.orderAsk';
    case 'reel': return 'sent.reelAsk';
    case 'context': return 'sent.contextAsk';
    case 'swap': return 'sent.swapAsk';
  }
}

export default function LessonSentencesRoute() {
  const t = useT();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<DrillAnswer | null>(null);
  const [result, setResult] = useState<'right' | 'wrong' | null>(null);
  const [reelAt, setReelAt] = useState(0);
  const finishing = useRef(false);

  useEffect(() => {
    let alive = true;
    api.lesson(id).then((l) => { if (alive) setLesson(l); }).catch(() => {});
    return () => { alive = false; };
  }, [id]);

  const deck = useMemo(() => (lesson ? buildDrillDeck(lesson.sentences, lesson.nuance ?? []) : []), [lesson]);
  const done = deck.length > 0 && idx >= deck.length;
  const card = deck[idx];
  const reelScenes = card?.kind === 'reel' ? (card.item.scenes ?? []).length : 0;
  const reelFinished = card?.kind === 'reel' && reelAt >= reelScenes - 1;

  const check = () => {
    if (!card || !lesson || result || !hasDrillAnswer(card, answer)) return;
    setResult(isDrillRight(card, answer, lesson.words, lesson.sentences) ? 'right' : 'wrong');
  };
  const next = () => {
    setIdx(idx + 1);
    setAnswer(null);
    setResult(null);
    setReelAt(0);
  };
  const repeat = (text: string) => router.push({
    pathname: '/pronunciation/[sentenceKey]',
    params: { sentenceKey: text.slice(0, 40), referenceText: text, origin: 'lesson', scenarioId: id },
  });
  // Only on success — see words.tsx: a silent failure would leave STEP 2 undone.
  const [saveFailed, setSaveFailed] = useState(false);
  const finish = async () => {
    if (finishing.current) return;
    finishing.current = true;
    setSaveFailed(false);
    try {
      await api.clearLessonStep(id, 'sentences');
      router.replace(`/dialogue/${id}?guide=guided`);
    } catch {
      setSaveFailed(true);
    } finally {
      finishing.current = false;
    }
  };

  const repeatText = card?.kind === 'sentence' ? card.sentence.en : null;

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
          <Text numberOfLines={1} style={nbText.hand(21)}>{t('sent.title')}</Text>
          {!!lesson && <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 1 }]}>{lesson.situation.title}</Text>}
        </View>
        {deck.length > 0 && !done && <NbTag color={nb.blue} fill>{`${idx + 1} / ${deck.length}`}</NbTag>}
      </View>

      {!lesson ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={nb.ink} /></View>
      ) : deck.length === 0 ? (
        <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center', marginTop: 40 }]}>{t('lesson.hub.emptyNote')}</Text>
      ) : (
        <>
          <View style={{ marginTop: 10 }}><StepTrack steps={onThisStep(lesson.steps)} /></View>
          <ScrollView style={{ flex: 1, marginTop: 12 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
            {!done && card && (
              <View testID="sent-sheet" style={{ backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge, padding: 16 }}>
                <Text testID="sent-type" style={nbText.hand(12.5, nb.soft)}>
                  {t(`sent.type.${card.kind === 'sentence' ? card.type : card.kind}`)}
                </Text>
                <Text style={[nbText.hand(18), { marginTop: 6 }]}>{t(askKey(card))}</Text>
                <SentPrompt card={card} all={lesson.sentences} words={lesson.words} answer={answer} onAnswer={setAnswer}
                  result={result} reelAt={reelAt} onReelNext={() => setReelAt((r) => Math.min(r + 1, reelScenes - 1))} />
                {!!result && <SentReveal card={card} result={result} />}
              </View>
            )}
            {done && (
              <View testID="sent-done" style={{ alignItems: 'center', paddingTop: 12 }}>
                <NbStamp color={nb.green} size={92} top="STEP 2" bottom="PASSED" />
                <Text style={[nbText.hand(21), { marginTop: 14 }]}>{t('sent.passed', { n: lesson.sentences.length })}</Text>
                <View style={{ alignSelf: 'stretch', marginTop: 12 }}>
                  {lesson.sentences.map((s, i) => (
                    <NbPaper key={i} rot={i % 2 ? 0.4 : -0.4} style={{ marginTop: 8, paddingVertical: 8, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Text style={[nbText.body(12.5), { flex: 1 }]}>{s.en}</Text>
                      <Pressable onPress={() => repeat(s.en)} hitSlop={8}><NbIcon name="mic" size={17} /></Pressable>
                    </NbPaper>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={{ position: 'absolute', left: 20, right: 20, bottom: 30 }}>
            {done ? (
              <View testID="sent-to-step3">
                {saveFailed && <Text testID="lesson-save-failed" style={[nbText.hand(14, nb.red), { textAlign: 'center', marginBottom: 8 }]}>{t('lesson.saveFailed')}</Text>}
                <NbButton variant="ink" size="lg" full icon="speech" iconColor={nb.paper} onPress={finish}>{t('sent.toStep3')}</NbButton>
              </View>
            ) : card?.kind === 'reel' ? (
              <View testID="sent-next" style={{ opacity: reelFinished ? 1 : 0.4 }}>
                <NbButton variant="ink" size="lg" full icon="chevronRight" iconColor={nb.paper} onPress={() => reelFinished && next()}>{t('sent.next')}</NbButton>
              </View>
            ) : !result ? (
              <View testID="sent-check" style={{ opacity: card && hasDrillAnswer(card, answer) ? 1 : 0.4 }}>
                <NbButton variant="ink" size="lg" full icon="pencil" iconColor={nb.paper} onPress={check}>{t('recall.check')}</NbButton>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {!!repeatText && (
                  <View testID="sent-repeat" style={{ flex: 1 }}>
                    <NbButton variant="paper" size="lg" full icon="mic" onPress={() => repeat(repeatText)}>{t('sent.repeat')}</NbButton>
                  </View>
                )}
                <View testID="sent-next" style={{ flex: 1 }}>
                  <NbButton variant="ink" size="lg" full icon="chevronRight" iconColor={nb.paper} onPress={next}>{t('sent.next')}</NbButton>
                </View>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}
