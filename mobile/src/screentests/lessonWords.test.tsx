// STEP 1 단어 — lesson-four-steps-v44 H. One flashcard per word the situation's sentences
// use; `헷갈려요` files the word into the review notes; the last card finishes the step.
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
let mockWordCount = 13;
function mockLesson() {
  return {
    situation: { id: 'SCN-ER-00002', title: '통증 사정' },
    level: 'B1',
    // Opted into from the hub: the server still says skip.
    steps: [
      { kind: 'words', state: 'skip', count: mockWordCount }, { kind: 'sentences', state: 'now', count: 5 },
      { kind: 'guided', state: 'lock', count: 3 }, { kind: 'free', state: 'lock', count: 3 },
    ],
    words: Array.from({ length: mockWordCount }, (_, i) => ({
      id: `w-${i}`, en: `word${i}`, ipa: `/w${i}/`, ko: `뜻${i}`, icon: 'pill', example: `Say word${i} now.`,
    })),
    sentences: [],
  };
}
jest.mock('@/api/client', () => ({
  api: {
    lesson: async () => mockLesson(),
    confusedWord: async (s: string, w: string) => { mockCalls.push(`confused ${s} ${w}`); return { created: true }; },
    clearLessonStep: async (s: string, k: string) => { mockCalls.push(`clear ${s} ${k}`); return mockLesson(); },
  },
}));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({
    push: (p: unknown) => { mockCalls.push(`push ${JSON.stringify(p)}`); },
    replace: () => {}, back: () => { mockCalls.push('back'); }, canGoBack: () => true,
  }),
  useLocalSearchParams: () => ({ id: 'SCN-ER-00002' }),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import LessonWords from '@/app/scenario/[id]/words';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
const byTestID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type !== 'string');
const press = async (root: ReactTestInstance, id: string) => {
  const box = root.findAll((n) => n.props?.testID === id)[0];
  expect(box).toBeTruthy();
  const hit = [box, ...box.findAll(() => true)].filter((n) => typeof n.props?.onPress === 'function');
  expect(hit.length).toBeGreaterThan(0);
  await act(async () => { await hit[0].props.onPress(); });
};

async function mount() {
  mockCalls.length = 0;
  mockSpoken.length = 0;
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<LessonWords />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

beforeEach(() => { mockWordCount = 13; });

// 8 is a minimum, not the size of the row (spec §2-2).
test('one progress chip per word — 13 words, 13 chips', async () => {
  const tree = await mount();
  expect(byTestID(tree.root, 'lesson-word-chip')).toHaveLength(13);
  expect(texts(tree.root)).toContain('1 / 13');
});

test('헷갈려요 files the word into the review notes and moves on', async () => {
  const tree = await mount();
  expect(texts(tree.root)).toContain('word0');
  await press(tree.root, 'lesson-word-confused');
  expect(mockCalls).toContain('confused SCN-ER-00002 w-0');
  expect(texts(tree.root)).toContain('word1');
  expect(texts(tree.root)).toContain('2 / 13');
});

test('알아요 moves on without filing anything', async () => {
  const tree = await mount();
  await press(tree.root, 'lesson-word-known');
  expect(mockCalls.filter((c) => c.startsWith('confused'))).toHaveLength(0);
  expect(texts(tree.root)).toContain('word1');
});

test('the last card finishes the step and returns to the hub', async () => {
  mockWordCount = 2;
  const tree = await mount();
  await press(tree.root, 'lesson-word-known');
  expect(mockCalls).not.toContain('clear SCN-ER-00002 words');
  await press(tree.root, 'lesson-word-confused');
  expect(mockCalls).toEqual(['confused SCN-ER-00002 w-1', 'clear SCN-ER-00002 words', 'back']);
});

test('listen reads the headword; repeat opens the pronunciation page on it', async () => {
  const tree = await mount();
  await press(tree.root, 'lesson-word-listen');
  expect(mockSpoken).toEqual(['word0']);
  await press(tree.root, 'lesson-word-repeat');
  const push = mockCalls.find((c) => c.startsWith('push'))!;
  expect(push).toContain('"referenceText":"word0"');
  expect(push).toContain('"origin":"lesson"');
});

// Opted into from the hub: the header must not draw the step the learner is on as skipped.
test('the step track shows this step as the current one even when the level skips it', async () => {
  const tree = await mount();
  expect(byTestID(tree.root, 'steptrack-hatch')).toHaveLength(0);
  // …and the step the server had as next is not drawn current alongside it.
  const labels = tree.root.findAll((n) => String(n.type) === 'Text' && String(n.props.testID ?? '').startsWith('steptrack-label-'));
  const bold = labels.filter((l) => [l.props.style].flat(3).some((s: any) => s?.fontWeight === '700'));
  expect(bold.map((l) => l.props.testID)).toEqual(['steptrack-label-words']);
});

// Pressing one answer must not dim the other: NbButton draws `disabled` at 45%, and a
// request in flight used to disable both — the other button seemed to blink.
test('answering never disables the answer buttons', async () => {
  const tree = await mount();
  await press(tree.root, 'lesson-word-confused');
  for (const id of ['lesson-word-confused', 'lesson-word-known']) {
    const box = tree.root.findAll((n) => n.props?.testID === id)[0];
    expect(box.findAll((n) => n.props?.disabled === true)).toHaveLength(0);
  }
});
