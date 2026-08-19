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
import { api } from '@/api/client';
import { PixelButton } from '@/components/PixelButton';
import { MatchQuiz } from '@/components/quiz/MatchQuiz';
import { ListenQuiz } from '@/components/quiz/ListenQuiz';
import { SbarQuiz } from '@/components/quiz/SbarQuiz';
import { McqQuiz } from '@/components/quiz/McqQuiz';
import { CheckQuiz } from '@/components/quiz/CheckQuiz';
import { MonitorQuiz } from '@/components/quiz/MonitorQuiz';
import { CalcQuiz } from '@/components/quiz/CalcQuiz';
import { SortQuiz } from '@/components/quiz/SortQuiz';
import { GaugeQuiz } from '@/components/quiz/GaugeQuiz';
import { SpotErrorQuiz } from '@/components/quiz/SpotErrorQuiz';
import { TriageQuiz } from '@/components/quiz/TriageQuiz';
import { AbbrQuiz } from '@/components/quiz/AbbrQuiz';
import { AnatomyQuiz } from '@/components/quiz/AnatomyQuiz';
import { DialogueOrderQuiz } from '@/components/quiz/DialogueOrderQuiz';
import { PixelIcon } from '@/components/PixelIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { t, useLocale } from '@/i18n';

const C = colors.ink;

export default function QuizRoute() {
  const { id, scenario, q, i } = useLocalSearchParams<{ id: string; scenario?: string; q?: string; i?: string }>();
  const router = useRouter();
  const { quiz, state } = useQuizData(id);

  // Multi-quiz sequence: `q` is the full ordered quizId queue for the scenario
  // (comma-joined) and `i` the current 0-based index. Kept in the URL so the
  // sequence is stateless across router.replace hops.
  const queue = q ? q.split(',').filter(Boolean) : [];
  const idx = i ? parseInt(i, 10) || 0 : 0;
  const progress = queue.length > 1 ? { cur: idx + 1, total: queue.length } : undefined;

  if (state !== 'ok' || !quiz?.content) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
        {state === 'loading' ? (
          <ActivityIndicator color={colors.mint} />
        ) : (
          <>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: '#fff' }}>퀴즈를 불러오지 못했습니다</Text>
            <PixelButton label={t('common.back')} onPress={() => router.back()} />
          </>
        )}
      </View>
    );
  }

  // On clear: advance to the next quiz in the sequence; when the whole sequence is
  // done, RETURN TO THE DIALOGUE (a dialogue side-quiz) — or, for a STANDALONE quiz
  // (e.g. a curriculum step, no parent dialogue), record the clear so curriculum
  // progress advances, then return.
  const onComplete = async () => {
    if (idx + 1 < queue.length) {
      const sp = new URLSearchParams();
      if (scenario) sp.set('scenario', scenario);
      sp.set('q', queue.join(','));
      sp.set('i', String(idx + 1));
      router.replace(`/quiz/${queue[idx + 1]}?${sp.toString()}`);
      return;
    }
    if (!scenario) {
      // standalone quiz → mark it cleared (curriculum steps key on cleared attempts)
      try { await api.recordAttempt(id, 20); } catch { /* offline: skip */ }
    }
    router.back();
  };
  const onExit = () => router.back();
  const props = { quiz, onExit, onComplete, progress };
  switch (quiz.type) {
    case 'match_pairs': case 'match': return <MatchQuiz {...props} />;
    case 'listen': return <ListenQuiz {...props} />;
    case 'sbar': case 'order': return <SbarQuiz {...props} />;
    case 'mcq': return <McqQuiz {...props} />;
    case 'check': return <CheckQuiz {...props} />;
    case 'monitor': return <MonitorQuiz {...props} />;
    case 'calc': return <CalcQuiz {...props} />;
    case 'sort': return <SortQuiz {...props} />;
    case 'gauge': return <GaugeQuiz {...props} />;
    case 'spot_error': return <SpotErrorQuiz {...props} />;
    case 'triage': return <TriageQuiz {...props} />;
    case 'abbr': return <AbbrQuiz {...props} />;
    case 'anatomy': return <AnatomyQuiz {...props} />;
    case 'dialogue_order': return <DialogueOrderQuiz {...props} />;
    default: return <SentenceQuiz quiz={quiz} onExit={onExit} onComplete={onComplete} progress={progress} />;
  }
}

// ── sentence-build quiz ───────────────────────────────────────────────
function SentenceQuiz({ quiz, onExit, onComplete, progress }: { quiz: NonNullable<ReturnType<typeof useQuizData>['quiz']>; onExit: () => void; onComplete: () => void; progress?: { cur: number; total: number } }) {
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
  // Guard on blankCount so a mis-routed payload with no template (e.g. a `match`
  // quiz) can't auto-pass on an empty slot list (`[].every` is vacuously true).
  const allFilled = blankCount > 0 && slots.every((s) => s !== null);
  const correctness = slots.map((s, b) => s !== null && tiles[s]?.word === answers[b]);
  const allCorrect = checked && blankCount > 0 && correctness.every(Boolean);

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
        <PixelButton label={t('quiz.exit')} bg="#fff" shadowColor={C} offset={2} onPress={onExit} style={{ paddingVertical: 4, paddingHorizontal: 10 }} />
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
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C }}>{c.zone || 'QUIZ'} · {quiz.title}</Text>
            </View>
          </Shadowed>
        </View>
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
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>정형 학습</Text>
                </View>
              </Shadowed>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>{quiz.title}</Text>
                {!!c.sub && <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 3 }}>{c.sub}</Text>}
              </View>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
              {/* context */}
              {!!c.context && (
                <View style={{ backgroundColor: colors.paper, borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 14, position: 'relative' }}>
                  <View style={{ position: 'absolute', top: -6, left: 12, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, paddingHorizontal: 4 }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C }}>CONTEXT</Text>
                  </View>
                  <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.text, lineHeight: 16 }}>{c.context}</Text>
                </View>
              )}

              {/* sentence with slots */}
              <Shadowed offset={3}>
                <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 14, paddingHorizontal: 12 }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', rowGap: 8 }}>
                    {segments.map((seg, si) => (
                      <View key={si} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                        {seg.split(' ').filter(Boolean).map((word, wi) => (
                          <Text key={wi} style={{ fontFamily: fonts.body, fontSize: fs(14), color: C, lineHeight: 30 }}> {word} </Text>
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
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft, marginBottom: 6 }}>━ 단어 카드 ━━━━━━━━</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {tiles.map((tile, ti) => (
                    <WordTile key={ti} word={tile.word} used={usedTiles.has(ti)} onPress={() => placeTile(ti)} />
                  ))}
                </View>
              </View>

              {/* hint */}
              {!!c.hint && (
                <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 18, height: 18, backgroundColor: colors.yellow, borderWidth: 1.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                    <PixelIcon name="bulb" color={C} size={12} sw={1.8} />
                  </View>
                  <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, lineHeight: 15 }}>{c.hint}</Text>
                </View>
              )}

              {/* result banner */}
              {checked && (
                <View style={{ marginTop: 16, backgroundColor: allCorrect ? colors.mint : '#FEE2E2', borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 12 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>
                    {allCorrect ? t('quiz.correct') : t('quiz.wrong')}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* footer */}
            <View style={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, borderTopWidth: 3, borderTopColor: '#2A252244', borderStyle: 'dotted', backgroundColor: colors.paper, flexDirection: 'row', gap: 8 }}>
              <PixelButton label={t('quiz.skip')} bg="#fff" shadowColor={C} onPress={onExit} style={{ flex: 1 }} />
              <View style={{ flex: 2 }}>
                {allCorrect ? (
                  <PixelButton label={t('quiz.finish')} bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full />
                ) : checked ? (
                  <PixelButton label={t('quiz.retry')} bg={colors.mint} shadowColor={colors.mintShadow} onPress={() => { setChecked(false); setSlots(Array(blankCount).fill(null)); }} full />
                ) : (
                  <PixelButton label={t('quiz.submit')} bg={colors.mint} shadowColor={colors.mintShadow} disabled={!allFilled} onPress={() => setChecked(true)} full />
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
      <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: word ? C : colors.yellowShadow }}>
        {word ?? '?'}{checked && word && (correct ? ' ✓' : ' ✗')}
      </Text>
    </Pressable>
  );
}

function WordTile({ word, used, onPress }: { word: string; used: boolean; onPress: () => void }) {
  if (used) {
    return (
      <View style={{ paddingVertical: 8, paddingHorizontal: 14, borderWidth: 3, borderColor: C, backgroundColor: '#2A252222' }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: colors.textFaint, textDecorationLine: 'line-through' }}>{word}</Text>
      </View>
    );
  }
  return (
    <Shadowed offset={3}>
      <Pressable onPress={onPress} style={{ paddingVertical: 8, paddingHorizontal: 14, borderWidth: 3, borderColor: C, backgroundColor: '#fff' }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>{word}</Text>
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
