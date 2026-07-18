// Mini quiz — sentence completion. 1:1 port of the v16 handoff
// `screens-quiz.jsx` ScreenQuizSentence: cream card (staples), CONTEXT box,
// a sentence with fill-in slots, a word bank of tiles, a mini hint, and a
// submit footer. Driven by server quiz content (api.quiz): template split on
// `__` → slots; tap a tile to fill the next slot, tap a filled slot to clear;
// submit checks each slot against answers[]. Other quiz types are follow-ups.
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View, type ViewStyle } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQuizData } from '@/hooks/useQuizData';
import { PixelButton } from '@/components/PixelButton';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;

export default function QuizRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { quiz, state } = useQuizData(id);

  if (state !== 'ok' || !quiz?.content) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
        {state === 'loading' ? (
          <ActivityIndicator color={colors.mint} />
        ) : (
          <>
            <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: '#fff' }}>퀴즈를 불러오지 못했습니다</Text>
            <PixelButton label="‹ 돌아가기" onPress={() => router.back()} />
          </>
        )}
      </View>
    );
  }

  return <SentenceQuiz quiz={quiz} onExit={() => router.back()} />;
}

// ── sentence-build quiz ───────────────────────────────────────────────
function SentenceQuiz({ quiz, onExit }: { quiz: NonNullable<ReturnType<typeof useQuizData>['quiz']>; onExit: () => void }) {
  const c = quiz.content!;
  const answers = c.answers ?? [];
  // Split the template into text segments; N answers → N slots between them.
  const segments = useMemo(() => (c.template ?? '').split('__'), [c.template]);
  const blankCount = Math.max(0, segments.length - 1);

  // Word tiles (stable shuffled order); track use by tile index (dupes-safe).
  const tiles = useMemo(() => shuffle((c.wordBank ?? []).map((word, i) => ({ word, i }))), [c.wordBank]);
  const [slots, setSlots] = useState<(number | null)[]>(() => Array(blankCount).fill(null)); // tile index per blank
  const [checked, setChecked] = useState(false);

  const usedTiles = new Set(slots.filter((s): s is number => s !== null));
  const allFilled = slots.every((s) => s !== null);
  const correctness = slots.map((s, b) => s !== null && tiles[s]?.word === answers[b]);
  const allCorrect = checked && correctness.every(Boolean);

  const placeTile = (tileIdx: number) => {
    if (checked || usedTiles.has(tileIdx)) return;
    const next = slots.indexOf(null);
    if (next === -1) return;
    const s = [...slots]; s[next] = tileIdx; setSlots(s);
  };
  const clearSlot = (b: number) => {
    if (checked) return;
    const s = [...slots]; s[b] = null; setSlots(s);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1F2937' }}>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

      {/* top exit / zone */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
        <PixelButton label="× 나가기" bg="#fff" shadowColor={C} offset={2} onPress={onExit} style={{ paddingVertical: 4, paddingHorizontal: 10 }} />
        <Shadowed offset={2}>
          <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 4, paddingHorizontal: 8 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C }}>{c.zone || 'QUIZ'} · {quiz.title}</Text>
          </View>
        </Shadowed>
      </View>

      {/* quiz card */}
      <View style={{ position: 'absolute', left: 14, right: 14, top: 100, bottom: 22, zIndex: 6 }}>
        <Shadowed offset={6} style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: colors.cream, borderWidth: 4, borderColor: C }}>
            <CornerStaples />

            {/* header */}
            <View style={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 3, borderBottomColor: '#2A252244', borderStyle: 'dotted', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Shadowed offset={2} shadowColor={colors.peachShadow}>
                <View style={{ backgroundColor: colors.peach, borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>📚 정형 학습</Text>
                </View>
              </Shadowed>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>{quiz.title}</Text>
                {!!c.sub && <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, marginTop: 3 }}>{c.sub}</Text>}
              </View>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
              {/* context */}
              {!!c.context && (
                <View style={{ backgroundColor: colors.paper, borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 14, position: 'relative' }}>
                  <View style={{ position: 'absolute', top: -6, left: 12, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, paddingHorizontal: 4 }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: C }}>CONTEXT</Text>
                  </View>
                  <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.text, lineHeight: 16 }}>{c.context}</Text>
                </View>
              )}

              {/* sentence with slots */}
              <Shadowed offset={3}>
                <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 14, paddingHorizontal: 12 }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', rowGap: 8 }}>
                    {segments.map((seg, si) => (
                      <View key={si} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                        {seg.split(' ').filter(Boolean).map((word, wi) => (
                          <Text key={wi} style={{ fontFamily: fonts.body, fontSize: 14, color: C, lineHeight: 30 }}> {word} </Text>
                        ))}
                        {si < blankCount && (
                          <Slot
                            word={slots[si] !== null ? tiles[slots[si]!].word : null}
                            checked={checked}
                            correct={correctness[si]}
                            active={!checked && slots.indexOf(null) === si}
                            onPress={() => clearSlot(si)}
                          />
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </Shadowed>

              {/* word bank */}
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft, marginBottom: 6 }}>━ 단어 카드 ━━━━━━━━</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {tiles.map((tile) => (
                    <WordTile key={tile.i} word={tile.word} used={usedTiles.has(tile.i)} onPress={() => placeTile(tile.i)} />
                  ))}
                </View>
              </View>

              {/* hint */}
              {!!c.hint && (
                <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 18, height: 18, backgroundColor: colors.yellow, borderWidth: 1.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 11 }}>💡</Text>
                  </View>
                  <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, lineHeight: 15 }}>{c.hint}</Text>
                </View>
              )}

              {/* result banner */}
              {checked && (
                <View style={{ marginTop: 16, backgroundColor: allCorrect ? colors.mint : '#FEE2E2', borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 12 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>
                    {allCorrect ? '✓ 정답입니다!' : '✗ 다시 시도해 보세요'}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* footer */}
            <View style={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, borderTopWidth: 3, borderTopColor: '#2A252244', borderStyle: 'dotted', backgroundColor: colors.paper, flexDirection: 'row', gap: 8 }}>
              {checked && !allCorrect ? (
                <View style={{ flex: 1 }}>
                  <PixelButton label="↻ 다시 풀기" bg="#fff" shadowColor={C} onPress={() => { setChecked(false); setSlots(Array(blankCount).fill(null)); }} full />
                </View>
              ) : (
                <PixelButton label="건너뛰기" bg="#fff" shadowColor={C} onPress={onExit} style={{ flex: 1 }} />
              )}
              <View style={{ flex: 2 }}>
                {allCorrect ? (
                  <PixelButton label="✓ 완료" bg={colors.mint} shadowColor={colors.mintShadow} onPress={onExit} full />
                ) : (
                  <PixelButton label="✓ 제출하기" bg={colors.mint} shadowColor={colors.mintShadow} disabled={!allFilled || checked} onPress={() => setChecked(true)} full />
                )}
              </View>
            </View>
          </View>
        </Shadowed>
      </View>
    </View>
  );
}

// ── pieces ────────────────────────────────────────────────────────────
function Slot({ word, checked, correct, active, onPress }: { word: string | null; checked: boolean; correct: boolean; active: boolean; onPress: () => void }) {
  const bg = word ? (checked ? (correct ? colors.mint : '#FEE2E2') : colors.mint) : colors.yellow + '33';
  const border = active ? colors.yellowShadow : C;
  return (
    <Pressable onPress={onPress} style={{ marginHorizontal: 3, minWidth: 54, paddingVertical: 4, paddingHorizontal: 10, borderWidth: 2.5, borderColor: border, borderStyle: word ? 'solid' : 'dashed', backgroundColor: bg, alignItems: 'center' }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: word ? C : colors.yellowShadow }}>
        {word ?? '?'}{checked && word && (correct ? ' ✓' : ' ✗')}
      </Text>
    </Pressable>
  );
}

function WordTile({ word, used, onPress }: { word: string; used: boolean; onPress: () => void }) {
  if (used) {
    return (
      <View style={{ paddingVertical: 8, paddingHorizontal: 14, borderWidth: 3, borderColor: C, backgroundColor: '#2A252222' }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: colors.textFaint, textDecorationLine: 'line-through' }}>{word}</Text>
      </View>
    );
  }
  return (
    <Shadowed offset={3}>
      <Pressable onPress={onPress} style={{ paddingVertical: 8, paddingHorizontal: 14, borderWidth: 3, borderColor: C, backgroundColor: '#fff' }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>{word}</Text>
      </Pressable>
    </Shadowed>
  );
}

function Shadowed({ children, offset = 4, shadowColor = C, style }: { children: React.ReactNode; offset?: number; shadowColor?: string; style?: ViewStyle }) {
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

// Fisher–Yates (module scope; runtime Math.random is fine in the app).
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
