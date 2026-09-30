// STEP 3 가이드 대화의 목표 문장 (lesson-four-steps-v44 J, 스펙 §3-4).
//
// The three reply choices are gone: each of the learner's turns asks for ONE Korean
// target sentence, which they produce in the target language. That sentence is one
// they learned in STEP 2 — this is the last link of §2-1 — walked in the order of the
// goals it serves, so the guided run follows the conversation's own shape.
import type { LessonSentence } from '@/api/client';

/** The situation's sentences in goal order (authored order within a goal). */
export function guidedTargets(sentences: LessonSentence[]): LessonSentence[] {
  return sentences.map((s, i) => ({ s, i })).sort((a, b) => a.s.goal - b.s.goal || a.i - b.i).map((e) => e.s);
}

/** The target for the learner's `turn`-th line (0-based); wraps past the last. */
export function targetFor(sentences: LessonSentence[], turn: number): LessonSentence | null {
  const ordered = guidedTargets(sentences);
  return ordered.length ? ordered[turn % ordered.length] : null;
}
