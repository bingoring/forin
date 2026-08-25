// The three speaking surfaces, tested for the facts that would silently rot:
// an empty run must not read as a zero score, the practise button must not be
// offered when nothing is weak, and the list's header height must equal the
// number the handoff pins the scroller to.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';

// PixelButton pulls in the sfx player, which needs the native audio module.
jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
}));

import { SessionSpeechReviewCard } from './SessionSpeechReviewCard';
import { SpeakSummaryBlock } from './SpeakSummaryBlock';
import type { SpokenSentence } from '@/api/client';

/** Every string this tree renders, flattened — the assertions below only care
 *  whether a given piece of text is on screen. */
function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

function draw(node: React.ReactElement): ReactTestInstance {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(node); });
  return tree.root;
}

const row = (over: Partial<SpokenSentence>): SpokenSentence => ({
  sentenceKey: over.referenceText ?? 'k', referenceText: 'a line', recognized: 'a line',
  overall: 50, accuracy: 50, fluency: 50, completeness: 100, attempts: 1, createdAt: '', ...over,
});

test('a run with no spoken lines shows the empty state, never an average badge', () => {
  const out = texts(draw(<SessionSpeechReviewCard review={{ sentences: [], average: 0, weakest: [] }} onPractise={() => {}} />));
  // "no score" and "score 0" are different facts.
  expect(out).not.toContain('0');
  expect(out).toContain('이번엔 음성으로 말한 문장이 없어요');
});

test('the average badge rounds to whole points', () => {
  const one = row({ referenceText: 'one', overall: 81.4 });
  const out = texts(draw(
    <SessionSpeechReviewCard review={{ sentences: [one], average: 81.4, weakest: [one] }} onPractise={() => {}} />
  ));
  expect(out).toContain('81');
});

test('다시 연습 is not offered when every weak candidate is already in the top band', () => {
  const strong = [row({ referenceText: 'one', overall: 91 }), row({ referenceText: 'two', overall: 88 })];
  const out = texts(draw(
    <SessionSpeechReviewCard review={{ sentences: strong, average: 89.5, weakest: strong }} onPractise={() => {}} />
  ));
  // Sending a player to drill sentences they have mastered is worse than no button.
  expect(out.some((x) => x.includes('다시 연습하기'))).toBe(false);
});

test('다시 연습 appears, and names the count, once something is actually weak', () => {
  const mixed = [row({ referenceText: 'one', overall: 91 }), row({ referenceText: 'two', overall: 42 })];
  const weakest = [row({ referenceText: 'two', overall: 42 })];
  const out = texts(draw(
    <SessionSpeechReviewCard review={{ sentences: mixed, average: 66.5, weakest }} onPractise={() => {}} />
  ));
  expect(out).toContain('낮은 점수 1문장 다시 연습하기');
});

test('the summary block reports the total on its 전체 entry', () => {
  const out = texts(draw(
    <SpeakSummaryBlock
      summary={{ total: 128, low: 10, mid: 40, high: 78, weakest: [row({ referenceText: 'worst', overall: 12 })] }}
      onOpenAll={() => {}}
      onPractise={() => {}}
    />
  ));
  expect(out).toContain('전체 128');
});

// The handoff warns that a header taller than the offset the scroller starts at
// paints over the first — highest-priority — row. The two must be one number.
test('the list header height and the scroller offset are a single constant', () => {
  const src = readFileSync(join(__dirname, '..', '..', 'app', 'speak', 'index.tsx'), 'utf8');
  const decl = /const HEADER_H = (\d+);/.exec(src);
  expect(decl?.[1]).toBe('186');
  // Any other bare 186 would be a second copy of the same fact, free to drift.
  expect(src.match(/\b186\b/g)).toHaveLength(2); // the comment and the constant
  expect(src).toMatch(/height:\s*HEADER_H/);
});

test('the speaking block still renders with nothing in it', () => {
  const out = texts(draw(
    <SpeakSummaryBlock summary={{ total: 0, low: 0, mid: 0, high: 0, weakest: [] }} onOpenAll={() => {}} onPractise={() => {}} />
  ));
  expect(out).toContain('직접 말하기 연습');
  expect(out.some((x) => x.includes('마이크로 답하면'))).toBe(true);
  // No 전체 0 entry into an empty list.
  expect(out.some((x) => x.startsWith('전체'))).toBe(false);
});
