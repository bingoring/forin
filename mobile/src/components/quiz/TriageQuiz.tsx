// triage quiz — rank patients/tasks by acuity (original format, inspired by the
// v17 triage screen). Cards (reused from the sbar model: text + order) start
// shuffled in a bank; tap to drop into the next priority slot (1 = most urgent),
// tap a placed card to pull it back. Submit checks each slot against card order.
// The #1 slot is styled urgent-red; lower ranks cool down.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

const RANK_COLOR = ['#EF4444', '#F97316', '#FACC15', '#34D399', '#60A5FA'];

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

export function TriageQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const cards = c.cards ?? [];
  const bankOrder = useMemo(() => shuffle(cards.map((_, i) => i)), [cards]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const inBank = bankOrder.filter((i) => !placed.includes(i));
  const full = placed.length === cards.length && cards.length > 0;
  const correctness = placed.map((ci, slot) => cards[ci]?.order === slot + 1);
  const allCorrect = checked && correctness.every(Boolean);

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && allCorrect
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : checked
            ? <View style={{ flex: 1 }}><PixelButton label="↻ 다시" bg="#fff" shadowColor={C} onPress={() => { setChecked(false); setPlaced([]); }} full /></View>
            : <View style={{ flex: 1 }}><PixelButton label="🚨 우선순위 제출" bg={colors.mint} shadowColor={colors.mintShadow} disabled={!full} onPress={() => setChecked(true)} full /></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* priority slots */}
      <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft, marginBottom: 5 }}>━ 우선순위 (1 = 가장 급함) ━</Text>
      <View style={{ gap: 6 }}>
        {cards.map((_, slot) => {
          const ci = placed[slot];
          const card = ci !== undefined ? cards[ci] : null;
          const ok = checked && correctness[slot];
          const bad = checked && card && !correctness[slot];
          return (
            <View key={slot} style={{ flexDirection: 'row', alignItems: 'stretch', gap: 6 }}>
              <View style={{ width: 30, backgroundColor: RANK_COLOR[slot] ?? '#94A3B8', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: '#fff' }}>{slot + 1}</Text>
              </View>
              {card ? (
                <Pressable onPress={() => !checked && setPlaced(placed.filter((_, i) => i !== slot))} style={{ flex: 1, backgroundColor: ok ? colors.mint : bad ? '#FEE2E2' : '#fff', borderWidth: 2, borderColor: C, justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 7 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C, lineHeight: 15 }}>{card.text}{checked ? (ok ? '  ✓' : '  ✕') : ''}</Text>
                </Pressable>
              ) : (
                <View style={{ flex: 1, borderWidth: 2, borderColor: '#2A252255', borderStyle: 'dashed', padding: 10 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textFaint }}>비어 있음</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* bank */}
      {inBank.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft, marginBottom: 5 }}>━ 환자 카드 ━</Text>
          <View style={{ gap: 6 }}>
            {inBank.map((ci) => (
              <Shadowed key={ci} offset={2}>
                <Pressable onPress={() => !checked && setPlaced([...placed, ci])} style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C, lineHeight: 15 }}>{cards[ci].text}</Text>
                </Pressable>
              </Shadowed>
            ))}
          </View>
        </View>
      )}

      {checked && <ResultBanner correct={allCorrect} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}
