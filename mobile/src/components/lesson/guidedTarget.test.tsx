// GuidedTarget — lesson-four-steps-v44 J, matched 1:1 to handoff v46 (dialogue.jsx
// DialogueOptions L130–149, lesson-fidelity-v46 T7). One Korean target instead of three
// replies; the sentence's chunks are hints, one open at first, the rest hatched and
// opened one at a time.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { GuidedTarget } from './GuidedTarget';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();
const sentence = { en: 'On a scale of zero to ten, how is your pain?', ko: '0에서 10 사이로 통증이 어때요?', chunks: ['On a scale', 'of zero to ten', ', how is', 'your pain', '?'], words: [], goal: 1 };
const byID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type !== 'string');
const flat = (st: unknown) => (Array.isArray(st) ? Object.assign({}, ...st.flat(3).filter(Boolean)) : (st ?? {})) as Record<string, unknown>;

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

test('힌트 더 opens one more at a time, and stays on the card as the handoff draws it', async () => {
  const tree = mount();
  const more = () => tree.root.findAll((n) => n.props?.testID === 'guided-hint-more' && typeof n.props.onPress === 'function');
  for (let i = 0; i < 3; i++) await act(async () => { more()[0].props.onPress(); });
  expect(byID(tree.root, 'guided-hint-open')).toHaveLength(4);
  // L147: the link is always there. Pressing it with nothing left to open does nothing.
  expect(more()).toHaveLength(1);
  await act(async () => { more()[0].props.onPress(); });
  expect(byID(tree.root, 'guided-hint-open')).toHaveLength(4);
});

test('a hidden hint is hatched, not a flat wash (L145)', () => {
  const tree = mount();
  const closed = tree.root.findAll((n) => n.props?.testID === 'guided-hint-closed' && typeof n.type === 'string')[0];
  // repeating-linear-gradient(-45deg, rgba(62,54,43,.12) 0 3px, transparent 3px 6px)
  const lines = closed.findAll((n) => String(n.type) === 'RNSVGLine', { deep: true });
  expect(lines.length).toBeGreaterThan(3);
  expect(lines[0].props.strokeWidth).toBe(3);
  expect(flat(closed.props.style).backgroundColor).toBeUndefined();
  expect(flat(closed.props.style).borderStyle).toBe('dashed');
});

test('listening moved to the rail (L180) — the card has no listen button', () => {
  const tree = mount();
  expect(tree.root.findAll((n) => n.props?.testID === 'guided-listen')).toHaveLength(0);
});

test('the STEP 3 tag is a squared-off label that never wraps (L135)', () => {
  const tree = mount();
  const tag = tree.root.findAll((n) => String(n.type) === 'Text' && n.children.includes('STEP 3 · 가이드'))[0];
  expect(tag.props.numberOfLines).toBe(1);
  expect(flat(tag.props.style)).toMatchObject({ borderRadius: 2, borderWidth: 1.3, paddingHorizontal: 6 });
});

test('the card tape is the handoff 70×20 strip at left 120, rotated -4 (L138)', () => {
  const tree = mount();
  const tape = tree.root.findAll((n) => n.props?.testID === 'guided-tape' && typeof n.type === 'string')[0];
  expect(flat(tape.props.style)).toMatchObject({ position: 'absolute', top: -10, left: 120, width: 70, height: 20 });
});
