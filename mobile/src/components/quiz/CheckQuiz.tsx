// check quiz — select-all-that-apply. 1:1 with the v17 handoff CHECK format: a
// clipboard of rows (en + ko); tap to toggle a checkbox. Submit is correct only
// when the selected set exactly matches the items marked correct.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { NbButton } from '@/components/nb/NbUI';
import { t, useT } from '@/i18n';

export function CheckQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const t = useT();
  const c = quiz.content!;
  const items = c.items ?? [];
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);
  const allCorrect = checked && items.every((it, i) => !!it.correct === sel.has(i));

  const toggle = (i: number) => {
    if (checked) return;
    const s = new Set(sel); s.has(i) ? s.delete(i) : s.add(i); setSel(s);
  };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && allCorrect
          ? <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} onPress={onComplete}>{t('quiz.finish')}</NbButton></View>
          : checked
            ? <View style={{ flex: 1 }}><NbButton variant="paper" full onPress={() => { setChecked(false); setSel(new Set()); }}>{t('quiz.retry')}</NbButton></View>
            : <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} disabled={sel.size === 0} onPress={() => setChecked(true)}>{t('quiz.submit')}</NbButton></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* clipboard */}
      <Shadowed offset={3}>
        <View style={{ backgroundColor: nb.paper, borderWidth: 1.5, borderColor: nb.paperEdge, paddingHorizontal: 6, paddingVertical: 4 }}>
          <View style={{ position: 'absolute', top: -9, left: '50%', marginLeft: -17, width: 34, height: 8, backgroundColor: '#9CA3AF', borderWidth: 1.4, borderColor: nb.ink }} />
          {items.map((it, i) => {
            const on = sel.has(i);
            const wrong = checked && on !== !!it.correct;
            const box = checked ? (it.correct ? 'rgba(168,217,151,.4)' : on ? '#FFF0EC' : '#fff') : on ? 'rgba(168,217,151,.4)' : '#fff';
            return (
              <Pressable key={i} onPress={() => toggle(i)} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 8, paddingHorizontal: 6, borderBottomWidth: i < items.length - 1 ? 1.5 : 0, borderBottomColor: 'rgba(62,54,43,.18)', borderStyle: 'dashed' }}>
                {/* Hand-drawn, not a glyph: a ✓ renders at the type's weight and the
                    baseline of nothing else on the page (theme/glyphs.test.ts). */}
                <View style={{ width: 20, height: 20, borderWidth: 1.7, borderRadius: 4, borderColor: wrong ? nb.red : (checked ? it.correct : on) ? nb.green : nb.soft, backgroundColor: box, alignItems: 'center', justifyContent: 'center' }}>
                  {(checked ? it.correct : on)
                    ? <NbIcon name="check" size={14} color={nb.green} />
                    : wrong ? <NbIcon name="cross" size={12} color={nb.red} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: nbFonts.hand, fontSize: 16.2, color: C }}>{it.text}</Text>
                  {!!it.ko && <Text style={{ fontFamily: nbFonts.body, fontSize: 9.5, color: nb.soft, marginTop: 1 }}>{it.ko}</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Shadowed>

      {checked && <ResultBanner correct={allCorrect} />}
      {checked && !!c.note && (
        <View style={{ marginTop: 10, backgroundColor: nb.cream, borderWidth: 1.5, borderColor: 'rgba(62,54,43,.18)', borderStyle: 'dashed', paddingVertical: 6, paddingHorizontal: 8 }}>
          <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.soft, lineHeight: 15 }}><Text style={{ fontFamily: nbFonts.hand, color: C }}>Tip. </Text>{c.note}</Text>
        </View>
      )}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}
