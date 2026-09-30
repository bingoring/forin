// STEP 2 문장 — lesson-four-steps-v44 I. Reel warm-up, then the sentences (review ones
// first) with a rotated exercise each, one order card, the STEP 2 nuance drills, and a
// PASSED page whose CTA records STEP 2 and opens the guided dialogue.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
jest.mock('expo-speech', () => ({ speak: (text: string) => { mockSpoken.push(text); }, stop: () => {} }));
const mockSpoken: string[] = [];
const mockCalls: string[] = [];

const S = (en: string, chunks: string[], words: string[], goal: number, review = false) => ({ en, ko: `${en} (뜻)`, chunks, words, goal, review });
function mockLesson() {
  return {
    situation: { id: 'SCN-ER-00002', title: '통증 사정' },
    level: 'A2',
    steps: [
      { kind: 'words', state: 'done', count: 3 }, { kind: 'sentences', state: 'now', count: 3 },
      { kind: 'guided', state: 'lock', count: 3 }, { kind: 'free', state: 'lock', count: 3 },
    ],
    words: [{ id: 'w-pain', en: 'pain', ko: '통증' }, { id: 'w-scale', en: 'scale', ko: '척도' }, { id: 'w-worse', en: 'worse', ko: '더 나쁜' }],
    sentences: [
      S('Rate your pain.', ['Rate', 'your pain', '.'], ['w-pain'], 1),
      S('Use this scale.', ['Use', 'this scale', '.'], ['w-scale'], 2, true),
      S('Is it getting worse?', ['Is it', 'getting worse', '?'], ['w-worse'], 3),
    ],
    nuance: [
      { kind: 'reel', words: ['w-pain'], word: 'pain', scenes: [
        { who: 'a', en: 'pain one', ko: '1' }, { who: 'b', en: 'pain two', ko: '2' }] },
      { kind: 'context', words: ['w-pain'], why: '이유', scenes: [
        { who: '차트', en: 'Pt reports pain 7/10.', ok: true },
        { who: '환자에게', en: 'Your NRS is 7.', ok: false, fix: 'You said your pain is a 7.' },
        { who: '의사에게', en: 'Pain is 7 out of 10.', ok: true }] },
    ],
  };
}
jest.mock('@/api/client', () => ({
  api: {
    lesson: async () => mockLesson(),
    clearLessonStep: async (s: string, k: string) => { mockCalls.push(`clear ${s} ${k}`); return mockLesson(); },
  },
}));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({
    push: (p: unknown) => { mockCalls.push(`push ${JSON.stringify(p)}`); },
    replace: (p: unknown) => { mockCalls.push(`replace ${String(p)}`); }, back: () => {}, canGoBack: () => true,
  }),
  useLocalSearchParams: () => ({ id: 'SCN-ER-00002' }),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import LessonSentences from '@/app/scenario/[id]/sentences';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root.findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
const byID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type !== 'string');
async function press(node: ReactTestInstance) {
  const hit = [node, ...node.findAll(() => true)].find((n) => typeof n.props?.onPress === 'function');
  expect(hit).toBeTruthy();
  await act(async () => { await hit!.props.onPress(); });
}
const pressID = async (root: ReactTestInstance, id: string) => press(byID(root, id)[0]);
/** The pressable whose testID starts with `prefix` and whose label is `label`. */
async function pressLabel(root: ReactTestInstance, prefix: string, label: string) {
  const hit = root.findAll((n) => typeof n.type !== 'string' && String(n.props?.testID ?? '').startsWith(prefix) && texts(n).join('') === label)[0];
  expect(hit).toBeTruthy();
  await press(hit);
}
const typeLabel = (tree: ReturnType<typeof create>) => texts(byID(tree.root, 'sent-type')[0]).join('');

async function mount() {
  mockCalls.length = 0;
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<LessonSentences />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

test('opens with the reel; next waits until the last scene has been read', async () => {
  const tree = await mount();
  expect(typeLabel(tree)).toBe('워밍업 · 문장 릴');
  expect(texts(tree.root)).toContain('1 / 2');
  await pressID(tree.root, 'sent-next'); // not yet — still on scene 1
  expect(typeLabel(tree)).toBe('워밍업 · 문장 릴');
  await pressID(tree.root, 'sent-reel-card');
  expect(texts(tree.root)).toContain('2 / 2');
  await pressID(tree.root, 'sent-next');
  expect(typeLabel(tree)).toBe('듣고 고르기');
});

async function pastReel(tree: ReturnType<typeof create>) {
  await pressID(tree.root, 'sent-reel-card');
  await pressID(tree.root, 'sent-next');
}

test('the review sentence (a word missed in STEP 1) comes first, as a listen card', async () => {
  const tree = await mount();
  await pastReel(tree);
  await pressID(tree.root, 'sent-play');
  expect(mockSpoken).toContain('Use this scale.');
  await pressLabel(tree.root, 'sent-opt-', 'Use this scale. (뜻)');
  await pressID(tree.root, 'sent-check');
  expect(byID(tree.root, 'sent-stamp-good')).toHaveLength(1);
  await pressID(tree.root, 'sent-repeat');
  expect(mockCalls.find((c) => c.startsWith('push'))).toContain('"referenceText":"Use this scale."');
});

test('chunks: the pieces in order build the sentence; out of order is RETRY', async () => {
  const tree = await mount();
  await pastReel(tree);
  await pressLabel(tree.root, 'sent-opt-', 'Use this scale. (뜻)');
  await pressID(tree.root, 'sent-check');
  await pressID(tree.root, 'sent-next');
  expect(typeLabel(tree)).toBe('청크 조립');
  await pressLabel(tree.root, 'sent-chunk-', 'Rate');
  await pressLabel(tree.root, 'sent-chunk-', 'your pain');
  expect(texts(byID(tree.root, 'sent-chunk-built')[0])).toContain('Rate your pain.');
  await pressID(tree.root, 'sent-check');
  expect(byID(tree.root, 'sent-stamp-good')).toHaveLength(1);
});

test('walks through blank, order and the context drill to PASSED, then opens the guided dialogue', async () => {
  const tree = await mount();
  await pastReel(tree);
  await pressLabel(tree.root, 'sent-opt-', 'Use this scale. (뜻)');
  await pressID(tree.root, 'sent-check');
  await pressID(tree.root, 'sent-next');
  await pressLabel(tree.root, 'sent-chunk-', 'Rate');
  await pressLabel(tree.root, 'sent-chunk-', 'your pain');
  await pressID(tree.root, 'sent-check');
  await pressID(tree.root, 'sent-next');

  expect(typeLabel(tree)).toBe('빈칸 채우기');
  await pressLabel(tree.root, 'sent-opt-', 'getting worse');
  await pressID(tree.root, 'sent-check');
  expect(byID(tree.root, 'sent-stamp-good')).toHaveLength(1);
  await pressID(tree.root, 'sent-next');

  expect(typeLabel(tree)).toBe('순서 배열');
  await pressLabel(tree.root, 'sent-order-', 'Rate your pain.');
  await pressLabel(tree.root, 'sent-order-', 'Use this scale.');
  await pressLabel(tree.root, 'sent-order-', 'Is it getting worse?');
  await pressID(tree.root, 'sent-check');
  expect(byID(tree.root, 'sent-stamp-good')).toHaveLength(1);
  await pressID(tree.root, 'sent-next');

  expect(typeLabel(tree)).toBe('같은 뜻 다른 장면');
  await pressID(tree.root, 'sent-scene-1');
  await pressID(tree.root, 'sent-check');
  expect(byID(tree.root, 'sent-stamp-good')).toHaveLength(1);
  expect(texts(tree.root)).toContain('You said your pain is a 7.');
  await pressID(tree.root, 'sent-next');

  expect(byID(tree.root, 'sent-done')).toHaveLength(1);
  await pressID(tree.root, 'sent-to-step3');
  expect(mockCalls.slice(-2)).toEqual(['clear SCN-ER-00002 sentences', 'replace /dialogue/SCN-ER-00002?guide=guided']);
});
