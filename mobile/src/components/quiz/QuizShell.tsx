// Shared quiz chrome (1:1 with the v16 handoff QuizCard): dark backdrop, a top
// exit/zone bar, and a cream card with corner staples, a "정형 학습" header
// (title + sub), a scrollable body, and a footer. Each quiz type supplies its
// own body + footer. Also exports Shadowed (offset pixel shadow) for reuse.
import { ScrollView, Text, View, type ViewStyle } from 'react-native';
import { Stack } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';

import { FIcon } from '@/components/FIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { useEffect } from 'react';
import { playSfx } from '@/lib/sfx';
import { t, useT } from '@/i18n';

export const C = colors.ink;

export function Shadowed({ children, offset = 4, shadowColor = C, style }: { children: React.ReactNode; offset?: number; shadowColor?: string; style?: ViewStyle }) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}

function CornerStaples() {
  const S = { position: 'absolute' as const, width: 6, height: 6, backgroundColor: C };
  return (
    <>
      <View style={[S, { left: 6, top: 6 }]} />
      <View style={[S, { right: 6, top: 6 }]} />
      <View style={[S, { left: 6, bottom: 6 }]} />
      <View style={[S, { right: 6, bottom: 6 }]} />
    </>
  );
}

// A multi-quiz sequence (scenario with several quiz steps) shows "N/M" so the
// learner knows how many mini-quizzes remain before the scenario result.
export type QuizProgress = { cur: number; total: number };

export function QuizShell({ title, sub, zone, onExit, progress, children, footer }: {
  title: string; sub?: string; zone?: string; onExit: () => void; progress?: QuizProgress; children: React.ReactNode; footer: React.ReactNode;
}) {
  const t = useT();
  return (
    <View style={{ flex: 1, backgroundColor: '#1F2937' }}>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

      {/* top exit / zone */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
        <PixelButton label={t('quiz.exit')} bg="#fff" shadowColor={C} offset={2} sfx={false} onPress={() => { playSfx('back'); onExit(); }} style={{ paddingVertical: 4, paddingHorizontal: 10 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {!!progress && progress.total > 1 && (
            <Shadowed offset={2} shadowColor={colors.mintShadow}>
              <View style={{ backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 4, paddingHorizontal: 8 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C }}>{progress.cur}/{progress.total}</Text>
              </View>
            </Shadowed>
          )}
          <Shadowed offset={2}>
            <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 4, paddingHorizontal: 8 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C }}>{zone || 'QUIZ'} · {title}</Text>
            </View>
          </Shadowed>
        </View>
      </View>

      {/* card */}
      <View style={{ position: 'absolute', left: 14, right: 14, top: 100, bottom: 22, zIndex: 6 }}>
        <Shadowed offset={6} style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: colors.cream, borderWidth: 4, borderColor: C }}>
            <CornerStaples />
            <View style={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 3, borderBottomColor: '#2A252244', borderStyle: 'dotted', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Shadowed offset={2} shadowColor={colors.peachShadow}>
                <View style={{ backgroundColor: colors.peach, borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>정형 학습</Text>
                </View>
              </Shadowed>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {!!zone && (
                    <View style={{ backgroundColor: C, paddingVertical: 1, paddingHorizontal: 5 }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: '#fff' }}>{zone}</Text>
                    </View>
                  )}
                  <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: fs(13), color: C }}>{title}</Text>
                </View>
                {!!sub && <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 3 }}>{sub}</Text>}
              </View>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>{children}</ScrollView>

            <View style={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, borderTopWidth: 3, borderTopColor: '#2A252244', borderStyle: 'dotted', backgroundColor: colors.paper, flexDirection: 'row', gap: 8 }}>
              {footer}
            </View>
          </View>
        </Shadowed>
      </View>
    </View>
  );
}

/** Shared CONTEXT + hint blocks used by several quiz bodies. */
export function ContextBox({ text }: { text: string }) {
  return (
    <View style={{ backgroundColor: colors.paper, borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 14, position: 'relative' }}>
      <View style={{ position: 'absolute', top: -6, left: 12, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, paddingHorizontal: 4 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C }}>CONTEXT</Text>
      </View>
      <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.text, lineHeight: 16 }}>{text}</Text>
    </View>
  );
}

export function HintRow({ text }: { text: string }) {
  return (
    <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 18, height: 18, backgroundColor: colors.yellow, borderWidth: 1.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
        <FIcon name="hint" size={12} />
      </View>
      <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, lineHeight: 15 }}>{text}</Text>
    </View>
  );
}

export function ResultBanner({ correct }: { correct: boolean }) {
  const t = useT();
  // The verdict sound lives here rather than in each quiz's submit handler: this
  // banner is exactly the moment a submit-style quiz reveals its answer, so the
  // 10 quizzes that render it get audio feedback from one place. Keyed on
  // `correct` so a retry that flips the verdict re-sounds.
  useEffect(() => {
    playSfx(correct ? 'confirm' : 'wrong');
  }, [correct]);

  return (
    <View style={{ marginTop: 16, backgroundColor: correct ? colors.mint : '#FEE2E2', borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 12 }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>{correct ? t('quiz.correct') : t('quiz.wrong')}</Text>
    </View>
  );
}
