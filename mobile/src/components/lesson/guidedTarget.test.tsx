// GuidedTarget — lesson-four-steps-v44 J. One Korean target instead of three replies;
// the sentence's chunks are hints, one open at first, the rest opened one at a time.
jest.mock('expo-speech', () => ({ speak: (text: string) => { mockSpoken.push(text); }, stop: () => {} }));
const mockSpoken: string[] = [];

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { GuidedTarget } from './GuidedTarget';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();
const sentence = { en: 'On a scale of zero to ten, how is your pain?', ko: '0에서 10 사이로 통증이 어때요?', chunks: ['On a scale', 'of zero to ten', ', how is', 'your pain', '?'], words: [], goal: 1 };
const byID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type !== 'string');

function mount() {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<GuidedTarget sentence={sentence} />)); });
  return tree;
}

test('shows the Korean target, and only the first hint', () => {
  const tree = mount();
  const txt = tree.root.findAll((n) => String(n.type) === 'Text').flatMap((n) => n.children.filter((c) => typeof c === 'string'));
  expect(txt).toContain(sentence.ko);
  expect(byID(tree.root, 'guided-hint-open')).toHaveLength(1);
  // Punctuation is not a hint: four word chunks, three hidden.
  expect(byID(tree.root, 'guided-hint-closed')).toHaveLength(3);
});

test('힌트 더 opens one more at a time, and disappears when all are open', async () => {
  const tree = mount();
  const more = () => tree.root.findAll((n) => n.props?.testID === 'guided-hint-more' && typeof n.props.onPress === 'function');
  for (let i = 0; i < 3; i++) await act(async () => { more()[0].props.onPress(); });
  expect(byID(tree.root, 'guided-hint-open')).toHaveLength(4);
  expect(more()).toHaveLength(0);
});

test('listen plays the model sentence', async () => {
  const tree = mount();
  const btn = tree.root.findAll((n) => n.props?.testID === 'guided-listen' && typeof n.props.onPress === 'function')[0];
  await act(async () => { btn.props.onPress(); });
  expect(mockSpoken).toEqual([sentence.en]);
});
