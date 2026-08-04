// mcq quiz — clinical multiple-choice. 1:1 with the v17 handoff MCQ format: a
// dark SCENE card + suggested-answer rows (en + ko). Pick one; on submit the
// correct row locks green, a wrong pick flashes red, and a "왜?" note explains.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

export function McqQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const opts = c.choices ?? [];
  const scene = c.scene || c.context || ''; // generated MCQs carry the situation in `context`
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = checked && picked !== null && !!opts[picked]?.correct;

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && correct
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : <View style={{ flex: 1 }}><PixelButton label={checked ? '↻ 다시' : '✓ 답 확인'} bg={colors.mint} shadowColor={colors.mintShadow} disabled={picked === null} onPress={() => (checked ? (setChecked(false), setPicked(null)) : setChecked(true))} full /></View>
      }
    >
      {/* scene card — hidden when there's no situation text (avoids an empty box) */}
      {!!scene && (
        <View style={{ backgroundColor: C, borderWidth: 3, borderColor: C, padding: 12, marginBottom: 13, position: 'relative' }}>
          <View style={{ position: 'absolute', top: -7, left: 10, backgroundColor: colors.peach, borderWidth: 1.5, borderColor: C, paddingHorizontal: 5 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: C }}>💬 SCENE</Text>
          </View>
          <Text style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.cream, lineHeight: 19 }}>{scene}</Text>
        </View>
      )}

      {/* options */}
      <View style={{ gap: 8 }}>
        {opts.map((o, i) => {
          const isPicked = picked === i;
          const showRight = checked && o.correct;
          const showWrong = checked && isPicked && !o.correct;
          const bg = showRight ? colors.mint : showWrong ? '#FEE2E2' : isPicked ? colors.yellow : '#fff';
          const mark = showRight ? '✓' : showWrong ? '✕' : `${i + 1}`;
          return (
            <Shadowed key={i} offset={2} shadowColor={showRight ? colors.mintShadow : showWrong ? '#EF4444' : C}>
              <Pressable onPress={() => !checked && setPicked(i)} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: bg, borderWidth: 2.5, borderColor: C, padding: 9 }}>
                <View style={{ width: 20, height: 20, backgroundColor: isPicked || showRight || showWrong ? C : colors.paper, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: isPicked || showRight || showWrong ? '#fff' : C }}>{mark}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 12.5, color: C, lineHeight: 17 }}>{o.text}</Text>
                  {!!o.ko && <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, marginTop: 2 }}>{o.ko}</Text>}
                </View>
              </Pressable>
            </Shadowed>
          );
        })}
      </View>

      {checked && !!c.note && (
        <Shadowed offset={2} shadowColor={colors.mintShadow} style={{ marginTop: 12 }}>
          <View style={{ backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 6, paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: fonts.body, fontSize: 10.5, color: C, lineHeight: 15 }}><Text style={{ fontFamily: fonts.heading }}>왜? </Text>{c.note}</Text>
          </View>
        </Shadowed>
      )}
    </QuizShell>
  );
}
