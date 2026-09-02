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
import { NbIcon } from '@/components/nb/NbIcon';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, C } from '@/components/quiz/QuizShell';
import { NbButton } from '@/components/nb/NbUI';
import { playSfx } from '@/lib/sfx';
import { t, useT } from '@/i18n';

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

const ROW_H = 54;   // fixed chip height → predictable connector geometry
const GAP = 8;
const PITCH = ROW_H + GAP;
const rowCenter = (i: number) => ROW_H / 2 + i * PITCH; // y-center of row i

export function MatchQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const t = useT();
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
              <View key={i} style={{ width: 15, height: 15, borderWidth: 1.4, borderColor: nb.ink, alignItems: 'center', justifyContent: 'center', backgroundColor: matched.has(i) ? 'rgba(168,217,151,.4)' : '#fff' }}>
                {matched.has(i) && <NbIcon name="check" size={13} color={nb.green} />}
              </View>
            ))}
            <Text style={{ marginLeft: 4, fontFamily: nbFonts.hand, fontSize: 13.5, color: nb.soft }}>{matched.size}/{pairs.length}</Text>
          </View>
          <NbButton variant="paper" disabled={matched.size === 0} onPress={reset}>{t('quiz.reset')}</NbButton>
          <NbButton variant="ink" iconColor={nb.paper} disabled={!done} onPress={onComplete}>{t('quiz.finish')}</NbButton>
        </View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}
      <Text style={{ fontFamily: nbFonts.body, fontSize: 11, color: nb.soft, textAlign: 'center', marginBottom: 10 }}>{t('quiz.matchHint')}</Text>

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
                    <Path d={`M0 ${y1} L34 ${y2}`} stroke={nb.green} strokeWidth={3} fill="none" />
                    <Rect x={-2} y={y1 - 3} width={6} height={6} fill={nb.green} stroke={C} strokeWidth={1} />
                    <Rect x={30} y={y2 - 3} width={6} height={6} fill={nb.green} stroke={C} strokeWidth={1} />
                  </G>
                );
              })}
              {/* transient red dashed connector for a wrong attempt */}
              {wrong && (
                <Path d={`M0 ${rowCenter(wrong.l)} L34 ${rowCenter(rightRowOf(wrong.r))}`} stroke="#EF4444" strokeWidth={3} strokeDasharray="4,3" fill="none" />
              )}
              {/* in-progress dotted lead line from the picked left chip */}
              {sel !== null && !matched.has(sel) && (
                <Path d={`M0 ${rowCenter(sel)} L22 ${rowCenter(sel) + 10}`} stroke={'#C99A1E'} strokeWidth={3} strokeDasharray="3,3" fill="none" />
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF0EC', borderWidth: 1.4, borderColor: nb.ink, paddingVertical: 6, paddingHorizontal: 10 }}>
            <View style={{ backgroundColor: nb.red, borderWidth: 1.3, borderColor: nb.ink, paddingVertical: 1, paddingHorizontal: 5 }}>
              <NbIcon name="cross" size={12} color={nb.paper} />
            </View>
            <Text style={{ flex: 1, fontFamily: nbFonts.body, fontSize: 11, color: C, lineHeight: 15 }}>
              <Text style={{ fontFamily: nbFonts.hand }}>{pairs[wrong.l]?.left}</Text>은 "{pairs[wrong.l]?.right}"이에요. 다시 시도!
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
  if (status === 'correct') { bg = 'rgba(168,217,151,.4)'; shadow = nb.green; }
  else if (status === 'wrong') { bg = '#FFF0EC'; shadow = nb.red; }
  else if (picked) { bg = 'rgba(249,227,123,.5)'; shadow = '#C99A1E'; }
  const badge = status === 'correct' ? '✓' : status === 'wrong' ? '✕' : picked ? '!' : '';
  const badgeBg = status === 'correct' ? nb.green : status === 'wrong' ? nb.red : nb.red;
  const cornerSide = side === 'L' ? { right: -7 } : { left: -7 };
  return (
    <Shadowed offset={picked ? 3 : 2} shadowColor={shadow}>
      <Pressable onPress={onPress} disabled={status === 'correct'} style={{ height: ROW_H, backgroundColor: bg, borderWidth: 1.5, borderColor: nb.paperEdge, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' }}>
        <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: 17.6, color: C, textAlign: 'center' }}>
          {side === 'R' && !!sub ? `${sub} ` : ''}{text}
        </Text>
        {!!sub && side === 'L' && <Text style={{ fontFamily: nbFonts.body, fontSize: 9, color: nb.soft, marginTop: 2 }}>{sub}</Text>}
        {!!badge && (
          <View style={{ position: 'absolute', top: -7, ...cornerSide, width: 15, height: 15, backgroundColor: badgeBg, borderWidth: 1.4, borderColor: nb.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: nbFonts.hand, fontSize: 12.2, color: nb.paper }}>{badge}</Text>
          </View>
        )}
      </Pressable>
    </Shadowed>
  );
}
