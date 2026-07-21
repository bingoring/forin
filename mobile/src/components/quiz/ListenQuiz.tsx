// listen quiz — verbal-order dictation (v17 handoff design). A dark audio card
// with a pixel speaker + waveform (played=cyan / unplayed=slate + yellow playhead),
// clip duration, 0.7×/1.0× speed toggles, and a 📝 자막 subtitle reveal. A 🔊 play
// button speaks the order via on-device TTS (expo-speech); the learner picks the
// exact read-back from similar-sounding choices. An abbreviation glossary sits below.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import * as Speech from 'expo-speech';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

const WAVE = [6, 12, 18, 10, 22, 14, 8, 16, 28, 18, 24, 12, 8, 14, 20, 30, 22, 16, 8, 12, 18, 26, 14, 8, 10, 16, 22, 28, 18, 12, 8, 14, 20, 16, 10, 18, 24, 12, 8, 14, 20, 16, 10, 6, 12, 18, 8, 14, 20, 10];

export function ListenQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const choices = c.choices ?? [];
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [subtitle, setSubtitle] = useState(false);
  const [replays, setReplays] = useState(0);
  const correct = checked && picked !== null && !!choices[picked]?.correct;

  const play = (rate = speed) => { Speech.stop(); Speech.speak(c.audioText ?? '', { language: 'en-US', rate }); setReplays((r) => r + 1); };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && correct
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : (
            <>
              <PixelButton label={`🔊 한 번 더 듣기 (${Math.min(replays, 3)}/3)`} bg="#fff" shadowColor={C} fontSize={11} onPress={() => play()} style={{ flex: 1 }} />
              <View style={{ flex: 2 }}>
                <PixelButton label={checked ? '↻ 다시' : '✓ 복창하기 (Read back)'} bg={colors.mint} shadowColor={colors.mintShadow} fontSize={12} disabled={picked === null} onPress={() => (checked ? (setChecked(false), setPicked(null)) : setChecked(true))} full />
              </View>
            </>
          )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* audio card */}
      <Shadowed offset={3}>
        <View style={{ backgroundColor: '#0F1A24', borderWidth: 3, borderColor: C, padding: 10, paddingTop: 14 }}>
          <View style={{ position: 'absolute', top: -8, left: 8, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, paddingHorizontal: 5 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: C }}>AUDIO · {c.duration || '0:08'}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* speaker */}
            <Pressable onPress={() => play()}>
              <Shadowed offset={2} shadowColor={colors.mintShadow}>
                <View style={{ width: 44, height: 44, backgroundColor: colors.mint, borderWidth: 2.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={22} height={22} viewBox="0 0 22 22">
                    <Rect x={4} y={8} width={3} height={6} fill={C} />
                    <Rect x={7} y={6} width={2} height={10} fill={C} />
                    <Rect x={9} y={4} width={2} height={14} fill={C} />
                    <Rect x={13} y={7} width={1} height={2} fill={C} />
                    <Rect x={14} y={6} width={1} height={4} fill={C} />
                    <Rect x={13} y={13} width={1} height={2} fill={C} />
                    <Rect x={14} y={12} width={1} height={4} fill={C} />
                    <Rect x={16} y={9} width={1} height={4} fill={C} />
                    <Rect x={17} y={8} width={1} height={6} fill={C} />
                  </Svg>
                </View>
              </Shadowed>
            </Pressable>
            {/* waveform */}
            <View style={{ flex: 1 }}>
              <Svg width="100%" height={40} viewBox="0 0 200 40" preserveAspectRatio="none">
                {WAVE.map((h, i) => (
                  <Rect key={i} x={i * 4} y={20 - h / 2} width={3} height={h} fill={i < 26 ? '#22D3EE' : '#475569'} />
                ))}
                <Rect x={103} y={0} width={2} height={40} fill="#FEF08A" />
              </Svg>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: '#94A3B8' }}>0:00</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: '#FEF08A' }}>0:05</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: '#94A3B8' }}>{c.duration || '0:08'}</Text>
              </View>
            </View>
          </View>
          {/* speed + subtitle */}
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 12, alignItems: 'center' }}>
            <SpeedBtn label="0.7×" active={speed === 0.7} onPress={() => { setSpeed(0.7); play(0.7); }} />
            <SpeedBtn label="1.0×" active={speed === 1.0} onPress={() => { setSpeed(1.0); play(1.0); }} />
            <View style={{ flex: 1 }} />
            <SpeedBtn label="📝 자막" active={subtitle} onPress={() => setSubtitle((s) => !s)} />
          </View>
          {/* subtitle reveal */}
          {subtitle && !!c.audioText && (
            <View style={{ marginTop: 10, backgroundColor: '#1E2A38', borderWidth: 1.5, borderColor: '#475569', paddingVertical: 6, paddingHorizontal: 8 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: '#E2E8F0', lineHeight: 16 }}>"{c.audioText}"</Text>
            </View>
          )}
        </View>
      </Shadowed>

      {/* instruction */}
      <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.text, textAlign: 'center', marginTop: 12, marginBottom: 8 }}>
        닥터가 뭐라고 말했나요? <Text style={{ fontFamily: fonts.heading }}>가장 정확한 것</Text>을 고르세요.
      </Text>

      {/* choices */}
      <View style={{ gap: 6 }}>
        {choices.map((ch, i) => {
          const isPicked = picked === i;
          const showRight = checked && ch.correct;
          const showWrong = checked && isPicked && !ch.correct;
          const bg = showRight ? colors.mint : showWrong ? '#FEE2E2' : isPicked ? colors.yellow : '#fff';
          return (
            <Shadowed key={i} offset={isPicked ? 3 : 2} shadowColor={isPicked ? colors.yellowShadow : C}>
              <Pressable onPress={() => !checked && setPicked(i)} style={{ backgroundColor: bg, borderWidth: 2.5, borderColor: isPicked ? colors.yellowShadow : C, flexDirection: 'row' }}>
                <View style={{ width: 30, backgroundColor: isPicked || showRight ? colors.yellow : colors.peach, borderRightWidth: 2.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: C }}>{String.fromCharCode(65 + i)}</Text>
                </View>
                <View style={{ flex: 1, paddingVertical: 7, paddingHorizontal: 9 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C, lineHeight: 17 }}>"{ch.text}"{showRight ? ' ✓' : showWrong ? ' ✗' : ''}</Text>
                  {!!ch.tags?.length && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
                      {ch.tags.map((t, ti) => (
                        <View key={ti} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C + '55', paddingHorizontal: 4, paddingVertical: 1 }}>
                          <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: C }}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </Pressable>
            </Shadowed>
          );
        })}
      </View>

      {/* glossary */}
      {!!c.glossary?.length && (
        <View style={{ marginTop: 10, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: C + '55', borderStyle: 'dashed', paddingVertical: 6, paddingHorizontal: 8, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>약어.  </Text>
          {c.glossary.map((g, i) => (
            <Text key={i} style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, marginRight: 8 }}>
              <Text style={{ fontFamily: fonts.heading, color: C }}>{g.abbr}</Text> {g.meaning}
            </Text>
          ))}
        </View>
      )}

      {checked && <ResultBanner correct={correct} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}

function SpeedBtn({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Shadowed offset={active ? 2 : 1.5} shadowColor={active ? colors.yellowShadow : C}>
      <Pressable onPress={onPress} style={{ backgroundColor: active ? colors.yellow : '#fff', borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>{label}</Text>
      </Pressable>
    </Shadowed>
  );
}
