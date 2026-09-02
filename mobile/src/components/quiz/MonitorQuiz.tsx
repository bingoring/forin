// 바이탈 라벨링 — put the English name on each number the monitor is showing (v31 I).
//
// A dark monitor INSIDE a taped sheet of paper: the readout is a machine (see
// components/pron/nbPron for the rule), and what the learner is doing is sticking labels
// onto it. So the numbers are printed in the monitor's own colours and the labels are
// slips of paper laid on top — a confirmed one is white paper with a drawn tick, an empty
// slot is a dashed "?" in the monitor's light.
//
// Tap a reading to select it, then a label to assign; submit checks each slot against the
// reading's own label.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import type { QuizDetail } from '@/api/client';
import { AUDIO } from '@/components/pron/nbPron';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, QuizSection, type QuizProgress, ContextBox, HintRow, ResultBanner } from '@/components/quiz/QuizShell';
import { NbButton, NbPaper } from '@/components/nb/NbUI';
import { NbIcon } from '@/components/nb/NbIcon';
import { useT } from '@/i18n';

/** The monitor's body. Lighter than the audio slab on purpose: this one sits inside a
 *  sheet of paper and has to read as a device on a page, not a hole in it. */
const MONITOR = '#213B4A';

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

export function MonitorQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const t = useT();
  const c = quiz.content!;
  const readings = c.readings ?? [];
  const bank = useMemo(() => shuffle(c.bank ?? []), [c.bank]);
  const [assigned, setAssigned] = useState<(string | null)[]>(() => readings.map(() => null));
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const used = new Set(assigned.filter(Boolean) as string[]);
  const full = assigned.every((a) => a !== null) && readings.length > 0;
  const allCorrect = checked && assigned.every((a, i) => a === readings[i].label);

  const tapReading = (i: number) => {
    if (checked) return;
    if (assigned[i]) { const a = [...assigned]; a[i] = null; setAssigned(a); return; } // clear
    setSel(i);
  };
  const tapLabel = (label: string) => {
    if (checked || used.has(label)) return;
    const target = sel !== null && assigned[sel] === null ? sel : assigned.indexOf(null);
    if (target === -1) return;
    const a = [...assigned]; a[target] = label; setAssigned(a); setSel(null);
  };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && allCorrect
          ? <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} onPress={onComplete}>{t('quiz.finish')}</NbButton></View>
          : checked
            ? <View style={{ flex: 1 }}><NbButton variant="paper" full onPress={() => { setChecked(false); setAssigned(readings.map(() => null)); setSel(null); }}>{t('quiz.retry')}</NbButton></View>
            : (
              <>
                <NbButton variant="paper" disabled={assigned.every((a) => a === null)} onPress={() => { setAssigned(readings.map(() => null)); setSel(null); }} style={{ flex: 1 }}>{t('quiz.restart')}</NbButton>
                <View style={{ flex: 2 }}><NbButton variant="ink" full iconColor={nb.paper} disabled={!full} onPress={() => setChecked(true)}>{t('quiz.submitReading')}</NbButton></View>
              </>
            )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* The monitor, taped into the notebook. */}
      <NbPaper rot={-0.4} tape tapeLeft={130} style={{ padding: 11 }}>
        <View style={{ backgroundColor: MONITOR, borderRadius: 4, paddingVertical: 12, paddingHorizontal: 13 }}>
          {!!c.device && <Text numberOfLines={1} style={styles.device}>{c.device}</Text>}
          {readings.map((r, i) => {
            const a = assigned[i];
            const ok = checked && a === r.label;
            const isSel = sel === i && !a;
            return (
              <Pressable key={i} onPress={() => tapReading(i)} style={[styles.row, i > 0 && { marginTop: 9 }]}>
                {/* The number is the monitor's, in the monitor's own colour and face. */}
                <Text numberOfLines={1} style={[styles.num, { color: r.color || AUDIO.waveLit }]}>{r.num}</Text>
                <Text numberOfLines={1} style={styles.unit}>{r.unit}</Text>
                <View style={{ flex: 1 }} />
                {a ? (
                  // A label that has been stuck on: white paper, slightly askew, with the
                  // verdict DRAWN beside it rather than appended to the words.
                  <View style={[styles.stuck, checked && { backgroundColor: ok ? 'rgba(168,217,151,.55)' : '#FFF0EC' }]}>
                    <Text numberOfLines={1} style={styles.stuckText}>{a}</Text>
                    {checked && <NbIcon name={ok ? 'check' : 'cross'} size={12} color={ok ? nb.green : nb.red} />}
                  </View>
                ) : (
                  <View style={[styles.slot, isSel && { borderColor: '#F9E37B', backgroundColor: 'rgba(249,227,123,.18)' }]}>
                    <Text style={styles.slotText}>?</Text>
                  </View>
                )}
              </Pressable>
            );
          })}

          {/* The trace, running under the numbers — what makes the slab read as a live
              monitor rather than a table. */}
          <View style={styles.trace}>
            <Svg width="100%" height={24} viewBox="0 0 200 24" preserveAspectRatio="none">
              <Polyline points="0,12 30,12 32,4 34,20 36,12 80,12 82,4 84,20 86,12 130,12 132,4 134,20 136,12 180,12 200,12" fill="none" stroke={AUDIO.waveLit} strokeWidth={1.5} />
            </Svg>
          </View>
        </View>
      </NbPaper>

      {/* The labels, waiting to be stuck on. Printed, because they are the English terms
          the learner is being asked to attach — and a used one stays, struck through. */}
      <QuizSection label={t('quiz.labelCards')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
        {bank.map((label, i) => {
          const isUsed = used.has(label);
          return (
            <Pressable key={i} onPress={() => tapLabel(label)}>
              {isUsed ? (
                <View style={styles.bankUsed}>
                  <Text style={[styles.bankText, { color: nb.placeholder, textDecorationLine: 'line-through' }]}>{label}</Text>
                </View>
              ) : (
                <NbPaper rot={i % 2 ? 1 : -1} style={styles.bank}>
                  <Text style={styles.bankText}>{label}</Text>
                </NbPaper>
              )}
            </Pressable>
          );
        })}
      </View>

      {checked && <ResultBanner correct={allCorrect} />}
      {!!c.note && <HintRow text={c.note} />}
    </QuizShell>
  );
}

const styles = {
  device: { fontFamily: nbFonts.mono, fontSize: 9, color: 'rgba(255,255,255,.5)', letterSpacing: 1, marginBottom: 8 } as const,
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 10 } as const,
  num: { fontFamily: nbFonts.monoBold, fontSize: 24, minWidth: 86 } as const,
  unit: { fontFamily: nbFonts.mono, fontSize: 10, color: 'rgba(255,255,255,.55)' } as const,
  stuck: {
    flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1,
    backgroundColor: nb.paper, borderWidth: 1.4, borderColor: nb.ink,
    paddingVertical: 3, paddingHorizontal: 9, transform: [{ rotate: '-2deg' }],
  } as const,
  stuckText: { fontFamily: nbFonts.monoBold, fontSize: 11.5, color: nb.ink } as const,
  slot: {
    borderWidth: 1.4, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,.45)',
    paddingVertical: 3, paddingHorizontal: 14,
  } as const,
  slotText: { fontFamily: nbFonts.hand, fontSize: 13, color: 'rgba(255,255,255,.6)' } as const,
  trace: { marginTop: 10, height: 24, overflow: 'hidden' } as const,
  bank: { paddingVertical: 7, paddingHorizontal: 13 } as const,
  bankUsed: {
    paddingVertical: 7, paddingHorizontal: 13,
    borderWidth: 1.3, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.25)',
  } as const,
  bankText: { fontFamily: nbFonts.monoBold, fontSize: 12.5, color: nb.ink } as const,
};
