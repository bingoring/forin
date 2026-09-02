// gauge quiz — step a value to a target. 1:1 with the v17 handoff GAUGE format:
// a dark device readout + progress bar with a target marker, and ▼/▲ steppers.
// Correct when the current value equals the target.
import { useState } from 'react';
import { Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { AUDIO } from '@/components/pron/nbPron';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { NbButton } from '@/components/nb/NbUI';
import { t, useT } from '@/i18n';

export function GaugeQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const t = useT();
  const c = quiz.content!;
  const g = c.gauge ?? { min: 0, max: 100, start: 0, target: 50, step: 1, unit: '' };
  const [val, setVal] = useState(g.start);
  const [checked, setChecked] = useState(false);
  const correct = checked && Math.abs(val - g.target) < 1e-9;
  const pct = ((val - g.min) / (g.max - g.min)) * 100;
  const targetPct = ((g.target - g.min) / (g.max - g.min)) * 100;
  const atTarget = Math.abs(val - g.target) < 1e-9;

  const step = (dir: number) => { if (checked) return; setVal((v) => Math.max(g.min, Math.min(g.max, Math.round((v + dir * g.step) * 1000) / 1000))); };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && correct
          ? <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} onPress={onComplete}>{t('quiz.finish')}</NbButton></View>
          : checked
            ? <View style={{ flex: 1 }}><NbButton variant="paper" full onPress={() => { setChecked(false); setVal(g.start); }}>{t('quiz.retry')}</NbButton></View>
            : <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} onPress={() => setChecked(true)}>{t('quiz.submitSetting')}</NbButton></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* device */}
      <View style={{ backgroundColor: AUDIO.bg, borderWidth: 1.5, borderColor: AUDIO.edge, borderRadius: 4, padding: 14, alignItems: 'center', position: 'relative' }}>
        {!!c.device && (
          <View style={{ position: 'absolute', top: -8, left: 8, backgroundColor: nb.paper, borderWidth: 1.3, borderColor: nb.ink, paddingHorizontal: 4 }}>
            <Text style={{ fontFamily: nbFonts.hand, fontSize: 10.8, color: C }}>{c.device}</Text>
          </View>
        )}
        <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 38, color: atTarget ? '#8FD9A8' : '#F0A868' }}>{val}</Text>
        <Text style={{ fontFamily: nbFonts.mono, fontSize: 10.5, color: AUDIO.label, marginTop: 3 }}>{g.unit}</Text>
        {/* bar */}
        <View style={{ marginTop: 12, height: 14, alignSelf: 'stretch', backgroundColor: AUDIO.edge, borderWidth: 1.2, borderColor: '#0A1320', borderRadius: 2 }}>
          <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(100, pct))}%`, backgroundColor: atTarget ? '#34D399' : '#FB923C' }} />
          <View style={{ position: 'absolute', left: `${targetPct}%`, top: -3, bottom: -3, width: 3, backgroundColor: '#22D3EE' }} />
        </View>
        <View style={{ marginTop: 8, backgroundColor: 'rgba(168,217,151,.4)', borderWidth: 1.4, borderColor: nb.ink, paddingVertical: 3, paddingHorizontal: 10 }}>
          <Text style={{ fontFamily: nbFonts.hand, fontSize: 16.2, color: C }}>{t('quiz.target', { value: g.target, unit: g.unit ?? '' })}</Text>
        </View>
      </View>

      {/* steppers */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <View style={{ flex: 1 }}><NbButton variant="paper" full icon="chevronDown" disabled={checked} onPress={() => step(-1)}>{t('quiz.down')}</NbButton></View>
        <View style={{ flex: 1 }}><NbButton variant="paper" full icon="chevronUp" disabled={checked} onPress={() => step(1)}>{t('quiz.up')}</NbButton></View>
      </View>

      {checked && <ResultBanner correct={correct} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}
