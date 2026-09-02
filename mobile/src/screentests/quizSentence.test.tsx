// 문장 완성 + the shared quiz frame, in the 근무 수첩 line (v30).
//
// The rules watched here are the ones that would let a quiz pass without being answered,
// or misreport how far through it you are:
//
//  · A payload with no template must NOT auto-pass. `[].every(...)` is vacuously true, so
//    a mis-routed quiz (a `match` payload arriving at the sentence type) would submit as
//    correct with nothing filled in — the guard is `blankCount > 0`.
//  · Submit stays dead until every blank is filled.
//  · A word chip that has been used stays visible, struck through: the learner needs to
//    see which words are already in the sentence.
//  · The progress strokes count questions, and fill up to the one you are ON.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
}));

let mockQuiz: Record<string, unknown> | null = null;
jest.mock('@/hooks/useQuizData', () => ({
  useQuizData: () => ({ quiz: mockQuiz, state: mockQuiz ? 'ok' : 'loading' }),
}));
jest.mock('@/api/client', () => ({ api: { recordAttempt: async () => {} } }));
const mockNav: string[] = [];
let mockParams: Record<string, string> = { id: 'QZ-1' };
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ replace: (p: string) => { mockNav.push(p); }, push: () => {}, back: () => { mockNav.push('back'); }, canGoBack: () => true }),
  useLocalSearchParams: () => mockParams,
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Quiz from '@/app/quiz/[id]';
import { nb } from '@/theme/nb';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

const SENTENCE = {
  id: 'QZ-1', title: '통증 강도 묻기', type: 'sentence',
  content: {
    zone: 'ER', sub: '0~10 척도',
    template: 'On a __ of 0 to 10, how __ is your pain?',
    answers: ['scale', 'bad'],
    wordBank: ['scale', 'bad'],
    hint: '강도를 묻는 관용 표현이에요.',
  },
};

beforeEach(() => { mockNav.length = 0; mockParams = { id: 'QZ-1' }; mockQuiz = JSON.parse(JSON.stringify(SENTENCE)); });

function mount() {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<Quiz />)); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** RN style props NEST, so a one-level flatten loses whatever is in the inner array. */
function flatten(st: unknown): Record<string, unknown> {
  if (!st) return {};
  if (Array.isArray(st)) return Object.assign({}, ...st.map(flatten));
  return st as Record<string, unknown>;
}

function styled(root: ReactTestInstance, pred: (s: Record<string, unknown>) => boolean) {
  return root.findAll(
    (n) => typeof n.type === 'string' && !!n.props?.style && pred(flatten(n.props.style)),
    { deep: true },
  );
}

/** The composite carrying a label, with `disabled` on it. NbButton turns onPress into a
 *  Pressable, so no HOST node carries the prop. */
function button(root: ReactTestInstance, label: string) {
  const hits = root.findAll(
    (n) => typeof n.type !== 'string' && n.props?.disabled !== undefined && texts(n).includes(label),
    { deep: true },
  );
  expect(hits.length).toBeGreaterThan(0);
  return hits[hits.length - 1];
}

/** Taps the word chip carrying `word` (the pressable, not the paper inside it). */
async function tapChip(root: ReactTestInstance, word: string) {
  const hits = root.findAll(
    (n) => typeof n.props?.onPress === 'function' && texts(n).includes(word),
    { deep: true },
  );
  expect(hits.length).toBeGreaterThan(0);
  await act(async () => { hits[0].props.onPress(); });
}

test('submit is dead until every blank is filled', async () => {
  const tree = mount();
  expect(button(tree.root, '제출하기').props.disabled).toBe(true);

  await tapChip(tree.root, 'scale');
  expect(button(tree.root, '제출하기').props.disabled).toBe(true);
  await tapChip(tree.root, 'bad');
  expect(button(tree.root, '제출하기').props.disabled).toBe(false);
});

test('a payload with no template cannot auto-pass', async () => {
  // `[].every(...)` is vacuously true: without the blankCount guard a mis-routed quiz
  // submits as correct with nothing answered at all.
  mockQuiz = { id: 'QZ-1', title: 'x', type: 'sentence', content: { answers: [], wordBank: [] } };
  const tree = mount();
  expect(button(tree.root, '제출하기').props.disabled).toBe(true);
});

test('a used chip stays on the page, struck through', async () => {
  const tree = mount();
  await tapChip(tree.root, 'scale');
  // Still there — removing it hides which words are already in the sentence.
  expect(texts(tree.root).filter((x) => x === 'scale').length).toBeGreaterThanOrEqual(2);
  expect(styled(tree.root, (s) => s.textDecorationLine === 'line-through').length).toBeGreaterThan(0);
});

test('the verdict is a drawn mark per blank, not a character in the answer', async () => {
  const tree = mount();
  await tapChip(tree.root, 'scale');
  await tapChip(tree.root, 'bad');
  await act(async () => { button(tree.root, '제출하기').props.onPress(); });

  const ticks = tree.root.findAll(
    (n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === 'NbIcon'
      && n.props?.name === 'check' && n.props?.color === nb.green,
    { deep: true },
  );
  // Three: one per blank, plus the verdict banner's own. Appending a ✓ to the word
  // instead would put the mark inside the highlighted run, where it reads as part of what
  // the learner answered.
  expect(ticks.length).toBe(3);
  expect(texts(tree.root).join(' ')).not.toContain('✓');
});

test('the frame counts the questions in a sequence, and fills up to the current one', async () => {
  // Three quizzes in this scenario, on the second.
  mockParams = { id: 'QZ-1', q: 'QZ-1,QZ-2,QZ-3', i: '1' };
  const tree = mount();
  expect(texts(tree.root)).toContain('2');
  expect(texts(tree.root)).toContain('3');
  const strokes = styled(tree.root, (s) => s.height === 5 && s.borderRadius === 2);
  expect(strokes.length).toBe(3);
  const filled = strokes.filter((n) => flatten(n.props.style).backgroundColor === nb.ink);
  expect(filled.length).toBe(2);
});

test('그만두기 leaves without submitting anything', async () => {
  const tree = mount();
  const exit = tree.root.findAll(
    (n) => String(n.type) === 'Text' && typeof n.props?.onPress === 'function' && n.children.includes('나가기'),
    { deep: true },
  );
  expect(exit.length).toBe(1);
  await act(async () => { exit[0].props.onPress(); });
  expect(mockNav).toEqual(['back']);
});
