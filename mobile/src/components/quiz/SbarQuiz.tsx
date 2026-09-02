// sbar quiz — order a phone handoff into the S-B-A-R sequence. 1:1 with the v16
// handoff SBAR screen. Tap a card from the bank to drop it in the next slot; tap
// a placed card to send it back. Submit checks each slot against the card order.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, QuizSection, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { NbButton } from '@/components/nb/NbUI';
import { t, useT } from '@/i18n';

const TRACKS: Record<string, { name: string; color: string }> = {
  S: { name: 'Situation', color: nb.red },
  B: { name: 'Background', color: '#F97316' },
  A: { name: 'Assessment', color: '#3B82F6' },
  R: { name: 'Recommendation', color: nb.green },
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
          ? <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} onPress={onComplete}>{t('quiz.finish')}</NbButton></View>
          : checked
            ? <View style={{ flex: 1 }}><NbButton variant="paper" full onPress={() => { setChecked(false); setPlaced([]); }}>{t('quiz.reorder')}</NbButton></View>
            : (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ flex: 1, fontFamily: nbFonts.hand, fontSize: 13.5, color: nb.soft }}>{t('quiz.placedCount', { n: placed.length, total: cards.length })}</Text>
              <NbButton variant="ink" iconColor={nb.paper} disabled={!full} onPress={() => setChecked(true)}>{hasTracks ? t('quiz.startCall') : t('quiz.submitOrder')}</NbButton>
            </View>
          )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* S-B-A-R track legend (only for SBAR) */}
      {hasTracks && (
        <View style={{ flexDirection: 'row', gap: 4, marginBottom: 12 }}>
          {Object.entries(TRACKS).map(([k, tr]) => (
            <View key={k} style={{ flex: 1, backgroundColor: tr.color, borderWidth: 1.4, borderColor: nb.ink, paddingVertical: 3, paddingHorizontal: 2, alignItems: 'center' }}>
              <Text style={{ fontFamily: nbFonts.hand, fontSize: 16.2, color: nb.paper, lineHeight: 13 }}>{k}</Text>
              <Text numberOfLines={1} style={{ fontFamily: nbFonts.body, fontSize: 7, color: nb.paper, opacity: 0.9, marginTop: 1 }}>{tr.name}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ordered slots */}
      <QuizSection label={t('quiz.tapToPlace', { what: hasTracks ? t('quiz.handoffOrder') : t('quiz.order') })} />
      <View style={{ gap: 6 }}>
        {cards.map((_, slot) => {
          const ci = placed[slot];
          const card = ci !== undefined ? cards[ci] : null;
          const tr = card ? TRACKS[card.track] : null;
          const ok = checked && correctness[slot];
          const bad = checked && card && !correctness[slot];
          return (
            <View key={slot} style={{ flexDirection: 'row', alignItems: 'stretch', gap: 6 }}>
              <View style={{ width: 22, backgroundColor: nb.paper, borderWidth: 1.4, borderColor: nb.ink, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: nbFonts.hand, fontSize: 14.9, color: C }}>{slot + 1}</Text>
              </View>
              {card ? (
                <Pressable onPress={() => removeAt(slot)} style={{ flex: 1, flexDirection: 'row', backgroundColor: ok ? 'rgba(168,217,151,.4)' : bad ? '#FFF0EC' : '#fff', borderWidth: 1.4, borderColor: nb.ink }}>
                  {hasTracks && (
                    <View style={{ width: 22, backgroundColor: tr?.color, borderRightWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontFamily: nbFonts.hand, fontSize: 13.5, color: nb.paper }}>{card.track}</Text>
                    </View>
                  )}
                  <Text style={{ flex: 1, fontFamily: nbFonts.body, fontSize: 10, color: C, padding: 6, lineHeight: 14 }}>{card.text}</Text>
                </Pressable>
              ) : (
                <View style={{ flex: 1, borderWidth: 2, borderColor: 'rgba(62,54,43,.18)', borderStyle: 'dashed', padding: 10, backgroundColor: 'transparent' }}>
                  <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.placeholder }}>{t('quiz.emptySlot')}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* bank */}
      {inBank.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <QuizSection label={t('quiz.sentenceCards')} />
          <View style={{ gap: 6 }}>
            {inBank.map((ci) => {
              const card = cards[ci]; const tr = TRACKS[card.track];
              return (
                <Shadowed key={ci} offset={2}>
                  <Pressable onPress={() => place(ci)} style={{ flexDirection: 'row', backgroundColor: nb.paper, borderWidth: 1.4, borderColor: nb.ink }}>
                    {hasTracks && (
                      <View style={{ width: 22, backgroundColor: tr?.color, borderRightWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: nbFonts.hand, fontSize: 13.5, color: nb.paper }}>{card.track}</Text>
                      </View>
                    )}
                    <Text style={{ flex: 1, fontFamily: nbFonts.body, fontSize: 10, color: C, padding: 6, lineHeight: 14 }}>{card.text}</Text>
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
