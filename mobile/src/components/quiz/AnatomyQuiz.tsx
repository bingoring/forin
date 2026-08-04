// anatomy quiz — body-part labeling. 1:1 with the v16 handoff ScreenQuizAnatomy:
// a full-body chibi patient sprite with numbered dots on labelable regions, and a
// word bank of body parts. Tap a dot to select it, then a bank word to tag it (or
// tap a placed dot to clear). Submit checks each dot against its correct label;
// correct tags lock mint, wrong flash red with a feedback note.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

function shuffle<T>(a: T[]): T[] { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

const BODY_W = 130;
const BODY_H = 336;

export function AnatomyQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const dots = c.bodyDots ?? [];
  const bank = useMemo(() => shuffle(c.bank ?? []), [c.bank]);
  const [assigned, setAssigned] = useState<(string | null)[]>(() => dots.map(() => null));
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const used = new Set(assigned.filter(Boolean) as string[]);
  const full = dots.length > 0 && assigned.every((a) => a !== null);
  const correctness = assigned.map((a, i) => a === dots[i]?.label);
  const allCorrect = checked && correctness.every(Boolean);
  const filled = assigned.filter(Boolean).length;
  const firstWrongIdx = checked ? dots.findIndex((_, i) => !correctness[i]) : -1;

  const tapDot = (i: number) => {
    if (checked) return;
    if (assigned[i]) { const a = [...assigned]; a[i] = null; setAssigned(a); setSel(null); return; }
    setSel(i);
  };
  const tapWord = (w: string) => {
    if (checked || used.has(w)) return;
    const target = sel !== null && assigned[sel] === null ? sel : assigned.indexOf(null);
    if (target === -1) return;
    const a = [...assigned]; a[target] = w; setAssigned(a); setSel(null);
  };
  const restart = () => { setAssigned(dots.map(() => null)); setSel(null); };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && allCorrect
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : checked
            ? <View style={{ flex: 1 }}><PixelButton label="↻ 다시" bg="#fff" shadowColor={C} onPress={() => { setChecked(false); restart(); }} full /></View>
            : (
              <>
                <PixelButton label="↺ 처음부터" bg="#fff" shadowColor={C} fontSize={12} disabled={filled === 0} onPress={restart} style={{ flex: 1 }} />
                <View style={{ flex: 2 }}><PixelButton label={`✓ 제출 (${filled}/${dots.length})`} bg={colors.mint} shadowColor={colors.mintShadow} disabled={!full} onPress={() => setChecked(true)} full /></View>
              </>
            )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      <View style={{ flexDirection: 'row', gap: 12 }}>
        {/* patient body diagram + dots */}
        <Shadowed offset={3}>
          <View style={{ width: BODY_W, height: BODY_H, backgroundColor: colors.paper, borderWidth: 3, borderColor: C, position: 'relative' }}>
            <View style={{ position: 'absolute', top: -8, left: 8, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, paddingHorizontal: 4, zIndex: 5 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: C }}>PATIENT</Text>
            </View>
            <View style={{ flex: 1, padding: 8 }}>
              <PatientBody />
            </View>
            {dots.map((d, i) => {
              const a = assigned[i];
              const st = checked && a ? (correctness[i] ? 'correct' : 'wrong') : a ? 'filled' : sel === i ? 'hover' : 'empty';
              const dotBg = st === 'correct' || st === 'filled' ? colors.mint : st === 'wrong' ? '#FCA5A5' : st === 'hover' ? colors.yellow : '#fff';
              return (
                <Pressable key={i} onPress={() => tapDot(i)} style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, marginLeft: -10, marginTop: -10, zIndex: 4 }}>
                  {/* dot — fixed 20×20, always centered on the point */}
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: dotBg, borderWidth: 2.5, borderColor: st === 'empty' ? '#9CA3AF' : C, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>{i + 1}</Text>
                  </View>
                  {/* tag — absolute + centered under the dot so its width never shifts the dot */}
                  {(a || sel === i) && (
                    <View pointerEvents="none" style={{ position: 'absolute', top: 22, left: -40, width: 100, alignItems: 'center' }}>
                      {a ? (
                        <View style={{ backgroundColor: dotBg, borderWidth: 1.5, borderColor: C, paddingVertical: 1, paddingHorizontal: 4 }}>
                          <Text style={{ fontFamily: fonts.heading, fontSize: 8.5, color: C, textDecorationLine: st === 'wrong' ? 'line-through' : 'none' }}>{a}{st === 'correct' ? ' ✓' : st === 'wrong' ? ' ✕' : ''}</Text>
                        </View>
                      ) : (
                        <View style={{ borderWidth: 1.5, borderColor: colors.yellowShadow, borderStyle: 'dashed', paddingVertical: 1, paddingHorizontal: 4 }}>
                          <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: colors.yellowShadow }}>여기에</Text>
                        </View>
                      )}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Shadowed>

        {/* word bank + feedback */}
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft }}>━ 단어 카드 ━</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {bank.map((w, i) => {
              const isUsed = used.has(w);
              return (
                <Shadowed key={i} offset={isUsed ? 0 : 2}>
                  <Pressable onPress={() => tapWord(w)} style={{ backgroundColor: isUsed ? '#2A252222' : '#fff', borderWidth: 2, borderColor: C, paddingVertical: 6, paddingHorizontal: 8 }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 10.5, color: isUsed ? colors.textFaint : C, textDecorationLine: isUsed ? 'line-through' : 'none' }}>{w}</Text>
                  </Pressable>
                </Shadowed>
              );
            })}
          </View>

          {/* wrong-answer feedback */}
          {checked && firstWrongIdx >= 0 && (
            <Shadowed offset={2}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FEE2E2', borderWidth: 2, borderColor: C, paddingVertical: 5, paddingHorizontal: 7 }}>
                <View style={{ backgroundColor: '#EF4444', paddingHorizontal: 4 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: '#fff' }}>✕</Text>
                </View>
                <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 9.5, color: C, lineHeight: 13 }}>
                  <Text style={{ fontFamily: fonts.heading }}>#{firstWrongIdx + 1}</Text> — 여기는 <Text style={{ fontFamily: fonts.heading }}>{dots[firstWrongIdx]?.label}</Text>이에요!
                </Text>
              </View>
            </Shadowed>
          )}

          {!!c.note && (
            <View style={{ backgroundColor: colors.cream, borderWidth: 1.5, borderColor: '#2A252255', borderStyle: 'dashed', paddingVertical: 5, paddingHorizontal: 7 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 9.5, color: colors.textSoft, lineHeight: 14 }}><Text style={{ fontFamily: fonts.heading, color: C }}>Tip. </Text>{c.note}</Text>
            </View>
          )}
        </View>
      </View>

      {checked && <ResultBanner correct={allCorrect} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}

// PatientBody — full-body chibi patient sprite, ported 1:1 from the handoff
// PatientFrontPixel (24×72 viewBox; landmark y-bands align the labeling dots).
function PatientBody() {
  const INK = '#3A2E26', skin = '#F8D7B2', skinSh = '#E0A876', hair = '#5C3A1A', hairLt = '#7A5230';
  const gown = '#FED7AA', gownDk = '#C99066', gownHi = '#FFE4BD', cross = '#EF4444', idBand = '#3B82F6';
  const sw = 0.6;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 24 72" preserveAspectRatio="xMidYMid meet">
      <Ellipse cx={12} cy={71.2} rx={8} ry={0.6} fill={INK} opacity={0.18} />
      {/* hair back */}
      <Path d="M5 9 Q4 1 12 0.5 Q20 1 19 9 Q19 4 12 3 Q5 4 5 9 Z" fill={hair} />
      {/* hips / groin */}
      <Path d="M6 38 Q6 42 8 44 L16 44 Q18 42 18 38 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <Rect x={16.4} y={39} width={1.2} height={4.5} rx={0.6} fill={skinSh} opacity={0.5} />
      {/* thighs */}
      <Path d="M7 43 Q7 49 8 54 L11 54 Q11 49 11 43 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M13 43 Q13 49 13 54 L16 54 Q17 49 17 43 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <Rect x={9.6} y={44} width={1.2} height={10} rx={0.6} fill={skinSh} opacity={0.5} />
      <Rect x={15} y={44} width={1.2} height={10} rx={0.6} fill={skinSh} opacity={0.5} />
      {/* knees */}
      <Ellipse cx={9.3} cy={55} rx={2} ry={1.4} fill={skinSh} />
      <Ellipse cx={14.7} cy={55} rx={2} ry={1.4} fill={skinSh} />
      {/* calves */}
      <Path d="M8 56 Q7.5 61 8.5 66 L10.8 66 Q11 61 10.8 56 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M13.2 56 Q13 61 13.2 66 L15.5 66 Q16.5 61 16 56 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      {/* ankles + feet */}
      <Path d="M8.4 66 L10.6 66 L11 70 Q9.4 71 7.6 70 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M13.4 66 L15.6 66 L16.4 70 Q14.6 71 13 70 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      {/* upper-arm sleeves */}
      <Path d="M3.5 14 Q2 17 2.5 20 L5 20 Q5 16 5.5 14 Z" fill={gown} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M20.5 14 Q22 17 21.5 20 L19 20 Q19 16 18.5 14 Z" fill={gown} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      {/* forearms */}
      <Path d="M2.5 20 Q2.3 24 3 28 L5 28 Q5.2 24 5 20 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M21.5 20 Q21.7 24 21 28 L19 28 Q18.8 24 19 20 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      {/* hands */}
      <Ellipse cx={4} cy={29.5} rx={1.7} ry={1.8} fill={skin} stroke={INK} strokeWidth={sw} />
      <Ellipse cx={20} cy={29.5} rx={1.7} ry={1.8} fill={skin} stroke={INK} strokeWidth={sw} />
      {/* ID band on right wrist */}
      <Rect x={18.6} y={27} width={2.8} height={1.4} rx={0.5} fill={idBand} stroke={INK} strokeWidth={0.3} />
      {/* torso (gown) */}
      <Path d="M5 13 Q4 13 4 14.5 L5 37.5 Q5 38.5 6 38.5 L18 38.5 Q19 38.5 19 37.5 L20 14.5 Q20 13 19 13 Z" fill={gown} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M4.5 13.5 Q12 11 19.5 13.5 L19 15 Q12 12.8 5 15 Z" fill={gownHi} />
      <Rect x={5} y={15} width={1.4} height={22} rx={0.7} fill={gownHi} opacity={0.7} />
      <Rect x={17.6} y={15} width={1.4} height={22} rx={0.7} fill={gownDk} opacity={0.6} />
      <Path d="M10 13 L12 16 L14 13 Z" fill={skin} />
      {/* red cross (abdomen marker) */}
      <Rect x={10.2} y={22} width={3.6} height={1.4} rx={0.4} fill={cross} />
      <Rect x={11.3} y={20.9} width={1.4} height={3.6} rx={0.4} fill={cross} />
      {/* neck */}
      <Path d="M10 9.5 L10 12.5 Q12 13.5 14 12.5 L14 9.5 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M10 11.8 Q12 12.8 14 11.8" fill="none" stroke={skinSh} strokeWidth={0.5} />
      {/* head */}
      <Ellipse cx={12} cy={6} rx={6} ry={6} fill={skin} stroke={INK} strokeWidth={sw} />
      <Path d="M14 1.5 Q18 6 14 10.5 Q16.5 6 14 1.5 Z" fill={skinSh} opacity={0.35} />
      {/* hair front */}
      <Path d="M6 7 Q6 0.5 12 0.5 Q18 0.5 18 7 Q16.5 3.5 12.5 3.2 Q13.2 4.5 11.5 4.8 Q9.5 3.2 9 4.6 Q7.5 3.6 6 7 Z" fill={hair} />
      <Path d="M8 3.2 Q12 1 16 3.4" fill="none" stroke={hairLt} strokeWidth={0.7} strokeLinecap="round" />
      <Path d="M6 6 Q5 9 6.5 11 L7.5 10.5 Q6.5 8 7 6 Z" fill={hair} />
      <Path d="M18 6 Q19 9 17.5 11 L16.5 10.5 Q17.5 8 17 6 Z" fill={hair} />
      {/* eyes */}
      <Circle cx={9.8} cy={6.4} r={0.9} fill={INK} />
      <Circle cx={14.2} cy={6.4} r={0.9} fill={INK} />
      {/* blush */}
      <Ellipse cx={8.3} cy={8} rx={1.2} ry={0.8} fill="#F9A8B4" opacity={0.5} />
      <Ellipse cx={15.7} cy={8} rx={1.2} ry={0.8} fill="#F9A8B4" opacity={0.5} />
      {/* mouth */}
      <Path d="M10.6 8.7 Q11.5 8.3 12 8.7 Q12.5 9.1 13.4 8.7" fill="none" stroke={INK} strokeWidth={0.6} strokeLinecap="round" />
    </Svg>
  );
}
