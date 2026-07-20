// abbr quiz — medical-abbreviation flashcard deck (original format). One card at
// a time: the abbreviation big, MCQ options below. Pick → lock + reveal → next.
// A progress dot-row + running score; finishing the deck completes the quiz.
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
  const [results, setResults] = useState<(boolean | null)[]>(() => deck.map(() => null));
  const [picked, setPicked] = useState<string | null>(null);

  const card = deck[idx];
  const answered = results[idx] !== null;
  const isLast = idx === deck.length - 1;
  const score = results.filter((r) => r === true).length;
  const finished = results.every((r) => r !== null);

  const pick = (opt: string) => {
    if (answered || !card) return;
    setPicked(opt);
    const r = [...results]; r[idx] = opt === card.answer; setResults(r);
  };
  const next = () => { setPicked(null); if (!isLast) setIdx(idx + 1); };

  // summary card once the whole deck is done
  if (finished && idx === deck.length - 1 && answered) {
    // fall through to normal render but footer offers 완료
  }

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        !answered
          ? <View style={{ flex: 1 }}><PixelButton label="보기를 고르세요" bg="#fff" shadowColor={C} disabled onPress={() => {}} full /></View>
          : isLast
            ? <View style={{ flex: 1 }}><PixelButton label={`✓ 완료 · ${score}/${deck.length}`} bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
            : <View style={{ flex: 1 }}><PixelButton label="다음 ▶" bg={colors.mint} shadowColor={colors.mintShadow} onPress={next} full /></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* progress dots */}
      <View style={{ flexDirection: 'row', gap: 5, marginBottom: 12, alignItems: 'center' }}>
        {deck.map((_, i) => (
          <View key={i} style={{ width: 14, height: 14, borderWidth: 2, borderColor: C, backgroundColor: results[i] === true ? colors.mint : results[i] === false ? '#FCA5A5' : i === idx ? colors.yellow : '#fff' }} />
        ))}
        <Text style={{ marginLeft: 'auto', fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft }}>{idx + 1} / {deck.length} · {score}점</Text>
      </View>

      {/* the abbreviation */}
      <Shadowed offset={4}>
        <View style={{ backgroundColor: C, borderWidth: 3, borderColor: C, paddingVertical: 22, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 40, color: colors.cream, letterSpacing: 2 }}>{card?.term}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 10, color: '#94A3B8', marginTop: 4 }}>이 약어의 뜻은?</Text>
        </View>
      </Shadowed>

      {/* options */}
      <View style={{ marginTop: 14, gap: 8 }}>
        {card?.options.map((opt, i) => {
          const showRight = answered && opt === card.answer;
          const showWrong = answered && picked === opt && opt !== card.answer;
          const bg = showRight ? colors.mint : showWrong ? '#FEE2E2' : '#fff';
          return (
            <Shadowed key={i} offset={2} shadowColor={showRight ? colors.mintShadow : showWrong ? '#EF4444' : C}>
              <Pressable onPress={() => pick(opt)} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: bg, borderWidth: 2.5, borderColor: C, padding: 11 }}>
                <View style={{ width: 20, height: 20, backgroundColor: colors.paper, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C }}>{showRight ? '✓' : showWrong ? '✕' : String.fromCharCode(65 + i)}</Text>
                </View>
                <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 13, color: C }}>{opt}</Text>
              </Pressable>
            </Shadowed>
          );
        })}
      </View>

      {answered && !!c.note && isLast && (
        <View style={{ marginTop: 12, backgroundColor: colors.cream, borderWidth: 1.5, borderColor: '#2A252255', borderStyle: 'dashed', paddingVertical: 6, paddingHorizontal: 8 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, lineHeight: 15 }}><Text style={{ fontFamily: fonts.heading, color: C }}>Tip. </Text>{c.note}</Text>
        </View>
      )}
    </QuizShell>
  );
}
