// spot_error quiz — find the one wrong row in an order sheet. 1:1 with the v17
// handoff SPOT ERROR format. Tap the row you think is wrong; correct if it's the
// row flagged error; a "정답" note explains why.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, C } from '@/components/quiz/QuizShell';
import { NbButton } from '@/components/nb/NbUI';
import { useEffect } from 'react';
import { playSfx } from '@/lib/sfx';
import { t, useT } from '@/i18n';

export function SpotErrorQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const t = useT();
  const c = quiz.content!;
  const rows = c.rows ?? [];
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = checked && picked !== null && !!rows[picked]?.error;

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
      {!!c.context && <ContextBox text={c.context} />}

      <Shadowed offset={3}>
        <View style={{ backgroundColor: nb.paper, borderWidth: 1.5, borderColor: nb.paperEdge, paddingHorizontal: 4, paddingVertical: 2 }}>
          {rows.map((r, i) => {
            const isPicked = picked === i;
            const showErr = checked && r.error;
            const showWrongPick = checked && isPicked && !r.error;
            const bg = showErr ? '#FFF0EC' : showWrongPick ? 'rgba(249,227,123,.5)' : isPicked ? 'rgba(249,227,123,.5)' : 'transparent';
            return (
              <Pressable key={i} onPress={() => !checked && setPicked(i)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 8, backgroundColor: bg, borderBottomWidth: i < rows.length - 1 ? 1.5 : 0, borderBottomColor: 'rgba(62,54,43,.18)', borderStyle: 'dashed' }}>
                <Text style={{ fontFamily: nbFonts.body, fontSize: 11, color: nb.soft }}>{r.label}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
                  <Text style={{ fontFamily: nbFonts.hand, fontSize: 16.9, color: C, textAlign: 'right' }}>{r.text}</Text>
                  {showErr && <View style={{ backgroundColor: nb.red, borderRadius: 3, paddingHorizontal: 4, paddingVertical: 2 }}><NbIcon name="cross" size={11} color={nb.paper} /></View>}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Shadowed>

      <Text style={{ fontFamily: nbFonts.body, fontSize: 11, color: nb.paper, textAlign: 'center', marginTop: 10 }}>위 항목 중 <Text style={{ fontFamily: nbFonts.hand }}>잘못된 하나</Text>를 찾으세요.</Text>

      {checked && !!c.note && (
        <Shadowed offset={2} shadowColor={nb.green} style={{ marginTop: 10 }}>
          <View style={{ backgroundColor: 'rgba(168,217,151,.4)', borderWidth: 1.4, borderColor: nb.ink, paddingVertical: 6, paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: nbFonts.body, fontSize: 10.5, color: C, lineHeight: 15 }}><Text style={{ fontFamily: nbFonts.hand }}>정답 </Text>{c.note}</Text>
          </View>
        </Shadowed>
      )}
    </QuizShell>
  );
}
