// STEP 1 단어 — lesson-four-steps-v44 H (handoff reference forin-notebook-lesson.jsx LessonWords).
//
// One flashcard per word this situation's sentences use (the server derives the list
// from the sentences — spec §2-1), a progress chip per word above it, and two answers
// below: `헷갈려요` files the word into the review notes, `알아요` does not. Either moves
// on; the last card records the step and returns to the hub, which reloads on focus.
//
// The row holds as many chips as there are words — 8 is a minimum, not its size
// (spec §2-2) — so it wraps rather than squeezing 38 chips into one line.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { StepTrack } from '@/components/lesson/StepTrack';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbMark, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { api, type LessonDetail, type LessonStepView } from '@/api/client';
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

/** The example line with the headword picked out, the way the reference bolds it. */
function Example({ line, word }: { line: string; word: string }) {
  const at = line.toLowerCase().indexOf(word.toLowerCase());
  const base = [nbText.body(12, nb.soft), { fontStyle: 'italic' as const, textAlign: 'center' as const }];
  if (at < 0) return <Text style={base}>{`“${line}”`}</Text>;
  return (
    <Text style={base}>
      {`“${line.slice(0, at)}`}
      <Text style={{ color: nb.ink, fontFamily: nbFonts.bodyBold }}>{line.slice(at, at + word.length)}</Text>
      {`${line.slice(at + word.length)}”`}
    </Text>
  );
}

export default function LessonWordsRoute() {
  const t = useT();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    api.lesson(id).then((l) => { if (alive) setLesson(l); }).catch(() => {});
    return () => { alive = false; };
  }, [id]);

  const words = lesson?.words ?? [];
  const word = words[idx];

  const answer = async (confused: boolean) => {
    if (!word || busy) return;
    setBusy(true);
    try {
      // Best-effort: a note that failed to file must not stop the learner mid-deck.
      if (confused) await api.confusedWord(id, word.id).catch(() => {});
      if (idx < words.length - 1) {
        setIdx(idx + 1);
        return;
      }
      await api.clearLessonStep(id, 'words').catch(() => {});
      router.back();
    } finally {
      setBusy(false);
    }
  };

  const repeat = () => {
    if (!word) return;
    router.push({
      pathname: '/pronunciation/[sentenceKey]',
      params: { sentenceKey: word.en.slice(0, 40), referenceText: word.en, origin: 'lesson', scenarioId: id },
    });
  };

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
        {words.length > 0 && <NbTag color={nb.amber} fill>{`${idx + 1} / ${words.length}`}</NbTag>}
      </View>

      {!lesson ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={nb.ink} /></View>
      ) : (
        <>
          <View style={{ marginTop: 12 }}><StepTrack steps={onThisStep(lesson.steps)} /></View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, paddingHorizontal: 20, paddingTop: 14 }}>
            {words.map((w, i) => {
              const done = i < idx;
              const now = i === idx;
              return (
                <View key={w.id} testID="lesson-word-chip" style={{
                  width: 30, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center',
                  borderWidth: now ? 2 : done ? 1.5 : 1.3, borderStyle: now || done ? 'solid' : 'dashed',
                  borderColor: now ? nb.amber : done ? nb.green : nb.soft,
                  backgroundColor: done ? 'rgba(95,141,90,.15)' : now ? `${nb.amber}20` : 'transparent',
                  transform: [{ rotate: `${i % 2 ? 1.5 : -1.5}deg` }],
                }}>
                  <View style={{ opacity: done || now ? 1 : 0.35 }}><NbIcon name={w.icon ?? 'pencil'} size={15} /></View>
                </View>
              );
            })}
          </View>

          {!!word && (
            <View style={{ paddingHorizontal: 26, paddingTop: 18 }}>
              <NbPaper rot={-0.8} tape tapeLeft={140} style={{ paddingTop: 22, paddingHorizontal: 18, paddingBottom: 18, alignItems: 'center', minHeight: 250 }}>
                <View style={{
                  width: 92, height: 92, borderRadius: 46, backgroundColor: `${nb.amber}22`, borderWidth: 2, borderColor: nb.amber,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <NbIcon name={word.icon ?? 'pencil'} size={52} />
                </View>
                <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 28, color: nb.ink, marginTop: 16, letterSpacing: -0.5, textAlign: 'center' }}>{word.en}</Text>
                {!!word.ipa && <Text style={[nbText.mono(12), { marginTop: 3 }]}>{word.ipa}</Text>}
                <View style={{ marginTop: 10 }}><NbMark textStyle={nbText.hand(21)}>{word.ko}</NbMark></View>
                {!!word.example && <View style={{ marginTop: 12 }}><Example line={word.example} word={word.en} /></View>}
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 16 }}>
                  {([['lesson-word-listen', 'speaker', nb.blue, () => Speech.speak(word.en, { language: 'en-US', rate: 0.9 })],
                    ['lesson-word-repeat', 'mic', nb.red, repeat]] as const).map(([testID, icon, color, onPress], i) => (
                    <Pressable key={testID} testID={testID} onPress={onPress} hitSlop={6} style={{
                      width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: color, backgroundColor: `${color}18`,
                      alignItems: 'center', justifyContent: 'center', transform: [{ rotate: `${i ? 3 : -3}deg` }],
                    }}>
                      <NbIcon name={icon} size={26} />
                    </Pressable>
                  ))}
                </View>
              </NbPaper>
            </View>
          )}

          {words.length === 0 && (
            <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center', marginTop: 40 }]}>{t('lesson.hub.emptyNote')}</Text>
          )}
        </>
      )}

      {!!word && (
        <View style={{ position: 'absolute', left: 20, right: 20, bottom: 30, flexDirection: 'row', gap: 12 }}>
          <View testID="lesson-word-confused" style={{ flex: 1 }}>
            <NbButton variant="paper" size="lg" full rot={-0.5} icon="bulb" onPress={() => answer(true)} disabled={busy}>{t('lesson.words.confused')}</NbButton>
          </View>
          <View testID="lesson-word-known" style={{ flex: 1 }}>
            <NbButton variant="ink" size="lg" full rot={0.5} icon="check" iconColor={nb.paper} onPress={() => answer(false)} disabled={busy}>{t('lesson.words.known')}</NbButton>
          </View>
        </View>
      )}
    </View>
  );
}
