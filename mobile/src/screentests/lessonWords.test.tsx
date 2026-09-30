// STEP 1 단어 — 회상형 단어장 (lesson-four-steps-v44 §11, H'). The front shows the
// meaning; the learner answers, checks, and the explanation opens under it. Words, then
// the STEP 1 nuance cards; the last card records STEP 1 with the words missed.
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
let mockFailSave = false;
const v45 = (id: string, en: string, ko: string, chips: string[][]) => ({
  id, en, ko, ipa: `/${en}/`, icon: 'pill', example: `Say ${en}.`, exKo: '예문', cue: `${ko} 단서`, tag: '분류',
  distractorsEn: [`${en}x`, `${en}y`], distractorsKo: [`${ko}1`, `${ko}2`], chips, decoyChips: ['zz'],
});
function mockLesson() {
  return {
    situation: { id: 'SCN-ER-00002', title: '통증 사정' },
    level: 'A2',
    steps: [
      { kind: 'words', state: 'now', count: 3 }, { kind: 'sentences', state: 'lock', count: 5 },
      { kind: 'guided', state: 'lock', count: 3 }, { kind: 'free', state: 'lock', count: 3 },
    ],
    // Positions 0·1·2 rotate pick → fill → listen.
    words: [
      v45('w-0', 'hypotensive', '저혈압의', [['hypo', 'tens', 'ive']]),
      v45('w-1', 'en route', '이송 중에', [['en'], ['route']]),
      v45('w-2', 'deteriorate', '악화되다', [['de', 'terio', 'rate']]),
    ],
    sentences: [],
    nuance: [
      { kind: 'swap', words: ['w-0'] }, // STEP 2 — not in this deck
      { kind: 'slider', words: ['w-2'], cue: 'bearable', scale: ['discomfort', 'pain', 'agony'], answerAt: 0, why: '견딜 만하면 discomfort' },
      { kind: 'pair', words: ['w-1'], pairs: [['administer', 'medication'], ['titrate', 'the drip']], decoys: ['the patient'], why: '짝' },
    ],
  };
}
jest.mock('@/api/client', () => ({
  api: {
    lesson: async () => mockLesson(),
    confusedWord: async (s: string, w: string) => { mockCalls.push(`confused ${s} ${w}`); return { created: true }; },
    clearLessonStep: async (s: string, k: string, missed?: string[]) => {
      if (mockFailSave) { mockFailSave = false; throw new Error('offline'); }
      mockCalls.push(`clear ${s} ${k} ${JSON.stringify([...(missed ?? [])].sort())}`); return mockLesson();
    },
  },
}));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({
    push: (p: unknown) => { mockCalls.push(`push ${JSON.stringify(p)}`); },
    replace: (p: unknown) => { mockCalls.push(`replace ${String(p)}`); }, back: () => { mockCalls.push('back'); }, canGoBack: () => true,
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
const byID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type !== 'string');
async function press(node: ReactTestInstance) {
  const hit = [node, ...node.findAll(() => true)].find((n) => typeof n.props?.onPress === 'function');
  expect(hit).toBeTruthy();
  await act(async () => { await hit!.props.onPress(); });
}
const pressID = async (root: ReactTestInstance, id: string) => press(byID(root, id)[0]);
/** The option whose label is `label` (options are shuffled, stably). */
async function pick(root: ReactTestInstance, label: string) {
  const opt = root.findAll((n) => typeof n.type !== 'string' && String(n.props?.testID ?? '').startsWith('recall-opt-') && texts(n).includes(label))[0];
  expect(opt).toBeTruthy();
  await press(opt);
}
async function mount() {
  mockCalls.length = 0;
  mockSpoken.length = 0;
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<LessonWords />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

test('the deck is the words, then the STEP 1 nuance cards — STEP 2 kinds stay out', async () => {
  const tree = await mount();
  expect(texts(tree.root)).toContain('1 / 5');
  expect(byID(tree.root, 'recall-segment')).toHaveLength(5);
});

test('a wrong pick opens the explanation with RETRY and counts the word as missed', async () => {
  const tree = await mount();
  expect(texts(byID(tree.root, 'recall-type')[0]).join('')).toContain('영어 고르기');
  expect(texts(tree.root)).toContain('저혈압의');
  await pick(tree.root, 'hypotensivex');
  await pressID(tree.root, 'recall-check');
  expect(byID(tree.root, 'recall-stamp-retry')).toHaveLength(1);
  expect(texts(byID(tree.root, 'recall-reveal')[0])).toContain('hypotensive');
  // After a miss the green button says "now I know", not "I knew it".
  expect(texts(byID(tree.root, 'recall-known')[0])).toContain('이제 알겠어요');
});

test('fill: fragments tapped in order build the word, spaced by the app', async () => {
  const tree = await mount();
  await pick(tree.root, 'hypotensive');
  await pressID(tree.root, 'recall-check');
  await pressID(tree.root, 'recall-known');
  expect(texts(byID(tree.root, 'recall-type')[0]).join('')).toContain('조각 맞추기');
  await pressID(tree.root, 'recall-chip-en');
  await pressID(tree.root, 'recall-chip-route');
  expect(texts(byID(tree.root, 'recall-built')[0])).toContain('en route');
  await pressID(tree.root, 'recall-check');
  expect(byID(tree.root, 'recall-stamp-good')).toHaveLength(1);
});

test('아직 헷갈려요 files the word into the review notes', async () => {
  const tree = await mount();
  await pick(tree.root, 'hypotensive');
  await pressID(tree.root, 'recall-check');
  await pressID(tree.root, 'recall-fuzzy');
  expect(mockCalls).toContain('confused SCN-ER-00002 w-0');
});

async function walkWords(tree: ReturnType<typeof create>) {
  await pick(tree.root, 'hypotensivex'); // wrong → missed
  await pressID(tree.root, 'recall-check');
  await pressID(tree.root, 'recall-known');
  await pressID(tree.root, 'recall-chip-en');
  await pressID(tree.root, 'recall-chip-route');
  await pressID(tree.root, 'recall-check');
  await pressID(tree.root, 'recall-fuzzy'); // right but unsure → missed
  await pressID(tree.root, 'recall-listen');
  await pick(tree.root, '악화되다');
  await pressID(tree.root, 'recall-check');
  await pressID(tree.root, 'recall-known');
}

test('listen plays the word; the nuance cards follow the words', async () => {
  const tree = await mount();
  await walkWords(tree);
  expect(mockSpoken).toContain('deteriorate');
  expect(texts(tree.root)).toContain('이제 뉘앙스를 느껴봐요 — 비슷한 말, 다른 온도');
  expect(texts(byID(tree.root, 'recall-type')[0]).join('')).toContain('뉘앙스 저울');
});

test('the last card records STEP 1 with the missed words and goes on to STEP 2', async () => {
  const tree = await mount();
  await walkWords(tree);
  await pressID(tree.root, 'recall-scale-0');
  await pressID(tree.root, 'recall-check');
  expect(byID(tree.root, 'recall-stamp-good')).toHaveLength(1);
  await pressID(tree.root, 'recall-known');
  // pair: pick a left word, then its partner
  const rightOf = (label: string) => tree.root.findAll((n) => typeof n.type !== 'string' && String(n.props?.testID ?? '').startsWith('recall-right-') && texts(n).includes(label))[0];
  await pressID(tree.root, 'recall-left-0');
  await press(rightOf('medication'));
  await pressID(tree.root, 'recall-left-1');
  await press(rightOf('the drip'));
  await pressID(tree.root, 'recall-check');
  expect(byID(tree.root, 'recall-stamp-good')).toHaveLength(1);
  await pressID(tree.root, 'recall-known');

  expect(byID(tree.root, 'recall-done')).toHaveLength(1);
  expect(texts(byID(tree.root, 'recall-right-count')[0])).toEqual(['4']);
  expect(texts(byID(tree.root, 'recall-wrong-count')[0])).toEqual(['1']);
  expect(texts(tree.root)).toContain('틀린 단어는 STEP 2 문장에 다시 나와요');
  await pressID(tree.root, 'recall-to-step2');
  expect(mockCalls.slice(-2)).toEqual([
    'clear SCN-ER-00002 words ["w-0","w-1"]',
    'replace /scenario/SCN-ER-00002/sentences',
  ]);
});

// Branch review: a failed save must not drop the missed words and move on silently.
test('a failed STEP 1 save stays on the page, says so, and retries', async () => {
  const tree = await mount();
  await walkWords(tree);
  await pressID(tree.root, 'recall-scale-0');
  await pressID(tree.root, 'recall-check');
  await pressID(tree.root, 'recall-known');
  const rightOf = (label: string) => tree.root.findAll((n) => typeof n.type !== 'string' && String(n.props?.testID ?? '').startsWith('recall-right-') && texts(n).includes(label))[0];
  await pressID(tree.root, 'recall-left-0');
  await press(rightOf('medication'));
  await pressID(tree.root, 'recall-left-1');
  await press(rightOf('the drip'));
  await pressID(tree.root, 'recall-check');
  await pressID(tree.root, 'recall-known');
  mockFailSave = true;
  await pressID(tree.root, 'recall-to-step2');
  expect(mockCalls.some((c) => c.startsWith('replace'))).toBe(false);
  expect(byID(tree.root, 'lesson-save-failed')).toHaveLength(1);
  await pressID(tree.root, 'recall-to-step2');
  expect(mockCalls.slice(-2)).toEqual(['clear SCN-ER-00002 words ["w-0","w-1"]', 'replace /scenario/SCN-ER-00002/sentences']);
});
