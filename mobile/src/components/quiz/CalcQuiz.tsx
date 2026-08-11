// calc quiz — dosage calculation. Two layouts:
//  • DOSAGE (v17 handoff): a prescription order card → on-hand vial (pixel art) →
//    D ÷ H × Q worksheet → syringe scale → 5-Rights safety check. The learner
//    keys in the volume; submit reveals the substitution + syringe fill.
//  • fallback: a given-facts card + equation (weight-based doses etc.).
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '⌫'];

// numEqual compares a keyed entry to the answer numerically (so ".5" === "0.50"),
// with a tiny tolerance for float dust; falls back to a trimmed string compare
// when either side isn't a plain number.
function numEqual(entry: string, answer: string): boolean {
  const a = entry.trim();
  const b = (answer ?? '').trim();
  if (!a) return false;
  const na = Number(a);
  const nb = Number(b);
  if (Number.isFinite(na) && Number.isFinite(nb)) return Math.abs(na - nb) < 1e-6;
  return a === b;
}

export function CalcQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const [entry, setEntry] = useState('');
  const [checked, setChecked] = useState(false);
  // Numeric match with tolerance — ".5", "0.5", "0.50" are all the same dose.
  // Falls back to a trimmed string compare for non-numeric answers.
  const correct = checked && numEqual(entry, c.answer ?? '');
  const rich = !!(c.order || c.vial || c.desired);

  const press = (k: string) => {
    if (checked) return;
    if (k === '⌫') setEntry((e) => e.slice(0, -1));
    else if (k === '.' && entry.includes('.')) return;
    else setEntry((e) => (e.length < 8 ? e + k : e));
  };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && correct
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : checked
            ? <View style={{ flex: 1 }}><PixelButton label="↻ 다시" bg="#fff" shadowColor={C} onPress={() => { setChecked(false); setEntry(''); }} full /></View>
            : (
              <>
                {!!c.secondCheck && <View style={{ flex: 1, justifyContent: 'center' }}><Text style={{ fontFamily: fonts.body, fontSize: 9, color: colors.textSoft }}>2nd check: <Text style={{ fontFamily: fonts.heading, color: C }}>{c.secondCheck}</Text></Text></View>}
                <View style={{ flex: 1 }}><PixelButton label={rich ? '✓ 더블체크' : '✓ 계산 제출'} bg={colors.mint} shadowColor={colors.mintShadow} disabled={!entry} onPress={() => setChecked(true)} full /></View>
              </>
            )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {rich ? (
        <DosageBody c={c} entry={entry} checked={checked} correct={correct} />
      ) : (
        <Shadowed offset={3}>
          <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 12 }}>
            {(c.given ?? []).map((g, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: '#2A252233', borderStyle: 'dotted' }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C }}>{g.label}</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>{g.value}</Text>
              </View>
            ))}
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: C }}>{c.eq} =</Text>
              <View style={{ backgroundColor: entry ? colors.mint : colors.yellow + '44', borderWidth: 2.5, borderColor: C, paddingVertical: 3, paddingHorizontal: 14, minWidth: 60, alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: C }}>{entry || '?'}</Text>
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft }}>{c.answerUnit}</Text>
            </View>
          </View>
        </Shadowed>
      )}

      {/* keypad */}
      <View style={{ marginTop: 14 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft, marginBottom: 6 }}>━ 계산기 ━━━━━━━━</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {KEYS.map((k) => (
            <Shadowed key={k} offset={2} style={{ width: '31.5%' }}>
              <Pressable onPress={() => press(k)} style={{ backgroundColor: k === '⌫' ? colors.paper : '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 10, alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: C }}>{k}</Text>
              </Pressable>
            </Shadowed>
          ))}
        </View>
      </View>

      {checked && <ResultBanner correct={correct} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}

function DosageBody({ c, entry, checked, correct }: { c: NonNullable<QuizDetail['content']>; entry: string; checked: boolean; correct: boolean }) {
  const o = c.order;
  const v = c.vial;
  const answerVal = parseFloat(c.answer ?? '0') || 0;
  const syringeMax = c.syringeMax || 1;
  const fill = Math.max(0, Math.min(1, answerVal / syringeMax));
  return (
    <>
      {/* order card */}
      {!!o && (
        <Shadowed offset={3}>
          <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, marginBottom: 10 }}>
            <View style={{ backgroundColor: colors.yellow, borderBottomWidth: 2.5, borderBottomColor: C, paddingVertical: 4, paddingHorizontal: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>ORDER · {o.id}</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: C }}>{o.prescriber} · {o.time}</Text>
            </View>
            <View style={{ paddingVertical: 8, paddingHorizontal: 10 }}>
              {!!o.patient && <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C }}><Text style={{ fontFamily: fonts.heading }}>Patient: </Text>{o.patient}</Text>}
              {!!o.drug && <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C, marginTop: 3 }}><Text style={{ backgroundColor: colors.yellow, fontFamily: fonts.heading }}> {o.drug} </Text></Text>}
            </View>
          </View>
        </Shadowed>
      )}

      {/* vial + worksheet */}
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
        {!!v && (
          <Shadowed offset={3} style={{ width: 100 }}>
            <View style={{ backgroundColor: colors.paper, borderWidth: 2.5, borderColor: C, padding: 6, paddingTop: 10 }}>
              <View style={{ position: 'absolute', top: -7, left: 4, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, paddingHorizontal: 4 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: C }}>ON HAND</Text>
              </View>
              <VialArt />
              <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C, textAlign: 'center', marginTop: 4 }}>{v.drug}</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: '#DC2626', textAlign: 'center', marginTop: 2 }}>{v.concentration}</Text>
              {!!v.size && <Text style={{ fontFamily: fonts.body, fontSize: 9, color: colors.textSoft, textAlign: 'center', marginTop: 1 }}>{v.size}</Text>}
            </View>
          </Shadowed>
        )}

        {/* worksheet */}
        <Shadowed offset={3} style={{ flex: 1 }}>
          <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 8, paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft, marginBottom: 6 }}>━ FORMULA ━</Text>
            {/* D/H × Q = ? */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Fraction top="D" bottom="H" />
              <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>× Q =</Text>
              <View style={{ backgroundColor: entry ? colors.mint : colors.yellow + '55', borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 10, minWidth: 44, alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>{entry || '?'}</Text>
              </View>
            </View>
            {/* substitution — revealed after submit */}
            {checked && (
              <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, flexWrap: 'wrap' }}>
                <Fraction top={c.desired} bottom={c.onHand} sub={c.dhqUnit} red />
                <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>× {c.perQty} =</Text>
                <View style={{ backgroundColor: correct ? colors.yellow : '#FEE2E2', borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>{c.answer} {c.answerUnit}</Text>
                </View>
              </View>
            )}
            <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1.5, borderTopColor: '#2A252233', borderStyle: 'dashed' }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 9, color: colors.textSoft, lineHeight: 13 }}>
                <Text style={{ fontFamily: fonts.heading, color: C }}>D</Text> Desired · <Text style={{ fontFamily: fonts.heading, color: C }}>H</Text> On Hand · <Text style={{ fontFamily: fonts.heading, color: C }}>Q</Text> per Quantity
              </Text>
            </View>
          </View>
        </Shadowed>
      </View>

      {/* syringe scale — revealed after submit */}
      {checked && (
        <Shadowed offset={3} style={{ marginTop: 10 }}>
          <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 8, paddingHorizontal: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>주사기 눈금 ({syringeMax} mL)</Text>
              <View style={{ backgroundColor: colors.mint, borderWidth: 1.5, borderColor: C, paddingHorizontal: 5, paddingVertical: 1 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C }}>{c.answer} {c.answerUnit}</Text>
              </View>
            </View>
            <SyringeScale fill={fill} label={`${c.answer}`} />
          </View>
        </Shadowed>
      )}

      {/* 5 rights safety tip */}
      <Shadowed offset={2} style={{ marginTop: 10 }}>
        <View style={{ backgroundColor: '#FEF3C7', borderWidth: 2, borderColor: C, paddingVertical: 7, paddingHorizontal: 9, flexDirection: 'row', gap: 6 }}>
          <View style={{ backgroundColor: '#F59E0B', borderWidth: 1.5, borderColor: C, paddingHorizontal: 5, alignSelf: 'flex-start' }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: '#fff' }}>5R</Text>
          </View>
          <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 10, color: C, lineHeight: 15 }}>
            <Text style={{ fontFamily: fonts.heading }}>5 Rights: </Text>Right Patient · Drug · Dose · Route · Time — 모두 확인했나요?
          </Text>
        </View>
      </Shadowed>
    </>
  );
}

function Fraction({ top, bottom, sub, red }: { top?: string; bottom?: string; sub?: string; red?: boolean }) {
  const col = red ? '#DC2626' : C;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: col, paddingHorizontal: 3 }}>{top}</Text>
        <View style={{ height: 2, backgroundColor: C, alignSelf: 'stretch' }} />
        <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: col, paddingHorizontal: 3 }}>{bottom}</Text>
      </View>
      {!!sub && <Text style={{ fontFamily: fonts.body, fontSize: 9, color: colors.textSoft }}>{sub}</Text>}
    </View>
  );
}

// Pixel medication vial (crisp-edges), ~ handoff VialPixel.
function VialArt() {
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={44} height={76} viewBox="0 0 30 50">
        <Rect x={10} y={2} width={10} height={3} fill="#475569" />
        <Rect x={9} y={5} width={12} height={2} fill="#64748B" stroke={C} strokeWidth={0.4} />
        <Rect x={11} y={7} width={8} height={2} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
        <Rect x={7} y={9} width={16} height={32} fill="#E0E7FF" stroke={C} strokeWidth={0.5} />
        <Rect x={8} y={14} width={14} height={26} fill="#A5B4FC" />
        <Rect x={8} y={14} width={14} height={2} fill="#7C8CE6" />
        <Rect x={6} y={20} width={18} height={14} fill="#fff" stroke={C} strokeWidth={0.5} />
        <Rect x={6} y={20} width={18} height={3} fill="#DC2626" />
        <Rect x={8} y={25} width={14} height={1} fill={C} />
        <Rect x={8} y={27} width={10} height={1} fill={C} />
        <Rect x={8} y={29} width={12} height={1} fill={C} />
        <Rect x={8} y={31} width={8} height={1} fill={C} />
        <Rect x={6} y={41} width={18} height={3} fill="#94A3B8" stroke={C} strokeWidth={0.4} />
      </Svg>
    </View>
  );
}

// Horizontal syringe barrel with fill + 0.1 tick marks + plunger.
function SyringeScale({ fill, label }: { fill: number; label: string }) {
  return (
    <View style={{ height: 30, justifyContent: 'center' }}>
      {/* tip (left) + needle (right) */}
      <View style={{ position: 'absolute', left: 0, top: 12, width: 6, height: 6, backgroundColor: '#475569', borderWidth: 1.5, borderColor: C }} />
      <View style={{ position: 'absolute', right: 0, top: 14, width: 6, height: 2, backgroundColor: C }} />
      <View style={{ height: 16, backgroundColor: '#fff', borderWidth: 2, borderColor: C, marginHorizontal: 6, position: 'relative' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, backgroundColor: '#A5B4FC', borderRightWidth: 2, borderRightColor: C }} />
        {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((tv) => (
          <View key={tv} style={{ position: 'absolute', left: `${tv * 100}%`, top: 0, bottom: 0, width: 1, backgroundColor: C, opacity: tv === 0.5 ? 1 : 0.35 }} />
        ))}
        {/* value marker */}
        <View style={{ position: 'absolute', left: `${fill * 100}%`, top: -3, bottom: -3, width: 3, backgroundColor: '#374151', borderWidth: 1, borderColor: C, marginLeft: -1.5 }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 6, marginTop: 2 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: colors.textSoft }}>0</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: C }}>{label}</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: colors.textSoft }}>MAX</Text>
      </View>
    </View>
  );
}
