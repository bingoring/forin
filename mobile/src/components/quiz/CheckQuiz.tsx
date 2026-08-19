// check quiz — select-all-that-apply. 1:1 with the v17 handoff CHECK format: a
// clipboard of rows (en + ko); tap to toggle a checkbox. Submit is correct only
// when the selected set exactly matches the items marked correct.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts, fs } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';
import { t } from '@/i18n';

export function CheckQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
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
          ? <View style={{ flex: 1 }}><PixelButton label={t('quiz.finish')} bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : checked
            ? <View style={{ flex: 1 }}><PixelButton label={t('quiz.retry')} bg="#fff" shadowColor={C} onPress={() => { setChecked(false); setSel(new Set()); }} full /></View>
            : <View style={{ flex: 1 }}><PixelButton label={t('quiz.submit')} bg={colors.mint} shadowColor={colors.mintShadow} disabled={sel.size === 0} onPress={() => setChecked(true)} full /></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* clipboard */}
      <Shadowed offset={3}>
        <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingHorizontal: 6, paddingVertical: 4 }}>
          <View style={{ position: 'absolute', top: -9, left: '50%', marginLeft: -17, width: 34, height: 8, backgroundColor: '#9CA3AF', borderWidth: 2, borderColor: C }} />
          {items.map((it, i) => {
            const on = sel.has(i);
            const wrong = checked && on !== !!it.correct;
            const box = checked ? (it.correct ? colors.mint : on ? '#FEE2E2' : '#fff') : on ? colors.mint : '#fff';
            return (
              <Pressable key={i} onPress={() => toggle(i)} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 8, paddingHorizontal: 6, borderBottomWidth: i < items.length - 1 ? 1.5 : 0, borderBottomColor: '#2A252233', borderStyle: 'dotted' }}>
                <View style={{ width: 19, height: 19, borderWidth: 2.5, borderColor: C, backgroundColor: box, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>{(checked ? it.correct : on) ? '✓' : wrong ? '✕' : ''}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>{it.text}</Text>
                  {!!it.ko && <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft, marginTop: 1 }}>{it.ko}</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Shadowed>

      {checked && <ResultBanner correct={allCorrect} />}
      {checked && !!c.note && (
        <View style={{ marginTop: 10, backgroundColor: colors.cream, borderWidth: 1.5, borderColor: '#2A252255', borderStyle: 'dashed', paddingVertical: 6, paddingHorizontal: 8 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, lineHeight: 15 }}><Text style={{ fontFamily: fonts.heading, color: C }}>Tip. </Text>{c.note}</Text>
        </View>
      )}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}
