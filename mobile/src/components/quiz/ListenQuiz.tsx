// listen quiz — verbal-order dictation. 1:1 with the v16 handoff Listening
// screen. A 🔊 play button speaks the order via on-device TTS (expo-speech);
// the learner picks the exact read-back from 3 similar-sounding choices.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

export function ListenQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const choices = c.choices ?? [];
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = checked && picked !== null && !!choices[picked]?.correct;

  const play = () => { Speech.stop(); Speech.speak(c.audioText ?? '', { language: 'en-US', rate: 0.9 }); };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && correct
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : (
            <>
              <PixelButton label="🔊 다시 듣기" bg="#fff" shadowColor={C} onPress={play} style={{ flex: 1 }} />
              <View style={{ flex: 2 }}>
                <PixelButton label={checked ? '↻ 다시' : '✓ 복창하기'} bg={colors.mint} shadowColor={colors.mintShadow} disabled={picked === null} onPress={() => (checked ? (setChecked(false), setPicked(null)) : setChecked(true))} full />
              </View>
            </>
          )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* audio card */}
      <Shadowed offset={3}>
        <Pressable onPress={play} style={{ backgroundColor: '#0F1A24', borderWidth: 3, borderColor: C, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, backgroundColor: colors.mint, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20 }}>🔊</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: '#22D3EE' }}>AUDIO · 탭하여 재생</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: '#94A3B8', marginTop: 3 }}>Dr. Patel의 구두 처방을 듣고 정확히 고르세요</Text>
          </View>
        </Pressable>
      </Shadowed>

      {/* choices */}
      <View style={{ marginTop: 14, gap: 8 }}>
        {choices.map((ch, i) => {
          const isPicked = picked === i;
          const showRight = checked && ch.correct;
          const showWrong = checked && isPicked && !ch.correct;
          const bg = showRight ? colors.mint : showWrong ? '#FEE2E2' : isPicked ? colors.yellow : '#fff';
          return (
            <Shadowed key={i} offset={isPicked ? 3 : 2} shadowColor={isPicked ? colors.yellowShadow : C}>
              <Pressable onPress={() => !checked && setPicked(i)} style={{ backgroundColor: bg, borderWidth: 2, borderColor: C, flexDirection: 'row' }}>
                <View style={{ width: 30, backgroundColor: isPicked || showRight ? colors.mint : colors.peach, borderRightWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>{String.fromCharCode(65 + i)}</Text>
                </View>
                <View style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 10 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C, lineHeight: 17 }}>{ch.text}{showRight ? ' ✓' : showWrong ? ' ✗' : ''}</Text>
                  {!!ch.tags?.length && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
                      {ch.tags.map((t, ti) => (
                        <View key={ti} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C, paddingHorizontal: 5, paddingVertical: 1 }}>
                          <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: C }}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </Pressable>
            </Shadowed>
          );
        })}
      </View>

      {checked && <ResultBanner correct={correct} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}
