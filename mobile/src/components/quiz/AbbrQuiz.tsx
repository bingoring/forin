// abbr quiz — medical-abbreviation flashcard deck. One card at a time: the
// abbreviation big, MCQ options below. Like every other quiz type, completion is
// gated on correctness — a wrong pick flashes red and is disabled, but you must
// select the correct meaning to advance; you can only finish once every card is
// solved. The running score reflects FIRST-try correctness.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

export function AbbrQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
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
          ? <View style={{ flex: 1 }}><PixelButton label="정답을 고르세요" bg="#fff" shadowColor={C} disabled onPress={() => {}} full /></View>
          : isLast
            ? <View style={{ flex: 1 }}><PixelButton label={`✓ 완료 · ${score}/${deck.length}`} bg={colors.mint} shadowColor={colors.mintShadow} disabled={!allSolved} onPress={onComplete} full /></View>
            : <View style={{ flex: 1 }}><PixelButton label="다음" icon="play" bg={colors.mint} shadowColor={colors.mintShadow} onPress={next} full /></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* progress dots — solved=mint, current=yellow */}
      <View style={{ flexDirection: 'row', gap: 5, marginBottom: 12, alignItems: 'center' }}>
        {deck.map((_, i) => (
          <View key={i} style={{ width: 14, height: 14, borderWidth: 2, borderColor: C, backgroundColor: solved[i] ? colors.mint : i === idx ? colors.yellow : '#fff' }} />
        ))}
        <Text style={{ marginLeft: 'auto', fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft }}>{idx + 1} / {deck.length} · {score}점</Text>
      </View>

      {/* the abbreviation */}
      <Shadowed offset={4}>
        <View style={{ backgroundColor: C, borderWidth: 3, borderColor: C, paddingVertical: 22, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 40, color: colors.cream, letterSpacing: 2 }}>{card?.term}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 10, color: '#94A3B8', marginTop: 4 }}>{cardSolved ? '정답! 다음으로' : '이 약어의 뜻은?'}</Text>
        </View>
      </Shadowed>

      {/* options — correct locks green; wrong flashes red + disables (retry another) */}
      <View style={{ marginTop: 14, gap: 8 }}>
        {card?.options.map((opt, i) => {
          const showRight = cardSolved && opt === card.answer;
          const showWrong = wrong.includes(opt);
          const bg = showRight ? colors.mint : showWrong ? '#FEE2E2' : '#fff';
          return (
            <Shadowed key={i} offset={2} shadowColor={showRight ? colors.mintShadow : showWrong ? '#EF4444' : C}>
              <Pressable onPress={() => pick(opt)} disabled={cardSolved || showWrong} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: bg, borderWidth: 2.5, borderColor: C, padding: 11, opacity: showWrong ? 0.6 : 1 }}>
                <View style={{ width: 20, height: 20, backgroundColor: colors.paper, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C }}>{showRight ? '✓' : showWrong ? '✕' : String.fromCharCode(65 + i)}</Text>
                </View>
                <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 13, color: C }}>{opt}</Text>
              </Pressable>
            </Shadowed>
          );
        })}
      </View>

      {cardSolved && !!c.note && isLast && (
        <View style={{ marginTop: 12, backgroundColor: colors.cream, borderWidth: 1.5, borderColor: '#2A252255', borderStyle: 'dashed', paddingVertical: 6, paddingHorizontal: 8 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, lineHeight: 15 }}><Text style={{ fontFamily: fonts.heading, color: C }}>Tip. </Text>{c.note}</Text>
        </View>
      )}
    </QuizShell>
  );
}
