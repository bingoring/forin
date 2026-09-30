// STEP 2 문장의 규칙 (lesson-four-steps-v44 I; handoff v44 LessonSentences/Blank/Order/Listen,
// v45 ImmersionReel/ContextMatch/SwapOne).
//
// The deck: the situation's reel warm-up (if it has one), then its sentences — the ones
// that use a word missed in STEP 1 first (`review`) — each with an exercise type rotated
// by position (listen → chunks → blank), one order card that lays sentences out in goal
// order, and the STEP 2 nuance drills (context, swap) last. Every distractor comes from
// the same lesson: another sentence's chunk, meaning, or line — no authored material
// needed beyond what v44 already has.
import type { LessonNuance, LessonSentence, LessonWord } from '@/api/client';
import { stableShuffle } from './recall';

export type SentenceType = 'listen' | 'chunks' | 'blank';

export type DrillCard =
  | { kind: 'sentence'; type: SentenceType; sentence: LessonSentence }
  | { kind: 'order'; sentences: LessonSentence[] }
  | { kind: 'reel'; item: LessonNuance }
  | { kind: 'context'; item: LessonNuance }
  | { kind: 'swap'; item: LessonNuance };

export type DrillAnswer = string | string[] | number;

const ROTATION: SentenceType[] = ['listen', 'chunks', 'blank'];
const PUNCT = /^[.,?!]$/;

/** The chunks a learner places — punctuation rides along on its own. */
const placeable = (s: LessonSentence) => s.chunks.filter((c) => !PUNCT.test(c));

/** Up to four sentences, one per goal, in goal order — the order card's answer. */
export function orderAnswer(sentences: LessonSentence[]): string[] {
  const byGoal = new Map<number, LessonSentence>();
  for (const s of sentences) if (!byGoal.has(s.goal)) byGoal.set(s.goal, s);
  return [...byGoal.entries()].sort((a, b) => a[0] - b[0]).slice(0, 4).map(([, s]) => s.en);
}

export function buildDrillDeck(sentences: LessonSentence[], nuance: LessonNuance[]): DrillCard[] {
  const ordered = [...sentences.filter((s) => s.review), ...sentences.filter((s) => !s.review)];
  const deck: DrillCard[] = [];
  const reel = nuance.find((n) => n.kind === 'reel');
  if (reel) deck.push({ kind: 'reel', item: reel });
  ordered.forEach((sentence, i) => deck.push({ kind: 'sentence', type: ROTATION[i % ROTATION.length], sentence }));
  const order = orderAnswer(sentences);
  if (order.length >= 3) deck.push({ kind: 'order', sentences: order.map((en) => sentences.find((s) => s.en === en)!) });
  for (const n of nuance) {
    if (n.kind === 'context') deck.push({ kind: 'context', item: n });
    else if (n.kind === 'swap') deck.push({ kind: 'swap', item: n });
  }
  return deck;
}

/** The chunk pool: this sentence's chunks plus two chunks from other sentences. */
export function chunkPool(s: LessonSentence, all: LessonSentence[]): string[] {
  const own = placeable(s);
  const others = stableShuffle(all.filter((o) => o.en !== s.en).flatMap(placeable).filter((c) => !own.includes(c)), s.en).slice(0, 2);
  return stableShuffle([...own, ...others], `${s.en}|pool`);
}

/** Picked chunks joined the way the sentence is, with its punctuation put back. */
export function assembledSentence(s: LessonSentence, picked: string[]): string {
  const tail = s.chunks.filter((c) => PUNCT.test(c)).join('');
  return picked.length === placeable(s).length ? `${picked.join(' ')}${tail}` : picked.join(' ');
}

/** The blank: the chunk holding a word the sentence teaches, and four options for it. */
export function blankOf(s: LessonSentence, all: LessonSentence[], words: LessonWord[]): { answer: string; options: string[] } | null {
  const own = placeable(s);
  if (own.length < 2) return null;
  const taught = words.filter((w) => s.words.includes(w.id)).map((w) => w.en.toLowerCase());
  const answer = own.find((c) => taught.some((t) => c.toLowerCase().includes(t))) ?? own[own.length - 1];
  const others = stableShuffle(all.filter((o) => o.en !== s.en).flatMap(placeable).filter((c) => c !== answer && !own.includes(c)), `${s.en}|blank`);
  return { answer, options: stableShuffle([answer, ...others.slice(0, 3)], `${s.en}|blankopts`) };
}

/** Listen and pick: the sentence's meaning and two other meanings from the lesson. */
export function listenOptions(s: LessonSentence, all: LessonSentence[]): string[] {
  const others = stableShuffle(all.filter((o) => o.ko !== s.ko).map((o) => o.ko), `${s.en}|listen`).slice(0, 2);
  return stableShuffle([s.ko, ...others], `${s.en}|listenopts`);
}

/** The context scene index that does not fit (ok: false). */
export const contextAnswer = (n: LessonNuance) => (n.scenes ?? []).findIndex((sc) => sc.ok === false);

export function isDrillRight(card: DrillCard, answer: DrillAnswer | null, words: LessonWord[] = [], all: LessonSentence[] = []): boolean {
  if (answer == null) return false;
  switch (card.kind) {
    case 'sentence': {
      const s = card.sentence;
      if (card.type === 'chunks') return Array.isArray(answer) && answer.join('|') === placeable(s).join('|');
      if (card.type === 'listen') return answer === s.ko;
      return answer === blankOf(s, all.length ? all : [s], words)?.answer;
    }
    case 'order': return Array.isArray(answer) && answer.join('|') === card.sentences.map((s) => s.en).join('|');
    case 'context': return answer === contextAnswer(card.item);
    case 'swap': return answer === card.item.answer;
    case 'reel': return true;
  }
}

export function hasDrillAnswer(card: DrillCard, answer: DrillAnswer | null): boolean {
  if (card.kind === 'reel') return true;
  if (answer == null) return false;
  if (card.kind === 'order') return Array.isArray(answer) && answer.length === card.sentences.length;
  return Array.isArray(answer) ? answer.length > 0 : true;
}
