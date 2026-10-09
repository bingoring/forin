// STEP 2 문장 — lesson-fidelity-v46 T4 (Build Spec §L, 결정 2).
//
// 핸드오프 아트보드 순서대로 화면을 나눈다: 릴(C0, forin-notebook-lesson-nuance.jsx ImmersionReel) →
// 문장장(forin-notebook-lesson-sent-live.jsx SentStudyLive, 끝에 DONE 장) → 같은 뜻 다른 장면(C5 ContextMatch) →
// 한 단어 바꾸기(C6 SwapOne) → 완료(C' forin-notebook-lesson.jsx LessonSentenceDone). 한 라우트 안의 단계다 —
// 뒤로 가기(나가기)는 어느 단계에서든 허브로. 없는 화면은 건너뛴다(R3): 릴이 없는 상황은 문장장부터,
// C5·C6 항목이 없으면 그 화면 없이.
//
// 학습 기록은 v44 그대로(R5): 문장장은 STEP 1에서 틀린 단어가 든 문장부터, 완료 화면의 CTA가 STEP 2를
// 기록하고 가이드 대화(STEP 3)로 간다. 문장 '아직 헷갈려요'는 교정노트에 한 장, 릴의 감상은 하나.
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { NbSheet, nbText } from '@/components/nb/NbUI';
import { SentReel } from '@/components/lesson/SentReel';
import { SentSheets } from '@/components/lesson/SentSheets';
import { SentContext } from '@/components/lesson/SentContext';
import { SentSwap } from '@/components/lesson/SentSwap';
import { SentPassed } from '@/components/lesson/SentPassed';
import { api, type LessonDetail } from '@/api/client';
import { buildSheets, sheetLine, shortTitle, step2Phases, type SheetCard } from '@/data/sentenceDrill';
import { deptNbIcon } from '@/data/campus';
import { TOP_INSET, nb } from '@/theme/nb';
import { useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

export default function LessonSentencesRoute() {
  const t = useT();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [at, setAt] = useState(0);
  const finishing = useRef(false);

  useEffect(() => {
    let alive = true;
    api.lesson(id).then((l) => { if (alive) setLesson(l); }).catch(() => {});
    return () => { alive = false; };
  }, [id]);

  const phases = useMemo(() => (lesson ? step2Phases(lesson) : []), [lesson]);
  const sheets = useMemo<SheetCard[]>(() => (lesson ? buildSheets(lesson.sentences, lesson.words, lesson.order) : []), [lesson]);
  const phase = phases[at];
  const drillTotal = phases.filter((p) => p.kind === 'context' || p.kind === 'swap').length;
  const next = () => setAt((a) => Math.min(a + 1, phases.length - 1));
  const exit = () => router.back();

  // 감상 하나(스펙 2-9 §11-8): 화면의 선택은 바꿀 수 있고(핸드오프 NU:107), 노트에는 처음 고른 것 한 번.
  const [feel, setFeel] = useState<string | null>(null);
  const [feelSave, setFeelSave] = useState<'idle' | 'saved' | 'failed'>('idle');
  const feelSent = useRef(false);
  const pickFeel = (f: string) => {
    setFeel(f);
    if (feelSent.current) return;
    feelSent.current = true;
    // 저장이 실패해도 해설은 보이고 넘어갈 수 있다 — 감상은 학습을 막을 이유가 아니다. 실패는 알린다.
    api.reelFeel(id, f).then(() => setFeelSave('saved')).catch(() => setFeelSave('failed'));
  };

  const repeat = (text: string) => router.push({
    pathname: '/pronunciation/[sentenceKey]',
    params: { sentenceKey: text.slice(0, 40), referenceText: text, origin: 'lesson', scenarioId: id },
  });
  // Filed in the background: the next sheet must not wait on the review notes (words.tsx 같은 규칙).
  const confused = (card: SheetCard) => { void api.confusedSentence(id, sheetLine(card)).catch(() => {}); };

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

  const name = lesson ? shortTitle(lesson.situation.title) : '';
  return (
    <NbSheet style={{ paddingTop: TOP_INSET }}>
      <Stack.Screen options={TASK_SCREEN} />
      {!lesson ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={nb.ink} /></View>
      ) : !lesson.sentences.length ? (
        <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center', marginTop: 40 }]}>{t('lesson.hub.emptyNote')}</Text>
      ) : phase?.kind === 'reel' ? (
        <SentReel item={phase.item} feel={feel} feelSave={feelSave} onFeel={pickFeel} onStart={next} onExit={exit} />
      ) : phase?.kind === 'sheets' ? (
        <SentSheets sheets={sheets} name={name} fallbackIcon={deptNbIcon(lesson.situation.id)}
          onConfused={confused} onRepeat={repeat} onDone={next} onExit={exit} />
      ) : phase?.kind === 'context' ? (
        <SentContext key={`c${at}`} item={phase.item} k={phase.k} total={drillTotal} onRepeat={repeat} onNext={next} onExit={exit} />
      ) : phase?.kind === 'swap' ? (
        <SentSwap key={`s${at}`} item={phase.item} k={phase.k} total={drillTotal} onRepeat={repeat} onNext={next} onExit={exit} />
      ) : (
        <SentPassed sentences={lesson.sentences} situation={lesson.situation.title} onExit={exit} onRepeat={repeat} onFinish={finish} saveFailed={saveFailed} />
      )}
    </NbSheet>
  );
}
