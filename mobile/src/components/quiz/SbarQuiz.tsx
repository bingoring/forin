// sbar quiz — order a phone handoff into the S-B-A-R sequence. 1:1 with the v16
// handoff SBAR screen. Tap a card from the bank to drop it in the next slot; tap
// a placed card to send it back. Submit checks each slot against the card order.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts, fs } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';
import { t, useT } from '@/i18n';

const TRACKS: Record<string, { name: string; color: string }> = {
  S: { name: 'Situation', color: '#EF4444' },
  B: { name: 'Background', color: '#F97316' },
  A: { name: 'Assessment', color: '#3B82F6' },
  R: { name: 'Recommendation', color: '#10B981' },
};

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

export function SbarQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const t = useT();
  const c = quiz.content!;
  const cards = c.cards ?? [];
  const bankOrder = useMemo(() => shuffle(cards.map((_, i) => i)), [cards]); // stable shuffled bank
  const [placed, setPlaced] = useState<number[]>([]); // card indices in slot order
  const [checked, setChecked] = useState(false);

  const inBank = bankOrder.filter((i) => !placed.includes(i));
  const hasTracks = cards.some((c) => !!c.track && !!TRACKS[c.track]); // SBAR vs generic order
  const full = placed.length === cards.length && cards.length > 0;
  const correctness = placed.map((ci, slot) => cards[ci]?.order === slot + 1);
  const allCorrect = checked && correctness.every(Boolean);

  const place = (ci: number) => { if (!checked) setPlaced([...placed, ci]); };
  const removeAt = (slot: number) => { if (!checked) setPlaced(placed.filter((_, i) => i !== slot)); };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && allCorrect
          ? <View style={{ flex: 1 }}><PixelButton label={t('quiz.finish')} bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : checked
            ? <View style={{ flex: 1 }}><PixelButton label={t('quiz.reorder')} bg="#fff" shadowColor={C} onPress={() => { setChecked(false); setPlaced([]); }} full /></View>
            : (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>{placed.length}/{cards.length} 배치됨</Text>
              <PixelButton label={hasTracks ? t('quiz.startCall') : t('quiz.submitOrder')} bg={colors.mint} shadowColor={colors.mintShadow} disabled={!full} onPress={() => setChecked(true)} />
            </View>
          )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* S-B-A-R track legend (only for SBAR) */}
      {hasTracks && (
        <View style={{ flexDirection: 'row', gap: 4, marginBottom: 12 }}>
          {Object.entries(TRACKS).map(([k, tr]) => (
            <View key={k} style={{ flex: 1, backgroundColor: tr.color, borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 2, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: '#fff', lineHeight: 13 }}>{k}</Text>
              <Text numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: fs(7), color: '#fff', opacity: 0.9, marginTop: 1 }}>{tr.name}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ordered slots */}
      <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, marginBottom: 5 }}>━ {hasTracks ? t('quiz.handoffOrder') : t('quiz.order')} (탭하여 배치/해제) ━</Text>
      <View style={{ gap: 6 }}>
        {cards.map((_, slot) => {
          const ci = placed[slot];
          const card = ci !== undefined ? cards[ci] : null;
          const tr = card ? TRACKS[card.track] : null;
          const ok = checked && correctness[slot];
          const bad = checked && card && !correctness[slot];
          return (
            <View key={slot} style={{ flexDirection: 'row', alignItems: 'stretch', gap: 6 }}>
              <View style={{ width: 22, backgroundColor: '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C }}>{slot + 1}</Text>
              </View>
              {card ? (
                <Pressable onPress={() => removeAt(slot)} style={{ flex: 1, flexDirection: 'row', backgroundColor: ok ? colors.mint : bad ? '#FEE2E2' : '#fff', borderWidth: 2, borderColor: C }}>
                  {hasTracks && (
                    <View style={{ width: 22, backgroundColor: tr?.color, borderRightWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: '#fff' }}>{card.track}</Text>
                    </View>
                  )}
                  <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(10), color: C, padding: 6, lineHeight: 14 }}>{card.text}</Text>
                </Pressable>
              ) : (
                <View style={{ flex: 1, borderWidth: 2, borderColor: '#2A252255', borderStyle: 'dashed', padding: 10, backgroundColor: 'transparent' }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textFaint }}>비어 있음</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* bank */}
      {inBank.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, marginBottom: 5 }}>━ 문장 카드 ━</Text>
          <View style={{ gap: 6 }}>
            {inBank.map((ci) => {
              const card = cards[ci]; const tr = TRACKS[card.track];
              return (
                <Shadowed key={ci} offset={2}>
                  <Pressable onPress={() => place(ci)} style={{ flexDirection: 'row', backgroundColor: '#fff', borderWidth: 2, borderColor: C }}>
                    {hasTracks && (
                      <View style={{ width: 22, backgroundColor: tr?.color, borderRightWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: '#fff' }}>{card.track}</Text>
                      </View>
                    )}
                    <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(10), color: C, padding: 6, lineHeight: 14 }}>{card.text}</Text>
                  </Pressable>
                </Shadowed>
              );
            })}
          </View>
        </View>
      )}

      {checked && <ResultBanner correct={allCorrect} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}
