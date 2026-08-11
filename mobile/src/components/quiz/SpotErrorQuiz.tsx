// spot_error quiz — find the one wrong row in an order sheet. 1:1 with the v17
// handoff SPOT ERROR format. Tap the row you think is wrong; correct if it's the
// row flagged error; a "정답" note explains why.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';

export function SpotErrorQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const rows = c.rows ?? [];
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = checked && picked !== null && !!rows[picked]?.error;

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && correct
          ? <View style={{ flex: 1 }}><PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : <View style={{ flex: 1 }}><PixelButton label={checked ? '↻ 다시' : '✓ 답 확인'} bg={colors.mint} shadowColor={colors.mintShadow} disabled={picked === null} onPress={() => (checked ? (setChecked(false), setPicked(null)) : setChecked(true))} full /></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      <Shadowed offset={3}>
        <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingHorizontal: 4, paddingVertical: 2 }}>
          {rows.map((r, i) => {
            const isPicked = picked === i;
            const showErr = checked && r.error;
            const showWrongPick = checked && isPicked && !r.error;
            const bg = showErr ? '#FEE2E2' : showWrongPick ? colors.yellow : isPicked ? colors.yellow : 'transparent';
            return (
              <Pressable key={i} onPress={() => !checked && setPicked(i)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 8, backgroundColor: bg, borderBottomWidth: i < rows.length - 1 ? 1.5 : 0, borderBottomColor: '#2A252233', borderStyle: 'dotted' }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft }}>{r.label}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 12.5, color: C, textAlign: 'right' }}>{r.text}</Text>
                  {showErr && <View style={{ backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: C, paddingHorizontal: 5 }}><Text style={{ fontFamily: fonts.heading, fontSize: 9, color: '#fff' }}>✕</Text></View>}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Shadowed>

      <Text style={{ fontFamily: fonts.body, fontSize: 11, color: '#fff', textAlign: 'center', marginTop: 10 }}>위 항목 중 <Text style={{ fontFamily: fonts.heading }}>잘못된 하나</Text>를 찾으세요.</Text>

      {checked && !!c.note && (
        <Shadowed offset={2} shadowColor={colors.mintShadow} style={{ marginTop: 10 }}>
          <View style={{ backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 6, paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: fonts.body, fontSize: 10.5, color: C, lineHeight: 15 }}><Text style={{ fontFamily: fonts.heading }}>정답 </Text>{c.note}</Text>
          </View>
        </Shadowed>
      )}
    </QuizShell>
  );
}
