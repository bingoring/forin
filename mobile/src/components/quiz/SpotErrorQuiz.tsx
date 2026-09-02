// 오류찾기 — find the one wrong line on an order sheet (v31 N).
//
// Tap the row you think is wrong; correct if it is the row the content flagged. The mark
// is v31's: a red-pen ELLIPSE drawn around the wrong value, which is what a pharmacist
// actually does to a bad label. It replaced a red ✕ chip beside the row — a chip says
// "this row has a property", a circle says "somebody caught this".
//
// v31's artboard draws the prescription and the dispensed label SIDE BY SIDE and asks for
// circles on both errors. That needs paired content (what was ordered vs what was
// printed); the content this type ships is one sheet of rows with one flagged, so the
// layout stays a single sheet and only the mark changes.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { nb, nbFonts } from '@/theme/nb';
import Svg, { Ellipse } from 'react-native-svg';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, C } from '@/components/quiz/QuizShell';
import { NbButton, NbMemo, nbText } from '@/components/nb/NbUI';
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
                <View style={{ flexShrink: 1 }}>
                  {/* The circle is drawn OVER the value, not beside it — the point of the
                      gesture is that the wrong thing itself is ringed. */}
                  {showErr && (
                    <View pointerEvents="none" style={styles.ring}>
                      <Svg width="100%" height="100%" viewBox="0 0 100 34" preserveAspectRatio="none">
                        <Ellipse cx="50" cy="17" rx="47" ry="14" fill="none" stroke={nb.red} strokeWidth={2.4} transform="rotate(-3 50 17)" />
                      </Svg>
                    </View>
                  )}
                  <Text style={{ fontFamily: nbFonts.hand, fontSize: 16.9, color: C, textAlign: 'right' }}>{r.text}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Shadowed>

      {/* This line was cream-on-cream after the token sweep — it used to sit on the dark
          pixel card, and `#fff` became the notebook's paper colour on a paper page. */}
      <Text style={[nbText.hand(15, nb.soft), { textAlign: 'center', marginTop: 12 }]}>{t('quiz.findTheWrongOne')}</Text>

      {/* How many are caught, counted in red rings — the artboard's 찾은 오류 row. */}
      {checked && correct && (
        <View style={styles.counter}>
          <Text numberOfLines={1} style={nbText.hand(14, nb.soft)}>{t('quiz.foundErrors')}</Text>
          <View style={styles.countRing}><Text style={styles.countRingText}>1</Text></View>
          <Text numberOfLines={1} style={nbText.hand(14, nb.green)}>{t('quiz.ofOneDone')}</Text>
        </View>
      )}

      {checked && !!c.note && (
        <NbMemo color={correct ? nb.green : nb.red} rot={0.3} style={{ marginTop: 12 }}>
          <Text style={nbText.hand(14.5)}>
            <Text style={{ color: correct ? nb.green : nb.red }}>{t('quiz.answerLabel')} </Text>{c.note}
          </Text>
        </NbMemo>
      )}
    </QuizShell>
  );
}

const styles = {
  /** Sized to the value it rings, and drawn on top of it. */
  ring: { position: 'absolute', left: -8, right: -8, top: -2, bottom: -2 } as const,
  counter: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 12, justifyContent: 'center' } as const,
  countRing: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 1.8, borderColor: nb.red,
    alignItems: 'center', justifyContent: 'center',
  } as const,
  countRingText: { fontFamily: nbFonts.hand, fontSize: 12, color: nb.red } as const,
};
