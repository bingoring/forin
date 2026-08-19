// monitor quiz — read & interpret a device panel. 1:1 with the v17 handoff
// MONITOR format: a dark device panel of readings (value + unit, glowing color),
// each with a label slot; a label bank below. Tap a reading to select it, then a
// bank label to assign; submit checks each slot against the reading's label.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import type { QuizDetail } from '@/api/client';
import { colors, fonts, fs } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';
import { t } from '@/i18n';

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

export function MonitorQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
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
          ? <View style={{ flex: 1 }}><PixelButton label={t('quiz.finish')} bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : checked
            ? <View style={{ flex: 1 }}><PixelButton label={t('quiz.retry')} bg="#fff" shadowColor={C} onPress={() => { setChecked(false); setAssigned(readings.map(() => null)); setSel(null); }} full /></View>
            : (
              <>
                <PixelButton label={t('quiz.restart')} bg="#fff" shadowColor={C} fontSize={12} disabled={assigned.every((a) => a === null)} onPress={() => { setAssigned(readings.map(() => null)); setSel(null); }} style={{ flex: 1 }} />
                <View style={{ flex: 2 }}><PixelButton label={t('quiz.submitReading')} bg={colors.mint} shadowColor={colors.mintShadow} disabled={!full} onPress={() => setChecked(true)} full /></View>
              </>
            )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* device panel */}
      <View style={{ backgroundColor: '#0F1A24', borderWidth: 4, borderColor: C, padding: 10, position: 'relative' }}>
        {!!c.device && (
          <View style={{ position: 'absolute', top: -8, left: 8, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, paddingHorizontal: 4 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C }}>{c.device}</Text>
          </View>
        )}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {readings.map((r, i) => {
            const a = assigned[i];
            const ok = checked && a === r.label;
            const bad = checked && a !== r.label;
            const isSel = sel === i && !a;
            return (
              <Pressable key={i} onPress={() => tapReading(i)} style={{ width: '47%', backgroundColor: '#0A1320', borderWidth: 2, borderColor: (r.color || '#22D3EE') + '66', padding: 8 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(20), color: r.color || '#22D3EE' }}>{r.num}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: '#94A3B8', marginTop: 2 }}>{r.unit}</Text>
                <View style={{ marginTop: 6, backgroundColor: a ? (checked ? (ok ? colors.mint : '#FEE2E2') : colors.mint) : isSel ? colors.yellow : 'transparent', borderWidth: 2, borderColor: a || isSel ? C : colors.yellow + '88', borderStyle: a || isSel ? 'solid' : 'dashed', paddingVertical: 3, paddingHorizontal: 6, alignItems: 'center' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(9.5), color: a ? C : '#fff' }}>{a ? `${a}${checked ? (ok ? ' ✓' : ' ✕') : ''}` : '?'}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* ECG trace strip — ambient monitor readout (1:1 with handoff) */}
        <View style={{ marginTop: 8, height: 24, backgroundColor: '#000', borderWidth: 1.5, borderColor: C, overflow: 'hidden' }}>
          <Svg width="100%" height={24} viewBox="0 0 200 24" preserveAspectRatio="none">
            <Polyline points="0,12 30,12 32,4 34,20 36,12 80,12 82,4 84,20 86,12 130,12 132,4 134,20 136,12 180,12 200,12" fill="none" stroke="#22D3EE" strokeWidth={1.5} />
          </Svg>
        </View>
      </View>

      {/* label bank */}
      <View style={{ marginTop: 14 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft, marginBottom: 6 }}>━ 라벨 카드 ━━━━━━━━</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {bank.map((label, i) => {
            const isUsed = used.has(label);
            return (
              <Shadowed key={i} offset={isUsed ? 0 : 3}>
                <Pressable onPress={() => tapLabel(label)} style={{ backgroundColor: isUsed ? '#2A252222' : '#fff', borderWidth: 3, borderColor: C, paddingVertical: 7, paddingHorizontal: 10 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: isUsed ? colors.textFaint : C, textDecorationLine: isUsed ? 'line-through' : 'none' }}>{label}</Text>
                </Pressable>
              </Shadowed>
            );
          })}
        </View>
      </View>

      {checked && <ResultBanner correct={allCorrect} />}
      {!!c.note && <HintRow text={c.note} />}
    </QuizShell>
  );
}
