// 문장 완성 — the default quiz type, and the router for the other fourteen (v30).
//
// Driven by server quiz content (api.quiz): the template is split on `__` → slots; tap a
// word chip to fill the next slot, tap a filled slot to clear it; submit checks each slot
// against answers[].
//
// The screen used to draw its own copy of the quiz chrome — a stapled cream card on a dark
// backdrop, duplicated from QuizShell. It renders QuizShell now, which is why the diff
// here is mostly deletion: one header, one footer, one progress row for all fifteen types.
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQuizData } from '@/hooks/useQuizData';
import { api } from '@/api/client';
import { NbButton, NbPaper, NbSheet, nbText } from '@/components/nb/NbUI';
import { NbIcon } from '@/components/nb/NbIcon';
import { QuizShell, ContextBox, HintRow, ResultBanner } from '@/components/quiz/QuizShell';
import { nb, nbFonts } from '@/theme/nb';
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

import { useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

export default function QuizRoute() {
  const t = useT();
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
      <NbSheet>
        <Stack.Screen options={TASK_SCREEN} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
          {state === 'loading' ? (
            <ActivityIndicator color={nb.ink} />
          ) : (
            <>
              <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('quiz.loadFailed')}</Text>
              <NbButton variant="paper" onPress={() => router.back()}>{t('common.back')}</NbButton>
            </>
          )}
        </View>
      </NbSheet>
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
  const t = useT();
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
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        <>
          <View style={{ flex: 1 }}>
            <NbButton variant="paper" full onPress={onExit}>{t('quiz.skip')}</NbButton>
          </View>
          <View style={{ flex: 2 }}>
            {allCorrect ? (
              <NbButton variant="ink" full icon="check" iconColor={nb.paper} onPress={onComplete}>{t('quiz.finish')}</NbButton>
            ) : checked ? (
              <NbButton variant="ink" full onPress={() => { setChecked(false); setSlots(Array(blankCount).fill(null)); }}>{t('quiz.retry')}</NbButton>
            ) : (
              <NbButton variant="ink" full disabled={!allFilled} onPress={() => setChecked(true)}>{t('quiz.submit')}</NbButton>
            )}
          </View>
        </>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* The sentence, on its own sheet. */}
      <NbPaper rot={-0.5} tape tapeLeft={130} style={{ paddingVertical: 16, paddingHorizontal: 14 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', rowGap: 8 }}>
          {segments.map((seg, si) => (
            <View key={si} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
              {seg.split(' ').filter(Boolean).map((word, wi) => (
                <Text key={wi} style={styles.sentence}> {word} </Text>
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
      </NbPaper>

      {/* The word chips. Written label, because it names what to do rather than what
          this is: 낱말 칩 — 누르면 빈칸에 붙어요. */}
      <View style={{ marginTop: 18 }}>
        <Text style={nbText.hand(15, nb.soft)}>{t('quiz.wordChips')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 8 }}>
          {tiles.map((tile, ti) => (
            <WordTile key={ti} word={tile.word} used={usedTiles.has(ti)} rot={ti % 2 ? 0.8 : -0.8} onPress={() => placeTile(ti)} />
          ))}
        </View>
      </View>

      {!!c.hint && <HintRow text={c.hint} />}
      {checked && <ResultBanner correct={allCorrect} />}
    </QuizShell>
  );
}

// ── pieces ────────────────────────────────────────────────────────────

/**
 * A blank in the sentence.
 *
 * Empty, it is a RULED LINE rather than a box: a blank on paper is something to write on,
 * and a dashed rectangle reads as a control. Filled, the word sits under the highlighter.
 * The verdict is a drawn tick BESIDE it — appending a ✓ to the word put the mark in the
 * type's weight and inside the highlighted run, where it read as part of the answer.
 */
function Slot({ word, checked, correct, active, onPress }: { word: string | null; checked: boolean; correct: boolean; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.slotWrap}>
      <View
        style={[
          styles.slot,
          {
            borderBottomColor: active ? '#C99A1E' : checked ? (correct ? nb.green : nb.red) : 'rgba(62,54,43,.45)',
            backgroundColor: word && !checked ? nb.marker : active ? 'rgba(249,227,123,.35)' : 'transparent',
          },
        ]}
      >
        <Text numberOfLines={1} style={[styles.slotText, { color: word ? nb.ink : nb.placeholder }]}>{word ?? '?'}</Text>
      </View>
      {checked && !!word && (
        <View style={{ marginLeft: 3 }}>
          <NbIcon name={correct ? 'check' : 'cross'} size={13} color={correct ? nb.green : nb.red} />
        </View>
      )}
    </Pressable>
  );
}

/** A word chip. Once used it stays on the page struck through rather than disappearing —
 *  the learner needs to see which words are already in the sentence. */
function WordTile({ word, used, rot, onPress }: { word: string; used: boolean; rot: number; onPress: () => void }) {
  if (used) {
    return (
      <View style={[styles.tileUsed, { transform: [{ rotate: `${rot}deg` }] }]}>
        <Text style={[styles.tileText, { color: nb.placeholder, textDecorationLine: 'line-through' }]}>{word}</Text>
      </View>
    );
  }
  return (
    <Pressable onPress={onPress}>
      <NbPaper rot={rot} style={styles.tile}>
        <Text style={styles.tileText}>{word}</Text>
      </NbPaper>
    </Pressable>
  );
}

const styles = {
  /** The sentence is English to be read, so it is set in the reading face. */
  sentence: { fontFamily: nbFonts.bodyMid, fontSize: 15, color: nb.ink, lineHeight: 32 } as const,
  slotWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 3 } as const,
  slot: { minWidth: 56, paddingHorizontal: 8, paddingBottom: 2, borderBottomWidth: 2, alignItems: 'center' } as const,
  slotText: { fontFamily: nbFonts.hand, fontSize: 18 } as const,
  tile: { paddingVertical: 8, paddingHorizontal: 15 } as const,
  tileUsed: {
    paddingVertical: 8, paddingHorizontal: 15,
    borderWidth: 1.3, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.25)',
  } as const,
  /** Chips are PRINTED: they are the words as they will appear in the sentence, and a
   *  handwriting face at chip size loses the difference between similar words. */
  tileText: { fontFamily: nbFonts.monoBold, fontSize: 14, color: nb.ink } as const,
};

// Fisher–Yates (module scope; runtime Math.random is fine in the app).
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
