// C' STEP 2 완료 — 정본(R1) design-handoff_v46/reference/forin-notebook-lesson.jsx (LS) L373-406, Head L50-60.
//
//   LS:378     머리 — ← 종이 버튼 · "STEP 2 · 문장" hand 21 · 보조(상황) 10.5 · 채움 태그 "N / N" 11.
//              StepTrack(LS:379)은 결정 1로 뺀다.
//   LS:380-383 PASSED 도장(초록 92, nbl-pop) · "문장 N개, 입에 붙었어요" hand 22
//   LS:385-398 문장별 줄 — NbPaper ±0.4°, 발음 점수 원 34(80↑ 초록 · 아래 앰버), 문장 12.5, 스피커 17
//   LS:400-402 CTA "STEP 3 · 가이드 대화로 ›" (bottom 30)
//
// 점수는 지어내지 않는다(R3): 그 문장을 따라 말한 기록(GET /speech/attempts)의 마지막 점수.
// 아직 말해 본 적 없는 문장은 원이 비어 있고(점선), 누르면 따라 말하기로 간다 — 우리가 더한 것.
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Speech from 'expo-speech';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbPaper, NbStamp, NbTag, nbText } from '@/components/nb/NbUI';
import { NbEnter } from '@/components/nb/nbMotion';
import { api, type LessonSentence } from '@/api/client';
import { useT } from '@/i18n';
import { nb } from '@/theme/nb';

const say = (en: string) => Speech.speak(en, { language: 'en-US', rate: 0.9 });

export function SentPassed({ sentences, situation, onExit, onRepeat, onFinish, saveFailed }: {
  sentences: LessonSentence[];
  situation: string;
  onExit: () => void;
  onRepeat: (en: string) => void;
  onFinish: () => void;
  saveFailed: boolean;
}) {
  const t = useT();
  const n = sentences.length;
  const [scores, setScores] = useState<Record<string, number>>({});
  // Each time the screen is shown — including coming back from a 따라 말하기.
  useFocusEffect(useCallback(() => {
    let alive = true;
    for (const s of sentences) {
      api.speechAttempts(s.en, 1).then((rows) => {
        const last = rows[rows.length - 1]?.overall;
        if (alive && typeof last === 'number') setScores((m) => ({ ...m, [s.en]: Math.round(last) }));
      }).catch(() => {});
    }
    return () => { alive = false; };
  }, [sentences]));

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 8, paddingHorizontal: 20 }}>
        <Pressable testID="sent-exit" onPress={onExit} hitSlop={8}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <View style={{ minWidth: 0, flex: 1 }}>
          <Text numberOfLines={1} style={[nbText.hand(21), { lineHeight: 23.1 }]}>{t('sent.title')}</Text>
          <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 2, lineHeight: 14 }]}>{situation}</Text>
        </View>
        <NbTag color={nb.blue} fill textStyle={{ fontSize: 11 }}>{`${n} / ${n}`}</NbTag>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <View testID="sent-passed" style={{ paddingTop: 20, paddingHorizontal: 24, alignItems: 'center' }}>
          <NbEnter kind="pop" testID="sent-passed-stamp" style={{ alignSelf: 'flex-start' }}><NbStamp color={nb.green} size={92} top="STEP 2" bottom="PASSED" /></NbEnter>
          <Text style={[nbText.hand(22), { marginTop: 14 }]}>{t('sent.passed', { n })}</Text>
        </View>
        <View style={{ paddingTop: 14, paddingHorizontal: 20 }}>
          {sentences.map((s, i) => {
            const score = scores[s.en];
            const has = typeof score === 'number';
            const hi = has && score >= 80;
            return (
              <NbPaper key={`${i}-${s.en}`} rot={i % 2 ? 0.4 : -0.4} style={{ marginTop: 8, paddingVertical: 8, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Pressable testID={`sent-score-${i}`} onPress={() => onRepeat(s.en)} hitSlop={4} accessibilityRole="button" style={{
                  width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderStyle: has ? 'solid' : 'dashed',
                  borderColor: has ? (hi ? nb.green : nb.amber) : nb.soft,
                  backgroundColor: has ? (hi ? 'rgba(95,141,90,.15)' : `${nb.amber}20`) : 'transparent',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {has ? <Text style={[nbText.hand(13.5), { lineHeight: 16 }]}>{String(score)}</Text> : <NbIcon name="mic" size={15} color={nb.soft} />}
                </Pressable>
                <Text style={[nbText.body(12.5), { flex: 1, minWidth: 0, lineHeight: 17.5 }]}>{s.en}</Text>
                <Pressable testID={`sent-passed-say-${i}`} onPress={() => say(s.en)} hitSlop={8}><NbIcon name="speaker" size={17} /></Pressable>
              </NbPaper>
            );
          })}
        </View>
      </ScrollView>

      <View testID="sent-to-step3" style={{ position: 'absolute', left: 20, right: 20, bottom: 30 }}>
        {saveFailed && <Text testID="lesson-save-failed" style={[nbText.hand(14, nb.red), { textAlign: 'center', marginBottom: 8 }]}>{t('lesson.saveFailed')}</Text>}
        <NbButton variant="ink" size="lg" full icon="speech" iconRight="chevronRight" iconColor={nb.paper} onPress={onFinish}>{t('sent.toStep3')}</NbButton>
      </View>
    </View>
  );
}
