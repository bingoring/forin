// calc quiz — dose/fluid calculation with a keypad. 1:1 with the v17 handoff
// CALC format: a given-facts card + equation, an on-screen numeric keypad; the
// typed value is checked against the answer.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '⌫'];

export function CalcQuiz({ quiz, onExit, onComplete }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void }) {
  const c = quiz.content!;
  const [entry, setEntry] = useState('');
  const [checked, setChecked] = useState(false);
  const correct = checked && entry.trim() === (c.answer ?? '').trim();

  const press = (k: string) => {
    if (checked) return;
    if (k === '⌫') setEntry((e) => e.slice(0, -1));
    else if (k === '.' && entry.includes('.')) return;
    else setEntry((e) => (e.length < 8 ? e + k : e));
  };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit}
      footer={
        checked && correct
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : checked
            ? <View style={{ flex: 1 }}><PixelButton label="↻ 다시" bg="#fff" shadowColor={C} onPress={() => { setChecked(false); setEntry(''); }} full /></View>
            : <View style={{ flex: 1 }}><PixelButton label="✓ 계산 제출" bg={colors.mint} shadowColor={colors.mintShadow} disabled={!entry} onPress={() => setChecked(true)} full /></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      <Shadowed offset={3}>
        <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 12 }}>
          {(c.given ?? []).map((g, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: '#2A252233', borderStyle: 'dotted' }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C }}>{g.label}</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>{g.value}</Text>
            </View>
          ))}
          <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: C }}>{c.eq} =</Text>
            <View style={{ backgroundColor: entry ? colors.mint : colors.yellow + '44', borderWidth: 2.5, borderColor: C, paddingVertical: 3, paddingHorizontal: 14, minWidth: 60, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: C }}>{entry || '?'}</Text>
            </View>
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft }}>{c.answerUnit}</Text>
          </View>
        </View>
      </Shadowed>

      {/* keypad */}
      <View style={{ marginTop: 14 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: '#fff', opacity: 0.85, marginBottom: 6 }}>━ 계산기 ━━━━━━━━</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {KEYS.map((k) => (
            <Shadowed key={k} offset={2} style={{ width: '31.5%' }}>
              <Pressable onPress={() => press(k)} style={{ backgroundColor: k === '⌫' ? colors.paper : '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 10, alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: C }}>{k}</Text>
              </Pressable>
            </Shadowed>
          ))}
        </View>
      </View>

      {checked && <ResultBanner correct={correct} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}
