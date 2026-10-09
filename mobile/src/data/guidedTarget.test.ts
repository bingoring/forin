import { guidedTargets, targetFor, wordChips } from './guidedTarget';
import type { LessonSentence } from '@/api/client';

const S = (en: string, goal: number): LessonSentence => ({ en, ko: `${en}-뜻`, chunks: [en], words: [], goal });
const sentences = [S('c', 2), S('a', 1), S('d', 3), S('b', 1)];

// The last link of spec §2-1: the sentence STEP 3 asks for is one learned in STEP 2.
test('every target is one of the STEP 2 sentences, walked in goal order', () => {
  expect(guidedTargets(sentences).map((s) => s.en)).toEqual(['a', 'b', 'c', 'd']);
  for (let turn = 0; turn < 10; turn++) expect(sentences).toContain(targetFor(sentences, turn));
});

test('turn k asks for the k-th sentence, and wraps after the last', () => {
  expect(targetFor(sentences, 0)?.en).toBe('a');
  expect(targetFor(sentences, 3)?.en).toBe('d');
  expect(targetFor(sentences, 4)?.en).toBe('a');
});

test('no sentences, no target — the guided pass falls back to its reply choices', () => {
  expect(targetFor([], 0)).toBeNull();
});

// The typing card's word chips (handoff v46 dialogue.jsx L171): one per hint chunk, cut to
// its head word — 'mechanism of injury' → 'mechanism', 'vital signs' → 'vital' — and a
// head too short to stand alone keeps its partner ('Can you tell me' → 'Can you').
test('word chips are the hint chunks cut to their head word, as the handoff draws them', () => {
  const s = { en: '', ko: '', chunks: ['mechanism of injury', 'vital signs', 'Can you tell me', '?'], words: [], goal: 1 };
  expect(wordChips(s)).toEqual(['mechanism', 'vital', 'Can you']);
});

test('at most three chips, none repeated, punctuation never one', () => {
  const s = { en: '', ko: '', chunks: ['I understand', 'I understand', ', you feel', 'upset', 'right now', '.'], words: [], goal: 1 };
  expect(wordChips(s)).toEqual(['I understand', 'you feel', 'upset']);
});
