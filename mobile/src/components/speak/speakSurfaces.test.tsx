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
import type { SpokenSentence } from '@/api/client';
import { trackMounts } from '../../testing/mountRegistry';

/** Unmounts every tree this file mounts — see mountRegistry for why. */
const track = trackMounts();

/** Every string this tree renders, flattened — the assertions below only care
 *  whether a given piece of text is on screen. */
function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

function draw(node: React.ReactElement): ReactTestInstance {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(node)); });
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

test('the list header sizes to its content rather than a fixed web height', () => {
  // The implementation moved out of the route: the review-lab 말하기 tab renders the
  // same list inline, so it lives in a component and the route is three lines.
  const src = readFileSync(join(__dirname, 'SpeakList.tsx'), 'utf8');
  // Comments stripped: a comment EXPLAINING that 186 does not port is not a 186.
  const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  expect(code).not.toMatch(/\bHEADER_H\b/);
  expect(code).not.toMatch(/\b186\b/);
  // The app's own status-bar inset is still respected — every other screen uses 52.
  expect(code).toMatch(/paddingTop: 52/);
});


test('the band distribution is drawn from the filter-aware page, not a separate summary', () => {
  // How the scores are spread across 60↓ / 60–79 / 80+, UNDER the filter and OF the
  // filter (v35). It used to read a whole-bank /speech/summary once; now the counts ride
  // on the same /speech/sentences response as the page, so picking a department re-reads
  // the gauge as that department's spread. So the bar is fed `dist`, and `dist` is set
  // from the page — not from a summary call.
  const src = readFileSync(join(__dirname, 'SpeakList.tsx'), 'utf8');
  expect(src).toMatch(/<BandBar counts=\{dist\} \/>/);
  expect(src).toMatch(/setDist\(\{ total: page\.total/);
  // The old whole-bank summary read is gone — a second source of truth for the same bars.
  expect(src).not.toMatch(/speakSummary\(/);
});
