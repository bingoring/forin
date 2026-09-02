// APGAR 채점 — score a newborn on the five signs (v31 M).
//
// A scoring TABLE, which is what an APGAR sheet is: five rows, each with three circles,
// and a running total stamped beside the criteria. The circles are the notebook's stamp
// vocabulary — a chosen one is double-ringed in green and set a few degrees off square,
// because a score is pressed onto a chart rather than typed into a field.
//
// The total is shown WHILE scoring, unfinished, and that is deliberate: APGAR is a sum a
// nurse holds in their head as they go, and the number is the thing that decides what
// happens next. It is the learner's own running total, not a verdict — the verdict only
// appears on submit.
//
// The signs stay in English (they are the vocabulary); the findings are in the reader's
// language (they are the case). See server content.QuizApgarRow.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbMemo, NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, type QuizProgress, ContextBox, HintRow, ResultBanner } from '@/components/quiz/QuizShell';
import { useT } from '@/i18n';

const SCORES = [0, 1, 2];

export function ApgarQuiz({ quiz, onExit, onComplete, progress }: {
  quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress;
}) {
  const t = useT();
  const c = quiz.content!;
  const rows = c.apgar ?? [];
  const [picked, setPicked] = useState<(number | null)[]>(() => rows.map(() => null));
  const [checked, setChecked] = useState(false);

  const answered = picked.filter((p) => p !== null).length;
  // Guarded on rows.length: `[].every` is vacuously true, so a payload with no rows would
  // otherwise submit as a complete, correct score of zero.
  const full = rows.length > 0 && answered === rows.length;
  const allCorrect = checked && full && picked.every((p, i) => p === rows[i].score);
  // The learner's own running total — the sum of what they have picked so far.
  const running = picked.reduce<number>((n, p) => n + (p ?? 0), 0);
  const truth = rows.reduce((n, r) => n + r.score, 0);

  const pick = (row: number, score: number) => {
    if (checked) return;
    const next = [...picked];
    next[row] = next[row] === score ? null : score;
    setPicked(next);
  };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && allCorrect
          ? <View style={{ flex: 1 }}><NbButton variant="ink" full icon="check" iconColor={nb.paper} onPress={onComplete}>{t('quiz.finish')}</NbButton></View>
          : checked
            ? <View style={{ flex: 1 }}><NbButton variant="paper" full onPress={() => { setChecked(false); setPicked(rows.map(() => null)); }}>{t('quiz.retry')}</NbButton></View>
            : (
              <View style={{ flex: 1 }}>
                <NbButton variant="ink" full disabled={!full} onPress={() => setChecked(true)}>
                  {full ? t('quiz.submitScore') : t('quiz.rowsLeft', { n: rows.length - answered })}
                </NbButton>
              </View>
            )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      <NbPaper rot={-0.4} tape tapeLeft={140} style={styles.sheet}>
        {rows.map((r, i) => {
          const mine = picked[i];
          return (
            <View key={i} style={[styles.row, i > 0 && styles.rowDivider]}>
              <View style={{ flex: 1, minWidth: 0 }}>
                {/* The sign is printed — it is the clinical term being learned. */}
                <Text numberOfLines={1} style={styles.sign}>{r.sign}</Text>
                <Text numberOfLines={2} style={[nbText.hand(14.5, nb.soft), { marginTop: 1 }]}>{r.finding}</Text>
              </View>
              {SCORES.map((sc) => {
                const on = mine === sc;
                const wasRight = checked && sc === r.score;
                const wasWrong = checked && on && sc !== r.score;
                const pen = wasWrong ? nb.red : wasRight || on ? nb.green : 'rgba(62,54,43,.3)';
                return (
                  <Pressable key={sc} onPress={() => pick(i, sc)} disabled={checked}>
                    <View
                      style={[
                        styles.circle,
                        {
                          borderColor: pen,
                          backgroundColor: on ? 'rgba(95,141,90,.1)' : 'transparent',
                          transform: [{ rotate: on ? '-6deg' : '0deg' }],
                        },
                      ]}
                    >
                      {/* Two rings for a stamped score — RN has no `border: double`, and a
                          single ring at this size reads as a radio button. */}
                      {on && <View pointerEvents="none" style={[styles.inner, { borderColor: pen }]} />}
                      <Text style={[styles.score, { color: on || wasRight ? pen : nb.soft }]}>{sc}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </NbPaper>

      {/* The criteria, and the running total stamped beside them. */}
      <View style={styles.totalRow}>
        {!!c.note && (
          <NbMemo color={nb.blue} rot={-0.3} style={{ flex: 1 }}>
            <Text style={nbText.hand(13.5)}>{c.note}</Text>
          </NbMemo>
        )}
        <View style={styles.total}>
          <View pointerEvents="none" style={styles.totalInner} />
          <Text numberOfLines={1} style={styles.totalLabel}>{checked ? t('quiz.apgarTruth') : t('quiz.apgarSoFar')}</Text>
          <Text numberOfLines={1} style={styles.totalNum}>{checked ? truth : running}</Text>
        </View>
      </View>

      {checked && <ResultBanner correct={allCorrect} />}
      {/* Which rows were wrong, named — a score of 6 against 7 does not say where. */}
      {checked && !allCorrect && (
        <View style={{ marginTop: 10, gap: 5 }}>
          {rows.map((r, i) => (picked[i] === r.score ? null : (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <NbIcon name="cross" size={11} color={nb.red} />
              <Text numberOfLines={2} style={[nbText.hand(14.5), { flex: 1, minWidth: 0 }]}>
                {t('quiz.apgarWasScore', { sign: r.sign, score: r.score })}
              </Text>
            </View>
          )))}
        </View>
      )}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}

const styles = StyleSheet.create({
  sheet: { paddingVertical: 8, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9 },
  rowDivider: { borderTopWidth: 1.3, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.15)' },
  sign: { fontFamily: nbFonts.monoBold, fontSize: 12, color: nb.ink },
  circle: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 1.8,
    alignItems: 'center', justifyContent: 'center',
  },
  inner: { position: 'absolute', left: 2.5, top: 2.5, right: 2.5, bottom: 2.5, borderRadius: 12, borderWidth: 1.2 },
  score: { fontFamily: nbFonts.hand, fontSize: 15 },
  totalRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  total: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 1.8, borderColor: nb.blue,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: [{ rotate: '8deg' }],
  },
  totalInner: { position: 'absolute', left: 3, top: 3, right: 3, bottom: 3, borderRadius: 29, borderWidth: 1.2, borderColor: nb.blue },
  totalLabel: { fontFamily: nbFonts.bodyBold, fontSize: 8, color: nb.blue },
  totalNum: { fontFamily: nbFonts.handBold, fontSize: 22, lineHeight: 24, color: nb.blue },
});
