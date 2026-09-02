// ESI 판정 — read the patient note and STAMP an acuity level (v31 J).
//
// The five levels used to be five rows of a list. v31 makes them five round double-ring
// stamps, and that is not decoration: triage is one judgement, made once, and a stamp is
// the mark an authority puts on a chart. A list of rows invites reading down it; a row of
// stamps asks which one you are picking up.
//
// On confirm the verdict reveals and a memo explains WHY that level. Falls back to a
// legacy priority-ranking layout (card order) when no `patient`/`correctLevel` is present.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import type { QuizDetail } from '@/api/client';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, QuizSection, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { NbButton, NbMemo, NbPaper, nbText } from '@/components/nb/NbUI';
import { NbIcon } from '@/components/nb/NbIcon';
import { useT } from '@/i18n';

const RANK_COLOR = [nb.red, '#F97316', '#FACC15', '#34D399', '#60A5FA'];
// Fixed 5-level Emergency Severity Index.
const LEVELS = [
  { n: 1, color: '#DC2626', name: 'Resuscitation', time: 'Immediate' },
  { n: 2, color: '#F97316', name: 'Emergent', time: '< 10 min' },
  { n: 3, color: '#FACC15', name: 'Urgent', time: '< 30 min' },
  { n: 4, color: '#22C55E', name: 'Less Urgent', time: '< 1 hour' },
  { n: 5, color: '#3B82F6', name: 'Non-urgent', time: '< 2 hours' },
];

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

// Crisp-edges pixel patient head (hair · face · frown · sweat drops), ~ handoff PatientHeadPixel.
function PatientHeadPixel() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 16 18">
      <Rect x={3} y={1} width={10} height={3} fill="#9A6B3F" />
      <Rect x={4} y={3} width={8} height={7} fill="#FDE1C8" stroke={C} strokeWidth={0.2} />
      <Rect x={5.5} y={5.5} width={1.5} height={1} fill={C} />
      <Rect x={9} y={5.5} width={1.5} height={1} fill={C} />
      <Rect x={6.5} y={8} width={3} height={0.6} fill="#7C2D12" />
      <Rect x={3} y={10} width={10} height={8} fill="#FED7AA" stroke={C} strokeWidth={0.2} />
      <Rect x={13} y={4} width={1} height={2} fill="#60A5FA" />
      <Rect x={13} y={6} width={1} height={1} fill="#60A5FA" />
    </Svg>
  );
}

export function TriageQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  // ── ESI decision mode (v17) ──
  if (c.patient && c.correctLevel) return <EsiTriage quiz={quiz} onExit={onExit} onComplete={onComplete} progress={progress} />;
  // ── legacy priority-ranking fallback ──
  return <RankTriage quiz={quiz} onExit={onExit} onComplete={onComplete} progress={progress} />;
}

function EsiTriage({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const t = useT();
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
          ? <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} onPress={onComplete}>{t('quiz.finish')}</NbButton></View>
          : (
            <>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontFamily: nbFonts.hand, fontSize: 13.5, color: C }}>
                  선택: {sel ? <Text style={{ color: LEVELS[sel - 1].color }}>LV {sel}</Text> : <Text style={{ color: nb.placeholder }}>—</Text>}
                </Text>
              </View>
              <NbButton variant="paper" disabled={sel === null && !checked} onPress={() => { setSel(null); setChecked(false); }} style={{ flex: 1 }}>{t('quiz.reset')}</NbButton>
              <NbButton variant="ink" iconColor={nb.paper} disabled={sel === null} onPress={() => setChecked(true)} style={{ flex: 1 }}>{t('quiz.confirm')}</NbButton>
            </>
          )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* The patient note. Paper, with the label printed on it — this is what was handed
          over at the door, not a UI card. */}
      <View style={{ marginBottom: 14 }}>
        <NbPaper rot={-0.4}>
          <View style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
            <Text numberOfLines={1} style={styles.noteLabel}>{t('quiz.patientNote')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 11, marginTop: 7 }}>
              <NbPaper rot={-2.5} bg="#FFF3EE" style={{ width: 56, height: 64, alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                <PatientHeadPixel />
              </NbPaper>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: nbFonts.hand, fontSize: 16.2, color: C }}>{p.age} y / {p.sex}</Text>
                {!!p.arrival && <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.soft, marginTop: 2 }}>{p.arrival}</Text>}
                {!!p.cc && (
                  <View style={{ marginTop: 5, backgroundColor: nb.cream, borderWidth: 1.3, borderColor: nb.ink, paddingVertical: 4, paddingHorizontal: 6 }}>
                    <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: C, lineHeight: 15 }}>
                      <Text style={{ fontFamily: nbFonts.hand, backgroundColor: 'rgba(249,227,123,.5)' }}>CC. </Text>"{p.cc}"
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {/* vitals strip */}
            {!!p.vitals?.length && (
              <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
                {p.vitals.map((v, i) => (
                  <View key={i} style={{ flex: 1, backgroundColor: v.warn ? '#FFF0EC' : nb.paper, borderWidth: 1.3, borderColor: nb.ink, paddingVertical: 4, alignItems: 'center' }}>
                    <Text style={{ fontFamily: nbFonts.hand, fontSize: 10.8, color: nb.soft }}>{v.label}</Text>
                    <Text style={{ fontFamily: nbFonts.hand, fontSize: 17.6, color: v.warn ? '#DC2626' : C, marginTop: 2 }}>{v.value}</Text>
                    {!!v.unit && <Text style={{ fontFamily: nbFonts.body, fontSize: 8, color: nb.soft, marginTop: 1 }}>{v.unit}</Text>}
                  </View>
                ))}
              </View>
            )}
            {/* observation tags */}
            {!!p.obs?.length && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                {p.obs.map((o, i) => (
                  <View key={i} style={{ backgroundColor: o.warn ? '#DC2626' : '#fff', borderWidth: 1.3, borderColor: nb.ink, paddingHorizontal: 5, paddingVertical: 2 }}>
                    <Text style={{ fontFamily: nbFonts.hand, fontSize: 12.2, color: o.warn ? '#fff' : C }}>{o.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </NbPaper>
      </View>

      {/* The five stamps. Round, double-ringed and each at its own angle — one is picked
          up and pressed onto the chart, which is what a triage decision is. */}
      <View style={styles.stampRow}>
        {LEVELS.map((l, i) => {
          const selected = sel === l.n;
          const showCorrect = checked && l.n === correct;
          const showWrong = checked && selected && l.n !== correct;
          const active = selected || showCorrect;
          return (
            <Pressable
              key={l.n}
              disabled={isRight}
              onPress={() => { if (!isRight) { setSel(l.n); setChecked(false); } }}
              style={{ alignItems: 'center' }}
            >
              <View
                style={[
                  styles.stamp,
                  {
                    borderColor: showWrong ? nb.red : l.color,
                    backgroundColor: active ? `${l.color}22` : 'transparent',
                    transform: [{ rotate: i % 2 ? '6deg' : '-7deg' }],
                  },
                ]}
              >
                {/* Two rings, because RN has no `border: double` — same construction as
                    NbStamp, at a size that fits five across. */}
                <View pointerEvents="none" style={[styles.stampInner, { borderColor: showWrong ? nb.red : l.color }]} />
                <Text style={[styles.stampN, { color: showWrong ? nb.red : l.color }]}>{l.n}</Text>
                <Text numberOfLines={1} style={[styles.stampName, { color: showWrong ? nb.red : l.color }]}>{l.name}</Text>
              </View>
              {/* The verdict sits UNDER the stamp: printing it inside would cover the
                  number the learner is being asked to remember. */}
              {(showCorrect || showWrong) && (
                <View style={{ marginTop: 3 }}>
                  <NbIcon name={showCorrect ? 'check' : 'cross'} size={13} color={showCorrect ? nb.green : nb.red} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* What is currently stamped, in words — a colour alone is not a label, and this row
          is read at a glance. */}
      <Text style={styles.stamped}>
        {sel
          ? t('quiz.stampedNow', { level: sel, name: LEVELS[sel - 1].name })
          : t('quiz.stampedNone')}
      </Text>

      {checked && (
        <View style={{ marginTop: 12 }}>
          <View style={[styles.verdict, { backgroundColor: isRight ? 'rgba(168,217,151,.4)' : '#FFF0EC', borderColor: isRight ? nb.green : '#E4B4A6' }]}>
            <NbIcon name={isRight ? 'check' : 'cross'} size={17} color={isRight ? nb.green : nb.red} />
            <Text style={[nbText.hand(16.5), { flex: 1, minWidth: 0 }]}>
              {isRight ? t('quiz.triageRight') : t('quiz.triageWrong', { level: correct })}
            </Text>
          </View>
          {!!c.reasoning?.length && (
            <NbMemo color={nb.blue} rot={0.3} style={{ marginTop: 11 }}>
              <Text numberOfLines={1} style={styles.whyLabel}>{t('quiz.whyLevel', { level: correct })}</Text>
              {c.reasoning.map((r, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 5 }}>
                  <View style={{ width: 14, marginTop: 3 }}>
                    {r.kind === 'ok'
                      ? <NbIcon name="check" size={13} color={nb.green} />
                      : r.kind === 'bad' ? <NbIcon name="cross" size={11} color={nb.red} /> : null}
                  </View>
                  <Text
                    style={[
                      nbText.hand(14.5),
                      { flex: 1, minWidth: 0, textDecorationLine: r.kind === 'bad' ? 'line-through' : 'none', textDecorationColor: nb.red },
                    ]}
                  >
                    {r.text}
                  </Text>
                </View>
              ))}
            </NbMemo>
          )}
        </View>
      )}

      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}

// ── legacy priority-ranking fallback (cards with order) ──
function RankTriage({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
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

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && allCorrect
          ? <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} onPress={onComplete}>{t('quiz.finish')}</NbButton></View>
          : checked
            ? <View style={{ flex: 1 }}><NbButton variant="paper" full onPress={() => { setChecked(false); setPlaced([]); }}>{t('quiz.retry')}</NbButton></View>
            : <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} disabled={!full} onPress={() => setChecked(true)}>{t('quiz.submitPriority')}</NbButton></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}
      <QuizSection label={t('quiz.priorityOrder')} />
      <View style={{ gap: 6 }}>
        {cards.map((_, slot) => {
          const ci = placed[slot];
          const card = ci !== undefined ? cards[ci] : null;
          const ok = checked && correctness[slot];
          const bad = checked && card && !correctness[slot];
          return (
            <View key={slot} style={{ flexDirection: 'row', alignItems: 'stretch', gap: 6 }}>
              <View style={{ width: 30, backgroundColor: RANK_COLOR[slot] ?? '#94A3B8', borderWidth: 1.4, borderColor: nb.ink, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: nbFonts.hand, fontSize: 18.9, color: nb.paper }}>{slot + 1}</Text>
              </View>
              {card ? (
                <Pressable onPress={() => !checked && setPlaced(placed.filter((_, i) => i !== slot))} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: ok ? 'rgba(168,217,151,.4)' : bad ? '#FFF0EC' : nb.paper, borderWidth: 1.4, borderColor: nb.paperEdge, paddingHorizontal: 9, paddingVertical: 8 }}>
                  <Text style={{ flex: 1, minWidth: 0, fontFamily: nbFonts.body, fontSize: 11, color: C, lineHeight: 16 }}>{card.text}</Text>
                  {/* Drawn, not appended: a ✓ inside the sentence reads as part of what
                      the card says. */}
                  {checked && <NbIcon name={ok ? 'check' : 'cross'} size={13} color={ok ? nb.green : nb.red} />}
                </Pressable>
              ) : (
                <View style={{ flex: 1, borderWidth: 2, borderColor: 'rgba(62,54,43,.18)', borderStyle: 'dashed', padding: 10 }}>
                  <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.placeholder }}>{t('quiz.emptySlot')}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
      {inBank.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <QuizSection label={t('quiz.patientCards')} />
          <View style={{ gap: 6 }}>
            {inBank.map((ci) => (
              <Shadowed key={ci} offset={2}>
                <Pressable onPress={() => !checked && setPlaced([...placed, ci])} style={{ backgroundColor: nb.paper, borderWidth: 1.4, borderColor: nb.ink, paddingVertical: 8, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: nbFonts.body, fontSize: 11, color: C, lineHeight: 15 }}>{cards[ci].text}</Text>
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

const styles = {
  noteLabel: { fontFamily: nbFonts.bodyBold, fontSize: 11, color: nb.blue, letterSpacing: 1 } as const,
  stampRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 } as const,
  stamp: {
    width: 58, height: 58, borderRadius: 29, borderWidth: 1.6,
    alignItems: 'center', justifyContent: 'center',
  } as const,
  stampInner: { position: 'absolute', left: 3, top: 3, right: 3, bottom: 3, borderRadius: 26, borderWidth: 1.2 } as const,
  stampN: { fontFamily: nbFonts.handBold, fontSize: 21, lineHeight: 23 } as const,
  /** The level's English name, printed small — it is clinical vocabulary the learner is
   *  here to pick up, and five of them across a phone need every pixel. */
  stampName: { fontFamily: nbFonts.mono, fontSize: 6.5, letterSpacing: 0.2, marginTop: 1 } as const,
  stamped: { ...nbText.hand(15, nb.soft), textAlign: 'center' as const, marginTop: 14 },
  verdict: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 9, paddingHorizontal: 12,
    borderWidth: 1.5, borderStyle: 'dashed', transform: [{ rotate: '-0.4deg' }],
  } as const,
  whyLabel: { fontFamily: nbFonts.bodyBold, fontSize: 10.5, color: nb.blue, letterSpacing: 1 } as const,
};
