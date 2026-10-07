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
// 스펙 2-9 §11-8 — 감상 칩이 달린 릴(true)과 옛 콘텐츠의 칩 없는 릴(false). 저장 실패도 흉내 낸다.
let mockFeels = false;
let mockFeelFails = false;

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
        { who: 'a', en: 'pain one', ko: '1' }, { who: 'b', en: 'pain two', ko: '2' }],
        ...(mockFeels ? { feels: ['직설적', '환자에게도 씀', '차트용'], why: '누구에게나 쓰는 쉬운 말이에요.' } : {}) },
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
    reelFeel: async (s: string, f: string) => {
      mockCalls.push(`feel ${s} ${f}`);
      if (mockFeelFails) throw new Error('offline');
      return { created: true };
    },
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

describe('감상 하나 — 칩이 달린 릴 (스펙 2-9 §11-8)', () => {
  beforeEach(() => { mockFeels = true; mockFeelFails = false; });
  afterEach(() => { mockFeels = false; mockFeelFails = false; });
  const feelCard = (tree: ReturnType<typeof create>) => byID(tree.root, 'sent-feel-card');
  const nextDimmed = (tree: ReturnType<typeof create>) => byID(tree.root, 'sent-next')[0].props.style?.opacity < 1;

  it('마지막 장면 다음에 감상 카드가 뜨고, 칩을 고르기 전에는 넘어가지 않는다', async () => {
    const tree = await mount();
    await pressID(tree.root, 'sent-reel-card'); // 장면 2
    expect(feelCard(tree)).toHaveLength(0);
    await pressID(tree.root, 'sent-reel-card'); // 감상 카드
    expect(feelCard(tree)).toHaveLength(1);
    for (const f of ['직설적', '환자에게도 씀', '차트용']) expect(texts(tree.root)).toContain(f);
    expect(nextDimmed(tree)).toBe(true);
    await pressID(tree.root, 'sent-next');
    expect(typeLabel(tree)).toBe('워밍업 · 문장 릴');
  });

  it('칩을 고르면 노트에 저장하고 해설을 펼치며, 그다음에 넘어간다', async () => {
    const tree = await mount();
    await pressID(tree.root, 'sent-reel-card');
    await pressID(tree.root, 'sent-reel-card');
    await pressLabel(tree.root, 'sent-feel-', '차트용');
    expect(mockCalls).toContain('feel SCN-ER-00002 차트용');
    expect(texts(tree.root)).toContain('누구에게나 쓰는 쉬운 말이에요.');
    expect(byID(tree.root, 'sent-feel-saved')).toHaveLength(1);
    expect(nextDimmed(tree)).toBe(false);
    await pressID(tree.root, 'sent-next');
    expect(typeLabel(tree)).toBe('듣고 고르기');
  });

  it('감상은 한 번만 고른다 — 다시 눌러도 다시 저장하지 않는다', async () => {
    const tree = await mount();
    await pressID(tree.root, 'sent-reel-card');
    await pressID(tree.root, 'sent-reel-card');
    await pressLabel(tree.root, 'sent-feel-', '차트용');
    await pressLabel(tree.root, 'sent-feel-', '직설적');
    expect(mockCalls.filter((c) => c.startsWith('feel '))).toEqual(['feel SCN-ER-00002 차트용']);
  });

  it('저장이 실패해도 해설은 보이고 넘어갈 수 있다 — 실패는 알린다', async () => {
    mockFeelFails = true;
    const tree = await mount();
    await pressID(tree.root, 'sent-reel-card');
    await pressID(tree.root, 'sent-reel-card');
    await pressLabel(tree.root, 'sent-feel-', '차트용');
    expect(texts(tree.root)).toContain('누구에게나 쓰는 쉬운 말이에요.');
    expect(byID(tree.root, 'sent-feel-failed')).toHaveLength(1);
    expect(byID(tree.root, 'sent-feel-saved')).toHaveLength(0);
    expect(nextDimmed(tree)).toBe(false);
  });
});
