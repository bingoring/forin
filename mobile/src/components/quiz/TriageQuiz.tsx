// triage quiz — ESI acuity decision (v17 handoff design). Read the patient case
// (chief complaint + vitals + observation tags), pick one of the five ESI levels,
// and confirm. On confirm the correct/incorrect state reveals + a reasoning panel
// explains WHY the correct level. Falls back to a legacy priority-ranking layout
// (card order) when no `patient`/`correctLevel` is present.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

const RANK_COLOR = ['#EF4444', '#F97316', '#FACC15', '#34D399', '#60A5FA'];
// Fixed 5-level Emergency Severity Index.
const LEVELS = [
  { n: 1, color: '#DC2626', name: 'Resuscitation', time: 'Immediate' },
  { n: 2, color: '#F97316', name: 'Emergent', time: '< 10 min' },
  { n: 3, color: '#FACC15', name: 'Urgent', time: '< 30 min' },
  { n: 4, color: '#22C55E', name: 'Less Urgent', time: '< 1 hour' },
  { n: 5, color: '#3B82F6', name: 'Non-urgent', time: '< 2 hours' },
];

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

export function TriageQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  // ── ESI decision mode (v17) ──
  if (c.patient && c.correctLevel) return <EsiTriage quiz={quiz} onExit={onExit} onComplete={onComplete} progress={progress} />;
  // ── legacy priority-ranking fallback ──
  return <RankTriage quiz={quiz} onExit={onExit} onComplete={onComplete} progress={progress} />;
}

function EsiTriage({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const p = c.patient!;
  const correct = c.correctLevel!;
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const isRight = checked && sel === correct;

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        isRight
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : (
            <>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>
                  선택: {sel ? <Text style={{ color: LEVELS[sel - 1].color }}>LV {sel}</Text> : <Text style={{ color: colors.textFaint }}>—</Text>}
                </Text>
              </View>
              <PixelButton label="↺ 다시" bg="#fff" shadowColor={C} fontSize={11} disabled={sel === null && !checked} onPress={() => { setSel(null); setChecked(false); }} style={{ flex: 1 }} />
              <PixelButton label="✓ 확정" bg={colors.mint} shadowColor={colors.mintShadow} fontSize={12} disabled={sel === null} onPress={() => setChecked(true)} style={{ flex: 1 }} />
            </>
          )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* patient case card */}
      <View style={{ marginBottom: 12 }}>
        <Shadowed offset={3}>
          <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 10, paddingTop: 14 }}>
            <View style={{ position: 'absolute', top: -8, left: 10, backgroundColor: '#DC2626', borderWidth: 1.5, borderColor: C, paddingHorizontal: 5 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: '#fff' }}>PATIENT CASE</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <View style={{ width: 56, height: 64, backgroundColor: colors.peach, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 34 }}>😰</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>{p.age} y / {p.sex}</Text>
                {!!p.arrival && <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, marginTop: 2 }}>{p.arrival}</Text>}
                {!!p.cc && (
                  <View style={{ marginTop: 5, backgroundColor: colors.cream, borderWidth: 1.5, borderColor: C, paddingVertical: 4, paddingHorizontal: 6 }}>
                    <Text style={{ fontFamily: fonts.body, fontSize: 10, color: C, lineHeight: 15 }}>
                      <Text style={{ fontFamily: fonts.heading, backgroundColor: colors.yellow }}>CC. </Text>"{p.cc}"
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {/* vitals strip */}
            {!!p.vitals?.length && (
              <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
                {p.vitals.map((v, i) => (
                  <View key={i} style={{ flex: 1, backgroundColor: v.warn ? '#FEE2E2' : colors.paper, borderWidth: 1.5, borderColor: C, paddingVertical: 4, alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: colors.textSoft }}>{v.label}</Text>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: v.warn ? '#DC2626' : C, marginTop: 2 }}>{v.value}</Text>
                    {!!v.unit && <Text style={{ fontFamily: fonts.body, fontSize: 8, color: colors.textSoft, marginTop: 1 }}>{v.unit}</Text>}
                  </View>
                ))}
              </View>
            )}
            {/* observation tags */}
            {!!p.obs?.length && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                {p.obs.map((o, i) => (
                  <View key={i} style={{ backgroundColor: o.warn ? '#DC2626' : '#fff', borderWidth: 1.5, borderColor: C, paddingHorizontal: 5, paddingVertical: 2 }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: o.warn ? '#fff' : C }}>{o.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Shadowed>
      </View>

      {/* ESI level rows */}
      <View style={{ gap: 5 }}>
        {LEVELS.map((l) => {
          const selected = sel === l.n;
          const showCorrect = checked && l.n === correct;
          const showWrong = checked && selected && l.n !== correct;
          const active = selected || showCorrect;
          return (
            <Shadowed key={l.n} offset={active ? 3 : 2} shadowColor={active ? l.color : C + '66'}>
              <Pressable
                disabled={isRight}
                onPress={() => { if (!isRight) { setSel(l.n); setChecked(false); } }}
                style={{ flexDirection: 'row', alignItems: 'stretch', backgroundColor: showWrong ? '#FEE2E2' : active ? l.color + '22' : '#fff', borderWidth: 2.5, borderColor: active ? l.color : showWrong ? '#DC2626' : C }}
              >
                <View style={{ width: 38, backgroundColor: l.color, alignItems: 'center', justifyContent: 'center', borderRightWidth: 2.5, borderRightColor: C }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 20, color: '#fff' }}>{l.n}</Text>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 7, color: '#fff' }}>LV</Text>
                </View>
                <View style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 10 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>{l.name}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 9, color: colors.textSoft }}>{l.time}</Text>
                </View>
                {(showCorrect || (selected && !checked)) && (
                  <View style={{ justifyContent: 'center', paddingHorizontal: 8 }}>
                    <View style={{ backgroundColor: l.color, borderWidth: 1.5, borderColor: C, paddingHorizontal: 6, paddingVertical: 1 }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: '#fff' }}>{showCorrect ? '✓ 정답' : '✓ 선택'}</Text>
                    </View>
                  </View>
                )}
                {showWrong && <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}><Text style={{ fontFamily: fonts.heading, fontSize: 12, color: '#DC2626' }}>✗</Text></View>}
              </Pressable>
            </Shadowed>
          );
        })}
      </View>

      {/* result + reasoning */}
      {checked && (
        <View style={{ marginTop: 12 }}>
          <View style={{ backgroundColor: isRight ? colors.mint : '#FEE2E2', borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 12 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>{isRight ? '✓ 정확한 판정이에요!' : `✗ 정답은 LV ${correct} 예요. 근거를 확인하세요.`}</Text>
          </View>
          {!!c.reasoning?.length && (
            <View style={{ marginTop: 10 }}>
              <Shadowed offset={2}>
                <View style={{ backgroundColor: '#FFF7ED', borderWidth: 2, borderColor: C, padding: 10, paddingTop: 14 }}>
                  <View style={{ position: 'absolute', top: -8, left: 8, backgroundColor: '#F97316', borderWidth: 1.5, borderColor: C, paddingHorizontal: 5 }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: '#fff' }}>WHY LV {correct}?</Text>
                  </View>
                  {c.reasoning.map((r, i) => (
                    <View key={i} style={{ flexDirection: 'row', gap: 5, marginBottom: 3 }}>
                      <Text style={{ width: 14, fontFamily: fonts.heading, fontSize: 10, color: r.kind === 'ok' ? '#16A34A' : r.kind === 'bad' ? '#DC2626' : C }}>{r.kind === 'ok' ? '✓' : r.kind === 'bad' ? '✗' : ''}</Text>
                      <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 10, color: C, lineHeight: 15, textDecorationLine: r.kind === 'bad' ? 'line-through' : 'none' }}>{r.text}</Text>
                    </View>
                  ))}
                </View>
              </Shadowed>
            </View>
          )}
        </View>
      )}

      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}

// ── legacy priority-ranking fallback (cards with order) ──
function RankTriage({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const cards = c.cards ?? [];
  const bankOrder = useMemo(() => shuffle(cards.map((_, i) => i)), [cards]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const inBank = bankOrder.filter((i) => !placed.includes(i));
  const full = placed.length === cards.length && cards.length > 0;
  const correctness = placed.map((ci, slot) => cards[ci]?.order === slot + 1);
  const allCorrect = checked && correctness.every(Boolean);

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && allCorrect
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : checked
            ? <View style={{ flex: 1 }}><PixelButton label="↻ 다시" bg="#fff" shadowColor={C} onPress={() => { setChecked(false); setPlaced([]); }} full /></View>
            : <View style={{ flex: 1 }}><PixelButton label="🚨 우선순위 제출" bg={colors.mint} shadowColor={colors.mintShadow} disabled={!full} onPress={() => setChecked(true)} full /></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}
      <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft, marginBottom: 5 }}>━ 우선순위 (1 = 가장 급함) ━</Text>
      <View style={{ gap: 6 }}>
        {cards.map((_, slot) => {
          const ci = placed[slot];
          const card = ci !== undefined ? cards[ci] : null;
          const ok = checked && correctness[slot];
          const bad = checked && card && !correctness[slot];
          return (
            <View key={slot} style={{ flexDirection: 'row', alignItems: 'stretch', gap: 6 }}>
              <View style={{ width: 30, backgroundColor: RANK_COLOR[slot] ?? '#94A3B8', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: '#fff' }}>{slot + 1}</Text>
              </View>
              {card ? (
                <Pressable onPress={() => !checked && setPlaced(placed.filter((_, i) => i !== slot))} style={{ flex: 1, backgroundColor: ok ? colors.mint : bad ? '#FEE2E2' : '#fff', borderWidth: 2, borderColor: C, justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 7 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C, lineHeight: 15 }}>{card.text}{checked ? (ok ? '  ✓' : '  ✕') : ''}</Text>
                </Pressable>
              ) : (
                <View style={{ flex: 1, borderWidth: 2, borderColor: '#2A252255', borderStyle: 'dashed', padding: 10 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textFaint }}>비어 있음</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
      {inBank.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft, marginBottom: 5 }}>━ 환자 카드 ━</Text>
          <View style={{ gap: 6 }}>
            {inBank.map((ci) => (
              <Shadowed key={ci} offset={2}>
                <Pressable onPress={() => !checked && setPlaced([...placed, ci])} style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C, lineHeight: 15 }}>{cards[ci].text}</Text>
                </Pressable>
              </Shadowed>
            ))}
          </View>
        </View>
      )}
      {checked && <ResultBanner correct={allCorrect} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}
