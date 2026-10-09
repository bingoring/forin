// business-rules §5: with no Azure key the pronunciation entry points are ABSENT — a mic
// button that records and then 502s is worse than none. Cross-review I2: the server sent
// the flag and nothing in the app read it, across nine entry points.
//
// The leaf components are rendered both ways. The route screens are too heavy to mount
// here, so for those the test pins that each one reads the gate at all.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';

jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
  useAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {}, replace: () => {} }),
  useAudioPlayerStatus: () => ({ playing: false, didJustFinish: false }),
}));

import { SpokenRow } from '@/components/speak/SpokenRow';
import { SessionSpeechReviewCard } from '@/components/speak/SessionSpeechReviewCard';
import { ModelAnswerHero } from '@/components/model/ModelAnswerHero';
import { hydratePronunciationEnabled, resetPronunciationEnabled } from '@/data/pronunciationFlag';
import type { ModelAnswerGroup, SpokenSentence } from '@/api/client';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();
afterEach(resetPronunciationEnabled);

function draw(node: React.ReactElement): ReactTestInstance {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(node)); });
  return tree.root;
}
// A mic icon the learner can press. The review card's header also wears a decorative mic;
// that is not an entry point and stays.
const pressable = (n: ReactTestInstance): boolean => {
  for (let p: ReactTestInstance | null = n.parent; p; p = p.parent) if (typeof p.props?.onPress === 'function') return true;
  return false;
};
const mics = (r: ReactTestInstance) => r.findAll((n) => n.props?.name === 'mic' && pressable(n));

const weak: SpokenSentence = {
  sentenceKey: 'k', referenceText: 'a line', recognized: 'a line', overall: 40, accuracy: 40, fluency: 40,
  completeness: 100, attempts: 1, createdAt: '',
};
const group: ModelAnswerGroup = {
  scenarioId: 's', title: 't', corrections: 1, steps: 1, lastAt: '',
  cards: [{ said: 'x', model: 'y', note: '', createdAt: '' }],
};

const cases: [string, () => React.ReactElement][] = [
  ['SpokenRow', () => <SpokenRow sentence={weak} onPractise={() => {}} />],
  ['SessionSpeechReviewCard', () => <SessionSpeechReviewCard review={{ sentences: [weak], average: 40, weakest: [weak] }} onPractise={() => {}} />],
  ['ModelAnswerHero', () => <ModelAnswerHero group={group} onPractise={() => {}} />],
];

describe.each(cases)('%s', (_name, el) => {
  test('draws the mic while pronunciation is enabled', () => {
    expect(mics(draw(el())).length).toBeGreaterThan(0);
  });
  test('draws no mic once the server reports it disabled', () => {
    hydratePronunciationEnabled(false);
    expect(mics(draw(el()))).toHaveLength(0);
  });
});

// Screens that open the pronunciation route. Each must consult the gate.
test.each([
  'app/review.tsx',
  'app/(tabs)/lab.tsx',
  'app/(tabs)/index.tsx',
  'app/slang/index.tsx',
  'app/night/index.tsx',
  'components/lesson/SentContext.tsx',
  'components/lesson/SentSwap.tsx',
  'components/lesson/SentPassed.tsx',
  'components/lesson/SentPrompt.tsx',
])('%s reads usePronunciationEnabled', (file) => {
  const src = readFileSync(join(__dirname, '..', '..', file), 'utf8');
  expect(src).toMatch(/usePronunciationEnabled\(\)/);
});
