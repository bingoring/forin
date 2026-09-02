// abbr quiz — medical-abbreviation flashcard deck. One card at a time: the
// abbreviation big, MCQ options below. Like every other quiz type, completion is
// gated on correctness — a wrong pick flashes red and is disabled, but you must
// select the correct meaning to advance; you can only finish once every card is
// solved. The running score reflects FIRST-try correctness.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, C } from '@/components/quiz/QuizShell';
import { NbButton } from '@/components/nb/NbUI';
import { playSfx } from '@/lib/sfx';
import { t, useT } from '@/i18n';

export function AbbrQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const t = useT();
  const c = quiz.content!;
  const deck = c.deck ?? [];
  const [idx, setIdx] = useState(0);
  const [solved, setSolved] = useState<boolean[]>(() => deck.map(() => false));
  const [firstTry, setFirstTry] = useState<(boolean | null)[]>(() => deck.map(() => null)); // null=unseen
  const [wrong, setWrong] = useState<string[]>([]); // wrong options tried on the current card

  const card = deck[idx];
  const cardSolved = solved[idx];
  const isLast = idx === deck.length - 1;
  const score = firstTry.filter((r) => r === true).length;
  const allSolved = deck.length > 0 && solved.every(Boolean);

  const pick = (opt: string) => {
    if (!card || cardSolved || wrong.includes(opt)) return;
    playSfx(opt === card.answer ? 'confirm' : 'wrong');
    if (opt === card.answer) {
      setSolved((s) => { const g = [...s]; g[idx] = true; return g; });
      setFirstTry((f) => { const g = [...f]; if (g[idx] === null) g[idx] = wrong.length === 0; return g; });
    } else {
      setWrong((w) => [...w, opt]);
      setFirstTry((f) => { const g = [...f]; if (g[idx] === null) g[idx] = false; return g; });
    }
  };
  const next = () => { setWrong([]); if (!isLast) setIdx(idx + 1); };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        !cardSolved
          ? <View style={{ flex: 1 }}><NbButton variant="paper" full onPress={() => {}}>{t('quiz.pickAnswer')}</NbButton></View>
          : isLast
            ? <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} disabled={!allSolved} onPress={onComplete}>{t('quiz.finishScore', { score, total: deck.length })}</NbButton></View>
            : <View style={{ flex: 1 }}><NbButton variant="ink" full icon="pencil" iconColor={nb.paper} onPress={next}>{t('common.next')}</NbButton></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* progress dots — solved=mint, current=yellow */}
      <View style={{ flexDirection: 'row', gap: 5, marginBottom: 12, alignItems: 'center' }}>
        {deck.map((_, i) => (
          <View key={i} style={{ width: 14, height: 14, borderWidth: 1.4, borderColor: nb.ink, backgroundColor: solved[i] ? 'rgba(168,217,151,.4)' : i === idx ? 'rgba(249,227,123,.5)' : '#fff' }} />
        ))}
        <Text style={{ marginLeft: 'auto', fontFamily: nbFonts.hand, fontSize: 13.5, color: nb.soft }}>{t('quiz.deckScore', { i: idx + 1, total: deck.length, score })}</Text>
      </View>

      {/* the abbreviation */}
      <Shadowed offset={4}>
        <View style={{ backgroundColor: C, borderWidth: 1.5, borderColor: nb.paperEdge, paddingVertical: 22, alignItems: 'center' }}>
          <Text style={{ fontFamily: nbFonts.hand, fontSize: 54.0, color: nb.cream, letterSpacing: 2 }}>{card?.term}</Text>
          <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: '#94A3B8', marginTop: 4 }}>{cardSolved ? t('quiz.correctNext') : t('quiz.abbrPrompt')}</Text>
        </View>
      </Shadowed>

      {/* options — correct locks green; wrong flashes red + disables (retry another) */}
      <View style={{ marginTop: 14, gap: 8 }}>
        {card?.options.map((opt, i) => {
          const showRight = cardSolved && opt === card.answer;
          const showWrong = wrong.includes(opt);
          const bg = showRight ? 'rgba(168,217,151,.4)' : showWrong ? '#FFF0EC' : '#fff';
          return (
            <Shadowed key={i} offset={2} shadowColor={showRight ? nb.green : showWrong ? nb.red : C}>
              <Pressable onPress={() => pick(opt)} disabled={cardSolved || showWrong} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: bg, borderWidth: 1.5, borderColor: nb.paperEdge, padding: 11, opacity: showWrong ? 0.6 : 1 }}>
                <View style={{ width: 20, height: 20, backgroundColor: nb.paper, borderWidth: 1.4, borderColor: nb.ink, alignItems: 'center', justifyContent: 'center' }}>
                  {showRight
                    ? <NbIcon name="check" size={14} color={nb.green} />
                    : showWrong
                      ? <NbIcon name="cross" size={12} color={nb.red} />
                      : <Text style={{ fontFamily: nbFonts.hand, fontSize: 14.9, color: C }}>{String.fromCharCode(65 + i)}</Text>}
                </View>
                <Text style={{ flex: 1, fontFamily: nbFonts.body, fontSize: 13, color: C }}>{opt}</Text>
              </Pressable>
            </Shadowed>
          );
        })}
      </View>

      {cardSolved && !!c.note && isLast && (
        <View style={{ marginTop: 12, backgroundColor: nb.cream, borderWidth: 1.5, borderColor: 'rgba(62,54,43,.18)', borderStyle: 'dashed', paddingVertical: 6, paddingHorizontal: 8 }}>
          <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.soft, lineHeight: 15 }}><Text style={{ fontFamily: nbFonts.hand, color: C }}>Tip. </Text>{c.note}</Text>
        </View>
      )}
    </QuizShell>
  );
}
