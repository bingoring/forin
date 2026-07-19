// gauge quiz — step a value to a target. 1:1 with the v17 handoff GAUGE format:
// a dark device readout + progress bar with a target marker, and ▼/▲ steppers.
// Correct when the current value equals the target.
import { useState } from 'react';
import { Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

export function GaugeQuiz({ quiz, onExit, onComplete }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void }) {
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
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit}
      footer={
        checked && correct
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : checked
            ? <View style={{ flex: 1 }}><PixelButton label="↻ 다시" bg="#fff" shadowColor={C} onPress={() => { setChecked(false); setVal(g.start); }} full /></View>
            : <View style={{ flex: 1 }}><PixelButton label="✓ 설정 제출" bg={colors.mint} shadowColor={colors.mintShadow} onPress={() => setChecked(true)} full /></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* device */}
      <View style={{ backgroundColor: '#0F1A24', borderWidth: 4, borderColor: C, padding: 14, alignItems: 'center', position: 'relative' }}>
        {!!c.device && (
          <View style={{ position: 'absolute', top: -8, left: 8, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, paddingHorizontal: 4 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: C }}>{c.device}</Text>
          </View>
        )}
        <Text style={{ fontFamily: fonts.heading, fontSize: 32, color: atTarget ? '#34D399' : '#FB923C' }}>{val}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{g.unit}</Text>
        {/* bar */}
        <View style={{ marginTop: 12, height: 14, alignSelf: 'stretch', backgroundColor: '#0A1320', borderWidth: 2, borderColor: C }}>
          <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(100, pct))}%`, backgroundColor: atTarget ? '#34D399' : '#FB923C' }} />
          <View style={{ position: 'absolute', left: `${targetPct}%`, top: -3, bottom: -3, width: 3, backgroundColor: '#22D3EE' }} />
        </View>
        <View style={{ marginTop: 8, backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 10 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>🎯 목표 {g.target} {g.unit}</Text>
        </View>
      </View>

      {/* steppers */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <View style={{ flex: 1 }}><PixelButton label="▼ 낮춤" bg="#fff" shadowColor={C} onPress={() => step(-1)} disabled={checked} full /></View>
        <View style={{ flex: 1 }}><PixelButton label="▲ 올림" bg={colors.yellow} shadowColor={colors.yellowShadow} onPress={() => step(1)} disabled={checked} full /></View>
      </View>

      {checked && <ResultBanner correct={correct} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}
