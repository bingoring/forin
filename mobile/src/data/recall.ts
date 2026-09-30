// STEP 1 회상형 단어장의 규칙 (lesson-four-steps-v44 §11, H').
//
// The prompt type is not authored: a word lives in a theme bank and recurs across ~21
// situations, so an authored type would make it the same exercise everywhere (결정 8).
// Every word carries material for all three types and the app rotates them by position.
//
// v44 content (26 departments, until their v45 pass) has no look-alike distractors or
// chips. It still works: its options come from the other words of the same lesson, and
// it never gets the fragment exercise.
import type { LessonNuance, LessonWord } from '@/api/client';

export type PromptType = 'pick' | 'fill' | 'listen';

export type RecallCard =
  | { kind: 'word'; word: LessonWord; type: PromptType }
  | { kind: 'nuance'; item: LessonNuance };

/** STEP 1 nuance kinds — the rest are STEP 2's. */
const STEP1_NUANCE = new Set<LessonNuance['kind']>(['slider', 'pair']);

const ROTATION: PromptType[] = ['pick', 'fill', 'listen'];

const fragmentCount = (w: LessonWord) => (w.chips ?? []).reduce((n, word) => n + word.length, 0);

/** The type a word gets at position `i`, skipping fill when there is nothing to assemble. */
export function promptType(w: LessonWord, i: number): PromptType {
  for (let k = 0; k < ROTATION.length; k++) {
    const t = ROTATION[(i + k) % ROTATION.length];
    if (t !== 'fill' || fragmentCount(w) >= 2) return t;
  }
  return 'pick';
}

/** Words first, then the STEP 1 nuance cards, in authored order. */
export function buildDeck(words: LessonWord[], nuance: LessonNuance[]): RecallCard[] {
  return [
    ...words.map((word, i): RecallCard => ({ kind: 'word', word, type: promptType(word, i) })),
    ...nuance.filter((n) => STEP1_NUANCE.has(n.kind)).map((item): RecallCard => ({ kind: 'nuance', item })),
  ];
}

/** A small string hash, so an order is fixed per word without being alphabetical. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Deterministic shuffle keyed on `seed` — the same card always shows the same order. */
export function stableShuffle<T>(xs: T[], seed: string): T[] {
  return xs
    .map((x, i) => ({ x, k: hash(`${seed}|${i}`) }))
    .sort((a, b) => a.k - b.k)
    .map((e) => e.x);
}

/**
 * The three options for a pick (English) or listen (Korean) prompt: the answer and two
 * wrong ones. Authored look-alikes when the word has them; otherwise two other words of
 * this lesson (v44 content).
 */
export function optionsFor(w: LessonWord, type: 'pick' | 'listen', pool: LessonWord[]): string[] {
  const answer = type === 'pick' ? w.en : w.ko;
  const authored = type === 'pick' ? w.distractorsEn : w.distractorsKo;
  let wrong = (authored ?? []).filter((o) => o !== answer);
  if (wrong.length < 2) {
    const others = stableShuffle(pool.filter((p) => p.id !== w.id), w.id)
      .map((p) => (type === 'pick' ? p.en : p.ko))
      .filter((o) => o !== answer && !wrong.includes(o));
    wrong = [...wrong, ...others].slice(0, 2);
  }
  return stableShuffle([answer, ...wrong.slice(0, 2)], `${w.id}|${type}`);
}

/** The fragment pool for a fill prompt: every answer fragment plus the decoys, shuffled. */
export function fragmentPool(w: LessonWord): string[] {
  return stableShuffle([...(w.chips ?? []).flat(), ...(w.decoyChips ?? [])], `${w.id}|fill`);
}

/**
 * What the learner has built so far, spaced the way the answer is: fragments inside a
 * word join, words take one space. The learner never types a space.
 */
export function assembled(w: LessonWord, picked: string[]): string {
  const sizes = (w.chips ?? []).map((word) => word.length);
  const out: string[] = [];
  let at = 0;
  for (const n of sizes) {
    if (at >= picked.length) break;
    out.push(picked.slice(at, at + n).join(''));
    at += n;
  }
  if (at < picked.length) out.push(picked.slice(at).join(''));
  return out.join(' ');
}

export type RecallAnswer = string | string[] | number | Record<string, string>;

export function isRight(card: RecallCard, answer: RecallAnswer | null): boolean {
  if (answer == null) return false;
  if (card.kind === 'word') {
    const w = card.word;
    switch (card.type) {
      case 'fill': return Array.isArray(answer) && answer.join('|') === (w.chips ?? []).flat().join('|');
      case 'pick': return answer === w.en;
      case 'listen': return answer === w.ko;
    }
  }
  const n = card.item;
  if (n.kind === 'slider') return answer === n.answerAt;
  if (n.kind === 'pair') {
    const links = answer as Record<string, string>;
    return (n.pairs ?? []).every(([l, r]) => links[l] === r);
  }
  return false;
}

/** Whether an answer is complete enough to check. */
export function hasAnswer(card: RecallCard, answer: RecallAnswer | null): boolean {
  if (answer == null) return false;
  if (card.kind === 'nuance' && card.item.kind === 'pair') {
    // `__left` is the pair screen's own "which left word is picked" marker, not a link.
    const links = Object.keys(answer as Record<string, string>).filter((k) => k !== '__left');
    return links.length === (card.item.pairs ?? []).length;
  }
  return Array.isArray(answer) ? answer.length > 0 : true;
}

/** The word ids a card is about — what goes into `missed` when it is answered wrong. */
export function cardWordIds(card: RecallCard): string[] {
  return card.kind === 'word' ? [card.word.id] : card.item.words;
}
