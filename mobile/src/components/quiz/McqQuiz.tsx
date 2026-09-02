// mcq quiz — clinical multiple-choice. 1:1 with the v17 handoff MCQ format: a
// dark SCENE card + suggested-answer rows (en + ko). Pick one; on submit the
// correct row locks green, a wrong pick flashes red, and a "왜?" note explains.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, type QuizProgress, Shadowed, C } from '@/components/quiz/QuizShell';
import { NbButton } from '@/components/nb/NbUI';
import { useEffect } from 'react';
import { playSfx } from '@/lib/sfx';
import { t, useT } from '@/i18n';

export function McqQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const t = useT();
  const c = quiz.content!;
  const opts = c.choices ?? [];
  const scene = c.scene || c.context || ''; // generated MCQs carry the situation in `context`
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = checked && picked !== null && !!opts[picked]?.correct;

  // These two reveal inline instead of via ResultBanner, so the verdict sound
  // hangs off `checked` flipping true.
  useEffect(() => {
    if (checked) playSfx(correct ? 'confirm' : 'wrong');
  }, [checked, correct]);

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && correct
          ? <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} onPress={onComplete}>{t('quiz.finish')}</NbButton></View>
          : <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} disabled={picked === null} onPress={() => (checked ? (setChecked(false), setPicked(null)) : setChecked(true))}>{checked ? t('quiz.retry') : t('quiz.check')}</NbButton></View>
      }
    >
      {/* scene card — hidden when there's no situation text (avoids an empty box) */}
      {!!scene && (
        <View style={{ backgroundColor: C, borderWidth: 1.5, borderColor: nb.paperEdge, padding: 12, marginBottom: 13, position: 'relative' }}>
          <View style={{ position: 'absolute', top: -7, left: 10, backgroundColor: '#FFF3EE', borderWidth: 1.3, borderColor: nb.ink, paddingHorizontal: 5 }}>
            <Text style={{ fontFamily: nbFonts.hand, fontSize: 10.8, color: C }}>SCENE</Text>
          </View>
          <Text style={{ fontFamily: nbFonts.body, fontSize: 12.5, color: nb.cream, lineHeight: 19 }}>{scene}</Text>
        </View>
      )}

      {/* options */}
      <View style={{ gap: 8 }}>
        {opts.map((o, i) => {
          const isPicked = picked === i;
          const showRight = checked && o.correct;
          const showWrong = checked && isPicked && !o.correct;
          const bg = showRight ? 'rgba(168,217,151,.4)' : showWrong ? '#FFF0EC' : isPicked ? 'rgba(249,227,123,.5)' : '#fff';
          // The mark is DRAWN once it is a verdict; until then it is just the option's
          // number, which is type.
          const mark = `${i + 1}`;
          return (
            <Shadowed key={i} offset={2} shadowColor={showRight ? nb.green : showWrong ? nb.red : C}>
              <Pressable onPress={() => !checked && setPicked(i)} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: bg, borderWidth: 1.5, borderColor: nb.paperEdge, padding: 9 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1.7, borderColor: showRight ? nb.green : showWrong ? nb.red : isPicked ? nb.ink : nb.soft }}>
                  {showRight
                    ? <NbIcon name="check" size={14} color={nb.green} />
                    : showWrong
                      ? <NbIcon name="cross" size={12} color={nb.red} />
                      : <Text style={{ fontFamily: nbFonts.hand, fontSize: 14, color: isPicked ? nb.ink : nb.soft }}>{mark}</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: nbFonts.hand, fontSize: 16.9, color: C, lineHeight: 17 }}>{o.text}</Text>
                  {!!o.ko && <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.soft, marginTop: 2 }}>{o.ko}</Text>}
                </View>
              </Pressable>
            </Shadowed>
          );
        })}
      </View>

      {checked && !!c.note && (
        <Shadowed offset={2} shadowColor={nb.green} style={{ marginTop: 12 }}>
          <View style={{ backgroundColor: 'rgba(168,217,151,.4)', borderWidth: 1.4, borderColor: nb.ink, paddingVertical: 6, paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: nbFonts.body, fontSize: 10.5, color: C, lineHeight: 15 }}><Text style={{ fontFamily: nbFonts.hand }}>왜? </Text>{c.note}</Text>
          </View>
        </Shadowed>
      )}
    </QuizShell>
  );
}
