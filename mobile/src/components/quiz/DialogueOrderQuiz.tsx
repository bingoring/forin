// dialogue_order quiz — arrange conversation turns into natural order (original
// format; reuses Cards with track = speaker). Shuffled turn cards in a bank; tap
// to drop into the next numbered slot, tap a placed turn to pull it back. Nurse
// turns are mint, patient turns peach, so the back-and-forth reads clearly.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts, fs } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';
import { useT, type Translate } from '@/i18n';

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
// Takes the translate function, like every other non-component helper: called from a
// render, it is cached by its arguments, so the language has to be one of them.
const speakerStyle = (t: Translate, track?: string) =>
  track === 'nurse' || track === 'player'
    ? { bg: colors.mint, label: t('role.nurse') }
    : { bg: colors.peach, label: t('role.patient') };

export function DialogueOrderQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const t = useT();
  const c = quiz.content!;
  const cards = c.cards ?? [];
  const bankOrder = useMemo(() => shuffle(cards.map((_, i) => i)), [cards]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const inBank = bankOrder.filter((i) => !placed.includes(i));
  const full = placed.length === cards.length && cards.length > 0;
  const correctness = placed.map((ci, slot) => cards[ci]?.order === slot + 1);
  const allCorrect = checked && correctness.every(Boolean);

  const turn = (ci: number, faded?: boolean) => {
    const card = cards[ci]; const sp = speakerStyle(t, card.track);
    return (
      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        <View style={{ width: 46, backgroundColor: sp.bg, borderRightWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center', opacity: faded ? 0.6 : 1 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: C }}>{sp.label}</Text>
        </View>
        <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(10.5), color: C, padding: 7, lineHeight: 15 }}>{card.text}</Text>
      </View>
    );
  };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && allCorrect
          ? <View style={{ flex: 1 }}><PixelButton label={t('quiz.finish')} bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : checked
            ? <View style={{ flex: 1 }}><PixelButton label={t('quiz.retry')} bg="#fff" shadowColor={C} onPress={() => { setChecked(false); setPlaced([]); }} full /></View>
            : <View style={{ flex: 1 }}><PixelButton label={t('quiz.submitOrder')} bg={colors.mint} shadowColor={colors.mintShadow} disabled={!full} onPress={() => setChecked(true)} full /></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, marginBottom: 5 }}>━ 대화 순서 (1→{cards.length}) ━</Text>
      <View style={{ gap: 6 }}>
        {cards.map((_, slot) => {
          const ci = placed[slot];
          const ok = checked && correctness[slot];
          const bad = checked && ci !== undefined && !correctness[slot];
          return (
            <View key={slot} style={{ flexDirection: 'row', alignItems: 'stretch', gap: 6 }}>
              <View style={{ width: 22, backgroundColor: '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C }}>{slot + 1}</Text>
              </View>
              {ci !== undefined ? (
                <Pressable onPress={() => !checked && setPlaced(placed.filter((_, i) => i !== slot))} style={{ flex: 1, borderWidth: 2, borderColor: C, backgroundColor: ok ? '#DCFCE7' : bad ? '#FEE2E2' : '#fff' }}>
                  {turn(ci)}
                </Pressable>
              ) : (
                <View style={{ flex: 1, borderWidth: 2, borderColor: '#2A252555', borderStyle: 'dashed', padding: 9 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textFaint }}>비어 있음</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {inBank.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, marginBottom: 5 }}>━ 대사 카드 ━</Text>
          <View style={{ gap: 6 }}>
            {inBank.map((ci) => (
              <Shadowed key={ci} offset={2}>
                <Pressable onPress={() => !checked && setPlaced([...placed, ci])} style={{ borderWidth: 2, borderColor: C, backgroundColor: '#fff' }}>
                  {turn(ci)}
                </Pressable>
              </Shadowed>
            ))}
          </View>
        </View>
      )}

      {checked && <ResultBanner correct={allCorrect} />}
      {checked && !!c.note && <HintRow text={c.note} />}
    </QuizShell>
  );
}
