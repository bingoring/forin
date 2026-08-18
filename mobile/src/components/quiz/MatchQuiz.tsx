// match_pairs / match quiz — 1:1 with the v16 handoff WORD MATCHING board.
// A left column of English terms + a right column of meanings with an SVG
// CONNECTOR track between them: tap a left chip (picked = yellow, dotted lead
// line), then its meaning on the right. A correct pair locks with a solid mint
// connector + ✓ badges; a wrong tap flashes a red dashed connector + a feedback
// toast explaining the term's real meaning. Footer shows per-pair progress squares.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';
import type { QuizDetail } from '@/api/client';
import { colors, fonts, fs } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';
import { playSfx } from '@/lib/sfx';

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

const ROW_H = 54;   // fixed chip height → predictable connector geometry
const GAP = 8;
const PITCH = ROW_H + GAP;
const rowCenter = (i: number) => ROW_H / 2 + i * PITCH; // y-center of row i

export function MatchQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const pairs = c.pairs ?? [];
  // rights shuffled; each keeps its original pair index.
  const rights = useMemo(() => shuffle(pairs.map((p, i) => ({ ...p, i }))), [pairs]);
  const [sel, setSel] = useState<number | null>(null); // picked left pair index
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<{ l: number; r: number } | null>(null); // transient wrong attempt
  const done = matched.size === pairs.length && pairs.length > 0;

  const rightRowOf = (pairIdx: number) => rights.findIndex((r) => r.i === pairIdx);
  const boardH = pairs.length > 0 ? pairs.length * PITCH - GAP : 0;

  const tapRight = (pairIdx: number) => {
    if (sel === null || matched.has(pairIdx)) return;
    playSfx(sel === pairIdx ? 'confirm' : 'wrong');
    if (sel === pairIdx) {
      setMatched((m) => new Set(m).add(pairIdx));
      setSel(null); setWrong(null);
    } else {
      const picked = sel;
      setWrong({ l: picked, r: pairIdx }); setSel(null);
      setTimeout(() => setWrong((w) => (w && w.l === picked && w.r === pairIdx ? null : w)), 1600);
    }
  };
  const reset = () => { setMatched(new Set()); setSel(null); setWrong(null); };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            {pairs.map((_, i) => (
              <View key={i} style={{ width: 15, height: 15, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center', backgroundColor: matched.has(i) ? colors.mint : '#fff' }}>
                {matched.has(i) && <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: C }}>✓</Text>}
              </View>
            ))}
            <Text style={{ marginLeft: 4, fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>{matched.size}/{pairs.length}</Text>
          </View>
          <PixelButton label="↺ 다시" bg="#fff" shadowColor={C} fontSize={11} disabled={matched.size === 0} onPress={reset} />
          <PixelButton label="✓ 완료" bg={done ? colors.mint : colors.cream} shadowColor={done ? colors.mintShadow : C} fontSize={12} disabled={!done} onPress={onComplete} />
        </View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}
      <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, textAlign: 'center', marginBottom: 10 }}>왼쪽 단어와 오른쪽 의미를 짝지어 보세요.</Text>

      {/* matching board: left chips | SVG connectors | right chips */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* left column */}
        <View style={{ flex: 1, gap: GAP }}>
          {pairs.map((p, i) => (
            <MatchChip key={i} side="L" text={p.left} sub={p.leftSub}
              status={matched.has(i) ? 'correct' : wrong?.l === i ? 'wrong' : undefined}
              picked={sel === i}
              onPress={() => { if (!matched.has(i)) setSel(i); }} />
          ))}
        </View>

        {/* connector track */}
        <View style={{ width: 34, height: boardH }}>
          {boardH > 0 && (
            <Svg width={34} height={boardH} viewBox={`0 0 34 ${boardH}`}>
              {/* solid mint connectors for matched pairs */}
              {[...matched].map((p) => {
                const y1 = rowCenter(p), y2 = rowCenter(rightRowOf(p));
                return (
                  <G key={p}>
                    <Path d={`M0 ${y1} L34 ${y2}`} stroke={colors.mintShadow} strokeWidth={3} fill="none" />
                    <Rect x={-2} y={y1 - 3} width={6} height={6} fill={colors.mintShadow} stroke={C} strokeWidth={1} />
                    <Rect x={30} y={y2 - 3} width={6} height={6} fill={colors.mintShadow} stroke={C} strokeWidth={1} />
                  </G>
                );
              })}
              {/* transient red dashed connector for a wrong attempt */}
              {wrong && (
                <Path d={`M0 ${rowCenter(wrong.l)} L34 ${rowCenter(rightRowOf(wrong.r))}`} stroke="#EF4444" strokeWidth={3} strokeDasharray="4,3" fill="none" />
              )}
              {/* in-progress dotted lead line from the picked left chip */}
              {sel !== null && !matched.has(sel) && (
                <Path d={`M0 ${rowCenter(sel)} L22 ${rowCenter(sel) + 10}`} stroke={colors.yellowShadow} strokeWidth={3} strokeDasharray="3,3" fill="none" />
              )}
            </Svg>
          )}
        </View>

        {/* right column */}
        <View style={{ flex: 1, gap: GAP }}>
          {rights.map((r) => (
            <MatchChip key={r.i} side="R" text={r.right} sub={r.rightIcon}
              status={matched.has(r.i) ? 'correct' : wrong?.r === r.i ? 'wrong' : undefined}
              onPress={() => tapRight(r.i)} />
          ))}
        </View>
      </View>

      {/* wrong-answer feedback toast (explains the picked term's real meaning) */}
      {wrong && (
        <Shadowed offset={2} style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEE2E2', borderWidth: 2, borderColor: C, paddingVertical: 6, paddingHorizontal: 10 }}>
            <View style={{ backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: C, paddingVertical: 1, paddingHorizontal: 5 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: '#fff' }}>✕</Text>
            </View>
            <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(11), color: C, lineHeight: 15 }}>
              <Text style={{ fontFamily: fonts.heading }}>{pairs[wrong.l]?.left}</Text>은 "{pairs[wrong.l]?.right}"이에요. 다시 시도!
            </Text>
          </View>
        </Shadowed>
      )}

      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}

// MatchChip — a fixed-height pixel chip. Corner badge + fill reflect match state.
function MatchChip({ side, text, sub, status, picked, onPress }: { side: 'L' | 'R'; text: string; sub?: string; status?: 'correct' | 'wrong'; picked?: boolean; onPress: () => void }) {
  let bg: string = '#fff', shadow: string = C;
  if (status === 'correct') { bg = colors.mint; shadow = colors.mintShadow; }
  else if (status === 'wrong') { bg = '#FEE2E2'; shadow = '#EF4444'; }
  else if (picked) { bg = colors.yellow; shadow = colors.yellowShadow; }
  const badge = status === 'correct' ? '✓' : status === 'wrong' ? '✕' : picked ? '!' : '';
  const badgeBg = status === 'correct' ? colors.mintShadow : status === 'wrong' ? '#EF4444' : colors.red;
  const cornerSide = side === 'L' ? { right: -7 } : { left: -7 };
  return (
    <Shadowed offset={picked ? 3 : 2} shadowColor={shadow}>
      <Pressable onPress={onPress} disabled={status === 'correct'} style={{ height: ROW_H, backgroundColor: bg, borderWidth: 2.5, borderColor: C, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' }}>
        <Text numberOfLines={1} style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C, textAlign: 'center' }}>
          {side === 'R' && !!sub ? `${sub} ` : ''}{text}
        </Text>
        {!!sub && side === 'L' && <Text style={{ fontFamily: fonts.body, fontSize: fs(9), color: colors.textSoft, marginTop: 2 }}>{sub}</Text>}
        {!!badge && (
          <View style={{ position: 'absolute', top: -7, ...cornerSide, width: 15, height: 15, backgroundColor: badgeBg, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: '#fff' }}>{badge}</Text>
          </View>
        )}
      </Pressable>
    </Shadowed>
  );
}
