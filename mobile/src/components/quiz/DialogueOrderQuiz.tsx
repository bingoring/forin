// dialogue_order quiz — arrange conversation turns into natural order (original
// format; reuses Cards with track = speaker). Shuffled turn cards in a bank; tap
// to drop into the next numbered slot, tap a placed turn to pull it back. Nurse
// turns are mint, patient turns peach, so the back-and-forth reads clearly.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, QuizSection, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { NbButton } from '@/components/nb/NbUI';
import { useT, type Translate } from '@/i18n';

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
// Takes the translate function, like every other non-component helper: called from a
// render, it is cached by its arguments, so the language has to be one of them.
const speakerStyle = (t: Translate, track?: string) =>
  track === 'nurse' || track === 'player'
    ? { bg: 'rgba(168,217,151,.4)', label: t('role.nurse') }
    : { bg: '#FFF3EE', label: t('role.patient') };

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
          <Text style={{ fontFamily: nbFonts.hand, fontSize: 12.2, color: C }}>{sp.label}</Text>
        </View>
        <Text style={{ flex: 1, fontFamily: nbFonts.body, fontSize: 10.5, color: C, padding: 7, lineHeight: 15 }}>{card.text}</Text>
      </View>
    );
  };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && allCorrect
          ? <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} onPress={onComplete}>{t('quiz.finish')}</NbButton></View>
          : checked
            ? <View style={{ flex: 1 }}><NbButton variant="paper" full onPress={() => { setChecked(false); setPlaced([]); }}>{t('quiz.retry')}</NbButton></View>
            : <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} disabled={!full} onPress={() => setChecked(true)}>{t('quiz.submitOrder')}</NbButton></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      <QuizSection label={t('quiz.dialogueOrder', { n: cards.length })} />
      <View style={{ gap: 6 }}>
        {cards.map((_, slot) => {
          const ci = placed[slot];
          const ok = checked && correctness[slot];
          const bad = checked && ci !== undefined && !correctness[slot];
          return (
            <View key={slot} style={{ flexDirection: 'row', alignItems: 'stretch', gap: 6 }}>
              <View style={{ width: 22, backgroundColor: nb.paper, borderWidth: 1.4, borderColor: nb.ink, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: nbFonts.hand, fontSize: 14.9, color: C }}>{slot + 1}</Text>
              </View>
              {ci !== undefined ? (
                <Pressable onPress={() => !checked && setPlaced(placed.filter((_, i) => i !== slot))} style={{ flex: 1, borderWidth: 1.4, borderColor: nb.ink, backgroundColor: ok ? '#DCFCE7' : bad ? '#FFF0EC' : '#fff' }}>
                  {turn(ci)}
                </Pressable>
              ) : (
                <View style={{ flex: 1, borderWidth: 2, borderColor: '#2A252555', borderStyle: 'dashed', padding: 9 }}>
                  <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.placeholder }}>{t('quiz.emptySlot')}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {inBank.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <QuizSection label={t('quiz.lineCards')} />
          <View style={{ gap: 6 }}>
            {inBank.map((ci) => (
              <Shadowed key={ci} offset={2}>
                <Pressable onPress={() => !checked && setPlaced([...placed, ci])} style={{ borderWidth: 1.4, borderColor: nb.ink, backgroundColor: nb.paper }}>
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
