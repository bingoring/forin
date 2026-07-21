// match_pairs quiz — match each English term (left) to its Korean meaning
// (right). 1:1 with the v16 handoff WORD MATCHING. Tap a left tile, then its
// meaning on the right; correct pairs lock green, wrong flashes red.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

export function MatchQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const pairs = c.pairs ?? [];
  // rights shuffled; each carries its original pair index.
  const rights = useMemo(() => shuffle(pairs.map((p, i) => ({ ...p, i }))), [pairs]);
  const [sel, setSel] = useState<number | null>(null); // selected left pair index
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<number | null>(null); // right pair index flashing wrong
  const done = matched.size === pairs.length && pairs.length > 0;

  const tapRight = (pairIdx: number) => {
    if (sel === null || matched.has(pairIdx)) return;
    if (sel === pairIdx) { const m = new Set(matched); m.add(pairIdx); setMatched(m); setSel(null); setWrong(null); }
    else { setWrong(pairIdx); setTimeout(() => setWrong((w) => (w === pairIdx ? null : w)), 500); setSel(null); }
  };
  const reset = () => { setMatched(new Set()); setSel(null); setWrong(null); };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        done
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : (
            <>
              <PixelButton label="↺ 다시" bg="#fff" shadowColor={C} fontSize={12} disabled={matched.size === 0} onPress={reset} style={{ flex: 1 }} />
              <View style={{ flex: 2 }}><PixelButton label={`${matched.size} / ${pairs.length} 짝지음`} bg="#fff" shadowColor={C} disabled onPress={() => {}} full /></View>
            </>
          )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}
      <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, textAlign: 'center', marginBottom: 10 }}>왼쪽 단어와 오른쪽 의미를 짝지어 보세요.</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {/* left column */}
        <View style={{ flex: 1, gap: 8 }}>
          {pairs.map((p, i) => {
            const isMatched = matched.has(i);
            const isSel = sel === i;
            return (
              <Shadowed key={i} offset={isSel ? 3 : 2} shadowColor={isSel ? colors.yellowShadow : C}>
                <Pressable onPress={() => !isMatched && setSel(i)} style={{ backgroundColor: isMatched ? colors.mint : isSel ? colors.yellow : '#fff', borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 8, opacity: isMatched ? 0.7 : 1 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>{p.left}{isMatched ? ' ✓' : ''}</Text>
                  {!!p.leftSub && <Text style={{ fontFamily: fonts.body, fontSize: 9, color: colors.textSoft }}>{p.leftSub}</Text>}
                </Pressable>
              </Shadowed>
            );
          })}
        </View>
        {/* right column */}
        <View style={{ flex: 1, gap: 8 }}>
          {rights.map((r) => {
            const isMatched = matched.has(r.i);
            const isWrong = wrong === r.i;
            return (
              <Shadowed key={r.i} offset={2} shadowColor={isWrong ? '#DC2626' : C}>
                <Pressable onPress={() => tapRight(r.i)} style={{ backgroundColor: isMatched ? colors.mint : isWrong ? '#FEE2E2' : '#fff', borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 6, opacity: isMatched ? 0.7 : 1 }}>
                  {!!r.rightIcon && <Text style={{ fontSize: 15 }}>{r.rightIcon}</Text>}
                  <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 12, color: C }}>{r.right}</Text>
                </Pressable>
              </Shadowed>
            );
          })}
        </View>
      </View>
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}
